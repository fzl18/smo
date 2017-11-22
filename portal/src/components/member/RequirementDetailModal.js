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

class FTEDetailModal extends Component {

    state = {
        visible: false,
        confirmLoading: false,
        requirement: {},
        fteList : [],
    };

    show = (id,curRequirementType) => {
        
        if (id,curRequirementType) {
            this.setState({
            visible: true,
            requirement: {},
            fteList : [],
            });
            this.loadData(id,curRequirementType);
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
    loadData = (id,requirementType) => {
        
        if(requirementType){
            const options = {
                method: 'get',
                url: `${API_URL.member.getRequireMents}?requirementId=${id}&requirementType=${requirementType}`,
                doneResult: ( data => {
                        this.setState({
                            requirement: data.data.requirement,
                            fteList : data.data.requirement.fteList,
                        });
                    }
                ),
            };
            AjaxRequest.sendRequest(options);
        }
        
    }

    getColumns = () => {
        const columns = [];
        const {fteList} = this.state;

        columns.push({
            title: '时间',
            dataIndex: 'time',
            key: 'time',
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
        const {fteList} = this.state;
        const fte_temp = {};
        fte_temp["time"] = "FTE"

        let totalFte = 0;
        fteList.map((fte, i) => {
            const time = fte.year + "." + fte.month;
            totalFte += fte.fte;
            fte_temp[time] = fte.fte
        });
        fte_temp["total"] = Number(totalFte.toFixed(2));

        ftes.push(fte_temp);
        return ftes;
    }


    render() {
        const { confirmLoading, visible, requirement, fteList } = this.state;
        const requirementCode = requirement.requirementCode;
        return (
            <Modal
                title={'FTE需求明细'}
                visible={visible}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="650px"
                confirmLoading={confirmLoading}
                footer={[<Button key="back" type="primary" size="large" onClick={this.hide}>关闭</Button>,]}
            >
                <div>
                    <label>需求编号：</label>{requirementCode}
                </div>
                <br/>
                <div className="content">
                    <Table
                        columns={this.getColumns()}
                        dataSource={this.getDataSource()}
                        rowKey={record => record.id}
                        pagination={false}
                        scroll={{ x: this.state.fteList.length * 100 + 160}}
                    />
                </div>
            </Modal>

        );
    }
}

export default FTEDetailModal;
