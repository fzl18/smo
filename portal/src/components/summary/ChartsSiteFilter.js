import React from 'react';
import jquery from 'jquery';
import $ from '../../common/AjaxRequest';
import moment from 'moment';
import { message, Table, Popconfirm, Modal, Button,Icon, DatePicker, Row, Col,Input,Tooltip,Select ,InputNumber} from 'antd';
import API_URL from '../../common/url';
import SideNav from './SideNav';
import Highcharts from 'react-highcharts';
import DateRange from './DateRange';

const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;
const dateFormat = 'YYYY-MM';
const initState = {
  count:0,
  loading: false,
  visible:false,
  monthList: [],
  siteList : [],
  summaryList : [],
  type:'',
  type2:'',        
  typeName:'',
  title:'',
  params:{},
  date:{},
  selectValue:'0',
  timeshow:'none',
  chartstype:'line',
  pagination: {
    pageSize: 15,
    current: 1,
  },
  searchSiteCode:'', 
  searchSiteName:'',
  sortParams: {},
  searchParams: {},
  statisticalType:'',
  begin: null,
  end: null,
  reRender: false,
  type:""
};   

class ChartsSiteFilter extends React.Component {
    constructor(props) {
        super(props);
    this.state = {
      name:this.props.match.params.name,
      ...initState
      }
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
      // }
      const options ={
        method: 'POST',
        url: `${API_URL.summary.site}`,
        data: {
            offset:1,
            limit:15,
            ...params,
            ...date,
        },
        dateType: 'json',
        doneResult:(data => {
            const pagination = { ...this.state.pagination };
            pagination.total = data.totalCount
            this.setState({
              loading: false,
              summaryList:data.datas,
              pagination
            });
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

    reload = (params = {}) => {
      const { pagination } = this.state;
      this.loadData({
          offset: pagination.current,
          ...params,
      });
    }

    getdataSource = () => {
      const {siteList,monthList,summaryList,pagination,type,type2} = this.state;
      const rows = []
      const summary = {}
      if(summaryList){
        summaryList.map((d,i) => {
          summary.key = i
          summary.index = ((pagination.current - 1) || 0) * 15 + i + 1
          summary.investigationSiteCode = d.investigationSiteCode
          summary.investigationSiteName = d.investigationSiteName
          summary[type] = d.planAmount ? d.planAmount : 0
          summary[type2] = d.amount ? d.amount :0
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
      })
      columns.push({
        title: '中心编号',
        dataIndex: 'investigationSiteCode',
        key: 'investigationSiteCode',
        sorter: true,
        // sortType: 'plan',
      })
      columns.push({
        title: '中心名称',
        dataIndex: 'investigationSiteName',
        key: 'investigationSiteName',
        sorter: true,
        // sortType: 'plan',
      })
      columns.push({
        title: `计划${typeName}数`,
        dataIndex: type,
        key: type,
        sorter: true,
        // sortType: 'plan',
      })
      columns.push({
        title: `实际${typeName}数`,
        dataIndex:type2,
        key: type2,
        sorter: true,
        // sortType: 'plan',
      })
           
      return columns
      
    } 

    //组件加载时初始化参数
    init = (name) => {
      this.showDate();
      let params ={}
      const date ={}
      let title = ''
      let legend ={}
      let chartstype = ''
      switch (name){
        case 'siteFilter':
          title = '各中心筛选情况'
          params = {            
            // investigationId:1,
            statisticalType:'Type_Filter',
          }
          this.setState({
            type:'planAmount',
            type2:'amount',
            typeName:'筛选',
            statisticalType:'Type_Filter',
          })
        break;
        case 'siteInformed':
          title = '各中心知情情况'
          params = {
            // investigationId:1,
            statisticalType:'Type_Informed',
          }
          this.setState({
            type:'planAmount',
            type2:'amount',            
            typeName:'知情',
            statisticalType:'Type_Informed',
          })
        break;
        case 'siteRandom':
          title = '各中心随机(入组)情况'
          params = {
            // investigationId:1,
            statisticalType:'Type_Random',
          }
          this.setState({
            type:'planAmount',
            type2:'amount',            
            typeName:'随机(入组)',
            statisticalType:'Type_Random',
          })
        break;
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
      this.init(this.state.name)
    }


    componentWillReceiveProps(nextProps){      
      this.setState({...initState},()=>{
        this.init(nextProps.match.params.name);
        this.setState({
          reRender:false,
        })
      
      })
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
    handleDate =(date) =>{
      this.setState({
        begin:dateString[0],
        end:dateString[1]
      })
    }
    search = () => {
      const {searchSiteCode,searchSiteName,params,pagination,selectValue,begin,end,sortParams} = this.state
      pagination.current=1
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
      // this.loadData({
      //   offset:pagination.current,
      //   investigationSiteCode:searchSiteCode,
      //   investigationSiteName:searchSiteName,
      //   ...params,
      // })
    }
    ok = () => {
      const {_begin,_end} = this.state;
      if(!_begin){
        Modal.error({title: "请选择起始月"})
        return;
      }
      if(!_end){
        Modal.error({title: "请选择结束月"})
        return;
      }
      this.setState({
        begin:_begin,
        end:_end
      },function(){
        this.showDate();
      })
      const begin = _begin;
      const end = _end;

      this.loadData({
          statisticalType:this.state.statisticalType,
          offset:this.state.pagination.current,
          investigationSiteCode:this.state.searchSiteCode,
          investigationSiteName:this.state.searchSiteName,
        },{
          begin,
          end
        },
        
      )
      this.setState({
        visible:false,
      })
    }
    hide = () => {
      this.setState({
        visible:false
      })
    }

    handleTableChange = (pagination, filters, sorter) => {
      let sortType, direction,
          sort = sort = sorter.field;
      const pager = { ...this.state.pagination };
      if (pager.current == pagination.current){
          pager.current = 1;
      } else {
          pager.current = pagination.current;
      }
      this.setState({
          pagination: pager,
      });

      // if (!jquery.isEmptyObject(sorter) && sorter.column) {
      //     sort = sorter.column.sortType;
      // }

      if (sorter.order === 'descend') {
          direction = 'DESC';
      } else {
          direction = 'ASC';
      }
      const {searchSiteCode,searchSiteName,statisticalType,selectValue,begin,end}=this.state;
      let date = {}
      if(selectValue == "2"){
        date={
          begin,end
        }
      }
      this.loadData({
          limit: pagination.pageSize,
          offset: pager.current,
          direction,
          sort,
          ...this.state.searchParams,
          ...filters,
          investigationSiteCode:searchSiteCode, 
          investigationSiteName:searchSiteName,
          statisticalType,
      },date);
  }

    searchComponent = () => {
      const siteId = sessionStorage.getItem('siteId');
      if (siteId == 0) {
          const {searchSiteCode, searchSiteName, visible, selectValue} = this.state;
          const element = (
              <div className="filter-bar monthSearch">
                  { 
                    selectValue == "2" && // 2 为自定义
                      <DateRange loadData ={this.setDate} clearDate={this.clearDate} type="noRange" />
                  }
                  <div className='form-item' style={{marginLeft:"10px"}}>
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
                  <Button type="primary" onClick={this.search}>搜索</Button>
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
  loadDataParam = params => {
    let sortParams;
    let searchParams;
    const {
        direction,
        sort,
        sortType,
        investigationCode,
        investigationName,
        area,
        sponsor,
        conAmount,
        conAmountSymbol,
    } = params;
    sortParams = {
        direction,
        sort,
        sortType,
    };
    searchParams = {
        investigationCode,
        investigationName,
        area,
        sponsor,
        conAmount,
        conAmountSymbol,
    };
    this.setState({
        sortParams,
        searchParams,
    });
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

  clearAllDate = () => {
    this.setState({
      _begin:null,
    })

  }

  setDate = (params, date) => {
    if(date){
      const {begin,end} = date;
      // if(!begin){
      //   Modal.error({title: "请选择起始月"})
      //   return;
      // }
      // if(!end){
      //   Modal.error({title: "请选择结束月"})
      //   return;
      // }
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

  showDate = () => {
    const {begin, end} = this.state;
    if(begin && end){
      this.setState({
        timeshow:"inline-block"
      })
    }
  }

    render(){
        const { loading,date,title,legend,chartstype, params ,visible,pagination,selectValue,reRender} = this.state;    
        return (          
            <div className="content">
                <SideNav ref={el => {this.siderRef = el;}} />
                <div className="main">                    
                    <div className="T-tit">
                        <div className="txt" style={{width:'100%'}}>
                            <h3 style={{marginBottom:10}}>{title} </h3>
                            <div style={{lineHeight:'40px',textAlign:'left',height:40}}>
                              <Select style={{width:120}} onSelect={this.handleSelect} value={selectValue}>
                                <Option value='0'>总体情况</Option>
                                <Option value='1'>本月情况</Option>
                                <Option value='2'>自定义</Option>
                              </Select>
                              <span style={{display:this.state.timeshow}}><span className="ant-divider" />{this.state.begin} 至 {this.state.end}</span>
                              <div style={{float:'right'}}>
                                {/* <Button type='primary' onClick={this.search}>搜索</Button> */}
                                {this.searchComponent()}
                              </div>                             
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
                            bordered
                            onChange={this.handleTableChange}
                        />
                    </div>
                </div>
                {/*
                  !reRender ? 
                  <Modal
                  title="选择时间段"
                  visible={visible}
                  onOk={this.ok}
                  onCancel={this.hide}
                  className="preview-modal"
                  wrapClassName="vertical-center-modal"
                  width="350px"
                  > 
                    <div style={{padding:20}}>
                     
                      
                    </div>      
                  </Modal>
                  : null
                */}
            </div>
        );
    }
}

export default ChartsSiteFilter;
