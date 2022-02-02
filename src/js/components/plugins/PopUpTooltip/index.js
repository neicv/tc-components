import m from "mithril";
import Component from "@/lib/Component";
import PopUp from "@/components/plugins/PopUp"

class PopUpTooltip extends Component {
    view({ children }) {
        let modal        = this.attrs.modal,
            dataPopupKey = this.attrs["data-popup-key"];

        const { side = "SIDE_LEFT", position ="POSITION_START" } = this.attrs;

        return (
            <PopUp
                modal={modal}
                data-popup-key={dataPopupKey}
                trigger={{side, position}}
            >
                <div className="popup-tooltip__inner color-blue">
                    {children}
                </div>
            </PopUp>
        );
    }
}

export default PopUpTooltip;
