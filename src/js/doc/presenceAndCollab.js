import m from 'mithril';
import PresenceAndCollab from '@/components/PresenceAndCollab';
import Data from './data/presenceAndCollabDocData';

class PresenceAndCollabDoc {
    view() {
        return (
            <div className='main-content'>
                <h1>Редактор</h1>
                <p>Присутствие пользователей и Совместная работа</p>
                <PresenceAndCollab items={Data} />
            </div>
        )
    }
}

export default PresenceAndCollabDoc;
