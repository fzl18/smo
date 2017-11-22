import $ from '../../common/AjaxRequest';
import React from 'react';
import jquery from 'jquery';
import moment from 'moment';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import ExportUtil from '../../common/ExportUtil';
import Filter from './SearchFilter';
import EfficiencyView from './EfficiencyView';
import EfficiencyTotal from './EfficiencyTotal';
import UserSider from './UserSider';
import Efficiency from '../sumTotal/Efficiency';

const dataFormat = 'YYYY-MM';
const monthFormat = "YYYY-MM"
class UserEfficiency extends React.Component {
    state = {
        visible:false,
        sortParams: {},
        searchParams: {
            begin: moment().format(monthFormat),
            end: moment().format(monthFormat)
        },
        data: [],
        pagination: {
            pageSize: 15,
            current: 1,
        },
        loading: false,
    };

    loadData = (begin=moment().format(dataFormat), end=moment().format(dataFormat) ,params = {}) => {
        this.setState({
            loading: true,
        });
        // this.loadDataParam(params);
        const options ={
            method: 'POST',
            url: `${API_URL.user.queryUserEfficiency}`,
            data: {
                begin,
                end,
                offset: 1,
                limit: 14,
                crcUserId:sessionStorage.userId,
                relatedUser:0,
                ...params,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const pagination = { ...this.state.pagination };
                    pagination.total = Math.floor(data.totalCount / 14) * 15 + data.totalCount % 14;
                    // pagination.total = data.totalCount;
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

    reload = (params = {}) => {
        const { pagination } = this.state;
        this.setState({
            searchParams: params,//重设搜索条件
            pagination: { ...this.state.pagination, current: 1 }//重设页码为1
        },function(){
            this.loadData({},{},{
                offset: 1,
                ...params,
            });
        })
    }

    hide = ()=>{
        this.setState({visible:false})
    }

    reset = () => {
        const pagination = { ...this.state.pagination, current: 1 };
        this.setState({
            pagination,
        });
        this.loadData();
    }

    export = (params = {}) => {
        const {searchParams} = this.state;
        const options = {
            ...this.state.sortParams,
            ...this.state.searchParams,
            ...params,
            searchParams,
        };
        const url = `${API_URL.export.exportUserEfficiency}`;
        ExportUtil.export(options, null, url);
    };

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
        let sortType, direction,
            sort = sort = sorter.field;
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
            sort = sorter.column.sortType;
        }

        if (sorter.order === 'descend') {
            direction = 'DESC';
        } else {
            direction = 'ASC';
        }
        this.loadData({},{},{
            limit: pagination.pageSize-1,
            offset: pager.current,
            direction,
            sort,
            ...this.state.searchParams,
            ...filters,
        });
    }

    getColumns = () => [{
    //     title: '序号',
    //     dataIndex: 'index',
    //     key: 'index',
    //     fixed: 'left',
    //     width: 40,
    // }, {
        title: '工号',
        dataIndex: 'employeeCode',
        key: 'employeeCode',
        fixed: 'left',
        width: 60,
        sorter: true,
        sortType: 'employeeCode',
    }, {
        title: '姓名',
        dataIndex: 'userCompellation',
        key: 'userCompellation',
        fixed: 'left',
        width: 80,
        sorter: true,
        sortType: 'userCompellation',
    }, {
        title: '工作城市',
        dataIndex: 'workCity',
        key: 'workCity',
        sorter: true,
        sortType: 'workCity',
    }, {
        title: '计划FTE',
        dataIndex: 'planFte',
        key: 'planFte',
        sorter: true,
        sortType: 'planFte',
    }, {
        title: '消耗FTE',
        dataIndex: 'actualFte',
        key: 'actualFte',
        sorter: true,
        sortType: 'duration',
    }, {
        title: 'FTE消耗比',
        dataIndex: 'ftePercent',
        key: 'ftePercent',
        sorter: true,
        sortType: 'ftePercent',
    }, {
        title: '完成访视数',
        dataIndex: 'visitCount',
        key: 'visitCount',
        sorter: true,
        sortType: 'visitCount',
    }, {
        title: '完成访视数/消耗FTE数',
        dataIndex: 'visitCountPercentString',
        key: 'visitCountPercentString',
        // sorter: true,
        // sortType: 'visitCountPercent',
    }, {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        render:(text,record,index) => {
            return(
                <div>
                { record.employeeCode !=='总计' ? <a href='javascript:;' onClick={this.showEfficiencyView.bind(this,record)}>查看明细</a> : null }
                <span className="ant-divider" />
                <a href='javascript:;' onClick={this.showEfficiencyTotal.bind(this,record.id)}>效率统计</a>
                </div>
            )
        }
    }]

    getDataSource = () => {
        const investigations = [];
        const { data, pagination } = this.state;

        data.map((investigation, i) => {
            investigations.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                id: investigation.userId,
                userCompellation:investigation.userCompellation,
                ftePercent: investigation.ftePercentString,
                actualFte: investigation.actualFteString,
                employeeCode: investigation.employeeCode,
                planFte: investigation.planFteString,
                visitCount: investigation.visitCount,
                visitCountPercentString : investigation.visitCountPercentString,
                workCity:investigation.workCity,                
            });
        });
        return investigations;
    }

    /* getStatus (investigationStatus){
     return 'DISCUSSING' != investigationStatus ? 'PREPARING' != investigationStatus ? 'UNDERWAY' != investigationStatus ?
     'COMPLETED' != investigationStatus ? 'DELETED' != investigationStatus ? "未知" : "已删除" : "已完成" : "进行中" : "准备中" : "洽谈中";
     }*/


    showEfficiencyView = record => {
        this.EfficiencyViewRef.show(record);
    }

    showEfficiencyTotal = id => {
        // this.EfficiencyTotalRef.show(id);
        
        this.setState({
            visible:true,
        },()=>{
            this.efficiencyRef.loadData({crcUserId:id})
            this.efficiencyRef.TabInit()
        })
        
        
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        const { loading, pagination, sortParams,visible} = this.state;
        return (
            <div className="content">
                <UserSider selectKey='UserEfficiency' ref={el => {this.siderRef = el;}} />
                <div className="main">
                    <div className="main-content">
                        <div>
                            <Filter
                                showCreateModal={this.showCreateModal}
                                sortParams={sortParams}
                                reload={this.reload}
                                reset={this.reset}
                                export={this.export}
                                ref={el => { this.FilterRef = el; }}
                            />
                        </div>
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.index}
                            loading={loading}
                            scroll={{ x: 900 }}
                            onChange={this.handleTableChange}
                            pagination={pagination}
                        />
                    </div>
                </div>
                <Modal
                    title="效率统计"
                    visible={visible}
                    onCancel={this.hide}
                    className="preview-modal"
                    wrapClassName="vertical-center-modal"
                    width="900px"
                    footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
                    >
                    <div style={{padding:30}}><Efficiency name='crc' filter={true} ref={el => {this.efficiencyRef = el;}} /></div>
                </Modal>
                <EfficiencyView ref={el => { this.EfficiencyViewRef = el; }} />
                {/* <EfficiencyTotal ref={el => { this.EfficiencyTotalRef = el; }} /> */}
            </div>
        );
    }
}


export default UserEfficiency;
