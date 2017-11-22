import React from 'react';
import $ from 'jquery';
import API_URL from '../../common/url';
import SelectCitys from '../common/SelectCitys';
import { Button, Input, Select } from 'antd';
const InputGroup = Input.Group;
const Option = Select.Option;

let city=""
class Filter extends React.Component {

    state = {
        hospitalName:'',
        hospitalLevel:'',
        hospitalProvince:'',
        hospitalCity:'',
        departmentName:'',
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

    handleSelectCity = (field,id,selectedOptions) => {
        console.log(selectedOptions.label)
        this.setState({
            hospitalCity:'',
        });
        this.setState({
            [field]: selectedOptions.label,
        });
    }

    clear = () => {
        this.setState({
            hospitalCity:'',
            hospitalProvince:'',
        });
    }

    search = () => {
        const { sortParams } = this.props;
        const {
            hospitalName,
            hospitalLevel,
            hospitalProvince,
            hospitalCity,
            departmentName,
        } = this.state;

        this.props.reload({ hospitalName, hospitalLevel, hospitalProvince,hospitalCity,departmentName },"search");
    }

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    }

    reset = () => {
        this.props.reset();
    }

    // getCity = ( parentId = 0 )=>{
    //     $.ajax({
    //         method: 'GET',
    //         url:`${API_URL.common.arealist}?parentId=${parentId}`,
    //     }).done( data => {
    //         if(parentId == 0 ){
    //             this.setState({
    //                 provinceData: data.datas,
    //             });
    //         }else{
    //             this.setState({
    //                 cityData: data.datas,
    //             },()=>{
    //                 city = this.state.cityData.map(city => city.regionName);
    //                 this.setState({
    //                     city: city,
    //                 });
    //             });
    //         }
            
    //     });
    // }

    // handleProvinceChange = (value) => {
    //     this.getCity(value)
        // setTimeout(()=>{
        //     city = this.state.cityData.map(city => city.regionName);
        //     this.setState({
        //         city: city,
        //     });
        // },100)
        
    // }
    // handleCityChange = (value) => {
    //     this.setState({
    //         cityId: value,
    //         city:value,
    //     });
    //     console.log(value)
        
    // }
    componentWillMount () {
        // this.getCity()        
    }
    componentDidUpdate () {
        
    }
    render() {
        const {
            hospitalName,
            hospitalLevel,
            hospitalProvince,
            hospitalCity,
            departmentName,
        } = this.state;
       
        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">医院名称</label>
                        <Input
                            placeholder="请输入医院名称"
                            value={hospitalName}
                            onChange={this.handleChange.bind(this, 'hospitalName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    { this.props.type ?
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">等级</label>
                        <Select                             
                            style={{width:120}}
                            onChange={this.handleChangeSelect.bind(this, 'hospitalLevel')}
                            onKeyPress={this.enterSearch}
                            defaultValue=""
                        >
                            <Option value="">请选择</Option>
                            <Option value="三级甲等">三级甲等</Option>
                            <Option value="三级乙等">三级乙等</Option>
                            <Option value="三级丙等">三级丙等</Option>
                            <Option value="二级甲等">二级甲等</Option>
                            <Option value="二级乙等">二级乙等</Option>
                            <Option value="二级丙等">二级丙等</Option>
                            <Option value="一级甲等">一级甲等</Option>
                            <Option value="一级乙等">一级乙等</Option>
                            <Option value="一级丙等">一级丙等</Option>
                            <Option value="其它">其它</Option>
                        </Select>
                    </div>
                    :
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">科室</label>
                        <Input
                            placeholder="请输入科室"
                            value={departmentName}
                            onChange={this.handleChange.bind(this, 'departmentName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    }
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">省或市</label>
                        <SelectCitys 
                            clear={this.clear}
                            ChangeSelect={this.handleSelectCity.bind(this, 'hospitalCity')}                        
                            ChangeSelectprovinces={this.handleSelectCity.bind(this, 'hospitalProvince')}                        
                        />
                    </div>
                    <div className="form-item">                 
                    <Button type="primary" onClick={this.search}>搜索</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Filter;
