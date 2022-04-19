import m from "mithril";
import cx from 'classnames';
import Component from "@/lib/Component";
import groupsObserver from '../lib/groups-observer'

class NestablePlaceholder extends Component {
    constructor(props) {
        super(props)
        Object.assign(NestablePlaceholder.prototype, groupsObserver.methods);
    }

    view({ children }) {
        const { className, options, ...props } = this.attrs;

        return (
            <li>
                <div
                    className={cx('nestable-list-empty', className)}
                    onmouseenter={(e) => this.onMouseEnter(e, options)}
                    {...props}
                >
                    {children}
                </div>
            </li>
        );
    }

    onMouseEnter (event, options) {
        const { listId, group, dragItem } = options;

        if (!dragItem) {
            return;
        }

        this.notifyMouseEnter(group, event, listId, null);
    }
}

export default NestablePlaceholder;
