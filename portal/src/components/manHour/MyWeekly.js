/**
 * edit by Gurongjing on 8.1
 * hfkj
 */
import React from "react";
import moment from "moment";
import {message, Breadcrumb, Modal, Button, Table, DatePicker,Tag,Icon} from "antd";
import SideNav from "./SideNav";
import Filter from "./MonthFteFilter";
import API_URL from "../../common/url";
import AjaxRequest from "../../common/AjaxRequest";
import ExportUtil from '../../common/ExportUtil';
import ReportModal from './ReportModal';
import AddComment from '../sumTotal/AddComment';


const { MonthPicker, RangePicker } = DatePicker;
const dayFormat = 'YYYY-MM-DD'
const TimeFormat = 'YYYY-MM-DD HH:mm:ss';

class MyWeekly extends React.Component {
    state = {
        loading: false,
        data: [],
        pagination:{
            pageSize: 15,
            current: 1,
        },
        weekNum:null,
        curweek: moment(),
        weekStart: moment().subtract(moment().day() - 1,'days'),
        weekEnd: moment().add( 7- moment().day() ,'days'),
        curManhour:'cur',
        curSite:'',
        curPro:'',
        dataList: [],
        total:{},
        userCode: null,
        userName: null
    };

    getColumns =()=>{
        const { curManhour,curSite,curPro } = this.state;
        const columns = [];

        if(curManhour == 'cur'){
            columns.push({
                title: '时间',
                dataIndex: 'weekNum',
                key: 'weekNum',
                sort: 'true',
                sortType: 'common'
            });

            columns.push({
                title: '项目编号',
                dataIndex: 'investigationCode',
                key: 'investigationCode',
                sort: 'true',
                sortType: 'common'
            });
            columns.push({
                title: '项目名称',
                dataIndex: 'investigationName',
                key: 'investigationName',
                sort: 'true',
                sortType: 'common'
            });
            columns.push({
                title: '中心编号',
                dataIndex: 'investigationSiteCode',
                key: 'investigationSiteCode',
                sort: 'true',
                sortType: 'common'
            });
            columns.push({
                title: '中心名称',
                dataIndex: 'investigationSiteName',
                key: 'investigationSiteName',
                sort: 'true',
                sortType: 'common'
            });

            columns.push({
                title: '工作类型',
                dataIndex: 'workType',
                key: 'workType',
                sort: 'true',
                sortType: 'common'
            });
            columns.push({
                title: '工时',
                dataIndex: 'manHour',
                key: 'manHour',
                sort: 'true',
                sortType: 'common'
            });
            columns.push({
                title: 'FTE',
                dataIndex: 'fte',
                key: 'fte',
                sort: 'true',
                sortType: 'common'
            });
        } else if (curSite == 'cur'){
            columns.push({
                title: '项目编号',
                dataIndex: 'investigationCode',
                key: 'investigationCode',
                sort: 'true',
                sortType: 'common'
            });
            columns.push({
                title: '项目名称',
                dataIndex: 'investigationName',
                key: 'investigationName',
                sort: 'true',
                sortType: 'common'
            });
            columns.push({
                title: '中心编号',
                dataIndex: 'investigationSiteCode',
                key: 'investigationSiteCode',
                sort: 'true',
                sortType: 'common'
            });
            columns.push({
                title: '中心名称',
                dataIndex: 'investigationSiteName',
                key: 'investigationSiteName',
                sort: 'true',
                sortType: 'common'
            });
            columns.push({
                title: '本周工时数',
                dataIndex: 'manHourString',
                key: 'manHourString',
                sorter: true,
            });
            columns.push({
                title: '本周FTE数',
                dataIndex: 'fteString',
                key: 'fteString',
                sorter: true,
            });
            columns.push({
                title: '本周知情数',
                dataIndex: 'amountInformed',
                key: 'amountInformed',
                sorter: true,
            });
            columns.push({
                title: '本周筛选数',
                dataIndex: 'amountFilter',
                key: 'amountFilter',
                sorter: true,
            });
            columns.push({
                title: '本周随机(入组)数',
                dataIndex: 'amountRandom',
                key: 'amountRandom',
                sorter: true,
            });
            columns.push({
                title: '本周完成访视数',
                dataIndex: 'amountVisit',
                key: 'amountVisit',
                sorter: true,
            });
            columns.push({
                title: '本周脱落数',
                dataIndex: 'amountDrop',
                key: 'amountDrop',
                sorter: true,
            });
            columns.push({
                title: '本周重大违背数',
                dataIndex: 'amountViolation',
                key: 'amountViolation',
                sorter: true,
            });
            columns.push({
                title: '本周SAE数',
                dataIndex: 'amountSae',
                key: 'amountSae',
                sorter: true,
            });
            columns.push({
                title: '备注',
                dataIndex: 'comment',
                key: 'comment',
            });
            columns.push({
                title: '更新时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
            });
            if (sessionStorage.curRole == "CRCC" || sessionStorage.curRole == "CRC"){
                columns.push({
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 100,
                    render: (text, record) => {
                        return (
                            record.investigationSiteWeekSummaryId > 0 ?
                            <span>
                                <a href="javascript:void(0)" onClick={this.comment.bind(this, record.investigationSiteWeekSummaryId, record.comment)}>填写备注</a>
                            </span> : ''
                        );
                    },
                });
            }
        } else {
            columns.push({
                title: '项目编号',
                dataIndex: 'investigationCode',
                key: 'investigationCode',
                sort: 'true',
                sortType: 'common'
            });
            columns.push({
                title: '项目名称',
                dataIndex: 'investigationName',
                key: 'investigationName',
                sort: 'true',
                sortType: 'common'
            });
            columns.push({
                title: '本周工时数',
                dataIndex: 'manHourString',
                key: 'manHourString',
                sorter: true,
            });
            columns.push({
                title: '本周FTE数',
                dataIndex: 'fteString',
                key: 'fteString',
                sorter: true,
            });
            columns.push({
                title: '本周知情数',
                dataIndex: 'amountInformed',
                key: 'amountInformed',
                sorter: true,
            });
            columns.push({
                title: '本周筛选数',
                dataIndex: 'amountFilter',
                key: 'amountFilter',
                sorter: true,
            });
            columns.push({
                title: '本周随机(入组)数',
                dataIndex: 'amountRandom',
                key: 'amountRandom',
                sorter: true,
            });
            columns.push({
                title: '本周完成访视数',
                dataIndex: 'amountVisit',
                key: 'amountVisit',
                sorter: true,
            });
            columns.push({
                title: '本周脱落数',
                dataIndex: 'amountDrop',
                key: 'amountDrop',
                sorter: true,
            });
            columns.push({
                title: '本周重大违背数',
                dataIndex: 'amountViolation',
                key: 'amountViolation',
                sorter: true,
            });
            columns.push({
                title: '本周SAE数',
                dataIndex: 'amountSae',
                key: 'amountSae',
                sorter: true,
            });
            columns.push({
                title: '备注',
                dataIndex: 'comment',
                key: 'comment',
            });
            columns.push({
                title: '更新时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
            });
            if (sessionStorage.curRole == "PM" || sessionStorage.curRole == "CRCC" || sessionStorage.curRole == "CRC"){
                columns.push({
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 100,
                    render: (text, record) => {
                        return (
                            record.investigationSiteWeekSummaryId > 0 ?
                            <span>
                                <a href="javascript:void(0)" onClick={this.comment.bind(this, record.investigationSiteWeekSummaryId, record.comment)}>填写备注</a>
                            </span> : ''
                        );
                    },
                });
            }
        }

        return columns;
    };

