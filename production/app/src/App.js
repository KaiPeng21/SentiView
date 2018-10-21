import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Button, Form, FormGroup, FormControl, ControlLabel, Tab, Tabs} from 'react-bootstrap';

import * as Util from './Utils/SentiViewAPI';
import TabStat from './Components/TabStat';
import TabSubmission from './Components/TabSubmission';
import TabAbout from './Components/TabAbout';


class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      search : '',
      selectedTopic : '',
      submissions : [],
      statistics: {'POSITIVE' : 0, 'NEUTRAL' : 0, 'NEGATIVE' : 0, 'MIXED' : 0},
      loaded : ['Microsoft', 'Amazon']
    }

    this.onProcessInputChange = this.onProcessInputChange.bind(this);
    this.onSelectTopicChange = this.onSelectTopicChange.bind(this);
    this.processPressed = this.processPressed.bind(this);
    this.showPressed = this.showPressed.bind(this);
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
    if (search !== '' && !(search in this.state.loaded)){
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
    if (this.state.selectedTopic !== '' && this.state.selectedTopic !== ' '){
      Util.getSentiviewPromise(this.state.selectedTopic).then((response) => {

        if (typeof response['stat'] !== 'undefined'){
          this.setState({
            statistics : response['stat']
          });
        } else {
          console.log('still loading...')
        }

        if (typeof response['submissions'] !== 'undefined'){
          this.setState({
            submissions : response['submissions']
          });
        } else {
          console.log('still loading...')
        }

        console.log(this.state.selectedTopic)
        console.log(response)
        console.log(response['stat'])
      }).catch(err => console.log(err))
    }
  }

  render() {
    return (
      <div className="App">
        <Form onSubmit={(e) => e.preventDefault()}>      
          <FormGroup>
            <ControlLabel style={{color: '#f9f9f9'}}>Enter a Reddit Topic:</ControlLabel>
            <FormControl type="text" placeholder="Type your Reddit Topic here..." value={this.state.search} onChange={this.onProcessInputChange}/>
          </FormGroup>
        </Form>
        <Button className="btn" bsStyle="default" bsSize="small" onClick={() => this.processPressed(this.state.search)}>PROCESS</Button>
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormGroup controlId="formControlsSelect">
            <ControlLabel style={{color: '#f9f9f9'}}>Select a processed topic:</ControlLabel>
            <FormControl componentClass="select" placeholder="select" value={this.state.selectedTopic} onChange={this.onSelectTopicChange}>
              <option value="">------</option>
              {this.state.loaded.map((x, i) => {
                return <option key={i} value={x}>{x}</option>
              })}
            </FormControl>
          </FormGroup>
        </Form>
        <Button className="btn" bsStyle="default" bsSize="small" onClick={() => this.showPressed()}>SHOW</Button>
        <Tabs defaultActiveKey={2} id="uncontrolled-tab-example" className="tabs" animation={false}>
          <Tab eventKey={1} title="SUBMISSIONS">
            <TabSubmission submissions={this.state.submissions}/>
          </Tab>
          <Tab eventKey={2} title="STATS">
            <TabStat topic={this.state.selectedTopic} statistics={this.state.statistics}/>
          </Tab>
          <Tab eventKey={3} title="ABOUT">
            <TabAbout/>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default App;
