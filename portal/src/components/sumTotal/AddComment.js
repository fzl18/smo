/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import {Modal, Row, Col, Input, message} from 'antd';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';

const TextArea = Input.TextArea;

class AddComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            comment: '',
            investigationSiteWeekSummaryId: '',
        };
    };

   
    show = (investigationSiteWeekSummaryId, comment) => {
        this.setState({
            visible: true,
            investigationSiteWeekSummaryId,
            comment,
        });
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };


    onChangeSiteCode = e => {
        this.setState({
            siteCode: e.target.value,
        });
    };

    handleSubmit = () => {
        const {investigationSiteWeekSummaryId, comment} = this.state;
        const options = {
            url: `${API_URL.summary.updateComment}`,
            data: {
                investigationSiteWeekSummaryId,
                comment,
            },
            dataType: 'json',
            doneResult: ( data => {
                    this.setState({
                        visible: false,
                    });
                    this.props.reload();
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    };

    onTextAreaChange = e => {
        const value = e.target.value;
        this.setState({ comment : value });
    }

    render() {
        const {visible, confirmLoading, comment} = this.state;
        return (
            <Modal
                title="填写备注"
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                confirmLoading={confirmLoading}
            >
                <Row>
                    <Col span={5}>备注：</Col>
                    <Col span={18}>
                        <TextArea value={comment} rows={4} onChange={this.onTextAreaChange} />
                    </Col>
                </Row>
            </Modal>
        );
    }
}

export default AddComment;
