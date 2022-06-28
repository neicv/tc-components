import m from "mithril";
import classNames from "classnames";
import Component from "@/lib/Component";
import getCaretCoordinates from "@/lib/textarea-caret";
import {setHighLightVnode, setHighLight} from "@/lib/highLight";
import { debounce } from "@/lib/Helpers";

const ESCAPE = 27;
const UP     = 38;
const DOWN   = 40;
const LEFT   = 37;
const RIGHT  = 39;
const ENTER  = 13;
const TAB    = 9;
const LEFT_SQUARE_BRACKET = 219;

const ALL_SPACES_CHAR   = [' ', '\a', '\n', '\t', '\x0A']
const QUESTIONARE_TRIGGER_RIGHT_CHAR = ['[']
const QUESTIONARE_TRIGGER_LEFT_CHAR  = [']']

const POSITION_CONFIGURATION = {
    X: {
      LEFT: "tc_autocomplete--left",
      RIGHT: "tc_autocomplete--right",
    },
    Y: {
      TOP: "tc_autocomplete--top",
      BOTTOM: "tc_autocomplete--bottom",
    },
};

const DEFAULT_WIDTH    = 200;
const MODE_QUESTIONARE = 'questionare';

const defaultConfig = {
    template      : (data, fieldView) => (<span>{data[fieldView]}</span>),
    countShowItem : 5,
    isTriggerOnly : false,
    triggers      : [],
    mode          : MODE_QUESTIONARE,
    // fieldView    : 'text'
};

class AutoCompleteTextarea extends Component {
    oninit() {
        const { options, value, name } = this.attrs;
        //
        this.textSuggestionState      = false;
        this.scrollVisible            = false;
        this.textSuggestionWidth      = 0;
        this.referralSearch           = [];
        this.inputVal                 = value;
        this.value                    = value;
        this.selectedIndex            = -1;
        this.referralSearchSelectedId = 0;
        this.inputValTemp             = '';
        this.inputValIdTemp           = 0;
        this.textareaRef              = null;
        this.dropDownRef              = null;
        this.dropDownMainRef          = null;
        this.ulScrollContentRef       = null;
        this.isHideCursor             = false;
        this.searchText               = '';
        this.positionAutocomplete     = {
            top: 0,
            left: 0
        }

        this._config = { ...defaultConfig, ...this.attrs };

        this._config.data           = this._config.data ? this._config.data : [];
        this._config.fieldsSearch   = this._config.fieldsSearch ? this._config.fieldsSearch : [];

        this._config.unitedTriggers = this._config.isTriggerOnly
            ? this._config.triggers
            : [...ALL_SPACES_CHAR, ...this._config.triggers];

        if (this._config.mode === MODE_QUESTIONARE) {
            this._config.unitedTriggers = [
                ...QUESTIONARE_TRIGGER_RIGHT_CHAR,
                ...QUESTIONARE_TRIGGER_LEFT_CHAR,
                ...this._config.unitedTriggers
            ];
        }

        this._heightConfig = { maxHeight: 0 };
    }

    onbeforeupdate() {
        //
    }

    oncreate({ dom }) {
        const { boundariesElement = 'body' } = this.attrs;

        if (typeof boundariesElement === "string") {
          const elem = document.querySelector(boundariesElement);
          if (!elem) {
            throw new Error(
              "Invalid prop boundariesElement: it has to be string or HTMLElement."
            );
          }
          this.containerElem = elem;
        } else if (boundariesElement instanceof HTMLElement) {
          this.containerElem = boundariesElement;
        } else {
          throw new Error(
            "Invalid prop boundariesElement: it has to be string or HTMLElement."
          );
        }

        if (!this.containerElem || !this.containerElem.contains(dom)) {
          if (process.env.NODE_ENV !== "test") {
            throw new Error(
              "Invalid prop boundariesElement: it has to be one of the parents of the RTA."
            );
          }
        }

        window.addEventListener("resize", this._resizeAction);
    }

    onremove() {
        window.removeEventListener("resize", this._resizeAction);
    }

