import $ from 'jquery';
import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Table, Input, Icon, Button, Popconfirm, Popover, message, Modal } from 'antd';
import API_URL from '../../common/url';
import './style/list.less';
import EditableCell from '../common/tableCell/TableCell';
import AjaxRequest from '../../common/AjaxRequest';
import moment from 'moment';

class CrfTable extends React.Component {

    state = {
      dataSource: [],
      columns:[],
      count: 0,
      scrollX: false,
      loading: false,
      tableColumns: [],
      requiredMap: new Map(),
      moduleDefineCode: null,
      moduleDefineId: null,
      hasChild: 0,
      sorter:this.props.sorter || {}
    };

    getSaveParam = (rowDataOriginal) => {
      const rowData = JSON.parse(JSON.stringify(rowDataOriginal));
      const paramsObj = {
        newParams: '',
        postObj: {}
      };
        let newParams = ``;
        newParams += `?typeName=${this.props.params.typeName}`;
        for (const key in rowData){
          if(typeof(rowData[key]) === "object"){
            if(rowData[key]["operationTypeTemp"] == "DELETE" || rowData[key]["operationTypeTemp"] == "UPDATE" || rowData[key]["operationTypeTemp"] == "INSERT"){
              rowData[key]["operationType"] = rowData[key]["operationTypeTemp"];
            }
            if(rowData[key].operationType != null && rowData[key].operationType != undefined){
              for(const keySec in rowData[key]){
                paramsObj.postObj[`indicators[${key}].${keySec}`] = rowData[key][keySec] ? rowData[key][keySec] : '';
                //newParams += `&indicators[${key}].${keySec}=${rowData[key][keySec] ? rowData[key][keySec] : ''}`;
              }
            }
          }else{
            newParams += '&'+ key + '=' + rowData[key];
          }
        }
        paramsObj.newParams = newParams;
        return paramsObj;
    }
  rowSave = (record, index) => {
    
    const { typeName } = this.props.params;
    const { requiredMap } = this.state;
    for(let [key,value] of requiredMap){
      if(record[key] == undefined || record[key] == "" ){
        Modal.error({title: `请输入${requiredMap.get(key)}`});
        return;
      }else if(record[key]){
        if(record[key]['value'] == "" || record[key]['value'] == undefined){
          Modal.error({title: `请输入${requiredMap.get(key)}`});
          return;
        }
      }
    }
    const paramsObj = this.getSaveParam(record);
    this.setState({
      loading: true
    })
    const options = {
            url: `${API_URL.execute.save}${paramsObj.newParams}`,
            data: {
                ...paramsObj.postObj,
                typeName,
            },
            method: 'post',
            dataType: 'json',
            doneResult: ( data => {
                const { dataSource } = this.state;
                record.key = record.key + "saveSuccess";
                for(var key in record){
                  if(record && record.child !== 1){
                    if(record[key]["operationTypeTemp"] == "INSERT" || record[key]["operationTypeTemp"] == "UPDATE" || record[key]["operationTypeTemp"] == "DELETE"){
                      dataSource[index][key]["operationType"] = dataSource[index][key]["operationTypeTemp"];
                      dataSource[index][key]["operationTypeTemp"] = "";
                    }
                  }else{
                    const dataIndex = this.getFatherIndex(record);
                    //dataSource[dataIndex]['children'][index].patientUserId = value.patientId;
                    if(record[key]["operationTypeTemp"] == "INSERT" || record[key]["operationTypeTemp"] == "UPDATE" || record[key]["operationTypeTemp"] == "DELETE"){
                      dataSource[dataIndex]['children'][index][key]["operationType"] = dataSource[dataIndex]['children'][index][key]["operationTypeTemp"];
                      dataSource[dataIndex]['children'][index][key]["operationTypeTemp"] = "";
                    }
                  }
                  
                }

                const clearOperationType =(obj) => {
                  for(const key in obj){
                    if(obj[key] && obj[key]["operationType"]){
                      delete obj[key]["operationType"];
                    }
                    if(obj[key] && obj[key]["operationTypeTemp"]){
                      delete obj[key]["operationTypeTemp"];
                    }
                  }
                  return obj
                }

                if(record && record.child !== 1){
                  if(data.rowNum){
                    dataSource[index].patientUserId = data.patientUserId;
                    dataSource[index].rowNum = data.rowNum;
                    // dataSource[index]["operationTypeTemp"] = "";
                    // dataSource[index]["operationType"] = ""
                    dataSource[index] = clearOperationType(dataSource[index]);
                  }
                  dataSource[index]["isSave"] = false;
                }else{
                  const dataIndex = this.getFatherIndex(record);
                  if(data.rowNum){
                    dataSource[dataIndex]['children'][index].patientUserId = data.patientUserId;
                    dataSource[dataIndex]['children'][index].rowNum = data.rowNum;
                    dataSource[dataIndex]['children'][index] = clearOperationType(dataSource[dataIndex]['children'][index]);
                  }
                  dataSource[dataIndex]['children'][index]["isSave"] = false;
                }
                
                this.setState({
                  dataSource,
                  loading: false
                });
                //Modal.success({title: "保存成功"});
                message.success('保存成功');
                return;
            }),
            errorResult: (data => {
              this.setState({
                loading: false
              });
            }),
            failResult: (data => {
              this.setState({
                loading: false
              });
            })
        };
        AjaxRequest.sendRequest(options);

  }
  showConfirm = (record, index) => {
    const _this = this;
      Modal.confirm({
          iconType: 'exclamation-circle',
          title: '确定要删除吗?',
          onOk() {
              _this.rowDelete(record, index);
          },
          onCancel() {
          },
      });
  }

