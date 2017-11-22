/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import { DatePicker, Select, Button, Input, Table, Popconfirm, Modal, Radio,message,InputNumber} from 'antd';
import moment from 'moment';
import ExecuteSider from './ExecuteSider';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';
import ExportUtil from '../../common/ExportUtil';
import DateRange from '../common/DateRange';
import SearchSelect from '../common/SearchSelect';
import './style/list.less'


const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;
const DateFormat = 'YYYY-MM-DD';
const MonthFormat = 'YYYY-MM';
const RadioGroup = Radio.Group;

class ManHourList extends React.Component {
    state = {
        loading: false,
        workTypeLoaded: false,
        enterpriseWorkTypes: [],
        searchArray: {},
        type:'week',
        dataList: [],
        pagination: {
            pageSize: 16,
            current: 1,
        },
        startDate:moment().format(MonthFormat),
        endDate:moment().format(MonthFormat),
        radioVal:'',
        radioShow:false,
        duration:0,
        editManHourShow:false,
        userOptions:[],
        siteOptions:[],
    };

    

    handleChangeStatus = value => {
        const { searchArray } = this.state;
        searchArray.status = value;
        this.setState({searchArray});
    }

    onChangeRangeTime = value => {
        const { searchArray } = this.state;
        if(value.length == 1){
            searchArray.startDate = value[0].format(DateFormat);
        }
        else if(value.length == 2){
            searchArray.startDate = value[0].format(DateFormat);
            searchArray.endDate = value[1].format(DateFormat);
        }else{
           searchArray.startDate = '';
           searchArray.endDate = '';
        }
        this.setState({searchArray});
    }

    handleChangeWorkType = value => {
        const { searchArray } = this.state;
        searchArray.workTypeId = value;
        this.setState({searchArray});
    }

    onChangeSiteCode = e => {
        const { searchArray } = this.state;
        searchArray.investigationSiteCode = e.target.value;
        this.setState({searchArray});
    };

    onChangeSiteName = e => {
        const { searchArray } = this.state;
        searchArray.investigationSiteName = e.target.value;
        this.setState({searchArray});
    };
    
    onChangeInputUser = e => {
        const { searchArray } = this.state;
        searchArray.userCompellation = e.target.value;
        this.setState({searchArray});
    };

    getWorkType = () => {
        //
        const { enterpriseWorkTypes, workTypeLoaded } = this.state;
        if (!workTypeLoaded){
            const options = {
                url: `${API_URL.manhour.queryWorkType}`,
                data: {
                    isRelateInvestigation: '1'
                },
                dataType: 'json',
                doneResult: ( data => {
                    const enterpriseWorkTypes = data.data.enterpriseWorkTypes;
                    this.setState({
                        workTypeLoaded: true,
                        enterpriseWorkTypes,
                    });
                }),
                errorResult: ( ()=> {
                    this.setState({
                        workTypeLoaded: true,
                    });
                }),
            };
            AjaxRequest.sendRequest(options);
        }
      
        const element = (
            <Select allowClear={true} style={{ width: 150 }} onChange={this.handleChangeWorkType}>
                {
                    enterpriseWorkTypes &&
                    enterpriseWorkTypes.map(d => 
                        <Option key={d.enterpriseWorkTypeId}>{d.enterpriseWorkTypeName + '(' + d.enterpriseWorkTypeCode + ')'}</Option>
                        )
                }
            </Select>
        );
        return element;
    }

