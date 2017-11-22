import React from 'react';
import { Table, Input, Button } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import Sider from './PlanSider';
import SitePlanModal from "./SitePlanModal";

const initState = {
    loading: false,
    loadingColumns: false,
    loadingData: false,
    title: '',
    dataList: [],
    columns: [],
    searchSiteCode: '',
    searchSiteName: '',
    pagination:{
        current:1,
        pageSize:15,
    },
}

class Site extends React.Component {
    state = initState;

    loadColumns = (params = {}) => {
        this.setState({
            loadingColumns: true,
        });
        const options = {
            url: `${API_URL.plan.invDataList}`,
            data: {
                ...params,
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loadingColumns: false,
                    columns: data.data.monthlyPlan,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    loadData = (params = {}) => {
        this.setState({
            loadingData: true,
        });
        const { searchSiteCode, searchSiteName } = this.state;
        const options = {
            url: `${API_URL.plan.siteDataList}`,
            data: {
                ...params,
                invSiteCode: searchSiteCode,
                invSiteName: searchSiteName,
            },
            dataType: 'json',
            doneResult: ( data => {
                    const pagination = {...this.state.pagination};
                    pagination.total = data.data.sitePlanList.totalCount;
                    this.setState({
                        loadingData: false,
                        dataList: data.data.sitePlanList.datas,
                        pagination,
                    });
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    };

    getColumns = () => {
        const columnNames = [];
        columnNames.push({
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 80,
            fixed: 'left',
        });
        columnNames.push({
            title: '研究中心编号',
            dataIndex: 'investigationSiteCode',
            key: 'investigationSiteCode',
            sorter: true,
            width: 110,
            fixed: 'left',
        });
        columnNames.push({
            title: '中心名称',
            dataIndex: 'investigationSiteName',
            key: 'investigationSiteName',
            sorter: true,
            width: 200,
            fixed: 'left',
        });
        columnNames.push({
            title: '总体计划',
            dataIndex: 'planAmount',
            key: 'planAmount',
            sorter: true,
        });
        columnNames.push({
            title: '每月计划合计',
            dataIndex: 'monthlyPlanTotalAmount',
            key: 'monthlyPlanTotalAmount',
        });
        /*{/!*此处还必须加上每个月的明细*!/}*/
        const { columns } = this.state;
        const disabled = sessionStorage.invStatus == 'COMPLETED';
        columns.map((monthlyPlan, i) => {
            columnNames.push({
                title: monthlyPlan.year + '.' + monthlyPlan.month,
                dataIndex: monthlyPlan.year * 100 + monthlyPlan.month,
                key: monthlyPlan.year * 100 + monthlyPlan.month,
            });
        });
        if(sessionStorage.curRole == 'PM' || sessionStorage.curRole == 'PA'){
            columnNames.push({
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 100,
                render: (text, record) => {
                    return (
                        <span>
                            <a href="javascript:void(0)" disabled={disabled} onClick={() => this.setSitePlan(record.investigationSiteId)}>{sessionStorage.curRole == 'PA' ? '设置' : '调整'}</a>
                        </span>
                    );
                }
            });
        }
        return columnNames;
    };

    setSitePlan = siteId => {
        const { statisticalType } = this.props.match.params;
        this.sitePlanModalRef.show(statisticalType, siteId);
    }

    getDataSource = () => {
        const resList = [];
        const { dataList, pagination } = this.state;
        const startIdx = (pagination.current - 1) * pagination.pageSize;
        dataList.map((plan, i) => {
            const sitePlanObject = {
                index: startIdx + i + 1,
                investigationSiteId: plan.investigationSiteId,
                investigationSiteCode: plan.investigationSite.investigationSiteCode,
                investigationSiteName: plan.investigationSite.investigationSiteName,
                planAmount: plan.planAmount,
                monthlyPlanTotalAmount: plan.monthlyPlanTotalAmount,
            };
            if (plan.monthlyPlanList){
                plan.monthlyPlanList.map((monthlyPlan, j) => {
                    let key = monthlyPlan.year * 100 + monthlyPlan.month;
                    sitePlanObject[key] = monthlyPlan.planAmount;
                });
            }
            resList.push(sitePlanObject);
        });
        return resList;
    };

    getTitle = (statisticalType) => {
        let title = sessionStorage.siteId == 0 ? '各' : '';
        if ('Type_Filter' == statisticalType){
            title += '中心筛选计划';
        }
        else if ('Type_Informed' == statisticalType){
            title += '中心知情计划';
        } else if ('Type_Random' == statisticalType){
            title += '中心随机(入组)计划';
        }
        this.setState({
            title,
        });
    };

    componentDidMount() {
        this.reload(this.props.match.params.statisticalType);
    }

    componentWillReceiveProps (nextProps){
        this.setState({...initState},()=>{
            this.reload(nextProps.match.params.statisticalType);
        })
    }

    reload = (tempStatisticalType) => {
        if (tempStatisticalType == null || tempStatisticalType == undefined) {
            tempStatisticalType = this.props.match.params.statisticalType;
        }

        const {current, pageSize} = this.state.pagination;

        this.setState({statisticalType: tempStatisticalType});
        this.getTitle(tempStatisticalType);
        this.loadColumns({
            statisticalType: tempStatisticalType,
        });
        this.loadData({
            offset: current,
            limit: pageSize,
            statisticalType: tempStatisticalType,
        });
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        if (pager.current == pagination.current){
            pager.current = 1;
        } else {
            pager.current = pagination.current;
        }
        this.setState({
            pagination: pager,
        });
        this.loadData({
            offset: pager.current,
            limit: pagination.pageSize,
            sort: sorter.field,
            direction: sorter.order == 'descend' ? 'DESC' : 'ASC',
            statisticalType: this.state.statisticalType,
        });
    }

    onChangeSiteCode = e => {
        this.setState({searchSiteCode: e.target.value});
    };

    onChangeSiteName = e => {
        this.setState({searchSiteName: e.target.value});
    };

    search = () => {
        this.setState({
            pagination: { ...this.state.pagination, current: 1 }//重设页码为1
        },function(){
            this.loadData({
                offset: 1,
                limit: this.state.pagination.pageSize,
                statisticalType: this.state.statisticalType,
            });
        })
    }

    export = () => {
        const {statisticalType, searchSiteCode, searchSiteName} = this.state;
        const invSiteName = encodeURI(searchSiteName);
        let locationRef = `${API_URL.export.exportSitesPlan}?statisticalType=${statisticalType}&invSiteCode=${searchSiteCode}&invSiteName=${invSiteName}`;
        if (sessionStorage.invId && sessionStorage.invId > 0){
            locationRef += '&curInvId=' + sessionStorage.invId;
        }
        if (sessionStorage.siteId && sessionStorage.siteId > 0){
            locationRef += '&curSiteId=' + sessionStorage.siteId;
        }
        if (sessionStorage.userId && sessionStorage.userId > 0){
            locationRef += '&curUserId=' + sessionStorage.userId;
        }
        window.location.href = locationRef;
    }

    searchComponent = () => {
        const siteId = sessionStorage.getItem('siteId');
        if (siteId == 0) {
            const {searchSiteCode, searchSiteName} = this.state;
            const element = (
                <div className="filter-bar">
                    <div className='form-item'>
                        <label className='ui-label'>中心编号</label>
                        <Input
                            value={searchSiteCode}
                            onChange={this.onChangeSiteCode}
                        />
                    </div>
                    <div className='form-item'>
                        <label className='ui-label'>中心名称</label>
                        <Input
                            value={searchSiteName}
                            onChange={this.onChangeSiteName}
                        />
                    </div>
                    <Button type="primary" onClick={this.search}>搜索</Button>
                    <Button type="primary" onClick={this.export}>导出</Button>                    
                </div>
            );
            return element;
        } else {
            const element = (
                <div className="filter-bar">
                    <Button type="primary" onClick={this.export}>导出</Button>
                </div>
            );
            return element;
        }
    }

    render() {
        const { loadingColumns, loadingData, title, pagination, columns } = this.state;
        const { params } = this.props.match;
        const viewWidth = ((columns != null && columns != undefined ? columns.length : 0) + 6) * 100;
        return (
            <div className="content">
                <Sider selectKey={ params.statisticalType } />
                <div className="main">
                    <div className="breadcrumb-bar tac">
                        <h2 className="title">{title}</h2>
                    </div>
                    {this.searchComponent()}
                    <div className="main-content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.investigationSiteId}
                            loading={loadingColumns || loadingData}
                            pagination={ sessionStorage.siteId == 0 ? pagination : false }
                            scroll={{ x: viewWidth }}
                            onChange={this.handleTableChange}
                        />
                    </div>
                </div>
                <SitePlanModal
                    ref={el => {this.sitePlanModalRef = el;}}
                    reload = {this.reload}
                />
            </div>
        );
    }
}

export default Site;
