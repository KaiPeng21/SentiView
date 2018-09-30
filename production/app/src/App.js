import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import * as Util from './Utils/SentiViewAPI';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      submissions : [],
      comments : []
    }

    this.processPressed = this.processPressed.bind(this);
  }

  componentDidMount(){
    // Util.getSentiviewPromise('Microsoft Github').then((response) => {
    //   console.log(response)
    // }).catch(err => console.log(err))
    // console.log(Util.API_ENDPOINT);
  }

  processPressed(event){
    Util.postSentiviewPromise('Wholefood').then((response) => {
      console.log(response)
    }).catch(err => console.log(err));
    console.log('clicked')
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <button onClick={this.processPressed}>TEST POST</button>
      </div>
    );
  }
}

export default App;