    comment = (id, comment) => {
        this.addCommentRef.show(id, comment);
    }

    getDataSource =()=>{

        if(this.state.curManhour == 'cur'){
            const result = [];
            const {data,pagilonation} = this.state;

            data.map((manhour , i)=>{
                const result_temp = {index: i+1};
                if(manhour.manHourId == null || manhour.manHourId == undefined){
                    if(manhour.isCounting != null ){
                        result_temp["weekNum"] ="汇总";
                    }else{
                        result_temp["weekNum"] ="日合计";
                    }
                }else{
                    result_temp["weekNum"] = manhour.dateString;
                }
                
                if(manhour.enterpriseWorkCategoryCode && manhour.enterpriseWorkCategoryCode != null){
                    result_temp["investigationCode"] = manhour.enterpriseWorkCategoryCode
                }else{
                    result_temp["investigationCode"] = manhour.investigationCode;
                }

                if(manhour.enterpriseWorkCategoryName && manhour.enterpriseWorkCategoryName != null){
                    result_temp["investigationName"] = manhour.enterpriseWorkCategoryName
                }else{
                    result_temp["investigationName"] = manhour.investigationName;
                }
                

                if(manhour.manHourId == null || manhour.manHourId == undefined){
                    result_temp["investigationSiteCode"] = null;
                }else{
                    if(manhour.investigationSiteCode == null || manhour.investigationSiteCode == undefined){
                        result_temp["investigationSiteCode"] = "-";
                    }else{
                        result_temp["investigationSiteCode"] = manhour.investigationSiteCode;
                    }
                }
                if(manhour.manHourId == null || manhour.manHourId == undefined){
                    result_temp["investigationSiteCode"] = null;
                }else{
                    if(manhour.investigationSiteName == null || manhour.investigationSiteName == undefined){
                        result_temp["investigationSiteName"] = "-";
                    }else{
                        result_temp["investigationSiteName"] = manhour.investigationSiteName;
                    }
                }

                result_temp["workType"] = manhour.enterpriseWorkTypeString;
                result_temp["manHour"] = manhour.duration+"h";
                if(manhour.manHourId == null || manhour.manHourId == undefined){
                    result_temp["fte"] = manhour.weeklyFte;
                }else{
                    result_temp["fte"] = "-";
                }
                result.push(result_temp);
            });
            return result;
        } else {
            const sites = [];
            const {dataList, total} = this.state;
            dataList.map((dataItem, i) => {
                sites.push({
                    index: i + 1,
                    investigationSiteWeekSummaryId: dataItem.investigationSiteWeekSummaryId,
                    ...dataItem,
                    updateTime: moment(dataItem.updateTime).format(TimeFormat),
                });
            });
            if(dataList && dataList.length > 0){
                sites.push({
                    index:-1,
                    investigationSiteWeekSummaryId: 0,
                    showDate: '汇总',
                    ...total,
                });
            }
            return sites;
        }
    };



