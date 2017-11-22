import $ from '../../common/AjaxRequest';
import jquery from 'jquery';
import React from 'react';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './PositionFilter';
import CreateModal from './SetRole';
// import PreviewModal from './PreviewModal';
import './style/list.less';

class PositionIndex extends React.Component {
    state = {
        sortParams: {
            direction:'',
            sort:'',
            sortType:'',
        },
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
            url: `${API_URL.team.positionlist}`,
            data: {
                // enterpriseId:1,
                // offset: 1,
                // limit: 15,
                ...params,
                ...search,
            },
            dataType: 'json',
            doneResult: data => {
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
            }
        }
        $.sendRequest(options)



        // $.ajax({
        //     method: 'POST',
        //     url: `${API_URL.team.positionlist}`,
        //     data: {
        //         enterpriseId:1,
        //         offset: 1,
        //         limit: 15,
        //         ...params,
        //     },
        //     type: 'json',
        // }).done(data => {
        //     if (!data.error) {
        //         const investigations = data;
        //         const pagination = { ...this.state.pagination };
        //         pagination.total = investigations.totalCount;
        //         this.setState({
        //             loading: false,
        //             data: investigations.data,
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
        if(search){
            pagination.current = 1
            this.setState({
                pagination
            });
            
        }
        this.loadData({
            // offset: pagination.current,
            offset: pagination.current,
            ...params,
        });
        console.log(pagination)
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
    //             Modal.error({ title: data.error });
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
        width: 100,
    }, {
        title: '职位名称',
        dataIndex: 'positionName',
        key: 'positionName',
        fixed: 'left',
        // sorter: true,
        // sortType: 'common',
    // }, {
    //     title: '职位级别',
    //     dataIndex: 'positionRoleId',
    //     key: 'positionRoleId',
        // fixed: 'left',
        // sorter: true,
        // sortType: 'common',
    }, {
        title: '部门名称',
        dataIndex: 'enterpriseDepartmentName',
        key: 'enterpriseDepartmentName',
        // fixed: 'left',
        // sorter: true,
        // sortType: 'common',
    }, {
        title: '对应角色',
        dataIndex: 'roleCode',
        key: 'roleCode',
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
                    <a onClick={() => this.edit(record.id)}>配置职位角色</a>                    
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
                id: investigation.positionId,
                positionName: investigation.positionName,
                roleCode: investigation.roleCode,
                enterpriseDepartmentName: investigation.enterpriseDepartmentName,
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
                    ref= { el => {this.FilterRef = el}  }
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
                <CreateModal
                    ref={el => { this.createModalRef = el; }}
                    reload={this.reload}
                />
            </div>
        );
    }
}

export default PositionIndex;
