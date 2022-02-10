import m from 'mithril';
import Component from "@/lib/Component";
import PopUpTooltip from "@/components/plugins/PopUpTooltip";
import ToolTipContent from './TooltipContent';

const DEFAULT_ENTER_DELAY = 500;
const DEFAULT_LEAVE_DELAY = 500;

class Tooltip extends Component {
    oninit() {
        this.isOpen = false;
        this.enterTimer = null;
        this.enterDelay = DEFAULT_ENTER_DELAY;
        this.leaveDelay = DEFAULT_LEAVE_DELAY;
        this.immediately = false;
        this.isShowTooltipContent = false;
    }

    view({ children }) {
        const dataPopupKey = this.attrs["data-popup-key"];
        const {
            title       = "",
            content     = "",
            maxWidth    = "",
            minWidth    = "",
            maxHeight   = "",
            position    = "POSITION_CENTER",
            className,
        } = this.attrs;

        return (
            <div
                className={className}
                data-popup-parent-key={dataPopupKey}
                onmouseenter={(event) => this.handleEnter(event)}
                onmouseleave={(event) => this.handleLeave(event)}
            >
                {children}
                <If condition={this.isOpen}>
                    <PopUpTooltip
                        data-popup-key={dataPopupKey}
                        side="SIDE_TOP"
                        position={position}
                    >
                        <Choose>
                            <When condition={title}>{title}</When>
                            <When condition={content}>
                                <ToolTipContent
                                    content={content.content}
                                    className={content.className}
                                    maxWidth={maxWidth}
                                    maxHeight={maxHeight}
                                    minWidth={minWidth}
                                    onmouseenter={() => this.handleEnterToolTipContent()}
                                    onmouseleave={() => this.handleLeaveToolTipContent()}
                                />
                            </When>
                        </Choose>
                    </PopUpTooltip>
                </If>
            </div>
        );
    }

    handleEnter(event) {
        const { handleEnter, immediately = false } = this.attrs;

        if (typeof handleEnter === "function") {
            handleEnter(event);
        }

        clearTimeout(this.enterTimer);
        clearTimeout(this.leaveTimer);

        if (this.enterDelay && !immediately) {
            this.enterTimer = setTimeout(() => {
                this.handleOpen(event);
            }, this.enterDelay);
        } else {
            this.handleOpen(event);
        }
    }

    handleOpen(event) {
        this.isOpen = true;
        const { handleOpen } = this.attrs;

        if (typeof handleOpen === "function") {
            handleOpen(event);
        }

        setTimeout(() => m.redraw(), 0);
    }

    handleLeave(event) {
        const { handleLeave } = this.attrs;
        let isImmediately = false;

        setTimeout(() => {
            const { immediately = false } = this.attrs;
            isImmediately = immediately;

            if (typeof handleLeave === "function") {
                handleLeave();
            }
        }, 0);

        setTimeout(() => {
            clearTimeout(this.enterTimer);
            clearTimeout(this.leaveTimer);

            if (isImmediately) {
                this.handleClose(event);
            } else {
                this.leaveTimer = setTimeout(() => {
                    this.handleClose(event);
                }, this.leaveDelay);
            }
        }, 100);
    }

    handleClose(event) {
        if (this.isShowTooltipContent) return;

        this.isOpen = false;
        const { handleClose } = this.attrs;

        if (typeof handleClose === "function") {
            handleClose(event);
        }

        setTimeout(() => m.redraw(), 0);
    }

    handleEnterToolTipContent() {
        this.isShowTooltipContent = true;
    }

    handleLeaveToolTipContent() {
        this.isShowTooltipContent = false;
        this.handleLeave();
    }
}

export default Tooltip;
