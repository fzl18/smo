/**
 * Created by casteloyee on 2017/7/14.
 */
import React from 'react';
import {Popconfirm, Modal, Button, Row, Col, DatePicker, InputNumber} from 'antd';
import moment from 'moment';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import Sider from './PlanSider';
import './style/plan.less';

const {MonthPicker} = DatePicker;
const monthFormat = 'YYYY-MM';


class Investigation extends React.Component {
    state = {
        loading: false,
        title: '',
        plan: {},
        monthlyPlan: [],
        planIndex: 1,
        invPlanIsEdit: false,/*整体计划是否处于编辑状态*/
    };

    getTitle = statisticalType => {
        if ('Type_Filter' == statisticalType) {
            this.setState({
                title: '项目筛选计划',
            });
        } else if ('Type_Informed' == statisticalType) {
            this.setState({
                title: '项目知情计划',
            });
        } else if ('Type_Random' == statisticalType) {
            this.setState({
                title: '项目随机(入组)计划',
            });
        }
    };

    loadData = statisticalType => {
        this.setState({
            loadingData: true,
        });
        const options = {
            url: `${API_URL.plan.invDataList}`,
            data: {
                statisticalType,
            },
            dataType: 'json',
            doneResult: ( data => {
                    const { monthlyPlan, planIndex } = this.state;
                    if (monthlyPlan && monthlyPlan.length > 0) {
                        monthlyPlan.splice(0, monthlyPlan.length);
                    }
                    let curIndex = planIndex;
                    data.data.monthlyPlan.map((item, i) => {
                        monthlyPlan.push({
                            planIndex: curIndex,
                            investigationMonthlyPlanId: item.investigationMonthlyPlanId,
                            yearMonth: moment(item.year*100+item.month, "YYYYMM"),
                            planAmount: item.planAmount,
                            monthlyPlanIsEditing: false,
                        });
                        curIndex = curIndex + 1;
                    });
                    this.setState({
                        loadingData: false,
                        plan: data.data.plan,
                        monthlyPlan,
                        planIndex: curIndex,
                    });
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    };

    componentDidMount() {
        const {statisticalType} = this.props.match.params;
        this.getTitle(statisticalType);
        this.setState({
            statisticalType,
        });
        this.loadData(statisticalType);
    };

    componentWillReceiveProps(nextProps) {
        const {statisticalType} = nextProps.match.params;
        this.getTitle(statisticalType);
        this.setState({
            statisticalType,
        });
        this.loadData(statisticalType);
    };

    editInvPlan = () => {
        const { invPlanIsEdit, plan } = this.state;
        const { statisticalType } = this.props.match.params;
        if (invPlanIsEdit){
            // 保存
            const options = {
                url: `${API_URL.plan.modifyPlan}`,
                data: {
                    statisticalType,
                    planAmount: plan.planAmount,
                },
                dataType: 'json',
                doneResult: ( dt => {

                        this.setState({
                            invPlanIsEdit: false,
                        });
                    }
                ),
            };
            AjaxRequest.sendRequest(options);
        } else {
            this.setState({
                invPlanIsEdit: true,
            });
        }
    };

    onSelectMonth = (planIndex, moment) => {
        const {monthlyPlan} = this.state;
        monthlyPlan.map((plan, i) => {
            if (plan.planIndex == planIndex) {
                plan.yearMonth = moment;
            }
        });
        this.setState({
            monthlyPlan,
        });
    };

    onInputPlanAmount = value => {
        const { plan } = this.state;
        plan.planAmount = value;
        this.setState({
            plan,
        });
    };

    onInputMonthPlan = (planIndex, value) => {
        const {monthlyPlan} = this.state;
        monthlyPlan.map((plan, i) => {
            if (plan.planIndex == planIndex) {
                plan.planAmount = value;
            }
        });
        this.setState({
            monthlyPlan,
        });
    };

    getTotalAmount = () => {
        const {monthlyPlan} = this.state;
        let totalAmount = 0;
        monthlyPlan.map((plan, i) => {
            if(plan.planAmount){
                totalAmount += plan.planAmount;
            }
        });
        return (
            <label>{totalAmount}</label>
        );
    };

    getLastVal = () => {
        const {monthlyPlan} = this.state;
        const lastVal = {
            lastMonth: moment().add("month",-1),
            planAmount: ''
        }
        if(monthlyPlan.length){
            monthlyPlan.map((val,index) => {
                if(val.yearMonth){
                    lastVal.lastMonth = val.yearMonth
                }
                lastVal.planAmount = val.planAmount
            })
        }
        return lastVal;
    }


    addMonthly = () => {
        const { monthlyPlan, planIndex } = this.state;
        const lastVal = this.getLastVal();
        monthlyPlan.push({
            planIndex,
            yearMonth: moment(lastVal.lastMonth).add("month",1),
            planAmount: lastVal.planAmount,
            monthlyPlanIsEditing: true,
        });
        this.setState({
            monthlyPlan,
            planIndex: planIndex + 1,
        });
    };

    saveDefinePlan = planIndex => {
        const { monthlyPlan } = this.state;
        const { statisticalType } = this.props.match.params;
        monthlyPlan.map((plan, i) => {
            if (plan.planIndex == planIndex) {
                if (plan.monthlyPlanIsEditing){
                    if (plan.yearMonth == null || plan.yearMonth == undefined) {
                        Modal.error({title: '计划时间为空或无效'});
                        return;
                    }
                    if (plan.planAmount == null || plan.planAmount == undefined || plan.planAmount <= 0) {
                        Modal.error({title: '计划数为空或无效'});
                        return;
                    }
                    if (plan.investigationMonthlyPlanId && plan.investigationMonthlyPlanId > 0){
                        // 修改保存
                        const options = {
                            url: `${API_URL.plan.modifyMonthlyPlan}`,
                            data: {
                                year: plan.yearMonth.year(),
                                month: plan.yearMonth.month() + 1,
                                statisticalType,
                                planAmount: plan.planAmount,
                            },
                            dataType: 'json',
                            doneResult: ( dt => {
                                    plan.monthlyPlanIsEditing = false;
                                    this.setState({
                                        monthlyPlan,
                                    });
                                }
                            ),
                        };
                        AjaxRequest.sendRequest(options);
                    } else {
                        // 新建保存
                        const options = {
                            url: `${API_URL.plan.addMonthlyPlan}`,
                            data: {
                                year: plan.yearMonth.year(),
                                month: plan.yearMonth.month() + 1,
                                statisticalType,
                                planAmount: plan.planAmount,
                            },
                            dataType: 'json',
                            doneResult: ( dt => {
                                    plan.monthlyPlanIsEditing = false;
                                    this.setState({
                                        monthlyPlan,
                                    });
                                }
                            ),
                        };
                        AjaxRequest.sendRequest(options);
                    }
                } else {
                    plan.monthlyPlanIsEditing = true;
                    this.setState({
                        monthlyPlan,
                    });
                }
                return;
            }
        });
    };

    delDefinePlan = planIndex => {
        const { monthlyPlan } = this.state;
        monthlyPlan.map((plan, i) => {
            if (plan.planIndex == planIndex) {
                // 删除
                if (plan.investigationMonthlyPlanId && plan.investigationMonthlyPlanId > 0){
                    const { statisticalType } = this.props.match.params;
                    const options = {
                        url: `${API_URL.plan.deleteMonthlyPlan}`,
                        data: {
                            statisticalType,
                            year: plan.yearMonth.year(),
                            month: plan.yearMonth.month() + 1,
                        },
                        dataType: 'json',
                        doneResult: ( data => {
                                monthlyPlan.splice(i, 1);
                                this.setState({
                                    monthlyPlan,
                                });
                            }
                        ),
                    };
                    AjaxRequest.sendRequest(options);
                } else {
                    monthlyPlan.splice(i, 1);
                    this.setState({
                        monthlyPlan,
                    });
                }
                return;
            }
        });
    };

    export = () => {
        const {statisticalType} = this.state;
        let locationRef = `${API_URL.export.exportInvestigationPlan}` + '?statisticalType=' + statisticalType;
        if (sessionStorage.invId && sessionStorage.invId > 0){
            locationRef += '&curInvId=' + sessionStorage.invId;
        }
        window.location.href = locationRef;
    }

    render() {
        const { statisticalType } = this.props.match.params;
        const { title, monthlyPlan, invPlanIsEdit, plan } = this.state;
        const selKey = statisticalType + '_Inv';
        const showOperator = sessionStorage.curRole == 'PA' || sessionStorage.curRole == 'PM';
        const disabled = sessionStorage.invStatus == 'COMPLETED'; 
        return (
            <div className="content">
                <Sider selectKey={ selKey }/>
                <div className="content-inner">
                    <div className="breadcrumb-bar tac">
                        <h2 className="title">{title}</h2>
                    </div>
                    <div className="filter-bar">
                        <Button type="primary" onClick={this.export}>导出</Button>
                    </div>
                    <div className='box'>
                        <div className='bar'></div>
                        <div className='table'>
                            <Row type="flex" justify="space-around" align="bottom" className='row1'>
                                <Col span={4} offset={4} style={{paddingBottom:8}}>总计划数</Col>
                                <Col span={16}>
                                    <Row style={{fontWeight:'bold'}}>
                                        <Col span={10}>时间</Col>
                                        <Col span={6}>计划数</Col>
                                        {
                                            showOperator == true ?
                                                <Col span={8}>操作</Col>
                                             : ''
                                        }
                                    </Row>
                                    <Row>
                                        <Col span={10}>-</Col>
                                        <Col span={6}><InputNumber value={plan.planAmount} disabled={!invPlanIsEdit} onChange={this.onInputPlanAmount} /></Col>
                                        {
                                            showOperator == true ?
                                                <Col span={8}><a href="javascript:void(0)" disabled={disabled}  onClick={this.editInvPlan}>{invPlanIsEdit == true ? '保存' : '修改'}</a></Col>
                                             : ''
                                        }
                                    </Row>
                                </Col>
                            </Row>
                            

                            <Row type="flex" justify="space-around" align="top" className='row2'>
                                <Col span={4} offset={4}>
                             
                                    <label style={{marginBottom:10,display:'block'}}>每月计划</label>
                                    {
                                        showOperator == true ? <Button  disabled={disabled}  type="primary" onClick={this.addMonthly}>添加</Button> : ''
                                    }
                                </Col>
                                <Col span={16}>
                                    {
                                        monthlyPlan.map((plan, i) => (
                                            <Row key={plan.planIndex}>
                                                <Col span={10}>
                                                    <MonthPicker value={plan.yearMonth} onChange={this.onSelectMonth.bind(this, plan.planIndex)}
                                                                 disabled={!plan.monthlyPlanIsEditing} allowClear={false}
                                                                 format={monthFormat}/>
                                                </Col>
                                                <Col span={6}><InputNumber min={1} max={1000000} value={plan.planAmount}
                                                                           disabled={!plan.monthlyPlanIsEditing}
                                                                           onChange={this.onInputMonthPlan.bind(this, plan.planIndex)}/></Col>
                                               {
                                                   showOperator == true ?
                                                       <Col span={8}>
                                                           <a href="javascript:void(0)"  disabled={disabled} onClick={() => this.saveDefinePlan(plan.planIndex)}>{plan.monthlyPlanIsEditing == true ? '保存' : '修改'}</a>
                                                           <span className="ant-divider"/>
                                                           <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.delDefinePlan(plan.planIndex)} okText="确定"
                                                                       cancelText="取消">
                                                               <a href="javascript:void(0)" disabled={disabled} >删除</a>
                                                           </Popconfirm>
                                                       </Col>
                                                    : ''
                                               }
                                            </Row>
                                        ))
                                    }
                                </Col>
                            </Row>
                            <Row type="flex" justify="space-around" align="top" className='row'>
                                <Col span={4} offset={4}>每月合计</Col>
                                <Col span={16}>
                                    <Row>
                                        <Col span={10}></Col>
                                        <Col span={6} >
                                        {this.getTotalAmount()}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Investigation;
