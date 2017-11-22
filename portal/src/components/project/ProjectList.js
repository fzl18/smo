import $ from '../../common/AjaxRequest';
import jquery from 'jquery';
import React from 'react';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './Filter';
import CreateModal from './CreateModal';
import PreviewModal from './PreviewModal';
// import './style/list.less';

class ProjectList extends React.Component {
    state = {
        sortParams: {},
        searchParams: {},
        data: [],
        planList: [],
        tableheader:[],
        pagination: {
            pageSize: 15,
            current: 1,
        },
        loading: false,
    };

    getheader = () => {
        const options ={
            method: 'POST',
            url: API_URL.investigation.getheader,
            data: {
                roleCode: 'CRCC',
                startedInvestigation:1,
                // statusSymbol: 'NotEquals',
                // status: 'DELETED',
                // offset: 1,
                // limit: 15,
                // ...params,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const { headers } = data.data;
                    this.setState({
                        tableheader: headers,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
        }
        $.sendRequest(options)
    }

    loadData = (params = {}) => {
        this.setState({
            loading: true,
        });
        this.loadDataParam(params);
        const options ={
            method: 'POST',
            url: API_URL.investigation.list,
            data: {
                roleCode: 'EA',
                statusSymbol: 'NotEquals',
                status: 'DELETED',
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
    }



    getColumns = () => {
    const columns=[]
    columns.push({
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        fixed: 'left',
        width:50,
    })
    this.state.tableheader.map( d => {
        columns.push({
            title: d.displayName,
            dataIndex: d.field,
            key: d.field,
            sorter: true,
            sortType: d.type,
        })
    })
    
    columns.push({
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record) => {            
            return (
                <span>
                    <a href="javascript:void(0)" onClick={() => this.showPreviewModal(record.id)}>项目信息</a>
                    {/*<span className="ant-divider" />*/}
                </span>
            );
        },
    })        
    return columns        
    }

    getDataSource = () => {
        // const investigations = [];
        const { data, pagination, planList,tableheader } = this.state;

        let headers = tableheader; //从获取表头接口获取到的表头列表
        let invList = data; //从数据接口获取到的项目列表
        let dataSource = []; //数据源


        invList.map((inv, i) =>{
        //遍历项目列表inv为项目
        let row = {}; //数据源的一行
        headers.map((header,j) =>{
            //遍历表头列表， header为某一表头
            
            let value; //对应值
            inv.fields.map((invField,k) =>{  
                //遍历项目中的字段列表
                if(invField.field == header.field){
                    //字段列表中的field和表头中的field一致就把字段值取出来
                    value = invField.value;
                }
            });
            // 把字段值添加到数据源行
            row[header.field] = value;
        });

        //把数据源行添加到数据源
        dataSource.push(row);
        });

        // data.map((investigation, i) => {
        //     // const planList = investigation.planList.map(d => {d.} )
        //     investigations.push({
        //         index: ((pagination.current - 1) || 0) * 15 + i + 1,
        //         id: (investigation.investigationId)? investigation.investigationId : 0,
        //         investigationName: investigation.investigationName,
        //         investigationCode: investigation.investigationCode,
        //         investigationArea: investigation.investigationArea,
        //         investigationSponsor: investigation.investigationSponsor,
        //         investigationContractAmount: investigation.investigationContractAmount,
        //         bdUsers: investigation.bdUsers,
        //         investigationStatus: investigation.investigationStatus,
        //         curUserId: investigation.curUserId,
        //         investigationSitePlan: investigation.investigationSitePlan,
        //         fteProportion: investigation.fteProportion,
        //         planAmountFilter: investigation.planAmountFilter == null ? 0 : investigation.planAmountFilter,
        //         planAmountInform: investigation.planAmountInform == null ? 0 : investigation.planAmountInform,
        //         planAmountRandom: investigation.planAmountRandom == null ? 0 : investigation.planAmountRandom,
        //         planList:planList
        //     });
        // });

        return dataSource;
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
        this.getheader()        
    }

    render() {
        const { loading, pagination, sortParams } = this.state;
        return (
            <div className="content-2">
                <Filter
                    showCreateModal={this.showCreateModal}
                    sortParams={sortParams}
                    reload={this.reload}
                    reset={this.reset}
                />
                <div className="content-2">
                    <Table
                        columns={this.getColumns()}
                        dataSource={this.getDataSource()}
                        rowKey={record => record.id}
                        loading={loading}
                        scroll={{ x: 2000 }}
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

export default ProjectList;
