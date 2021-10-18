import m from 'mithril';
import Component from '@/lib/Component';
import SignatureSheet from './SignatureSheet';

const TEXT_BLANK            = 'Не указано';
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
                signingList = [],
                viewDetailsInfo,
                itemTitleClass
            } = this.attrs;

        if (this.oldVDI !== viewDetailsInfo) {
            this.oldVDI            = viewDetailsInfo
            this.isSigningInfoOpen = viewDetailsInfo;

            this.refreshModel(viewDetailsInfo);
        }

        return (
            <div className="signing-info turbo-visa">
                <div class="turbo-visa__history-item">
                    <div className={`history-item__title ${itemTitleClass || ''}`}>{title}</div>

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
                        </div>
                        <div
                            class="timeline-accordion-content"
                            // hidden={this.isSigningInfoOpen}
                            oncreate={element => this.setMaxHeight(element, index)}
                        >
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
                        </div>

                        <Choose>
                            <When condition={signingList.length !== 0}>
                                <SignatureSheet signingList={signingList} index={index} viewDetailsInfo={viewDetailsInfo}/>
                            </When>
                        </Choose>

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
