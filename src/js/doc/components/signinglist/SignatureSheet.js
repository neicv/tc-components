import m from 'mithril';
import Component from '@/lib/Component';

const TEXT_BLANK       = 'Не указано';
const TEXT_STATUS_AGREED    = 'Согласовано';
const TEXT_STATUS_DISAGREED = 'Не согласовано';

const NAME_SUBINFO  = 'subinfo';
const NAME_INFO     = 'info';

const DELAY_INIT_MAX_HEIGHT = 100;

class SignatureSheet extends Component {
    oninit(vnode) {
        const { viewDetailsInfo } = this.attrs;
        this.isSigningInfoOpen = viewDetailsInfo || false;
        this._element          = vnode;
        this.oldVDI            = viewDetailsInfo;
        this.model = {};
    }

    view() {
        const { signingList, viewDetailsInfo, index } = this.attrs;

        if (this.oldVDI !== viewDetailsInfo) {
            this.oldVDI = viewDetailsInfo
            this.refreshModel(viewDetailsInfo)
        }

        const shortSigningList = this.getShortSigningList(signingList);

        return (
            <div class="sign-sheet pr15">   {/*"v-align-middle pr0 pt10 pb10">*/}

                <div
                    className={`v-align-middle pr0 pt10 pb10 ${this.isSigningInfoOpen ? 'timeline-open' : ''}`}
                    onclick={event => this.toggleInfoPanel(event)}
                >
                    <div class="js-ellipsis pb10 timeline-accordion-title" aria-expanded={this.isSigningInfoOpen}>
                        <i title="Визирование" class="font-icon template-icon fs18 pr5"></i>
                        <span class="v-align-top fs15 text-right">Лист Визирования</span>
                    </div>
                    <If condition={signingList.length !== 0}>
                        <div
                            class="timeline-accordion-subcontent short-info"
                            oncreate={element => this.setMaxHeightContent(element, NAME_SUBINFO, true)}
                        >
                            <div class="spacebetween pb5">
                                <div class="text-clipped js-ellipsis-text display-flex">
                                    <i title="Статус" class="font-icon pencil color-blue fs15 pr5 inline-block"></i>
                                    <span class='v-align-middle fs12'>Статус:</span>
                                </div>
                                <span class='text-right display-initial'>
                                    <i
                                        title={shortSigningList.agreeStatus}
                                        className={`font-icon ${shortSigningList.agreed ? 'circle-tick success' : 'circle-close error'} fs15 pr5`}
                                    ></i>
                                    <span class="v-align-text-top fs12">{shortSigningList.agreeStatus}</span>
                                </span>
                            </div>
                            <If condition={shortSigningList.comments}>
                                <div class="fs12">
                                    <div class="text-clipped js-ellipsis-text display-flex pb5">
                                        <i title="Комментарий" class="font-icon icon-chat color-blue fs15 pr5 inline-block"></i>
                                        <span title="Комментарий" class="text-clipped v-align-middle fs12">Комментарий:</span>
                                    </div>
                                    <div class="ml20 fs12 text-justify pb5">&nbsp;&nbsp;&nbsp;&nbsp;{shortSigningList.comments}</div>
                                    <div class="fs11 text-right">{shortSigningList.fio}</div>
                                    <div class="fs11 text-right">{shortSigningList.date}</div>
                                </div>
                            </If>
                        </div>
                    </If>
                </div>

                <div
                    class="timeline-accordion-content short-info"
                    // hidden={this.isSigningInfoOpen}
                    oncreate={element => this.setMaxHeightContent(element, NAME_INFO)}
                    ontransitionend={() => this.isSigningInfoOpen = !this.isSigningInfoOpen}
                >
                    {
                        signingList.slice(0).reverse().map((item, index) => {
                            const {date, fio, position, agency, role, comments, agreed, agreeStatus} = item;

                            return (
                                <div class="pb5 pt5">
                                    <div class="js-ellipsis" >
                                        <div class="text-clipped js-ellipsis-text">
                                            <i title="ФИО" class="font-icon user color-blue fs15 pr5 text-bold inline-block"></i>
                                            <span title={fio || TEXT_BLANK} class="text-clipped v-align-middle fs12">{fio || TEXT_BLANK}</span>
                                        </div>
                                    </div>

                                    <div class=" v-align-middle pr15">
                                        <div class="js-ellipsis">
                                            <div class="text-clipped js-ellipsis-text">
                                                <i title="Организация" class="font-icon case color-blue fs15 pr5 inline-block"></i>
                                                <span title={agency || TEXT_BLANK} class="text-clipped v-align-middle fs12">{agency || TEXT_BLANK}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" v-align-middle pr15">
                                        <div class="js-ellipsis">
                                            <div class="text-clipped js-ellipsis-text">
                                                <i title="Должность" class="font-icon position-icon color-blue fs15 pr5"></i>
                                                <span title={position || TEXT_BLANK} class="text-clipped v-align-middle fs12">{position || TEXT_BLANK}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="v-align-middle pr15">
                                        <div class="js-ellipsis">
                                            <div class="text-clipped js-ellipsis-text">
                                                <i title="Роль" class="font-icon role-icon color-blue fs15 pr5 inline-block"></i>
                                                <span title={role || TEXT_BLANK} class="text-clipped v-align-middle fs12">{role || TEXT_BLANK}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <If condition={comments}>
                                        <div class="v-align-middle pr15 ">
                                            <div class="js-ellipsis">
                                                <div class="text-clipped js-ellipsis-text">
                                                    <i title="Комментарий" class="font-icon icon-chat color-blue fs15 pr5 inline-block"></i>
                                                    <span title="Комментарий" class="text-clipped v-align-middle fs12">Комментарий:</span>
                                                </div>
                                                <div class="ml20 fs11 text-justify">&nbsp;&nbsp;&nbsp;&nbsp;{comments}</div>
                                            </div>
                                        </div>
                                    </If>
                                    <div class="spacebetween">
                                        <div class="text-clipped js-ellipsis-text">
                                            <i title="Статус" class="font-icon pencil color-blue fs15 pr5 inline-block"></i>
                                            <span class='v-align-middle fs12'>Статус:</span>
                                        </div>
                                        <span class='text-right'>
                                            <i
                                                title={agreeStatus}
                                                className={`font-icon ${agreed ? 'circle-tick success' : 'circle-close error'} fs15 pr5`}
                                            ></i>
                                            <span class="v-align-text-top fs12">{agreeStatus}</span>
                                        </span>
                                    </div>
                                    <div class="v-align-middle">
                                        <div class="js-ellipsis">
                                            <div class="mr0 text-right">
                                                <span title={date || ""} class="text-clipped v-align-middle fs11">{date || ""}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    toggleInfoPanel(event) {
        let next,
            targ = event.currentTarget;

        if (targ.tagName !== 'DIV' && targ.nextElementSibling) {
            return;
        }

        this.setTargetMAxHeight(targ.children[1]);
        this.setTargetMAxHeight(targ.nextElementSibling);
    }

    setTargetMAxHeight(targ) {
        if (targ === undefined) {
            return;
        }

        if (targ.style.maxHeight && targ.style.maxHeight !== '0px') {
            targ.style.maxHeight = '0px';
        } else {
            targ.style.maxHeight = targ.scrollHeight + "px";
        }
    }

    setMaxHeightContent(element, name, reverse = false) {
        let trigger;

        if (! this.model.hasOwnProperty(name)) {
            this.model[name] = [];
        }

        this.model[name].push(element.dom);

        trigger = reverse ? !this.isSigningInfoOpen : this.isSigningInfoOpen;

        setTimeout(() => {
            let el = element.dom;

            if (trigger) {
                el.style.maxHeight = el.scrollHeight + "px";
            } else {
                el.style.maxHeight = "0px"
            }

        }, DELAY_INIT_MAX_HEIGHT);
    }

    refreshModel(val) {
        if (Object.keys(this.model).length !== 0) {
            this.model[NAME_INFO].forEach(el => {
                if (val) {
                    el.style.maxHeight = el.scrollHeight + "px";
                } else {
                    el.style.maxHeight = "0px"
                }
            })
            this.model[NAME_SUBINFO].forEach(el => {
                if (!val) {
                    el.style.maxHeight = el.scrollHeight + "px";
                } else {
                    el.style.maxHeight = "0px"
                }
            })
        }
    }

    getShortSigningList(list) {
        let disapproveList,
            len,
            shortList = {
                comments: "",
                agreed: false,
                agreeStatus: "",
                fio: "",
                date: ""
            }

        if (!list || list.length === 0) {
            return shortList;
        }

        disapproveList = list.filter(el => el.agreed === false);

        len = disapproveList.length;

        if (len !==0) {
            // Последний коммент из не согласованных
            shortList.agreed      = false;
            shortList.comments    = disapproveList[len - 1].comments || '';
            shortList.agreeStatus = disapproveList[len - 1].agreeStatus || TEXT_STATUS_AGREED;
            shortList.fio         = disapproveList[len - 1].fio || '';
            shortList.date        = disapproveList[len - 1].date || '';
        } else {
            shortList.agreed      = true;
            shortList.comments    = list[list.length - 1].comments || '';
            shortList.agreeStatus = list[list.length - 1].agreeStatus || TEXT_STATUS_DISAGREED;
        }

        return shortList;
    }
}

export default SignatureSheet;
