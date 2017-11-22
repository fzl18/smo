/**
 * Created by Richie on 2017/7/18.
 */
import React from 'react';
// import $ from 'jquery';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import { message, Table, Popconfirm, Modal, Button,Icon, DatePicker, Row, Col,Input,Tooltip,Select ,InputNumber} from 'antd';
import API_URL from '../../common/url';
import SideNav from './SideNav';
import PreviewModal from './PreviewModal';
import ReportModal from './ReportModal';
import SearchSelect from '../common/SearchSelect';
import './css/index.less';

const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option

class Write extends React.Component {
    constructor(props) {
        super(props);
    this.state = {
        count:0,
        loading: false,
        dataSource: [],
        isAddBtn:true,
        isTimer:false,
        // isEdit:false,
        date:moment().format("YYYY-MM-DD"),
        showInvestigationSiteNameSelect:true,
        showRoleCodeSelect:true,
        showEnterpriseWorkTypeNameSelect:true,
        showduration:true,
        investigationNameoptions:[],
        investigationNameoptions1:[],
        investigationNameoptions2:[],
        investigationSiteNameoptions:[],
        roleCodeoptions:[],
        enterpriseWorkTypeNameoptions:[],
        investigationName:'',
        investigationSiteName:'',
        // roleCode:'',
        // enterpriseWorkTypeName:'',
        enterpriseWorkCategories:[],
        investigationId:'',
        investigationSiteId:'',
        roleId:'',
        roleName:'',
        workTypeId:'',
        duration:'',
        isInves:false,
        workCategoryId:'',
        manHourId :this.props.match ? this.props.match.params.manHourId : '',
        time : this.props.match ? this.props.match.params.date : '',
        };        
    }


  loadData = (date='') => {     
      this.setState({
          loading: true,
          isAddBtn:true,
      });
      const params={}
      const options = {
        method: 'POST',
        url: `${API_URL.manhour.list}`,
        data: {
            date:this.state.time ? this.state.time.split('.').join('-') : date,
            ...params,
            
        },
        dateType: 'json',
        doneResult:(data => {
          if (JSON.stringify(data) =='{}'){
            message.warn('当日无数据！');
            this.setState({
                  loading: false,
                  dataSource:[],
              });
            return
          }
          if (!data.error) {
            // 将数据构造好后，存入state,让table取
            const dataList = data.data.manHours
            const date = data.data.date
            const resList = [];
            let totalTime = 0;
            dataList.map((dataItem, i) => {
              resList.push({
                  key:i,
                  id: dataItem.manHourId,
                  investigationId: dataItem.investigationId,
                  investigationSiteId: dataItem.investigationSiteId,
                  index:i+1,
                  investigationName: dataItem.investigationName ? dataItem.investigationName : dataItem.enterpriseWorkCategoryName,
                  investigationCode: dataItem.investigationCode ? `(${dataItem.investigationCode})` : `(${dataItem.enterpriseWorkCategoryCode})`,
                  investigationSiteName: dataItem.investigationSiteName,
                  investigationSiteCode: dataItem.investigationSiteCode ? `(${dataItem.investigationSiteCode})`:null,
                  manHourDate:dataItem.manHourDate,
                  enterpriseWorkCategoryName: dataItem.enterpriseWorkCategoryName,
                  enterpriseWorkTypeName: dataItem.enterpriseWorkTypeName+"("+dataItem.enterpriseWorkTypeCode+")",
                  duration: dataItem.duration ? dataItem.duration : 0,
                  roleCode: dataItem.roleCode,
                  roleId: dataItem.roleId,
                  isCounting:dataItem.isCounting,
                  manHourDetailId:dataItem.manHourDetailId,
                  date:date,
                  isEdit:false,
                  manHourId:dataItem.manHourId,
                  workCategoryId:dataItem.enterpriseWorkCategoryId
                  
              });
              totalTime +=  dataItem.duration*1
            });
            resList.push({
                key:100,
                investigationName: "总计",
                investigationSiteName: '',
                enterpriseWorkCategoryName: '',
                enterpriseWorkTypeName: '',
                totalTime: totalTime.toFixed(4),
            })
            this.setState({
                loading: false,
                dataSource:resList ,
                date:date ? date :moment(),
            });
          } else {
              this.setState({
                  loading: false,
              });
              Modal.error({ title: data.error });
          }
      })
      }
      $.sendRequest(options)      
    }
    

