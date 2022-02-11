
import m from 'mithril';
import Component from '@/lib/Component';
import PopUp from "@/components/plugins/PopUp";
import Tooltip from './tooltip';
import Dropdown from '@/components/plugins/Dropdown';

const TEXT_BLANK              = 'Не указано';
const DEFAULT_BACKGROND_COLOR = '#7A7A7A';
const DEFAULT_TEXT_USER_IDLE  = '(Бездействует)';

class PresenceAndCollab extends Component {
    oninit() {
        this.triggerOpen    = false;
        this.isImmediately  = false;
        this.openId         = false;
        this.isMenuView     = false;
        this.widthContainer = null;

        this.listenerOnResize = () => this.resizeAction();

        window.addEventListener("resize", this.listenerOnResize);
    }

    onremove() {
        window.removeEventListener("resize", this.listenerOnResize);
    }

    view() {
        const { items = [], isMenuView = false } = this.attrs;
        const count = items.length;
        const countReaders = this.getCountReaders(items.length);

        let wdthContent  = 36 + (isMenuView ? 0 : 28 * count);

        if (count === 0) {
            return null;
        }
        // Если 1 пользователь, то вид в виде виджета
        this.isMenuView = count === 1 ? false : isMenuView;

        if (this.widthContainer < wdthContent &&  count > 1) {
            this.isMenuView = true;
            wdthContent     = 36;
        }

        return (
            <div
                id="tc-presence-container"
                class="tc-presence-container tc-presence-inline-block tc-titlebar-button"
                oncreate={this.setWidthParentContainer.bind(this)}
                onupdate={this.setWidthParentContainer.bind(this)}
            >
                <div id="tc-presence" class="tc-presence-inline-block">
                    <div
                        class="tc-presence-widget tc-presence-inline-block"
                        style={`width: ${wdthContent}px;`}
                    >
                        {this.isMenuView
                        ?
                            <span>
                                <div
                                    className="tc-presence-inline-block tc-flat-menu-button tc-presence-widget-overflow-button"
                                    role="button"
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                    style={`user-select: none; transition: background 0.5s ease 0s; ${ this.isMenuView ? '' : 'display: none;'}`}
                                    aria-hidden="true"
                                    aria-label={countReaders}
                                    data-popup-parent-key='titleCountReaders'
                                    onclick={() => this.clickFlatMenuButton()}
                                    title={countReaders}
                                ></div>
                                <span class='tc-flat-menu-button-dropdown'>
                                    <span
                                        class='tc-flat-menu-button-dropdown-on'
                                    >
                                    <Dropdown center={true} >
                                        <Dropdown.Label indicate={true} className='tc-flat-menu-button-caption' title={countReaders}>
                                            <span id='tc-presence-elemen-dropdown'>
                                                {count}
                                            </span>
                                        </Dropdown.Label>
                                        <Dropdown.Inner className='tc-presence-widget-overflow-menu'>
                                            <div
                                                class=" tc-presence-menuheader tc-presence-menuheader-disabled"
                                                aria-disabled="true"
                                                style="user-select: none;"
                                            >
                                                {countReaders}
                                            </div>
                                            {
                                                items.map(item => {
                                                    return (
                                                        <div
                                                            class="tc-presence-menuitem"
                                                            role="menuitem"
                                                            style="user-select: none;"
                                                            id={item.id}
                                                            data-name={item.fio}
                                                        >
                                                            <div
                                                                class="tc-presence-menuitem-content"
                                                                onmouseenter={() => this.setImmediatelyOn()}
                                                                onmouseleave={() => this.setImmediatelyOff()}
                                                                onclick={() => this.setImmediatelyOn()}
                                                            >
                                                                {this.getItemView(item, this.isMenuView)}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Dropdown.Inner>
                                    </Dropdown>
                                    </span>
                                </span>
                            </span>
                        :
                            <div class="tc-presence-widget-inner tc-presence-inline-block">
                                <div
                                    class="tc-presence-widget-collabs tc-presence-inline-block"
                                    onmouseenter={() => this.setImmediatelyOn()}
                                    onmouseleave={() => this.setImmediatelyOff()}
                                >
                                    {items.map(item => this.getItemView(item, this.isMenuView))}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }

    getItemView(item = {}, isMenuView = false) {
        const statusLabel = item.active ? "" : DEFAULT_TEXT_USER_IDLE;
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
                    immediately={this.isImmediately}
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
        return (
            <div
                className="tc-tooltip-content-card"
                key={`tc_ttc_${item.id}`}
                onclick={(e) => {e.preventDefault(); e.stopPropagation()}}
            >
                <div className="tc-tooltip-content-card-body">
                    <figure class="tc-tooltip-content-image-figure">
                        <img
                            class="tc-tooltip-content-image"
                            src={item.src}
                            alt={item.fio}
                        />
                        <figcaption>
                            <div class="tc-tooltip-content-figure-title fs18">
                                {item.fio}
                            </div>
                            <div class="tc-tooltip-content-figure-title fs14">
                                {item.email}
                            </div>
                            <div className="tc-tooltip-content-figure-title fs14">
                                <span className={`status ${
                                        item.active
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    {
                                        item.active
                                        ? "(Активен)"
                                        : "(Бездействует)"
                                    }
                                </span>
                            </div>
                        </figcaption>
                    </figure>
                </div>
                <hr />

                <If condition={item.isShowMore}>
                    <div>
                        <div className="v-align-middle pr15 pb5">
                            <div className="js-ellipsis">
                                <div className="text-clipped js-ellipsis-text display-flex">
                                    <i
                                        title="Организация"
                                        className="font-icon case color-blue fs15 pr5 inline-block"
                                    ></i>
                                    <span
                                        title={item.agency || TEXT_BLANK}
                                        className="text-clipped v-align-middle fs12"
                                    >
                                        {item.agency || TEXT_BLANK}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <If condition={item.fio !== ""}>
                            <div className="v-align-middle pr15 pb5">
                                <div className="js-ellipsis">
                                    <div className="text-clipped js-ellipsis-text display-flex">
                                        <i
                                            title="Должность"
                                            className="font-icon position-icon color-blue fs15 pr5"
                                        ></i>
                                        <span
                                            title={item.position || TEXT_BLANK}
                                            className="text-clipped v-align-middle fs12"
                                        >
                                            {item.position || TEXT_BLANK}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="v-align-middle pr15 pb5">
                                <div className="js-ellipsis">
                                    <div className="text-clipped js-ellipsis-text display-flex">
                                        <i
                                            title="Роль"
                                            className="font-icon role-icon color-blue fs15 pr5 inline-block"
                                        ></i>
                                        <span
                                            title={item.role || TEXT_BLANK}
                                            className="text-clipped v-align-middle fs12"
                                        >
                                            {item.role || TEXT_BLANK}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </If>
                    </div>
                </If>
                <div
                    className="tc-tooltip-content-figure-title"
                    onclick={(event) => this.handleShowMoreClick(event, item)}
                >
                    <div class="pointer text-right">
                        <div class="solid-link color-blue">
                            {item.isShowMore ? "Скрыть" : "Подробнее"}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    setWidthParentContainer({ dom }) {
        this.widthContainer = dom.parentElement.getBoundingClientRect().width;
    }

    resizeAction() {
        setTimeout(() => m.redraw(), 0);
    }

    clickFlatMenuButton() {
        let event = new Event("click", {bubbles: true});
        let elem = document.getElementById('tc-presence-elemen-dropdown');

        if (elem) {
            elem.dispatchEvent(event, true);
        }
    }

    getCountReaders(len = '') {
        let countReaders = '';

        if (len) {
            countReaders = 'Всего ' + len + ' читателя';
        }

        return countReaders;
    }

    handleShowMoreClick(e, item) {
        e.preventDefault();
        e.stopPropagation();
        item.isShowMore = !item.isShowMore;
    }

    handleEnter(id) {
        if (this.openId !== id) {
            const { items } = this.attrs;

            let element = items.find((el) => el.id === id);
            if (element) {
                element.isShowMore = false;
            }
        }
    }

    handleOpen(id) {
        this.triggerOpen = true;
        this.openId = id;
        this.setImmediatelyOn();
    }

    setImmediatelyOn() {
        this.isImmediately = this.triggerOpen;
    }

    setImmediatelyOff() {
        if (this.triggerOpen) {
            this.openId        = false;
            this.triggerOpen   = false;
            this.isImmediately = false;
        }
    }
}

export default PresenceAndCollab;
