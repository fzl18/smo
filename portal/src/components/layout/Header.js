import React from 'react';
import './style/layout.less';
import InvRoleSiteSelectionModal from './InvRoleSiteSelectionModal';
import API_URL from "../../common/url";
import $ from "../../common/AjaxRequest";
import ENV from '../../common/env.js';

class Header extends React.Component {
    state = {
        formVisible: false,
        countNotice: 0,
    };

    clickChangeSite = () => {
        this.invRoleSiteSelectionModalRef.show();
    }

    clickBack = () => {
        if (sessionStorage.siteId > 0 || sessionStorage.invId > 0) {
            sessionStorage.siteId = 0;
            sessionStorage.invId = 0;
            sessionStorage.curRole = sessionStorage.positionRole;
            sessionStorage.investigationSiteName = '';
            sessionStorage.investigationSiteCode = '';
            location.href = `#/invList`;
        }

    }

    exit = () => {
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
        sessionStorage.employeeCode = '';
        location.href = `${API_URL.config.logoutUrl}`;
    }

    updateInvestigationState = investigationId => {
        const options = {
            url: `${API_URL.investigation.getBaseInfo}`,
            data: {
                investigationId,
            },
            dataType: 'json',
            doneResult: ( data => {
                if(data.investigation){
                    sessionStorage.invStatus = data.investigation.investigationStatus;
                    sessionStorage.completeTime = data.investigation.completeTime;
                }
            }),
        };
        $.sendRequest(options);
    }

    changeInvAndRoleAndSite = (invId, invName, roleCode, siteId, investigationSiteName, investigationSiteCode) => {
        if(sessionStorage.invId != invId){
            this.updateInvestigationState(invId);
        }
        sessionStorage.invId = invId;
        sessionStorage.invName = invName;
        
        sessionStorage.siteId = siteId;
        sessionStorage.investigationSiteName = investigationSiteName;
        sessionStorage.investigationSiteCode = investigationSiteCode;
        //location.href = `./`;
        if((sessionStorage.curRole == "PA" && roleCode !=="PA")){
            sessionStorage.curRole = roleCode;
            location.href = ENV.SAML_URL +`/#/summary/view/cumInfRan`;
        }else if(roleCode == "PA"){
            sessionStorage.curRole = roleCode;
            sessionStorage.investigationSiteName = "";
            sessionStorage.investigationSiteCode = "";
            location.href = ENV.SAML_URL +`/#/invDetails`;
            location.reload();
        }else{
            sessionStorage.curRole = roleCode;
            location.reload();
        }
    }

    clearSite = () => {
        sessionStorage.siteId = 0;
        sessionStorage.investigationSiteCode = "";
        sessionStorage.investigationSiteName = "";
    }
    clearInv = () => {
        sessionStorage.invId = 0;
        sessionStorage.invName = "";
    }

    cleanSession = () => {
        const path = location.hash.substr(1);
        const startWith = (str) => {
            return path.startsWith(str);
        }
        //匹配Route的Path，在特定页面清空特定session
        if (startWith('/siteList')) {
            this.clearSite();
        }
        if (startWith('/invList') || startWith('/home') || startWith('/manHour') || startWith('/user') || startWith('/hospital')) {
            this.clearSite();
            this.clearInv();
        }
    };

    loadCountNotice = () => {
        if (sessionStorage.userId != null && sessionStorage.userId != undefined && sessionStorage.userId != '') {
            const options = {
                method: 'POST',
                url: API_URL.home.queryTodayNoticeAll,
                data: {},
                dataType: 'json',
                doneResult: data => {
                    if (!data.error) {
                        this.setState({
                            countNotice: data.count
                        });
                    } else {
                        Modal.error({title: data.error});
                    }
                }
            }
            $.sendRequest(options);
        }
    };

    componentDidMount() {
        this.loadCountNotice();
    };

    componentWillReceiveProps(nextProps) {
        this.loadCountNotice();
    }

    render() {
        const {countNotice} = this.state;
        this.cleanSession();
        let imgLogo = <img src={require('../../../public/logo.png')} alt=""/>;
        let roleName = '';
        if (sessionStorage.invId > 0 && sessionStorage.curRole) {
            roleName = sessionStorage.curRole == 'BO' ? '总监' : sessionStorage.curRole == 'BDO' ? 'BD总监' : sessionStorage.curRole == 'BD' ? 'BD' :
                sessionStorage.curRole == 'PA' ? '项目管理员' : sessionStorage.curRole == 'PM' ? '项目经理' : sessionStorage.curRole == 'CRCC' ? 'CRC主管' :
                    sessionStorage.curRole == 'CRCM' ? 'CRC经理' : sessionStorage.curRole == 'CRC' ? '临床协调员' : '其他';
        } else {
            roleName = sessionStorage.positionName && sessionStorage.positionName != undefined ? sessionStorage.positionName : ''
        }
        let siteName = '';
        if(sessionStorage.investigationSiteName){
            siteName = sessionStorage.investigationSiteName;
            if(sessionStorage.investigationSiteCode){
                siteName += '(' + sessionStorage.investigationSiteCode + ')';
            }
        }
        return (

            <header className="header">
                <div className="wrapper">
                    <h1 className="logo">{imgLogo}</h1>
                    <h2 className="slogan">临床试验管理系统欢迎您！</h2>
                    <ul className="topnav">
                        {
                            (sessionStorage.siteId > 0 || sessionStorage.invId > 0)
                            && <li onClick={this.clickChangeSite}>
                                <span className="icon-wrap">
                                    <i className="icon iconfont">&#xe612;</i>
                                </span>
                                <span className="txt">切换</span>
                            </li>
                        }
                        {
                            (sessionStorage.siteId > 0 || sessionStorage.invId > 0) && <li onClick={this.clickBack}>
                                <span className="icon-wrap">
                                    <i className="icon iconfont">&#xe63d;</i>
                                </span>
                                <span className="txt">返回</span>
                            </li>
                        }
                        <li>
                            <a href="#/notice">
                                <span className="icon-wrap">
                                    <i className="icon iconfont">&#xe657;</i>                                    
                                </span>
                                <span className="txt">消息</span>
                                {
                                    countNotice ? <span className="count">{countNotice}</span> : null
                                }
                                
                            </a>
                        </li>
                        <li>
                            <a href="#/setting">
                                <span className="icon-wrap">
                                    <i className="icon iconfont">&#xe607;</i>
                                </span>
                                <span className="txt">设置</span>
                            </a>
                        </li>
                        <li onClick={this.exit}>
                            <span className="icon-wrap">
                                <i className="icon iconfont">&#xe72e;</i>
                            </span>
                            <span className="txt">退出</span>
                        </li>
                    </ul>
                    <div className="login-info-user">
                        <div className="vertical-div">
                            <div className="p1">
                                <span className="user-name">{sessionStorage.userName ? sessionStorage.userName : ''}</span>
                                <span className="user-title">{roleName}</span>
                            </div>
                            {
                                sessionStorage.invId > 0 &&
                                <div className="p2">{sessionStorage.invName ? sessionStorage.invName : ''}</div>
                            }
                            {
                                siteName ? <div className="p2">{siteName}</div> : null
                            }
                        </div>
                    </div>
                    <InvRoleSiteSelectionModal ref={el => {
                        this.invRoleSiteSelectionModalRef = el;
                    }}
                                               changeInvAndRoleAndSite={this.changeInvAndRoleAndSite}/>
                </div>
            </header>
        );
    }
}

export default Header;
