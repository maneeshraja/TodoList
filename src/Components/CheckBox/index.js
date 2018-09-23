import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css';




export default class CheckBox extends Component{
  constructor(props){
    super(props);
    this.state= {checked: false}
    this.handleChecked = this.handleChecked.bind(this);
  }

  handleChecked(e) {
    this.setState({checked: e.currentTarget.checked});
    if(this.props.callBack) {
      this.props.callBack(e.currentTarget.checked);
    }
  }

  render(){
    return(
      <label className={`${this.props.className} customCheckbox ${this.state.checked?"customCheckboxChecked":""}`}>
      <span className={`${this.state.checked?"d_visible":"d_hidden"} customCheckboxTick`}> &#10004; </span>
        <input className="customCheckboxInput" type="checkbox" onChange={this.handleChecked}/>
      </label>
    )
  }
}

CheckBox.propTypes = {
  callBack: PropTypes.func,
  className: PropTypes.string
}
