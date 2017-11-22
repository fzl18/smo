/**
 * Created by casteloyee on 2017/7/15.
 */
import React from 'react';
import { Modal, Row, Col, Input, InputNumber, Select } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';

const Option = Select.Option;

class VisitTypeModal extends React.Component {

    state = {
        visible: false,
        visitTypeId: 0,
        visitType: {},
        visitTypeList: [],
        confirmLoading: false,
    };

    show = visitTypeId => {
        if (visitTypeId > 0){
            this.loadVisitType(visitTypeId);
        } else {
            this.setState({
                visitType: {},
            });
        }
        this.loadVisitTypeList();
        this.setState({
            visible: true,
            visitTypeId,
        });
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    loadVisitType = visitTypeId => {
        const options = {
            url: `${API_URL.plan.getVisitType}`,
            data: {
                visitTypeId,
            },
            dataType: 'json',
            doneResult: ( dt => {
                this.setState({
                    loading: false,
                    visitType: dt.data.visitType,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    loadVisitTypeList = () => {
        const options = {
            url: `${API_URL.plan.visitTypeDataList}`,
            data: {},
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loading: false,
                    visitTypeList: data.data.visitTypeList,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    handleSubmit = () => {
        const { visitType, visitTypeId } = this.state;
        if(!visitType.visitTypeName){
            Modal.error({title: "访视类型名称不能为空"});
            return;
        }
        const options = visitTypeId > 0 ? {
            url: `${API_URL.plan.updateVisitType}`,
            data: {
                visitTypeId,
                ...visitType,
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    visible: false,
                });
                this.props.reload();
            }),
        } : {
            url: `${API_URL.plan.addVisitType}`,
            data: {
                ...visitType,
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    visible: false,
                });
                this.props.reload();
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    onChangeVisitTypeName = e => {
        const { visitType } = this.state;
        visitType.visitTypeName = e.target.value;
        this.setState({
            visitType,
        });
    };

    onChangeVisitTypeWindow = value => {
        const { visitType } = this.state;
        visitType.visitTypeWindow = value;
        this.setState({
            visitType,
        });
    };

    onChangeVisitTypeWindowFloor = value => {
        const { visitType } = this.state;
        visitType.visitTypeWindowFloor = value;
        this.setState({
            visitType,
        });
    };

    onChangeVisitTypeWindowCeil = value => {
        const { visitType } = this.state;
        visitType.visitTypeWindowCeil = value;
        this.setState({
            visitType,
        });
    };

    handleSelectReferenceVisitType = value => {
        const { visitType } = this.state;
        visitType.referenceVisitTypeId = value;
        this.setState({
            visitType,
        });
    };

    getVisitTypeListOption = () => {
        const { visitType, visitTypeList, visitTypeId } = this.state;
        const options = [];
        let refName;
        visitTypeList.map(d => {
            if (d.visitTypeId != visitTypeId){
                options.push(<Option key={d.visitTypeId}>{d.visitTypeName}</Option>);
                if (visitType.referenceVisitTypeId == d.visitTypeId){
                    refName = d.visitTypeName;
                }
            }
        });
        return (
            <Select allowClear={true} value={refName} style={{width: 120}} onChange={this.handleSelectReferenceVisitType}>
                {options}
            </Select>
        );
    };

    render() {
        const { visible, confirmLoading, visitTypeId, visitType } = this.state;
        return (
            <Modal
                title={ visitTypeId > 0 ? "修改访视周期计划" : "添加访视周期计划"}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="350px"
                confirmLoading={confirmLoading}
            >
                <Row>
                    <Col span={8} offset={2}>*访视类型名称：</Col>
                    <Col span={12}><Input value={visitType.visitTypeName} onChange={this.onChangeVisitTypeName} /></Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>对照基准访视：</Col>
                    <Col span={12}>
                        {this.getVisitTypeListOption()}
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>访视时间点：</Col>
                    <Col span={7}><InputNumber min={0} value={visitType.visitTypeWindow} onChange={this.onChangeVisitTypeWindow} /></Col>
                    <Col span={2}>天</Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>访视窗口(-)：</Col>
                    <Col span={7}>
                    <InputNumber max={0} value={visitType.visitTypeWindowFloor} onChange={this.onChangeVisitTypeWindowFloor} formatter={value => value > 0 ? value * -1 : value} parser={value => value > 0 ? value * -1 : value}/>
                    </Col>
                    <Col span={2}>天</Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>访视窗口(+)：</Col>
                    <Col span={7}><InputNumber min={0} value={visitType.visitTypeWindowCeil} onChange={this.onChangeVisitTypeWindowCeil} /></Col>
                    <Col span={2}>天</Col>
                </Row>
            </Modal>
        );
    }
}

export default VisitTypeModal;
