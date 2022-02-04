import m from 'mithril';
import PresenceAndCollab from '@/components/PresenceAndCollab';
import Data from './data/presenceAndCollabDocData';

class PresenceAndCollabDoc {
    oninit() {
        this.items = [];
        this.items.push(Data[0])
        this.items.push(Data[1])
        this.items.push(Data[2])
        this.items.push(Data[3])

        this.labelRnd = '';
    }

    view(vnode) {
        return (
            <div className='main-content'>
                <h1>Редактор</h1>
                <p><spn>Присутствие пользователей и Совместная работа</spn><span>{this.labelRnd}</span></p>
                <p>
                    <button
                        type='button'
                        className='btn btn--is-elevated primary'
                        onclick={() => this.addUser()}
                    >
                        Добавить
                    </button>
                    <button
                        type='button'
                        className='btn btn--is-elevated primary ml10'
                        onclick={() => this.changeUser()}
                    >
                        Изменить
                    </button>
                    <button
                        type='button'
                        className='btn btn--is-elevated primary ml10'
                        onclick={() => this.deleteUser()}
                    >
                        Удалить
                    </button>
                    <button
                        type='button'
                        className='btn btn--is-elevated primary ml10'
                        onclick={() => this.rndFunc()}
                    >
                        RND
                    </button>
                </p>
                <PresenceAndCollab
                    items={this.items}
                    hookOnAddUserClick={click => this.onAddUser = click}
                    hookOnDeleteUserClick={click => this.onDeleteUser = click}
                    hookOnChangeUserClick={click => this.onChangeUser = click}
                />
            </div>
        )
    }

    rndFunc() {
        this.labelRnd = this.getRandomId(Data)
    }

    changeUser() {
        const id = this.getRandomId(Data);
        const user = Data.find(el => +el.id === +id);
        this.onChangeUser(user.id);
    }

    addUser() {
        // this.items.shift();
        // this.items.unshift(Data[3])
        const id = this.getRandomId(Data);
        const user = Data.find(el => +el.id === +id);
        this.onAddUser(user);
    }

    deleteUser() {
        const id = this.getRandomId(Data)
        this.onDeleteUser(id);
    }

    getRandomId(items = []) {
        if (items.length === 0) {
            return;
        }

        let index = this.items.map(el => el.id)

        return index[(index.length * Math.random()) << 0];
    }
}

export default PresenceAndCollabDoc;