    nextDay = () => {
      const date = this.state.date ? this.state.date : moment()
      const curdate = moment(date).add(1,'days').format(dateFormat)      
      
      this.setState({
        time:'',
        date:curdate
      },()=>{
        this.loadData(curdate)
      })
    }
    prevDay = () =>{
      const date = this.state.date ? this.state.date : moment()
      const curdate = moment(date).subtract(1,'days').format(dateFormat)
      this.setState({
        time:'',
        date:curdate
      },()=>{
        this.loadData(curdate)
      })
    }


    timeToggle = (record) =>{
      const {isInves,workCategoryId,workTypeId} =this.state
      if(record.key ==='new'){
        const {investigationId,investigationSiteId,roleId,
              workTypeId,date}=this.state
        const options = {
          method: 'POST',
          url: `${API_URL.manhour.timeaddmanhour}`,
          data: {
            manHourId:record.id,
            manHourDate:moment(date).format(dateFormat),
            investigationId: isInves ? null: investigationId,
            investigationSiteId : isInves ? null :investigationSiteId,
            workCategoryId:isInves ? workCategoryId:null ,
            enterpriseWorkCategoryId: isInves ? workCategoryId : null,
            roleId,
            workTypeId,
            manHourDetailId:record.manHourDetailId,
            isStart:true,
          },
          dataType: 'json',
          doneResult: (data => {
              if (!data.error) {
                message.success(data.data.success)
                this.reload()
              } else {
                Modal.error({ title: data.error });
              }
          })
        }       

        workTypeId !='' ? $.sendRequest(options) : message.warn('有未选项！')   
      }else{
      const params={}
      const options ={
        method: 'POST',
        url: `${API_URL.manhour.timetoggle}`,
        data: {
          manHourId:record.id,
          isStart: record.isCounting ==='1' ? false : true,
          manHourDetailId:record.manHourDetailId,
          ...params
        },
        dataType: 'json',
        doneResult: (data => {
            if (!data.error) {
              message.success(data.data.success)
              this.reload()
            } else {
                this.setState({
                    loading: false,                    
                });
                Modal.error({ title: data.error });
            }
        })
      }
      $.sendRequest(options)
     }
    }

    edit = (record, index) => {
      const { dataSource } = this.state;
      dataSource[index].isEdit = true;
      this.setState({ dataSource });
    }

    save = (record,index) => {
      const {investigationId,investigationSiteId,roleId,workTypeId,duration,date,isInves,workCategoryId} = this.state 
      if(record.key === 'new'){
        const options = {
          method: 'POST',
          url: `${API_URL.manhour.editaddmanhour}`,
          data: {
            manHourId:record.id,
            manHourDate:moment(date).format(dateFormat),
            investigationId: isInves ? null:investigationId ,
            investigationSiteId: isInves ? null : investigationSiteId,
            enterpriseWorkCategoryId: isInves ? workCategoryId : null,
            roleId,
            workTypeId,
            duration,
          },
          dataType: 'json',
          doneResult: (data => {
              if (!data.error) {
                message.success(data.data.success)
                this.reload()
              } else {
                Modal.error({ title: data.error });
              }
          })
        }
        workTypeId !='' ? $.sendRequest(options) : message.warn('有未选项！')
      }else{
      const { dataSource } = this.state;
      const durationTime = dataSource[index].duration;
      this.setState(
        { dataSource },        
      );
      const params={}
      // 修改已有工时保存
      const options ={
        method: 'get',
        url: `${API_URL.manhour.editmanhour}`,
        data: {
          manHourId:record.id,
          duration:durationTime,
          // manHourDetailId:record.manHourDetailId,
          ...params
        },
        dataType: 'json',
        doneResult: (data => {
            if (!data.error) {
              message.success(data.data.success)
              this.reload()
            } else {
                this.setState({
                    loading: false,                    
                });
                Modal.error({ title: data.error });
            }
        })
      }
        $.sendRequest(options)
      }
    }
    del = (record) => {
      if(record.key ==='new'){
        const dataSource = [...this.state.dataSource];
        dataSource.splice(0, 1);
        this.setState({ dataSource, isAddBtn:true });
        
        // this.reload()
        return
      }

      const params={}
      const options ={
        method: 'get',
        url: `${API_URL.manhour.delmanhour}`,
        data: {
          manHourId:record.id,
          ...params
        },
        dataType: 'json',
        doneResult: (data => {
            if (!data.error) {
              message.success(data.data.success)
              this.reload()
            } else {
                this.setState({
                    loading: false,                    
                });
                Modal.error({ title: data.error });
            }
        })
      }
      $.sendRequest(options)
    }

