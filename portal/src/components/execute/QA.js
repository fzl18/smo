import React from 'react';
import { Breadcrumb } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import ExecuteSider from './ExecuteSider';
import QAFilter from './QAFilter';
import QACreateModal from './QACreateModal';
import { Table, Input, Icon, Button, Popconfirm, Popover, message} from 'antd';
import moment from 'moment';

class QA extends React.Component {
    state = {
        loading: false,
        dataList: [],
        reply: false,
        sortParams: '',
        typeList:[],
        pagination:{
            current:1,
            pageSize:15,
        },
        dataList: [],
        searchArray: {},
        dateFormat: 'YYYY-MM-DD'
    };

    loadData = (params) => {
        const {sortParams, reply} = this.state;
        this.setState({
            loading: true,
        });
        const options = {
            url: reply ? API_URL.execute.listQuestionReplyed : API_URL.execute.listQuestionNotReply,
            data: {
                ...params,
            },
            dataType: 'json',
            doneResult: ( data => {
                const pagination = {...this.state.pagination};
                pagination.total = data.totalCount;
                this.setState({
                    loading: false,
                    dataList: data.datas,
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
        const columnNames = [];
        const siteId = sessionStorage.siteId;
        const curRole = sessionStorage.curRole;
        const {reply} = this.state;
        columnNames.push({
            title: '序号',
            dataIndex: 'index',
            key: 'index',
        });
            columnNames.push({
                title: '提问日期',
                dataIndex: 'questionDate',
                key: 'questionDate',
                sorter: true,
                sortType: 'common',
            })
            columnNames.push({
                title: '提问人员',
                dataIndex: 'userCompellation',
                key: 'userCompellation',
                sorter: true,
                sortType: 'common',
            })
            columnNames.push({
                title: '中心编号',
                dataIndex: 'investigationSiteCode',
                key: 'investigationSiteCode',
                sorter: true,
                sortType: 'common',
            })
            columnNames.push({
                title: '中心名称',
                dataIndex: 'investigationSiteName',
                key: 'investigationSiteName',
                sorter: true,
                sortType: 'common',
            })
        columnNames.push({
            title: '问题分类',
            dataIndex: 'questionCategoryName',
            key: 'questionCategoryName',
            sorter: true,
            sortType: 'common',
        })
        columnNames.push({
            title: '问题概述',
            dataIndex: 'questionOverview',
            key: 'questionOverview',
            sorter: true,
        });
        {
            reply && columnNames.push({
                title: '回复人员',
                dataIndex: 'answerUserCompellation',
                key: 'answerUserCompellation',
                sorter: true,
            });
            reply && columnNames.push({
                title: '回复日期',
                dataIndex: 'answerDate',
                key: 'answerDate',
                sorter: true,
            });
        }
        
        columnNames.push({
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 130,
                render: (text, record) => {
                    const {reply} = this.state;
                    if (sessionStorage.curRole == "CRC") {
                        if(!reply){
                            if(record.questionUserId == sessionStorage.userId){
                                return (
                                    <span>
                                        <a onClick={() => this.showQAModal(record.questionLogId,'view')}>查看</a>
                                        <span className="ant-divider"/>
                                        <a onClick={() => this.showQAModal(record.questionLogId,'edit')}>修改</a>
                                        <span className="ant-divider"/>
                                        <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.handleDel(record.questionLogId)} okText="确定" cancelText="取消">
                                            <a href="javascript:void(0)">删除</a>
                                        </Popconfirm>
                                    </span>
                                );

                            }else{
                                return (
                                    <span>
                                        <a onClick={() => this.showQAModal(record.questionLogId,'view')}>查看</a>
                                    </span>
                                );
                            }
                            
                        }else{
                            return (
                                <span>
                                    <a onClick={() => this.showQAModal(record.questionLogId,'view')}>查看</a>
                                </span>
                            );
                        }
                    }else if(sessionStorage.curRole == "PM"){
                        if(!reply){
                                return (
                                    <span>
                                        <a onClick={() => this.showQAModal(record.questionLogId,'reply')}>回复</a>
                                        <span className="ant-divider"/>
                                        <a onClick={() => this.showQAModal(record.questionLogId,'edit')}>修改</a>
                                        <span className="ant-divider"/>
                                        <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.handleDel(record.questionLogId)} okText="确定" cancelText="取消">
                                            <a href="javascript:void(0)">删除</a>
                                        </Popconfirm>
                                    </span>
                                );
                        }else{
                            return (
                                <span>
                                    <a onClick={() => this.showQAModal(record.questionLogId,'view')}>查看</a>
                                    <span className="ant-divider"/>
                                    <a onClick={() => this.showQAModal(record.questionLogId,'editPM')}>修改</a>
                                    <span className="ant-divider"/>
                                    <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.handleDel(record.questionLogId)} okText="确定" cancelText="取消">
                                        <a href="javascript:void(0)">删除</a>
                                    </Popconfirm>
                                </span>
                            );
                        }
                    }else{
                        if(!reply){
                                return (
                                    <span>
                                        <a onClick={() => this.showQAModal(record.questionLogId,'view')}>查看</a>
                                    </span>
                                );
                        }else{
                            return (
                                <span>
                                    <a onClick={() => this.showQAModal(record.questionLogId,'view')}>查看</a>
                                </span>
                            );
                        }
                    }
                },
            });
        return columnNames;
    };

    getDataSource = () => {
        const records = [];
        const {dataList, pagination, dateFormat} = this.state;
        //let key = 0;
        dataList.map((dataItem, i) => {
            if(dataItem.answerLog){
                dataItem['answerUserCompellation'] = dataItem.answerLog.userCompellation;
                dataItem['answerDate'] = moment(dataItem.answerLog.answerDate).format(dateFormat);
            }
            records.push({
                key: dataItem.questionCategoryId,
                ...dataItem,
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                questionDate: moment(dataItem.questionDate).format(dateFormat)
            });
        });
        return records;
    };
    
    loadWaitingData = () =>{
        if(this.state.reply == true){
            this.setState({reply: false},function(){
                this.loadData();
            })
        }else{
            this.setState({reply: false})
        }
    }

    loadReplyedData = () =>{
        
        if(this.state.reply == false){
            this.setState({reply: true},function(){
                this.loadData();
            })
        }else{
            this.setState({reply: true})
        }
    }

    showQAModal = (id,mode) => {
        this.createModalRef.show(id,mode);
    }

    handleDel = (questionLogId) => {
        const options = {
            url: `${API_URL.execute.deleteQuestion}`,
            data: {
                questionLogId
            },
            dataType: 'json',
            doneResult: ( dt => {
                this.loadData();
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    getTypeInfo = () => {
        const options = {
            method: 'get',
            url: `${API_URL.execute.listQuestionCategory}`,
            doneResult: ( data => {
                    this.setState({
                        typeList: data.datas,
                    });
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    }   

    reset = (params = {}) =>{
        this.setState({
            pagination: params.pagination,
        },function(){
            this.loadData();
        })
    }

    reload = (params = {}) => {
        let pagination = this.state.pagination;
        if(params.pagination){
            pagination = {...this.state.pagination, ...params.pagination}
        }
        this.setState({
            searchArray: params,
            pagination,
        },function(){
            this.loadData(params);
        })
        
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        // if (pager.current == pagination.current){
        //     pager.current = 1;
        // } else {
            pager.current = pagination.current;
        //}
        this.setState({
            pagination: pager,
        });
        this.loadData({
            ...this.state.searchArray,
            offset: pagination.current,
            limit: pagination.pageSize,
            sort: sorter.field,
            direction: sorter.order == 'descend' ? 'DESC' : 'ASC',
        });
    }

    componentDidMount() {
        this.getTypeInfo();
        this.loadData();
    }

    render() {
        const {reply,sortParams,typeList,loading,pagination} = this.state;
        const waitingTab = <a href='javascript:void(0);' onClick={this.loadWaitingData} className={!reply ? "curr" : ""} >待回复</a>;
        const replyedTab = <a href='javascript:void(0);' onClick={this.loadReplyedData} className={reply ? "curr" : ""} >已回复</a>;
        return (
            <div className="content">
                <ExecuteSider selectKey='QA' ref={el => {this.siderRef = el;}} />
                <div className="main">
                    <div>
                        <div className="tab_flex">
                            {waitingTab}
                            {replyedTab}
                        </div>
                    </div>
                    <QAFilter
                        showCreateModal={this.showQAModal}
                        sortParams={sortParams}
                        reload={this.reload}
                        reset={this.reset}
                        reply = {reply}
                        typeList = {typeList}
                    />
                    <div className="content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.id}
                            loading={loading}
                            onChange={this.handleTableChange}
                            pagination={pagination}
                            scroll={{x:1500}}
                        />
                    </div>

                    {/*<Ueditor  id="content" height="200" />
                    <button onClick={this.testSubmit}>保存</button>*/}
                    
                </div>
                <QACreateModal
                    ref={el => { this.createModalRef = el; }}
                    reload={this.reload}
                    reply={reply}
                />
            </div>
        );
    }
}

export default QA;
