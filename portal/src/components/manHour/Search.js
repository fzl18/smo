/**
 * edit by Gurongjing on 8.1
 */
import React from "react";
import {Modal, Table} from "antd";
import SideNav from "./SideNav";
import Filter from "./SearchFilter";
import API_URL from "../../common/url";
import ExportUtil from "../../common/ExportUtil";
import AjaxRequest from "../../common/AjaxRequest";
import jquery from 'jquery';

class Search extends React.Component {

    state = {
        searchParams: {},
        data: [],
        pagination: {
            pageSize: 15,
            current: 1,
        },
        loading: false,
        startDate: '',
        endDate: '',
        employeeCode: '',
        userCompellation: '',
        workCityName: '',
        Province: '',
    };


    getColumns = () => {

        const columns = [];

        columns.push({
            title: '工号',
            dataIndex: 'employeeCode',
            key: 'employeeCode',
            sorter: 'true',
            sortType: 'common',
        });
        columns.push({
            title: '姓名',
            dataIndex: 'userCompellation',
            key: 'userCompellation',
            sorter: 'true',
            sortType: 'common'
        });
        columns.push({
            title: '工作城市',
            dataIndex: 'workCityName',
            key: 'workCityName',
            sorter: 'true',
            sortType: 'common'
        });
        columns.push({
            title: '临床项目总工时\\FTE',
            dataIndex: 'durationIsTrue',
            key: 'durationIsTrue',
            sorter: 'true',
            sortType: 'common',
        });
        columns.push({
            title: '非临床项目总工时\\FTE',
            dataIndex: 'durationIsFalse',
            key: 'durationIsFalse',
            sorter: 'true',
            sortType: 'common',
        });
        columns.push({
            title: '总工时\\FTE',
            dataIndex: 'durationTotal',
            key: 'durationTotal',
            sorter: 'true',
            sortType: 'common',
        });
        columns.push({
            title: 'FTE津贴',
            dataIndex: 'fteAllowance',
            key: 'fteAllowance',
            sorter: 'true',
            sortType: 'common'
        });

        columns.push({
            title: '人员产出率',
            dataIndex: 'manOurRate',
            key: 'manOurRate',
            sorter: 'true',
            sortType: 'common'
        });
        columns.push({
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            sort: 'true',
            sortType: 'common',
            render: (text, record, index) => {
                return (
                    record.employeeCode !== '总计' ?
                        <div>
                            <a href={`/front/#/manHour/MyWeekly/${record.id}`}>查看周工时</a>
                            < span className="ant-divider"/>
                            <a href={`/front/#/manHour/FTE/${record.id}`}>查看月度FTE</a>
                        </div>
                        : null
                )
            }
        });

        return columns;
    }

    loadData = (param = {}) => {
        this.loadParam(param);
        this.setState({
            loading: true,
        });
        const options = {
            method: 'get',
            url: `${API_URL.manhour.querySearch}`,
            data: {
                offset: 1,
                limit: 14,
                ...param,
            },
            type: 'json',
            doneResult: ( data => {
                    if (!data.error) {
                        const manHours = data.datas;
                        // const manHours = dataSource;
                        const pagination = {...this.state.pagination};
                        pagination.total = data.totalCount + this.calculatePaginationTotal(data.totalCount, pagination.pageSize);
                        this.setState({
                            data: manHours,
                            pagination,
                            loading: false,
                        });
                    } else {
                        Modal.error({title: data.error});
                    }
                }
            ),
        };
        AjaxRequest.sendRequest(options);

    };

    /**
     *
     * @param total 总数
     * @param pageSize 每页数
     */
    calculatePaginationTotal = (total, pageSize) => {
        if (total % pageSize == 0) {
            return parseInt(total / pageSize);
        } else {
            return parseInt(total / pageSize) + 1;
        }
    };


