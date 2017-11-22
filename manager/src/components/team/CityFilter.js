import React from 'react';
import { Button, Input, Select, Icon } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class Filter extends React.Component {

    state = {
            employeeCode:'',
            userCompellation:'',
            cityName:'',
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

    getSearchParams=()=>{
        return {...this.state}
    }
    reset = () => {
        this.props.reset();
    }

    render() {
        const {
            employeeCode,
            userCompellation,
            cityName,
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
                        <label htmlFor="" className="ui-label">分管城市</label>
                        <Input
                            placeholder="请输入分管城市"
                            value={cityName}
                            onChange={this.handleChange.bind(this, 'cityName')}
                            onKeyPress={this.enterSearch}
                        />
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
