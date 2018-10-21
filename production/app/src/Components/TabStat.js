import React, { Component } from 'react';
import StatBarChart from './StatBarChart';
import StatPieChart from './StatPieChart';
import {Grid, Row, Col, Panel} from 'react-bootstrap';
import '../App.css';

class TabStat extends Component{

    render(){

        var statistics = this.props.statistics;
        var totalComments = Number(statistics['POSITIVE']) + Number(statistics['NEGATIVE']) + Number(statistics['NEUTRAL']) + Number(statistics['MIXED']);
        var sentimentCategory = Object.keys(statistics).reduce((a, b) => statistics[a] > statistics[b] ? a : b);
        var percentage = totalComments === 0? -1 : Number(statistics[sentimentCategory]) / totalComments;
        percentage = Math.round(percentage * 10000) / 100

        return (<Grid>

            <Row className="show-grid">
            
                <Col xs={12} md={12}>
                    <Panel style={{margin: '1rem'}}>
                        <Panel.Heading>Summary</Panel.Heading>
                        <Panel.Body>
                            <span style={{color: '#FEBD00', fontSize: '25px', fontWeight: 'bold'}}>{percentage} %</span> of the comments 
                            about {this.props.topic} are <span style={{fontWeight: 'bold'}}>{sentimentCategory}</span>
                        </Panel.Body>
                    </Panel>
                </Col>
                <Col xs={12} md={6}>
                    <Panel style={{margin: '1rem'}}>
                        <Panel.Heading>Number of Comments Per Sentiment Category</Panel.Heading>
                        <Panel.Body>
                            <StatBarChart data={[statistics['POSITIVE'], statistics['NEUTRAL'], statistics['NEGATIVE'], statistics['MIXED']]} />
                        </Panel.Body>
                    </Panel>
                </Col>
                <Col xs={12} md={6}>
                    <Panel style={{margin: '1rem'}}>
                        <Panel.Heading>Sentiment Distribution </Panel.Heading>
                        <Panel.Body>
                            <StatPieChart data={[statistics['POSITIVE'], statistics['NEUTRAL'], statistics['NEGATIVE'], statistics['MIXED']]} />
                        </Panel.Body>
                    </Panel>
                </Col>
                
            </Row>

            </Grid>)
    }
}

export default TabStat;