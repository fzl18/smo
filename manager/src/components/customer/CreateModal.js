import React, { Component } from 'react';
import $ from '../../common/AjaxRequest';
import { Form, Input, Modal, Button, Select, message } from 'antd';
import API_URL from '../../common/url';

const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 搜索企业用户
 */

let timeout;
let currentValue;

// function fetch(value, callback) {
//     if (timeout) {
//         clearTimeout(timeout);
//         timeout = null;
//     }
//     currentValue = value;

//     function fake() {
//         $.ajax({
//             method: 'get',
//             url: `${API_URL.customer.queryUserByKey}?enterpriseId=1&key=${value}`,
//         }).done(dt => {
//             const d = dt.data;
//             if (currentValue === value) {
//                 const result = d.userList;
//                 const data = [];
//                 result.forEach(r => {
//                     data.push({
//                         value: r.userCompellation,
//                         text: r.userCompellation,
//                     });
//                 });
//                 callback(data);
//             }
//         });
//     }

//     timeout = setTimeout(fake, 300);
// }

// class SearchInput extends React.Component {
//     state = {
//         data: [],
//         value: '',
//     };

//     handleChange = value => {
//         this.setState({ value });
//         fetch(value, data => this.setState({ data }));
//     }

//     handleBlur = value => {
//         this.props.setFieldsValue({ userCompellation: value });
//     }

//     render() {
//         const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
//         return (
//             <Select
//                 mode="combobox"
//                 value={this.state.value}
//                 placeholder={this.props.placeholder}
//                 notFoundContent=""
//                 style={this.props.style}
//                 defaultActiveFirstOption={false}
//                 showArrow={false}
//                 filterOption={false}
//                 onChange={this.handleChange}
//                 onBlur={this.handleBlur}
//             >
//                 {options}
//             </Select>
//         );
//     }
// }





class CreateForm extends Component {

    state = {
        userCompellation: '',
    };

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const userId = getFieldValue('userId');
        return (
            <div className="create-form">
                <Form>
                    <div className="field-max">
                        <FormItem label="姓名">
                            {
                                getFieldDecorator('userCompellation', {
                                    rules: [
                                        { required: true, message: '姓名不能为空' },
                                        // { max: 8, message: '姓名最多4个字' },
                                    ],
                                })(<Input placeholder="请在此输入姓名" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="手机">
                            {
                                getFieldDecorator('userMobile', {
                                    rules: [
                                        { required: true, message: '号码不能为空' },
                                        { pattern:/^1(3|4|5|7|8)\d{9}$/, message: '必须是11位的手机号' },
                                    ],
                                })(<Input placeholder="请在此输入手机号" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="固定电话">
                            {
                                getFieldDecorator('userTelphone',{
                                    rules:[
                                        { pattern:/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/, message: '必须是固定电话格式' },                                        
                                    ]
                                })(<Input placeholder="请在此输入固话" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="邮箱">
                            {
                                getFieldDecorator('userEmail',{
                                    rules:[
                                        { pattern:/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, message: '必须电子邮箱格式' },                                        
                                    ],
                                }
                                )(<Input placeholder="请在此输入电子邮箱" />)
                            }
                        </FormItem>                        
                    </div>                    
                </Form>
            </div>
        );
    }
}

class CreateModal extends Component {

    state = {
        visible: false,
        confirmLoading: false,
        customer: {},
        isEdit: false,
    };

    show = id => {
        this.setState({
            visible: true,
            isEdit: false,
            customer: {},
        });
        
        if (id) {
            this.loadData(id);
            this.setState({
                isEdit: true,
                id:id,
            });
            
        }
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    /**
     * 获取修改列表信息
     * @param id
     */
    loadData = id => {

        const options ={
            method: 'get',
            url: `${API_URL.customer.list}?userId=${id}`,
            data: {
                enterpriseId:1,
                offset: 1,
                limit: 15,
                // ...params,
            },
            dataType: 'json',
            doneResult: (data => {
                this.setState({
                    customer: data.customer,
                });
            })
        }
        $.sendRequest(options)


        // $.ajax({
        //     method: 'get',
        //     url: `${API_URL.customer.list}?userId=${id}&enterpriseId=1`,
        // }).done(data => {
        //     this.setState({
        //         customer: data.customer,
        //     });
        // });
    }

    // 提交表单
    handleSubmit = () => {
        this.refs.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            this.setState({ confirmLoading: true });
            const fieldsValue = this.refs.form.getFieldsValue();
            if (this.state.isEdit) {
                fieldsValue.userId = this.state.id;
                fieldsValue.enterpriseId=1
                // 修改
                const options ={
                    method: 'POST',
                    url: API_URL.customer.update,
                    data:fieldsValue,
                    dataType: 'json',
                    doneResult: data => {                    
                        this.setState({ confirmLoading: false });
                        if(data.success){
                            message.success(data.success);
                            this.props.reload();
                            this.hide();
                        }else{
                            message.warn(data.error);
                        }
                    }
                }
                $.sendRequest(options)



                // $.ajax({
                //     method: 'POST',
                //     url: API_URL.customer.update,
                //     data: fieldsValue,
                // }).done(data => {                    
                //     this.setState({ confirmLoading: false });
                //     if(data.success){
                //         message.success(data.success);
                //         this.props.reload();
                //         this.hide();
                //     }else{
                //         message.warn(data.error);
                //     }
                    
                // });
            } else {
                // 新建
                fieldsValue.enterpriseId = 1;
                const options ={
                    method: 'POST',
                    url: API_URL.customer.create,
                    data:fieldsValue,
                    dataType: 'json',
                    doneResult: (data => {
                        this.setState({ confirmLoading: false });
                        if(data.success){
                            message.success(data.success);
                            this.props.reload();
                            this.hide();
                        }else{
                            message.warn(data.error);
                        }
                    })
                }
                $.sendRequest(options)


                // $.ajax({
                //     method: 'POST',
                //     url: API_URL.customer.create,
                //     data: fieldsValue,
                // }).done(data => {
                //     this.setState({ confirmLoading: false });
                //     if(data.success){
                //         message.success(data.success);
                //         this.props.reload();
                //         this.hide();
                //     }else{
                //         message.warn(data.error);
                //     }
                // });
            }
        });
    }
    componentDidMount() {
        
    }
    render() {
        const { confirmLoading, visible, customer, isEdit } = this.state;
        // console.log(customer)
        const mapPropsToFields = () => ({
            userCompellation: { value: customer.userCompellation },
            userTelphone: { value: customer.userTelphone },
            userId: { value: customer.userId },
            userMobile: { value: customer.userMobile },
            userEmail: { value: customer.userEmail },
        });
        // console.log(mapPropsToFields())
        // console.log(this.state.customer.userCompellation)
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        return (
            <Modal
                title={isEdit ? '修改记录' : '添加记录'}
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
