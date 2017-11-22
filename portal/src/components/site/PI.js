import React from 'react';
import {connect} from 'react-redux';
import { Table, Popconfirm, Button, Input, message } from 'antd';
import API_URL from '../../common/url';
import Sider from './SiteSider';
import AjaxRequest from '../../common/AjaxRequest';
import AddPI from "./AddPI";
import Evaluate from "./Evaluate";
import EvaluateView from "./EvaluateView";

/**
 * 研究者信息、CRA信息分两种：
 * 一种是已经指定了中心，那么此处只显示当前中心信息；
 * 另一种是没有指定中心，那么此处还需要搜索框，可以检索出当前项目下的所有中心；
 * 中心编号在localstorage中获取
 */
class PI extends React.Component {
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
            url: `${API_URL.user.queryPIList}`,
            data: {
                siteCode: searchSiteCode,
                siteName: searchSiteName,
                userName: searchUserName,
            },
            dataType: 'json',
            doneResult: ( data => {
                const {PIList} = data.data;
                const pagination = {...this.state.pagination};
                pagination.total = PIList.totalCount;
                this.setState({
                    loading: false,
                    dataList: PIList.datas,
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
                fixed: 'left',
                width: 80,
                sorter: true,
            }, {
                title: '中心名称',
                dataIndex: 'investigationSiteName',
                key: 'investigationSiteName',
                sorter: true,
            }, {
                title: '研究者姓名',
                dataIndex: 'userName',
                key: 'userName',
            }, {
                title: '所在科室',
                dataIndex: 'departmentName',
                key: 'departmentName',
            }, {
                title: '职务',
                dataIndex: 'doctorPosition',
                key: 'doctorPosition',
            }, {
                title: '手机号码',
                dataIndex: 'mobile',
                key: 'mobile',
            }, {
                title: '固定电话',
                dataIndex: 'telephone',
                key: 'telephone',
            }, {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
            }
        ];
        const curRole = sessionStorage.curRole;
        columnNames.push({
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 80,
            render: (text, record) => {
                return (
                    <span>
                            {curRole == 'PA' &&
                            <Popconfirm title={'确定要删除吗?'} onConfirm={this.del.bind(this, record.userId, record.investigationSiteId)} okText="确定" cancelText="取消">
                                <a href="javascript:void(0)" >删除</a>
                            </Popconfirm>
                            }
                            {(curRole == 'PM'||curRole== 'CRCM'||curRole == 'CRCC'||curRole== 'BO'||curRole== 'BD'||curRole== 'BDO') &&
                            <a href="javascript:void(0)" onClick={() => this.viewEvaluate(record.userId, record.investigationSiteId)}>查看评价</a>
                            }
                            {curRole == 'CRC' &&
                            <a href="javascript:void(0)" disabled={curRole == 'CRC'? false:true} onClick={() => this.evaluate(record.userId, record.userName)}>评价</a>
                            }
                    </span>
                );
            },
        });
        return columnNames;
    }

    getDataSource = () => {
        const resList = [];
        const {dataList, pagination} = this.state;
        dataList.map((dataItem, i) => {
            //const { user, investigationSite } = dataItem;
            resList.push({
                userId: dataItem.user.userId,
                investigationSiteId: dataItem.investigationSite.investigationSiteId,
                investigationSiteCode: dataItem.investigationSite.investigationSiteCode,
                investigationSiteName: dataItem.investigationSite.investigationSiteName,
                userName: dataItem.user.userName,
                departmentName: dataItem.user.departmentName,
                doctorPosition: dataItem.user.doctorPosition,
                mobile: dataItem.user.mobile,
                telephone: dataItem.user.telephone,
                email: dataItem.user.email,
                memberId: dataItem.memberId,
            });
        });
        return resList;
    };

    /**
     * 评价
     * @param id
     */
    evaluate = (userId, userName) => {
        this.evaluateRef.show(userId, userName);
    };

    /**
     * 查看评价
     * @param id
     */
    viewEvaluate = (userId, siteId) => {
        this.evaluateViewRef.show(userId, '', siteId);
    };

    /**
     * 删除
     * @param id
     */
    del = (userId, invSiteId) => {
        const options = {
            url: `${API_URL.user.removePI}`,
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

    add = () => {
        this.addPIRef.show();
    };

    componentDidMount() {
        this.loadData();
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
        const siteId = sessionStorage.getItem('siteId');
        const isPA = sessionStorage.curRole == "PA";;
        if (siteId == 0) {
            const {searchSiteCode, searchSiteName, searchUserName} = this.state;
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
                    <label className="ui-label">研究者姓名</label>
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

    render() {
        const {loading, pagination} = this.state;
        const siteId = sessionStorage.getItem('siteId');
        return (
            <div className="content">
                <Sider selectKey='sitePi'/>
                <div className="main">
                    {this.searchComponent()}
                    <div className="content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.userId}
                            loading={loading}
                            scroll={{x: '130%'}}
                            onChange={this.handleTableChange}
                            pagination={ siteId > 0 ? pagination : null }
                        />
                    </div>
                </div>
                <AddPI ref={el => { this.addPIRef = el; }} reload={this.loadData} />
                <Evaluate ref={el => { this.evaluateRef = el; }} />
                <EvaluateView ref={el => { this.evaluateViewRef = el; }} />
            </div>
        );
    }
}


const mapStateToProps = function (store) {
    return {
        searchParams: store.executeState.searchParams,
    };
};

export default connect(mapStateToProps)(PI);
