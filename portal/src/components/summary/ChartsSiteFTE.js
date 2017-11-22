/**
 * Created by Richie on 2017/8/2.
 */
import React from 'react';
import jquery from 'jquery';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import { message, Table,Tag, Popconfirm, Modal, Button,Icon, DatePicker, Row, Col,Input,Tooltip,Select ,InputNumber} from 'antd';
import API_URL from '../../common/url';
import SideNav from './SideNav';
import Highcharts from 'react-highcharts';
import DateRange from './DateRange';
import chartsConfig from '../common/chartsConfig';

// import './css/index.less';
const { MonthPicker, RangePicker } = DatePicker;
const Option =Select.Option 
const dayFormat = 'YYYY-MM-DD'
const dateFormat = 'YYYY-MM'
class ChartsSiteFTE extends React.Component {
    constructor(props) {
        super(props);
    this.state = {
        count:0,
        loading: false,
        visible:false,
        datas:[],
        monthList: [],
        siteList : [],
        summaryList : [],
        type:'',
        type2:'',        
        typeName:'',
        title:'',
        params:{},
        date:{},
        chartstype:'line',
        begin:'',
        end:'',
        timeshow:'none',
        pagination: {
          pageSize: 15,
          current: 1,
        },
        searchSiteCode:'', 
        searchSiteName:'',
      };        
    }
  loadData = (params,date = {}) => {
                  // date = {begin:moment().format(monthFormat), end:moment().subtract(12,'months').format(monthFormat)}
    
      this.setState({
          loading: true,
      });
      // params={
      //   statisticalTypeOne:'Type_Informed', //* Type_Filter ：筛选 , Type_Informed ：知情 , Type_Random ：随机(入组)
      //   statisticalTypeAnother:'Type_Random',
      //   cumulative:1,  // 1：累计 ， 0：每月
      //   begin:'2016-10-10',
      //   end:'2017-08-01',
      // }
      const options ={
        method: 'POST',
        url: `${API_URL.summary.querySiteFTE}`,
        data: {
            offset: 1,
            limit: 15,
            ...params,
            ...date,
        },
        dateType: 'json',
        doneResult:(data => {
          if (!data.error) {
            const pagination = { ...this.state.pagination };
            pagination.total = data.data.totalCount;
            this.setState({
              loading: false,
              datas:data.data.datas,
              pagination,
            });            
          } else {
              this.setState({
                  loading: false,
              });
              Modal.error({ title: data.error });
          }
      }),
      failResult:(d => {
        this.setState({
          loading: false,
        });
      }),
      errorResult:(data => {
          this.setState({
              loading: false,
          });
        })
      }
      $.sendRequest(options)      
    }

    reload = () => {
        this.loadData();
    }

    getdataSource = () => {
      const {siteList,monthList,summaryList,pagination,type,type2,datas} = this.state;
      const rows = []
      if(datas){
        datas.map((d,i) => {
          const summary = {
            key : i,
            index : ((pagination.current - 1) || 0) * 15 + i + 1,
            investigationSiteCode : d.investigationSiteCode,
            investigationSiteName : d.investigationSiteName,
            planFte : `${(d.planFte).toFixed(4)}`,
            actualFte : d.actualFte.toFixed(4),
            percent : `${(d.percent*100).toFixed(2)}%`,
          }
          rows.push({
            ...summary,
          })
        })
      }       
      return rows
      
    }
    getColumns = () => {
      const columns = []
      const {type,type2,typeName}=this.state
      columns.push({
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },{
        title: '中心编号',
        dataIndex: 'investigationSiteCode',
        key: 'investigationSiteCode',
        sorter: true,
        sortType: 'plan',
      },{
        title: '中心名称',
        dataIndex: 'investigationSiteName',
        key: 'investigationSiteName',
        sorter: true,
        sortType: 'plan',
      },{
        title: `计划FTE`,
        dataIndex: 'planFte',
        key: 'planFte',
        // sorter: true,
        // sortType: 'plan',
      },{
        title: `消耗FTE`,
        dataIndex:'actualFte',
        key: 'actualFte',
        // sorter: true,
        // sortType: 'plan',
      },{
        title: `FTE消耗比`,
        dataIndex:'percent',
        key: 'percent',
        // sorter: true,
        // sortType: 'plan',
      })
      return columns      
    } 

