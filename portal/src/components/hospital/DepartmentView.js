import React from 'react';
import $ from '../../common/AjaxRequest';
import { Modal, Button,Table,Input } from 'antd';
import API_URL from '../../common/url';
// import Fetch from '../../common/FetchIt';

class DepartmentView extends React.Component {

    state = {
        visible: false,
        data:[],
        hospitalName:'',
        departmentName:'',
        keyword:'',
        id:0,
        pagination: {
            pageSize: 15,
            current: 1,
        },
        loading: false,
    };

    loadData = (id,params = {}) => {
        this.setState({
            loading:true,
        })
        const options ={
            method: 'POST',
            url: `${API_URL.hospital.queryInvesByHospitalDepartmentId}`,
            data: {
                hospitalDepartmentId:id,
                ...params,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    data: data.data,
                    loading:false,
                });
            }
        }
        $.sendRequest(options)



        // Fetch.get(`${API_URL.investigation.view}?investigationId=${id}`).then(data => {
        //     this.setState({
        //         investigation: data.investigation,
        //     });
        // });
    };

    show = record => {
        this.setState({
            visible: true,
        });
        if (record) {
            this.loadData(record.id);
            this.setState({
                hospitalName:record.hospitalName,
                departmentName:record.departmentName ? record.departmentName: null,
                id:record.id,
            });
        }
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    reload = (params = {}) => {
        const { pagination,id} = this.state;
        this.loadData(id,{
            offset: pagination.current,
            ...params,
        });
    }

    handleChange = (field, e) => {
        this.setState({
            [field]: e.target.value,
        });
    }

    handleChangeSelect = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    search = () => {
        const {keyword} = this.state;
        this.reload({keyword});
    }

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    }


    getColumns = () => [{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width:60,
        }, {
            title: '项目编号',
            dataIndex: 'ivnesCode',
            key: 'ivnesCode',
        }, {
            title: '项目名称',
            dataIndex: 'ivesName',
            key: 'ivesName',
        },{
            title: '项目状态',
            dataIndex: 'invesStatus',
            key: 'invesStatus',
            render: (text, record) => {
                let status;
                if (record.invesStatus === 'DISCUSSING') {
                    status = '洽谈中';
                } else if (record.invesStatus === 'PREPARING') {
                    status = '准备中';
                } else if (record.invesStatus === 'UNDERWAY') {
                    status = '进行中';
                } else if (record.invesStatus === 'COMPLETED') {
                    status = '已完成';
                } else if (record.invesStatus === 'DELETED') {
                    status = '已删除';
                } else {
                    status = '未知';
                }
                return (
                    <span>{status}</span>
                );
            },
        }, {
            title: '实际随机(入组)病例数',
            dataIndex: 'typeRandom',
            key: 'typeRandom',
        }, {
            title: 'CRC',
            dataIndex: 'crcName',
            key: 'crcName',
        }]
    
        getDataSource = () => {
            const investigations = [];
            const { data, pagination } = this.state;
            data.map((investigation, i) => {
                investigations.push({
                    index: ((pagination.current - 1) || 0) * 15 + i + 1,
                    id: investigation.userId,
                    ivnesCode: investigation.ivnesCode,
                    ivesName: investigation.ivesName,
                    invesStatus: investigation.invesStatus,
                    typeRandom: investigation.typeRandom,
                    crcName:investigation.crcName.join(';'),
                });
            });
            return investigations;
        }




    render() {
        const { visible,loading,pagination,hospitalName,departmentName} = this.state;
        return (
            <Modal
                title="项目明细"
                visible={visible}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="750px"
                footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
            >
                <div className="" style={{background:'#fff',padding:'30px' }}>
                    <ul className="">
                        <li>
                        <div className="filter-bar">
                            <div className="filter-bar-investigation" style={{width:'100%'}}>
                                <h3 style={{float:'left'}}>医院名称：{hospitalName} <span className="ant-divider" /> 科室：{departmentName}</h3>
                                <div className="form-item" style={{float:'right'}}>
                                    <label htmlFor="" className="ui-label">项目编号 / 项目名称</label>
                                    <Input
                                        placeholder="请输入项目编号"
                                        onChange={this.handleChange.bind(this, 'keyword')}
                                        onKeyPress={this.enterSearch}
                                    />
                                    {/* <span className="ant-divider" /> */}
                                    <Button type="primary" icon="search" onClick={this.search}>搜索</Button>
                                </div>
                            </div>
                        </div>
                        </li>
                        <li> </li>
                        <li >
                            <Table  
                                columns={this.getColumns()}
                                dataSource={this.getDataSource()}
                                rowKey={record => record.id}
                                loading={loading}
                                scroll={{ x: 800 }}
                                onChange={this.handleTableChange}
                                pagination={pagination}
                            />
                        </li>
                    </ul>
                </div>
            </Modal>
        );
    }
}

export default DepartmentView;