    searchComponent = () => {
        const { searchArray,type,startDate,endDate} = this.state;
        const element = (
            <div className="filter-bar bar2">
                <div className="form-item">
                    <label className="ui-label">工作日期</label>
                    {type=='week' ? <RangePicker onChange={this.onChangeRangeTime} />
                        :
                        <DateRange style={{display:'flex',alignItems:'center'}} defaultValueBegin={moment(startDate)} defaultValueEnd={moment(endDate)} next='' loadData={this.getDate}/>
                    }
                </div>
                { type=='week' &&
                    <div className="form-item">
                    <label className="ui-label">工作类型</label>
                        {this.getWorkType()}
                    </div>
                }
                
                <div className="form-item">
                <label className="ui-label">状态</label>
                    <Select defaultValue={searchArray.workStatus} allowClear={true} style={{ width: 80 }} onChange={this.handleChangeStatus}>
                        <Option value="UNVERIFY">未确认</Option>
                        <Option value="VERIFY">已确认</Option>
                    </Select>
                </div>
                {
                    sessionStorage.siteId == 0 && 
                        // <div>
                        //     <div className="form-item">
                        //         <label className="ui-label">中心编号</label>
                        //         <Input
                        //             value={searchArray.investigationSiteCode}
                        //             onChange={this.onChangeSiteCode}
                        //         />
                        //     </div>
                        //     <div className="form-item">
                        //         <label className="ui-label">中心名称</label>
                        //         <Input
                        //             value={searchArray.investigationSiteName}                                    
                        //             onChange={this.onChangeSiteName}
                        //         />
                        //     </div>
 
                            <div className="form-item">
                            <label className="ui-label">中心</label>
                            <SearchSelect 
                                style={{width:250}}
                                url = {API_URL.site.list}
                                searchKey = 'searchKey'
                                sourceData={this.state.siteOptions}
                                parserData={this.parserDataSite}
                                handleSelect = {this.siteSelectChanged}
                                placeholder={'输入中心名或编号'}
                                allowClear={true}
                                onChange={this.SearchSelect.bind(this,'investigationSiteId')}
                                className='manhour-select'
                            />
                            </div>
                        // </div>
                }
                <div className="form-item">
                <label className="ui-label">录入者</label>
                    {/* <Input
                        value={searchArray.userCompellation}
                        onChange={this.onChangeInputUser}
                    /> */}
                    <SearchSelect 
                        style={{width:110}}
                        url = {API_URL.execute.queryCRCListByKeyword}
                        searchKey = 'keyword'
                        sourceData={this.state.userOptions}
                        parserData={this.parserDataUser}
                        handleSelect = {this.userSelectChanged}
                        placeholder={'输入名字或工号'}
                        allowClear={true}
                        onChange={this.SearchSelect.bind(this,'userId')}
                        className=''
                    />
                </div>
                {
                    // sessionStorage.curRole == 'PM' && 
                    // <Popconfirm title={'是否确定此操作?\r\n工时记录确认后，不能在修改'} onConfirm={this.confirmAll} okText="确定" cancelText="取消">
                    //     <Button type="primary" >批量确认</Button>
                    // </Popconfirm>
                }
                <Button type="primary" onClick={this.export}>导出</Button>
                <Button type="primary" onClick={this.search}>搜索</Button>
            </div>
        );
        return element;
    }

    search = () => {
        const {pagination,type,startDate,endDate} = this.state;
        type=='week' ? 
        this.loadData({
            offset: 1,
            limit: pagination.pageSize - 1,
        })
        :
        this.loadDataTotal({
            offset: 1,
            limit: pagination.pageSize - 1,
            begin:startDate,
            end:endDate,
        })
    }

    export = () => {
        const { searchArray, pagination, sort, direction,type,startDate,endDate } = this.state;
        let url = type=='week' ? `${API_URL.export.exportManHourList}`: `${API_URL.export.exportUserFteSummary}`;
        if(sort && direction){
            searchArray.sort = sort;
            searchArray.direction = direction;            
        }
        searchArray.begin=startDate
        searchArray.end=endDate
        ExportUtil.export(searchArray, pagination, url);
    }

    batchConfirm =()=>{
        this.setState({
            radioShow:true
        })
    }

    hide =()=>{
        this.setState({
            radioShow:false,
            editManHourShow:false
        })
    }

