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
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistGate } from 'redux-persist/lib/integration/react';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
};

const persiReducer = persistReducer(persistConfig, Reducer);

const store = createStore(persiReducer, {}, applyMiddleware(thunk));
const persistor = persistStore(store);

ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes />
      </PersistGate>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
