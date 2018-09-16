import React, {Component} from 'react';
import TodoItem from './TodoItem.js';
import Dropdown from './Dropdown';
import Modal from './Modal';
//import Banner from './Banner';
import {retrieveTodo,
        getInitialState,
        saveTodo,
        updateTodoItemCheckBox,
        updateInitialState,
        updateItems,
        editTodo,
        deleteTodo} from './Actions/todo.js';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './todo.css';



const PreviousFolders = (props) => {

  const { previous, pagerFunc, currentFolder } = props;

  let prev = [...previous];

  const home = (<img src={"home.png"} className="homeImg" />);

  if(prev.length > 0) {
    prev.shift();
    prev.unshift({id:0, name:home});
    prev.push({id:prev.length, name:(<b>{currentFolder}</b>)});
  } else {
    prev.push({id:0, name:home});
  }

  return (
      prev.map((value, index) =>
      <span key={index}> {"/"}
        <span
            className={`toDoPreviousPages ${(prev.length-1 === index)?'last':''}`}
            onClick={() => (prev.length-1 === index)?null:pagerFunc(index, value.id, value.name)}>
              {value.name}
        </span>
      </span>)
  )

}

class ToDoListPage  extends Component {

  constructor(props){
    super(props);

    this.state = {
      todo: [],
      currentFolder: 0,
      currentFolderName: "home.png",
      previousFolders: [],
      folderCount: 0,
      folderChecked: false,
      identity: 0,
      currentTodoUid: 0,
      currentTodoText: "",
      dropdownFilterValue: 1,
      showEditModal: false,
      showDeleteModal: false
    }

    this.inputText = React.createRef();
    this.folder = React.createRef();
    this.updateTodoText = React.createRef();

    this.updatedItems = false;

    this.handleFolderClick = this.handleFolderClick.bind(this);
    this.itemOnClick = this.itemOnClick.bind(this);
    this.handleclick = this.handleclick.bind(this);
    this.handlePager = this.handlePager.bind(this);
    this.dropdownFilterChanged = this.dropdownFilterChanged.bind(this);
    this.editButtonClicked = this.editButtonClicked.bind(this);
    this.deleteButtonClicked = this.deleteButtonClicked.bind(this);

    this.dropdownList = [{id: 1, item: "Show all", disabled: false, active: true},
                          {id: 2, item: "Folders only", disabled: false},
                          {id: 3, item: "Items only", disabled: false},
                          {id: 4, item: "Unchecked items", disabled: false},
                          {id: 5, item: "Checked items", disabled: false}];
  }

  componentDidMount() {
    this.inputText.current.focus();
    this.props.retrieveTodo(this.state.currentFolder);
    this.props.getInitialState();
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.folderCount !== nextProps.initialState.folder_count) {
      this.setState({folderCount: parseInt(nextProps.initialState.folder_count)});
    }

    if(this.state.identity !== nextProps.initialState.identity_count) {
      this.setState({identity: parseInt(nextProps.initialState.identity_count)});
    }