    reload = () => {
        this.loadData(this.state.date);
        this.setState({
          isAddBtn:true,
        })
    }
    durationChanged = (index,record,value) => {
      const { dataSource,duration } = this.state;
      if(record.key==='new'){
        this.setState({
          duration:value,
        })
        return
      }
      dataSource[index].duration = value;
      this.setState({ dataSource });
    }
    getColumns = () => [
         {
    //     title: '序号',
    //     dataIndex: 'index',
    //     key: 'index',
    // }, {
        title: '项目名称 / 项目编号',
        dataIndex: 'investigationName',
        key: 'investigationName',
        render:(text,record) => {
          if(record.key==='new'){
            return (<SearchSelect 
            style={{width:'100%'}}
            url = {API_URL.manhour.queryCategory}
            searchKey = 'keyword'
            sourceData={this.state.investigationNameoptions}
            parserData={this.parserDataInv}
            handleSelect = {this.investigationNameselectChanged}
            placeholder={this.state.investigationName}
            className='placeholder_black'
          />)
          }else{
            return(
              <div>
                {record.manHourId == this.state.manHourId ? 
                  <span style={{color:'red'}}>{record.investigationName} {record.investigationCode} </span>
                  :
                  <span>{record.investigationName} {record.investigationCode}</span>
                }                
              </div>            
            )
          }
        }
    }, {
        title: '中心名称 / 中心编号',
        dataIndex: 'investigationSiteName',
        key: 'investigationSiteName',
        render:(text,record) => {
          if(record.key==='new'){
            return(
              this.state.showInvestigationSiteNameSelect ? 
              // <Select style={{width:'100%'}} value={this.state.investigationSiteId}
              //   onChange = {this.investigationSiteNameselectChanged}
              // > 
              //   <Option value=''>请选择</Option>
              //   {this.state.investigationSiteNameoptions} 
              // </Select>
              <SearchSelect 
              style={{width:'100%'}}
              className='placeholder_black'
              url = {API_URL.site.queryUserSiteListByUserId}
              searchParam={{investigationId:this.state.investigationId,roleCode:'CRC'}}
              searchKey = 'keyword'
              sourceData={this.state.investigationSiteNameoptions}
              parserData={this.parserDataSite}
              handleSelect = {this.investigationSiteNameselectChanged}
              placeholder={this.state.investigationSiteName}
            />
               :null              
            )
          }else{
            return(
              <div>
                {record.investigationSiteName} {record.investigationSiteCode}
              </div>
            )
          }          
        }
    }, {
        title: '角色',
        dataIndex: 'roleCode',
        key: 'roleCode',
        render:(text,record) => {
          if(record.key==='new'){
            return(
              this.state.showRoleCodeSelect ? 
              // <Select style={{width:80}} value={this.state.roleId}
              //   onChange = {this.roleCodeselectChanged}
              //   placeholder={this.state.roleName}
              // >
              <Select style={{width:80}}
                className='placeholder_black'
                onChange = {this.roleCodeselectChanged}
                placeholder={this.state.roleName}
              >
                <Option value=''>请选择</Option>
                {this.state.roleCodeoptions}
              </Select>              
              :null             
            )
          }else{
            return(
                record.roleCode
            )
          }
        }
    }, {
        title: '工作类型',
        dataIndex: 'enterpriseWorkTypeName',
        key: 'enterpriseWorkTypeName',
        width:200,
        render:(text,record) => {
          if(record.key==='new'){
            return(
              this.state.showEnterpriseWorkTypeNameSelect ? 
              // <Select style={{minWidth:200}} value={this.state.workTypeId}
              //   onChange = {this.enterpriseWorkTypeNameselectChanged}
              // >
              //   <Option value=''>请选择</Option>
              //   {this.state.enterpriseWorkTypeNameoptions}
              // </Select>
              <SearchSelect 
              style={{width:'100%'}}
              className='placeholder_black'
              url = { this.state.isInves ? API_URL.manhour.queryWorkTypeNot : API_URL.manhour.queryWorkType  }
              searchParam={this.state.isInves ? {roleId:this.state.roleId,workCategoryId:this.state.workCategoryId,} :
                          {roleId:this.state.roleId,
                           investigationId:this.state.investigationId,                           
                           }}
              searchKey = 'keyword'
              sourceData={this.state.enterpriseWorkTypeNameoptions}
              parserData={this.parserDataWorkType}
              handleSelect = {this.enterpriseWorkTypeNameselectChanged}              
            />
              :null             
            )
          }else{
            return(
                record.enterpriseWorkTypeName
            )
          }
        }
    }, {
        title: '工时',
        dataIndex: 'duration',
        key: 'duration',
        width:100,
        render: (text, record, index) =>{          
          if(record.investigationName !=="总计"){
            if(record.isCounting === '2'){
              return (
                <div>
                  { record.isEdit ?
                    <span><InputNumber min={0} max={24} onChange={this.durationChanged.bind(this,index,record)} step={0.01} style={{width:70}}/>h</span>
                    :
                    <span>{record.duration}h</span>
                  }
                  <span><span className="ant-divider" /> 
                    <Icon type="exception" style={{color:'#FF9900'}} />
                  </span>
                </div>
              )
            }else{
              return (
              <div>
                { record.isEdit ?
                  <span><InputNumber max={24} min={0} onChange={this.durationChanged.bind(this,index,record)} step={0.01} defaultValue={record.duration} style={{width:70}} />h</span>
                  :
                  <span>{record.duration}h</span>
                }
                { record.isCounting === '1' ?
                <span><span className="ant-divider" /> 
                  <Icon type="clock-circle-o" style={{color:'#0f0'}} />
                </span>
                 : null
                }
              </div>
              )
            }
          }else{
            return(<span>{record.totalTime}h</span>)            
          }          
        },
    }, {
        title: '操作',
        key: 'action',
        width: 130,
        render: (text, record, index) =>{          
            if( record.investigationName !=="总计"){
              if(record.isCounting ==='1'){
                return(
                  <div>
                    <a href="javascript:void(0)" onClick={this.timeToggle.bind(this, record)} style={{color:'#f00'}}><Icon type="pause" /></a>
                    <span className="ant-divider" />
                    <a href="javascript:void(0)" disabled ><Icon type="edit" /></a>
                    <span className="ant-divider" />
                     <Popconfirm title={'确定要删除吗?'} onConfirm={this.del.bind(this, record)} okText="确定" cancelText="取消">
                     <a href="javascript:void(0)" disabled><Icon type="close" /></a>
                     </Popconfirm>
                     <span className="ant-divider" />
                     <a href="javascript:void(0)" onClick={this.showPreviewModal.bind(this,record)}><Icon type="solution" /></a>
                  </div>
                )
              }else{
                return (
                  <div>
                    { !record.isEdit ? 
                    <a href="javascript:void(0)" onClick={this.timeToggle.bind(this, record)} disabled={moment(this.state.date).isBefore(moment().format(dateFormat)) ? true : false} ><Icon type="hourglass" /></a>
                    :
                    <a href="javascript:void(0)" onClick={this.timeToggle.bind(this, record)} disabled ><Icon type="hourglass" /></a>
                    }
                    <span className="ant-divider" />
                    { record.isEdit ?
                    <a href="javascript:void(0)" onClick={this.save.bind(this, record, index)}><Icon type="check" /></a>
                    :
                    <a href="javascript:void(0)" onClick={this.edit.bind(this, record, index)}><Icon type="edit" /></a>
                    }
                    <span className="ant-divider" />
                    <Popconfirm title={'确定要删除吗?'} onConfirm={this.del.bind(this, record)} okText="确定" cancelText="取消">
                      <a href="javascript:void(0)"><Icon type="close" /></a>
                    </Popconfirm>
                    <span className="ant-divider" />
                    <a href="javascript:void(0)" onClick={this.showPreviewModal.bind(this,record)}><Icon type="solution" /></a>
                  </div>
                )
              }
            }
        },
    }]

//###########################################################################
    loadinvestigationNameoptions = () => {
      const params={}
      const options ={
        method: 'get',
        url: `${API_URL.manhour.queryCategory}`,
        data: {
          curEnterpriseId:1,
          ...params
        },
        dataType: 'json',
        doneResult: (data => {
          if (!data.error) {
            const loadinvestigationNameoptions1 = data.data.enterpriseWorkCategories.map(d => <Option key={d.index}>{d.enterpriseWorkCategoryName}</Option>);
            this.setState({
              investigationNameoptions1:loadinvestigationNameoptions1,
              enterpriseWorkCategories:data.data.enterpriseWorkCategories,
            })
          } else {               
            message.warn(data.error);
          }
        })
      }
      $.sendRequest(options)
    }
    loadinvestigationSiteNameoptions = (id) => {
      const params={ }
      const options ={
        method: 'get',
        // url: `${API_URL.manhour.queryInvestigation}`,
        url: `${API_URL.site.queryUserSiteListByUserId}`,
        data: {
          investigationId:id,
          roleCode:'CRC',
          ...params
        },
        dataType: 'json',
        doneResult: (data => {
          if(data.data.totalCount !=='0'){
            if (!data.error) {
              const loadinvestigationNameoptions = data.data.map(d => <Option key={d.investigationSiteId}>{d.investigationSiteName}</Option>);
              this.setState({
                investigationSiteNameoptions:loadinvestigationNameoptions,
              },()=>{
              })
            } else {               
              message.warn(data.error);
            }
          }else{
            this.setState({
              isNot
            })
          }
        })
      }
      $.sendRequest(options)
    }
    loadroleCodeoptions = (id,params={}) => {
      const {isInves,investigationId}=this.state
      const options = {
        method: 'POST',
        url:`${API_URL.manhour.queryRole}`,
        data: {
          investigationSiteId:id,
          investigationId:investigationId,
          ...params
        },
        dataType: 'json',
        doneResult: (data => {
          if (!data.error) {
            const loadroleCodeoptions = data.data.roles.map(d => <Option key={d.roleId}>{d.roleCode}</Option>);
            this.setState({
             roleCodeoptions:loadroleCodeoptions,
            })
          } else {               
            message.warn(data.error);
          }
        })
      }
      $.sendRequest(options)
    }
    loadenterpriseWorkTypeNameoptions = (id) => {
      const {workCategoryId,isInves} = this.state
      console.log(isInves)
      if (isInves){
        const params={}
        const options ={
          method: 'get',
          url: `${API_URL.manhour.queryWorkTypeNot}`,
          data: {
            roleId:id,
            workCategoryId,
            ...params
          },
          dataType: 'json',
          doneResult: (data => {
            if (!data.error) {
              const loadenterpriseWorkTypeNameoptions = data.data.enterpriseWorkTypes.map(d => <Option key={d.enterpriseWorkTypeId}>{d.enterpriseWorkTypeName+"("+d.enterpriseWorkTypeCode+")"}</Option>);
              this.setState({
                enterpriseWorkTypeNameoptions:loadenterpriseWorkTypeNameoptions,
              })
            } else {               
              message.warn(data.error);
            }
          })
        }
        $.sendRequest(options)
        return
      }
      //和研究相关的要获取研究Id,王震毅 2017.10.14
      //const params={} 
      const {investigationId} = this.state;       
      const options ={
        method: 'get',
        url: `${API_URL.manhour.queryWorkType}`,
        data: {
          roleId:id,
          investigationId: `${investigationId}`,
          isRelateInvestigation : true,
        },
        dataType: 'json',
        doneResult: (data => {
          if (!data.error) {
            const loadenterpriseWorkTypeNameoptions = data.data.enterpriseWorkTypes.map(d => <Option key={d.enterpriseWorkTypeId}>{d.enterpriseWorkTypeName+"["+d.enterpriseWorkTypeCode+"]"}</Option>);
            this.setState({
              enterpriseWorkTypeNameoptions:loadenterpriseWorkTypeNameoptions,
            })
          } else {               
            message.warn(data.error);
          }
        })
      }
      $.sendRequest(options)
    }

