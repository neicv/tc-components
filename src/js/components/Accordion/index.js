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
import "mithril";
import classNames from "classnames";
import Component from "../../lib/Component";
import { debounce } from "../../lib/Helpers";
import Chevron from "../Chevron/chevron";
import Content from "./components/content";

const CHEVRON_COLOR_BLUE         = '#0262ae';
const CHEVRON_DIMENSION          = 16;
const DELAY_DURATION             = 50;
const TRANSITION_DURATION        = 200;
const TRANSITION_TIMING_FUNCTION = 'ease';

const CSS_CLASS_OPEN             = 'tc-open';
const CSS_CLASS_ENTER            = 'tc-togglabe-enter';
const CSS_CLASS_LEAVE            = 'tc-togglabe-leave';

const STATE_ACTIVE               = 'active'
const STATE_ENTER                = 'enter';
const STATE_LEAVE                = 'leave';
const STATE_TRANSITION_ENTER     = 'transition-enter';
const STATE_TRANSITION_LEAVE     = 'transition-leave';

class Accordion extends Component {
    oninit() {
        this.model = [];
        this.options = {};

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
                                            className='tc-transition'
                                            style={this.transitionSwitch(state.togglable, index)}
                                            ontransitionend={(event) => this.transitionEndHandler(event.currentTarget, index)}
                                            ontransitionstart={(event) => this.transitionStartHandler(event.currentTarget, index)}
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
            e.preventDefault();
            e.stopPropagation();
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

            this.onToggleActionHook();
        }
    }

    generateModel(attrs) {
        let { items = [], active = false, collapsible, multiple} = attrs,
            model        = [],
            currentIndex = 0;

        if (this.model.length === 0 
            || this.model.length !== items.length 
            || this.options.collapsible !== collapsible
            || this.options.multiple !== multiple) {

            this.options.collapsible = collapsible;
            this.options.multiple    = multiple;

            items  = items ? items : [];
            active = active ? +active : -1;

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
            // Обновление в модели заголовка, контента.
            model = this.model;

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

        return model
    }

    isHasOpen() {
        let result = false;

        this.model.forEach((item) => {
            result = result || item.state.isOpen;
        })

        return result;
    }

    transitionEndHandler(element, index) {
        if (this.model[index].state.togglable === STATE_TRANSITION_LEAVE) {
            this.model[index].state.hidden = true;
        }

        if (this.model[index].state.togglable === STATE_TRANSITION_ENTER) {
            this.model[index].state.hidden = false;
        }
        
        this.model[index].state.togglable = '';
    }

    transitionStartHandler(el, index) {
        // Без этой "пустой функции" не стартует одновременная отрисовка закрытия - открытия...
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
            setTimeout(() => this.triggerTransition(index, STATE_TRANSITION_ENTER), DELAY_DURATION);

            return 'height: 0px';
        }

        if (cls === STATE_LEAVE) {
            setTimeout(() => this.triggerTransition(index, STATE_TRANSITION_LEAVE), DELAY_DURATION);

            return `height: ${this.getElementHeight(index)}px`;
        }

        return false;
    }

    triggerTransition(index, cls) {
        this.model[index].state.togglable = cls;

        m.redraw()
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
}

Accordion.Content = Content

export default Accordion;