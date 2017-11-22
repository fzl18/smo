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
// import './css/index.less';
import chartsConfig from '../common/chartsConfig';

const monthFormat = 'YYYY-MM'

class Charts extends React.Component {
    constructor(props) {
        super(props);
    this.state = {
        count:0,
        loading: false,
        planList1 : [],
        planList2 : [],
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
        url: `${API_URL.summary.list}`,
        data: {
            ...params,
            ...date,
        },
        dateType: 'json',
        doneResult:(data => {
          if (!data.error) {
            this.setState({
              loading: false,
              planList1:data.data.planList1 || [],
              planList2:data.data.planList2 || [],
              summaryList1:data.data.summaryList1 || [],
              summaryList2:data.data.summaryList2 || [],
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
      const { planList1,planList2,summaryList1,summaryList2} = this.state;
      const rows = []
      const row1 = {}
      const row2 = {}
      const row3 = {}
      const row4 = {}
      planList1.map((d,i) => {
        row1[d.month] = d.amount
      })
      planList2.map((d,i) => {
        row3[d.month] = d.amount
      })
      summaryList1.map((d,i) => {
        row2[d.month] = d.amount
      })
      summaryList2.map((d,i) => {
        row4[d.month] = d.amount
      })
      const {legend} = this.state
      rows.push({
        index: legend.plan1,
        ...row1,
      })
      rows.push({
        index: legend.summary1,
        ...row2,
      })
      rows.push({
        index: legend.plan2,
        ...row3,
      })
      rows.push({
        index: legend.summary2,
        ...row4,
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
        case 'cumInfRan':
          title = '累计知情随机(入组)'
          params = {            
            statisticalTypeOne:'Type_Informed',
            statisticalTypeAnother:'Type_Random',
            cumulative:1
          }
          legend = {
            plan1:'计划知情',
            plan2:'计划随机(入组)',
            summary1:'实际知情',
            summary2:'实际随机(入组)',
          }
        break;
        case 'monInfRam':
          title = '每月知情随机(入组)'
          params = {            
            statisticalTypeOne:'Type_Informed',
            statisticalTypeAnother:'Type_Random',
            cumulative:0
          }
          legend = {
            plan1:'计划知情',
            plan2:'计划随机(入组)',
            summary1:'实际知情',
            summary2:'实际随机(入组)',
          }
          chartstype = 'column'
        break;
        case 'cumFilRan':
          title = '累计筛选随机(入组)'
          params = {            
            statisticalTypeOne:'Type_Filter', //* Type_Filter ：筛选 , Type_Informed ：知情 , Type_Random ：随机(入组)
            statisticalTypeAnother:'Type_Random',
            cumulative:1
          }
          legend = {
            plan1:'计划筛选',
            plan2:'计划随机(入组)',
            summary1:'实际筛选',
            summary2:'实际随机(入组)',
          }
        break;
        case 'monFilRan':
          title = '每月筛选随机(入组)'
          params = {            
            statisticalTypeOne:'Type_Filter',
            statisticalTypeAnother:'Type_Random',
            cumulative:0
          }
          legend = {
            plan1:'计划筛选',
            plan2:'计划随机(入组)',
            summary1:'实际筛选',
            summary2:'实际随机(入组)',
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
        const { loading, planList1,planList2,summaryList1,summaryList2,date,title,legend,chartstype, params } = this.state;       
        const month = planList1.map( d => `${d.month}月` )
        const plan1data = planList1.map( d => d.amount )
        const plan2data = planList2.map( d => d.amount )
        const summary3data = summaryList1.map( d => d.amount )
        const summary4data = summaryList2.map( d => d.amount )

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
                  name: legend.plan1
                },{
                  data: summary3data,
                  name: legend.summary1
                },{
                  data: plan2data,
                  name: legend.plan2
                },{
                  data: summary4data,
                  name: legend.summary2
                },],
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
                            rowKey={record => record.index}
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

export default Charts;
