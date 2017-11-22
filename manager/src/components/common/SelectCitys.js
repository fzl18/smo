import React, { Component } from 'react';
import $ from '../../common/AjaxRequest';
import { Form, Input, Modal, Button, Select, message,Cascader} from 'antd';
import API_URL from '../../common/url';

class SelectCitys extends React.Component {
  state = {
    inputValue: '',
    provinceData:[],
  };
  //得到城市列表
    getCity = ( parentId = 0 ) => {
        const options ={
            method: 'POST',
            url: `${API_URL.common.arealist}`,
            data: {
                parentId:parentId,
            },
            dataType: 'json',
            doneResult: data => {
                if(parentId == 0 ){
                    const provinces = data.datas.map(d => ({
                        value: d.regionId,
                        label: d.regionName,
                        parentId: d.parentId,
                        isLeaf: false,
                    }));
                    this.setState({
                        provinces,
                    });
                }            
            }
        }
        $.sendRequest(options)
    }


  onChange = (value, selectedOptions) => {
    // console.log(value, selectedOptions)
    if(value[0]){
        this.props.ChangeSelectprovinces(value[0],selectedOptions[0])
    }
    if(value[1]){
        this.props.ChangeSelect(value[1],selectedOptions[1])
    }
  }
  
  loadData = (selectedOptions) => {
    // const label = selectedOptions[0].label
    // const value = selectedOptions[0].value
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // console.log(targetOption)
    targetOption.loading = true;
    //拉城市信息列表
    const options ={
            method: 'POST',
            url: `${API_URL.common.arealist}`,
            data: {
                parentId:targetOption.value,
            },
            dataType: 'json',
            doneResult:data => {
                const cityData = data.datas
                targetOption.loading = false;
                targetOption.children = cityData.map(d => ({
                    label: d.regionName,
                    value: d.regionId,
                }));
                this.setState({
                    provinces: [...this.state.provinces],
                });
            }
        }
        $.sendRequest(options)
  }

  componentWillMount(){
      this.getCity()
  }


  render() {
    const { provinces, inputValue } = this.state;
    return (
      <Cascader        
        placeholder="请选择"
        options={provinces}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
        style={this.props.style}
      />
    );
  }
}

export default SelectCitys;