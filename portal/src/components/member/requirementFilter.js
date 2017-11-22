import React from 'react';
import { Button, Input, Select } from 'antd';


const InputGroup = Input.Group;
const Option = Select.Option;

const initState = {
    requirementCode: '',
    city: '',
    investigationSiteCode: '',
    investigationSiteName: '',
    requireUser: '',
    cityDisplay : '',
    investigationSiteCodeDisplay : '',
    investigationSiteNameDisplay : '',
    investigationSponsor: '',
    investigationMedicine: '',
    investigationMalady: '',
    status: '',
    assignedUsers: '',
    assignUserName: '',
    investigationCode: '',
    investigationName: '',
    assignedUser: '',
    assignUser: '',
}

class Filter extends React.Component {

    state = {
        ...initState,
        cur: this.props.cur
    };

    showCreateModal = () => {
        this.props.showCreateModal();
    }

    handleChange = (field, e) => {
        if(field == "status"){
            this.setState({
                [field]: e,
            });
        }else{
            this.setState({
                [field]: e.target.value,
            });
        }
        
    }

    handleChangeSelect = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    search = () => {
        const { sortParams } = this.props;
        this.props.reload({ ...this.state},"search");
    }

    export = () =>{
        this.props.export();
    }

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    }

    reset = () => {
        this.setState ({
            requirementCode: '',
        city: '',
        investigationSiteCode: '',
        investigationSiteName: '',
        requireUser: '',
        investigationSponsor: '',
        investigationMedicine: '',
        investigationMalady: '',
        status: '',
        assignedUsers: '',
        assignUserName: '',
        investigationCode: '',
        investigationName: '',
        assignedUser: '',
        assignUser: '',
        }) 
        
        this.props.reset();      
    }

    componentDidMount() {
        let cityDisplay = '';
        let investigationSiteCodeDisplay = '';
        let investigationSiteNameDisplay = '';
        let addBtnDisplay = '';
        let none = "none";
        let inline = "inline";
        const curRole = sessionStorage.curRole;
        const {settled} = this.props;
        const siteId = sessionStorage.siteId;
        if(siteId != null && siteId != 0){
            cityDisplay = none;
            investigationSiteCodeDisplay = none;
            investigationSiteNameDisplay = none;
        } else {
            cityDisplay = inline;
            investigationSiteCodeDisplay = inline;
            investigationSiteNameDisplay = inline;
        }
        this.setState ({
            cityDisplay : cityDisplay,
            investigationSiteCodeDisplay : investigationSiteCodeDisplay,
            investigationSiteNameDisplay : investigationSiteNameDisplay,
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.cur !== this.state.cur){
            this.clearState();
            this.setState({
                cur: nextProps.cur
            })
        }
    }

    clearState = () => {
        this.setState(initState);
    }

    render() {
        const {
            requirementCode,
            city,
            investigationSiteCode,
            investigationSiteName,
            requireUser,
            assignedUser,
            assignUser,
            status,
            investigationCode,
            investigationName
        } = this.state;
        const {cityDisplay, investigationSiteCodeDisplay, investigationSiteNameDisplay, addBtnDisplay, investigationSponsor, investigationMedicine, investigationMalady} = this.state;
        const cur = this.props.cur;
        const canAdd = sessionStorage.curRole == 'BD' && cur == "original" || sessionStorage.curRole == 'PM' && cur == "plan";
        const btnTxt = this.props.cur == "plan" ? "新建计划需求" : "新建原始需求";
        const invId = sessionStorage.invId;
        return (
            <div className="filter-bar">
                <div className="form-item">
                    <label htmlFor="" className="ui-label">需求编号</label>
                    <Input
                        placeholder=""
                        value={requirementCode}
                        onChange={this.handleChange.bind(this, 'requirementCode')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                {invId == 0 && (sessionStorage.curRole == 'CRCC' || sessionStorage.curRole == 'CRCM' || sessionStorage.curRole == 'BO')  ?
                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目编号</label>
                        <Input
                            value={investigationCode}
                            onChange={this.handleChange.bind(this, 'investigationCode')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    :null}
                {invId == 0 && (sessionStorage.curRole == 'CRCC' || sessionStorage.curRole == 'CRCM' || sessionStorage.curRole == 'BO')  ?
                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">项目名称</label>
                        <Input
                            value={investigationName}
                            onChange={this.handleChange.bind(this, 'investigationName')}
                            onKeyPress={this.enterSearch}
                        />
                    </div> :null }
                {invId == 0 && (sessionStorage.curRole == 'CRCC' || sessionStorage.curRole == 'CRCM' || sessionStorage.curRole == 'BO')  ?
                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">申办方</label>
                        <Input
                            value={investigationSponsor}
                            onChange={this.handleChange.bind(this, 'investigationSponsor')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>:null}
                {invId == 0 && (sessionStorage.curRole == 'CRCC' || sessionStorage.curRole == 'CRCM' || sessionStorage.curRole == 'BO')  ?
                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">研究药物</label>
                        <Input
                            value={investigationMedicine}
                            onChange={this.handleChange.bind(this, 'investigationMedicine')}
                            onKeyPress={this.enterSearch}
                        />
                    </div> :null }
                {invId == 0 && (sessionStorage.curRole == 'CRCC' || sessionStorage.curRole == 'CRCM' || sessionStorage.curRole == 'BO')  ?
                    
                    <div className="form-item">
                        <label htmlFor="" className="ui-label">适应症</label>
                        <Input
                            value={investigationMalady}
                            onChange={this.handleChange.bind(this, 'investigationMalady')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>                    
                    :
                    null
                }
                <div className="form-item" style={{display:cityDisplay}}>
                    <label htmlFor="" className="ui-label">城市</label>
                    <Input
                        placeholder=""
                        value={city}
                        onChange={this.handleChange.bind(this, 'city')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                <div className="form-item" style={{display:investigationSiteCodeDisplay}}>
                    <label htmlFor="" className="ui-label">中心编号</label>
                    <Input
                        placeholder=""
                        value={investigationSiteCode}
                        onChange={this.handleChange.bind(this, 'investigationSiteCode')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                
                <div className="form-item" style={{display:investigationSiteNameDisplay}}>
                    <label htmlFor="" className="ui-label">中心名称</label>
                    <Input
                        placeholder=""
                        value={investigationSiteName}
                        onChange={this.handleChange.bind(this, 'investigationSiteName')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                <div className="form-item">
                    <label htmlFor="" className="ui-label">发起人</label>
                    <Input
                        placeholder=""
                        value={requireUser}
                        onChange={this.handleChange.bind(this, 'requireUser')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                {
                    this.props.cur == "plan" ?
                        <div className="form-item">
                            <label htmlFor="" className="ui-label">被分配人员</label>
                            <Input
                                placeholder=""
                                value={assignedUser}
                                onChange={this.handleChange.bind(this, 'assignedUser')}
                                onKeyPress={this.enterSearch}
                            />
                        </div>
                    :
                    null
                }
                {
                    this.props.cur == "plan" ?
                        <div className="form-item">
                            <label htmlFor="" className="ui-label">处理人</label>
                            <Input
                                placeholder=""
                                value={assignUser}
                                onChange={this.handleChange.bind(this, 'assignUser')}
                                onKeyPress={this.enterSearch}
                            />
                        </div>
                    :
                    null
                }

                <div className="form-item">
                    <label htmlFor="" className="ui-label">状态</label>
                    {this.props.cur == "plan"?
                        <Select 
                            onChange={this.handleChange.bind(this, 'status')} 
                            style={{width:90}}
                            placeholder="请选择"
                            allowClear = {true}
                            value = {status}
                        >
                            <Option value="NEW">新建</Option>
                            <Option value="ASSIGNED">预分配</Option>
                            <Option value="REASSIGNED">重新分配</Option>
                            <Option value="REJECTED">被拒绝</Option>
                            <Option value="ACTIVE">已确认</Option>
                        </Select>
                        :
                        <Select 
                            onChange={this.handleChange.bind(this, 'status')} 
                            style={{width:90}}
                            placeholder="请选择"
                            allowClear = {true}
                            value = {status}
                        >
                            <Option value="NEW">未引用</Option>
                            <Option value="ACTIVE">已引用</Option>
                        </Select>
                
                    }
                    

                </div>
                <Button type="primary" onClick={this.search}>搜索</Button>
                <Button type="primary" onClick={this.reset}>重置</Button>
                <Button type="primary" onClick={this.export}>导出</Button>
                {
                    canAdd ? 
                    <Button type="primary" icon="plus" onClick={this.showCreateModal}>{btnTxt}</Button>
                    :
                    null
                }
            </div>
        );
    }
}

export default Filter;
