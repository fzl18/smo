/**
 * Created by casteloyee on 2017/7/15.
 */
import React, { Component } from 'react';
import { Input, Modal, Button, message, Row, Col } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';

class EditCheckList extends Component {

    constructor(props){
        super(props);
        this.state = {
            visible: false,
            investigationCheckListId: '',
            checkName: '',
        };
    }

    show = (investigationCheckListId, checkName) => {
        this.setState({
            investigationCheckListId,
            checkName,
            visible: true,
        });
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    checkNameChanged = e => {
        this.setState({
            checkName: e.target.value,
        });
    };

    handleSubmit = () => {
        const { investigationCheckListId, checkName } = this.state;
        const options = {
            url: investigationCheckListId > 0 ? `${API_URL.execute.updateInvestigationCheckList}` : `${API_URL.execute.addInvestigationCheckList}`,
            data: {
                investigationCheckListId,
                checkName,
            },
            dataType: 'json',
            doneResult: ( data => {
                Modal.success({title: investigationCheckListId > 0 ? '修改成功' : '添加成功'});
                this.setState({
                    visible: false,
                });
                this.props.reload();
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    render() {
        const { visible,confirmLoading, investigationCheckListId, checkName } = this.state;
        return (
            <Modal
                title={investigationCheckListId > 0 ? '修改checklist项' : '添加checklist项'}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                confirmLoading={confirmLoading}
                >
                <Row>
                    <Col span={10}>checklist记录项名称</Col>
                    <Col span={14}><Input value={checkName} onChange={this.checkNameChanged} /></Col>
                </Row>
            </Modal>
        );
    }

}

export default EditCheckList;