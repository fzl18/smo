import React from 'react';
import $ from '../../common/XDomainJquery';
import API_URL from '../../common/url';
import { Button, Input, Select, Icon } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;


class ViewFilter extends React.Component {

    state = {
        roleCode:'',
        enterpriseWorkTypeCode:'',
        enterpriseWorkTypeName:'',
        isCalculateFtePay:'',
        RoleCodes:[],
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

    clickBack = () => {
     
            location.href = `#/daily `;
        }



    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    }

    reset = () => {
        this.props.reset();
    }
    loadRoleCodes = () =>{
        $.ajax({
            method: 'GET',
            url:`${API_URL.daily.RoleCodes}`,
        }).done( data => {            
            this.setState({
                RoleCodes: data.data,
            });
        });
    }
    componentWillMount(){
        this.loadRoleCodes()
    }
    render() {
        const {
            roleCode,
            enterpriseWorkTypeCode,
            enterpriseWorkTypeName,
            isCalculateFtePay,
        } = this.state;
        const options = this.state.RoleCodes.map(d => <Option key={d}>{d}</Option>);
        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">适用角色 </label>
                        <Select
                            defaultValue=""
                            onChange={this.handleChangeSelect.bind(this, 'roleCode')}
                            onKeyPress={this.enterSearch}
                            style={{width:120}}
                        >   
                            <Option value=''>请选择</Option>
                            {options}
                        </Select>
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">工作类型编号 </label>
                        <Input style={{width:'55%'}}
                            placeholder="请输入工作类型编号"
                            value={enterpriseWorkTypeCode}
                            onChange={this.handleChange.bind(this, 'enterpriseWorkTypeCode')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">工作类型名称 </label>
                        <Input style={{width:'55%'}}
                            placeholder="请输入工作类型名称"
                            value={enterpriseWorkTypeName}
                            onChange={this.handleChange.bind(this, 'enterpriseWorkTypeName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">是否计算FTE津贴 </label>
                        <Select 
                            defaultValue="请选择"
                            style={{width:90}}
                            onChange={this.handleChangeSelect.bind(this, 'isCalculateFtePay')}
                            onKeyPress={this.enterSearch}
                        >
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
                    <Button type="primary" onClick={this.clickBack}><Icon type="left" />返回</Button>
                </div>
            </div>
        );
    }
}

export default ViewFilter;
