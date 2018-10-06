import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2';
import * as Constants from '../Constants/Constants';

class StatPieChart extends Component{

    render () {
        const data = {
            labels: ['Positive', 'Neutral', 'Negative', 'Mixed'],
            datasets: [{
                data: this.props.data,
                backgroundColor: Constants.SENTIMENT_COLOR_SOLID,
                hoverBackgroundColor: Constants.SENTIMENT_COLOR_MED
            }]
        };

        const options = {
            legend: {
                display: false,
            }
        }

        return (
            <div style={{width: '120rem'}}>
                <Doughnut data={data} />
            </div>
        );
      }
}

export default StatPieChart;