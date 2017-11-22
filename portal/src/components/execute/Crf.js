import $ from 'jquery';
import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Table, Input, Icon, Button, Popconfirm, Popover, message, Modal, Breadcrumb, DatePicker } from 'antd';
import API_URL from '../../common/url';
import SearchGroup from '../common/searchGroup/SearchGroup';
import ExecuteSider from './ExecuteSider';
import store from '../../store';
import './style/list.less';
import CrfTable from './CrfTable';
import AjaxRequest from '../../common/AjaxRequest';
import SiteSearchInput from "./SiteAutoSearch";
import { clearSearch } from '../../actions/executeActions';
import StringUtil from '../../common/StringUtil';

class Crf extends React.Component {
    state = {
        sortParams: {},
        pagination: {
            pageSize: 15,
            current: 1,
        },
        loading: false,
        searchArray: [],
        tableColumns: [],
        tableDatas: [],
        investigationSiteId: '',
        investigationSiteCode: '',
        sort: '',
        direction: '',
        siteArray: [],
        hasChild:0,
        disableValue: true,
        patientUserId:this.props.match? this.props.match.params.patientId:''
    };

    /**
     * 获取搜索字段和表头
     * @param params
     */
    // getCategoryTree = (params = {}) => {
    //     const { typeName } = params && params.typeName ? params : this.props.match.params;
    //     const options = {
    //         url: `${API_URL.execute.getCategoryTree}`,
    //         data: {
    //             typeName,
    //             isDefine: 0,
    //         },
    //         dataType: 'json',
    //         doneResult: ( result => {
    //             const { searchArray, tableColumns } = result.data;
    //             const opcolumn = {
    //                 moduleDefineCode: 'op',
    //                 moduleDefineName: '操作',
    //                 criteriaDataType: 'TEXT',
    //             };
    //             if (tableColumns.length > 0) {
    //                 tableColumns.unshift(opcolumn);
    //             }
    //             this.setState({
    //                 searchArray,
    //                 tableColumns,
    //             });
    //         }),
    //     };
    //     AjaxRequest.sendRequest(options);
    // }

    /**
     * 获取列表数据
     * @param params
     */
    loadData = (params = {}) => {
		const { typeName } = params && params.typeName ? params : this.props.match.params;
        const newParams = this.getLoadDataParam();
        if(params){
            if(params.sort){
                this.setState({
                    sort: params.sort,
                    direction: params.direction,
                    sorter: params.sorter
                })
            }
            if(params.offset){
                const {pagination} = this.state;
                this.setState({
                    pagination: {...pagination, current:params.offset},
                    sorter: params.sorter
                })
                //params.offset = (params.offset - 1) * params.limit + 1;
            }
        }
        this.setState({
            loading: true,
        });

        const options = {
            url: `${API_URL.execute.list}?${newParams}`,
            data: {
                typeName,
                ...params,
                patientUserId:this.state.patientUserId,
            },
            dataType: 'json',
            doneResult: ( data => {
                const { tableColumns } = data.data.tree.data;
                const searchArray = [];
                tableColumns.map((value,index) => {
                    if(value['projectDefineSearchFlag'] == "1"){
                        searchArray.push(value);
                    }
                })
                const opcolumn = {
                    moduleDefineCode: 'op',
                    moduleDefineName: '操作',
                    criteriaDataType: 'TEXT',
                };
                if (tableColumns.length > 0) {
                    tableColumns.unshift(opcolumn);
                }
                const pagination = {...this.state.pagination};
                pagination.total = data.data.totalCount;
                let disableValue = false;
                if(data.addable == 0){
                    disableValue = true;
                }
                this.setState({
                    searchArray,
                    tableColumns,
                    tableDatas: data.data.datas,
                    hasChild: data.data.hasChild,
                    loading: false,
                    pagination,
                    siteArray: [1],
                    disableValue,
                    patientUserId:'',
                });
            }),
            errorResult: (() => {
                this.setState({
                    loading: false,
                });
            })
        };
        AjaxRequest.sendRequest(options);
    }

    /**
     * 搜索时的参数
     * @param params
     * @returns {string}
     */
    getLoadDataParam = (params = {}) => {
        let key,
            type,
            path,
            searchValue,
            newParam = '';
        //const { searchParams } = this.props;
        const {searchParams} = store.getState().executeState;
        const {investigationSiteId} = this.state;
        for (key in searchParams) {
            path = `&conditions[${key}].listConditions[0]`;
            type = searchParams[key].projectDefineWebType;
            searchValue = searchParams[key].searchValue;
            if (searchValue) {
                if (type === 'INPUT') {
                    newParam += `${path}.conditions[0].oper=LIKE`;
                    newParam += `${path}.conditions[0].value=${searchValue}`;
                } else if (type === 'DATETIMEPICKER' && Array.isArray(searchValue)) {
                    newParam += `${path}.conditions[0].oper=GE`;
                    newParam += `${path}.conditions[0].value=${searchValue[0]}`;
                    newParam += `${path}.oper=AND`;
                    newParam += `${path}.conditions[1].oper=LE`;
                    newParam += `${path}.conditions[1].value=${searchValue[1]}`;
                }
            }
        }
        if(investigationSiteId !== ""){
            newParam += `&siteId=${investigationSiteId}`
        }
        return newParam;
    }

    search = (params = {}) => {

        const {investigationSiteId, investigationSiteCode} = this.state;
        this.loadData({investigationSiteId,investigationSiteCode,offset:1});
        this.setState({sorter:{}})
    }
    
    reset = () => {
        store.dispatch(clearSearch());
        this.setState({sorter:{}});
        this.loadData();
    }

