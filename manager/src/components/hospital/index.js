import $ from '../../common/AjaxRequest';
import jquery from 'jquery'
import React from 'react';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './Filter';
import CreateModal from './CreateModal';
// import './style/list.less';

class Hospital extends React.Component {
    state = {
        sortParams: {},
        searchParams: {},
        data: [],
        searchValue:{},
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
            url: API_URL.hospital.list,
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
        let sortParams;
        let searchParams;
        const {
            dailyCode,
            dailyName,
            Relate,
            direction,
            sort,
            sortType
        } = params;

        sortParams = {
            direction,
            sort,
            sortType,
        };

        searchParams = {
            dailyCode,
            dailyName,
            Relate,
        };

        this.setState({
            sortParams,
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
            url: API_URL.hospital.del,
            data: {
                enterpriseId:1,
                hospitalId:id,
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
        if (pager.current == pagination.current){
            pager.current = 1;
                //排序则页码为1
        } else {
            pager.current = pagination.current;
                //获取当前页
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
            ...this.state.searchValue,
        });
    }

    getColumns = () => [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        fixed: 'left',
        width: 60,
    }, {
        title: '医院名称',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
        fixed: 'left',
        width: 180,
        sorter:true,
        
    }, {
        title: '等级',
        dataIndex: 'hospitalLevel',
        key: 'hospitalLevel',
        sorter:true,
        
    }, {
        title: '省',
        dataIndex: 'hospitalProvince',
        key: 'hospitalProvince',
        sorter:true,
        
    }, {
        title: '市',
        dataIndex: 'hospitalCity',
        key: 'hospitalCity',
        sorter:true,
        
    }, {
        title: '详细地址',
        dataIndex: 'hospitalAddress',
        key: 'hospitalAddress',
    }, {
        title: '备注',
        dataIndex: 'hospitalRemark',
        key: 'Note',
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 170,
        render: (text, record) => (
            <span>
                <a href="javascript:void(0)" onClick={this.edit.bind(this, record.id)}>修改备注</a>
                <span className="ant-divider" />
                <Popconfirm title={'确定要移除吗?'} onConfirm={this.del.bind(this, record.id)} okText="确定" cancelText="取消">
                    <a href="javascript:void(0)">移除</a>
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
                id: daily.hospitalId,
                hospitalName: daily.hospitalName,
                hospitalLevel: daily.hospitalLevel,
                hospitalCity: daily.hospitalCity,
                hospitalProvince: daily.hospitalProvince,
                hospitalAddress: daily.hospitalAddress,
                hospitalRemark: daily.remark,
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

export default Hospital;
