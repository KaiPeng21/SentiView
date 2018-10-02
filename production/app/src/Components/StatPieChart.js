import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2';

class StatPieChart extends Component{

    render () {
        const data = {
            labels: [
                'Red',
                'Green',
                'Yellow'
            ],
            datasets: [{
                data: [300, 50, 100],
                backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
                ],
                hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
                ]
            }]
        };

        const options = {
            legend: {
                display: false,
            }
        }

        return (
            <div>
                <h2>Doughnut Example</h2>
                <Doughnut data={data} />
            </div>
        );
      }
}

export default StatPieChart;