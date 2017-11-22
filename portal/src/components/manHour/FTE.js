/**
 * edit by Gurongjing on 8.1
 */
import React from "react";
import {message, Breadcrumb, Modal, Button, Table, DatePicker} from "antd";
import SideNav from "./SideNav";
import Filter from "./MonthFteFilter";
import API_URL from "../../common/url";
import AjaxRequest from "../../common/AjaxRequest";


class FTE extends React.Component {


    state = {
        searchParams: {},
        data: [],

        pagination: {
            pageSize: 15,
            current: 1,
        },
    };

    getColumns = () => {

        const columns = [];

        columns.push({
            title: '序号',
            dataIndex: 'index',
            key: 'index ',
            sort: 'true',
            sortType: 'common'
        });

        columns.push({
            title: '时间',
            dataIndex: 'monthNum',
            key: 'monthNum',
            sort: 'true',
            sortType: 'common'
        });
        columns.push({
            title: '项目编号',
            dataIndex: 'investigationCode',
            key: 'investigationCode',
            sort: 'true',
            sortType: 'common'
        });
        columns.push({
            title: '项目名称',
            dataIndex: 'investigationName',
            key: 'investigationName',
            sort: 'true',
            sortType: 'common'
        });
        columns.push({
            title: '中心编号',
            dataIndex: 'investigationSiteCode',
            key: 'investigationSiteCode',
            sort: 'true',
            sortType: 'common'
        });
        columns.push({
            title: '中心名称',
            dataIndex: 'investigationSiteName',
            key: 'investigationSiteName',
            sort: 'true',
            sortType: 'common'
        });
        columns.push({
            title: '角色',
            dataIndex: 'roleCode',
            key: 'roleCode',
            sort: 'true',
            sortType: 'common'
        });
        columns.push({
            title: '计划FTE',
            dataIndex: 'planFte',
            key: 'planFte',
            sort: 'true',
            sortType: 'common'
        });

        columns.push({
            title: '消耗FTE',
            dataIndex: 'cusmerFte',
            key: 'cusmerFte',
            sort: 'true',
            sortType: 'common'
        });
        columns.push({
            title: 'FTE津贴',
            dataIndex: 'fteAllowance',
            key: 'fteAllowance',
            sort: 'true',
            sortType: 'common'
        });

        return columns;
    }

    loadData = (param = {}) => {
        this.loadParam(param);
        let userId = this.props.match ? this.props.match.params.name :null;
        let options = null;
        if(userId && userId != null){
            options = {
                method: 'get',
                url: `${API_URL.manhour.caculateMonthlyFte}`,
                data: {
                    offset: 1,
                    limit: 15,
                    userId : userId,
                    ...param,
                },
                type: 'json',
                doneResult: ( data => {
                        if (!data.error) {
                            const manHours = data.data;
                            const pagination = {...this.state.pagination};
                            pagination.total = data.totalCount;
                            this.setState({
                                data: manHours,
                                pagination,
                            });
                        } else {
                            Modal.error({title: data.error});
                        }
                    }
                ),
            };
        }else{
            options = {
                method: 'get',
                url: `${API_URL.manhour.caculateMonthlyFte}`,
                data: {
                    offset: 1,
                    limit: 15,
                    ...param,
                },
                type: 'json',
                doneResult: ( data => {
                        if (!data.error) {
                            const manHours = data.data;
                            const pagination = {...this.state.pagination};
                            pagination.total = data.totalCount;
                            this.setState({
                                data: manHours,
                                pagination,
                            });
                        } else {
                            Modal.error({title: data.error});
                        }
                    }
                ),
            };
        }
        AjaxRequest.sendRequest(options);

    }


    loadParam(param) {
        let searchParams;
        const {
            monthNum,
            investigationCode,
            investigationName,
            investigationSiteCode,
            investigationSiteName
        }=param;

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
        const pagination = { ...this.state.pagination, current: 1 };
        this.setState({
            pagination,
        });
        this.loadData();
    }
    reload = (params = {}) => {
        const {pagination} = this.state;
        this.loadData({
            offset: pagination.current,
            ...params,
        });
    }


    getDataSource = () => {
        const result = [];
        const {data, pagination} = this.state;
        let monthIndex = 1;
        data.map((manhour, i) => {
            const result_temp = {};
            if(manhour.manHourId == null || manhour.manHourId == undefined){
                monthIndex = 0;
                if(manhour.isCounting == 'TOTAL'){
                    result_temp["index"] = "总计";
                }else{
                    result_temp["index"] = "月合计";
                }
            }else{
                result_temp["index"] = monthIndex;
            }
            result_temp["monthNum"] = manhour.dateString;
            if(manhour.enterpriseWorkCategoryCode && manhour.enterpriseWorkCategoryCode != null){
                result_temp["investigationCode"] = manhour.enterpriseWorkCategoryCode;
            }else{
                result_temp["investigationCode"] = manhour.investigationCode; 
            }
            if(manhour.enterpriseWorkCategoryName && manhour.enterpriseWorkCategoryName != null){
                result_temp["investigationName"] = manhour.enterpriseWorkCategoryName;
            }else{
                result_temp["investigationName"] = manhour.investigationName; 
            } 
            result_temp["investigationSiteCode"] = manhour.investigationSiteCode;
            result_temp["investigationSiteName"] = manhour.investigationSiteName;
            result_temp["roleCode"] = manhour.roleCode;
            result_temp["planFte"] = manhour.planFte;
            result_temp["cusmerFte"] = manhour.cusmerFte;
            if(manhour.manHourId == null || manhour.manHourId == undefined){

                result_temp["fteAllowance"] =  Number(manhour.monthFteAllowance).toFixed(2);
            }else{
                result_temp["fteAllowance"] = '-';
            }


            monthIndex += 1;
            result.push(result_temp);
        });
        return result;
    }

    componentDidMount() {
        this.loadData({}, false);
    }

    render() {
        const {sortParams, pagination} = this.state
        return (
            <div className="content">
                <SideNav selectKey="monthFte"/>
                <div className="main">
                    <div className="T-tit">
                        <Filter
                            reload={this.reload}
                            reset={this.reset}
                            showback={this.props.match ? true:false}
                        />                        

                        <div className="content">
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.getDataSource()}
                                pagination= {false}
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

export default FTE;
