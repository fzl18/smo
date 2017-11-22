/**
 * Created by casteloyee on 2017/7/15.
 */
import React from 'react';
import { Table, Button } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import ExecuteMgrSider from './ExecuteMgrSider';
import ManHourSetting from './ManHourSetting';

class ManHourList extends React.Component {
    state = {
        loading: false,
        dataList: [],
    };

    loadData = () => {
        this.setState({
            loading: true,
        });
        const options = {
            url: `${API_URL.execute.manHourList}`,
            data: {},
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loading: false,
                    dataList: data.data.enterpriseWorkTypes,
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

    getColumns = () => [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    }, {
        title: '适用角色',
        dataIndex: 'roleCode',
        key: 'roleCode',
    }, {
        title: '工作类型编号',
        dataIndex: 'enterpriseWorkTypeCode',
        key: 'enterpriseWorkTypeCode',
    }, {
        title: '工作类型名称',
        dataIndex: 'enterpriseWorkTypeName',
        key: 'enterpriseWorkTypeName',
    }, {
        title: '是否计算FTE津贴',
        dataIndex: 'isCalculateFtePay',
        key: 'isCalculateFtePay',
    }]

    getDataSource = () => {
        const resList = [];
        const { dataList } = this.state;
        dataList.map((dataItem, i) => {
            resList.push({
                enterpriseWorkTypeId: dataItem.enterpriseWorkTypeId,
                index:i+1,
                roleCode: dataItem.roleCode,
                enterpriseWorkTypeCode: dataItem.enterpriseWorkTypeCode,
                enterpriseWorkCategoryId: dataItem.enterpriseWorkCategoryId,
                enterpriseWorkTypeName: dataItem.enterpriseWorkTypeName,
                isCalculateFtePay: dataItem.isCalculateFtePay == 1 ? '是' : '否',
            });
        });
        return resList;
    };

    set = () => {
        this.manHourSettingRef.show();
    };

    componentDidMount() {
        this.loadData();
    }

    render() {
        const { loading } = this.state;
        return (
            <div className="content">
                <ExecuteMgrSider selectKey="manHour" />
                <div className="content-inner">
                    <div className="breadcrumb-bar tac">
                        <h2 className="title">工作类型字典表</h2>
                    </div>
                    <div className="filter-bar tar">
                        <Button type="primary" onClick={this.set}>配置</Button>
                    </div>
                    <div className="content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.enterpriseWorkTypeId}
                            loading={loading}
                            pagination={false}
                        />
                    </div>
                </div>
                <ManHourSetting ref={el => { this.manHourSettingRef = el; }}
                                reload={this.loadData}
                />
            </div>
        );
    }
}

export default ManHourList;
