import React from 'react';
import { Button, Input, Select } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class Filter extends React.Component {

    state = {
        employeeCode:'',
        userCompellation:'',
        positionName:'',
        enterpriseDepartmentName:'',
        regionName:'',
        dimissionStatus:'',
    };

    showCreateModal = () => {
        this.props.showCreateModal();
    }

    getSearchParams =() => {
        return(  {...this.state} )
    }

    handleChange = (field, e) => {
        this.setState({
            [field]: e.target.value,
        });
    }

    handleChangeSelect = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    search = () => {
        const { sortParams } = this.props;
        this.props.reload({ ...this.state, ...sortParams},true);
    }

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    }

    reset = () => {
        this.props.reset();
    }

    render() {
        const {
            employeeCode,
            userCompellation,
            positionName,
            enterpriseDepartmentName,
            regionName,
            dimissionStatus,
        } = this.state;

        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">工号</label>
                        <Input
                            placeholder="请输入工号"
                            value={employeeCode}
                            onChange={this.handleChange.bind(this, 'employeeCode')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">姓名</label>
                        <Input
                            placeholder="请输入姓名"
                            value={userCompellation}
                            onChange={this.handleChange.bind(this, 'userCompellation')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">工作城市</label>
                        <Input
                            placeholder="请输入工作城市"
                            value={regionName}
                            onChange={this.handleChange.bind(this, 'regionName')}
                            onKeyPress={this.enterSearch}
                            style={{width:120}}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">状态</label>
                        <Select
                            onChange={this.handleChangeSelect.bind(this, 'dimissionStatus')}
                            onKeyPress={this.enterSearch}
                            style={{width:90}}
                            defaultValue={dimissionStatus}
                        >   
                            <Option value=''>请选择</Option>
                            <Option value="WORKING">在职</Option>
                            <Option value="LEFT">离职</Option>
                        </Select>
                    </div>
                    <div className="form-item">
                    <Button type="primary" onClick={this.search}>搜索</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Filter;
