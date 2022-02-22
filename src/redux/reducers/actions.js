export const SET_USER = 'SET_USER';
export const SET_SOCKET_STATE = 'SET_SOCKET_STATE';
export const SET_LOAD_USERS = 'SET_LOAD_USERS';
export const SET_UPLOAD_USERS = 'SET_UPLOAD_USERS';
export const SET_NUM_USERS = 'SET_NUM_USERS';
export const LOAD_DIALOGS = 'LOAD_DIALOGS';
export const UPDATE_DIALOGS = 'UPDATE_DIALOGS';
export const LOAD_MESSAGES = 'LOAD_MESSAGES';
export const UPDATE_MESSAGES = 'UPDATE_MESSAGES';
export const LOAD_MORE_MESSAGES = 'LOAD_MORE_MESSAGES';
export const UPDATE_READ_MESSAGE = 'UPDATE_READ_MESSAGE';
export const SET_BOTTOM_DIALOG = 'SET_BOTTOM_DIALOG';

export const setUserData = (user) => ({
    type: SET_USER,
    payload: user,
});

export const setSocketState = (state) => ({
    type: SET_SOCKET_STATE,
    payload: state,
});

export const setLoadUsers = (state) => ({
    type: SET_LOAD_USERS,
    payload: state,
});

export const setUploadUsers = (state) => ({
    type: SET_UPLOAD_USERS,
    payload: state,
});

export const setNumUsers = (state) => ({
    type: SET_NUM_USERS,
    payload: state,
});

export const loadDialogs = (state) => ({
    type: LOAD_DIALOGS,
    payload: state,
});

export const updateDialogs = (state) => ({
    type: UPDATE_DIALOGS,
    payload: state,
});

export const loadMessages = (state) => ({
    type: LOAD_MESSAGES,
    payload: state,
});

export const updateMessages = (state) => ({
    type: UPDATE_MESSAGES,
    payload: state,
});

export const loadMoreMessages = (state) => ({
    type: LOAD_MORE_MESSAGES,
    payload: state,
});

export const updateReadMessage = (state) => ({
    type: UPDATE_READ_MESSAGE,
    payload: state,
});

export const setBottomDialog = (state) => ({
    type: SET_BOTTOM_DIALOG,
    payload: state,
});
