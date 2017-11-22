import $ from '../../common/AjaxRequest';
import React from 'react';
import jquery from 'jquery';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import PlanFilter from './PlanFilter';
import PreviewModal from './PreviewModal';
import UserSider from './UserSider';
import moment from 'moment';

class UserPlan extends React.Component {
    state = {
        sortParams: {},
        searchParams: {},
        data: [],
        pagination: {
            pageSize: 15,
            current: 1,
        },
        loading: false,
    };

    loadData = (params = {}) => {
        this.setState({
            loading: true,
        });
        // this.loadDataParam(params);
        const options ={
            method: 'POST',
            url: `${API_URL.user.queryEmployeeByCond}`,
            data: {
                offset: 1,
                limit: 15,
                ...params,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const pagination = { ...this.state.pagination };
                    pagination.total = data.data.employeeList.totalCount;
                    this.setState({
                        loading: false,
                        data: data.data.employeeList.datas,
                        pagination,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            },errorResult: d => {
                this.setState({
                    loading: false,
                });
            }
        }
        $.sendRequest(options)
    }

    loadDataParam = params => {
        // let sortParams;
        let searchParams;
        const {
            direction,
            sort,
            sortType,
            investigationCode,
            investigationName,
            area,
            sponsor,
            conAmount,
            conAmountSymbol,
        } = params;

        sortParams = {
            direction,
            sort,
            sortType,
        };

        searchParams = {
            investigationCode,
            investigationName,
            area,
            sponsor,
            conAmount,
            conAmountSymbol,
        };

        this.setState({
            sortParams,
            searchParams,
        });
    }

    reload = (params = {}, type) => {
        const newParams = {};
        if(type == "search"){
            newParams.searchParams = params;
            newParams.pagination = { ...this.state.pagination, current: 1 };
        }
        this.setState({
            ...newParams
        },function(){
            const { pagination,searchParams,sortParams } = this.state;
            this.loadData({
                offset: pagination.current,
                ...sortParams,
                ...searchParams,
            });
        }) 
    }
    

    reset = () => {
        const pagination = { ...this.state.pagination, current: 1 };
        this.setState({
            pagination,
        });
        this.loadData();
    }

    /**
     * 标记完成与取消完成
     * @param id
     * @param status COMPLETED OR UNDERWAY
     */
    // updateStatus = (id, status) => {
    //     $.ajax({
    //         method: 'get',
    //         url: `${API_URL.investigation.updateStatus}?investigationId=${id}&status=${status}`,
    //     }).done(data => {
    //         if (!data.error) {
    //             message.success('标记完成');
    //             this.reload();
    //         } else {
    //             Modal.error({title: data.error});
    //         }
    //     });
    // }

    handleTableChange = (pagination, filters, sorter) => {
        let sortType,
            direction,
            sort = sort = sorter.field;
        const pager = { ...this.state.pagination };
        if (pager.current == pagination.current){
            pager.current = 1;
                //排序则页码为1
        } else {
            pager.current = pagination.current;
                //获取当前页
        }
        
        if (!jquery.isEmptyObject(sorter) && sorter.column) {
            sortType = sorter.column.sortType;
        }

        if (sorter.order === 'descend') {
            direction = 'DESC';
        } else {
            direction = 'ASC';
        }
        this.setState({
            pagination: pager,//设置新的分页信息
            sortParams: {//设置排序信息
                direction,
                sort,
                sortType
            }
        });
    
        this.loadData({
            limit: pagination.pageSize,
            offset: pager.current,
            direction,
            sort,
            sortType,
            ...this.state.searchParams,
            ...filters,
        });
    }

    getColumns = () => [{
    //     title: '序号',
    //     dataIndex: 'index',
    //     key: 'index',
    //     fixed: 'left',
    //     width: 40,
    // }, {
        title: '工号',
        dataIndex: 'employeeCode',
        key: 'employeeCode',
        fixed: 'left',
        width: 60,
         sorter: true,
        // sortType: 'common',
    }, {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        fixed: 'left',
        width: 80,
        sorter: true,
        // sortType: 'common',
    }, {
        title: '职位/级别',
        dataIndex: 'positionName',
        key: 'positionName',
        fixed: 'left',
         width: 170,
        sorter: true,
        // sortType: 'common',
    }, {
        title: '项目领域',
        dataIndex: 'investigationArea',
        key: 'investigationArea',
        sorter: true,
        // sortType: 'common',
    }, {
        title: '项目编号',
        dataIndex: 'investigationCode',
        key: 'investigationCode',
         sorter: true,
        // sortType: 'common',
    }, {
        title: '项目名称',
        dataIndex: 'investigationName',
        key: 'investigationName',
         sorter: true,
        // sortType: 'common',
    }, {
        title: '项目状态',
        dataIndex: 'investigationStatus',
        key: 'investigationStatus',
        // sorter: true,
        // sortType: 'common',
        render: (text, record) => {
            let status;
            if (record.investigationStatus === 'DISCUSSING') {
                status = '洽谈中';
            } else if (record.investigationStatus === 'PREPARING') {
                status = '准备中';
            } else if (record.investigationStatus === 'UNDERWAY') {
                status = '进行中';
            } else if (record.investigationStatus === 'COMPLETED') {
                status = '已完成';
            } else if (record.investigationStatus === 'DELETED') {
                status = '已删除';
            } else {
                status = '未知';
            }
            return (
                <span>{status}</span>
            );
        },
    }, {
        title: '中心编号',
        dataIndex: 'investigationSiteCode',
        key: 'investigationSiteCode',
         sorter: true,
        // sortType: 'common',
    }, {
        title: '中心名称',
        dataIndex: 'investigationSiteName',
        key: 'investigationSiteName',
        sorter: true,
        // sortType: 'common',
    }, {
        title: '科室',
        dataIndex: 'departmentName',
        key: 'departmentName',
        sorter: true,
    }, {
        title: '中心启动时间',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: true,
    }, {
        title: '累计工时',
        dataIndex: 'totalManHour',
        key: 'totalManHour',
        sorter: true,
    }, {
        title: '上月工时',
        dataIndex: 'lastMonthManHour',
        key: 'lastMonthManHour',
        sorter: true,
    }]

    getDataSource = () => {
        const investigations = [];
        const { data, pagination } = this.state;

        data.map((investigation, i) => {
            investigations.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                id: investigation.userId,
                userName:investigation.user.userName,
                employeeCode:investigation.user.employeeCode,
                positionName:investigation.user.positionName,
                investigationArea:investigation.investigation.investigationArea,
                investigationCode:investigation.investigation.investigationCode,
                investigationName:investigation.investigation.investigationName,
                investigationStatus:investigation.investigation.investigationStatus,
                investigationSiteCode:investigation.investigationSite.investigationSiteCode,
                investigationSiteName:investigation.investigationSite.investigationSiteName,
                departmentName:investigation.investigationSite.departmentName,
                startTime: investigation.investigationSite.startTime ?
                    investigation.investigationSite.startTime.substr(0,10) : '',                    
                totalManHour:investigation.manHour,
                lastMonthManHour:investigation.lastMonthManHour,
            });
        });
        return investigations;
    }

