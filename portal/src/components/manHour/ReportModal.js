import React from 'react';
import $ from 'jquery';
import { Modal, Button, DatePicker } from 'antd';
import API_URL from '../../common/url';
import ExportUtil from '../../common/ExportUtil';

const {RangePicker } = DatePicker
class ReportModal extends React.Component {
    state = {
        visible: false,
        begin: '',
        end: '',
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

    onChangeDate = (value, dateString) => {
        this.setState({
            begin: dateString[0],
            end: dateString[1],
        });
    }

    export = () => {
        const {begin, end} = this.state;
        const options = {
            begin,
            end,
        };
        const url = `${API_URL.manhour.exportManHourDetail}`;
        ExportUtil.export(options, null, url);
    }

    render() {
        const { visible } = this.state;
        return (
            <Modal
                title="导出工时记录"
                visible={visible}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="500px"
                footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
            >
                <div className="cont-cont">
                    <ul className="preview-list">
                        <li className="title">
                            <label className="ui-label">时间段:</label>
                            <span className="ui-text" style={{marginLeft:20,verticalAlign:'top',display:'inline-block'}}><RangePicker onChange={this.onChangeDate} /></span>
                            <span className="ant-divider" />
                            <Button type='primary' onClick={this.export}>导出</Button>
                        </li>
                    </ul>
                </div>
            </Modal>
        );
    }
}

export default ReportModal;
