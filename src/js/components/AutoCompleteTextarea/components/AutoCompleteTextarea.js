import m from "mithril";
import classNames from "classnames";
import Component from "@/lib/Component";
import getCaretCoordinates from "@/lib/textarea-caret";
import {setHighLightVnode, setHighLight} from "@/lib/highLight";
import {Container} from '@/components/plugins/ScrollBar';
import scrollIntoView from "scroll-into-view-if-needed";

const ESCAPE              = 27;
const UP                  = 38;
const DOWN                = 40;
const ENTER               = 13;
const TAB                 = 9;
const LEFT_SQUARE_BRACKET = 219;

const DEFAULT_WIDTH       = 200;
const DEFAULT_MARGIN      = 10;
const DEFAULT_OFFSET_TOP  = 8;
const DEFAULT_OFFSET_LEFT = 12;
const MODE_QUESTIONARE    = 'questionare';

const ALL_SPACES_CHAR                = [' ', '\r', '\n', '\t']
const QUESTIONARE_TRIGGER_RIGHT_CHAR = ['[']
const QUESTIONARE_TRIGGER_LEFT_CHAR  = [']']

const POSITION_CONFIGURATION = {
    X: {
      LEFT: "tc-autocomplete--left",
      RIGHT: "tc-autocomplete--right",
    },
    Y: {
      TOP: "tc-autocomplete--top",
      BOTTOM: "tc-autocomplete--bottom",
    },
};