  rowDelete = (record, index) => {
    if(record.patientUserId == -1 || record.rowNum == undefined){
      const { dataSource } = this.state;
      dataSource.splice(index,1);
      this.setState({dataSource},function(){
        if(dataSource.length == 0){
          const {tableColumns} = this.state;
          const { columns } = this.convertColumns(tableColumns);
          this.setState({
            columns
          })
        }
      });
      // Modal.success({title: "删除成功"});
      message.success('删除成功');
      return;
    }
    let newParams = ``;
        newParams += `?typeName=${this.props.params.typeName}`;
        newParams += `&patientUserId=${record.patientUserId}`
        newParams += `&rowNum=${record.rowNum}`;
    const { typeName } = this.props.params;
    this.setState({
      loading: true
    })
    const options = {
        url: `${API_URL.execute.deleteCrfRowData}${newParams}`,
        data: {
            typeName,
        },
        dataType: 'json',
        doneResult: ( data => {
            const dataSource = [...this.state.dataSource];
            if(record && record.child !== 1){
              dataSource.splice(index, 1);
            }else{
              const dataIndex = this.getFatherIndex(record);
              dataSource[dataIndex]['children'].splice(index, 1);
              if(dataSource[dataIndex]['children'].length == 0){
                dataSource.splice(dataIndex, 1);
              }
            }
            

            this.setState({ dataSource,loading: false },function(){
              if(dataSource.length == 0){
                const {tableColumns} = this.state;
                const { columns } = this.convertColumns(tableColumns);
                this.setState({
                  columns
                })
              }
            });
            //Modal.success({title: "删除成功"});
            message.success('删除成功');
            return;
        }),
        errorResult: (data => {
          this.setState({
            loading: false
          });
        }),
        failResult: (data => {
          this.setState({
            loading: false
          });
        })
    };
    AjaxRequest.sendRequest(options);
  }

