import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ToDoListPage from './TodoListPage.js';
import Login from './Login.js';
import Routes from './Routes.js'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Routes />, document.getElementById('root'));
registerServiceWorker();
