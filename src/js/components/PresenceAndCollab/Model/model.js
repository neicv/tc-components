class PresenceModel {
    constructor(options) {
        this.model = options.items;
    }

    getModel() {
        return this.model;
    }

    setModel(model) {
        this.model = model;
    }

    addUser(user) {

        if (this.model.find(el => el.id === user.id)) {
            console.log('user alredy added, w id: ', user.id)
            return;
        }

        let src = "",
            char = "",
            color = this.randomColor(),
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

export default PresenceModel;
