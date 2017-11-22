/**
 * Created by casteloyee on 2017/7/15.
 */
import React, { Component } from 'react';
import { Input, Modal, Button, Select, message, Row, Col, Radio } from 'antd';
import API_URL from '../../common/url';

const Option = Select.Option;
const RadioGroup = Radio.Group;

class AddModuleDefine extends Component {

    constructor(props) {
        super(props);
        const criteriaDataType = props.criteriaDataType ? props.criteriaDataType : 'TEXT';
        const formatValue = props.formatValue ? props.formatValue : criteriaDataType == 'DATE' ? 'YYYY-MM-DD' : '0';
        this.state = {
            visible: false,
            confirmLoading: false,
            moduleDefineId: 0,
            moduleDefineName: props.moduleDefineName ? props.moduleDefineName : '',
            criteriaDataType,
            projectDefineWebType: props.projectDefineWebType ? props.projectDefineWebType : 'INPUT',
            moduleDefineIsRequired: props.moduleDefineIsRequired ? props.moduleDefineIsRequired : '0',
            formatValue,
        };
    }

    show = (dataItem, mongo) => {
        if (dataItem){
            const criteriaDataType = dataItem.criteriaDataType ? dataItem.criteriaDataType : 'TEXT';
            let formatValue = dataItem.formatValue ? dataItem.formatValue : criteriaDataType == 'DATE' ? 'YYYY-MM-DD' : '0';
            if (criteriaDataType == 'NUMBER' && formatValue){
                if (formatValue == "9999.9"){
                    formatValue = 1;
                } else if (formatValue == "9999.99"){
                    formatValue = 2;
                } else {
                    formatValue = 0;
                }
            }
            this.setState({
                moduleDefineName: dataItem.moduleDefineName ? dataItem.moduleDefineName : '',
                criteriaDataType,
                projectDefineWebType: dataItem.projectDefineWebType ? dataItem.projectDefineWebType : 'INPUT',
                moduleDefineIsRequired: dataItem.moduleDefineIsRequired ? dataItem.moduleDefineIsRequired : '0',
                formatValue,
                visible: true,
                moduleDefineId: mongo == 1 ? dataItem.moduleDefineId : dataItem.investigationExecuteDefineId,
            });
        } else {
            this.setState({
                visible: true,
                moduleDefineName: '',
                criteriaDataType: 'TEXT',
                projectDefineWebType: 'INPUT',
                moduleDefineIsRequired: '1',
                formatValue: '',
                moduleDefineId: 0,
            });
        }
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    inputModuleDefineName = e => {
        this.setState({
            moduleDefineName: e.target.value,
        });
    };

    handleSelectDataType = value => {
        this.setState({
            criteriaDataType: value,
            projectDefineWebType: 'INPUT',
        });
        if (value == 'DATE'){
            this.setState({
                formatValue: 'YYYY-MM-DD',
            });
        } else if (value == 'NUMBER'){
            this.setState({
                formatValue: '0',
            });
        }
    };

    handleSelectWebType = value => {
        this.setState({
            projectDefineWebType: value,
        });
    };

    handleSelectFormatValue = value => {
        this.setState({
            formatValue: value,
        });
    };

    onSelectRequire = e => {
        this.setState({
            moduleDefineIsRequired: e.target.value,
        });
    };

    getWebTypeOptions = () => {
        const {criteriaDataType, projectDefineWebType, formatValue} = this.state;
        if ("TEXT" == criteriaDataType) {
            return (
                <Row>
                    <Col span={12}>填写方式</Col>
                    <Col span={12}>
                        <Select value={projectDefineWebType} style={{width: 120}} onChange={this.handleSelectWebType}>
                            <Option key='INPUT'>文本框</Option>
                            <Option key='RADIO'>单选</Option>
                            <Option key='CHECKBOX'>多选</Option>
                            <Option key='SELECT'>下拉框</Option>
                            <Option key='TEXTAREA'>文本域</Option>
                        </Select>
                    </Col>
                </Row>
            );
        }
        if ("NUMBER" == criteriaDataType) {
            return (
                <Row>
                    <Col span={12}>小数位数</Col>
                    <Col span={12}>
                        <Select value={formatValue} style={{ width: 120 }} onChange={this.handleSelectFormatValue}>
                            <Option key={'0'}>0</Option>
                            <Option key={'1'}>1</Option>
                            <Option key={'2'}>2</Option>
                        </Select>
                    </Col>
                </Row>
            );
        }
        if ("DATE" == criteriaDataType) {
            return (
                <Row>
                    <Col span={12}>日期格式</Col>
                    <Col span={12}>
                        <Select value={formatValue} style={{ width: 120 }} onChange={this.handleSelectFormatValue}>
                            <Option key='YYYY-MM-DD'>时间控件(年月日)</Option>
                            <Option key='YYYY-MM'>时间控件(年月)</Option>
                            <Option key='YYYY-MM-DD HH:MI'>时间控件(年月日时分)</Option>
                        </Select>
                    </Col>
                </Row>
            );
        }
    }

    componentDidMount() {
    }

    // 提交表单
    handleSubmit = () => {
        const value = {
            moduleDefineId: this.state.moduleDefineId,
            moduleDefineName: this.state.moduleDefineName,
            criteriaDataType: this.state.criteriaDataType,
            projectDefineWebType: this.state.criteriaDataType == 'DATE' ? 'DATETIMEPICKER' : this.state.projectDefineWebType,
            moduleDefineIsRequired: this.state.moduleDefineIsRequired,
            formatValue: this.state.formatValue,
        };
        this.props.handleModuleDefineAction(value);
        this.setState({
            visible: false,
        });
    };

    render() {
        const { visible,confirmLoading, moduleDefineName,criteriaDataType,moduleDefineIsRequired, moduleDefineId } = this.state;
        return (
            <Modal
                title={moduleDefineId > 0 ? '修改字段' : '添加字段'}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                confirmLoading={confirmLoading}
            >
                <Row>
                    <Col span={12}>字段名称</Col>
                    <Col span={12}>
                        <Input value={moduleDefineName} onChange={this.inputModuleDefineName} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>字段类型</Col>
                    <Col span={12}>
                        <Select disabled={moduleDefineId > 0} value={criteriaDataType} style={{ width: 120 }} onChange={this.handleSelectDataType}>
                            <Option value="TEXT">文本型</Option>
                            <Option value="DATE">时间型</Option>
                            <Option value="NUMBER">数值型</Option>
                        </Select>
                    </Col>
                </Row>
                {this.getWebTypeOptions()}
                <Row>
                    <Col span={12}>是否必填</Col>
                    <Col span={12}>
                        <RadioGroup onChange={this.onSelectRequire} value={moduleDefineIsRequired}>
                            <Radio value={'1'}>是</Radio>
                            <Radio value={'0'}>否</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
            </Modal>
        );
    }
}

export default AddModuleDefine;
