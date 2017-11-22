/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import { Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import ExecuteMgrSider from './ExecuteMgrSider';
import EditCheckList from './EditCheckList';
import SortList from '../common/SortList';

class Transfer extends React.Component {
   constructor(props){
        super(props);
        this.state = {
            loading: false,
            dataList: [],
        };
    }

    loadData = () => {
        this.setState({
            loading: true,
        });
        const options = {
            url: `${API_URL.execute.getInvestigationCheckList}`,
            data: {},
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loading: false,
                    dataList: data.data.invCheckList,
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

    add = () => {
        this.checkListRef.show(0, '');
    }

    sort = () => {
        const {dataList} = this.state;
        const sortList = [];
        dataList.map(item => {
            sortList.push({
                key: item.investigationCheckListId,
                name: item.checkName,
            });
        });
        this.sortListRef.show(sortList);
    }

    edit = (investigationCheckListId, checkName) => {
        this.checkListRef.show(investigationCheckListId, checkName);
    }

    del = investigationCheckListId => {
        const options = {
            url: `${API_URL.execute.deleteInvestigationCheckList}`,
            data: {
                investigationCheckListId,
            },
            dataType: 'json',
            doneResult: ( data => {
                Modal.success({title: '删除成功'});
                this.loadData();
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    getColumns = () => [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    }, {
        title: 'checkList项',
        dataIndex: 'checkName',
        key: 'checkName',
    }, {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) => {
                return (
                    record.checkType == 1 ? 
                    <span>-</span> 
                    :
                    <span>
                        <a href="javascript:void(0)" onClick={this.edit.bind(this, record.investigationCheckListId, record.checkName)}>修改</a>
                        <span className="ant-divider"/>
                        <Popconfirm title={'确定要删除吗?'} onConfirm={this.del.bind(this, record.investigationCheckListId)} okText="确定" cancelText="取消">
                            <a href="javascript:void(0)">删除</a>
                        </Popconfirm>
                    </span>
                );
            },
    }]

    componentDidMount() {
        this.loadData();
    }

    getDataSource = () => {
        const { dataList } = this.state;
        const resList = [];
        dataList.map((item, i) => {
            resList.push({
                index: i + 1,
                checkName: item.checkName,
                checkType: item.checkType,
                investigationCheckListId: item.investigationCheckListId,
            });
        });

        return resList;
    };

    render() {
        const { loading } = this.state;
        return (
            <div className="content">
                <ExecuteMgrSider selectKey="handOver" />
                <div className="content-inner">
                    <div className="breadcrumb-bar tac">
                        <h2 className="title">交接记录</h2>
                    </div>
                    <div className="filter-bar">
                        <Button type="primary" onClick={this.sort}>排序调整</Button>
                        <Button type="primary" onClick={this.add}>添加</Button>
                    </div>
                    <div className="content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.investigationCheckListId}
                            loading={loading}
                            pagination={false}
                        />
                    </div>
                </div>
                <EditCheckList
                    ref={el => {this.checkListRef = el;}}
                    reload={this.loadData}
                />
                <SortList ref={el => { this.sortListRef = el; }}
                                reload={this.loadData}
                                sortUrl={`${API_URL.execute.sortInvestigationCheckList}`}
                                title="checklist项-排序调整"
                />
            </div>
        );
    }
}

export default Transfer;
