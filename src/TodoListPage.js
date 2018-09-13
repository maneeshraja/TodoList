import React, {Component} from 'react';
import TodoItem from './TodoItem.js';
import Dropdown from './Dropdown';
//import Banner from './Banner';
import {retrieveTodo, getInitialState} from './Actions/todo.js';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './App.css';

class ToDoListPage  extends Component {

/*
[{text: "Laundry", checked: false, isFolder: false, parent: 0, id: 0},
       {text: "Cook", checked: true, isFolder: false, parent: 0, id: 1},
       {text: "DMV", isFolder: true, parent: 0, folderId: 1, id: 2},
       {text: "Health", isFolder: true, parent: 0, folderId: 2, id: 3},
       {text: "HomeWork", isFolder: true, parent: 1, folderId: 3, id: 4},
       {text: "React Project", isFolder: true, parent: 3, folderId: 4, id: 5},
       {text: "Expired DL", checked: true, isFolder: false, parent: 3, id: 6},
       {text: "Dallas", checked: false, isFolder: false, parent: 2, id: 7},
       {text: "San Antonio", checked: false, isFolder: false, parent: 2, id: 8}]
*/

  constructor(props){
    super(props);

    this.state = {
      todo: [{text: "Laundry", checked: false, isFolder: false, parent: 0, id: 0},
             {text: "Cook", checked: true, isFolder: false, parent: 0, id: 1},
             {text: "DMV", isFolder: true, parent: 0, folderId: 1, id: 2},
             {text: "Health", isFolder: true, parent: 0, folderId: 2, id: 3},
             {text: "HomeWork", isFolder: true, parent: 1, folderId: 3, id: 4},
             {text: "React Project", isFolder: true, parent: 3, folderId: 4, id: 5},
             {text: "Expired DL", checked: true, isFolder: false, parent: 3, id: 6},
             {text: "Dallas", checked: false, isFolder: false, parent: 2, id: 7},
             {text: "San Antonio", checked: false, isFolder: false, parent: 2, id: 8}],
      currentFolder: 0,
      currentFolderName: "Home",
      previousFolders: [],
      folderCount: 0,
      folderChecked: false,
      identity: 0,
      dropdownFilterValue: 1
    }

    this.inputText = React.createRef();
    this.folder = React.createRef();

    this.handleFolderClick = this.handleFolderClick.bind(this);
    this.itemOnClick = this.itemOnClick.bind(this);
    this.handleclick = this.handleclick.bind(this);
    this.handlePager = this.handlePager.bind(this);
    this.dropdownFilterChanged = this.dropdownFilterChanged.bind(this);

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
    if(nextProps.initialState && this.state.folderCount !== nextProps.initialState.folder_count) {
      this.setState({folderCount: nextProps.initialState.folder_count});
    }

    if(nextProps.initialState && this.state.identity !== nextProps.initialState.identity_count) {
      this.setState({identity: nextProps.initialState.identity_count});
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

    this.setState({todo: nObj});
  }

  handleclick(){

    const isFolder = this.folder.current.checked;

    if(this.inputText.current.value) {
      if (isFolder) {
        const folderCount = this.state.folderCount+1;
        this.setState({folderCount, todo: [...this.state.todo, {text: this.inputText.current.value, isFolder: true, folderId: folderCount, parent: this.state.currentFolder, id: this.state.identity}]});
        this.folder.current.checked = false;
        this.setState({folderChecked: false});
      } else {
        this.setState({todo: [...this.state.todo, {text: this.inputText.current.value, checked: false, isFolder: false, parent: this.state.currentFolder, id: this.state.identity}]});
      }

      this.setState({identity: this.state.identity+1});
      this.inputText.current.value = "";
    }
  }

  handleFolderClick(e) {
    const folderId = parseInt(e.currentTarget.getAttribute("folderid"));
    const folderText = e.currentTarget.getAttribute("foldertext");

    this.setState({currentFolder: folderId,
                   currentFolderName: folderText,
                   previousFolders: [...this.state.previousFolders,
                                        {id: this.state.currentFolder, name: this.state.currentFolderName}
                                    ]
                  });
  }

  handlePager(index, id, name) {
    this.setState({currentFolder: id, currentFolderName: name, previousFolders: this.state.previousFolders.slice(0, index)});
  }


  dropdownFilterChanged(selectedId) {
    this.setState({dropdownFilterValue: selectedId});
  }

  render(){

    let folderSpecificList = this.state.todo.filter((value) => {
                                                              return value.parent === this.state.currentFolder;
                                                            });
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
    //console.log(this.props.items);
    //console.log(this.props.initialState);
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
          {this.state.previousFolders.map((value, index) => <span>/<span className="toDoPreviousPages" onClick={() => this.handlePager(index, value.id, value.name)}>{value.name}</span></span>)}
          {"/ "}<b>{this.state.currentFolderName}</b>
        </div>
        <div className={`noRecordsToDisplay ${filterSpecificList.length > 0?'d_none':'d_block'}`}>
          {message}
        </div>
        <div className={`${filterSpecificList.length === 0?'d_none':'d_block'}`}>
          {filterSpecificList.map((value, index) => value.isFolder?(
                <div className="folder" key={index} folderid={value.folderId} foldertext={value.text} onClick={this.handleFolderClick}>
                  <img src="folder.png" className="folderImg" />
                  {value.text}
                </div>
              ):(
                <TodoItem
                   text={value.text}
                   checked={value.checked}
                   id={value.id}
                   key={index}
                   callBack={this.itemOnClick}/>
             ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  //console.log(state);
  return { items: state.todoReducer.items,
           initialState: state.todoReducer.initialState };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({retrieveTodo, getInitialState}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps) (ToDoListPage);
