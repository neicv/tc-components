import {
    REQUEST_LIST_USERS_PRESENCE,
    SET_LIST_USERS_PRESENCE,
    ADD_USER_TO_PRESENCE,
    REMOVE_USER_FROM_PRESENCE,
    CHANGE_USER_STATUS_IN_PRESENCE
} from "@/types/common/presenceAndCollab";

export const requestUsersPresence = () => ({
    type: REQUEST_LIST_USERS_PRESENCE
});

export const setUsersPresence = payload => ({
    type: SET_LIST_USERS_PRESENCE,
    payload
});

export const addUserToPresence = payload => ({
    type: ADD_USER_TO_PRESENCE,
    payload
});

export const removeUserFromPresence = payload => ({
    type: REMOVE_USER_FROM_PRESENCE,
    payload
});

export const changeUserInPresence = payload => ({
    type: CHANGE_USER_STATUS_IN_PRESENCE,
    payload
});
