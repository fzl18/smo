/**
 * Created by casteloyee on 2017/7/15.
 */
import React, { Component } from 'react';
import { Input, Modal, Button, message, Row, Col } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';

class AddQAList extends Component {

    constructor(props){
        super(props);
        this.state = {
            visible: false,
            questionCatetoryId: '',
            questionCatetoryName: '',
        };
    }

    show = (questionCatetoryId, questionCatetoryName) => {
        this.setState({
            questionCatetoryId,
            questionCatetoryName,
            visible: true,
        });
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    questionCatetoryNameChanged = e => {
        this.setState({
            questionCatetoryName: e.target.value,
        });
    };

    handleSubmit = () => {
        const { questionCatetoryId, questionCatetoryName } = this.state;
        const options = {
            url: questionCatetoryId > 0 ? `${API_URL.execute.modifyQuestionCategory}` : `${API_URL.execute.createQuestionCategory}`,
            data: {
                questionCatetoryId,
                questionCatetoryName,
            },
            dataType: 'json',
            doneResult: ( data => {
                Modal.success({title: questionCatetoryId > 0 ? '修改成功' : '添加成功'});
                this.setState({
                    visible: false,
                });
                this.props.reload();
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    render() {
        const { visible,confirmLoading, questionCatetoryId, questionCatetoryName } = this.state;
        return (
            <Modal
                title={questionCatetoryId > 0 ? '修改问题分类' : '添加问题分类'}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                confirmLoading={confirmLoading}
                >
                <Row>
                    <Col span={10}>问题分类名称</Col>
                    <Col span={14}><Input value={questionCatetoryName} onChange={this.questionCatetoryNameChanged} /></Col>
                </Row>
            </Modal>
        );
    }

}

export default AddQAList;