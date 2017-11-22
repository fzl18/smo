import React from 'react';
import $ from '../../common/AjaxRequest';
import { Modal, Button } from 'antd';
import API_URL from '../../common/url';
// import Fetch from '../../common/FetchIt';

class PreviewModal extends React.Component {

    state = {
        visible: false,
        enterprise: {},
    };

    loadData = (id) => {
        const options ={
            method: 'POST',
            url: `${API_URL.entmanager.view}`,
            data: {
                enterpriseId:id,
                offset: 1,
                limit: 15,
            },
            dataType: 'json',
            doneResult: (data => {
                if (!data.error) {                
                    const pagination = { ...this.state.pagination };
                    pagination.total = data.totalCount;
                    this.setState({
                        loading: false,
                        enterprise: data.enterprise,
                        pagination,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            })
        }
        $.sendRequest(options)
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
        const {
            enterpriseName,
            enterpriseBusinessNum,
            enterpriseOrganizationCode,
            enterpriseAddress,
            enterpriseEmail,
            enterpriseSetupday,
            enterpriseRegisteredCapital,
            enterprisePostcode,
            enterpriseProperty,
        } = this.state.enterprise;
        return (
            <Modal
                title="查看企业"
                visible={visible}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="650px"
                footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
            >
                <div className="cont-cont">
                    <ul className="preview-list">
                        
                        <li>
                            <div className="item">
                                <label className="ui-label">企业名称</label>
                                <span className="ui-text">{enterpriseName}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">营业执照注册号</label>
                                <span className="ui-text">{enterpriseBusinessNum}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">组织机构代码</label>
                                <span className="ui-text">{enterpriseOrganizationCode}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">企业地址</label>
                                <span className="ui-text">{enterpriseAddress}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">邮编</label>
                                <span className="ui-text">{enterprisePostcode}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">企业邮箱</label>
                                <span className="ui-text">{enterpriseEmail}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">企业成立日期</label>
                                <span className="ui-text">{enterpriseSetupday}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">企业注册资本</label>
                                <span className="ui-text">{enterpriseRegisteredCapital} 万元</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">企业性质</label>
                                <span className="ui-text">{enterpriseProperty}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </Modal>
        );
    }
}

export default PreviewModal;
