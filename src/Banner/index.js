import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.css';

export default class Banner extends Component{
  constructor(props){
    super(props);
    this.state= {
      showBanner: true,
    }
  }

  render(){
    const color = (this.props.color)?this.props.color:"";
    return(
      <div className={`banner ${this.state.showBanner?"block":"none"} ${color}`}>
        {this.props.message}
        <div className="bannerButtonClose"> + </div>
      </div>
    )
  }
}

TodoItem.propTypes = {
  color:PropTypes.string,
  message:PropTypes.string.isRequired,
}
