/**
 * Created by casteloyee on 2017/7/15.
 */
import React from 'react';
import {Popconfirm, Modal, Button, Row, Col, DatePicker, InputNumber} from 'antd';
import moment from 'moment';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
const {MonthPicker} = DatePicker;
const monthFormat = 'YYYY-MM';

class SitePlanModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            statisticalType: '',
            siteId: '',
            title: '',
            siteCode: '',
            siteName: '',
            sitePlanAmount: '',
            sitePlanIsEdit: false,
            siteMonthlyPlan: [],
            monthlyPlan: '',
        };
    };

    show = (statisticalType, siteId) => {
        if ('Type_Filter' == statisticalType){
            this.setState({
                title: '设置中心筛选计划',
            });
        }
        if ('Type_Informed' == statisticalType){
            this.setState({
                title: '设置中心知情计划',
            });
        }
        if ('Type_Random' == statisticalType){
            this.setState({
                title: '设置中心随机(入组)计划',
            });
        }
        this.setState({
            visible: true,
            statisticalType,
            siteId,
        });
        this.loadData(siteId, statisticalType);
    };

    hide = () => {
        this.setState({
            visible: false,
        });
        this.props.reload();
    };

    loadData = (siteId, statisticalType) => {
        const options = {
            url: `${API_URL.plan.querySitePlanData}`,
            data: {
                statisticalType,
                invSiteId: siteId,
            },
            dataType: 'json',
            doneResult: ( data => {
                    const { site, sitePlan, monthlySitePlan } = data.data;
                    const siteMonthlyPlan = [];
                    monthlySitePlan.map((monthlyPlan, i) => {
                        let ym = monthlyPlan.year + '.' + monthlyPlan.month;
                        siteMonthlyPlan.push({
                            yearMonth: ym,
                            year: monthlyPlan.year,
                            month: monthlyPlan.month,
                            planAmount: monthlyPlan.planAmount,
                            editing: false,
                        });
                    });
                    this.setState({
                        loadingColumns: false,
                        loadingData: false,
                        sitePlanAmount: sitePlan ? sitePlan.planAmount : '',
                        siteMonthlyPlan,
                        siteCode: site.investigationSiteCode,
                        siteName: site.investigationSiteName,
                    });
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    };

    onInputPlanAmount = value => {
        this.setState({
            sitePlanAmount: value,
        });
    };

    onInputMonthlyPlanAmount = (i, value) => {
        const { siteMonthlyPlan } = this.state;
        siteMonthlyPlan[i].planAmount = value;
        this.setState({
            siteMonthlyPlan,
        });
    };

    editSitePlan = () => {
        const { sitePlanIsEdit, statisticalType, siteId, sitePlanAmount } = this.state;
        if (sitePlanIsEdit){
            // 保存
            const options = {
                url: `${API_URL.plan.saveSitePlan}`,
                data: {
                    invSiteId: siteId,
                    planAmount: sitePlanAmount,
                    statisticalType,
                },
                dataType: 'json',
                doneResult: ( dt => {
                    this.setState({
                        sitePlanIsEdit: false,
                    });
                }),
            };
            AjaxRequest.sendRequest(options);
        } else {
            this.setState({
                sitePlanIsEdit: true,
            });
        }
    };

    saveDefinePlan = row => {
        const { siteMonthlyPlan, siteId, statisticalType } = this.state;
        const monthlyPlan = siteMonthlyPlan[row];
        if (monthlyPlan.editing){
            // 保存
            const options = {
                url: `${API_URL.plan.saveSiteMonthlyPlan}`,
                data: {
                    invSiteId: siteId,
                    year: monthlyPlan.year,
                    month: monthlyPlan.month,
                    planAmount: monthlyPlan.planAmount,
                    statisticalType,
                },
                dataType: 'json',
                doneResult: ( dt => {
                    monthlyPlan.editing = false;
                    this.setState({
                        siteMonthlyPlan,
                    });
                }),
            };
            AjaxRequest.sendRequest(options);
        } else {
            monthlyPlan.editing = true;
            this.setState({
                siteMonthlyPlan,
            });
        }
    };


    render() {
        const { visible, title, siteMonthlyPlan, sitePlanIsEdit } = this.state;
        return (
            <Modal
                title={title}
                visible={visible}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="600px"
                footer={[
                    <Button key="submit" type="primary" size="large" onClick={this.hide}>
                        确定
                    </Button>,
                ]}
            >
            
                <Row>
                    <Col span={3} offset={2}>中心编号：</Col>
                    <Col span={4}>{this.state.siteCode}</Col>
                    <Col span={3} offset={2}>中心名称：</Col>
                    <Col span={7}>{this.state.siteName}</Col>
                </Row>

                <div className='box'>
                <div className='bar'></div>
                <div className='table'>
                <Row type="flex" justify="space-around" align="bottom" className='row1'>
                    <Col span={4} offset={4} style={{paddingBottom:8}}>总计划数</Col>
                    <Col span={16}>
                        <Row>
                            <Col span={10}>时间</Col>
                            <Col span={6}>计划数</Col>
                            <Col span={8}>操作</Col>
                        </Row>
                        <Row>
                            <Col span={10}>-</Col>
                            <Col span={6}><InputNumber disabled={!sitePlanIsEdit} value={this.state.sitePlanAmount} onChange={this.onInputPlanAmount} /></Col>
                            <Col span={8}><a href="javascript:void(0)" onClick={this.editSitePlan}>{sitePlanIsEdit == true ? '保存' : '修改'}</a></Col>
                        </Row>
                    </Col>
                </Row>
                <Row type="flex" justify="space-around" align="top" className='row2'>
                    <Col span={4} offset={4}>
                        <label>每月计划</label>
                    </Col>
                    <Col span={16}>
                        {
                            siteMonthlyPlan.map((monthlyPlan, i) => (
                                <Row key={i}>
                                    <Col span={10}>{monthlyPlan.yearMonth}</Col>
                                    <Col span={6}><InputNumber disabled={!monthlyPlan.editing} value={monthlyPlan.planAmount} onChange={this.onInputMonthlyPlanAmount.bind(this, i)} /></Col>
                                    <Col span={8}>
                                        <a href="javascript:void(0)" onClick={() => this.saveDefinePlan(i)}>{monthlyPlan.editing == true ? '保存' : '修改'}</a>
                                    </Col>
                                </Row>
                            ))
                        }
                    </Col>
                </Row>
            </div>
        </div>

            </Modal>
        );
    }
}

export default SitePlanModal;
