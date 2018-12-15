import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import { updateDesc, updatePriority, deleteTodo} from '../../Actions/todo.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class SideBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: false,
      changes: {descStatus: false,
                priorityStatus: false,
                desc: "",
                priority: 0
              }
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  componentDidMount(){
    this.setState({isOpen: this.props.showSideBar,
                   changes: {...this.state.changes,
                                  desc: this.props.itemValue.description,
                                  priority: this.props.itemValue.priority
                  }
                });

    document.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.showSideBar !== this.state.isOpen) {
      this.setState({isOpen: nextProps.showSideBar});
    }

    this.setState({changes: {...this.state.changes,
                    desc: nextProps.itemValue.description,
                    priority: nextProps.itemValue.priority
                  }});
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleClick(){
    this.setState({isOpen: false});
    if(this.props.callBack){
      this.props.callBack(false);
    }
  }

  handleDocumentClick(e) {
    if(!e.target.closest(".sideBarMain")) {
      this.handleClick();
    }
  }


  handleKeyDown(e) {
    if(e.keyCode === 27) {
      this.handleClick();
    }
  }

  handleScroll(e) {
    //window.scrollTo(0,0);
  }

  handleDescChange(e){
    this.setState({changes: {...this.state.changes, descStatus: true, desc: e.target.value}});
  }

  saveChanges(){
    if(this.props.callBack){
      this.props.callBack(false,this.state.changes,this.props.itemValue.id);
    }
    if(this.state.changes.descStatus) {
      this.props.updateDesc(this.props.userId,this.props.itemValue.id,this.state.changes.desc, this.props.token),
      this.setState({changes: {descStatus: false}})
    }
    if(this.state.changes.priorityStatus){
      this.props.updatePriority(this.props.userId,this.props.itemValue.id,this.state.changes.priority, this.props.token),
      this.setState({changes: {...this.state.changes, priorityStatus: false}})
    }

  }

  render() {
    const itemValue = this.props.itemValue;
    return (
      <div onClick={this.handleDocumentClick} onKeyDown={this.state.handleKeyDown} className={`sideBar ${this.props.className?this.props.className:""} ${this.state.isOpen?"show":"hide"}`}>
        <div className={`sideBarMain ${this.state.isOpen?'show':'hide'}`}>
          <div className="descriptionSideBar">
            <div className="descriptionSideBarHeading">
              <p className="descriptionSideBarHeadingText"><b> {itemValue.text} </b></p>
              <p className="descriptionSideBarHeadingType"> &nbsp;({itemValue.isFolder===1?"Folder":"Item"}) </p>
            </div>
            <div className="descriptionSideBarStatus">
              <label className="descriptionSideBarStatusLabel"> <b> Status: </b></label>
              <p className="descriptionSideBarStatusText"> {itemValue.checked?"Complete":"Incomplete"} </p>
            </div>
            <div className="descriptionSideBarTextArea">
              <label className="descriptionSideBarTextAreaLabel"><b> Description: </b></label><br/>
              <textarea className="descriptionSideBarTextAreaText" maxLength="450" value={this.state.changes.desc} onChange={this.handleDescChange} placeholder="This is editable text.."/>
            </div>

            <div className="descriptionSideBarPriority">
              <label className="descriptionSideBarPriorityLabel"><b> Priority: </b></label> &nbsp;
              <div className="descriptionSideBarPriorityBtns">
                <label>
                  <input
                    type="radio"
                    name="priority"
                    onChange = {() => this.setState({changes: {...this.state.changes, priorityStatus: true, priority: 0 }}) }
                    checked={this.state.changes.priority === 0} /> None &nbsp;
                </label>
                <label>
                  <input
                    type="radio"
                    name="priority"
                    onChange = {() => this.setState({changes: {...this.state.changes, priorityStatus: true, priority: 1 }}) }
                    checked={this.state.changes.priority === 1} /> Low &nbsp;
                </label>
                <label>
                  <input
                    type="radio"
                    name="priority"
                    onChange = {() => this.setState({changes: {...this.state.changes, priorityStatus: true, priority: 2 }}) }
                    checked={this.state.changes.priority === 2} /> High &nbsp;
                </label>
              </div>
            </div>

            <div className="descriptionSideBarCreationTime">
              <label className="descriptionSideBarCreationTimeLabel"><b> Creation Date/Time: </b> </label>
              <p className="descriptionSideBarCreationTimeText"> {itemValue.created_time} </p>
            </div>
            <div className="descriptionSideBarUpdatedTime">
              <label className="descriptionSideBarUpdatedTimeLabel"><b> Updated Date/Time: </b> </label>
              <p className="descriptionSideBarUpdatedTimeText"> {itemValue.updated_time} </p>
            </div>
            <div className="descriptionSideBarSave">
              <button className="toDoButton" onClick={this.saveChanges}> Save </button>
            </div>
            <div className="descriptionSideBarDelete">
              <button className="toDoButton"
                      onClick={() => { this.props.deleteTodo(this.props.userId, itemValue.id, itemValue.parent, this.props.token)
                                       this.setState({isOpen: false})
                                       if(this.props.callBack){
                                         this.props.callBack(false);
                                       }
                                      } }> Delete </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

SideBar.propTypes = {
  showSideBar: PropTypes.bool,
  callBack: PropTypes.func,
  className: PropTypes.string,
  itemValue: PropTypes.object
}

function mapStateToProps(state) {
  return { items: state.todoReducer.items,
           userId: state.authenticationReducer.userId,
           token: state.authenticationReducer.token
          }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({updateDesc,
                             updatePriority,
                             deleteTodo}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (SideBar);
