import m from 'mithril';
import PresenceAndCollab from '@/components/PresenceAndCollab';
import Data from './data/presenceAndCollabDocData';
import Switch from '@/components/Switch';
import {connect} from "@/lib/midux";

import {
    requestUsersPresence,
    addUserToPresence,
    removeUserFromPresence
} from "@/actions/common/presenceAndCollab";

const mapStateToProps = state => ({
    users: state.data,
});

const mapActionsToProps = {
    requestUsersPresence,
    addUserToPresence,
    removeUserFromPresence
};

class PresenceAndCollabDoc {
    oninit() {
        this.items = [];
        this.items.push(Data[0])
        this.items.push(Data[1])
        this.items.push(Data[2])
        this.items.push(Data[3])

        this.labelRnd = '';
        this.isMenuView = true;
    }

    view({attrs}) {
        return (
            <div className='main-content'>
                <div className='test-presence'>
                    <h1>Редактор</h1>
                    <p>
                        <div className="spacebetween">
                            <span>Присутствие пользователей и Совместная работа</span><span>{this.labelRnd}</span>
                            <label className="switcher-label-placement-start">
                                <Switch
                                    value={this.isMenuView}
                                    onchange={value=> this.changeData(value)}
                                />
                                <span className={`${this.isMenuView ? 'text-primary' : 'text-secondary'} fs12`}>Вид: {this.isMenuView ? 'меню' : 'в ряд'}</span>
                            </label>
                        </div>
                    </p>
                    <p>
                        <button
                            type='button'
                            className='btn btn--is-elevated primary'
                            onclick={() => this.addUser(attrs)}
                        >
                            Добавить
                        </button>
                        <button
                            type='button'
                            className='btn btn--is-elevated primary ml10'
                            onclick={() => this.changeUser(attrs)}
                        >
                            Изменить
                        </button>
                        <button
                            type='button'
                            className='btn btn--is-elevated primary ml10'
                            onclick={() => this.deleteUser(attrs)}
                        >
                            Удалить
                        </button>
                        {/* <button
                            type='button'
                            className='btn btn--is-elevated primary ml10'
                            onclick={() => this.rndFunc()}
                        >
                            RND
                        </button> */}
                    </p>
                    <div style={'width: 70%;'}>
                        <div class="toolbar-table-row__coll toolbar__top-panel-main">
                            <div class="row row_table">
                                <div class="col-8 v-align-middle">
                                    Документы...
                                </div>
                                <div class="col-2 v-align-middle">
                                    <div class="tpolbar__info text-center">
                                        <PresenceAndCollab
                                            items={this.items}
                                            isMenuView={this.isMenuView}
                                            hookOnAddUserClick={click => this.onAddUser = click}
                                            hookOnDeleteUserClick={click => this.onDeleteUser = click}
                                            hookOnChangeUserClick={click => this.onChangeUser = click}
                                        />
                                    </div>
                                </div>
                                <div class="col-2 v-align-middle">
                                    <div class="toolbar__info">
                                        <span>Статус документа:</span>
                                        <div class="cursor-pointer dashed-link color-blue">Черновик</div>
                                    </div>
                                    <div class="toolbar__info">
                                        <span>Тип:</span>
                                        <div class="cursor-pointer dashed-link color-blue">договор</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    changeData(val) {
        this.isMenuView = val;
        // setTimeout(() => m.redraw(), 0);
    }

    rndFunc() {
        this.labelRnd = this.getRandomId(Data)
    }

    changeUser(attrs) {
        const id = this.getRandomId(Data);
        const user = Data.find(el => +el.id === +id);
        this.onChangeUser(user.id);
    }

    addUser(attrs) {
        // this.items.shift();
        // this.items.unshift(Data[3])
        const id = this.getRandomId(Data);
        const user = Data.find(el => +el.id === +id);
        this.onAddUser(user);
        attrs.actions.addUserToPresence(user);
    }

    deleteUser(attrs) {
        const id = this.getRandomId(Data)
        this.onDeleteUser(id);
        attrs.actions.removeUserFromPresence(id);
    }

    getRandomId(items = []) {
        if (items.length === 0) {
            return;
        }

        let index = this.items.map(el => el.id)

        return index[(index.length * Math.random()) << 0];
    }
}

export default connect(mapStateToProps, mapActionsToProps)(PresenceAndCollabDoc);
