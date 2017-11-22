import React from 'react';
import moment from 'moment';
import $ from '../../common/AjaxRequest';
import { Modal, Button, Spin } from 'antd';
import API_URL from '../../common/url';
import Fetch from '../../common/FetchIt';

class PreviewModal extends React.Component {

    state = {
        visible: false,
        investigation: {},
        loading: false,
    };

    loadData = (id) => {
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
                    loading: false,
                });
            }
        }
        $.sendRequest(options)


        // Fetch.get(`${API_URL.investigation.view}?investigationId=${id}`).then(data => {
        //     this.setState({
        //         investigation: data.investigation,
        //     });
        // });
    };

    show = id => {
        this.setState({
            visible: true,
        });
        if (id) {
            this.loadData(id);
            this.setState({
                loading: true,
            })
        }
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    getBDUsers = userList => {
        let bdUsers = '';
        if (userList != undefined && userList != null && userList.length > 0){
            userList.map( val => {
                bdUsers = bdUsers + val.userName + ';';
            });
        }
        return bdUsers;
    };

    render() {
        const { visible } = this.state;
        const {
            investigationName,
            investigationCode,
            investigationArea,
            investigationSponsor,
            investigationMedicine,
            investigationMalady,
            investigationPlanBeginTime,
            investigationPlanEndTime,
            investigationSitePlan,
           
            planAmountVisit,
            planAmountFTE,
            investigationContractAmount,
            pmUserList,
            paUserList,
            bdUserList,
            investigationRandom,
        } = this.state.investigation;
        let  planAmountFilter, planAmountInform, planAmountRandom;
        const investigation = this.state.investigation;
        if(investigation.planList){
                investigation.planList.map((plan, j) =>{
                    if(plan.investigationPlanType == 'Type_Filter'){
                        planAmountFilter = plan.planAmount;
                    }
                    else if(plan.investigationPlanType == 'Type_Informed'){
                        planAmountInform = plan.planAmount;
                    } 
                    else if(plan.investigationPlanType == 'Type_Random'){
                        planAmountRandom = plan.planAmount;
                    } 
                })
            }

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
                                <span className="ui-text">{investigationName}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">项目编号</label>
                                <span className="ui-text">{investigationCode}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目领域</label>
                                <span className="ui-text">{investigationArea}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">申办方</label>
                                <span className="ui-text">{investigationSponsor}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">研究药物</label>
                                <span className="ui-text">{investigationMedicine}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">适应症</label>
                                <span className="ui-text">{investigationMalady}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划开始时间</label>
                                <span className="ui-text">{investigationPlanBeginTime}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划结束时间</label>
                                <span className="ui-text">{investigationPlanEndTime}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划中心数</label>
                                <span className="ui-text">{investigationSitePlan ? `${investigationSitePlan}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划知情数</label>
                                <span className="ui-text">{planAmountInform ? `${planAmountInform}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划筛选数</label>
                                <span className="ui-text">{planAmountFilter ? `${planAmountFilter}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">计划随机(入组)数</label>
                                <span className="ui-text">{planAmountRandom ? `${planAmountRandom}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划访视数</label>
                                <span className="ui-text">{planAmountVisit ? `${planAmountVisit}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','): 0}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">合同FTE数</label>
                                <span className="ui-text">{planAmountFTE ? `${planAmountFTE}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','): 0}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">合同额</label>
                                <span className="ui-text">{investigationContractAmount ? `${investigationContractAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0} 元</span>
                            </div>
                        </li>
                        <li className="title"><h4>2.项目负责人</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目经理</label>
                                <span className="ui-text">{this.getBDUsers(pmUserList)}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">项目管理员</label>
                                <span className="ui-text">{this.getBDUsers(paUserList)}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">BD</label>
                                <span className="ui-text">{this.getBDUsers(bdUserList)}</span>
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
