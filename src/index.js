import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ToDoListPage from './TodoListPage.js';
import Login from './Login.js';
import Routes from './Routes.js';
import Reducer from './Reducers';
import { Provider } from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(Reducer, {}, applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
      <Routes />
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
