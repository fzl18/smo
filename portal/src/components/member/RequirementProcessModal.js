import React, { Component } from 'react';
import $ from 'jquery';
import { Form, Input, Modal, Button, Select, DatePicker, message, Icon, InputNumber, Table } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';


class ProcessModal extends Component {

    state = {
        submitting : false,
        visible: false,
        confirmLoading: false,
        employeesLoading : false,
        requirement: {},
        fteList: [],
        city: '',
        employees: [],
        processedEmployees: [],
        requirementId : '',
        rejectHistory : [],
    };

    show = id => {
        this.setState({
            visible: true,
            requirement: {},
            fteList: [],
            city: '',
            requirementId : '',
        });
        if (id) {
            this.loadData(id);
        }
    };


    hide = () => {
        this.setState({
            visible: false,
        });
    };

    testF = () =>{
        const aaa = {};

        const bbb = [];
    }

    prospectiveAssign(requirementId, processedEmployees, newEmployees) {
        
        let params = '';
        let ids = '';
        let idList =[];
        let index = 0;
        this.setState({
            employeesLoading : true,
        });
        newEmployees.map((em,i) =>{
            if(em.hasProcess){
                if(ids != ''){
                    ids += '&';
                }
                ids += 'ids[' + index++ + ']=' + em.userId;
                idList.push(em.userId);
            }            
        });

        params = `&requirementId=${requirementId}` + (ids === ''? '' : ('&' + ids));
        const options = {
            method: 'POST',
            url: `${API_URL.member.prospectiveAssign}?${params}` ,
            doneResult: ( data => {
                    const fteList = this.state.fteList;
                    let employees = data.data.employees;

                    employees.map((dataItem, i) => {
                        dataItem.hasProcess = false;
                        dataItem.processHtml = '分派';
                        idList.map( (ui, j) => {
                            if(ui == dataItem.userId){
                                dataItem.hasProcess = true;
                                dataItem.processHtml = '已分派';
                            }
                        })
                    })                              
                   
                    this.setState({
                        processedEmployees: processedEmployees,
                        employees: employees,
                         employeesLoading : false,
                    }); 
                }
            ),
            errorResult: (() => {
                this.setState({
                    employeesLoading : false,
                });
            })
        };
        AjaxRequest.sendRequest(options);

    }

    process = record => {
        const { requirementId, processedEmployees, employees } = this.state;
        const next = processedEmployees.concat(record);

        const newEmployees = employees.map((dataItem, i) => {
            if (record.userId == dataItem.userId) {
                dataItem.hasProcess = true;
                dataItem.processHtml = '已分派'
            }
            return dataItem;
        });
        
       // testF(record);
        
        this.prospectiveAssign(requirementId,next,newEmployees);
    }

    removeProcess = (record) => {
        const { requirementId, processedEmployees, employees } = this.state;
        const next = processedEmployees.concat(record);

        const newEmployees = [];
        employees.map((dataItem, i) => {
            if(record.userId == dataItem.userId){
                dataItem.hasProcess = false
                dataItem.processHtml = '分派'
            }
            newEmployees.push(dataItem)
        });

        const newNext = next.filter(key => key !== record);

        this.prospectiveAssign(requirementId,newNext,newEmployees);
    }

