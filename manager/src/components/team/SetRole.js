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

function fetch(value, callback) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    function fake() {
        $.ajax({
            method: 'get',
            url: `${API_URL.investigation.queryUserByKey}?enterpriseId=1&key=${value}`,
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
        RoleCodes:[],
    };


    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }

    loadRoleCodes = () =>{
        const options ={
            method: 'POST',
            url: `${API_URL.team.RoleCodes}`,
            data: {
                enterpriseId:1,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    RoleCodes: data.datas,
                });
            }
        }
        $.sendRequest(options)


        // $.ajax({
        //     method: 'GET',
        //     url:`${API_URL.team.RoleCodes}`,
        //     data:{
        //         enterpriseId:1,
        //     }
        // }).done( data => {            
        //     this.setState({
        //         RoleCodes: data.data,
        //     });
        // });
    }
    componentWillMount(){
        this.loadRoleCodes()
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const bdValue = getFieldValue('bdUsers');
        const options = this.state.RoleCodes.map(d => <Option key={d.roleId}>{d.roleCode}</Option>);
        return (
            <div className="create-form">
                <Form>
                    <div className="field-max">
                        <FormItem label="职位名称">
                            {
                                getFieldDecorator('positionName')(<Input disabled />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="对应角色">
                            {
                                getFieldDecorator('roleId', {
                                    initialValue:"请选择",
                                    rules: [
                                        { max: 6, message: '项目名称最多6个字符' },
                                    ],
                                })(
                                    <Select
                                        // defaultValue="请选择"
                                        // onChange={this.handleChangeSelect.bind(this, 'investigationCode')}
                                        style={{width:120}}
                                    >
                                        {options}
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
        investigation: {},
        isEdit: false,
        positionName:"",
        positionId:0,
    };

    show = id => {
        this.setState({
            visible: true,
            isEdit: false,
            investigation: {},
        });
        if (id) {
            this.loadData(id);
            this.setState({
                isEdit: true,
                positionId:id
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
            url: `${API_URL.team.queryPosition}`,
            data: {
                enterpriseId:1,
                positionId: id,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    positionName: data.position.positionName,
                });
            }
        }
        $.sendRequest(options)


        // $.ajax({
        //     method: 'POST',
        //     url: `${API_URL.team.queryPosition}`,
        //     data:{
        //         positionId:id,
        //         enterpriseId:1,
        //     }
        // }).done(data => {
        //     this.setState({
        //         positionName: data.position.positionName,
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
                fieldsValue.positionId = this.state.positionId;
                fieldsValue.enterpriseId=1;
                // 修改
                const options ={
                    method: 'POST',
                    url: API_URL.team.saveSteRole,
                    data: fieldsValue,
                    dataType: 'json',
                    doneResult: data => {
                        this.setState({ confirmLoading: false });
                        message.success('配置成功');
                        this.props.reload();
                        this.hide();
                    }
                }
                $.sendRequest(options)

                // $.ajax({
                //     method: 'POST',
                //     url: API_URL.team.saveSteRole,
                //     data: fieldsValue,
                // }).done(data => {
                //     this.setState({ confirmLoading: false });
                //     message.success('配置成功');
                //     this.props.reload();
                //     this.hide();
                // });
            } else {
                // 新建
                fieldsValue.enterpriseId = 1;
                const options ={
                    method: 'POST',
                    url: API_URL.investigation.create,
                    data:fieldsValue,
                    dataType: 'json',
                    doneResult: data => {
                        this.setState({ confirmLoading: false });
                        message.success('新建成功');
                        this.hide();
                    }
                }
                $.sendRequest(options)


                // $.ajax({
                //     method: 'POST',
                //     url: API_URL.investigation.create,
                //     data: fieldsValue,
                // }).done(data => {
                //     this.setState({ confirmLoading: false });
                //     message.success('新建成功');
                //     this.hide();
                // });
            }
        });
    }

    render() {
        const { confirmLoading, visible, positionName, isEdit } = this.state;
        const mapPropsToFields = () => ({
            positionName: { value: positionName },
            // bdUsers: { value: investigation.bdUsers },
        });
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        return (
            <Modal
                title={isEdit ? '配置职位角色' : '添加角色'}
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
