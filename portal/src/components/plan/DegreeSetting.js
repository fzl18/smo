/**
 * Created by casteloyee on 2017/7/15.
 */
import React, { Component } from 'react';
import { Modal, Row, Col,DatePicker  } from 'antd';
import moment from 'moment';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';

class DegreeSetting extends Component {

    state = {
        visible: false,
        confirmLoading: false,
        investigationDegree: {},
        dateFormat: 'YYYY-MM-DD',
        record: null
    };

    show = record => {
        this.loadDegreeData(record.investigationDegreeId);
        this.setState({
            visible: true,
            record
        });
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    loadDegreeData = degreeId => {
        const options = {
            url: `${API_URL.plan.queryDegreeById}`,
            data: {
                invDegreeId: degreeId,
            },
            dataType: 'json',
            doneResult: ( data => {
                const { degree } = data.data;
                this.setState({
                    loading: false,
                    investigationDegree: degree,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    onChangeStartTimePlan = value => {
        const {investigationDegree, dateFormat} = this.state;
        value ? investigationDegree.beginTimePlan = value.format(dateFormat) : investigationDegree.beginTimePlan = null;
        this.setState({
            investigationDegree: investigationDegree,
        });
    }

    onChangeEndTimePlan = value => {
        const {investigationDegree, dateFormat} = this.state;
        value ? investigationDegree.endTimePlan = value.format(dateFormat) : investigationDegree.endTimePlan = null;
        this.setState({
            investigationDegree,
        });
    }

    onChangeStartTime = value => {
        const {investigationDegree, dateFormat} = this.state;
        value ? investigationDegree.beginTime = value.format(dateFormat) : investigationDegree.beginTime = null;
        this.setState({
            investigationDegree: investigationDegree,
        });
    }

    onChangeEndTime = value => {
        const {investigationDegree, dateFormat} = this.state;
        value ? investigationDegree.endTime = value.format(dateFormat) : investigationDegree.endTime = null;
        this.setState({
            investigationDegree,
        });
    }


    handleSubmit = () => {
        const {investigationDegree, dateFormat} = this.state;
        if(investigationDegree.beginTime){
            investigationDegree.beginTime = moment(investigationDegree.beginTime).format(dateFormat)
        }
        if(investigationDegree.beginTimePlan){
            investigationDegree.beginTimePlan = moment(investigationDegree.beginTimePlan).format(dateFormat)
        }
        if(investigationDegree.endTime){
            investigationDegree.endTime = moment(investigationDegree.endTime).format(dateFormat)
        }
        if(investigationDegree.endTimePlan){
            investigationDegree.endTimePlan = moment(investigationDegree.endTimePlan).format(dateFormat)
        }
        const options = {
            url: `${API_URL.plan.modifyDegree}`,
            data: {
                ...investigationDegree,
            },
            dataType: 'json',
            doneResult: ( data => {
                this.props.reload();
                this.hide();
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    getMoment = curDate => {
        if(curDate == undefined || curDate == null){
            return null;
        }
        const {dateFormat} = this.state;
        let str = moment(curDate).format(dateFormat);
        return moment(str, dateFormat);
    }

    render() {
        const { visible, confirmLoading, investigationDegree, degreeShow, dateFormat, record} = this.state;
        const isPM = sessionStorage.curRole == 'PM';

        const beginTime = investigationDegree.beginTime ? moment(investigationDegree.beginTime) : null;
        const beginTimePlan = investigationDegree.beginTimePlan ? moment(investigationDegree.beginTimePlan) : null;
        const endTime = investigationDegree.endTime ? moment(investigationDegree.endTime) : null;
        const endTimePlan = investigationDegree.endTimePlan ? moment(investigationDegree.endTimePlan) : null;
        return (
            <Modal
                title="设置项目阶段计划"
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="350px"
                confirmLoading={confirmLoading}
            >
                <Row>
                    <Col span={8} offset={2}>项目阶段名称：</Col>
                    <Col span={12}>{ investigationDegree.stageName }</Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>计划开始时间：</Col>
                    <Col span={12}><DatePicker value={beginTimePlan} onChange={this.onChangeStartTimePlan} format={dateFormat}/></Col>
                </Row>
                {
                    isPM && 
                    <Row>
                        <Col span={8} offset={2}>实际开始时间：</Col>
                        <Col span={12}><DatePicker value={beginTime} onChange={this.onChangeStartTime} format={dateFormat}/></Col>
                    </Row>
                }
                <Row>
                    <Col span={8} offset={2}>计划结束时间：</Col>
                    <Col span={12}><DatePicker value={endTimePlan} onChange={this.onChangeEndTimePlan} format={dateFormat}/></Col>
                </Row>
                {
                    isPM && 
                    <Row>
                        <Col span={8} offset={2}>实际结束时间：</Col>
                        <Col span={12}><DatePicker value={endTime} onChange={this.onChangeEndTime} format={dateFormat}/></Col>
                    </Row>
                }
            </Modal>
        );
    }
}

export default DegreeSetting;
