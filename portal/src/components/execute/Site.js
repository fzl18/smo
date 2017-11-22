/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import { Table,Breadcrumb, Form, Row, Col, Input,Radio, Checkbox ,Select, InputNumber,DatePicker, Button, Icon, Modal } from 'antd';
import ExecuteSider from './ExecuteSider';
import API_URL from '../../common/url';
import moment from 'moment';
import AjaxRequest from '../../common/AjaxRequest';
import _ from 'lodash';
import ExportUtil from '../../common/ExportUtil';

const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const { TextArea } = Input;
let siteStartTimeDefineId = null;

class InputForm extends React.Component{
    
    state = {
         data : this.props.data,
         editMode : this.props.editMode,
    };

    getInputValue = (e) =>{
        let xx = [];
    }

    getSiteFields(){
        const children = [];
    
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 4 },
            };

        let investigationSite = this.state.data.investigationSite;

        if(investigationSite){
            let inputKey1 = {
                id : 'siteCode',
                placeholder : '中心编号',
                disabled : true,
                value : (investigationSite.investigationSiteCode) ? 
                    investigationSite.investigationSiteCode : '',
            };
            children.push(
                <Col span={8} key='siteCode'>
                    <FormItem label='中心编号'>
                        <Input  {...inputKey1} />
                    </FormItem>
                </Col>
            );

            let inputKey2 = {
                id : 'siteName',            
                placeholder : '中心名称',
                disabled : true,
                value : (investigationSite.investigationSiteName) ? 
                    investigationSite.investigationSiteName : '',
            };
            children.push(
                <Col span={8} key='siteName'>
                    <FormItem  label='中心名称'>
                    
                        <Input {...inputKey2} />
                        
                    </FormItem>
                </Col>
            )
        }       

        return children;
    }

    getSiteInfoFieldForView = (executeDefine) =>{
        const { getFieldDecorator, getFieldValue } = this.props.form;       
        
        return (
            <Col span={8} key={('col_' + executeDefine.investigationExecuteDefineId)}>        
                <FormItem  label={executeDefine.moduleDefineName}>                 
                    {getFieldDecorator(`${executeDefine.investigationExecuteDefineId}`, {
                            initialValue: (executeDefine.investigationExecuteDetail) ? 
                                        executeDefine.investigationExecuteDetail.value : '',                            
                        })( 
                            <Input disabled={true} />
                            )
                    }
                </FormItem>
            </Col>
        );
    }

    getSiteInfoFieldForEdit = (executeDefine) => {
        const { getFieldDecorator, getFieldValue } = this.props.form;    
        let id = 'detail_' +  executeDefine.investigationExecuteDefineId;
        
        if(executeDefine.moduleDefineName == '启动时间'){
                siteStartTimeDefineId = executeDefine.investigationExecuteDefineId;
        }
       
        let colId = 'col_' + executeDefine.investigationExecuteDefineId;
        switch(executeDefine.criteriaDataType){
            case 'DATE':                
                if(executeDefine.projectDefineWebType == 'DATETIMEPICKER'){
                    let formatValue = executeDefine.formatValue;
                    let value =  (executeDefine.investigationExecuteDetail) ? 
                                                        executeDefine.investigationExecuteDetail.value : '';
            
                    if(!value) value = '';
                    if(!formatValue) formatValue = 'YYYY-MM-DD';
                   
                    let defaultValue;
                    if(value && value != ''){
                        defaultValue = moment(value, formatValue);
                    }

                    let option = {
                        initialValue : defaultValue,
                    }
                   
                    switch(formatValue){
                        case 'YYYY-MM':
                            return (
                                <Col span={8} key={colId}>
                                    <FormItem  label={executeDefine.moduleDefineName}>  
                                        {getFieldDecorator(`${executeDefine.investigationExecuteDefineId}`,option)( 
                                            <MonthPicker format={formatValue}/>    
                                            )
                                        }                                                                               
                                    </FormItem>                                   
                                </Col>                                
                            );                        
                        case 'YYYY-MM-DD HH:mm':
                        case 'YYYY-MM-DD':
                            return (
                                <Col span={8} key={colId}>
                                    <FormItem  label={executeDefine.moduleDefineName}>  
                                        {getFieldDecorator(`${executeDefine.investigationExecuteDefineId}`, option)( 
                                            <DatePicker format={formatValue}/>
                                        )}                                                                               
                                    </FormItem>
                                </Col>                                
                            );
                        default:
                        return '';
                    }
                }
                else{
                    return '';
                }
            case 'NUMBER':
                return (
                    <Col span={8} key={colId}>
                        <FormItem  label={executeDefine.moduleDefineName}>     
                            {getFieldDecorator(`${executeDefine.investigationExecuteDefineId}`, {
                                initialValue: (executeDefine.investigationExecuteDetail) ? 
                                            executeDefine.investigationExecuteDetail.value : null,                            
                                })( 
                                    <InputNumber />
                                )
                            }                                                                   
                        </FormItem>
                    </Col>     
                );
            default:
                //其它都当TEXT处理
                let webType = executeDefine.projectDefineWebType;
                switch(webType){
                    case 'RADIO':
                        return (
                            <Col span={8} key={colId}>                            
                                <FormItem  label={executeDefine.moduleDefineName}>                                    
                                    {getFieldDecorator(`${executeDefine.investigationExecuteDefineId}`, {
                                        initialValue: (executeDefine.investigationExecuteDetail) ? 
                                                    executeDefine.investigationExecuteDetail.value : '',                            
                                        })( 
                                            <RadioGroup >
                                                {
                                                    executeDefine.options &&
                                                    executeDefine.options.map((op, i) =>{
                                                        return(
                                                            <Radio value={op} key={
                                                                'r_' + i + '_' 
                                                                + executeDefine.investigationExecuteDefineId  }>{op}</Radio>
                                                            );
                                                    })
                                                }                                          
                                            </RadioGroup>
                                        )
                                    }                                               
                                </FormItem>
                            </Col>    
                    );         
                    case 'CHECKBOX':
                    let defaultValue = [];
                    
                    if(executeDefine.investigationExecuteDetail && executeDefine.investigationExecuteDetail.value){
                        defaultValue = executeDefine.investigationExecuteDetail.value.split('//');
                    }
                    return (
                        <Col span={8} key={colId}>                            
                            <FormItem  label={executeDefine.moduleDefineName}>  
                                {getFieldDecorator(`${executeDefine.investigationExecuteDefineId}`, {                            
                                    })( 
                                        <CheckboxGroup key={executeDefine.investigationExecuteDefineId} options={executeDefine.options} defaultValue={defaultValue}/> 
                                    )
                                }                                   
                                                                            
                            </FormItem>
                        </Col>    
                    );
                    case 'SELECT':
                    return (
                        <Col span={8} key={colId}>                            
                            <FormItem  label={executeDefine.moduleDefineName}>  
                                    {getFieldDecorator(`${executeDefine.investigationExecuteDefineId}`, {
                                    initialValue: (executeDefine.investigationExecuteDetail) ? 
                                                executeDefine.investigationExecuteDetail.value : '',                            
                                    })( 
                                        <Select key={executeDefine.investigationExecuteDefineId}
                                    showSearch
                                    style={{ width: 200 }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                > 
                                    <Option value='' key={'s_0_' + executeDefine.investigationExecuteDefineId} />
                                    {    
                                        executeDefine.options.map((op, i) =>{
                                            return(
                                                <Option value={op}
                                                        key={'s_' + i + '_' 
                                                            + executeDefine.investigationExecuteDefineId  }>{op}</Option>
                                                );
                                        })
                                    }      
                                </Select>
                                    )
                                }      
                                                        
                            </FormItem>
                        </Col>    
                    );         
                    case 'TEXTAREA':
                    return (
                        <Col span={8} key={colId}>                            
                            <FormItem  label={executeDefine.moduleDefineName}>                                    
                                {getFieldDecorator(`${executeDefine.investigationExecuteDefineId}`, {
                                    initialValue: (executeDefine.investigationExecuteDetail) ? 
                                                executeDefine.investigationExecuteDetail.value : '',                            
                                    })( 
                                        <TextArea rows={4} />
                                    )
                                }                                               
                            </FormItem>
                        </Col>                      
                    );
                    default:
                    //INPUT 和 其它
                    return (
                        <Col span={8} key={colId}>                            
                            <FormItem  label={executeDefine.moduleDefineName}>                                    
                                {getFieldDecorator(`${executeDefine.investigationExecuteDefineId}`, {
                                    initialValue: (executeDefine.investigationExecuteDetail) ? 
                                                executeDefine.investigationExecuteDetail.value : '',                            
                                    })( 
                                        <Input />
                                    )
                                }                                               
                            </FormItem>
                        </Col>                      
                    );
                }
                break;
        }
        return '';
    }   

    getSiteInfoFields (){
         const children = [];

         if(this.state.data.investigationExecuteDefineList 
            && this.state.data.investigationExecuteDefineList.length > 0){
            this.state.data.investigationExecuteDefineList.map((executeDefine, i) => {
                children.push(
                    this.state.editMode ? this.getSiteInfoFieldForEdit(executeDefine) :     
                        this.getSiteInfoFieldForView(executeDefine)
                );                
            });
        }
        return children;
    }

    

    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
       
        
        return (
            <Form >
                <Row gutter={40}>{this.getSiteFields()}</Row>  
                <Row gutter={40}>{this.getSiteInfoFields()}</Row>                           
            </Form>
        );
    }
}



