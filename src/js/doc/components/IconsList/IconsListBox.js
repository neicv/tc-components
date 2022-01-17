import m from 'mithril';
import Component from "@/lib/Component";

class IconsListBox extends Component {
    view() {
        const  { items } = this.attrs

        return (
            <div>
                {this.renderItems(items)}
            </div>
        )
    }

    renderItems(items) {
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
                                return (
                                    <button
                                        content-vl27=""
                                        aria-haspopup="dialog"
                                        icon-item=""
                                        host-vl37=""
                                        aria-label={`${item.name} Icon`}
                                        aria-selected="false"
                                        className='icon-container'
                                        onclick={() => this.onIconClick(item, font)}
                                    >
                                        <span
                                            // style='font-size: 15px;'
                                            content-vl37=""
                                            className={`icon-asset ${font} ${item.name}`}
                                            title={item.name}
                                        >
                                        </span>
                                        <span content-vl37="" className="icon-name">{item.name}</span>
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
}

export default IconsListBox;

            // <div content-vl27="" className="icons-container" role="listbox" aria-label="Action icons">
            //     {

            //         items.map((item, index) => {
            //             return (
            //                 <button
            //                     content-vl27=""
            //                     aria-haspopup="dialog"
            //                     icon-item=""
            //                     // role="option"
            //                     host-vl37=""
            //                     aria-label={`${item} Icon`}
            //                     aria-selected="false"
            //                     className='icon-container'
            //                     onclick={() => this.onIconClick(index)}
            //                 >
            //                     <span
            //                         content-vl37=""
            //                         className={`icon-asset ${prefix} ${item}`}
            //                         title={item}
            //                     >
            //                         {/* {item} */}
            //                     </span>
            //                     <span content-vl37="" className="icon-name">{item}</span>
            //                 </button>
            //             )
            //         })
            //     }
            // </div>
