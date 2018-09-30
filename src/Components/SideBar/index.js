import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import { updateDesc, updatePriority} from '../../Actions/todo.js';
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
  }

  componentDidMount(){
    this.setState({isOpen: this.props.showSideBar,
                   changes: {
                     desc: this.props.itemValue.description,
                     priority: this.props.itemValue.priority
                  }
                });

    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.showSideBar !== this.state.isOpen) {
      this.setState({isOpen: nextProps.showSideBar,
                     changes: {
                       desc: nextProps.itemValue.description,
                       priority: nextProps.itemValue.priority
                     }
                   });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleClick(){
    this.setState({isOpen: false});
    if(this.props.callBack){
      this.props.callBack(false,this.state.changes,this.props.itemValue.id);
    }
    if(this.state.changes.descStatus) {
      this.props.updateDesc(1,this.props.itemValue.id,this.state.changes.desc),
      this.setState({changes: {descStatus: false}})
    }
    if(this.state.changes.priorityStatus){
      this.props.updatePriority(1,this.props.itemValue.id,this.state.changes.priority),
      this.setState({changes: { priorityStatus: false}})
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

  handleDescChange(e){
    this.setState({changes: {descStatus: true,
                            desc: e.target.value
                  }})
  }

  handlePriorityChange(n){
    this.setState({changes: {priorityStatus: true,
                             priority: n
                            }
                  })
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
              <p className="descriptionSideBarStatusText"> {itemValue.checked===0?"Incomplete":"Complete"} </p>
            </div>
            <div className="descriptionSideBarTextArea">
              <label className="descriptionSideBarTextAreaLabel"><b> Description: </b></label><br/>
              <textarea className="descriptionSideBarTextAreaText" maxLength="450" value={this.state.changes.desc} onChange={this.handleDescChange} placeholder="This is editable text.."/>
            </div>

            <div className="descriptionSideBarPriority">
              <label className="descriptionSideBarPriorityLabel"><b> Priority: </b></label> &nbsp;
              <div className="descriptionSideBarPriorityBtns">
                <input type="radio" name="priority" onChange = {this.handlePriorityChange.bind(this,0)} value="None" checked= {this.state.changes.priority === 0?"checked":null}/> None &nbsp;
                <input type="radio" name="priority" onChange = {this.handlePriorityChange.bind(this,1)} value="Low" checked= {this.state.changes.priority === 1?"checked":null}/> Low &nbsp;
                <input type="radio" name="priority" onChange = {this.handlePriorityChange.bind(this,2)} value="High" checked= {this.state.changes.priority === 2?"checked":null}/> High &nbsp;
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
            <div className="descriptionSideBarUpdatedTime">
              <button className="toDoButton"> Delete </button>
            </div>
          </div>
          <div className="descriptionSideBarNote"> <i> Changes will be saved automatically </i>
          </div>
        </div>
      </div>
    )
  }

}

SideBar.propTypes = {
  showSideBar: PropTypes.bool,
  callBack: PropTypes.func,
  className: PropTypes.string
}

function mapStateToProps(state) {
  return { items: state.todoReducer.items}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({updateDesc,
                             updatePriority}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (SideBar);
