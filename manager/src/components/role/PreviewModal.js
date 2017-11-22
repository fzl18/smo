import React from 'react';
import $ from '../../common/AjaxRequest';
import { Modal, Button } from 'antd';
import API_URL from '../../common/url';
// import Fetch from '../../common/FetchIt';

class PreviewModal extends React.Component {

    state = {
        visible: false,
        investigation: {},
    };

    loadData = (id) => {
        const options ={
            method: 'get',
            url: `${API_URL.investigation.view}`,
            data: {
                investigationId:id,
                offset: 1,
                limit: 15,
            },
            dataType: 'json',
            doneResult: (data => {
                this.setState({
                    investigation: data.investigation,
                });
            })
        }
        $.sendRequest(options)



        // Fetch.get(`${API_URL.investigation.view}?investigationId=${id}`).then(data => {
        //     this.setState({
        //         investigation: data.investigation,
        //     });
        // });
    };

    show = id => {
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
        });
    };
    render() {
        const { visible } = this.state;        
        return (
            <Modal
                title="配置权限"
                visible={visible}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
            >
                <div className="cont-cont">
                    <ul className="preview-list">
                        <li className="title"><h4>暂无</h4></li>                        
                    </ul>
                </div>
            </Modal>
        );
    }
}

export default PreviewModal;