    //组件加载时初始化参数
    init = () => {
      let params ={}
      const date ={}
      let title = ''
      let legend ={}
      let chartstype = ''
      title = '各中心FTE情况'
      params = {            
        // investigationId:1,
      }

      this.setState({
        title,
        params,
        legend,
        chartstype,     
      })
      this.loadData(params);
    }

    componentWillMount(){
      this.init()
    }


    componentWillReceiveProps(nextProps){
      // this.init(nextProps.match.params.name)
      // this.siderRef.selectKey(typeName)
    }


    showPreviewModal = id => {
      this.previewModalRef.show(id)
    }
    handleSelect = (v) => {
      const {begin,end} = this.state;
      this.setState({
        timeshow:'none',
        selectValue:v,
        searchSiteCode: '',
        searchSiteName: ''
      })
      if(v == '2'){
        // this.setState({
        //   visible:true,
        // })
        // this.showDate();
      }else if(v =='1'){
        this.loadData({statisticalType:this.state.statisticalType},{
          begin: moment().format(dateFormat)
        })
      }else{
        this.loadData({statisticalType:this.state.statisticalType})
      }
    }
    handleDate =(date, dateString) =>{
      this.setState({
        begin:dateString[0],
        end:dateString[1]
      })
      console.log(dateString)  
    }
    search = () => {
      const {searchSiteCode,searchSiteName,params,pagination,selectValue,begin,end,sortParams} = this.state
      pagination.current=1;
      this.setState({pagination});
      if(selectValue == '2'){
        if(!begin || !end){
          Modal.error({"title" : "请选择开始及结束日期"});
          return;
        }
        this.loadData({
            offset:pagination.current,
            investigationSiteCode:searchSiteCode,
            investigationSiteName:searchSiteName,
            ...params,
            ...sortParams
        },{
          begin,
          end
        })
      }else if(selectValue =='1'){
        this.loadData({
          statisticalType:this.state.statisticalType,
          offset:pagination.current,
          investigationSiteCode:searchSiteCode,
          investigationSiteName:searchSiteName,
          ...sortParams
        },{
          begin: moment().format(dateFormat)
        })
      }else{
        this.loadData({
          statisticalType:this.state.statisticalType,
          offset:pagination.current,
          investigationSiteCode:searchSiteCode,
          investigationSiteName:searchSiteName,
          ...sortParams
        })
      }
    }
    ok = () => {
      this.loadData({},{
        begin:this.state.begin,
        end:this.state.end
      })
      this.setState({
        visible:false,
        timeshow:'inline-block'
      })
    }
    hide = () => {
      this.setState({
        visible:false
      })
    }

    setDate = (params, date) => {
      if(date){
        const {begin,end} = date;
        if(begin && end){
          this.setState({begin:begin, end:end});
        }
        
  
        const {searchSiteCode,searchSiteName,params,pagination,selectValue,sortParams} = this.state
        pagination.current=1
        this.setState({pagination});
        this.loadData({
          offset:pagination.current,
          investigationSiteCode:searchSiteCode,
          investigationSiteName:searchSiteName,
          ...params,
          ...sortParams
        },{
          begin,
          end
        })
  
      }
    }

    clearDate = (type) => {
      if(type == "begin"){
        this.setState({
          begin:null,
        })
      }else{
        this.setState({
          end:null,
        })
      }
      
    }

