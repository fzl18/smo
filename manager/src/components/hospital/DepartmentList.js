import $ from '../../common/AjaxRequest';
import jQuery from 'jQuery';
import React from 'react';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './DepartmentFilter';
import CreateModal from './AddDepartment';
import PreviewModal from './PreviewModal';
// import './style/list.less';

class DepartmentList extends React.Component {
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
            url: API_URL.hospital.departmentlist,
            data: {
                enterpriseId:1,
                offset: 1,
                limit: 15,
                ...params,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const investigations= data;
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

        // searchParams = {
        //     investigationCode,
        //     investigationName,
        //     area,
        //     sponsor,
        //     conAmount,
        //     conAmountSymbol,
        // };

        this.setState({
            //sortParams,
            //searchParams,
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

    del = record => {
        const options ={
            method: 'POST',
            url: API_URL.hospital.departmentdel,
            data: {
                enterpriseId:1,
                hospitalDepartmentEnterpriseId:record.id,
                hospitalId:record.hospitalId,
                hospitalDepartmentId:record.hospitalDepartmentId,
            },
            dataType: 'json',
            doneResult: d => {
                if(!d.error){
                    message.success(d.success);
                    this.reload();
                }else{
                    message.success(d.error);
                    this.reload();
                }            
            }
        }
        $.sendRequest(options)



        // $.ajax({
        //     method: 'POST',
        //     url: `${API_URL.hospital.departmentdel}`,
        //     data:{
        //         enterpriseId:1,
        //         hospitalDepartmentEnterpriseId:record.id,
        //         hospitalId:record.hospitalId,
        //     }
        // }).done((d) => {
        //     if(!d.error){
        //         message.success(d.success);
        //         this.reload();
        //     }else{
        //         message.success(d.error);
        //         this.reload();
        //     }            
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
        if (pager.current == pagination.current){
            pager.current = 1;
                //排序则页码为1
        } else {
            pager.current = pagination.current;
                //获取当前页
        }
        
        
        if (!jQuery.isEmptyObject(sorter) && sorter.column) {
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
        const sortParams = {};
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
        width: 60,
    }, {
        title: '医院',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
        fixed: 'left',
        width: 180,
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
        title: '科室',
        dataIndex: 'departmentLocalName',
        key: 'departmentLocalName',
        sorter: true,
        sortType: 'common',
    }, {
        title: '负责人',
        dataIndex: 'userCompellation',
        key: 'userCompellation',
        sorter: true,
        sortType: 'common',
    }, {
        title: '职务',
        dataIndex: 'doctorPosition',
        key: 'doctorPosition',
        sorter: true,
        sortType: 'common',
    }, {
        title: '手机号码',
        dataIndex: 'userMobile',
        key: 'userMobile',
    }, {
        title: '固定电话',
        dataIndex: 'userTelphone',
        key: 'userTelphone',
        // sorter: true,
        // sortType: 'plan',
    }, {
        title: '邮箱',
        dataIndex: 'userEmail',
        key: 'userEmail',
        // sorter: true,
        // sortType: 'plan',
    }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        // sorter: true,
        // sortType: 'plan',
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 150,
        render: (text, record) => {            
            return (
                <span>                    
                    <a onClick={() => this.edit(record)}>修改</a>
                    <span className="ant-divider" />
                    <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.del(record)} okText="确定" cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                    <span className="ant-divider" />               
                    <a onClick={() => this.showPreviewModal(record)} style={{marginTop:10}}>配置负责人</a>
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
                id:investigation.hospitalDepartmentEnterpriseId,
                hospitalDepartmentId:investigation.hospitalDepartmentId,
                hospitalId:investigation.hospitalId,
                hospitalName: investigation.hospitalName,
                hospitalCity: investigation.hospitalCity,
                userMobile: investigation.userMobile,
                userTelphone: investigation.userTelphone,
                departmentLocalName: investigation.departmentLocalName,
                userCompellation: investigation.userCompellation,
                userEmail: investigation.userEmail,
                remark: investigation.remark,
                hospitalProvince: investigation.hospitalProvince,
                doctorPosition: investigation.doctorPosition,
            });
        });
        return investigations;
    }

    /* getStatus (investigationStatus){
     return 'DISCUSSING' != investigationStatus ? 'PREPARING' != investigationStatus ? 'UNDERWAY' != investigationStatus ?
     'COMPLETED' != investigationStatus ? 'DELETED' != investigationStatus ? "未知" : "已删除" : "已完成" : "进行中" : "准备中" : "洽谈中";
     }*/


    showPreviewModal = record => {
        this.previewModalRef.show(record);
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
                        rowKey={record => record.id}
                        loading={loading}
                        scroll={{ x: 1300 }}
                        onChange={this.handleTableChange}
                        pagination={pagination}

                    />
                </div>
                <PreviewModal ref={el => { this.previewModalRef = el; }} reload={this.reload}/>
                <CreateModal
                    ref={el => { this.createModalRef = el; }}
                    reload={this.reload}
                />
            </div>
        );
    }
}

export default DepartmentList;
