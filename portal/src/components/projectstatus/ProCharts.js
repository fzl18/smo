/**
 * Created by Richie on 2017/8/2.
 */
import React from 'react';
// import $ from 'jquery';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import { message, Table, Popconfirm, Modal, Button,Icon, DatePicker, Row, Col,Input,Tooltip,Select ,InputNumber} from 'antd';
import API_URL from '../../common/url';
import SideNav from './SideNav';
import Highcharts from 'react-highcharts';
// import './css/index.less';
import chartsConfig from '../common/chartsConfig';

const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY-MM';
const Option = Select.Option
const { MonthPicker, RangePicker } = DatePicker


class DateRange extends React.Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }

  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
      <div>
        <MonthPicker
          disabledDate={this.disabledStartDate}
          showTime
          format={monthFormat}
          value={startValue}
          placeholder="选择开始月份"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <span className="ant-divider" />
        <MonthPicker
          disabledDate={this.disabledEndDate}
          showTime
          format={monthFormat}
          value={endValue}
          placeholder="结束月份"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
      </div>
    );
  }
}




class ProCharts extends React.Component {
    constructor(props) {
        super(props);
    this.state = {
        count:0,
        loading: false,
        planList1 : [],
        planList2 : [],
        summaryList1 : [],
        summaryList2 : [],
        };        
    }

  loadData = (...date) => {
      this.setState({
          loading: true,
      });
      const params={
        statisticalTypeOne:'Type_Informed', //* Type_Filter ：筛选 , Type_Informed ：知情 , Type_Random ：随机(入组)
        statisticalTypeAnother:'Type_Random',
        cumulative:1,  // 1：累计 ， 0：每月
        begin:'2016-10-10',
        end:'2017-08-01',
      }
      const options ={
        method: 'POST',
        url: `${API_URL.projectstatus.list}`,
        data: {
            ...date,
            ...params,
        },
        dateType: 'json',
        doneResult:(data => {
          if (!data.error) {
            this.setState({
              loading: false,
              planList1:data.data.planList1,
              planList2:data.data.planList2,
              summaryList1:data.data.summaryList1,
              summaryList2:data.data.summaryList2,
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
      // summaryList1.map((d,i) => {
      //   row2[d.month] = d.amount
      // })
      // summaryList2.map((d,i) => {
      //   row4[d.month] = d.amount
      // })

      rows.push({
        index: '计划随机(入组)',
        ...row1,
      })
      rows.push({
        index: '实际随机(入组)',
        ...row2,
      })
      rows.push({
        index: '计划知情',
        ...row3,
      })
      rows.push({
        index: '实际知情',
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

    componentWillMount(){
        this.loadData();
    }
    componentDidMount(){
    }

    showPreviewModal = id => {
      this.previewModalRef.show(id)
    }


    render(){
        const { loading, planList1,planList2,summaryList1,summaryList2,date } = this.state;
        const month = planList1.map( d => `${d.month}月` )
        const plan1data = planList1.map( d => d.amount )
        const plan2data = planList2.map( d => d.amount )
        const summary3data = []//summaryList1.map( d => d.amount )
        const summary4data = []//summaryList2.map( d => d.amount )

        const config={
                title:{
                  text:''
                },
                chart: {
                    type: 'line'
                },
                legend: {
                    align: 'right',
                    verticalAlign: 'top',
                    x: 0,
                    y: 20,
                    layout:'vertical',
                },
                xAxis: {
                  categories: month
                },
                series: [{
                  data: plan1data,
                  name: '计划随机(入组)'
                },{
                  data: summary3data,
                  name: '实际随机(入组)'
                },{
                  data: plan2data,
                  name: '计划知情'
                },{
                  data: summary4data,
                  name: '实际随机(入组)'
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
            <div className="content" style={{background:'#fff',padding:'30px 20px'}}>
                <SideNav selectKey="manHour" />
                <div className="content-inner">                    
                    <div className="T-tit">
                        <div className="txt">
                            <h3 style={{marginBottom:10}}>累计知情随机(入组) </h3>
                            <p style={{textAlign:'left'}}><DateRange /> </p>
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

export default ProCharts;
