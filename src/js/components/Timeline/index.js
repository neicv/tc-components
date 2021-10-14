import m from "mithril";
import classNames from "classnames";
import Component from "../../lib/Component";

class Timeline extends Component {
    oninit() {
        let { position = 'right' } = this.attrs;

        this.position = `position-${['right', 'left', 'alternate', 'both'].includes(position) ? position : 'right'}`;
    }

    view({ children }) {
        const { className } = this.attrs;

        children.forEach(element => {
            if (typeof element === 'object' && element !== null) {
                element.attrs = {...this.attrs, ...element.attrs}
            }
        });

        return (
            <div className={`timeline ${this.position} ${className || ''}`} >
                <ul className={`timeline-root ${this.position}`}>
                    {/* {m.fragment(this.attrs, [children])} */}
                    {children}
                </ul>
            </div>
        )
    }
}

export default Timeline;

/*
корекция для смещения - "слева 20% - справа остальное"

.timeline-dot :  убрать align-self: baseline;
.timeline-separator : добавить min-width: 32px;
.missing-opposite-content:before  - изменить flex: 0.2

*/
