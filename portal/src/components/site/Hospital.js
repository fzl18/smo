/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import { Modal, Row, Col, Button } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';

class Hospital extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
        data: {},
    };

    show = (hospitalId) => {
        const options = {
            url: `${API_URL.hospital.list}`,
            data: {
                hospitalId: hospitalId,
            },
            dataType: 'json',
            doneResult: ( dt => {
                this.setState({
                    data: dt.hospital,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
        this.setState({
            visible: true,
        });
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { visible, confirmLoading, data } = this.state;
        return (
            <Modal
                title="医院信息"
                visible={visible}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                confirmLoading={confirmLoading}
                footer={[
                    <Button key="submit" type="primary" size="large" onClick={this.hide}>
                        确定
                    </Button>,
                ]}
            >
                <Row>
                    <Col span={8} offset={2}>医院名称：</Col>
                    <Col span={12} offset={2}>{data.hospitalName}</Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>医院类型：</Col>
                    <Col span={12} offset={2}>{data.hospitalLevel}</Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>所在省份\直辖市：</Col>
                    <Col span={12} offset={2}>{data.hospitalProvince}</Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>所在城市：</Col>
                    <Col span={12} offset={2}>{data.hospitalCity}</Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>详细地址：</Col>
                    <Col span={12} offset={2}>{data.hospitalAddress}</Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>备注：</Col>
                    <Col span={12} offset={2}>{data.remark}</Col>
                </Row>
            </Modal>
        );
    }
}

export default Hospital;
