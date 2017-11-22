import React from 'react';
import { Button, Input, Select } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class Filter extends React.Component {

    state = {
        investigationCode: '',
        investigationName: '',
        area: '',
        sponsor: '',
        conAmount: '',
        conAmountSymbol: 'NotLess',
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
            investigationCode,
            investigationName,
            area,
            sponsor,
            conAmountSymbol,
            conAmount,
            bdUser,
            status,
            sitePlan,
        } = this.state;

        return (
            <div className="filter-bar">
                
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目编号</label><br/>
                        <Input
                            placeholder="请输入项目编号"
                            value={investigationCode}
                            onChange={this.handleChange.bind(this, 'investigationCode')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目名称</label><br/>
                        <Input
                            placeholder="请输入项目名称"
                            value={investigationName}
                            onChange={this.handleChange.bind(this, 'investigationName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目领域</label><br/>
                        <Input
                            placeholder="请输入项目领域"
                            value={area}
                            onChange={this.handleChange.bind(this, 'area')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">申办方</label><br/>
                        <Input
                            placeholder="请输入申办方"
                            value={sponsor}
                            onChange={this.handleChange.bind(this, 'sponsor')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">累计FTE消耗比</label><br/>
                        <InputGroup compact>
                            <Select defaultValue={conAmountSymbol} onChange={this.handleChangeSelect.bind(this, 'conAmountSymbol')}>
                                <Option value="GreatThan">&gt;</Option>
                                <Option value="NotLess">&ge;</Option>
                                <Option value="LessThan">&lt;</Option>
                                <Option value="NotGreat">&le;</Option>
                                <Option value="Equals">=</Option>
                            </Select>
                            <Input
                                placeholder="请输FTE消耗"
                                value={conAmount}
                                onChange={this.handleChange.bind(this, 'conAmount')}
                                onKeyPress={this.enterSearch}
                            />
                        </InputGroup>
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">合同额</label><br/>
                        <InputGroup compact>
                            <Select defaultValue={conAmountSymbol} onChange={this.handleChangeSelect.bind(this, 'conAmountSymbol')}>
                                <Option value="GreatThan">&gt;</Option>
                                <Option value="NotLess">&ge;</Option>
                                <Option value="LessThan">&lt;</Option>
                                <Option value="NotGreat">&le;</Option>
                                <Option value="Equals">=</Option>
                            </Select>
                            <Input
                                placeholder="请输入合同额"
                                value={conAmount}
                                onChange={this.handleChange.bind(this, 'conAmount')}
                                onKeyPress={this.enterSearch}
                            />
                        </InputGroup>
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">PM</label><br/>
                        <Input
                            placeholder="请输入BD"
                            value={bdUser}
                            onChange={this.handleChange.bind(this, 'bdUser')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目状态</label><br/>
                        <Select onChange={this.handleChangeSelect.bind(this, 'status')} style={{width:90}}>
                            <Option value="">请选择</Option>
                            <Option value="PREPARING">准备中</Option>
                            <Option value="UNDERWAY">进行中</Option>
                            <Option value="COMPLETED">已完成</Option>
                        </Select>
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">计划中心数</label><br/>
                        <Input
                            placeholder="请输入中心数"
                            value={sitePlan}
                            onChange={this.handleChange.bind(this, 'sitePlan')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label"></label><br/>
                        <Button type="primary" icon="search" onClick={this.search}>搜索</Button>
                        {/*<Button type="primary" onClick={this.reset}>重置</Button>*/}
                    </div>
                    {/*<Button className="add-btn" size="large" type="ghost" onClick={this.showCreateModal}>添加</Button>*/}
                
            </div>
        );
    }
}

export default Filter;
