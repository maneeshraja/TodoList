import {SAVE_TODO,EDIT_TODO,DELETE_TODO, api_url,UPDATE_TODO_ITEM_CHECKBOX,
        UPDATE_ITEMS, APPLICATION_ERROR,RETRIEVE_TODO,INITIAL_STATE,
        UPDATE_INITIALSTATE, TOGGLE_SAVING, ERROR_SAVING, TOGGLE_ERROR_SAVING,
        CHANGE_FOLDER,REMOVE_FROM_ITEMS, CHANGE_FOLDER_RETREIVE, FOLDER_CHANGE_ERROR,
        TOGGLE_CHANGE_FOLDER_SUCCESSFULL, MOVE_MULTIPLE, DELETE_MULTIPLE, TOGGLE_SUCCESS,
        UPDATE_DESC, UPDATE_PRIORITY,LOGOUT} from '../Constants';
import {logout} from './authentication';
import axios from 'axios';

const errorOccured = (err) => {

  if(err.status === 401) {
    return {type: LOGOUT};
  } else {
    return {type: APPLICATION_ERROR};
  }
}

const itemsRetrieved = (resp) => {
  const action = {
    type: RETRIEVE_TODO,
    data: resp
  }

  return action;
}

const initialState = (resp) => {
  return {
    type: INITIAL_STATE,
    data: resp
  }
}

const savedTodo = (resp) => {
  return {
    type: SAVE_TODO,
    data: resp
  }
}

const deletedTodo = (resp, uid) => {
  return {
    type: DELETE_TODO,
    data: resp,
    uid: uid
  }
}

const editedTodo = (resp) => {
  return{
    type: EDIT_TODO,
    data: resp
  }
}

const updatedTodoItemCheckBox = (resp) => {
  return {
    type: UPDATE_TODO_ITEM_CHECKBOX,
    data: resp
  }
}

export const updateInitialState = (initialState) => {
  return {
    type: UPDATE_INITIALSTATE,
    data: initialState
  }
}

export const updateItems = (items) => {
  return {
    type: UPDATE_ITEMS,
    data: items
  }
}

export const toggleSaving = (status) => {
  return {
    type: TOGGLE_SAVING,
    data: status
  }
}

export const toggleErrorSaving = (status) => {
  return {
    type: TOGGLE_ERROR_SAVING,
    data: status
  }
}

export const changeFolderReceived = (status) => {
  return {
    type: CHANGE_FOLDER_RETREIVE,
    data: status
  }
}

export const changedFolder = (status) => {
  return {
    type: CHANGE_FOLDER,
    data: status
  }
}

export const removeTodoWhenChanged = (uid) => {
  return {
    type: REMOVE_FROM_ITEMS,
    data: uid
  }
}

export const toggleFolderChangedSuccessfull = (status) => {
  return {
    type: TOGGLE_CHANGE_FOLDER_SUCCESSFULL,
    data: status
  }
}

export const moveMultipleHandle = (status) => {
  return {
    type: MOVE_MULTIPLE,
    data: status
  }
}

export const deleteMultipleHandle = (status) => {
  return {
    type: DELETE_MULTIPLE,
    data: status
  }
}

export const toggleSuccess = (status) => {
  return {
    type: TOGGLE_SUCCESS,
    data: status
  }
}

export const updatedDesc = () => {
  return {
    type: UPDATE_DESC,
    //data:
  }
}

export const updatedPriority = () => {
  return {
    type: UPDATE_PRIORITY,
    //data:
  }
}

export const changeFolder = (userId, uid, folderId) => {
  const url = `${api_url}/folderChanged`;
  return dispatch => {
    axios.put(url,JSON.stringify({
      "userId":userId,
      "uid": uid,
      "folderId": folderId
    }), {
      headers: {
        'Content-type': 'application/json'
      }}).then(response => dispatch(changedFolder(response.data)))
         .catch(err => err.response.status===401?dispatch(logout()):err)
  }
}

export const getInitialState = (userId, token) => {
  const url = `${api_url}/initialStats?userId=${userId}`;
  return dispatch => {
    axios.get(url, {
      headers: {
        'Content-type': 'application/json',
        'X-Auth-Token': token
      }
    }).then(response => dispatch(initialState(response.data)))
      .catch(err => err.response.status===401?dispatch(errorOccured(err)):err)
  }
}

