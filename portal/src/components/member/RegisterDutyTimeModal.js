/**
 * Created by casteloyee on 2017/7/20.
 */
import React from 'react';
import { Modal, Row, Col, message, Select, DatePicker } from 'antd';
import API_URL from '../../common/url';
import moment from 'moment';
import AjaxRequest from '../../common/AjaxRequest';

/**
 * 角色选取列表，选择某个角色，然后返回
 */
class RegisterDutyTimeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            userId: '',
            visible: false,
        };
        
    };

    show = siteId => {
        this.setState({
            siteId,
            visible: true,
        });
    };


    hide = () => {
        this.setState({
            visible: false,
        });
    };


    handleSubmit = () => {
        const options = {
            url: `${API_URL.user.registerDutyTime}`,
            data: {
                siteId: this.state.siteId,
                arriveDay:this.state.arriveDay,
            },
            dataType: 'json',
            doneResult: ( data => {
                message.success("操作成功");
                this.setState({
                    visible: false,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    onSelectDay = moment => {
        this.setState({
            value: moment,
            arriveDay:moment.format('YYYY-MM-DD'),
        });
    };

    render() {
        const { visible, confirmLoading, value } = this.state;
        return (
            <Modal
                title='登记上岗时间'
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                confirmLoading={confirmLoading}
            >
                <div>
                    <Row>
                        <Col span={10}>中心上岗时间：</Col>
                        <Col span={14}>
                            <DatePicker value={value} onChange={this.onSelectDay} format='YYYY-MM-DD'/>
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    };
}

export default RegisterDutyTimeModal;
