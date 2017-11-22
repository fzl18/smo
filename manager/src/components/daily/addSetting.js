import React, { Component } from 'react';
import $ from '../../common/AjaxRequest';
import { Form, Input, Modal, Button, Select, message,Spin } from 'antd';
import API_URL from '../../common/url';

const FormItem = Form.Item;
const Option = Select.Option;


class CreateForm extends Component {

    state = {
        bdValue: '',
        RoleCodes: [],
    };
    handleChange = (field, e) => {
        this.setState({
            [field]: e.target.value,
        });
    }

    search = () => {
        const { sortParams } = this.props;
        this.props.reload({ ...this.state, ...sortParams });
    }

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    }

    reset = () => {
        this.props.reset();
    }

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }

    loadRoleCodes = () => {
        const options ={
            method: 'POST',
            url: API_URL.team.RoleCodes,
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
        //     url: `${API_URL.team.RoleCodes}?enterpriseId=1`,
        // }).done(data => {
        //     this.setState({
        //         RoleCodes: data.data,
        //     });
        // });
    }
    componentWillMount() {
        this.loadRoleCodes();
    }

    render() {
        const { getFieldDecorator, getFieldValue, loading } = this.props.form;
        // const isCalculateFtePay = getFieldValue('isCalculateFtePay');
        const roleId = getFieldValue('roleId') ;
        roleId.key == 'undefined' ? roleId.label ='请选择' : roleId.key
        const options = this.state.RoleCodes.map((d, index) => <Option key={index} value={d.roleId.toString()}>{d.roleCode}</Option>);
        return (
            <div className="create-form">
                <Form>
                    <div className="field-max">
                        <FormItem label="适用角色">
                            {
                                getFieldDecorator('roleId', {
                                    rules: [
                                        { required: true, message: '不能为空' },
                                        
                                    ],
                                })(
                                    <Select
                                        style={{ width: 80 }}
                                        labelInValue
                                    >
                                        {options}
                                    </Select>,

                                )
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="工作类型编号">
                            {
                                getFieldDecorator('enterpriseWorkTypeCode', {
                                    rules: [
                                        { required: true, message: '大类编号不能为空' },
                                    ],
                                })(<Input style={{width:250}}
                                    placeholder=""
                                />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="工作类型名称">
                            {
                                getFieldDecorator('enterpriseWorkTypeName', {
                                    rules: [
                                        { required: true, message: '工作类型名称不能为空' },
                                    ],
                                })(<Input style={{width:250}} placeholder="" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="是否计算FTE">
                            {
                                getFieldDecorator('isCalculateFtePay', {
                                    rules: [
                                        { required: true, message: '不能为空' },
                                    ],
                                })(
                                    <Select style={{width:80}}>
                                    <Option value='1'>是</Option>
                                    <Option value='0'>否</Option>
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
        workCategoryId: this.props.workCategoryId,
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
                id,
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
            url: API_URL.daily.view,
            data: {
                enterpriseId:1,
                enterpriseWorkTypeId:id,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    daily: data.enterpriseWorkType,
                });
            },
        }
        $.sendRequest(options)
    }

    componentDidMount() {
        // console.log(this.state.daily)
    }
    // 提交表单
    handleSubmit = () => {
        this.refs.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            this.setState({ confirmLoading: true });
            const fieldsValue = this.refs.form.getFieldsValue();
            fieldsValue.roleId = fieldsValue.roleId.key
            // fieldsValue.bdUserId = 3;
            if (this.state.isEdit) {
                fieldsValue.enterpriseId = 1;
                fieldsValue.enterpriseWorkTypeId = this.state.id;
                fieldsValue.enterpriseWorkCategoryId = this.state.workCategoryId;
                // 修改
                const options ={
                    method: 'POST',
                    url: API_URL.daily.editworktype,
                    data: fieldsValue,
                    dataType: 'json',
                    doneResult: data => {
                        this.setState({ confirmLoading: false });
                        if (data.data.success) {
                            message.success(data.data.success);
                            this.props.reload();
                            this.hide();
                        } else {
                            message.warn(data.data.error);
                            this.props.reload();
                            this.hide();
                        }                  
                    },
                    errorResult: d => {
                        message.warn(d);
                        this.setState({ confirmLoading: false });
                    }
                }
                $.sendRequest(options)
            } else {
                // 添加
                fieldsValue.enterpriseId = 1;
                fieldsValue.enterpriseWorkCategoryId = this.state.workCategoryId;
                const options ={
                    method: 'POST',
                    url: API_URL.daily.addworktype,
                    data:fieldsValue,
                    dataType: 'json',
                    doneResult: data => {
                        this.setState({ confirmLoading: false });
                        console.log('dddddd')
                        if (data.data.success) {
                            message.success(data.data.success);
                            this.props.reload();
                            this.hide();
                        } else {
                            message.warn(data.data.error);
                            this.setState({ confirmLoading: false });
                            this.props.reload();
                            this.hide();
                        }
                    },
                    errorResult: d =>{
                        message.warn(d);
                        console.log(d)
                        this.setState({ confirmLoading: false });
                    }
                }
                $.sendRequest(options)
            }
        });
    }

    render() {
        const { confirmLoading, visible, daily, isEdit } = this.state;
        const mapPropsToFields = () => ({
            isCalculateFtePay: { value: daily.isCalculateFtePay },
            enterpriseWorkTypeCode: { value: isEdit ? daily.enterpriseWorkTypeCode : ''},
            enterpriseWorkTypeName: { value: isEdit ? daily.enterpriseWorkTypeName : ''},
            // roleId: { value: daily.roleId },
            roleId: { value: isEdit ? { key: `${daily.roleId}`, label: daily.roleCode } : { key: '', label: '' } },
            roleCode: { value: isEdit ? daily.roleCode :'' },
            // bdUsers: { value: daily.bdUsers },
        });
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        return (
            <Modal
                title={isEdit ? '修改记录' : '添加记录'}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="450px"
                confirmLoading={confirmLoading}
            >
                <CreateForm ref='form'/>
            </Modal>

        );
    }
}

export default CreateModal;
