import React from 'react';
import { Button, Input, Select, Icon } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class Filter extends React.Component {

    state = {
        userName: '',
        userCompellation: '',
        userMobile: '',
        userEmail: '',
        enterpriseName: '',
        createUserName: '',
        status: '',
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
        this.props.reload({ ...this.state, ...sortParams });
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
            userName,
            userCompellation,
            userMobile,
            userEmail,
            enterpriseName,
            createUserName,
            status,
        } = this.state;

        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">用户名</label>
                        <Input
                            placeholder="请输入用户名"
                            value={userName}
                            onChange={this.handleChange.bind(this, 'userName')}
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
                        <label htmlFor="" className="ui-label">手机号</label>
                        <Input
                            placeholder="请输入手机号"
                            value={userMobile}
                            onChange={this.handleChange.bind(this, 'userMobile')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">邮箱</label>
                        <Input
                            placeholder="请输入邮箱"
                            value={userEmail}
                            onChange={this.handleChange.bind(this, 'userEmail')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">归属企业</label>
                        <Input
                            placeholder="请输入企业名称"
                            value={userEmail}
                            onChange={this.handleChange.bind(this, 'enterpriseName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">创建者</label>
                        <Input
                            placeholder="请输入创建者"
                            value={createUserName}
                            onChange={this.handleChange.bind(this, 'createUserName')}
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
                            <Option value="ACTIVE">正常</Option>
                            <Option value="INACTIVE">停用</Option>
                        </Select>
                    </div>
                    <Button type="primary filter-search-btn" icon="search" onClick={this.search}>搜索</Button>
                    <Button className="add-btn" type="primary" onClick={this.showCreateModal}>
                    <Icon type="plus" className="add-btn-icon" />
                    添 加
                    </Button>
                </div>
            </div>
        );
    }
}

export default Filter;
