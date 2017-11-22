/**
 * Created by casteloyee on 2017/7/28.
 */
import React from 'react';
import {connect} from 'react-redux';
import { Modal, Button, Input, Row, Col, Table } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import moment from 'moment';

const { TextArea } = Input;


class EvaluateView extends React.Component {
    state = {
        visible: false,
        loading: false,
        investigatorUserId: '',
        siteId: '',
        evaluate: {},
        dataList: [],
        pagination: {
            pageSize: 15,
            current: 1,
        },
    };

    show = (investigatorUserId, investigatorId, siteId) => {
        this.setState({
            loading: true,
            visible: true,
        });
        const options = {
            url: `${API_URL.user.queryEvaluationList}`,
            data: {
                investigatorUserId,
                investigatorId,
                siteId,
            },
            dataType: 'json',
            doneResult: ( data => {
                const dataList = data.data ? data.data.evaluations : [];
                let evaluate = {};
                if (dataList != undefined && dataList.length > 0){
                    evaluate = dataList[dataList.length-1];
                }
                this.setState({
                    evaluate,
                    dataList,
                    loading: false,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    getColumns = () => {
        const columnNames = [
            {
                title: '评价者',
                dataIndex: 'evaluateUser',
                key: 'evaluateUser',
                width:75
            }, {
                title: '评价时间',
                dataIndex: 'evaluateTime',
                key: 'evaluateTime',
                width:130
            }, {
                title: '其他信息',
                dataIndex: 'other',
                key: 'other',
            }
        ];
        return columnNames;
    }

    getDataSource = () => {
        const resList = [];
        const {dataList, pagination} = this.state;
        dataList.map((dataItem, i) => {
            //const { user, investigationSite } = dataItem;
            resList.push({
                rowId: i,
                evaluateUser: dataItem.evaluateUserName,
                evaluateTime: dataItem.evaluateTime,
                other: dataItem.other,
                investigatorEvaluationId: dataItem.investigatorEvaluationId,
            });
        });
        return resList;
    };

    render() {
        const { visible, confirmLoading, evaluate, loading, pagination } = this.state;
        return (
            <Modal
                title="查看评价"
                visible={visible}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="600px"
                height='700px'
                confirmLoading={confirmLoading}
                footer={[
                    <Button key="submit" type="primary" size="large" onClick={this.hide}>
                        确定
                    </Button>,
                ]}
            >
                
                <div className="cont-cont">
                    <ul className="preview-list">
                        <li className="title"><h4>1.基本信息</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">研究者</label>
                                <span className="ui-text">{evaluate.investigatorName}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">床位数</label>
                                <span className="ui-text">{evaluate.beds}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目经验</label>
                                <span className="ui-text">{evaluate.experience == 1 ? '多' : evaluate.experience == 2 ? '少' : evaluate.experience == 0 ? '无' : ''}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">积极性</label>
                                <span className="ui-text">{evaluate.enthusiasm == 1 ? '高' : evaluate.enthusiasm == 2 ? '中' : evaluate.enthusiasm == 0 ? '差' : ''}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">生日</label>
                                <span className="ui-text">{evaluate.birthday}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">兴趣爱好</label>
                                <span className="ui-text">{evaluate.interest}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">英文</label>
                                <span className="ui-text">{evaluate.english == 1 ? '好' : evaluate.english == 2 ? '中' : evaluate.english == 0 ? '差' : ''}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">子女</label>
                                <span className="ui-text">{evaluate.children}</span>
                            </div>
                        </li>
                        <li className="title"><h4>2.其他信息</h4></li>                   
                        <li>
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.getDataSource()}
                                rowKey={record => record.investigatorEvaluationId}
                                loading={loading}
                                pagination={ false }
                                className="break-table"
                            />
                        </li>
                    </ul>
                </div>
            </Modal>
        )
    }
}

export default EvaluateView;
