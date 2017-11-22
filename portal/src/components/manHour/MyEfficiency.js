/**
 * Created by Richie on 2017/8/2.
 */
import React from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import { message, Table, Popconfirm, Modal, Button,Icon, DatePicker, Row, Col,Input,Tooltip,Select ,InputNumber} from 'antd';
import API_URL from '../../common/url';
import SideNav from './SideNav';
import Highcharts from 'react-highcharts';
import DateRange from '../common/DateRange';
import chartsConfig from '../common/chartsConfig';

// import './css/index.less';
const Option = Select.Option
const monthFormat='YYYY-MM'
class MyEfficiency extends React.Component {
    constructor(props) {
        super(props);
    this.state = {
        count:0,
        loading: false,
        dataList : [],
        monthList : [],
        typeName:{},
        tableData:{},
        title:'',
        params:{},
        date: {end:moment().format(monthFormat), begin:moment().subtract(11,'months').format(monthFormat)},
        investigationSiteList:[],
        investigationList:[],
        chartstype:'line',
        dfv:'',
        dfv2:'',
        };        
    }
  loadData = (params,date={end:moment().format(monthFormat), begin:moment().subtract(11,'months').format(monthFormat)}) => {
                  // date = {begin:moment().format(monthFormat), end:moment().subtract(12,'months').format(monthFormat)}
      this.setState({
          loading: true,
      });
      // params={
      //   relatedUser = 1 我的效率
      // }

      const options ={
        method: 'POST',
        url: `${API_URL.manhour.queryEfficiency}`,
        data: {
          relatedUser:1,
          crcUserId:sessionStorage.userId,
        //   cumulative:1,
          ...params,
          ...date,
        },
        dateType: 'json',
        doneResult:(data => {
          if (!data.error) {
            this.setState({
              loading: false,
              dataList:data.data.dataList,
              monthList:data.data.monthList,
              typeName:data.data.typeName,
              tableData:data.data.tableData,
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

    getInvestigationList = () => {
        const options ={
            method: 'POST',
            url: `${API_URL.investigation.queryUserInvestigationList}`,
            data: {
            },
            dateType: 'json',
            doneResult:(data => {
                this.setState({
                    investigationList:data.data.investigations,
                    investigationSiteList:[]
                })
            })
          }
        $.sendRequest(options)
    }
    getInvestigationSiteList = (id) => {
        const options ={
            method: 'POST',
            url: `${API_URL.site.queryUserSiteList}`,
            data: {
                investigationId:id,
            },
            dateType: 'json',
            doneResult:(data => {
                this.setState({
                    investigationSiteList:data.data.siteList
                });
            })
          }
          $.sendRequest(options)
    }
    handleSelect = (value) => {
        this.getInvestigationSiteList(value)
        this.setState({
            dfv:value,
            dfv2:''
        })
    }
    handleSelect2 = (value) => {
        this.setState({
            dfv2:value
        })
    }
    reload = () => {
        const {dfv,dfv2}=this.state
        const params = {
            investigationId:dfv,
            investigationSiteId:dfv2,
        }
        let {date} = this.state       
        if(date.end!='' && date.begin!='' ){
            this.loadData(params,date);
        }else{
            message.warn('日期不能为空！')
        }
        
    }

    getdataSource = () => {
      const {typeName,tableData,monthList} = this.state
      if(tableData){
        const type = ['planFte','usedFte','usedFtePercent','userFteCumulative','finishVisit','finishVisitCumulative']
        const rows = []      
        const Tdata = []
        let Tdatas={}
        type.map((d,i)=>{
          if(tableData[type[0]]){            
              tableData[type[i]].map((data,j)=>{
                  if(type[i]=='usedFtePercent'){
                       Tdatas[monthList[j].month] = `${data}%`                                        
                  }else{
                       Tdatas[monthList[j].month] = data
                  }
              })
              Tdata.push({
                  ...Tdatas
              })
          }        
          rows.push({
              index:typeName[type[i]],
              ...Tdata[i],
              key:i
          })
        })
        return rows
      }
      
    }
    getColumns = () => {
      const columns = []
      columns.push({
        title: '',
        dataIndex: 'index',
        key: 'index',
        width:160,
      })
      
      if(this.state.monthList ){
        this.state.monthList.map((d,i)=> {
            columns.push({        
              title: `${d.month}月`,
              dataIndex: `${d.month}`,
              key: `${d.month}`,
            })
          }) 
      }
                     
      return columns
    } 

    //组件加载时初始化参数
    init = (name) => {
      let params ={}
      const date ={}
      let title = ''
      let legend ={}
      let chartstype = ''

        title = '每月完成访视数VS.每月消耗FTE数'
        params = {            
        investigationId:'',
        investigationSiteId:'',
        // cumulative:1
        }


      this.setState({
        title,
        params,
        legend,
        chartstype,     
      })
      this.loadData(params);
    }

    changeDate =(params,date) => {
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

    componentWillMount(){
      this.init()
      this.getInvestigationList()
    }


    componentWillReceiveProps(nextProps){

      // this.siderRef.selectKey(typeName)
    }


    showPreviewModal = id => {
      this.previewModalRef.show(id)
    }


    render(){
        const { dfv,dfv2,loading, monthList,date,title,legend,chartstype, params,typeName,tableData,investigationList,investigationSiteList} = this.state;       
        const month = monthList ? monthList.map( d => `${d.month}月` ) : []
        const seriesData =[{
            data:  tableData ? tableData.finishVisitDipFte : [],
            name: `每月完成访视数/ <br/> 每月消耗FTE数`    ,//typeName.finishVisitDipFte
        },{
            data: tableData ? tableData.usedFtePercent? tableData.usedFtePercent.map(d=> d) : []:[],
            name: typeName ? typeName.usedFtePercent : '',
            yAxis:1,
        }]
        const options = investigationList ? investigationList.map(d=> <Option key = {d.investigationId+''} >{d.investigationName}</Option>) : []
        const options2 = investigationSiteList ? investigationSiteList.map(d=> <Option key = {d.investigationSiteId} >{d.investigationSiteName}</Option>) : []


        const config={
                title:{
                  text:''
                },
                chart: {
                    type: chartstype
                },
                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    x: 0,
                    y: 20,
                    layout:'vertical',
                },
                yAxis:[{
                  title: {
                    text: ''
                  },
                },{
                    title: {
                      text: ''
                    },
                    opposite: true,
                    labels: {
                        format: '{value} %',                        
                    },
                  }],
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
                    text:'SMO医疗大数据',
                },
              };
        return (          
            <div className="content">
                <SideNav selectKey='myEfficiency' ref={el => {this.siderRef = el;}} />
                <div className="main">                    
                    <div className="T-tit">
                        <div className="txt">
                            <h3 style={{marginBottom:10}}>{title} </h3>
                            <div style={{textAlign:'left'}}>
                                <DateRange loadData ={this.changeDate} params={params} defaultValueBegin={moment().subtract(11,'months')} defaultValueEnd={moment()} clearStartDate={this.clearStartDate} clearEndDate={this.clearEndDate}/> 
                                <span className="ant-divider" />
                                <Select style={{width:150}} value = {dfv} onChange={this.handleSelect}>
                                    <Option value='' >所有项目</Option>
                                    {options}
                                </Select>
                                <span className="ant-divider" />
                                <Select style={{width:150}} value={dfv2} onChange={this.handleSelect2}>
                                    <Option value='' >请选择项目中心</Option>
                                    {options2}
                                </Select>
                                <span className="ant-divider" />
                                <Button type = 'primary' onClick={this.reload}>统计</Button>
                            </div>
                        </div>
                    </div>
                    <div className="charts" style={{marginBottom:10}}>
                        <Highcharts config={{...config, ...chartsConfig}} />
                    </div>
                    <div className="content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getdataSource()}
                            rowKey={record => record.key}
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


export default MyEfficiency;
