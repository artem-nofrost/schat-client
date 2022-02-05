import { combineReducers } from 'redux';
import { userReducer } from './users';
import { chatReducer } from './chat';
import { socketReducer } from './socket';
import { searchReducer } from './search';

export default combineReducers({
    user: userReducer,
    chat: chatReducer,
    socket: socketReducer,
    search: searchReducer,
});
