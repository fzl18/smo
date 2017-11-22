import React, { Component } from 'react';
import $ from 'jquery';
import { Form, Input, Modal, Button, Select, DatePicker, message, Icon, InputNumber } from 'antd';
const { TextArea } = Input;
import API_URL from '../../common/url';
import moment from 'moment'
import AjaxRequest from '../../common/AjaxRequest';
import Ueditor from '../../common/Ueditor/Ueditor';

const initState = {
    visible: false,
    confirmLoading: false,
    saveLoading: false,
    replyId : '',
    mode : 'new',//new,[edit,reply],view
    dateFormat: 'YYYY-MM-DD',
    questionDate: null,
    askPerson: '',
    investigationSiteCode: '',
    investigationSiteName: '',
    classify: '',
    questionOverview: '',
    askDetail: '',
    replyDate: '',
    replyPerson: '',
    replyDetail: '',
    typeList:[],
    questionCategoryId:'',
    questionCategoryName:'',
    questionText:'',
    questionLogId: null,
    answerDate: null,
    answerText: null,
    answerPerson:'',
    answerLogId: null
}

class QACreateModal extends Component {
    
        state = initState;
    
        show = (id, m) => {
            this.setState({
                //...initState,
                visible: true,
            });
            this.getTypeInfo();
            if (id) {
                this.loadData(id);
                let answerDate = null;
                let answerPerson ='';
                if(m == "reply"){
                    answerDate = moment().format(this.state.dateFormat);
                    answerPerson = sessionStorage.userName;
                }
                this.setState({
                    isEdit: true,
                    replyId : id,
                    mode : m,
                    questionLogId : id,
                    answerDate,
                    answerPerson,
                    noOverview: false,
                });
            }
            else{
                const {dateFormat} = this.state;
                const askPerson = sessionStorage.userName;
                const {investigationSiteCode,investigationSiteName} = sessionStorage;
                const questionDate = moment().format(dateFormat);
                 this.setState({
                    mode : 'new',
                    questionDate,
                    askPerson,
                    investigationSiteCode,
                    investigationSiteName,
                    noOverview: true,
                 }) 
            }
        };
    
    
        hide = () => {
            if(this.state.mode == "new"){
                this.setState({
                    visible: false,
                });
            }else{
                this.setState({
                    visible: false,
                },function(){
                    this.setState({
                        ...initState,
                    });
                })
            }
        };
        
        getTypeInfo = () => {
            const options = {
                method: 'get',
                url: `${API_URL.execute.listQuestionCategory}`,
                doneResult: ( data => {
                        this.setState({
                            typeList: data.datas,
                        });
                    }
                ),
            };
            AjaxRequest.sendRequest(options);
        }   

        /**
         * 获取项目详细信息
         * @param id
         */
        loadData = id => {
            const options = {
                method: 'get',
                url: `${API_URL.execute.queryQuestionById}?questionLogId=${id}`,
                doneResult: ( data => {
                        if(data.questionLog.answerLog){
                            const {answerDate,answerText,userCompellation,answerLogId} = data.questionLog.answerLog;
                            this.setState({
                                ...data.questionLog,
                                askPerson: data.questionLog.userCompellation,
                                questionDate:moment(data.questionLog.questionDate).format(this.state.dateFormat),
                                answerDate:moment(answerDate).format(this.state.dateFormat),
                                answerText,
                                answerPerson: userCompellation,
                                answerLogId
                            })
                        }else{
                            this.setState({
                                ...data.questionLog,
                                askPerson: data.questionLog.userCompellation,
                                questionDate:moment(data.questionLog.questionDate).format(this.state.dateFormat),
                            });
                        }
                    }
                ),
            };
            AjaxRequest.sendRequest(options);
        }
    
