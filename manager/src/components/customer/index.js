import $ from '../../common/AjaxRequest';
import React from 'react';
import jquery from 'jquery';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './Filter';
import CreateModal from './CreateModal';
// import './style/list.less';

class Customer extends React.Component {
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
            method: 'get',
            url: `${API_URL.customer.list}`,
            data: {
                enterpriseId:1,
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
    }

    loadDataParam = params => {
        let sortParams;
        let searchParams;
        const {
            dailyCode,
            dailyName,
            Relate,
        } = params;

        // sortParams = {
        //     direction,
        //     sort,
        //     sortType,
        // };

        searchParams = {
            dailyCode,
            dailyName,
            Relate,
        };

        this.setState({
            // sortParams,
            searchParams,
        });
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
            method: 'get',
            url: `${API_URL.customer.del}?userId=${id}`,
            data: {
            roleId:id,
                enterpriseId:1,
                offset: 1,
                limit: 15,
            },
            dataType: 'json',
            doneResult: d => {
                if(!d.error){
                    message.success(d.success);
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
        this.setState({
            pagination: pager,//设置新的分页信息
            sortParams: {//设置排序信息
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
        width: 60,
    }, {
        title: '姓名',
        dataIndex: 'userCompellation',
        key: 'userCompellation',
        fixed: 'left',
        width: 100,
    }, {
        title: '手机号码',
        dataIndex: 'userMobile',
        key: 'userMobile',
    }, {
        title: '固定电话',
        dataIndex: 'userTelphone',
        key: 'userTelphone',
    }, {
        title: '邮箱',
        dataIndex: 'userEmail',
        key: 'userEmail',
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 150,
        render: (text, record) => (
            <span>
                <a href="javascript:void(0)" onClick={this.edit.bind(this, record.id)}>修改</a>
                <span className="ant-divider" />
                <Popconfirm title={'确定要删除吗?'} onConfirm={this.del.bind(this, record.id)} okText="确定" cancelText="取消">
                    <a href="javascript:void(0)">删除</a>
                </Popconfirm>           
            </span>
            ),
    }]

    getDataSource = () => {
        const dailys = [];
        const { data, pagination } = this.state;
        data.map((daily, i) => {
            dailys.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                id: daily.userId,
                userCompellation: daily.userCompellation,
                userMobile: daily.userMobile,
                hospitalCity: daily.hospitalCity,
                userTelphone: daily.userTelphone,
                userEmail: daily.userEmail,
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
                    sortParams={{}}
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

export default Customer;
