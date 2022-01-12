import m from 'mithril';
import Component from "@/lib/Component";

class IconsListBox extends Component {
    view() {

        const  { items, type = 'font' } = this.attrs

        const prefix = ['font', 'editor'].includes(type) ? type : 'font';

        return (
            <div content-vl27="" className="icons-container" role="listbox" aria-label="Action icons">
                {
                    items.map((item, index) => {
                        return (
                            <button
                                content-vl27=""
                                aria-haspopup="dialog"
                                icon-item=""
                                // role="option"
                                host-vl37=""
                                aria-label={`${item} Icon`}
                                aria-selected="false"
                                className='icon-container'
                                onclick={() => this.onIconClick(index)}
                            >
                                <span
                                    content-vl37=""
                                    className={`icon-asset ${prefix}-icon ${item}`}
                                    title={item}
                                >
                                    {/* {item} */}
                                </span>
                                <span content-vl37="" className="icon-name">{item}</span>
                            </button>
                        )
                    })
                }
            </div>
        )
    }

    onIconClick(index) {
        const clickFn = this.attrs.onIconClick;

        if (typeof clickFn === "function") {
            clickFn(index);
        }
    }
}

export default IconsListBox;
