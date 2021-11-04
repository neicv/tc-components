import m from 'mithril';
import classNames from "classnames";
import Component from '@/lib/Component';

const TEXT_BLANK            = 'Не указано';
const TEXT_ROBOT            = 'Автоматически';
const DELAY_INIT_MAX_HEIGHT = 100;

class StatusInfo extends Component {
    oninit(vnode) {
        this.isSigningInfoOpen      = false;
        this.model                  = [];
        this._element               = vnode;
        const { viewDetailsInfo }   = this.attrs;
        this.oldVDI                 = viewDetailsInfo;
    }

    view() {
        const { title='',
                fio = '',
                position = '',
                agency = '',
                role = '',
                index = 0,
                viewDetailsInfo,
                itemTitleClass
            } = this.attrs;

        if (this.oldVDI !== viewDetailsInfo) {
            this.oldVDI            = viewDetailsInfo
            this.isSigningInfoOpen = viewDetailsInfo;

            this.refreshModel(viewDetailsInfo);
        }

        const classIconFio = classNames(
            'font-icon',
            {'user' : fio !== ''},
            {'smart-toy' : fio === ''},
            'color-blue fs15 pr5 text-bold inline-block'
        )

        return (
            <div className="signing-info turbo-visa">
                <div className="turbo-visa__history-item">
                    <div
                        className={`history-item__title pr15 ${itemTitleClass || ''} ${this.isSigningInfoOpen ? 'timeline-open' : ''}`}
                        onclick={event => this.toggleInfoPanel(event, index)}
                        >
                        <div className="js-ellipsis timeline-accordion-title" aria-expanded={this.isSigningInfoOpen}>{title}</div>

                    </div>

                    <div className="mt10 ml15 tile-list_bordered history-item__content">
                        {/* <div
                            className={`v-align-middle pr15 pb5 ${this.isSigningInfoOpen ? 'timeline-open' : ''}`}
                            onclick={event => this.toggleInfoPanel(event, index)}
                        > */}
                            {/* <div className="js-ellipsis timeline-accordion-title" aria-expanded={this.isSigningInfoOpen}> */}
                            <div className="js-ellipsis pb5">
                                <div className="text-clipped js-ellipsis-text display-flex">
                                    <span title="Инициатор смены статуса" className="text-clipped v-align-middle fs12">Инициатор смены статуса:</span>
                                </div>
                            </div>
                            <div className="js-ellipsis pb5">
                                <div className="text-clipped js-ellipsis-text display-flex">
                                    <i title="ФИО" className={classIconFio}></i>
                                    <span title={fio || TEXT_ROBOT} className="text-clipped v-align-middle fs12">{fio || TEXT_ROBOT}</span>
                                </div>
                            </div>
                        {/* </div> */}
                        <div
                            className="timeline-accordion-content"
                            hidden={this.isSigningInfoOpen}
                            oncreate={element => this.setMaxHeight(element, index)}
                        >
                            <div className="v-align-middle pr15 pb5">
                                <div className="js-ellipsis">
                                    <div className="text-clipped js-ellipsis-text display-flex">
                                        <i title="Организация" className="font-icon case color-blue fs15 pr5 inline-block"></i>
                                        <span title={agency || TEXT_BLANK} className="text-clipped v-align-middle fs12">{agency || TEXT_BLANK}</span>
                                    </div>
                                </div>
                            </div>
                            <If condition={fio !== ''}>
                                <div className="v-align-middle pr15 pb5">
                                    <div className="js-ellipsis">
                                        <div className="text-clipped js-ellipsis-text display-flex">
                                            <i title="Должность" className="font-icon position-icon color-blue fs15 pr5"></i>
                                            <span title={position || TEXT_BLANK} className="text-clipped v-align-middle fs12">{position || TEXT_BLANK}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`v-align-middle pr15 pb5 ${this.isSigningInfoOpen ? 'pb10 border-bottom' : ''} `}>
                                    <div className="js-ellipsis">
                                        <div className="text-clipped js-ellipsis-text display-flex">
                                            <i title="Роль" className="font-icon role-icon color-blue fs15 pr5 inline-block"></i>
                                            <span title={role || TEXT_BLANK} className="text-clipped v-align-middle fs12">{role || TEXT_BLANK}</span>
                                        </div>
                                    </div>
                                </div>
                            </If>
                        </div>
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
        targ = targ.querySelector('.timeline-accordion-content');

        if (targ === null) {
            return;
        }

        if (targ.style.maxHeight && targ.style.maxHeight !== '0px') {
            targ.style.maxHeight = '0px';
        } else {
            targ.style.maxHeight = targ.scrollHeight + "px";
        }

        this.isSigningInfoOpen = !this.isSigningInfoOpen;
    }


    setMaxHeight(element, index) {

        this.model.push(element.dom);

        setTimeout(() => {
            let el;
            el = element.dom;

            if (this.isSigningInfoOpen) {
                el.style.maxHeight = el.scrollHeight + "px";
            } else {
                el.style.maxHeight = "0px"
            }

        }, DELAY_INIT_MAX_HEIGHT);
    }

    refreshModel(val) {
        this.model.forEach(el => {
            if (val) {
                el.style.maxHeight = el.scrollHeight + "px";
            } else {
                el.style.maxHeight = "0px"
            }
        })
    }
}

export default StatusInfo;
