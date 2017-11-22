import React, { Component } from 'react';
import $ from '../../common/AjaxRequest';
import { Form, Input, Modal, Button, Select, message } from 'antd';
import API_URL from '../../common/url';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 搜索企业用户
 */

let timeout;
let currentValue;

function fetch(value, callback) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    function fake() {
        $.ajax({
            method: 'get',
            url: `${API_URL.hospital.queryUserByKey}?enterpriseId=1&key=${value}`,
        }).done(dt => {
            const d = dt.data;
            if (currentValue === value) {
                const result = d.userList;
                const data = [];
                result.forEach(r => {
                    data.push({
                        value: r.userCompellation,
                        text: r.userCompellation,
                    });
                });
                callback(data);
            }
        });
    }

    timeout = setTimeout(fake, 300);
}

class SearchInput extends React.Component {
    state = {
        data: [],
        value: '',
    };

    handleChange = value => {
        this.setState({ value });
        fetch(value, data => this.setState({ data }));
    }

    handleBlur = value => {
        this.props.setFieldsValue({ bdUsers: value });
    }

    render() {
        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
        return (
            <Select
                mode="combobox"
                value={this.state.value}
                placeholder={this.props.placeholder}
                notFoundContent=""
                style={this.props.style}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
            >
                {options}
            </Select>
        );
    }
}

