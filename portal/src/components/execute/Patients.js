/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import { DatePicker, Select, Button, Input, Table } from 'antd';
import ExecuteSider from './ExecuteSider';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';
import ExportUtil from '../../common/ExportUtil';
import moment from 'moment';
const DateFormat = 'YYYY-MM-DD';

const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;

class Patients extends React.Component {
    state = {
        loading: false,
        pagination:{
            current:1,
            pageSize:16,
        },
        searchArray: {},
        dataList: [],
    };

    onChangeRangeTime = value => {
        const { searchArray } = this.state;
        searchArray.beginDate = value[0] ? value[0].format(DateFormat) : '';
        searchArray.endDate = value[0] ? value[1].format(DateFormat) : '';
        this.setState({searchArray});
    }

    onChangeSiteCode = e => {
        const { searchArray } = this.state;
        searchArray.investigationSiteCode = e.target.value;
        this.setState({searchArray});
    };

    onChangeSiteName = e => {
        const { searchArray } = this.state;
        searchArray.investigationSiteName = e.target.value;
        this.setState({searchArray});
    };
    
    onChangeInputUser = e => {
        const { searchArray } = this.state;
        searchArray.userKey = e.target.value;
        this.setState({searchArray});
    };

    search = () => {
        const {pagination} = this.state;
        this.setState({
            pagination: { ...this.state.pagination, current: 1 }//重设页码为1
            },function(){
                this.loadData({
                    offset: 1,
                    limit: pagination.pageSize - 1,
                });
            })
        
    };

    export = () => {
        const { searchArray, pagination } = this.state;
        let url = `${API_URL.summary.exportPatientAmount}`;
        ExportUtil.export(searchArray, pagination, url);
    }

    searchComponent = () => {
        const { searchArray } = this.state;
        const element = (
            <div className="filter-bar">
                <div className='crf'>
                    <div className="form-item">
                        <label className="ui-label">工作日期</label>
                        <RangePicker onChange={this.onChangeRangeTime} />
                    </div>
                    {
                        sessionStorage.siteId == 0 &&
                        <div className="form-item">
                            <label className="ui-label">中心编号</label>
                            <Input
                                onChange={this.onChangeSiteCode}
                            />
                        </div>
                    }
                    {
                        sessionStorage.siteId == 0 && 
                        <div className="form-item">
                            <label className="ui-label">中心名称</label>
                            <Input
                                onChange={this.onChangeSiteName}
                            />
                        </div>
                    }
                    {
                        sessionStorage.siteId == 0 &&
                        <div className="form-item">
                            <label className="ui-label">录入者</label>
                            <Input
                                value={searchArray.userKey}
                                onChange={this.onChangeInputUser}
                            />
                        </div>
                    }
                    {
                        sessionStorage.siteId != 0 &&
                        <div className="form-item">
                            <label className="ui-label">录入者</label>
                            <Input
                                value={searchArray.userKey}
                                onChange={this.onChangeInputUser}
                            />
                        </div>
                    }
                    <div className="filter-bar tar">
                        <Button type="primary" onClick={this.export}>导出</Button>
                        <Button type="primary" onClick={this.search}>搜索</Button>
                    </div>
                </div>
            </div>
        );
        return element;
    }

    getColumns = () => {
        const columnNames = [];
        columnNames.push({
            title: '工作日期',
            dataIndex: 'date',
            key: 'date',
            sorter: true,
        });
        columnNames.push({
            title: '录入者',
            dataIndex: 'userCompellation',
            key: 'userCompellation',
            sorter: true,
        });
        if (sessionStorage.siteId == 0){
            columnNames.push({
                title: '中心编号',
                dataIndex: 'investigationSiteCode',
                key: 'investigationSiteCode',
                sorter: true,
            });
            columnNames.push({
                title: '中心名称',
                dataIndex: 'investigationSiteName',
                key: 'investigationSiteName',
                sorter: true,
            });
        }
        columnNames.push({
            title: '筛选数',
            dataIndex: 'filterAmount',
            key: 'filterAmount',
            sorter: true,
        });
        columnNames.push({
            title: '知情数',
            dataIndex: 'informedAmount',
            key: 'informedAmount',
            sorter: true,
        });
        columnNames.push({
            title: '随机(入组)数',
            dataIndex: 'randomAmount',
            key: 'randomAmount',
            sorter: true,
        });
        columnNames.push({
            title: '完成访视数',
            dataIndex: 'visitAmount',
            key: 'visitAmount',
            sorter: true,
        });
        return columnNames;
    };

    getDataSource = () => {
        const sites = [];
        const {dataList, pagination} = this.state;
        dataList.map((dataItem, i) => {
            sites.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                date: dataItem.date ? moment(dataItem.date).format(DateFormat) : '合计',
                userCompellation: dataItem.userCompellation,
                investigationSiteCode: dataItem.investigationSiteCode,
                investigationSiteName: dataItem.investigationSiteName,
                filterAmount: dataItem.filterAmount,
                informedAmount: dataItem.informedAmount,
                randomAmount: dataItem.randomAmount,
                visitAmount: dataItem.visitAmount,
            });     
        });
        return sites;
    };

    loadData = (params = {}) => {
        this.setState({
            loading: true,
        });
        const { searchArray, sort, direction } = this.state;
        const options = {
            url: `${API_URL.summary.queryPatientAmount}`,
            data: {
                sort, direction,
                ...searchArray,
                ...params,
            },
            dataType: 'json',
            doneResult: ( data => {
                const pagination = {...this.state.pagination};
                let ct = Number((data.totalCount / (pagination.pageSize -1)).toFixed(0)) + (data.totalCount % (pagination.pageSize -1) > 0 ? 1 : 0);
                pagination.total = data.totalCount + ct;
                this.setState({
                    loading: false,
                    dataList: data.totalCount > 0 ? data.datas : [],
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
            sort: sorter.field,
            direction: sorter.order == 'descend' ? 'DESC' : 'ASC',
        });
        this.loadData({
            offset: pager.current,
            limit: pagination.pageSize - 1,
            sort: sorter.field,
            direction: sorter.order == 'descend' ? 'DESC' : 'ASC',
        });
    }

    componentDidMount() {
        const {current, pageSize} = this.state.pagination;
        this.loadData({
            offset: current,
            limit: pageSize-1,
        });
    }

    componentWillReceiveProps(nextProps) {
        const {current, pageSize} = this.state.pagination;
        this.loadData({
            offset: current,
            limit: pageSize-1,
        });
        this.siderRef.selectKey("patients");
    }

    render() {
        const { loading, pagination } = this.state;
        return (
            <div className="content">
                <ExecuteSider selectKey='patients' ref={el => {this.siderRef = el;}}  />
                <div className="main">
                    {this.searchComponent()}
                    <div className="main-content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.index}
                            loading={loading}
                            scroll={{x: '100%'}}
                            pagination = {pagination}
                            onChange={this.handleTableChange}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Patients;
