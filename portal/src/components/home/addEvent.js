import React, {Component} from 'react';
import moment from 'moment';
import $ from '../../common/AjaxRequest';
import {Button, DatePicker, Form, Icon, Input, message, Modal, Popconfirm, Radio, Select, Table, Tabs} from 'antd';
import API_URL from '../../common/url';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const {RangePicker} = DatePicker;
const {TextArea} = Input;
const RadioGroup = Radio.Group;
const dayFormat = 'YYYY-MM-DD HH:mm:ss';
let uuid = 0;

class CreateForm extends Component {
    state = {
        bdValue: '',
        radioValue: '1',
        inves: this.props.inves || [],
        investigationId: '',
        record: this.props.record,
        data:[]
    };

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    };

    onChange = (v, dateString) => {
        const {getFieldDecorator,getFieldValue, setFieldsValue} = this.props.form;
        this.setFieldsValue({'time': [v[0],v[1]]});
    };

    onChangeRedio = (e) => {
        this.setState({
            radioValue: e.target.value,
        });
    };

    add = () => {
        if (uuid > 3) {
            message.warn("提示时间最多添加四种");
            return;
        }
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(0);
        form.setFieldsValue({
            keys: nextKeys,
        });
        uuid++;
    };

    remove = (index) => {
        uuid--;
        const {form} = this.props;
        const keys = form.getFieldValue('keys');
        let remindTimes = form.getFieldValue('remindTimes');
        if (keys.length === 1) {
            return;
        }
        remindTimes.splice(index,1);
        form.setFieldsValue({
            keys: keys.slice(0, keys.length - 1),
            remindTimes
        });

    };

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    };

    loadPm = () => {
        const options = {
            method: 'POST',
            url: `${API_URL.home.queryUserRoleInvesPm}`,
            data: '',
            dataType: 'json',
            doneResult: data => {
                this.setState({inves: data.data});
            },
            errorResult: () => {
                this.setState({confirmLoading: false});
            },
        };

        $.sendRequest(options);
    };

    


    /**
     * 将选择的值塞进redminTime
     *
     * @param value 选择的值
     * @param num index
     */
    ChangeSelect = (value, num) => {
        const {form} = this.props;
        const remindTimes = form.getFieldValue("remindTimes");
        remindTimes[num] = value;
        form.setFieldsValue({
            remindTimes: remindTimes,
        });
    };


    selectInve = (value) => {
        const {inves} = this.state;
        this.setState({
            investigationId: value
        });
        this.props.sendInvestigationId(investigationId);
    };


    componentDidMount() {
        //this.loadPm();
        const {getFieldDecorator, getFieldValue, setFieldsValue} = this.props.form;
        // getFieldDecorator('keys', {initialValue: []});
        // getFieldDecorator('remindTimes', {initialValue: []});
        // getFieldDecorator('reminds', {initialValue: []});
        // getFieldDecorator('toInvestigationName', {initialValue: null});
        // getFieldDecorator('toInvestigationId', {initialValue: null});
        // getFieldDecorator('isSendMembers', {initialValue: null});
        // getFieldDecorator('eventId', {initialValue: null});
        const reminds = getFieldValue('reminds');
        if(reminds && reminds.length > 0){

            let newKeys = [];
            let newReminds = [];
            reminds.map((value,index) => {
                newKeys.push(0);
                newReminds.push(value.toString());
            })
            setFieldsValue({'keys': newKeys});
            setFieldsValue({'remindTimes': newReminds})
        }
        const keys = getFieldValue('keys');
        const remindTimes = getFieldValue('remindTimes');
        
        const toInvestigationName = getFieldValue('toInvestigationName');
        const investigationId = getFieldValue('investigationId');
        const isSendMembers = getFieldValue('isSendMembers');
        const inves = getFieldValue('inves');
        if(isSendMembers !== undefined && isSendMembers !== null){
            this.setState({
                radioValue: isSendMembers,
                investigationId: investigationId
            })
        }
        this.setState({inves});


    }

    // componentWillMount() {
    //     //const {inves} = this.props;
    //     this.setState({
    //         inves : this.props.inves || []
    //     });
    // }

    render() {

        const {getFieldDecorator, getFieldValue, setFieldsValue} = this.props.form;
        const {radioValue, inves} = this.state;
        getFieldDecorator('keys', {initialValue: []});
        getFieldDecorator('remindTimes', {initialValue: []});
        getFieldDecorator('reminds', {initialValue: []});
        getFieldDecorator('toInvestigationName', {initialValue: null});
        getFieldDecorator('investigationId', {initialValue: null});
        getFieldDecorator('isSendMembers', {initialValue: '0'});
        getFieldDecorator('eventId', {initialValue: null});
        getFieldDecorator('inves', {initialValue: []});
        getFieldDecorator('time');
        
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 20, offset: 4},
            },
        };
        const keys = getFieldValue('keys');
        const remindTimes = getFieldValue('remindTimes');
        const reminds = getFieldValue('reminds');
        const toInvestigationName = getFieldValue('toInvestigationName');
        const investigationId = getFieldValue('investigationId');
        const isSendMembers = getFieldValue('isSendMembers');
        // if(reminds && reminds.length > 0){
        //     let newKeys = [];
        //     reminds.map((value,index) => {
        //         newKeys.push(0)
        //     })
        //     setFieldsValue({getFieldDecorator: newKeys})
        // }
        const formItems = keys.map((k, index) => {
            return (
                <div className="field-max" key={index}>
                    <FormItem
                        //{...formItemLayoutWithOutLabel}
                        required={false}
                    >
                        {getFieldDecorator(`rt[${index}]`, {

                            rules: [{
                                required: false,
                                whitespace: true,
                                message: "不能为空 - 请选择",
                            }],
                        })(
                            <LazyOptions
                                ChangeSelect={this.ChangeSelect}
                                _num={index}
                                optionValue={remindTimes[index]}
                            />
                        )}
                        {keys.length > 1 ? (
                            <Icon
                                className="dynamic-delete-button"
                                style={{marginLeft:'10px'}}
                                type="minus-circle-o"
                                disabled={keys.length === 1}
                                onClick={() => this.remove(index)}
                            />
                        ) : null}
                    </FormItem>
                </div>
            );
        });
        const invesSelect = inves.map((inve, index) =>
            <Option value={inve.investigationId} key={index}> {inve.investigationName}项目成员</Option>
        );


        return (

            <div className="create-form create-event-form">
                <Form>
                    <div className="field-max">
                        <FormItem label="事件时间">
                            {
                                getFieldDecorator('time', {
                                    rules: [
                                        {required: true, message: '时间不能为空'},
                                    ],
                                })(<RangePicker
                                    showTime
                                    format={'YYYY-MM-DD HH:mm'}
                                    placeholder={['开始时间', '结束时间']}
                                    onChange={this.onChange}

                                />)
                            }
                        </FormItem>
                    </div>

                    <div className="field-max">
                        <FormItem label="事件内容">
                            {
                                getFieldDecorator('eventContent', {
                                    rules: [
                                        {required: true, message: '内容不能为空'},
                                    ],
                                })(<TextArea rows={4} style={{width: '70%'}}/>)
                            }
                        </FormItem>
                    </div>
                    {inves.length > 0 ?
                        <div className="field-max">
                            <FormItem label="是否向项目成员发送">
                                {
                                    getFieldDecorator('isSendMembers', {
                                        rules: [
                                        ],
                                        initialValue: '0'
                                    })(<RadioGroup onChange={this.onChangeRedio}>
                                        <Radio value='1'>是</Radio>
                                        <Radio value='0'>否</Radio>
                                    </RadioGroup>)
                                }
                            </FormItem>
                        </div> : null
                    }
                    {radioValue === '1' && inves.length > 0 ?
                        <div className="field-max">
                            <FormItem label="接收人">
                                {
                                    getFieldDecorator('investigationId', {
                                        rules: [
                                            //{required: true, message: '请选择接收人' },
                                        ],
                                        initialValue: investigationId
                                    })(<Select style={{width: "200px", marginLeft: "30px"}} onChange={this.selectInve}>
                                        {invesSelect}
                                    </Select>)
                                }
                            </FormItem>
                        </div> : null
                    }
                    <div className="field-max">
                        <FormItem label="提醒时间">
                            {
                                getFieldDecorator('xx', {
                                    rules: [],
                                })(
                                    <Button type="dashed" onClick={this.add} style={{width: '100px'}}>
                                        <Icon type="plus"/> 添加
                                    </Button>
                                )
                            }
                        </FormItem>
                    </div>
                    {formItems}
                </Form>
            </div>
        );
    }
}