    handleSubmit = () => {
        
        const {submitting,processedEmployees, requirementId} = this.state
        //if(submitting) return;
        this.setState({
            submitting : true,
        })
        let _index = 0;
        let processedIds = '';
        processedEmployees.map((item, i) => {
            const userId = item.userId;
            processedIds += "&ids["+_index+"]="+userId;
            _index ++;
        });
        let param = "requirementId="+requirementId+processedIds;
        const options = {
            method: 'POST',
            url: `${API_URL.member.assignEmployee}?${param}`,
            doneResult: ( data => {
                    this.setState({ confirmLoading: false ,
                    employeeLoading : false,});
                    message.success('分派成功');
                    this.props.reload();
                    this.hide();
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    }


    /**
     * 获取项目详细信息
     * @param id
     */
    loadData = id => {
        this.setState({
            processedEmployees : [],
            requirement: null,
            fteList : [],
            city : '',
            employees : [],
            requirementId : id,
            employeesLoading : true,
            
        })
        const options = {
            method: 'get',
            url: `${API_URL.member.fteSettleInfo}?requirementId=${id}`,
            doneResult: ( data => {
                    const employees = data.data.employees
                    const newEmployees = [];
                    employees.map((dataItem, i) => {
                        dataItem.hasProcess = false
                        dataItem.processHtml = '分派'
                        newEmployees.push(dataItem)
                    });
                    this.setState({
                        processedEmployees : [],
                        requirement: data.data,
                        fteList : data.data.fteList,
                        city : data.data.city,
                        employees : newEmployees,
                        employeesLoading : false,
                        requirementId : id,
                        rejectHistory : data.data.rejectHistory,
                    });
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    }

    getColumns_processHistory = () => {
        const columns = [];
        const { fteList } = this.state;

        columns.push({
            title: '分派时间',
            dataIndex: 'processTime',
            key: 'processTime',
        }, {
            title: '分派人员',
            dataIndex: 'processUser',
            key: 'processUser',
            render : (text,record) => 
                {
                    return (
                        <span>
                            {
                            
                                record.processUser.map((user,i)=>{
                                    
                                    return(
                                        <a href="javascript:void(0)" 
                                        onClick={() => this.props.showEmployeeDetailModalRef(user.userId,user.employeeCode,user.userName)}>
                                        {user.userName}({user.employeeCode}){record.processUser.length > 1 ? ';' : '' }</a>
                                    );
                                    
                                })
                            }                            
                        </span>
                    );                    
                }
        }, {
            title: '拒绝时间',
            dataIndex: 'refuseTime',
            key: 'refuseTime',
            
        }, {
            title: '被拒绝原因',
            dataIndex: 'refuseReason',
            key: 'refuseReason',
        });
        return columns;
    }


    getColumns_requirement = () => {
        const columns = [];
        const { fteList } = this.state;

        columns.push({
            title: '时间',
            dataIndex: 'time',
            key: 'time',
        });
        fteList.map((fte, i) => {
            const time = `${fte.year}.${fte.month}`;
            columns.push({
                title: time,
                dataIndex: time,
                key: time,
            });
        });
        return columns;
    }

    getColumns_employees = () => {
        const columns = [];
        const { fteList } = this.state;

        columns.push({
            title: '工号',
            dataIndex: 'employeeCode',
            key: 'employeeCode',
            width: 120,
            fixed: 'left',
            render: (text, record) => {
                return (
                    <span>
                    <a href="javascript:void(0)" onClick={() => this.props.showEmployeeDetailModalRef(record.userId,record.employeeCode,record.userName)}>{record.employeeCode}</a>
                </span>
                );
            },
        });
        columns.push({
            title: '姓名',
            dataIndex: 'employeeName',
            key: 'employeeName',
            width: 120,
            fixed: 'left',
        });
        fteList.map((fte, i) => {
            const time = `${fte.year}.${fte.month}`;
            columns.push({
                title: time,
                children: [{
                    title: '已分配',
                    dataIndex: `${time}_fte`,
                    key: `${time}_fte`,
                    sorter: true,
                }, {
                    title: '预分配',
                    dataIndex: `${time}_pfte`,
                    key: `${time}_pfte`,
                    sorter: true,
                }],
            });
        });
        columns.push({
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => (
                <span>
                    <a href="javascript:void(0)" disabled={record.hasProcess} onClick={this.process.bind(this, record)}>{record.processHtml}</a>
                </span>
                ),
        });
        return columns;
    }

    getDataSource_processHistory = () => {
        const { rejectHistory } = this.state;

        let retData = [];            

        if(rejectHistory != null){
            rejectHistory.map((reject,i) =>{
                let ret = {
                    processTime : reject.relateTime,
                    refuseTime : reject.createTime,
                    refuseReason : reject.remark,
                    processUser : reject.assignmentList,
                    id : reject.requirementTransactionId,
                };  
                retData.push(ret);              
            })
           
        }
        

        return retData;
    }

    getDataSource_requirement = () => {
        const ftes = [];
        const { fteList } = this.state;
        const fte_temp = {};
        fte_temp.time = 'FTE';
        fte_temp.id = 1;
        fteList.map((fte, i) => {
            const time = `${fte.year}.${fte.month}`;
            fte_temp[time] = fte.fte;
        });
        ftes.push(fte_temp);
        return ftes;
    }

    getDataSource_employees = () => {
        const { employees } = this.state;
        const totalFte = 0;
        const Newemployees = employees.map((employee, i) => {
            const fteList = employee.fteList;
            fteList.forEach(fte => {
                const time = `${fte.year}.${fte.month}`;
                employee[`${time}_fte`] = fte.fte;
                employee[`${time}_pfte`] = fte.pfte;
            });
            return employee;
        });
        return Newemployees;
    }
    handleTableChange = (pagination, filters, sorter) => {
        let newEmployees = [];
        if(this.state.employees.length > 0){
            this.state.employees.map((m,i) =>{
                newEmployees.push(m);
            })
            let rate = 1;
            if(sorter.order == "descend"){
                rate = -1;
            }
            else{
                rate = 1;
            }
            newEmployees.sort((a,b) =>{
                if(a[`${sorter.field}`] == null){
                     return -1 * rate;                    
                }
                else if( b[`${sorter.field}`] == null){
                     return 1 * rate;  
                }
                else 
                    return (a[`${sorter.field}`] - b[`${sorter.field}`]) * rate;
            })

            this.setState({
                employees : newEmployees
            })
                
        }       
    }


    render() {
        const { confirmLoading, visible, 
                    requirement, city, processedEmployees, 
                    employeesLoading,rejectHistory } = this.state;
        const requirementCode = requirement ? requirement.requirementCode : '';
        return (
            <Modal
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="processModal"
                wrapClassName="vertical-center-modal"
                width={"900px"}
                confirmLoading={confirmLoading}
            >
                <div style={{ textAlign: 'center' }}>
                    <label style={{ fontSize: `${16}px` }}>FTE需求处理</label>
                    <br />
                    <br />
                    <label>需求编号：</label>{requirementCode}
                    <label style={{ marginLeft: `${10}px` }}>城市：</label>{city}
                </div>
                <br />                
                <hr />
                {rejectHistory != null && rejectHistory.length > 0 ? (
                    <div style={{ marginTop: `${10}px` }}>
                        <label>分派历史记录</label>
                    </div>) : ('')
                }
                {rejectHistory != null && rejectHistory.length > 0 ? ( <br />) : ('')}
                {rejectHistory != null && rejectHistory.length > 0 ? ( 
                    <div className="content">
                        <Table
                            columns={this.getColumns_processHistory()}
                            dataSource={this.getDataSource_processHistory()}
                            rowKey={record => record.id}
                            pagination={false}
                            bordered
                            scroll={{x:this.state.fteList.length*100}}
                        />
                    </div>) 
                    : ('')}
                {rejectHistory != null && rejectHistory.length > 0 ? ( <br />) : ('')}
                {rejectHistory != null && rejectHistory.length > 0 ? ( <hr />) : ('')}
                
                <div style={{ marginTop: `${10}px` }}>
                    <label>本需求还未分配人员情况</label>
                </div>
                <br />
                <div className="content">
                    <Table
                        columns={this.getColumns_requirement()}
                        dataSource={this.getDataSource_requirement()}
                        rowKey={record => record.id}
                        pagination={false}
                        bordered
                        scroll={{x:this.state.fteList.length*100}}
                    />
                </div>
                <br />
                <hr />
                <div style={{ marginTop: `${10}px` }}>
                    <label>
                        符合需求人员-已被占用FTE情况
                    </label>
                </div>
                <br />
                <div className="content">
                    <Table
                        className="employees-table"
                        columns={this.getColumns_employees()}
                        dataSource={this.getDataSource_employees()}
                        pagination={false}
                        rowKey={record => record.userId}
                        loading={employeesLoading}
                        onChange={this.handleTableChange}
                        bordered
                        scroll={{x:this.state.fteList.length*2*130}}
                    />
                </div>
                <br />
                <hr />
                <div className="processModal-processedEmployees-div">
                    <label>
                        分派人员：
                    </label>
                    { processedEmployees.map((item, i) => (
                        <span><a onClick={this.removeProcess.bind(this, item)}>{item.employeeName}({item.employeeCode})</a></span>
                    ))}
                </div>
            </Modal>

        );
    }
}

export default ProcessModal;
