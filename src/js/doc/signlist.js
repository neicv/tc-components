import m from 'mithril';
import SigningListContainer from "./components/signinglist/SigningListConteiner"
import Switch from '@/components/Switch';

import HISTORY, { history } from '@doc/data/timelineHistory'

class SignListDoc {
    oninit() {
        this.isShowDetailsList = false;
    }

    view() {

        return (
            <div className='test-timeline sign-list'>
                <p><b> Sign List</b> </p>
                <div className="spacebetween pr20">
                    <span className="fs14">Тут будет поиск...</span>
                    <label className="switcher-label-placement-start">
                        <Switch
                            value={this.isShowDetailsList}
                            onchange={value => this.isShowDetailsList = value}
                        />
                        <span className='text-secondary fs12'>Подробный вид: </span>
                    </label>
                </div>
                <SigningListContainer data={history}/>
            </div>
        )
    }
}

export default SignListDoc;