    changeInit =() => {
      this.setState({
        investigationId:'',
        investigationSiteId:'',
        roleId:'',
        workTypeId:'',
      })
    }

    initStep = (step) => {
      switch(step){
        case 1 :
        this.setState({
          investigationSiteId:'',
          investigationSiteName:'',
          roleId:'',
          roleName:'',
          workTypeId:'',
          showRoleCodeSelect:false,
          showEnterpriseWorkTypeNameSelect:false,
          showInvestigationSiteNameSelect:false
        })        
        break;
        case 2 :
        this.setState({
          roleId:'',
          roleName:'',
          workTypeId:'',
          showRoleCodeSelect:false,
          // showEnterpriseWorkTypeNameSelect:false,
        }) 
        break;
        case 3 :
        this.setState({
          workTypeId:'',
          // showEnterpriseWorkTypeNameSelect:false,
        }) 
        break;
      }
    }
//这里是选择事件  ####################################
    investigationNameselectChanged = (value) => {
      this.initStep(1)
      const {enterpriseWorkCategories} =this.state      
        console.log(value.key,value.label)
        let enterpriseWorkCategoryId, invesId
        enterpriseWorkCategories.map(d => {
          console.log(d.index == 0)
          if(d.index == value.key){
            d.isInves ? (invesId = d.invesId) : (enterpriseWorkCategoryId = d.enterpriseWorkCategoryId)
          }          
        })
        console.log('enterpriseWorkCategoryId:'+enterpriseWorkCategoryId, 'invesId:' + invesId,)
        if(invesId){  //与研究相关
          // this.loadinvestigationSiteNameoptions(invesId)
          this.setState({
            showInvestigationSiteNameSelect:true,
            investigationId:invesId,
            isInves:false,
            investigationName:value.label,
          })
        }        

        if(enterpriseWorkCategoryId){  //非研究相关
          this.loadroleCodeoptions()
          this.setState({
            isInves:true,
            showRoleCodeSelect:true,
            workCategoryId:enterpriseWorkCategoryId,
            showInvestigationSiteNameSelect:false,
          })
        }
    }

