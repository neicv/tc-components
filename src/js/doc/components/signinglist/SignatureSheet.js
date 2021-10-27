import m from 'mithril';
import Component from '@/lib/Component';

const TEXT_BLANK    = 'Не указано';
const NAME_SUBINFO  = 'subinfo';
const NAME_INFO     = 'info';

const DELAY_INIT_MAX_HEIGHT = 100;

class SignatureSheet extends Component {
    oninit(vnode) {
        this.model                = {};
        this.oldVDI               = viewDetailsInfo;
        this._element             = vnode;
        const { viewDetailsInfo } = this.attrs;
        this.isSigningInfoOpen    = viewDetailsInfo || false;
    }

    view() {
        const { signingList, viewDetailsInfo, shortSigningList, index , itemTitleClass} = this.attrs;

        if (this.oldVDI !== viewDetailsInfo) {
            this.oldVDI = viewDetailsInfo
            this.refreshModel(viewDetailsInfo)
        }

        return (
            <div className="sign-sheet turbo-visa">
                <div className="turbo-visa__history-item">
                    <div className={`history-item__title ${itemTitleClass || ''}`}>Визированиe</div>

                    <div className="mt10 ml15 tile-list_bordered history-item__content">
                        <div
                            className={`v-align-middle pr0 pt10 pr15 ${this.isSigningInfoOpen ? 'timeline-open' : ''}`}
                            onclick={event => this.toggleInfoPanel(event)}
                        >
                            <div
                                className="js-ellipsis timeline-accordion-title"
                                aria-expanded={this.isSigningInfoOpen}
                            >
                                <i title="Лист согласования" className="font-icon template-icon fs18 pr5"></i>
                                <span className="v-align-top fs16 text-right">Лист согласования</span>
                            </div>
                            <If condition={signingList.length !== 0}>
                                <div
                                    className="timeline-accordion-subcontent pt10 short-info"
                                    oncreate={element => this.setMaxHeightContent(element, NAME_SUBINFO, true)}
                                >
                                    <div className="spacebetween pb5">
                                        <div className="text-clipped js-ellipsis-text display-flex">
                                            <i title="Статус" className="font-icon pencil color-blue fs15 pr5 inline-block"></i>
                                            <span className='v-align-middle fs12'>Статус:</span>
                                        </div>
                                        <span className='text-right display-initial'>
                                            <i
                                                title={shortSigningList.agreeStatus}
                                                className={`font-icon ${shortSigningList.agreed ? 'circle-tick color-success' : 'circle-close color-error'} fs15 pr5`}
                                            ></i>
                                            <span className="v-align-text-top fs12">{shortSigningList.agreeStatus}</span>
                                        </span>
                                    </div>
                                    <If condition={shortSigningList.comments}>
                                        <div className="fs12">
                                            <div className="text-clipped js-ellipsis-text display-flex pb5">
                                                <i title="Комментарий" className="font-icon icon-chat color-blue fs15 pr5 inline-block"></i>
                                                <span title="Комментарий" className="text-clipped v-align-middle fs12">Комментарий:</span>
                                            </div>
                                            <div className="ml20 fs12 text-justify pb5">&nbsp;&nbsp;&nbsp;&nbsp;{shortSigningList.comments}</div>
                                            <div className="fs11 text-right">{shortSigningList.fio}</div>
                                            <div className="fs11 text-right">{shortSigningList.date}</div>
                                        </div>
                                    </If>
                                </div>
                            </If>
                        </div>

                        <div
                            className="timeline-accordion-content short-info"
                            hidden={this.isSigningInfoOpen}
                            oncreate={element => this.setMaxHeightContent(element, NAME_INFO)}
                            ontransitionend={() => this.isSigningInfoOpen = !this.isSigningInfoOpen}
                        >
                            {
                                signingList.slice(0).reverse().map((item, index) => {
                                    const {date, fio, position, agency, role, comments, agreed, agreeStatus} = item;

                                    return (
                                        <div className="pb5 pt5 pr15">
                                            <div className="js-ellipsis" >
                                                <div className="text-clipped js-ellipsis-text">
                                                    <i title="ФИО" className="font-icon user color-blue fs15 pr5 text-bold inline-block"></i>
                                                    <span title={fio || TEXT_BLANK} className="text-clipped v-align-middle fs12">{fio || TEXT_BLANK}</span>
                                                </div>
                                            </div>

                                            <div className="v-align-middle">
                                                <div className="js-ellipsis">
                                                    <div className="text-clipped js-ellipsis-text">
                                                        <i title="Организация" className="font-icon case color-blue fs15 pr5 inline-block"></i>
                                                        <span title={agency || TEXT_BLANK} className="text-clipped v-align-middle fs12">{agency || TEXT_BLANK}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="v-align-middle">
                                                <div className="js-ellipsis">
                                                    <div className="text-clipped js-ellipsis-text">
                                                        <i title="Должность" className="font-icon position-icon color-blue fs15 pr5"></i>
                                                        <span title={position || TEXT_BLANK} className="text-clipped v-align-middle fs12">{position || TEXT_BLANK}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="v-align-middle">
                                                <div className="js-ellipsis">
                                                    <div className="text-clipped js-ellipsis-text">
                                                        <i title="Роль" className="font-icon role-icon color-blue fs15 pr5 inline-block"></i>
                                                        <span title={role || TEXT_BLANK} className="text-clipped v-align-middle fs12">{role || TEXT_BLANK}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <If condition={comments}>
                                                <div className="v-align-middle">
                                                    <div className="js-ellipsis">
                                                        <div className="text-clipped js-ellipsis-text">
                                                            <i title="Комментарий" className="font-icon icon-chat color-blue fs15 pr5 inline-block"></i>
                                                            <span title="Комментарий" className="text-clipped v-align-middle fs12">Комментарий:</span>
                                                        </div>
                                                        <div className="ml20 fs11 text-justify">&nbsp;&nbsp;&nbsp;&nbsp;{comments}</div>
                                                    </div>
                                                </div>
                                            </If>
                                            <div className="spacebetween">
                                                <div className="text-clipped js-ellipsis-text">
                                                    <i title="Статус" className="font-icon pencil color-blue fs15 pr5 inline-block"></i>
                                                    <span className='v-align-middle fs12'>Статус:</span>
                                                </div>
                                                <span className='text-right'>
                                                    <i
                                                        title={agreeStatus}
                                                        className={`font-icon ${agreed ? 'circle-tick color-success' : 'circle-close color-error'} fs15 pr5`}
                                                    ></i>
                                                    <span className="v-align-text-top fs12">{agreeStatus}</span>
                                                </span>
                                            </div>
                                            <div className="v-align-middle">
                                                <div className="js-ellipsis">
                                                    <div className="mr0 text-right">
                                                        <span title={date || ""} className="text-clipped v-align-middle fs11">{date || ""}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
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
}

export default SignatureSheet;
