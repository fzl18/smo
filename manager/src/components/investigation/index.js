import $ from '../../common/AjaxRequest';
import jquery from 'jquery';
import React from 'react';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './Filter';
import CreateModal from './CreateModal';
import PreviewModal from './PreviewModal';
import './style/list.less';

class InvestigationList extends React.Component {
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
        //this.loadDataParam(params);
        const options ={
            method: 'POST',
            url: API_URL.investigation.list,
            data: {
                statusSymbol: 'Equals',
                status: '',
                offset: 1,
                limit: 15,
                ...params,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const { investigations } = data.data;
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
            investigationCode,
            investigationName,
            area,
            sponsor,
            conAmount,
            conAmountSymbol,
            sitePlan,
            sitePlanSymbol,
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

    del = id => {
        const options ={
            method: 'POST',
            url: API_URL.investigation.del,
            data: {
                investigationId:id,
            },
            dataType: 'json',
            doneResult: () => {
                message.success('删除成功');
                this.reload();
            }
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
    updateStatus = (id, status) => {
           const options ={
            method: 'POST',
            url: API_URL.investigation.updateStatus,
            data: {
                investigationId:id,
                status: status,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                   message.success('标记完成');
                   this.reload();
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)


        // $.ajax({
        //     method: 'get',
        //     url: `${API_URL.investigation.updateStatus}?investigationId=${id}&status=${status}`,
        // }).done(data => {
        //     if (!data.error) {
        //         message.success('标记完成');
        //         this.reload();
        //     } else {
        //         Modal.error({ title: data.error });
        //     }
        // });
    }

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
        } else if (sorter.field === 'bdUsers') {
            sort = 'BD';
        }
        this.setState({
            pagination: pager,
            sortParams: {
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
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        fixed: 'left',
        width:40,
    }, {
        title: '项目名称',
        dataIndex: 'investigationName',
        key: 'investigationName',
        fixed: 'left',
        sorter: true,
        sortType: 'common',
        width:150,        
    }, {
        title: '项目编号',
        dataIndex: 'investigationCode',
        key: 'investigationCode',
        sorter: true,
        sortType: 'common',
    }, {
        title: 'JDE主项目号',
        dataIndex: 'investigationJdeContractCode',
        key: 'investigationJdeContractCode',
        sorter: true,
        sortType: 'common',
    }, {
        title: '项目领域',
        dataIndex: 'investigationArea',
        key: 'investigationArea',
        sorter: true,
        sortType: 'common',
    }, {
        title: '申办方',
        dataIndex: 'investigationSponsor',
        key: 'investigationSponsor',
        sorter: true,
        sortType: 'common',
    }, {
        title: '合同额(元)',
        dataIndex: 'investigationContractAmount',
        key: 'investigationContractAmount',
        sorter: true,
        sortType: 'common',
    }, {
        title: 'BD',
        dataIndex: 'bdUsers',
        key: 'bdUsers',
        sorter: true,
        sortType: 'common',
    }, {
        title: '计划中心数',
        dataIndex: 'investigationSitePlan',
        key: 'investigationSitePlan',
        sorter: true,
        sortType: 'plan',
    }, {
        title: '计划筛选数',
        dataIndex: 'planAmountFilter',
        key: 'planAmountFilter',
        sorter: true,
        sortType: 'plan',
    }, {
        title: '计划知情数',
        dataIndex: 'planAmountInform',
        key: 'planAmountInform',
        sorter: true,
        sortType: 'plan',
    }, {
        title: '计划随机(入组)数',
        dataIndex: 'planAmountRandom',
        key: 'planAmountRandom',
        sorter: true,
        sortType: 'plan',
    }, {
        title: '状态',
        dataIndex: 'investigationStatus',
        key: 'investigationStatus',
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
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 180,
        render: (text, record) => {
            let updateDom;
            if (record.investigationStatus === 'COMPLETED') {
                updateDom = <Popconfirm title={(<p>项目取消标记为已完成后,该项目数据将被<br/>解锁,可再修改,是否确认此操作?</p>)} onConfirm={() => this.updateStatus(record.id, 'UNDERWAY')} okText="确定" cancelText="取消">
                        <a>取消完成</a>
                    </Popconfirm>;
            } else {
                updateDom = <Popconfirm title={(<p>项目标记为已完成后,该项目数据将被锁定,<br/>不能再修改,是否确认此操作?</p>)} onConfirm={() => this.updateStatus(record.id, 'COMPLETED')} okText="确定" cancelText="取消">
                         <a  disabled={!(record.investigationStatus === 'UNDERWAY')}>标记完成</a>
                    </Popconfirm>;                
            }
            return (
                <span>
                    <a onClick={() => this.showPreviewModal(record.id)}>查看</a>                    
                    <span className="ant-divider" />
                     <a onClick={() => this.edit(record.id)} disabled={record.investigationStatus === 'DISCUSSING' ? false : true}>修改</a> 
                    <span className="ant-divider" />
                    <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.del(record.id)} okText="确定" cancelText="取消">
                        <a disabled={record.investigationStatus === 'DISCUSSING' ? false : true}>删除</a>
                    </Popconfirm>
                    <span className="ant-divider" />
                    {updateDom}
                    </span>
            );
        },
    }]

    getDataSource = () => {
        const investigations = [];
        const { data, pagination } = this.state;

        data.map((investigation, i) => {
            let inv = {
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                id: investigation.investigationId,
                investigationName: investigation.investigationName,
                investigationCode: investigation.investigationCode,
                investigationArea: investigation.investigationArea,
                investigationSponsor: investigation.investigationSponsor,
                investigationContractAmount: investigation.investigationContractAmount ? `${investigation.investigationContractAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0,
                bdUsers: investigation.bdUsers,
                investigationStatus: investigation.investigationStatus,
                curUserId: investigation.curUserId,
                investigationSitePlan: investigation.investigationSitePlan,
                investigationJdeContractCode: investigation.investigationJdeContractCode,
            };

            if(investigation.planList){
                investigation.planList.map((plan, j) =>{
                    if(plan.investigationPlanType == 'Type_Filter'){
                        inv['planAmountFilter'] = plan.planAmount;
                    }
                    else if(plan.investigationPlanType == 'Type_Informed'){
                        inv['planAmountInform'] = plan.planAmount;
                    } 
                    else if(plan.investigationPlanType == 'Type_Random'){
                        inv['planAmountRandom'] = plan.planAmount;
                    } 
                })
            }
            investigations.push(inv);
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
                    sortParams={{}}
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
                        scroll={{ x: 1500 }}
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

export default InvestigationList;
