import m from 'mithril';
import Component from '@/lib/Component';

const COLOR_APPROVE    = 'success';
const COLOR_DISAPPROVE = 'error';
const TEXT_BLANK       = 'Не указано';

class SignatureSheet extends Component {

    view() {
        const { signingList } = this.attrs;
            /*
                "date": "13.07.2021 15:47",
                "fio": "Полунчуков Алексей Николаевич",
                "position": "Ведущий инженер-технолог",
                "agency": "АКЦИОНЕРНОЕ ОБЩЕСТВО \"ВОРОНЕЖСКИЙ СИНТЕТИЧЕСКИЙ КАУЧУК\"",
                "role": "Инициатор ТЗ",
                "comments": "",
                "agreed": true,
                "agreeStatus": "Согласовано"
            */
        return (
            <div class="v-align-middle pr0 pt10 pb10 short-info"> {/* elevation card sheet */}
                <div class="js-ellipsis mb10">
                    <i title="Визирование" class="font-icon template-icon fs18 pr5"></i>
                    <span class="v-align-top fs15 text-right">Лист Визирования</span>
                </div>
                {
                    signingList.slice(0).reverse().map((item, index) => {
                        const {date, fio, position, agency, role, comments, agreed, agreeStatus} = item;

                        return (
                            <div class="pb5 pt10 border-bottom">
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
                                        <div class="text-clipped js-ellipsis-text text-right">
                                            <span title={date || ""} class="text-clipped v-align-middle fs11">{date || ""}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default SignatureSheet;
