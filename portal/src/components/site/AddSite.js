/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import {Modal, Row, Col, Input, Radio, Select, message} from 'antd';
const Option = Select.Option;
import API_URL from '../../common/url';
import HospitalSearchInput from './HospitalSearchInput';
import DepartmentSearchInput from './DepartmentSearchInput';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';

const RadioGroup = Radio.Group;

class AddSite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            dataList: [],
            site: {},
            hospitalId: '',
            hospitalName: '',
            hospitalDepartmentId: '',
            hospitalDepartmentName: '',
            selectNameType: 0,
            siteName: '',
            siteCode: '',
        };
    };

    updateSiteName = (selectNameType, hospitalName, departmentName) => {
        let numType = selectNameType;
        if (selectNameType == null || selectNameType == undefined){
            numType = this.state.selectNameType;
        }
        let hosName = hospitalName;
        if (hospitalName == null || hospitalName == undefined){
            hosName = this.state.hospitalName;
        }
        if (numType == 1){
            this.setState({
                siteName: hosName,
            });
        } else if (numType == 2){
            let depName = departmentName;
            if (departmentName == null || departmentName == undefined){
                depName = this.state.hospitalDepartmentName;
            }
            this.setState({
                siteName: hosName + depName,
            });
        }
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

    handleSelectHospital = value => {
        this.setState({
            hospitalId: value.key,
            hospitalName: value.label,
            hospitalDepartmentId: '',
            hospitalDepartmentName: '',
        });
        this.updateSiteName(null, value.label, '');
    };

    handleSelectHospitalDepartment = value => {
        this.setState({
            hospitalDepartmentId: value.key,
            hospitalDepartmentName: value.label,
        });
        this.updateSiteName(null, null, value.label);
    };

    onChangeSiteName = e => {
        this.setState({
            siteName: e.target.value,
        });
    };

    onChangeSiteCode = e => {
        this.setState({
            siteCode: e.target.value,
        });
    };

    handleSubmit = () => {
        const {hospitalId} = this.state;
        if(!hospitalId){
            message.error('所属医院不能为空');
            return; 
        }
        if (StringUtil.isNull(this.state.siteName)) {
            message.error('中心名称不能为空');
            return;
        }
        if (StringUtil.isNull(this.state.siteCode)) {
            message.error('中心编号不能为空');
            return;
        }
        const options = {
            url: `${API_URL.site.addSite}`,
            data: {
                hospitalId: this.state.hospitalId,
                departmentId: this.state.hospitalDepartmentId,
                namedMethod: this.state.selectNameType,
                siteCode: this.state.siteCode,
                siteName: this.state.siteName,
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
        const nameType = e.target.value;
        this.setState({
            selectNameType: nameType,
        });
        this.updateSiteName(nameType, null, null);
    };

    getHospitalId = () => {
        return this.state.hospitalId;
    }

    render() {
        const {visible, confirmLoading, siteName, siteCode, selectNameType, hospitalName, hospitalDepartmentName} = this.state;
        const initHosValue = {key: hospitalName, text: hospitalName};
        const initDepValue = {key: hospitalDepartmentName, label: hospitalDepartmentName};
        return (
            <Modal
                title="添加研究中心"
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                confirmLoading={confirmLoading}
            >
                <Row>
                    <Col span={8} offset={2}>*所属医院：</Col>
                    <Col span={12}>
                        <HospitalSearchInput placeholder="请在此输入医院名称" style={{width: 200}}
                                             handleSelectHospital = {this.handleSelectHospital}
                                             initValue = {initHosValue}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>所属科室：</Col>
                    <Col span={12}>
                        <DepartmentSearchInput placeholder="请在此输入科室名称" style={{width: 200}}
                                               handleSelectHospitalDepartment = {this.handleSelectHospitalDepartment}
                                               initValue = {initDepValue}
                                               getDynamicParams = {this.getDynamicParams}
                                               getHospitalId = {this.getHospitalId}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>*中心命名方式：</Col>
                    <Col span={12}>
                        <RadioGroup onChange={this.onSelectNameType} value={selectNameType}>
                            <Radio value={1}>医院</Radio>
                            <Radio value={2}>医院科室</Radio>
                            <Radio value={3}>自定义</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>*中心名称：</Col>
                    <Col span={12}>
                        <Input disabled={ selectNameType != 3 } value={ siteName } onChange={this.onChangeSiteName} placeholder="请输入中心名称" />
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={2}>*中心编号：</Col>
                    <Col span={12}>
                        <Input value={ siteCode } onChange={this.onChangeSiteCode} placeholder="请输入中心编号" />
                    </Col>
                </Row>
            </Modal>
        );
    }
}

export default AddSite;
