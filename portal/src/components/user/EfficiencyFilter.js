import React from 'react';
import { Button, Input, Select } from 'antd';
import SelectCitys from '../common/SelectCitys';

const InputGroup = Input.Group;
const Option = Select.Option;


class EfficiencyFilter extends React.Component {

    state = {
        employeeCode:'',
        userCompellation:'',
        positionName:'',
        enterpriseDepartmentName:'',
        regionName:'',
        dimissionStatus:'',
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

    handleSelectCity = (field,id,selectedOptions) => {
        this.setState({
            [field]: selectedOptions.label,
        });
    }

    render() {
        const {
            employeeCode,
            userCompellation,
            positionName,
            enterpriseDepartmentName,
            regionName,
            dimissionStatus,
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
                        <label htmlFor="" className="ui-label">工作城市</label>
                        <SelectCitys 
                            ChangeSelect={this.handleSelectCity.bind(this, 'hospitalCity')}
                            ChangeSelectprovinces={this.handleSelectCity.bind(this, 'hospitalProvince')}              
                        />
                    </div> 
                    <Button type="primary" icon="search" onClick={this.search}>搜索</Button>
                    <Button type="primary" icon="search" onClick={this.search}>导出</Button>
                </div>
            </div>
        );
    }
}

export default EfficiencyFilter;