class CreateForm extends Component {    
    state = {
        bdValue: '',
        hospital:[],
        department:[],
        hospitalId:this.props.hospitalId,
    };

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }

    loadHospiatlData = () => {
        const options ={
            method: 'POST',
            url: API_URL.hospital.list,
            data: {
                enterpriseId:1,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    hospital: data.datas,
                });
            }
        }
        $.sendRequest(options)



        // $.ajax({
        //     method: 'get',
        //     url: `${API_URL.hospital.list}?enterpriseId=1`,
        // }).done(data => {
        //     this.setState({
        //         hospital: data.datas,
        //     });
        // });
    }
    loadDepartmentData = hospitalId => {
        const options ={
            method: 'POST',
            url: API_URL.hospital.querydepartment,
            data: {
                enterpriseId:1,
                hospitalId,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    department: data.datas,
                },()=>{
                    const departments = this.state.department.map(d => <Option key={d.hospitalDepartmentId}>{d.departmentLocalName}</Option>);
                    this.setState({
                        departmentNames: departments,
                    });
                });
            }
        }
        $.sendRequest(options)
        


        // $.ajax({
        //     method: 'get',
        //     url: `${API_URL.hospital.querydepartment}?enterpriseId=1&hospitalId=${hospitalId}`,
        // }).done(data => {
        //     this.setState({
        //         department: data.datas,
        //     },()=>{
        //         const departments = this.state.department.map(d => <Option key={d.hospitalDepartmentId}>{d.departmentLocalName}</Option>);
        //         this.setState({
        //             departmentNames: departments,
        //         });
        //     });
        // });
    }

    handleChangeSelect = (value) => {
        this.loadDepartmentData(value)
    }
    
    componentWillMount(){
        this.loadHospiatlData()
        this.loadDepartmentData(this.state.hospitalId)
    }
    render() {
        const isEdit = this.props.isEdit
        const { getFieldDecorator, getFieldValue } = this.props.form;
        // const remark = getFieldValue('remark');
        const hospitalId = getFieldValue('hospitalId');
        // const hospitalName = getFieldValue('hospitalName')
        const options = this.state.hospital.map(d => <Option key={d.hospitalId}>{d.hospitalName}</Option>);
        const options2 = this.state.departmentNames ;
        if(!isEdit){
            return (
                <div className="create-form">
                    <Form>
                        <div className="field-max">
                            <FormItem label="医院名称">
                                {
                                    getFieldDecorator('hospitalId', {
                                        initialValue:"请选择医院",
                                        rules: [
                                            { required: true, message: '医院名称不能为空' }
                                        ],
                                    })(<Select
                                             style={{width:150}}
                                             onChange={this.handleChangeSelect}
                                    >
                                        {options}
                                    </Select >)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="科室">
                                {
                                    getFieldDecorator('hospitalDepartmentId',{
                                        initialValue:"请选择科室",
                                        rules: [
                                            { required: true, message: '科室不能为空' }
                                        ],
                                    })(
                                            <Select 
                                                style={{width:150}}
                                                value = {this.state.departmentNames}
                                                onChange={()=>{}}
                                            >
                                                {options2}
                                            </Select >
                                        )
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="医生姓名">
                                {
                                    getFieldDecorator('userCompellation',{
                                        rules:[
                                            {required:true, message:'医生姓名不能为空'}
                                        ]
                                    })(<Input placeholder="请输入医生姓名" />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max" style={{display:'none'}}>
                            <FormItem label="科室ID">
                                {
                                    getFieldDecorator('hospitalDepartmentId')(<Input display />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max" style={{display:'none'}}>
                            <FormItem label="用户ID">
                                {
                                    getFieldDecorator('userId')(<Input display />)
                                }
                            </FormItem>
                        </div>
                        
                        <div className="field-max">
                            <FormItem label="性别">
                                {
                                    getFieldDecorator('gender',{
                                        rules:[                                            
                                        ],                                        
                                    })(
                                        <Select style={{width:80}}>                                            
                                            <Option value="MALE">男</Option>
                                            <Option value="FEMALE">女</Option>
                                        </Select >
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="职务">
                                {
                                    getFieldDecorator('doctorPosition',{
                                        rules:[
                                            {required:true, message:''}
                                        ]
                                    })(<Input placeholder="请输入职务" />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="手机号码">
                                {
                                    getFieldDecorator('userMobile',{
                                        rules:[
                                            {pattern:/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,message:'必须是11位手机号'}
                                        ]
                                    })(<Input placeholder="请输入手机号码" />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="固定电话">
                                {
                                    getFieldDecorator('userTelphone',{
                                        rules:[
                                            {pattern:/0\d{2,3}-\d{5,9}|0\d{2,3}-\d{5,9}/, message:'格式: 010-88556651'}
                                        ]
                                    })(<Input placeholder="请输入固定电话" />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="邮箱">
                                {
                                    getFieldDecorator('userEmail',{
                                        rules:[
                                            {type:'email',message:'格式：dsf@dfwe.com'}
                                        ]
                                    })(<Input placeholder="请输入邮箱" />)
                                }
                            </FormItem>
                        </div>
                    </Form>
                </div>
            );
        }else{
            return (
                <div className="create-form">
                    <Form>
                        <div className="field-max">
                            <FormItem label="医院名称">
                                {
                                    getFieldDecorator('hospitalName')(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="科室">
                                {
                                    getFieldDecorator('departmentLocalName')(
                                        <Input disabled />
                                        )
                                }
                            </FormItem>
                        </div>
                        <div className="field-max" style={{display:'none'}}>
                            <FormItem label="科室ID">
                                {
                                    getFieldDecorator('hospitalDepartmentId')(<Input display />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max" style={{display:'none'}}>
                            <FormItem label="用户ID">
                                {
                                    getFieldDecorator('userId')(<Input display />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="医生姓名">
                                {
                                    getFieldDecorator('userCompellation')(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="性别">
                                {
                                    getFieldDecorator('gender')(
                                        <Select style={{width:80}}>                                                                                   
                                            <Option value="MALE">男</Option>
                                            <Option value="FEMALE">女</Option>
                                        </Select >
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="职务">
                                {
                                    getFieldDecorator('doctorPosition')(<Input placeholder="请输入职务" />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="手机号码">
                                {
                                    getFieldDecorator('userMobile')(<Input placeholder="请输入手机号码" />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="固定电话">
                                {
                                    getFieldDecorator('userTelphone')(<Input placeholder="请输入固定电话" />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="邮箱">
                                {
                                    getFieldDecorator('userEmail')(<Input placeholder="请输入邮箱" />)
                                }
                            </FormItem>
                        </div>
                    </Form>
                </div>
            );
        }
        
    }
}

class CreateModal extends Component {

    state = {
        visible: false,
        confirmLoading: false,
        hospital: {},
        isEdit: false,
        id:0,
        hospitalId:0,
    };

    show = record => {
        this.setState({
            visible: true,
            isEdit: false,
            hospital: {},            
        });
        if (record) {
            this.loadData(record);
            this.setState({
                isEdit: true,
                id:record.id,
                hospitalId:record.hospitalId
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
    loadData = record => {
        const options ={
            method: 'POST',
            url: API_URL.hospital.doctorlist,
            data: {
                enterpriseId:1,
                userId:record.id,
                offset: 1,
                limit: 15,
                // ...params,
            },
            dataType: 'json',
            doneResult:data => {
                this.setState({
                    hospital: data.doctor,
                });
            }
        }
        $.sendRequest(options)


        // $.ajax({
        //     method: 'POST',
        //     url: `${API_URL.hospital.doctorlist}`,
        //     data: {
        //         enterpriseId:1,
        //         userId:record.id,
        //         // hospitalId:record.hospitalId,
        //         offset: 1,
        //         limit: 15,
        //         // ...params,
        //     },
        // }).done(data => {
        //     this.setState({
        //         hospital: data.doctor,
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
            fieldsValue.enterpriseId = 1;            
            if (this.state.isEdit) {
                fieldsValue.hospitalId=this.state.id
                fieldsValue.hospitalId = this.state.hospitalId
                // 修改
                const options ={
                    method: 'POST',
                    url: API_URL.hospital.editDoctor,
                    data:fieldsValue,
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

            } else {
                // 新建
                fieldsValue.enterpriseId = 1;
                const options ={
                    method: 'POST',
                    url: API_URL.hospital.addDoctor,
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

            }
        });
    }

    render() {
        const { confirmLoading, visible, hospital, isEdit } = this.state; 
        const mapPropsToFields = () => ({
            userId:{ value: hospital.userId },
            hospitalId:{ value: hospital.hospitalId } ,
            hospitalDepartmentId:{value:hospital.hospitalDepartmentId},
            hospitalName: { value: hospital.hospitalName },
            departmentLocalName:{ value: hospital.departmentLocalName },
            userCompellation:{ value: hospital.userCompellation },
            gender:{ value: hospital.gender},
            regionName:{ value: hospital.regionName },
            userEmail:{ value: hospital.userEmail },
            userMobile:{ value: hospital.userMobile },
            userTelphone:{ value: hospital.userTelphone },
            doctorPosition:{ value: hospital.doctorPosition },
        });
        
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        return (
            <Modal
                title={isEdit ? '修改医生记录' : '添加医生记录'}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="450px"
                confirmLoading={confirmLoading}
            >
                <CreateForm ref="form" isEdit={this.state.isEdit} hospitalId={this.state.hospitalId}/>
            </Modal>

        );
    }
}

export default CreateModal;
