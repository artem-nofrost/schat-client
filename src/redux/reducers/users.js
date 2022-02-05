import { SET_USER } from './actions';

const initialState = {
    is_auth: false,
    id: null,
    date: 0,
    email: '',
    fname: '',
    gender: '',
    lname: '',
};

export function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}
