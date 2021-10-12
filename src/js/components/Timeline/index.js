import m from "mithril";
import classNames from "classnames";
import Component from "../../lib/Component";

// import Content from "./components/content";

class Timeline extends Component {
    oninit() {
        this.left   = "0";
        this.top    = "0";
        this.isLeft = false;

        let { position = 'right' } = this.attrs;

        this.position = `position-${['right', 'left', 'alternate'].includes(position) ? position : 'right'}`;

        // this.styleRoot = {
        //     display: 'flex',
        //     flexDirection: 'column',
        //     padding: '6px 16px',
        //     flexGrow: 1,
        // }
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
