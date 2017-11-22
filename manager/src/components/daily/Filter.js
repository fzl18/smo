import React from 'react';
import { Button, Input, Select, Icon } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class Filter extends React.Component {

    state = {
        enterpriseWorkCategoryName: '',
        enterpriseWorkCategoryCode: '',
        isRelateInvestigation:"",
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

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    }

    reset = () => {
        this.props.reset();
    }
    getParams = () => {
        return( {...this.state} )
    }

    render() {
        const {
            enterpriseWorkCategoryName,
            enterpriseWorkCategoryCode,
        } = this.state;

        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">大类名称</label>
                        <Input
                            placeholder="请输入大类名称"
                            value={enterpriseWorkCategoryName}
                            onChange={this.handleChange.bind(this, 'enterpriseWorkCategoryName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">大类编号</label>
                        <Input
                            placeholder="请输入大类编号"
                            value = {enterpriseWorkCategoryCode}
                            onChange={this.handleChange.bind(this, 'enterpriseWorkCategoryCode')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">是否与项目有关</label>
                        <Select defaultValue="" style={{width:100}}
                         onChange={this.handleChangeSelect.bind(this, 'isRelateInvestigation')}
                        >   
                            <Option value="">请选择</Option>                            
                            <Option value="1">是</Option>
                            <Option value="0">否</Option>
                        </Select>
                    </div>

                    <Button type="primary filter-search-btn" icon="search" onClick={this.search}>搜索</Button>
                    {/*<Button type="primary" onClick={this.reset}>重置</Button>*/}
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