    investigationSiteNameselectChanged = (value) => {
      this.initStep(2)
      this.setState({
        showRoleCodeSelect:true,
        investigationSiteId:value.key,
        investigationSiteName:value.label
      })
      this.loadroleCodeoptions(value.key)
    }

    roleCodeselectChanged = (value) => {
      this.initStep(3)
      this.setState({
        showEnterpriseWorkTypeNameSelect:true,
        roleId:value,
      })
      // this.loadenterpriseWorkTypeNameoptions(value)
    }

    enterpriseWorkTypeNameselectChanged = (value) => {
      this.setState({
        workTypeId:value.key,
      })      
    }





    //#############################################################

    // setFieldsValue = obj => {
    //   this.props.form.setFieldsValue(obj);
    // }


    handleSelectInv = keyValue => {
      this.state.investigationNameoptions.map( user => {
          if (user.value == keyValue.key){
              // this.setFieldsValue({hospitalId:user.value})
              // this.loadUserData(user.value)
          }
      });
    };
    
    parserDataInv = dt => {
      if ((dt.data || dt.datas) ) {
          const sourceData = dt.data ? dt.data.enterpriseWorkCategories : dt.datas.enterpriseWorkCategories;
          console.log(sourceData)
          const data = sourceData.map(r => ({
              text: r.enterpriseWorkCategoryName,
              value: r.index,
          }));
          this.setState({
            investigationNameoptions:data,
            enterpriseWorkCategories:dt.data.enterpriseWorkCategories
          });
      } else {
          this.setState({
            investigationNameoptions: [],
          });
      }
    };


