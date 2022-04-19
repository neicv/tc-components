import m from "mithril";
import cx from 'classnames';
import Component from "@/lib/Component";
import {Store} from "../lib/store";
// new import !!! npm i --save immutability-helper
import update from 'immutability-helper';
import groupsObserver from '../lib/groups-observer'
import NestableItem from "./NestableItem";
import NestablePlaceholder from "./NestablePlaceholder"

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
    constructor(props) {
        super(props);
        this.collapse = this.collapse.bind(this);
        this.store    = new Store;
        Object.assign(Nestable.prototype, groupsObserver.methods);
    }

    oninit() {
        this.state = {
            items           : [],
            // snap copy in case of canceling drag
            itemsOld        : null,
            dragItem        : null,
            isDirty         : false,
            collapsedGroups : [],
            isRedraw        : false
        };

        this.el           = null;
        this.elCopyStyles = null;
        this.mouse        = {
            last : { x: 0 },
            shift: { x: 0 },
        };

        this.props      = this.defaultProps(this.attrs);
        this.prevProps  = { ...this.props };
        this.group      = this.props.group;

        if (typeof this.attrs.setCollapse === "function") {
            this.attrs.setCollapse(this.collapse);
        }

        this.setState(this.state);
        this.componentDidMount();
        this.registerNestable(this)
    }

    componentDidMount() {
        let { items, childrenProp } = this.props;

        // make sure every item has property 'children'
        items = listWithChildren(items, childrenProp);

        this.setState({ items });
    }

    onbeforeupdate() {
        this.props = { ...this.props, ...this.attrs };
    }

    onupdate() {
        const prevProps = this.prevProps;
        const { items: itemsNew, childrenProp } = this.props;
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
                ...extra,
            });
        }

        this.prevProps = { ...this.props };
    }

    onremove() {
        this.stopTrackMouse();
    }

    defaultProps(props) {
        const {
            childrenProp = "children",
            collapsed = false,
            confirmChange = () => true,
            group = Math.random().toString(36).slice(2),
            idProp = "id",
            items = [],
            maxDepth = 10,
            onChange = () => {},
            renderItem = ({ item }) => String(item),
            threshold = 30,
            listId  = Math.random().toString(36).slice(2),
            placeholder = 'No content'
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
            listId,
            placeholder,
            ...props,
        };
    }

    setState(newState) {
        this.store.setState({ ...this.store.getState(), ...newState });

        setTimeout(() => m.redraw(), 0);
    }

    // ––––––––––––––––––––––––––––––––––––
    // Public Methods
    // ––––––––––––––––––––––––––––––––––––
    collapse = (itemIds) => {
        const { idProp, childrenProp, collapsed } = this.props;
        const { items } = this.store.getState();

        if (itemIds === "NONE") {
            this.setState({
                collapsedGroups: collapsed
                    ? getAllNonEmptyNodesIds(items, { idProp, childrenProp })
                    : [],
            });
        } else if (itemIds === "ALL") {
            this.setState({
                collapsedGroups: collapsed
                    ? []
                    : getAllNonEmptyNodesIds(items, { idProp, childrenProp }),
            });
        } else if (isArray(itemIds)) {
            this.setState({
                collapsedGroups: getAllNonEmptyNodesIds(items, {
                    idProp,
                    childrenProp,
                }).filter((id) => (itemIds.indexOf(id) > -1) ^ collapsed),
            });
        }
    };

    // ––––––––––––––––––––––––––––––––––––
    // Methods
    // ––––––––––––––––––––––––––––––––––––
    startTrackMouse = () => {
        document.addEventListener("mousemove", this.onMouseMove);
        document.addEventListener("mouseup", this.onDragEnd);
        document.addEventListener("keydown", this.onKeyDown);
    };

    stopTrackMouse = () => {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onDragEnd);
        document.removeEventListener('keydown', this.onKeyDown);
        this.elCopyStyles = null;
    };

    moveItem({ dragItem, pathFrom, pathTo }, extraProps = {}) {
        const { childrenProp, confirmChange } = this.props;
        const dragItemSize = this.getItemDepth(dragItem);
        let { items }      = this.store.getState();

        // the remove action might affect the next position,
        // so update next coordinates accordingly
        const realPathTo = this.getRealNextPath(pathFrom, pathTo, dragItemSize);

        // if (realPathTo.length === 0) return;

        // user can validate every movement
        const destinationPath =
            realPathTo.length > pathTo.length ? pathTo : pathTo.slice(0, -1);
        const destinationParent = this.getItemByPath(destinationPath);
        if (!confirmChange({ dragItem, destinationParent })) return;

        const removePath = this.getSplicePath(pathFrom, {
            numToRemove: 1,
            childrenProp: childrenProp,
        });

        const insertPath = this.getSplicePath(realPathTo, {
            numToRemove: 0,
            itemsToInsert: [dragItem],
            childrenProp: childrenProp,
        });

        items = update(items, removePath);
        items = update(items, insertPath);

        this.setState({
            items,
            isDirty: true,
            ...extraProps
        });
    }

    tryIncreaseDepth(dragItem) {
        const { maxDepth, idProp, childrenProp, collapsed } = this.props;
        const pathFrom  = this.getPathById(dragItem[idProp]);
        const itemIndex = pathFrom[pathFrom.length - 1];
        const newDepth  = pathFrom.length + this.getItemDepth(dragItem);

        // has previous sibling and isn't at max depth
        if (itemIndex > 0 && newDepth <= maxDepth) {
            const prevSibling = this.getItemByPath(
                pathFrom.slice(0, -1).concat(itemIndex - 1)
            );

            // previous sibling is not collapsed
            if (
                !prevSibling[childrenProp].length ||
                !this.isCollapsed(prevSibling)
            ) {
                const pathTo = pathFrom
                    .slice(0, -1)
                    .concat(itemIndex - 1)
                    .concat(prevSibling[childrenProp].length);

                // if collapsed by default
                // and was no children here
                // open this node
                let collapseProps = {};
                if (collapsed && !prevSibling[childrenProp].length) {
                    collapseProps = this.onToggleCollapse(prevSibling, true);
                }

                this.moveItem({ dragItem, pathFrom, pathTo }, collapseProps);
            }
        }
    }

    tryDecreaseDepth(dragItem) {
        const { idProp, childrenProp, collapsed } = this.props;
        const pathFrom  = this.getPathById(dragItem[idProp]);
        const itemIndex = pathFrom[pathFrom.length - 1];

        // has parent
        if (pathFrom.length > 1) {
            const parent = this.getItemByPath(pathFrom.slice(0, -1));

            // is last (by order) item in array
            if (itemIndex + 1 === parent[childrenProp].length) {
                let pathTo = pathFrom.slice(0, -1);
                pathTo[pathTo.length - 1] += 1;

                // if collapsed by default
                // and is last (by count) item in array
                // remove this node from list of open nodes
                let collapseProps = {};
                if (collapsed && parent[childrenProp].length === 1) {
                    collapseProps = this.onToggleCollapse(parent, true);
                }

                this.moveItem({ dragItem, pathFrom, pathTo }, collapseProps);
            }
        }
    }

    dragApply() {
        const { onChange, idProp } = this.props;
        const { items, isDirty, dragItem } = this.store.getState();

        this.setState({
            itemsOld: null,
            dragItem: null,
            isDirty : false,
        });

        if (onChange && isDirty) {
            const targetPath = this.getPathById(dragItem[idProp], items);
            onChange({ items, dragItem, targetPath });
        }
    }

    dragRevert() {
        const { itemsOld } = this.store.getState();

        this.setState({
            items   : itemsOld,
            itemsOld: null,
            dragItem: null,
            isDirty : false,
        });
    }

    // ––––––––––––––––––––––––––––––––––––
    // Getter methods
    // ––––––––––––––––––––––––––––––––––––
    getPathById(id, items = this.store.getState().items) {
        const { idProp, childrenProp } = this.props;
        let path = [];

        items.every((item, i) => {
            if (item[idProp] === id) {
                path.push(i);
            } else if (item[childrenProp]) {
                const childrenPath = this.getPathById(id, item[childrenProp]);

                if (childrenPath.length) {
                    path = path.concat(i).concat(childrenPath);
                }
            }

            return path.length === 0;
        });

        return path;
    }

    getItemByPath(path, items = this.store.getState().items) {
        const { childrenProp } = this.props;
        let item = null;

        path.forEach((index) => {
            const list = item ? item[childrenProp] : items;
            item = list[index];
        });

        return item;
    }

    getItemDepth = (item) => {
        const { childrenProp } = this.props;
        let level = 1;

        if (item[childrenProp].length > 0) {
            const childrenDepths = item[childrenProp].map(this.getItemDepth);
            level += Math.max(...childrenDepths);
        }

        return level;
    };

    getSplicePath(path, options = {}) {
        const splicePath    = {};
        const numToRemove   = options.numToRemove || 0;
        const itemsToInsert = options.itemsToInsert || [];
        const lastIndex     = path.length - 1;
        let currentPath     = splicePath;

        path.forEach((index, i) => {
            if (i === lastIndex) {
                currentPath.$splice = [[index, numToRemove, ...itemsToInsert]];
            } else {
                const nextPath = {};
                currentPath[index] = { [options.childrenProp]: nextPath };
                currentPath = nextPath;
            }
        });

        return splicePath;
    }

    getRealNextPath(prevPath, nextPath, dragItemSize) {
        const { childrenProp, maxDepth } = this.props;
        const ppLastIndex = prevPath.length - 1;
        const npLastIndex = nextPath.length - 1;
        const newDepth    = nextPath.length + dragItemSize - 1;

        if (prevPath.length < nextPath.length) {
            // move into depth
            let wasShifted = false;

            // if new depth exceeds max, try to put after item instead of into item
            if (newDepth > maxDepth && nextPath.length) {
                return this.getRealNextPath(
                    prevPath,
                    nextPath.slice(0, -1),
                    dragItemSize
                );
            }

            return nextPath.map((nextIndex, i) => {
                if (wasShifted) {
                    return i === npLastIndex ? nextIndex + 1 : nextIndex;
                }

                if (typeof prevPath[i] !== "number") {
                    return nextIndex;
                }

                if (nextPath[i] > prevPath[i] && i === ppLastIndex) {
                    wasShifted = true;
                    return nextIndex - 1;
                }

                return nextIndex;
            });
        } else if (prevPath.length === nextPath.length) {
            // if move bottom + move to item with children --> make it a first child instead of swap
            if (nextPath[npLastIndex] > prevPath[npLastIndex]) {
                const target = this.getItemByPath(nextPath);

                if (
                    newDepth < maxDepth &&
                    target[childrenProp] &&
                    target[childrenProp].length &&
                    !this.isCollapsed(target)
                ) {
                    return nextPath
                        .slice(0, -1)
                        .concat(nextPath[npLastIndex] - 1)
                        .concat(0);
                }
            }
        }

        return nextPath;
    }

    getItemOptions() {
        const {
            renderItem,
            renderCollapseIcon,
            handler,
            idProp,
            childrenProp,
            group,
            listId
        } = this.props;

        const { dragItem } = this.store.getState();

        return {
            dragItem,
            idProp,
            childrenProp,
            renderItem,
            renderCollapseIcon,
            handler,
            group,
            listId,

            // onDragStart     : this.onDragStart,
            // onMouseEnter    : this.onMouseEnter,
            isCollapsed     : this.isCollapsed,
            onToggleCollapse: this.onToggleCollapse,
        };
    }

    isCollapsed = (item) => {
        const { collapsed, idProp } = this.props;
        const { collapsedGroups } = this.store.getState();

        return !!((collapsedGroups.indexOf(item[idProp]) > -1) ^ collapsed);
    };

    // ––––––––––––––––––––––––––––––––––––
    // Click handlers or event handlers
    // ––––––––––––––––––––––––––––––––––––
    onDragStart = (e, item) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        this.el = closest(e.target, ".nestable-item");

        this.startTrackMouse();

        this.setState({
            dragItem: item,
            itemsOld: this.store.getState().items,
        });

        this.onMouseMove(e);
    };

    onDragEnd = (e, isCancel) => {
        e && e.preventDefault();

        this.stopTrackMouse();
        this.el = null;

        isCancel ? this.dragRevert() : this.dragApply();
    };

    onMouseMove = (e) => {
        const { group, threshold } = this.props;
        const { dragItem } = this.store.getState();
        const { clientX, clientY } = e;

        // initialize the initial mouse positoin on the first drag operation
        if (this.mouse.last.x === 0) {
            this.mouse.last.x = clientX
        }

        const transformProps = getTransformProps(clientX, clientY);

        // In some cases the drag-layer might not be at the top left of the window,
        // we need to find, where it acually is, and incorperate the position into the calculation.
        // const elDragLayer = document.querySelector('.nestable-' + group + ' .nestable-drag-layer')
        // if (!elDragLayer) return;

        const elCopy = document.querySelector('.nestable-' + group + ' .nestable-drag-layer > .nestable-list')

        if (!this.elCopyStyles) {
            const offset = getOffsetRect(this.el);
            const scroll = getTotalScroll(this.el);

            this.elCopyStyles = {
                marginTop: (offset.top - clientY - scroll.top) + 'px',
                marginLeft: (offset.left - clientX - scroll.left) + 'px',
                ...transformProps,
            };

        } else {
            this.elCopyStyles = {
                ...this.elCopyStyles,
                ...transformProps,
            };

            if (elCopy) {
                for (const key in transformProps) {
                    if (Object.prototype.hasOwnProperty.call(transformProps, key)) {
                        elCopy.style[key] = transformProps[key]
                    }
                }
            }

            const diffX = clientX - this.mouse.last.x;
            if (
                (diffX >= 0 && this.mouse.shift.x >= 0) ||
                (diffX <= 0 && this.mouse.shift.x <= 0)
            ) {
                this.mouse.shift.x += diffX;
            } else {
                this.mouse.shift.x = 0;
            }
            this.mouse.last.x = clientX;

            if (Math.abs(this.mouse.shift.x) > threshold) {
                if (this.mouse.shift.x > 0) {
                    this.tryIncreaseDepth(dragItem);
                } else {
                    this.tryDecreaseDepth(dragItem);
                }

                this.mouse.shift.x = 0;
            }
        }

        setTimeout(() => m.redraw(), 0);
    };

    onMouseEnter = (e, eventList, item) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const { collapsed, idProp, childrenProp, listId, maxDepth } = this.props;
        const { dragItem } = this.store.getState();

        // In some cases, this event fires after the drag operation was already
        // completed, in which case we can ignore it
        if (!dragItem) return

        // if (dragItem[idProp] === item[idProp]) return;
        // if the event does not have a valid item that belongs to this list, ignore it
        if (item !== null && dragItem[idProp] === item[idProp]) return

        const pathFrom = this.getPathById(dragItem[idProp]);

        // if the event is not emitted from this list and the item was not removed from this list,
        // we can ignore this event
        if (eventList !== listId && pathFrom.length === 0) return;

        // const pathTo   = this.getPathById(item[idProp]);
        let pathTo;
        // if we are dragging to an empty list, we need to remove
        // the item from the origin list and append it to the start of the new list
        if (item === null) {
          pathTo = pathFrom.length > 0 ? [] : [0]
        } else {
          pathTo = this.getPathById(item[idProp])
        }

        // if the move to the new depth is greater than max depth,
        // don't move
        const newDepth = this.getRealNextPath(pathFrom, pathTo).length + (this.getItemDepth(dragItem) - 1)
        if (newDepth > maxDepth) {
            return
        }

        // if collapsed by default
        // and move last (by count) child
        // remove parent node from list of open nodes
        let collapseProps = {};
        if (collapsed && pathFrom.length > 1) {
            const parent = this.getItemByPath(pathFrom.slice(0, -1));
            if (parent[childrenProp].length === 1) {
                collapseProps = this.onToggleCollapse(parent, true);
            }
        }

        this.moveItem({ dragItem, pathFrom, pathTo }, collapseProps);
    };

    onToggleCollapse = (item, isGetter) => {
        const { collapsed, idProp } = this.props;
        const { collapsedGroups }   = this.store.getState();
        const isCollapsed           = this.isCollapsed(item);

        const newState = {
            collapsedGroups:
                isCollapsed ^ collapsed
                    ? collapsedGroups.filter((id) => id !== item[idProp])
                    : collapsedGroups.concat(item[idProp]),
        };

        if (isGetter) {
            return newState;
        } else {
            this.setState(newState);
        }
    };

    onKeyDown = (e) => {
        if (e.which === 27) {
            // ESC
            this.onDragEnd(null, true);
        }
    };

    // ––––––––––––––––––––––––––––––––––––
    // Render methods
    // ––––––––––––––––––––––––––––––––––––
    renderDragLayer() {
        const { group, idProp } = this.props;
        const { dragItem } = this.store.getState();
        const el = document.querySelector(
            ".nestable-" + group + " .nestable-item-" + dragItem[idProp]
        );

        let listStyles = {};
        if (el) {
            listStyles.width = el.clientWidth + 'px';
        }
        if (this.elCopyStyles) {
            listStyles = {
                ...listStyles,
                ...this.elCopyStyles,
            };
        }

        const options = this.getItemOptions();

        return (
            <div className="nestable-drag-layer">
                <ol className="nestable-list" style={listStyles}>
                    <NestableItem item={dragItem} options={options} isCopy />
                </ol>
            </div>
        );
    }

    view() {
        const { group, className, placeholder } = this.props;
        const { items, dragItem }  = this.store.getState();
        const options              = this.getItemOptions();

        return (
            <div className={cx(className, 'nestable', 'nestable-' + group, { 'is-drag-active': dragItem })}>
                <ol className="nestable-list nestable-group">
                    <If condition={items.length}>
                        {items.map((item, i) => {
                            return (
                                <NestableItem
                                    key={i}
                                    index={i}
                                    item={item}
                                    options={options}
                                />
                            );
                        })}
                    </If>
                    <If condition={!items.length}>
                        <NestablePlaceholder options={options}>
                            {placeholder}
                        </NestablePlaceholder>
                    </If>
                </ol>

                {dragItem && this.renderDragLayer()}
            </div>
        )
    }
}

export default Nestable;