    if(nextProps.items && !isNaN(nextProps.items.length)) {
      this.setState({todo: nextProps.items});
    }
  }

  itemOnClick(n, status) {
    let obj = this.state.todo.filter((value) => {
      return value.id === n;
    });

    let nObj = [];

    obj = obj[0];

    obj.checked = status;

    for(let i=0;i<this.state.todo.length;i++) {
      if(n === this.state.todo[i].id) {
        nObj[i] = obj;
      } else {
        nObj[i] = this.state.todo[i];
      }
    }

    this.props.updateTodoItemCheckBox(1,status,n);

    this.setState({todo: nObj});
  }

  handleclick(){

    const isFolder = this.folder.current.checked;

    let folder_count = this.state.folderCount;
    let identity_count = this.state.identity;

    if(this.inputText.current.value) {
      if (isFolder) {
        const folderCount = this.state.folderCount+1;
        folder_count = folderCount;
        this.props.saveTodo(1, true, false, this.inputText.current.value, folderCount, this.state.identity, this.state.currentFolder);
        this.setState({folderCount, todo: [...this.state.todo,
                                                {text: this.inputText.current.value,
                                                 checked: false,
                                                 isFolder: true,
                                                 folderId: folderCount,
                                                 parent: this.state.currentFolder,
                                                 id: this.state.identity,
                                                 created_time: "now",
                                                 updated_time: "now"}]});

       this.props.updateItems({todo: [...this.state.todo,
                                               {text: this.inputText.current.value,
                                                checked: false,
                                                isFolder: true,
                                                folderId: folderCount,
                                                parent: this.state.currentFolder,
                                                id: this.state.identity,
                                                created_time: "now",
                                                updated_time: "now"}]});

        // resetting the Folder toggle on UI
        this.folder.current.checked = false;
        this.setState({folderChecked: false});
      } else {
        this.props.saveTodo(1, false, false, this.inputText.current.value, -1, this.state.identity, this.state.currentFolder);
        this.setState({todo: [...this.state.todo,
                                   {text: this.inputText.current.value,
                                    checked: false,
                                    isFolder: false,
                                    folderId: -1,
                                    parent: this.state.currentFolder,
                                    id: this.state.identity,
                                    created_time: "now",
                                    updated_time: "now"}]});
        this.props.updateItems({todo: [...this.state.todo,
                                   {text: this.inputText.current.value,
                                    checked: false,
                                    isFolder: false,
                                    folderId: -1,
                                    parent: this.state.currentFolder,
                                    id: this.state.identity,
                                    created_time: "now",
                                    updated_time: "now"}]});
      }

      this.setState({identity: this.state.identity+1});
      identity_count++;

      this.props.updateInitialState({folder_count, identity_count});

      this.inputText.current.value = "";
    }
  }

  handleFolderClick(e) {
    const folderId = parseInt(e.currentTarget.getAttribute("folderid"));
    const folderText = e.currentTarget.getAttribute("foldertext");

    this.props.retrieveTodo(folderId);

    this.setState({currentFolder: folderId,
                   currentFolderName: folderText,
                   previousFolders: [...this.state.previousFolders,
                                        {id: this.state.currentFolder, name: this.state.currentFolderName}
                                    ]
                  });
  }

  handlePager(index, id, name) {
    this.props.retrieveTodo(id);
    this.setState({currentFolder: id, currentFolderName: name, previousFolders: this.state.previousFolders.slice(0, index)});
  }

  dropdownFilterChanged(selectedId) {
    this.setState({dropdownFilterValue: selectedId});
  }

  editButtonClicked() {
    const txt = this.updateTodoText.current.value;
    if(txt) {
      this.props.editTodo(1, txt, this.state.currentTodoUid);
      this.setState({showEditModal: false});

      const todo = this.state.todo.map((value) => {
        if(value.id === this.state.currentTodoUid) {
          value.text = txt;
        }
        return value;
      });

      this.setState({todo});
      this.props.updateItems({todo});

      this.updateTodoText.current.value = "";

    } else {
      console.log("Empty text");
    }
  }

  deleteButtonClicked() {
    this.props.deleteTodo(1, this.state.currentTodoUid);
    this.setState({showDeleteModal: false});

    const todo = this.state.todo.filter((value) => (value.id !== this.state.currentTodoUid));
    this.setState({todo});
    this.props.updateItems({todo});
  }

  render(){

    let folderSpecificList = this.state.todo.filter((value) => value.parent === this.state.currentFolder);

    if (!folderSpecificList) {
      folderSpecificList = [];
    }

    let filterSpecificList = folderSpecificList.filter((value) => {
                                                        if (value.isFolder && this.state.dropdownFilterValue === 2) {
                                                          return true;
                                                        }

                                                        if (value.checked && this.state.dropdownFilterValue === 5) {
                                                          return true;
                                                        }

                                                        if (!value.checked && !value.isFolder && this.state.dropdownFilterValue === 4) {
                                                          return true;
                                                        }

                                                        if (!value.isFolder && this.state.dropdownFilterValue === 3) {
                                                          return true;
                                                        }

                                                        if (this.state.dropdownFilterValue === 1) {
                                                          return true;
                                                        }

                                                      });

    const message = "No records to display!";
    return(
      <div className="pagestyles">
        <div>
          <input maxLength="100" onChange={this.handleMaxLength} className="toDoInput" onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                this.handleclick();
                                                            }
                                                          }} type="text" placeholder="Laundry" ref={this.inputText} />
          <div className="toDoFolder">
            <label> <input type="checkbox" ref={this.folder} onChange={(e) => this.setState({folderChecked: e.currentTarget.checked})} /> Folder </label>
          </div>
          <button className="toDoButton" onClick={this.handleclick}> Add{`${this.state.folderChecked?' Folder':' Item'}`} </button>
        </div>
        <div className="toDoFilter">
          <label><b> Filter: </b></label>
          <Dropdown isDisabled={this.state.isDisabled} dropdownSelectedItem={this.state.dropdownValue} dropdownList={this.dropdownList} callBack={this.dropdownFilterChanged} />
        </div>
        <div className="toDoPrevious">
          <PreviousFolders previous={this.state.previousFolders} currentFolder={this.state.currentFolderName} pagerFunc={this.handlePager} />
        </div>
        <div className={`noRecordsToDisplay ${filterSpecificList.length > 0?'d_none':'d_block'}`}>
          {message}
        </div>
        <div className={`${filterSpecificList.length === 0?'d_none':'d_block'}`}>
          {filterSpecificList.map((value, index) => value.isFolder?(
                <div className="todoRow" key={index}>
                  <img src="editIcon.png" className="editImg" onClick={() => this.setState({showEditModal: true, currentTodoUid: value.id, currentTodoText: value.text})} />
                  <img src="deleteIcon.png" className="deleteImg" onClick={() => this.setState({showDeleteModal: true, currentTodoUid: value.id})} />
                  <div className="folder" folderid={value.folderId} foldertext={value.text} onClick={this.handleFolderClick}>
                    <img src="folder.png" className="folderImg" />
                    {value.text}
                  </div>
                </div>
              ):(
                <div className="todoRow" key={index}>
                  <img src="editIcon.png" className="editImg" onClick={() => this.setState({showEditModal: true, currentTodoUid: value.id, currentTodoText: value.text})} />
                  <img src="deleteIcon.png" className="deleteImg" onClick={() => this.setState({showDeleteModal: true, currentTodoUid: value.id})} />
                  <TodoItem
                     text={value.text}
                     checked={value.checked===1}
                     id={value.id}
                     callBack={this.itemOnClick}/>
                </div>
             ))}
        </div>

        <Modal showModal={this.state.showEditModal} callBack={(s) => this.setState({showEditModal: s})}>
          <div className="editModal">
            <h2 className="editModalHead"> Edit Item/Folder </h2>
            <input type="text" ref={this.updateTodoText} onKeyDown={(e) => { if(e.keyCode === 13) { this.editButtonClicked(); } }} className="editModalInput" placeholder={this.state.currentTodoText} />
            <div className="editModalButton" onClick={this.editButtonClicked}>
                 Update </div>
          </div>
        </Modal>

        <Modal showModal={this.state.showDeleteModal} callBack={(s) => this.setState({showDeleteModal: s})}>
          <div className="deleteModal">
            <div className="deleteModalMessage"> Are you sure you want to delete? </div>
            <div className="deleteModalButtons">
              <div className="deleteModalButtonsNo" onClick={() => this.setState({showDeleteModal: false})}>
                Cancel
              </div>
              <div className="deleteModalButtonsYes" onClick= {this.deleteButtonClicked}>
                Delete
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { items: state.todoReducer.items,
           initialState: state.todoReducer.initialState };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({retrieveTodo,
                             getInitialState,
                             saveTodo,
                             updateTodoItemCheckBox,
                             updateInitialState,
                             updateItems,
                             editTodo,
                             deleteTodo}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (ToDoListPage);
