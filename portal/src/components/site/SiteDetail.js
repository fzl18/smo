import React from 'react';
import { Table, Popconfirm, Modal, Button, Input } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import Sider from './SiteSider';
import AddSite from './AddSite';
import EditSite from './EditSite';
import Hospital from './Hospital';

/**
 * 研究中心信息分两种：
 * 一种是已经指定了中心，那么此处只显示当前中心信息；
 * 另一种是没有指定中心，那么此处还需要搜索框，可以检索出当前项目下的所有中心；
 * 中心编号在localstorage中获取
 */
class SiteDetail extends React.Component {
    state = {
        loading: false,
        pagination: {
            pageSize: 15,
            current: 1,
        },
        dataList: [],
        searchSiteCode: '',
        searchSiteName: '',
    };

    loadData = (params) => {
        this.setState({
            loading: true,
        });
        if (sessionStorage.siteId > 0) {
            this.loadInvSiteList({params
                ,siteId : sessionStorage.siteId});
        } else {
            this.loadInvSiteList(params);
        }
    };

    loadSelSite = siteId => {
        const options = {
            url: `${API_URL.site.queryBySiteId}`,
            data: {
                investigationSiteId: siteId,
            },
            dataType: 'json',
            doneResult: ( data => {
                let siteList = [data.data.site];
                this.setState({
                    loading: false,
                    dataList: siteList,
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

    loadInvSiteList = (params) => {
        const {searchSiteCode, searchSiteName} = this.state;

        const options = {
            url: `${API_URL.site.list}`,
            data: {
                siteCode: searchSiteCode,
                siteName: searchSiteName,
                ...params,
            },
            dataType: 'json',
            doneResult: ( data => {
                    const {siteList} = data.data;
                    const pagination = {...this.state.pagination};
                    pagination.total = siteList.totalCount;
                    this.setState({
                        loading: false,
                        dataList: siteList.datas,
                        pagination,
                    });
                }
            ),
            errorResult: ( data => {
                this.setState({
                    loading: false,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    getColumns = () => {
        const columnNames = [];
        columnNames.push({
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            fixed: 'left',
            width: 50,
        });
        columnNames.push({
            title: '中心编号',
            dataIndex: 'investigationSiteCode',
            key: 'investigationSiteCode',
            sorter: true,
        });
        columnNames.push({
            title: '中心名称',
            dataIndex: 'investigationSiteName',
            key: 'investigationSiteName',
            sorter: true,
        });
        columnNames.push({
            title: '所属医院',
            dataIndex: 'hospitalName',
            key: 'hospitalName',
            render: (text, record) => {
                return (
                    <span>
                        <a href="javascript:void(0)" onClick={() => this.viewHospital(record.hospitalId)}>{text}</a>
                    </span>
                );
            },
        });
        columnNames.push({
            title: '所属科室',
            dataIndex: 'hospitalDepartmentName',
            key: 'departmentName',
        });
        columnNames.push({
            title: '负责人',
            dataIndex: 'userName',
            key: 'userName',
        });
        columnNames.push({
            title: '职务',
            dataIndex: 'doctorPosition',
            key: 'doctorPosition',
        });
        columnNames.push({
            title: '手机号码',
            dataIndex: 'mobile',
            key: 'mobile',
        });
        columnNames.push({
            title: '固定电话',
            dataIndex: 'telephone',
            key: 'telephone',
        });
        columnNames.push({
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        });

        //只有项目管理员PA可以修改中心
        if (sessionStorage.curRole == "PA") {
            columnNames.push({
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 100,
                render: (text, record) => {
                    return (
                        <span>
                            <a href="javascript:void(0)" onClick={() => this.edit(record.investigationSiteId)}>修改</a>
                            <span className="ant-divider"/>
                            <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.del(record.investigationSiteId)} okText="确定" cancelText="取消">
                                <a href="javascript:void(0)">删除</a>
                            </Popconfirm>
                        </span>
                    );
                },
            });
        }
        return columnNames;
    };

    getDataSource = () => {
        const sites = [];
        const {dataList, pagination} = this.state;
        dataList.map((site, i) => {
            let chargePerson = {
                userName: '',
                doctorPosition: '',
                mobile: '',
                telephone: '',
                email: '',
            };
            if (site.chargePerson != null && site.chargePerson != undefined) {
                chargePerson = site.chargePerson;
            }
            sites.push({
                index: ((pagination.current - 1) || 0) * pagination.pageSize + i + 1,
                investigationSiteId: site.investigationSiteId,
                investigationSiteName: site.investigationSiteName,
                investigationSiteCode: site.investigationSiteCode,
                hospitalId: site.hospitalId,
                departmentId: site.departmentId,
                hospitalName: site.hospitalName,
                departmentName: site.departmentName,
                hospitalDepartmentId: site.hospitalDepartmentId,
                hospitalDepartmentName: site.hospitalDepartmentName,
                userName : chargePerson.userName,
                doctorPosition: chargePerson.doctorPosition,
                mobile: chargePerson.mobile,
                telephone: chargePerson.telephone,
                email: chargePerson.email,
            });
        });
        sites.push()
        return sites;
    };

    search = () => {
        const {pagination} = this.state;
        pagination.current = 1;
        this.setState({pagination});
        this.loadInvSiteList();
    };

    add = () => {
        this.addSiteRef.show();
    };

    edit = id => {
        this.editSiteRef.show(id);
    };

    del = id => {
        const options = {
            url: `${API_URL.site.delSite}`,
            data: {
                investigationSiteId: id,
            },
            dataType: 'json',
            doneResult: ( dt => {
                this.loadData();
            }),
        };
        AjaxRequest.sendRequest(options);
        this.setState({
            visible: true,
        });
    };

    viewHospital = id => {
        this.hospitalRef.show(id);
    };

    onChangeSiteCode = e => {
        this.setState({searchSiteCode: e.target.value});
    };

    onChangeSiteName = e => {
        this.setState({searchSiteName: e.target.value});
    };

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        if (pager.current == pagination.current){
            pager.current = 1;
        } else {
            pager.current = pagination.current;
        }
        this.setState({
            pagination: pager,
        });
        this.loadData({
            limit: pagination.pageSize,
            offset: pager.current,
            sort: sorter.field,
            direction: sorter.order == 'descend' ? 'DESC' : 'ASC',
        });
    };

    componentDidMount() {
        const {pagination} = this.state;
        this.loadData({
            limit: pagination.pageSize,
            offset: 1,
            direction: '',
            sort: '',
        });
    }

    searchComponent = () => {
        const siteId = sessionStorage.getItem('siteId');
        const isPA = sessionStorage.curRole == "PA";;
        if (siteId == 0) {
            const {searchSiteCode, searchSiteName} = this.state;
            const element = (
                <div className="filter-bar">
                    <div className='form-item'>
                        <label className='ui-label'>中心编号</label>
                        <Input
                            value={searchSiteCode}
                            onChange={this.onChangeSiteCode}
                        />
                    </div>
                    <div className='form-item'>
                        <label className='ui-label'>中心名称</label>
                        <Input
                            value={searchSiteName}
                            onChange={this.onChangeSiteName}
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
    }

    render() {
        const {loading, pagination} = this.state;
        const siteId = sessionStorage.getItem('siteId');
        return (
            <div className="content">
                <Sider selectKey='site'/>
                <div className="main">
                    {this.searchComponent()}
                    <div className="main-content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.investigationSiteId}
                            loading={loading}
                            scroll={{x: '130%'}}
                            onChange={this.handleTableChange}
                            pagination={ siteId > 0 ? null : pagination }
                        />
                    </div>
                </div>
                <AddSite ref={el => { this.addSiteRef = el; }}
                         reload={this.loadData}
                />
                <EditSite ref={el => { this.editSiteRef = el; }}
                         reload={this.loadData}
                />
                <Hospital ref={el => { this.hospitalRef = el; }}
                />
            </div>
        );
    }
}

export default (SiteDetail);