class Site extends React.Component {
    
    state = {
        loading: false,
        data : null,
        editMode : false,
        editDisplay : '',
        list : false,
        addable: 1,
    };

    

    loadData = (propTypeName,sort,direction) => {
        const typeName = propTypeName ? propTypeName : this.props.match.params.typeName;
        //let {sort,direction} = this.state;
        if(sort == undefined || sort == null) sort = 'investigationSiteCode';
        if(direction == undefined || direction == null) direction = 'ASC'
         const options = {
            url: `${API_URL.execute.querySiteData}`,
            data: {
                typeName,
                sort,
                direction,
            },
            dataType: 'json',
            doneResult: ( data => {
                if (!data.error) {                
                    this.setState({
                        loading: false,
                        data: data.data.execute ? data.data.execute :
                                 (data.data.executeList ? data.data.executeList : null),
                        editMode : false,
                        editDisplay : '',
                        list: data.data.execute ? false :
                                 (data.data.executeList ? true : false),
                        defines : data.data.defines ? data.data.defines : null,
                        addable: data.addable,
                    });
                } else {
                    Modal.error({ title: data.error });
                }
            }
            ),
        };
        AjaxRequest.sendRequest(options);
    }

    componentDidMount() {
        this.loadData();
    } 

    componentWillReceiveProps(nextProps) {
        const {typeName} = nextProps.match.params;
        this.setState({
            typeName: typeName,
        });
        this.loadData(typeName);
    }

