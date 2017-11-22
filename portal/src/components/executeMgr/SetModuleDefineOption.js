/**
 * Created by casteloyee on 2017/7/15.
 */
import React, { Component } from 'react';
import { Input, Modal, Button, Select, message, Row, Col, Radio, Icon } from 'antd';

const Option = Select.Option;
const RadioGroup = Radio.Group;

class SetModuleDefineOption extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            investigationExecuteDefineId: 0,
            dataList: [],
        };
    }

    show = (dataItem, mongo) => {
        if (dataItem){
            let dataList = [];
            if (mongo == 1 && dataItem.moduleDefineConstraintValue){
                dataItem.moduleDefineConstraintValue.split("//").map((item, i) => {
                    dataList.push({
                        item: i + 1,
                        text: item,
                    });
                });
            } else if (mongo == 0 && dataItem.options){
                dataItem.options.map((item, i) => {
                    dataList.push({
                        item: i + 1,
                        text: item,
                    });
                });
            }
            this.setState({
                investigationExecuteDefineId: dataItem.investigationExecuteDefineId,
                moduleDefineId: dataItem.moduleDefineId,
                dataList,
                visible: true,
            });
        } else {
            this.setState({
                visible: true,
            });
        }
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    add = () => {
        const { dataList } = this.state;
        const idx = dataList.length == 0 ? 1 : dataList[dataList.length-1].item + 1;
        dataList.push({
            item: idx,
            text:'',
        });
        this.setState({
            dataList,
        });
    };

    del = (idx, e) => {
        const { dataList } = this.state;
        dataList.map((item, i) => {
            if (item.item == idx){
                dataList.splice(i, 1);
            }
        });
        this.setState({
            dataList,
        });
    };

    onInputChange = (idx, e) => {
        const { dataList } = this.state;
        dataList.map((item, i) => {
            if (item.item == idx){
                item.text = e.target.value;
            }
        });
        this.setState({
            dataList,
        });
    };

    getOptionList = () => {
        const { dataList } = this.state;
        return (
            <ul>
                {
                    dataList.map((item, i) => (
                        <li key={i}><Input addonAfter={<Button type="primary" onClick={this.del.bind(this, item.item)}>X</Button>}
                                   value={item.text}
                                   onChange={this.onInputChange.bind(this, item.item)}
                        />
                        </li>
                    ))
                }
            </ul>
        );
    };

    // 提交表单
    handleSubmit = () => {
        this.setState({
            visible: false,
        });
        const { dataList, moduleDefineId, investigationExecuteDefineId } = this.state;
        this.props.handleModuleDefineOptionAction(dataList, moduleDefineId, investigationExecuteDefineId);
    };

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <Modal
                title='设置可选项'
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                confirmLoading={confirmLoading}
            >
                <Button type="primary" onClick={this.add}>添加</Button>
                {this.getOptionList()}
            </Modal>
        );
    }
}

export default SetModuleDefineOption;
