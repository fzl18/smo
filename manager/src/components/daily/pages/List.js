import $ from '../../common/XDomainJquery';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { message, Table, Popconfirm, Pagination } from 'antd';
import API_URL from '../../common/url';
import Fetch from '../../common/FetchIt';
import store from '../../store';

class List extends React.Component {

    state = {
        data: [],
        pagination: {
            pageSize: 15,
        },
        loading: false,
    };

    loadData = (params = {}) => {
        this.setState({ loading: true });
        $.ajax({
            method: 'get',
            url: `${API_URL.daily.list}`,
            data: {
                enterpriseId: 1,
                offset: 1,
                limit: 15,
                ...params,
            },
            type: 'json',
        }).done(data => {
            if (!data.error) {                
                const pagination = this.state.pagination;
                pagination.total = data.totalCount;
                this.setState({
                    loading: false,
                    data: data.data,
                    pagination,
                });
            } else {
                alert(data.error);
            }
        });
    }

    del = id => {
        $.ajax({
            method: 'get',
            url: `${API_URL.daily.del}?dailyId=${id}`,
        }).done(() => {
            message.success('删除成功');
            this.reload();
        });
    }

    reload = () => {
        const { pagination } = this.state;
        this.loadData({
            offset: pagination.current,
        });
    }

    /**
     * 修改项目时，获取项目详细信息
     * @param id
     */
    edit = id => {
        this.props.showUpdateModal(id);
    }

    /**
     * 标记完成
     * @param id
     */
    updateStatus = record => {
        const { id, dailyStatus } = record;
        $.ajax({
            method: 'get',
            url: `${API_URL.daily.updateStatus}?dailyId=${id}&status=${dailyStatus}`,
        }).done(data => {
            if (!data.error) {
               console.log(1111)
                message.success('标记完成');
                this.reload();
            } else {
                alert(data.error);
            }
        });
    }

    showPreviewModal = id => {
        this.props.showPreviewModal(id);
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
        title: '大类名称',
        dataIndex: 'dailyName',
        key: 'dailyName',
        fixed: 'left',
        width: 200,
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
        dataIndex: 'dailyRelation',
        key: 'dailyRelation',
        // sorter: true,
        sortType: 'common',
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 200,
        render: (text, record) => (
            <span>
                <a href="javascript:void(0)" onClick={() => this.showPreviewModal(record.id)}>详情</a>
                <span className="ant-divider" />
                <a href="javascript:void(0)" onClick={() => this.edit(record.id)}>修改</a>
                <span className="ant-divider" />
                <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.del(record.id)} okText="确定" cancelText="取消">
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
                id: daily.enterpriseWorkCategoryId,
                dailyName: daily.enterpriseWorkCategoryName,
                dailyCode: daily.enterpriseWorkCategoryCode,
                dailyRelation: daily.isRelateInvestigation == 1 ? '是':'否',
                curUserId: daily.enterpriseId,
                dailySitePlan: daily.dailySitePlan,
                planAmountFilter: daily.planAmountFilter == null ? 0 : daily.planAmountFilter,
                planAmountInform: daily.planAmountInform == null ? 0 : daily.planAmountInform,
                planAmountRandom: daily.planAmountRandom == null ? 0 : daily.planAmountRandom,
            });
        });
        return dailys;
    }

    /* getStatus (dailyStatus){
        return 'DISCUSSING' != dailyStatus ? 'PREPARING' != dailyStatus ? 'UNDERWAY' != dailyStatus ?
            'COMPLETED' != dailyStatus ? 'DELETED' != dailyStatus ? "未知" : "已删除" : "已完成" : "进行中" : "准备中" : "洽谈中";
    }*/


    componentDidMount() {
        this.loadData();
    }

    render() {
        const { loading, pagination } = this.state;
        return (
            <div className="content">
                <Table
                    columns={this.getColumns()}
                    dataSource={this.getDataSource()}
                    rowKey={record => record.id}
                    loading={loading}
                    bordered
                    scroll={{ x: 800 }}
                    onChange={this.handleTableChange}
                    pagination={pagination}

                />
            </div>
        );
    }
}

export default List;
