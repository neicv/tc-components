import m from "mithril";
import Component from "@/lib/Component";
import { SearchIcon } from '@/ui/iconAssets';

class SearchLine extends Component {
    oninit() {
        this.search      = '';
        this.elemetInput = null;
    }

    view({children}) {
        const {icon = true, className = ''} = this.attrs;

        return (
            <div id="search-line" className={`tc-search-line ${className}`}>
                <form novalidate onsubmit={e => e.preventDefault()}>
                    <div class="group tc-search">
                        <input
                            class="tс-search-input"
                            value={this.search}
                            type="search"
                            oninput={e => this.onSearch(e.target.value)}
                            onkeyup={e => this.onKeyUp(e)}
                            oncreate={element => this.elemetInput = element}
                            required
                        />
                        <If condition={this.search === '' && icon}>
                            <span className="tc-form-icon tc-form-icon-flip">
                                <SearchIcon color='#777' />
                            </span>
                        </If>
                        <If condition={this.search}>
                            <span
                                className="tc-search-close tc-form-icon tc-form-icon-flip fs12 font-icon cancel cursor-pointer color-error "
                                onclick={() => this.clearSearch()}
                            >
                            </span>
                        </If>
                        <span class="highlight"></span>
                        <span class="bar"></span>
                        {/* CHILDREN - IS AS PLACEHOLDER */}
                        <label>{children.length ? children : 'Поиск '}</label>
                    </div>
                </form>
            </div>
        )
    }

    onKeyUp(e, _this) {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.clearSearch();
            this.elemetInput && this.elemetInput.dom.blur();
            return;
        }
    }

    onSearch(value) {
        this.search = value;
        const searchFn = this.attrs.search;

        if (typeof searchFn === "function") {
            searchFn(this.search);
        }
    }

    clearSearch() {
        this.search = '';
        this.onSearch('');
    }
}

export default SearchLine;
