import React, { Component } from 'react';
import $ from '../../common/AjaxRequest';
import { Form, Input, Modal, Button, Select, message } from 'antd';
import API_URL from '../../common/url';
import SearchSelect from '../common/SearchSelect';
const { TextArea } = Input;
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
//             url: `${API_URL.hospital.queryUserByKey}?enterpriseId=1&key=${value}`,
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
        doctors:[],
        record:this.props.record,
        doctor:{},
        
    };

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }

    // loadHospiatlData = id => {
    //     $.ajax({
    //         method: 'get',
    //         url: `${API_URL.hospital.queryDoctorListByDepId}`,
    //     }).done(data => {
    //         this.setState({
    //             hospital: data.datas,
    //         });            
    //     });
    // }
    // componentWillMount(){
    //     this.loadHospiatlData()
    // }
    /**
     * 取医院负责人列表
     * @param id
     */
    loadDoctorList = record => {
        const options ={
            method: 'POST',
            url: API_URL.hospital.queryDoctorListByDepId,
            data: {
                enterpriseId:1,
                hospitalId:record.hospitalId,
                hospitalDepartmentId:record.hospitalDepartmentId,
                offset: 1,
                limit: 15,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    doctors: data.datas,
                });
            }
        }
        $.sendRequest(options)
    }

    //查这个ID的医生信息
    loadDoctorData = id => {
        const options ={
            method: 'POST',
            url: API_URL.hospital.doctorlist,
            data: {
                enterpriseId:1,
                userId:id,
                offset: 1,
                limit: 15,
                // ...params,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    doctor: data.doctor,
                });
            }
        }
        $.sendRequest(options)
    }

    handleSelectDoctor = keyValue => {
        this.state.doctors.map( user => {
            if (user.value == keyValue.key){
                this.setFieldsValue({userId:user.value})
                // this.loadUserData(user.value)
                this.loadDoctorData(user.value)
            }
        });
    };
    
    parserData = dt => {
        if ((dt.data || dt.datas) && dt.totalCount > 0) {
            const sourceData = dt.data ? dt.data : dt.datas;
            const data = sourceData.map(r => ({
                text: `${r.userCompellation}`,
                value: r.userId,
            }));
            this.setState({
                doctors:data,
            });
        } else {
            this.setState({
                doctors: [],
            });
        }
    };

    componentWillMount(){
        // this.loadDoctorList(this.state.record)
    }

    handleChangeSelect = (value) => {
        this.loadDoctorData(value)
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        // const remark = getFieldValue('remark');
        // const hospitalId = getFieldValue('hospitalId');
        // const hospitalName = getFieldValue('hospitalName')
        const options = this.state.doctors.map(d => <Option key={d.userId}>{d.userCompellation}</Option>);
        const { doctorPosition, userMobile, userTelphone, userEmail } = this.state.doctor
        return (
            <div className="create-form">
                <Form>
                    <div className="field-max">
                        <FormItem label="选择医生">
                            {
                                getFieldDecorator('userId',{
                                    
                                })(
                                //    <Select 
                                //         style={{width:120}} 
                                //         onChange={this.handleChangeSelect}
                                //    >
                                //         {options}
                                //    </Select>
                                <SearchSelect 
                                    style={{width: 150}}
                                    url = {API_URL.hospital.queryDoctorListByDepId}
                                    searchKey = 'keywords'                                        
                                    sourceData={this.state.doctors}
                                    parserData={this.parserData}
                                    handleSelect = {this.handleSelectDoctor}
                                    searchParam={{hospitalId:this.state.record.hospitalId,
                                                  hospitalDepartmentId:this.state.record.hospitalDepartmentId,}}
                                />
                                    )
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="职务">
                            {
                                getFieldDecorator('doctorPosition')(<Input placeholder={doctorPosition}  style={{width:150}} disabled />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="手机号码">
                            {
                                getFieldDecorator('userMobile')(<Input placeholder={userMobile}  style={{width:150}} disabled />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="固定电话">
                            {
                                getFieldDecorator('userTelphone')(<Input placeholder={userTelphone} style={{width:150}} disabled />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="邮箱">
                            {
                                getFieldDecorator('userEmail')(<Input placeholder={userEmail} style={{width:150}} disabled />)
                            }
                        </FormItem>
                    </div>
                </Form>
            </div>
        );        
    }
}

class PreviewModal extends Component {

    state = {
        visible: false,
        confirmLoading: false,
        hospital: {},
        isEdit: false,
        id:0,
        hospitalId:'',
        hospitalDepartmentId:'',
    };

    show = record => {
        this.setState({
            visible: true,
            isEdit: false,
            hospital: {},            
        });
        if (record) {
            // this.loadData(record);
            this.setState({
                isEdit: true,
                id:record.id,
                record:record,
                hospitalId:record.hospitalId,
                hospitalDepartmentId:record.hospitalDepartmentId,
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
    // loadData = record => {
    //     $.ajax({
    //         method: 'POST',
    //         url: `${API_URL.hospital.queryDoctorListByDepId}`,
    //         data: {
    //             enterpriseId:1,
    //             hospitalId:record.hospitalId,
    //             hospitalDepartmentId:record.hospitalDepartmentId,
    //             offset: 1,
    //             limit: 15,
    //             // ...params,
    //         },
    //     }).done(data => {
    //         this.setState({
    //             hospital: data.datas,
    //         });
    //     });
    // }

    // 提交表单
    handleSubmit = () => {
        this.refs.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            this.setState({ confirmLoading: true });
            const fieldsValue = this.refs.form.getFieldsValue();
            fieldsValue.enterpriseId = 1;
            fieldsValue.hospitalId=this.state.hospitalId
            fieldsValue.hospitalDepartmentId=this.state.hospitalDepartmentId
            // 修改
            const options ={
                method: 'POST',
                url: API_URL.hospital.addHospitalDepartmentUser,
                data: fieldsValue,
                dataType: 'json',
                doneResult: data => {
                    this.setState({ confirmLoading: false });
                    if(!data.error){
                        message.success(data.success);
                        this.props.reload();
                        this.hide();
                    }else{
                        message.warn(data.error);
                        this.props.reload();
                        this.hide();
                    }
                    
                }
            }
            $.sendRequest(options)           
        });
    }

    render() {
        const { confirmLoading, visible, hospital, isEdit } = this.state; 
        const mapPropsToFields = () => ({
            // userId: { value: hospital.userId },
            // userCompellation: { value: hospital.userCompellation },
            // positionName: { value: hospital.positionName },
            // userMobile: { value: hospital.userMobile },
            // userTelphone:{ value: hospital.userTelphone },
            // userEmail:{ value: hospital.userEmail },
        });
        
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        return (
            <Modal
                title='配置负责人'
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="450px"
                confirmLoading={confirmLoading}
            >
                <CreateForm ref="form" isEdit={this.state.isEdit} record={this.state.record} />
            </Modal>

        );
    }
}

export default PreviewModal;
