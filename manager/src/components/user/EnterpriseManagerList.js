import $ from '../../common/AjaxRequest';
import React from 'react';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './Filter';
import CreateModal from './CreateModal';
// import './style/list.less';

class EnterpriseManagerList extends React.Component {
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
        this.loadDataParam(params);
        const options ={
            method: 'POST',
            url: `${API_URL.entmanager.queryAllEnterpriseManager}`,
            data: {
                // enterpriseId:1,
                offset: 1,
                limit: 15,
                ...params,
            },
            dataType: 'json',
            doneResult: (data => {
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
            })
        }
        $.sendRequest(options);
    }

    loadDataParam = params => {
        let sortParams;
        let searchParams;
        const {
            direction,
            sort,
            sortType,
            enterpriseName,
            enterpriseBusinessNum,
            enterpriseOrganizationCode,
            status,
        } = params;

        sortParams = {
            direction,
            sort,
            sortType,
        };

        searchParams = {
            enterpriseName,
            enterpriseBusinessNum,
            enterpriseOrganizationCode,
            status,
        };

        this.setState({
            sortParams,
            searchParams,
        });
    }

    reload = (params = {}) => {
        const { pagination } = this.state;
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

    stop = record => {
        const options ={
            method: 'POST',
            url: `${API_URL.entmanager.changeEntStatus}`,
            data: {
                enterpriseId:record.id,
                status: record.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                offset: 1,
                limit: 15,
            },
            dataType: 'json',
            doneResult: (data => {
                if (!data.error) {
                    message.success(data.sucess)
                    this.reload()
                } else {
                    Modal.error({ title: data.error });
                }
            })
        }
        $.sendRequest(options);
    }


    handleTableChange = (pagination, filters, sorter) => {
        let sortType,
            direction,
            sort = sort = sorter.field;
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        if (!$.isEmptyObject(sorter) && sorter.column) {
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
    }

    getColumns = () => [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width:50,
    }, {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
    }, {
        title: '姓名',
        dataIndex: 'userCompellation',
        key: 'userCompellation',
    }, {
        title: '手机号',
        dataIndex: 'userMobile',
        key: 'userMobile',
    }, {
        title: '邮箱',
        dataIndex: 'userEmail',
        key: 'userEmail',
    }, {
        title: '归属企业',
        dataIndex: 'enterpriseName',
        key: 'enterpriseName',
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
            return(
                record.status === 'ACTIVE' ? <span> 启用</span>:<span>禁用</span>
            )
        },
    }, {
        title: '创建者',
        dataIndex: 'createUserName',
        key: 'createUserName',
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 180,
        render: (text, record) => {
            return (
                <span>
                    { record.status ==="ACTIVE" ?
                        <Popconfirm title={'确定要禁用吗?'} onConfirm={() => this.stop(record)} okText="确定" cancelText="取消">
                            <a href="javascript:void(0)">禁用</a>
                        </Popconfirm>
                        :
                        <Popconfirm title={'确定要启用吗?'} onConfirm={() => this.stop(record)} okText="确定" cancelText="取消">
                            <a href="javascript:void(0)">启用</a>
                        </Popconfirm>
                    }
                    <span className="ant-divider" />
                    <a href="javascript:void(0)" onClick={() => this.showPreviewModal(record.id)}>重置密码</a>
                </span>
            );
        },
    }]

    getDataSource = () => {
        const userList = [];
        const { data, pagination } = this.state;

        data.map((user, i) => {
            userList.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                userId: user.userId,
                userName: user.userName,
                userCompellation: user.userCompellation,
                userMobile: user.userMobile,
                userEmail: user.userEmail,
                enterpriseName: user.enterpriseName,
                status: user.applicationStatus,
                createUserName: user.createrName,
            });
        });
        return userList;
    }

    showCreateModal = record => {
        this.createModalRef.show(record);
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
                    sortParams={sortParams}
                    reload={this.reload}
                    reset={this.reset}
                />
                <div className="content">
                    <Table
                        columns={this.getColumns()}
                        dataSource={this.getDataSource()}
                        rowKey={record => record.userId}
                        loading={loading}
                        scroll={{ x: "130%" }}
                        onChange={this.handleTableChange}
                        pagination={pagination}
                    />
                </div>
                <CreateModal
                    ref={el => { this.createModalRef = el; }}
                    reload={this.reload}
                />
            </div>
        );
    }
}

export default EnterpriseManagerList;
