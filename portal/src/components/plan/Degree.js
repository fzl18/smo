import React from 'react';
import {message, Table, Popconfirm, Modal, Button} from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import Sider from './PlanSider';
import DegreeSetting from './DegreeSetting';
import SortList from '../common/SortList';
import DegreeAdd from './DegreeAdd';
import DegreeChart from './DegreeChart';
import moment from 'moment';

class Degree extends React.Component {
    state = {
        loading: false,
        dataList: [],
        dateFormat: 'YYYY-MM-DD',
    };

    loadData = () => {
        this.setState({
            loading: true,
        });
        const options = {
            url: `${API_URL.plan.degreeList}`,
            data: {},
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loading: false,
                    dataList: data.data.degreeList,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    getColumns = () => {
        const columns = [
          {
              title: '项目阶段',
              dataIndex: 'stageName',
              key: 'stageName',
          }, {
              title: '计划开始时间',
              dataIndex: 'beginTimePlan',
              key: 'beginTimePlan',
          }, {
              title: '实际开始时间',
              dataIndex: 'beginTime',
              key: 'beginTime',
          }, {
              title: '计划结束时间',
              dataIndex: 'endTimePlan',
              key: 'endTimePlan',
          }, {
              title: '实际结束时间',
              dataIndex: 'endTime',
              key: 'endTime',
          }
        ];
        const disabled = sessionStorage.invStatus == 'COMPLETED'; 
        
        if (sessionStorage.curRole == 'PA' || sessionStorage.curRole == 'PM'){
            columns.push({
                title: '操作',
                key: 'operation',
                width: 100,
                render: (text, record) => {
                    return (
                       
                        sessionStorage.curRole == 'PA'? 
                        <span>
                            <a href="javascript:void(0)"
                             disabled={disabled}
                             onClick={() => this.edit(record)}>设置</a>
                            <span className="ant-divider"/>
                            <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.del(record.investigationDegreeId)} okText="确定" cancelText="取消">
                                <a href="javascript:void(0)"  disabled={disabled}  >删除</a>
                            </Popconfirm>
                         </span> 
                        :
                        <span>
                            <a href="javascript:void(0)" disabled={disabled}  onClick={() => this.edit(record)}>调整</a>
                        </span>
                    
                );
                },
            });
        }
        return columns;
    }

    getDataSource = () => {
        const resList = [];
        const {dataList, dateFormat} = this.state;
        dataList.map((degree, i) => {
            resList.push({
                investigationDegreeId: degree.investigationDegreeId,
                stageName: degree.stageName,
                beginTimePlan: this.getDateShowValue(degree.beginTimePlan),
                beginTime: this.getDateShowValue(degree.beginTime),
                endTimePlan: this.getDateShowValue(degree.endTimePlan),
                endTime: this.getDateShowValue(degree.endTime),
            });
        });
        return resList;
    };

    del = id => {
        const options = {
            url: `${API_URL.plan.deleteDegree}`,
            data: {
                invDegreeId: id,
            },
            dataType: 'json',
            doneResult: ( data => {
                this.loadData();
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    /**
     * 设置项目计划
     * @param id
     */
    edit = record => {
        this.degreeSettingRef.show(record);
    };

    componentDidMount() {
        this.loadData();
    };

    getDateShowValue = value => {
        if (value != null){
            const {dateFormat} = this.state;
            return moment(value).format(dateFormat);
        }
        return null;
    };

    sort = () => {
        const sortList = [];
        const {dataList} = this.state;
        dataList.map(item => {
            sortList.push({
                key: item.investigationDegreeId,
                name: item.stageName,
            });
        });
        this.degreeSortRef.show(sortList);
    }

    add = () => {
        this.degreeAddRef.show();
    }

    showChart = () => {
        this.degreeChartRef.show();
    }

    render() {
        const {loading} = this.state;
        const disabled = sessionStorage.invStatus == 'COMPLETED';    
        return (
            <div className="content">
                <Sider selectKey="degree" />
                <div className="main">
                    <div className="breadcrumb-bar tac">
                        <h2 className="title">项目阶段进度计划</h2>
                    </div>
                    {
                        sessionStorage.curRole == 'PA'&&
                        <div className="filter-bar tar">
                            <Button disabled={disabled} type="primary" onClick={this.sort}>调整</Button>
                            <Button  disabled={disabled}  type="primary" onClick={this.add}>添加</Button>
                        </div>
                    }
                    {
                        sessionStorage.curRole != 'PA' && 
                        <div className="filter-bar tar">
                            <Button type="primary" onClick={this.showChart}>甘特图</Button>
                        </div>
                    }
                    <div className="main-content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.investigationDegreeId}
                            loading={loading}
                            pagination={false}
                        />
                    </div>
                </div>
                <DegreeSetting ref={el => { this.degreeSettingRef = el; }}
                                reload={this.loadData}
                />
                <SortList ref={el => { this.degreeSortRef = el; }}
                                reload={this.loadData}
                                sortUrl={`${API_URL.plan.sortDegree}`}
                                title='项目阶段-调整（排序）'
                />
                <DegreeAdd ref={el => { this.degreeAddRef = el; }}
                                reload={this.loadData}
                />
                <DegreeChart ref={el => { this.degreeChartRef = el; }}
                />
            </div>
        );
    }
}

export default Degree;
