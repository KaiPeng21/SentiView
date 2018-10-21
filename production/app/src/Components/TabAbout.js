import React, { Component } from 'react';
import '../App.css';
import {Image, Col, Row, Grid, Panel} from 'react-bootstrap';
import architecture from '../architecture.svg';

class TabAbout extends Component{

    render(){
        return (<Grid>
            <Row className="show-grid">
                <Col xs={12} md={6}>
                    <Panel style={{marginTop: '1rem', marginBottom: '1rem'}}>
                    <Panel.Heading>Overview</Panel.Heading>
                        <Panel.Body>
                        Understand social sentiment helps companies to better understand the consumer’s feeling towards their product or their brand. This sentiment monitoring tool gives users insights about how the public feels in regards to their business and topics of interests. A company’s 
Public Relationship Department can utilize the tool to find the root of the problem and revise a plan to correct the negativity. Additionally, users can also analyze the social sentiment of the competitors, and develop a more innovative way to change how public reflects on their brand.
                        </Panel.Body>
                    </Panel> 
                </Col>
                <Col xs={12} md={6}>
                    <Panel style={{marginTop: '1rem', marginBottom: '1rem'}}>
                    <Panel.Heading>About</Panel.Heading>
                        <Panel.Body>
                        SentiView is a social media sentiment analytic tool that helps users to gather people’s opinion the hottest topic on Reddit. It uses the AI and Machine Learning algorithms from Amazon Web Services to analyze how the public perceive a topic on Reddit submissions. Users may search a topic and hit the process button to have the backend gather the hottest Reddit submissions. Users may monitor the overall statistics under the STAT tab. Users may also view sentiment performance on the individual comments. If you are lazy to read, you can click the audio button to have the AWS Polly service read the comments for you.
                        </Panel.Body>
                    </Panel> 
                </Col>
            </Row>
            <Row className="show-grid">
                <Col xs={12} md={6}>
                    <Panel style={{marginTop: '1rem', marginBottom: '1rem'}}>
                    <Panel.Heading>Backend Development</Panel.Heading>
                        <Panel.Body>
                        <b>Skill/ Technology Used</b>: Python, Boto3, AWS, Lambda, S3, API Gateway, DynamoDB, SNS, Polly, AWS Comprehend, Reddit PRAW
                        <br/>
                        <p>
                            The entire backend is written in Serverless using AWS lambda and API Gateway. When a user clicks the process button, a lambda function gathers its hottest submissions using the Reddit PRAW API, and notify other lambda functions to start the sentiment analysis and the audio generation over SNS. The results were stored in DynamoDB tables, and the audio file is stored in S3. When the user clicks the show button, the pre-processed data are then pulled from the DynamoDB.
                        </p>
                        </Panel.Body>
                    </Panel> 
                </Col>
                <Col xs={12} md={6}>
                    <Panel style={{marginTop: '1rem', marginBottom: '1rem'}}>
                    <Panel.Heading>Frontend Development</Panel.Heading>
                        <Panel.Body>
                        <b>Skill/ Technology Used</b>: React.js, React Bootstrap, Chart.js, React Sound, CSS, HTML
                        <br/>
                        <p>
                            The frontend is written in React.js, React-Bootstrap, React-Sound, and Chart.js, and the web app is hosting on Amazon Simple Storage Service.
                        </p>
                        </Panel.Body>
                    </Panel> 
                </Col>
            </Row>
            <Row className="show-grid">
                <Col xs={12} md={12}>
                <Panel style={{marginTop: '1rem', marginBottom: '1rem'}}>
                    <Panel.Heading>Design Architecture</Panel.Heading>
                    <Panel.Body>
                        <Col  xs={0} md={1}></Col>
                        <Col  xs={12} md={10}>
                        <Image src={architecture} alt="architecture" thumbnail/>
                        </Col>
                        <Col  xs={0} md={1}></Col>
                        <Col  xs={12} md={12}>
                            <ol class="architecture-description">
                                <li>
                                Pressing the process button will send a post request to the SentiView API and triggers the <b><i>RedditSearch</i></b> lambda function to gather the hottest Reddit submissions over the Reddit PRAW API Wrapper. This lambda function writes the submission and comments to DynamoDB tables and publish messages to Amazon SNS topics, notifying other lambda functions to perform sentiment analysis and audio generation asynchronously. This lambda function sends one SNS topic per comment, enabling the sentiment analysis and audio generation process to scale out horizontally.
                                </li>
                                <li>
                                The <b><i>SentiViewSentiment</i></b> lambda function is invoked by an SNS topic. It queries the comment data from DynamoDB and utilizes the AWS Comprehend service to analyze and score the emotional context in the Reddit comments, and append the results in DynamoDB table.
                                </li>
                                <li>
                                The <b><i>SentiViewAudio</i></b> lambda function is invoked by another SNS topic. It queries the comment data from DynamoDB and utilizes the Polly service to perform text-to-speech tasks. The audio output files are stored in an S3 bucket and its path is written in the DynamoDB table.
                                </li>
                                <li>
                                Clicking the show button will trigger send a get request to the SentiView API and invoke the <b><i>GetSentiView</i></b> lambda function. This lambda function queries data from DynamoDB tables, compute the statistical results, and responds to the API. 
                                </li>
                                <li>
                                The React-Sound library loads the audio file from the S3 bucket.
                                </li>
                            </ol>
                        </Col>
                    </Panel.Body>
                </Panel>
                </Col>
            </Row>
            <Row className="show-grid">

            </Row>
        </Grid>)
    }
}

export default TabAbout;