import {SAVE_TODO,EDIT_TODO,UPDATE_TODO_ITEM_CHECKBOX, UPDATE_ITEMS, TOGGLE_SAVING, ERROR_SAVING,
        DELETE_TODO,RETRIEVE_TODO,INITIAL_STATE, UPDATE_INITIALSTATE, TOGGLE_ERROR_SAVING, APPLICATION_ERROR} from '../Constants';

const todoReducer = (state={items:[],
                     initialState:{},
                     saving: false,
                     errorSaving: false,
                     editing: false,
                     deleting: false,
                     appError: false}, action) => {

  let returnState = {};

  switch(action.type) {
    case RETRIEVE_TODO: returnState = {...state, items:action.data.items};
                        return returnState;
    case INITIAL_STATE: returnState = {...state, initialState:action.data, appError: false};
                        return returnState;
    case SAVE_TODO: const p = JSON.parse(action.data);
                    const d = new Date().getTODOToday();
                    const items = [...state.items, {id: p.uid,
                                                    checked: p.checked,
                                                    folderId: p.folderId,
                                                    isFolder: p.isFolder,
                                                    parent: p.parent,
                                                    text: p.text,
                                                    updated_time: d,
                                                    created_time: d}];
                    returnState = {...state, saving: false, items};
                        return returnState;
    case UPDATE_TODO_ITEM_CHECKBOX: returnState = {...state, saving: false};
                        return returnState;
    case UPDATE_INITIALSTATE: returnState = {...state, initialState:action.data};
                        return returnState;
    case UPDATE_ITEMS: returnState = {...state, items:action.data};
                        return returnState;
    case DELETE_TODO: returnState = {...state, deleting: false};
                        return returnState;
    case EDIT_TODO: returnState = {...state, editing: false};
                        return returnState;
    case TOGGLE_SAVING: returnState = {...state, saving: action.data};
                        return returnState;
    case ERROR_SAVING: returnState = {...state, errorSaving: true, saving: false};
                        return returnState;
    case TOGGLE_ERROR_SAVING: returnState = {...state, errorSaving: action.data};
                        return returnState;
    case APPLICATION_ERROR: returnState = {...state, appError: true};
                        return returnState;

    default: return state;
  }
}

export default todoReducer;
