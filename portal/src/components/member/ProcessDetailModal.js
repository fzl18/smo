import React, { Component } from 'react';
import $ from 'jquery';
import { Form, Input, Modal, Button, Select, DatePicker, message, Icon, InputNumber, Table } from 'antd';
const { TextArea } = Input;
const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY.MM';
import API_URL from '../../common/url';
import InvSiteSearchInput from './InvSiteSearchInput';
import moment from 'moment'
import AjaxRequest from '../../common/AjaxRequest';

const FormItem = Form.Item;
const Option = Select.Option;

class ProcessDetailModal extends Component {

    state = {
        visible: false,
        confirmLoading: false,
        assignments: [],
        requirementCode: '',
        fteList: [],
    };

    show = id => {
        this.setState({
            visible: true,
            assignments: {},
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
            url: `${API_URL.member.queryFteAssignDetail}?requirementId=${id}`,
            doneResult: (data => {
                this.setState({
                    assignments: data.data.assignments,
                    requirementCode: data.data.requirementCode,
                    fteList: data.data.fteList,
                });
            }
            ),
        };
        AjaxRequest.sendRequest(options);
    }

    getColumns = () => {
        const columns = [];
        const { fteList } = this.state;

        columns.push({
            title: '工号',
            dataIndex: 'employeeCode',
            key: 'employeeCode',
        })
        columns.push({
            title: '姓名',
            dataIndex: 'employeeName',
            key: 'employeeName',
          
        })
        fteList.map((fte, i) => {
            const time = fte.year + "." + fte.month;
            columns.push({
                title: time,
                dataIndex: time,
                key: time,
              
            });
        });
        columns.push({
            title: '总计',
            dataIndex: 'total',
            key: 'total',
           
        })
        return columns;
    }

    getDataSource = () => {
        const ftes = [];
        const { assignments, fteList } = this.state;

        if (assignments && assignments.length > 0) {
            assignments.map((assignment, i) => {
                const fte_temp = {};
                fte_temp["employeeCode"] = assignment.employeeCode;
                fte_temp["employeeName"] = assignment.userName;
                const detailList = assignment.detailList;
                detailList.map((detail, i) => {
                    const time = detail.year + "." + detail.month;
                    fte_temp[time] = detail.planFte;
                });
                fte_temp["total"] = assignment.planFte;
                ftes.push(fte_temp);
            });
        }
        return ftes;
    }


    render() {
        const { confirmLoading, visible, requirementCode, fteList } = this.state;
        return (
            <Modal
                title={'需求分配明细'}
                visible={visible}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="650px"
                confirmLoading={confirmLoading}
                footer={[<Button key="back" type="primary" size="large" onClick={this.hide}>关闭</Button>,]}
            >
                <div>
                    <label>需求编号：{requirementCode}</label>
                </div>
                <br />
                <div className="content"  >
                    <Table 
                        
                        columns={this.getColumns()}
                        dataSource={this.getDataSource()}
                        rowKey={record => record.id}
                        pagination={false}
                        scroll={{ x: fteList.length * 85 + 270 }}
                    />
                </div>
            </Modal>

        );
    }
}

export default ProcessDetailModal;
