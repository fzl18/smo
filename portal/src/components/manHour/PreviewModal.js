import React from 'react';
import moment from 'moment';
import $ from '../../common/AjaxRequest';
import { Modal, Button, Table } from 'antd';
import API_URL from '../../common/url';

class PreviewModal extends React.Component {
    state = {
        visible: false,
        daily: [],
        sortParams: {},
        searchParams: {},
        pagination: {
            pageSize: 15,
            current: 1,
        },
        loading: false,
    };

    loadData = (id) => {
        const options = {
            url: API_URL.manhour.view,
            data: {
                manHourId:id,
                offset: 1,
                limit: 15,
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loading: false,
                    daily: data.data.manHourDetails,
                });
            }),
            errorResule: (data => {
                this.setState({
                    loading: false,
                });
            }),
        };
        $.sendRequest(options);
    };

    show = recode => {
        this.setState({
            visible: true,
            investigationName:recode.investigationName,
            investigationCode:recode.investigationCode,
            investigationSiteName:recode.investigationSiteName,
            investigationSiteCode:recode.investigationSiteCode,
            enterpriseWorkTypeName:recode.enterpriseWorkTypeName,
            date:recode.date,
        });
        this.loadData(recode.id);
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };


    getColumns = () => [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    }, {
        title: '模式',
        dataIndex: 'countingType',
        key: 'countingType',
    }, {
        title: '开始时间',
        dataIndex: 'beginTime',
        key: 'beginTime',
    }, {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'ccc',
    }, {
        title: '时长',
        dataIndex: 'duration',
        key: 'duration',
    }]

    getDataSource = () => {
        const dailys = [];
        const { daily, pagination } = this.state;
        let total = 0
        daily.map((d, i) => {
            dailys.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                id: d.manHourId,
                countingType: d.countingType === 'AUTO' ? '自动计时' : '手动编辑',
                beginTime: d.beginTime,
                endTime: d.endTime,
                duration: `${d.sDuration}h`,
            });
            total += d.sDuration*1
        });
        dailys.push({
            index:'合计',
            duration:`${total.toFixed(2)}h`
        })

        return dailys;
    }

    render() {
        const { visible,loading,pagination,date,investigationName,investigationCode,investigationSiteName,investigationSiteCode,enterpriseWorkTypeName } = this.state;        
        return (
            <Modal
                title="详情"
                visible={visible}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="650px"
                footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
            >
                <div className="cont-cont" style={{margin:20}}>
                    <ul style={{textAlign:'center'}}>
                        <li>
                            <h2 >记录详情</h2>
                            <p>{moment(date).format("YYYY-MM-DD")}</p>
                            <p>{investigationName} {investigationCode}-{investigationSiteName} {investigationSiteCode}-{enterpriseWorkTypeName}</p>
                        </li>
                        <li>
                            <Table 
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            bordered                            
                            rowKey={'123456'}
                            loading={loading}
                            pagination={pagination}
                             />
                        </li>
                    </ul>
                </div>
            </Modal>
        );
    }
}

export default PreviewModal;
