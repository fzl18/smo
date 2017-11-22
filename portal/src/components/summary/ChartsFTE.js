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

const monthFormat='YYYY-MM'

class ChartsFTE extends React.Component {
    constructor(props) {
        super(props);
    this.state = {
        count:0,
        loading: false,
        planList1 : [],
        actualList : [],
        summaryList1 : [],
        summaryList2 : [],
        title:'',
        params:{},
        date:{},
        name:this.props.match.params.name,
        chartstype:'line',
        defaultValueBegin:moment().add(-11,'M'),
        defaultValueEnd:moment(),  
        next:'', 
        };        
    }
  loadData = (params,date = {end:moment().format(monthFormat), begin:moment().subtract(11,'months').format(monthFormat)}) => {
                  // date = {begin:moment().format(monthFormat), end:moment().subtract(12,'months').format(monthFormat)}

      this.setState({
          loading: true,
      });
      // params={
      //   statisticalTypeOne:'Type_Informed', //* Type_Filter ：筛选 , Type_Informed ：知情 , Type_Random ：随机(入组)
      //   statisticalTypeAnother:'Type_Random',
      //   cumulative:1,  // 1：累计 ， 0：每月
      //   begin:'2016-10-10',
      //   end:'2017-08-01',
      // }
      const options ={
        method: 'POST',
        url: `${API_URL.summary.queryFTE}`,
        data: {
            ...params,
            ...date,
           investigationSiteId: sessionStorage.siteId,
        },
        dateType: 'json',
        doneResult:(data => {
          if (!data.error) {
            this.setState({
              loading: false,
              planList1:data.data.planList || [],
              actualList:data.data.actualList || [],

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

    reload = () => {
        this.loadData();
        this.setState({
          isAddBtn:true,
        })
    }

    getdataSource = () => {
      const { planList1,actualList} = this.state;
      const rows = []
      const row1 = {}
      const row2 = {}
      const row3 = {}
      planList1.map((d,i) => {
        row1[d.month] = Number(d.fte.toFixed(2));
      })
        actualList.map((d,i) => {
        row2[d.month] = Number(d.fte.toFixed(2))
      })

        for(var i =0  ; i < planList1.length; i ++){

            var plan = planList1[i];
            var actual = actualList[i];
            if(plan.fte != 0)
                 row3[plan.month] =Number((100 * actual.fte/plan.fte)).toFixed(2) + '%';
            else
                row3[plan.month] = 0;

        }


      // summaryList1.map((d,i) => {
      //   row2[d.month] = d.amount
      // })
      // summaryList2.map((d,i) => {
      //   row4[d.month] = d.amount
      // })
      const {legend} = this.state
      rows.push({
        index: '计划FTE',
        ...row1,
      })
      rows.push({
        index: '消耗FTE',
        ...row2,
      })
      rows.push({
        index: 'FTE消耗比',
        ...row3,
      })
      return rows
    }
    getColumns = () => {
      const columns = []
      columns.push({
        title: '',
        dataIndex: 'index',
        key: 'index',
      })      
      this.state.planList1.map((d,i)=> {
        columns.push({        
          title: `${d.month}月`,
          dataIndex: `${d.month}`,
          key: `${d.month}`,
        })
      })                
      return columns
    } 

    //组件加载时初始化参数
    init = (name) => {
      let params ={}
      const date ={}
      let title = ''
      let legend ={}
      let chartstype = ''
      switch (name){
        case 'cumFTE':
          title = '累计FTE情况'
          params = {            
            investigationId:1,
            investigationSiteId:'',
            cumulative:1
          }
        break;
        case 'monFTE':
          title = '每月FTE情况'
          params = {            
            investigationId:1,
            investigationSiteId:'',
            cumulative:0
          }
          chartstype = 'column'
        break;
      }

      this.setState({
        title,
        params,
        legend,
        chartstype,     
      })
      this.loadData(params);
    }

    componentWillMount(){
      this.init(this.state.name)
    }


    componentWillReceiveProps(nextProps){
      this.init(nextProps.match.params.name)
      // this.siderRef.selectKey(typeName)
      this.setState({
        next:nextProps.match.params.name
      })
    }


    showPreviewModal = id => {
      this.previewModalRef.show(id)
    }


    render(){
        const { loading, planList1,actualList,summaryList1,summaryList2,date,title,legend,chartstype, params } = this.state;
        const month = planList1.map( d => `${d.month}月` )
        const plan1data = planList1.map( d => d.fte )
        const plan2data = actualList.map( d => Number(d.fte.toFixed(2)) )
        const ratioData = [];//planList1.map( d => d.fte );//{}

       for(var i =0  ; i < planList1.length; i ++){

            var plan = planList1[i];
            var actual = actualList[i];
            if(plan.fte != 0 )
                ratioData[i] = Number((actual.fte/plan.fte).toFixed(2));
            else
                ratioData[i] = 0;
       }

        const summary3data = []//summaryList1.map( d => d.amount )
        const summary4data = []//summaryList2.map( d => d.amount )

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
                yAxis: {
                  title: {
                    text: ''
                  },
                },
                xAxis: {
                  categories: month
                },
                series: [{
                  data: plan1data,
                  name: '计划FTE'
                },{
                  data: plan2data,
                  name: '消耗FTE'
                },{
                    data: ratioData,
                    name: 'FTE消耗比'
                }
                ],
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
                credits: {
                    enabled:false,
                    text:'SMO医疗大数据',
                },
              };
        return (          
            <div className="content">
                <SideNav ref={el => {this.siderRef = el;}} />
                <div className="main">                    
                    <div className="T-tit">
                        <div className="txt">
                            <h3 style={{marginBottom:10}}>{title} </h3>
                            <div style={{textAlign:'left'}}><DateRange loadData ={this.loadData} params={params} defaultValueBegin={this.state.defaultValueBegin} defaultValueEnd={this.state.defaultValueEnd} next={this.state.next}/> </div>
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

export default ChartsFTE;
