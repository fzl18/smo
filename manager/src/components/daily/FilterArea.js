import React from 'react';
import { Button, Input, Select, Icon } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class Filter extends React.Component {

    state = {
        areaName: '',
        regionName: '',
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
    getParams = () => {
        return( {...this.state} )
    }

    render() {
        const {
            regionName,
            areaName,
        } = this.state;

        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">大区名称</label>
                        <Input
                            placeholder="请输入大区名称"
                            value={areaName}
                            onChange={this.handleChange.bind(this, 'areaName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">包含省份</label>
                        <Input
                            placeholder="请输入省份"
                            value={regionName}
                            onChange={this.handleChange.bind(this, 'regionName')}
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
