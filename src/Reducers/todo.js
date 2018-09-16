import {SAVE_TODO,EDIT_TODO,UPDATE_TODO_ITEM_CHECKBOX, UPDATE_ITEMS,
        DELETE_TODO,RETRIEVE_TODO,INITIAL_STATE, UPDATE_INITIALSTATE} from '../Constants';

const todoReducer = (state={items:[], initialState:{}, saving: false}, action) => {

  let returnState = {};

  switch(action.type) {
    case RETRIEVE_TODO: returnState = {...state, items:action.data.items};
                        return returnState;
    case INITIAL_STATE: returnState = {...state, initialState:action.data};
                        return returnState;
    case SAVE_TODO: returnState = {...state, saving: false};
                        return returnState;
    case UPDATE_TODO_ITEM_CHECKBOX: returnState = {...state, saving: false};
                        return returnState;
    case UPDATE_INITIALSTATE: returnState = {...state, initialState:action.data};
                        return returnState;
    case UPDATE_ITEMS: returnState = {...state, items:action.data};
                        return returnState;
    case DELETE_TODO: returnState = {...state, saving: false}
                        return returnState;
    case EDIT_TODO: returnState = {...state, saving: false}
                        return returnState;

    default: return state;
  }
}

export default todoReducer;
