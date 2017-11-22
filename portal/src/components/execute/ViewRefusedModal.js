import React, { Component } from 'react';
import $ from 'jquery';
import { Form, Input, Modal, Button, Select, DatePicker, message, Icon, InputNumber, Table } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';

class ViewRefusedModal extends Component {

    state = {
        visible: false,
        data : [], 
        loading: false
    };

    show = (id) => {
        this.setState({
            visible: true,
        });
        if (id) {

            this.loadData(id);
        }
    };


    hide = () => {
        this.setState({
            visible: false,
            data : []
        });
    };

    /**
     * 获取项目详细信息
     * @param id
     */
    loadData = id => {
        this.setState({
            loading: true
        });
        const options = {
            method: 'get',
            url: `${API_URL.execute.queryReturnRecords}?requirementId=${id}`,
            doneResult: ( data => {
                    let d = data.data;
                    this.setState({
                        data : d.returnList,
                        loading : false,
                    });
                }
            ),
            errorReuslt: ( () => {
                    this.setState({
                        loading : false,
                    });
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    }

    getColumns = () => [{
        title: '打回时间',
        dataIndex: 'createTime',
        key: 'createTime',
    }, {
        title: '打回原因',
        dataIndex: 'remark',
        key: 'remark',
    }, {
        title: '操作人',
        dataIndex: 'user',
        key: 'user',
    }]

    getDataSource = () => {
        const refuseList = [];
        const {data} = this.state;

        if(data != undefined){
            data.map((value, i) =>{
                const refuseRow = {};
                refuseRow['createTime'] = value.createTime;
                refuseRow['user'] = value.user;
                refuseRow['remark'] = value.remark;
                refuseList.push(refuseRow);
            })
        }
        

        return refuseList;
    }


    render() {
        const {visible, loading } = this.state;
        return (
            <Modal
                visible={visible}
                className="processModal"
                onCancel={this.hide}
                wrapClassName="vertical-center-modal"
                width="900"
                footer={[<Button key="back" type="primary" size="large" onClick={this.hide}>关闭</Button>,]}
            >
                <div style={{textAlign:'center'}}>
                    <label style={{fontSize:16+'px'}}>查看打回记录</label>
                </div>
                <br/>
                <br/>
                <hr/>
                <div>
                    <Table
                        columns={this.getColumns()}
                        dataSource={this.getDataSource()}
                        rowKey={record => record.requirementTransactionId}
                        pagination={false}
                        loading={loading}
                        bordered
                    />
                </div>
            </Modal>


        );
    }
}

export default ViewRefusedModal;