const defaultConfig = {
    template      : (data, fieldView) => (<span>{data[fieldView]}</span>),
    countShowItem : 5,
    isTriggerOnly : false,
    triggers      : [],
    mode          : MODE_QUESTIONARE,
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
        this.firstRender              = true;
        this.isFirstCharAccepted      = true;
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
              "Invalid prop boundariesElement: it has to be one of the parents."
            );
          }
        }

        window.addEventListener("resize", this._resizeAction);
    }

    onremove() {
        window.removeEventListener("resize", this._resizeAction);
    }

    _onUpdate() {
        if (this.dropDownRef && this.textareaRef) {
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

            const marginTop    = parseInt(computedStyle.getPropertyValue("margin-top"), DEFAULT_MARGIN);
            const marginBottom = parseInt(computedStyle.getPropertyValue("margin-bottom"), DEFAULT_MARGIN);
            const marginLeft   = parseInt(computedStyle.getPropertyValue("margin-left"), DEFAULT_MARGIN);
            const marginRight  = parseInt(computedStyle.getPropertyValue("margin-right"), DEFAULT_MARGIN);

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

            if (dropdownRight > containerBounds.right &&
                textareaBounds.left + left > dropdownBounds.width) {
                leftPosition = left - (dropdownRight - containerBounds.right);
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
                topPosition = top + DEFAULT_OFFSET_TOP;
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

    setScroll() {
        const selected       = this.selectedIndex;
        const elHeight       = this.ulScrollContentRef?.clientHeight;
        const scrollContent  = document.getElementById("tc-autocomplete-content");
        const scrollTop      = scrollContent.scrollTop;
        const viewport       = scrollTop + scrollContent.clientHeight;
        const elOffset       = elHeight * selected;

        if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
            scrollContent.scrollTop = elOffset;
        }
    }

    view() {
        const { options, name } = this.attrs;

        const textAreaClass = `tc-autocomplete-textarea ${this.isHideCursor ? 'caret-color: transparent;' : ''}`

        const autocompleteStyle = `min-width: ${this.textSuggestionWidth
            || DEFAULT_WIDTH}px;max-height: ${this._heightConfig.heightContainer}px;`


        return (
            <div id='tc-autocomplete-textarea' className={textAreaClass}>
                <textarea
                    oncreate={({ dom }) => (this.textareaRef = dom)}
                    value={this.inputVal}
                    oninput={(e) => this._onChange(e)}
                    onkeydown={(e) => this._onKeyDown(e)}
                    onkeypress={(e) => this._onKeyPress(e)}
                    onkeyup={(e) => this._onKeyUp(e)}
                    onblur={() => this._onBlur()}
                    name={name}
                ></textarea>

                <div
                    id="tc-autocomplete-content"
                    oncreate={({ dom }) => (this.dropDownMainRef = dom)}
                    className="textarea-suggestion"
                >
                    <If condition={this.textSuggestionState === true}>
                        <Container
                            style={autocompleteStyle}
                            className="tc-drop-down-container"
                            id="tc-autocomplete-scroll-content"
                            oncreate={({ dom }) => {
                                this.dropDownRef = dom;
                                this._onCreateScrollContainer(dom)
                                this.textSuggestionWidth = dom.getBoundingClientRect().width || DEFAULT_WIDTH
                            }}
                        >
                            <ul
                                className="tc-autocomplete-scroll-content"
                                id="tc-autocomplete-ul-scroll-content"
                                oncreate={({ dom }) => (this.ulScrollContentRef = dom)}
                            >
                                {
                                    this.referralSearch.map((refSearch, index) => {
                                        const isLast = (this.referralSearch.length - 1) === index;
                                        const classItem = `tc-autocomplete-referral ${this.inputValIdTemp === refSearch.id
                                            ? 'tc-autocomplete-selected'
                                            : ''
                                        }`
                                        return (
                                            <li

                                                onclick={() => this.setReferralTest(refSearch.text, refSearch.id)}
                                                className={classItem}
                                            >
                                                {this._renderItem(refSearch, index, isLast)}
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Container>
                    </If>
                </div>
            </div>
        )
    }

    _onCreateScrollContainer(dom) {
        dom.addEventListener("wheel", () => {
            let lastItem = dom.querySelector(".tc-drop-down-item.last-item");

            // this._reLoadingData(lastItem, dom)
        });
    }

    _onCreateItem(element, isCurrent) {
        let scrollContainer = element.closest(".tc-drop-down-container");

        this._calcHeightContainer(element);

        if (isCurrent) {
            scrollIntoView(element, { scrollMode: 'if-needed', boundary: scrollContainer });

            scrollContainer.dispatchEvent(new CustomEvent("updatescroll"));
        }
    }

    _onUpdateItem(element, isSelected, isLast) {
        let scrollContainer = element.closest(".tc-drop-down-container");

        if (isSelected) {
            scrollIntoView(element, {
                block     : "nearest",
                scrollMode: "if-needed",
                boundary  : scrollContainer
            });

            scrollContainer.dispatchEvent(new CustomEvent("updatescroll"));
        }

        if (isLast) {
            // this._reLoadingData(element, scrollContainer);
            if (this.firstRender) {
                this.firstRender = false;
                this._onUpdate();
            }
        }
    }

    _calcHeightContainer(itemEl) {
        let boxItemEl    = itemEl.getBoundingClientRect(),
            heightItemEl = boxItemEl.height;

        if (this._heightConfig.maxHeight < heightItemEl) {
            this._heightConfig.maxHeight       = heightItemEl;
            this._heightConfig.heightContainer = this._heightConfig.maxHeight * this._config.countShowItem;

            setTimeout(() => m.redraw(), 0);
        }
    }

    _onKeyUp(e){
        let itemText    = '';

        const query     = this.getQuery(e.target.value);
        const keyCode   = e.keyCode || e.which;
        const keyChar   = e.key;
        this.inputVal   = e.target.value;
        this.searchText = query;

        switch (keyCode) {
            case LEFT_SQUARE_BRACKET:
                if (this._config.mode === MODE_QUESTIONARE
                           && keyChar === QUESTIONARE_TRIGGER_RIGHT_CHAR[0]) {
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
            case UP:
                break;

            case ENTER:
            case TAB:
                if (!this.textSuggestionState) {
                    break;
                }

                e.preventDefault();
                e.stopPropagation();

                if (this.selectedIndex !== -1) {
                    this.setReferralTest(this.inputValTemp, this.inputValIdTemp);
                }
                break;

            default:
                this.inputVal      = e.target.value;
                this.selectedIndex = -1;

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
                if (this.inputVal == '' || this.inputVal == null || this.referralSearch.length == 0) {
                    this._close();
                } else {
                    if (this.selectedIndex  === -1) {
                        this.selectedIndex  = 0;
                        this.inputValTemp   = this.referralSearch[this.selectedIndex].text;
                        this.inputValIdTemp = this.referralSearch[this.selectedIndex].id;
                    }

                    if (this.isFirstCharAccepted) {
                        this.dropDownMainRef.style.visibility = "hidden";
                        this.isFirstCharAccepted = false;
                    }

                    this.textSuggestionState = true;
                    this._updateDropDown(e);
                    // setTimeout(() => m.redraw(), 0);
                }
                break;
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

        this.inputVal = modifiedText;

        if (cursorPosition) {
            setTimeout(() => {
                this.setCaretPosition(this._config.mode === MODE_QUESTIONARE ? cursorPosition + 1 : cursorPosition );
            }, 0);
        }

        this._close();
    }

    textSuggestionControl() {
        setTimeout(() => this._close(), 300)
    }

    setCaretPosition(position = 0) {
        if (!this.textareaRef) {
            return;
        }

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
        this.inputVal = e.target.value;
    }

    _updateDropDown(e) {
        const textarea = e.target || this.textareaRef;
        const { selectionEnd } = textarea;

        const { top: newTop, left: newLeft } = getCaretCoordinates(
            textarea,
            selectionEnd - 1
        );

        let top  = newTop - this.textareaRef.scrollTop || 0;
        let left = newLeft + DEFAULT_OFFSET_LEFT;

        this.positionAutocomplete = { top, left }
        // delay not 0 - for grab real heght container
        setTimeout(() => this._onUpdate(), 16);
    }

    _onKeyPress(e) {
        const keyCode  = e.keyCode || e.which;

        if ((keyCode === ENTER || keyCode === TAB) && this.inputValIdTemp !== 0) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    _onKeyDown(e) {
        const keyCode  = e.keyCode || e.which;

        if (this.textSuggestionState === false ) {
            return;
        }

        if (keyCode === UP || keyCode === DOWN) {
            e.preventDefault();
            e.stopPropagation();

            switch (keyCode) {
            case DOWN:
                this.inputValTemp = '';

                if(this.selectedIndex < this.referralSearch.length-1) {
                    this.selectedIndex += 1;
                } else {
                    this.selectedIndex = 0;
                }
                this.inputValTemp   = this.referralSearch[this.selectedIndex].text;
                this.inputValIdTemp = this.referralSearch[this.selectedIndex].id;
                break;

            case UP:
                this.inputValTemp = '';
                if (this.selectedIndex < this.referralSearch.length) {
                    if (this.selectedIndex > 0) {
                        this.selectedIndex -= 1;
                    } else {
                        this.selectedIndex = this.referralSearch.length-1;
                    }
                }

                this.inputValTemp   = this.referralSearch[this.selectedIndex].text;
                this.inputValIdTemp = this.referralSearch[this.selectedIndex].id;
                break;
            }
        }

        if (keyCode === ENTER || keyCode === TAB) {
            e.preventDefault();
            e.stopPropagation();
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
        this.inputValIdTemp      = 0;
        this.searchText          = '';
        this.textSuggestionState = false;
        this.isFirstCharAccepted = true;

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

    _getCurrentValue() {
        let fieldView = this._config.fieldView;

        if (this._currentValue && fieldView && this._currentValue.hasOwnProperty(fieldView)) {
            return this._currentValue[fieldView];
        }

        return this._currentValue;
    }

    _getValueOfItem(item) {
        let fieldView = this._config.fieldView;

        if (item && fieldView && item.hasOwnProperty(fieldView)) {
            return item[fieldView];
        }

        return item;
    }

    _getCurrentKeyOfItem(defaultKey) {
        let fieldKey = this._config.fieldKey;

        if (this._currentValue && fieldKey && this._currentValue.hasOwnProperty(fieldKey)) {
            return this._currentValue[fieldKey];
        }

        return defaultKey;
    }

    _getKeyOfItem(item, defaultKey) {
        let fieldKey = this._config.fieldKey;

        if (item && fieldKey && item.hasOwnProperty(fieldKey)) {
            return item[fieldKey];
        }

        return defaultKey;
    }

    _renderItem(item, index, isLast) {
        let value        = this._getValueOfItem(item),
            currentValue = this._getCurrentValue(),
            key          = this._getKeyOfItem(item, value),
            currentKey   = this._getCurrentKeyOfItem(currentValue),
            isCurrent    = currentKey === key,
            isSelected   = this.selectedIndex === index;

        return (
            <div
                oncreate={({ dom }) => this._onCreateItem(dom, isCurrent)}
                onupdate={({ dom }) => this._onUpdateItem(dom, isSelected, isLast)}
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

    // fields - Массив елючей по которым подсветка и поиск
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
