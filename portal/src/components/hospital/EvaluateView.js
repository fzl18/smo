import React from 'react';
import $ from '../../common/AjaxRequest';
import { Modal, Button,Table } from 'antd';
import API_URL from '../../common/url';

class EvaluateView extends React.Component {

    state = {
        visible: false,
        investigation: {},
        loading:false,
        id:0,
        pagination: {
            pageSize: 15,
            current: 1,
        },
    };

    loadData = (id) => {
        const options ={
            method: 'POST',
            url: API_URL.investigation.view,
            data: {
                investigationId:id,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    investigation: data.data.investigation,
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

    show = id => {
        this.setState({
            visible: true,
        });
        if (id) {
            this.loadData(id);
        }
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    getColumns = () => [{
        title: '评价者',
        dataIndex: 'index',
        key: 'index',
    }, {
        title: '评价时间',
        dataIndex: 'ivnesCode',
        key: 'ivnesCode',
    }, {
        title: '其他信息',
        dataIndex: 'ivesName',
        key: 'ivesName',
    }]

    getDataSource = () => {
        const investigations = [];
        // const { data, pagination } = this.state;
        // data.map((investigation, i) => {
        //     investigations.push({
        //         key:i,
        //         index: ((pagination.current - 1) || 0) * 15 + i + 1,
        //         id: investigation.userId,
        //         ivnesCode: investigation.ivnesCode,
        //         ivesName: investigation.ivesName,
        //         invesStatus: investigation.invesStatus,
        //         typeRandom: investigation.typeRandom,
        //         crcName:investigation.crcName.join(';'),
        //     });
        // });
        return investigations;
    }




    render() {
        const { visible, loading } = this.state;
        const {
            investigationName,
            investigationCode,
            investigationArea,
            investigationSponsor,
            investigationMedicine,
            investigationMalady,
            investigationPlanBeginTime,
            investigationPlanEndTime,
            investigationSitePlan,
            planAmountFilter,
            planAmountInform,
            planAmountRandom,
            planAmountVisit,
            planAmountFTE,
            investigationContractAmount,
            pmUserList,
            paUserList,
            bdUserList,
            investigationRandom,
        } = this.state.investigation;

        return (
            <Modal
                title="查看评价"
                visible={visible}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="650px"
                footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
            >
                <div className="cont-cont">
                    <ul className="preview-list">
                        <li className="title"><h4>1.基本信息</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">研究者</label>
                                <span className="ui-text">{investigationName}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">床位数</label>
                                <span className="ui-text">{investigationCode}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目经验</label>
                                <span className="ui-text">{investigationArea}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">积极性</label>
                                <span className="ui-text">{investigationSponsor}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">生日</label>
                                <span className="ui-text">{investigationMedicine}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">兴趣爱好</label>
                                <span className="ui-text">{investigationMalady}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">英文</label>
                                <span className="ui-text">{investigationPlanBeginTime}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">子女</label>
                                <span className="ui-text">{investigationPlanEndTime}</span>
                            </div>
                        </li>
                        <li className="title"><h4>2.其他信息</h4></li>
                        <li>
                            <Table 
                                columns={this.getColumns()}
                                dataSource={this.getDataSource()}
                                rowKey='tab'
                                loading={loading}
                                scroll={{ x: 600 }}
                                onChange={this.handleTableChange}
                                pagination={false}
                            />
                        </li>                        
                    </ul>
                </div>
            </Modal>
        );
    }
}

export default EvaluateView;
