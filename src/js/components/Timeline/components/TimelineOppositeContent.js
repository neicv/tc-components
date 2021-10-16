import m from "mithril";
import classNames from "classnames";
import Component from "../../../lib/Component";
import validateColor from '../,,/../../../lib/colors'

class TimelineOppositeContent {//extends Component {
    // constructor() {
    //     this.tag.name = 'wewe'
    //     // this.text = 'TimelineOppositeContent';
    //     // console.log(attrs)
    // }

    // oninit() {
    //     this.attrs = {...this.attrs, TimelineOppositeContent: true }
    // }

    view({ children, attrs }) {
        // const attrs = attrs;
        const { position: positionProp, className, color, ...other} = attrs;//this.attrs;

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

TimelineOppositeContent.ComponentName = 'TimelineOppositeContent';

export default TimelineOppositeContent;

