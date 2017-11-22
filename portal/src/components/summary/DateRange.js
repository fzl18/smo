import React from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import { message, Table, Popconfirm, Modal, Button,Icon, DatePicker, Row, Col,Input,Tooltip,Select ,InputNumber} from 'antd';
import API_URL from '../../common/url';
import SideNav from './SideNav';
import Highcharts from 'react-highcharts';
// import './css/index.less';

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
    if(this.props.type == "noRange"){
      return startValue.valueOf() > endValue.valueOf() + 60000;
    }else{
      return startValue.valueOf() > endValue.valueOf() + 60000 || startValue.add(12, 'months').valueOf() <= endValue.valueOf() + 60000;
    }
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    if(this.props.type == "noRange"){
      return endValue.valueOf() <= startValue.valueOf() - 60000;
    }else{
      return endValue.valueOf() <= startValue.valueOf() - 60000 || endValue.add(-12, 'months').valueOf() > startValue.valueOf() - 60000;
    }
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
    if(this.props.clearDate){
      this.props.clearDate("begin")
    }
  }

  onEndChange = (endValue) => {
    this.onChange('endValue', endValue);
    if(this.props.clearDate){
      this.props.clearDate("end")
    }
    const { startValue} = this.state;
    if(startValue && endValue){
      this.props.loadData(this.props.params,{begin:startValue.format(monthFormat),end:endValue.format(monthFormat)})      
    }else{
      message.warn('请选择日期！')
    }
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });      
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
    // const { startValue ,endValue } = this.state;
    // if(startValue && endValue){
    //   this.props.loadData(this.props.params,{begin:startValue.format(monthFormat),end:endValue.format(monthFormat)})      
    // }else{
    //   message.warn('请选择日期！')
    // }
  }

  componentWillReceiveProps(nextProps){
    
  }      

  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
      <div>
        <MonthPicker
          disabledDate={this.disabledStartDate}
          format={monthFormat}
          value={startValue}
          placeholder="选择开始月份"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
          style={{width:"110px"}}
        />
        <span className="ant-divider" />
        <MonthPicker
          disabledDate={this.disabledEndDate}
          format={monthFormat}
          value={endValue}
          placeholder="结束月份"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
          style={{width:"110px"}}
        />
      </div>
    );
  }
}
export default DateRange;