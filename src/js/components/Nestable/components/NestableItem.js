import m from "mithril";
import cx from 'classnames';
import Component from "@/lib/Component";

import Icon from "./Icon";
import groupsObserver from '../lib/groups-observer'

import {
    closest
  } from '../lib/utils';

class NestableItem extends Component {
    constructor(props) {
        super(props)
        Object.assign(NestableItem.prototype, groupsObserver.methods);
    }

    oninit() {
        this.breakPoint = null;
        this.moveDown   = false;
        this.listId     = null;
        this.item       = null;
        this.group      = null;
        this.dragItem   = null;

    }

    renderCollapseIcon = ({ isCollapsed }) => (
        <Icon
            className={cx("nestable-item-icon", {
                "icon-plus-gray": isCollapsed,
                "icon-minus-gray": !isCollapsed,
            })}
        />
    );

    view() {
        const { item, isCopy, options, index, depth = 0 } = this.attrs;
        const {
            dragItem,
            renderItem,
            handler,
            idProp,
            childrenProp,
            renderCollapseIcon = this.renderCollapseIcon,
            group,
            listId
        } = options;

        const isCollapsed = options.isCollapsed(item);
        const isDragging  = !isCopy && dragItem && dragItem[idProp] === item[idProp];
        const hasChildren = item[childrenProp] && item[childrenProp].length > 0;

        this.listId   = listId;
        this.item     = item;
        this.group    = group;
        this.dragItem = dragItem;

        let rowProps = {};
        let handlerProps = {};
        let wrappedHandler;

        if (!isCopy) {
            if (dragItem) {
                rowProps = {
                    ...rowProps,
                    onmouseenter: (e) => options.onMouseEnter(e, item),
                };
            } else {
                handlerProps = {
                    ...handlerProps,
                    draggable: true,
                    ondragstart: (e) => this.onDragStart(e, options, item)
                };
            }
        }

        if (handler) {
            wrappedHandler = (
                <span className="nestable-item-handler" {...handlerProps}>
                    {handler}
                </span>
            );
        } else {
            rowProps = {
                ...rowProps,
                ...handlerProps,
            };
        }

        rowProps = this.setRowProps(rowProps);

        const collapseIcon = hasChildren ? (
            <span onclick={() => options.onToggleCollapse(item)}>
                {renderCollapseIcon({ isCollapsed })}
            </span>
        ) : null;

        const baseClassName = "nestable-item" + (isCopy ? "-copy" : "");
        const itemProps = {
            className: cx(baseClassName, baseClassName + "-" + item[idProp], {
                "is-dragging": isDragging,
                [baseClassName + "--with-children"]: hasChildren,
                [baseClassName + "--children-open"]:
                    hasChildren && !isCollapsed,
                [baseClassName + "--children-collapsed"]:
                    hasChildren && isCollapsed,
            }),
        };

        const content = renderItem({
            collapseIcon,
            depth,
            handler: wrappedHandler,
            index,
            item,
        });

        if (!content) return null;

        return (
            <li {...itemProps}>
                <div className="nestable-item-name" {...rowProps}>
                    {content}
                </div>

                {hasChildren && !isCollapsed && (
                    <ol className="nestable-list">
                        {item[childrenProp].map((item, i) => {
                            return (
                                <NestableItem
                                    key={i}
                                    index={i}
                                    depth={depth + 1}
                                    item={item}
                                    options={options}
                                    isCopy={isCopy}
                                />
                            );
                        })}
                    </ol>
                )}
            </li>
        );
    }

    onDragStart(e, options, item) {

        // console.log('item ', item)
        // const el = closest(e.target, ".nestable-item");
        if (!item) console.log('no item!')
        const tItem = item || null // el // this.$parent.item
        this.notifyDragStart(this.group, e, tItem);
        // options.onDragStart(e, item);
    }

    // onMouseEnter(e, options, item) {
    //     options.onMouseEnter(e, item);
    // }

    setRowProps(rowProps) {
        const { onmouseenter } = rowProps;

        let tmpOnMouseEnter = null;

        if ( typeof onmouseenter === "function") {
            tmpOnMouseEnter = onmouseenter;
        }

        rowProps = {
            ...rowProps,
            onmouseenter: (e) => this.onMouseEnter(e, tmpOnMouseEnter),
            onmouseleave:  () => this.onMouseLeave(),
            onmousemove : (e) => this.onMouseMove(e),
        }


        return rowProps;
    }

    onMouseEnter(event, tmpOnMouseEnter) {

        // if (tmpOnMouseEnter) {
        //     tmpOnMouseEnter();
        // }

        if (!this.dragItem) return

        // if we don't know the direction the mouse is moving,
        // we can not calculate the offset at which we should trigger a swap
        // we we fallback to the old behavior
        if (!event.movementY) {
          return this.sendNotification(event)
        }

        // when the mouse enters the item we save the size of this item
        // is is to improve performance, so we do not recalculate the size on every move
        this.moveDown   = event.movementY > 0

        this.breakPoint = event.target.getBoundingClientRect().height / 2
    }

    onMouseLeave () {
        this.breakPoint = null
    }

    onMouseMove (event) {
        // if we are not in a drag operation, we can discard the input
        if (!this.breakPoint) return

        // calculate how much the mouse is away from the center
        const delta = event.offsetY - this.breakPoint

        // if we have not reached the breakpoint, we can abort here
        if (this.moveDown && delta < this.breakPoint / 4) return
        if (!this.moveDown && delta > -this.breakPoint / 4) return

        this.sendNotification(event)
    }

    sendNotification (event) {
        // reset the calculated breakpoint
        this.breakPoint = null

        // and trigger the enter event
        // const item = this.item || this.$parent.item

        // const el = closest(e.target, ".nestable-item");
        const item = this.item || null // el // this.$parent.item

        this.notifyMouseEnter(this.group, event, this.listId, item)
    }
}

export default NestableItem;
