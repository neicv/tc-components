import m from 'mithril';
import Component from '@/lib/Component';
import { call } from 'file-loader';
import SignatureSheet from './SignatureSheet';

const COLOR_APPROVE         = 'success';
const COLOR_DISAPPROVE      = 'error';
const TEXT_BLANK            = 'Не указано';
const TEXT_STATUS_AGREED    = 'Согласовано';
const TEXT_STATUS_DISAGREED = 'Согласовано';

const DELAY_INIT_MAX_HEIGHT = 100;


class StatusInfo extends Component {
    oninit(vnode) {
        this.isSigningInfoOpen = false;
        this.initialState      = [];
        this._element          = vnode;
        // this._state            = [];
    }

    view() {
        const { title='', fio = '', position = '', agency = '', role = '', index, signingList = [] } = this.attrs;

        const shortSigningList = this.getShortSigningList(signingList);

        return (
            <div className="signing-info turbo-visa">
                <div class="turbo-visa__history-item">
                    <div class="history-item__title">{title}</div>

                    <div class="mt10 ml15 tile-list_bordered history-item__content">
                        <div
                            className={`v-align-middle pr15 ${this.isSigningInfoOpen ? 'timeline-open' : ''}`}
                            onclick={event => this.toggleInfoPanel(event, index)}
                        >
                            <div class="js-ellipsis timeline-accordion-title" aria-expanded={this.isSigningInfoOpen}>
                                <div class="text-clipped js-ellipsis-text">
                                    <i title="ФИО" class="font-icon user color-blue fs15 pr5 text-bold inline-block"></i>
                                    <span title={fio || TEXT_BLANK} class="text-clipped v-align-middle fs12">{fio || TEXT_BLANK}</span>
                                </div>
                            </div>

                            <If condition={signingList.length !== 0 && !this.isSigningInfoOpen}>{/*!this._state[index]}>*/}
                            <div class="v-align-middle pr0 pt10 short-info"> {/* elevation card sheet */}
                                <div class="js-ellipsis">
                                    <i title="Визирование" class="font-icon template-icon fs18 pr5"></i>
                                    <span class="v-align-top fs15 text-right">Лист Визирования</span>
                                </div>
                                <div class="spacebetween ml20">
                                    {/* <label class="mt10"> */}
                                        <span class='fs12'>Статус:</span>
                                        <span class='text-right'>
                                            <i
                                                title={shortSigningList.agreeStatus}
                                                className={`font-icon ${shortSigningList.agreed ? 'circle-tick success' : 'circle-close error'} fs15 pr5`}
                                            ></i>
                                            <span class="v-align-text-top fs12">{shortSigningList.agreeStatus}</span>
                                        </span>
                                    {/* </label> */}

                                </div>
                                <If condition={shortSigningList.comments}>
                                    <div class="fs12 ml20">
                                        <div class='pb5'>Комментарий:</div>
                                        <div class="fs11 text-justify">{shortSigningList.comments}</div>
                                        <div class="fs11 text-right">{shortSigningList.fio}</div>
                                        <div class="fs11 text-right">{shortSigningList.date}</div>
                                    </div>
                                </If>
                            </div>
                        </If>

                        </div>
                        {/* Доп контент */}
                        <div className={`timeline-accordion-content`} hidden={this.isSigningInfoOpen} oncreate={element => this.setMaxHeight(element, index)}>
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
                            <div class={`v-align-middle pr15 ${this.isSigningInfoOpen ? 'pb10 border-bottom' : ''} `}>
                                <div class="js-ellipsis">
                                    <div class="text-clipped js-ellipsis-text">
                                        <i title="Роль" class="font-icon role-icon color-blue fs15 pr5 inline-block"></i>
                                        <span title={role || TEXT_BLANK} class="text-clipped v-align-middle fs12">{role || TEXT_BLANK}</span>
                                    </div>
                                </div>
                            </div>

                            <Choose>
                                <When condition={signingList.length !== 0}>
                                    <SignatureSheet signingList={signingList}/>
                                </When>
                            </Choose>
                        </div>

                        {/* ---------- */}
                    </div>
                </div>
            </div>
        )
    }

    toggleInfoPanel(event, index) {
        let targ = event.currentTarget;

        if (targ.tagName !== 'DIV' && targ.nextElementSibling) {
            return;
        }

        targ = targ.nextElementSibling;

        this.isSigningInfoOpen = !this.isSigningInfoOpen;
        // this._state[index] = !this._state[index];

        // if (!this.initialState.includes(index)) {
        //     this.initialState.push(index);

        //     if (this.isSigningInfoOpen) {
        //         targ.style.maxHeight = targ.scrollHeight + "px"

        //     } else {
        //         targ.style.maxHeight = '0px';
        //     }

        //     return;
        // }

        if (targ.style.maxHeight && targ.style.maxHeight !== '0px') {
            // targ.style.maxHeight = targ.scrollHeight + "px";
            // setTimeout(() => m.redraw(), 0);
            targ.style.maxHeight = '0px';
        } else {
            targ.style.maxHeight = targ.scrollHeight + "px";
        }
    }


    setMaxHeight(element, index) {
        let _this = this;
        setTimeout(() => {
            let el;
            el = _this._element.dom.getElementsByClassName('timeline-accordion-content')[0];
            if (this.isSigningInfoOpen) {
                el.style.maxHeight = el.scrollHeight + "px";
                // this._state[index] = true;
            } else {
                el.style.maxHeight = "0px"
                // this._state[index] = false;
            }

        }, DELAY_INIT_MAX_HEIGHT);
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
            shortList.agreeStatus = disapproveList[len - 1].agreeStatus || TEXT_STATUS_DISAGREED;
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

export default StatusInfo;