  getVisitDate = (referencedActualDate, referencedActualCode, rowIndex, criteriaDefineId) => {
    let params = "";
    params += "referencedActualCode="+referencedActualCode;
    if(referencedActualDate == ""){
      params += "&referencedActualDate="+"";
    }else{
      params += "&referencedActualDate="+moment(referencedActualDate).format("YYYY-MM-DD");
    }
    const options = {
      url: `${API_URL.execute.getPlanVisitDate}?${params}`,
      dataType: 'json',
      doneResult: ( data => {
        const list = data.datas;
        if(list)
        list.map((value,index) => {
          if(value[1]){
            this.onCellChange(rowIndex, value[0], criteriaDefineId)(moment(value[1]).format("YYYY-MM-DD"),'value');
          }else{
            this.onCellChange(rowIndex, value[0], criteriaDefineId)("",'value');
          }
          

        })
        
      }),
    };
    AjaxRequest.sendRequest(options);
  }

  convertColumns = (tableColumns) => {
    const colHeaders = [];
    const columns = [];
    this.setState({
      scrollX: tableColumns.length * 135 - 50
    });
    const {dataSource} = this.state;
    const dataEmpty = dataSource.length === 0 ? true : false;
    const requiredMap = new Map();
    tableColumns.map((tableColumn, columnIndex) => {
        let title = tableColumn.moduleDefineName,
            type = tableColumn.criteriaDataType,
            webType = tableColumn.projectDefineWebType,
            dataIndex = tableColumn.moduleDefineCode,
            criteriaDefineId = tableColumn.criteriaDefineId,
            canAddComment = tableColumn.canAddComment,
            column = {},
            config = {
              isEdit: true,
              comment:{
                iscomment: false,
                //value: comment,
              },
              colorClass: "normal",
              type: {
                type: type,
                webType: webType,
                moduleDefineConstraintValue: tableColumn.moduleDefineConstraintValue,
                formatValue: tableColumn.formatValue
              },
              ...tableColumn
            };
            const sortedInfo = {}
        if(webType)
        column.dataIndex = dataIndex;
        column.type = type;
        column.webType = webType;
        column.sorter = true;
        column.sortOrder = this.state.sorter.columnKey === tableColumn.moduleDefineCode && this.state.sorter.order;
        if(type === "DATE"){
          column.width = 130;
        }
        if(tableColumn.canAddComment == 1){
          config.comment.iscomment = true;
        }
        //@todo config comment;
        column.title = (<p style={{display:"inline-block"}}>{title.split("\r\n").map((i,index) => {
          return <p>{i}</p>;
        })}</p>);
        //column.title = title;
        if(dataIndex !== "op" && title != '录入者' && canAddComment !== 1){
          if(columnIndex == 1){//当第一列且有加号的时候特殊处理
            column.render = (text, record, index) => {
              config.isEdit = true;//放弃使用config中的isEdit判断是否可编辑，因为config外部引用问题有bug。
              let isEdit = true;
              if(record){
                if(record.editable == 0){
                  isEdit = false;
                }
              }
              if(text){
                if(text.editable == 0){
                  isEdit = false;
                }
              }
              let cellDom;
              if(record.children && record.children.length > 0){
                cellDom = <div style={{paddingLeft:'20px'}}><EditableCell
                  cellValue = {text}
                  onChange = {this.onCellChange(index, dataIndex, criteriaDefineId, false, record)}
                  onPatientCodeChange = {this.onPatientCodeChange(index, dataIndex, criteriaDefineId, record)}
                  config = {config}
                  isEdit = {isEdit}
                /></div>
              }else{
                cellDom = <EditableCell
                  cellValue = {text}
                  onChange = {this.onCellChange(index, dataIndex, criteriaDefineId, false, record)}
                  onPatientCodeChange = {this.onPatientCodeChange(index, dataIndex, criteriaDefineId, record)}
                  config = {config}
                  isEdit = {isEdit}
                />
              }
              return (
                !dataEmpty ?
                  cellDom
                :
                null
              )
            }
          }else{
            column.render = (text, record, index) => {
              config.isEdit = true;
              let isEdit = true;
              if(record){
                if(record.editable == 0){
                  isEdit = false;
                }
              }
              if(text){
                if(text.editable == 0){
                  isEdit = false;
                }
              }
              return (
                !dataEmpty ?
                <EditableCell
                  cellValue = {text}
                  onChange = {this.onCellChange(index, dataIndex, criteriaDefineId, false, record)}
                  onPatientCodeChange = {this.onPatientCodeChange(index, dataIndex, criteriaDefineId, record)}
                  config = {config}
                  isEdit = {isEdit}
                />
                :
                null
              )
            }
          }
          
          // if(columns.length == 0){
          //   column.fixed = 'left';
          // }
          if(tableColumn.moduleDefineIsRequired == "1"){
            requiredMap.set(tableColumn.moduleDefineCode,tableColumn.moduleDefineName)
          }
          
          columns.push(column);
        }else if(title == '录入者' && canAddComment !== 1){
          const {moduleDefineCode, moduleDefineId} = tableColumn;
          this.setState({
            moduleDefineCode,
            moduleDefineId
          })
          column.render = (text, record, index) => {
            if(text){
              return (
                <span>{text.value}</span>
              )
            }else{
              return (
                <span></span>
              )
            }
            
          }
          columns.push(column);
        }else if(canAddComment == 1){
          column.render = (text, record, index) => {
            let isEdit = true;
            config.isEdit = true;
            if(record){
              if(record.editable === 0){
                isEdit = false;
              }
            }
            if(text){
              if(text.editable === 0){
                isEdit = false;
              }
            }
            return (
              !dataEmpty ?
              <EditableCell
                cellValue = {text}
                onChange = {this.onCellChange(index, dataIndex, criteriaDefineId, true, record)}
                onPatientCodeChange = {this.onPatientCodeChange(index, dataIndex, criteriaDefineId, record)}
                config = {config}
                isEdit = {isEdit}
              />
              :
              null
            )
          }
          if(tableColumn.moduleDefineIsRequired == "1"){
            requiredMap.set(tableColumn.moduleDefineCode,tableColumn.moduleDefineName)
          }
          columns.push(column);
        }
    });
    this.setState({
      requiredMap
    })
    // columns.push({
    //   title: '录入者',
    //   dataIndex: 'userCompellation',
    //   key: 'userCompellation',
    //   sorter: true
    // });
    const canEdit = (sessionStorage.siteId > 0 && sessionStorage.curRole == 'CRC') || sessionStorage.curRole == 'PM';
    if (canEdit){
      let fixed = "right";
      if(this.state.hasChild === 1){
        fixed = false;
      }
      const opColumn = {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        fixed: fixed,
        width: 100,
        render:  (text, record, index) => {
          // return  (
          //     <div>
          //       {
          //         record.isSave ?
          //           <Button type="primary" onClick={this.rowSave.bind(this,record,index)}>保存</Button>
          //           : <Button type="primary" onClick={this.rowSave.bind(this,record,index)} disabled>保存</Button>
          //       }
          //       <Button type="danger" onClick={this.rowDelete.bind(this,record,index)}>删除</Button>
          //     </div>
          // )
          //if(text){
            if(record.children && record.children.length > 0){
              return (<div className="editable-cell"> - </div>)
            }else{
              return (
                !dataEmpty ?
                <div className="editable-cell">
                    {
                      record.isSave ?
                      <a onClick={this.rowSave.bind(this,record,index)}>保存</a>
                      :
                      <a className="aDisabled">保存</a>
                    }
                    {
                      sessionStorage.curRole == 'CRC' && 
                      <span>
                      <span className="ant-divider">
                      </span>
                      {record.deleteable == 1 ?
                      <a onClick={this.showConfirm.bind(this,record,index)}>删除</a>
                      :
                      <a className="aDisabled">删除</a>}
                      </span>
                    }
                </div>
                :
                null
              );
            }
          //}
           
        },
      };
      columns.push(opColumn);
    }
    return {
        columns,
    };
  }
  
