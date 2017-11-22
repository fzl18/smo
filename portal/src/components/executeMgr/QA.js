import React from 'react';
import { Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import ExecuteMgrSider from './ExecuteMgrSider';
import AddQAList from './AddQAList';
import SortList from '../common/SortList';

class ExecuteMgrQA extends React.Component {
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
            url: `${API_URL.execute.listQuestionCategory}`,
            data: {},
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loading: false,
                    dataList: data.datas,
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
                key: item.questionCategoryId,
                name: item.questionCategoryName,
            });
        });
        this.sortListRef.show(sortList);
    }

    edit = (investigationCheckListId, questionCategoryName) => {
        this.checkListRef.show(investigationCheckListId, questionCategoryName);
    }

    del = investigationCheckListId => {
        const options = {
            url: `${API_URL.execute.deleteQuestionCategory}`,
            data: {
                questionCatetoryId: investigationCheckListId,
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
        title: '问题分类名称',
        dataIndex: 'questionCategoryName',
        key: 'questionCategoryName',
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
                        <a href="javascript:void(0)" onClick={this.edit.bind(this, record.investigationCheckListId, record.questionCategoryName)}>修改</a>
                        <span className="ant-divider"/>
                        <Popconfirm title={'确定删除该问题分类项?'} onConfirm={this.del.bind(this, record.investigationCheckListId)} okText="确定" cancelText="取消">
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
                questionCategoryName: item.questionCategoryName,
                checkType: item.checkType,
                investigationCheckListId: item.questionCategoryId,
            });
        });

        return resList;
    };

    render() {
        const { loading } = this.state;
        return (
            <div className="content">
                <ExecuteMgrSider selectKey="qa" />
                <div className="content-inner">
                    <div className="breadcrumb-bar tac">
                        <h2 className="title">问题分类字典表</h2>
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
                <AddQAList
                    ref={el => {this.checkListRef = el;}}
                    reload={this.loadData}
                />
                <SortList ref={el => { this.sortListRef = el; }}
                                reload={this.loadData}
                                sortUrl={`${API_URL.execute.sortQuestionCategory}`}
                                title="问题分类-排序调整"
                />
            </div>
        );
    }
}

export default ExecuteMgrQA;
