import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.css';

export default class Dropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      selectedItem: ""
    }

    this.handleDropdownClick = this.handleDropdownClick.bind(this);
    this.handleDropdownItemClick = this.handleDropdownItemClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyDownItem = this.handleKeyDownItem.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  componentDidMount() {
    this.props.dropdownList.map((value) => {
      if(value.active) {
        this.setState({selectedItem: value.item});
      }
    });

    document.addEventListener("click", this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleDocumentClick);
  }

  handleDocumentClick(e) {
    if(!e.target.closest(".dropdownContainer")) {
      this.setState({isDropdownOpen: false});
    }
  }

  handleDropdownClick() {
    this.setState({isDropdownOpen: !this.state.isDropdownOpen});
  }

  handleDropdownItemClick(e) {
    this.setState({isDropdownOpen: false, selectedItem: e.currentTarget.innerText});
    if(this.props.callBack) {
      this.props.callBack(parseInt(e.currentTarget.getAttribute("data-id")));
    }
  }

  handleKeyDown(e) {
    if(e.keyCode === 13) {
      this.setState({isDropdownOpen: !this.state.isDropdownOpen});
    }

    if(e.keyCode === 27) {
      this.setState({isDropdownOpen: false});
    }

    if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
      document.querySelector(".dropdownContainerListItem.selected").focus();
    }
  }

  handleKeyDownItem(e) {
    if(e.keyCode === 13) {
      this.setState({isDropdownOpen: false, selectedItem: e.currentTarget.innerText});
      if(this.props.callBack) {
        this.props.callBack(parseInt(e.currentTarget.getAttribute("data-id")));
      }
    }

    if(e.keyCode === 27) {
      this.setState({isDropdownOpen: false});
    }

    if(e.keyCode === 37 || e.keyCode === 38) {

      let previous = e.currentTarget.previousSibling;
      let current = e.currentTarget;

      if(previous && previous.className.includes("dropdownContainerListItem")) {
        previous.focus();
        previous.className = `selected ${previous.className}`;
        current.className.replace("selected","");
        this.setState({selectedItem: previous.innerText});
        if(this.props.callBack) {
          this.props.callBack(parseInt(current.getAttribute("data-id")));
        }
      }
    }

    if(e.keyCode === 39 || e.keyCode === 40) {

      let next = e.currentTarget.nextSibling;
      let current = e.currentTarget;

      if(next && next.className.includes("dropdownContainerListItem")) {
        next.focus();
        next.className = `selected ${next.className}`;
        current.className.replace("selected","");
        this.setState({selectedItem: next.innerText});
        if(this.props.callBack) {
          this.props.callBack(parseInt(current.getAttribute("data-id")));
        }
      }
    }
  }

  render() {
    /*
    <img src="./down.png" className={`dropdownContainerButtonDownIcon ${this.state.isDropdownOpen?"rotate":""}`}/>
    */
    return (
      <div className={`${this.props.className} dropdownContainer`}>
          <div className={`dropdownContainerButton ${this.props.isDisabled?"disableButton":""}`} tabIndex={0} onClick={this.handleDropdownClick} onKeyDown={this.handleKeyDown}>
            { this.state.selectedItem }
            <div className={`dropdownContainerButtonDownIcon ${this.state.isDropdownOpen?"rotate":""}`}> </div>
          </div>
          <div className={`dropdownContainerList ${this.state.isDropdownOpen?"block":"none"}`}>
            {
              this.props.dropdownList.map((a,b) => {
                  if(a.disabled) {
                    return (
                      <div key={a.id} data-id={a.id} className={`dropdownContainerListItem disabled`} onClick={this.handleDropdownItemClick} onKeyDown={this.handleKeyDownItem}>
                        {a.item}
                      </div>
                    );} else {
                    return (
                      <div key={a.id} data-id={a.id} className={`dropdownContainerListItem ${a.item === this.state.selectedItem?"selected":""}`} onClick={this.handleDropdownItemClick} tabIndex={2} onKeyDown={this.handleKeyDownItem}>
                        {a.item}
                      </div>
                    );}
              })
             }
          </div>
      </div>
    )
  }
}

Dropdown.propTypes = {
  dropdownList: PropTypes.array.isRequired,
  isDisabled: PropTypes.bool,
  callBack: PropTypes.func,
  className: PropTypes.string
}
