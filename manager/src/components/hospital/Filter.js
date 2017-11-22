import React from 'react';
import $ from '../../common/XDomainJquery';
import API_URL from '../../common/url';
import { Button, Input, Select, Icon } from 'antd';
const InputGroup = Input.Group;
const Option = Select.Option;

let city=""
class Filter extends React.Component {

    state = {
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
        const {
            hospitalName,
            hospitalLevel,
            hospitalCity,
            hospitalProvince,
        } = this.state;

        this.props.reload({ hospitalName, hospitalLevel, hospitalCity, hospitalProvince},"search");
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
        if(value ==''){
            this.setState({
                cityData:[],
            })
        }
        if(value!==''){
            this.getCity(value.key)
            this.setState({
                hospitalProvince:value.label,
                hospitalCityId:''
            })
        }        
    }
    handleCityChange = (value) => {
        this.setState({
            hospitalCity:value,
        });
        console.log(value)
        
    }
    componentWillMount () {
        this.getCity()
        
    }
    componentDidUpdate () {
        
    }
    render() {
        const {
            hospitalName,
            hospitalLevel,
            hospitalCityId,
            hospitalProvince,
            hospitalCity,
        } = this.state;
        const provinceOptions = this.state.provinceData.map(province => <Option key={province.regionId}>{province.regionName}</Option>);
        const cityOptions = this.state.cityData.map(city => <Option key={city.regionName} >{city.regionName}</Option>);
        
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
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">等级</label>
                        <Select 
                            style={{width:120}}
                            onChange={this.handleChangeSelect.bind(this, 'hospitalLevel')}
                            onKeyPress={this.enterSearch}
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
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">省</label>
                        <Select labelInValue style={{ width: 80 }} onChange={this.handleProvinceChange} value={{key:hospitalProvince}}>
                            <Option value=''>请选择</Option>
                            {provinceOptions}
                        </Select>
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">市</label>
                        <Select style={{ width: 100 }} onChange={this.handleCityChange} value={hospitalCity}>
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
