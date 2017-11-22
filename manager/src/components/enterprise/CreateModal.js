import React, { Component } from 'react';
import $ from '../../common/AjaxRequest';
import { Form, Input, Modal, Button, Select, message,Radio } from 'antd';
import API_URL from '../../common/url';
import SearchSelect from '../common/SearchSelect';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

/**
 * 搜索企业用户
 */

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
        users:[],
        ent:[],
    };

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }

    //取添加时的企业列表
    loadEntData = () =>{
        const options ={
            method: 'POST',
            url: `${API_URL.entmanager.queryEnt}`,
            data: {
                // enterpriseId:1,
                offset: 1,
                limit: 15,
            },
            dataType: 'json',
            doneResult: data => {             
                this.setState({
                    ent:data.datas,
                })
            },
        }
        $.sendRequest(options)
    }


    //取企业管理员
    loaduserData = () =>{
        const options ={
            method: 'POST',
            url: `${API_URL.entmanager.queryUser}`,
            data: {
                enterpriseId:1,
                offset: 1,
                limit: 15,
            },
            dataType: 'json',
            doneResult: (data => {
                this.setState({
                    users:data.datas,
                });
            })
        }
        $.sendRequest(options)
    }

    handleSelectEnt = keyValue => {
        this.state.ent.map( user => {
            if (user.value == keyValue.key){
                this.setFieldsValue({enterpriseId:user.value})
                // this.loadUserData(user.value)
            }
        });
    };
    
    parserData = dt => {
        if ((dt.data || dt.datas) && dt.totalCount > 0) {
            const sourceData = dt.data ? dt.data : dt.datas;
            const data = sourceData.map(r => ({
                text: r.enterpriseName,
                value: r.enterpriseId,
            }));
            this.setState({
                ent:data,
            });
        } else {
            this.setState({
                ent: [],
            });
        }
    };

    handleSelectUser = keyValue => {
        this.state.users.map( user => {
            if (user.value == keyValue.key){
                this.setFieldsValue({userId:user.value})
                // this.loadUserData(user.value)
            }
        });
    };
    
    parserDataUser = dt => {
        if ((dt.data || dt.datas) && dt.totalCount > 0) {
            const sourceData = dt.data ? dt.data : dt.datas;
            const data = sourceData.map(r => ({
                text: r.userCompellation,
                value: r.userId,
            }));
            this.setState({
                users:data,
            });
        } else {
            this.setState({
                users: [],
            });
        }
    };

    componentDidMount(){
        // this.loaduserData()
        // this.loadEntData()
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const isEdit = getFieldValue('isEdit');
        const managerUserId = getFieldValue('managerUserId');
        const options = this.state.users.map(d =><Option key={ d.userId}>{d.userCompellation}</Option> )
        const entoptions = this.state.ent.map(d =><Option key={ d.enterpriseId}>{d.enterpriseName}</Option> )
        if(!isEdit){
            return (
                <div className="create-form">
                    <Form>
                        <div className="field-max">
                            <FormItem label="企业名称">
                                {
                                    getFieldDecorator('enterpriseId', {
                                        initialValue:'请选择',
                                        rules: [
                                            { required: true, message: '项目名称不能为空' },
                                        ],
                                    })(
                                        // <Select style={{width:160}}>
                                        //     {entoptions}
                                        // </Select>

                                        <SearchSelect 
                                        style={{width: 150}}
                                        url = {API_URL.entmanager.queryEnt}
                                        searchKey = 'keyword'                                        
                                        sourceData={this.state.ent}
                                        parserData={this.parserData}
                                        handleSelect = {this.handleSelectEnt}                                        
                                    />


                                        )
                                }
                            </FormItem>
                        </div>

                        <div className="field-max">
                            <FormItem label="企业用户来源">
                                {
                                    getFieldDecorator('investigationName', {
                                        initialValue:'0',
                                        rules: [
                                        ],
                                    })(<RadioGroup>
                                            <Radio value="0" >系统同步</Radio>
                                            <Radio value="1" disabled>手动添加</Radio>
                                        </RadioGroup>)
                                }
                            </FormItem>
                        </div>
                    </Form>
                </div>
            )
        }else if(managerUserId){   //变更
            return (
                <div className="create-form" >
                    <Form>
                        <div className="field-max" style={{display:'none'}}>
                            <FormItem label="ID">
                                {
                                    getFieldDecorator('enterpriseId', {
                                        rules: [
                                            
                                        ],
                                    })(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="企业名称">
                                {
                                    getFieldDecorator('enterpriseName', {
                                        rules: [
                                            { required: true, message: '' },
                                        ],
                                    })(<Input disabled />)
                                }
                            </FormItem>
                        </div>

                        <div className="field-max">
                            <FormItem label="现企业管理员">
                                {
                                    getFieldDecorator('managerUserName', {
                                        rules: [
                                        ],
                                    })(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="变更为">
                                {
                                    getFieldDecorator('userId', {
                                        initialValue:'请选择',
                                        rules: [
                                        ],
                                    })(
                                        // <Select style={{width:120}}>
                                        //     {options}
                                        // </Select>
                                    <SearchSelect 
                                        style={{width: 150}}
                                        url = {API_URL.entmanager.queryUser}
                                        searchKey = 'keywords'                                        
                                        sourceData={this.state.users}
                                        parserData={this.parserDataUser}
                                        handleSelect = {this.handleSelectUser}                                        
                                    />
                                    )
                                }
                            </FormItem>
                        </div>
                    </Form>
                </div>
            )
        }else{   //配置企业管理员
            return (  
                <div className="create-form">
                    <Form>
                        <div className="field-max" style={{display:'none'}}>
                            <FormItem label="ID">
                                {
                                    getFieldDecorator('enterpriseId', {
                                        rules: [
                                            
                                        ],
                                    })(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="企业名称">
                                {
                                    getFieldDecorator('enterpriseName', {
                                        rules: [
                                            { required: true, message: '' },
                                        ],
                                    })(<Input disabled />)
                                }
                            </FormItem>
                        </div>

                        <div className="field-max">
                            <FormItem label="选择管理员">
                                {
                                    getFieldDecorator('userId', {
                                        initialValue:'请选择',
                                        rules: [
                                        ],
                                    })(
                                        // <Select style={{width:120}}>
                                        //    {options}
                                        // </Select>
                                    <SearchSelect 
                                        style={{width: 150}}
                                        url = {API_URL.entmanager.queryUser}
                                        searchKey = 'keywords'                                        
                                        sourceData={this.state.users}
                                        parserData={this.parserDataUser}
                                        handleSelect = {this.handleSelectUser}                                        
                                    />
                                        )
                                }
                            </FormItem>
                        </div>
                    </Form>
                </div>
            )
        }
        
    }
}

class CreateModal extends Component {

    state = {
        visible: false,
        confirmLoading: false,
        investigation: {},
        isEdit: false,
        userId:null,
    };

    


    show = record => {
        this.setState({
            visible: true,
            isEdit: false,
            investigation: {},
        });
        if (record) {
            this.loadData(record.id);
            this.setState({
                isEdit: true,                
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
            url: API_URL.entmanager.view,
            data: {
                enterpriseId:id,
                offset: 1,
                limit: 15,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    investigation: data.enterprise,
                });
            }
        }
        $.sendRequest(options);
    }

    // 提交表单
    handleSubmit = () => {        
        this.refs.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            this.setState({ confirmLoading: false });
            const fieldsValue = this.refs.form.getFieldsValue();
            const isChange = fieldsValue.managerUserName
            const {isEdit} = this.state
            if (isEdit) {
                if(isChange){
                    // 变更企业管理员
                    const options ={
                        method: 'POST',
                        url: `${API_URL.entmanager.changeEntManger}`,
                        data: fieldsValue,
                        dataType: 'json',
                        doneResult:data => {
                            this.setState({ confirmLoading: false });
                            message.success(data.sucess)
                            this.props.reload();
                            this.hide();
                        },
                        errorResult: () => {
                            this.setState({ confirmLoading: false });
                            message.warn(data.error );
                        }
                    }
                    $.sendRequest(options)
                }else{
                    // 配置企业管理员
                    const options ={
                        method: 'POST',
                        url: `${API_URL.entmanager.configEntManager}`,
                        data: fieldsValue,
                        dataType: 'json',
                        doneResult: data => {
                            this.setState({ confirmLoading: false });
                            message.success(data.success)
                            this.props.reload();
                            this.hide();       
                        },
                        errorResult: () => {
                            this.setState({ confirmLoading: false });
                            Modal.error({ title: data.error });
                        }
                    }
                    $.sendRequest(options)
                }

                } else {
                    // 新建
                    // fieldsValue.enterpriseId = 1;                    
                    const options ={
                        method: 'POST',
                        url: `${API_URL.entmanager.add}`,
                        data: fieldsValue,
                        dataType: 'json',
                        doneResult: (data => {
                            this.setState({ confirmLoading: false });
                            message.success('添加成功')
                            this.props.reload();
                            this.hide();
                        }),errorResul:( data => {
                            this.setState({ confirmLoading: false });
                        })
                    }
                    $.sendRequest(options)

                }
        });
    }

    render() {
        const { confirmLoading, visible, investigation, isEdit } = this.state;
        const mapPropsToFields = () => ({
            enterpriseName: { value: investigation.enterpriseName },
            enterpriseId: { value: investigation.enterpriseId },
            managerUserId: { value: investigation.managerUserId },
            managerUserName: { value: investigation.managerUserName },
            isEdit:{value:isEdit},
        });
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        return (
            <Modal
                title={isEdit ? '修改' : '添加'}
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
