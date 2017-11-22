import React, { Component } from 'react';
import $ from '../../common/AjaxRequest';
import { Form, Input, Modal, Button, Select, message,Icon } from 'antd';
import API_URL from '../../common/url';

const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 搜索企业用户
 */

let timeout;
let currentValue;
let uuid=0

// function fetch(value, callback) {
//     if (timeout) {
//         clearTimeout(timeout);
//         timeout = null;
//     }
//     currentValue = value;

//     function fake() {
//         $.ajax({
//             method: 'get',
//             url: `${API_URL.daily.queryUserByKey}?enterpriseId=1&key=${value}`,
//         }).done(dt => {
//             const d = dt.data;
//             if (currentValue === value) {
//                 const result = d.userList;
//                 const data = [];
//                 result.forEach(r => {
//                     data.push({
//                         value: r.userCompellation,
//                         text: r.userCompellation,
//                     });
//                 });
//                 callback(data);
//             }
//         });
//     }

//     timeout = setTimeout(fake, 300);
// }

// class SearchInput extends React.Component {
//     state = {
//         data: [],
//         value: '',
//     };

//     handleChange = value => {
//         this.setState({ value });
//         fetch(value, data => this.setState({ data }));
//     }

//     handleBlur = value => {
//         this.props.setFieldsValue({ bdUsers: value });
//     }

//     render() {
//         const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
//         return (
//             <Select
//                 mode="combobox"
//                 value={this.state.value}
//                 placeholder={this.props.placeholder}
//                 notFoundContent=""
//                 style={this.props.style}
//                 defaultActiveFirstOption={false}
//                 showArrow={false}
//                 filterOption={false}
//                 onChange={this.handleChange}
//                 onBlur={this.handleBlur}
//             >
//                 {options}
//             </Select>
//         );
//     }
// }

class CreateForm extends Component {

