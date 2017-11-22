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
        const options ={
            method: 'POST',
            url: API_URL.investigation.queryUserByKey,
            data: {
                enterpriseId:1,
                key:value,
                offset: 1,
                limit: 15,
                ...params,
            },
            dataType: 'json',
            doneResult:dt => {
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
            }
        }
        $.sendRequest(options)



        // $.ajax({
        //     method: 'get',
        //     url: `${API_URL.investigation.queryUserByKey}?enterpriseId=1&key=${value}`,
        // }).done(dt => {
        //     const d = dt.data;
        //     if (currentValue === value) {
        //         const result = d.userList;
        //         const data = [];
        //         result.forEach(r => {
        //             data.push({
        //                 value: r.userCompellation,
        //                 text: r.userCompellation,
        //             });
        //         });
        //         callback(data);
        //     }
        // });
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
    };

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const bdValue = getFieldValue('bdUsers');
        return (
            <div className="create-form">
                <Form>
                    <div className="field-max">
                        <FormItem label="项目名称">
                            {
                                getFieldDecorator('investigationName', {
                                    rules: [
                                        { required: true, message: '项目名称不能为空' },
                                        { max: 6, message: '项目名称最多6个字符' },
                                    ],
                                })(<Input placeholder="请在此输入项目名称" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field">
                        <FormItem label="项目编号">
                            {
                                getFieldDecorator('investigationCode', {
                                    rules: [
                                        { max: 6, message: '项目名称最多6个字符' },
                                    ],
                                })(<Input placeholder="请在此输入项目编号" />)
                            }
                        </FormItem>
                        <FormItem label="项目领域">
                            {
                                getFieldDecorator('investigationArea', {
                                    rules: [
                                        { max: 6, message: '项目名称最多6个字符' },
                                    ],
                                })(<Input placeholder="请在此输入项目领域" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field">
                        <FormItem label="申办方">
                            {
                                getFieldDecorator('investigationSponsor', {
                                    rules: [
                                        { max: 6, message: '项目名称最多6个字符' },
                                    ],
                                })(<Input placeholder="请在此输入申办方" />)
                            }
                        </FormItem>
                        <FormItem label="计划中心数">
                            {
                                getFieldDecorator('siteAmount', {
                                    rules: [
                                        { max: 6, message: '项目名称最多6个字符' },
                                    ],
                                })(<Input placeholder="请在此输入计划中心数" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field">
                        <FormItem label="计划筛选数">
                            {
                                getFieldDecorator('filterAmount', {
                                    rules: [
                                        { max: 6, message: '项目名称最多6个字符' },
                                    ],
                                })(<Input placeholder="请在此输入计划筛选数" />)
                            }
                        </FormItem>
                        <FormItem label="计划知情数">
                            {
                                getFieldDecorator('informedAmount', {
                                    rules: [
                                        { max: 6, message: '项目名称最多6个字符' },
                                    ],
                                })(<Input placeholder="请在此输入计划知情数" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field">
                        <FormItem label="计划随机(入组)数">
                            {
                                getFieldDecorator('randomAmount', {
                                    rules: [
                                        { max: 6, message: '项目名称最多6个字符' },
                                    ],
                                })(<Input placeholder="请在此输入计划随机(入组)数" />)
                            }
                        </FormItem>
                        <FormItem label="合同额">
                            {
                                getFieldDecorator('investigationContractAmount', {
                                    rules: [
                                        { max: 6, message: '项目名称最多6个字符' },
                                    ],
                                })(<Input placeholder="请在此输入合同额" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field">
                        <FormItem label="BD">
                            {
                                getFieldDecorator('bdUsers', {
                                    rules: [

                                        { max: 6, message: 'BD最多6个字符' },
                                        { required: true, message: '项目名称不能为空' },
                                    ],
                                })(
                                    <SearchInput
                                        placeholder="请在此输入工号\姓名"
                                        setFieldsValue={this.setFieldsValue}
                                        bdValue={bdValue}
                                    />)
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
            method: 'POST',
            url: API_URL.investigation.view,
            data: {
                investigationId:id,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    investigation: data.data.investigation,
                });
            }
        }
        $.sendRequest(options)


        // $.ajax({
        //     method: 'get',
        //     url: `${API_URL.investigation.view}?investigationId=${id}`,
        // }).done(data => {
        //     this.setState({
        //         investigation: data.data.investigation,
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
            fieldsValue.bdUserId = 3;
            if (this.state.isEdit) {
                const { investigationId } = this.state.investigation;
                fieldsValue.investigationId = investigationId;
                // 修改
                const options ={
                    method: 'POST',
                    url: API_URL.investigation.update,
                    data: fieldsValue,
                    dataType: 'json',
                    doneResult: data => {
                        this.setState({ confirmLoading: false });
                        message.success('修改成功');
                        this.props.reload();
                        this.hide();
                    }
                }
                $.sendRequest(options)



                // $.ajax({
                //     method: 'POST',
                //     url: API_URL.investigation.update,
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
                    url: API_URL.investigation.create,
                    data: fieldsValue,
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
        const { confirmLoading, visible, investigation, isEdit } = this.state;
        const mapPropsToFields = () => ({
            investigationName: { value: investigation.investigationName },
            bdUsers: { value: investigation.bdUsers },
        });
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        return (
            <Modal
                title={isEdit ? '修改项目' : '添加项目'}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="650px"
                confirmLoading={confirmLoading}
            >
                <CreateForm ref="form" />
            </Modal>

        );
    }
}

export default CreateModal;
