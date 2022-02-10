
import m from 'mithril';
import Component from '@/lib/Component';
import PresenceAndCollabView from './components/PresenceAndCollabView';
import colors from './constants'

// import Model from './Model/model'

class PresenceAndCollab extends Component {
    constructor(props) {
        super(props);
        this.addUser    = this.addUser.bind(this);
        this.changeUser = this.changeUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
     }

    oninit() {
        const { items } = this.attrs;

        this.attrs.hookOnAddUserClick(this.addUser);
        this.attrs.hookOnChangeUserClick(this.changeUser);
        this.attrs.hookOnDeleteUserClick(this.deleteUser);

        this.model = [];
        this.generateModel(items);

        // this._model = new Model(options);
    }

    onbeforeupdate() {
        // const { items } = this.attrs;
        // if (this.isPropsChange(items)) {
        //     this.generateModel(items);
        // }
    }

    onremove() {
        this.model = null;
    }

    view() {
        const { isMenuView } = this.attrs;
        return (
            <PresenceAndCollabView items={this.model} isMenuView={isMenuView} />
        )
    }

    refreshModel() {
        // observe model ?
        const { items } = this.attrs;
        generateModel(items);

        const { handleRefreshModel } = this.attrs;

        if (typeof handleRefreshModel === "function") {
            handleRefreshModel();
        }
    }

    /* Изменились ли входные данные
        Отслеживаются:
        1. элементы массива по id (Пользователи)
        2. статус у пользователя
    */
    isPropsChange(items) {
        if (items && items.length && this.model && this.model.length) {
            if (items.length !== this.model.length) {
                console.log("change len");
                return true;
            }

            const itemsIdArray = items.map((element) => element.id);
            const modelIdArray = this.model.map((element) => element.id);

            let isNotContain = !itemsIdArray.reduce((acc, current) => {
                return acc && modelIdArray.includes(current);
            }, true);

            if (isNotContain) {
                console.log("id change: ", isNotContain);
                return true;
            }

            let isActiveChange = !items.reduce((acc, element) => {
                return acc && this.model.find(el => el.id === element.id).active === element.active;
            }, true);

            if (isActiveChange) {
                console.log("active change: ", isActiveChange);
                return true;
            }

            return false;
        }
    }

    generateModel(users) {
        users.forEach((user) => {
            this.addUser(user);
        });
    }

    addUser(user) {

        if (this.model.find(el => el.id === user.id)) {
            console.log('user alredy added, w id: ', user.id)
            return;
        }

        let src = "",
            char = "",
            color = this._randomColor(),
            isShowMore = false;

        if (user.img === undefined || user.img === "") {
            char = user.fio && user.fio.trim()[0];
            src = this._lettersToAvatarImage(char, 64);
        } else {
            src = user.img;
        }

        let modelItem = {
            ...user,
            src,
            color,
            isShowMore,
        };

        delete modelItem.img;

        this.model.push(modelItem);
    }

    deleteUser(id) {
        if (id === undefined) {
            return;
        }

        this.model = this.model.filter(el => el.id !== id);
    }

    // Смена активного статуса
    changeUser(id) {
        if (id === undefined) {
            return;
        }

        let index = this.model.findIndex(el => +el.id === +id);

        if (index !== -1) {
            this.model[index].active = !this.model[index].active;
        }
    }

    _lettersToAvatarImage(letters, size = 60) {
        let canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        // let color =  "#" + (Math.random() * 0xFFFFFF << 0).toString(16);
        let color = this._randomColor();

        canvas.width = size;
        canvas.height = size;

        context.font = Math.round(canvas.width / 2) + "px Roboto"; // Arial
        context.textAlign = "center";
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#FFF";
        context.fillText(letters, size / 2, size / 1.5);
        // Set image representation in default format (png)
        let dataURI = canvas.toDataURL();
        canvas = null;

        return dataURI;
    }

    _randomColor() {
        let keys = Object.keys(colors);
        let randomProperty = colors[keys[(keys.length * Math.random()) << 0]];

        return randomProperty.value;
    }
}

export default PresenceAndCollab;