    loadData = (params)=>{
        const {weekStart,curweek,weekEnd} = this.state
        const userId = this.props.match ?this.props.match.params.name :null;
        this.setState({loading:true})
        if(userId){
            options = {
                method: 'get',
                url: `${API_URL.user.getUserDetail}`,
                data: {
                    userId:userId,
                },
                type: 'json',
                doneResult: ( data => {
                        if (!data.error) {
                            // const manHours = data.data;
                            // const pagination = { ...this.state.pagination };
                            // //pagination.total = data.totalCount;
                            // this.setState({
                            //     loading: false,
                            //     data: manHours,
                            //     pagination,
                            // });
                            const {employeeCode, userName} = data.data.userInfo;
                            this.setState({
                                    userCode: employeeCode,
                                    userName,
                                    loading:false,
                                });
                        } else {
                            Modal.error({ title: data.error });
                        }
                    }
                ),
            };
            AjaxRequest.sendRequest(options);
        }
        let options = null;
        //queryMySummary
        const {curManhour, curSite, curPro} = this.state;
        if(curManhour == 'cur'){
            if(userId && userId != null){
                options = {
                    method: 'get',
                    url: `${API_URL.manhour.queryManHourWeekly}`,
                    data: {
                        offset: 1,
                        limit: 15,
                        startDate:moment(weekStart).format(dayFormat),
                        endDate:moment(weekEnd).format(dayFormat),
                        userId:userId,
                        ...params,
                    },
                    type: 'json',
                    doneResult: ( data => {
                            if (!data.error) {
                                const manHours = data.data;
                                const pagination = { ...this.state.pagination };
                                //pagination.total = data.totalCount;
                                this.setState({
                                    loading: false,
                                    data: manHours,
                                    pagination,
                                });
                            } else {
                                Modal.error({ title: data.error });
                            }
                        }
                    ),
                };
            }else {
                options = {
                    method: 'get',
                    url: `${API_URL.manhour.queryManHourWeekly}`,
                    data: {
                        offset: 1,
                        limit: 15,
                        startDate:moment(weekStart).format(dayFormat),
                        endDate:moment(weekEnd).format(dayFormat),
                        ...params,
                    },
                    type: 'json',
                    doneResult: ( data => {
                            if (!data.error) {
                                const manHours = data.data;
                                const pagination = { ...this.state.pagination };
                                //pagination.total = data.totalCount;
                                this.setState({
                                    loading: false,
                                    data: manHours,
                                    pagination,
                                });
                            } else {
                                Modal.error({ title: data.error });
                            }
                        }
                    ),
                };

            }
        } else {
            options = {
                method: 'get',
                url: `${API_URL.summary.queryMySummary}`,
                data: {
                    startDate:moment(weekStart).format(dayFormat),
                    endDate:moment(weekEnd).format(dayFormat),
                    isInv: curSite == 'cur' ? 0 : 1,
                },
                type: 'json',
                doneResult: ( res => {
                    this.setState({
                        loading: false,
                        dataList: res.return.data.dataList,
                        total: res.return.data.total,
                    });
                }),
            };
        }
        AjaxRequest.sendRequest(options);
    }

