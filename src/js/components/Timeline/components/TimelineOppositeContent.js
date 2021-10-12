import m from "mithril";
import classNames from "classnames";
import Component from "../../../lib/Component";

class TimelineOppositeContent extends Component {
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

        let classesElement = classNames(
            "timeline-oppositecontent",
            {'text-left'  : attrs?.position === 'left'},
            {'text-right' : attrs?.position === 'right'}
        )

        return (
            <div className={classesElement}>
                {children}
            </div>
        )
    }
}

export default TimelineOppositeContent;
