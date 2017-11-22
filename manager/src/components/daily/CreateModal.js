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
//             url: `${API_URL.daily.queryUserByKey}?enterpriseId=1&key=${value}`,
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
//         this.props.setFieldsValue({ bdUsers: value });
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
        bdValue: '',
    };

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const isRelateInvestigation = getFieldValue('isRelateInvestigation');
        return (
            <div className="create-form">
                <Form>
                    <div className="field-max">
                        <FormItem label="大类名称">
                            {
                                getFieldDecorator('enterpriseWorkCategoryName', {
                                    rules: [
                                        { required: true, message: '大类名称不能为空' },                                        
                                    ],
                                })(<Input placeholder="请在此输入大类名称" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="大类编号">
                            {
                                getFieldDecorator('enterpriseWorkCategoryCode', {
                                    rules: [
                                        { required: true, message: '大类名称不能为空' },                                       
                                    ],
                                })(<Input placeholder="请在此输入大类编号" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="是否与项目有关">
                            {
                                getFieldDecorator('isRelateInvestigation', {
                                    initialValue:"1", 
                                    rules:[
                                        {required:true,message:'不可为空'}
                                    ]
                                })(
                                    <Select style={{width:60}} setFieldsValue={this.setFieldsValue === 1 ? "是" : "否"}>
                                        <Option value="1">是</Option>
                                        <Option value="0">否</Option>
                                    </Select>
                                )
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
        daily: {},
        isEdit: false,
    };

    show = id => {
        this.setState({            
            visible: true,
            isEdit: false,

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
     * 获取项目详细信息
     * @param id
     */
    loadData = id => {
        const options ={
            method: 'POST',
            url: API_URL.daily.list,
            data: {
                enterpriseId:1,
                enterpriseWorkCategoryId:id,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    daily: data.enterpriseWorkCategory,
                });
            }
        }
        $.sendRequest(options)

    }

    componentDidMount(){
        // console.log(this.state.daily)
    }
    // 提交表单
    handleSubmit = () => {
        this.refs.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            this.setState({ confirmLoading: false });
            const fieldsValue = this.refs.form.getFieldsValue();            
            // fieldsValue.bdUserId = 3;
            if (this.state.isEdit) {
                fieldsValue.enterpriseWorkCategoryId = this.state.id;
                fieldsValue.enterpriseId = 1
                // 修改
                const options ={
                    method: 'POST',
                    url: API_URL.daily.update,
                    data:fieldsValue,
                    dataType: 'json',
                    doneResult: data => {
                        this.setState({ confirmLoading: false });
                        if(data.data.success){
                            message.success(data.data.success);
                            this.props.reload();
                            this.hide();
                        }else{
                            message.warn(data.data.error);
                            this.props.reload();
                            this.hide();
                        }                    
                    }
                }
                $.sendRequest(options)

            } else {
                // 添加
                fieldsValue.enterpriseId = 1;
                const options ={
                    method: 'POST',
                    url: API_URL.daily.create,
                    data: fieldsValue,
                    dataType: 'json',
                    doneResult: data => {
                        this.setState({ confirmLoading: false });
                        message.success('添加成功');
                        this.props.reload();
                        this.hide();
                    }
                }
                $.sendRequest(options)


            }
        });
    }

    render() {
        const { confirmLoading, visible, daily, isEdit } = this.state;
        const mapPropsToFields = () => ({
            isRelateInvestigation: { value: daily.isRelateInvestigation },
            enterpriseWorkCategoryCode:{ value: isEdit ? daily.enterpriseWorkCategoryCode : '' },
            enterpriseWorkCategoryName:{ value: isEdit ? daily.enterpriseWorkCategoryName : '' },
            // bdUsers: { value: daily.bdUsers },
        });
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        return (
            <Modal
                title={isEdit ? '修改大类' : '添加大类'}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="450px"
                confirmLoading={confirmLoading}
            >
                <CreateForm ref="form" />
            </Modal>

        );
    }
}

export default CreateModal;
