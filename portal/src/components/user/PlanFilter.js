import React from 'react';
import { Button, Input, Select } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class PlanFilter extends React.Component {

    state = {
        employeeCode:'',
        userName:'',
        positionName:'',
        enterpriseDepartmentName:'',
        regionName:'',
        investigationName:'',
        investigationArea:'',
        investigationCode:'',
        investigationStatus:'',
        investigationSiteName:'',
        investigationSiteCode:'',
    };

    showCreateModal = () => {
        this.props.showCreateModal();
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
        this.props.reload({ ...this.state, ...sortParams },"search");
    }

    getSeachParams =()=>{
        return ( {...this.state} )
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
            userName,
            enterpriseDepartmentName,
            investigationStatus,
            investigationName,
            investigationArea,
            investigationCode,
            investigationSiteName,
            investigationSiteCode,
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
                            value={userName}
                            onChange={this.handleChange.bind(this, 'userName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目领域</label>
                        <Input
                            placeholder="请输入项目领域"
                            value={investigationArea}
                            onChange={this.handleChange.bind(this, 'investigationArea')}
                            onKeyPress={this.enterSearch}
                        />
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
                        <label htmlFor="" className="ui-label">项目状态</label>
                        <Select
                            onChange={this.handleChangeSelect.bind(this, 'investigationStatus')}
                            onKeyPress={this.enterSearch}
                            defaultValue=''
                            style={{width:80}}
                        >    
                            <Option value="">请选择</Option>                            
                            <Option value="PREPARING">准备中</Option>
                            <Option value="UNDERWAY">进行中</Option>
                            <Option value="COMPLETED">已完成</Option>
                        </Select>
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
                    <Button type="primary" onClick={this.search}>搜索</Button>                    
                </div>
            </div>
        );
    }
}

export default PlanFilter;
