import React from 'react';
import { Button, Input, Select, DatePicker } from 'antd';
import moment from 'moment';


const InputGroup = Input.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const initState = {
    startDate: null,
    endDate: null,
    userCompellation: '',
    investigationSiteCode: '',
    investigationSiteName: '',
    classify: '',
    questionOverview: '',
    replyFromDate: null,
    replyEndDate: null,
    replyPerson: '',
    dateFormat: 'YYYY-MM-DD',
    questionCategoryId:null,
    reply:null,
    pagination:{
        current:1,
        pageSize:15,
    },
}

class QAFilter extends React.Component {

    state = initState;

    showCreateModal = () => {
        this.props.showCreateModal();
    }

    handleChangeAskDate = value => {
        let startDate,endDate;
        const {dateFormat} = this.state;
        if(value.length == 1){
            startDate = value[0].format(dateFormat);
        }
        else if(value.length == 2){
            startDate = value[0].format(dateFormat);
            endDate = value[1].format(dateFormat);
        }else{
            startDate = null;
            endDate = null;
        }
        this.setState({startDate,endDate});
    }

    handleChangeReplyDate = value => {
        let replyFromDate,replyEndDate;
        const {dateFormat} = this.state;
        if(value.length == 1){
            replyFromDate = value[0].format(dateFormat);
        }
        else if(value.length == 2){
            replyFromDate = value[0].format(dateFormat);
            replyEndDate = value[1].format(dateFormat);
        }else{
            replyFromDate = null;
            replyEndDate = null;
        }
        this.setState({replyFromDate,replyEndDate});
    }

    handleChange = (field, e) => {
        if(field == "questionCategoryId"){
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
        this.props.reload({ ...this.state});
    }

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    }

    reset = () => {
        this.setState(initState);
        
        this.props.reset(initState);      
    }

    componentWillMount() {
        this.setState({
            reply:this.props.reply
        })
    }

    componentDidMount() {
 
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.reply !== this.state.reply){

            this.setState(initState,function(){
                this.setState({reply: nextProps.reply})
            });
        }
        
    }

    render() {
        const {
            startDate,
            endDate,
            userCompellation,
            investigationSiteCode,
            investigationSiteName,
            classify,
            questionOverview,
            replyFromDate,
            replyEndDate,
            replyPerson,
            dateFormat,
            questionCategoryId
        } = this.state;
        const reply = this.props.reply;
        const canAdd = !reply && sessionStorage.curRole == "CRC";
        const options = this.props.typeList.map(d => <Option key={d.questionCategoryId}>{d.questionCategoryName}</Option>);
        return (
            <div className="filter-bar qa-filter">
                <div className="form-item">
                    <label htmlFor="提问日期" className="ui-label">提问日期</label>
                    {
                        startDate && endDate ?
                        <RangePicker
                        format={dateFormat}
                        onChange={this.handleChangeAskDate}
                        
                        value={[moment(startDate),moment(endDate)]} />
                        :
                        <RangePicker
                        format={dateFormat}
                        onChange={this.handleChangeAskDate}
                        value={[,]} />
                    }
                    

                </div>
                
               
                <div className="form-item">
                    <label htmlFor="" className="ui-label">提问人员</label>
                    <Input
                        value={userCompellation}
                        onChange={this.handleChange.bind(this, 'userCompellation')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                <div className="form-item">
                    <label htmlFor="" className="ui-label">中心编号</label>
                    <Input
                        value={investigationSiteCode}
                        onChange={this.handleChange.bind(this, 'investigationSiteCode')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                <div className="form-item">
                    <label htmlFor="" className="ui-label">中心名称</label>
                    <Input
                        value={investigationSiteName}
                        onChange={this.handleChange.bind(this, 'investigationSiteName')}
                        onKeyPress={this.enterSearch}
                    />
                </div>

                <div className="form-item">
                    <label htmlFor="" className="ui-label">问题分类</label>
                        <Select
                            value={questionCategoryId}
                            onChange={this.handleChange.bind(this, 'questionCategoryId')} 
                            onBlur={this.handleBlur}
                            allowClear={true}
                            style={{width:'130px'}}
                        >
                            {options}
                        </Select>
                </div>
                <div className="form-item">
                    <label htmlFor="" className="ui-label">问题概述</label>
                    <Input
                        value={questionOverview}
                        onChange={this.handleChange.bind(this, 'questionOverview')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                {
                    reply && 
                    <div>
                    <div className="form-item">
                        <label htmlFor="回复日期" className="ui-label">回复日期</label>
                        {
                            replyFromDate && replyEndDate ?
                            <RangePicker
                            format={dateFormat}
                            onChange={this.handleChangeReplyDate}
                            value={[moment(replyFromDate),moment(replyEndDate)]} />
                            :
                            <RangePicker
                            format={dateFormat}
                            onChange={this.handleChangeReplyDate}
                            value={[,]} />
                        }
                        
                    </div>

                    <div className="form-item">
                        <label htmlFor="" className="ui-label">回复人员</label>
                        <Input
                            value={replyPerson}
                            onChange={this.handleChange.bind(this, 'replyPerson')}
                            onKeyPress={this.enterSearch}
                        />
                    </div>
                    </div>
                }
                

                <Button type="primary" icon="search" onClick={this.search}>搜索</Button>
                <Button type="primary" icon="reload" onClick={this.reset}>重置</Button>
                {
                    canAdd ? 
                    <Button type="primary" icon="plus" onClick={this.showCreateModal}>新建</Button>
                    :
                    null
                }
                {/*<Button type="primary" icon="export" onClick={this.export}>导出</Button>*/}
            </div>
        );
    }
}

export default QAFilter;
