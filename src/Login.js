import React , { Component } from 'react';
import Modal from './Modal';
import './index.css';

export default class Login extends Component {
  constructor(props){
    super(props);

    this.state = {
      showModal: false,
      modal: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        rePassword: ""
      }
    }
    this.Register = this.Register.bind(this);
    this.modalCallBack = this.modalCallBack.bind(this);
  }

  modalCallBack(val){
    this.setState({showModal:val})
  }

  Register(){
    this.setState({ showModal: false,
                    modal:{firstName: document.getElementById('fn').value,
                           lastName: document.getElementById('ln').value,
                           email: document.getElementById('email').value,
                           password: document.getElementById('pass').value,
                           rePassword: document.getElementById('repass').value
                }});
  }

  render(){
    return (
      <div className="LoginBox">
        <h2 className="loginHeading"> Login </h2>
        <label> Email: </label>
        <input type="text" placeholder="abc@gmail.com" /> <br/> <br/><br/>
        <label> Password: </label>
        <input type="password" placeholder="password" />
        <button className="loginButton"> Login </button>
        <a href="#" className={`smallLinks registerLink`} onClick={() => this.setState({showModal: true})}>Register</a>
        <a href="#" className="smallLinks"> Forgot Password </a>

        <Modal callBack={this.modalCallBack} showModal={this.state.showModal}>
          <div className="registerModal">
            <h3 style={{textAlign:"center"}}> Register</h3>
            <form onSubmit={(e) => e.preventDefault()}>
            <table className="registrationForm">
              <tr>
                <td>
                  <label> First Name </label>
                </td>
                <td>
                  <input type="text" id="fn" name= "firstName" placeholder="First Name"  /> <br/>
                </td>
              </tr>
              <tr>
                <td>
                  <label> Last Name </label>
                </td>
                <td>
                  <input type="text" id="ln" name= "lastName" placeholder="Last Name"  /> <br/>
                </td>
              </tr>
              <tr>
                <td>
                  <label> Email </label>
                </td>
                <td>
                  <input type="email" id="email" name= "email" placeholder="abc@gmail.com"  /> <br/>
                </td>
              </tr>
              <tr>
                <td>
                  <label> Password </label>
                </td>
                <td>
                  <input type="password" id="pass" name="password" placeholder="P@ssw0rd"  /> <br/>
                </td>
              </tr>
              <tr>
                <td>
                  <label> Re-Enter Password </label>
                </td>
                <td>
                  <input type="password" id="repass" name="rePassword" placeholder="P@ssw0rd"  /> <br/>
                </td>
              </tr>
            </table>
            <button className="registerButton" onClick={this.Register}> Register </button>
            </form>
          </div>
        </Modal>

      </div>
    )
  }
}
