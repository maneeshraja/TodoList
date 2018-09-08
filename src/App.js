import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      List: []
    }

    this.textInput = React.createRef();


    this.save = this.save.bind(this);
  }

  save(){
    console.log(this.textInput.current.value);
    this.setState({List: [...this.state.List, this.textInput.current.value]});
  }

  render() {
    console.log(this.state.List);
    return (
      <div>



        <h1> To-Do List </h1>
        <input type="text" ref={this.textInput} placeholder="Task To DO" />
        <input type="submit" value="Save" onClick={this.save} />
        <div>
          {this.state.List.map((value,index) => {
            return (
              <div>

              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default App;
