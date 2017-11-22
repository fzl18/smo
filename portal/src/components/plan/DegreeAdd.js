import React, { Component } from 'react';
import { Modal, Button, Icon, Checkbox } from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';


class DegreeAdd extends Component {

    state = {
        visible: false,
        //addList:{"dictId":null,"type":null,"name":null,"code":"Last Site Initiation"},{"dictId":null,"type":null,"name":null,"code":"CRC Site Contract"},{"dictId":null,"type":null,"name":null,"code":"Last Patient Last Visit"}
        addList: [],
        loading: true,
        checkedList: [],
        confirmLoading: false
    };

    show = (ref) => {
        this.setState({
            visible: true
        });
        this.loadData();
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    loadData = () => {
        this.setState({
            loading: true,
        });
        
        const options = {
            url: `${API_URL.plan.degreeUnuseList}`,
            data: {},
            dataType: 'json',
            doneResult: ( data => {
                const listData = data.datas;
                const addList = [];
                listData.map((value) => {
                    addList.push({label:value.code, value:value.code});
                })
                this.setState({
                    loading: false,
                    addList: addList,
                    checkedList: []
                })
            }),
            failResult: ( data => {
                this.setState({
                    visible: false,
                });
            })
        };
        AjaxRequest.sendRequest(options);
    };

    saveAdd = () => {
        const items = this.state.checkedList;
        if(items.length == 0){
            this.setState({visible: false});
            return;
        }
        this.setState({ confirmLoading: true });
        let str='';
        items.map(function(val,index){
            str += `arrays[${index}]=${val}&`;
        })
        const options = {
            url: `${API_URL.plan.addDegreeList}?${str}`,
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    visible: false,
                    confirmLoading: false
                });
                Modal.success({title: "添加成功"});
                this.props.reload();
            }),
            failResult: (() => {
                    this.setState({confirmLoading: false});
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    };


    onChange = (checkedValues) =>{
        this.setState({checkedList : checkedValues});
    }

    // componentDidMount() {
    //     this.loadData();
    // };

    render() {
        const { visible, confirmLoading, title, addList, loading } = this.state;
        const CheckboxGroup = Checkbox.Group;
        const list = addList.length ? <CheckboxGroup options={addList} onChange={this.onChange} /> : '无可添加选项';
        return (
            <Modal
                title="添加"
                visible={visible}
                onCancel={this.hide}
                onOk={this.saveAdd}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="350px"
                confirmLoading={confirmLoading}
            >
                <div>
                    {loading ? 
                        <p>数据加载中... </p>
                        :
                        list
                    }
                    

                </div>
                <div>

                </div>
            </Modal>
        );
    }
}

export default DegreeAdd;
