import m from "mithril";
import classNames from "classnames";
import Component from "../../../lib/Component";

class TimelineConnector extends Component {
    view({children}) {
        const { className, ...other } = this.attrs;

        return (
            <span className={`timeline-connector ${className || ''}`}>
                {children}
            </span>
        )
    }
}

export default TimelineConnector;
