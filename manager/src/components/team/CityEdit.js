import React, { Component } from 'react';
import $ from '../../common/AjaxRequest';
import { Form, Input, Modal, Button, Select, message, Icon, Cascader } from 'antd';
import API_URL from '../../common/url';
import UserSearchInput from './UserSearchInput';

const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 搜索企业用户
 */

let timeout;
let currentValue;

function fetch(value, callback) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    function fake() {
        $.ajax({
            method: 'get',
            url: `${API_URL.investigation.queryUserByKey}?enterpriseId=1&key=${value}`,
        }).done(dt => {
            const d = dt.data;
            if (currentValue === value) {
                const result = d.userList;
                const data = [];
                result.forEach(r => {
                    data.push({
                        value: r.userCompellation,
                        text: r.userCompellation,
                    });
                });
                callback(data);
            }
        });
    }

    timeout = setTimeout(fake, 300);
}

class SearchInput extends React.Component {
    state = {
        data: [],
        value: '',
    };

    handleChange = value => {
        this.setState({ value });
        fetch(value, data => this.setState({ data }));
    }

    handleBlur = value => {
        this.props.setFieldsValue({ bdUsers: value });
    }

    render() {
        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
        return (
            <Select
                mode="combobox"
                value={this.state.value}
                placeholder={this.props.placeholder}
                notFoundContent=""
                style={this.props.style}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
            >
                {options}
            </Select>
        );
    }
}



//定义联级加载组件
class LazyOptions extends React.Component {
  state = {
    inputValue: '',
    provinceData:[],
  };
  //得到城市列表
    getCity = ( parentId = 0 ) => {
        const options ={
            method: 'POST',
            url: `${API_URL.common.arealist}`,
            data: {
                parentId:parentId,
            },
            dataType: 'json',
            doneResult: data => {
                if(parentId == 0 ){
                    const provinces = data.datas.map(d => ({
                        value: d.regionId,
                        label: d.regionName,
                        parentId: d.parentId,
                        isLeaf: false,
                    }));
                    this.setState({
                        provinces,
                    });
                }            
            }
        }
        $.sendRequest(options)

    }


  onChange = (value, selectedOptions) => {
    // console.log(value, selectedOptions)
    if(value[1]){
        this.props.ChangeSelect(value[1],this.props.num)
         
    }
    // this.setState({
    //   inputValue: selectedOptions.map(o => o.label).join(', '),
    // });
    
  }
  
  loadData = (selectedOptions) => {
    // const label = selectedOptions[0].label
    // const value = selectedOptions[0].value
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // console.log(targetOption)
    targetOption.loading = true;
    //拉城市信息列表
    const options ={
            method: 'POST',
            url: `${API_URL.common.arealist}`,
            data: {
                parentId:targetOption.value,
            },
            dataType: 'json',
            doneResult:data => {
                const cityData = data.datas
                targetOption.loading = false;
                targetOption.children = cityData.map(d => ({
                    label: d.regionName,
                    value: d.regionId,
                }));
                this.setState({
                    provinces: [...this.state.provinces],
                });
            }
        }
        $.sendRequest(options)
  }

  componentWillMount(){
      this.getCity()
  }


  render() {
    const { provinces, inputValue } = this.state;
    return (
      <Cascader        
        placeholder="请选择城市"
        options={provinces}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
        style={{width:'90%'}}
      />
    );
  }
}




let uuid = 0;
class CreateForm extends Component {

    state = {
        // bdValue: '',
        users:[],
        user:{},
        userDetail:{},
        provinceData:[],
        cityData:[],
        city:'',
        cityId:0,
        regions:[],
    };

    setFieldsValue = obj => {
        this.props.form.setFieldsValue(obj);
    }

    
    /**
     * 获取员工领导列表信息
     * @param id
     */
    loadUserManagerData = () => {
        const options ={
            method: 'POST',
            // url: `${API_URL.team.querymanager}`,
            url: `${API_URL.user.queryEnterpriseUserList}`,
            data: {
                enterpriseId:1,
                // positionName:'x',
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    users: data.datas,
                });
            }
        }
        $.sendRequest(options)



        // $.ajax({
        //     method: 'get',
        //     url: `${API_URL.team.querymanager}?enterpriseId=1&positionName=x`,
        // }).done(data => {
        //     this.setState({
        //         users: data.datas,
        //     });
        // });
    }

    /**
     * 获取员工领导个人信息
     * @param id
     */
    loadUserData = id => {
        const options ={
            method: 'POST',
            url: `${API_URL.team.queryuser}`,
            data: {
                // enterpriseId:1,
                userId: id,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    user: data.user,
                    userDetail:data.user.userDetail
                });
            }
        }
        $.sendRequest(options)

        // $.ajax({
        //     method: 'get',
        //     url: `${API_URL.team.queryuser}?enterpriseId=1&userId=${id}`,
        // }).done(data => {
        //     this.setState({
        //         user: data.user,
        //         userDetail:data.user.userDetail
        //     });
        // });
    }

    handleChangeSelect = value => {
        console.log(`selected ${value}`);
        this.loadUserData(value)
    }

    
    // handleProvinceChange = (value) => {
    //     this.getCity(value)        
    // }
    // handleCityChange = (value) => {
    //     this.setState({
    //         cityId: value,
    //         city:value,
    //     });        
    // }