let investigationId = '';

class AddEvent extends Component {
    state = {
        visible: false,
        editvisible: false,
        loading: false,
        confirmLoading: false,
        editConfirmLoading: false,
        investigation: {},
        isEdit: false,
        selectValue: '',
        data: [],
        pagination: {
            pageSize: 100,
            current: 1,
        },
        pm: [],
        inves: [],
        investigationId: '',
        activeKey: '1',
        //记录回显数值
        event: '',
        curTime: null,
        dateFormat: 'YYYY-MM-DD',
        record:{},
        isPM: false,
        selectValue: 'a',
        firstOpen: true,
    };

    show = time => {
        this.setState({
            visible: true,
            isEdit: false,
            investigation: {},
            record:{}
        });
        if (time) {
            this.setState({
                curTime: time,
            });
        }
    };

    showEdit = record => {
        const { firstOpen } = this.state;
        if(firstOpen){
            this.setState({
                editvisible: true,
                firstOpen: false,
            },() => {
                this.setState({
                    editvisible: false,
                },() => {
                    this.setState({
                        editvisible: true,
                        isEdit: true,
                        investigation: {},
                        record
                    });
                })
            })
        }else{
            this.setState({
                editvisible: true,
                isEdit: true,
                investigation: {},
                record
            });
        }
        
        
        // if (record) {
        //     //this.echoLoadData(record.id);
        //     this.setState({
        //         editvisible: true,
        //         isEdit: true,
        //     })
        // }
    };

