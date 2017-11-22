import React, { Component } from 'react';
import $ from '../../common/AjaxRequest';
import { Form, Input, Modal, Button, Select, message,InputNumber } from 'antd';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';
import BDSearchInput from './BDSearchInput';

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
        if (!StringUtil.isNull(value)){
            const options ={
                method: 'POST',
                url: API_URL.investigation.queryUserByKey,
                data: {
                    keyword:value,
                },
                dataType: 'json',
                doneResult:dt => {
                    if (currentValue === value && dt.totalCount > 0) {
                        const data = [];
                        dt.datas.forEach(r => {
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
        }
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
        bdUserName: '',
    };

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const bdUserName = getFieldValue('bdUserName');
        console.log(getFieldValue('investigationContractAmount'))
        return (
            <div className="create-form">
                <Form>
                    <div>1.基本信息</div>
                    <div className="field-max">
                        <FormItem label="项目名称">
                            {
                                getFieldDecorator('investigationName', {
                                    rules: [
                                        { required: true, message: '项目名称不能为空' },
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
                                        { max: 30, message: '项目编号最多30个字符' },
                                    ],
                                })(<Input placeholder="请在此输入项目编号" />)
                            }
                        </FormItem>
                        <FormItem label="项目领域">
                            {
                                getFieldDecorator('investigationArea', {
                                    rules: [
                                        { max: 30, message: '项目领域最多30个字符' },
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
                                        { max: 30, message: '申办方最多30个字符' },
                                    ],
                                })(<Input placeholder="请在此输入申办方" />)
                            }
                        </FormItem>
                        <FormItem label="计划中心数">
                            {
                                getFieldDecorator('siteAmount', {
                                    rules: [
                                        
                                    ],
                                })(<InputNumber style={{width:190}} min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} placeholder="请在此输入计划中心数" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field">
                        <FormItem label="计划知情数">
                            {
                                getFieldDecorator('informedAmount', {
                                    rules: [
                                        
                                    ],
                                })(<InputNumber style={{width:190}} min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} placeholder="请在此输入计划知情数" />)
                            }
                        </FormItem>
                        <FormItem label="计划筛选数">
                            {
                                getFieldDecorator('filterAmount', {
                                    rules: [
                                        
                                    ],
                                })(<InputNumber style={{width:190}} min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} placeholder="请在此输入计划筛选数" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field">
                        <FormItem label="计划随机(入组)数">
                            {
                                getFieldDecorator('randomAmount', {
                                    rules: [
                                        
                                    ],
                                })(<InputNumber style={{width:190}} min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} placeholder="请在此输入计划随机(入组)数" />)
                            }
                        </FormItem>
                        {/* <FormItem label="合同额">
                            {
                                getFieldDecorator('investigationContractAmount', {
                                    rules: [
                                        
                                    ],
                                })(<InputNumber style={{width:190}} min={0} placeholder="请在此输入合同额" formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} precision={0} parser={value => value.replace(/\￥\s?|(,*)/g, '')} style={{width:'80%'}}/>)
                            }
                            元
                        </FormItem> */}
                    </div>
                    <div>2.项目负责人</div>
                    <div className="field">
                        <FormItem label="BD">
                            {
                                getFieldDecorator('bdUserId', {
                                    rules: [                                       
                                        { required: true, message: 'BD不能为空' },
                                    ],
                                })(
                                    <BDSearchInput placeholder={bdUserName} style={{width: 200}}
                                               setFieldsValue={this.setFieldsValue}                                               
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
            // fieldsValue.bdUserId = 3;
            if (this.state.isEdit) {
                const { investigationId } = this.state.investigation;
                fieldsValue.investigationId = investigationId;
                fieldsValue[`investigationSitePlan`] = fieldsValue.siteAmount
                fieldsValue[`params[Type_Filter]`] = fieldsValue.filterAmount
                fieldsValue[`params[Type_Informed]`] = fieldsValue.informedAmount
                fieldsValue[`params[Type_Random]`]= fieldsValue.randomAmount
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
                    },
                    errorResult: () => {
                        this.setState({ confirmLoading: false });
                    },
                }
                $.sendRequest(options)
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
                        this.props.reload();
                    },
                    errorResult: () => {
                        this.setState({ confirmLoading: false });
                    },
                }
                $.sendRequest(options)
            }
        });
    }

    render() {
        const { confirmLoading, visible, investigation, isEdit } = this.state;
        const { bdUserList, planList } = this.state.investigation
        let randomAmount, informedAmount, filterAmount, bdUserId, bdUserName
        if(planList){
            planList.map(d =>{
                if(d.investigationPlanType=='Type_Filter'){
                    filterAmount = d.planAmount
                }else if(d.investigationPlanType=='Type_Informed'){
                    informedAmount = d.planAmount
                }else if(d.investigationPlanType=='Type_Random'){
                    randomAmount = d.planAmount
                }
            })
        }

        if(bdUserList){
            bdUserList.map(d => {
                bdUserId = d.userId
                bdUserName = d.userName
            })
        }
        const mapPropsToFields = () => ({
            investigationName: { value: investigation.investigationName },
            bdUsers: { value: investigation.bdUsers },
            investigationArea:{ value: investigation.investigationArea },
            investigationCode:{ value: investigation.investigationCode },
            investigationContractAmount:{ value: investigation.investigationContractAmount },
            investigationSponsor:{ value: investigation.investigationSponsor },
            siteAmount:{ value: investigation.investigationSitePlan },
            bdUserId:{ value: bdUserId},
            bdUserName:{ value: bdUserName},
            randomAmount:{ value: randomAmount},
            informedAmount:{ value: informedAmount},
            filterAmount:{ value: filterAmount},
        });
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        return (
            <Modal
                title={isEdit ? '修改项目' : '添加项目'}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal form-item-padding"
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
