/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import {Modal, Row, Col, Input, Radio, Select, message} from 'antd';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';

const Option = Select.Option;
const RadioGroup = Radio.Group;

class EditSite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            site: {},
        };
    };

    updateSiteName = numType => {
        const { site } = this.state;
        if (numType == 1){
            site.investigationSiteName = site.hospitalName;
            this.setState({
                site,
            });
        } else if (numType == 2){
            site.investigationSiteName = site.hospitalName + site.hospitalDepartmentName;
            this.setState({
                site,
            });
        }
    };

    show = siteId => {
        const options = {
            url: `${API_URL.site.queryBySiteId}`,
            data: {
                investigationSiteId: siteId,
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    site: data.data.site,
                    visible: true,
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

    onChangeSiteName = e => {
        const { site } = this.state;
        site.investigationSiteName = e.target.value;
        this.setState({
            site,
        });
    };

    onChangeSiteCode = e => {
        const { site } = this.state;
        site.investigationSiteCode = e.target.value;
        this.setState({
            site,
        });
    };

    handleSubmit = () => {
        const { site } = this.state;
        if (StringUtil.isNull(site.investigationSiteName)) {
            message.error('中心名称不能为空');
            return;
        }
        if (StringUtil.isNull(site.investigationSiteCode)) {
            message.error('中心编号不能为空');
            return;
        }
        const options = {
            url: `${API_URL.site.modifySite}`,
            data: {
                investigationSiteId: site.investigationSiteId,
                namedMethod: site.namedMethod,
                siteCode: site.investigationSiteCode,
                siteName: site.investigationSiteName,
            },
            dataType: 'json',
            doneResult: ( data => {
                    this.setState({
                        visible: false,
                    });
                    this.props.reload();
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    };

    onSelectNameType = e => {
        const { site } = this.state;
        const nameType = e.target.value;
        site.namedMethod = nameType;
        this.setState({
            site,
        });
        this.updateSiteName(nameType);
    };

    render() {
        const { visible, confirmLoading, site } = this.state;
        return (
            <Modal
                title="修改研究中心"
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                confirmLoading={confirmLoading}
            >
                <Row>
                    <Col span={8} offset={2}>所属医院：</Col>
                    <Col span={12}>
                        <Input disabled value={ site.hospitalName } />
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>所属科室：</Col>
                    <Col span={12}>
                        <Input disabled value={ site.hospitalDepartmentName } />
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>*中心命名方式：</Col>
                    <Col span={12}>
                        <RadioGroup onChange={this.onSelectNameType} value={ site.namedMethod }>
                            <Radio value={1}>医院</Radio>
                            <Radio value={2}>医院科室</Radio>
                            <Radio value={3}>自定义</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>*中心名称：</Col>
                    <Col span={12}>
                        <Input disabled={ site.namedMethod != 3 } value={ site.investigationSiteName } onChange={this.onChangeSiteName} placeholder="请输入中心名称" />
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>*中心编号：</Col>
                    <Col span={12}>
                        <Input value={ site.investigationSiteCode } onChange={this.onChangeSiteCode} placeholder="请输入中心编号" />
                    </Col>
                </Row>
            </Modal>
        );
    }
}

export default EditSite;
