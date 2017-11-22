/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import {Button, Table, Popconfirm, message, Modal} from 'antd';
import ExecuteMgrSider from './ExecuteMgrSider';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';
import AddModuleDefine from './AddModuleDefine';
import SetModuleDefineOption from './SetModuleDefineOption';
import SortList from '../common/SortList';

const confirm = Modal.confirm;

class Crf extends React.Component {
    state = {
        loading: false,
        dataList: [],
        crfDefineId: '',
        typeName: '',
    };

    loadData = (typeName) => {
        if (typeName == null || typeName == undefined){
            typeName = this.state.typeName;
        }
        this.setState({
            loading: true,
        });
        const options = {
            url: `${API_URL.execute.getCategoryTree}`,
            data: {
                typeName,
                isDefine: 1,
            },
            dataType: 'json',
            doneResult: ( data => {
                    this.setState({
                        loading: false,
                        dataList: data.data.tableColumns,
                        crfDefineId: data.data.crfDefineId,
                    });
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    };

    getColumns = () => {
        const columnNames = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
        }, {
            title: '字段名称',
            dataIndex: 'moduleDefineName',
            key: 'moduleDefineName',
        }, {
            title: '字段类型',
            dataIndex: 'criteriaDataType',
            key: 'criteriaDataType',
        }, {
            title: '填写方式',
            dataIndex: 'projectDefineWebType',
            key: 'projectDefineWebType',
        }, {
            title: '是否必填',
            dataIndex: 'moduleDefineIsRequired',
            key: 'moduleDefineIsRequired',
        }, {
            title: '可选项',
            dataIndex: 'options',
            key: 'options',
        }, {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => {
                const dis = record.projectDefineIsDefault == '1';
                let disOption = true;
                if (dis == false && (record.projectDefineWebType == '单选' || record.projectDefineWebType == '多选' || record.projectDefineWebType == '下拉框')){
                    disOption = false;
                }
                let deleteDis = dis == true || (dis == false && record.options) ? true : false;
                return (
                    <span>
                        <a href="javascript:void(0)" disabled={dis} onClick={() => this.edit(record.moduleDefineId)}>修改</a>
                        <span className="ant-divider"/>
                        <Popconfirm title={'确定要删除吗?'} onConfirm={() => this.del(record.moduleDefineId, 0)} okText="确定" cancelText="取消">
                            <a href="javascript:void(0)" disabled={deleteDis}>删除</a>
                        </Popconfirm>
                        <span className="ant-divider"/>
                        <a href="javascript:void(0)" disabled={disOption} onClick={() => this.setOption(record.moduleDefineId)}>设置可选项</a>
                    </span>
                );
            },
        }];
        return columnNames;
    };

    getCriteriaDataTypeInfo = (criteriaDateType) => {
        if (criteriaDateType == 'DATE') {
            return '时间型'
        }
        if (criteriaDateType == 'NUMBER') {
            return '数值型';
        }
        return '文本型';
    };

    getWebTypeInfo = (dataType, webType, formatValue) => {
        if (dataType == 'NUMBER') {
            return '文本框(数字格式：' + (formatValue ? formatValue : '0') + ')';
        }
        if (dataType == 'DATE') {
            if (formatValue == 'YYYY-MM-DD HH:MI') {
                return '时间控件(年月日时分)';
            }
            if (formatValue == 'YYYY-MM') {
                return '时间控件(年月)';
            }
            return '时间控件(年月日)';
        }
        if (webType == 'RADIO') {
            return '单选';
        }
        if (webType == 'CHECKBOX') {
            return '多选';
        }
        if (webType == 'INPUT') {
            return '文本框';
        }
        if (webType == 'TEXTAREA') {
            return '文本域';
        }
        if (webType == 'SELECT') {
            return '下拉框';
        }
        return '未知格式';
    };

    handleModuleDefineAction = (value, confirm) => {
        if(confirm == null || confirm == undefined){
            confirm = 0;
        }
        const { crfDefineId } = this.state;
        const { typeName } = this.props.match.params;
        if (value.moduleDefineId == 0) {
            const dataObj = {
                datas: [{...value}],
            };
            const options = {
                url: `${API_URL.execute.addExecuteDefine}`,
                data: {
                    investigationId: sessionStorage.invId,
                    typeName,
                    crfDefineId,
                    confirm,
                    datas: JSON.stringify(dataObj),
                },
                method:'POST',
                dataType: 'json',
                doneResult: ( data => {
                    if(confirm == 0 && data.confirmError){
                        this.showConfirm(value, data.confirmError);
                    } else {
                        this.loadData(typeName);
                    }
                }),
                errorResult: ( data => {
                    this.setState({
                        loading: false,
                    });
                }),
            };
            AjaxRequest.sendRequest(options);
        } else {
            const options = {
                url: `${API_URL.execute.updateExecuteDefine}`,
                data: {
                    moduleDefineId: value.moduleDefineId,
                    moduleDefineName: value.moduleDefineName,
                    typeName,
                    projectDefineWebType: value.projectDefineWebType,
                    moduleDefineIsRequired: value.moduleDefineIsRequired,
                    formatValue: value.formatValue,
                },
                dataType: 'json',
                doneResult: ( data => {
                    message.success("设置成功");
                    this.loadData(typeName);
                }),
                errorResult: ( data => {
                    this.setState({
                        loading: false,
                    });
                }),
            };
            AjaxRequest.sendRequest(options);
        }
    };

    showConfirm = (value, content) => {
        const _this= this;
        confirm({
            title: '确认添加',
            content: content,
            onOk() {
                _this.handleModuleDefineAction(value, 1);
            },
            onCancel() {},
        });
    }

    handleModuleDefineOptionAction = (dataList, moduleDefineId, investigationExecuteDefineId) => {
        let str = '?';
        let idx = 0;
        dataList.map((item, i) => {
            if (!StringUtil.isNull(item.text)){
                if (idx > 0) {
                    str += '&';
                }
                str = str + "arrays[" + idx + "]=" + item.text;
                idx++;
            }
        });
        const url = `${API_URL.execute.updateExecuteDefineOption}` + str;
        const {typeName} = this.props.match.params;

        const options = {
            url,
            data: {
                moduleDefineId,
                typeName,
            },
            dataType: 'json',
            doneResult: ( data => {
                message.success("设置成功");
                this.loadData(typeName);
            }),
            errorResult: ( data => {
                this.setState({
                    loading: false,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    getDataSource = () => {
        const resList = [];
        const {dataList} = this.state;
        let idx = 1;
        dataList.map((dataItem, i) => {
            if (dataItem.moduleDefineName != '录入者') {
                resList.push({
                    index: idx,
                    moduleDefineId: dataItem.moduleDefineId,
                    criteriaDefineId: dataItem.criteriaDefineId,
                    moduleDefineName: dataItem.moduleDefineName,
                    moduleDefineCode: dataItem.moduleDefineCode,
                    criteriaDataType: this.getCriteriaDataTypeInfo(dataItem.criteriaDataType),
                    projectDefineWebType: this.getWebTypeInfo(dataItem.criteriaDataType, dataItem.projectDefineWebType, dataItem.formatValue),
                    moduleDefineIsRequired: dataItem.moduleDefineIsRequired == '1' ? '是' : '否',
                    projectDefineIsDefault: dataItem.projectDefineIsDefault,
                    options: dataItem.moduleDefineConstraintValue ? StringUtil.replaceAll(dataItem.moduleDefineConstraintValue, '//', ';') : '',
                });
                idx++;
            }
        });
        return resList;
    };

    /**
     * 添加
     */
    add = () => {
        this.addModuleDefineRef.show();
    }

    /**
     * 排序调整
     */
    sort = () => {
        const {dataList} = this.state;
        const sortList = [];
        dataList.map(item => {
            if (item.moduleDefineName != '录入者'){
                sortList.push({
                    key: item.moduleDefineCode,
                    name: item.moduleDefineName,
                });
            }
        });
        this.sortListRef.show(sortList);
    }

    /**
     * 修改
     */
    edit = id => {
        const {dataList} = this.state;
        dataList.map((dataItem, i) => {
            if (dataItem.moduleDefineId == id) {
                this.addModuleDefineRef.show(dataItem, 1);
            }
        });
    };

    /**
     * 删除
     */
    del = (id, confirm) => {
        const {typeName} = this.props.match.params;
        const options = {
            url: `${API_URL.execute.deleteExecuteDefine}`,
            data: {
                moduleDefineId: id,
                typeName,
                confirm,
            },
            dataType: 'json',
            doneResult: ( data => {
                if(data.confirmError){
                    this.confirmDel(id, data.confirmError);
                } else {
                    this.loadData(typeName);
                }
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    confirmDel = (id, confirmError) => {
        const _this = this;
        Modal.confirm({
          iconType: 'exclamation-circle',
          title: confirmError,
          onOk() {
              _this.del(id, 1);
          },
          onCancel() {
          },
      });
    }

    /**
     * 设置可选项
     */
    setOption = id => {
        const {dataList} = this.state;
        dataList.map((dataItem, i) => {
            if (dataItem.moduleDefineId == id) {
                this.setModuleDefineOptionRef.show(dataItem, 1);
            }
        });
    };

    componentDidMount() {
        const {typeName} = this.props.match.params;
        this.setState({
            typeName: typeName,
        });
        this.loadData(typeName);
    }

    componentWillReceiveProps(nextProps) {
        const {typeName} = nextProps.match.params;
        this.setState({
            typeName: typeName,
        });
        this.loadData(typeName);
        this.siderRef.selectKey(typeName);
    }

    getTitle = (typeName) => {
        if ('Type_Visit' == typeName) {
            return '访视记录';
        }
        if ('Type_Pre_Filter' == typeName) {
            return '预筛记录';
        }
        if ('Type_Drop' == typeName) {
            return '脱落记录';
        }
        if ('Type_Violation' == typeName) {
            return '重大违背记录';
        }
        if ('Type_SAE' == typeName) {
            return 'SAE记录';
        }
        return null;
    }

    render() {
        const {loading, match} = this.props;
        const {typeName} = match.params;
        const name = this.getTitle(typeName);
        return (
            <div className="content">
                <ExecuteMgrSider selectKey={typeName} ref={el => {this.siderRef = el;}} />
                <div className="main">
                    <div className="breadcrumb-bar tac">
                        <h2 className="title">{name}</h2>
                    </div>
                    <div className="filter-bar tar">
                        <Button type="primary" onClick={this.sort}>排序调整</Button>
                        <Button type="primary" onClick={this.add}>添加</Button>
                    </div>
                    <div className="main-content">
                        <Table
                            columns={this.getColumns()}
                            dataSource={this.getDataSource()}
                            rowKey={record => record.moduleDefineId}
                            loading={loading}
                            pagination={false}
                        />
                    </div>
                </div>
                <AddModuleDefine
                    ref={el => {this.addModuleDefineRef = el;}}
                    handleModuleDefineAction={this.handleModuleDefineAction}
                />
                <SetModuleDefineOption
                    ref={el => {this.setModuleDefineOptionRef = el;}}
                    handleModuleDefineOptionAction={this.handleModuleDefineOptionAction}
                />
                <SortList ref={el => { this.sortListRef = el; }}
                                reload={this.loadData}
                                sortUrl={`${API_URL.execute.sortExecuteDefine}`}
                                title={name + "-排序调整"}
                                data={{typeName,}}
                />
            </div>
        );
    }
}

export default Crf;
