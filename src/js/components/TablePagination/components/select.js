import m from 'mithril';
import Component from "@/lib/Component";
import {translate} from "@/localizations";
import Chevron from "@/components/Chevron/chevron";

const CHEVRON_DIMENSION = 12;
const LANG              = "pagination";

class Select extends Component {
    oninit() {
        this.arrowFocused   = false;
        this.arrowAnimation = 'tc-pagination-arrow-down';
        this.selectedValue  = this.attrs.selectedValue || 1;
    }

    view( {children}) {
        const { itemsPerPageOptions = [] } = this.attrs;

        const valueAll = translate(`${LANG}.valueAll`);

        if (Array.isArray(itemsPerPageOptions) && itemsPerPageOptions.length) {
            return (
                <div class="tc-pagination-select">
                    <select
                        id="pagination-element-selector"
                        name="paginationElementSelector"
                        value={this.selectedValue}
                        autocomplete="off"
                        onblur={() => this.rotateArrowDown()}
                        onclick={() => this.rotateArrowClick()}
                        onchange={event => this.sendValue(event)}
                    >

                        {itemsPerPageOptions.map((item) => (
                            <option value={item}>{`${item === -1 ? valueAll : item}`}</option>
                        ))}
                    </select>
                    <span className="tc-pagination-highlight"></span>
                    <span className="tc-pagination-bar"></span>
                    <button
                        className="tc-pagination-btn tc-pagination-btn_sel"
                        type="button"
                        tabindex="-1"
                        onclick={event => event.preventDefault()}
                    >
                        <span></span>
                        <Chevron
                            className={`tc-paginaton-arrow ${this.arrowAnimation}`}
                            width={CHEVRON_DIMENSION}
                        />
                    </button>
                </div>
            )
        }
    }

    sendValue(event){
        let el = event.target
        this.selectedValue = el.value;
        const sendValueFn = this.attrs.sendValue;

        if (typeof sendValueFn === "function") {
            sendValueFn(this.selectedValue);
        }
    }

    rotateArrowDown() {
        this.arrowFocused   = false;
        this.arrowAnimation = 'tc-pagination-arrow-down';
    }

    rotateArrowClick() {
        if (this.arrowFocused) {
            this.arrowAnimation = 'tc-pagination-arrow-down';
        } else {
            this.arrowAnimation = 'tc-pagination-arrow-up';
        }
        this.arrowFocused = !this.arrowFocused;
    }
}

export default Select;
