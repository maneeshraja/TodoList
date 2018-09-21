import {SAVE_TODO,EDIT_TODO,DELETE_TODO, api_url,UPDATE_TODO_ITEM_CHECKBOX, UPDATE_ITEMS,
        RETRIEVE_TODO,INITIAL_STATE, UPDATE_INITIALSTATE, TOGGLE_SAVING, ERROR_SAVING, TOGGLE_ERROR_SAVING} from '../Constants';

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

const deletedTodo = (resp) => {
  return {
    type: DELETE_TODO,
    data: resp
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

export const getInitialState = () => {
  const url = `${api_url}/initialStats?userId=1`;
  return dispatch => {
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    }).then(response => response.json()).then(response => dispatch(initialState(response)))
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

export const saveTodo = (userId, isFolder, checked, text, folderId, uid, parent) => {
  const url = `${api_url}/createItem`;
  const todoItem = {userId, isFolder, checked, text, folderId, uid, parent};
  return dispatch => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userId": userId,
        "isFolder": isFolder,
        "checked": checked,
        "text": text,
        "folderId": folderId,
        "uid": uid,
        "parent": parent
      })
    }).then(res => res.json())
      .then(response => dispatch(savedTodo(todoItem)))
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

  export const deleteTodo = (userId,uid) => {
    const url = `${api_url}/deleteTodo`;
    return dispatch => {
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "userId": userId,
          "uid": uid
        })
      }).then(res => res.json()).then(response => dispatch(deletedTodo(response)));
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
