/**
 * Created by casteloyee on 2017/7/18.
 */
import $ from 'jquery';
import React from 'react';
import { message, Table, Popconfirm, Modal, Button } from 'antd';
import API_URL from '../../common/url';
import Filter from './RequirementFilter';
import CreateModal from './RequirementCreateModal';
import MemberSider from './MemberSider';
import FTEDetailModal from './RequirementDetailModal';
import ProcessModal from './RequirementProcessModal';
import AjaxRequest from '../../common/AjaxRequest';
import EmployeeDetailModal from './EmployeeDetailModal';
import ProcessDetailModal from './ProcessDetailModal';
import RefuseProcessModal from './RefuseProcessModal';
import UserSider from '../user/UserSider';
import '../home/style/home.less';
import ExportUtil from '../../common/ExportUtil';

class Require extends React.Component {
    state = {
        sortParams: {},
        searchParams: {},
        data: [],
        pagination: {
            pageSize: 15,
            current: 1,
        },
        loading: false,
        settled : false,//false:计划需求，true：原始需求

        btn_add : '',
        btn_modify : '',
        btn_delete : '',
        btn_process : '',
        btn_confirmProcess : '',
        btn_refuseProcess : '',
        btn_fteAssignDetail : '',
        cur: "plan",
        requireId:this.props.match ? this.props.match.params.requireId : '',                
    };

    loadDataParam = params => {
        let sortParams;
        let searchParams;
        const {
            direction,
            sort,
            sortType,
            investigationSiteCode,
            investigationSiteName,
            requirementCode,
            city,
            requireUser,
        } = params;

        sortParams = {
            direction,
            sort,
            sortType,
        };

        // searchParams = {
        //     requirementCode,
        //     investigationSiteCode,
        //     investigationSiteName,
        //     city,
        //     requireUser,
        // };
        searchParams = this.state.searchParams;
        this.setState({
            sortParams,
            searchParams,
        });
    }

    loadData = (params = {}, settled) => {
        this.setState({
            loading: true,
        });
        this.loadDataParam(params);

        if(settled == null || settled == undefined){
            settled = this.state.settled;
        }

        const options = {
            method: 'get',
            url: `${API_URL.member.listRequireMents}`,
            data: {
                offset: 1,
                limit: 15,
                invId: sessionStorage.invId,
                invRoleCode : sessionStorage.curRole,
                requirementType : settled ? "OriginalRequest" : "InvestigationRequest",
                requirementId:this.state.requireId,
                ...params,
            },
            type: 'json',
            doneResult: ( data => {
                    if (!data.error) {
                        const { requirementList } = data.data;
                        const pagination = { ...this.state.pagination };
                        pagination.total = requirementList.totalCount;
                        const cur = requirementList.datas.length >0 ? requirementList.datas[0].requirementType == 'InvestigationRequest' ? 'plan': 'original' : this.state.cur
                        this.setState({
                            loading: false,
                            data: requirementList.datas,
                            pagination,
                            requireId:'',
                            cur,
                        });
                    } else {
                        Modal.error({ title: data.error });
                        this.setState({
                            loading: false,
                        });
                    }
                }
            ),
            errorResult: (() => {
                this.setState({
                    loading : false,
                });
            })
        };
        AjaxRequest.sendRequest(options);
    }


    loadNewData = () => {
        const curRole = sessionStorage.curRole;

        if(curRole == 'CRCM' || curRole == 'CRCC'){
            this.setState({
                settled : false,
                btn_add : 'inline',
                cur: "plan"
            });
        }
        else{
            this.setState({
                settled : false,
                btn_add : sessionStorage.curRole == 'BD' || sessionStorage.curRole == 'PM' ?'' : 'none',
                cur: "plan"
            });
        }
        
        this.loadData({},false);
    }

    loadProcessedData = () => {
        this.setState({
            data: [],
            pagination: {
                pageSize: 15,
                current: 1,
            },
            loading: true,
            settled : true,
            btn_add : 'none',
            cur: "original"
        });
        this.loadData({},true);
    }

    reload = (params = {}, type) => {
        const newParams = {};
        if(type == "search"){
            newParams.searchParams = params;
            newParams.pagination = { ...this.state.pagination, current: 1 };
        }
        this.setState({
            ...newParams
        },function(){
            const { pagination,searchParams,sortParams } = this.state;
            this.loadData({
                offset: pagination.current,
                ...sortParams,
                ...searchParams,
            });
        })        
    }

