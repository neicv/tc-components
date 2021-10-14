import m from 'mithril';
import Component from '@/lib/Component';

const COLOR_APPROVE    = 'success';
const COLOR_DISAPPROVE = 'error';
const TEXT_BLANK       = 'Не указано';

class StatusInfo extends Component {
    oninit(vnode) {
        this.isSigningInfoOpen = true;
        this.initialState      = [];
        this._element          = vnode;
    }

    view() {
        const { title='', fio = '', position = '', agency = '', role = '', index } = this.attrs;

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
                        </div>
                        <div className={`timeline-accordion-content`} hidden={this.isSigningInfoOpen} oncreate={element => this.setMaxHeight(element)}>
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
                            <div class=" v-align-middle pr15">
                                <div class="js-ellipsis">
                                    <div class="text-clipped js-ellipsis-text">
                                        <i title="Роль" class="font-icon role-icon color-blue fs15 pr5 inline-block"></i>
                                        <span title={role || TEXT_BLANK} class="text-clipped v-align-middle fs12">{role || TEXT_BLANK}</span>
                                    </div>
                                </div>
                            </div>
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

        this.isSigningInfoOpen = !this.isSigningInfoOpen;

        if (!this.initialState.includes(index) && !this.isSigningInfoOpen) {
            this.initialState.push(index);
            targ.style.maxHeight = '0px';
            return;
        }

        if (targ.style.maxHeight && targ.style.maxHeight !== '0px') {
            targ.style.maxHeight = '0px';
        } else {
            targ.style.maxHeight = targ.scrollHeight + "px";
        }
    }

    setMaxHeight(element) {
        let _this = this;
        setTimeout(() => {
            let el;
            el = _this._element.dom.getElementsByClassName('timeline-accordion-content')[0];
            el.style.maxHeight = el.scrollHeight + "px"
        }, 200);
    }

    // oncreate={({ dom }) => this.setInitialStyle(dom)}
}

export default StatusInfo;
