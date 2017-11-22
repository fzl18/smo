import React from 'react';
import {Modal, Row, Col, Input, Radio, Select, message, DatePicker} from 'antd';
const Option = Select.Option;
import API_URL from '../../common/url';
import CrcSearchInput from './CrcSearchInput';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';
import moment from 'moment';
import './style/list.less';
const { TextArea } = Input;
const RadioGroup = Radio.Group;

class EditTransfer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            dataList: [],
            site: {},
            investigationSiteList: [],
            crcId: '',
            crcName: '',
            city: '',
            time: '',
            comment: '',
            dateFormat: 'YYYY-MM-DD'
        };
    };

    revert = () => {
        this.setState({
            dataList: [],
            site: {},
            investigationSiteList: [],
            crcId: '',
            crcName: '',
            city: '',
            time: '',
            comment: '',
            dateFormat: 'YYYY-MM-DD'
        })
    };

    show = (requirementId) => {
        this.revert();
        this.setState({
            visible: true,
            requirementId
        },function(){
            this.loadData();
        });
    };

    loadData = () => {
        this.setState({
            loading: true,
        });
        const {requirementId} = this.state;
        const options = {
            url: `${API_URL.execute.queryHandover}`,
            data: {
                requirementId
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loading: false,
                    crcId: data.data.handover.handoverUserId,
                    crcName: data.data.handover.handoverUser,
                    investigationSiteList: data.data.siteOptions,
                    site: data.data.handover.site.investigationSiteId,
                    city: data.data.handover.site.city,
                    time: data.data.handover.prospectiveCompleteTime,
                    comment: data.data.handover.requirementComment
                })
            }),
            failResult: ( data => {
                this.setState({
                    visible: false,
                });
            })
        };
        AjaxRequest.sendRequest(options);
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    handleSelectCrc = value => {
        this.setState({
            crcId: value.value,
            crcName: value.text,
            investigationSiteList: value.crcSite
        });
    };

    onRadioChange = e => {
        this.setState({
            site: e.target.value,
            city: e.target.city
        });
    };

    onChangeTime =(value) =>{
        const {dateFormat} = this.state;
        const time = value.format(dateFormat);
        this.setState({
            time: time,
        });
    }

    commentChange =(e) => {
        this.setState({comment: e.target.value});
    }

    handleSubmit = () => {
        if (StringUtil.isNull(this.state.site)) {
            message.error('请选择中心');
            return;
        }
        if (StringUtil.isNull(this.state.time)) {
            message.error('请选择时间');
            return;
        }
        const options = {
            url: `${API_URL.execute.modifyHandover}`,
            data: {
                requirementId: this.state.requirementId,
                handoverUserId: this.state.crcId,
                invSiteId: this.state.site,
                proCompTime: moment(this.state.time).format(this.state.dateFormat),
                comment: this.state.comment
            },
            dataType: 'json',
            doneResult: ( data => {
                    this.setState({
                        visible: false,
                    });
                    this.props.reload();
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    };

    render() {
        const {visible, confirmLoading, site, crcName, crcId, investigationSiteList, city, comment, time, dateFormat} = this.state;
        const initCrcValue = {key: crcName, label: crcName};
        return (
            <Modal
                title="修改交接任务"
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="450px"
                confirmLoading={confirmLoading}
            >
                <Row>
                    <Col span={8} offset={2}>交接人：</Col>
                    <Col span={12}>
                        {crcName}
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>交接中心(中心编号)：</Col>
                    <Col span={12}>
                        <RadioGroup onChange={this.onRadioChange} value={this.state.site}>
                            {
                                investigationSiteList.map((op, i) =>{
                                    return(
                                        <Radio className="radioStyle" value={op.investigationSiteId} city={op.city} key={op.investigationSiteId}>{op.investigationSiteName}({op.investigationSiteCode})</Radio>
                                        );
                                })
                            }
                        </RadioGroup>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>城市：</Col>
                    <Col span={12}>
                        {city}
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>预计完成交接时间：</Col>
                    <Col span={12}>
                        <DatePicker onChange={this.onChangeTime} value={moment(time)} format={dateFormat}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>接收人要求</Col>
                    <Col span={12}>
                        <TextArea value={comment} autosize={{ minRows: 2, maxRows: 6 }} onChange = {this.commentChange} />
                    </Col>
                </Row>
                
            </Modal>
        );
    }
}

export default EditTransfer;
