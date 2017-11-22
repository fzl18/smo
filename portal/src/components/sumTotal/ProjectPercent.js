/**
 * Created by Richie on 2017/11/3.
 */
import React from 'react';
import { Button, Table, DatePicker,Input,Select } from 'antd';
import moment from 'moment';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import ExportUtil from '../../common/ExportUtil';
import Sider from './SumEffSider';
import AddComment from './AddComment';
import SearchSelect from '../common/SearchSelect';
// import './css/style.less';

const DateFormat = 'YYYY-MM-DD';
const TimeFormat = 'YYYY-MM-DD HH:mm:ss';
const { RangePicker } = DatePicker;
const Option = Select.Option;

class ProjectPercent extends React.Component {
    state = {
        loading: false,
        searchArray: {},
        dataList: [],
        list2:[],
        list3:[],
        pagination:{
            current:1,
            pageSize:16,
        },
        count:0,
        userOptions:[],
        siteOptions:[],
        type:this.props.type || null,
        jde:this.props.jde || false,
        invId:this.props.invId || ''
    };

    loadData = (params = {}) => {
        this.setState({
            loading: true,
        });
        const { searchArray, pagination,type,jde } = this.state;
        let url,limit
        switch (type){
            case null:
            limit = jde ? pagination.pageSize - 5 : pagination.pageSize - 6
            url=`${API_URL.sumtotal.queryInvestigationFinishedPercentage}`
            break;
            case 'pro':
            limit = 2
            url=`${API_URL.sumtotal.queryAllInvestigation}`
            break;
        }
        const options = {
            url,
            data: {
                offset: pagination.current,
                limit,
                ...params,
                ...searchArray,                              
            },
            dataType: 'json',
            doneResult: ( res => {
                const totalCount = res.totalCount;
                const pagination = {...this.state.pagination};
                const { type,jde } = this.state;
                let ct 
                switch (type){
                    case null:
                    if(jde){
                        ct = Number((totalCount / (pagination.pageSize - 5)).toFixed(0)) + (totalCount % (pagination.pageSize - 5) > 0 ? 5 : 0);
                    }else{
                        ct = Number((totalCount / (pagination.pageSize - 6)).toFixed(0)) + (totalCount % (pagination.pageSize - 6) > 0 ? 1 : 0);
                    }
                    break;
                    case 'pro':
                    ct = Number(10*(totalCount / 2 ).toFixed(0)) + (totalCount % 2 > 0 ? 6 : 0) - totalCount;
                    this.setState({
                        list2:res.datas ? res.datas[0].investigationFinishes[0].ftes : [],
                    })
                    break;
                }                
                pagination.total = totalCount + ct;
                this.setState({
                    loading: false,
                    dataList: res.datas,
                    count:res.count,
                    pagination,
                });
            }),
            errorResult: ( data => {
                this.setState({
                    loading: false,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    onChangeRangeTime = value => {
        const { searchArray } = this.state;
        searchArray.begin = value[0].format(DateFormat);
        searchArray.end = value[1].format(DateFormat);
        this.setState({searchArray});
    }

    searchComponent = () => {
        const {type,jde,invId}=this.state
        const element = (
            !type ?
            <div className="filter-bar">
                { jde &&
                <div className="form-item">
                <label className="ui-label">JDE项目号</label>
                <Input onChange={this.handleInputChange.bind(this, 'childCode')}/>
                </div>
                }
                <div className="form-item">
                <label className="ui-label">中心编号/中心名称</label>
                <SearchSelect 
                    style={{width:250}}
                    url = {API_URL.site.list}
                    searchKey = 'searchKey'
                    sourceData={this.state.siteOptions}
                    parserData={this.parserDataSite}
                    handleSelect = {this.siteSelectChanged}
                    placeholder={'输入中心名或编号'}
                    allowClear={true}
                    className='manhour-select'
                    searchParam={invId&& {invId:invId}}
                />
                </div>
                <div className="form-item">
                <label className="ui-label">CRC工号/CRC姓名</label>
                <SearchSelect 
                    style={{width:110}}
                    url = {API_URL.execute.queryCRCListByKeyword}
                    searchKey = 'keyword'
                    sourceData={this.state.userOptions}
                    parserData={this.parserDataUser}
                    handleSelect = {this.userSelectChanged}
                    placeholder={'输入名字或工号'}
                    allowClear={true}
                    className=''
                />
                </div>
                <div className="form-item">
                <Button type="primary" onClick={this.export}>导出</Button>
                <Button type="primary" onClick={this.search}>搜索</Button>
                </div>
            </div>:
            <div className="filter-bar">
            <div className="form-item">
            <label className="ui-label">项目编号</label>
            <Input onChange={this.handleInputChange.bind(this, 'investigationCode')}/>
            </div>
            <div className="form-item">
            <label className="ui-label">项目名称</label>
            <Input onChange={this.handleInputChange.bind(this, 'investigationName')}/>
            </div>
            <div className="form-item">
            <label className="ui-label">项目状态</label>
            <Select style={{width:120}} onChange={this.handleChangeSelect.bind(this, 'status')}>
                <Option value="PREPARING">准备中</Option>
                <Option value="UNDERWAY">进行中</Option>
                <Option value="COMPLETED">已完成</Option>
            </Select>
            </div>
            <div className="form-item">
            <label className="ui-label">JDE主项目号</label>
            <Input onChange={this.handleInputChange.bind(this, 'jdeCode')}/>
            </div>
            <div className="form-item">
            <label className="ui-label">PM工号/PM姓名</label>
            <SearchSelect 
                style={{width:110}}
                url = {API_URL.sumtotal.queryAllInvestigationPm}
                searchKey = 'keyword'
                sourceData={this.state.userOptions}
                parserData={this.parserDataPmUser}
                handleSelect = {this.userSelectChanged}
                placeholder={'输入名字或工号'}
                allowClear={true}
                className=''
            />
            </div>
            <div className="form-item">
            <Button type="primary" onClick={this.back} style={{background:'#62cf96',border:'1px solid #00a854'}}>返回</Button>
            <Button type="primary" onClick={this.export}>导出</Button>
            <Button type="primary" onClick={this.search}>搜索</Button>
            </div>
        </div>
        );
        return element;
    };

    back=()=>{
        location.href = history.back()
    }

    search = () => {
        const {pagination,searchArray,invId,type} = this.state;
        this.loadData({
            offset: pagination.current,
            limit:!type ? pagination.pageSize - 6 : type == 'pro' ? 2 : pagination.pageSize - 5 ,
            ...searchArray,
            investigationId:invId && invId,
        });
    };

    export = () => {
        const { searchArray, pagination } = this.state;
        let url = `${API_URL.sumtotal.exportInvestigationFinishedPercentage}`;
        searchArray.offset=pagination.current
        searchArray.limit=pagination.pageSize - 6
        ExportUtil.export(searchArray, pagination, url);
    }

    viewPro=(value)=>{
        this.props.showView(value)
    }

    renderContent = (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        const {count}=this.state
        if (count==16 && index > 9) {
          obj.props.colSpan = 0;
        }else if(count!=16 && index > count-7){
            obj.props.colSpan = 0;
        }
        return obj;
    };
    renderContentPro = (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        const {count}=this.state
        if (index>0 &&index!=6) {            
           obj.props.colSpan = 0;            
        }        
        return obj;
    };

    getColumns = () => {
        const columnNames = [];
        const {dataList,count,jde}=this.state
        const list=  dataList[0] ? dataList[0].ftes : []
        columnNames.push({
            title: '序号',
            width:80,
            dataIndex: 'index',
            key: 'index',
            fixed:'left',
            render:this.renderContent,            
        });
        {jde &&
            columnNames.push({
                title: 'JDE主项目号',
                width:80,
                dataIndex: 'mainCode',
                key: 'mainCode',
                sorter: true,
                fixed:'left',
                render:this.renderContent,
            },{
                title: 'JDE项目号',
                width:80,
                dataIndex: 'childCode',
                key: 'childCode',
                sorter: true,
                fixed:'left',
                render:this.renderContent,
            },{
                title: '合同开始时间',
                width:80,
                dataIndex: 'startTime',
                key: 'startTime',
                sorter: true,
                fixed:'left',
                render:this.renderContent,
            },{
                title: '合同结束时间',
                width:80,
                dataIndex: 'endTime',
                key: 'endTime',
                sorter: true,
                fixed:'left',
                render:this.renderContent,
            })
        }
        columnNames.push({
            title: '中心编号',
            width:80,
            dataIndex: 'investigationSiteCode',
            key: 'investigationSiteCode',
            sorter: true,
            fixed:'left',
            render:this.renderContent,
        });
        columnNames.push({
            title: '中心名称',
            width:200,
            dataIndex: 'investigationSiteName',
            key: 'investigationSiteName',
            sorter: true,
            fixed:'left',
            render:this.renderContent,
        });
        columnNames.push({
            title: 'CRC工号',
            width:80,
            dataIndex: 'employeeCode',
            key: 'employeeCode',
            sorter: true,
            fixed:'left',    
            render:this.renderContent,        
        });
        columnNames.push({
            title: 'CRC姓名',
            width:80,
            dataIndex: 'userCompellation',
            key: 'userCompellation',
            sorter: true,
            fixed:'left',
            render: (text, row, index) => {
                if (count==16 && index < 10) {
                    return <span>{text}</span>;
                }else if(count!=16 && index< count-6){
                    return <span>{text}</span>;
                }
                return {
                    children:<span style={{textAlign:'right',display:'block'}}>{text}</span>,
                    props: {
                        colSpan: jde ? 9 : 5,
                    },
                };                
            },
        });
        list &&
        list.map((d,i)=>{
            if(i<list.length-1){
                columnNames.push({
                    title: d.title,
                    dataIndex: `fteValue${i}`,
                    key: `fteValue${i}`,
                });
            }else{
                columnNames.push({
                    title: d.title,
                    dataIndex: `fteValue${i}`,
                    key: `fteValue${i}`,
                    width:80,
                    fixed:'right',
                });
            }
        })

        return columnNames;
    };

    getColumnsPro = () => {
        const columnNames = [];
        const {dataList,count,list2}=this.state
        columnNames.push({
            title: '序号',
            width:80,
            dataIndex: 'index',
            key: 'index',
            fixed:'left',
            render:this.renderContentPro,
        });
        columnNames.push({
            title: '项目名称',
            width:160,
            dataIndex: 'investigationName',
            key: 'investigationName',
            sorter: true,
            fixed:'left',
            render: (text, row, index) => {
                if (index==0 || index==6) {
                    return <a href="javascript:;" onClick={this.viewPro.bind(this,row)}>{text}</a>;
                } 
                return {
                    children:<span>{text}</span>,
                    props: {
                        colSpan: 0,
                    },
                };                
            },
        });
        columnNames.push({
            title: '项目编号',
            width:80,
            dataIndex: 'investigationCode',
            key: 'investigationCode',
            sorter: true,
            fixed:'left',
            render:this.renderContentPro,
        });
        columnNames.push({
            title: 'JDE主项目号',
            width:120,
            dataIndex: 'jdeCode',
            key: 'jdeCode',
            sorter: true,
            fixed:'left',
            render:this.renderContentPro,        
        });
        columnNames.push({
            title: 'PM工号',
            width:80,
            dataIndex: 'investigationPmEmployeeCode',
            key: 'investigationPmEmployeeCode',
            sorter: true,
            fixed:'left',
            render:this.renderContentPro,
        });
        columnNames.push({
            title: 'PM姓名',
            width:80,
            dataIndex: 'userCompellation',
            key: 'userCompellation',
            sorter: true,
            fixed:'left',
            render: (text, row, index) => {
                if (index==0 || index==6) {
                    return <span>{text}</span>;
                } 
                return {
                    children:<span style={{textAlign:'right',display:'block'}}>{text}</span>,
                    props: {
                        colSpan: 6,
                    },
                };                
            },
        });
        list2 &&
        list2.map((d,i)=>{
            if(i<list2.length-1){
                columnNames.push({
                    title: d.title,
                    dataIndex: `fteValue${i}`,
                    key: `fteValue${i}`,
                });
            }else{
                columnNames.push({
                    title: d.title,
                    dataIndex: `fteValue${i}`,
                    key: `fteValue${i}`,
                    width:80,
                    fixed:'right',
                });
            }
        })

        return columnNames;
    };
    
    comment = (id, comment) => {
        this.addCommentRef.show(id, comment);
    }

    getDataSource = () => {
        const sites = [];        
        const {dataList, pagination, total} = this.state;
        dataList.map((dataItem, i) => {
            const ftelist={}
            dataItem.ftes.map((d,j)=>{
                ftelist[`fteValue${j}`] = d.fteValue
            })
            sites.push({
                index: ((pagination.current - 1) || 0) * 10 + i + 1,
                ...dataItem,
                ...ftelist,
            });            
        });
        return sites;
    };

    getDataSourcePro = () => {
        const sites = [];        
        const {dataList, pagination, total,list2} = this.state;
        dataList &&
        dataList.map((dataItem, i) => {           
            const ftelist={}
            if(dataItem.investigationFinishes){
                dataItem.investigationFinishes[0].ftes.map((v,k)=>{
                    ftelist[`fteValue${k}`] = v.fteValue                    
                })
                    // item2[`userCompellation${j}`]=d.userCompellation
                    // item2[`ftelist${j}`]={...ftelist}
                sites.push({
                    index: ((pagination.current - 1) || 0) * 2 + i + 1,
                    ...dataItem,
                    ...ftelist,
                });
                dataItem.investigationFinishes.map((d,j)=>{
                    if(j){
                        const ftelist={}
                        d.ftes.map((v,k)=>{
                            ftelist[`fteValue${k}`] = v.fteValue
                        })
                        sites.push({
                            ...d,
                            ...ftelist,
                        });
                    }                
                })
            }            
        });
        return sites;        
    };

    getDataSourceView = () => {
        const sites = [];        
        const {dataList, pagination, total} = this.state;
        dataList.map((dataItem, i) => {
            const ftelist={}
            dataItem.ftes.map((d,j)=>{
                ftelist[`fteValue${j}`] = d.fteValue
            })
            sites.push({
                index: ((pagination.current - 1) || 0) * 10 + i + 1,
                ...dataItem,
                ...ftelist,
            });            
        });
        return sites;
    };


    handleInputChange = (field, e) => {
        const {searchArray} = this.state;
        searchArray[field]=e.target.value
        this.setState({
            searchArray
        });
    }

    handleChangeSelect = (field, value) => {
        const {searchArray} = this.state;
        searchArray[field]= value
        this.setState({
            searchArray
        });
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        if (pager.current == pagination.current){
            pager.current = 1;
        } else {
            pager.current = pagination.current;
        }
        this.setState({
            pagination: pager,
        });
        let sort = sorter.field;
        if(sorter && sorter.field == 'showDate'){
            sort = 'date'
        } else if(sorter && sorter.field == 'fte'){
            sort = 'manHour'
        }
        let { searchArray, type,invId } = this.state;
        switch (type){
            case null:
            pagination.pageSize = pagination.pageSize - 6
            break;
            case 'pro':
            pagination.pageSize = 2
            break;
            case 'view':
            pagination.pageSize = pagination.pageSize - 5
            break;
        }
        this.loadData({
            offset: pager.current,
            limit: pagination.pageSize,
            sort,
            direction: sorter.order == 'descend' ? 'DESC' : 'ASC',
            investigationId:invId && invId,
        });
    }

    componentDidMount() {
        !this.state.jde && this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        if(!nextProps){
            this.siderRef.selectKey("percent");
        }
    }

    parserDataSite = (dt,value) => {
        if(!value){
            const { searchArray } = this.state;
            searchArray.investigationSiteId = '';
            this.setState({searchArray});
        }
        if ((dt.data || dt.datas) ) {
            const sourceData = dt.data ? dt.data.siteList.datas : dt.datas;
            console.log(sourceData)
            const data = sourceData.map(r => ({
                text: r.investigationSiteName,
                value: r.investigationSiteId,
            }));
            this.setState({
              siteOptions:data,
              // enterpriseWorkCategories:dt.data.enterpriseWorkCategories
            });
        } else {
            this.setState({
              siteOptions: [],
            });
        }
      };


      parserDataUser = (dt,value) => {
        if(!value){
            const { searchArray } = this.state;
            searchArray.userId = '';
            this.setState({searchArray});
        }
        if ((dt.data || dt.datas) ) {
            const sourceData = dt.data ? dt.data.crcList: dt.datas;
            const data = sourceData.map(r => ({
                text: `${r.userName}[${r.employeeCode}]`,
                value: r.userId,
            }));
            this.setState({
              userOptions:data,
              // enterpriseWorkCategories:dt.data.enterpriseWorkCategories
            });
        } else {
            this.setState({
              userOptions: [],
            });
        }
      };


      parserDataPmUser = (dt,value) => {
        if(!value){
            const { searchArray } = this.state;
            searchArray.userId = '';
            this.setState({searchArray});
        }
        if ((dt.data || dt.datas) ) {
            const sourceData = dt.data ? dt.data: dt.datas;
            const data = sourceData.map(r => ({
                text: `${r.userCompellation}[${r.employeeCode}]`,
                value: r.userId,
            }));
            this.setState({
              userOptions:data,
              // enterpriseWorkCategories:dt.data.enterpriseWorkCategories
            });
        } else {
            this.setState({
              userOptions: [],
            });
        }
      };



      siteSelectChanged=(value)=>{          
        const { searchArray } = this.state;
        searchArray.investigationSiteId = value.key;
        this.setState({searchArray});
      }

      userSelectChanged=(value)=>{
        const { searchArray } = this.state;
        searchArray.userId = value.key;
        this.setState({searchArray});
    }

    render() {        
        const { loading, pagination,dataList,type,list2,list3,jde } = this.state;
        const hasAction = (sessionStorage.curRole == "PM" && sessionStorage.siteId == 0) || (sessionStorage.curRole == "CRC" && sessionStorage.siteId > 0)
        let xscroll,isShow
        switch (type){
            case null:
            xscroll={x: dataList[0] && dataList[0].ftes.length*100+600}
            break;
            case 'pro':
            xscroll={x: dataList && list2.length*100+600}
            break;
        }
        if(jde){
            xscroll={x: dataList[0] && dataList[0].ftes.length*100+920}
        }
        if(type || jde){
            isShow=false
        }else{
            isShow=true
        }
        return (
            <div className="content">
                { isShow && <Sider selectKey='summary'/>}
                <div className="main">
                    {this.searchComponent()}
                    <div className="main-content">
                        <Table
                            columns={!type ? this.getColumns() : this.getColumnsPro()}
                            dataSource={ !type ? this.getDataSource() : this.getDataSourcePro()}
                            rowKey={record => record.investigationSiteWeekSummaryId}
                            loading={loading}
                            scroll={xscroll}
                            pagination={ pagination }
                            onChange={this.handleTableChange}
                        />
                    </div>
                </div>
                <AddComment ref={el => { this.addCommentRef = el; }} reload={this.loadData} />
                
            </div>
        );
    }
}

export default ProjectPercent;
