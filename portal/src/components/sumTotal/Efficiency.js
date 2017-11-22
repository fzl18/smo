/**
 * Created by Richie on 2017/8/2.
 */
import React from 'react';
import jQuery from 'jQuery';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import { message, Table, Popconfirm, Modal, Button, Icon, DatePicker, Row, Col, Input, Tooltip, Select, InputNumber } from 'antd';
import API_URL from '../../common/url';
import SideNav from './SumEffSider';
import Highcharts from 'react-highcharts';
import DateRange from '../common/DateRange';
import chartsConfig from '../common/chartsConfig';

// import './css/index.less';
const Option = Select.Option
const monthFormat = 'YYYY-MM'
class Efficiency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            loading: false,
            dataList: [],
            monthList: [],
            typeName: {},
            tableData: {},
            title: '',
            name: this.props.match ? this.props.match.params.name : '',
            params: {},
            date: {},
            investigationSiteList: [],
            investigationList: [],
            chartstype: 'line',
            dfv: '0',
            dfv2: '0',
            totalPlanFTE:'',
            totalPlanVisit:'',
            investigations:[],
            invSite:[],
            invId:'',
            siteId:'',
            defaultValueBegin:moment().subtract(11,'M'),
            defaultValueEnd:moment()
        };
    }
    loadData = (params, date) => {
        // date = {begin:moment().format(monthFormat), end:moment().subtract(12,'months').format(monthFormat)}
        this.setState({
            loading: true,
        });
        // params={
        //   relatedUser = 1 我的效率
        // }
        const options = {
            method: 'POST',
            url: `${API_URL.manhour.queryEfficiency}`,
            data: {
                relatedUser: this.props.filter ? 1 : 0,
                end: moment().format(monthFormat), 
                begin: moment().subtract(11, 'months').format(monthFormat),                
                ...date,
                ...params,
            },
            dateType: 'json',
            doneResult: (data => {
                if (!data.error) {
                    this.setState({
                        loading: false,
                        dataList: data.data.dataList,
                        monthList: data.data.monthList,
                        typeName: data.data.typeName,
                        tableData: data.data.tableData,
                        totalPlanFTE: data.data.totalPlanFTE,
                        totalPlanVisit: data.data.totalPlanVisit,
                    });
                } else {
                    this.setState({
                        loading: false,
                    });
                    Modal.error({ title: data.error });
                }
            })
        }
        $.sendRequest(options)
    }

    loadInvList =(id)=>{
        const options ={
            method: 'POST',
            url: `${API_URL.investigation.queryUserInvestigationList}`,
            data: {
                offset: 1,
                limit: 15,
                userId:id,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    this.setState({
                        investigations: data.data.investigations,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)
    }


    loadInvSiteList =(id)=>{
        const options ={
            method: 'POST',
            url: `${API_URL.site.queryUserSiteList}`,
            data: {
                offset: 1,
                limit: 15,
                investigationId:id,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    this.setState({
                        invSite: data.data.siteList,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)
    }

    reload = (params) => {        
        const { date } = this.state
        if(date.end!='' && date.begin!='' ){
            this.loadData({...params},date);
        }else{
            message.warn('日期不能为空！')
        }            
    }

    getdataSource = () => {
        const { typeName, tableData, monthList, name } = this.state
        let type
        name == 'pro' ?
            type = ['planFte', 'usedManHour', 'leaveManHour', 'usedFte', 'leaveFte', 'usedFtePercent', 'userFteCumulative', 'usedFtePercentCumulative', 'finishVisit', 'finishVisitCumulative', 'finishVisitCumulativePercent']
            :
        name == 'crc' ?
            type = ['planFte', 'usedFte', 'usedFtePercent', 'userFteCumulative', 'finishVisit', 'finishVisitCumulative']
            :
            type = ['planFte', 'usedManHour', 'leaveManHour', 'usedFte', 'leaveFte', 'usedFtePercent', 'userFteCumulative', 'usedFtePercentCumulative', 'finishVisit', 'finishVisitCumulative']

        const rows = []
        const Tdata = []
        let Tdatas = {}
        type.map((d, i) => {
            if (tableData[type[0]]) {
                tableData[type[i]].map((data, j) => {
                    if (type[i] == 'usedFtePercent' || type[i] == 'usedFtePercentCumulative' || type[i] == 'finishVisitCumulativePercent') {
                        Tdatas[monthList[j].month] = `${data}%`
                    } else {
                        Tdatas[monthList[j].month] = Number(data.toFixed(2))
                    }
                })
                Tdata.push({
                    ...Tdatas
                })
            }
            rows.push({
                index: typeName[type[i]],
                ...Tdata[i]
            })
        })
        return rows
    }
    getColumns = () => {
        const columns = []
        columns.push({
            title: '',
            dataIndex: 'index',
            key: 'index',
            width: 160,
        })
        this.state.monthList.map((d, i) => {
            columns.push({
                title: `${d.month}月`,
                dataIndex: `${d.month}`,
                key: `${d.month}`,
            })
        })
        return columns
    }

    handleSelect = (id, k) =>{
        if(id == 'invId'){            
            if(k==''){
                this.setState({
                    invId:'',
                    siteId:'',
                })
            }else{
                this.loadInvSiteList(k)
                this.setState({
                    invId:k,
                    siteId:'',
                })
            }
        }else{            
            this.setState({
                siteId:k,
            })
        }
    }
    //组件加载时初始化参数
    init = (name) => {
        let params = {}
        const date = {}
        let title = ''
        let legend = {}
        let chartstype = ''

        switch (name) {
            case 'pro':
                title = '累计完成访视数VS.累计消耗FTE数'
                params = {
                    investigationId: '',
                    investigationSiteId: '',
                    cumulative: 0
                }
                break;
            case 'site':
                title = '每月完成访视数VS.每月消耗FTE数'
                params = {
                    investigationId: '',
                    investigationSiteId: '',
                    cumulative: 0
                }
            case 'crc':
            title = '每月完成访视数VS.每月消耗FTE数'
            params = {
                investigationId: '',
                investigationSiteId: '',
                cumulative: 0
            }
        }

        this.setState({
            title,
            params,
            legend,
            chartstype,
            name,
        })
        this.loadData(params);
    }

    

    componentDidMount() {
        if(this.props.match){
            this.init(this.props.match.params.name)
        }else{
            this.init(this.props.name)
            if(this.props.filter){
                this.loadInvList()
            }            
        }        
    }


    componentWillReceiveProps(nextProps) {
        if(nextProps.match){
            this.init(nextProps.match.params.name)                      
        }
        
        // this.siderRef.selectKey(typeName)
    }

    TabInit = () => {
        this.setState({
            invId:'',
            siteId:'',
            defaultValueBegin:moment(''),
            defaultValueEnd:moment('')
        })
    }

    showPreviewModal = id => {
        this.previewModalRef.show(id)
    }

    saveDate =(v,date)=>{
        this.setState({
            date,
        })
    }

    clearStartDate =()=>{
        const {date}=this.state
        date.begin=''
        this.setState({date})
    }
    clearEndDate =()=>{
        const {date}=this.state
        date.end=''
        this.setState({date})
    }


    render() {
        const {investigations,invSite,totalPlanFTE,totalPlanVisit, dfv, dfv2, loading, monthList, date, title, legend, chartstype, params, typeName, tableData, investigationList, investigationSiteList,name } = this.state;
        const month = monthList.map(d => `${d.month}月`)
        const invoption = investigations.map((d,i) => <Option key={i} value={`${d.investigationId}`}>{d.investigationName}</Option>)
        const siteoption=invSite.map((d,i) => <Option key={i} value={`${d.investigationSiteId}`}>{d.investigationSiteName}</Option>)
        const seriesData = [{
            data: tableData.finishVisitDipFte || [],
            name: `每月完成访视数/ <br/> 每月消耗FTE数`, //typeName.finishVisitDipFte,
        }, {
            data: tableData.usedFtePercent ? tableData.usedFtePercent.map(d => d) : [],
            name: typeName.usedFtePercent,
            yAxis: 1,
        }]
        const seriesData2 = [{
            data: tableData.finishVisitCumulative || [],
            name: typeName.finishVisitCumulative, //typeName.finishVisitDipFte,
        }, {
            data: tableData.userFteCumulative ? tableData.userFteCumulative.map(d => d) : [],
            name: typeName.userFteCumulative,
            yAxis: 1,
        }, {
            data: month.map( d => totalPlanFTE),
            name: '总计划FTE数',
            yAxis: 1,
        }, {
            data: month.map( d => totalPlanVisit),
            name: '总计划访视数',

        }]
        const options = investigationList ? investigationList.map(d => <Option key={d.investigationId + ''} >{d.investigationName}</Option>) : []
        const options2 = investigationSiteList ? investigationSiteList.map(d => <Option key={d.investigationSiteId} >{d.investigationSiteName}</Option>) : []
        const config = {
            title: {
                text: ''
            },
            chart: {
                type: chartstype
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                x: 0,
                y: 20,
                layout: 'vertical',
            },
            yAxis: [{
                title: {
                    text: ''
                }
            }, {
                title: {
                    text: ''
                },
                opposite: true,
                labels: {
                    format: '{value} %',
                },
            }],
            tooltip: {
                formatter: function() {
                    if(this.series.name == '每月FTE消耗比'){
                        return ''+ this.series.name +'<br/>'+
                        this.x +': '+ '<b>' + this.y +'%' + '</b>';
                    }else {
                        const yValue = this.y;
                        return ''+ this.series.name +'<br/>'+
                        this.x +': '+ '<b>' + Number(yValue.toFixed(2)) + '</b>';
                    }   
                }
            },
            xAxis: {
                categories: month
            },
            series: seriesData,
            exporting: {
                chartOptions: {
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            plotOptions: {
                series: {
                    animation: false
                }
            },
            credits: {
                enabled: false,
                text: 'SMO医疗大数据',
            },
        };
        const config2 = {
            title: {
                text: ''
            },
            chart: {
                type: chartstype
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                x: 0,
                y: 20,
                layout: 'vertical',
            },
            yAxis: [{
                title: {
                    text: ''
                },
            }, {
                title: {
                    text: ''
                },
                opposite: true,
                labels: {
                    format: '{value}',
                },
            }],
            xAxis: {
                categories: month
            },
            series: seriesData2,
            exporting: {
                chartOptions: {
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            plotOptions: {
                series: {
                    animation: false
                }
            },
            credits: {
                enabled: false,
                text: 'SMO医疗大数据',
            },
        };
        return (
            <div className="content">
               {this.props.match ? <SideNav selectKey='Efficiency' ref={el => { this.siderRef = el; }} /> : null }
                <div className="main">
                    {name==='pro' ?
                    <div>
                        <div className="T-tit">
                            <div className="txt">
                                <h3 style={{ margin:'20px 0 10px 0' }}>累计完成访视数VS.累计消耗FTE数</h3>
                                <div>
                                <DateRange loadData={this.saveDate} clearStartDate={this.clearStartDate} clearEndDate={this.clearEndDate} />
                                <span className="ant-divider" />
                                <Button type='primary' onClick={this.reload.bind(this,{investigationId:this.state.invId,investigationSiteId:this.state.siteId})}>统计</Button>
                            </div>
                            </div>                            
                        </div> 
                        <div className="charts" style={{ marginBottom: 10 }}>
                            <Highcharts config={{...config2, ...chartsConfig}} />
                        </div>
                    </div>
                    :null
                    }
                    <div className="T-tit">
                        <div className="txt">
                            <h3 style={{ marginBottom: 10 }}>每月完成访视数VS.每月消耗FTE数 </h3>
                            <div style={{ textAlign: 'left' }}>
                                { name ==='pro'? null: <DateRange loadData={this.saveDate} defaultValueBegin={this.state.defaultValueBegin} defaultValueEnd={this.state.defaultValueEnd} clearStartDate={this.clearStartDate} clearEndDate={this.clearEndDate}/>}
                                { this.props.filter ?
                                <span>
                                <span className="ant-divider" />
                                <Select value={this.state.invId} onChange={this.handleSelect.bind(this, 'invId') } style={{width:180}}>
                                    <Option value=''>所有项目</Option>
                                    {invoption}
                                </Select>
                                <span className="ant-divider" />
                                <Select onChange={this.handleSelect.bind(this, 'siteId')} style={{width:180}} value={this.state.siteId}>
                                    <Option value=''>请选择中心</Option>
                                    {siteoption}
                                </Select>
                                </span>
                                :null
                                }
                                <span className="ant-divider" />
                                {name ==='pro'? null: <Button type='primary' onClick={this.reload.bind(this,{investigationId:this.state.invId,investigationSiteId:this.state.siteId})}>统计</Button>}
                            </div>
                        </div>
                    </div>           
                    <div className="charts" style={{ marginBottom: 10 }}>                       
                        <Highcharts config={{ ...config, ...chartsConfig}} />
                    </div>
                    <div className="content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getdataSource()}
                            rowKey='ddd'
                            loading={loading}
                            pagination={false}
                            bordered
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Efficiency;
