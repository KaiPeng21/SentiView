import React, { Component } from 'react';
import {HorizontalBar} from 'react-chartjs-2';

import * as Constants from '../Constants/Constants';

class StatBarChart extends Component{

    render () {
        const data = {
            labels: ['Positive', 'Neutral', 'Negative', 'Mixed'],
            datasets: [
              {
                label: 'Number of Comments',
                backgroundColor: Constants.SENTIMENT_COLOR_LIGHT,
                borderColor: Constants.SENTIMENT_COLOR_SOLID,
                borderWidth: 1,
                hoverBackgroundColor: Constants.SENTIMENT_COLOR_MED,
                hoverBorderColor: Constants.SENTIMENT_COLOR_SOLID,
                data: this.props.data
              }
            ]
        };

        const options = {
            legend: {
                display: false,
            }
        }

        return (
            <div style={{width: '50rem'}}>
              <HorizontalBar data={data} options={options}/>
            </div>
        );
      }
}

export default StatBarChart;