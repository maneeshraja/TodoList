import React, {Component} from 'react';
import './styles.css';


export default class Modal extends Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: false
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  componentDidMount(){
    this.setState({isOpen: this.props.showModal});
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.showModal !== this.state.isOpen) {
      this.setState({isOpen: nextProps.showModal});
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleClick(){
    this.setState({isOpen: false})
    if(this.props.callBack){
      this.props.callBack(false);
    }
  }

  handleDocumentClick(e) {
    if(!e.target.closest(".modalBody")) {
      this.handleClick();
    }
  }


  handleKeyDown(e) {
    if(e.keyCode === 27) {
      this.handleClick();
    }
  }

  render(){
    return (
      <div onClick={this.handleDocumentClick} onKeyDown={this.state.handleKeyDown} className={`modal ${this.state.isOpen?"open":"close"}`}>
        <div className="modalBody">
        <div onClick={this.handleClick} className="modalBodyClose"> x </div>
          <div>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }

}
