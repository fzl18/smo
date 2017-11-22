/**
 * Created by casteloyee on 2017/7/15.
 */
import React from 'react';
import {Button, Popconfirm, Table, Modal} from 'antd';
import API_URL from '../../common/url';
import Sider from './PlanSider';
import VisitTypeModal from "./VisitTypeModal";
import SortList from '../common/SortList';
import AjaxRequest from '../../common/AjaxRequest';

class VisitType extends React.Component {
    state = {
        loading: false,
        visitTypeList: [],
    };

    loadData = () => {
        this.setState({
            loading: true,
        });
        const options = {
            url: `${API_URL.plan.visitTypeDataList}`,
            data: {},
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loading: false,
                    visitTypeList: data.data.visitTypeList,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    getColumns = () => {
        const columnNames = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
            }, {
                title: '访视类型',
                dataIndex: 'visitTypeName',
                key: 'visitTypeName',
            }, {
                title: '对照基准',
                dataIndex: 'referenceVisitTypeName',
                key: 'referenceVisitTypeName',
            }, {
                title: '访视时间点',
                dataIndex: 'visitTypeWindow',
                key: 'visitTypeWindow',
            }, {
                title: '访视窗口',
                dataIndex: 'visitTypeWindowInfo',
                key: 'visitTypeWindowInfo',
            }
        ];

        const disabled = sessionStorage.invStatus == 'COMPLETED';
        if (sessionStorage.curRole == 'PA') {
            columnNames.push({
                title: '操作',
                key: 'operation',
                width: 200,
                render: (text, record) => {
                    return (
                        <span>
                            <a href="javascript:void(0)" disabled={disabled}
                               onClick={() => this.edit(record.visitTypeId)}>修改</a>
                            <span className="ant-divider"/>
                            <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.del(record.visitTypeId, 0)} okText="确定"
                                        cancelText="取消">
                                <a href="javascript:void(0)" disabled={disabled}>删除</a>
                            </Popconfirm>
                        </span>
                    );
                },
            });
        }
        return columnNames;
    }

    getDataSource = () => {
        const resList = [];
        const {visitTypeList} = this.state;
        visitTypeList.map((visitType, i) => {
            resList.push({
                index: i + 1,
                visitTypeId: visitType.visitTypeId,
                visitTypeName: visitType.visitTypeName,
                referenceVisitTypeName: visitType.referenceVisitTypeName,
                visitTypeWindow: visitType.visitTypeWindow == null ? '' : visitType.visitTypeWindow + '天',
                visitTypeWindowInfo: visitType.visitTypeWindowInfo,
            });
        });
        return resList;
    }

    add = () => {
        this.visitTypeModalRef.show(0);
    }

    sort = () => {
        const {visitTypeList} = this.state;
        const sortList = [];
        visitTypeList.map(item => {
            sortList.push({
                key: item.visitTypeId,
                name: item.visitTypeName,
            });
        });
        this.sortListRef.show(sortList);
    }

    export = () => {
        let locationRef = `${API_URL.export.exportVisitType}` + '.do?investigationId=' + sessionStorage.invId;
        if (sessionStorage.invId && sessionStorage.invId > 0) {
            locationRef += '&curInvId=' + sessionStorage.invId;
        }
        if (sessionStorage.siteId && sessionStorage.siteId > 0) {
            locationRef += '&curSiteId=' + sessionStorage.siteId;
        }
        if (sessionStorage.userId && sessionStorage.userId > 0) {
            locationRef += '&curUserId=' + sessionStorage.userId;
        }


        window.location.href = locationRef;
    }

    edit = id => {
        this.visitTypeModalRef.show(id);
    }

    del = (visitTypeId, confirm) => {
        const options = {
            url: `${API_URL.plan.deleteVisitType}`,
            data: {
                visitTypeId,
                confirm,
            },
            dataType: 'json',
            doneResult: ( data => {
                if(data.confirmError){
                    this.confirmDel(visitTypeId, data.confirmError);
                } else {
                    this.loadData();
                }
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    confirmDel = (visitTypeId, confirmError) => {
        const _this = this;
        Modal.confirm({
          iconType: 'exclamation-circle',
          title: confirmError,
          onOk() {
              _this.del(visitTypeId, 1);
          },
          onCancel() {
          },
      });
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        const {loading} = this.state;
        const isPA = sessionStorage.curRole == 'PA';
        const disabled = sessionStorage.invStatus == 'COMPLETED';
        return (
            <div className="content">
                <Sider selectKey="visitTypePlan"/>
                <div className="content-inner">
                    <div className="breadcrumb-bar tac">
                        <h2 className="title">项目访视周期计划</h2>
                    </div>
                    {
                        isPA ?
                            <div className="filter-bar tar">
                                <Button type="primary" onClick={this.export}>导出</Button>
                                <Button type="primary" onClick={this.sort}>排序调整</Button>
                                <Button disabled={disabled} type="primary" onClick={this.add}>添加</Button>
                            </div>
                            :
                            <div className="filter-bar tar">
                                <Button type="primary" onClick={this.export}>导出</Button>
                            </div>
                    }
                    <div className="content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.visitTypeId}
                            loading={loading}
                            pagination={false}
                        />
                    </div>
                </div>
                <VisitTypeModal ref={el => {
                    this.visitTypeModalRef = el;
                }} reload={this.loadData}/>
                <SortList ref={el => {
                    this.sortListRef = el;
                }}
                          reload={this.loadData}
                          sortUrl={`${API_URL.plan.sortVisitType}`}
                          title='访视周期计划排序调整'
                />
            </div>
        );
    }
}

export default VisitType;
