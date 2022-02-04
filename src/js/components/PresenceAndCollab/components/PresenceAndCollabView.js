
import m from 'mithril';
import Component from '@/lib/Component';
import Tooltip from './tooltip';

const TEXT_BLANK = 'Не указано';

class PresenceAndCollab extends Component {
    oninit() {
        this.triggerOpen = false;
        this.isImmediately = false;
        this.openId = false;
    }

    view() {
        const { items } = this.attrs;
        const content = {};

        return (
            <div
                id="tc-presence-container"
                class="tc-presence-container tc-presence-inline-block tc-titlebar-button"
            >
                <div id="tc-presence" class="tc-presence-inline-block">
                    <div
                        class="tc-presence-plus-widget tc-presence-inline-block"
                        style="width: 36px;"
                    >
                        <div class="tc-presence-plus-widget-inner tc-presence-inline-block">
                            <div
                                class="tc-presence-plus-widget-collabs tc-presence-inline-block"
                                onmouseenter={() => this.setImmediatelyOn()}
                                onmouseleave={() => this.setImmediatelyOff()}
                            >
                                {items.map((item, index) => {
                                    const ariaLabel =
                                        item.fio + item.active
                                            ? ""
                                            : "(Бездействует)";
                                    const content = {
                                        content:
                                            this.generateToltipContent(item),
                                    };

                                    return (
                                        <div
                                            class={`tc-presence-plus-collab-widget-container tc-presence-inline-block tc-presence-plus-collab-widget-focus`}
                                            role="button"
                                            data-name={item.fio}
                                            id={item.id}
                                            tabindex="0"
                                            aria-label={ariaLabel}
                                            key={`presence_l_${item.id}`}
                                        >
                                            <Tooltip
                                                data-popup-key={`presence_${item.id}`}
                                                className={`tc-presence-plus-collab-widget ${
                                                    item.active
                                                        ? "tc-presence-plus-collab-widget-active"
                                                        : ""
                                                }`}
                                                content={content}
                                                handleOpen={() =>
                                                    this.handleOpen(item.id)
                                                }
                                                handleEnter={() =>
                                                    this.handleEnter(item.id)
                                                }
                                                id={item.id}
                                                immediately={this.isImmediately}
                                                minWidth={300}
                                            >
                                                <div class="tc-presence-plus-collab-widget-color-block tc-presence-inline-block">
                                                    <div
                                                        class="tc-presence-plus-collab-widget-image-container"
                                                        style="background-color: rgb(122, 122, 122);"
                                                    >
                                                        {/* ${item.color} || rgb(255, 0, 122); */}
                                                        <div class="tc-presence-plus-collab-widget-image-border">
                                                            <img
                                                                class="tc-presence-plus-collab-widget-image"
                                                                src={item.src}
                                                                alt={item.fio}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    generateToltipContent(item) {
        return (
            <div className="tc-tooltip-content-card" key={`tc_ttc_${item.id}`}>
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
                    onclick={() => this.handleShowMoreClick(item)}
                >
                    <div class="pointer text-right">
                        <div class="dashed-link">
                            {item.isShowMore ? "Скрыть" : "Подробнее"}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleShowMoreClick(item) {
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
            this.triggerOpen = false;
            this.isImmediately = false;
            this.openId = false;
            // setTimeout(() => m.redraw(), 0);
        }
    }
}

export default PresenceAndCollab;
