import {SAVE_TODO,EDIT_TODO,DELETE_TODO, api_url,UPDATE_TODO_ITEM_CHECKBOX,
        UPDATE_ITEMS, APPLICATION_ERROR,RETRIEVE_TODO,INITIAL_STATE,
        UPDATE_INITIALSTATE, TOGGLE_SAVING, ERROR_SAVING, TOGGLE_ERROR_SAVING,
        CHANGE_FOLDER,REMOVE_FROM_ITEMS, CHANGE_FOLDER_RETREIVE, FOLDER_CHANGE_ERROR,
        TOGGLE_CHANGE_FOLDER_SUCCESSFULL, MOVE_MULTIPLE, DELETE_MULTIPLE, TOGGLE_SUCCESS,
        UPDATE_DESC, UPDATE_PRIORITY} from '../Constants';

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
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        "userId":userId,
        "uid": uid,
        "folderId": folderId
      })
    }).then(response => response.json()).then(response => dispatch(changedFolder(response))).catch(dispatch({type: FOLDER_CHANGE_ERROR}))
  }
}

export const getInitialState = () => {
  const url = `${api_url}/initialStats?userId=1`;
  return dispatch => {
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    }).then(response => response.json())
      .then(response => dispatch(initialState(response)))
      .catch(dispatch({type: APPLICATION_ERROR}))
  }
}

export const retrieveTodo = (folderId) => {
  const url = `${api_url}/items?folderId=${folderId}&userId=1`;
  return dispatch => {
    fetch(url, {
    method: 'GET', // or 'PUT'
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(response => dispatch(itemsRetrieved(response)));

  }
}

export const changeFolderRetrieve = (folderId) => {
  const url = `${api_url}/items?folderId=${folderId}&userId=1`;
  return dispatch => {
    fetch(url, {
    method: 'GET', // or 'PUT'
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(response => dispatch(changeFolderReceived(response)));

  }
}

export const saveTodo = (userId, isFolder, checked, text, folderId, uid, parent) => {
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
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    }).then(res => res.json())
      .then(response => dispatch(savedTodo(body)))
      .catch(error => dispatch({type:ERROR_SAVING}));
  }
}

export const updateTodoItemCheckBox = (userId, checked, uid, parent) => {
  const url = `${api_url}/updateTodoItem`;
  return dispatch => {
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userId": userId,
        "checked": checked,
        "uid": uid,
        "parent": parent
      })
    }).then(res => res.json()).then(response => dispatch(updatedTodoItemCheckBox(response)));
  }
}

export const deleteTodo = (userId,uid,parent) => {
  const url = `${api_url}/deleteTodo`;
  return dispatch => {
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userId": userId,
        "uid": uid,
        "parent": parent
      })
    }).then(res => res.json()).then(response => dispatch(deletedTodo(response, uid)));
    }
}

export const editTodo = (userId,text,uid) => {
  const url = `${api_url}/editTodo`;
  return dispatch => {
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userId": userId,
        "text": text,
        "uid": uid
      })
    }).then(res => res.json()).then(response => dispatch(editedTodo(response)));
  }
}

export const deleteMultiple = (userId, uids, parent) => {
  const url = `${api_url}/deleteTodoGroup`;
  return dispatch => {
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userId": userId,
        "uid": uids,
        "parent": parent
      })
    }).then(resp => resp.json()).then(response => dispatch(deleteMultipleHandle(response)));
  }
}

export const moveMultiple = (userId, uids, folderId) => {
  const url = `${api_url}/folderChangedGroup`;
  return dispatch => {
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userId": userId,
        "uid": uids,
        "folderId": folderId
      })
    }).then(resp => resp.json()).then(response => dispatch(moveMultipleHandle(response)));
  }
}

export const updateDesc = (userId, uid, desc) => {
  const url = `${api_url}/setDescription`;
  return dispatch => {
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userId": userId,
        "uid": uid,
        "description": desc
      })
    }).then(res => res.json()).then(response => dispatch(updatedDesc(response)));
  }
}

export const updatePriority = (userId, uid, priority) => {
  const url = `${api_url}/setPriority`;
  return dispatch => {
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userId": userId,
        "uid": uid,
        "priority": priority
      })
    }).then(res => res.json()).then(response => dispatch(updatedPriority(response)));
  }
}
