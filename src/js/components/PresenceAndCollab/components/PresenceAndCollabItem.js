import m from 'mithril';
import Component from '@/lib/Component';
import {translate} from "@/localizations";
import { LANG } from '../constants';
import Tooltip from './Tooltip/Tooltip';
import PresenceAndCollabTooltipContent from './PresenceAndCollabTooltipContent';

const DEFAULT_BACKGROND_COLOR = '#7A7A7A';

class PresenceAndCollabItem extends Component {

    view() {
        const { item = {}, isMenuView = false, isImmediately} = this.attrs;

        console.log('imm: ', isImmediately)

        const statusLabel = item.active ? "" : translate(`${LANG}.userIdle`);
        const ariaLabel   = item.fio + statusLabel;
        const content     = { content: this.generateToltipContent(item) };
        const position    = isMenuView ? "POSITION_END" : "POSITION_CENTER";
        const arrow       = !isMenuView;
        const offsetX     = isMenuView;
        const offsetY     = isMenuView;

        return (
            <div
                className={`tc-presence-widget-container tc-presence-inline-block ${isMenuView ? '' : 'tc-presence-widget-focus'}`}
                role="button"
                data-name={item.fio}
                id={item.id}
                tabindex="0"
                aria-label={ariaLabel}
                key={`presence_l_${item.id}`}
            >
                <Tooltip
                    data-popup-key={`presence_${item.id}`}
                    className={`tc-presence-widget ${
                        item.active
                            ? "tc-presence-widget-active"
                            : ""
                    }`}
                    content={content}
                    handleOpen={() => this.handleOpen(item.id)}
                    handleEnter={() => this.handleEnter(item.id)}
                    id={item.id}
                    immediately={isImmediately}
                    minWidth={300}
                    position={position}
                    arrow={arrow}
                    offsetX={offsetX}
                    offsetY={offsetY}
                >
                    <div class="tc-presence-widget-color-block tc-presence-inline-block">
                        <div
                            class="tc-presence-widget-image-container"
                            style={`background-color: ${DEFAULT_BACKGROND_COLOR};`}
                        >
                            {/* ${item.color} || rgb(255, 0, 122); */}
                            <div class="tc-presence-widget-image-border">
                                <img
                                    class="tc-presence-widget-image"
                                    src={item.src}
                                    alt={item.fio}
                                />
                            </div>
                        </div>
                        {
                            item.active
                            ? <div class="online-dot"></div>
                            : null
                        }
                    </div>
                    {
                       isMenuView
                       ?
                        <div className={`tc-presence-widget-name tc-presence-inline-block ${item.active ? 'active' : ''}`}>
                            {item.fio}
                            <span className="tc-presence-widget-idle-text"> {statusLabel}</span>
                        </div>
                       : null
                    }

                </Tooltip>
            </div>
        );
    }

    generateToltipContent(item) {
        return (<PresenceAndCollabTooltipContent item={item} />)
    }

    handleOpen(val) {
        const { handleOpen } = this.attrs;

        if (typeof handleOpen === "function") {
            handleOpen(val);
        }
    }

    handleEnter(val) {
        const { handleEnter } = this.attrs;

        if (typeof handleEnter === "function") {
            handleEnter(val);
        }
    }
}

export default PresenceAndCollabItem;
