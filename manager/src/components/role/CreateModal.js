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
        code:[]
    };

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }

    loadCodeData = () => {
        const options ={
            method: 'get',
            url: `${API_URL.role.codelist}`,
            data: {
            },
            dataType: 'json',
            doneResult: d => {
                this.setState({
                    code:d.data,
                })
                
            }
        }
        $.sendRequest(options)


        // $.ajax({
        //     method: 'get',
        //     url: `${API_URL.role.codelist}`,
        // }).done(d => {
        //     this.setState({
        //         code:d.data,
        //     })
            
        // });
    }
    handleChange = () =>{
        
    }
    componentWillMount (){
        this.loadCodeData()
    }

    render() {        
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const isEdit = getFieldValue('isEdit')
        const options = this.state.code.map(d => <Option key={d}>{d}</Option>);
        return (
            <div className="create-form">
                <Form>
                    <div className="field-max">
                        <FormItem label="角色名称">
                            {
                                getFieldDecorator('roleDescription', {
                                    rules: [
                                        { required: true, message: '角色名称不能为空' },
                                    ],
                                })(<Input />)
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
        role: {},
        isEdit: false,
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
            method: 'get',
            url: `${API_URL.role.list}`,
            data: {
                enterpriseId:1,
                roleId:id,
                offset: 1,
                limit: 15,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    role: data.role,
                    id:id
                });
            }
        }
        $.sendRequest(options)

        // $.ajax({
        //     method: 'get',
        //     url: `${API_URL.role.list}?roleId=${id}&enterpriseId=1`,
        // }).done(data => {
        //     this.setState({
        //         role: data.role,
        //         id:id
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
                fieldsValue.roleId = this.state.id;
                fieldsValue.enterpriseId = 1
                // 修改
                const options ={
                    method: 'POST',
                    url: API_URL.role.update,
                    data:fieldsValue,
                    dataType: 'json',
                    doneResult:data => {
                        this.setState({ confirmLoading: false });
                        message.success(data.success);
                        this.props.reload();
                        this.hide();
                    },
                    errorResult: (data) =>{
                        Modal.error({title:data})
                        this.setState({ confirmLoading: false });
                    }
                }
                $.sendRequest(options)

                // $.ajax({
                //     method: 'POST',
                //     url: API_URL.role.update,
                //     data: fieldsValue,
                // }).done(data => {
                //     this.setState({ confirmLoading: false });
                //     message.success('修改成功');
                //     this.props.reload();
                //     this.hide();
                // });
            } else {
                // 新建
                fieldsValue.enterpriseId = 1;
                const options ={
                    method: 'POST',
                    url: API_URL.role.create,
                    data:fieldsValue,
                    dataType: 'json',
                    doneResult:data => {
                        this.setState({ confirmLoading: false });
                        message.success('修改成功');
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
                //     message.success('添加成功');
                //     this.hide();
                // });
            }
        });
    }

    render() {
        const { confirmLoading, visible, role, isEdit } = this.state;
        const mapPropsToFields = () => ({
            roleDescription: { value: role.roleDescription },
            roleCode: { value: role.roleCode },
            isEdit:{value:isEdit}
        });
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        return (
            <Modal
                title={isEdit ? '修改角色' : '添加角色'}
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
