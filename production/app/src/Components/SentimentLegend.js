import React, { Component } from 'react';
import * as Constants from '../Constants/Constants';
import '../App.css';

class SentimentLegend extends Component{

    render(){

        var positive = Math.round(this.props.positive * 10000) / 100;
        var neutral = Math.round(this.props.neutral * 10000) / 100;
        var negative = Math.round(this.props.negative * 10000) / 100;
        var mixed = Math.round(this.props.mixed * 10000) / 100;
        
        return (<div className='sentiment-legend'>
            <div className='sentiment-legend-scale'>
            <ul className='sentiment-legend-labels'>
                <li><span style={{backgroundColor : Constants.POSITIVE_COLOR_MED}}></span>Positive {positive}%</li>
                <li><span style={{backgroundColor : Constants.NEUTRAL_COLOR_MED}}></span>Neutral {neutral}%</li>
                <li><span style={{backgroundColor : Constants.NEGATIVE_COLOR_MED}}></span>Negative {negative}%</li>
                <li><span style={{backgroundColor : Constants.MIXED_COLOR_MED}}></span>Mixed {mixed}%</li>
            </ul>
            </div>
            </div>)
    }
}

export default SentimentLegend;