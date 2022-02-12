import m from "mithril";
import Component from "@/lib/Component";
import PopUp from "@/components/plugins/PopUp"

class PopUpTooltip extends Component {
    view({ children }) {
        let dataPopupKey = this.attrs["data-popup-key"];

        const {
            modal,
            side = "SIDE_LEFT",
            position ="POSITION_START",
            arrow = true,
            offsetX = false,
            offsetY = false,
            className
        } = this.attrs;

        return (
            <PopUp
                modal={modal}
                data-popup-key={dataPopupKey}
                trigger={{side, position, arrow, offsetX, offsetY}}
            >
                <div className={`popup-tooltip__inner color-blue ${className || ''}`}>
                    {children}
                </div>
            </PopUp>
        );
    }
}

export default PopUpTooltip;
