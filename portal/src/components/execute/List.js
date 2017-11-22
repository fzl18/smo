import $ from 'jquery';
import React from 'react';
import { message, Popconfirm, Modal, Button } from 'antd';
import Handsontable from '../../common/handsontable/src/index';
import HotTable from '../common/react-handsontable/HotTable';
import API_URL from '../../common/url';
import $ from '../../common/XDomainJquery';

const confirm = Modal.confirm;

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            colHeaders: [],
            columns: [],
        };
    }

    /**
     * 表头设置 和 columns设置
     * @param tableColumns
     * @returns {{colHeaders: {}, columns: Array}}
     */
    trimSettings = tableColumns => {
        const colHeaders = [];
        const columns = [];
        tableColumns.map(tableColumn => {
            let name = tableColumn.moduleDefineName,
                type = tableColumn.criteriaDataType.toLowerCase(),
                code = tableColumn.moduleDefineCode,
                column = {};

            colHeaders.push(name);

            if (code === 'op') {
                column.readOnly = true;
                column.renderer = this.opHtmlRenderer;
            }
            if (type === 'date') {
                column.dateFormat = 'YYYY-MM-DD';
            }
            column.data = `${code}.value`;
            column.type = type;
            columns.push(column);
        });
        return {
            colHeaders,
            columns,
        };
    }

    /**
     * 操作单元格渲染
     * @param hotInstance
     * @param td
     * @param row
     * @param col
     * @param prop
     * @param value
     * @param cellProperties
     */
    opHtmlRenderer = (hotInstance, td, row, col, prop, value, cellProperties) => {
        let _this = this,
            saveBtn = document.createElement('button'),
            delBtn = document.createElement('button');
        saveBtn.innerHTML = '保存';
        delBtn.innerHTML = '删除';
        Handsontable.dom.addEvent(saveBtn, 'click', e => {
            _this.save(cellProperties.row);
        });
        Handsontable.dom.addEvent(delBtn, 'click', e => {
            _this.showConfirm(cellProperties.row);
        });
        Handsontable.dom.empty(td);
        td.appendChild(saveBtn);
        td.appendChild(delBtn);
    }

    /**
     * 新增行
     */
    add = () => {
        const { datas } = this.state;
        datas.unshift({});
        this.setState({
            datas,
        });
    }

    afterChange = (change, source) => {
        if (source === 'loadData') {
             // don't save this change
        }
    }

    save = rowIndex => {
        const rowData = this.ht.hotInstance.getSourceDataAtRow(rowIndex);

        // 得到插入的备注
        const ColumnSettings = this.ht.hotInstance.getCellMetaAtRow(rowIndex);
        const params = this.getSaveParam(rowData, ColumnSettings);

        $.ajax({
            method: 'get',
            url: `${API_URL.execute.save}${params}`,
            type: 'json',
        }).done(result => {
            if (!result.error) {
                message.success('保存成功');
            } else {
                Modal.error({ title: result.error });
            }
        });
    }

    /**
     * 处理保存时的params
     * @param params
     * @returns {string}
     */
    getSaveParam = (rowData, ColumnSettings) => {
        let newParams = '';
        const { patientUserId, rowNum } = rowData;
        const { tableColumns } = this.props;

        newParams += `?investigationId=${120}`;
        newParams += `&investigationSiteId=${7}`;
        newParams += `&typeName=${this.props.params.typeName}`;
        newParams += `&patientUserId=${patientUserId || -1}`;
        newParams += `&roleId=${1}`;
        newParams += `&rowNum=${rowNum || -1}`;

        for (const key in rowData) {
            const param = rowData[key];
            let criteriaDefineId,
                comment;

            // 查找 criteriaDefineId
            for (let i = 0; i < tableColumns.length; i++) {
                if (key === tableColumns[i].moduleDefineCode) {
                    criteriaDefineId = tableColumns[i].criteriaDefineId;
                    break;
                }
            }

            // 查找 comment
            for (let l = 0; l < ColumnSettings.length; l++) {
                const prop = ColumnSettings[l].prop;
                if (typeof prop === 'string' && prop.indexOf(key) > -1 && ColumnSettings[l].comment) {
                    comment = ColumnSettings[l].comment.value;
                    break;
                }
            }

            if (typeof param === 'object') {
                newParams += `&indicators[${key}].criteriaDefineId=${criteriaDefineId}`;
                if (param.operationType && !param.value && !comment) {
                    newParams += `&indicators[${key}].operationType=DELETE`;
                } else {
                    newParams += `&indicators[${key}].operationType=${param.operationType || 'INSERT'}`;
                    newParams += `&indicators[${key}].value=${param.value ? encodeURIComponent(param.value) : ''}`;
                    newParams += `&indicators[${key}].comment=${comment ? encodeURIComponent(comment) : ''}`;
                }
            }
        }
        return newParams;
    }

    del = rowIndex => {
        const { datas } = this.state;
        if (datas[rowIndex].patientUserId) {
            let newParams = '';
            const params = this.ht.hotInstance.getSourceDataAtRow(rowIndex);
            const { patientUserId, rowNum } = params;

            newParams += `?investigationId=${120}`;
            newParams += `&investigationSiteId=${7}`;
            newParams += `&typeName=${this.props.params.typeName}`;
            newParams += `&patientUserId=${patientUserId}`;
            newParams += `&roleId=${1}`;
            newParams += `&rowNum=${rowNum}`;

            $.ajax({
                method: 'get',
                url: `${API_URL.execute.deleteCrfRowData}${newParams}`,
                type: 'json',
            }).done(result => {
                if (!result.error) {
                    this.spliceRow(rowIndex);
                } else {
                    Modal.error({ title: result.error });
                }
            });
        } else {
            this.spliceRow(rowIndex);
        }
    }

    /**
     * 假删除行
     * @param rowIndex
     */
    spliceRow = rowIndex => {
        const { datas } = this.state;
        datas.splice(rowIndex, 1);
        this.setState({
            datas,
        });
        message.success('删除成功');
    }

    /**
     * 确认删除
     * @param rowIndex
     */
    showConfirm = rowIndex => {
        var _this = this;
        confirm({
            iconType: 'exclamation-circle',
            title: '确定要删除吗?',
            onOk() {
                _this.del(rowIndex);
            },
            onCancel() {
            },
        });
    }

    componentWillReceiveProps(nextProps) {
        const { tableColumns, tableDatas } = nextProps;
        const { colHeaders, columns } = this.trimSettings(tableColumns);
        this.setState({
            datas: tableDatas,
            colHeaders,
            columns,
        });
    }

    render() {
        const { datas, colHeaders, columns } = this.state;
        const { tableColumns } = this.props;

        // 获取备注 cells
        const cell = [];
        if (tableColumns.length && datas.length) {
            datas.forEach((data, i) => {
                let cellObj;
                for (const key in data) {
                    if (typeof data[key] === 'object') {
                        for (let n = 0; n < tableColumns.length; n++) {
                            if (key === tableColumns[n].moduleDefineCode) {
                                if (data[key].comment) {
                                    cellObj = {
                                        row: i,
                                        col: n,
                                        comment: { value: decodeURIComponent(data[key].comment) },
                                    };
                                    cell.push(cellObj);
                                }
                                break;
                            }
                        }
                    }
                }
            });
        }
        return (
            <div className="hot-table-wrap">
                <Button className="add-btn" icon="save" onClick={this.add}>新增</Button>
                <div className="hot-table">
                    <HotTable
                        {...this.state}
                        data={datas}
                        colHeaders={colHeaders}
                        columns={columns}
                        afterChange={this.afterChange}
                        root="hot"
                        ref={el => { this.ht = el; }}
                        rowHeaders
                        autoWrapRow
                        contextMenu
                        comments
                        stretchH="all"
                        width={1000}
                        height={200}
                        fixedColumnsLeft={2}
                        cell={cell}
                    />
                </div>
            </div>
        );
    }
}

export default List;
