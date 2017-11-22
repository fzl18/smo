import React from 'react';
import { Button, Input, Select, Icon } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class Filter extends React.Component {

    state = {
        enterpriseName:'',
        enterpriseBusinessNum:'',
        enterpriseOrganizationCode:'',
        status:'',
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
            enterpriseName,
            enterpriseBusinessNum,
            enterpriseOrganizationCode,
            status,
        } = this.state;

        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">企业名称</label>
                        <Input
                            placeholder="请输入企业名称"
                            value={enterpriseName}
                            onChange={this.handleChange.bind(this, 'enterpriseName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">营业执照注册号</label>
                        <Input
                            placeholder="请输入营业执照注册号"
                            value={enterpriseBusinessNum}
                            onChange={this.handleChange.bind(this, 'enterpriseBusinessNum')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">组织机构代码</label>
                        <Input
                            placeholder="请输入组织机构代码"
                            value={enterpriseOrganizationCode}
                            onChange={this.handleChange.bind(this, 'enterpriseOrganizationCode')}
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
                            <Option value="ACTIVE">启用</Option>
                            <Option value="INACTIVE">停用</Option>
                        </Select>
                    </div>
                    <Button type="primary filter-search-btn" icon="search" onClick={this.search}>搜索</Button>
                    {/*<Button type="primary" onClick={this.reset}>重置</Button>*/}
                    <Button className="add-btn" type="primary" onClick={this.showCreateModal}>
                    <Icon type="plus" className="add-btn-icon" />
                    添加
                    </Button>
                </div>
            </div>
        );
    }
}

export default Filter;
