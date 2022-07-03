import m from 'mithril';
import ScrollBar from '../lib/ScrollBar';
import consts from '../consts';

export default class Container {
    constructor() {
        this.instance = new ScrollBar();
    }

    oncreate(vnode) {
        let attrs    = vnode.attrs || {},
            settings = {
                container         : vnode.dom,
                isScrollHasX      : attrs.isScrollHasX,
                isScrollHasY      : attrs.isScrollHasY,
                isDisableOutScroll: attrs.isDisableOutScroll,
                isStickScrollX    : attrs.isStickScrollX
            };

        this.instance.initialize(settings);
    }

    onupdate() {
        this.instance.update();
    }

    view({ attrs, children }) {
        return (
            <div
                className={
                    attrs.className
                        ? `${consts.CLASS_CONTAINER} ${attrs.className}`
                        : consts.CLASS_CONTAINER
                }
                style={attrs.style}
                onupdatescroll={(e) => {
                    e.redraw = false;
                    this.instance.update();
                }}
            >
                {children}
            </div>
        )
    }
}
