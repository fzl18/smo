import React, { Component } from 'react';
import $ from 'jquery';
import { Form, Input, Modal, Button, Select, DatePicker, message, Icon, InputNumber } from 'antd';
const { TextArea } = Input;
const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY.MM';
import API_URL from '../../common/url';
import InvSiteSearchInput from './InvSiteSearchInput';
import moment from 'moment'
import AjaxRequest from '../../common/AjaxRequest';

const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 搜索企业用户
 */

let timeout;
let currentValue;
let uuid = 0;

class CreateForm extends Component {

    state = {
        city : this.props.city,
        investigationSiteName : '',
        investigationSiteCode : '',
        mode : this.props.mode,
        noFte: this.props.noFte
    }

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }

    getEvent = () =>{
        if(document.all){
            return window.event;
        }
        let func = getEvent().caller;
        while (func != null){
            var arg0 = func.arguments[0];
            if(arg0){
                if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)){
                    return arg0;
                }
            }
            func = func.caller;
        }
        return null;
    }

    handSelectInvesgationSite = (obj, option) =>{
        this.setState ({
            city : option.city,
        })
        const form = this.props.form;
        form.setFieldsValue({
            invSiteId : obj.key
        })
    }


    

    add = () => {
        const { form } = this.props;
        let keys = form.getFieldValue('keys');
        const startMonthTemp = form.getFieldValue('startMonth');
        if(!startMonthTemp){
            Modal.error({title: `请输入起始时间`})
        }
        const endMonth = form.getFieldValue('endMonth');
        const setFteNum = form.getFieldValue('setFteNum');
        const fteArr = form.getFieldValue('fteArr');
        const getArrIndex = (date) =>{
            let arrIndex = -1;
            fteArr.map((value,index)=>{
                if(value !== 1)
                if(value[0].format('YYYY-MM') == date){
                    arrIndex = index
                }
            })
            return arrIndex;
        }
        if(startMonthTemp && endMonth){
            const startMonth = moment(startMonthTemp);
            while (endMonth > startMonth) {
                const arrIndex = getArrIndex(startMonth.format('YYYY-MM'));
              if(arrIndex < 0){
                fteArr.push([moment(startMonth.format('YYYY-MM')),setFteNum]);
              }else{
                fteArr[arrIndex][1] = setFteNum;
              }
               startMonth.add(1,'month');
            }
        }else if (startMonthTemp){
            const arrIndex = getArrIndex(startMonthTemp.format('YYYY-MM'));
            if(arrIndex < 0){
                fteArr.push([moment(startMonthTemp.format('YYYY-MM')),setFteNum]);
            }else{
                fteArr[arrIndex][1] = setFteNum;
            }
        }
        const sortDate = (a,b) =>{
            if(b !== 1 && a!==1){
                return a[0].format('X') - b[0].format('X')
            }
            
        }
        const fteArrSort = fteArr.sort(sortDate);
        form.setFieldsValue({
            fteArr : fteArrSort,
            keys: Number(keys) + 1
        });
    }

    componentDidMount() {
        uuid = 0;
        const {fteList} = this.props;
        const { form } = this.props;
        const fieldsValue = this.props.form.getFieldsValue();
        let keys = [];
        let FTEDate = [];
        let FTE = [];
        let fteArr = [];
        fteList.map((dataItem, i) => {
            keys.push(i);
            let year =  dataItem.year;
            let month = dataItem.month < 10 ? `0${dataItem.month}` : dataItem.month;
            fteArr.push([moment(`${year}-${month}`),dataItem.fte]);
        });

        form.setFieldsValue({
            fteArr
        });

        let siteId;
        if(sessionStorage.siteId != null && sessionStorage.siteId != 0){
            siteId = sessionStorage.siteId;
        }else{
            const { form } = this.props;
            siteId = form.getFieldValue('invSiteId');
        }
        if(siteId != null && siteId !=0){
            const options = {
                url: `${API_URL.site.queryBySiteId}?investigationSiteId=${siteId}`,
                dataType: 'json',
                doneResult: ( data => {
                        this.setState ({
                            city : data.data.site.city,
                            investigationSiteCode : data.data.site.investigationSiteCode,
                            investigationSiteName : data.data.site.investigationSiteName,
                        })
                    }
                ),
            };
            AjaxRequest.sendRequest(options);
        }
    }

    disabledDate = (current) => {
        // Can not select days before today and today
        if(this.state.mode == "change"){
            //return current && current.valueOf() < Date.now();
            return current && moment(current.format('YYYY-MM')).valueOf() < moment(moment().format('YYYY-MM')).valueOf();
        }else{
            return current && moment(current.format('YYYY-MM')).valueOf() < moment(moment().format('YYYY-MM')).valueOf();
        }
    }
    
    onMonthChange = (index, e) => {
        const { form } = this.props;
        const fteArr = form.getFieldValue('fteArr');
        fteArr[index][0] = e;
        form.setFieldsValue({
            fteArr
        });
    }

    onNumberChange = (index, e) => {
        const { form } = this.props;
        const fteArr = form.getFieldValue('fteArr');
        fteArr[index][1] = e;
        form.setFieldsValue({
            fteArr
        });
    }
    
    remove = (index) => {
        const { form } = this.props;
        
        const fteArr = form.getFieldValue('fteArr');
        fteArr.splice(index, 1)
        
        form.setFieldsValue({
            fteArr
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {city, investigationSiteName, investigationSiteCode} = this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        getFieldDecorator('fteArr', { initialValue: [] });
        getFieldDecorator('keys', { initialValue: 0 });
        getFieldDecorator('ftes', { initialValue: [] });
        getFieldDecorator('FTEDate', { initialValue: [] });
        getFieldDecorator('startMonth', { initialValue: null });
        getFieldDecorator('endMonth', { initialValue: null });
        getFieldDecorator('setFteNum', { initialValue: null,rules: [
            {
                required: true,
                message: "请输入FTE数量!"
            }
        ] });
        
        const fteArr = getFieldValue('fteArr');
        const keys = getFieldValue('keys');
        const ftes = getFieldValue('ftes');
        const FTEDate = getFieldValue('FTEDate');
        const startMonth = getFieldValue('startMonth');
        const endMonth = getFieldValue('endMonth');
        const setFteNum = getFieldValue('setFteNum');
        
        let invSiteId = getFieldValue('invSiteId');
        if (invSiteId == null || invSiteId == undefined){
            invSiteId = "";
        }
        let invSiteName = getFieldValue('invSiteName');
        //let investigationSiteCode = getFieldValue('investigationSiteCode');
        if (invSiteName == null || invSiteName == undefined){
            invSiteName = "";
        }
        let defaultSite = {"key":invSiteName, "label":invSiteName}
        const siteId = sessionStorage.siteId;
        var dNow = new Date();
        const curYear = dNow.getFullYear();
        const curMonth = dNow.getUTCMonth() + 1; //取出来都是当前月份-1的值，不知道为啥
        const formItems = fteArr.map((value,fteKey)=>{
            let canDateEdit = true;
            let cnaFteEdit = true;
            let canDelete = true;
            if(this.state.mode == 'change'){
                canDelete = false;
                const now = moment(moment().format('YYYY-MM')).format('x');
                if( now > value[0].format('x')){
                    canDateEdit = false;
                }
                if(now > value[0].format('x')){
                    cnaFteEdit = false;
                }
                if( now < value[0].format('x')){
                    canDelete = true;
                }else if( now == value[0].format('x') && this.state.noFte){
                    canDelete = true;
                }
            }
            return (
                
                <FormItem
                {...(fteKey === 0 ? formItemLayout : formItemLayout)}
                label={fteKey === 0 ? '' : ''}
                required={false}
                key={fteKey}
                style={{marginLeft:'25px'}}
            >

                    <MonthPicker showTime className="FTETime"  
                                format={monthFormat}
                                value = {value[0]}
                                disabled= {!canDateEdit}//{ !canDateEdit ? "disabled" : "" }
                                style={{marginLeft:'20px'}}
                                disabledDate={this.disabledDate}
                                onChange = {this.onMonthChange.bind(this,fteKey)}
                                style={{width:'100px'}}
                                />
                
                    <InputNumber className="FTENum"  
                    placeholder="FTE数量" 
                    style={{width:'80px', marginLeft:'20px'}}
                    value = {value[1]}
                    onChange = {this.onNumberChange.bind(this,fteKey)}
                    formatter={value => value !== value || (!value && value !== 0) ? '' : value}
                    disabled= {!cnaFteEdit}//{ !cnaFteEdit ? "disabled" : "" }
                    />
                    
                
                {canDelete ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={keys.length === 1}
                            onClick={() => this.remove(fteKey)}
                        />
                    ) : null}
                    
            </FormItem>
            )

        })

        let returnStr = '';
        if(siteId != null && siteId != 0 ){
            returnStr = (
                <div className="create-form create-require">
                    <Form>
                        <div className="field-max">
                            <div className = "ant-row ant-form-item" style={{marginBottom: '0px'}}> 
                                <div className="ant-form-item-label" style={{width: '120px'}}>
                                <label id="city" className="" title="中心名称(中心编号)">中心名称(中心编号)</label>
                                </div> 
                                <div className = "ant-form-item-control-wrapper" > 
                                    <div className="ant-form-item-control ">
                                            <span>{investigationSiteName}({investigationSiteCode})</span>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div className="field-max">
                            <div className = "ant-row ant-form-item" style={{marginBottom: '0px'}}> 
                                <div className="ant-form-item-label">
                                <label id="city" className="" title="城市">城市</label>
                                </div> 
                                <div className = "ant-form-item-control-wrapper" > 
                                    <div className="ant-form-item-control ">
                                            <span>{city}</span>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div className="field-max">
                            <FormItem label="FTE需求" style={{marginBottom: '5px'}}>
                                {getFieldDecorator('startMonth', startMonth)(
                                    this.state.mode == "change" ?
                                    <MonthPicker style={{width:'100px',marginRight:'5px'}} placeholder='起始时间' disabledDate={this.disabledDate} />
                                    :
                                    <MonthPicker style={{width:'100px',marginRight:'5px'}} placeholder='起始时间' disabledDate={this.disabledDate} />
                                    
                                )}
                                 -
                                {getFieldDecorator('endMonth', endMonth)(
                                    this.state.mode == "change" ?
                                    <MonthPicker style={{width:'100px',marginLeft:'5px'}} placeholder='截止时间'  disabledDate={this.disabledDate} />
                                    :
                                    <MonthPicker style={{width:'100px',marginLeft:'5px'}} placeholder='截止时间'  disabledDate={this.disabledDate} />
                                )}
                                {getFieldDecorator('setFteNum', setFteNum)(
                                    <InputNumber className="FTENum"  
                                    placeholder="月均FTE数"
                                    style={{width:"80px",marginLeft:'10px'}}
                                    formatter={value => value !== value ? '' : value}
                                    //disabled= {!cnaFteEdit}//{ !cnaFteEdit ? "disabled" : "" }
                                    />
                                )}
                                {
                                    (<Button onClick={this.add}>添加\更新</Button>)
                                }
                            </FormItem>
                            <div className="fte-scroll">
                            {formItems}
                            </div>
                        </div>
                        <div className="field-max">
                            <FormItem label="人员要求" style={{marginTop:'10px'}}>
                                {
                                    getFieldDecorator('comment', {
                                    })(<TextArea disabled={this.state.mode=='change'? 'disabled':''} 
                                    placeholder="人员要求" rows={3}/>)
                                }
                            </FormItem>
                        </div>
                    </Form>
                </div>
            )
        } else {
            returnStr = (
                <div className="create-form create-require">
                    <Form>
                        <div className="field-max">

                            {((this.state.mode == "edit" || this.state.mode == "change") && (sessionStorage.curRole == "BD" || sessionStorage.curRole == "PM")) && !this.props.copy ?
                            <div className = "ant-row ant-form-item" style={{marginBottom: '0px'}}> 
                                <div className="ant-form-item-label" style={{width: '120px'}}>
                                <label id="city" className="" title="中心名称(中心编号)">中心名称(中心编号)</label>
                                </div> 
                                <div className = "ant-form-item-control-wrapper" > 
                                    <div className="ant-form-item-control ">
                                            <span>{investigationSiteName}({investigationSiteCode})</span>
                                    </div> 
                                </div>
                            </div>

                            :
                            <FormItem label="中心名称(中心编号)" className="inv-siteId" style={{marginBottom: '0px'}}>
                                {
                                    getFieldDecorator('invSiteId', {
                                        rules: [
                                            { required: true, message: '中心不能为空' },
                                        ],
                                    })(
                                        <InvSiteSearchInput labelInValue
                                                            placeholder="请在此输入中心名称\中心编号"
                                                            handSelectInvesgationSite = {this.handSelectInvesgationSite}
                                                            inputChange = {this.inputChange}
                                                            initValue = {defaultSite}
                                        />)
                                }
                            </FormItem>

                            }
                        </div>
                        <div className="field-max">
                            <div className = "ant-row ant-form-item" style={{marginBottom: '0px'}}> 
                                <div className="ant-form-item-label">
                                <label id="city" className="" title="城市">城市</label>
                                </div> 
                                <div className = "ant-form-item-control-wrapper" > 
                                    <div className="ant-form-item-control ">
                                            <span>{city}</span>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div className="field-max">
                            <FormItem label="FTE需求" style={{marginBottom: '5px'}}>
                                {getFieldDecorator('startMonth', startMonth)(
                                    this.state.mode == "change" ?
                                    <MonthPicker style={{width:'100px',marginRight:'5px'}} placeholder='起始时间' disabledDate={this.disabledDate} />
                                    :
                                    <MonthPicker style={{width:'100px',marginRight:'5px'}} placeholder='起始时间' disabledDate={this.disabledDate} />
                                    
                                )}
                                 -
                                {getFieldDecorator('endMonth', endMonth)(
                                    this.state.mode == "change" ?
                                    <MonthPicker style={{width:'100px',marginLeft:'5px'}} placeholder='截止时间'  disabledDate={this.disabledDate} />
                                    :
                                    <MonthPicker style={{width:'100px',marginLeft:'5px'}} placeholder='截止时间' disabledDate={this.disabledDate} />
                                )}
                                {getFieldDecorator('setFteNum', setFteNum)(
                                    <InputNumber className="FTENum"  
                                    placeholder="月均FTE数" 
                                    style={{width:"80px",marginLeft:'10px'}}
                                    formatter={value => value !== value ? '' : value}
                                    //disabled= {!cnaFteEdit}//{ !cnaFteEdit ? "disabled" : "" }
                                    />
                                )}
                                {
                                    (<Button onClick={this.add}>添加\更新</Button>)
                                }
                            </FormItem>
                            <div className="fte-scroll">
                            {formItems}
                            </div>
                        </div>
                        <div className="field-max">
                            {
                                this.state.mode !== "change" ?
                                <FormItem label="人员要求" style={{marginTop:'10px'}}>
                                    {
                                        getFieldDecorator('comment', {
                                        })(<TextArea placeholder="人员要求" rows={3}/>)
                                    }
                                </FormItem>
                                :
                                null
                            }
                        </div>
                    </Form>
                </div>
            )
        }


        return (
            returnStr
        );
    }
}