        // 提交表单
        handleSubmit = () => {
            const {mode,questionOverview,questionCategoryId, questionDate, questionLogId,answerDate,answerLogId} = this.state;
            const uContentDetail = UE.getEditor('uContent').getContent();
            this.setState({
                questionText: uContentDetail
            })
            if(mode == "new" || mode == "editPM" || mode =="edit"){
                if(!questionCategoryId){
                    Modal.error({"title":"请选择问题分类"})
                    return;
                }
                if(!questionOverview){
                    Modal.error({"title":"请输入问题概述"})
                    return;
                }
                if(!uContentDetail){
                    Modal.error({"title":"请输入问题详情"})
                    return;
                }
            }else if(mode == "editPM" || mode == "reply"){
                if(!UE.getEditor('answerContent').getContent()){
                    Modal.error({"title":"请输入回复详情"})
                    return;
                }
            }
            const editQuestion = () => {
                const options = {
                    method: 'POST',
                    url: `${API_URL.execute.modifyQuestion}`,
                    data:{
                        questionOverview: questionOverview,
                        questionCategoryId: questionCategoryId,
                        questionText: UE.getEditor('uContent').getContent(),
                        //questionText: "1",
                        questionLogId
                    },
                    doneResult: ( data => {
                            
                            this.setState({ visible : false,confirmLoading: false });
                            message.success('编辑成功');
                            this.props.reload();
                            this.hide();
                        }
                    ),
                };
                AjaxRequest.sendRequest(options);
            }
            const editAnswer = () => {
                const options = {
                    method: 'POST',
                    url: `${API_URL.execute.modifyAnswer}`,
                    data:{
                        answerLogId,
                        answerText: UE.getEditor('answerContent').getContent(),
                        //answerText: "1",
                    },
                    doneResult: ( data => {
                            
                            this.setState({ visible : false,confirmLoading: false });
                            message.success('编辑成功');
                            this.props.reload();
                            this.hide();
                        }
                    ),
                };
                AjaxRequest.sendRequest(options);
            }
            const answerQuestion = () => {
                const options = {
                    method: 'POST',
                    url: `${API_URL.execute.answerQuestion}`,
                    data:{
                        answerDate: answerDate,
                        answerText: UE.getEditor('answerContent').getContent(),
                        //answerText: "1",
                        questionLogId
                    },
                    doneResult: ( data => {
                            
                            this.setState({ visible : false,confirmLoading: false });
                            message.success('回复成功');
                            this.props.reload();
                            this.hide();
                        }
                    ),
                };
                AjaxRequest.sendRequest(options);
            }
            
            if(mode == "new"){//CRC新建问题
                const options = {
                    method: 'POST',
                    url: `${API_URL.execute.createQuestion}`,
                    data:{
                        questionOverview: questionOverview,
                        questionCategoryId: questionCategoryId,
                        questionText: UE.getEditor('uContent').getContent(),
                        //questionText: "1",
                        questionDate: questionDate
                    },
                    doneResult: ( data => {
                            
                            this.setState(initState);
                            message.success('新建成功');
                            this.props.reload();
                            this.hide();
                        }
                    ),
                };
                AjaxRequest.sendRequest(options);
            }else if(mode == "edit"){//crc编辑问题
                editQuestion();
            }else if(mode == "reply"){//pm回复问题
                this.setState({
                    answerText: UE.getEditor('answerContent').getContent(),
                })
                answerQuestion();
            }else if(mode == "editPM"){//pm修改问题和回复
                this.setState({
                    answerText: UE.getEditor('answerContent').getContent(),
                })
                editQuestion();
                editAnswer();
            }
        }

        handleControlChange = (e) => {
            if(e.target.value){
                this.setState({
                    questionOverview: e.target.value,
                    noOverview: false
                })
            }else{
                this.setState({
                    questionOverview: e.target.value,
                    noOverview: true
                })
            }
            
        }
        
        handleChange = questionCategoryId => {
            this.setState({ questionCategoryId });
        }
    
        handleBlur = questionCategoryId => {
            this.setState({ questionCategoryId });
        }

        uContentChange = (questionOverview) => {
            const {noOverview} = this.state;
            if(noOverview){
                this.setState({
                    questionOverview
                })
            }
        }


