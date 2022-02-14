import {
    SET_LIST_USERS_PRESENCE,
    ADD_USER_TO_PRESENCE,
    REMOVE_USER_FROM_PRESENCE,
    CHANGE_USER_STATUS_IN_PRESENCE
} from "@/types/common/presenceAndCollab";

import colors from '@/components/PresenceAndCollab/constants'

const initialState = { data: [] };

// function sortDocumentStructure(state, { item, target, shift }) {
//     let attachments = state.attachments,
//         moved       = attachments.splice(attachments.indexOf(item), 1)[0],
//         index       = attachments.indexOf(target) + shift;

//     attachments.splice(index, 0, moved);

//     return { ...state, attachments };
// }

function addUser(state, user) {

    if (state.data.find(el => el.id === user.id)) {
        console.log('user alredy added, w id: ', user.id)
        // state?
        state.success = false;
        return state;
    }

    let src = "",
        char = "",
        color = _randomColor(),
        isShowMore = false;

    if (user.img === undefined || user.img === "") {
        char = user.fio && user.fio.trim()[0];
        src = _lettersToAvatarImage(char, 64);
    } else {
        src = user.img;
    }

    let modelItem = {
        ...user,
        src,
        color,
        isShowMore,
    };

    if (modelItem.img) {
        delete modelItem.img;
    }

    state.data.push(modelItem);
    state.success = true;

    return state;
}

function deleteUser(state, id) {
    if (id === undefined) {
        // state?
        state.success = false;
        return state;
    }

    state.data = state.data.filter(el => el.id !== id);
    state.success = true;

    return state;
}

function _lettersToAvatarImage(letters, size = 60) {
    let canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    // let color =  "#" + (Math.random() * 0xFFFFFF << 0).toString(16);
    let color = _randomColor();

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

function _randomColor() {
    let keys = Object.keys(colors);
    let randomProperty = colors[keys[(keys.length * Math.random()) << 0]];

    return randomProperty.value;
}

export default function(state = initialState, action = {}) {
    switch (action.type) {
        // case INIT_DOCUMENT_SECTION_STRUCTURE:
        //     return { attachments: [] };
        case SET_LIST_USERS_PRESENCE:
            return { ...state, data: action.payload };
        case ADD_USER_TO_PRESENCE:
            return addUser(state, action.payload);
        case REMOVE_USER_FROM_PRESENCE:
            return deleteUser(state, action.payload);
        case CHANGE_USER_STATUS_IN_PRESENCE:
            return sortDocumentStructure(state, action);
        default:
            return state;
    }
}
