import m from 'mithril';
import Component from "@/lib/Component";

class IconsListBox extends Component {
    view() {
        const  { items, size, showNew = false} = this.attrs;

        return (
            <div>
                {this.renderItems(items, size, showNew)}
            </div>
        )
    }

    renderItems(items, size, showNew = false) {
        if (items) {
            let elm = [];

            for(let font in items) {

                if (items[font].icons.length) {
                    elm.push(m.fragment({}, [
                        <p class="pt10 fs18">{this.ucFirst(items[font].name)} Icons
                            {/* <hr/> */}
                        </p>
                    ]))
                }

                elm.push(m.fragment({}, [
                    <div content-vl27="" className="icons-container" role="listbox" aria-label="Action icons">
                        {
                            items[font].icons.map((item, index) => {
                                const classCard = `icon-container ${item.isNew && showNew ? 'icon__new' : '' }`;
                                return (
                                    <button
                                        content-vl27=""
                                        aria-haspopup="dialog"
                                        icon-item=""
                                        host-vl37=""
                                        aria-label={`${item.name} Icon`}
                                        aria-selected="false"
                                        className={classCard}
                                        onclick={() => this.onIconClick(item, font)}
                                    >
                                        <span
                                            style={`font-size: ${size}px;`}
                                            content-vl37=""
                                            className={`icon-asset ${font} ${item.name}`}
                                            title={item.name}
                                        >
                                        </span>
                                        <span content-vl37="" className="icon-name mat-caption">{this.toReadableName(item.name)}</span>
                                    </button>
                                )
                            })
                        }
                    </div>
                ]))
            }

            return elm;
        }
    }

    onIconClick(item, font) {
        const clickFn = this.attrs.onIconClick;

        if (typeof clickFn === "function") {
            item.font = font;
            clickFn(item);
        }
    }

    ucFirst(str) {
        if (!str) return str;

        return str[0].toUpperCase() + str.slice(1);
    }

    toReadableName(str) {
        if (!str) return str;

        let outStr = '',
            words  = str.split('-') || [];

        words.forEach(element => {
            outStr += this.ucFirst(element) + ' ';
        });

        return outStr.trim();
    }
}

export default IconsListBox;