    /* getStatus (investigationStatus){
     return 'DISCUSSING' != investigationStatus ? 'PREPARING' != investigationStatus ? 'UNDERWAY' != investigationStatus ?
     'COMPLETED' != investigationStatus ? 'DELETED' != investigationStatus ? "未知" : "已删除" : "已完成" : "进行中" : "准备中" : "洽谈中";
     }*/


    showPreviewModal = id => {
        this.previewModalRef.show(id);
    }

    showCreateModal = id => {
        this.createModalRef.show(id);
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        const { loading, pagination, sortParams} = this.state;
        return (
            <div className="content">
                <UserSider selectKey='UserPlan' ref={el => {this.siderRef = el;}} />
                <div className="main">
                    <div className="main-content">
                        <div>
                            <PlanFilter
                                showCreateModal={this.showCreateModal}
                                sortParams={{}}
                                reload={this.reload}
                                reset={this.reset}
                                ref={el => {this.filterRef = el;}}
                            />
                        </div>
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.id}
                            loading={loading}
                            scroll={{ x: 800 }}
                            onChange={this.handleTableChange}
                            pagination={pagination}
                            rowClassName={(record, index) => {
                                if(record.investigationStatus === 'UNDERWAY'){
                                    return "blue-bkg";
                                }else if(record.investigationStatus === 'COMPLETED'){
                                    return "grey-bkg";
                                }
                            }}
                        />
                    </div>
                </div>
                <PreviewModal ref={el => { this.previewModalRef = el; }} />                
            </div>
        );
    }
}


export default UserPlan;
