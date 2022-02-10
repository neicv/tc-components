import m from 'mithril';
import Inner from './components/Inner';
import Label from './components/Label';
import Item from './components/Item';

const DROPDOWN_CSS_CLASS = "turbo-dropdown";

class Dropdown {
    constructor({ attrs }) {
        this.state = { isOpen: false };
    }

    oncreate({ dom }) {
        this._element = dom;


        this._clickOnDocument = event => {
            let parent = event.target.closest(`.${DROPDOWN_CSS_CLASS}`);

            if (!parent || parent !== this._element) {
                this.close();
            }
        };
    }

    open() {
        this.state.isOpen = true;

        document.addEventListener('click', this._clickOnDocument);

        m.redraw();
        // setTimeout(() => m.redraw(), 0);
    }

    close() {
        this.state.isOpen = false;

        document.removeEventListener('click', this._clickOnDocument);

        m.redraw();
        // setTimeout(() => m.redraw(), 0);
    }

    clickHandle(e, attrs) {
        e.redraw = false;

        if (!attrs.hovered && !attrs.disabled) {
            if (this.state.isOpen) {
                this.close()
            } else {
                this.open()
            }
        }

        if (attrs.onclick) {
            attrs.onclick();
        }
    }

    getClassNames(attrs) {
        return [
            `turbo-dropdown ${ attrs.className || "" } `,
            `${ attrs.hovered ? "turbo-dropdown_hovered" : "" } `,
            `${ attrs.right ? "turbo-dropdown_right" : "" } `,
            `${ attrs.center ? "turbo-dropdown_center" : "" } `,
            `${ this.state.isOpen ? "turbo-dropdown_open" : "" } `
        ].join('');
    }

    view({ attrs, children }) {
        return (
            <div
                // id='tc-presence-elemen-dropdown'
                className={ this.getClassNames(attrs) }
                // onclick={ (e) => this.clickHandle(e, attrs) }
                // onfireclick={ (e) => this.testFunc(e, attrs)  }
                onclick={ (e) => this.testFunc(e, attrs)  }
            >
                { children }
            </div>
        );
    }

    testFunc(e, attrs) {

        setTimeout(() => this.clickHandle(e, attrs), 0);
        // setTimeout(() => m.redraw(), 0);
    }
}

Dropdown.Inner = Inner;
Dropdown.Label = Label;
Dropdown.Item  = Item;

export default Dropdown;
