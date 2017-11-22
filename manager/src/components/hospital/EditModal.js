import React, { Component } from 'react';
import { Form, Input, Modal, Button, Select, message, Icon } from 'antd';
import { connect } from 'react-redux';
import store from '../../store';
import API_URL from '../../common/url';
import common from '../../common/common';
import $ from '../../common/XDomainJquery';

const FormItem = Form.Item;
const Option = Select.Option;


let timeout;
let currentValue;


const CollectionCreateForm = Form.create()(FormModal);

class FormModal extends React.Component{
    state = {
        visible: false,
    };
    showModal = () => {
        this.setState({ visible: true });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
        if (err) {
            return;
        }

        console.log('Received values of form: ', values);
        form.resetFields();
        this.setState({ visible: false });
        });
    }
    saveFormRef = (form) => {
        this.form = form;
    }
    
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="create-form">
                <Form>
                    <div className="field-max">
                        <FormItem label="医院名称">
                            {
                                getFieldDecorator('hospitalName')(<Input value={this.state.hospitalName} style={{width: 280}} />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="备注">
                            {
                                getFieldDecorator('remark')(<Input type="textarea" rows={4} style={{ width: 280}} value={this.state.remark}/>)
                            }
                        </FormItem>
                    </div>
                </Form>
            </div>
        )
    }    
}




class EditModal extends React.Component {

    state = {
        visible: false,
        hospitalName :"",
        remark:''
    };

    loadData = (id) => {

        $.ajax({
                method: 'POST',
                url: `${API_URL.hospital.list}?applicationId=1&enterpriseId=1&hospitalId=${id}`,
                // data: fieldsValue,
            }).done( data => {
                this.setState({
                    hospitalName:data.datas.hospitalName,
                    remark:data.datas.remark
                })
            })


        // Fetch.get(`${API_URL.hospital.updata}?hospitalId=${id}`).then(data => {
        //     this.setState({
        //         hospital: data.datas,
        //     });
        // });
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

    // 提交表单
    handleSubmit = () => {
        this.refs.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }

            const fieldsValue = this.refs.form.getFieldsValue();

            fieldsValue.enterpriseId = 1;
            fieldsValue.bdUserId = 3;

            $.ajax({
                method: 'POST',
                url: $`${API_URL.hospital.updata}?hospitalId=${id}`,
                data:{hospitalName:hospitalName},
            }).done(() => {
                console.log("备注修改成功")
                // message.success('备注修改成功!');
                this.hide();
            })

        });
    }

    render() {       
        
        return (
            <Modal
                title="修改备注"
                visible={this.state.visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="450px"
            >
                
                <CollectionCreateForm />


            </Modal>

        );
    }
}

export default EditModal;
