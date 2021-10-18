import m from "mithril";
import classNames from "classnames";
import Component from "../../../lib/Component";
import validateColor from '../,,/../../../lib/colors'
import TimelineItem from "./TimelineItem";

class TimelineOppositeContent extends Component   {//extends TimelineItem {

    view({ children }) {
        // const attrs = attrs;
        const { position: positionProp, className, color, ...other} = this.attrs;

        children.forEach(element => {
            if (typeof element === 'object' && element !== null) {
                element.attrs = {...other, ...element.attrs}
            }
        });

        let colorValid = validateColor(color, '');

        let classesElement = classNames(
            "timeline-opposite-content",
            {'text-left'  : this.attrs?.position === 'left'},
            {'text-right' : this.attrs?.position === 'right'}
        )

        return (
            <div className={`${classesElement} ${className || ''} ${colorValid}`}>
                {children}
            </div>
        )
    }
}

TimelineOppositeContent.ComponentName = 'TimelineOppositeContent';

export default TimelineOppositeContent;

