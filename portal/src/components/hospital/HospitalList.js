import $ from '../../common/AjaxRequest';
import React from 'react';
import jquery from 'jquery';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './Filter';
import PreviewModal from './PreviewModal';
import SideNav from './SideNav';

class HospitalList extends React.Component {
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
        // this.loadDataParam(params);
        const options ={
            method: 'POST',
            url: `${API_URL.hospital.hospitallist}`,
            data: {
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
    //             Modal.error({title: data.error});
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
        this.setState({
            pagination: pager,//设置新的分页信息
            sortParams: {//设置排序信息
                direction,
                sort,
                sortType
            }
        });
        this.loadData({
            limit: pager.pageSize,
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
        width: 50,
    }, {
        title: '医院名称',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
        fixed: 'left',
        width: 180,
        sorter: true,
        sortType: 'common',
    }, {
        title: '等级',
        dataIndex: 'hospitalLevel',
        key: 'hospitalLevel',
        sorter: true,
        sortType: 'common',
    }, {
        title: '省',
        dataIndex: 'hospitalProvince',
        key: 'hospitalProvince',
        sorter: true,
        sortType: 'common',
    }, {
        title: '市',
        dataIndex: 'hospitalCity',
        key: 'hospitalCity',
        sorter: true,
        sortType: 'common',
    }, {
        title: '详细地址',
        dataIndex: 'hospitalAddress',
        key: 'hospitalAddress',
        sorter: true,
        sortType: 'common',
    }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        sorter: true,
        sortType: 'common',
    }, {
        title: '参与的项目数量',
        dataIndex: 'inveSiteNum',
        key: 'inveSiteNum',
        sorter: true,
        sortType: 'common',
    }, {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        fixed:'right',
        width:100,
        // sorter: true,
        // sortType: 'common',
        render:(text,record,index) => {
            return(
                <a href='javascript:;' onClick={this.showPreviewModal.bind(this,record)}>项目明细</a>
            )
        }
    }]

    getDataSource = () => {
        const investigations = [];
        const { data, pagination } = this.state;

        data.map((investigation, i) => {
            investigations.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                id: investigation.hospitalId,
                hospitalName: investigation.hospitalName,
                hospitalLevel:investigation.hospitalLevel,
                hospitalProvince: investigation.hospitalProvince,
                inveSiteNum: investigation.inveSiteNum,
                remark: investigation.remark,
                hospitalCity: investigation.hospitalCity,
                hospitalAddress: investigation.hospitalAddress,
                
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
        const { loading, pagination, sortParams} = this.state;
        return (
            <div className="content">
                <SideNav selectKey='detail' ref={el => {this.siderRef = el;}} />
                <div className="content-inner">
                    <div className="main-content">
                        <div>
                            <Filter
                                showCreateModal={this.showCreateModal}
                                sortParams={{}}
                                reload={this.reload}
                                reset={this.reset}
                                type='hospital'
                            />
                        </div>
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.id}
                            loading={loading}
                            scroll={{ x: 1600 }}
                            onChange={this.handleTableChange}
                            pagination={pagination}
                        />
                    </div>
                </div>
                <PreviewModal ref={el => { this.previewModalRef = el; }} />                
            </div>
        );
    }
}

export default HospitalList;
