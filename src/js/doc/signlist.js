import m from 'mithril';
import SigningListContainer from "./components/signinglist/SigningListConteiner"

import HISTORY, { history } from '@doc/data/timelineHistory'

class SignListDoc {
    view() {

        return (
            <div className='test-timeline'>
                <p><b> Sign List</b> </p>
                <SigningListContainer data={history}/>
            </div>
        )
    }
}

export default SignListDoc;