    getColumns = () => {
        const columnNames = [];
        columnNames.push({
            title: '工作日期',
            dataIndex: 'manHourDateString',
            key: 'manHourDateString',
            sorter: true,
        });
        columnNames.push({
            title: '录入者',
            dataIndex: 'userCompellation',
            key: 'userCompellation',
            sorter: true,
        });
        columnNames.push({
            title: '录入者工号',
            dataIndex: 'employeeCode',
            key: 'employeeCode',
            sorter: true,
        });

        if (sessionStorage.siteId == 0){
            columnNames.push({
                title: '中心编号',
                dataIndex: 'investigationSiteCode',
                key: 'investigationSiteCode',
                sorter: true,
            });
            columnNames.push({
                title: '中心名称',
                dataIndex: 'investigationSiteName',
                key: 'investigationSiteName',
                sorter: true,
            });
        }
        
        columnNames.push({
            title: '工作类型(编号)',
            dataIndex: 'enterpriseWorkTypeString',
            key: 'enterpriseWorkTypeString',
            sorter: true,
        });       
        
        columnNames.push({
            title: '用时',
            dataIndex: 'durationString',
            key: 'durationString',
            sorter: true,
        });
        columnNames.push({
            title: '状态',
            // dataIndex: 'statusName',
            // key: 'statusName',
            dataIndex: 'realManHourStatusShow',
            key: 'realManHourStatusShow',
            sorter: true,
        });
        if (sessionStorage.curRole == 'CRC'){
            columnNames.push({
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 60,
                render: (text, record) => {
                    return (
                        <span>
                            {                                
                                record.manHourId > 0 && record.status != 'VERIFY' ? 
                                <span>
                                    <a href="javascript:void(0)" onClick={this.editManHourShow.bind(this,record.manHourId)}>修改</a>
                                    <span className="ant-divider" />
                                <Popconfirm title={'确定删除该工时记录？'} onConfirm={() => this.delManHour(record.manHourId)} okText="确定" cancelText="取消">
                                    <a href="javascript:void(0)">删除</a>
                                </Popconfirm>
                                </span>
                                : '-'
                            }
                        </span>
                    );
                },
            });
        }
        // if (sessionStorage.curRole == 'PM'){
        //     columnNames.push({
        //         title: '操作',
        //         key: 'operation',
        //         fixed: 'right',
        //         width: 60,
        //         render: (text, record) => {
        //             return (
        //                 <span>
        //                     {
        //                         record.manHourId > 0 && record.status != 'VERIFY' ? 
        //                         <Popconfirm title={'是否确定此操作?\r\n工时记录确认后，不能在修改'} onConfirm={() => this.confirm(record.manHourId)} okText="确定" cancelText="取消">
        //                             <a href="javascript:void(0)">确认</a>
        //                         </Popconfirm>
        //                         : record.manHourId > 0 ? '-' : ''
        //                     }
        //                 </span>
        //             );
        //         },
        //     });
        // }
        return columnNames;
    };

    editManHourShow=(manHourId)=>{
        this.state.dataList.map(d=>{
            if(d.manHourId == manHourId){
                this.setState({                    
                    duration:d.duration,
                })
            }
        })
        this.setState({
            editManHourShow:true,
            editManHourId:manHourId,
        })

    }

    durationChanged=(value)=>{
        this.setState({
            duration:value
        })
    }

    editManHour=()=>{
        const {pagination,direction,sort,duration,editManHourId}=this.state
        const params={}
        // 修改已有工时保存
        const options ={
          method: 'get',
          url: `${API_URL.manhour.editmanhour}`,
          data: {
            manHourId:editManHourId,
            duration,
            // manHourDetailId:record.manHourDetailId,
            ...params
          },
          dataType: 'json',
          doneResult: (data => {
              if (!data.error) {
                message.success(data.data.success)
                this.loadData({
                    offset: pagination.current,
                    limit: pagination.pageSize - 1,
                    sort,
                    direction,
                })
                this.hide()
              } else {
                  this.setState({
                      loading: false,                    
                  });
                  Modal.error({ title: data.error });
              }
          })
        }
        AjaxRequest.sendRequest(options)
    }
    

