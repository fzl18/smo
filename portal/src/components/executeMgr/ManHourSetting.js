/**
 * Created by casteloyee on 2017/7/15.
 */
import React, { Component } from 'react';
import { Form, Input, Modal, Button, Select, message, Row, Col } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';

class ManHourSetting extends Component {

    state = {
        visible: false,
        confirmLoading: false,
        dataList:[],
        categoryId:'',
    };

    show = () => {
        this.setState({
            visible: true,
        });
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    componentDidMount() {
        this.loadWorkTypeData();
    }

    /**
     * 获取项目详细信息
     * @param id
     */
    loadWorkTypeData = () => {
        const options = {
            url: `${API_URL.execute.queryEnterpriseWorkCategory}`,
            data: {},
            dataType: 'json',
            doneResult: ( data => {
                const { enterpriseWorkCategories } = data.data;
                this.setState({
                    loading: false,
                    dataList: enterpriseWorkCategories,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    // 提交表单
    handleSubmit = () => {
        const {categoryId} = this.state;
        const options = {
            url: `${API_URL.execute.addInvestigationWorkCategory}`,
            data: {
                workCategoryId: categoryId,
            },
            dataType: 'json',
            doneResult: ( data => {
                message.success('配置成功');
                this.props.reload();
                this.hide();
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    getWorkTypeCategory = () => {
        const resList = [];
        const { dataList } = this.state;
        dataList.map((dataItem, i) => {
            resList.push(<Option key={dataItem.enterpriseWorkCategoryId}>{dataItem.enterpriseWorkCategoryName}</Option>);
        });
        return resList;
    }

    handleChange = (value) => {
        this.setState({
            categoryId:value,
        });
    }

    render() {
        const { visible,confirmLoading } = this.state;
        return (
            <Modal
                title='配置工作类型'
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                confirmLoading={confirmLoading}
            >
                <Row>
                    <Col span={12}>工作类型来源</Col>
                    <Col span={12}>
                        <Select style={{ width: 120 }} onChange={this.handleChange}>
                            {this.getWorkTypeCategory()}
                        </Select>
                    </Col>
                </Row>
            </Modal>
        );
    }
}

export default ManHourSetting;
