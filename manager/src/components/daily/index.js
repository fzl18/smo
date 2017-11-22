import $ from '../../common/AjaxRequest';
import React from 'react';
import jquery from 'jquery';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './Filter';
import CreateModal from './CreateModal';
import {Link} from 'react-router-dom';
// import PreviewModal from './PreviewModal';
// import './style/list.less';

class Daily extends React.Component {
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
            url: `${API_URL.daily.list}`,
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
        // let sortParams;
        // let searchParams;
        // const {
        //     dailyCode,
        //     dailyName,
        //     Relate,
        // } = params;

        // // sortParams = {
        // //     direction,
        // //     sort,
        // //     sortType,
        // // };

        // searchParams = {
        //     dailyCode,
        //     dailyName,
        //     Relate,
        // };

        // this.setState({
        //     // sortParams,
        //     searchParams,
        // });
    }

    reload = (params = {},type) => {
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
            url: `${API_URL.daily.del}`,
            data: {
                enterpriseId:1,
                enterpriseWorkCategoryId:id,
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

    getColumns = () => [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 60,
    }, {
        title: '大类名称',
        dataIndex: 'dailyName',
        key: 'dailyName',
        width: 400,
        // sorter: true,
        sortType: 'common',
    }, {
        title: '大类编号',
        dataIndex: 'dailyCode',
        key: 'dailyCode',
        // sorter: true,
        sortType: 'common',
    }, {
        title: '是否与项目有关',
        dataIndex: 'dailyRelate',
        key: 'dailyRelate',
        // sorter: true,
        sortType: 'common',
    },{
        title: '操作',
        key: 'operation',
        render: (text, record) => {
            return (
                <span>
                    <Link to={`/daily/View/${record.id}`}>
                        <a>详情</a>
                    </Link>
                    <span className="ant-divider" />
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
            dailys.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                id: daily.enterpriseWorkCategoryId,
                dailyName: daily.enterpriseWorkCategoryName,
                dailyCode: daily.enterpriseWorkCategoryCode,
                dailyRelate: daily.isRelateInvestigation == 1 ? "是" : "否",
            });
        });
        return dailys;        
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

export default Daily;
