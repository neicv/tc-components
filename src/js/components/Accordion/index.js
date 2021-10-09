/**
 * Component Accordion
 *
 * @param {object}  items
 * -                title   {String}
 * -                content {text/node}
 * -                id      {number} (не обязательный)
 * -                open    {boolean}
 *
 * - not required options
 * -         TYPE      OPTIONS      DEFAULT  DESCRIPTION
 * @param  {number}    active       false	 Index of the element to open initially.
 * @param  {boolean}   collapsible  true	 Allow all items to be closed.
 * @param  {boolean}   multiple	    true	 Allow multiple open items.
 *
 * @param  {function} onToggleAction(params) - Toggle Action Hook
 *
 * Use: <Accordion items={this.items} active={1} multiple={false} collapsible={false}/>
 *
 */

import m from "mithril";
import classNames from "classnames";
import Component from "../../lib/Component";
import { debounce } from "../../lib/Helpers";
import Chevron from "../Chevron/chevron";
import Content from "./components/content";

const CHEVRON_COLOR_BLUE         = '#0262ae';
const CHEVRON_DIMENSION          = 16;
const DELAY_DURATION             = 200;
const TRANSITION_DURATION        = 200;
const TRANSITION_TIMING_FUNCTION = 'ease';

const CSS_CLASS_OPEN             = 'tc-open';
const CSS_CLASS_ENTER            = 'tc-togglabe-enter';
const CSS_CLASS_LEAVE            = 'tc-togglabe-leave';
const CSS_TRANSITION_ENTER       = 'tc-transition-enter';
const CSS_TRANSITION_LEAVE       = 'tc-transition-leave';

const STATE_ACTIVE               = 'active'
const STATE_ENTER                = 'enter';
const STATE_LEAVE                = 'leave';
const STATE_TRANSITION_ENTER     = 'transition-enter';
const STATE_TRANSITION_LEAVE     = 'transition-leave';

class Accordion extends Component {
    oninit() {
        this.model = [];
        this.options = {
            active      : -1,
            collapsible : '',
            multiple    : ''
        };
        this.currentItem = '';

        this.styleToggglableEnter = {
            'transition-property' : 'overflow, height, padding-top, padding-bottom, margin-top, margin-bottom',
            'overflow': 'hidden'
        }

        this.styleToggglableLeave = {
            overflowAnchor          : 'none',
            height                  : '0px',
            transitionProperty      : 'overflow, height, padding-top, padding-bottom, margin-top, margin-bottom',
            paddingTop              : '0px',
            paddingBottom           : '0px',
            marginTop               : '0px',
            marginBottom            : '0px',
            transitionDuration      : TRANSITION_DURATION + 'ms',
            transitionTimingFunction: TRANSITION_TIMING_FUNCTION,
            overflow: 'hidden'
        }
    }

    oncreate({ dom }) {
        this._accordion = dom;
    }

