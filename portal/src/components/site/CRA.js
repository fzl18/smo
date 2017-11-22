/**
 * Created by casteloyee on 2017/7/18.
 */
 import React from 'react';
 import {connect} from 'react-redux';
 import { Table, Popconfirm, Button, Input, message } from 'antd';
 import API_URL from '../../common/url';
 import Sider from './SiteSider';
 import AjaxRequest from '../../common/AjaxRequest';
 import AddCRA from "./AddCRA";

class CRA extends React.Component {
    state = {
        loading: false,
        pagination: {
            pageSize: 15,
            current: 1,
        },
        dataList: [],
        searchSiteCode: '',
        searchSiteName: '',
        searchUserName: '',
    };

    loadData = () => {
        this.setState({
            loading: true,
        });
        const {searchSiteCode, searchSiteName, searchUserName} = this.state;
        const options = {
            url: `${API_URL.user.queryCRAList}`,
            data: {
                siteCode: searchSiteCode,
                siteName: searchSiteName,
                userName: searchUserName,
            },
            dataType: 'json',
            doneResult: ( data => {
                const {CRAList} = data.data;
                const pagination = {...this.state.pagination};
                pagination.total = CRAList.totalCount;
                this.setState({
                    loading: false,
                    dataList: CRAList.datas,
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
                //fixed: 'left',
                width: 100,
                sorter: true,
            }, {
                title: '中心名称',
                dataIndex: 'investigationSiteName',
                key: 'investigationSiteName',
                //fixed: 'left',
                sorter: true,
            }, {
                title: 'CRA姓名',
                dataIndex: 'userName',
                key: 'userName',
                 width: 80,
                //fixed: 'left',
            }, {
                title: '手机号码',
                dataIndex: 'mobile',
                key: 'mobile',
                width: 100,
            }, {
                title: '固定电话',
                dataIndex: 'telephone',
                key: 'telephone',
                width: 100,
            }, {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
                width: 200,
            }
        ];
        if (sessionStorage.curRole == 'PA'){
            columnNames.push({
                title: '操作',
                key: 'operation',
                //fixed: 'right',
                width: 60,
                render: (text, record) => {
                    return (
                        <span>
                            <Popconfirm title={'确定要删除吗?'} onConfirm={this.del.bind(this, record.userId, record.investigationSiteId)} okText="确定" cancelText="取消">
                                <a href="javascript:void(0)">删除</a>
                            </Popconfirm>
                        </span>
                    );
                },
            });
        }
        return columnNames;
    }

    getDataSource = () => {
        const resList = [];
        const {dataList, pagination} = this.state;
        dataList.map((dataItem, i) => {
            resList.push({
                userId: dataItem.userId,
                investigationSiteId: dataItem.investigationSite.investigationSiteId,
                investigationSiteCode: dataItem.investigationSite.investigationSiteCode,
                investigationSiteName: dataItem.investigationSite.investigationSiteName,
                userName: dataItem.userName,
                mobile: dataItem.mobile,
                telephone: dataItem.telephone,
                email: dataItem.email,
            });
        });
        return resList;
    };

    onChangeSiteCode = e => {
        this.setState({searchSiteCode: e.target.value});
    };

    onChangeSiteName = e => {
        this.setState({searchSiteName: e.target.value});
    };

    onChangeUserName = e => {
        this.setState({searchUserName: e.target.value});
    };

    search = () => {
        this.loadData();
    };

    searchComponent = () => {
        if (sessionStorage.getItem('siteId') == 0) {
            const {searchSiteCode, searchSiteName, searchUserName} = this.state;
            const isPA = sessionStorage.curRole == "PA";
            const element = (
                <div className="filter-bar">
                    <div className="form-item">
                    <label className="ui-label">中心编号</label>
                    <Input
                        value={searchSiteCode}
                        onChange={this.onChangeSiteCode}
                    />
                    </div>
                    <div className="form-item">
                    <label className="ui-label">中心名称</label>
                    <Input
                        value={searchSiteName}
                        onChange={this.onChangeSiteName}
                    />
                    </div>
                    <div className="form-item">
                    <label className="ui-label">CRA姓名</label>
                    <Input
                        value={searchUserName}
                        onChange={this.onChangeUserName}
                    />
                    </div>
                    <Button type="primary" icon="search" onClick={this.search}>搜索</Button>
                    {
                        isPA && <Button type="primary" onClick={this.add}>添加</Button>
                    }
                </div>
            );
            return element;
        }
        return null;
    };

    add = () => {
        this.addCRARef.show();
    };

    /**
     * 删除
     * @param id
     */
    del = (userId, invSiteId) => {
        const options = {
            url: `${API_URL.user.removeCRA}`,
            data: {
                userId,
                invSiteId,
            },
            dataType: 'json',
            doneResult: ( data => {
                message.success("删除成功");
                this.loadData();
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    componentDidMount() {
        this.loadData();
    };

    render() {
        const {loading, pagination} = this.state;
        const siteId = sessionStorage.getItem('siteId');
        const isPA = sessionStorage.curRole == "PA";
        return (
            <div className="content">
                <Sider selectKey='siteCra'/>
                <div className="content-inner">
                    {this.searchComponent()}
                    <div className="content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.userId}
                            loading={loading}
                            //scroll={{ x: isPA ?'100%' : '100%'}}
                            onChange={this.handleTableChange}
                            pagination={ siteId > 0 ? pagination : null }
                        />
                    </div>
                </div>
                <AddCRA ref={el => { this.addCRARef = el; }} reload={this.loadData} />
            </div>
        );
    }
}

export default CRA;
