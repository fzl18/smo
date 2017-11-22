/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import { Button, Table, DatePicker } from 'antd';
import moment from 'moment';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import ExportUtil from '../../common/ExportUtil';
import Sider from './SumEffSider';
import AddComment from './AddComment';
import './css/style.less';

const DateFormat = 'YYYY-MM-DD';
const TimeFormat = 'YYYY-MM-DD HH:mm:ss';
const { RangePicker } = DatePicker;

class Summary extends React.Component {
    state = {
        loading: false,
        searchArray: {},
        dataList: [],
        pagination:{
            current:1,
            pageSize:16,
        },
    };

    onChangeRangeTime = value => {
        const { searchArray } = this.state;
        searchArray.begin = value[0].format(DateFormat);
        searchArray.end = value[1].format(DateFormat);
        this.setState({searchArray});
    }

    searchComponent = () => {
        const element = (
            <div className="filter-bar">
                <div className="form-item">
                <label className="ui-label">工作日期</label>
                <RangePicker onChange={this.onChangeRangeTime} className='sum'/>
                </div>
                <div className="form-item">
                <Button type="primary" onClick={this.export}>导出</Button>
                <Button type="primary" onClick={this.search}>搜索</Button>
                </div>
            </div>
        );
        return element;
    };

    search = () => {
        const {pagination} = this.state;
        this.loadData({
            offset: pagination.current,
            limit: pagination.pageSize - 1,
        });
    };

    export = () => {
        const { searchArray, pagination } = this.state;
        let url = `${API_URL.summary.exportSummary}`;
        ExportUtil.export(searchArray, pagination, url);
    }

    getColumns = () => {
        const columnNames = [];
        columnNames.push({
            title: '时间段',
            dataIndex: 'showDate',
            key: 'showDate',
            sorter: true,
            width:160,
        });
        columnNames.push({
            title: '本周工时数',
            dataIndex: 'manHourString',
            key: 'manHourString',
            sorter: true,
        });
        columnNames.push({
            title: '本周FTE数',
            dataIndex: 'fteString',
            key: 'fteString',
            sorter: true,
        });
        columnNames.push({
            title: '本周筛选数',
            dataIndex: 'amountFilter',
            key: 'amountFilter',
            sorter: true,
        });
        columnNames.push({
            title: '本周知情数',
            dataIndex: 'amountInformed',
            key: 'amountInformed',
            sorter: true,
        });
        columnNames.push({
            title: '本周随机(入组)数',
            dataIndex: 'amountRandom',
            key: 'amountRandom',
            sorter: true,
        });
        columnNames.push({
            title: '本周完成访视数',
            dataIndex: 'amountVisit',
            key: 'amountVisit',
            sorter: true,
        });
        columnNames.push({
            title: '本周脱落数',
            dataIndex: 'amountDrop',
            key: 'amountDrop',
            sorter: true,
        });
        columnNames.push({
            title: '本周重大违背数',
            dataIndex: 'amountViolation',
            key: 'amountViolation',
            sorter: true,
        });
        columnNames.push({
            title: '本周SAE数',
            dataIndex: 'amountSae',
            key: 'amountSae',
            sorter: true,
        });
        columnNames.push({
            title: '备注',
            dataIndex: 'comment',
            key: 'comment',
        });
        columnNames.push({
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
        });
        if ((sessionStorage.curRole == "PM" && sessionStorage.siteId == 0) || (sessionStorage.curRole == "CRC" && sessionStorage.siteId > 0)){
            columnNames.push({
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 100,
                render: (text, record) => {
                    return (
                        record.investigationSiteWeekSummaryId > 0 ?
                        <span>
                            <a href="javascript:void(0)" onClick={this.comment.bind(this, record.investigationSiteWeekSummaryId, record.comment)}>填写备注</a>
                        </span> : ''
                    );
                },
            });
        }
        return columnNames;
    };

    comment = (id, comment) => {
        this.addCommentRef.show(id, comment);
    }

    getDataSource = () => {
        const sites = [];
        const {dataList, pagination, total} = this.state;
        dataList.map((dataItem, i) => {
            const showDate = moment(dataItem.date).format(DateFormat) + '~' + moment(dataItem.date).add(6, 'days').format(DateFormat);
            sites.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                investigationSiteWeekSummaryId: dataItem.investigationSiteWeekSummaryId,
                showDate,
                ...dataItem,
                manHourString: dataItem.manHourString+ "h",
                updateTime: dataItem.updateTimeString,
            });
        });
        if(dataList && dataList.length > 0){
            sites.push({
                index:-1,
                investigationSiteWeekSummaryId: 0,
                showDate: '汇总',
                ...total,
            });
        }
        return sites;
    };

    loadData = (params = {}) => {
        this.setState({
            loading: true,
        });
        const { searchArray, pagination } = this.state;
        const options = {
            url: `${API_URL.summary.querySummary}`,
            data: {
                ...params,
                ...searchArray,
            },
            dataType: 'json',
            doneResult: ( res => {
                const totalCount = res.data.dataList.totalCount;
                const pagination = {...this.state.pagination};
                let ct = Number((totalCount / (pagination.pageSize - 1)).toFixed(0)) + (totalCount % (pagination.pageSize - 1) > 0 ? 1 : 0);
                pagination.total = totalCount + ct;
                this.setState({
                    loading: false,
                    dataList: res.data.dataList.datas,
                    total: res.data.total,
                    pagination,
                });
            }),
            errorResult: ( data => {
                this.setState({
                    loading: false,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

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
        let sort = sorter.field;
        if(sorter && sorter.field == 'showDate'){
            sort = 'date'
        } else if(sorter && sorter.field == 'fte'){
            sort = 'manHour'
        }
        this.loadData({
            offset: pager.current,
            limit: pagination.pageSize - 1,
            sort,
            direction: sorter.order == 'descend' ? 'DESC' : 'ASC',
        });
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        this.loadData();
        this.siderRef.selectKey("patients");
    }

    render() {
        const { loading, pagination } = this.state;
        const hasAction = (sessionStorage.curRole == "PM" && sessionStorage.siteId == 0) || (sessionStorage.curRole == "CRC" && sessionStorage.siteId > 0)
        return (
            <div className="content">
                <Sider selectKey='summary'/>
                <div className="main">
                    {this.searchComponent()}
                    <div className="main-content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.investigationSiteWeekSummaryId}
                            loading={loading}
                            scroll={{x: hasAction ? '150%' : '120%'}}
                            pagination={ pagination }
                            onChange={this.handleTableChange}
                        />
                    </div>
                </div>
                <AddComment ref={el => { this.addCommentRef = el; }} reload={this.loadData} />
            </div>
        );
    }
}

export default Summary;
