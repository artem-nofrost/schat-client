export const SET_USER = 'SET_USER';
export const SET_SOCKET_STATE = 'SET_SOCKET_STATE';
export const UPDATE_USERS = 'UPDATE_USERS';
export const ADD_USERS = 'ADD_USERS';
export const SET_USERS_NUM = 'SET_USERS_NUM';
export const UPDATE_DIALOGS = 'UPDATE_DIALOGS';
export const UPDATE_DIALOG = 'UPDATE_DIALOG';
export const UPDATE_MESSAGES = 'UPDATE_MESSAGES';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const ADD_MESSAGES = 'ADD_MESSAGES';
export const UPDATE_MESSAGE_READABILITY = 'UPDATE_MESSAGE_READABILITY';

export const setUserData = (payload) => ({
    type: SET_USER,
    payload,
});

export const setSocketState = (payload) => ({
    type: SET_SOCKET_STATE,
    payload,
});

export const updateUsers = (payload) => ({
    type: UPDATE_USERS,
    payload,
});

export const addUsers = (payload) => ({
    type: ADD_USERS,
    payload,
});

export const setUsersNum = (payload) => ({
    type: SET_USERS_NUM,
    payload,
});

// chat
export const updateDialogs = (payload) => ({
    type: UPDATE_DIALOGS,
    payload,
});

export const updateDialog = (payload) => ({
    type: UPDATE_DIALOG,
    payload,
});

export const updateMessages = (payload) => ({
    type: UPDATE_MESSAGES,
    payload,
});

export const addMessage = (payload) => ({
    type: ADD_MESSAGE,
    payload,
});

export const addMessages = (payload) => ({
    type: ADD_MESSAGES,
    payload,
});

export const updateMessageReadability = (payload) => ({
    type: UPDATE_MESSAGE_READABILITY,
    payload,
});
