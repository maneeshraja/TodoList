import {REGISTER, LOGIN, REGISTRATION_ERROR, LOGIN_ERROR,LOGOUT,CLEAR_MESSAGE,
        RESET_PASSWORD, UNLOCK_ACCOUNT, RESET_ERROR} from '../Constants';
import {BrowserRouter} from 'react-router-dom';

const authenticationReducer = (state = {}, action) => {

  let returnState = {};

  switch (action.type) {
    case REGISTER: returnState = {...state, registrationSuccess: true, messageText:action.data.success};
                   return returnState;
    case LOGIN:    localStorage.setItem("token",action.data.token);
                   returnState = {...state, token: action.data.token, loginSuccess: true, messageText:action.data.success, userId: action.data.user_id, name: action.data.first_name + " " + action.data.last_name};
                   return returnState;
    case LOGOUT:   localStorage.removeItem("token");
                  returnState = {...state, token: "", loginSuccess: false,logoutSuccess: true, messageText:"Logout Successful", userId: 0, name:""};
                  return returnState;
    case REGISTRATION_ERROR: returnState = {...state, registrationSuccess: false, messageText:action.data.data.status};
                   return returnState;
    case LOGIN_ERROR: returnState = {...state, loginSuccess: false, messageText:action.data.data.status};
                   return returnState;
    case CLEAR_MESSAGE: returnState = {...state, loginSuccess: false, messageText:""};
                   return returnState;
    case UNLOCK_ACCOUNT: returnState = {};
                   return returnState;
    case RESET_PASSWORD: returnState = {};
                   return returnState;
    case RESET_ERROR: returnState = {};
                   return returnState;
    default: return state;
  }
}

export default authenticationReducer;