  handleTableChangePre = (pagination, filters, sorter) => {
    this.setState({
      filters,
      sorter,
      
    },function(){
      const {dataSource} = this.state;
      let countNeedSave = 0;
      dataSource.map((value,index) =>{
        if(value["isSave"] == true){
          countNeedSave++
        }
      })
      if(countNeedSave !== 0 ){
        const _this = this;
        Modal.confirm({
          title: '数据尚未保存，确定不做保存继续当前操作吗？',
          okText: '确认',
          cancelText: '取消',
          onOk(){
            _this.handleTableChange(pagination, filters, sorter)
          },
        });
      }else{
        this.handleTableChange(pagination, filters, sorter);
      }
    })

  }


  handleTableChange = (pagination, filters, sorter = {}) => {
    const pager = { ...this.state.pagination };
    if (pager.current == pagination.current){
        pager.current = 1;
    } else {
        pager.current = pagination.current;
    }
    this.setState({
        pagination: pager
    },() =>{
      this.props.loadData({
          offset: pager.current,
          limit: pagination.pageSize,
          sort: sorter.field,
          direction: sorter.order == 'descend' ? 'DESC' : 'ASC',
          sorter: {
            columnKey: sorter.columnKey,
            order: sorter.order 
          }
      });
    });
    
  }

