import React, { Component } from 'react';
import {PanelGroup, Panel} from 'react-bootstrap';

class SubmissionWell extends Component{

    render(){

        var title = this.props.submission['title'] !== 'undefined'? this.props.submission['title'] : 'UNTITLED';
        var content = this.props.submission['content'] !== 'undefined'? this.props.submission['content'] : 'NO CONTENT FOUND';

        return (<div>
            
  <Panel eventKey={this.props.eventKey}>
    <Panel.Heading>
      <Panel.Title toggle>{title}</Panel.Title>
    </Panel.Heading>
    <Panel.Body collapsible>
        {content}
    </Panel.Body>
  </Panel>
      </div>)
    }
}

export default SubmissionWell;