    searchComponent = () => {
      const siteId = sessionStorage.getItem('siteId');
      if (siteId == 0) {
          const {searchSiteCode, searchSiteName,selectValue} = this.state;
          const element = (
            <div style={{float:"right"}}>
              <div className="filter-bar monthSearch" style={{marginBottom:0}}>
                  { 
                    selectValue == "2" && // 2 为自定义
                      <DateRange loadData ={this.setDate} clearDate={this.clearDate} type="noRange" />
                  }
                  <div className='form-item'>
                      <label className='ui-label'>中心编号</label>
                      <Input
                          value={searchSiteCode}
                          onChange={this.onChangeSiteCode}
                      />
                  </div>
                  <div className='form-item'>
                      <label className='ui-label'>中心名称</label>
                      <Input
                          value={searchSiteName}
                          onChange={this.onChangeSiteName}
                      />
                  </div>
                  <div className='form-item'>
                  <Button type="primary" icon="search" onClick={this.search}>搜索</Button>
                  </div>
              </div>
                  </div>
          );
          return element;
      }
      return null;
  }

  onChangeSiteCode = e => {
    this.setState({searchSiteCode: e.target.value});
  };

  onChangeSiteName = e => {
      this.setState({searchSiteName: e.target.value});
  };

  handlechange = (pagination, filters, sorter) => {
    console.log('xxx')
    let sortType,
    direction,
    sort = sorter.field;
    const pager = { ...this.state.pagination };
    if (pager.current == pagination.current){
        pager.current = 1;
    } else {
        pager.current = pagination.current;
    }
    this.setState({
        pagination: pager,
    });
    if (!jquery.isEmptyObject(sorter) && sorter.column) {
        sortType = sorter.column.sortType;
        if(sorter.column.sort != undefined && sorter.column.sort)
            sort = sorter.column.sort;
    }

    if (sorter.order === 'descend') {
        direction = 'DESC';
    } else {
        direction = 'ASC';
    }

    if (sorter.field === 'planAmountFilter') {
        sort = 'Type_Filter';
    } else if (sorter.field === 'planAmountInform') {
        sort = 'Type_Informed';
    } else if (sorter.field === 'planAmountRandom') {
        sort = 'Type_Random';
    }

    // if(sorter.column)
    this.loadData({
        limit: pagination.pageSize,
        offset: pager.current,
        direction,
        sort,
        sortType,
        ...this.state.searchParams,
        ...filters,
    });
  }

    render(){
        const { loading,date,title,legend,chartstype, params ,visible,pagination} = this.state;
        console.log(pagination) 
        return (          
            <div className="content">
                <SideNav ref={el => {this.siderRef = el;}} />
                <div className="main">                    
                    <div className="T-tit">
                        <div className="txt" style={{width:'100%'}}>
                            <h3 style={{marginBottom:10}}>{title} </h3>
                            <div style={{lineHeight:'40px',textAlign:'left',height:40}}>
                              <div style={{marginRight:10,float:"left"}}>
                              <Select style={{width:120}} onChange={this.handleSelect} defaultValue='0'>
                                <Option value='0'>总体情况</Option>
                                <Option value='1'>本月情况</Option>
                                <Option value='2'>自定义</Option>
                              </Select>                              
                              <span style={{display:this.state.timeshow}}><span className="ant-divider" />{this.state.begin} 至 {this.state.end}</span>
                              </div>
                              {/* <div style={{float:'right'}}> */}
                                {/* <Button type='primary' onClick={this.search}>搜索</Button> */}
                                {this.searchComponent()}
                              {/* </div> */}
                            </div>
                        </div>
                    </div>
                    {/* <div className="charts" style={{marginBottom:10}}>
                        <Highcharts config={config} />
                    </div> */}
                    <div className="content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getdataSource()}
                            rowKey={record => record.key}
                            loading={loading}
                            pagination={pagination}
                            onChange={this.handlechange}
                            bordered
                        />
                    </div>
                </div>
            </div>
        );
    }
}


export default ChartsSiteFTE;
