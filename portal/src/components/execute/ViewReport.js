import React, { Component } from 'react';
import $ from 'jquery';
import { Form, Input, Modal, Button, Select, DatePicker, message, Icon, InputNumber, Table } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import MultiTypeCheck from '../common/MultiTypeCheck';
import RefuseTransferModal from './RefuseTransferModal';
import moment from 'moment';

const { TextArea } = Input;
const initialState = {
    investigationCode: '',
    investigationName: '',
    investigationSiteCode: '',
    investigationSiteName: '',
    handoverUser: '',
    assignedUsers: {},
    Type_Filter: '',
    Type_Informed: '',
    Type_Random: '',
    Type_Drop: '',
    Type_Violation: '',
    Type_SAE: '',
    Type_VisitType: '',
    PlanType_Filter: '',
    PlanType_Informed: '',
    PlanType_Random: '',
    checkList: [],
    handoverBeginDate: '',
    handoverEndDate: '',
    localeHandoverBeginDate: '',
    localeHandoverEndDate: '',
    completeTime: '',
    visible: false,
    dateFormat: "YYYY-MM-DD",
    submitLoading: false,
    saveLoading: false,
    status: '',
    handoverUserId: '',
    isEdit: false,
    returnLoading: false,
    requirementId : '',
    submitting : false,
    
    confirmLoading: false,
};

class ViewReportModal extends Component {

    state = initialState;

    show = (id, isEdit) => {
        const edit = isEdit ? true : false;
        this.setState({
            visible: true,
            requirement: {},
            fteList: [],
            city: '',
            requirementId : '',
            isEdit: edit
        });
        if (id) {
            this.loadData(id);
        }
    };

    reset = () => {
        this.setState(initialState);
        this.props.reload();
    }


    hide = () => {
        this.setState({
            visible: false,
        });
    };
    
    remarkChange = (index, e) => {
        const {checkList} = this.state;
        if(e && e.target){
            checkList[index]['remark'] = e.target.value || '';
            this.setState({
                checkList,
            })
        }
        
    }

    changeCheck = (index, type) => {
        const {checkList} = this.state;
        checkList[index]['itemChecked'] = type;
        this.setState({
            checkList,
        })
    }

    dateChange = (field, value) =>{
        const {dateFormat} = this.state;
        this.setState({
            [field] : moment(value).format(dateFormat),
        })
    }

    getDate = (date) =>{
        const {dateFormat} = this.state;
        if(date){
            return moment(date).format(dateFormat)
        }else{
            return "";
        }
        
    }

    getDatePicker = (date, name) =>{
        const {dateFormat} = this.state;
        if(date == ""){
            return (<DatePicker onChange={this.dateChange.bind(this, name)} format={dateFormat} />)
        }else{
            return (<DatePicker onChange={this.dateChange.bind(this, name)} value={moment(date)} format={dateFormat} />)
        }
        
    }

    handleSubmitAjax = (nodeliver) => {
        
        const {checkList, requirementId, handoverBeginDate, handoverEndDate, localeHandoverBeginDate, localeHandoverEndDate} = this.state;
        //if(submitting) return;
        const loading = nodeliver ? "saveLoading" : "submitLoading";
        this.setState({
            [loading] : true,
        })

        
        let checkItems = '';
        checkList.map((value,index) =>{
            checkItems += `&checkList[${index}].handoverCheckListId=${value.handoverCheckListId}`;
            checkItems += `&checkList[${index}].remark=${value.remark || ''}`;
            checkItems += `&checkList[${index}].itemChecked=${value.itemChecked}`;
        })
        let param = `requirementId=${requirementId}${checkItems}&handoverBeginDate=${handoverBeginDate || ''}&handoverEndDate=${handoverEndDate || ''}&localeHandoverBeginDate=${localeHandoverBeginDate || ''}&localeHandoverEndDate=${localeHandoverEndDate || ''}`;
        if(!nodeliver){
            param += "&deliver=1";
        }
        
        const options = {
            method: 'POST',
            url: `${API_URL.execute.saveHandoverReport}?${param}`,
            doneResult: ( data => {
                    this.setState({ [loading]: false});
                    message.success('提交成功');
                    this.props.reload();
                    this.reset();
                }
            ),
            errorResult:( data => {
                this.setState({ [loading]: false});
            }
        ),
        };
        AjaxRequest.sendRequest(options);
    }

