import $ from 'jquery';
import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Table, Input, Icon, Button, Popconfirm, Popover, message, Modal, Breadcrumb, DatePicker } from 'antd';
import API_URL from '../../common/url';
import SearchGroup from '../common/searchGroup/SearchGroup';
import ExecuteSider from './ExecuteSider';
import UserSider from '../user/UserSider'
import store from '../../store';
import './style/list.less';
import TransferAdd from './TransferAdd';
import EditTransfer from './EditTransfer';
import AjaxRequest from '../../common/AjaxRequest';
import TransferFilter from './TransferFilter';
import ProcessModal from '../user/TransferProcessModal';
import RefuseProcessModal from './RefuseProcessModal';
import EmployeeDetailModal from '../member/EmployeeDetailModal';
import ViewReportModal from './ViewReport';
import ViewRefusedModal from './ViewRefusedModal';
import ExportUtil from '../../common/ExportUtil';

class Transfer extends React.Component {
    state = {
        loading: false,
        pagination:{
            current:1,
            pageSize:15,
        },
        dataList: [],
        searchArray: {},
        handoverId:this.props.match ? this.props.match.params.handoverId : '',
    };

    reload = (params = {}) => {
        const { pagination } = this.state;
        let offset;
        if(params.noPage){
            offset = null;
        }else{
            offset = pagination.current;
        }
        this.loadData({
            offset: offset,
            ...params,
        });
    }

    isAssignUser = (assignedUserList) =>{
        const userId = sessionStorage.userId;
        let isAssign = false;
        assignedUserList.map((value,index) => {
            if(value.userId == userId){
                isAssign = true;
            }
        })
        return isAssign;
    }

    export = () => {
        const { searchArray, pagination, sort, direction } = this.state;
        let url = `${API_URL.execute.exportList}`;
        if(sort && direction){
            searchArray.sort = sort;
            searchArray.direction = direction;
        }
        ExportUtil.export(searchArray, pagination, url);
    }

