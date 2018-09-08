import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ToDoListPage from './TodoListPage.js';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<ToDoListPage />, document.getElementById('root'));
registerServiceWorker();
