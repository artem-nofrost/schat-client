import { SET_SOCKET_STATE } from './actions';

const initialState = {
    state: 'disconnected',
};

export function socketReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SOCKET_STATE:
            return { state: action.payload };
        default:
            return state;
    }
}