    export = () => {
        const {weekStart,curweek,weekEnd,curManhour,curSite,curPro} = this.state
        const userId = this.props.match ?this.props.match.params.name :null;
        let options = null;
        let url;
        if(curManhour == 'cur'){
            if(userId && userId != null){
                options = {
                    startDate:moment(weekStart).format(dayFormat),
                    endDate:moment(weekEnd).format(dayFormat),
                    userId:userId,
                };
            }else {
                options = {
                    startDate:moment(weekStart).format(dayFormat),
                    endDate:moment(weekEnd).format(dayFormat),
                };
            }   
            url = `${API_URL.manhour.exportManHourWeekly}`;
        } else {
            options = {
                startDate:moment(weekStart).format(dayFormat),
                endDate:moment(weekEnd).format(dayFormat),
                isInv: curSite == 'cur' ? 0 : 1,
            };
            url = `${API_URL.summary.exportMySummary}`;
        }
        ExportUtil.export(options, null, url);
    }

    onChange = (d,dateString) => {
        if(!d){
            this.setState({
                curweek: moment(),
                weekStart: moment().subtract(moment().day() - 1,'days'),
                weekEnd: moment().add( 7- moment().day() ,'days'),
            },function(){
                this.loadData(); 
            })
            return;
        }
        let currDay = d;
        let dTemp=moment(dateString),dTemp1 = moment(dateString);
        let weekStart = dTemp1.startOf('week');
        let weekEnd = dTemp.endOf('week');
        this.setState({
            curweek:currDay,
            weekStart: weekStart,
            weekEnd: weekEnd
        },function(){
            this.loadData(); 
        });
    }
    prevWeek =()=>{
        const {weekStart,curweek,weekEnd} = this.state;
        this.setState({
            curweek:curweek.subtract(7,'days'),
            weekStart:weekStart.subtract(7,'days'),
            weekEnd:weekEnd.subtract(7,'days'),
        });
        this.loadData(); 
    }
    nextWeek =()=>{
        const {weekStart,curweek,weekEnd} = this.state;
        this.setState({
            curweek:curweek.add(7,'days'),
            weekStart:weekStart.add(7,'days'),
            weekEnd:weekEnd.add(7,'days')
        });
        this.loadData();
    }