    /**
     * 获取列表数据
     * @param params
     */
    loadData = (params = {}) => {
        this.setState({
            loading: true,
        });
        const { searchArray,handoverId } = this.state;
        const options = {
            url: `${API_URL.execute.queryHandoverList}`,
            data: {
                ...searchArray,
                ...params,
                handoverId,
            },
            dataType: 'json',
            doneResult: ( data => {
                const pagination = {...this.state.pagination};
                pagination.total = data.data.handoverList.totalCount;
                this.setState({
                    loading: false,
                    dataList: data.data.handoverList.totalCount > 0 ? data.data.handoverList.datas : [],
                    pagination,
                    handoverId:'',
                });
            }),
            errorResult: ( data => {
                this.setState({
                    loading: false,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    searchParam = (params = {}) => {
        this.setState({
            searchArray: params
        })
    }

    getColumns = () => {
        const columnNames = [];
        const siteId = sessionStorage.siteId;
        const curRole = sessionStorage.curRole;
        columnNames.push({
            title: '交接编号',
            dataIndex: 'requirementCode',
            key: 'requirementCode',
            sorter: true,
        });
        if(siteId == null || siteId == 0){
            columnNames.push({
                title: '项目编号',
                dataIndex: 'investigationCode',
                key: 'investigationCode',
                sorter: true,
                sortType: 'common',
            })
            columnNames.push({
                title: '项目名称',
                dataIndex: 'investigationName',
                key: 'investigationName',
                sorter: true,
                sortType: 'common',
            })
        }
        //if(siteId == 0){ //去掉限制 bug 9008
            columnNames.push({
                title: '中心编号',
                dataIndex: 'investigationSiteCode',
                key: 'investigationSiteCode',
                sorter: true,
                sortType: 'common',
            })
            columnNames.push({
                title: '中心名称',
                dataIndex: 'investigationSiteName',
                key: 'investigationSiteName',
                sorter: true,
                sortType: 'common',
            })
        //}
        columnNames.push({
            title: '城市',
            dataIndex: 'city',
            key: 'city',
            sorter: true,
            sortType: 'common',
        })
        columnNames.push({
            title: '交接人',
            dataIndex: 'handoverUser',
            key: 'handoverUser',
            sorter: true,
        });
        columnNames.push({
                title: '接收人',
                dataIndex: 'assignedUsers',
                key: 'assignedUsers',
                sorter: false,
                sortType: 'common',
                render: (text, record) => {
                    if(!record.assignedUsers) return;
                    let users = record.assignedUsers.split('//');
                    if (sessionStorage.curRole == "CRC") {
                        return (
                            <span>
                                {
                                    users.map((user,i)=>{
                                        let u = user.split(',');
                                        return(
                                            <span key={user + i}>
                                            {u[2]}{ users.length > 1 ? ';' : '' }</span>
                                        );
                                        
                                    })
                                }                            
                            </span>
                        )
                    }else{
                        return (
                            <span>
                                {
                                    users.map((user,i)=>{
                                        let u = user.split(',');
                                        return(
                                            <a  key={user + i} href="javascript:void(0)" 
                                            onClick={() => this.showEmployeeDetailModalRef(u[0],u[1],u[2])}>
                                            {u[2]}{ users.length > 1 ? ';' : '' }</a>
                                        );
                                        
                                    })
                                }                            
                            </span>
                        )
                    }
                    
                    
                }
            });

        columnNames.push({
            title: '人员要求',
            dataIndex: 'requirementComment',
            key: 'requirementComment',
            sorter: true,
            sortType: 'common',
        })
        columnNames.push({
            title: '发起人',
            dataIndex: 'requireUser',
            key: 'requireUser',
            sorter: true,
            sortType: 'common',
        })
        columnNames.push({
            title: '处理人',
            dataIndex: 'assignUserName',
            key: 'assignUserName',
            sorter: false,
            sortType: 'common',
        })
        columnNames.push({
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                let status;
                if (record.status === 'NEW') {
                    status = '新建';
                } else if (record.status === 'ASSIGNED') {
                    status = '预分配';
                } else if (record.status === 'REASSIGNED') {
                    status = '重新分配';
                } else if (record.status === 'REJECTED') {
                    status = '被拒绝';
                } else if (record.status === 'UNDERWAY') {
                    status = '进行中';
                } else if (record.status === 'RETURNED') {
                    status = '进行中';
                } else if (record.status === 'DELIVERED') {
                    status = '确认中';
                } else if (record.status === 'RECEIVED') {
                    status = '已提交';
                } else if (record.status === 'INACTIVE') {
                    status = '无效的';
                } else if (record.status === 'ACTIVE') {
                    status = '已完成';
                } else {
                    status = record.status;
                }
                return (
                    <span>{status}</span>
                );
            },
        })
        
        columnNames.push({
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 100,
                render: (text, record) => {
                    if (sessionStorage.curRole == "PM") {
                        if(record.status == "NEW"){
                            return (
                                    <span>
                                        <a href="javascript:void(0)" onClick={() => this.handleEdit(record.requirementId)}>修改</a>
                                        <span className="ant-divider"/>
                                        <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.handleDel(record.requirementId)} okText="确定" cancelText="取消">
                                            <a href="javascript:void(0)">删除</a>
                                        </Popconfirm>
                                    </span>
                                );
                        }else if(record.status == "ASSIGNED" || record.status == "REASSIGNED"){
                            return (
                                <span>
                                    <Popconfirm title={'确定要分配吗?'} onConfirm={() => this.confirmProcess(record.requirementId)} okText="确定" cancelText="取消">
                                        <a href="javascript:void(0)">确认分配</a>
                                    </Popconfirm>
                                    <span className="ant-divider" />
                                    <a href="javascript:void(0)" onClick={() => this.refuseProcess(record.requirementId)}>拒绝分配</a>
                                </span>
                            );
                        }else if(record.status == "REJECTED"){
                            return (
                                <span>
                                    -
                                </span>
                            );
                        }else if(record.status == "UNDERWAY" || record.status == "RETURNED" || record.status == "DELIVERED" || record.status == "RECEIVED" || record.status == "ACTIVE"){
                            return (
                                <span>
                                    <a href="javascript:void(0)" onClick={() => this.ViewReport(record.requirementId)}>查看报告</a>
                                </span>
                            )
                        }
                    }else if(sessionStorage.curRole == "CRC"){


                        if(record.handoverUserId == sessionStorage.userId){//用户为交接人
                            if(record.status == "NEW" || record.status == "ASSIGNED" ||record.status == "REJECTED" || record.status == "REASSIGNED"){
                                return (
                                    <span>
                                        -
                                    </span>
                                );
                            }else if(record.status == "RETURNED" || record.status == "UNDERWAY"){
                                return (
                                    <span>
                                    <a href="javascript:void(0)" onClick={() => this.ViewReport(record.requirementId, true)}>填写报告</a>
                                        <span className="ant-divider" />
                                        <a href="javascript:void(0)" onClick={() => this.ViewRefusedRecord(record.requirementId)}>查看打回记录</a>
                                    </span>
                                );
                            }else if(record.status == "DELIVERED" || record.status == "RECEIVED" || record.status == "ACTIVE"){
                                return (
                                    <span>
                                        <a href="javascript:void(0)" onClick={() => this.ViewReport(record.requirementId)}>查看报告</a>
                                    </span>
                                )
                            }
                        }else if(record.assignedUserList !== undefined && this.isAssignUser(record.assignedUserList)){//用户为接收人 //@todo
                            if(record.status == "NEW" || record.status == "ASSIGNED" ||record.status == "REJECTED" ||record.status == "REASSIGNED"){
                                return (
                                    <span>
                                        -
                                    </span>
                                );
                            }else if(record.status == "RETURNED" || record.status == "UNDERWAY"){
                                return (
                                    <span>
                                    <a href="javascript:void(0)" onClick={() => this.ViewReport(record.requirementId)}>查看报告</a>
                                        <span className="ant-divider" />
                                        <a href="javascript:void(0)" onClick={() => this.ViewRefusedRecord(record.requirementId)}>查看打回记录</a>
                                    </span>
                                );
                            }else if(record.status == "DELIVERED" || record.status == "RECEIVED" || record.status == "ACTIVE"){
                                return (
                                    <span>
                                        <a href="javascript:void(0)" onClick={() => this.ViewReport(record.requirementId)}>查看报告</a>
                                    </span>
                                )
                            }
                        }else{
                            return (
                                <span>
                                    -
                                </span>
                            );
                        }
                        
                    }else if(sessionStorage.curRole == "CRCM" || sessionStorage.curRole == "CRCC" || sessionStorage.curRole == "BO"){
                        if(record.status == "NEW"){
                            return (
                                    <span>
                                        {   
                                        curRole === 'CRCC' || curRole === 'CRCM' ? 
                                        (<a href="javascript:void(0)" onClick={() => this.process(record.requirementId)}>处理</a>) :
                                        ('-') }
                                    </span>
                                );
                        }else if (record.status === 'REJECTED') {
                            return (
                                <span>
                                    {   
                                        curRole === 'CRCC' || curRole === 'CRCM' ? 
                                        (<a href="javascript:void(0)" onClick={() => this.process(record.requirementId)}>重新处理</a>) :
                                        ('-') }
                                </span>
                            );
                        }else if(record.status === 'ASSIGNED' || record.status === 'REASSIGNED' ){
                            return (
                                <span>-</span>
                            )
                        }else if(record.status === 'UNDERWAY' || record.status === 'RETURNED' || record.status === 'DELIVERED' || record.status === 'RECEIVED' || record.status === 'ACTIVE'){
                            return (
                                <span>
                                    <a href="javascript:void(0)" onClick={() => this.ViewReport(record.requirementId)}>查看报告</a>
                                </span>
                            )
                        }
                    }else{
                        return (
                            <span>
                                -
                            </span>
                        );
                    }
                },
            });
        return columnNames;
    };

    confirmProcess = id => {
        const options = {
            url: `${API_URL.user.confirmRequirement}?requirementId=${id}`,
            dataType: 'json',
            doneResult: ( dt => {
                    message.success('操作成功');
                    this.reload();
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    }

    refuseProcess = id => {
        this.refuseProcessModalRef.show(id);
    }

    ViewReport = (id, isEdit) => {
        this.viewReportModalRef.show(id, isEdit);
    }

    ViewRefusedRecord = id => {
        this.ViewRefusedModalRef.show(id);
    }

    getDataSource = () => {
        const records = [];
        const {dataList, pagination} = this.state;
        //let key = 0;
        dataList.map((dataItem, i) => {
            records.push({
                key: dataItem.requirementId,
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                requirementCode: dataItem.requirementCode,
                investigationCode : dataItem.site.investigation.investigationCode,
                investigationName : dataItem.site.investigation.investigationName,
                investigationSiteCode: dataItem.site.investigationSiteCode,
                investigationSiteName: dataItem.site.investigationSiteName,
                city: dataItem.site.city,
                handoverUser: dataItem.handoverUser,
                handoverUserId: dataItem.handoverUserId,
                assignedUserList: dataItem.assignedUserList,
                userCompellation: dataItem.userCompellation,
                requirementComment: dataItem.requirementComment,
                requireUser: dataItem.requireUser,
                assignedUsers: dataItem.assignedUsers,
                status: dataItem.status,
                requirementId: dataItem.requirementId,
                assignUserName: dataItem.assignUserName
            });
        });
        return records;
    };

    handleAdd = () => {
        this.transferAddRef.show();
    }

    handleEdit = (ref) => {
        this.editTransferRef.show(ref);
    }

    handleDel = (requirementId) => {
        const options = {
            url: `${API_URL.execute.deleteHandover}`,
            data: {
                requirementId
            },
            dataType: 'json',
            doneResult: ( dt => {
                this.loadData();
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    showEmployeeDetailModalRef = (id,code,name) => {
        this.employeeDetailModalRef.show(id,code,name);
    }

    process = id => {
        this.processModalRef.show(id);
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
        });
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        const { params } = this.props.match;
        const { loading, searchArray, pagination} = this.state;
        const curRole = sessionStorage.curRole;
        return (
            <div className="content">
                
                {this.props.src !== 'User' ? 
                <ExecuteSider selectKey={params.typeName} />
                : <UserSider selectKey='UserTransfer' /> }
                <div className="main">
                    <TransferFilter
                        reload={this.reload}
                        search={this.searchParam}
                        handleAdd = {this.handleAdd}
                        export = {this.export}
                    />

                    <div className="main-content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            loading={loading}
                            scroll={{x: 1200}}
                            onChange={this.handleTableChange}
                            pagination={pagination}
                            rowKey={record => record.requirementId}
                        />
                    </div>

                </div>
                <TransferAdd ref={el => { this.transferAddRef = el; }}
                                reload={this.reload}
                />
                <EditTransfer ref={el => { this.editTransferRef = el; }}
                         reload={this.reload}
                />
                <ProcessModal
                    ref={el => { this.processModalRef = el; }}
                    reload={this.reload}
                    showEmployeeDetailModalRef = {this.showEmployeeDetailModalRef}
                />
                <RefuseProcessModal
                    ref={el => { this.refuseProcessModalRef = el; }}
                    reload={this.reload}
                />
                <EmployeeDetailModal
                    ref={el => { this.employeeDetailModalRef = el; }}
                    reload={this.reload}
                />
                <ViewReportModal
                    ref={el => { this.viewReportModalRef = el; }}
                    reload={this.reload}
                />
                <ViewRefusedModal
                    ref={el => { this.ViewRefusedModalRef = el; }}
                    reload={this.reload}
                />
            </div>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        searchParams: store.executeState.searchParams,
    };
};

export default connect(mapStateToProps)(Transfer);