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




class ProChartsVisit extends React.Component {
    constructor(props) {
        super(props);
    this.state = {
        count:0,
        loading: false,
        planList1 : [],
        planList2 : [],
        summaryList1 : [],
        summaryList2 : [],
        dataSource:[],
        };        
    }

  loadData = (...date) => {
      this.setState({
          loading: true,
      });
      const params={
        investigationId:1,
        // investigationSiteId,
        cumulative:1,  // 1：累计 ， 0：每月
        begin:'2016-10-10',
        end:'2017-08-01',
      }
      const options ={
        method: 'POST',
        url: `${API_URL.projectstatus.visit}`,
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

    getColumns = () => {
      const columns = []
      columns.push({
          title: '',
          dataIndex: 'index',
          key: 'index',
      })
      columns.push({

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
        const { loading, planList1,planList2,summaryList1,summaryList2,date,dataSource } = this.state;
        const month = planList1.map( d => `${d.month}月` )
        const config={
                title:{
                  text:''
                },
                xAxis: {
                  categories: {month}
                },
                series: [{
                  data: [106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 295.6, 454.4]
                }]
              };
        return (
            <div className="content" style={{background:'#fff',padding:'30px 20px'}}>
                <SideNav selectKey="manHour" />
                <div className="content-inner">                    
                    <div className="T-tit">
                        <div className="txt">
                            <h3 style={{marginBottom:10}}>累计完成访视数 </h3>
                            <p style={{textAlign:'left'}}><DateRange /> </p>
                        </div>
                    </div>
                    <div className="charts" style={{marginBottom:10}}>
                        <Highcharts config={{...config, ...chartsConfig}} />
                    </div>
                    <div className="content">
                        <Table
                            columns={this.getColumns()}
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

export default ProChartsVisit;
