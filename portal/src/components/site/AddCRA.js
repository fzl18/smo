/**
 * Created by casteloyee on 2017/7/28.
 */
import React from 'react';
import {Modal, Row, Col, Input, Radio, Select, message} from 'antd';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';
import SiteSearchInput from "./SiteSearchInput";
import CustomerSearchInput from "./CustomerSearchInput";

const Option = Select.Option;

class AddCRA extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            investigationSiteId: '',
            investigationSiteCode: '',
            user: {},
        };
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

    handleSelectSite = value => {
        this.setState({
            investigationSiteId: value.value,
            investigationSiteCode: value.text,
        });
    };

    handleSelectUser = value => {
        this.setState({
            user: value,
        });
    };

    handleSubmit = () => {
        const { user, investigationSiteId } = this.state;
        const options = {
            url: `${API_URL.user.addCRA}`,
            data: {
                userId: user.value,
                invSiteId: investigationSiteId,
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    visible: false,
                });
                message.success("添加成功");
                this.props.reload();
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    render() {
        const { visible, confirmLoading, user } = this.state;
        return (
            <Modal
                title="添加CRA"
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
                        <Col span={9}>*中心编号\中心名称：</Col>
                        <Col span={1}/>
                        <Col>
                            <SiteSearchInput placeholder="输入中心编号\中心名称" style={{width: 200}}
                                             handleSelectSite = {this.handleSelectSite}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={9}>*选择CRA：</Col>
                        <Col span={1}/>
                        <Col>
                            <CustomerSearchInput placeholder="输入姓名\手机号码" style={{width: 200}}
                                    handleSelectUser = {this.handleSelectUser}
                                    url = {`${API_URL.customer.list}`}
                                    searchKey='keyword'
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={9}>手机号码：</Col>
                        <Col span={1}/>
                        <Col>{ user.userMobile }</Col>
                    </Row>
                    <Row>
                        <Col span={9}>固定电话：</Col>
                        <Col span={1}/>
                        <Col>{ user.userTelphone }</Col>
                    </Row>
                    <Row>
                        <Col span={9}>邮箱：</Col>
                        <Col span={1}/>
                        <Col>{ user.userEmail }</Col>
                    </Row>
                </div>
            </Modal>
        )
    }
}

export default AddCRA;
