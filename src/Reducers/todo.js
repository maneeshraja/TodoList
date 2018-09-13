import {SAVE_TODO_ITEM,UPDATE_TODO_ITEM,DELETE_TODO_ITEM,
        UPDATE_TODO_FOLDER,DELETE_TODO_FOLDER,SAVE_TODO_FOLDER,RETRIEVE_TODO,INITIAL_STATE} from '../Constants';

const todoReducer = (state={items:{}, initialState:{}}, action) => {

  let returnState = {};

  switch(action.type) {
    case RETRIEVE_TODO: returnState = {...state, items:action.data};
                        return returnState;
    case INITIAL_STATE: returnState = {...state, initialState:action.data};
                        return returnState;
    default: return state;
  }
}

export default todoReducer;
