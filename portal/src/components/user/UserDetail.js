/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import { Breadcrumb, Button,Modal, Row, Col, Table } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';

class UserDetail extends React.Component {
    state = {
        visible: false,
        loading: false,
        user: {},
        invList: [],
    };

    show = userId => {
        this.setState({visible: true});
        this.setState({
            loading: true,
        });
        const options = {
            url: `${API_URL.user.getUserDetail}`,
            data: {userId : userId},
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loading: false,
                    user: data.data.userInfo,
                    invList: data.data.invList,
                });
            }),
            errorResult: ( data => {
                this.setState({
                    loading: false,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    getColumns = () => {
        const columnNames = [
            {
                title: '项目编号',
                dataIndex: 'investigationCode',
                key: 'investigationCode',
                sorter: true,
            }, {
                title: '项目名称',
                dataIndex: 'investigationName',
                key: 'investigationName',
                sorter: true,
            }, {
                title: '中心编号',
                dataIndex: 'investigationSiteCode',
                key: 'investigationSiteCode',
                sorter: true,
            }, {
                title: '中心名称',
                dataIndex: 'investigationSiteName',
                key: 'investigationSiteName',
                sorter: true,
            }, {
                title: '适应症',
                dataIndex: 'investigationMalady',
                key: 'investigationMalady',
            }, {
                title: '研究药物',
                dataIndex: 'investigationMedicine',
                key: 'investigationMedicine',
            }, {
                title: '当月计划FTE',
                dataIndex: 'planFTE',
                key: 'planFTE',
            }
        ];
        return columnNames;
    };

    getDataSource = () => {
        const resList = [];
        const { invList } = this.state;
        invList.map((dataItem, i) => {
            resList.push({
                investigationSiteId: dataItem.investigation_site_id,
                investigationCode: dataItem.investigation_code,
                investigationName: dataItem.investigation_name,
                investigationSiteCode: dataItem.investigation_site_code,
                investigationSiteName: dataItem.investigation_site_name,
                investigationMalady: dataItem.investigation_malady,
                investigationMedicine: dataItem.investigation_medicine,
                planFTE: dataItem.plan_fte_sum,
            });
        });
        return resList;
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { visible, loading, confirmLoading, user } = this.state;
        return (
            <Modal
                title='人员信息'
                visible={visible}
               
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="600px"
                confirmLoading={confirmLoading}
                footer={[<Button key="back" type="primary" size="large" onClick={this.hide}>关闭</Button>,]}
            >
                <div>
                    <Row>
                        <Col offset={2} span={12}>1.员工基本信息</Col>
                    </Row>
                    <Row>
                        <Col offset={6} span={18}>
                            <Row>
                                <Col span={8}>*工号:</Col>
                                <Col span={16}>{user?user.employeeCode : ''}</Col>
                            </Row>
                            <Row>
                                <Col span={8}>*姓名:</Col>
                                <Col span={16}>{user?user.userName : ''}</Col>
                            </Row>
                            <Row>
                                <Col span={8}>*职位:</Col>
                                <Col span={16}>{user?user.positionName : ''}</Col>
                            </Row>
                            <Row>
                                <Col span={8}>主管领导:</Col>
                                <Col span={16}>{user? ( user.leader? user.leader.userName : '') : ''}</Col>
                            </Row> 
                            <Row>
                                <Col span={8}>*部门:</Col>
                                <Col span={16}>{user ? user.enterpriseDepartmentName : ''}</Col>
                            </Row>
                            <Row>
                                <Col span={8}>*工作地点:</Col>
                                <Col span={16}>{user ? user.workCity : ''}</Col>
                            </Row>
                            <Row>
                                <Col span={8}>入职时间:</Col>
                                <Col span={16}>{user ? user.joinTime ? user.joinTime.substr(0,10) : '' :''}</Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col offset={2} span={12}>2.联系方式</Col>
                    </Row>
                    <Row>
                        <Col offset={6} span={18}>
                            <Row>
                                <Col span={8}>手机号码:</Col>
                                <Col span={16}>{user ? user.mobile : ''}</Col>
                            </Row>
                            <Row>
                                <Col span={8}>邮箱:</Col>
                                <Col span={16}>{ user ? user.email : ''}</Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col offset={2} span={12}>3.个人信息</Col>
                    </Row>
                    <Row>
                        <Col offset={6} span={18}>
                            <Row>
                                <Col span={8}>性别:</Col>
                                <Col span={16}>{user ? 
                                    (user.gender ? (
                                        user.gender == 'FEMALE' ? '女' : 
                                            (user.gender == 'MALE' ? '男' : '') )
                                            : '') : ''}</Col>
                            </Row>
                            <Row>
                                <Col span={8}>籍贯:</Col>
                                <Col span={16}>{user ? user.placeOfOrigin : ''}</Col>
                            </Row>
                            <Row>
                                <Col span={8}>学历:</Col>
                                <Col span={16}>{user ? user.education : ''}</Col>
                            </Row>
                            <Row>
                                <Col span={8}>毕业院校:</Col>
                                <Col span={16}>{user ? user.graduate : ''}</Col>
                            </Row>
                            <Row>
                                <Col span={8}>专业:</Col>
                                <Col span={16}>{
                                    user ? user.subject : ''
                                }</Col>
                            </Row>
                            <Row>
                                <Col span={8}>毕业时间:</Col>
                                <Col span={16}>{
                                    user ? user.graduateTime && user.graduateTime.length >= 10 ? user.graduateTime.substr(0,10) : '' : ''
                                }</Col>
                            </Row>
                            <Row>
                                <Col span={8}>上家公司:</Col>
                                <Col span={16}>{
                                    user ? user.lastCompany : ''
                                }</Col>
                            </Row>
                            <Row>
                                <Col span={8}>从事临床研究起始时间:</Col>
                                <Col span={16}>{
                                    user ? user.workBeginTime && user.workBeginTime.length >= 10 ? user.workBeginTime.substr(0,10) : '' : ''
                                }</Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col offset={2} span={12}>4.进行中项目</Col>
                    </Row>
                    <Row>
                        <Col offset={2} span={20}>
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.getDataSource()}
                                rowKey={record => record.investigationSiteId}
                                loading={loading}
                                scroll={{ x: 700}}
                                onChange={this.handleTableChange}
                                pagination={ false }
                        />
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }
}

export default UserDetail;
