import React from 'react';
import $ from '../../common/XDomainJquery';
import API_URL from '../../common/url';
import SelectCitys from '../common/SelectCitys';
import { Button, Input, Select } from 'antd';
const InputGroup = Input.Group;
const Option = Select.Option;

let city=""
class DoctorFilter extends React.Component {
    state = {
        hospitalName:'',
        departmentName:'',
        userCompellation:'',
        userMobile:'',     
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
            departmentName,
            userCompellation,
            userMobile,
        } = this.state;

        this.props.reload({ 
            hospitalName,
            departmentName,
            userCompellation,
            userMobile, },"search");
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
        this.getCity(value)
        // setTimeout(()=>{
        //     city = this.state.cityData.map(city => city.regionName);
        //     this.setState({
        //         city: city,
        //     });
        // },100)
        
    }
    handleCityChange = (value) => {
        this.setState({
            cityId: value,
            city:value,
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
            departmentName,
            userCompellation,
            userMobile,
        } = this.state;
       
        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">医院</label>
                        <Input
                            placeholder="请输入医院名称"
                            value={hospitalName}
                            onChange={this.handleChange.bind(this, 'hospitalName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>                   
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">科室</label>
                        <Input
                            placeholder="请输入科室"
                            value={departmentName}
                            onChange={this.handleChange.bind(this, 'departmentName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">医生姓名</label>
                        <Input
                            placeholder="请输入医院名称"
                            value={userCompellation}
                            onChange={this.handleChange.bind(this, 'userCompellation')}
                            onKeyPress={this.enterSearch}
                        />
                    </div> 
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">手机号码</label>
                        <Input
                            placeholder="请输入手机号码"
                            value={userMobile}
                            onChange={this.handleChange.bind(this, 'userMobile')}
                            onKeyPress={this.enterSearch}
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

export default DoctorFilter;
