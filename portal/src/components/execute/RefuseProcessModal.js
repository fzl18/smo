import React, { Component } from 'react';
import $ from 'jquery';
import { Form, Input, Modal, Button, Select, DatePicker, message, Icon, InputNumber, Table } from 'antd';
const { TextArea } = Input;
const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY.MM';
import API_URL from '../../common/url';
import moment from 'moment'
import AjaxRequest from '../../common/AjaxRequest';

const FormItem = Form.Item;
const Option = Select.Option;

class RefuseProcessModal extends Component {

    state = {
        visible: false,
        confirmLoading: false,
        requirementId : '',
        reason : '',
    };

    show = id => {
        this.setState({
            visible: true,
            requirementId : '',
        });
        if (id) {
            this.setState({
                requirementId : id,
            });
        }
    };

    reload = () => {
        this.props.reload();
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    changeReason = event =>{
        var getValue = event.target.value;
        this.setState({
            reason: getValue,
        });
    }


    handleSubmit = () => {
        this.setState({ confirmLoading: true });

        const reason = this.state.reason;
        if(reason == null || reason == undefined || $.trim(reason) == ""){
            message.error("拒绝理由不能为空");
            this.setState({ confirmLoading: false });
            return false;
        }
        const requirementId = this.state.requirementId;
        let param = "requirementId="+requirementId+"&reason="+reason
        const options = {
            method: 'get',
            url: `${API_URL.user.rejectHandoverAssign}?${param}`,
            doneResult: ( data => {
                    this.setState({
                        visible : false,
                        confirmLoading: false
                    })
                    message.success('操作成功');
                    this.reload();
                }
            ),
            errorResult: ( () => {
                this.setState({
                    confirmLoading: false
                })
            }
        ),
        };
        AjaxRequest.sendRequest(options);

    }


    render() {
        const { confirmLoading, visible } = this.state;
        return (
            <Modal
                title={'需求分配明细'}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="650px"
                confirmLoading={confirmLoading}
            >
                <div style={{ textAlign: 'center' }}>
                    <label style={{ fontSize: `${16}px` }}>拒绝分配</label>
                </div>
                <br/>
                <div className="field-max">
                   <TextArea placeholder="请填写拒绝理由" value={this.state.reason} onChange={this.changeReason} rows={4} />
                </div>

            </Modal>
        );
    }
}

export default RefuseProcessModal;
