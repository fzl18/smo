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

const initState = {
    visible: false,
    confirmLoading: false,
    dataList: [],
    site: '',
    siteName: '',
    investigationSiteList: [],
    crcId: '',
    crcName: '',
    time: moment().add(15, 'days').format("YYYY-MM-DD"),
    city: '',
    comment: '',
    dateFormat: 'YYYY-MM-DD'
};

class TransferAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = initState;
    };

    reset = () => {
        this.setState(initState);
    }

    show = () => {
        this.setState({
            visible: true,
        });
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    handleSelectCrc = value => {
        let defaultCity = '';
        let defaultSite;
        if(value.crcSite){
            if(value.crcSite[0]){
                defaultCity = value.crcSite[0]['city'];
                defaultSite = value.crcSite[0]['investigationSiteId'];
            }
        }
        this.setState({
            crcId: value.value,
            crcName: value.text,
            investigationSiteList: value.crcSite,
            city: defaultCity,
            site: defaultSite
        });
    };

    onRadioChange = e => {
        this.setState({
            site: e.target.value,
            city: e.target.city
        });
    };

    handleSubmit = () => {
        if (StringUtil.isNull(this.state.crcId)) {
            message.error('请选择交接人');
            return;
        }
        if (StringUtil.isNull(this.state.site)) {
            message.error('请选择中心');
            return;
        }
        if (StringUtil.isNull(this.state.time)) {
            message.error('请选择时间');
            return;
        }
        const options = {
            url: `${API_URL.execute.addHandover}`,
            data: {
                handoverUserId: this.state.crcId,
                invSiteId: this.state.site,
                proCompTime: this.state.time,
                comment: this.state.comment
            },
            dataType: 'json',
            doneResult: ( data => {
                    this.reset();
                    this.props.reload();
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    };

    onChangeTime =(value) =>{
        const {dateFormat} = this.state;
        const time = value.format(dateFormat);
        this.setState({
            time: time,
        });
    }

    getSiteInfo = (investigationSiteId) => {
        const options = {
            url: `${API_URL.execute.queryBySiteId}`,
            data: {
                investigationSiteId
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    siteName:data.data.site.investigationSiteName,
                    city: data.data.site.city,
                    site: data.data.site.investigationSiteId
                })
            })
        };
        AjaxRequest.sendRequest(options);
    }

    commentChange =(e) => {
        this.setState({comment: e.target.value});
    }

    render() {
        const {visible, confirmLoading, site, siteName, crcName, crcId, investigationSiteList, city, comment} = this.state;
        const initCrcValue = {key: crcName, label: crcName};
        const siteId = sessionStorage.getItem("siteId");
        const siteCode = sessionStorage.investigationSiteCode;
        if(siteId !== "0" && siteName === ""){
            this.getSiteInfo(siteId);
        }
        
        
        return (
            <Modal
                title="新建交接任务"
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
                        <CrcSearchInput placeholder="请在此输入员工号或名字" style={{width: 200}}
                                             handleSelectCrc = {this.handleSelectCrc}
                                             initValue = {initCrcValue}
                                             url = {`${API_URL.execute.queryCRCListByKeywordForHandover}`}
                        />

                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>交接中心(中心编号)：</Col>
                    <Col span={12}>
                        {
                            siteId !== "0" ? 
                            <p>{siteName}({siteCode})</p>
                            :
                            <RadioGroup onChange={this.onRadioChange} value={site}>
                                {
                                    investigationSiteList.map((op, i) =>{
                                        return(
                                            <Radio className="radioStyle" value={op.investigationSiteId} city={op.city} key={op.investigationSiteId}>{op.investigationSiteName}({op.investigationSiteCode})</Radio>
                                            );
                                    })
                                }
                            </RadioGroup>
                        }
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
                        <DatePicker onChange={this.onChangeTime} defaultValue={moment().add(15, 'days')}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>接收人要求</Col>
                    <Col span={12}>
                        <TextArea autosize={{ minRows: 2, maxRows: 6 }} onChange={this.commentChange} value={comment} />
                    </Col>
                </Row>
                
            </Modal>
        );
    }
}

export default TransferAdd;