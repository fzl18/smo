import $ from '../../common/AjaxRequest';
import React from 'react';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './Filter';
import CreateModal from './CreateModal';
import PreviewModal from './PreviewModal';
import './style/list.less';

class Entmanager extends React.Component {
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
            url: `${API_URL.entmanager.list}`,
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
        $.sendRequest(options)




        // $.ajax({
        //     method: 'get',
        //     url: `${API_URL.investigation.list}`,
        //     data: {
        //         roleCode: 'EA',
        //         statusSymbol: 'NotEquals',
        //         status: 'DELETED',
        //         offset: 1,
        //         limit: 15,
        //         ...params,
        //     },
        //     type: 'json',
        // }).done(data => {
        //     if (!data.error) {
        //         const { investigations } = data.data;
        //         const pagination = { ...this.state.pagination };
        //         pagination.total = investigations.totalCount;
        //         this.setState({
        //             loading: false,
        //             data: investigations.datas,
        //             pagination,
        //         });
        //     } else {
        //         Modal.error({ title: data.error });
        //     }
        // });
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
                enterpriseId:1,
                status: record.status ,
                offset: 1,
                limit: 15,
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
        $.sendRequest(options)


        // $.ajax({
        //     method: 'get',
        //     url: `${API_URL.investigation.del}?investigationId=${id}`,
        // }).done(() => {
        //     message.success('删除成功');
        //     this.reload();
        // });
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
        title: '企业名称',
        dataIndex: 'enterpriseName',
        key: 'enterpriseName',
    }, {
        title: '营业执照注册号',
        dataIndex: 'enterpriseBusinessNum',
        key: 'enterpriseBusinessNum',
    }, {
        title: '组织机构代码',
        dataIndex: 'enterpriseOrganizationCode',
        key: 'enterpriseOrganizationCode',
    }, {
        title: '企业地址',
        dataIndex: 'enterpriseAddress',
        key: 'enterpriseAddress',
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
            return(
                record.status === 'ACTIVE' ? <span>启用 </span>:<span>禁用</span>
            )
        },
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 180,
        render: (text, record) => {
            return (
                <span>
                    <a href="javascript:void(0)" onClick={() => this.showPreviewModal(record.id)}>查看</a>
                    <span className="ant-divider" />
                    { record.status ==="ACTIVE" ?
                    <Popconfirm title={'确定要禁用吗?'} onConfirm={() => this.stop.bind(this,record.id)} okText="确定" cancelText="取消">
                        <a href="javascript:void(0)">禁用</a>
                    </Popconfirm>
                    :
                    <Popconfirm title={'确定要启用吗?'} onConfirm={() => this.stop.bind(this,record.id)} okText="确定" cancelText="取消">
                        <a href="javascript:void(0)">启用</a>
                    </Popconfirm>
                    }                    
                    <span className="ant-divider" />
                        <a href="javascript:void(0)" onClick={() => this.edit(record.id)}>配置企业管理员</a>
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
                id: investigation.enterpriseId,
                enterpriseName: investigation.enterpriseName,
                enterpriseBusinessNum: investigation.enterpriseBusinessNum,
                enterpriseOrganizationCode: investigation.enterpriseOrganizationCode,
                enterpriseAddress: investigation.enterpriseAddress,
                status: investigation.status,
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
                    sortParams={sortParams}
                    reload={this.reload}
                    reset={this.reset}
                />
                <div className="content">
                    <Table
                        columns={this.getColumns()}
                        dataSource={this.getDataSource()}
                        Key={record => record.id}
                        Keyrow={100}
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

export default Entmanager;
