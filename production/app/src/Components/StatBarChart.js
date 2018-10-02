import React, { Component } from 'react';
import {HorizontalBar} from 'react-chartjs-2';

class StatBarChart extends Component{

    render () {
        const data = {
            labels: ['Positive', 'Neutral', 'Negative', 'Mixed'],
            datasets: [
              {
                label: 'Number of Comments',
                backgroundColor: ['rgba(8,112,55,0.2)', 'rgba(239,194,71,0.2)', 'rgba(8,76,112,0.2)', 'rgba(97,81,124,0.2)'],
                borderColor: ['rgba(8,112,55,1)', 'rgba(239,194,71,1)', 'rgba(8,76,112,1)', 'rgba(97,81,124,1)'],
                borderWidth: 1,
                hoverBackgroundColor: ['rgba(8,112,55,0.4)', 'rgba(239,194,71,0.4)', 'rgba(8,76,112,0.4)', 'rgba(97,81,124,0.4)'],
                hoverBorderColor: ['rgba(8,112,55,1)', 'rgba(239,194,71,1)', 'rgba(8,76,112,1)', 'rgba(97,81,124,1)'],
                data: [31, 54, 12, 1]
              }
            ]
        };

        const options = {
            legend: {
                display: false,
            }
        }

        return (
            <div>
              <h3>Number of Comments in each Sentiment Category</h3>
              <HorizontalBar data={data} options={options}/>
            </div>
        );
      }
}

export default StatBarChart;