    export = () =>{
        const { searchParams, pagination, sort, direction, settled } = this.state;
        let url = `${API_URL.member.export}`;
        if(sort && direction){
            searchParams.sort = sort;
            searchParams.direction = direction;
        }
        searchParams.requirementType = settled ? "OriginalRequest" : "InvestigationRequest";
        ExportUtil.export(searchParams, pagination, url);
    }

    reset = () => {
        const pagination = { ...this.state.pagination, current: 1 };
        this.setState({
            pagination,
            searchParams: {}
        },function(){
            this.loadData();
        });
        
    }

    edit = (id,mode) => {
        this.showCreateModal(id,mode);
    }

    process = id => {
        this.showProcessModal(id);
    }

    confirmProcess = id => {
        const options = {
            url: `${API_URL.member.confirmRequirement}?requirementId=${id}`,
            dataType: 'json',
            doneResult: ( dt => {
                    message.success('操作成功');
                    this.reload();
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    }

    refuseProcess = id => {
        this.refuseProcessModal(id);
    }

    fteAssignDetail  = id => {
        this.showFteAssignDetailModal(id);
    }


    del = id => {
        const options = {
            url: `${API_URL.member.deleteRequireMents}?requirementId=${id}`,
            dataType: 'json',
                doneResult: ( dt => {
                    message.success('删除成功');
                    this.reload();
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    }

    getColumns = () => {
        const {btn_modify, btn_delete, btn_process, btn_confirmProcess, btn_refuseProcess, btn_fteAssignDetailb} = this.state;
        const columns = [];
        const curRole = sessionStorage.curRole;
        const settled = this.state.settled;  //sessionStorage.settled;

        columns.push({
            title: '需求编号',
            dataIndex: 'requirementCode',
            key: 'requirementCode',
            sorter: true,
            width : '100px',
            fixed: 'left',
            sortType: 'common',
        })

        columns.push({
            title: '项目编号',
            dataIndex: 'investigationCode',
            key: 'investigationCode',
            sorter: true,
            sortType: 'common',
        })

        columns.push({
            title: '项目名称',
            dataIndex: 'investigationName',
            key: 'investigationName',
            sorter: true,
            sortType: 'common',
        })
        
        
        columns.push({
            title: '申办方',
            dataIndex: 'investigationSponsor',
            key: 'investigationSponsor',
            sorter: true,
            sortType: 'common',
        })

        columns.push({
            title: '研究药物',
            dataIndex: 'investigationMedicine',
            key: 'investigationMedicine',
            sorter: true,
            sortType: 'common',
        })

        columns.push({
            title: '适应症',
            dataIndex: 'investigationMalady',
            key: 'investigationMalady',
            sorter: true,
            sortType: 'common',
        })

        columns.push({
            title: '中心编号',
            dataIndex: 'investigationSiteCode',
            key: 'investigationSiteCode',
            sorter: true,
            sortType: 'common',
        })

        columns.push({
            title: '中心名称',
            dataIndex: 'investigationSiteName',
            key: 'investigationSiteName',
            sorter: true,
            sortType: 'common',
        })

        columns.push({
            title: '城市',
            dataIndex: 'city',
            key: 'city',
            sorter: true,
            sortType: 'common',
        })

        columns.push({
            title: 'FTE需求',
            dataIndex: 'fteTotal',
            key: 'fteTotal',
            sorter: true,
            sortType: 'common',
            render: (text, record) => {
                
                return (
                    <span> 

                    <a href="javascript:void(0)" onClick={() => this.showDetailModal(record.id,record.requirementType)}>{record.fteTotal}</a>
                </span>
                );
            },
        })

        columns.push({
            title: '人员要求',
            dataIndex: 'requirementComment',
            key: 'requirementComment',
            sorter: true,
            sortType: 'common',
        })

        columns.push({
            title: '发起人',
            dataIndex: 'requireUser',
            key: 'requireUser',
            sorter: true,
            sortType: 'common',
        })

        //if(settled){
            //已处理的要加入被分配人员和处理人

            columns.push({
                title: '被分配人员',
                dataIndex: 'assignedUsers',
                key: 'assignedUsers',
                sorter: false,
                sortType: 'common',
                render: (text, record) => {
                    if(!record.assignedUsers) return;
                    let users = record.assignedUsers.split('//');
                    //let users = [];
                    //users = us.split('//');
                    return (
                        <span>
                            {
                                users.map((user,i)=>{
                                    let u = user.split(',');
                                    return(
                                        <a href="javascript:void(0)" 
                                        onClick={() => this.showEmployeeDetailModalRef(u[0],u[1],u[2])}>
                                        {u[2]}{ users.length > 1 ? ';' : '' }</a>
                                    );
                                    
                                })
                            }                            
                        </span>
                    )
                    
                }
            })

            columns.push({
                title: '处理人',
                dataIndex: 'assignUserName',
                key: 'assignUserName',
                sorter: false,
                sortType: 'common',
            })
        //}

        columns.push({
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                let status;
                if (record.status === 'NEW') {
                    if(!settled){
                        status = '新建';
                    }else{
                        status = '未引用';
                    }
                    
                } else if (record.status === 'ASSIGNED') {
                    status = '预分配';
                } else if (record.status === 'REASSIGNED') {
                    status = '重新分配';
                } else if (record.status === 'REJECTED') {
                    status = '被拒绝';
                } else if (record.status === 'UNDERWAY') {
                    status = '进行中';
                } else if (record.status === 'RETURNED') {
                    status = '被打回';
                } else if (record.status === 'DELIVERED') {
                    status = '已交付';
                } else if (record.status === 'RECEIVED') {
                    status = '已接收';
                } else if (record.status === 'INACTIVE') {
                    status = '无效的';
                } else if (record.status === 'ACTIVE') {
                    if(!settled){
                        status = '已确认';
                    }else{
                        status = '已引用';
                    }
                } else {
                    status = '未知';
                }
                return (
                    <span>{status}</span>
                );
            },
        })

        if(!settled){//计划需求
            //已处理
            columns.push({
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 140,
                render: (text, record) => {
                    
                    if (record.status === 'ASSIGNED' || record.status === 'REASSIGNED') {

                        if(curRole === 'PM') {
                            return (
                                <span>
                                    <Popconfirm title={'确定要分配吗?'} onConfirm={() => this.confirmProcess(record.id)} okText="确定" cancelText="取消">
                                        <a href="javascript:void(0)">确认分配</a>
                                    </Popconfirm>
                                    <span className="ant-divider" />
                                    <a href="javascript:void(0)" onClick={() => this.refuseProcess(record.id)}>拒绝分配</a>
                                    <span className="ant-divider" />
                                    <a href="javascript:void(0)" onClick={() => this.edit(record.id,'copy')}>复制新建</a>  
                                </span>
                            );
                        }
                        else{
                            return (
                                <span>-</span>
                            )
                        }                        
                    }  else if (record.status === 'REJECTED') {
                        if(curRole === 'PM'){
                            return (
                                <span>
                                    <a href="javascript:void(0)" onClick={() => this.edit(record.id,'copy')}>复制新建</a>  
                                </span>
                            ) 
                       }else{
                        return (
                            <span>
                                {   
                                    curRole === 'CRCC' || curRole === 'CRCM' ? 
                                    (<a href="javascript:void(0)" onClick={() => this.process(record.id)}>重新处理</a>) :
                                    ('-') }
                            </span>
                        );
                       }
                        
                    }  else if (record.status === 'ACTIVE') {
                       if(curRole === 'PM'){
                            return (
                                <span>
                                    { record.status === 'ACTIVE'?<a href="javascript:void(0)" onClick={() => this.fteAssignDetail(record.id)}>查看分配明细</a>:<label></label>}
                                    <span className="ant-divider" />
                                    <a href="javascript:void(0)" onClick={() => this.edit(record.id,'change')}>调整需求</a>
                                    <span className="ant-divider" />
                                    <a href="javascript:void(0)" onClick={() => this.edit(record.id,'copy')}>复制新建</a>  
                                </span>
                            ) 
                       } 
                        else{
                            return (
                                <span>
                                    { record.status === 'ACTIVE'?<a href="javascript:void(0)" onClick={() => this.fteAssignDetail(record.id)}>查看分配明细</a>:<label></label>}
                                </span>
                            ) 
                        }
                       
                    }else if(record.status === "NEW"){
                        if(curRole === 'PM'){
                            return (
                                <span>
                                    <a href="javascript:void(0)" onClick={() => this.edit(record.id,'edit')}>修改</a>
                                    <span className="ant-divider" />
                                    <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.del(record.id)} okText="确定" cancelText="取消">
                                        <a href="javascript:void(0)">删除</a>
                                    </Popconfirm>     
                                    <span className="ant-divider" />
                                    <a href="javascript:void(0)" onClick={() => this.edit(record.id,'copy')}>复制新建</a>                     
                                </span>
                            );
                        }else if( curRole === 'CRCC' || curRole === 'CRCM'){
                    
                            return (
                                <span>
                                    <a href="javascript:void(0)" onClick={() => this.process(record.id)}>处理</a>                
                                </span>
                            );

                        }else{
                            return (
                                <span>-</span>
                            )
                        }
                         
                    } else {
                        return (
                            <span>-</span>
                        )
                    }
                    
                },
            })
        }
        else{//原始需求
            //curRole != 'BO' && !settled
            if(curRole === 'BD'){
                columns.push({
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 150,
                    render: (text, record) => {
                        if(record.status == "NEW"){
                            return (
                                <span>
                                    <a style={{display:btn_modify}} href="javascript:void(0)" onClick={() => this.edit(record.id,'edit')}>修改</a>
                                    <span className="ant-divider" />
                                    <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.del(record.id)} okText="确定" cancelText="取消">
                                        <a href="javascript:void(0)">删除</a>
                                    </Popconfirm>
                                    <span className="ant-divider" />
                                    <a href="javascript:void(0)" onClick={() => this.edit(record.id,'copy')}>复制新建</a>                     
                                </span>
                            );  
                        }else if(record.status == "ACTIVE"){
                            return (
                                <span>
                                    <a href="javascript:void(0)" onClick={() => this.edit(record.id,'copy')}>复制新建</a>                     
                                </span>
                            );  
                        }
                         

                    },
                });
            }else if(curRole === 'PM'){
                columns.push({
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 150,
                    render: (text, record) => {
                        return (
                            <span>
                                <a href="javascript:void(0)" onClick={() => this.edit(record.id,'copy')}>复制新建计划</a>                     
                            </span>
                        );                       
                    },
                });
            }
            
        }

        return columns;
    }

    getDataSource = () => {
        const requirements = [];
        const { data, pagination } = this.state;
        const curRole = sessionStorage.curRole;

        data.map((requirement, i) => {
            let requirement_temp = {};
            requirement_temp["id"] = requirement.requirementId
            requirement_temp["requirementCode"] = requirement.requirementCode
            requirement_temp["requirementType"] = requirement.requirementType
            /*if(curRole == 'BO'){*/
                requirement_temp["investigationCode"] = requirement.site.investigation.investigationCode
                requirement_temp["investigationName"] = requirement.site.investigation.investigationName
            /*}*/
            requirement_temp["investigationSiteCode"] = requirement.site.investigationSiteCode
            requirement_temp["investigationSiteName"] = requirement.site.investigationSiteName
            requirement_temp["city"] = requirement.site.city
            requirement_temp["fteTotal"] = requirement.fteTotal
            requirement_temp["requirementComment"] = requirement.requirementComment
            requirement_temp["requireUser"] = requirement.requireUser
            requirement_temp["assignUserName"] = requirement.assignUserName
            requirement_temp["assignedUsers"] = requirement.assignedUsers
            requirement_temp["status"] = requirement.status

            requirements.push({...requirement_temp, ...requirement.site.investigation});
        });
        return requirements;
    }

    handleTableChange = (pagination, filters, sorter) => {
        let sortType,
            direction,
            sort = sort = sorter.field;
        const pager = { ...this.state.pagination };
        if (pager.current == pagination.current){
            pager.current = 1;
                //排序则页码为1
        } else {
            pager.current = pagination.current;
            //获取当前页
        }
        if (!$.isEmptyObject(sorter) && sorter.column) {
            sortType = sorter.column.sortType;
        }

        if (sorter.order === 'descend') {
            direction = 'DESC';
        } else {
            direction = 'ASC';
        }
        this.setState({
            pagination: pager,//设置新的分页信息
            sortParams: {//设置排序信息
                direction,
                sort,
                sortType
            }
        });
        this.loadData({
            limit: pager.pageSize,
            offset: pager.current,
            direction,
            sort,
            sortType,
            ...this.state.searchParams,
            ...filters,
        });
    }

    showCreateModal = (id,mode) => {
        this.createModalRef.show(id,mode);
    }

    showDetailModal = (id,requirementType) => {
        this.detailModalRef.show(id,requirementType);
    }

    showProcessModal = id => {
        this.processModalRef.show(id);
    }

    refuseProcessModal = id => {
        this.refuseProcessModalRef.show(id);
    }

    showFteAssignDetailModal = id => {
        this.fteAssignDetailModalRef.show(id);
    }

    showEmployeeDetailModalRef = (id,code,name) => {
        this.employeeDetailModalRef.show(id,code,name);
    }

    componentDidMount() {
        this.loadData({},false);

        let btn_add = '';
        let btn_modify = '';
        let btn_delete = '';
        let btn_process = '';
        let btn_confirmProcess = '';
        let btn_refuseProcess = '';
        let btn_fteAssignDetail = '';
        let none = "none";
        let inline = "inline";
        const curRole = sessionStorage.curRole;
        const {settled} = this.props;
        if(curRole == 'BD'){
            if(settled){
                btn_add = none;
                btn_modify = none;
                btn_delete = none;
                btn_process = none;
                btn_confirmProcess = none;
                btn_refuseProcess = none;
                btn_fteAssignDetail = inline;
            } else {
                btn_add = inline;
                btn_modify = inline;
                btn_delete = inline;
                btn_process = none;
                btn_confirmProcess = none;
                btn_refuseProcess = none;
                btn_fteAssignDetail = none;
            }
        }
        if(curRole == 'CRCC' || curRole == 'CRCM'){
            btn_add = none;
            if(settled){
                btn_modify = none;
                btn_delete = none;
                btn_process = inline;
                btn_confirmProcess = none;
                btn_refuseProcess = none;
                btn_fteAssignDetail = inline;
            } else {
                btn_modify = none;
                btn_delete = none;
                btn_process = inline;
                btn_confirmProcess = none;
                btn_refuseProcess = none;
                btn_fteAssignDetail = none;
            }
        }
        if(curRole == 'PM'){
            btn_add = none;
            if(settled){
                btn_modify = inline;
                btn_delete = none;
                btn_process = none;
                btn_confirmProcess = inline;
                btn_refuseProcess = inline;
                btn_fteAssignDetail = inline;
            } else {
                btn_modify = none;
                btn_delete = none;
                btn_process = none;
                btn_confirmProcess = none;
                btn_refuseProcess = none;
                btn_fteAssignDetail = none;
            }
        }
        if(curRole == 'BO'){
            btn_add = none;
            if(settled){
                btn_modify = none;
                btn_delete = none;
                btn_process = none;
                btn_confirmProcess = none;
                btn_refuseProcess = none;
                btn_fteAssignDetail = inline;
            } else {
                btn_modify = none;
                btn_delete = none;
                btn_process = none;
                btn_confirmProcess = none;
                btn_refuseProcess = none;
                btn_fteAssignDetail = none;
            }
        }
        this.setState ({
            btn_add : btn_add,
            btn_modify : btn_modify,
            btn_delete : btn_delete,
            btn_process : btn_process,
            btn_confirmProcess : btn_confirmProcess,
            btn_refuseProcess : btn_refuseProcess,
            btn_fteAssignDetail : btn_fteAssignDetail,
        });
    }

    render() {
        const {loading, pagination, sortParams, settled, cur } = this.state;
        const {curRole} = sessionStorage;
        const invId = sessionStorage.invId;
        let originalTab = <a href='javascript:void(0);' onClick={this.loadProcessedData} className={cur == "original" ? "curr" : ""} >原始需求</a>;
        let planTab = <a href='javascript:void(0);' onClick={this.loadNewData} className={cur == "plan" ? "curr" : ""} >计划需求</a>;
        // if(curRole == "CRCC" || curRole == "CRCM"){
        //     planTab=null;
        //     originalTab=null;
        // }
        return (
            <div className="content">
                {this.props.src == 'Member' ? 
                  <MemberSider selectKey='memberRequire' /> 
                  : <UserSider selectKey='UserRequire'/> }
                
                <div className="main">
                    <div>
                    
                        <div className="tab_flex">
                        {planTab}
                        {originalTab}
                        </div>
                    </div>
                    <Filter
                        showCreateModal={this.showCreateModal}
                        sortParams={{}}
                        reload={this.reload}
                        reset={this.reset}
                        export={this.export}
                        settled = {settled}
                        btn_add = {this.state.btn_add}
                        cur = {cur}
                    />
                    <div className="content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.id}
                            loading={loading}
                            onChange={this.handleTableChange}
                            pagination={pagination}
                            scroll={{x:1500}}
                        />
                    </div>
                </div>
                <CreateModal
                    ref={el => { this.createModalRef = el; }}
                    reload={this.reload}
                    settled = {settled}
                />
                <FTEDetailModal
                    ref={el => { this.detailModalRef = el; }}
                    reload={this.reload}
                />
                <ProcessModal
                    ref={el => { this.processModalRef = el; }}
                    reload={this.reload}
                    showEmployeeDetailModalRef = {this.showEmployeeDetailModalRef}
                />
                <EmployeeDetailModal
                    ref={el => { this.employeeDetailModalRef = el; }}
                    reload={this.reload}
                />
                <ProcessDetailModal
                    ref={el => { this.fteAssignDetailModalRef = el; }}
                    reload={this.reload}
                />
                <RefuseProcessModal
                    ref={el => { this.refuseProcessModalRef = el; }}
                    reload={this.reload}
                />
            </div>
        );
    }
}

export default Require;