    _onUpdate() {
        // const top = this.attrs.top || 0;
        // const left = this.attrs.left || 0;
        if (this.dropDownRef && this.textareaRef /*&& this.textSuggestionState*/) {
            // this.textSuggestionWidth = this.dropDownRef?.clientWidth || DEFAULT_WIDTH;
            console.log('_onUpdate')
            let top               = this.positionAutocomplete.top || 0,
                left              = this.positionAutocomplete.left || 0,
                topPosition       = 0,
                leftPosition      = 0;

            const usedClasses     = [];
            const unusedClasses   = [];

            const containerBounds = this.containerElem.getBoundingClientRect(),
                  dropdownBounds  = this.dropDownRef.getBoundingClientRect(),
                  textareaBounds  = this.textareaRef.getBoundingClientRect(),
                  computedStyle   = window.getComputedStyle(this.dropDownRef);

            const marginTop = parseInt(
            computedStyle.getPropertyValue("margin-top"),
            10
            );
            const marginBottom = parseInt(
            computedStyle.getPropertyValue("margin-bottom"),
            10
            );
            const marginLeft = parseInt(
            computedStyle.getPropertyValue("margin-left"),
            10
            );
            const marginRight = parseInt(
            computedStyle.getPropertyValue("margin-right"),
            10
            );

            const dropdownBottom =
            marginTop +
            marginBottom +
            textareaBounds.top +
            top +
            dropdownBounds.height;
            const dropdownRight =
            marginLeft +
            marginRight +
            textareaBounds.left +
            left +
            dropdownBounds.width || DEFAULT_WIDTH;

            // this.textSuggestionWidth = dropdownBounds.width || DEFAULT_WIDTH;
            console.log('width ', dropdownBounds.width )

            if (dropdownRight > containerBounds.right &&
                textareaBounds.left + left > dropdownBounds.width) {
                leftPosition = left - (dropdownRight - containerBounds.right); //dropdownBounds.width;
                usedClasses.push(POSITION_CONFIGURATION.X.LEFT);
                unusedClasses.push(POSITION_CONFIGURATION.X.RIGHT);
                console.log('left')
            } else {
                leftPosition = left;
                usedClasses.push(POSITION_CONFIGURATION.X.RIGHT);
                unusedClasses.push(POSITION_CONFIGURATION.X.LEFT);
            }

            if (dropdownBottom > containerBounds.bottom &&
            textareaBounds.top + top > dropdownBounds.height) {
                topPosition = top - dropdownBounds.height;
                usedClasses.push(POSITION_CONFIGURATION.Y.TOP);
                unusedClasses.push(POSITION_CONFIGURATION.Y.BOTTOM);
            } else {
                topPosition = top;
                usedClasses.push(POSITION_CONFIGURATION.Y.BOTTOM);
                unusedClasses.push(POSITION_CONFIGURATION.Y.TOP);
            }

            if (this.attrs?.renderToBody) {
                topPosition  += textareaBounds.top;
                leftPosition += textareaBounds.left;
            }

            this.dropDownMainRef.style.top        = `${topPosition}px`;
            this.dropDownMainRef.style.left       = `${leftPosition}px`;
            this.dropDownMainRef.style.visibility = "visible";

            this.dropDownMainRef.classList.remove(...unusedClasses);
            this.dropDownMainRef.classList.add(...usedClasses);

            // setTimeout(() => m.redraw(), 0);
        }

    }

    view() {
        const { options, value, name } = this.attrs;
        // let referralStyle = "white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
        const referralStyle =`min-width : ${this.textSuggestionWidth - 40 || DEFAULT_WIDTH}px;`

        const textAreaStyle = `width: 100%;height: 100%;margin-bottom: 0px; ${this.isHideCursor ? 'caret-color: transparent;' : ''}`

        // const autocompleteStyle = `top: ${this.positionAutocomplete.top}; left: ${this.positionAutocomplete.left}; width: ${this.textSuggestionWidth}px';`
        const autocompleteStyle = `min-width: ${this.textSuggestionWidth || DEFAULT_WIDTH}px;`

        if (this.isHideCursor) {
            console.log('hide')
        }

        return (
            <div id='tc-autocomplete-textarea' class='tc-autocomplete-textarea'>
                <textarea
                    ref="textSuggestionRef"
                    oncreate={({ dom }) => (this.textareaRef = dom)}
                    // type="text"
                    value={this.inputVal}
                    // onclick={(e) => this._toggle(e)}
                    // onchange={(e) => this._onChange2(e)}
                    oninput={(e) => this._onChange(e)}
                    onkeydown={(e) => this._onKeyDown(e)}
                    onkeypress={(e) => this._onKeyPress(e)}
                    onkeyup={(e) => this._onKeyUp(e)}
                    onblur={() => this._onBlur()}
                    name={name}
                    style={textAreaStyle}
                ></textarea>

                <div
                    id="content"
                    ref="content"
                    oncreate={({ dom }) => (this.dropDownMainRef = dom)}
                    class="tc_autocomplete"
                >
                    <If condition={this.textSuggestionState === true}>
                        <div
                            style={autocompleteStyle}
                            class="textarea-suggestion"
                            id="scrollContent1"
                            oncreate={({ dom }) => {
                                this.dropDownRef = dom;
                                console.log('oup')
                                this.textSuggestionWidth = dom.getBoundingClientRect().width || DEFAULT_WIDTH
                            }}
                            // onupdate={({ dom }) => (this.textSuggestionWidth = dom.getBoundingClientRect().width || DEFAULT_WIDTH)}
                            // beforeupdate={() => setTimeout(() => {
                            //     this._onUpdate()
                            // }, 20)}
                        >
                            <ul
                                style="list-style:none;margin : 0;padding: 0;"
                                class="scrollContent"
                                id="ulScrollContent"
                                oncreate={({ dom }) => (this.ulScrollContentRef = dom)}
                            >
                                {
                                    this.referralSearch.map((refSearch, index) => {
                                        return (
                                            <li

                                                onclick={() => this.setReferralTest(refSearch.text, refSearch.id)}
                                                onkeydown={(e) => this._onKeyDownItem(e, refSearch.text)}
                                                // style={referralStyle}
                                                className={`referral ${this.inputValIdTemp === refSearch.id ? 'selectedWithArrow' : ''}`}
                                            >
                                                {/* {this.setHighLight(refSearch.text)} */}
                                                {this._renderItem(refSearch, index)}
                                            </li>
                                        )
                                        // @click.self="setReferralTest(refSearch)"
                                    })
                                }

                            </ul>
                        </div>
                    </If>
                </div>
            </div>
        )
    }