    view({ children }) {
        this.model = this.generateModel(this.attrs);

        return (
            <section className="accordion__section">
                {
                    this.model.map((item, index) => {
                        const { id, title, content, state } = item;

                        let classesArticle = classNames(
                            "accordion__article",
                            { [CSS_CLASS_OPEN]  : state.isActive },
                            { [CSS_CLASS_ENTER] : state.togglable === STATE_ENTER },
                            { [CSS_CLASS_LEAVE] : state.togglable === STATE_LEAVE }
                        );

                        let classesWarpDiv = classNames(
                            "tc-transition",
                            { [CSS_CLASS_ENTER]      : state.togglable === STATE_ENTER },
                            { [CSS_CLASS_LEAVE]      : state.togglable === STATE_LEAVE },
                            { [CSS_TRANSITION_ENTER] : state.togglable === STATE_TRANSITION_ENTER},
                            { [CSS_TRANSITION_LEAVE] : state.togglable === STATE_TRANSITION_LEAVE}
                        )

                        return (
                            <div className={classesArticle} key={index}>
                                {/* HEADER */}
                                <div
                                    className={`accordion ${state.isActive}`}
                                    aria-expanded={state.isActive ? 'true' : 'false'}
                                    onclick={(e, vnode) => this.toggleAccordion(e, index, vnode)}
                                >
                                    <span className="accordion__title">
                                        {title}
                                    </span>
                                    <Chevron
                                        className={`accordion__icon ${state.rotate}`}
                                        width={CHEVRON_DIMENSION}
                                        fill={`${CHEVRON_COLOR_BLUE}`}
                                    />
                                </div>
                                <Choose>
                                    <When condition={state.togglable !== ''}>
                                        {/* WRAPPER CONTENT */}
                                        <div
                                            className={classesWarpDiv}
                                            style={this.transitionSwitch(state.togglable, index)}
                                            ontransitionend={(event) => this.transitionEndHandler(event, index)}
                                            ontransitionstart={(event) => this.transitionStartHandler(event, index)}
                                            oncreate={() => this.onCreateWarp(state.togglable, index)}
                                        >
                                            <Content
                                                dataIndex={index}
                                                dataContent={content}
                                                dataHidden={state.togglable === STATE_ENTER}
                                            />
                                        </div>
                                    </When>
                                    <When condition={state.togglable === ''}>
                                        {/* CLEAN CONTENT */}
                                        <Content
                                            dataIndex={index}
                                            dataContent={content}
                                            dataHidden={state.hidden}
                                        />
                                    </When>
                                </Choose>
                                { children }
                            </div>
                        )
                    })
                }
            </section>
        )
    }

    toggleAccordion(e, index, vnode) {
        debounce(this.toggleAccordionElement(e, index, vnode), DELAY_DURATION)
    }

    toggleAccordionElement(e, index, vnode) {
        let targ = e.currentTarget;

        if (targ.tagName !== 'DIV' && targ.nextElementSibling) {
            return;
        }

        targ   = targ.nextElementSibling;

        if (targ.classList.contains('accordion__content')) {
            e.preventDefault();
            e.stopPropagation();

            // Transition in progrees ? -> out!
            // but debounce is work
            if (this.isTransitionInProgress()) {
                return;
            }

            this.toggleAccordionOnIndex(index);

            // toggle hook func w target element
            this.toggle(e);
        }
    }

    toggleAccordionOnIndex(index) {
        const {collapsible = true, multiple = true} = this.attrs;

        if (collapsible === false) {
            if (this.model[index].state.isOpen) {
                return;
            }
        }

        this.model[index].state.togglable = this.model[index].state.isOpen ? STATE_LEAVE : STATE_ENTER;

        this.model[index].state.isOpen    = !this.model[index].state.isOpen;
        this.model[index].state.isActive  = this.model[index].state.isOpen ? STATE_ACTIVE : '';
        this.model[index].state.rotate    = this.model[index].state.isOpen ? 'accordion__rotate' : '';

        if (multiple === false || collapsible === false) {
            this.model.forEach((item, loopIndex) => {
                if (loopIndex !== index) {
                    if (this.model[loopIndex].state.isOpen) {
                        this.model[loopIndex].state.togglable = STATE_LEAVE;
                        this.model[loopIndex].state.hidden = true;
                    }
                    this.model[loopIndex].state.isOpen   = false;
                    this.model[loopIndex].state.isActive = '';
                    this.model[loopIndex].state.rotate   = '';
                }
            })
        } else {
            this.model.forEach((item, loopIndex) => {
                if (loopIndex !== index) {
                    this.model[loopIndex].state.isActive = "";
                }
            })
        }

        this.currentItem    = index;
        // this.options.active = index;
        // coomon toggle hook func w no value
        this.onToggleActionHook();
    }

