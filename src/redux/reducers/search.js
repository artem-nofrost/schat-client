import { SET_LOAD_USERS } from './actions';
import { SET_UPLOAD_USERS } from './actions';
import { SET_NUM_USERS } from './actions';

const initialState = {
    num_users: 0,
    loaded_users: [],
};

export function searchReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LOAD_USERS:
            return { ...state, loaded_users: action.payload };
        case SET_UPLOAD_USERS:
            return {
                ...state,
                loaded_users: [...state.loaded_users, ...action.payload],
            };
        case SET_NUM_USERS:
            return { ...state, num_users: action.payload };
        default:
            return state;
    }
}
