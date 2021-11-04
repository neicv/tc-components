import m from "mithril";
import classNames from "classnames";
import Component from "@/lib/Component";

class TimelineSeparator extends Component {
    view({children}) {
        const {className} = this.attrs;

        return (
            <div className={`timeline-separator ${className || ''}`}>
                {children}
            </div>
        )
    }
}

export default TimelineSeparator;
