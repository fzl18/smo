import React from 'react';
import { Button, Input, Select } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class UserTransferFilter extends React.Component {

    state = {
        transactionId: '',
        city: '',
        investigationSiteCode: '',
        investigationSiteName: '',
        status: '',
        handoverUser: '',
        assignedUsers: '',
        assignUserName: '',
        requireUser: '',
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
        transactionId,
        city,
        investigationSiteCode,
        investigationSiteName,
        status,
        handoverUser,
        assignedUsers,
        assignUserName,
        requireUser,
        } = this.state;
        const curRole = sessionStorage.curRole;
        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">交接编号</label>
                        <Input
                            value={transactionId}
                            onChange={this.handleChange.bind(this, 'transactionId')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">城市</label>
                        <Input
                            value={city}
                            onChange={this.handleChange.bind(this, 'city')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目编号</label>
                        <Input
                            value={city}
                            onChange={this.handleChange.bind(this, 'investigationCode')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目名称</label>
                        <Input
                            value={city}
                            onChange={this.handleChange.bind(this, 'investigationName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">中心编号</label>
                        <Input
                            value={investigationSiteCode}
                            onChange={this.handleChange.bind(this, 'investigationSiteCode')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">中心名称</label>
                        <Input
                            value={investigationSiteName}
                            onChange={this.handleChange.bind(this, 'investigationSiteName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">状态</label>
                        <Select 
                            onChange={this.handleChangeSelect.bind(this, 'status')} 
                            style={{width:90}}
                            placeholder="请选择"
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
                            value={assignedUsers}
                            onChange={this.handleChange.bind(this, 'assignedUsers')}
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
                            value={assignUserName}
                            onChange={this.handleChange.bind(this, 'assignUserName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <Button className="btn" type="primary" icon="search" onClick={this.search}>搜索</Button>
                </div>
            </div>
        );
    }
}

export default UserTransferFilter;
