import {SAVE_TODO_ITEM,UPDATE_TODO_ITEM,DELETE_TODO_ITEM,
        UPDATE_TODO_FOLDER,DELETE_TODO_FOLDER,SAVE_TODO_FOLDER,RETRIEVE_TODO,INITIAL_STATE} from '../Constants';

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

export const getInitialState = () => {
  const url = `http://10.0.0.65:18982/initialStats?userId=1`;
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
  const url = `http://10.0.0.65:18982/items?folderId=${folderId}&userId=1`;
  return dispatch => {
    fetch(url, {
    method: 'GET', // or 'PUT'
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(response => dispatch(itemsRetrieved(response)));

  }

}
