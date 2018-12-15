import {REGISTER, LOGIN, REGISTRATION_ERROR, LOGIN_ERROR,LOGOUT} from '../Constants';
import {BrowserRouter} from 'react-router-dom';

const authenticationReducer = (state = {}, action) => {

  let returnState = {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoie1xuICAgIFwiZXhwaXJ5XCI6IFwiMjAxOC0xMi0xMSAxNToxMjoyNS44NDcwODFcIixcbiAgICBcInVzZXJJZFwiOiBcIjRcIlxufSJ9.MGDHqzZW73Cmoo2CZsxWEGGkDG7O91bQk30hIlplfbc"};

  switch (action.type) {
    case REGISTER: returnState = {};
                   return returnState;
    case LOGIN:    localStorage.setItem("token",action.data.token);
                   returnState = {...state, token: action.data.token, loginSuccess: true, userId: action.data.user_id, name: action.data.first_name + " " + action.data.last_name};
                   return returnState;
    case LOGOUT:   localStorage.removeItem("token");
                  returnState = {...state, token: "", loginSuccess: false, userId: 0};
                  return returnState;
    case REGISTRATION_ERROR: returnState = {};
                   return returnState;
    default: return state;
  }
}

export default authenticationReducer;
