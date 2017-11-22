/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import {message, Breadcrumb, Modal, Button, Table, Input, DatePicker} from "antd";
import SideNav from "./SideNav";
import API_URL from "../../common/url";
import AjaxRequest from "../../common/AjaxRequest";
import ExportUtil from '../../common/ExportUtil';
import jquery from 'jquery';
import moment from "moment";
const {MonthPicker} = DatePicker;

const monthFormat = 'YYYY-MM';

class Report extends React.Component {
    state = {
        loading: false,
        columnList: [],
        dataList: [],
        searchArray: {},
        pagination: {
            pageSize: 16,
            current: 1,
        },
        sorter:{}
    };

    calculatePaginationTotal = (total, pageSize) => {
        if (total % pageSize == 0) {
            return parseInt(total / pageSize);
        } else {
            return parseInt(total / pageSize) + 1;
        }
    };

    loadData =(params = {}) => {
        const {searchArray} = this.state;
        this.setState({
            loading: true
        })
        if(params){
            if(params.offset){
                const {pagination} = this.state;
                this.setState({
                    pagination: {...pagination, current:params.offset},
                })
            }
        }
        const options = {
            method: 'get',
            url: `${API_URL.manhour.queryManHourReport}`,
            data: {
                ...searchArray,
                ...params
            },
            type: 'json',
            doneResult: ( data => {
                const pagination = {...this.state.pagination};
                pagination.total = data.totalCount + this.calculatePaginationTotal(data.totalCount, pagination.pageSize);
                if(params.offset){
                    pagination.current = params.offset;
                }
                this.setState({
                    columnList: data.headers,
                    dataList: data.datas,
                    loading: false,
                    pagination,
                });
            }),
            errorResult:( data => {
                this.setState({
                    loading: false
                });
            })
        };
        AjaxRequest.sendRequest(options);
    }

    componentDidMount() {
        const {pagination} = this.state;
        this.loadData({
            offset: 1,
            limit: pagination.pageSize,
        });
    }

    search = () => {
        const {pagination} = this.state;
        this.loadData({
            offset: 1,
            limit: pagination.pageSize,
        });
    }

    export = () => {
        const { searchArray } = this.state;
        let url = `${API_URL.export.exportManHourReport}`;
        ExportUtil.export(searchArray, null, url);
    }

    getColumns = () => {
        const columns = [];
        const {columnList} = this.state;
        columnList.map((item, i) => {
            if(i < 2){
                columns.push({
                    title: item.name,
                    dataIndex: item.key,
                    key: item.key,
                    fixed: 'left',
                    width:100,
                    sorter:true,
                    sortOrder: this.state.sorter.columnKey === item.key && this.state.sorter.order
                });
            }else if(i == 2){
                columns.push({
                    title: item.name,
                    dataIndex: item.key,
                    key: item.key,
                    sorter:true,
                    sortOrder: this.state.sorter.columnKey === item.key && this.state.sorter.order
                });
            } else {
                columns.push({
                    title: item.name,
                    dataIndex: item.key,
                    key: item.key,
                });
            }
        });
        return columns;
    }

    handleTableChange = (pagination, filters, sorter) =>{
        let sortType,
            direction,
            sort = sort = sorter.field;
        const pager = {...this.state.pagination};
        if(pager.current == pagination.current){
            pager.current = 1;
        } else {
            pager.current = pagination.current;
        }
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
            limit: pager.pageSize,
            offset: pager.current,
            direction,
            sort,
            sortType,
        });
    }

    getWidth = () => {
        const {columnList} = this.state;
        if(columnList && columnList.length > 0){
            return columnList.length * 90;
        }
        return 800;
    }

    getDataSource = () => {
        const result = [];
        const {dataList} = this.state;
        dataList.map((item, i) => {
            result.push({
                key: i,
                ...item,
            });
        });
        return result;
    }

    onChangeMonth = (date, dateString) => {
        const { searchArray } = this.state;
        searchArray.month = dateString;
        this.setState({searchArray});
    }

    onChangeDateBegin =(date, dateString)=> {
        const { searchArray } = this.state;
        searchArray.begin = dateString;
        this.setState({searchArray});
    }

    onChangeDateEnd =(date, dateString)=> {
        const { searchArray } = this.state;
        searchArray.end = dateString;
        this.setState({searchArray});
    }

    onChangeInvestigationCode = e => {
        const { searchArray } = this.state;
        searchArray.investigationCode = e.target.value;
        this.setState({searchArray});
    }

    onChangeInvestigationName = e => {
        const { searchArray } = this.state;
        searchArray.investigationName = e.target.value;
        this.setState({searchArray});
    }

    render() {
        const {pagination, loading} = this.state;
        return (
            <div className="content">
                <SideNav selectKey="Report"/>
                <div className="main">
                    <div className="T-tit">
                        <div className="filter-bar bar2">
                            <div className="form-item">
                                <label htmlFor="" className="ui-label">时间</label>
                                <MonthPicker defaultValue={moment()} format={monthFormat} placeholder="选择月份"
                                 onChange={this.onChangeMonth} />
                            </div>
                            {/* <div className="form-item">
                                <label htmlFor="" className="ui-label">时间</label>
                                <DatePicker defaultValue={moment()} format={monthFormat}
                                            placeholder="选择日期"
                                            onChange={this.onChangeDateBegin} />
                                
                            </div>
                            <div className="form-item"><label htmlFor="" className="ui-label">至</label></div>
                            <div className="form-item">                
                                <DatePicker defaultValue={moment()} format={monthFormat}
                                            placeholder="选择日期"
                                            onChange={this.onChangeDateEnd} />
                            </div> */}
                            <div className="form-item">
                                <label htmlFor="" className="ui-label">项目编号</label>
                                <Input
                                    placeholder="请输入项目编号"
                                    onChange={this.onChangeInvestigationCode}
                                />
                            </div>
                            <div className="form-item">
                                <label htmlFor="" className="ui-label">项目名称</label>
                                <Input
                                    placeholder="请输入项目名称"
                                    onChange={this.onChangeInvestigationName}
                                />
                            </div>
                         
                            <div className="btn" style={{float:'right'}}>
                                <Button type="primary" onClick={this.export}>导出</Button>
                                <Button type="primary" icon="search" onClick={this.search}>搜索</Button>
                            </div>

                        </div>
                        <div className="content">
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.getDataSource()}
                                pagination= {false}
                                loading={loading}
                                scroll={{x:this.getWidth()}}
                                onChange={this.handleTableChange}
                                pagination={pagination}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Report;
