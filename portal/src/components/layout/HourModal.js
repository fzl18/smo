import React, { Component } from 'react';
import $ from 'jquery';
import { Form, Input, Modal, Button, Select, DatePicker, message, Icon, InputNumber } from 'antd';
import ManHourRecord from '../manHour/Write'
import './style/layout.less'

class HourModal extends Component {

    state = {
        visible: false,
    };

    show = () => {
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
        const {visible} = this.state;

        return (
            <Modal
                title='工时记录'    
                visible={visible}
                onCancel={this.hide}
                footer={null}
                className="hour-modal"
                wrapClassName="vertical-center-modal"
                width="1000px"
            >
                <ManHourRecord disableSider={true}  />
            </Modal>

        );
    }
}

export default HourModal;