    //回显单查接口
    echoLoadData = (eventId) => {
        const options = {
            method: 'POST',
            url: `${API_URL.home.queryEventRemindById}`,
            data: {eventId: eventId},
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    event: data.data,
                });
            }
        };
        $.sendRequest(options);
    };

    hide = () => {
        uuid = 0;
        this.setState({
            visible: false,
            data: [],
            activeKey: '1'
        });
    };

    hideEdit = () => {
        uuid = 0;
        this.setState({
            editvisible: false,
        });
    };

    /**
     * 获取项目详细信息
     *
     * @param type 查询数据类型
     */
    loadDataOwn = (type) => {
        const {pagination, curTime, selectValue} = this.state;
        const options = {
            method: 'POST',
            url: `${API_URL.home.queryEventRemindList}`,
            data: {
                type: type,
                 offset: 1,
                 limit: 100,
                date: curTime
            },
            dataType: 'json',
            doneResult: data => {
                //pagination.total = data.totalCount;
                this.setState({
                    data: data.data,
                    //pagination,
                });
            },
            errorResult: (data) => {
                message.error(data.error);
            },
        };
        $.sendRequest(options)
    };

    reload = () => {
        this.loadDataOwn('own');
    };

    loadPm = () => {
        const options = {
            method: 'POST',
            url: `${API_URL.home.queryUserRoleInvesPm}`,
            data: '',
            dataType: 'json',
            doneResult: data => {
                if(data.data.length > 0){
                    this.setState({
                        isPM: true
                    })
                }
                this.setState({inves: data.data});
            },
            errorResult: () => {
                this.setState({confirmLoading: false});
            },
        };

        $.sendRequest(options);
    };


    componentWillMount() {
        this.loadPm();
    };

    getColumns = () => {
        const {selectValue} = this.state;
        const columnNames = [];
        let eventContentWidth = 250;
        let remindTimeWidth = 140;
        if(selectValue == "1"){
            eventContentWidth = 160;
            remindTimeWidth = 85;
        }
        columnNames.push({
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            sortType: 'common',
        });
        columnNames.push({
            title: '事件内容',
            dataIndex: 'eventContent',
            key: 'eventContent',
            sortType: 'common',
            width: eventContentWidth
        });
        if(selectValue == "1"){
            columnNames.push({
                title: '项目编号',
                dataIndex: 'investigationCode',
                key: 'investigationCode',
                sortType: 'common',
                width: 85
            });
        }
        columnNames.push({
            title: '事件时间',
            dataIndex: 'eventTime',
            key: 'eventTime',
            sortType: 'common',
            width: 140,
            render: (text, record, index) => {
                return (
                    <div>
                        {record.eventStartTime} - <br/>
                        {record.eventEndTime}
                    </div>
                )
            }
        });
        columnNames.push({
            title: '提醒时间',
            dataIndex: 'remindTime',
            key: 'remindTime',
            sortType: 'common',
            width: remindTimeWidth,
            render: (text, record, index) => {
                const {dateFormat} = this.state;
                let remindTimes = "";
                if(record.remindTimes){
                    const remindArr = [];
                    record.remindTimes.map((value,index) => {
                        remindArr.push(moment(value).format(dateFormat))
                    })
                    remindTimes = remindArr.join(',');
                }
                return (
                    <div>
                        {remindTimes}
                    </div>
                )
            }
        });
        if(selectValue == "1"){
            columnNames.push({
                title: '接收人',
                dataIndex: 'receive',
                key: 'receive',
                sortType: 'common',
                width: 85
            });
        }
        columnNames.push({
            title: '操作',
            dataIndex: 'option',
            key: 'option',
            render: (text, record, index) => {
                return (
                    <div>
                        <a href='javascript:void(0);' onClick={this.showEdit.bind(this, record)}>修改</a>
                        <span className="ant-divider"/>
                        <Popconfirm title={'确定要删除吗?'} onConfirm={this.del.bind(this, record)} okText="确定" cancelText="取消">
                            <a href='javascript:void(0);'>删除</a>
                        </Popconfirm>
                    </div>
                )
            }
        });
        return columnNames;
    }

    getDataSource = () => {
        const investigations = [];
        const {data, pagination} = this.state;
        data.map((event, i) => {
            investigations.push({
                index: ((pagination.current - 1) || 0) * 15 + i + 1,
                eventContent: event.eventContent,
                eventTime: event.eventStartTime,
                remindTime: event.status,
                id: event.eventRemindId,
                eventStartTime: event.eventStartTime,
                eventEndTime: event.eventEndTime,
                remindTimes: event.remindTimes,
                reminds: event.reminds,
                isSendMembers: event.isSendMembers,
                toInvestigationName: event.toInvestigationName,
                toInvestigationId: event.toInvestigationId,
                key: event.eventRemindId
            });
        });
        return investigations;
    };

    edit = (record) => {
        this.show(record.id)
    };


    del = (record) => {
        const options = {
            method: 'POST',
            url: `${API_URL.home.deleteEventRemind}`,
            data: {
                eventId: record.id,
            },
            dataType: 'json',
            doneResult: data => {
                message.info(data.success);
                this.reload();
            },
            errorResult: () => {
                message.error(data.error);
                this.setState({confirmLoading: false});
            },
        };
        $.sendRequest(options);

    };

    onChangeSelect = (value) => {
        this.setState({
            selectValue: value
        })
        if (value === '0') {
            this.loadDataOwn('own');
        } else if (value === '1') {
            //我发送的
            this.loadDataOwn('send');
        } else if (value === '2') {
            //我接受的
            this.loadDataOwn('get');
        }
    };
    // 提交表单
    handleSubmit = () => {
        if (this.state.activeKey === '2' && !this.state.isEdit) {
            this.hide();
            return;
        }

        this.refs.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            const fieldsValue = this.refs.form.getFieldsValue();
            if(fieldsValue.inves.length > 0){
                if(fieldsValue.isSendMembers == '1' && !fieldsValue.investigationId){
                    Modal.error({'title': '请选择接收人'});
                    return;
                }
            }else{
                fieldsValue.isSendMembers= '0';
            }
            this.setState({confirmLoading: false});
            // fieldsValue.bdUserId = 3;
            if (this.state.isEdit) {
                //const eventId = this.state.event.eventRemindId;
                this.setState({
                    editConfirmLoading: true,
                })
                const eventId = fieldsValue.eventId;
                fieldsValue.startTime = fieldsValue.time[0].format(dayFormat);
                fieldsValue.endTime = fieldsValue.time[1].format(dayFormat);
                fieldsValue.time = '';
                fieldsValue.remindTimes.map((value, index) => {
                    let name = `remindTime[${index}]`;
                    fieldsValue[name] = value;
                });
                if (investigationId != null && investigationId != '') {
                    fieldsValue.investigationId = investigationId;
                }
                fieldsValue.eventId = eventId;
                const options = {
                    method: 'POST',
                    url: `${API_URL.home.modifyEventRemind}`,
                    data: fieldsValue,
                    dataType: 'json',
                    doneResult: data => {
                        this.hideEdit();
                        this.setState({editConfirmLoading: false});
                        message.success('修改事件提醒成功');
                        this.reload();
                        this.props.reloadRemind(this.props.calendarDate);
                    },
                    errorResult: () => {
                        this.setState({editConfirmLoading: false});
                    },
                }
                $.sendRequest(options)
            } else {
                // 新建
                fieldsValue.startTime = fieldsValue.time[0].format(dayFormat);
                fieldsValue.endTime = fieldsValue.time[1].format(dayFormat);
                fieldsValue.time = '';
                fieldsValue.remindTimes.map((value, index) => {
                    let name = `remindTime[${index}]`;
                    fieldsValue[name] = value;
                });
                if (investigationId != null && investigationId != '') {
                    fieldsValue.investigationId = investigationId;
                }

                const options = {
                    method: 'POST',
                    url: `${API_URL.home.createEventRemind}`,
                    data: fieldsValue,
                    dataType: 'json',
                    doneResult: data => {
                        this.setState({confirmLoading: false});
                        message.success(data.success);
                        this.hide();
                        this.props.reloadRemind(this.props.calendarDate);
                    },
                    errorResult: () => {
                        this.setState({confirmLoading: false});
                    },
                };
                $.sendRequest(options);
            }

        });
        uuid = 0;
    };

    onTabChange = (activeKey) => {
        if (activeKey === '2') {
            this.loadDataOwn('own');
            this.setState({
                selectValue: 'a'
            })
        }
        if (activeKey === '1') {
            this.setState({
                event: '',
                record: {},
                isEdit: false
            });
        }
        this.setState({
            activeKey: activeKey
        });
    };

    /*onform = (value) => {
        this.refs.form.loadPm
    };*/

    sendInvestigationId = (value) => {
        investigationId = value;
    };

    handleTableChange = (pagination, filters, sorter) => {
        // let sortType,
        //     direction,
        //     sort = sort = sorter.field;
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });


        this.loadDataOwn({
            limit: 100,
            offset: pagination.current,
            // direction,
            // sort,
            // sortType,
           // ...this.state.searchParams,
            ...filters,
        });
    };
    render() {
        const {confirmLoading,editConfirmLoading, visible, loading, pagination, pm, editvisible, event, curTime, activeKey, record, isEdit, inves, isPM, selectValue} = this.state;
        // const {getFieldDecorator, getFieldValue} = this.props.form;
        let mapPropsToFields = {};
        //if(isEdit){
            mapPropsToFields = () => ({
                time: {value: [moment(record.eventStartTime), moment(record.eventEndTime)]},
                eventContent: {value: record.eventContent},
                isSendMembers: {value: record.isSendMembers || '0'},
                reminds: {value: record.reminds},
                toInvestigationName: {value: record.toInvestigationName},
                investigationId: {value: record.toInvestigationId},
                eventId: {value: record.id},
                inves: {value: inves}
            });
        // }else{
        //     mapPropsToFields = () => ({
        //         time: {value: [moment(event.eventStartTime), moment(event.eventEndTime)]},
        //         eventContent: {value: event.eventContent},
        //         isSendMembers: {value: record.isSendMembers},
        //         reminds: {value: record.reminds},
        //         toInvestigationName: {value: record.toInvestigationName},
        //         toInvestigationId: {value: record.toInvestigationId},
        //         eventId: {value: record.id}
        //     });
        // }
        

        CreateForm = Form.create({mapPropsToFields})(CreateForm);
        const curRole = sessionStorage.curRole;
        let footer = [
            <Button key="back" type="ghost" size="large" onClick={this.hide}>取消</Button>,
            <Button key="submit" type="primary" size="large" loading={confirmLoading} onClick={this.handleSubmit}>
                确定
            </Button>
        ];
        
        if(activeKey == '2'){
            footer=[<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>];
        }
        return (<div>
                {/*回显modal*/}
                <Modal title='修改事件'
                       visible={editvisible}
                       onOk={this.handleSubmit}
                       onCancel={this.hideEdit}
                       className="create-modal"
                       wrapClassName="vertical-center-modal"
                       width="650px"
                       confirmLoading={editConfirmLoading}>
                    <div className="create-form">
                        <CreateForm ref="form" sendInvestigationId={this.sendInvestigationId} inves={inves}/>
                    </div>
                </Modal>

                <Modal
                    title='待办事件'
                    visible={visible}
                    onOk={this.handleSubmit}
                    onCancel={this.hide}
                    className="create-modal"
                    wrapClassName="vertical-center-modal"
                    width="750px"
                    confirmLoading={confirmLoading}
                    footer = {footer}
                    >

                    <Tabs type="card" onTabClick={this.onTabChange} activeKey={activeKey}>
                        <TabPane tab="新建事件" key="1"><CreateForm ref="form" loadpm={this.onform}
                                                                sendInvestigationId={this.sendInvestigationId}/></TabPane>
                        <TabPane tab="事件列表" key="2">
                            <div>
                                <div style={{width:'100%',height:30}}>
                                    <div style={{float:'left'}}>事件时间：{curTime}</div>
                                    {
                                        (curRole == "CRC" && isPM) || (curRole == "CRCC" && isPM) ? 
                                        <Select value={selectValue} style={{float: 'right', width: 100}}
                                                onChange={this.onChangeSelect}>
                                            <Option value='a'>请选择</Option>
                                            <Option value='0'>我创建的</Option>
                                            <Option value='1'>我发送的</Option>
                                            <Option value='2'>我收到的</Option>
                                        </Select>
                                        :
                                        null
                                    }
                                    {
                                        (curRole == "CRC" && !isPM) || (curRole == "CRCC" && !isPM) ? 
                                        <Select value={selectValue} style={{float: 'right', width: 100}}
                                                onChange={this.onChangeSelect}>
                                            <Option value='a'>请选择</Option>
                                            <Option value='0'>我创建的</Option>
                                            <Option value='2'>我收到的</Option>
                                        </Select>
                                        :
                                        null
                                    }
                                    {
                                        (curRole == "BO" && isPM) || (curRole == "BD" && isPM) || (curRole == "BDO" && isPM) || (curRole == "PM" && isPM) ? 
                                        <Select value={selectValue} style={{float: 'right', width: 100}}
                                                onChange={this.onChangeSelect}>
                                            <Option value='a'>请选择</Option>
                                            <Option value='0'>我创建的</Option>
                                            <Option value='1'>我发送的</Option>
                                        </Select>
                                        :
                                        null
                                    }

                                </div>
                                <div style={{marginTop: 20}}>
                                    <Table
                                        columns={this.getColumns()}
                                        dataSource={this.getDataSource()}
                                        loading={loading}
                                        scroll={{x: 700}}
                                        pagination={false}
                                        bordered={true}
                                    />
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        );
    }
}

//提醒时间select选择
class LazyOptions extends React.Component {
    state = {
        inputValue: '',
    };
    onChange = (value) => {
        if (value) {
            this.props.ChangeSelect(value, this.props._num);
        }
    };

    render() {
        const {provinces, inputValue} = this.state;
        const value = this.props.optionValue || "a";
        return (

            <Select value={value} style={{width: 120}} onChange={this.onChange}>
                <Option value="a">请选择</Option>
                <Option value="0">当天</Option>
                <Option value="1">一天前</Option>
                <Option value="2">两天前</Option>
                <Option value="7">一周前</Option>
            </Select>

        );
    }
}

export default AddEvent;
