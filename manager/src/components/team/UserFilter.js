import React from 'react';
import $ from '../../common/AjaxRequest';
import API_URL from '../../common/url';
import SelectCitys from '../common/SelectCitys';
import { Button, Input, Select, Icon } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class Filter extends React.Component {

    state = {
        employeeCode:'',
        userCompellation:'',
        positionId:'',
        enterpriseDepartmentId:'',
        workCityId:'',
        dimissionStatus:'',
        leaderName:'',
        Department:[],
        position:[],
    };
    loadDepartment = () => {
        // this.loadDataParam(params);
        const options ={
            method: 'POST',
            url: `${API_URL.team.queryUserDepartmentSelect}`,
            data: {

            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    this.setState({
                        Department: data.data,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)
    }


    loadposition = () => {
        const options ={
            method: 'POST',
            url: `${API_URL.team.queryUserPositionSelect}`,
            data: {

            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    this.setState({
                        position: data.data,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)
    }

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
        const {employeeCode,
        userCompellation,
        positionId,
        enterpriseDepartmentId,
        workCityId,
        leaderName,
        dimissionStatus,} =this.state
        const { sortParams } = this.props;
        this.props.reload({ employeeCode,
        userCompellation,
        positionId,
        enterpriseDepartmentId,
        workCityId,
        leaderName,
        dimissionStatus, ...sortParams, offset: 1 },true);
    }

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    }

    reset = () => {
        this.props.reset();
    }

    ChangeSelectprovinces =()=>{}

    getParams = () => {
        const {employeeCode,
        userCompellation,
        positionId,
        enterpriseDepartmentId,
        workCityId,
        dimissionStatus,
        leaderName,
    } =this.state
        return( {employeeCode,
        userCompellation,
        positionId,
        enterpriseDepartmentId,
        workCityId,
        leaderName,
        dimissionStatus,} )
    }
    componentWillMount() {
        this.loadDepartment()
        this.loadposition()
    }
    render() {
        const {
            employeeCode,
            userCompellation,
            positionId,
            enterpriseDepartmentId,
            workCityId,
            dimissionStatus,
            Department,
            position,
            leaderName,
        } = this.state;
        const DepartmentOption = Department.map(d=><Option key={d.enterpriseDepartmentId}>{d.enterpriseDepartmentName}</Option>)
        const positionOption = position.map(d=><Option key={d.positionId}>{d.positionName}</Option>)
        const cityOption = Department.map(d=><Option key={d.enterpriseDepartmentId}>{d.enterpriseDepartmentName}</Option>)
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
                        <label htmlFor="" className="ui-label">职位</label>
                        <Select
                            placeholder="请输入职位"
                            value={positionId}
                            onChange={this.handleChangeSelect.bind(this, 'positionId')}
                            onKeyPress={this.enterSearch}
                            style={{width:160}}
                        >
                            <Option value=''>请选择</Option>
                            {positionOption}
                        </Select>
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">部门</label>
                        <Select
                            placeholder="请输入部门"
                            value={enterpriseDepartmentId}
                            onChange={this.handleChangeSelect.bind(this, 'enterpriseDepartmentId')}
                            onKeyPress={this.enterSearch}
                            style={{width:160}}
                        >
                            <Option value=''>请选择</Option>                        
                            {DepartmentOption}
                        </Select>
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">主管领导</label>
                        <Input
                            placeholder="请输入主管领导"
                            value={leaderName}
                            onChange={this.handleChange.bind(this, 'leaderName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div> 
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">工作城市</label>
                        <SelectCitys 
                        ChangeSelectprovinces ={this.ChangeSelectprovinces}
                        ChangeSelect = {this.handleChangeSelect.bind(this, 'workCityId')}
                        />                        
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">状态</label>
                        <Select
                            defauleValue="请选择"
                            value={dimissionStatus}
                            onChange={this.handleChangeSelect.bind(this, 'dimissionStatus')}
                            onKeyPress={this.enterSearch}
                            style={{width:90}}
                        >
                            <Option value="WORKING">在职</Option>
                            <Option value="LEFT">离职</Option>
                        </Select>
                    </div>  

                    <Button type="primary filter-search-btn" icon="search" onClick={this.search}>搜索</Button>
                    
                </div>
            </div>
        );
    }
}

export default Filter;
