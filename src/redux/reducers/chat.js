import {
    UPDATE_DIALOGS,
    UPDATE_DIALOG,
    UPDATE_MESSAGES,
    ADD_MESSAGE,
    ADD_MESSAGES,
    UPDATE_MESSAGE_READABILITY,
} from './actions';

const initialState = {
    dialogs: new Map(),
    messages: new Map(),
};

export function chatReducer(state = initialState, action) {
    let prevData;
    switch (action.type) {
        // Диалоги
        case UPDATE_DIALOGS:
            return { ...state, dialogs: action.payload };
        case UPDATE_DIALOG:
            let prevDataDialogs = state.dialogs.get(action.payload.user);
            return {
                ...state,
                dialogs: new Map(state.dialogs).set(action.payload.user, {
                    ...prevDataDialogs,
                    ...action.payload.data,
                }),
            };
        // Сообщения
        case UPDATE_MESSAGES:
            return {
                ...state,
                messages: new Map(state.messages).set(action.payload.user, {
                    ...action.payload.data,
                }),
            };
        case ADD_MESSAGE:
            prevData = state.messages.get(action.payload.user);
            return {
                ...state,
                messages: new Map(state.messages).set(action.payload.user, {
                    ...prevData,
                    messages: [...prevData.messages, action.payload.data],
                }),
            };
        case ADD_MESSAGES:
            prevData = state.messages.get(action.payload.user);
            return {
                ...state,
                messages: new Map(state.messages).set(action.payload.user, {
                    ...prevData,
                    messages: [
                        ...prevData.messages,
                        ...action.payload.messages,
                    ],
                }),
            };
        case UPDATE_MESSAGE_READABILITY:
            prevData = state.messages.get(action.payload.user);
            let changeMessage = prevData.messages.map((message) => {
                if (message.message_id === action.payload.message_id) {
                    return { ...message, read: true };
                } else {
                    return message;
                }
            });
            return {
                ...state,
                messages: new Map(state.messages).set(action.payload.user, {
                    ...prevData,
                    messages: [...changeMessage],
                }),
            };
        default:
            return state;
    }
}
