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
class ChartsVisit extends React.Component {
    constructor(props) {
        super(props);
    this.state = {
        count:0,
        loading: false,
        title:'',
        datas:{},
        params:{},
        date:{},
        name:this.props.match.params.name,
        chartstype:'line',
        chartSeries:[],
        categories:[],
        dataSource:[],
        columns:[],
        defaultValueBegin:moment().add(-11,'M'),
        defaultValueEnd:moment(),  
        next:'',  
        };        
    }
  loadData = (params,date = {end:moment().format(monthFormat), begin:moment().subtract(11,'months').format(monthFormat)}) => {
    
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
        url: `${API_URL.summary.visit}`,
        data: {
            ...params,
            ...date,
        },
        dateType: 'json',
        doneResult:(data => {
          if (!data.error) {
            const datas = data.data.datas || []
            const monthList = data.data.monthList  || []
            const visitTypeNames =data.data.visitTypeNames
            const rows = []
            const chartSeries=[]
            const categories=[]
            const columns=[]
            const allamount=[]
            let time=0
            let total = {}

            columns.push({
              title: '',
              dataIndex: 'index',
              key: 'index',
            })
            monthList.map((d,i) => {
                columns.push({
                title: `${d.month}月`,
                dataIndex: d.month,
                key: d.month,
              })
            })

            visitTypeNames.map((d,i)=>{
              let col = {}
              let chartdata = []
              if(datas[i]){
                datas[i].map((data,i) => {
                  col[data.month] = data.amount
                  chartdata.push(data.amount)
                })
              }
              
              chartSeries.push({
                data: chartdata,
                name: d,
              })
              allamount.push(chartdata)
              rows.push({
                index:d,
                key:i,
                ...col,
              })              
            })
           
            let sum = []
            if(allamount.length>0){
              for (let i=0;i<allamount[0].length;i++){
                sum[i] = 0;
              }
              for (let count1=0;count1<allamount[0].length;count1++){
                for (let count2=0;count2<allamount.length;count2++){
                  sum[count1] += parseFloat(allamount[count2][count1]) ? parseFloat(allamount[count2][count1]):0 ;
                }
              }
            }
              

            console.log(sum)
            let mon = monthList.map(d =>d.month)
            mon.map((d,i) =>{
               total[d] = sum[i]
            })
            rows.push({
                index:'合计',
                key:'total',
                ...total,
            })

            this.setState({
              loading: false,
              chartSeries,
              categories:monthList.map(d=> `${d.month}月`),
              dataSource:rows,
              columns,
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
    }

    // dataSource = () => {
      
    // }
    // getColumns = () => {
    //   const columns = []
      
    //   this.state.dataSource.map()
    //   columns.push({        
    //     title: `${d.month}月`,
    //     dataIndex: `${d.month}`,
    //     key: `${d.month}`,
    //   })             
    //   return columns
    // } 

    //组件加载时初始化参数
    init = (name) => {
      let params ={}
      const date ={}
      let title = ''
      let legend ={}
      let chartstype = ''
      switch (name){
        case 'cumVisit':
          title = '累计完成访视'
          params = {            
            investigationId:1,
            investigationSiteId:'',
            cumulative:1  //是否累计  传参数：cumulative:1
          }
        break;
        case 'monVisit':
          title = '每月完成访视'
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
      this.setState({
        next:nextProps.match.params.name
      })
    }

    showPreviewModal = id => {
      this.previewModalRef.show(id)
    }

    render(){
        const { loading,date,title,legend,chartstype, params, chartSeries, categories, columns,dataSource } = this.state;
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
                  categories: categories
                },
                series: chartSeries,
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
                            columns={columns}
                            dataSource={dataSource}
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

export default ChartsVisit;
