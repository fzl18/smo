import React from "react";
import {Button, Input, Select, DatePicker} from "antd";
import moment from "moment";
import StringUtil from '../../common/StringUtil';


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
        monthNum1: '',
        monthNum2: '',
        monthStart:'',
        investigationCode: '',
        investigationName: '',
        investigationSiteCode: '',
        investigationSiteName: '',
    };

    search = () => {
        this.props.reload({...this.state});
    }

    handleChange = (field, e) => {
        this.setState({
            [field]: e.target.value,
        });
    }

    onChangeMonth1 =(date, dateString)=> {
        this.setState({
            monthNum1:dateString
        });
    }

    onChangeMonth2 =(date, dateString)=> {
        this.setState({
            monthNum2:dateString,
        });
    }

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    }

    reset = () => {
        this.setState ({
            monthNum: '',
            investigationCode: '',
            investigationName: '',
            investigationSiteCode: '',
            investigationSiteName: '',
        })

        this.props.reset();
    }

    

    render() {
        const {
            monthStart,
            investigationCode,
            investigationName,
            investigationSiteCode,
            investigationSiteName,
        } = this.state;

        return (
            <div className="filter-bar bar2">
                <div className="form-item">
                    <label htmlFor="" className="ui-label">时间</label>
                    <MonthPicker  format={monthFormat} defaultValue={moment()}
                                 disabledDate={disabledDate} placeholder="选择月份"
                                 onChange={this.onChangeMonth1} />
                </div>

                <div className="form-item">
                    <label htmlFor="" className="ui-label">至</label>
                    <MonthPicker format={monthFormat} defaultValue={moment()}
                                 disabledDate={disabledDate(monthStart)} placeholder="选择月份"
                                 onChange={this.onChangeMonth2} />
                </div>

                <div className="form-item">
                    <label htmlFor="" className="ui-label">项目编号</label>
                    <Input
                        placeholder="请输入项目编号"
                        value={investigationCode}
                        onChange={this.handleChange.bind(this, 'investigationCode')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                <div className="form-item">
                    <label htmlFor="" className="ui-label">项目名称</label>
                    <Input
                        placeholder="请输入项目名称"
                        value={investigationName}
                        onChange={this.handleChange.bind(this, 'investigationName')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                <div className="form-item">
                    <label htmlFor="" className="ui-label">中心编号</label>
                    <Input
                        placeholder="请输入中心编号"
                        value={investigationSiteCode}
                        onChange={this.handleChange.bind(this, 'investigationSiteCode')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                <div className="form-item">
                    <label htmlFor="" className="ui-label">中心名称</label>
                    <Input
                        placeholder="请输入中心名称"
                        value={investigationSiteName}
                        onChange={this.handleChange.bind(this, 'investigationSiteName')}
                        onKeyPress={this.enterSearch}
                    />
                </div>


                <Button type="primary"  onClick={this.search}>搜索</Button>
                <Button type="primary"  onClick={this.reset}>重置</Button>
                {this.props.showback ? <Button type="primary"  onClick={()=>history.back()} className='back'>返回</Button> :null}

            </div>
        );
    }


}
export default Filter;