    edit = () =>{
        this.setState({
             editMode : true,
             editDisplay : 'none',
        })  
    }

    cancel = () =>{
        this.setState({
            editMode : false,
            editDisplay : '',
        })
    }

    export = () => {
        const { sort,direction, pagination } = this.state;
        let url = `${API_URL.execute.exportSite}`;
        const searchArray = {typeName:this.props.match.params.typeName,sort,direction};
        ExportUtil.export(searchArray, pagination, url);
    }

    save = () =>{
        //let defineValueList = [];
        let params = 'typeName=' + this.props.match.params.typeName;
        let siteStartTime;
        this.state.data.investigationExecuteDefineList.map((executeDefine, i) => {
            let value = this.refs.inputArea.getFieldValue(executeDefine.investigationExecuteDefineId);
            
            if(value == undefined || value == null) value = '';
            else{
                if(executeDefine.criteriaDataType == 'DATE' && executeDefine.projectDefineWebType == 'DATETIMEPICKER'){
                    value  = value.format( executeDefine.formatValue);
                }
            }
            //executeDefine["investigationExecuteDetail"] = {value : value};
            /*defineValueList.push(
                {
                    defineId : executeDefine.investigationExecuteDefineId,
                    value : value,
                }
            )*/
            
            params += '&indicators[' + executeDefine.investigationExecuteDefineId 
                    + '].moduleDefineId=' + executeDefine.investigationExecuteDefineId 
                    + '&indicators[' + executeDefine.investigationExecuteDefineId 
                    + '].value=' + value;

            if(siteStartTimeDefineId != null &&
                siteStartTimeDefineId == executeDefine.investigationExecuteDefineId ){
                    params += '&siteStartTime=' + value;
                }
        });
       
        let url = API_URL.execute.saveSiteData + '?' + params;
        const options = {
            url: url,
            data:  params,
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    loading: false,
                    data: data.data.execute ? data.data.execute :
                                (data.data.executeList ? data.data.executeList : null),
                    editMode : false,
                    editDisplay : '',
                    list: data.data.execute ? false :
                                (data.data.executeList ? true : false),
                    defines : data.data.defines ? data.data.defines : null,
                });
                Modal.success({title:'保存成功'});
            }),
        };
        AjaxRequest.sendRequest(options);

    }

    getColumns(){
        const columns = [];

        if(this.state.defines.length > 7){
            columns.push({
                title: '中心编号',
                dataIndex: 'investigationSiteCode',
                key: 'investigationSiteCode',
                fixed: 'left',
                width:100,
                sorter: true,
            });

            columns.push({
                title: '中心名称',
                dataIndex: 'investigationSiteName',
                key: 'investigationSiteName',
                fixed: 'left',
                sorter: true,
                width:200,
            });

        }
        else{
            columns.push({
                title: '中心编号',
                dataIndex: 'investigationSiteCode',
                key: 'investigationSiteCode',
                width:100,
                sorter: true,
            });

            columns.push({
                title: '中心名称',
                dataIndex: 'investigationSiteName',
                key: 'investigationSiteName',
                sorter: true,
                width:200,
            });

        }
       
        this.state.defines.map( (define,i) =>{
            
            columns.push({
            title: define.moduleDefineName,
            dataIndex: define.investigationExecuteDefineId,
            key:  define.investigationExecuteDefineId,
            sorter: true,
        });
        } );

        return columns;
    }

    getDataSource(){
        const siteList = [];     

        this.state.data.map( (exec, i) => {
            let siteTmp = new Object();
            const site = exec.investigationSite;
            siteTmp["id"] = exec.investigationSiteId;
            siteTmp["investigationSiteCode"] = site.investigationSiteCode;           
            siteTmp["investigationSiteName"] = site.investigationSiteName;
            
            if(exec.defineValueMap){
                for(var key in exec.defineValueMap)
                siteTmp[ key] =  exec.defineValueMap[`${key}`];                
            }

            siteList.push(siteTmp);
        });
        return siteList;
    }

    handleTableChange = (pagination, filters, sorter) => {
        let direction,
            sort = sorter.field;        
       

        if (sorter.order === 'descend') {
            direction = 'DESC';
        } else {
            direction = 'ASC';
        }
        const {typeName} = this.state;
        this.setState({sort,direction});
        this.loadData(typeName,sort,direction);
    }

  
    render() {
        const InputArea = Form.create()(InputForm);
        const title = this.props.match.params.typeName == 'Type_Site' ? '中心记录' : '中心启动记录';
        //editData = _.cloneDeep(this.state.data);
        let showScroll = false;
        let scrollWith = '100%';
        if(this.state.defines){
            if(this.state.defines.length > 7){
                showScroll = true;
                scrollWith = this.state.defines.length * 150;
            }
        }
        if(this.state.list){
            return (
                <div className="content">
                    <ExecuteSider selectKey={ this.props.match.params.typeName }/>
                    <div className="main">
                        <h1>{title} <Button type="primary" style={{float:"right"}} onClick={this.export}>导出</Button></h1>
                        {
                            showScroll ? <Table
                                columns={this.getColumns()}
                                dataSource={this.getDataSource()}
                                rowKey={record => record.id}
                                // loading={loading}
                                scroll={{x:  scrollWith }}
                                onChange={this.handleTableChange}
                                pagination={false}
                            />
                            :
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.getDataSource()}
                                rowKey={record => record.id}
                                // loading={loading}
                                onChange={this.handleTableChange}
                                pagination={false}
                            />        
                        }
                                      
                    </div>
                </div>
            );
        }
        else{
            const { addable } = this.state;
             return(
                <div className="content">
                    <ExecuteSider selectKey={ this.props.match.params.typeName }/>
                    <div className="main">
                        <h1>
                            {title}
                            <div className="filter-bar tar" style={{float:"right"}}>
                                {
                                    'PM' == sessionStorage.roleCode ? <Button type="primary"  onClick={this.edit}>修改</Button> :
                                    (!(addable == null || addable == undefined) && addable == 1 ? 
                                        <Button type="primary"  onClick={this.edit}>修改</Button>
                                        :  (
                                            !(addable == null || addable == undefined) && addable == 0 ? 
                                                    <Button type="primary"  disabled={false} onClick={this.edit}>修改</Button>
                                                    : <div></div>
                                            )
                                    )
                                }           
                            <Button type="primary" style={{display:this.state.editDisplay == 'none'? '' : 'none'}}  onClick={this.cancel}>取消</Button>
                            <Button type="primary" loading={this.state.loading} style={{display:this.state.editDisplay == 'none'? '' : 'none'}}  onClick={this.save}>保存</Button>
                            <Button type="primary" onClick={this.export}>导出</Button>
                        </div>
                        </h1>
                        
                        <div>
                            <InputArea ref='inputArea' data={this.state.data? this.state.data : {} } editMode={ this.state.editMode}/>
                        </div>
                    </div>
                </div>
            );
        }
        
    }

    
}


export default Site;
