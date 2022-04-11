import m from "mithril";
import cx from 'classnames';
import Component from "@/lib/Component";

import Icon from "./Icon";

class NestableItem extends Component {

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
        } = options;

        const isCollapsed = options.isCollapsed(item);
        const isDragging  = !isCopy && dragItem && dragItem[idProp] === item[idProp];
        const hasChildren = item[childrenProp] && item[childrenProp].length > 0;

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
                    ondragstart: (e) => options.onDragStart(e, item),
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
}

export default NestableItem;
