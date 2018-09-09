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
      folderCount: 4,
      folderChecked: false,
      identity: 9
    }

    this.inputText = React.createRef();
    this.folder = React.createRef();

    this.handleFolderClick = this.handleFolderClick.bind(this);
    this.itemOnClick = this.itemOnClick.bind(this);
    this.handleclick = this.handleclick.bind(this);
    this.handlePager = this.handlePager.bind(this);
  }

  componentDidMount() {
    this.inputText.current.focus();
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

  render(){

    let filteredList = this.state.todo.filter((value) => {
                                                              return value.parent === this.state.currentFolder;
                                                            });
    console.log(this.state.todo);
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
            <label> <input type="checkbox" ref={this.folder} onChange={(e) => this.setState({folderChecked: e.currentTarget.checked})} /> Folder </label>
          </div>
          <button className="toDoButton" onClick={this.handleclick}> Add{`${this.state.folderChecked?' Folder':' Item'}`} </button>
        </div>
        <div className="toDoPrevious">
          {this.state.previousFolders.map((value, index) => <span>/<span className="toDoPreviousPages" onClick={() => this.handlePager(index, value.id, value.name)}>{value.name}</span></span>)}
          {"/ "}<b>{this.state.currentFolderName}</b>
        </div>
        <div>
          {filteredList.map((value, index) => value.isFolder?(
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
