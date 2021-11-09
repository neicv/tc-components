import m from 'mithril';
import Component from '@/lib/Component';
import {setHighLight} from "@/lib/highLight";

const TEXT_BLANK    = 'Не указано';
const NAME_SUBINFO  = 'subinfo';
const NAME_INFO     = 'info';

const DELAY_INIT_MAX_HEIGHT = 100;

class SignatureSheet extends Component {
    oninit(vnode) {
        this.model              = {};
        this.oldVDI             = viewDetailsInfo;
        this._element           = vnode;
        const {
            viewDetailsInfo,
            searchRegEx
        }                      = this.attrs;
        this.isSigningInfoOpen = viewDetailsInfo || false;
        this.searchRegEx       = searchRegEx || [];
    }

    view() {
        const { signingList = false, viewDetailsInfo, shortSigningList = [], index , previosInfo = '', itemTitleClass, searchRegEx = []} = this.attrs;

        this.searchRegEx = searchRegEx;

        if (this.oldVDI !== viewDetailsInfo) {
            this.oldVDI = viewDetailsInfo
            this.refreshModel(viewDetailsInfo)
        }

        const previosDate   = previosInfo.date;
        const previosStatus = previosInfo.title;

        return (
            <div className="sign-sheet turbo-visa">
                <If condition={signingList.length !== 0}>
                <div className="turbo-visa__history-item">
                    <div
                        className={`history-item__title pr15 ${itemTitleClass || ''} ${this.isSigningInfoOpen ? 'timeline-open' : ''}`}
                        onclick={event => this.toggleInfoPanel(event)}
                    >
                        <span className="timeline-accordion-title">Визированиe <span className="fs14">(в статусе {previosStatus})</span>
                        </span>
                    </div>

                    <div className={`mt10 tile-list_bordered history-item__content`}>
                        <If condition={shortSigningList}>
                            <div
                                className="timeline-accordion-subcontent ml10"
                                //pt10 short-info ml15 pr15
                                oncreate={element => this.setMaxHeightContent(element, NAME_SUBINFO, true)}
                                // hidden={!this.isSigningInfoOpen}
                            >
                                <div class="v-card v-sheet theme--light full-info">
                                    <div className={`v-card__title ${shortSigningList.agreed ? 'aprove' : 'disaprove'}`}>
                                        <div className="spacebetween">
                                            <div className="text-clipped js-ellipsis-text display-inline-flex">
                                                <span className='v-align-middle fs12'>{shortSigningList.date.split(' ')[0]}:{shortSigningList.date.split(' ')[1]}</span>
                                            </div>
                                            <span className='text-right display-inline-flex'>
                                                <span className="fs12">{shortSigningList.agreeStatus}</span>
                                                <i
                                                    title={shortSigningList.agreeStatus}
                                                    // className={`font-icon ${shortSigningList.agreed ? 'circle-tick color-success' : 'circle-close color-error'} fs15 pl10`}
                                                    className={`font-icon ${shortSigningList.agreed ? 'circle-tick color-success' : 'circle-close color-white'} fs15 pl10`}
                                                ></i>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="v-card__body pb5 pt15 pr15 pl15">
                                        <Choose>
                                            <When condition={shortSigningList.comments}>
                                                <div className="js-ellipsis pb5" >
                                                    <div className="display-inline-flex">
                                                        <span className="v-align-middle fs12">Имеются разногласия в согласовании:</span>
                                                    </div>
                                                </div>
                                                <div className="v-align-middle pb5">
                                                    <div className="js-ellipsis">
                                                        <div className="text-clipped js-ellipsis-text display-inline-flex">
                                                            <i title="Комментарий" className="font-icon icon-chat color-blue fs15 pr5 inline-block"></i>
                                                            <span title="Комментарий" className="text-clipped v-align-middle fs12 text-bold">Комментарий:</span>
                                                        </div>
                                                        <div className="fs11 text-justify">{this.setHighLight(shortSigningList.comments)}</div>
                                                        <div className="fs11 text-right text-bold">{this.setHighLight(shortSigningList.fio)}</div>
                                                    </div>
                                                </div>
                                            </When>
                                            <Otherwise>
                                                <div className="js-ellipsis" >
                                                    <div className="display-inline-flex">
                                                        <span className="v-align-middle fs12">Согласовано всеми участниками.</span>
                                                    </div>
                                                </div>
                                            </Otherwise>
                                        </Choose>
                                    </div>
                                </div>
                            </div>
                        </If>

                        <div
                            className="timeline-accordion-content ml10"
                            hidden={this.isSigningInfoOpen}
                            oncreate={element => this.setMaxHeightContent(element, NAME_INFO)}
                            ontransitionend={() => this.isSigningInfoOpen = !this.isSigningInfoOpen}
                        >
                            {
                                signingList.slice(0).reverse().map((item, index) => {
                                    const {date = '', fio = TEXT_BLANK, position = TEXT_BLANK, agency = TEXT_BLANK, role = TEXT_BLANK, comments, agreed, agreeStatus} = item;

                                    const {isRender = true} = item;

                                    if (isRender === false) {
                                        return;
                                    }

                                    return (
                                        <div class="v-card v-sheet theme--light full-info">

                                            <div className={`v-card__title ${agreed ? 'aprove' : 'disaprove'}`}>
                                                <div className="spacebetween">
                                                    <div className="text-clipped js-ellipsis-text display-inline-flex">
                                                        {/* <i title="Статус" className="font-icon pencil color-blue fs15 pr5 inline-block"></i> */}
                                                        {/* <span className='v-align-middle fs12'>Статус:</span> */}
                                                        <span className='v-align-middle fs12'>{date.split(' ')[0]}:{date.split(' ')[1]}</span>
                                                    </div>
                                                    <span className='text-right display-inline-flex'>
                                                        <span className="fs12">{agreeStatus}</span>
                                                        <i
                                                            title={agreeStatus}
                                                            // className={`font-icon ${agreed ? 'circle-tick color-success' : 'circle-close color-error'} fs15 pl10`}
                                                            className={`font-icon ${agreed ? 'circle-tick color-success' : 'circle-close color-white'} fs15 pl10`}
                                                            // className={`font-icon ${agreed ? 'circle-tick color-white' : 'circle-close color-white'} fs15 pl10`}
                                                        ></i>

                                                    </span>
                                                </div>
                                            </div>

                                            <div className="v-card__body pb5 pt15 pr15 pl15">
                                                <div className="js-ellipsis" >
                                                    <div className="text-clipped js-ellipsis-text display-inline-flex">
                                                        <i title="ФИО" className="font-icon user color-blue fs15 pr5 text-bold inline-block"></i>
                                                        <span title={fio} className="text-clipped v-align-middle fs12 text-bold">{this.setHighLight(fio)}</span>
                                                    </div>
                                                </div>

                                                <div className="v-align-middle">
                                                    <div className="js-ellipsis">
                                                        <div className="text-clipped js-ellipsis-text display-inline-flex">
                                                            <i title="Организация" className="font-icon case color-blue fs15 pr5 inline-block"></i>
                                                            <span title={agency} className="text-clipped v-align-middle fs12">{this.setHighLight(agency)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="v-align-middle">
                                                    <div className="js-ellipsis">
                                                        <div className="text-clipped js-ellipsis-text display-inline-flex">
                                                            <i title="Должность" className="font-icon position-icon color-blue fs15 pr5"></i>
                                                            <span title={position} className="text-clipped v-align-middle fs12">{this.setHighLight(position)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="v-align-middle pb5">
                                                    <div className="js-ellipsis">
                                                        <div className="text-clipped js-ellipsis-text display-inline-flex">
                                                            <i title="Роль" className="font-icon role-icon color-blue fs15 pr5 inline-block"></i>
                                                            <span title={role} className="text-clipped v-align-middle fs12">{this.setHighLight(role)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <If condition={comments}>
                                                    <div className="v-align-middle pb5">
                                                        <div className="js-ellipsis">
                                                            <div className="text-clipped js-ellipsis-text display-inline-flex">
                                                                <i title="Комментарий" className="font-icon icon-chat color-blue fs15 pr5 inline-block"></i>
                                                                <span title="Комментарий" className="text-clipped v-align-middle fs12 text-bold">Комментарий:</span>
                                                            </div>
                                                            {/* <div className="ml20 fs11 text-justify">&nbsp;&nbsp;&nbsp;&nbsp;{comments}</div> */}
                                                            <div className="fs11 text-justify">{this.setHighLight(comments)}</div>
                                                        </div>
                                                    </div>
                                                </If>

                                                <div className="v-card__footer">
                                                    <div className="v-align-middle spacebetween">
                                                        <span className=" js-ellipsis display-inline-flex">
                                                            <i title="Статус" className="font-icon time color-blue fs15 pr5 inline-block"></i>
                                                            <span className='text-clipped fs12'>Временной интервал:</span>
                                                        </span>
                                                        <span className="js-ellipsis display-inline-flex">
                                                            <span title={date || ""} className="mr0 text-right fs12">{previosDate} - {date || ""}</span>
                                                        </span>
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
                </If>
            </div>
        )
    }

    toggleInfoPanel(event) {
        let targ = event.currentTarget,
            el1, el2;

        if (targ.tagName !== 'DIV' && targ.nextElementSibling) {
            return;
        }

        targ = targ.nextElementSibling;
        el1  = targ.querySelector('.timeline-accordion-subcontent');
        el2  = targ.querySelector('.timeline-accordion-content');
        el1 && this.setTargetMaxHeight(el1);
        el2 && this.setTargetMaxHeight(el2);
    }

    setTargetMaxHeight(targ) {
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

    setHighLight(text) {
        let highLightText = text;

        highLightText = setHighLight(highLightText, this.searchRegEx);
        highLightText = m.trust(highLightText);

        return highLightText;
    }
}

export default SignatureSheet;