    export = () => {
        
        
        const {investigationSiteId, sort, direction} = this.state;
        const { typeName } = this.props.match.params;
        const newParams = this.getLoadDataParam();
        let locationRef = `${API_URL.export.exportTypeVisit}?${newParams}&typeName=${typeName}`;
        if(investigationSiteId !== ""){
            locationRef += "&siteId=" + investigationSiteId;
        }
        if(sort !== ""){
            locationRef += "&sort=" + sort + "&direction=" + direction;
        }
        //locationRef += '&offset=1';
         if (sessionStorage.curEnterpriseId && sessionStorage.curEnterpriseId > 0){
            locationRef += '&curEnterpriseId=' + sessionStorage.curEnterpriseId;
        }
        if (sessionStorage.userId && sessionStorage.userId > 0){
            locationRef += '&curUserId=' + sessionStorage.userId;
        }
        if (sessionStorage.invId && sessionStorage.invId > 0){
            locationRef += '&curInvId=' + sessionStorage.invId;
        }
        if (sessionStorage.siteId && sessionStorage.siteId > 0){
            locationRef += '&curSiteId=' + sessionStorage.siteId;
        }
        if (!StringUtil.isNull(sessionStorage.curRole)){
            locationRef += '&curRoleCode=' + sessionStorage.curRole;
        }
        if (!StringUtil.isNull(sessionStorage.curEmployeeCode)){
            locationRef += '&curEmployeeCode=' + sessionStorage.curEmployeeCode;
        }
        window.location.href = locationRef;
    }

    handleSelectSite = value => {
        this.setState({
            investigationSiteId: value.value,
            investigationSiteCode: value.text,
        });
    };

    handleSiteChange = value => {
        if(value){
            if(value.key == ""){
                this.setState({
                    investigationSiteId: ''
                });
            }
        }
    }

    handleAdd = () => {
        this.crfTableRef.handleAdd();
    }

    componentDidMount() {
        //this.getCategoryTree();
        this.loadData();
        this.setTitleName(this.props.match.params.typeName);
    }

    componentWillReceiveProps(nextProps) {
        const {typeName} = nextProps.match.params;
        store.dispatch(clearSearch());
        this.setState({
            typeName: typeName,
            sortParams: {},
            pagination: {
                pageSize: 15,
                current: 1,
            },
            loading: false,
            searchArray: [],
            tableColumns: [],
            tableDatas: [],
            investigationSiteId: '',
            investigationSiteCode: '',
            sort: '',
            direction: '',
            siteArray: [],
            hasChild:0,
            disableValue: true
        },function(){
            this.loadData({typeName: typeName});
            this.setTitleName(typeName);
        });
        //this.clearSiteSelect();
        //this.getCategoryTree({typeName: typeName});
        
    }

    setTitleName = typeName => {
        let titleName = '';
        if(typeName == 'Type_Visit'){
            titleName = '访视记录';
        } else if(typeName == 'Type_Pre_Filter'){
            titleName = '预筛记录';
        } else if(typeName == 'Type_Drop'){
            titleName = '脱落记录';
        } else if(typeName == 'Type_Violation'){
            titleName = '重大违背记录';
        } else if(typeName == 'Type_SAE'){
            titleName = 'SAE记录';
        }
        this.setState({titleName});
    }

    clearSiteSelect = () => {
        this.siteSearchInput.clearValue();
    }

    render() {
        const { params } = this.props.match;
        const { loading, tableColumns, searchArray, tableDatas, titleName, pagination, tableWidth, siteArray, hasChild, sorter, disableValue } = this.state;
        const curRole = sessionStorage.curRole;
        const {siteId} = sessionStorage;
        return (
            <div className="content">
                <ExecuteSider selectKey={params.typeName} />
                <div className="main">
                    {/* <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <Icon type="home" />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            <span>项目执行</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {titleName}
                        </Breadcrumb.Item>
                    </Breadcrumb> */}
                    <div className="filter-bar">
                        <div className='crf'>
                        {
                            searchArray.map((searchItem, i) =>
                                <SearchGroup
                                    key={i}
                                    searchItem={searchItem}
                                    //search={this.search}
                                />,
                            )
                        }
                        
                        {
                            siteArray.map((v,i) => 
                                siteId == "0" && 
                                <div className="form-item autoInput" key={i}>
                                    <label htmlFor="" className="ui-label">中心名称\中心编号</label>
                                    
                                    <SiteSearchInput selectKey={params.typeName} placeholder="" style={{width: 200}}
                                                        handleSelectSite = {this.handleSelectSite}
                                                        handleSiteChange = {this.handleSiteChange}
                                                        ref={el => {this.siteSearchInput = el;}}
                                    />
                                    
                                </div>
                            )
                            
                        }
                        {
                            curRole == 'CRC' ? <Button className="btn" type="primary" disabled={disableValue} onClick={this.handleAdd}>添加</Button> : ''
                        }
                        <Button className="btn" type="primary"  onClick={this.export}>导出</Button>
                        {/*导出 @todo*/}
                        <Button className="btn" type="primary"  onClick={this.reset}>重置</Button>
                        <Button className="btn" type="primary"  onClick={this.search}>搜索</Button>
                        </div>
                    </div>
                    <CrfTable 
                        tableColumns={tableColumns}
                        tableDatas={tableDatas}
                        hasChild={hasChild}
                        params={params}
                        ref={el => {this.crfTableRef = el;}}
                        loading={loading}
                        loadData={this.loadData}
                        pagination={pagination}
                        sorter={sorter}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        searchParams: store.executeState.searchParams,
    };
};

//export default connect(mapStateToProps)(Crf);
export default Crf;

