import React from 'react';
import $ from '../../common/AjaxRequest';
import { Modal, Button,Table } from 'antd';
import API_URL from '../../common/url';
// import Fetch from '../../common/FetchIt';

class EfficiencyTotal extends React.Component {

    state = {
        visible: false,
        investigation: {},
        userDetail:{},
        invInfo:[],
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
        }]
    
        getDataSource = () => {
            const investigations = [];
            const { invInfo } = this.state;
    
            invInfo.map((investigation, i) => {
                investigations.push({
                    index: i + 1,
                    id: investigation.userId,
                    planFte: investigation.planFte,
                    investigationCode: investigation.investigationCode,
                    investigationName: investigation.investigationName,
                    investigationSiteName: investigation.investigationSiteName,
                    investigationSiteCode: investigation.investigationSiteCode,
                    investigationMalady: investigation.investigationMalady,
                    investigationMedicine: investigation.investigationMedicine,
                });
            });
            return investigations;
        }




    render() {
        const { visible,loading} = this.state;
        const {
            userCompellation,
            departmentName,
            positionName,
            leaderName,
            userEmail,
            userMobile,
            userTelphone,
        } = this.state.investigation;
        const { employeeCode, 
                joinTime,
                workCityId, 
                placeOfOrigin, 
                workBeginTime,
                graduateTime,
                graduate,
                glgraded,
                gender,
                subject,
                lastCompany,
                education} = this.state.userDetail
        return (
            <Modal
                title="每月完成访视数VS.每月消耗FTE数"
                visible={visible}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="650px"
                footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
            >
                <div className="cont">
                    <div>工号：{}  <span className="ant-divider" />  姓名：{} <span className="ant-divider" /> 时间：{} </div>
                    
                    <div> 图表</div>
                    <Table  
                        columns={this.getColumns()}
                        dataSource={this.getDataSource()}
                        rowKey={record => record.id}
                        loading={loading}
                        scroll={{ x: 800 }}
                        onChange={this.handleTableChange}
                        pagination={false}
                    />
                </div>
            </Modal>
        );
    }
}

export default EfficiencyTotal;