    generateModel(attrs) {
        let { items = [], active = false, collapsible = true, multiple = true, activeLocked = false } = attrs,
            model        = [],
            currentIndex = 0;

        if (this.model.length === 0
            || this.model.length        !== items.length
            || (this.options.active     !== active) && !activeLocked
            || this.options.multiple    !== multiple
            || this.options.collapsible !== collapsible) {

            this.options.active      = active;
            this.options.multiple    = multiple;
            this.options.collapsible = collapsible;

            items.forEach(item => {
                let modelItem = {
                    id      : item.id || currentIndex,
                    title   : item.title || '',
                    content : item.content || '',
                    state   : {
                        isActive  : active === currentIndex ? STATE_ACTIVE : '',
                        isOpen    : item.open || false,
                        togglable : '',
                        rotate    : '',
                        hidden    : ''
                    }
                };

                modelItem.state.isOpen = modelItem.state.isActive === STATE_ACTIVE || modelItem.state.isOpen;
                modelItem.state.rotate = modelItem.state.isOpen ? 'accordion__rotate' : '';
                modelItem.state.hidden = !modelItem.state.isOpen;

                model.push(modelItem);

                currentIndex++;
            });

        } else {
            model = this.model;

            if  ((this.options.active !== active) && activeLocked) {
                this.options.active      = active;
                this.toggleAccordionOnIndex(active);

            } else {
                // Обновление в модели заголовка, контента.
                // model = this.model;
                items.forEach(item => {
                    let modelItem = {
                        id      : item.id || currentIndex,
                        title   : item.title || '',
                        content : item.content || '',
                    };

                    model[currentIndex].id      = modelItem.id;
                    model[currentIndex].title   = modelItem.title;
                    model[currentIndex].content = modelItem.content;
                    currentIndex++;
                })
            }
        }

        return model
    }

    isHasOpen() {
        let result = false;

        this.model.forEach((item) => {
            result = result || item.state.isOpen;
        })

        return result;
    }

    transitionStartHandler(e, index) {
        // Без этой "пустой функции" не стартует одновременная отрисовка закрытия - открытия...
    }

    transitionEndHandler(e, index) {
        if (this.model[index].state.togglable === STATE_TRANSITION_LEAVE) {
            this.model[index].state.hidden = true;
        }

        if (this.model[index].state.togglable === STATE_TRANSITION_ENTER) {
            this.model[index].state.hidden = false;
        }

        this.model[index].state.togglable = '';

        if (this.currentItem === index) {
            this.toggleEndAction();
        }
    }

    transitionSwitch(cls, index) {
        let style = '';

        if (cls === STATE_TRANSITION_ENTER) {
            style = {
                ...this.styleToggglableEnter,
                height                  : `${this.getElementHeight(index)}px`,
                transitionDuration      : `${TRANSITION_DURATION}ms`,
                transitionTimingFunction: TRANSITION_TIMING_FUNCTION
            };

            return style;
        }

        if (cls === STATE_TRANSITION_LEAVE) {
            return this.styleToggglableLeave;
        }

        if (cls === STATE_ENTER) {

            return 'height: 0px';
        }

        if (cls === STATE_LEAVE) {

            return `height: ${this.getElementHeight(index)}px`;
        }

        return false;
    }

    triggerTransition(index, cls) {
        this.model[index].state.togglable = cls;

        setTimeout(() => m.redraw(), 0);
    }

    onCreateWarp(cls, index) {
        if (cls === STATE_ENTER) {
            this.triggerTransition(index, STATE_TRANSITION_ENTER);
        }

        if (cls === STATE_LEAVE) {
            this.triggerTransition(index, STATE_TRANSITION_LEAVE)
        }
    }

    getElementHeight(index) {
        let elments = this._accordion.querySelectorAll(".accordion__content");
        let element = elments[index];

        if (element.hidden) {
            element.hidden = false;
        }
        return element.scrollHeight;
    }

    isTransitionInProgress() {
        let elements = this._accordion.querySelectorAll(".tc-transition");

        if (elements?.length) {

            return true;
        }

        return false;
    }

    onToggleActionHook() {
        if (typeof this.attrs.onToggleAction === "function") {
            this.attrs.onToggleAction();
        }
    }

    toggle(e) {
        if (typeof this.attrs.ontoggle === "function") {
            this.attrs.ontoggle(e.currentTarget);
        }
    }

    toggleEndAction() {
        if (typeof this.attrs.onToggleEndAction === "function") {
            this.attrs.onToggleEndAction();
        }
    }
}

Accordion.Content = Content

export default Accordion;