    delManHour=(manHourId)=>{
        const {pagination,direction,sort}=this.state
        const params={}
        const options ={
          method: 'get',
          url: `${API_URL.manhour.delmanhour}`,
          data: {
            manHourId,
            ...params
          },
          dataType: 'json',
          doneResult: (data => {
              if (!data.error) {
                message.success(data.data.success)
                this.loadData({
                    offset: pagination.current,
                    limit: pagination.pageSize - 1,
                    sort,
                    direction,
                })
              } else {
                  this.setState({
                      loading: false,                    
                  });
                  Modal.error({ title: data.error });
              }
          })
        }
        AjaxRequest.sendRequest(options)
    }

    getColumnsTotal = () => {
        const columnNames = [];
        columnNames.push({
            title: '工作日期',
            dataIndex: 'dateValue',
            key: 'dateValue',
            sorter: true,
        });
        columnNames.push({
            title: '录入者',
            dataIndex: 'userCompellation',
            key: 'userCompellation',
            sorter: true,
        });
        columnNames.push({
            title: '录入者工号',
            dataIndex: 'employeeCode',
            key: 'employeeCode',
            sorter: true,
        });

        if (sessionStorage.siteId == 0){
            columnNames.push({
                title: '中心编号',
                dataIndex: 'investigationSiteCode',
                key: 'investigationSiteCode',
                sorter: true,
            });
            columnNames.push({
                title: '中心名称',
                dataIndex: 'investigationSiteName',
                key: 'investigationSiteName',
                sorter: true,
            });
        }
        
        columnNames.push({
            title: '用时/FTE',
            dataIndex: 'manHourValueShow',
            key: 'manHourValueShow',
            sorter: true,
        });
        columnNames.push({
            title: '状态',
            dataIndex: 'statusShow',
            key: 'statusShow',
            sorter: true,
        });
        if (sessionStorage.curRole == 'PM'){
            columnNames.push({
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 60,
                render: (text, record) => {
                    return (
                        <span>
                            {
                                record.dateValue=='总计' ? 
                                <a href="javascript:void(0)" onClick={this.batchConfirm}>批量确认</a>
                                :
                                record.status != 'VERIFY' ? 
                                <Popconfirm title={'是否确定此操作?\r\n工时记录确认后，不能在修改'} onConfirm={() => this.confirm(record.investgationSiteUserFteMonthSummaryId)} okText="确定" cancelText="取消">
                                    <a href="javascript:void(0)">确认</a>
                                </Popconfirm>
                                : '-'
                            }
                        </span>
                    );
                },
            });
        }
        return columnNames;
    };

