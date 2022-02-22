import { LOAD_DIALOGS } from './actions';
import { UPDATE_DIALOGS } from './actions';
import { LOAD_MESSAGES } from './actions';
import { UPDATE_MESSAGES } from './actions';
import { LOAD_MORE_MESSAGES } from './actions';
import { UPDATE_READ_MESSAGE } from './actions';
import { SET_BOTTOM_DIALOG } from './actions';

const initialState = {
    bottom_dialog: false,
    dialogs: new Map(),
    messages: new Map(),
};

// dialogs: newMap() "asdasdasd" => {
//     lanme:
//     fname:
//     online:
//     // messages: [{message, time}]

// }

export function chatReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_DIALOGS:
            return { ...state, dialogs: action.payload };
        case UPDATE_DIALOGS:
            let prevDataDialogs = state.dialogs.get(action.payload.user);
            return {
                ...state,
                dialogs: new Map(state.dialogs).set(action.payload.user, {
                    ...prevDataDialogs,
                    ...action.payload.data,
                }),
            };
        case LOAD_MESSAGES:
            return {
                ...state,
                messages: new Map(state.messages).set(action.payload.user, {
                    ...action.payload.data,
                }),
            };
        case UPDATE_MESSAGES:
            let prevData = state.messages.get(action.payload.user);
            return {
                ...state,
                messages: new Map(state.messages).set(action.payload.user, {
                    ...prevData,
                    messages: [...prevData.messages, action.payload.data],
                }),
            };
        case LOAD_MORE_MESSAGES:
            let prevDataUpload = state.messages.get(action.payload.user);
            return {
                ...state,
                messages: new Map(state.messages).set(action.payload.user, {
                    ...prevDataUpload,
                    messages: [
                        ...prevDataUpload.messages,
                        ...action.payload.messages,
                    ],
                }),
            };
        case UPDATE_READ_MESSAGE:
            let prevDataMessages = state.messages.get(action.payload.user);
            let changeMessage = prevDataMessages.messages.map((message) => {
                if (message.message_id === action.payload.message_id) {
                    return { ...message, read: true };
                } else {
                    return message;
                }
            });
            return {
                ...state,
                messages: new Map(state.messages).set(action.payload.user, {
                    ...prevDataMessages,
                    messages: [...changeMessage],
                }),
            };
        case SET_BOTTOM_DIALOG:
            return { ...state, bottom_dialog: action.payload };
        default:
            return state;
    }
}
