/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import { Table } from 'antd';
import ExecuteMgrSider from './ExecuteMgrSider';

class Patients extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            dataList: [],
        };
    }

    getColumns = () => [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    }, {
        title: '病例数记录项',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
    }]

    getDataSource = () => {
        const { dataList } = this.state;
        if (dataList.length == 0){
            dataList.push({
                index: 1,
                name: '筛选数',
                operate: '-',
            });
            dataList.push({
                index: 2,
                name: '知情数',
                operate: '-',
            });
            dataList.push({
                index: 3,
                name: '随机(入组)数',
                operate: '-',
            });
            dataList.push({
                index: 4,
                name: '完成访视数',
                operate: '-',
            });
            this.setState({dataList,});
        }

        return dataList;
    };

    render() {
        const { loading } = this.state;
        return (
            <div className="content">
                <ExecuteMgrSider selectKey="patients" />
                <div className="content-inner">
                    <div className="breadcrumb-bar tac">
                        <h2 className="title">病例数记录</h2>
                    </div>
                    <div className="content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.id}
                            loading={loading}
                            pagination={false}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Patients;
