import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

export default class TodoItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: "",
      checked: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.checkbox = React.createRef();
  }

  componentDidMount() {
    if(this.props.text) {
      this.setState({text: this.props.text});
    }

    if(this.props.checked) {
      this.setState({checked: true});
      this.checkbox.current.checked = true;
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.text !== this.props.text || nextProps.checked !== this.props.checked) {
      this.setState({text: nextProps.text, checked: nextProps.checked});
      this.checkbox.current.checked = nextProps.checked;
    }
  }

  handleChange(e){
    this.setState({checked: e.currentTarget.checked});
    if(this.props.callBack) {
      this.props.callBack(this.props.id, e.currentTarget.checked);
    }
  }

  render() {
    return (
      <div className={`${this.props.className?this.props.className:""} toDoItems`}>
        <label className={`todoItemLabel lineHeight25 ${this.state.checked?'checked':''}`}>
          <input
            className = "toDoItemInput"
            type="checkbox"
            ref={this.checkbox}
            onChange={this.handleChange}
            data-id={this.props.id}
          />
          {this.state.text}
        </label>
      </div>
    );
  }
}

TodoItem.propTypes = {
  text: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  id: PropTypes.number.isRequired,
  callBack: PropTypes.func,
  className: PropTypes.string
}