        render() {
            const { visible,
                confirmLoading,
                replyId,
                mode,
                dateFormat,
                classify,
                questionOverview,
                askDetail,
                replyDate,
                replyPerson,
                replyDetail,
                saveLoading,
                answerText,
                answerDate,
                answerPerson,
                typeList,questionDate, askPerson, investigationSiteCode, investigationSiteName,questionCategoryName,questionText,questionCategoryId
            } = this.state;
            let title,footerDom,editfooterDom;
            editfooterDom = [
                <Button key="save" type="primary" size="large" loading={saveLoading} onClick={this.handleSubmit}>
                    保存
                </Button>,
                <Button key="back" size="large" onClick={this.hide}>取消</Button>,
            ];
            if(mode == "edit"){
                title = '修改问题'
                footerDom = editfooterDom;
            }else if(mode == "reply"){
                title = '回复问题'
                footerDom = editfooterDom;
            }else if(mode == "view"){
                title = '查看问题记录'
                footerDom = [
                    <Button key="back" size="large" onClick={this.hide}>关闭</Button>
                ];
            }else if(mode == "editPM"){
                title = '修改问题\\回复'
                footerDom = editfooterDom;
            }else{
                title = '新建问题';
                footerDom = editfooterDom;
            }
            
            const options = this.state.typeList.map(d => <Option key={d.questionCategoryId.toString()}>{d.questionCategoryName}</Option>);

            return (
                <Modal
                    title={title}                
                    visible={visible}
                    onCancel={this.hide}
                    className="qa-modal"
                    wrapClassName="vertical-center-modal"
                    width="900px"
                    confirmLoading={confirmLoading}
                    footer={footerDom}
                >
                <div className="cont-cont"  style={{ marginTop: 10 }}>
                    <ul className="preview-list">
                        <li>
                            <div className="item">
                                <label className="ui-label">提问日期</label>
                                <span className="ui-text">{questionDate}</span>
                            </div>
                            <div className="item">
                                <label className="ui-label">提问人员</label>
                                <span className="ui-text">{askPerson}</span>
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
                                <label className="ui-label">*问题分类</label>
                                <span className="ui-text">
                                    {
                                        mode == "view" || mode == "reply"  ?
                                            <span>{questionCategoryName}</span>
                                        :
                                        <Select
                                            value={questionCategoryId && questionCategoryId.toString()}
                                            onChange={this.handleChange}
                                            onBlur={this.handleBlur}
                                            allowClear={true}
                                            style={{width:'130px'}}
                                        >
                                            {options}
                                        </Select>
                                    }
                                    
                                </span>
                            </div>
                        </li>
                        <li>
                        <div className="item">
                            <label className="ui-label">*问题概述</label>
                            <span className="ui-text">
                                {
                                    mode == "view" || mode == "reply" ?
                                    <span>{questionOverview}</span>
                                    :
                                    <Input
                                        value={questionOverview}
                                        onChange={this.handleControlChange}
                                        style={{width:300}}
                                    />
                                }
                            </span>
                        </div>
                        </li>
                            <li style ={{display: (mode == "view" || mode == "reply") ? "block": "none",background:'none'}}>
                                <div className="item">                                    
                                    <label className="ui-label">问题详情</label>
                                    <span className="ui-text" style={{width:'650px'}}>
                                            <div className="dangerousHtml" dangerouslySetInnerHTML={{
                                                __html: questionText
                                            }}/>
                                    </span>
                                </div>
                            </li>
                            <li style ={{display: (mode !== "view" && mode !== "reply") ? "block": "none",background:'none'}}>
                                <div className="item">
                                    <label className="ui-label">*问题详情</label>
                                    <span className="ui-text" style={{width:'650px'}}>
                                            <Ueditor id="uContent" uContentChange={this.uContentChange} uContent={questionText} initialFrameHeight="180" initialFrameWidth="680" />
                                    </span>
                                </div>
                            </li>
                        
                    </ul>
                    {
                        (sessionStorage.curRole == "PM" && (mode == "reply" || mode == "editPM")) || (this.props.reply == true && mode == "view") ?
                        <div>
                            <div style={{marginTop:"20px",marginBottom:"10px",backgroundColor:"#ccc",height:"1px"}}></div>
                            <ul className="preview-list">
                            <li>
                                <div className="item">
                                    <label className="ui-label">回复日期</label>
                                    <span className="ui-text">{answerDate}</span>
                                </div>
                                <div className="item">
                                    <label className="ui-label">回复人员</label>
                                    <span className="ui-text">{answerPerson}</span>
                                </div>
                            </li>
                            <li style ={{display: (mode == "view") ? "block": "none",background:'none'}}>
                                <div className="item">                                    
                                    <label className="ui-label">回复详情</label>
                                    <span className="ui-text" style={{width:'650px'}}>
                                            <div className="dangerousHtml" dangerouslySetInnerHTML={{
                                                __html: answerText
                                            }}/>
                                    </span>
                                </div>
                            </li>
                            <li style ={{display: (mode !== "view") ? "block": "none",background:'none'}}>
                                <div className="item">
                                    <label className="ui-label">*回复详情</label>
                                    <span className="ui-text" style={{width:'650px'}}>
                                            <Ueditor id="answerContent" uContent={answerText} initialFrameHeight="180" initialFrameWidth="680" />
                                    </span>
                                </div>
                            </li>
                            </ul>
                        </div>
                        :
                        null
                    }            
                    
                </div>

            {/*<CreateForm ref="form" mode={this.state.mode} city={city} fteList={fteList} copy={copy}/>*/}
                </Modal>
    
            );
        }
    }
    
    export default QACreateModal;
    