    handleSave = () => {
        this.handleSubmitAjax(true);
    }

    handleSubmit = () => {
        this.handleSubmitAjax(false);
    }

    confirmSubmitReport = () =>{
        Modal.confirm({
            title: '确认提交',
            content: (<span className="confirmText">确认提交该交接报告?</span>),
            okText: '确认',
            cancelText: '取消',
            onOk: this.submitHandoverReport
          });
    }

    submitHandoverReport = () => {
        const {requirementId} = this.state;
        const options = {
            method: 'get',
            url: `${API_URL.execute.confirmHandoverReport}?requirementId=${requirementId}`,
            doneResult: ( data => {
                    message.success('操作成功');
                    this.reset();
                }
            ),
            errorResult: ( () => {
            }
        ),
        };
        AjaxRequest.sendRequest(options);

    }

    confirmCompleteReport = () =>{
        Modal.confirm({
            title: '确认完成',
            content: (<span className="confirmText">确认该交接报告完成?</span>),
            okText: '确认',
            cancelText: '取消',
            onOk: this.submitCompleteReport
          });
    }

    submitCompleteReport = () => {
        const {requirementId} = this.state;
        const options = {
            method: 'get',
            url: `${API_URL.execute.completeHandover}?requirementId=${requirementId}`,
            doneResult: ( data => {
                    message.success('操作成功');
                    this.reset();
                }
            ),
            errorResult: ( () => {
            }
        ),
        };
        AjaxRequest.sendRequest(options);

    }

    refuseTransfer = id => {
        this.refuseTransferModalRef.show(id);
    }

    getAssignUserNames = () =>{
        const {assignedUsers} = this.state;
        let Users = "";
        for(let key in assignedUsers){
            Users += assignedUsers[key] + ";";
        }
        var lastIndex = Users.lastIndexOf(";");
        Users = Users.substring(0, lastIndex);
        return Users;
    }