    parserDataSite = dt => {
      if ((dt.data || dt.datas) ) {
          const sourceData = dt.data ? dt.data : dt.datas;
          console.log(sourceData)
          const data = sourceData.map(r => ({
              text: r.investigationSiteName,
              value: r.investigationSiteId,
          }));
          this.setState({
            investigationSiteNameoptions:data,
            // enterpriseWorkCategories:dt.data.enterpriseWorkCategories
          });
      } else {
          this.setState({
            investigationSiteNameoptions: [],
          });
      }
    };

    parserDataWorkType = dt => {
      if ((dt.data || dt.datas) ) {
          const sourceData = dt.data ? dt.data.enterpriseWorkTypes : dt.datas.enterpriseWorkTypes;
          console.log(sourceData)
          const data = sourceData.map(r => ({
              text: r.enterpriseWorkTypeName+"("+r.enterpriseWorkTypeCode+")",
              value: r.enterpriseWorkTypeId,
          }));
          this.setState({
            enterpriseWorkTypeNameoptions:data,
            // enterpriseWorkCategories:dt.data.enterpriseWorkCategories
          });
      } else {
          this.setState({
            enterpriseWorkTypeNameoptions: [],
          });
      }
    };

    //添加工时记录    ##############################################
    handleAdd = () => {        
        const { count, dataSource, 
          investigationNameoptions1,
          showduration,
        } = this.state;
        console.log(dataSource[0])
        if(dataSource.length>0){
          this.setState({
            showInvestigationSiteNameSelect:dataSource[0].workCategoryId ? false:true,
            isInves:dataSource[0].workCategoryId ?true:false ,
            investigationId:dataSource[0].workCategoryId ? '': dataSource[0].investigationId,
            investigationName:dataSource[0].investigationName,
            investigationSiteId:dataSource[0].investigationSiteId,
            investigationSiteName:dataSource[0].investigationSiteName,
            roleName:dataSource[0].roleCode,
            roleId:dataSource[0].roleId,
            workCategoryId:dataSource[0].workCategoryId ? dataSource[0].workCategoryId : '',
          },()=>{
            console.log(this.state.investigationId,this.state.investigationSiteId,this.state.investigationName,this.state.roleId,this.state.workCategoryId)
          })
        }
        // const queryCategory = API_URL.manhour.queryCategory
        // const roleCodeoptions = loadroleCodeoptions.map(d => <Option key={d.value}>{d.text}</Option>);
        // const enterpriseWorkTypeNameoptions = loadenterpriseWorkTypeNameoptions.map(d => <Option key={d.value}>{d.text}</Option>);
        const newData = {
        key:'new',
        // investigationName:  <Select key='new' style={{width:'100%'}}
        //                       onChange = {this.investigationNameselectChanged}
        //                     >
        //                     {investigationNameoptions1}
        //                     </Select>,
        //********* */
        investigationName:'',
        investigationSiteName:'',
        roleCode:'',
        enterpriseWorkTypeName:'',
        // duration: showduration ? <Input style={{width:50}}/> : null,
        duration: '',
        isEdit:false,
        count:count
        };
        this.setState({
          dataSource: [newData, ...dataSource],
          isAddBtn:false,
          // showInvestigationSiteNameSelect:this.state.investigationSiteName ? true : false,
          // showRoleCodeSelect:this.state.investigationName ? true :false,
          // showEnterpriseWorkTypeNameSelect:this.state.investigationName ? true :false,
          // showduration:false,
        });
        
    }

