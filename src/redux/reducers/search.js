import { UPDATE_USERS, ADD_USERS, SET_USERS_NUM } from './actions';

const initialState = {
    users_num: 0,
    loaded_users: [],
};

export function searchReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_USERS:
            return { ...state, loaded_users: action.payload };
        case ADD_USERS:
            return {
                ...state,
                loaded_users: [...state.loaded_users, ...action.payload],
            };
        case SET_USERS_NUM:
            return { ...state, users_num: action.payload };
        default:
            return state;
    }
}