class CreateModal extends Component {

    state = {
        visible: false,
        confirmLoading: false,
        copy: false,
        requirement: {},
        site : {},
        isEdit: false,
        invSiteId : '',
        fteList : [],
        requirementId : '',
        city : '',
        display : 'none',
        mode : 'edit',
        noFte: true
    };

    show = (id, m) => {
        this.setState({
            visible: true,
            isEdit: false,
            requirement: {},
            requirementId: '',
            site : {},
            invSiteId : '',
            fteList : [],
            city : '',
        });
        if (id) {
            this.setState({
                isEdit: true,
                requirementId : id,
                mode : m == "change" ? "change" : "edit",
                copy : m == "copy" ? true : false,
            },function(){
                this.loadData(id);
            });
        }
        else{
             this.setState({
                mode : 'add',
             }) 
        }
    };


    hide = () => {
        this.setState({
            visible: false,
        });
    };

    /**
     * 获取项目详细信息
     * @param id
     */
    loadData = id => {
        const requirementType = this.props.settled ? "OriginalRequest" : "InvestigationRequest";
        let isCopying = false;
        if(this.state.copy){
            isCopying = true;
        }
        const options = {
            method: 'get',
            url: `${API_URL.member.getRequireMents}?requirementId=${id}&isCopying=${isCopying}`,
            data:{
                requirementType
            },
            doneResult: ( data => {
                    this.setState({
                        requirement: data.data.requirement,
                        site : data.data.requirement.site,
                        city : data.data.requirement.site.city,
                        fteList : data.data.requirement.fteList,
                        noFte: data.data.requirement.noFte !== undefined ? data.data.requirement.noFte : true
                        //mode : data.data.requirement.state == 'ACTIVE' ? 'change' : 'edit',
                    });
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    }

    // 提交表单
    handleSubmit = () => {
        this.refs.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            //this.setState({ confirmLoading: true });
            const fieldsValue = this.refs.form.getFieldsValue();
            const FTEDateAry = fieldsValue.FTEDate;
            const FTE = fieldsValue.FTE;
            const fteArr = fieldsValue.fteArr;
            //const fteMap = fieldsValue.fteMap;
            let needData = 0;
            let needNumber = 0;
            fteArr.map((value, index) => {
                if(value[0] === null || value[0] === undefined){
                    needData++;
                }
                if(value[1] === null || value[1] === undefined){
                    
                    needNumber++
                }
            })
            if(needData > 0){
                Modal.error({title:"尚有日期未选择"});
                return;
            }
            if(needNumber > 0){
                Modal.error({title:"尚有FTE数量未填写"});
                return;
            }
            let ftesStr = '';
            fteArr.map((value, index) => {
                const year = value[0].format("YYYY");
                const month = value[0].format("MM");
                const fteNum = value[1];
                ftesStr += "&ftes["+index+"].year="+year;
                ftesStr += "&ftes["+index+"].month="+month;
                ftesStr += "&ftes["+index+"].fte="+fteNum;
            });

            let invSiteId = fieldsValue.invSiteId;
            if(invSiteId == null || invSiteId == undefined){
                invSiteId = sessionStorage.siteId;
            }
            let comment = {};
            let param = "invSiteId="+invSiteId;
            if(fieldsValue.comment != null && fieldsValue.comment != undefined){
                comment.comment = fieldsValue.comment;
            }
            if(ftesStr != ""){
                param += ftesStr;
            }
            const requirementType = sessionStorage.curRole == "BD" ? "OriginalRequest" : "InvestigationRequest";
            if (this.state.isEdit) {
                const {requirementId} = this.state;
                

                
                let options ={};
                if(this.state.copy){
                    //复制新建
                    param += "&quoteId="+requirementId;
                    options = {
                        method: 'POST',
                        url: `${API_URL.member.addRequireMents}?${param}`,
                        data:{
                            requirementType,
                            ...comment
                        },
                        doneResult: ( data => {
                                this.setState({ confirmLoading: false });
                                message.success('修改成功');
                                this.props.reload();
                                this.hide();
                            }
                        ),
                    };
                }else{
                    param += "&requirementId="+requirementId;
                    if(this.state.mode == 'edit'){
                        // 修改
                         options = {
                            method: 'POST',
                            url: `${API_URL.member.modifyRequireMents}?${param}`,
                            data:{
                                requirementType,
                                ...comment
                            },
                            doneResult: ( data => {
                                    this.setState({ confirmLoading: false });
                                    message.success('修改成功');
                                    this.props.reload();
                                    this.hide();
                                }
                            ),
                        };
                    } 
                    else{
                        //变更
                        options = {
                            method: 'POST',
                            url: `${API_URL.member.changeRequirement}?${param}`,
                            data:{
                                requirementType,
                                ...comment
                            },
                            doneResult: ( data => {
                                    this.setState({ confirmLoading: false });
                                    message.success('变更成功');
                                    this.props.reload();
                                    this.hide();
                                }
                            ),
                        };
                    }
                }
                AjaxRequest.sendRequest(options);
            } else {
                // 新建
                
                const options = {
                    method: 'POST',
                    url: `${API_URL.member.addRequireMents}?${param}`,
                    data:{
                        requirementType,
                        ...comment
                    },
                    doneResult: ( data => {
                          
                            this.setState({ visible : false,confirmLoading: false });
                            message.success('新建成功');
                            this.props.reload();
                            this.hide();
                        }
                    ),
                };
                AjaxRequest.sendRequest(options);
            }
        });
    }

    render() {
        const { confirmLoading, visible, requirement, site, city, fteList, isEdit, mode, copy, noFte } = this.state;
        const mapPropsToFields = () => ({
            invSiteId: { value: site.investigationSiteId },
            comment: { value: requirement.requirementComment},
            invSiteName: { value: site.investigationSiteName }
        });
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        const newTitle = sessionStorage.curRole == "PM" ? "新建计划需求" : "新建原始需求";
        let title = "";
        if(mode == "edit"){
            if(copy){
                title = '复制新建'
            }else{
                title = '修改需求'
            }
        }else if(mode == "change"){
            title = '需求变更'
        }
        return (
            <Modal
                title={isEdit ? title : newTitle }                
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal requirement-create"
                wrapClassName="vertical-center-modal create-require-modal"
                width="650px"
                confirmLoading={confirmLoading}
            >
                <CreateForm ref="form" mode={this.state.mode} noFte={noFte} city={city} fteList={fteList} copy={copy}/>
            </Modal>

        );
    }
}

export default CreateModal;
