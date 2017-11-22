import React, { Component } from 'react';
import { Form, Input, Modal, Button, Select, message, Icon, AutoComplete } from 'antd';
import { connect } from 'react-redux';
// import jsonp from 'fetch-jsonp';
import querystring from 'querystring';
import store from '../../store';
import API_URL from '../../common/url';
import common from '../../common/common';
import $ from '../../common/XDomainJquery';
import Fetch from '../../common/FetchIt';


const FormItem = Form.Item;
const Option = Select.Option;


let timeout;
let currentValue;



class CreateForm extends Component {

    constructor() {
        super();
        this.state = {
            hospital:[],
            hospitalName:"",
            hospitalId:0
        };
    }

     loadAllHospitalData = () => {
        $.ajax({
                method: 'GET',
                url: `${API_URL.hospital.listhospitals}`,
            }).done( data => {
                console.log(data)
                this.setState({
                    hospitalName:data.datas.hospitalName,
                    hospitalId:data.datas.hospitalId
                })
            })
        
    }    

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }
  

    render() {
        const { getFieldDecorator } = this.props.form;
        const hospitalName = getFieldValue('hospitalName');
        return (
            <div className="create-form">
                <Form>
                    <div className="field-max">
                        <FormItem label="医院名称">
                            {
                                getFieldDecorator('hospitalName', {
                                    rules: [
                                        { required: true, message: '医院名称不能为空' }
                                    ],
                                })(<SearchInput
                                    placeholder="请输入医院名称" 
                                    hospitalName={hospitalName}
                                    setFieldsValue={this.setFieldsValue}
                                    />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="备注">
                            {
                                getFieldDecorator('remark', {
                                    rules: [
                                        
                                    ],
                                })(<Input type="textarea" rows={4} style={{ width: 280 }} />)
                            }
                        </FormItem>                        
                    </div>
                </Form>
            </div>
        );
    }
}




class SearchInput extends React.Component {
  state = {
    data: [],
    value: '',    
  }

fetch = () => {  
    $.ajax({
        method: 'GET',
        url: `${API_URL.hospital.listhospitals}`,
    }).done( d => {
        this.setState({
            data:d.datas
        })
    })    
}

handleChange = (value) => {
    this.setState({
        value:value
    })
    console.log(value)
  }
onFocus =() =>{
    this.fetch()
}
  render() {
    const options = this.state.data.map(d => <Option key={d.hospitalId} value={d.hospitalName}>{d.hospitalName}</Option>);
    return (
      <Select
        mode="combobox"
        value={this.state.value}
        placeholder={this.props.placeholder}
        notFoundContent="请输入医院名称"
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onFocus={this.onFocus}
        onChange={this.handleChange}
      >
        {options}
      </Select>
    );
  }
}





class CreateModal extends Component {

    state = {
        visible: false,
    };

    show = id => {
        this.setState({
            visible: true,
        });
        if (id) {
            this.loadData(id);
        }
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };
    /**
     * 获取项目详细信息
     * @param id
     */
    loadData = id => {
        $.ajax({
            method: 'get',
            url: `${API_URL.hospital.list}`,
            data: {
                enterpriseId:1,
                offset: 1,
                limit: 15,
                ...params,
            },
            type: 'json',
        }).done(data => {
            this.setState({
                daily: data.data,
            });
        });
    }

    // 提交表单
    handleSubmit = () => {
        this.refs.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
                const fieldsValue = this.refs.form.getFieldsValue();
                fieldsValue.enterpriseId = 1;
                $.ajax({
                    method: 'POST',
                    url: `${API_URL.hospital.create}`,
                    data: fieldsValue,
                }).done( data => {
                    this.hide()                
                })
            })

            // Fetch.post(API_URL.hospital.create, { body: JSON.stringify(fieldsValue) }).then(() => {
            //     console.log(1111)
            //     // message.success('报名成功!');
            //     this.hide();
            // });
            

    }

    render() {
        CreateForm = Form.create()(CreateForm);
        return (
            <Modal
                title="添加医院"
                visible={this.state.visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="450px"
            >
                <CreateForm ref="form" />
            </Modal>

        );
    }
}

export default CreateModal;
