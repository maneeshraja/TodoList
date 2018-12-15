import { REGISTER, LOGIN, REGISTRATION_ERROR, LOGIN_ERROR, LOGOUT, api_url} from '../Constants';

export const registered = () => {
  return {
    type: REGISTER,
    //data: status
  }
}

export const loggedIn = (resp) => {
  return {
    type: LOGIN,
    data: resp,
  }
}

export const registrationError = () => {
  return {
    type: REGISTRATION_ERROR,
    //data: status
  }
}

export const loginError = () => {
  return {
    type: LOGIN_ERROR,
    //data:
  }
}

export const logout = () => {
  return{
    type: LOGOUT,
    //data: resp
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
    fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    }).then(res => res.json())
      .then(response => dispatch(registered(body)))
      .catch(error => dispatch(registrationError()));
  }
}

export const login = (email, password) => {
  const url = `${api_url}/login`;
  const body= JSON.stringify({
    "email": email,
    "password": password
  });
  return dispatch => {
    fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    }).then(res => res.json())
      .then(response => dispatch(loggedIn(response)))
      .catch(error => dispatch(loginError()));
  }
}
