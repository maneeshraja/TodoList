import {combineReducers} from 'redux';
import todoReducer from './todo.js';
import authenticationReducer from './authentication.js';

export default combineReducers({
    todoReducer, authenticationReducer
});
