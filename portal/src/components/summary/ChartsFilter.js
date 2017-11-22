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
import DateRange from './DateRange';
// import './css/index.less';
import chartsConfig from '../common/chartsConfig';

const monthFormat = 'YYYY-MM'

class ChartsFilter extends React.Component {
    constructor(props) {
        super(props);
    this.state = {
        count:0,
        loading: false,
        titleArray:[],
        sucArray:[],
        sucPercentArray:[],
        totalArray:[],
        totalPercentArray:[],
        filterReason : [],
        title:'',
        params:{},
        date:{},
        name:this.props.match.params.name,
        chartstype:'column',
        url:'',
        sources:[],
        columns:[],
        keys:[],
        values:[],
        };        
    }
  loadData = (url,params,date = {end:moment().format(monthFormat), begin:moment().subtract(11,'months').format(monthFormat)}) => {
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
      const name = this.props.match.params.name
      const options ={
        method: 'POST',
        url: url,
        data: {
            ...params,
            ...date,
        },
        dateType: 'json',
        doneResult:(data => {
          if (!data.error) {
            if(name === 'filterSource'){
              this.setState({
                loading: false,
                columns:data.columns || [],
                sources:data.sources || [],
                titleArray:data.titleArray || [],
                sucArray:data.sucArray  || [],
                sucPercentArray:data.sucPercentArray  || [],
                totalArray:data.totalArray  || [],
                totalPercentArray:data.totalPercentArray  || [],
              });
            }else{
              this.setState({
                loading: false,
                filterReason:data.datas || [],
                titleArray:data.titleArray,
                columns:data.columns || [],
                sources:data.sources || [],
                keys:data.keys,
                values:data.values,
              });
            }            
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
    }

    getdataSource = () => {
      const { titleArray,sucArray,sucPercentArray,totalArray,totalPercentArray,filterReason,keys,columns,sources} = this.state;
      name = this.props.match.params.name
      const data = []
      
      if(name === 'filterSource'){
        const type= ['筛选数量','筛选占比','筛选成功数量','筛选成功占比']  
        type.map((d,i) =>{
          data.push({
            index:d,
            ...sources[i]
          })
        })

      }else{
        const type= ['筛选失败数量','占比']  
        type.map((d,i) =>{
          data.push({
            index:d,
            ...sources[i]
          })
        })
      }

      return data
    }

    getColumns = () => {
      const {name,titleArray,filterReason,keys,columns,sources}=this.state
      const Tcolumns = []
      Tcolumns.push({
        title: name == 'filterSource' ? '筛选来源' :  '筛选失败原因' ,
        dataIndex: 'index',
        key: 'index',        
      })
      Tcolumns.push(...columns)
      return Tcolumns
    } 

    //组件加载时初始化参数
    init = (name) => {
      let params ={}
      const date ={}
      let title = ''
      let legend ={}
      let chartstype = ''
      let url=''
      switch (name){
        case 'filterSource':
          title = '筛选来源统计'
          params = {            
            investigationId:1,
            investigationSiteId:'',
          }
          url=`${API_URL.summary.queryPatientSource}`
        break;
        case 'filterReason':
          title = '筛选失败原因统计'
          params = {            
            investigationId:1,
            investigationSiteId:'',
          }
          url=`${API_URL.summary.queryFilterFailReason}`
        break;
      }

      this.setState({
        title,
        params,
        url
      })
      this.loadData(url,params);
    }

    componentWillMount(){
      const name = this.props.match.params.name
      this.init(name)
    }


    componentWillReceiveProps(nextProps){
      this.setState({
        sources:[],
        columns:[],
        url:'',
      },function(){
        this.setState({
          name:nextProps.match.params.name
        })
        this.init(nextProps.match.params.name)
      })      
      
      // this.siderRef.selectKey(typeName)
     
    }


    showPreviewModal = id => {
      this.previewModalRef.show(id)
    }


    render(){
        const { loading,date,title,legend,chartstype,keys,values, params,filterReason,name,titleArray,sources,columns,totalArray,sucArray } = this.state;
        let chartSeries = []
        if(name === 'filterSource'){
          chartSeries.push({
            data: totalArray,
            name: '筛选数量'
          })
          chartSeries.push({
            data: sucArray,
            name: '筛选成功数量'
          })  
        }else{
          chartSeries.push({
            data: values,
            name: '筛选失败数量'
          })          
        }


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
                  categories:  name === 'filterSource' ? titleArray : keys
                },
                series:chartSeries,
                // [{
                //   data: plan1data,
                //   name: '计划FTE'
                // },{
                //   data: plan2data,
                //   name: '消耗FTE'
                // },{
                //   data: summary4data,
                //   name: 'FTE消耗比'
                // },]
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
                            {/*<p style={{textAlign:'left'}}><DateRange loadData ={this.loadData} params={params} /></p>*/}
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

export default ChartsFilter;