//动态增加 区域选择框

remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
   
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    console.log(keys)
    const nextKeys = keys.concat(uuid);
    // can use data-binding to set
    // important! notify form to detect changes
    const citys = form.getFieldValue('citys');
    const nextCitys = citys.concat(uuid);
    form.setFieldsValue({
      keys: nextKeys,
      citys: nextCitys,
      xxx:'xx',
    });
    uuid++;
  }

  ChangeSelect =(v,num)=>{
    const { form } = this.props;
    // form.setFieldsValue({
    //   ids: v,
    // });
    // console.log(v,id)
    console.log(form)
    const citys = form.getFieldValue("citys");
    citys[num] = ""+v;
    form.setFieldsValue({
      citys: citys,
    });
    console.log(citys);
  }

  handleSelectPMUser = (v) => {
      this.setFieldsValue({userId:v.value})
      this.loadUserData(v.value)
  }
  getstate = () =>{
      return  this.state.regions
  }

  delCity=(index)=>{
      const { form } = this.props;
      const { getFieldDecorator, getFieldValue } = form;
      const {regions} = this.state;
      console.log(regions.map(d=>d.regionId))
      console.log(index)
      regions.splice(index,1)
      const citys = regions.map(d=>d.regionId)
      this.setFieldsValue({oldcitys:citys})
      this.setState({regions})
  }

