import React from 'react';
import $ from 'jquery';
import { Modal, Button,Spin } from 'antd';
import API_URL from '../../common/url';
import Fetch from '../../common/FetchIt';
import addSetting from './addSetting';

class PreviewModal extends React.Component {
    state = {
        visible: false,
        daily: {},
        loading:false,
    };

    loadData = (id) => {
        Fetch.get(`${API_URL.daily.view}?workCategoryId=${id}&enterpriseId=1`).then(data => {
            this.setState({
                daily: data.data,
                loading:false,
            });
        });
    };

    show = id => {
        this.setState({
            visible: true,
        });
        if (id) {
            this.loadData(id);
            this.setState({
                loading:true
            })
        }
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };
    render() {
        const { visible } = this.state;
        const {
            enterpriseWorkTypeName,
            enterpriseWorkTypeCode,
            roleCode,
            isCalculateFtePay,
            roleId,
            enterpriseWorkTypeId,
            enterpriseWorkCategoryId,
        } = this.state.daily;
        return (
            <Modal
                title="查看项目信息"
                visible={visible}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="650px"
                footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
            >
                <div className="cont-cont">
                    <Spin spinning={this.state.loading}>
                    <ul className="preview-list">
                        <li className="title"><h4>1.基本信息</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目名称</label>
                                <span className="ui-text">{dailyName}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">项目编号</label>
                                <span className="ui-text">{dailyCode}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目领域</label>
                                <span className="ui-text">{dailyArea}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">申办方</label>
                                <span className="ui-text">{dailySponsor}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">研究药物</label>
                                <span className="ui-text">{dailyMedicine}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">适应症</label>
                                <span className="ui-text">{dailyMalady}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划开始时间</label>
                                <span className="ui-text">{dailyPlanBeginTime}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划结束时间</label>
                                <span className="ui-text">{dailyPlanEndTime}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划中心数</label>
                                <span className="ui-text">{dailySitePlan}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划筛选数</label>
                                <span className="ui-text">{planAmountFilter}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划知情数</label>
                                <span className="ui-text">{planAmountInform}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划随机(入组)数</label>
                                <span className="ui-text">{planAmountRandom}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划访视数</label>
                                <span className="ui-text">{planAmountVisit}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划FTE数</label>
                                <span className="ui-text">{planAmountFTE}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">合同额</label>
                                <span className="ui-text">{dailyContractAmount}</span>
                            </div>
                        </li>
                        <li className="title"><h4>2.项目负责人</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目经理</label>
                                <span className="ui-text">{pmUsers}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">项目管理员</label>
                                <span className="ui-text">{paUsers}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">BD</label>
                                <span className="ui-text">{bdUsers}</span>
                            </div>
                        </li>
                    </ul>
                    </Spin>
                </div>
            </Modal>
        );
    }
}

export default PreviewModal;
