import $ from '../../common/AjaxRequest';
import React from 'react';
import jquery from 'jquery';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './UserFilter';
import CreateModal from './EditUserModal';
import PreviewModal from './PreviewModal';
import './style/list.less';

class UserIndex extends React.Component {
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
        const search = this.FilterRef.getParams()
        this.setState({
            loading: true,
        });
        // this.loadDataParam(params);
        const options ={
            method: 'POST',
            url: `${API_URL.team.userlist}`,
            data: {
                enterpriseId:1,
                offset: 1,
                limit: 15,
                ...params,
                ...search,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const pagination = { ...this.state.pagination };
                    pagination.total = data.totalCount;
                    this.setState({
                        loading: false,
                        data: data.datas,
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
        let sortParams;
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
        if(search){pagination.current=1}
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

    // del = id => {
    //     $.ajax({
    //         method: 'get',
    //         url: `${API_URL.investigation.del}?investigationId=${id}`,
    //     }).done(() => {
    //         message.success('删除成功');
    //         this.reload();
    //     });
    // }

    /**
     * 修改项目时，获取项目详细信息
     * @param id
     */
    edit = id => {
        this.showCreateModal(id);
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
        } else {
            pager.current = pagination.current;
        }
        // pager.current = pagination.current;
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
            offset: pagination.current,
            direction,
            sort,
            sortType,
            ...this.state.searchParams,
            ...filters,
        });
        this.setState({
            sortParams: {
                direction,
                sort,
                sortType,
            },
        })
    }

    getColumns = () => [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        fixed: 'left',
        width: 40,
    }, {
        title: '工号',
        dataIndex: 'employeeCode',
        key: 'employeeCode',
        fixed: 'left',
        width: 60,
        sorter: true,
        sortType: 'common',
    }, {
        title: '姓名',
        dataIndex: 'userCompellation',
        key: 'userCompellation',
        fixed: 'left',
        width: 80,
        sorter: true,
        sortType: 'common',
    }, {
        title: '职位级别',
        dataIndex: 'positionName',
        key: 'positionName',
        sorter: true,
        sortType: 'common',
    }, {
        title: '主管领导',
        dataIndex: 'leaderName',
        key: 'leaderName',
        sorter: true,
        sortType: 'common',
    }, {
        title: '部门',
        dataIndex: 'enterpriseDepartmentName',
        key: 'enterpriseDepartmentName',
        sorter: true,
        sortType: 'common',
    }, {
        title: '手机号码',
        dataIndex: 'userMobile',
        key: 'userMobile',
        // sorter: true,
        // sortType: 'common',
    // }, {
        // title: '固定电话',
        // dataIndex: 'userTelphone',
        // key: 'userTelphone',
        // sorter: true,
        // sortType: 'common',
    }, {
        title: '邮箱',
        dataIndex: 'userEmail',
        key: 'userEmail',
        width:180,
        // sorter: true,
        // sortType: 'common',
    }, {
        title: '工作城市',
        dataIndex: 'regionName',
        key: 'regionName',
        sorter: true,
        sortType: 'common',
    }, {
        title: '状态',
        dataIndex: 'dimissionStatus',
        key: 'dimissionStatus',
        sorter: true,
        sortType: 'common',
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 150,
        render: (text, record) => {            
            return (
                <span>
                    <a onClick={() => this.edit(record.id)} disabled={record.dimissionStatus =='离职' ? true : false}>修改资料</a>
                </span>
            );
        },
    }]

    getDataSource = () => {
        const investigations = [];
        const { data, pagination } = this.state;

        data.map((investigation, i) => {
            investigations.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                id: investigation.userId,
                userTelphone: investigation.userTelphone,
                leaderName: investigation.leaderName,
                userEmail: investigation.userEmail,
                userCompellation: investigation.userCompellation,
                positionName: investigation.positionName,
                dimissionStatus: investigation.dimissionStatus ==="WORKING" ? "在职" : "离职",
                userMobile: investigation.userMobile,
                hospitalName: investigation.hospitalName,
                regionName: investigation.regionName,
                enterpriseDepartmentName: investigation.enterpriseDepartmentName,
                employeeCode : investigation.employeeCode ,
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
        const { loading, pagination, sortParams } = this.state;
        return (
            <div className="content-inner">
                <Filter
                    showCreateModal={this.showCreateModal}
                    reload={this.reload}
                    reset={this.reset}
                    ref= { el => {this.FilterRef = el}}
                />
                <div className="content">
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
                <PreviewModal ref={el => { this.previewModalRef = el; }} />
                <CreateModal
                    ref={el => { this.createModalRef = el; }}
                    reload={this.reload}
                />
            </div>
        );
    }
}

export default UserIndex;