  convertDataSource = dataSource =>{
      const data = [];
      let key=0;
      dataSource.map( rowData => {
          rowData["key"] = rowData.key;
          key++;
          rowData["isSave"] = false;
          if(rowData.children && rowData.children.length > 0){
            rowData.children.map((value, index) => {
              value["key"] = value.key;
              key++;
              value["isSave"] = false;
            })
          }
          data.push(rowData);
      })
      this.setState({count : key});
      return {data};
  }

  getFatherIndex = (record) =>{
    const dataSource = this.state.dataSource;
    let dataIndex;
    dataSource.map((father, fatherIndex) => {
      if(father['children']){
        father['children'].map((child, childIndex) => {
          if(child.key == record.key){
            dataIndex = fatherIndex;
          }
        })
      }
    })
    return dataIndex;
  }

  onCellChange = (index, key, criteriaDefineId, special, record) => {

    return (value,type) => {
      if(special && type !== "comment"){
          this.getVisitDate(value, key, index, criteriaDefineId);
      }
      const dataSource = [...this.state.dataSource];
      
      if((record && record.child) !== 1 || record.child == undefined){
          if(!dataSource[index][key]){
            dataSource[index][key] = {
              comment : "",
              criteriaDefineId : criteriaDefineId,
              operationType : "",
              value : "",
              operationTypeTemp: "INSERT",
              editable: 1
            }
            if(type !== "comment"){
              if(value !== ""){
                dataSource[index][key]['value'] = value;
              }
            }
        }else{
            dataSource[index][key]["operationTypeTemp"] = "";
            if(value == "" || value == undefined){
              dataSource[index][key]["operationTypeTemp"] = "DELETE";
            }else if(dataSource[index][key]["operationType"] == "INSERT"){
              dataSource[index][key]["operationTypeTemp"] = "UPDATE";
            }else if(dataSource[index][key]["operationType"] == "UPDATE" || dataSource[index][key]["operationType"] == undefined){
              dataSource[index][key]["operationTypeTemp"] = "UPDATE";
            }else if(dataSource[index][key]["operationType"] == "" || dataSource[index][key]["operationType"] == "DELETE"){
              dataSource[index][key]["operationTypeTemp"] = "INSERT";
            }
        }
          dataSource[index][key][type] = value;
          dataSource[index]["isSave"] = true;
      }else{//分割线
        // let childIndex;
        // dataSource[index].children.map((value,index) => {
        //   if(value.key == record.key){
        //     childIndex = index;
        //   }
        // })
        const dataIndex = this.getFatherIndex(record);
        if(dataSource[dataIndex] && dataSource[dataIndex]['children'])
        if(!dataSource[dataIndex]['children'][index][key]){
            dataSource[dataIndex]['children'][index][key] = {
              comment : "",
              criteriaDefineId : criteriaDefineId,
              operationType : "",
              value : "",
              operationTypeTemp: "INSERT",
              editable: 1
            }
            if(type !== "comment"){
              if(value !== ""){
                dataSource[dataIndex]['children'][index][key]['value'] = value;
              }
            }
        }else{
            dataSource[dataIndex]['children'][index][key]["operationTypeTemp"] = "";
            if(value == "" || value == undefined){
              dataSource[dataIndex]['children'][index][key]["operationTypeTemp"] = "DELETE";
            }else if(dataSource[dataIndex]['children'][index][key]["operationType"] == "INSERT"){
              dataSource[dataIndex]['children'][index][key]["operationTypeTemp"] = "UPDATE";
            }else if(dataSource[dataIndex]['children'][index][key]["operationType"] == "UPDATE" || dataSource[dataIndex]['children'][index][key]["operationType"] == undefined){
              dataSource[dataIndex]['children'][index][key]["operationTypeTemp"] = "UPDATE";
            }else if(dataSource[dataIndex]['children'][index][key]["operationType"] == "" || dataSource[dataIndex]['children'][index][key]["operationType"] == "DELETE"){
              dataSource[dataIndex]['children'][index][key]["operationTypeTemp"] = "INSERT";
            }
        }
          dataSource[dataIndex]['children'][index][key][type] = value;
          dataSource[dataIndex]['children'][index]["isSave"] = true;
      }


      
      
      this.setState({ dataSource }, () =>{
      });
    };
  }