    _onKeyUp(e){
        let itemText    = '';
        const keyCode   = e.keyCode || e.which;
        const query     = this.getQuery(e.target.value); //this.value;
        this.searchText = query;
        this.inputVal   = e.target.value;
        const textarea  = e.currentTarget && e.currentTarget.nodeName === 'TEXTAREA' ? e.currentTarget : null;

        switch (keyCode) {
            case LEFT_SQUARE_BRACKET:
                if (this._config.mode === MODE_QUESTIONARE) {
                    const caretPosition = this.getCaretPosition();
                    this.inputVal = this.inputVal.slice(0, caretPosition )
                        + QUESTIONARE_TRIGGER_LEFT_CHAR[0]
                        + this.inputVal.slice(caretPosition);

                    if (caretPosition) {
                        setTimeout(() => this.setCaretPosition(caretPosition), 16);
                    }
                }
                break;

            case ESCAPE:
                e.preventDefault();
                e.stopPropagation();

                this._close();
                break;

            case DOWN:
                if (!this.textSuggestionState) {
                    break;
                }
                // console.log('dw')
                e.preventDefault();
                e.stopPropagation();
                this.inputValTemp = '';

                if(this.selectedIndex < this.referralSearch.length-1) {
                    this.selectedIndex += 1;
                } else {
                    this.selectedIndex = 0;
                }
                this.inputValTemp = this.referralSearch[this.selectedIndex].text;
                this.inputValIdTemp = this.referralSearch[this.selectedIndex].id;
                this.setScroll();
                break;

            case UP:
                if (!this.textSuggestionState) {
                    break;
                }

                // console.log('up')
                e.preventDefault();
                e.stopPropagation();
                this.inputValTemp = '';
                if( this.selectedIndex < this.referralSearch.length)
                    if(this.selectedIndex > 0)
                        this.selectedIndex -= 1;
                    else
                        this.selectedIndex = 0;
                //console.log(this.selectedIndex);
                this.inputValTemp = this.referralSearch[this.selectedIndex].text;
                this.inputValIdTemp = this.referralSearch[this.selectedIndex].id;
                this.setScroll();
                break;

            case ENTER:
            case TAB:
                if (!this.textSuggestionState) {
                    break;
                }

                e.preventDefault();
                e.stopPropagation();
                // console.log('enter')
                if (this.selectedIndex !== -1) {
                    this.setReferralTest(this.inputValTemp, this.inputValIdTemp);
                }

                // this.selectedIndex = -1;
                // this.inputValIdTemp  = 0;
                break;

            default:
                // $("#scrollContent1").scrollTop(0);
                this.inputVal      = e.target.value;
                let scrollContent1 = document.getElementById(".scrollContent1");
                if (scrollContent1) {
                    scrollContent1.scrollTop = 0;
                }
                this.selectedIndex = -1;
                // this.textSuggestionWidth = textarea.clientWidth;

                var state = false;
                if(query == '') {
                    this.referralSearch = [];
                    this.scrollVisible = false;
                }
                else{
                    this.referralSearch = [];
                    this._config.data.forEach(item => {
                        itemText = this._config.mode === MODE_QUESTIONARE
                            ? item.text + '{' + item.id + '}'
                            : item.text;
                        if (itemText.includes(query)) {
                            state = true;
                            if(state) {
                                this.referralSearch.push({
                                    id   : item.id,
                                    text : item.text
                                });
                                this.scrollVisible = true;
                            }
                            else this.selectedIndex = -1;
                        }
                        else{
                            this.scrollVisible = false;
                        }
                    });
                }
                if(this.inputVal == '' || this.inputVal == null || this.referralSearch.length == 0) {
                    this._close();
                } else {
                    if (this.selectedIndex === -1) {
                        this.selectedIndex  = 0;
                        this.inputValTemp   = this.referralSearch[this.selectedIndex].text;
                        this.inputValIdTemp = this.referralSearch[this.selectedIndex].id;
                    }

                    this.dropDownMainRef.style.visibility = "hidden";
                    this.textSuggestionState = true;

                    this._updateDropDown(e);
                    // setTimeout(() => m.redraw(), 0);
                }
                break;
        }
    }

