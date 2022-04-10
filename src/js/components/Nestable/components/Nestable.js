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
  shallowCompare
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

        this.props     = this.defaultProps(this.attrs);
        this.prevProps = {...this.props};
    }

    oncreate() {
        // componentDidMount() {
        let { items, childrenProp } = this.attrs;

        // make sure every item has property 'children'
        items = listWithChildren(items, childrenProp);

        this.setState({ items });
    }

    onbeforeupdate() {
        // или в view ?
        this.props = {...this.props, ...this.attrs};
    }

    onupdate() {
    // componentDidUpdate(prevProps) {
        const prevProps = this.prevProps;
        const { items: itemsNew, childrenProp } = this.props;
        // const isPropsUpdated = shallowCompare({ props: prevProps, state: {} }, this.props, {});
        const isPropsUpdated = shallowCompare(prevProps, this.props);

        if (isPropsUpdated) {
            this.stopTrackMouse();

            let extra = {};

            if (prevProps.collapsed !== this.props.collapsed) {
                extra.collapsedGroups = [];
            }

            this.setState({
                items: listWithChildren(itemsNew, childrenProp),
                dragItem: null,
                isDirty: false,
                ...extra
            });
        }

        this.prevProps = {...this.props}
    }

    onremove() {
    // componentWillUnmount() {
        this.stopTrackMouse();
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

    setState(state) {
        this.state = {...this.state, ...state}
    }

    // a simple implementation of the shallowCompare.
    // only compares the first level properties and hence shallow.
    // state updates(theoretically) if this function returns true.
    // shallowCompare(newObj, prevObj){
    //     for (key in newObj){
    //         if(newObj[key] !== prevObj[key]) return true;
    //     }
    //     return false;
    // }

    // ––––––––––––––––––––––––––––––––––––
    // Methods
    // ––––––––––––––––––––––––––––––––––––
    startTrackMouse = () => {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onDragEnd);
        document.addEventListener('keydown', this.onKeyDown);
    };

    stopTrackMouse = () => {
        // document.removeEventListener('mousemove', this.onMouseMove);
        // document.removeEventListener('mouseup', this.onDragEnd);
        // document.removeEventListener('keydown', this.onKeyDown);
        this.elCopyStyles = null;
    };
}

export default Nestable;
