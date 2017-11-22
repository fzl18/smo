import React, { Component } from 'react';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import { Form, Input, Modal, Button, Select, message,DatePicker } from 'antd';
import API_URL from '../../common/url';
import SelectCitys from './SelectCitys';

const FormItem = Form.Item;
const Option = Select.Option;
// const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD'
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
//             url: `${API_URL.investigation.queryUserByKey}?enterpriseId=1&key=${value}`,
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
    ChangeSelect = value => {
        console.log(value)
        this.setFieldsValue({ workCityId:value})
    }

    ChangeSelectPlaceOfOrigin = value => {
        console.log(value)
        this.setFieldsValue({ placeOfOrigin:value})
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const workBeginTime= moment(getFieldValue('workBeginTime')).format(dateFormat)
        const graduateTime= moment(getFieldValue('graduateTime')).format(dateFormat)
        const city= getFieldValue('cityName')
        const placeOfOriginName= getFieldValue('placeOfOriginName')
        return (
            <div className="create-form">
                <Form>
                    <div className="T-title"><h3>1.员工基本信息</h3><hr/></div>
                    <div className="form-context">                    
                        <div className="field-max">
                            <FormItem label="工号">
                                {
                                    getFieldDecorator('employeeCode', {
                                        rules: [
                                            { required: true, message: '工号不能为空' },
                                        ],
                                    })(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="姓名">
                                {
                                    getFieldDecorator('userCompellation', {
                                        rules: [
                                            { required: true, message: '人名不能为空' },
                                        ],
                                    })(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="职位">
                                {
                                    getFieldDecorator('positionName')(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="主管领导">
                                {
                                    getFieldDecorator('leaderName', {
                                        rules: [
                                        ],
                                    })(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="部门">
                                {
                                    getFieldDecorator('enterpriseDepartmentName')(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="工作城市">
                                {
                                    getFieldDecorator('workCityId', {
                                        rules: [
                                        ],
                                    })(<SelectCitys style={{width:120}} placeholder={city} ChangeSelect={this.ChangeSelect}/>)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="入职时间">
                                {
                                    getFieldDecorator('joinTime', {
                                        rules: [
                                            
                                        ],
                                    }) (<Input disabled /> )
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="状态">
                                {
                                    getFieldDecorator('dimissionStatus', {
                                        rules: [
                                            
                                        ],
                                    })(<Input disabled />)
                                }
                            </FormItem>
                        </div>

                        <div className="T-title"><h3>2.联系方式</h3><hr/></div>
                        <div className="field-max">
                            <FormItem label="手机号码">
                                {
                                    getFieldDecorator('userMobile', {
                                        rules: [
                                            
                                        ],
                                    })(
                                        <Input placeholder="请在此输入手机号码" disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="邮箱">
                                {
                                    getFieldDecorator('userEmail')(<Input disabled />)
                                }
                            </FormItem>
                        </div>


                        <div className="T-title"><h3>3.个人信息</h3><hr/></div>
                        <div className="field-max">
                            <FormItem label="性别">
                                {
                                    getFieldDecorator('gender', {
                                        rules: [
                                        ],
                                    })(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="籍贯">
                                {
                                    getFieldDecorator('placeOfOrigin', {
                                        rules: [
                                        ],
                                    })(
                                        // <Input placeholder="请在此输入籍贯" />
                                        <SelectCitys style={{width:120}} placeholder={placeOfOriginName} ChangeSelect={this.ChangeSelectPlaceOfOrigin}/>
                                      )
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="学历">
                                {
                                    getFieldDecorator('education', {
                                        rules: [
                                        ],
                                    })(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="毕业院校">
                                {
                                    getFieldDecorator('graduate', {
                                        rules: [

                                        ],
                                    })(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="专业">
                                {
                                    getFieldDecorator('subject', {
                                        rules: [

                                        ],
                                    })(<Input placeholder="请在此输入专业" />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="毕业时间">
                                {
                                    getFieldDecorator('graduateTime', {
                                        initialvalue: {graduateTime},                                     
                                        rules: [

                                        ],
                                    })(<DatePicker format={dateFormat} />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="上家公司">
                                {
                                    getFieldDecorator('lastCompany', {
                                        rules: [
                                        ],
                                    })(<Input placeholder="请在此输入上家公司" />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem >
                                <label style={{float:'left',marginLeft:'-110px',color:'rgba(0, 0, 0, 0.85)'}}>从事临床研究起始时间: </label>
                               <div style={{marginLeft:'20px'}} > {
                                    getFieldDecorator('workBeginTime', {
                                        initialvalue:{workBeginTime},
                                        rules: [

                                        ],
                                    })(<DatePicker format={dateFormat}/>)
                                }
                                </div>
                            </FormItem>
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}

class CreateModal extends Component {

    state = {
        visible:false,
        confirmLoading: false,
        investigation: {},
        isEdit: false,
        user:{},
        userDetail:{},
        id:0,
    };

    show = id => {
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
     * 获取个人详细信息
     * @param id
     */
    loadData = id => {
        const options ={
            method: 'POST',
            url: `${API_URL.team.queryuser}`,
            data: {
                enterpriseId:1,
                userId:id,
            },
            dataType: 'json',
            doneResult:data => {
                this.setState({
                    user: data.user,
                    userDetail:data.user.userDetail,
                    isEdit: true,
                    id:id,
                    visible:true,
                });
            }
        }
        $.sendRequest(options)


        // $.ajax({
        //     method: 'get',
        //     url: `${API_URL.team.queryuser}?userId=${id}&enterpriseId=1`,
        // }).done(data => {
        //     this.setState({
        //         user: data.user,
        //         userDetail:data.user.userDetail,
        //     });
        // });
    }

    // componentWillMount(){
    //     this.loadData(this.state.id)
    // }

    // 提交表单
    handleSubmit = () => {
        this.refs.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            this.setState({ confirmLoading: true });
            const fieldsValue = this.refs.form.getFieldsValue();
            console.log(fieldsValue)
            fieldsValue.userId = this.state.id;            
            fieldsValue.enterpriseId = 1;
            if(fieldsValue.graduateTime != null && fieldsValue.graduateTime != ''){
                fieldsValue.graduateTime = fieldsValue.graduateTime.format(dateFormat)
            }
            if (fieldsValue.workBeginTime != null && fieldsValue.workBeginTime != ''){
                fieldsValue.workBeginTime = fieldsValue.workBeginTime.format(dateFormat)
            }
            // 修改
            const options ={
                method: 'POST',
                url: API_URL.team.editUser,
                data:fieldsValue,
                dataType: 'json',
                doneResult:data => {
                    this.setState({ confirmLoading: false });
                    if(data.success){
                        message.success(data.success);
                        this.props.reload;
                        this.hide();
                    }else{
                        message.warn(data.error);
                        this.props.reload;
                        this.hide();
                    }
                    this.props.reload();
                }
            }
            $.sendRequest(options)

        });
    }

    render() {
        const { confirmLoading, visible, user,userDetail, isEdit } = this.state;
        const mapPropsToFields = () => ({
            employeeCode: { value: userDetail.employeeCode },
            userCompellation: { value: user.userCompellation },
            positionName: { value: user.positionName },
            leaderName: { value: user.leaderName },
            enterpriseDepartmentName: { value: user.enterpriseDepartmentName },
            cityName: { value: user.cityName },
            joinTime: { value: userDetail.joinTime },
            dimissionStatus: { value: user.dimissionStatus === "WORKING" ? "在职" : "离职" },
            userMobile: { value: user.userMobile },
            userTelphone: { value: user.userTelphone },
            userEmail: { value: user.userEmail },
            gender: { value: userDetail.gender === "MALE" ? "男" : "女"},
            placeOfOrigin: { value: userDetail.placeOfOrigin },
            education: { value: userDetail.education },
            graduate: { value: userDetail.graduate },
            subject: { value: userDetail.subject },
            graduateTime: { value:userDetail.graduateTime ? moment(userDetail.graduateTime) : '' },
            lastCompany : { value: userDetail.lastCompany  },
            workBeginTime : { value:userDetail.workBeginTime ? moment(userDetail.workBeginTime) : ''},
            placeOfOrigin:{ value: userDetail.placeOfOrigin},
            placeOfOriginName:{ value: userDetail.placeOfOriginA},
        });
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        return (
            <Modal
                key={userDetail.userId}
                title={isEdit ? '修改资料' : '添加资料'}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="600px"
                confirmLoading={confirmLoading}
            >
                <CreateForm ref="form" />
            </Modal>

        );
    }
}

export default CreateModal;
