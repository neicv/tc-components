import m from "mithril";
import classNames from "classnames";
import Component from "../../../lib/Component";

class TimelineItem extends Component {
    view({ children }) {
        const { position: positionProp, className, ...other} = this.attrs;

        let hasOppositeContent = false;

        children.forEach(element => {
            if (typeof element === 'object' && element !== null) {
                if (element.tag && element.tag?.name === 'TimelineOppositeContent') {
                    hasOppositeContent = true;
                  }
                element.attrs = {...other, ...element.attrs, hasOppositeContent}
            }
        });

        const styleProps = {
            ...this.atrrs,
            position: positionProp || /*positionContext ||*/ 'right',
            hasOppositeContent,
        };

        let classesElement = classNames(
            "timeline-item",
            {'position-left':             styleProps.position === 'left'},
            {'position-right':            styleProps.position === 'right'},
            {'position-alternate':        styleProps.position === 'alternate'},
            {'position-both':             styleProps.position === 'both'},
            {'missing-opposite-content': !styleProps.hasOppositeContent},
            {'reverse':                   styleProps.position === 'left'}

        )

        return (
            <li className={classesElement}>
                {children}
            </li>
        )
    }
}

export default TimelineItem;
