import m from "mithril";
import Component from "@/lib/Component";

class TooltipContent extends Component {
    view({children}) {
        const {className, content = '', maxWidth = '', maxHeight = '', minWidth = ''} = this.attrs;

        let style  = maxWidth  ? `max-width: ${maxWidth}px;` : '';
            style += maxHeight ? `max-height: ${maxHeight}px;` : '';
            style += minWidth  ? `min-width: ${minWidth}px;` : '';

        return (
            <div
                className={`tc-tooltip-content ${className || ''}`}
                style={style}
                onmouseenter={() => this.handleEnterToolTipContent()}
                onmouseleave={() => this.handleLeaveToolTipContent()}
            >
                {content}
            </div>
        )
    }

    handleEnterToolTipContent() {
        const { onmouseenter } = this.attrs;

        if (typeof onmouseenter === "function") {
            onmouseenter();
        }
    }

    handleLeaveToolTipContent() {
        const { onmouseleave } = this.attrs;

        if (typeof onmouseleave === "function") {
            onmouseleave();
        }
    }
}

export default TooltipContent;
