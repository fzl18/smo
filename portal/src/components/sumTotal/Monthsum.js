import React from 'react';
import { Button, Table, DatePicker , Input, Select,message} from 'antd';
import moment from 'moment';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import ExportUtil from '../../common/ExportUtil';
import Sider from './SumEffSider';
import AddComment from './AddComment';
import './css/style.less';
import StringUtil from '../../common/StringUtil';

const DateFormat = 'YYYY-MM-DD';
const MonthFormat="YYYY-MM"
const TimeFormat = 'YYYY-MM-DD HH:mm:ss';
const InputGroup = Input.Group;
const Option = Select.Option;
const {MonthPicker, RangePicker} = DatePicker;

function disabledDate(current) {

    return current && current.valueOf() > Date.now();
}

class Monthsum extends React.Component {
    state = {
        loading: false,
        searchArray: {
            begin: moment().format(MonthFormat),
            end: moment().format(MonthFormat),
        },
        dataList: [],
        pagination:{
            current:1,
            pageSize:16,
        },
        monthNum1: '',
        monthNum2: '',
        MonthStart:'',
    };

/*    onChangeRangeTime = value => {
        const { searchArray } = this.state;
        searchArray.begin = value[0].format(DateFormat);
        searchArray.end = value[1].format(DateFormat);
        this.setState({searchArray});
    }
*/





    search = () => {
        const {pagination,searchArray} = this.state;
        
        if(!searchArray.begin){
         message.error('请选择起始月！');
         return;
        }
           if(!searchArray.end){
         message.error('请选择结束月！');
         return;
        }
     
        this.loadData({
            offset: pagination.current,
            limit: pagination.pageSize - 1,
        });
    };


   /* search = () => {
        this.props.reload({...this.state});
    }*/

    handleChange = (field, e) => {
        this.setState({
            [field]: e.target.value,
        });
    }

    onChangeMonth1 =(date, dateString)=> {
        const { searchArray } = this.state;
        searchArray.begin = dateString;
        this.setState({searchArray});
    }

    onChangeMonth2 =(date, dateString)=> {
        const { searchArray } = this.state;
        searchArray.end = dateString;
        this.setState({searchArray});
    }

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    }

    export = () => {
        const { searchArray, pagination } = this.state;
        let url = `${API_URL.summary.exportMonthSummary}`;
        ExportUtil.export(searchArray, pagination, url);
    }

    getColumns = () => {
        const columnNames = [];
        columnNames.push({
            title: '时间',
            dataIndex: 'showDate',
            key: 'showDate',
            sorter: true,
            width:160,
        });
        columnNames.push({
            title: '本月工时数',
            dataIndex: 'manHourShow',
            key: 'manHourShow',
            sorter: true,
        });
        columnNames.push({
            title: '本月FTE数',
            dataIndex: 'fteString',
            key: 'fteString',
            sorter: true,
        });
         columnNames.push({
            title: '本月知情数',
            dataIndex: 'amountInformed',
            key: 'amountInformed',
            sorter: true,
        });
        columnNames.push({
            title: '本月筛选数',
            dataIndex: 'amountFilter',
            key: 'amountFilter',
            sorter: true,
        });
       
        columnNames.push({
            title: '本月随机(入组)数',
            dataIndex: 'amountRandom',
            key: 'amountRandom',
            sorter: true,
        });
        columnNames.push({
            title: '本月完成访视数',
            dataIndex: 'amountVisit',
            key: 'amountVisit',
            sorter: true,
        });
        columnNames.push({
            title: '本月脱落数',
            dataIndex: 'amountDrop',
            key: 'amountDrop',
            sorter: true,
        });
        columnNames.push({
            title: '本月重大违背数',
            dataIndex: 'amountViolation',
            key: 'amountViolation',
            sorter: true,
        });
        columnNames.push({
            title: '本月SAE数',
            dataIndex: 'amountSae',
            key: 'amountSae',
            sorter: true,
        });
        
   
        return columnNames; 
    };

    comment = (id, comment) => {
        this.addCommentRef.show(id, comment);
    }

    getDataSource = () => {
        const sites = [];
        const {dataList, pagination, total} = this.state;
        dataList.map((dataItem, i) => {
            const showDate = moment(dataItem.date).format(DateFormat);
           
            sites.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                investigationSiteWeekSummaryId: dataItem.investigationSiteWeekSummaryId,
                showDate,
                ...dataItem,
                 manHourShow: dataItem.manHourShow + "h",
                updateTime: dataItem.updateTimeString,
            });
        });
        if(dataList && dataList.length > 0){
            sites.push({
                index:-1,
                investigationSiteWeekSummaryId: 0,
                showMonth: '汇总',
                ...total,
            });
        }
        return sites;
    };

    loadData = (params = {}) => {
        this.setState({
            loading: true,
        });
        const { searchArray, pagination } = this.state;
        const options = {
            url: `${API_URL.summary.queryMonthSummary}`,
            data: {
                ...params,
                ...searchArray,
            },
            dataType: 'json',
            doneResult: ( res => {
                const totalCount = res.data.dataList.totalCount;
                const pagination = {...this.state.pagination};
                let ct = Number((totalCount / (pagination.pageSize - 1)).toFixed(0)) + (totalCount % (pagination.pageSize - 1) > 0 ? 1 : 0);
                pagination.total = totalCount + ct;
                this.setState({
                    loading: false,
                    dataList: res.data.dataList.datas ? res.data.dataList.datas : [],
                    total: res.data.total,
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
            sort = 'manHourShow'
        }
        this.loadData({
            offset: pager.current,
            limit: pagination.pageSize - 1,
            sort,
            direction: sorter.order == 'descend' ? 'DESC' : 'ASC',
        });
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        this.loadData();
        this.siderRef.selectKey("patients");
    }

    render() {
        const {  MonthStart,
           loading, pagination  } = this.state;
        const hasAction = (sessionStorage.curRole == "PM" && sessionStorage.siteId == 0) || (sessionStorage.curRole == "CRC" && sessionStorage.siteId > 0)
        
        return (
            <div className="content">
                <Sider selectKey='Monthsum' />
             <div className="main">
                 <div className="filter-bar bar2 mon-summary-bar">
                    <div className="form-item">
                    <label htmlFor="" className="ui-label">时间段</label>
                    
                    <MonthPicker  format={MonthFormat} defaultValue={moment()}
                                 disabledDate={disabledDate} placeholder="选择月份"
                                 onChange={this.onChangeMonth1}
                                  />
                   </div>

                    <div className="form-item">
                    <label htmlFor="" className="ui-label">至</label>
                    <MonthPicker format={MonthFormat} defaultValue={moment()} 
                                 disabledDate={disabledDate(MonthStart)} placeholder="选择月份"
                                 onChange={this.onChangeMonth2} />
                     </div>
                     <div className="form-item"> 
                        <Button  type="primary" onClick={this.export}>导出</Button>
                        <Button type="primary" onClick={this.search}>搜索</Button>
                     </div>
                </div>     
                           

                    <div className="main-content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.investigationSiteWeekSummaryId}
                            loading={loading}
                            scroll={{x: 1200}}
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

export default Monthsum;
