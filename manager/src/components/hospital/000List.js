import React from 'react';
import moment from 'moment';
import { message, Modal, Table, Popconfirm, Pagination } from 'antd';
import API_URL from '../../common/url';
import $ from '../../common/XDomainJquery'



class Activity extends React.Component {

    state = {
        hospital: [],
        totalElements: 0,
        currentPage: 1,
        loading: false,
        name: '',
        id: '',
    };

    loadData = (page = 1) => {
        this.setState({ loading: true });
        const { id, name } = this.state;
        $.ajax({
                method: 'GET',
                url:`${API_URL.hospital.list}?applicationId=1&enterpriseId=1&hospitalId=4&remark=nihao&offset=${page}&limit=15`,
            }).done( data => {
                this.setState({
                    loading: false,
                    hospital: data.datas,
                    currentPage: page,
                });
            });       
    }

    changePage = page => {
        this.setState({
            currentPage: page,
        });
        this.loadData(page);
    }

    del = id => {
        $.ajax({
            method: 'GET',
            url:`${API_URL.hospital.del}?enterpriseId=1&hospitalId=${id}`,
        }).done( data => {
            if(data.error){
                message.warn(data.error);
            }else{
                this.loadData()
                message.success(data.success)
            }
            
            
        })
        console.log(id);

        // Fetch.get(`${API_URL.hospital.del}?hospitalId=${id}`).then(() => {
        //     console.log(1111);
        //     message.success('删除成功');
        //     this.loadData();
        // });
    }

    showEditModal = id => {
        this.props.showEditModal(id);
    }

    getColumns = () => [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        fixed: 'left',
        width: 60,
    }, {
        title: '医院名称',
        dataIndex: 'hospitalName',
        key: 'hospitalName',
        fixed: 'left',
        width: 100,
    }, {
        title: '等级',
        dataIndex: 'hospitalLevel',
        key: 'hospitalLevel',
    }, {
        title: '省',
        dataIndex: 'hospitalProvince',
        key: 'hospitalProvince',
    }, {
        title: '市',
        dataIndex: 'hospitalCity',
        key: 'hospitalCity',
    }, {
        title: '详细地址',
        dataIndex: 'hospitalAddress',
        key: 'hospitalAddress',
    }, {
        title: '备注',
        dataIndex: 'hospitalRemark',
        key: 'Note',
    }, {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 200,
        render: (text, record) => (
            <span>
                <a href="javascript:void(0)" onClick={this.showEditModal.bind(this, record.id)}>项目明细</a>
                
            </span>
            ),
    }]

    getDataSource = () => {
        const hospital = [];
        this.state.hospital.map((hospitalz, i) => {
            hospital.push({
                index: (this.state.currentPage - 1) * 15 + i + 1,
                id: hospitalz.hospitalId,
                hospitalName: hospitalz.hospitalName,
                hospitalLevel: hospitalz.hospitalLevel,
                hospitalCity: hospitalz.hospitalCity,
                hospitalProvince: hospitalz.hospitalProvince,
                hospitalAddress: hospitalz.hospitalAddress,
                hospitalRemark: hospitalz.remark,
            });
        });
        return hospital;
    }



    componentDidMount() {
        this.loadData();
    }

    render() {
        const { currentPage, totalElements, loading } = this.state;
        return (
            <div>
                <Table
                    columns={this.getColumns()}
                    dataSource={this.getDataSource()}
                    rowKey={record => record.id}
                    pagination={false}
                    loading={loading}
                    scroll={{ x: 1300 }}

                />
                <div className="user-pagination">
                    <Pagination
                        onChange={this.changePage}
                        current={currentPage}
                        defaultCurrent={1}
                        total={totalElements}
                        showQuickJumper
                    />
                </div>
            </div>
        );
    }
}

export default Activity;