export const retrieveTodo = (folderId,userId,token) => {
  const url = `${api_url}/items?folderId=${folderId}&userId=${userId}`;
  return dispatch => {
    axios.get(url, {
      headers:{
        'Content-Type': 'application/json',
        'X-Auth-Token': token
      }
    }).then(response => dispatch(itemsRetrieved(response.data)))
      .catch(err => err.response.status===401?dispatch({type:LOGOUT}):err)
    }
}

export const changeFolderRetrieve = (folderId, userId, token) => {
  const url = `${api_url}/items?folderId=${folderId}&userId=${userId}`;
  return dispatch => {
    axios.get(url, {
    headers:{
      'Content-Type': 'application/json',
      'X-Auth-Token': token
    }
  }).then(response => dispatch(changeFolderReceived(response.data)));

  }
}

export const saveTodo = (userId, isFolder, checked, text, folderId, uid, parent, token) => {
  const url = `${api_url}/createItem`;
  const body = JSON.stringify({
    "userId": userId,
    "isFolder": isFolder,
    "checked": checked,
    "text": text,
    "folderId": folderId,
    "uid": uid,
    "parent": parent
  });
  return dispatch => {
    axios.post(url,body, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token
      }}).then(response => dispatch(savedTodo(body)))
      .catch(err => err.response.status===401?dispatch({type:LOGOUT}):dispatch({type:ERROR_SAVING}));
  }
}

export const updateTodoItemCheckBox = (userId, checked, uid, parent, token) => {
  const url = `${api_url}/updateTodoItem`;
  const body = JSON.stringify({
    "userId": userId,
    "checked": checked,
    "uid": uid,
    "parent": parent
  });
  return dispatch => {
    axios.put(url,
      body,
      {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token
      }}).then(response => dispatch(updatedTodoItemCheckBox(response.data)));
  }
}

export const deleteTodo = (userId,uid,parent, token) => {
  const url = `${api_url}/deleteTodo`;
  const body= JSON.stringify({
    "userId": userId,
    "uid": uid,
    "parent": parent
  });
  return dispatch => {
    axios.put(url,body,{
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token
      }}).then(response => dispatch(deletedTodo(response.data, uid)));
    }
}

export const editTodo = (userId,text,uid, token) => {
  const url = `${api_url}/editTodo`;
  const body = JSON.stringify({
    "userId": userId,
    "text": text,
    "uid": uid
  });
  return dispatch => {
    axios.put(url,body,{
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token
      }}).then(response => dispatch(editedTodo(response.data)));
  }
}

export const deleteMultiple = (userId, uids, parent,token) => {
  const url = `${api_url}/deleteTodoGroup`;
  const body = JSON.stringify({
    "userId": userId,
    "uid": uids,
    "parent": parent
  });
  return dispatch => {
    axios.put(url,body,{
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token
      }}).then(response => dispatch(deleteMultipleHandle(response.data)));
  }
}

export const moveMultiple = (userId, uids, folderId,token) => {
  const url = `${api_url}/folderChangedGroup`;
  const body = JSON.stringify({
    "userId": userId,
    "uid": uids,
    "folderId": folderId
  });
  return dispatch => {
    axios.put(url,body,{
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token
      }}).then(response => dispatch(moveMultipleHandle(response.data)));
  }
}

export const updateDesc = (userId, uid, desc,token) => {
  const url = `${api_url}/setDescription`;
  const body = JSON.stringify({
    "userId": userId,
    "uid": uid,
    "description": desc
  });
  return dispatch => {
    axios.put(url,body,{
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token
      }}).then(response => dispatch(updatedDesc(response.data)));
  }
}

export const updatePriority = (userId, uid, priority,token) => {
  const url = `${api_url}/setPriority`;
  const body = JSON.stringify({
    "userId": userId,
    "uid": uid,
    "priority": priority
  });
  return dispatch => {
    axios.put(url,body,{
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token
      }}).then(response => dispatch(updatedPriority(response.data)));
  }
}
