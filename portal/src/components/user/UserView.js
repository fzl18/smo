import $ from '../../common/AjaxRequest';
import React from 'react';
import jquery from 'jquery';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './UserFilter';
import PreviewModal from './PreviewModal';
import UserSider from './UserSider';

class UserView extends React.Component {
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
            url: `${API_URL.user.queryEmployeeList}`,
            data: {
                offset: 1,
                limit: 15,
                ...params,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const pagination = { ...this.state.pagination };
                    const eList = data.data.employeeList;
                    pagination.total = eList.totalCount;
                    this.setState({
                        loading: false,
                        data: eList.datas ,
                        pagination,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
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

    reload = (params = {},search) => {
        const { pagination } = this.state;
        if(search){pagination.current= 1}
        this.setState({pagination,searchParams: params})
        this.loadData({
            offset: pagination.current,
            ...params,
        });
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

        if (sorter.field === 'planAmountFilter') {
            sort = 'Type_Filter';
        } else if (sorter.field === 'planAmountInform') {
            sort = 'Type_Informed';
        } else if (sorter.field === 'planAmountRandom') {
            sort = 'Type_Random';
        }
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
        render:(text,record,index) => {
            return(
                <div>
                    <a href='javascript:;' onClick={this.showPreviewModal.bind(this,record.id)}>{record.employeeCode}</a>
                </div>
            )
        }
    }, {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        fixed: 'left',
        sorter: true,
        width: 80,
        sorter: true,
    }, {
        title: '职位/级别',
        dataIndex: 'positionName',
        key: 'positionName',
        sorter: true,
        sorter: true,
    }, {
        title: '主管领导',
        dataIndex: 'leaderName',
        key: 'leaderName',
        sorter: true,
    }, {
        title: '部门',
        dataIndex: 'enterpriseDepartmentName',
        key: 'enterpriseDepartmentName',
        sorter: true,
    }, {
        title: '手机号码',
        dataIndex: 'mobile',
        key: 'mobile',
        // sorter: true,
        // sortType: 'common',
    },/* {
        title: '固定电话',
        dataIndex: 'telphone',
        key: 'telphone',
        // sorter: true,
        // sortType: 'common',
    },*/ {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width:180,
        // sorter: true,
        // sortType: 'common',
    }, {
        title: '工作城市',
        dataIndex: 'workCity',
        key: 'workCity',
        sorter: true,
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
    }]

    getDataSource = () => {
        const employeeList = [];
        const { data, pagination } = this.state;

        if(data){
            data.map((employee, i) => {

                //const {user,investigation,investigationSite} = crc;
                const leader = employee.leader ;
                employeeList.push({
                    index: ((pagination.current - 1) || 0) * 15 + i + 1,
                    id: employee.userId,
                    userName:employee.name ? employee.name : '',
                    telephone: employee.telephone,
                    leaderName: leader != null ? (leader.name != undefined ? leader.name : '') : '',
                    email: employee.email,
                    positionName: employee.positionName,
                    status: employee.status ==="WORKING" ? "在职" : 
                                (employee.status === 'WORKED' ? '在职' : 
                                (employee.status === 'LEFT'? "离职" : '')) ,
                    mobile: employee.mobile,
                    //hospitalName: investigationSite.hospitalName,
                    // regionName: investigationSite.regionName,
                    enterpriseDepartmentName: employee.enterpriseDepartmentName,
                    employeeCode : employee.employeeCode ,
                    workCity:employee.workCity,
                    
                });
            });
        }
        
        return employeeList;
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
                <UserSider selectKey='UserView' ref={el => {this.siderRef = el;}} />
                <div className="main">
                    <div className="main-content">
                        <div>
                            <Filter                                
                                showCreateModal={this.showCreateModal}
                                sortParams={sortParams}
                                reload={this.reload}
                                reset={this.reset}
                                ref={el=>{this.filterRef = el}}
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
                        />
                    </div>
                </div>
                <PreviewModal ref={el => { this.previewModalRef = el; }} />                
            </div>
        );
    }
}

export default UserView;

