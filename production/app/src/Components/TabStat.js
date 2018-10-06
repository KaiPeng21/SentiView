import React, { Component } from 'react';
import StatBarChart from './StatBarChart';
import StatPieChart from './StatPieChart';


class TabStat extends Component{

    render(){

        var statistics = this.props.statistics;
        var totalComments = Number(statistics['POSITIVE']) + Number(statistics['NEGATIVE']) + Number(statistics['NEUTRAL']) + Number(statistics['MIXED']);
        var sentimentCategory = Object.keys(statistics).reduce((a, b) => statistics[a] > statistics[b] ? a : b);
        var percentage = totalComments === 0? -1 : Number(statistics[sentimentCategory]) / totalComments;
        percentage = Math.round(percentage * 10000) / 100

        return (<div>
            <div>
                <span>{percentage} %</span> of comments 
                in {this.props.topic} 
                is <span>{sentimentCategory}
                </span>
            </div>
            <div>
            <StatPieChart data={[statistics['POSITIVE'], statistics['NEUTRAL'], statistics['NEGATIVE'], statistics['MIXED']]} />
            </div>
            <div>
            <StatBarChart data={[statistics['POSITIVE'], statistics['NEUTRAL'], statistics['NEGATIVE'], statistics['MIXED']]} />
            </div>

            </div>)
    }
}

export default TabStat;