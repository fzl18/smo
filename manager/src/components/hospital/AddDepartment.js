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
        hospitalId:this.props.hospitalId,
        hospitalDep:[],
        Hid:'',
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

    }

    loadDepartmentData = hospitalId => {  
        const options ={
            method: 'POST',
            url: API_URL.hospital.queryDepByHospitalEnterpriseByHospitalId,
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
    }

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }
    
    handleChangeSelect = (value) => {
        this.loadDepartmentData(value)
    }

    handleSelectHospital = keyValue => {        
        this.state.hospital.map( user => {
            if (user.value == keyValue.key){
                this.setFieldsValue({hospitalId:user.value})
                // this.loadUserData(user.value)
                // this.loadDepartmentData(user.value)
                this.setState({Hid:user.value})
            }
        }); 
    };
    
    parserData = dt => {
        if ((dt.data || dt.datas) && dt.totalCount > 0) {
            const sourceData = dt.data ? dt.data : dt.datas;
            const data = sourceData.map(r => ({
                text: r.hospitalName,
                value: r.hospitalId,
            }));
            this.setState({
                hospital:data,
            });
        } else {
            this.setState({
                hospital: [],
            });
        }
    };

    handleSelectHospitalDep = keyValue => {        
        this.state.hospitalDep.map( user => {
            if (user.value == keyValue.key){
                this.setFieldsValue({hospitalDepartmentId:user.value})
                // this.loadUserData(user.value)
            }
        }); 
    };
    
    parserDepData = dt => {
        if ((dt.data || dt.datas) && dt.totalCount > 0) {
            const sourceData = dt.data ? dt.data : dt.datas;
            const data = sourceData.map(r => ({
                text: r.departmentLocalName,
                value: r.hospitalDepartmentId,
            }));
            this.setState({
                hospitalDep:data,
            });
        } else {
            this.setState({
                hospitalDep: [],
            });
        }
    };

    componentWillMount(){
        // this.loadHospiatlData()
        // this.loadDepartmentData(this.state.hospitalId)
    }
    render() {
        const isEdit = this.props.isEdit
        const { getFieldDecorator, getFieldValue } = this.props.form;
        // const remark = getFieldValue('remark');
        // const hospitalId = getFieldValue('hospitalId');
        // const hospitalName = getFieldValue('hospitalName')
        const options = this.state.hospital.map(d => <Option key={d.hospitalId}>{d.hospitalName}</Option>);
        const options2 = this.state.departmentNames
        if(!isEdit){
            return (
                <div className="create-form">
                    <Form>
                        <div className="field-max">
                            <FormItem label="医院">
                                {
                                    getFieldDecorator('hospitalId', {
                                        rules: [
                                            { required: true, message: '医院不能为空' }
                                        ],
                                    })(
                                    //     <Select 
                                    //         onChange={this.handleChangeSelect}
                                    //         style={{width:150}}                                    
                                    // >
                                    //     {options}
                                    // </Select >
                                    <SearchSelect 
                                        style={{width: 150}}
                                        url = {API_URL.hospital.listhospitals}
                                        searchKey = 'hospitalName'                                        
                                        sourceData={this.state.hospital}
                                        parserData={this.parserData}
                                        handleSelect = {this.handleSelectHospital}                       
                                    />
                                    
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="科室">
                                {
                                    getFieldDecorator('hospitalDepartmentId', {
                                        rules: [
                                            { required: true, message: '科室不能为空' }
                                        ],
                                    })(
                                    // <Select style={{width:150}}>
                                    //     {options2}
                                    // </Select >
                                    <SearchSelect 
                                        style={{width: 150,display:this.state.Hid !=''? 'block':'none'}}
                                        url = {API_URL.hospital.queryDepByHospitalEnterpriseByHospitalId}
                                        searchKey = 'hospitalDepName'                                        
                                        sourceData={this.state.hospitalDep}
                                        parserData={this.parserDepData}
                                        handleSelect = {this.handleSelectHospitalDep}
                                        searchParam={{hospitalId:this.state.Hid}}
                                    />
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="备注">
                                {
                                    getFieldDecorator('remark')(<TextArea autosize={{ minRows: 6, maxRows: 10 }}/>)
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
                                    getFieldDecorator('hospitalName')(<Input style={{width:150}} disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="科室">
                                {
                                    getFieldDecorator('departmentLocalName')(<Input style={{width:150}} disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="备注">
                                {
                                    getFieldDecorator('remark')(<TextArea autosize={{ minRows: 6, maxRows: 10 }}/>)
                                }
                            </FormItem>
                        </div>
                    </Form>
                    <div className="field-max" style={{display:'none'}}>
                            <FormItem label="hospitalId">
                                {
                                    getFieldDecorator('hospitalId')(<Input disabled/>)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max" style={{display:'none'}}>
                            <FormItem label="hospitalDepartmentId">
                                {
                                    getFieldDecorator('hospitalDepartmentId')(<Input disabled/>)
                                }
                            </FormItem>
                        </div>
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
        hospitalId:0
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
            url: API_URL.hospital.departmentlist,
            data: {

                hospitalId:record.hospitalId,
                hospitalDepEntId:record.id,
                offset: 1,
                limit: 15,
                // ...params,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    hospital: data.hospitalDepartmentEnterprise,                
                });
            }
        }
        $.sendRequest(options)

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
                // 修改
                const options ={
                    method: 'POST',
                    url: API_URL.hospital.departmentupdata,
                    data: fieldsValue,
                    dataType: 'json',
                    doneResult: data => {
                        this.setState({ confirmLoading: false });
                        if(data.success){
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
                    url: API_URL.hospital.departmentadd,
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
            hospitalName: { value: hospital.hospitalName },
            hospitalId: { value: hospital.hospitalId },
            hospitalDepartmentId: { value: hospital.hospitalDepartmentId },
            departmentLocalName:{ value: hospital.departmentLocalName },
            remark:{ value: hospital.remark },
        });
        
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        return (
            <Modal
                title={isEdit ? '修改备注' : '添加科室'}
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
