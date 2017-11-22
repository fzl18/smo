import React, { Component } from 'react';
import $ from 'jquery';
import { Form, Input, Modal, Button, Select, DatePicker, message, Icon, InputNumber, Table } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import moment from 'moment';

class EmployeeDetailModal extends Component {

    state = {
        visible: false,
        confirmLoading: false,
        data : [],  
        employee : {
            code : '',
            name : '',
            id : '',
        }
    };

    show = (id,code,name) => {
        let user = {
            id : id,
            code : code,
            name : name,
        }
        this.setState({
            visible: true,
            employee : user,
        });
        if (id) {

            this.loadData(id);
        }
    };


    hide = () => {
        this.setState({
            visible: false,
        });
    };

    /**
     * 获取项目详细信息
     * @param id
     */
    loadData = id => {
        const options = {
            method: 'get',
            url: `${API_URL.member.getEmployeeInfo}?assignedUserId=${id}`,
            doneResult: ( data => {
                    let d = data.data;
                    this.setState({
                        data : d.invInfoList,
                    });
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    }

    getColumns = () => [{
        title: '项目领域',
        dataIndex: 'investigationArea',
        key: 'investigationArea',
    }, {
        title: '项目编号',
        dataIndex: 'investigationCode',
        key: 'investigationCode',
    }, {
        title: '项目名称',
        dataIndex: 'investigationName',
        key: 'investigationName',
    }, {
        title: '项目状态',
        dataIndex: 'investigationStatus',
        key: 'investigationStatus',
        render: (text, record) => {
            let status;
            if (record.investigationStatus === 'DISCUSSING') {
                status = '洽谈中';
            } else if (record.investigationStatus === 'PREPARING') {
                status = '准备中';
            } else if (record.investigationStatus === 'UNDERWAY') {
                status = '进行中';
            } else if (record.investigationStatus === 'COMPLETED') {
                status = '已完成';
            } else if (record.investigationStatus === 'DELETED') {
                status = '已删除';
            } else {
                status = '未知';
            }
            return (
                <span>{status}</span>
            );
        },
    }, {
        title: '中心编号',
        dataIndex: 'investigationSiteCode',
        key: 'investigationSiteCode',
    }, {
        title: '中心名称',
        dataIndex: 'investigationSiteName',
        key: 'investigationSiteName',
    }, {
        title: '科室',
        dataIndex: 'departmentName',
        key: 'departmentName',
    }, {
        title: '中心启动时间',
        dataIndex: 'startTime',
        key: 'startTime',
    }, {
        title: '累计工时',
        dataIndex: 'sumDuration',
        key: 'sumDuration',
    }, {
        title: '上月工时',
        dataIndex: 'lastMonthSumDuration',
        key: 'lastMonthSumDuration',
    }]

    getDataSource = () => {
        const invInfoList = [];
        const {data} = this.state;

        if(data != undefined){
            data.map((inv, i) =>{
                let invSite = inv.investigationSite;
                let invRow = {};

                if(invSite){
                    invRow['investigationSiteCode'] = invSite.investigationSiteCode;
                    invRow['investigationSiteName'] = invSite.investigationSiteName;
                    invRow['departmentName'] = invSite.departmentName;
                    invRow['startTime'] = invSite.startTime ? moment(invSite.startTime).format('YYYY-MM-DD') : '';

                    if(invSite.investigation){
                        let investigation = invSite.investigation;

                        invRow['investigationArea'] = investigation.investigationArea;
                        invRow['investigationCode'] = investigation.investigationCode;
                        invRow['investigationName'] = investigation.investigationName;
                        invRow['investigationStatus'] = investigation.investigationStatus;
                    }
                }

                invRow['sumDuration'] = inv.sumDuration ? (inv.sumDuration + 'h') : '';
                invRow['lastMonthSumDuration'] = inv.lastMonthSumDuration ? (inv.lastMonthSumDuration + 'h') : '';

                invInfoList.push(invRow);
            })
        }
        

        return invInfoList;
    }


    render() {
        const { confirmLoading, visible } = this.state;
        return (
            <Modal
                visible={visible}
                className="processModal"
                wrapClassName="vertical-center-modal"
                width="900"
                confirmLoading={confirmLoading}
                footer={[<Button key="back" type="primary" size="large" onClick={this.hide}>关闭</Button>,]}
            >
                <div style={{textAlign:'center'}}>
                    <label style={{fontSize:16+'px'}}>项目档案</label>
                </div>
                <br/>
                <br/>
                <div>
                    <label>工号：{this.state.employee? this.state.employee.code : ''}</label>
                    <label style={{marginLeft:20+'px'}}>姓名：{this.state.employee? this.state.employee.name : ''}</label>
                </div>
                <br/>
                <hr/>
                <div>
                    <Table
                        columns={this.getColumns()}
                        dataSource={this.getDataSource()}
                        rowKey={record => record.id}
                        pagination={false}
                        scroll={{x:true}}
                        rowClassName={(record, index) => {
                            if(record.investigationStatus === 'UNDERWAY'){
                                return "blue-bkg";
                            }else if(record.investigationStatus === 'COMPLETED'){
                                return "grey-bkg";
                            }
                        }}
                        bordered
                    />
                </div>
            </Modal>


        );
    }
}

export default EmployeeDetailModal;
