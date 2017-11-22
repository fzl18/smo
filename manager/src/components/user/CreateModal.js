import React, { Component } from 'react';
import $ from '../../common/AjaxRequest';
import { Form, Input, Modal, Button, Select, message,Radio } from 'antd';
import API_URL from '../../common/url';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class CreateForm extends Component {

    state = {
        bdValue: '',
        users:[],
        ent:[],
    };

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }


    componentDidMount(){
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        return (
            <div className="create-form">
                <Form>
                    <div className="field-max">
                        <FormItem label="用户名">
                            {
                                getFieldDecorator('userName', {
                                    rules: [
                                        { required: true, message: '用户名不能为空' },
                                        { max: 30, message: '用户名最多18个字符' },
                                    ],
                                })(<Input placeholder="请输入用户名" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="密码">
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        { required: true, message: '密码不能为空' },
                                        { max: 30, message: '密码最多18个字符' },
                                    ],
                                })(<Input placeholder="请在此输入密码" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="确认密码">
                            {
                                getFieldDecorator('rePassword', {
                                    rules: [
                                        { required: true, message: '确认密码不能为空' },
                                        { max: 30, message: '确认密码最多18个字符' },
                                    ],
                                })(<Input placeholder="请输入确认密码" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="姓名">
                            {
                                getFieldDecorator('userCompellation', {
                                    rules: [
                                        { required: true, message: '姓名不能为空' },
                                        { max: 30, message: '姓名最多30个字符' },
                                    ],
                                })(<Input placeholder="请输入姓名" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="手机">
                            {
                                getFieldDecorator('userMobile', {
                                    rules: [
                                        { required: true, message: '手机不能为空' },
                                    ],
                                })(<Input placeholder="请输入手机" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="邮箱">
                            {
                                getFieldDecorator('userEmail', {
                                    rules: [
                                    ],
                                })(<Input placeholder="请输入邮箱" />)
                            }
                        </FormItem>
                    </div>
                    
                </Form>
            </div>
        )
    }
}

class CreateModal extends Component {

    state = {
        visible: false,
        confirmLoading: false,
    };

    show = record => {
        this.setState({
            visible: true,
        });      
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
            if(fieldsValue.password != fieldsValue.rePassword){
                message.error('两次输入密码不一致');
                return;
            }
            this.setState({ confirmLoading: true });
            const options ={
                method: 'POST',
                url: `${API_URL.entmanager.addEnterpriseManagerUser}`,
                data: fieldsValue,
                dataType: 'json',
                doneResult: (data => {
                    this.setState({ confirmLoading: false });
                    message.success('添加成功')
                    this.props.reload();
                    this.hide();
                }),errorResult: ( data =>{
                    this.setState({ confirmLoading: false });
                }),
            }
            $.sendRequest(options);
        });
    }

    render() {
        const { confirmLoading, visible } = this.state;
        const mapPropsToFields = () => ({
        });
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        return (
            <Modal
                title={'添加用户'}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                confirmLoading={confirmLoading}
            >
                <CreateForm ref="form" />
            </Modal>

        );
    }
}

export default CreateModal;
