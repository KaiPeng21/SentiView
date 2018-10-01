import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import * as Util from './Utils/SentiViewAPI';
import {Button, Form, FormGroup, FormControl} from 'react-bootstrap';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      search : '',
      selectedTopic : '',
      submissions : [],
      comments : [],
      loaded : []
    }

    this.onProcessInputChange = this.onProcessInputChange.bind(this);
    this.onSelectTopicChange = this.onSelectTopicChange.bind(this);
    this.processPressed = this.processPressed.bind(this);
    this.showPressed = this.showPressed.bind(this);
  }

  componentDidMount(){

  }

  onProcessInputChange(event){
    this.setState({
      search : event.target.value
    })
  }

  onSelectTopicChange(event){
    this.setState({
      selectedTopic : event.target.value
    })
  }

  processPressed(search){
    if (search != '' && !(search in this.state.loaded)){
      // trigger the SearchReddit lambda function
      Util.postSentiviewPromise(search).then((response) => {
        this.setState((prevState, props) => {
          let loadClone = this.state.loaded.slice()
          loadClone.push(search)
          return { 
            loaded : loadClone,
            search : ''
          }
        })
      }).catch(err => console.log(err));
    }
  }

  showPressed(){
    if (this.state.selectedTopic != '' && this.state.selectedTopic != ' '){
      Util.getSentiviewPromise(this.state.selectedTopic).then((response) => {
        console.log(this.state.selectedTopic)
        console.log(response['comments'])
        console.log(response['submissions'])
      }).catch(err => console.log(err))
    }
  }

  render() {
    return (
      <div className="App">
        <Form onSubmit={(e) => e.preventDefault()}>      
          <FormGroup>
            <FormControl type="text" placeholder="Enter a Reddit Topic..." value={this.state.search} onChange={this.onProcessInputChange}/>
          </FormGroup>
        </Form>
        <Button className="btn" bsStyle="primary" bsSize="small" onClick={() => this.processPressed(this.state.search)}>PROCESS</Button>
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormGroup controlId="formControlsSelect">
            <FormControl componentClass="select" placeholder="select" value={this.state.selectedTopic} onChange={this.onSelectTopicChange}>
              <option value="">------</option>
              {this.state.loaded.map((x, i) => {
                return <option key={i} value={x}>{x}</option>
              })}
            </FormControl>
          </FormGroup>
        </Form>
        <Button className="btn" bsStyle="primary" bsSize="small" onClick={() => this.showPressed()}>SHOW</Button>
      </div>
    );
  }
}

export default App;
