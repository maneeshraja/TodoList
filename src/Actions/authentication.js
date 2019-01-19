import { REGISTER, LOGIN, REGISTRATION_ERROR, LOGIN_ERROR, LOGOUT, CLEAR_MESSAGE,
         UNLOCK_ACCOUNT, RESET_PASSWORD, RESET_ERROR, api_url} from '../Constants';
import axios from 'axios';

export const registered = (resp) => {
  return {
    type: REGISTER,
    data: resp,
  }
}

export const loggedIn = (resp) => {
  return {
    type: LOGIN,
    data: resp,
  }
}

export const unlockLinkSent = (resp) => {
  return {
    type: UNLOCK_ACCOUNT,
    data: resp,
  }
}

export const resetLinkSent = (resp) => {
  return {
    type: RESET_PASSWORD,
    data: resp,
  }
}

export const resetError = (resp) => {
  return {
    type: RESET_ERROR,
    data: resp,
  }
}

export const registrationError = (resp) => {
  return {
    type: REGISTRATION_ERROR,
    data: resp,
  }
}

export const loginError = (resp) => {
  return {
    type: LOGIN_ERROR,
    data: resp,
  }
}

export const logout = () => {
  return{
    type: LOGOUT,
  }
}

export const clearMessage = () => {
  return{
    type: CLEAR_MESSAGE,
  }
}

export const register = (firstName, lastName, email, password) => {
  const url = `${api_url}/register`;
  const body= JSON.stringify({
    "firstName": firstName,
    "lastName": lastName,
    "email": email,
    "password": password
  });
  return dispatch => {
    axios.post(url,body,{
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => dispatch(registered(response.data)))
      .catch(error => dispatch(registrationError(error.response)));
  }
}

export const login = (email, password) => {
  const url = `${api_url}/login`;
  const body= JSON.stringify({
    "email": email,
    "password": password
  });
  return dispatch => {
    axios.post(url,body,{
      headers: {
        'Content-Type': 'application/json'
      }}).then(response => dispatch(loggedIn(response.data)))
           .catch(error => dispatch(loginError(error.response)));
  }
}

export const unlockAccount = (email) => {
  const url = `${api_url}/unlock`;
  const body= JSON.stringify({
    "email": email,
  });
  return dispatch => {
    axios.post(url,body,{
      headers: {
        'Content-Type': 'application/json'
      }}).then(response => dispatch(unlockLinkSent(response.data)))
           .catch(error => dispatch(resetError(error.response)));
  }
}

export const forgotPassword = (email) => {
  const url = `${api_url}/forgot`;
  const body= JSON.stringify({
    "email": email,
  });
  return dispatch => {
    axios.post(url,body,{
      headers: {
        'Content-Type': 'application/json'
      }}).then(response => dispatch(resetLinkSent(response.data)))
           .catch(error => dispatch(resetError(error.response)));
  }
}
