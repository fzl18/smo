import React from 'react';
import { Button, Input, Select, Icon } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class Filter extends React.Component {

    state = {
        enterpriseDepartmentName: '',
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
            enterpriseDepartmentName,
            investigationName,
        } = this.state;

        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">部门名称</label>
                        <Input
                            placeholder="请输入部门名称"
                            value={enterpriseDepartmentName}
                            onChange={this.handleChange.bind(this, 'enterpriseDepartmentName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>                   

                    <Button type="primary filter-search-btn" icon="search" onClick={this.search}>搜索</Button>
                    
                </div>
            </div>
        );
    }
}

export default Filter;