    report = (data) => {
        this.reportModalRef.show(data)
    }
    btnManhour = () => {
        if (this.state.curManhour != 'cur'){
            
        }
        this.setState({
            curManhour:'cur',
            curSite:'',
            curPro:'',
        },()=>{this.loadData()})
    }

    btnSite = () => {
        if (this.state.curSite != 'cur'){
            
        }
        this.setState({
            curManhour:'',
            curSite:'cur',
            curPro:'',
        },()=>{this.loadData()})
    }

    btnPro = () => {
        if (this.state.curPro != 'cur'){
            
        }
        this.setState({
            curManhour:'',
            curSite:'',
            curPro:'cur',
        },()=>{this.loadData()})
    }

    componentDidMount() {        
        this.loadData();
    }

    render() {
        const {loading, pagination,weekStart,curweek,weekEnd,curManhour,curSite,curPro,userName,userCode} = this.state        
        return (
            <div className="content">
                <SideNav selectKey="MyWeekly"/>
                <div className="main home">
                    <div className='change-btn' style={{marginBottom:20}}> 
                    {
                    this.props.match ? null : 
                     <div style={{display:'flex',width:'100%'}}>                      
                       <a href='javascript:void(0);' onClick={this.btnManhour} className={curManhour} >工时详情</a> 
                       {(sessionStorage.curRole === 'CRC' || sessionStorage.curRole === 'CRCC') ? <a href='javascript:void(0);' onClick={this.btnSite} className={curSite} >中心详情</a> : null} 
                        <a href='javascript:void(0);' onClick={this.btnPro} className={curPro} >项目详情</a>
                      </div>
                    }
                    </div>
                    
                    <div className="T-tit">
                        <div className="txt">
                            <h3> 
                            { curManhour ==='cur' ? '周工时明细' : curSite === 'cur' ? '周记录' : '周记录'}
                            {userName ?
                                `( ${userCode}_${userName} )`
                            :
                            null
                            }
                            </h3>
                            
                            <div style={{margin:'5px auto',width:"250px",height:"30px", position: "relative"}}><span style={{position:"absolute",zIndex:"999",left:"110px",top:"5px"}}>第{curweek.week()}周</span><a style={{position:"absolute",top:"5px",left:"52px"}} href="javascript:void(0)" onClick={this.prevWeek}><Icon type="left-circle-o"/></a> <DatePicker onChange={this.onChange} value={curweek} format="YYYY" style={{width:100}}/> <a  style={{position:"absolute",top:"5px",right:"52px"}} href="javascript:void(0)" onClick={this.nextWeek}><Icon type="right-circle-o" /></a></div>
                            <div style={{color:'#999'}}>{weekStart.format(dayFormat)} 至 {weekEnd.format(dayFormat)}</div>
                        </div>
                        <div className="btn">
                            {/* <Button type="primary" onClick={this.handleAdd} disabled={this.state.isAddBtn ? false : true}>添加</Button> */}
                            <Button type="primary" onClick={this.export}>导出</Button> 
                            { this.props.match ? <span> <span className="ant-divider" /> <Button type="primary" onClick={()=> history.back()} className='back'>返回</Button> </span>: null }
                        </div>
                    </div>
 
                        <div className="content">
                            <Table
                                columns={this.getColumns()}
                                dataSource={this.getDataSource()}
                                pagination= {false}
                                rowKey={record => record.index}
                                loading={loading}
                            />
                        </div>                        
                        <ReportModal ref={el => { this.reportModalRef = el }} />
                        <AddComment ref={el => { this.addCommentRef = el; }} reload={this.loadData} />
                    </div>
                </div>
        );
    }
}

export default MyWeekly;
