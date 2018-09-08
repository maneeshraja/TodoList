import React, {Component} from 'react';
import TodoItem from './TodoItem.js';
import './App.css';

export default class ToDoListPage  extends Component {

  constructor(props){
    super(props);

    /*
          [{text: "Laundry", checked: false},
           {text: "Cook", checked: false},
           {text: "Passport verification", checked: true},
           {text: "HomeWork", checked: false},
           {text: "React Project", checked: true}
         ]
    */

    this.state = {
      todo: [{text: "Laundry", checked: false, isFolder: false, parent: 0},
             {text: "Cook", checked: true, isFolder: false, parent: 0},
             {text: "DMV", isFolder: true, parent: 0, folderId: 1},
             {text: "Health", isFolder: true, parent: 1, folderId: 2},
             {text: "HomeWork", isFolder: true, parent: 1, folderId: 3},
             {text: "React Project", isFolder: true, parent: 3, folderId: 4},
             {text: "Expired DL", checked: true, isFolder: false, parent: 3}],
      currentFolder: 0,
      previousFolders: [],
      folderCount: 0
    }

    this.inputText = React.createRef();
    this.folder = React.createRef();

    this.handleFolderClick = this.handleFolderClick.bind(this);
    this.itemOnClick = this.itemOnClick.bind(this);
    this.handleclick = this.handleclick.bind(this);
  }

  componentDidMount() {
    this.inputText.current.focus();
  }

  itemOnClick(n, status) {
    let obj = this.state.todo[n];
    let nObj = [];

    obj.checked = status;

    for(let i=0;i<this.state.todo.length;i++) {
      if(n === i) {
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
        this.setState({folderCount: this.state.folderCount+1}, () => {
          this.setState({todo: [...this.state.todo, {text: this.inputText.current.value, isFolder: true, folderId: this.state.folderCount, parent: this.state.currentFolder}]});
        });
      } else {
        this.setState({todo: [...this.state.todo, {text: this.inputText.current.value, checked: false, isFolder: false, parent: this.state.currentFolder}]});
      }

      this.inputText.current.value = "";
    }
  }

  handleFolderClick(e) {
    const folderId = parseInt(e.currentTarget.getAttribute("folderid"));

    this.setState({currentFolder: folderId});
  }

  render(){

    let filteredList = this.state.todo.filter((value) => {
                                                              return value.parent === this.state.currentFolder;
                                                            });

    if (!filteredList) {
      filteredList = [];
    }

    return(
      <div className="pagestyles">
        <div>
          <input className="toDoInput" onKeyDown={(e) => {
                                                            if (e.keyCode === 13) {
                                                                this.handleclick();
                                                            }
                                                          }} type="text" placeholder="Holiday Trip" ref={this.inputText} />
          <div className="toDoFolder">
            <label> <input type="checkbox" ref={this.folder} /> Folder </label>
          </div>
          <button className="toDoButton" onClick={this.handleclick}> Add </button>
        </div>
        <div>
          {filteredList.map((value, index) => value.isFolder?(
                <div className="folder" key={index} folderid={value.folderId} onClick={this.handleFolderClick}>
                  <img src="folder.png" className="folderImg" />
                  {value.text}
                </div>
              ):(
                <TodoItem
                   text={value.text}
                   checked={value.checked}
                   id={index}
                   key={index}
                   callBack={this.itemOnClick}/>
             ))}
        </div>
      </div>
    );
  }
}
