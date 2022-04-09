import m from "mithril";
import cx from 'classnames';
import Component from "@/lib/Component";

import {
  isArray,
  closest,
  getOffsetRect,
  getTotalScroll,
  getTransformProps,
  listWithChildren,
  getAllNonEmptyNodesIds,
} from '../lib/utils';

class Nestable extends Component {
    oninit() {
        this.state = {
            items          : [],
            // snap copy in case of canceling drag
            itemsOld       : null,
            dragItem       : null,
            isDirty        : false,
            collapsedGroups: [],
        };

        this.el           = null;
        this.elCopyStyles = null;
        this.mouse        = {
            last: { x: 0 },
            shift: { x: 0 },
        };

        this.attrs = this.defaultProps(this.attrs);
    }

    oncreate() {
    // componentDidMount() {
        let { items, childrenProp } = this.attrs;

        // make sure every item has property 'children'
        items = listWithChildren(items, childrenProp);

        this.setState({ items });
      }

    view() {

        // defaultProps
        const {
            childrenProp  = 'children',
            collapsed     = false,
            confirmChange = () => true,
            group         = this.group, // mod
            idProp        = 'id',
            items         =  [],
            maxDepth      = 10,
            onChange      = () => {},
            renderItem    = ({ item }) => String(item),
            threshold     = 30,
        } = this.attrs;

        return (
            <div>
                nestable element
                {this.group}
            </div>
        )
    }

    defaultProps(props) {
        const {
            childrenProp  = 'children',
            collapsed     = false,
            confirmChange = () => true,
            group         = Math.random().toString(36).slice(2),
            idProp        = 'id',
            items         =  [],
            maxDepth      = 10,
            onChange      = () => {},
            renderItem    = ({ item }) => String(item),
            threshold     = 30,
        } = props;

        return {
            childrenProp,
            collapsed,
            confirmChange,
            group,
            idProp,
            items,
            maxDepth,
            onChange,
            renderItem,
            threshold,
            ...props
        }
    }
}

export default Nestable;