    report = (data) => {
      this.reportModalRef.show(data)
    }

    componentWillMount(){
        this.loadData();
    }
    componentDidMount(){
        const url = `${API_URL.investigation.queryInvestigationSiteByKeyword}`;
        // const url = `${API_URL.site.queryUserSiteList}`;
        const params = {invId:sessionStorage.invId};
        const {data} = this.state;
        this.loadinvestigationNameoptions()
        this.loadroleCodeoptions(this.state.investigationSiteId,{
          investigationId:this.state.investigationId
        })
    }

    showPreviewModal = id => {
      this.previewModalRef.show(id)
    }
    handleDatePickerSelect = (date, dateString) => {      
      this.setState({
        time:'',
        date:date.format("YYYY-MM-DD")
      },()=>{
        this.loadData(dateString)
      })
    }

    render(){
        const { loading, dataSource, date } = this.state;
        return (
            <div className="content">
                {
                  !this.props.disableSider && <SideNav selectKey="manHour" />
                }
                <div className="content-inner">                    
                    <div className="T-tit">
                        <div className="txt">
                            <h3>工时记录 </h3>
                            <div><a href="javascript:void(0)" onClick={this.prevDay}><Icon type="left-circle-o"/></a> <DatePicker onChange={this.handleDatePickerSelect} value={moment(this.state.date)} format={dateFormat} disabledDate={(current)=>{return current.valueOf() > Date.now();}} /> <a href="javascript:void(0)" onClick={this.nextDay} disabled={moment(this.state.date).isSameOrAfter(moment().format("YYYY-MM-DD")) ? true : false}><Icon type="right-circle-o" /></a></div>
                        </div>
                        <div className="btn">
                            <Button type="primary" onClick={this.handleAdd} disabled={this.state.isAddBtn ? false : true}>添加</Button>
                            <span className="ant-divider" />
                            <Button type="primary" onClick={this.report.bind(this)}>导出</Button> 
                        </div>
                    </div>                    
                    <div className="content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={dataSource}
                            rowKey={record => record.key}
                            loading={loading}
                            pagination={false}
                            bordered
                        />
                    </div>
                    <PreviewModal ref={el => { this.previewModalRef = el }} />
                    <ReportModal ref={el => { this.reportModalRef = el }} />
                </div>
            </div>
        );
    }
}

export default Write;
