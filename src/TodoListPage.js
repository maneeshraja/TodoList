import React, {Component} from 'react';
import TodoItem from './TodoItem.js';
import Dropdown from './Dropdown';
import Modal from './Modal';
import Banner from './Banner';
import Loader from './Loader';
import {retrieveTodo,
        getInitialState,
        saveTodo,
        updateTodoItemCheckBox,
        updateInitialState,
        updateItems,
        editTodo,
        deleteTodo,
        toggleSaving} from './Actions/todo.js';
import { mergeSort } from './util.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PreviousFolders } from './Components/PreviousFolders.js';
import ChangeFolder from './Components/ChangeFolder.js';
import SideBar from './Components/SideBar.js';
import CheckBox from './Components/CheckBox'
import './todo.css';

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
      currentTodoParent: 0,
      dropdownFilterValue: 1,
      showEditModal: false,
      showDeleteModal: false,
      showDescriptionModal: false,
      showFolderChangeModal: false,
      showBanner: false,
      showEditModalBanner: false,
      EditbannerMessage:"",
      bannerMessage: "",
      bannerStatus: 0,
      bannerAfterClose: 3,
      showLoader: false,
      loaderText: "",
      dropdownSortValue: 1,
      multipleSelected: []
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
    this.dropdownSortChanged = this.dropdownSortChanged.bind(this);
    this.filterItems = this.filterItems.bind(this);
    this.orderItems = this.orderItems.bind(this);
    this.editButtonClicked = this.editButtonClicked.bind(this);
    this.deleteButtonClicked = this.deleteButtonClicked.bind(this);
    this.processMultipleSelected = this.processMultipleSelected.bind(this);

    this.dropdownList = [ {id: 1, item: "Show all", disabled: false, active: true},
                          {id: 2, item: "Folders only", disabled: false},
                          {id: 3, item: "Items only", disabled: false},
                          {id: 4, item: "Unchecked items", disabled: false},
                          {id: 5, item: "Checked items", disabled: false},
                          {id: 6, item: "InCompleted Folders", disabled: false},
                          {id: 7, item: "Completed Folders", disabled: false},
                          {id: 8, item: "Pending Tasks", disabled: false},
                          {id: 9, item: "Finished Tasks", disabled: false}];

    this.sortDropdownList = [ {id: 1, item: "None", disabled: false, active: true},
                              {id: 2, item: "Created Date (Ascending)", disabled: false},
                              {id: 3, item: "Created Date (Descending)", disabled: false},
                              {id: 4, item: "Updated Date (Ascending)", disabled: false},
                              {id: 5, item: "Updated Date (Descending)", disabled: false},
                              {id: 6, item: "Name (Ascending)", disabled: false},
                              {id: 7, item: "Name (Descending)", disabled: false},
                              {id: 8, item: "Completed (Top)", disabled: false},
                              {id: 9, item: "Incompleted (Top)", disabled: false},];

    this.bannerStatus = { Info: 0,
                          Success: 1,
                          Warn: 2,
                          Error: 3 };
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

    if(nextProps.saving !== this.props.saving) {
      if(nextProps.saving) {
        this.setState({showLoader: true, loaderText: "Saving new Item/Folder"});
      } else {
        this.setState({showLoader: false, loaderText: ""});
      }
    }
  }

  itemOnClick(n, status) {
    let obj = this.state.todo.filter((value) => {
      return value.id === n;
    });

    let nObj = [];

    obj = obj[0];

    obj.checked = status?1:0;

    for(let i=0;i<this.state.todo.length;i++) {
      if(n === this.state.todo[i].id) {
        nObj[i] = obj;
      } else {
        nObj[i] = this.state.todo[i];
      }
    }

    this.props.updateTodoItemCheckBox(1,status,n,obj.parent);

    this.setState({todo: nObj});
  }

  handleclick(){

    if (this.props.appError) {
      this.setState({showBanner: true,
      bannerMessage: "You can't add items at this time. Try refreshing or contact help@todo.com",
      bannerStatus: 3,
      bannerAfterClose: 30});
      return false;
    }

    const isFolder = this.folder.current.checked;

    let folder_count = this.state.folderCount;
    let identity_count = this.state.identity;

    if(this.inputText.current.value) {
      if (isFolder) {
        const folderCount = this.state.folderCount+1;
        folder_count = folderCount;

        this.props.toggleSaving(true);
        this.props.saveTodo(1, true, false, this.inputText.current.value, folderCount, this.state.identity, this.state.currentFolder);

        // resetting the Folder toggle on UI
        this.folder.current.checked = false;
        this.setState({folderChecked: false});
      } else {
        this.props.toggleSaving(true);
        this.props.saveTodo(1, false, false, this.inputText.current.value, -1, this.state.identity, this.state.currentFolder);
    }

      this.setState({identity: this.state.identity+1,
                     showBanner: true,
                     bannerMessage: (<span><b>Success</b><i>fully</i> added!</span>),
                     bannerStatus: this.bannerStatus.Success,
                     bannerAfterClose: 5});
      identity_count++;

      this.props.updateInitialState({folder_count, identity_count});

      this.inputText.current.value = "";
    } else {
      this.setState({showBanner: true,
                     bannerMessage: "Item field cannot be empty!",
                     bannerStatus: this.bannerStatus.Warn,
                     bannerAfterClose: 3});
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

  dropdownSortChanged(selectedId) {
    this.setState({dropdownSortValue: selectedId});
  }

  editButtonClicked() {
    const txt = this.updateTodoText.current.value;
    if(txt && txt !== this.state.currentTodoText) {
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
        if(txt) {
          this.setState({EditbannerMessage: "Nothing new to update", showEditModalBanner: true})
        } else {
          this.setState({EditbannerMessage: "Empty text", showEditModalBanner:true})
        }
    }
  }

  deleteButtonClicked() {
    this.props.deleteTodo(1, this.state.currentTodoUid,this.state.currentTodoParent);
    this.setState({showDeleteModal: false});

    const todo = this.state.todo.filter((value) => (value.id !== this.state.currentTodoUid));
    this.setState({todo});
    this.props.updateItems({todo});
  }

  filterItems(list) {
    return list.filter((value) => {
                                    if (value.isFolder && this.state.dropdownFilterValue === 2) {
                                      return true;
                                    }

                                    if (value.checked && !value.isFolder && this.state.dropdownFilterValue === 5) {
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

                                    if (!value.checked && value.isFolder && this.state.dropdownFilterValue === 6) {
                                      return true;
                                    }

                                    if (value.checked && value.isFolder && this.state.dropdownFilterValue === 7) {
                                      return true;
                                    }
                                    if(!value.checked && this.state.dropdownFilterValue === 8){
                                      return true;
                                    }
                                    if(value.checked && this.state.dropdownFilterValue === 9){
                                      return true;
                                    }

                                  });
  }

  orderItems(list) {

    const order = this.state.dropdownSortValue;

    if (order === 2) {
      return mergeSort(list, function(a,b) { return new Date(a.created_time).getTime() < new Date(b.created_time).getTime() });
    } else if(order === 3) {
      return mergeSort(list, function(a,b) { return new Date(a.created_time).getTime() > new Date(b.created_time).getTime() });
    } else if(order === 4) {
      return mergeSort(list, function(a,b) { return new Date(a.updated_time).getTime() < new Date(b.updated_time).getTime() });
    } else if(order === 5) {
      return mergeSort(list, function(a,b) { return new Date(a.updated_time).getTime() > new Date(b.updated_time).getTime() });
    } else if(order === 6) {
      return mergeSort(list, function(a,b) { return a.text.toUpperCase() < b.text.toUpperCase() });
    } else if(order === 7) {
      return mergeSort(list, function(a,b) { return a.text.toUpperCase() > b.text.toUpperCase() });
    } else if(order === 8) {
      return mergeSort(list, function(a,b) { return a.checked > b.checked });
    } else if(order === 9) {
      return mergeSort(list, function(a,b) { return a.checked < b.checked });
    } else {
      return list;
    }
  }

  processMultipleSelected(status, id) {
    if (status) {
      this.setState({multipleSelected: [...this.state.multipleSelected, id]});
    } else {
      this.setState({multipleSelected: this.state.multipleSelected.filter((val) => val !== id)})
    }
  }

  render(){

    let folderSpecificList = this.state.todo.filter((value) => value.parent === this.state.currentFolder);

    if (!folderSpecificList) {
      folderSpecificList = [];
    }

    folderSpecificList = this.orderItems(this.filterItems(folderSpecificList));

    const message = "No records to display!";

    const disableGroupedBtns =  this.state.multipleSelected.length <= 0?"disabledInput":"";

    return(
      <div className="pagestyles">
        <Loader showLoader={this.state.showLoader} callBack={(status) => this.setState({showLoader: status})}>
          {this.state.loaderText}
        </Loader>
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
        <div className="bannerContainer">
          <Banner
                status={this.state.bannerStatus}
                closeAfter={this.state.bannerAfterClose}
                showBanner={this.state.showBanner}
                callBack={(status) => this.setState({showBanner: status})}>
            {this.state.bannerMessage}
          </Banner>
        </div>
        <div>
          <div className="toDoFilter">
            <label className="toDoFilterLabel"><b> Filter: </b></label>
            <Dropdown isDisabled={this.state.isDisabled} className="filterTodoFolders" dropdownSelectedItem={this.state.dropdownValue} dropdownList={this.dropdownList} callBack={this.dropdownFilterChanged} />
          </div>
          <div className="toDoSort">
            <label className="toDoSortLabel"><b> Sort By: </b></label>
            <Dropdown isDisabled={this.state.isDisabled} className="groupByTodoItems" dropdownSelectedItem={this.state.sortDropdownValue} dropdownList={this.sortDropdownList} callBack={this.dropdownSortChanged} />
          </div>
        </div>
        <div className="buttonGroup">
          <button className={`toDoButton buttonGroupDelete ${disableGroupedBtns}`}> Delete </button>
          <button className={`toDoButton buttonGroupMove ${disableGroupedBtns}`}> Move </button>
          <button className={`toDoButton buttonGroupShare ${disableGroupedBtns}`}> Share </button>
        </div>
        <div className="toDoPrevious">
          <PreviousFolders previous={this.state.previousFolders} currentFolder={this.state.currentFolderName} pagerFunc={this.handlePager} />
        </div>
        <div className={`noRecordsToDisplay ${folderSpecificList.length > 0?'d_none':'d_block'}`}>
          {message}
        </div>
        <div className={`${folderSpecificList.length === 0?'d_none':'d_block'}`}>
          {folderSpecificList.map((value, index) => value.isFolder?(
                <div className="todoRow" key={index}>
                  <CheckBox className="multiCheck" callBack={(checked) => this.processMultipleSelected(checked, value.id)} />
                  <img src="editIcon.png" className="editImg" onClick={() => this.setState({showEditModal: true, currentTodoUid: value.id, currentTodoText: value.text})} />
                  <span className="todoRowHover">
                    <div className="todoRowFolder" folderid={value.folderId} foldertext={value.text} onClick={this.handleFolderClick}>
                      <img src="folder.png" className={`folderImg ${value.checked?'checkedFolder':''}`} />
                      <span className={`${value.checked?'checked':''}`}> {value.text} </span>
                    </div>
                    <span className={`todoRowFolderDescription`} onClick={() => this.setState({showDescriptionModal: true,currentTodoText: value.text})}> d </span>
                  </span>
                </div>
              ):(
                <div className="todoRow" key={index}>
                  <CheckBox className="multiCheck" callBack={(checked) => this.processMultipleSelected(checked, value.id)} />
                  <img src="editIcon.png" className="editImg" onClick={() => this.setState({showEditModal: true, currentTodoUid: value.id, currentTodoText: value.text})} />
                  <span className="todoRowItem">
                    <TodoItem
                       text={value.text}
                       checked={value.checked===1}
                       id={value.id}
                       callBack={this.itemOnClick}/>
                    <span className={`todoRowItemDescription`} onClick={() => this.setState({showDescriptionModal: true,currentTodoText: value.text})}> d </span>
                  </span>
                </div>
             ))}
        </div>

        <Modal showModal={this.state.showDescriptionModal} callBack={(s) => this.setState({showDescriptionModal: s})}>
          <div className="descriptionModal">
            <h3 className="descriptionModalHeading"> {this.state.currentTodoText} </h3>
            <textarea className="descriptionModalTextArea" placeholder="This is editable text.."/> 
          </div>
        </Modal>

        <Modal showModal={this.state.showEditModal} callBack={(s) => this.setState({showEditModal: s})}>
          <div className="editModal">
            <h2 className="editModalHead"> Edit Item/Folder </h2>
            <input
              type="text"
              ref={this.updateTodoText}
              onKeyDown={(e) => { if(e.keyCode === 13) { this.editButtonClicked(); } }}
              className="editModalInput"
              placeholder = { this.state.currentTodoText}
              defaultValue = { this.state.currentTodoText}
            />

            <div className="editModalButton" onClick={this.editButtonClicked}>
                 Update </div>
          </div>
          <div className="bannerContainer">
            <Banner
                  status={2}
                  closeAfter={3}
                  showBanner={this.state.showEditModalBanner}
                  callBack={(status) => this.setState({showEditModalBanner: status})}>
              {this.state.EditbannerMessage}
            </Banner>
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
        <ChangeFolder showFolderChangeModal={this.state.showFolderChangeModal} uid={this.state.currentTodoUid} callBack={(s) => this.setState({showFolderChangeModal: s})} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { items: state.todoReducer.items,
           initialState: state.todoReducer.initialState,
           saving: state.todoReducer.saving,
           errorSaving: state.todoReducer.errorSaving,
           appError: state.todoReducer.appError
         };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({retrieveTodo,
                             getInitialState,
                             saveTodo,
                             updateTodoItemCheckBox,
                             updateInitialState,
                             updateItems,
                             editTodo,
                             deleteTodo,
                             toggleSaving}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (ToDoListPage);
