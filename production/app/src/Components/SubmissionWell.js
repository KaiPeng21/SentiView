import React, { Component } from 'react';
import Sound from 'react-sound';
import {PanelGroup, Panel, Button, Glyphicon, ListGroup, Popover, OverlayTrigger} from 'react-bootstrap';
import '../App.css';

import * as Constants from '../Constants/Constants';
import SentimentLegend from './SentimentLegend';


class SubmissionWell extends Component{

    constructor(props){
        super(props);

        var commentList = this.props.submission['comments'] !== 'undefined'? this.props.submission['comments'] : []
        
        this.state = {
            commentList : commentList,
            submissionAudioStatus : Sound.status.STOPPED,
            commentAudioStatusList : commentList.map((comment) => Sound.status.STOPPED)
        }

        this.playSubmissionAudio = this.playSubmissionAudio.bind(this);
        this.stopSubmissionAudio = this.stopSubmissionAudio.bind(this);
        this.playCommentAudio = this.playCommentAudio.bind(this);
        this.stopCommentAudio = this.stopCommentAudio.bind(this);
    }

    playSubmissionAudio(){
        this.stopCommentAudio();
        this.setState((prevState, props)=>{
            if (prevState.submissionAudioStatus === Sound.status.STOPPED){
                return {submissionAudioStatus : Sound.status.PLAYING}
            } else {
                return {submissionAudioStatus : Sound.status.STOPPED}
            }
        })
    }
    stopSubmissionAudio(){
        this.setState({
            submissionAudioStatus : Sound.status.STOPPED
        })
    }
    playCommentAudio(ind){
        this.stopSubmissionAudio();
        this.setState((prevState, props) => {
            return {commentAudioStatusList : this.state.commentAudioStatusList.map((comment, i) => {
                return i == ind? Sound.status.PLAYING : Sound.status.STOPPED 
            })}
        })
        console.log(this.state.commentAudioStatusList);
    }
    stopCommentAudio(){
        this.setState({
            commentAudioStatusList : this.state.commentAudioStatusList.map((comment) => Sound.status.STOPPED)
        })
    }

    render(){

        var title = this.props.submission['title'] !== 'undefined'? this.props.submission['title'] : 'UNTITLED';
        var content = this.props.submission['content'] !== 'undefined'? this.props.submission['content'] : 'NO CONTENT FOUND';
        var url = this.props.submission['url'] !== 'undefined'? this.props.submission['url'] : '#';
        var audiolink = this.props['audio'] !== 'undefined'? this.props.submission['audio'] : '';
        var comments = this.props.submission['comments'] !== 'undefined'? this.props.submission['comments'] : [];

        return (<div style={{ marginTop: '0.5rem'}}>
            
  <Panel eventKey={this.props.eventKey}>
    <Panel.Heading>
      <Panel.Title toggle>{title}</Panel.Title>
    </Panel.Heading>
    <Panel.Body collapsible>
        <div style={{margin : '1rem'}}>
        {
            audiolink !== ''? <div>
                <button className="audio-btn" onClick={this.playSubmissionAudio}>
                <Glyphicon glyph="volume-up" /></button>
                <Sound url={audiolink} 
                playStatus={this.state.submissionAudioStatus}
                onFinishedPlaying={this.stopSubmissionAudio}/>
                </div> : ''
        }
        <a href={url} target="_blank" style={{float : 'right'}}>View Full Article from Reddit</a>
        </div>
        <div style={{marginBottom: '1rem'}}>
        {content}
        </div>
        <div>
        <ListGroup componentClass="ul">
            {comments.map((comment, i) => {
                var commentContent = comment['content'] !== 'undefined'? comment['content']: 'NO CONTENT';
                var commentSentiment = comment['sentiment'] !== 'undefined'? comment['sentiment'] : '';
                var commentPositive = comment['positive'] !== 'undefined'? comment['positive'] : '';
                var commentNeutral = comment['neutral'] !== 'undefined'? comment['neutral'] : '';
                var commentNegative = comment['negative'] !== 'undefined'? comment['negative'] : '';
                var commentMixed = comment['mixed'] !== 'undefined'? comment['mixed'] : '';

                switch(commentSentiment){
                    case 'POSITIVE':
                        var borderColor = Constants.POSITIVE_COLOR_MED;
                        var backgroundColor = Constants.POSITIVE_COLOR_LIGHT;
                        var solidColor = Constants.POSITIVE_COLOR_SOLID;
                        break;
                    case 'NEUTRAL':
                        var borderColor = Constants.NEUTRAL_COLOR_MED;
                        var backgroundColor = Constants.NEUTRAL_COLOR_LIGHT;
                        var solidColor = Constants.NEUTRAL_COLOR_SOLID;
                        break;
                    case 'NEGATIVE':
                        var borderColor = Constants.NEGATIVE_COLOR_MED;
                        var backgroundColor = Constants.NEGATIVE_COLOR_LIGHT;
                        var solidColor = Constants.NEGATIVE_COLOR_SOLID;
                        break;
                    default:
                        var borderColor = Constants.MIXED_COLOR_MED;
                        var backgroundColor = Constants.MIXED_COLOR_LIGHT;
                        var solidColor = Constants.MIXED_COLOR_SOLID;
                        break;
                }
                var listStyle = {background: backgroundColor, borderColor: borderColor};
                var commentAudioLink = comment['audio'] !== 'undefined'? comment['audio'] : '';

                return (<div key={i}>
                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={
                    <Popover style={{position : 'absolute', marginLeft : '10rem'}} id="popover-trigger-hover-focus" title="Sentiment Result">
                        <SentimentLegend positive={commentPositive} neutral={commentNeutral} negative={commentNegative} mixed={commentMixed} />
                    </Popover>}>
                <li className="comment-list-item" style={listStyle}>
                    {
                        commentAudioLink !== ''? <div>
                        <button className="audio-btn" onClick={() => this.playCommentAudio(i)}><Glyphicon glyph="volume-up" /></button>
                        <Sound url={commentAudioLink} 
                        playStatus={this.state.commentAudioStatusList[i]}
                        onFinishedPlaying={this.stopCommentAudio}/>
                        </div> : ''
                    }
                    <div style={{marginTop: '1rem', marginBottom: '1rem'}}>
                    {commentContent}
                    </div>
                </li>
                </OverlayTrigger></div>)
            })}
        </ListGroup>
        </div>
    </Panel.Body>
  </Panel>
      </div>)
    }
}

export default SubmissionWell;