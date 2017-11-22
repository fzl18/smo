import React from 'react';
import { Button, Input, Select, Icon } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class Filter extends React.Component {

    state = {
        investigationCode: '',
        investigationName: '',
        area: '',
        sponsor: '',
        conAmount: '',
        conAmountSymbol: 'GreatThan',
        sitePlan: '',
        sitePlanSymbol: 'GreatThan',
        bd:'',
        investigationJdeContractCode: '',
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
            investigationCode,
            investigationName,
            area,
            sponsor,
            conAmountSymbol,
            conAmount,
            sitePlan,
            sitePlanSymbol,
            bd,
            status,
            investigationJdeContractCode,
        } = this.state;

        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目名称</label>
                        <Input
                            placeholder=""
                            value={investigationName}
                            onChange={this.handleChange.bind(this, 'investigationName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目编号</label>
                        <Input
                            placeholder=""
                            value={investigationCode}
                            onChange={this.handleChange.bind(this, 'investigationCode')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">JDE主项目号</label>
                        <Input
                            placeholder=""
                            value={investigationJdeContractCode}
                            onChange={this.handleChange.bind(this, 'investigationJdeContractCode')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>                      
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目领域</label>
                        <Input
                            placeholder=""
                            value={area}
                            onChange={this.handleChange.bind(this, 'area')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">申办方</label>
                        <Input
                            placeholder=""
                            value={sponsor}
                            onChange={this.handleChange.bind(this, 'sponsor')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">合同额</label>
                        <InputGroup compact>
                            <Select defaultValue={conAmountSymbol} onChange={this.handleChangeSelect.bind(this, 'conAmountSymbol')}>
                                <Option value="GreatThan">&gt;</Option>
                                <Option value="NotLess">&ge;</Option>
                                <Option value="LessThan">&lt;</Option>
                                <Option value="NotGreat">&le;</Option>
                                <Option value="Equals">=</Option>
                            </Select>
                            <Input
                                placeholder=""
                                value={conAmount}
                                onChange={this.handleChange.bind(this, 'conAmount')}
                                onKeyPress={this.enterSearch}
                            />
                        </InputGroup>
                        <label style={{verticalAlign:"middle"}} className="ui-label">元</label>
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">BD</label>
                        <Input
                            placeholder=""
                            value={bd}
                            onChange={this.handleChange.bind(this, 'bd')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">计划中心数</label>
                        <InputGroup compact>
                            <Select defaultValue={sitePlanSymbol} onChange={this.handleChangeSelect.bind(this, 'sitePlanSymbol')}>
                                <Option value="GreatThan">&gt;</Option>
                                <Option value="NotLess">&ge;</Option>
                                <Option value="LessThan">&lt;</Option>
                                <Option value="NotGreat">&le;</Option>
                                <Option value="Equals">=</Option>
                            </Select>
                            <Input
                                placeholder=""
                                value={sitePlan}
                                onChange={this.handleChange.bind(this, 'sitePlan')}
                                onKeyPress={this.enterSearch}
                            />
                        </InputGroup>
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目状态</label>
                        <Select onChange={this.handleChangeSelect.bind(this, 'status')} style={{width:90}}>
                            <Option value="">请选择</Option>
                            <Option value="DISCUSSING">洽谈中</Option>
                            <Option value="PREPARING">准备中</Option>
                            <Option value="UNDERWAY">进行中</Option>
                            <Option value="COMPLETED">已完成</Option>
                        </Select>
                    </div>
                    <Button type="primary filter-search-btn" icon="search" onClick={this.search}>搜索</Button>
                    {/* <Button type="primary" onClick={this.reset}>重置</Button> */}
                    <Button type="primary" className="add-btn" onClick={this.showCreateModal}>
                        <Icon type="plus" className="add-btn-icon" />
                        添 加
                    </Button>
                </div>
            </div>
        );
    }
}

export default Filter;
