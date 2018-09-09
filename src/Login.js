import React , { Component } from 'react';
import './index.css';

export default class Login extends Component {


  render(){
    return (
      <div className="LoginPage">
        <label> Email: </label>
        <input type="text" placeholder="abc@gmail.com" /> <br/> <br/><br/>
        <label> Password: </label>
        <input type="password" placeholder="password" />
        <button> Login </button>
      </div>
    )
  }
}
