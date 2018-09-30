import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

export default class CheckBox extends Component{
  constructor(props){
    super(props);
    this.state= {checked: false}
    this.handleChecked = this.handleChecked.bind(this);
  }

  componentDidMount() {
    this.setState({checked: this.props.checked === true});
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.checked !== this.state.checked) {
      this.setState({checked: nextProps.checked});
    }
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
        <input className="customCheckboxInput" checked={this.state.checked} type="checkbox" onChange={this.handleChecked}/>
      </label>
    )
  }
}

CheckBox.propTypes = {
  callBack: PropTypes.func,
  className: PropTypes.string,
  checked: PropTypes.bool
}