    isAssignUser = () =>{
        const {assignedUsers} = this.state;
        const userId = sessionStorage.userId;
        let UserIds = [];
        for(let key in assignedUsers){
            UserIds.push(key);
        }
        if(UserIds.indexOf(userId) < 0){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 获取项目详细信息
     * @param id
     */
    loadData = id => {
        this.setState({
            processedEmployees : [],
            requirement: null,
            fteList : [],
            city : '',
            employees : [],
            requirementId : id,
            employeesLoading : true,
            
        })
        const options = {
            method: 'get',
            url: `${API_URL.user.queryHandoverReport}?requirementId=${id}`,
            doneResult: ( data => {
                    const {dateFormat} = this.state;
                    const {actualSummary, checkList, handover, planList, site} = data.data.handoverReport;
                    const {Type_Drop, Type_Filter, Type_Informed, Type_Random, Type_SAE, Type_Violation, Type_VisitType} = actualSummary;
                    const {handoverUser, assignedUserList, requirementId, handoverUserId, status, handoverBeginDate, completeTime, handoverEndDate, localeHandoverBeginDate, localeHandoverEndDate} = handover;
                    const {investigationCode, investigationName} =  site.investigation;
                    const {investigationSiteCode, investigationSiteName} = site;
                    const PlanType_Filter = planList.Type_Filter;
                    const PlanType_Informed = planList.Type_Informed;
                    const PlanType_Random = planList.Type_Random;
                    const assignedUsers = {};
                    assignedUserList.map((value,index) => {
                        assignedUsers[value.userId] = value.userName;
                    })
                    this.setState({
                        investigationCode,
                        investigationName,
                        investigationSiteCode,
                        investigationSiteName,
                        handoverUser,
                        assignedUsers,
                        Type_Filter,
                        Type_Informed,
                        Type_Random,
                        Type_Drop,
                        Type_Violation,
                        Type_SAE,
                        Type_VisitType,
                        PlanType_Filter,
                        PlanType_Informed,
                        PlanType_Random,
                        checkList,
                        handoverBeginDate: handoverBeginDate ? moment(handoverBeginDate).format(dateFormat) : "",
                        handoverEndDate: handoverEndDate ? moment(handoverEndDate).format(dateFormat) : "",
                        localeHandoverBeginDate: localeHandoverBeginDate ? moment(localeHandoverBeginDate).format(dateFormat) : "",
                        localeHandoverEndDate: localeHandoverEndDate ? moment(localeHandoverEndDate).format(dateFormat): "",
                        completeTime,
                        status,
                        handoverUserId,
                        requirementId,
                    });
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    }


    render() {
        const { investigationCode,investigationName,investigationSiteCode,investigationSiteName,handoverUser,assignedUsers,Type_Filter,Type_Informed,Type_Random,Type_Drop,Type_Violation,Type_SAE,Type_VisitType,
            PlanType_Filter, PlanType_Informed, PlanType_Random,checkList,handoverBeginDate,handoverEndDate,localeHandoverBeginDate,localeHandoverEndDate,dateFormat,handoverUserId,
            submitLoading,saveLoading,status,isEdit,returnLoading,requirementId,completeTime,
            confirmLoading,visible } = this.state;
        let footerDom;
        if((status == "UNDERWAY" || status == "RETURNED") && handoverUserId == sessionStorage.userId ){
            footerDom = [
                <Button key="handleSubmit" type="primary" size="large" loading={submitLoading} onClick={this.handleSubmit}>
                    保存并移交
                </Button>,
                <Button key="save" type="primary" size="large" loading={saveLoading} onClick={this.handleSave}>
                    保存
                </Button>,
                <Button key="back" size="large" onClick={this.hide}>取消</Button>,
            ];
        }else if(status == "DELIVERED" && this.isAssignUser()){
            footerDom = [
                <Button key="submit" type="primary" size="large" loading={submitLoading} onClick={this.confirmSubmitReport}>
                    确认提交
                </Button>,
                <Button key="back" size="large"  loading={returnLoading} onClick={this.refuseTransfer.bind(this, requirementId)}>打回</Button>,
            ];
        }else if(status == "RECEIVED" && sessionStorage.curRole == "PM"){
            footerDom = [
                <Button key="submit" type="primary" size="large" loading={submitLoading} onClick={this.confirmCompleteReport}>
                    确认完成
                </Button>,
                <Button key="back" size="large"  loading={returnLoading} onClick={this.refuseTransfer.bind(this, requirementId)}>打回</Button>,
            ];
        }else{
            footerDom = [
                <Button key="back" size="large" onClick={this.hide}>关闭</Button>
            ];
        }
        const title = isEdit ? "填写交接报告" : "查看交接报告"
        return (
            <div>
            <Modal
                visible={visible}
                title={title}
                onCancel={this.hide}
                className="processModal"
                wrapClassName="vertical-center-modal"
                width={"900px"}
                confirmLoading={confirmLoading}
                footer={footerDom}
            >
                <div style={{ textAlign: 'center' }}>
                    <label style={{ fontSize: `${16}px` }}>{title}</label>
                </div>
                <br />
                <hr />
                <div className="cont-cont"  style={{ marginTop: 10 }}>
                    <ul className="preview-list">
                        <li className="title"><h4>1.基本信息</h4></li>
                        <li>
                            <div className="item">
                                <label className="ui-label">项目编号</label>
                                <span className="ui-text">{investigationCode}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">项目名称</label>
                                <span className="ui-text">{investigationName}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">中心编号</label>
                                <span className="ui-text">{investigationSiteCode}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">中心名称</label>
                                <span className="ui-text">{investigationSiteName}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">前任CRC</label>
                                <span className="ui-text">{handoverUser}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">现任CRC</label>
                                <span className="ui-text">
                                    {this.getAssignUserNames()}
                                </span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划筛选数</label>
                                <span className="ui-text">{PlanType_Filter}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">实际筛选数</label>
                                <span className="ui-text">{Type_Filter}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划知情数</label>
                                <span className="ui-text">{PlanType_Informed}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">实际知情数</label>
                                <span className="ui-text">{Type_Informed}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">计划随机(入组)数</label>
                                <span className="ui-text">{PlanType_Random}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">实际随机(入组)数</label>
                                <span className="ui-text">{Type_Random}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">病人脱落数</label>
                                <span className="ui-text">{Type_Drop}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">重大违背数</label>
                                <span className="ui-text">{Type_Violation}</span>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">SAE数</label>
                                <span className="ui-text">{Type_SAE}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">完成访视数</label>
                                <span className="ui-text">{Type_VisitType}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <hr />
                <div className="cont-cont" style={{ marginTop: 10 }}>
                    <h3>2.Check List</h3>
                    <ul className="preview-list">
                        {
                            checkList.map((value, index) => {
                                return (
                                    <li key={index}>
                                    {
                                        value.investigationCheckList.checkName === "其他" ||  value.investigationCheckList.checkName === "其他交接" ?
                                        <div>
                                            
                                            <div className="item item_80 item_qita">
                                                <label className="ui-label">{value.investigationCheckList.checkName}</label>
                                                <div className="ui-text">
                                                    {isEdit ?
                                                    <TextArea autosize={{ minRows: 2, maxRows: 6 }} onChange={this.remarkChange.bind(this, index)} value={value.remark} />
                                                    :
                                                    value.remark}
                                                </div>
                                            </div>
                                        </div>
                                        :
                                       <div>
                                            <div className="item item_10">
                                                <label className="ui-label">{value.investigationCheckList.checkName}</label>
                                                <div className="ui-text">
                                                {
                                                    isEdit ?
                                                    <MultiTypeCheck changeCheck={this.changeCheck} index={index} type={value.itemChecked}/>
                                                    :
                                                    <MultiTypeCheck changeCheck={this.changeCheck} index={index} type={value.itemChecked} disabled="true"/>
                                                }
                                                
                                                </div>
                                            </div>
                                            <div className="item item_80">
                                                <label className="ui-label">{value.investigationCheckList.remarkName}</label>
                                                <div className="ui-text">
                                                    {
                                                        isEdit ? 
                                                        <Input className="markInput" onChange={this.remarkChange.bind(this, index)} value={value.remark}/>
                                                        :
                                                        value.remark
                                                    }
                                                    

                                                </div>
                                            </div>
                                        </div>
                                    }
                                    </li>

                                )
                            })
                        }
                    </ul>
                </div>

                <hr />
                <div className="cont-cont" style={{ marginTop: 10 }}>
                    <h3>3.交接确认</h3>
                    <ul className="preview-list">
                        <li>
                            <div className="item">
                                <label className="ui-label">交接开始日期</label>
                                <div className="ui-text">
                                    {isEdit ?
                                        this.getDatePicker(handoverBeginDate, "handoverBeginDate")
                                    :
                                    this.getDate(handoverBeginDate)
                                    }
                                </div>
                            </div>
                            <div className="item">
                                <label className="ui-label">交接结束日期</label>
                                <div className="ui-text">
                                    {isEdit ?
                                        this.getDatePicker(handoverEndDate, "handoverEndDate")
                                    :
                                    this.getDate(handoverEndDate)}
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">现场交接开始日期</label>
                                <div className="ui-text">
                                    {isEdit ?
                                        this.getDatePicker(localeHandoverBeginDate, "localeHandoverBeginDate")
                                    :
                                    this.getDate(localeHandoverBeginDate)}
                                </div>
                            </div>
                            <div className="item">
                                <label className="ui-label">现场交接结束日期</label>
                                <div className="ui-text">
                                    {isEdit ?
                                        this.getDatePicker(localeHandoverEndDate, "localeHandoverEndDate")
                                    :
                                    this.getDate(localeHandoverEndDate)}
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">PM确认日期</label>
                                <div className="ui-text">
                                    {this.getDate(completeTime)}
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </Modal>
            <RefuseTransferModal
                ref={el => { this.refuseTransferModalRef = el; }}
                reload={this.reset}
            />
            </div>
        );
    }
}

export default ViewReportModal;
