import React from 'react';
import $ from '../../common/XDomainJquery';
import API_URL from '../../common/url';
import { Button, Input, Select, Icon } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;
let city=""

class Filter extends React.Component {

    state = {
        hospitalName: '',
        departmentLocalName:'',
        provinceData:[],
        cityData:[],
        hospitalCity:'',
        hospitalProvince:'',
        city:'',
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
        let {hospitalName,departmentLocalName,hospitalCity,hospitalProvince,} = this.state
        if(hospitalProvince =="请选择"){
            hospitalProvince=""
        }
        this.props.reload({ hospitalName,departmentLocalName,hospitalCity,hospitalProvince, ...sortParams},"search");
    }

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    }

    reset = () => {
        this.props.reset();
    }
    getCity = ( parentId = 0 )=>{
        $.ajax({
            method: 'GET',
            url:`${API_URL.common.arealist}?parentId=${parentId}`,
        }).done( data => {
            if(parentId == 0 ){
                this.setState({
                    provinceData: data.datas,
                });
            }else{
                this.setState({
                    cityData: data.datas,
                },()=>{
                    city = this.state.cityData.map(city => city.regionName);
                    this.setState({
                        city: city,
                    });
                });
            }
            
        });
    }
    handleProvinceChange = (value) => {
        if(value =='0'){
            this.setState({
                cityData:[],
            })
        }
        if(value!==''){
            this.getCity(value.key)
            this.setState({
                hospitalProvince:value.label,
                hospitalCity:''
            })
        }
    }
    handleCityChange = (value) => {
        console.log(value)
        this.setState({
            hospitalCity: value,
        });
    }
    componentWillMount () {
        this.getCity()
        
    }
    render() {
        const {
            hospitalName,
            departmentLocalName,
            provinceData,
            cityData
        } = this.state;
        const provinceOptions = provinceData.map(province => <Option key={province.regionId}>{province.regionName}</Option>);
        let cityOptions = cityData.map(city => <Option key={city.regionId} value={city.regionName}>{city.regionName}</Option>);
        
        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">医院</label>
                        <Input
                            placeholder="请输入医院"
                            value={hospitalName}
                            onChange={this.handleChange.bind(this, 'hospitalName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">科室</label>
                        <Input
                            placeholder="请输入科室"
                            value={departmentLocalName}
                            onChange={this.handleChange.bind(this, 'departmentLocalName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">省</label>
                        <Select labelInValue defaultValue= {{key:'0'}} style={{ width: 80 }} onChange={this.handleProvinceChange}>
                            <Option value='0'>请选择</Option>
                            {provinceOptions}
                        </Select>
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">市</label>
                        <Select value = {this.state.hospitalCity} style={{ width: 100 }} defaultValue="" onChange={this.handleCityChange}>
                            <Option value=''>请选择</Option>
                            {cityOptions}
                        </Select>
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
