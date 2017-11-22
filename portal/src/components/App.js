import React from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Nav from './layout/Nav';
import Pin from './layout/Pin';
import Jquery from '../common/XDomainJquery';
import API_URL from "../common/url";
import { Spin, Modal } from 'antd';
import ENV from '../common/env.js';

class App extends React.Component {
    state = {
        show: false,
    };

    showConfirm = () => {
        Modal.warning({
            title: '该用户无SMO系统权限',
            content: '该用户无SMO系统权限',
            onOk() {
                sessionStorage.curRole = '';
                sessionStorage.positionRole = '';
                sessionStorage.positionName = '';
                sessionStorage.userId = '';
                sessionStorage.userName = '';
                sessionStorage.curEnterpriseId = '';
                sessionStorage.curEmployeeCode = '';
                sessionStorage.invName = '';
                sessionStorage.invId = 0;
                sessionStorage.siteId = 0;
                sessionStorage.investigationSiteName = '';
                sessionStorage.investigationSiteCode = '';
                location.href = ENV.LOGOUT_URL
              },
        });
    }

    getUserInfo = () =>{
        Jquery.ajax({
            method: 'get',
            url: `${API_URL.user.getUserInfo}`,
            data: {
                employeeCode: sessionStorage.employeeCode,
            },
            type: 'json',
        }).done(result => {
            if (result.error) {
                console.error(result.error);
                this.showConfirm();
                return;
            } else if (result.data.error) {
                console.error(result.data.error);
            } else {
                sessionStorage.userId = result.data.user.userId;
                sessionStorage.positionName = 
                    result.data.user.positionName != undefined && result.data.user.positionName != null ?
                        result.data.user.positionName : '';
                sessionStorage.userName = result.data.user.userCompellation;
                sessionStorage.curEnterpriseId = result.data.user.enterpriseId;
                sessionStorage.curRole = result.data.positionRole;
                sessionStorage.positionRole = 
                    result.data.positionRole != undefined && result.data.positionRole != null ? 
                        result.data.positionRole : '';
                sessionStorage.curEmployeeCode = sessionStorage.employeeCode;
                sessionStorage.invName = '';
                sessionStorage.invId = 0;
                sessionStorage.siteId = 0;
                if(!sessionStorage.positionRole){
                    Modal.error({title:'您的职位尚未配置操作权限，无法访问，请联系企业管理员配置后重试。'});
                    //TODO:  to do logout  上线前修改为saml logout
                    sessionStorage.curRole = '';
                    sessionStorage.positionRole = '';
                    sessionStorage.positionName = '';
                    sessionStorage.userId = '';
                    sessionStorage.userName = '';
                    sessionStorage.curEnterpriseId = '';
                    sessionStorage.curEmployeeCode = '';
                    sessionStorage.invName = '';
                    sessionStorage.invId = 0;
                    sessionStorage.siteId = 0;
                    location.href = `${API_URL.config.logoutUrl}`;
                }else{
                    this.setState({
                        show: true
                    })
                }
            }
        });
    }

    checkLogin = () => {
        let isLogin = sessionStorage.userId != undefined && sessionStorage.userId != null && sessionStorage.userId > 0;
        // TODO:https-saml
        // if (!isLogin  && (sessionStorage.employeeCode == undefined || sessionStorage.employeeCode == '' || sessionStorage.employeeCode == '')){
        const isDemoLoginPage = location.hash.substr(1) == "/login";
        if (isLogin == false && !isDemoLoginPage){
            if(sessionStorage.employeeCode){
                this.getUserInfo();
            }else{
                Jquery.ajax({
                    method: 'get',
                    url: `${API_URL.user.getEmployeeCode}`,
                    data: {},
                    type: 'json',
                }).done(data => {
                    if (data.error) {
                        console.error(data.error);
                    } else {
                        sessionStorage.employeeCode = data.employeeCode;
                        this.getUserInfo();
                    }
                });
            }
        }else{
            this.setState({
                show: true
            })
        }
    }


    componentDidMount(){
        this.checkLogin();
    }

    componentWillReceiveProps(){
        this.checkLogin();
    }

    render() {
        const {show} = this.state;
        return (
            show ? 
            <div>
                <Header />
                <Nav />
                <Pin />
                <div className="container">
                    <div className="wrapper">
                        { this.props.children }
                    </div>
                </div>
                <Footer />
            </div>
            :
            <Spin tip="加载用户数据..." style={{position:"fixed",top:"50%",left:"50%"}}>
            </Spin>
        );
    }
}

export { App as default };
