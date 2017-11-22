import React from 'react';
import moment from 'moment';
import $ from '../../common/AjaxRequest';
import { Modal, Button,Table } from 'antd';
import API_URL from '../../common/url';
// import Fetch from '../../common/FetchIt';

class PreviewModal extends React.Component {

    state = {
        visible: false,
        investigation: {},
        userDetail:{},
        invInfo:[],
        user : {},
        loading:false,
    };

    loadData = (id) => {
        const options ={
            method: 'POST',
            url: `${API_URL.user.queryEnterpriseUserById}`,
            data: {
                userId:id,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    investigation: data.data.userInfo.user,
                    userDetail: data.data.userInfo.user.userDetail,
                    user: data.data.userInfo.user,
                    invInfo:data.data.invInfo,
                });
            }
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


    getColumns = () => [{
            title: '项目编号',
            dataIndex: 'investigationCode',
            key: 'investigationCode',
            width:80
        }, {
            title: '项目名称',
            dataIndex: 'investigationName',
            key: 'investigationName',
            width:200
        }, {
            title: '中心编号',
            dataIndex: 'investigationSiteCode',
            key: 'investigationSiteCode',
            width:80
        }, {
            title: '中心名称',
            dataIndex: 'investigationSiteName',
            key: 'investigationSiteName',
            width:200
        }, {
            title: '适应症',
            dataIndex: 'investigationMalady',
            key: 'investigationMalady',
            width:150
        }, {
            title: '研究药物',
            dataIndex: 'investigationMedicine',
            key: 'investigationMedicine',
            width:150
        }, {
            title: '当月计划FTE',
            dataIndex: 'planFte',
            key: 'planFte',
            width:80
        }]
    
        getDataSource = () => {
            const investigations = [];
            const { invInfo, pagination } = this.state;    
            invInfo.map((investigation, i) => {
                investigations.push({
                    // index: ((pagination.current - 1) || 0) * 15 + i + 1,
                    id: investigation.user_role_investigation_site_id,
                    planFte: investigation.plan_fte_sum,
                    investigationCode: investigation.investigation_code,
                    investigationName: investigation.investigation_name,
                    investigationSiteName: investigation.investigation_site_name,
                    investigationSiteCode: investigation.investigation_site_code,
                    investigationMalady: investigation.investigation_malady,
                    investigationMedicine: investigation.investigation_medicine,
                });
            });
            return investigations;
        }




    render() {
        const { visible,loading} = this.state;
        const {
            userCompellation,
            departmentName,
            enterpriseDepartmentName,
            positionName,
            leaderName,
            userEmail,
            userMobile,
            userTelphone,
        } = this.state.investigation;
        const { employeeCode, 
                joinTime,
                placeOfOriginA, 
                workBeginTime,
                graduateTime,
                graduate,
                glgraded,
                gender,
                subject,
                lastCompany,
                education} = this.state.userDetail
        const {cityName,} = this.state.user;
        return (
            <Modal
                title="人员信息"
                visible={visible}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="650px"
                footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
            >
                <div className="cont-cont" style={{margin:10}}>
                    <ul className="preview-list">
                        <li className="title"><h4>1.员工基本信息</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">工号</label>
                                <span className="ui-text">{employeeCode}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">姓名</label>
                                <span className="ui-text">{userCompellation}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">职位</label>
                                <span className="ui-text">{positionName}</span>
                            </div>
                            {/* <div className="item">
                                <label className="ui-label">职位级别</label>
                                <span className="ui-text">{investigationSponsor}</span>
                            </div> */}
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">主管领导</label>
                                <span className="ui-text">{leaderName}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">部门</label>
                                <span className="ui-text">{enterpriseDepartmentName}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">工作地点</label>
                                <span className="ui-text">{cityName}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">入职时间</label>
                                <span className="ui-text">{moment(joinTime).format("YYYY-MM-DD")}</span>
                            </div>
                        </li>
                        <li className="title"><h4>2.联系方式</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">手机号码</label>
                                <span className="ui-text">{userMobile}</span>
                            </div>                           
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">邮箱</label>
                                <span className="ui-text">{userEmail}</span>
                            </div>
                            <div className="item">
                                
                            </div>
                        </li>
                        <li className="title"><h4>3.个人信息</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">性别</label>
                                <span className="ui-text">{gender === 'MALE'? '男': '女' }</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">籍贯</label>
                                <span className="ui-text">{placeOfOriginA}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">学历</label>
                                <span className="ui-text">{education}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">毕业院校</label>
                                <span className="ui-text">{graduate}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">专业</label>
                                <span className="ui-text">{subject}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">毕业时间</label>
                                <span className="ui-text">{ graduateTime ? moment(graduateTime).format("YYYY-MM-DD"):'' }</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">上家公司</label>
                                <span className="ui-text">{lastCompany}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">从事临床研究起始时间</label>
                                <span className="ui-text">{workBeginTime ? moment(workBeginTime).format("YYYY-MM-DD"):''}</span>
                            </div>
                        </li>
                        <li className="title"><h4>4.进行中项目</h4></li>
                        <li>
                            <Table  
                                columns={this.getColumns()}
                                dataSource={this.getDataSource()}
                                rowKey={record => record.id}
                                loading={loading}
                                scroll={{ x: 940,y:200 }}
                                onChange={this.handleTableChange}
                                pagination={false}
                            />
                        </li>
                    </ul>
                </div>
            </Modal>
        );
    }
}

export default PreviewModal;
