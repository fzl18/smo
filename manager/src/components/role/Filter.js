import React from 'react';
import { Button, Input, Select, Icon } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class Filter extends React.Component {

    state = {
        roleName: '',
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
            roleName,
        } = this.state;

        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">角色名称</label>
                        <Input
                            placeholder="请输入角色名称"
                            value={roleName}
                            onChange={this.handleChange.bind(this, 'roleName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div><Button type="primary filter-search-btn" icon="search" onClick={this.search}>搜索</Button>
                    {/*<Button className="add-btn" type="primary" onClick={this.showCreateModal}>添加</Button>*/}
                </div>
            </div>
        );
    }
}

export default Filter;
