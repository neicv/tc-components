import m from "mithril";
import classNames from "classnames";
import Component from "../../../lib/Component";
import validateColor from '../,,/../../../lib/colors'

class TimelineOppositeContent extends Component {
    view({ children }) {
        const attrs = this.attrs;
        const { position: positionProp, className, color, ...other} = this.attrs;

        children.forEach(element => {
            if (typeof element === 'object' && element !== null) {
                element.attrs = {...other, ...element.attrs}
            }
        });

        let colorValid = validateColor(color, '');

        let classesElement = classNames(
            "timeline-opposite-content",
            {'text-left'  : attrs?.position === 'left'},
            {'text-right' : attrs?.position === 'right'}
        )

        return (
            <div className={`${classesElement} ${className || ''} ${colorValid}`}>
                {children}
            </div>
        )
    }
}

export default TimelineOppositeContent;