  onPatientCodeChange = (index,key,criteriaDefineId, record) => {
    return (value,type) => {
      const { dataSource } = this.state;
      if(record && record.child !== 1){
        const rowObj = dataSource[index];
        if(rowObj.key && rowObj.key.endsWith("new5efk")){
          dataSource[index].patientUserId = value.patientId;
        }
        dataSource[index].newPatientUserId = value.patientId;
        
      }else{
        const dataIndex = this.getFatherIndex(record);
        if(rowObj.key && rowObj.key.endsWith("new5efk")){
          dataSource[dataIndex]['children'][index].patientUserId = value.patientId;
        }
        dataSource[dataIndex]['children'][index].newPatientUserId = dataSource[dataIndex]['children'][index].patientUserId;
      }
      this.setState({dataSource});
    };
  }

  handleAdd = () => {
    const { count, dataSource, moduleDefineCode, criteriaDefineId} = this.state;
    const newData = {
      key: count + "new5efk",
      patientUserId: -1,
      isSave: true,
      [moduleDefineCode]:{
        comment: "",
        criteriaDefineId: criteriaDefineId,
        operationType: "",
        operationTypeTemp: "INSERT",
        value: sessionStorage.userName
      },
      editable: 1
    };
    this.setState({
      dataSource: [newData, ...dataSource],
      count: count + 1,
    },function(){
      const {tableColumns} = this.state;
      const { columns } = this.convertColumns(tableColumns);
      this.setState({
        columns
      })
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({dataSource:[],columns:[],count:0,pagination:this.props.pagination},function(){
        const { tableColumns, tableDatas, loading,hasChild } = nextProps;
          this.setState({
            dataSource: this.convertDataSource(tableDatas).data,
            tableColumns,
            loading: loading,
            hasChild,
            sorter: nextProps.sorter || {}
        },function(){
            const { columns } = this.convertColumns(tableColumns);
            this.setState({columns})
        });
    })
        
  }

  render() {
    const {dataSource, columns, scrollX, loading} = this.state;
    return (
          <div>
            <Table bordered dataSource={dataSource} onChange={this.handleTableChangePre}
            pagination={this.props.pagination} columns={columns} loading={loading} scroll={{ x: scrollX}} className='table-cell-row crf-table' />
          </div>
    );
  }
}

export default CrfTable;