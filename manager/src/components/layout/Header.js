import React from 'react';
import './style/layout.less';
import $ from '../../common/AjaxRequest';
import API_URL from '../../common/url';
import Setting from './Setting';

class Header extends React.Component {
    state = {
        formVisible: false,
    };

    setting = () => {
        this.settingRef.show();
    }

    logout = () => {
        const options = {
            url: `${API_URL.user.clearSession}`,
            data: {},
            dataType: 'json',
            doneResult: ( data => {
                sessionStorage.roleCode = '';
                sessionStorage.userId = 0;
                window.location.href = sessionStorage.logOutUrl;
            }),
        };
        $.sendRequest(options);
    }

    render() {
        let imgLogo = <img src={require('../../../images/logo.png')} alt="" />;
        return (
            <header className="header">
                <div className="wrapper">
                    <h1 className="logo">{imgLogo}</h1>
                    <h2 className="slogan">临床试验管理后台系统欢迎您！</h2>
                    <ul className="topnav">
                        <li>{sessionStorage.userName}  </li>
                        <li>
                            <snap className="txt">{sessionStorage.roleCode == 'EA' ? '企业管理员' : '系统管理员'}</snap>
                        </li>
                        <li onClick={this.setting}>
                            <a href="javascript:void(0)">
                            <span className="icon-wrap">
                                <i className="icon iconfont">&#xe607;</i>
                            </span>
                            
                            <span className="txt">设置</span>
                            </a>
                        </li>
                        <li>
                            <a onClick={this.logout}>
                                <span className="icon-wrap">
                                    <i className="icon iconfont">&#xe72e;</i>
                                </span>
                                <span className="txt">退出</span>
                            </a>
                        </li>
                    </ul>
                    <Setting ref={el => { this.settingRef = el; }} />
                </div>
            </header>
        );
    }
}

export default Header;
