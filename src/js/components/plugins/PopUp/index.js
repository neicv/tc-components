import m from "mithril";
import classNames from "classnames";
import Component from "@/lib/Component";

const CLASS_CONTAIN = "contain-popup";

const SIDE_TOP    = "SIDE_TOP";
const SIDE_RIGHT  = "SIDE_RIGHT";
const SIDE_BOTTOM = "SIDE_BOTTOM";
const SIDE_LEFT   = "SIDE_LEFT";

const POSITION_START    = "POSITION_START";
const POSITION_END      = "POSITION_END";
const POSITION_CENTER   = "POSITION_CENTER";
const POSITION_FLEXIBLE = "FLEXIBLE";

const TRIGGER_SIZE  = 6;
const BOTTOM_BORDER = 10;

const DEFAULT_TRIGGER_CONFIG = { side: SIDE_TOP, position: POSITION_END, topBorder: 0 };

class PopUp extends Component {
    oninit() {
        this.triggerConfig = { ...DEFAULT_TRIGGER_CONFIG, ...this.attrs.trigger };
    }

    oncreate(vnode) {
        let selectorModal = this.attrs.modal,
            modal         = selectorModal ? document.querySelector(selectorModal) : null;

        this._isModal = !!modal;
        this._parent  = modal || document.body;

        this._element = vnode.dom;

        this._parent.appendChild(vnode.dom);
        this._parent.classList.add(CLASS_CONTAIN);

        this.calcPosition(vnode.dom, this._isModal);

        this.onScroll = () => this.calcPosition(vnode.dom, this._isModal);

        window.addEventListener("scroll", this.onScroll);
    }

    onremove() {
        window.removeEventListener("scroll", this.onScroll);
        this.onScroll = undefined;
        this._element.remove();
        this._element = null;
    }

    onbeforeremove() {
        this._parent.classList.remove(CLASS_CONTAIN);
    }

    onupdate(vnode) {
        this.calcPosition(vnode.dom, this._isModal);
    }

    view({ children, attrs }) {
        let classesTrigger = classNames(
            "popup-trigger",
            { "side-top": this.triggerConfig.side === SIDE_TOP },
            { "side-right": this.triggerConfig.side === SIDE_RIGHT },
            { "side-bottom": this.triggerConfig.side === SIDE_BOTTOM },
            { "side-left": this.triggerConfig.side === SIDE_LEFT }
        );

        return (
            <div
                className="popup-container"
                data-popup-key={attrs["data-popup-key"]}
            >
                <span className={classesTrigger}/>
                {children}
            </div>
        );
    }

    calcPosition(popUpEl, isModal) {
        let selectorParent, parents, parent, boxParent, boxPopUpEl, boxModal, top, left,
            topParentByWindow, leftParentByWindow, diffWidth, index, topBorder, triggerEl,
            topTrigger, leftTrigger, heightOffset, widthOffset;

        selectorParent = "[data-popup-parent-key='" + this.attrs["data-popup-key"] + "']";
        parents        = document.querySelectorAll(selectorParent);
        triggerEl      = popUpEl.querySelector(".popup-trigger");

        for (index = 0; index < parents.length; index++) {
            if (parents[index].offsetParent) {
                parent = parents[index];
                break;
            }
        }

        if (!parent) {
            return;
        }

        boxParent  = parent.getBoundingClientRect();
        boxPopUpEl = popUpEl.getBoundingClientRect();
        boxModal   = this._parent.getBoundingClientRect();

        heightOffset = isModal ? this._parent.scrollTop : window.pageYOffset;
        widthOffset  = isModal ? this._parent.scrollLeft : window.pageXOffset;

        topParentByWindow  = boxParent.top + heightOffset;
        leftParentByWindow = boxParent.left + widthOffset;
        topBorder          = this.triggerConfig.topBorder + heightOffset;

        if (isModal) {
            topParentByWindow  = topParentByWindow - boxModal.top;
            leftParentByWindow = leftParentByWindow - boxModal.left;
        }

        diffWidth = boxParent.width - boxPopUpEl.width;

        if (this.triggerConfig.side === SIDE_TOP || this.triggerConfig.side === SIDE_BOTTOM) {
            left        = leftParentByWindow + (diffWidth > 0 ? diffWidth : 0);
            leftTrigger = (boxPopUpEl.width / 2) - (TRIGGER_SIZE / 2);

            if (this.triggerConfig.position === POSITION_CENTER) {
                left = left - (boxPopUpEl.width / 2) - (TRIGGER_SIZE / 2) + (boxParent.width / 2);
            }

            if (this.triggerConfig.side === SIDE_TOP) {
                top = topParentByWindow + boxParent.height + TRIGGER_SIZE;
            } else {
                top = topParentByWindow - boxModal.height;
            }

            triggerEl.style.left = leftTrigger + "px";
        } else if (this.triggerConfig.side === SIDE_LEFT || this.triggerConfig.side === SIDE_RIGHT) {
            top = topParentByWindow;

            if (this.triggerConfig.side === SIDE_LEFT) {
                left = leftParentByWindow + boxParent.width + TRIGGER_SIZE * 2;
            } else {
                left = leftParentByWindow - boxModal.width;
            }

            if (this.triggerConfig.position === POSITION_CENTER) {
                let diff = 0;

                top        = top - (boxPopUpEl.height / 2) + (boxParent.height / 2);
                topTrigger = (boxPopUpEl.height / 2) - (TRIGGER_SIZE / 2);

                if (top < topBorder) {
                    diff       = topBorder - top;
                    topTrigger = topTrigger - diff;
                    top        = top + diff;
                } else if ((boxPopUpEl.height + top - heightOffset) > boxModal.height) {
                    diff       = boxPopUpEl.height + top - heightOffset - boxModal.height + BOTTOM_BORDER;
                    topTrigger = topTrigger + diff;
                    top        = top - diff;
                }
            }

            triggerEl.style.top = topTrigger + "px";
        }

        popUpEl.style.top  = top + "px";
        popUpEl.style.left = left + "px";
    }
}

export default PopUp;
