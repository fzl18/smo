import $ from '../../common/AjaxRequest';
import React from 'react';
import { message, Table, Popconfirm, Modal, Button, Row, Col, Input } from 'antd';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';
// import './style/list.less';

class Setring extends React.Component {
    state = {
        visible: false,
        password: '',
        passwordShow: '',
        newPassword: '',
        newPasswordShow: '',
        rePassword: '',
        rePasswordShow: '',
    };

    show = () => {
        this.setState({
            visible: true
        });
    };

    hide = () => {
        this.setState({
            visible: false
        });
    };

    onInputPassword = e => {
        const val = e.target.value;
        // const show = this.createPasswordShow(val ? val.length : 0);
        this.setState({
            password: val,
            // passwordShow: show,
        });
    };

    
    onInputNewPassword = e => {
        const val = e.target.value;
        // const show = this.createPasswordShow(val ? val.length : 0);
        this.setState({
            newPassword: val,
            // newPasswordShow: show,
        });
    };

    
    onInputRePassword = e => {
        const val = e.target.value;
        // const show = this.createPasswordShow(val ? val.length : 0);
        this.setState({
            rePassword: val,
            // rePasswordShow: show,
        });
    };

    // createPasswordShow = len => {
    //     let p = '';
    //     while(len > 0){
    //         p += '*';
    //         len--;
    //     }
    //     return p;
    // };

    handleSubmit = () => {
        const { password, newPassword, rePassword } = this.state;
        if (StringUtil.isNull(password)){
            message.error("密码不能为空");
            return;
        }
        if (StringUtil.isNull(newPassword)){
            message.error("新密码不能为空");
            return;
        }
        if (StringUtil.isNull(rePassword)){
            message.error("确认密码不能为空");
            return;
        }
        if (newPassword != rePassword){
            message.error("两次输入密码不一致");
            return;
        }
        if (newPassword == password){
            message.error("新密码与原始密码相同");
            return;
        }
        const options = {
            url: `${API_URL.user.modifyPassword}`,
            data: {
                password,
                newPassword,
            },
            dataType: 'json',
            doneResult: ( data => {
                message.success("密码修改成功");
                this.hide();
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    render() {
        const { password, newPassword, rePassword, visible } = this.state;
        return (
            <div className="content-inner">
                <Modal
                    title='修改密码'
                    visible={visible}
                    className="create-modal"
                    onOk={this.handleSubmit}
                    onCancel={this.hide}
                    wrapClassName="vertical-center-modal"
                    width="400px"
                >
                    <div>
                        <Row >
                            <Col span={12}>用户名</Col>
                            <Col span={12}>{sessionStorage.userName}</Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={12}>原密码</Col>
                            <Col span={12}><Input type='password' value={password} onChange={this.onInputPassword} /></Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={12}>新密码</Col>
                            <Col span={12}><Input type='password' value={newPassword} onChange={this.onInputNewPassword} /></Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={12}>确认密码</Col>
                            <Col span={12}><Input type='password' value={rePassword} onChange={this.onInputRePassword} /></Col>
                        </Row>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Setring;
