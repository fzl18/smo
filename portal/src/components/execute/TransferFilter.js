import React from 'react';
import { Button, Input, Select } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class TransferFilter extends React.Component {

    state = {
        invCode : '',
        invName : '',
        handoverCode: '',
        city: '',
        siteCode: '',
        siteName: '',
        status: '',
        handoverUser: '',
        assignedUser: '',
        assignUser: '',
        requireUser: '',
        noPage: true
    };

    handleAdd = () => {
        this.props.handleAdd();
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
        this.props.reload({ ...this.state });
        this.props.search({ ...this.state });
    }

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    }

    reset = () => {
        this.props.reset();
    }

    export = () => {
        this.props.export();
    }

    render() {
        const {
        invCode,
        invName,
        handoverCode,
        city,
        siteCode,
        siteName,
        status,
        handoverUser,
        assignedUser,
        assignUser,
        requireUser,
        } = this.state;
        const curRole = sessionStorage.curRole;
        const siteId = sessionStorage.siteId;
        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">交接编号</label>
                        <Input
                            value={handoverCode}
                            onChange={this.handleChange.bind(this, 'handoverCode')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    {
                        siteId == null || siteId == 0 ?
                        <div>
                            <div className="form-item">
                                <label htmlFor="" className="ui-label">项目编号</label>
                                <Input
                                    value={invCode}
                                    onChange={this.handleChange.bind(this, 'invCode')}
                                    onKeyPress={this.enterSearch}
                                />
                            </div>
                            <div className="form-item">
                                <label htmlFor="" className="ui-label">项目名称</label>
                                <Input
                                    value={invName}
                                    onChange={this.handleChange.bind(this, 'invName')}
                                    onKeyPress={this.enterSearch}
                                />
                            </div>
                        </div>
                        :
                        null
                    }
                    {
                        sessionStorage.curRole == "PM" || sessionStorage.curRole == "CRCC" 
                            || sessionStorage.curRole == "CRCM" || sessionStorage.curRole == "BO"?
                        <div><div className="form-item">
                            <label htmlFor="" className="ui-label">城市</label>
                            <Input
                                value={city}
                                onChange={this.handleChange.bind(this, 'city')}
                                onKeyPress={this.enterSearch}
                            />
                        </div></div>
                        : null                        
                    }
                    {
                        (sessionStorage.curRole == 'PM' || sessionStorage.curRole == 'CRCC' 
                            || sessionStorage.curRole == 'CRCM' || sessionStorage.curRole == "BO")
                              && (siteId == null || siteId == 0) ?
                        <div><div className="form-item">
                            <label htmlFor="" className="ui-label">中心编号</label>
                            <Input
                                value={siteCode}
                                onChange={this.handleChange.bind(this, 'siteCode')}
                                onKeyPress={this.enterSearch}
                            />
                        </div>
                        <div className="form-item">
                            <label htmlFor="" className="ui-label">中心名称</label>
                            <Input
                                value={siteName}
                                onChange={this.handleChange.bind(this, 'siteName')}
                                onKeyPress={this.enterSearch}
                            />
                        </div>
                        </div>
                        :
                        null
                    }

                    <div className="form-item">
                        <label htmlFor="" className="ui-label">状态</label>
                        <Select 
                            onChange={this.handleChangeSelect.bind(this, 'status')} 
                            style={{width:90}}
                            placeholder="请选择"
                            allowClear = {true}
                        >
                            <Option value="NEW">新建</Option>
                            <Option value="ASSIGNED">预分配</Option>
                            <Option value="REASSIGNED">重新分配</Option>
                            <Option value="REJECTED">被拒绝</Option>
                            <Option value="UNDERWAY">进行中</Option>
                            <Option value="DELIVERED">确认中</Option>
                            <Option value="RECEIVED">已提交</Option>
                            <Option value="ACTIVE">已完成</Option>
                        </Select>
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">交接人</label>
                        <Input
                            value={handoverUser}
                            onChange={this.handleChange.bind(this, 'handoverUser')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">接收人</label>
                        <Input
                            value={assignedUser}
                            onChange={this.handleChange.bind(this, 'assignedUser')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">发起人</label>
                        <Input
                            value={requireUser}
                            onChange={this.handleChange.bind(this, 'requireUser')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">处理人</label>
                        <Input
                            value={assignUser}
                            onChange={this.handleChange.bind(this, 'assignUser')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <Button className="btn" type="primary" icon="export" onClick={this.export}>导出</Button>
                    <Button className="btn" type="primary" icon="search" onClick={this.search}>搜索</Button>
                    {
                        curRole == 'PM' ? <Button className="btn" type="primary" onClick={this.handleAdd}>新建</Button> : ''
                    }
                </div>
            </div>
        );
    }
}

export default TransferFilter;
