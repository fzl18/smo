import React from "react";
import {Button, DatePicker, Input, Select} from "antd";
import moment from "moment";
import SelectCitys from "../common/SelectCitys";
import API_URL from '../../common/url';
import ExportUtil from '../../common/ExportUtil';


const InputGroup = Input.Group;
const Option = Select.Option;
const monthFormat = 'YYYY-MM';
const {MonthPicker, RangePicker} = DatePicker;

function disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
}

class Filter extends React.Component {
    state = {
       // startDate: moment().format(monthFormat),
      //  endDate: moment().format(monthFormat),
        startDate: '',
        endDate: '',
        employeeCode: '',
        userCompellation: '',
        workCityName: '',
        Province:'',
        begin:moment().format(monthFormat),
        end:moment().format(monthFormat),
    };

    search = () => {
        this.props.reload( {...this.state});
    };

    getSearchParams =() => {
        return(  {...this.state} )
    }

    handleChange2 = (field, v, s) => {
        this.setState({
            [field]: s.value,
        });
    };

    handleChange = (field, e) => {
        this.setState({
            [field]: e.target.value,
        });
    };

    onChangeMonth1 = (date, dateString) => {
        this.setState({
            startDate: dateString,
            begin:dateString,
        });
    };

    onChangeMonth2 = (date, dateString) => {
        this.setState({
            endDate: dateString,
            end:dateString,
        });
    };

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    };

    reset = () => {
        this.setState({
            monthNum: '',
            investigationCode: '',
            investigationName: '',
            investigationSiteCode: '',
            investigationSiteName: '',
        });

        this.props.reset();
    };

    export = () => {
        this.props.export({...this.state});
    };

    clear = () =>{
        this.setState({
            workCityName:'',
            Province:''
        })
    }

    render() {
        const {
            monthStart,
            begin,
            end,
            investigationCode,
            investigationName,
            investigationSiteCode,
            investigationSiteName,
        } = this.state;

        return (
            <div className="filter-bar bar2">
                <div className="form-item">
                    <label htmlFor="" className="ui-label">时间</label>
                  {/* // defaultValue={moment()}*/}
                    <MonthPicker  format={monthFormat}
                                 disabledDate={disabledDate} placeholder="选择月份"
                                 onChange={this.onChangeMonth1}
                                 allowClear={false} defaultValue={moment()}
                                 />

                </div>
                <div className="form-item">
                <label htmlFor="" className="ui-label">至</label>
                    <MonthPicker format={monthFormat}
                                 disabledDate={disabledDate(monthStart)} placeholder="选择月份"
                                 onChange={this.onChangeMonth2}
                                 allowClear={false}
                                 defaultValue={moment()}
                                 />
                </div>

                <div className="form-item">
                    <label htmlFor="" className="ui-label">工号</label>
                    <Input
                        placeholder="请输入项目工号"
                        onChange={this.handleChange.bind(this, 'employeeCode')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                <div className="form-item">
                    <label htmlFor="" className="ui-label">姓名</label>
                    <Input
                        placeholder="请输入姓名"
                        onChange={this.handleChange.bind(this, 'userCompellation')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                <div className="form-item">
                    <label htmlFor="" className="ui-label">工作城市 </label>
                    <SelectCitys
                        ChangeSelectprovinces={this.handleChange2.bind(this, 'Province')}
                        ChangeSelect={this.handleChange2.bind(this, 'workCityName')}
                        clear={this.clear}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                <div className="btn" style={{float: 'right'}}>
                    <Button type="primary" onClick={this.export}>导出</Button>
                    <Button type="primary" onClick={this.search}>搜索</Button>
                    {/* <Button type="primary" icon="reload" onClick={this.reset}>导出</Button> */}
                </div>

            </div>
        );
    }


}

export default Filter;
