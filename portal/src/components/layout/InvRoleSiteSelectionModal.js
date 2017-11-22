import React, { Component } from 'react';
import { Modal, Button, Icon, Row, Col, Input } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import SearchSelect from '../common/SearchSelect';


class InvRoleSiteSelectionModal extends Component {

    state = {
        visible: false,
        loading: true,
        confirmLoading: false,
        dataList: [],
        investigationId: '',
        investigationName: '',
        roleCode: '',
        siteId: '',
        investigationSiteName: '',
        investigationSiteCode: '',
        renderSite: true,
        renderRole:true
    };

    show = () => {
        const {invName, invId, curRole, investigationSiteCode, investigationSiteName, siteId} = sessionStorage;
        this.setState({
            visible: true,
            investigationId: invId,
            investigationName: invName,
            roleCode: curRole,
            investigationSiteName,
            investigationSiteCode,
            siteId
        });
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    handleSelectInvestigation = inv => {
        this.setState({
            investigationId: inv.key,
            investigationName: inv.label,
            roleCode: '',
            siteId: '',
            investigationSiteName: '',
            investigationSiteCode: '',
            renderSite: false,
            renderRole: false
        },function(){
            this.setState({
                renderSite: true,
                renderRole: true
            })
        });
    }

    handleSelectRole = roleCode => {
        this.setState({
            roleCode,
            siteId: '',
            renderSite: false,
            investigationSiteName: '',
            investigationSiteCode: '',
        },function(){
            this.setState({
                renderSite: true
            })
        });
    }

    handleSelectSite = (siteId, siteName) => {
        let investigationSiteName = siteName;
        let investigationSiteCode = '';
        const idx1 = siteName.lastIndexOf("(");
        const idx2 = siteName.lastIndexOf(")");
        if(idx1 > 0 && idx2 > 0 && idx2 > idx1 && idx2 == siteName.length - 1){
            investigationSiteName = siteName.substr(0, idx1);
            investigationSiteCode = siteName.substr(idx1 + 1, idx2 - 1).slice(0,-1);
        }
        this.setState({
            siteId,
            investigationSiteName,
            investigationSiteCode,
        });
    }

    getInvestigationId = () => {
        return this.state.investigationId;
    }

    getRoleCode = () => {
        return this.state.roleCode;
    }

    handleSubmit = () => {
        const {investigationId, investigationName, roleCode, siteId, investigationSiteName, investigationSiteCode} = this.state;
        if(siteId || (!siteId && roleCode == 'PA')){
            // sessionStorage.invId = investigationId;
            // sessionStorage.invName = investigationName;
            // sessionStorage.curRole = roleCode;
            // sessionStorage.siteId = siteId;
            this.setState({
                visible: false,
            });
            this.props.changeInvAndRoleAndSite(investigationId, investigationName, roleCode, siteId, investigationSiteName, investigationSiteCode);
        }
    }
   
    render() {
        const { visible, confirmLoading, roleCode, renderSite, renderRole } = this.state;
        return (
            <Modal
                title="切换项目\角色\中心"
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal switch-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                confirmLoading={confirmLoading}
            >
                <div>
                    <Row>
                        <Col span={6}>项目:</Col>
                        <Col span={18}>
                            <InvestigationSearchInput style={{width: 200}}
                                handleSelectInvestigation = {this.handleSelectInvestigation}
                                pState={this.state}     
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>角色:</Col>
                        <Col span={18}>
                            <RoleSearchInput style={{width: 200}}
                                handleSelectRole = {this.handleSelectRole}
                                getInvestigationId = {this.getInvestigationId}
                                renderRole = {renderRole}
                                pState={this.state}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>中心:</Col>
                        <Col span={18}>
                            <SiteSearchInput style={{width: 200}}
                                handleSelectSite = {this.handleSelectSite}
                                getInvestigationId = {this.getInvestigationId}
                                getRoleCode = {this.getRoleCode}
                                roleCode = {roleCode}
                                renderSite = {renderSite}
                                pState={this.state}
                            />
                        </Col>
                    </Row>
                </div>
            </Modal>
        );
    }
}

class InvestigationSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invDataList: [],
        };
    };

    parserData = dt => {
        const invDataList = dt.data.investigations.map(r => ({
            text: r.investigationName,
            value: r.investigationId,
        }));
        this.setState({
            invDataList,
        });
    };

    handleSelect = value => {
        this.props.handleSelectInvestigation(value);
    };

    render() {
        const url = `${API_URL.investigation.queryUserInvestigationList}`;
        const params = {positionRole:sessionStorage.positionRole};
        const {invDataList} = this.state;
        const { investigationName, investigationId} = this.props.pState;
        return (
            <SearchSelect url={url}
                          style={this.props.style}
                          searchKey='searchKey'
                          searchParam={params}
                          sourceData={invDataList}
                          parserData={this.parserData}
                          handleSelect = {this.handleSelect}
                          placeholder = {this.props.placeholder}
                          initValue = {{key:investigationName, label:investigationId}}
            />
        );
    };

}

class RoleSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    };

    parserData = dt => {
        if (dt.data && dt.data.roles) {
            const data = dt.data.roles.map(r => ({
                text: r,
                value: r,
            }));
            this.setState({
                data,
            });
        }
    };

    handleSelect = value => {
        this.props.handleSelectRole(value.key);
    };

    getDynamicParams = () => {
        const invId = this.props.getInvestigationId();
        if(invId){
            return {investigationId: invId};
        }
        return null;
    }

    render() {
        const url = `${API_URL.user.getRoleListForInvestigation}`;
        const params = {};
        const {data} = this.state;
        const {roleCode} = this.props.pState;
        return (
            this.props.renderRole && <SearchSelect url={url}
                          style={this.props.style}
                          searchKey='searchKey'
                          searchParam={params}
                          sourceData={data}
                          parserData={this.parserData}
                          handleSelect = {this.handleSelect}
                          getDynamicParams = {this.getDynamicParams}
                          placeholder = {this.props.placeholder}
                          initValue = {{key:roleCode, label:roleCode}}
            />
        );
    };

}

class SiteSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    };

    parserData = dt => {
        if (dt.data && dt.data.siteList && dt.data.siteList.length > 0) {
            const data = dt.data.siteList.map(r => ({
                text: r.investigationSiteCode != null && r.investigationSiteCode != undefined ? r.investigationSiteName + '(' + r.investigationSiteCode + ')' : r.investigationSiteName,
                value: r.investigationSiteId,
            }));
            this.setState({
                data,
            });
        }
    };

    handleSelect = value => {
        this.props.handleSelectSite(value.key, value.label);
    };

    getDynamicParams = () => {
        const invId = this.props.getInvestigationId();
        const roleCode = this.props.getRoleCode();
        if(invId && roleCode){
            return {investigationId: invId, roleCode,};
        }
        return null;
    }

    render() {
        const url = `${API_URL.site.queryUserSiteList}`;
        const params = {};
        const {data} = this.state;
        const {investigationSiteName, investigationSiteCode} = this.props.pState;
        const initValue = investigationSiteName ? {key:`${investigationSiteName}(${investigationSiteCode})`, label:investigationSiteCode} : {key:"",label:""};
        return (
            this.props.roleCode !== "PA" ?
            this.props.renderSite && <SearchSelect url={url}
                          style={this.props.style}
                          searchKey='searchKey'
                          searchParam={params}
                          sourceData={data}
                          parserData={this.parserData}
                          handleSelect = {this.handleSelect}
                          getDynamicParams = {this.getDynamicParams}
                          placeholder = {this.props.placeholder}
                          initValue = {initValue}
            />
            :
            <Input disabled={true} style={{width:"200px"}} />
        );
    };

}

export default InvRoleSiteSelectionModal;