    handleTableChange = (pagination, filters, sorter) => {
        let sortType,
            direction,
            sort = sort = sorter.field;
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });

        if (!jquery.isEmptyObject(sorter) && sorter.column) {
            sortType = sorter.column.sortType;
        }

        if (sorter.order === 'descend') {
            direction = 'DESC';
        } else {
            direction = 'ASC';
        }

        this.loadData({
            limit: pagination.pageSize - 1,
            offset: pagination.current,
            direction,
            sort,
            sortType,
            ...this.state.searchParams,
            ...filters,
            startDate:this.state.startDate,
            endDate: this.state.endDate,
            employeeCode: this.state.employeeCode,
            userCompellation: this.state.userCompellation,
            workCityName: this.state.workCityName,
            Province: this.state.Province,
            region: this.state.region
        });
    };


    loadParam(param) {
        let searchParams;
        const {
            monthNum,
            investigationCode,
            investigationName,
            investigationSiteCode,
            investigationSiteName
        } = param;

        searchParams = {
            monthNum,
            investigationCode,
            investigationName,
            investigationSiteCode,
            investigationSiteName
        };

        this.setState({
            searchParams
        });
    }

    reset = () => {
        const pagination = {...this.state.pagination, current: 1};
        this.setState({
            pagination,
        });
        this.loadData();
    };

    reload = (params = {},type) => {
        const {pagination} = this.state;
        if(type == "search"){
            pagination.current=1;
            this.setState({
                pagination
            })
        }
        this.loadData({
            offset: pagination.current,
            ...params,
        });
    };

    export = (params) => {
        const options = {
            ...this.state.pagination,
            ...this.state.searchParams,
            ...params,
        };
        const url = `${API_URL.manhour.exportManHourCrccOrCrcm}`;
        ExportUtil.export(options, null, url);
    };

    getDataSource = () => {
        const result = [];
        const {data, pagination} = this.state;
        /* data.map((manhour, i) => {
             result.push({
                 employeeCode: manhour.employeeCode,
                 userCompellation: manhour.userCompellation,
                 workCityName: manhour.workCityName,
                 durationIsTrue: manhour.employeeCode !== '总计' ? manhour.durationIsTrue == null ? '0.0000' : manhour.durationIsTrue + '/' + (manhour.durationIsTrue / 160).toFixed(4) : manhour.durationIsTrueTotal + '/' + (manhour.durationIsTrueTotal / 160).toFixed(4),
                 durationIsFalse: manhour.employeeCode !== '总计' ? manhour.durationIsFalse == null ? '0.0000' : manhour.durationIsFalse + '/' + (manhour.durationIsFalse / 160).toFixed(4) : manhour.durationIsFalseTotal + '/' + (manhour.durationIsFalseTotal / 160).toFixed(4),
                 fteAllowance: manhour.fteAllowance,
                 manOurRate: manhour.employeeCode !== '总计' ? '-' : (manhour.durationIsTrueTotal / ((manhour.durationIsTrueTotal * 1 + manhour.durationIsFalseTotal * 1).toFixed(4))).toFixed(4) * 100 + '%',
                 id: manhour.userId,
                 durationTotal: manhour.employeeCode !== '总计' ? manhour.durationTotal + '/' + (manhour.durationTotal / 160).toFixed(4) : ((manhour.durationIsTrueTotal * 1 + manhour.durationIsFalseTotal * 1).toFixed(4)) + '/' + (((manhour.durationIsTrueTotal * 1 + manhour.durationIsFalseTotal * 1).toFixed(4)) / 160).toFixed(4),
                 key: i,
             })
         });*/

        data.map((manhour, i) => {
            result.push({
                employeeCode: manhour.employeeCode,
                userCompellation: manhour.userCompellation,
                workCityName: manhour.workCityName,
                durationIsTrue: manhour.durationIsTrueTemp,
                durationIsFalse: manhour.durationIsFalseTemp,
                fteAllowance: manhour.fteAllowance,
                manOurRate: manhour.manOurRate,
                id: manhour.userId,
                durationTotal: manhour.durationTotalTemp,
                key: i,
            })
        });
        return result;
    }


    componentDidMount() {
        this.loadData({}, false);
    }

    setParams = (params) => {
        this.setState({
            startDate: params.startDate,
            endDate: params.endDate,
            employeeCode: params.employeeCode,
            userCompellation: params.userCompellation,
            workCityName: params.workCityName,
            Province:params.Province,
            region:params.region
        })

    }

    render() {
        const {sortParams, pagination, loading} = this.state
        return (
            <div className="content">
                <SideNav selectKey="Search"/>
                <div className="main">
                    <div className="T-tit">
                        <Filter
                            reload={this.reload}
                            reset={this.reset}
                            export={this.export}
                            setParams={this.setParams}
                        />

                        <div className="content">
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.getDataSource()}
                                pagination={pagination}
                                key='2123'
                                scroll={{x: 1200}}
                                onChange={this.handleTableChange}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

/*
 <div>
 <MonthPicker defaultValue={moment('2017-08', monthFormat)} format={monthFormat}
 disabledDate={disabledDate} placeholder="Select month"/>
 <br />
 </div>*/

export default Search;
