import m from "mithril";
import classNames from "classnames";
import Component from "../../../lib/Component";

class TimelineItem extends Component {
    oninit() {
        //
    }

    view({ children }) {
        const attrs = this.attrs;

        children.forEach(element => {
            if (typeof element === 'object' && element !== null) {
                element.attrs = {...this.attrs, ...element.attrs}
            }
        });

        return (
            <li className={`timeline-item `}>
                {children}
            </li>
        )
    }
}

export default TimelineItem;