    setScroll() {
        const selected       = this.selectedIndex;
        const elHeight       = this.ulScrollContentRef?.clientHeight;
        const scrollContent1 = document.getElementById("scrollContent1");
        const scrollTop      = scrollContent1.scrollTop;
        const viewport       = scrollTop + scrollContent1.clientHeight;
        const elOffset       = elHeight * selected;

        if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
            scrollContent1.scrollTop = elOffset;
        }
    }

    setReferralTest(text, id) {
        let modifiedText = '';

        const insertText = this._config.mode === MODE_QUESTIONARE
            ? text + '{' + id + '}'
            : text;

        const caretPosition        = this.getCaretPosition();
        const textToModify         = this.inputVal;
        const startOfTokenPosition = this.getStartOfTokenPosition(textToModify, caretPosition);
        const endOfTokenPosition   = this.getEndOfTokenPosition(textToModify, caretPosition);
        const cursorPosition       = startOfTokenPosition + insertText.length;
        if (startOfTokenPosition) {
            modifiedText = textToModify.slice(0, startOfTokenPosition ) + insertText + textToModify.slice(endOfTokenPosition);
        } else {
            modifiedText = insertText;
        }


        // setTimeout(() => {
        //     this.textareaRef.focus();
        //     this.isHideCursor = true;
        //     m.redraw()}
        // , 0);

        this.inputVal = modifiedText;

        if (cursorPosition) {
            // console.log('end', endOfTokenPosition);
            // setTimeout(() => m.redraw(), 0);
            setTimeout(() => {
                // m.redraw();

                this.setCaretPosition(this._config.mode === MODE_QUESTIONARE ? cursorPosition + 1 : cursorPosition );
            }, 16);
        }

        this._close();

        // setTimeout(() => {
        //     this.textareaRef.focus();
        //     this.isHideCursor = false;
        //     m.redraw()}
        // , 0);
    }

    textSuggestionControl() {
        setTimeout(() => {this._close()}, 300)
    }

    setCaretPosition(position = 0) {
        if (!this.textareaRef) return;
        // console.log('set ')
        this.textareaRef.focus();
        this.textareaRef.setSelectionRange(position, position);
    };

    getCaretPosition = () => {
        if (!this.textareaRef) {
            return 0;
        }

        const position = this.textareaRef.selectionEnd;

        return position;
    };

    _onChange(e) {
        // console.log('change')
        this.inputVal = e.target.value;
    }

    _updateDropDown(e) {
        const textarea = e.target || this.textareaRef;
        const { selectionEnd } = textarea;

        const { top: newTop, left: newLeft } = getCaretCoordinates(
            textarea,
            selectionEnd - 1
        );

        let top  = newTop + 8 - this.textareaRef.scrollTop || 0;
        let left = newLeft + 12;
        // console.log('cp: ', newTop, newLeft)

        this.positionAutocomplete = { top, left }

        setTimeout(() => this._onUpdate(), 0);
    }

    _onChange2(e) {
        console.log('change')
        // this.inputVal = e.target.value;
    }

    _onKeyPress(e) {
        const keyCode  = e.keyCode || e.which;

        if ((keyCode === ENTER || keyCode === TAB) && this.inputValIdTemp !== 0) {
            e.preventDefault();
            e.stopPropagation();
            // console.log('break enter')
        }
    }

    _onKeyDown(e) {
        const keyCode  = e.keyCode || e.which;

        if ((keyCode === UP || keyCode === DOWN) && this.textSuggestionState) {
            e.preventDefault();
            e.stopPropagation();

            // console.log('up-dw')
        }

        if ((keyCode === ENTER || keyCode ===TAB) && this.textSuggestionState) {
            e.preventDefault();
            e.stopPropagation();

            // console.log('enter dw')
        }
    }

    getStartOfTokenPosition(text = '', position = 0) {
        let res = 0;

        if (position) {
            const str   = text.slice(0, position);
            const index = this.getNearestIndexRight(str);
            if (index !== -1) {
                res = index + 1;
            }
        }

        return res;
    }

    getEndOfTokenPosition(text = '', position = 0) {
        let res = text.length;

        if (position) {
            const str   = text.slice(position);
            const index = this.getNearestIndexLeft(str);
            if (index !== -1) {
                res = position + index;
            }
        }

        return res;
    }

    getQuery(value = '') {
        let res = value;
        const caretPosition = this.getCaretPosition();

        if (caretPosition) {
            value = value.slice(0, caretPosition);
        }

        if (value) {
            // const index = value.lastIndexOf(' ');
            const index = this.getNearestIndexRight(value, true);
            if (index !== -1) {
                res = value.slice(index + 1);
            } else if (this._config.mode === MODE_QUESTIONARE) {
                res = '';
            }
        }
        return res;
    }

    _onBlur() {
        const onChange = this.attrs.onChange;
        console.log('blur')

        if (typeof onChange === "function") {
            onChange(this.inputVal);
        }
        // close
        this.textSuggestionControl();
    }

    _resizeAction = (e) => {
        this.textSuggestionControl();
    }

    _close() {
        // this.selectedIndex       = -1;
        this.inputValIdTemp      = 0;
        this.searchText          = '';
        this.textSuggestionState = false;
        console.log('close')
        setTimeout(() => m.redraw(), 0)
    }

    stringToRegExp(str) {
        // escapeStringRegExp
        let matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g,
            text = '';

        text = new RegExp(str.replace(matchOperatorsRe, '\\$&'), 'i')
        return [text];
    }

    setHighLight(text) {
        return setHighLightVnode(text, this.stringToRegExp(this.searchText));
    }

    getNearestIndexLeft(str) {
        let indexArr = [],
            i;

        if (this._config.mode === MODE_QUESTIONARE) {
            i = str.indexOf(QUESTIONARE_TRIGGER_LEFT_CHAR);
            if (i > -1) {
                return i;
            }
        }

        this._config.unitedTriggers.forEach(c => {
            i = str.indexOf(c);
            if (i > -1) {
                indexArr.push(i);
            }
        });

        if (indexArr.length) {
            indexArr.sort((a, b) => a - b);
            return indexArr[0];
        }

        return -1;
    }

    getNearestIndexRight(str, isGetQuery = false) {
        let indexArr = [];

        const chars = this._config.mode === MODE_QUESTIONARE && isGetQuery
            // срабатывает толька на запросе
            ? QUESTIONARE_TRIGGER_RIGHT_CHAR
            : this._config.unitedTriggers;

        chars.forEach(c => {
            let i = str.lastIndexOf(c);
            if (i > -1) {
                indexArr.push(i);
            }
        });

        if (indexArr.length) {
            indexArr.sort((a, b) => b - a);
            return indexArr[0];
        }

        return -1;
    }

    _renderItem(item, index, array) {
        return (
            <div
                // oncreate={({ dom }) => this._onCreateItem(dom, isCurrent)}
                // onupdate={({ dom }) => this._onUpdateItem(dom, isSelected, isLast)}
            >
                {this._getTemplateItem(item, index)}
            </div>
        );
    }

    _getTemplateItem(item, index) {
        const template     = this._config.template,
              fieldView    = this._config.fieldView,
              fieldsSearch = [...this._config.fieldsSearch];

        let data;

        if (item && typeof item === "object") {
            data = { ...item };
        } else {
            data = { value: item };
            fieldsSearch.push("value");
        }

        this._setHighLightFields(data, fieldsSearch);

        return template(data, fieldView || "value");
    }

    // fields - Массив елючей по котрым подсветка и поиск
    _setHighLightFields(item, fields = []) {
        if (this.searchText) {
            fields.forEach(field => {
                if (item.hasOwnProperty(field)) {
                    item[field] =  this.setHighLight(item[field]);
                }
            });
        }
    }

}

export default AutoCompleteTextarea;
