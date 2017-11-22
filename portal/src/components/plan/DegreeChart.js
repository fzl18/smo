import React, { Component } from 'react';
import { Modal, Button, Icon, Checkbox } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import Highcharts from 'react-highcharts';
import chartsConfig from '../common/chartsConfig';
import moment from 'moment';


class DegreeChart extends Component {

    state = {
        visible: false,
        loading: true,
        confirmLoading: false,
        dataList: [],
    };

    show = (ref) => {
        this.setState({
            visible: true
        });
        this.loadData();
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    loadData = () => {
        this.setState({
            loading: true,
        });
        
        const options = {
            url: `${API_URL.plan.getDegreeChart}`,
            data: {},
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loading: false,
                    dataList: data.datas,
                });
            })
        };
        AjaxRequest.sendRequest(options);
    };

    parserData = () => {
        // re-structure the tasks into line seriesvar series = [];
        const series = [];
        this.state.dataList.map((row, i) => {
            if(row != null){
                var item = {
                    name: row.name,
                    data: [],
                };
                var last6 = row.name.slice(-6);
                if(last6 == "(Plan)"){
                    item.color = "#a5b7ed"
                }else{
                    item.color = "#5cd696"
                }
                if (row.intervals){
                    row.intervals.map((dataPoints, j) => {
                        item.data.push({
                            x: this.getDateUTC(dataPoints.from),
                            y: i,
                            label: dataPoints.label,
                            from: this.getDateUTC(dataPoints.from),
                            to: this.getDateUTC(dataPoints.to)
                        }, {
                            x: this.getDateUTC(dataPoints.to),
                            y: i,
                            from: this.getDateUTC(dataPoints.from),
                            to: this.getDateUTC(dataPoints.to)
                        });
                        // add a null value between intervals
                        // if (row.intervals[j + 1]) {
                        if (j < dataPoints.length - 1){
                            item.data.push(
                                [(this.getDateUTC(dataPoints.to) + this.getDateUTC(row.intervals[j + 1].from)) / 2, null]
                            );
                        }
                    });
                }
                series.push(item);
            }else{
                var item = {
                    name: row.name,
                    data: [],
                    //color: i % 2 == 0 ? '#a5b7ed' : '#5cd696',
                };
            }
        });
        return series;
    }

    getDateUTC = date => {
        if (date){
            return Date.UTC(date.year, date.month - 1, date.day);
        }
        return '';
    }

    getCategories = (series) => {
        const catArr = [];
        series.map((value,index) => {
            catArr.push(value.name)
        })
        return catArr;
    }

    render() {
        const { visible, confirmLoading, dataList } = this.state;
        const series = this.parserData();
        const categories = this.getCategories(series);
        const config = {
            chart: {
                renderTo: 'container',
                height: 500
            },
            title:{
                text: '里程碑计划/实际甘特图',
            },
            xAxis: {
                type: 'datetime',
                labels:{
                    formatter: function() {
                        return moment(this.value).format("YY-MM-DD");
                    }
                },
            },
            yAxis: {
                min:0,
                max:categories.length - 1,
                categories: categories,
                tickInterval: 1,
                reversed: true,
                startOnTick: false,
                endOnTick: false,
                title: {
                    text: ''
                },
                minPadding: 0.2,
                maxPadding: 0.2
            },
            legend: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.series.name + '</b><br/>' + new Date(this.key).toLocaleDateString();
                        // Highcharts.dateFormat('%Y/%m/%d', this.point.options.from)  +
                        // ' - ' + Highcharts.dateFormat('%Y/%m/%d', this.point.options.to); 
                }
            },
            plotOptions: {
                line: {
                    lineWidth: 9,
                    //linecap:"square",
                    marker: {
                        enabled: false
                    },
                    dataLabels: {
                        enabled: true,
                        align: 'left',
                        formatter: function() {
                            return this.point.options && this.point.options.label;
                        }
                    }
                }
            },
            series: series,
            credits: {
                enabled:false,
                text:'SMO医疗大数据',
            },
        };
        return (
            <Modal
                /* title="里程碑计划/实际甘特图" */
                visible={visible}
                onCancel={this.hide}
                className="create-modal gantt-modal"
                wrapClassName="vertical-center-modal"
                width="800px"
                confirmLoading={confirmLoading}
                footer={[
                    <Button key="back" size="large" onClick={this.hide}>关闭</Button>,
                ]}
            >
                <div><Highcharts config={{...config, ...chartsConfig}} /></div>
            </Modal>
        );
    }
}

export default DegreeChart;