    state = {
        bdValue: '',
        provinces:[],
    };

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }
    loadprovinceData = () =>{
        //拉省份列表
        const options ={
            method: 'POST',
            url: API_URL.common.arealist,
            data: {
                parentId:0,
            },
            dataType: 'json',
            doneResult: data => {            
                this.setState({
                    provinces:data.datas,
                });
            }
        }
        $.sendRequest(options)


        // $.ajax({
        //     method: 'GET',
        //     url:`${API_URL.common.arealist}?parentId=0`,
        // }).done( data => {            
        //     this.setState({
        //         provinces:data.datas,
        //     });
        // });
    }
    //动态增加 区域选择框
    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }

        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    add = () => {
        uuid++;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        form.setFieldsValue({
            keys: nextKeys,
            prov: 'xx'
        });
    }
    componentWillMount(){
      this.loadprovinceData()
    }
    render() {
        const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
        // const enterpriseWorkCategoryId = getFieldValue('Id');
        const options = this.state.provinces.map((province,i) => <Option key={province.regionId.toString()} >{province.regionName}</Option>);
        const formItemLayout = {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 4 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 20 },
                },
                };
                const formItemLayoutWithOutLabel = {
                wrapperCol: {
                    xs: { span: 24, offset: 0 },
                    sm: { span: 20, offset: 4 },
                },
            };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
            <div className="field-max" key={index}> 
                <FormItem
                {...formItemLayoutWithOutLabel}
                label={`省份`}
                required={false}
                >
                {getFieldDecorator( `ids.${index}.m`, {
                    // initialValue:"请选择",
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                    required: true,
                    whitespace: true,
                    message: "不能为空 - 请选择",
                    }],
                    initialValue:k.regionId ? k.regionId.toString() : '',
                })( 
                    <Select style={{width:100}} key={index}>
                        {options}
                    </Select>                    
                )}
                {keys.length > 1 ? (
                    <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    disabled={keys.length === 1}
                    onClick={() => this.remove(k)}
                    />
                ) : null}
                </FormItem>
            </div>
            );
        });
        return (
            <div className="create-form">
                <Form>
                    <div className="field-max" style={{display:'none'}}>
                        <FormItem label="areaId">
                            {
                                getFieldDecorator('areaId')(<Input disabled />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="大区名称">
                            {
                                getFieldDecorator('areaName', {
                                    rules: [
                                        { required: true, message: '大区名称不能为空' },
                                    ],
                                })(<Input placeholder="请在此输入大区名称" />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="包含省份">
                            {
                                getFieldDecorator('prov', {
                                    rules: [
                                        { required: true, message: '包含省份不能为空' },
                                    ],
                                })(<Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                                    <Icon type="plus" /> 添加省份
                                </Button>  )
                            }
                            {
                                                              
                            }
                        </FormItem>
                    </div>
                    {formItems}                
                </Form>
            </div>
        );
    }
}

class CreateModal extends Component {
    state = {
        visible: false,
        confirmLoading: false,
        daily: [],
        isEdit: false,
        regions:[],
    };

    show = id => {
        this.setState({            
            visible: true,
            isEdit: false,
        });
        if (id) {            
            this.loadData(id);            
            this.setState({
                isEdit: true,
                id:id,
            });
        }
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    /**
     * 获取项目详细信息
     * @param id
     */
    loadData = id => {
        const options ={
            method: 'POST',
            url: API_URL.daily.queryarealist,
            data: {
                enterpriseId:1,
                areaId:id,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    daily: data.area,
                    regions:data.area.regions
                });
            }
        }
        $.sendRequest(options)


        // $.ajax({
        //     method: 'get',
        //     url: `${API_URL.daily.queryarealist}?areaId=${id}&enterpriseId=1`,
        // }).done(data => {
        //     this.setState({
        //         daily: data.area,
        //     });
        // });
    }

    componentDidMount(){
        // console.log(this.state.daily)
    }
    // 提交表单
    handleSubmit = () => {
        this.refs.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            this.setState({ confirmLoading: true });
            const fieldsValue = this.refs.form.getFieldsValue();
            if(fieldsValue.ids){
                const ids = fieldsValue.ids.map(d=>(d.m))||[]
                fieldsValue.ids = {...ids}
            }
            
            if (this.state.isEdit) {
                fieldsValue.areaId = this.state.id;
                fieldsValue.enterpriseId = 1
                // 修改
                const options ={
                    method: 'POST',
                    url: API_URL.daily.editarealist,
                    data:fieldsValue,
                    dataType: 'json',
                    doneResult: data => {
                        this.setState({ confirmLoading: false });
                        if(!data.error){
                            message.success(data.data.success);
                            this.props.reload();
                            this.hide();
                        }else{
                            message.warn(data.error);
                            this.props.reload();
                            this.hide();
                        }                    
                    }
                }
                $.sendRequest(options)



                // $.ajax({
                //     method: 'POST',
                //     url:API_URL.daily.editarealist,
                //     data: fieldsValue,
                // }).done(data => {
                //     this.setState({ confirmLoading: false });
                //     if(!data.error){
                //         message.success(data.data.success);
                //         this.props.reload();
                //         this.hide();
                //     }else{
                //         message.warn(data.error);
                //         this.props.reload();
                //         this.hide();
                //     }                    
                // });
            } else {
                // 添加
                fieldsValue.enterpriseId = 1;
                const options ={
                    method: 'POST',
                    url: API_URL.daily.addarea,
                    data: fieldsValue,
                    dataType: 'json',
                    doneResult: data => {
                        this.setState({ confirmLoading: false });
                        if(!data.error){
                            message.success(data.data.success);
                            this.props.reload();
                            this.hide();
                        }else{
                            message.warn(data.error);
                            this.props.reload();
                            this.hide();
                        }
                    }
                }
                $.sendRequest(options)


                // $.ajax({
                //     method: 'POST',
                //     url: API_URL.daily.addarea,
                //     data: fieldsValue,
                // }).done(data => {
                //     this.setState({ confirmLoading: false });
                //     if(!data.error){
                //         message.success(data.data.success);
                //         this.props.reload();
                //         this.hide();
                //     }else{
                //         message.warn(data.error);
                //         this.props.reload();
                //         this.hide();
                //     }
                // });
            }
        });
    }

    render() {
        const { confirmLoading, visible, daily, isEdit,regions } = this.state;
        const mapPropsToFields = () => ({
            areaName: { value:isEdit ? daily.areaName : '' },
            areaId:{ value:isEdit ? daily.areaId : '' },
            keys:{value:isEdit ? regions :[]},
            prov:{value:isEdit ? 'xx' : null}
        });

         CreateForm = Form.create({ mapPropsToFields })(CreateForm)
        
        return (
            <Modal
                title={isEdit ? '修改记录' : '添加记录'}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="450px"
                confirmLoading={confirmLoading}
            >
                <CreateForm ref="form" />
            </Modal>

        );
    }
}

export default CreateModal;
