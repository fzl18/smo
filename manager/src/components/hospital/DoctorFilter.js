import React from 'react';
import { Button, Input, Select, Icon } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class Filter extends React.Component {

    state = {
        userMobile: '',
        hospitalName:'',
        userCompellation:'',
        hospitalDepartmentName:'',

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

    getSearchParams = () => {
        return {...this.state}
    }

    search = () => {
        const { sortParams } = this.props;
        this.props.reload({ ...this.state, ...sortParams },true);
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
            hospitalName,
            hospitalDepartmentName,
            userCompellation,
            userMobile,
        } = this.state;

        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">医院</label>
                        <Input
                            placeholder="请输入医院"
                            value={hospitalName}
                            onChange={this.handleChange.bind(this, 'hospitalName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">科室</label>
                        <Input
                            placeholder="请输入科室"
                            value={hospitalDepartmentName}
                            onChange={this.handleChange.bind(this, 'hospitalDepartmentName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">医生姓名</label>
                        <Input
                            placeholder="请输入医生姓名"
                            value={userCompellation}
                            onChange={this.handleChange.bind(this, 'userCompellation')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">手机号码</label>
                        <Input
                            placeholder="请输入手机号码"
                            value={userMobile}
                            onChange={this.handleChange.bind(this, 'userMobile')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>

                    <Button type="primary filter-search-btn" icon="search" onClick={this.search}>搜索</Button>
                    <span className="ant-divider" />
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
