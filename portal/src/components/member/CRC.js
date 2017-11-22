/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import {connect} from 'react-redux';
import { Table, Popconfirm, Button, Input, Select,Modal } from 'antd';
import API_URL from '../../common/url';
import RegisterDutyTimeModal from './RegisterDutyTimeModal';
import Sider from './MemberSider';
import UserDetail from '../user/UserDetail';
import AjaxRequest from '../../common/AjaxRequest';
import jquery from 'jquery';
import Efficiency from '../sumTotal/Efficiency';

const Option = Select.Option;

class CRC extends React.Component {
    state = {
        loading: false,
        visible: false,
        pagination: {
            pageSize: 15,
            current: 1,
        },
        dataList: [],
        searchSiteCode: '',
        searchSiteName: '',
        searchUserName: '',
        searchEmployeeCode: '',
        userStatus: '',
        sortParam:{},
    };

    loadData = (params ={}) => {
        this.setState({
            loading: true,
        });
        const {searchSiteCode, searchSiteName, searchEmployeeCode, searchUserName, userStatus,sortParam} = this.state;
        const options = {
            url: `${API_URL.user.queryCRCList}`,
            data: {
                siteCode: searchSiteCode,
                siteName: searchSiteName,
                employeeCode: searchEmployeeCode,
                employeeName: searchUserName,
                employeeStatus: userStatus,
                ...sortParam
            },
            dataType: 'json',
            doneResult: ( data => {
                const {memberList} = data.data;
                const pagination = {...this.state.pagination};
                pagination.total = memberList.totalCount;
                this.setState({
                    loading: false,
                    dataList: memberList.data,
                    pagination,
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
                title: '中心编号',
                dataIndex: 'investigationSiteCode',
                key: 'investigationSiteCode',
                width: 100,
                fixed: 'left',
                sorter: true,
            },  {
                title: '工号',
                dataIndex: 'employeeCode',
                key: 'employeeCode',
                fixed: 'left',
                width: 60,
                render: (text, record) => {
                    let canLink = false;
                    if (sessionStorage.curRole == 'BO' || sessionStorage.curRole == 'BDO' 
                        || sessionStorage.curRole == 'BD' || sessionStorage.curRole == 'PM'){
                        canLink = true;             
                    }
                    if (sessionStorage.curRole == 'CRC'){
                        if(record.userId == sessionStorage.userId){
                            canLink = true;                            
                        }
                    }
                    else if(sessionStorage.curRole == 'CRCC' || sessionStorage.curRole == 'CRCM' || sessionStorage.curRole == 'PA'){
                        if(record.allowEnter){
                            canLink = true;
                        }
                    }

                    if(canLink){
                        return (
                                <span>
                                    <a href="javascript:void(0)" onClick={() => this.viewUser(record.userId)}>{record.employeeCode}</a>
                                </span>
                            );
                    }
                    else{
                        return ( <span>{record.employeeCode}</span>);
                    }
                    
                },
                sorter: true,
            }, {
                title: '姓名',
                dataIndex: 'userCompellation',
                key: 'userCompellation',
                fixed: 'left',
                width: 70,
                sorter: true,
            }, {
                title: '中心名称',
                dataIndex: 'investigationSiteName',
                key: 'investigationSiteName',
                sorter: true,
            },{
                title: '工作城市',
                dataIndex: 'workCity',
                key: 'workCity',
                sorter: true,
            }, {
                title: '手机号码',
                dataIndex: 'userMobile',
                key: 'userMobile',
                sorter: true,
            }, {
                title: '邮箱',
                dataIndex: 'userEmail',
                key: 'userEmail',
                sorter: true,
            }, {
                title: '中心上岗时间',
                dataIndex: 'workBeginTime',
                key: 'workBeginTime',
                sorter: true,
           }, {
                title: '人员状态',
                dataIndex: 'employeeStatus',
                key: 'employeeStatus',
                render: (text, record) => {
                    if(record.employeeStatus == 'WORKING'){
                        return ('现任');
                    }
                    else if( record.employeeStatus == 'WORKED'){
                        return ('前任');
                    }
                    else if(record.employeeStatus == 'LEFT'){
                        return ('离职');
                    }
                    else{
                        return ('');
                    }                    
                },
                sorter: true,
            }, {
                title: '工作阶段',
                dataIndex: 'workDuration',
                key: 'workDuration',
                sorter: true,
            }
        ];
        if (sessionStorage.curRole == 'PM' || sessionStorage.curRole == 'CRCC' || sessionStorage.curRole == 'CRCM'
             || sessionStorage.curRole == 'BO' || sessionStorage.curRole == 'BD' || sessionStorage.curRole == 'BDO'){
            columnNames.push({
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 60,
                render: (text, record) => {
                    return (
                        <span>
                            <a href="javascript:void(0)" onClick={() => this.viewEfficiency(record.userId)}>查看效率</a>
                        </span>
                    );
                },
            });
        } else if (sessionStorage.curRole == 'CRC'){
            columnNames.push({
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 120,
                render: (text, record) => {
                    if(record.userId == sessionStorage.userId){
                        return (
                            <span>
                                <a href="javascript:void(0)" onClick={() => this.viewEfficiency(record.userId)}>查看效率</a>
                                <span className="ant-divider"/>
                                <a href="javascript:void(0)" onClick={() => this.registerDutyTime(record.investigationSiteId)}>登记上岗时间</a>
                            </span>
                        );
                    }
                    else{
                        return (<span></span>);
                    }
                },
            });
        }
        return columnNames;
    }

    getDataSource = () => {
        const resList = [];
        const {dataList, pagination} = this.state;
        dataList.map((dataItem, i) => {
            //const { user, investigationSite } = dataItem;
            resList.push({
                employeeCode : dataItem.user.employeeCode,
                userId: dataItem.user.userId,
                investigationSiteId: dataItem.investigationSite.investigationSiteId,
                investigationSiteCode: dataItem.investigationSite.investigationSiteCode,
                investigationSiteName: dataItem.investigationSite.investigationSiteName,
                userCompellation: dataItem.user.userName,
                userMobile: dataItem.user.mobile,
                userTelphone: dataItem.user.telphone,
                userEmail: dataItem.user.email,
                memberId: dataItem.memberId,
                workCity: dataItem.user.workCity,
                employeeStatus: dataItem.user.employeeStatus,
                workBeginTime: dataItem.user.workBeginTime ? dataItem.user.workBeginTime.substr(0,10) : '',
                allowEnter: dataItem.user.allowEnter,
                workDuration: dataItem.user.workDuration,
            });
        });
        return resList;
    };


    viewEfficiency = (id) => {
        this.setState({
            visible:true,
        }, ()=>{
            this.efficiencyRef.loadData({crcUserId:id})
        })
        
    }
    hide =()=>{
        this.setState({
            visible:false,
        })
    }
    registerDutyTime = siteId => {
        this.registerDutyTimeModalRef.show(siteId);
    };

    viewUser = userId => {
        this.userDetailRef.show(userId);
    };

    onChangeSiteCode = e => {
        this.setState({searchSiteCode: e.target.value});
    };

    onChangeSiteName = e => {
        this.setState({searchSiteName: e.target.value});
    };

    onChangeEmployeeCode = e => {
        this.setState({searchEmployeeCode: e.target.value});
    };

    onChangeUserName = e => {
        this.setState({searchUserName: e.target.value});
    };

    handleSelectUserStatus = value => {
        this.setState({userStatus: value});
    };

    search = () => {
        this.loadData();
    };

    searchComponent = () => {
        const {searchSiteCode, searchSiteName, searchEmployeeCode, searchUserName, userStatus} = this.state;
        const isPA = sessionStorage.curRole == "PA";
        const element = (
            <div className="filter-bar">
                {
                    sessionStorage.getItem('siteId') == 0 && <label>中心编号</label>
                }
                {
                    sessionStorage.getItem('siteId') == 0 &&
                    <Input
                        value={searchSiteCode}
                        style={{width: '15%'}}
                        onChange={this.onChangeSiteCode}
                    />                       
                }
                {
                    sessionStorage.getItem('siteId') == 0 && <label>中心名称</label>
                }
                {
                    sessionStorage.getItem('siteId') == 0 &&
                    <Input
                        value={searchSiteName}
                        style={{width: '15%'}}
                        onChange={this.onChangeSiteName}
                    />                       
                }
                <label>工号</label>
                <Input
                    value={searchEmployeeCode}
                    style={{width: '10%'}}
                    onChange={this.onChangeEmployeeCode}
                />
                <label>姓名</label>
                <Input
                    value={searchUserName}
                    style={{width: '10%'}}
                    onChange={this.onChangeUserName}
                />
                <label>人员状态</label>
                <Select value={userStatus} style={{ width: 70 }} onChange={this.handleSelectUserStatus}>
                    <Option value="WORKING">现任</Option>
                    <Option value="WORKED">前任</Option>
                    <Option value="LEFT">离职</Option>
                </Select>
                <Button type="primary" icon="search" onClick={this.search}>搜索</Button>
            </div>
        );
        return element;
    };

    handleTableChange = (pagination, filters, sorter) => {
        let sortType,
            direction,
            sort = sort = sorter.field;
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });

        if (!jquery.isEmptyObject(sorter) && sorter.column) {
            sortType = sorter.column.sortType;
        }

        if (sorter.order === 'descend') {
            direction = 'DESC';
        } else {
            direction = 'ASC';
        }

        const sortParam = {sortType,direction,sort};

        this.setState({
            sortParam:sortParam,
        });

        this.loadData({
            limit: pagination.pageSize,
            offset: pagination.current,
            ...this.state.searchParams,
            ...filters,
        });
    }

    componentDidMount() {
        this.loadData();
    };

    render() {
        const {loading, pagination,visible} = this.state;
        const siteId = sessionStorage.getItem('siteId');
        const isPA = sessionStorage.curRole == "PA";
        const isCRC = sessionStorage.curRole == "CRC";
        return (
            <div className="content">
                <Sider selectKey='crc'/>
                <div className="content-inner">
                    {this.searchComponent()}
                    <div className="content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.memberId}
                            loading={loading}
                            scroll={{ x: isPA ? 1300 : isCRC ? 1400 : 1300}}
                            onChange={this.handleTableChange}
                            pagination={ siteId > 0 ? pagination : null }
                        />
                    </div>
                </div>
                <UserDetail ref={el => {this.userDetailRef = el;}} />
                <RegisterDutyTimeModal ref={el => {this.registerDutyTimeModalRef = el;}} />
                <Modal
                    title="查看效率"
                    visible={visible}
                    onCancel={this.hide}
                    className="preview-modal"
                    wrapClassName="vertical-center-modal"
                    width="900px"
                    footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
                    >
                    <div style={{padding:30}}><Efficiency name='crc' ref={el => {this.efficiencyRef = el;}} /></div>
                </Modal>
            </div>
        );
    }
}

export default CRC;
