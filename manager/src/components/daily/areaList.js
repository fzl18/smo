import $ from '../../common/AjaxRequest';
import React from 'react';
import jquery from 'jquery';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './FilterArea';
import CreateModal from './addarea';
// import PreviewModal from './PreviewModal';
import './style/list.less';

class AreaList extends React.Component {
    state = {
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
            url: API_URL.daily.queryarealist,
            data: {
                enterpriseId:1,
                offset: 1,
                limit: 15,
                ...params,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {                
                    const pagination = { ...this.state.pagination };
                    pagination.total = data.totalCount;
                    this.setState({
                        loading: false,
                        data: data.data,
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
            areaName,
            regionName,
        } = params;

        // sortParams = {
        //     direction,
        //     sort,
        //     sortType,
        // };

        searchParams = {
            areaName,
            regionName,
        };

        this.setState({
            // sortParams,
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

    del = id => {
        const options ={
            method: 'POST',
            url: API_URL.daily.delarea,
            data: {
                enterpriseId:1,
                areaId:id,
            },
            dataType: 'json',
            doneResult: d => {
                if(!d.error){
                    message.success(d.data.success);
                    this.reload();
                }else{
                    message.warn(d.error);
                }
                
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
    //         url: `${API_URL.daily.updateStatus}?dailyId=${id}&status=${status}`,
    //     }).done(data => {
    //         if (!data.error) {
    //             message.success('标记完成');
    //             this.reload();
    //         } else {
    //             Modal.error({ title: data.error });
    //         }
    //     });
    // }

    // handleTableChange = (pagination, filters, sorter) => {
    //     let sortType,
    //         direction,
    //         sort = sort = sorter.field;
    //     const pager = { ...this.state.pagination };
    //     pager.current = pagination.current;
    //     this.setState({
    //         pagination: pager,
    //     });
    //     if (!$.isEmptyObject(sorter) && sorter.column) {
    //         sortType = sorter.column.sortType;
    //     }

    //     if (sorter.order === 'descend') {
    //         direction = 'DESC';
    //     } else {
    //         direction = 'ASC';
    //     }

    //     if (sorter.field === 'planAmountFilter') {
    //         sort = 'Type_Filter';
    //     } else if (sorter.field === 'planAmountInform') {
    //         sort = 'Type_Informed';
    //     } else if (sorter.field === 'planAmountRandom') {
    //         sort = 'Type_Random';
    //     }
    //     this.loadData({
    //         limit: pagination.pageSize,
    //         offset: pagination.current,
    //         direction,
    //         sort,
    //         sortType,
    //         ...this.state.searchParams,
    //         ...filters,
    //     });
    // }

    getColumns = () => [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        fixed: 'left',
        width: 60,
    }, {
        title: '大区名称',
        dataIndex: 'areaName',
        key: 'areaName',
        fixed: 'left',
        width: 200,
        // sorter: true,
        sortType: 'common',
    }, {
        title: '包含省份',
        dataIndex: 'regionName',
        key: 'regionName',
        // sorter: true,
        sortType: 'common',
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 200,
        render: (text, record) => {
            return (
                <span>
                    <a onClick={() => this.edit(record.id)}>修改</a>
                    <span className="ant-divider" />
                    <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.del(record.id)} okText="确定" cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>                                    
                </span>
            );
        },
    }]


    getDataSource = () => {
        const dailys = [];
        const { data, pagination } = this.state;

        data.map((daily, i) => {
            const regionNames =[]
            daily.regions.map((d)=>{
                regionNames.push(
                    d.regionName
                )                
            })
            dailys.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                id: daily.areaId,
                areaName: daily.areaName,
                regionName: regionNames.join(';'),
            });
        });

        
        return dailys;        
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
                        bordered                        
                        rowKey={record => record.id}
                        loading={loading}
                        scroll={{ x: 800 }}
                        onChange={this.handleTableChange}
                        pagination={pagination}

                    />
                </div>
                {/*<PreviewModal ref={el => { this.previewModalRef = el; }} />*/}
                <CreateModal
                    ref={el => { this.createModalRef = el; }}
                    reload={this.reload}
                />
            </div>
        );
    }
}

export default AreaList;
