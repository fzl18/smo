import $ from '../../common/AjaxRequest';
import React from 'react';
import jquery from 'jquery';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './CityFilter';
import CreateModal from './CityEdit';
import PreviewModal from './PreviewModal';
import './style/list.less';

class CityIndex extends React.Component {
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
            url: API_URL.team.citylist,
            data: {
                enterpriseId:1,
                offset: 1,
                limit: 15,
                ...params,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    // const investigations= data;
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

    del = id => {
        const options ={
            method: 'POST',
            url: API_URL.team.delcity,
            data: {
                enterpriseId:1,
                userId:id,
            },
            dataType: 'json',
            doneResult: d => {
                if(d.success){
                    message.success(d.success);
                    this.reload(); 
                }else{
                    message.warn(d.error);
                    this.reload();
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
        const search = this.FilterRef.getSearchParams()
        const pager = { ...this.state.pagination };
        if (pager.current == pagination.current){
            pager.current = 1;
        } else {
            pager.current = pagination.current;
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
            pagination: pager,
            sortParams: {
                direction,
                sort,
                sortType
            }
        });
        this.loadData({
            limit: pagination.pageSize,
            offset: pagination.current,
            direction,
            sort,
            sortType,
            ...this.state.searchParams,
            ...filters,
            ...search,
        });
    }

    getColumns = () => [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        fixed: 'left',
        width: 60,
    }, {
        title: '工号',
        dataIndex: 'employeeCode',
        key: 'employeeCode',
        fixed: 'left',
        width: 80,
        sorter: true,
        sortType: 'common',
    }, {
        title: '姓名',
        dataIndex: 'userCompellation',
        key: 'userCompellation',
        fixed: 'left',
        width: 100,
        sorter: true,
        sortType: 'common',
    }, {
        title: '职位',
        dataIndex: 'positionName',
        key: 'positionName',
        sorter: true,
        sortType: 'common',
    }, {
        title: '主管领导',
        dataIndex: 'leaderName',
        key: 'leaderName',
        sorter: true,
        sortType: 'common',
    }, {
        title: '部门',
        dataIndex: 'enterpriseDepartmentName',
        key: 'enterpriseDepartmentName',
        sorter: true,
        sortType: 'common',
    }, {
        title: '工作城市',
        dataIndex: 'regionName',
        key: 'regionName',
        sorter: true,
        sortType: 'common',
    }, {
        title: '分管城市',
        dataIndex: 'regionNames',
        key: 'regionNames',
        fixed: 'right',
        width: 200,
        // sorter: true,
        // sortType: 'common',
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 150,
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
        const investigations = []        
        const { data, pagination } = this.state
        const regions = data.userCompellation
        data.map((investigation, i) => {
            const regionNames=[]           
            investigation.regions.map((d)=>{
                regionNames.push(d.regionName)                
            })
            investigations.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                id: investigation.userId,
                userTelphone: investigation.userTelphone,
                leaderName: investigation.leaderName,
                userEmail: investigation.userEmail,
                userCompellation: investigation.userCompellation,
                positionName: investigation.positionName,
                userMobile: investigation.userMobile,
                hospitalName: investigation.hospitalName,
                regionName: investigation.regionName,
                enterpriseDepartmentName: investigation.enterpriseDepartmentName,
                employeeCode : investigation.employeeCode,
                regionNames:regionNames.join(" ; ")
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
                        scroll={{ x: 800 }}
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

export default CityIndex;
