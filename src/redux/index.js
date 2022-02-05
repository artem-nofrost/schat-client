import { createStore } from 'redux';
import rootReducer from './reducers'

// создание глобального хранилища приложения
const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__())

export default store;