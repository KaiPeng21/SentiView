import React, { Component } from 'react';
import {PanelGroup, Panel} from 'react-bootstrap';

import SubmissionWell from './SubmissionWell';

class TabSubmission extends Component{

    constructor(props){
        super(props);

    }

    render(){

        var submissions = this.props.submissions;
        //var submissions = this.state.test['submissions']

        return (<div>
            <PanelGroup accordion id="accordion-example">
            {submissions.map((submission, i) => {
                return <SubmissionWell key={i} eventKey={i+1} submission={submission} />
            })}
            </PanelGroup>
      </div>)
    }
}

export default TabSubmission;