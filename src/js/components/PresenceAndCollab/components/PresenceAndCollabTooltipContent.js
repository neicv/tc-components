
import m from 'mithril';
import Component from '@/lib/Component';
import {translate} from "@/localizations";
import { LANG } from '../constants';

class PresenceAndCollabTooltipContent extends Component {
    oninit() {
        this.textBlank      = translate(`${LANG}.notSpecified`);
        this.textUserIdle   = translate(`${LANG}.userIdle`);
        this.textUserActive = translate(`${LANG}.userActive`);
    }

    view() {
        const { item } = this.attrs;

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
                                        ? this.textUserActive
                                        : this.textUserIdle
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
                                        title={translate(`${LANG}.organization`)}
                                        className="font-icon case color-blue fs15 pr5 inline-block"
                                    ></i>
                                    <span
                                        title={item.agency || this.textBlank}
                                        className="text-clipped v-align-middle fs12"
                                    >
                                        {item.agency || this.textBlank}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <If condition={item.fio !== ""}>
                            <div className="v-align-middle pr15 pb5">
                                <div className="js-ellipsis">
                                    <div className="text-clipped js-ellipsis-text display-flex">
                                        <i
                                            title={translate(`${LANG}.position`)}
                                            className="font-icon position-icon color-blue fs15 pr5"
                                        ></i>
                                        <span
                                            title={item.position || this.textBlank}
                                            className="text-clipped v-align-middle fs12"
                                        >
                                            {item.position || this.textBlank}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="v-align-middle pr15 pb5">
                                <div className="js-ellipsis">
                                    <div className="text-clipped js-ellipsis-text display-flex">
                                        <i
                                            title={translate(`${LANG}.role`)}
                                            className="font-icon role-icon color-blue fs15 pr5 inline-block"
                                        ></i>
                                        <span
                                            title={item.role || this.textBlank}
                                            className="text-clipped v-align-middle fs12"
                                        >
                                            {item.role || this.textBlank}
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
                            {item.isShowMore ? translate(`${LANG}.hide`) : translate(`${LANG}.showMore`)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleShowMoreClick(e, item) {
        e.preventDefault();
        e.stopPropagation();
        item.isShowMore = !item.isShowMore;
    }
}

export default PresenceAndCollabTooltipContent;