    getDataSource = () => {
        const dataResult = [];
        const {dataList, pagination,type} = this.state;
        dataList.map((dataItem, i) => {
            let status
            if(dataItem.status=="VERIFY" && dataItem.verifyUserId !=0){
                status='已确认(PM)'
            }else if(dataItem.status=="VERIFY" && dataItem.verifyUserId ==0){
                status='已确认(系统)'
            }else if(dataItem.manHourDateString=='总计'){
                status=''
            }else{
                status='未确认'
            }            
            dataResult.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                ...dataItem,
                investigationSiteCode: dataItem.investigationSiteCode ? dataItem.investigationSiteCode : '-',
                investigationSiteName: dataItem.investigationSiteName ? dataItem.investigationSiteName : '-',
                statusName:status,
            });
        });
        return dataResult;
    };

    

    // confirmAll =() => {
    //     this.confirm(-1);
    // }

    confirm = manHourId => {
        // let params = '?';
        // if (manHourId > 0){
        //     params += 'ids[0]=' + manHourId;
        // } else {
        //     const { dataList } = this.state;
        //     dataList.map( (item, i) => {
        //         if(i > 0 && i < dataList.length -1){
        //             params += '&';
        //             params += 'ids[' + i + ']=' + item.manHourId;
        //         } else if(i == 0){
        //             params += 'ids[' + i + ']=' + item.manHourId;
        //         }
        //     });
        // }
        const {pagination, sort, direction,type,startDate,endDate,} = this.state;
        const options = {
            url: `${API_URL.execute.comfirmUserFteMonthOne}`,
            data: {investigationSiteUserFteMonthSummaryId:manHourId},
            dataType: 'json',
            doneResult: ( data => {
                Modal.success({ title: '成功', content: '确认成功' });
                type=='week'?
                this.loadData({
                    offset: pagination.current,
                    limit: pagination.pageSize - 1,
                    sort,
                    direction,
                })
                :
                this.loadDataTotal({                    
                    offset: pagination.current,
                    limit: pagination.pageSize - 1,
                    sort,
                    direction,
                })
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    loadData = (params = {}) => {
        this.setState({
            loading: true,
        });
        const { searchArray, pagination } = this.state;
        const options = {
            url: `${API_URL.manhour.queryManHourList}`,
            data: {
                ...searchArray,
                ...params,
                isRelateInvestigation: '1',
            },
            dataType: 'json',
            doneResult: ( data => {
                let ct = Number((data.totalCount / (pagination.pageSize -1)).toFixed(0)) + (data.totalCount % (pagination.pageSize - 1) > 0 ? 1 : 0);
                pagination.total = data.totalCount + ct;
                if(params && params.offset){
                    pagination.current = params.offset;
                }
                this.setState({
                    loading: false,
                    dataList: data.datas,
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

    loadDataTotal = (params = {}) => {
        this.setState({
            loading: true,
        });
        const { searchArray, pagination,startDate,endDate } = this.state;
        const options = {
            url: `${API_URL.execute.queryUserFteSummary}`,
            data: {
                ...searchArray,
                ...params,
                begin:moment(startDate).format(MonthFormat),
                end:moment(endDate).format(MonthFormat),
            },
            dataType: 'json',
            doneResult: ( data => {
                let ct = Number((data.totalCount / (pagination.pageSize -1)).toFixed(0)) + (data.totalCount % (pagination.pageSize - 1) > 0 ? 1 : 0);
                pagination.total = data.totalCount + ct;
                if(params && params.offset){
                    pagination.current = params.offset;
                }
                this.setState({
                    loading: false,
                    dataList: data.datas,
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

    componentDidMount(){
        const {pagination} = this.state;
        this.loadData({
            offset: pagination.current,
            limit: pagination.pageSize - 1,
        });
    }

    componentWillReceiveProps(nextProps) {
        const {pagination} = this.state;
        this.loadData({
            offset: pagination.current,
            limit: pagination.pageSize - 1,
        });
        this.siderRef.selectKey("Patients");
    }

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        if (pager.current == pagination.current){
            pager.current = 1;
        } else {
            pager.current = pagination.current;
        }
        let field = sorter.field;
        if(field){
            if(field == 'manHourDateString'){
                field = 'manHourDate';
            } else if(field == 'enterpriseWorkTypeString'){
                field = 'enterpriseWorkTypeName';
            } else if(field == 'statusName'){
                field = 'status';
            } else if(field == 'durationString'){
                field = 'duration';
            }
        }
        let direction = sorter.order == 'descend' ? 'DESC' : 'ASC';
        if(!sorter.order){
            direction = "";
        }
        this.setState({
            sort: field,
            direction,
        });
        this.state.type=='week' ?
        this.loadData({
            offset: pager.current,
            limit: pagination.pageSize - 1,
            sort: field,
            direction,
        })
        :
        this.loadDataTotal({
            offset: pager.current,
            limit: pagination.pageSize - 1,
            sort: field,
            direction,
        })
    }
    
    btnChangeType = (type) =>{
        const {pagination,startDate,endDate}=this.state
        type=='week'? this.loadData({
            offset: 1,
            limit: pagination.pageSize - 1,
        }) 
        : this.loadDataTotal({
            offset: 1,
            limit: pagination.pageSize - 1,
            begin:moment(startDate).format(MonthFormat),
            end:moment(endDate).format(MonthFormat),
        })
        this.setState({
            type,
        })
    }

    radioHandle = (e) => {
        this.setState({
            radioVal: e.target.value,
        });
    }

    radioOK=()=>{
        console.log(this.state.radioVal)
        const {startDate,endDate,dataList}=this.state   
        const params={
            begin:startDate,
            end:endDate,
        }     
        if(this.state.radioVal==0){
            const ids={}
            let num=dataList.length
            dataList.map((d,i)=>{
                if(i<num-1){
                    ids[i]=d.investgationSiteUserFteMonthSummaryId
                }
            })            
            this.confirmOnePage({...params,ids})
        }else{
            this.confirmAllTotal(params)
        }
        this.setState({
            radioShow:false
        })
    }

    confirmOnePage=(params={})=>{
        const { pagination,searchArray,startDate,endDate,sort,direction} = this.state;
        const options = {
            url: `${API_URL.execute.comfirmUserFteMonthOffset}`,
            data: {                
                ...params,
                ...searchArray,
                sort,
                direction                
            },
            dataType: 'json',
            doneResult: ( data => {
                message.info('确认完成！')
                this.loadDataTotal({
                    offset:pagination.current,
                    limit:pagination.pageSize-1,
                    begin:startDate,
                    end:endDate,
                })
            }),
            errorResult: ( data => {
                this.setState({
                    loading: false,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    confirmAllTotal=(params={})=>{
        const { pagination,searchArray,startDate,endDate,sort,direction } = this.state;
        const options = {
            url: `${API_URL.execute.comfirmUserFteMonthAll}`,
            data: {                
                ...params,
                ...searchArray,
                sort,
                direction
            },
            dataType: 'json',
            doneResult: ( data => {
                message.info('批量确认完成！')
                this.loadDataTotal({
                    offset:pagination.current,
                    limit:pagination.pageSize-1,
                    begin:startDate,
                    end:endDate
                })

            }),
            errorResult: ( data => {
                this.setState({
                    loading: false,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    getDate=(params,date)=>{
        this.setState({
            startDate:date.begin,
            endDate:date.end
        })        
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
            const sourceData = dt.data ? dt.data.crcList : dt.datas;
            console.log(sourceData)
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

    SearchSelect=(value,fieldName)=>{
        console.log(value.label,fieldName)
        if(value.label==''){
            const { searchArray } = this.state;
            searchArray[fieldName] = '';
            this.setState({
                searchArray
            })
        }
    }

    render() {
        const { loading, pagination, type,radioShow,editManHourShow,duration } = this.state;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
          };
        return (
            <div className="content">
                <ExecuteSider selectKey='manHour' ref={el => {this.siderRef = el;}} />
                <div className="main home">
                    <div className='change-btn' style={{marginBottom:10}}>
                       <a href='javascript:void(0);' onClick={this.btnChangeType.bind(this,'week')} className={type =='week'? 'cur':''} >明细记录</a>
                       <a href='javascript:void(0);' onClick={this.btnChangeType.bind(this,'total')} className={type =='total'? 'cur':''} >汇总记录</a>
                    </div>
                    {this.searchComponent()}
                    <div className="main-content">
                            <Table
                            columns={ type=='week'? this.getColumns():this.getColumnsTotal() }
                            dataSource={this.getDataSource()}
                            rowKey={record => record.manHourId}
                            loading={loading}
                            scroll={{x: '100%'}}
                            pagination={ pagination }
                            onChange={this.handleTableChange}
                            />                        
                    </div>
                </div>
                <Modal
                title="批量操作"
                visible={radioShow}
                onOk={this.radioOK}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                >
                <div style={{padding:'30px 40px'}}>
                <h2 style={{marginBottom:20}}> 请选择批量确认操作数据对象</h2>
                <RadioGroup onChange={this.radioHandle} value={this.state.radioVal}>
                    <Radio style={radioStyle} value={0}>当前页数据</Radio>
                    <Radio style={radioStyle} value={1}>所有数据</Radio>
                </RadioGroup>
                </div>                
                </Modal>

                <Modal
                title="修改工时"
                visible={editManHourShow}
                onOk={this.editManHour}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                >
                <div style={{padding:'30px 40px'}}>                
                    工时数：<InputNumber min={0} max={24} value={duration} onChange={this.durationChanged} step={0.01} style={{width:70}}/>h
                </div>                
                </Modal>
            </div>
        );
    }
}

export default ManHourList;
