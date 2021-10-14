import m from "mithril";
import classNames from "classnames";
import Component from "../../../lib/Component";

class TimelineContent extends Component {
    view({ children }) {
        const attrs = this.attrs;
        const { position: positionProp, className, ...other} = this.attrs;

        children.forEach(element => {
            if (typeof element === 'object' && element !== null) {
                element.attrs = {...other, ...element.attrs}
            }
        });

        let classesElement = classNames(
            "timeline-content",
            {'text-left'  : attrs?.position === 'right'},
            {'text-right' : attrs?.position === 'left'}
        )

        return (
            <div className={`${classesElement} ${className || ''}`}>
                {children}
            </div>
        )
    }
}

export default TimelineContent;
