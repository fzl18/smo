import React from 'react';
import $ from '../../common/AjaxRequest';
import { Modal, Button,Table, DatePicker } from 'antd';
import API_URL from '../../common/url';
import moment from 'moment';
// import Fetch from '../../common/FetchIt';
const dateFormat = 'YYYY-MM';
const { MonthPicker} = DatePicker;
class EfficiencyView extends React.Component {

    state = {
        visible: false,
        investigation: [],
        loading:false,
        userCompellation:'',
        employeeCode:'',
        id: '',
        time: moment()
    };

    loadData = (id,begin=moment().format(dateFormat),end=moment().format(dateFormat)) => {

        const options ={
            method: 'POST',
            url: `${API_URL.user.queryUserEfficiencyByUser}`,
            data: {
                userId:id,
                begin,
                end,
            },
            dataType: 'json',
            doneResult: data => {               
                this.setState({
                    investigation: data.data,
                    id
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
                userCompellation:record.userCompellation,
                employeeCode:record.employeeCode,
            });
        }
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };


    getColumns = () => [{
        title: '项目编号',
        dataIndex: 'investigationCode',
        key: 'investigationCode',
        width: 100
    }, {
        title: '项目名称',
        dataIndex: 'investigationName',
        key: 'investigationName',
        width: 160
    }, {
        title: '中心编号',
        dataIndex: 'investigationSiteCode',
        key: 'investigationSiteCode',
        width: 90
    }, {
        title: '中心名称',
        dataIndex: 'investigationSiteName',
        key: 'investigationSiteName',
        width: 150
    }, {
        title: '计划FTE',
        dataIndex: 'planFte',
        key: 'planFte',
        width: 90
    }, {
        title: '消耗FTE',
        dataIndex: 'actualFte',
        key: 'actualFte',
        width: 90
    }, {
        title: '完成访视数',
        dataIndex: 'visitCount',
        key: 'visitCount',
        width: 90
    }]

    getDataSource = () => {
        const investigations = [];
        const { investigation } = this.state;
        if(investigation && investigation.length > 0){
            investigation.map((d, i) => {
                investigations.push({
                    index: i,
                    planFte: d.planFte.toFixed(2),
                    investigationCode: d.investigationCode,
                    investigationName: d.investigationName,
                    investigationSiteName: d.investigationSiteName,
                    investigationSiteCode: d.investigationSiteCode,
                    actualFte: d.actualFte.toFixed(2),
                    visitCount: d.visitCount,
                });
            });
        }
        return investigations;
    }

    onMonthChange = (value) => {
        this.setState({
            time: value
        })
        const {id} = this.state;
        const begin = value.format(dateFormat);
        const end = value.format(dateFormat);
        this.loadData(id, begin, end);
    }

    render() {
        const { visible,loading,userCompellation,employeeCode,time} = this.state;

        return (
            <Modal
                title="明细记录"
                visible={visible}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="650px"
                footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
            >
                <div className="cont" style={{padding:'30px',}}>
                    <div>工号：{employeeCode}  <span className="ant-divider" />  姓名：{userCompellation} <span className="ant-divider" /> 时间：<MonthPicker value={time} onChange={this.onMonthChange} style={{width:'90px'}} /> </div>
                    <Table  
                        columns={this.getColumns()}
                        dataSource={this.getDataSource()}
                        rowKey={record => record.index}
                        loading={loading}
                        scroll={{ x: 770, y: 200}}
                        //onChange={this.handleTableChange}
                        pagination={false}
                        style={{margin:'20px 0'}}
                    />
                </div>
            </Modal>
        );
    }
}

export default EfficiencyView;