componentDidMount(){
        // this.loadUserManagerData()
        uuid = 0
        // this.getCity()
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const regions = getFieldValue('regions');        
        this.setState({regions},()=>{})
        const citys = regions.map(d=>d.regionId)
        regions && regions.length > 0 ? this.setFieldsValue({xxx:'xx',oldcitys:citys}) : null
    }



    render() {
        const isEdit = this.props.isEdit
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {regions} = this.state;
        const options = this.state.users.map(d => <Option key={d.userId}>{d.userCompellation}</Option>);
        // const cityoptions = this.state.users.map(d => <Option key={d.userId}>{d.userCompellation}</Option>);
        const {cityName,positionName,leaderName,userCompellation,userId,enterpriseDepartmentName }= this.state.user
        const {employeeCode} = this.state.userDetail
        // const provinceOptions = this.state.provinceData.map(province => <Option key={province.regionId}>{province.regionName}</Option>);
        // const cityOptions = this.state.cityData.map(city => <Option key={city.regionId} >{city.regionName}</Option>);
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
        getFieldDecorator('citys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            const _index = k;
            return (
            <div className="field-max" key={k}> 
                <FormItem
                {...formItemLayoutWithOutLabel}
                label={`城市`}
                required={false}
                >
                {getFieldDecorator(`citys[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                    required: true,
                    whitespace: true,
                    message: "不能为空 - 请选择",
                    }],
                })(
                    <LazyOptions 
                     ChangeSelect = {this.ChangeSelect}
                     num={_index}
                    />                    
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
        if(!isEdit){
            return (
            <div className="create-form">
                <Form>
                    <div className="field-max">
                        <FormItem label="选择员工">
                            {

                                getFieldDecorator('userId',{
                                    initialValue:"请选择",
                                    rules:[
                                        { required:true ,  message:'不能为空' },
                                    ]
                                })(
                                    // <Select onChange={this.handleChangeSelect} style={{width:120}}>
                                    //     {options}
                                    // </Select>
                                    <UserSearchInput style={{width: 150}}
                                               handleSelectUser = {this.handleSelectPMUser}
                                               url = {`${API_URL.user.queryEnterpriseUserList}?positionName=xx`}
                                               searchKey = 'keyword'
                                    />
                                    )
                            }
                        </FormItem>                        
                    </div>
                    <div className="field-max">
                        <FormItem label="工号">

                            {
                                getFieldDecorator('employeeCode')(<Input placeholder={employeeCode} disabled />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="姓名">

                            {
                                getFieldDecorator('userCompellation')(<Input placeholder={userCompellation} disabled />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="职位">

                            {
                                getFieldDecorator('positionName')(<Input placeholder={positionName} disabled />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="主管领导">
                            {
                                getFieldDecorator('leaderName')(<Input placeholder={leaderName} disabled />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="部门">
                            {
                                getFieldDecorator('enterpriseDepartmentName')(<Input placeholder={enterpriseDepartmentName} disabled />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">
                        <FormItem label="工作地点">
                            {
                                getFieldDecorator('cityName')(<Input placeholder={cityName} disabled />)
                            }
                        </FormItem>
                    </div>
                    <div className="field-max">                     
                        <FormItem {...formItemLayoutWithOutLabel} label="分管城市">
                        {
                            getFieldDecorator('xxx',{
                                    validateTrigger: ['onChange', 'onBlur'],
                                    rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: "不能为空",
                                    }],
                                })( 
                                    <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                                        <Icon type="plus" /> 添加城市
                                    </Button>                                    
                                  )
                        }                            
                        </FormItem>                        
                    </div>
                    {formItems}
                </Form>
            </div>
        );

        }else{           
            return (
                <div className="create-form">
                    <Form>
                        <div className="field-max">
                            <FormItem label="工号">
                                {
                                    getFieldDecorator('employeeCode')(<Input disabled/>)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">
                            <FormItem label="姓名">
                                {
                                    getFieldDecorator('userCompellation')(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max" style={{display:'none'}}>
                            <FormItem label="旧城市">
                                {
                                    getFieldDecorator('oldcitys')(<Input disabled />)
                                }
                            </FormItem>
                        </div>
                        <div className="field-max">                     
                            <FormItem {...formItemLayoutWithOutLabel} label="分管城市">
                            {
                                getFieldDecorator('xxx', {
                                    // validateTrigger: ['onChange', 'onBlur'],
                                    rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: "不能为空",
                                    }],
                                })(
                                    <div>
                                    {regions.map((d,i)=><div key={i}> {d.regionName} <a href='javascript:void(0)' onClick ={this.delCity.bind(this,i)}> 删除</a></div>)} 
                                    <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                                        <Icon type="plus" /> 添加城市
                                    </Button>
                                    </div>
                            )}
                            </FormItem>                        
                        </div>
                        {formItems}
                    </Form>
                </div>
            );
        }
        
    }
}

class CreateModal extends Component {

    state = {
        visible: false,
        confirmLoading: false,
        investigation: {},
        regions:[],
        isEdit: false,
        id:0,
    };

    show = id => {
        this.setState({
            visible: true,
            isEdit: false,
            investigation: {},
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
            url: `${API_URL.team.citylist}`,
            data: {
                enterpriseId:1,
                userId: id,
            },
            dataType: 'json',
            doneResult: data => {
                this.setState({
                    investigation: data.user,
                    regions:data.user.regions,
                });
            }
        }
        $.sendRequest(options)

    }

    // 提交表单
    handleSubmit = () => {
        this.refs.form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            this.setState({ confirmLoading: false });
            const fieldsValue = this.refs.form.getFieldsValue();
            const ids = fieldsValue.citys.map(d=>(d))||[]
            fieldsValue.ids = {...ids}
            fieldsValue.enterpriseId = 1
            console.log(fieldsValue)
            if (this.state.isEdit) {
               fieldsValue.userId = this.state.id;
               fieldsValue.ids=[]
            //    console.log(fieldsValue.citys,fieldsValue.oldcitys)
               const allcitys= fieldsValue.citys.concat(fieldsValue.oldcitys)
               console.log(allcitys)
               allcitys.map((d,i)=>{
                   fieldsValue[`ids[${i}]`]=d
               })
               if(allcitys.length >0){
                   // 修改
                    const options ={
                    method: 'POST',
                    url: API_URL.team.editCity,
                    data:fieldsValue,
                    dataType: 'json',
                    doneResult: data => {
                        this.setState({ confirmLoading: false });
                        if(data.success){
                            message.success(data.success);
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
               }else{
                   message.warn('分管城市不能为空')
               }
                

            } else {
                // 新建
                fieldsValue.enterpriseId = 1;
                const options ={
                    method: 'POST',
                    url: API_URL.team.addCity,
                    data: fieldsValue,
                    dataType: 'json',
                    doneResult: data => {
                        this.setState({ confirmLoading: false });
                        if(data.success){
                            message.success(data.success);
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
            }
        });
    }

    render() {
        const { confirmLoading, visible, investigation, isEdit,regions } = this.state;
        const mapPropsToFields = () => ({
            employeeCode: { value: investigation.employeeCode },
            userCompellation: { value: investigation.userCompellation },
            regions:{value:regions},
            // employeeCode: { value: investigation.employeeCode },
        });
        CreateForm = Form.create({ mapPropsToFields })(CreateForm);
        return (
            <Modal
                title={isEdit ? '修改分管城市记录' : '添加分管城市记录'}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="450px"
                confirmLoading={confirmLoading}
            >
                <CreateForm ref="form" isEdit={this.state.isEdit} />
            </Modal>

        );
    }
}

export default CreateModal;
