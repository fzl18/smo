import $ from '../../common/AjaxRequest';
import React from 'react';
import jQuery from 'jQuery';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './Filter';
import CreateModal from './CreateModal';
import PreviewModal from './PreviewModal';
import './style/list.less';

class Role extends React.Component {
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

    loadData = (params) => {
        this.setState({
            loading: true,
        });
        // this.loadDataParam(params);

        const options ={
            method: 'get',
            url: `${API_URL.role.list}`,
            data: {
                enterpriseId:1,
                offset: 1,
                limit: 15,
                ...params,
            },
            dataType: 'json',
            doneResult: (data => {
                if (!data.error) {
                    const investigations = data;
                    const pagination = { ...this.state.pagination };
                    pagination.total = investigations.totalCount;
                    this.setState({
                        loading: false,
                        data: investigations.datas,
                        pagination,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            })
        }
        $.sendRequest(options)
    }

    // loadDataParam = params => {
    //     let sortParams;
    //     let searchParams;
    //     const {
    //         direction,
    //         sort,
    //         sortType,
    //         investigationCode,
    //         investigationName,
    //         area,
    //         sponsor,
    //         conAmount,
    //         conAmountSymbol,
    //     } = params;

    //     sortParams = {
    //         direction,
    //         sort,
    //         sortType,
    //     };

    //     searchParams = {
    //         investigationCode,
    //         investigationName,
    //         area,
    //         sponsor,
    //         conAmount,
    //         conAmountSymbol,
    //     };

    //     this.setState({
    //         sortParams,
    //         searchParams,
    //     });
    // }

    reload = (params = {},search) => {
        const { pagination } = this.state;
        if(search){pagination.current=1}
        this.setState({
            pagination,
            searchParams:params,
        })
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

    del = id => {
        const options ={
            method: 'get',
            url: `${API_URL.investigation.del}`,
            data: {
                investigationId:id,
                offset: 1,
                limit: 15,
                ...params,
            },
            dataType: 'json',
            doneResult:() => {
                message.success('删除成功');
                this.reload();
            }
        }
        $.sendRequest(options)
    }

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
    //             Modal.error({ title: data.error });
    //         }
    //     });
    // }

    handleTableChange = (pagination, filters, sorter) => {
        let sortType,
            direction,
            sort = sort = sorter.field;
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        if (!jQuery.isEmptyObject(sorter) && sorter.column) {
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
        fixed: 'left',
        width: 100,
    }, {
        title: '角色Code',
        dataIndex: 'roleCode',
        key: 'roleCode',
        fixed: 'left',
        width: 100,
        // sorter: true,
        // sortType: 'common',
    }, {
        title: '角色名称',
        dataIndex: 'roleDescription',
        key: 'roleDescription',
        // fixed: 'left',
        // width: 100,
        // sorter: true,
        // sortType: 'common',
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 200,
        render: (text, record) => {            
            return (
                <span>
                    <a onClick={() => this.edit(record.id)}>修改角色</a>
                    {/* <Button onClick={() => this.setting(record.id)}>配置权限</Button>*/}
                </span>
            );
        },
    }]

    getDataSource = () => {
        const investigations = [];
        const { data, pagination } = this.state;
        if(data){       
        data.map((investigation, i) => {
            investigations.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                id: investigation.roleId,
                roleCode: investigation.roleCode,
                roleDescription: investigation.roleDescription,
            });
        });
             
        }
        return investigations;
    }

    /* getStatus (investigationStatus){
     return 'DISCUSSING' != investigationStatus ? 'PREPARING' != investigationStatus ? 'UNDERWAY' != investigationStatus ?
     'COMPLETED' != investigationStatus ? 'DELETED' != investigationStatus ? "未知" : "已删除" : "已完成" : "进行中" : "准备中" : "洽谈中";
     }*/


    setting = id => {
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
                    sortParams={sortParams}
                    reload={this.reload}
                    reset={this.reset}
                />
                <div className="content">
                    <Table
                        columns={this.getColumns()}
                        dataSource={this.getDataSource()}
                        rowKey={record => record.id}
                        loading={loading}
                        scroll={{ x: 600 }}
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

export default Role;
