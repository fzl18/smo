import $ from '../../common/AjaxRequest';
import React from 'react';
import moment from 'moment';
import {message, Modal, Popconfirm,Pagination} from 'antd';
import API_URL from '../../common/url';
import './style/notice.less'


// import './style/list.less';


class Notice extends React.Component {
    state = {
        pagination: {
            pageSize: 20,
            current: 1,
        },
        loading: false,
        dataList: [],
        ids: [],
    };

    loadData = () => {                
        const options = {
            method: 'POST',
            url: API_URL.home.queryTodayNoticeAll,
            data: {
                // statusSymbol: 'NotEquals',
                // stpaginationatus: 'DELETED',
                // offset: 1,
                // limit: 15,
                // ...params,
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    const pagination = { ...this.state.pagination };
                    pagination.total = data.totalCount;
                    this.setState({
                        dataList: data.datas,
                        pagination,
                    });
                } else {
                    Modal.error({title: data.error});
                }
            }
        }
        $.sendRequest(options)
    }


    reload = (params = {}) => {
        const {pagination} = this.state;
        this.loadData({
            offset: pagination.current,
            ...params,
        });
    }

    reset = () => {
        const pagination = {...this.state.pagination, current: 1};
        this.setState({
            pagination,
        });
        this.loadData();
    };
    read = () => {
        const {ids, dataList} = this.state;
        let param = {};
        dataList.map((d, i) => {
            param[`ids[${i}]`] = d.noticeId;
        });

        const options = {
            method: 'POST',
            url: API_URL.home.confirmNoticeRead,
            data: {
                ...param
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    message.info(data.success)
                    this.loadData()
                } else {
                    Modal.error({title: data.error});
                }
            }
        }
        $.sendRequest(options)
        
    };
    del = () => {
        const {ids, dataList} = this.state;
        let param = {};
        dataList.map((d, i) => {
            param[`ids[${i}]`] = d.noticeId;
        });

        const options = {
            method: 'POST',
            url: API_URL.home.emptyAllNoticeByUserId,
            data: {
                ...param
            },
            dataType: 'json',
            doneResult: data => {
                if (!data.error) {
                    message.info(data.success)
                    this.reload();
                } else {
                    Modal.error({title: data.error});
                }
            }
        }
        $.sendRequest(options)

    };


    componentDidMount() {
        this.loadData();
    }

    handlePages = (page, pageSize)=>{
        const pagination = { ...this.state.pagination };
        pagination.current = page;
        this.setState({
            pagination,
        });
    }

    clickNotice = (path, setSession) => {
        if(Object.keys(setSession).length !== 0 && setSession.constructor === Object){
            sessionStorage.invId = setSession.invId;
            sessionStorage.invName = setSession.invName;
            sessionStorage.investigationSiteCode = setSession.investigationSiteCode;
            sessionStorage.investigationSiteName = setSession.investigationSiteName;
            sessionStorage.siteId = setSession.siteId;
        }
        if(path !== "javascript:void(0)" || path){
            location.href = path;
        }
    }

    render() {
        const { loading, pagination,dataList} = this.state;
        let list=[]
        if(dataList.length > 0){
            dataList.map((d,i) => {
                if( i>= (pagination.current-1)* pagination.pageSize-1 && i <= pagination.current* pagination.pageSize-1){
                let type,path,date;
                const setSession = {};
                switch(d.noticeType){
                    case 'INVESTIGATION_REQUIREMENT' :
                    type = '需求通知';
                    if(d.noticeTargetList && d.noticeTargetList[0]){
                        const roleCode = d.noticeTargetList[0].roleCode;
                        if(roleCode == 'CRCM' || roleCode == 'CRCC' || roleCode == 'CRC'){
                            path = d.noticeTargetList[0].roleCode ==='CRC' ? 'javascript:void(0)' :`/front/#/user/Require/${d.relateId}`
                        }else{
                            const {investigationId, investigationName, investigationSiteCode, investigationSiteId, investigationSiteName} = d.noticeTargetList[0];
                            setSession.invId = investigationId;
                            setSession.invName = investigationName;
                            setSession.investigationSiteCode = investigationSiteCode;
                            setSession.investigationSiteName = investigationSiteName;
                            setSession.siteId = investigationSiteId;
                            path = `/front/#/member/require/${d.relateId}`;                      
                        }
                    }
                    break;
                    case 'HANDOVER_REQUIREMENT' :
                    type = '交接通知'
                    if(d.noticeTargetList && d.noticeTargetList[0]){
                        const roleCode = d.noticeTargetList[0].roleCode;
                        if(roleCode == 'CRCM' || roleCode == 'CRCC' || roleCode == 'CRC'){
                            path = d.noticeTargetList[0].roleCode ==='CRC' ? 'javascript:void(0)' : `/front/#/user/UserTransfer/${d.relateId}` 
                        }else{
                            const {investigationId, investigationName, investigationSiteCode, investigationSiteId, investigationSiteName} = d.noticeTargetList[0];
                            setSession.invId = investigationId;
                            setSession.invName = investigationName;
                            setSession.investigationSiteCode = investigationSiteCode;
                            setSession.investigationSiteName = investigationSiteName;
                            setSession.siteId = investigationSiteId;
                            path = `/front/#/execute/transfer/${d.relateId}` ;                      
                        }
                    }                
                    break;
                    case 'VISIT' :
                    type = '访视通知'
                    path = `/front/#/execute/crf/Type_Visit/${d.relateId}`
                    const {visitInvestigationId, visitInvestigationName, visitInvestigationSiteCode, visitInvestigationSiteId, visitInvestigationSiteName} = d;
                    setSession.invId = visitInvestigationId;
                    setSession.invName = visitInvestigationName;
                    setSession.investigationSiteCode = visitInvestigationSiteCode;
                    setSession.investigationSiteName = visitInvestigationSiteName;
                    setSession.siteId = visitInvestigationSiteId;
                    break;
                    case 'EVENT' :
                    type = '事件通知'
                    path = 'javascript:void(0)'
                    break;
                    case 'AUTHORITY' :
                    type = '授权通知'
                    path = `/front/#/invList/${d.relateId}`
                    break;
                    case 'MANHOUR' :
                    type = '工时通知'
                    path = d.relateId ? `/front/#/manHour/write/${d.relateId}/${d.noticeInfo.substring(0,10)}` : 'javascript:void(0)'
                    break;
                }
                if(d.readStatus){
                    list.push(<li key={i} className=''><a onClick={() => {this.clickNotice(path,setSession)}} style={{width:'90%',display:'inline-block'}} ><span>○ </span>[{type}]{d.noticeInfo}</a><time style={{color:'#ccc'}}>{moment(d.createTime).format('YYYY/MM/DD')}</time></li>) 
                }else{
                    list.push(<li key={i} className='read'><a onClick={() => {this.clickNotice(path,setSession)}} style={{width:'90%',display:'inline-block'}} ><span>● </span>[{type}]{d.noticeInfo}</a><time style={{color:'#ccc'}}>{moment(d.createTime).format('YYYY/MM/DD')}</time></li>)
                }
            }})
        }
              
        return (
            <div className="full">
                <div style={{color: '#3D33A9'}}><i className='icon iconfont'>&#xe65b;</i>消息</div>
                <div className="" style={{textAlign: 'right'}}>
                    <Popconfirm title="是否确认全部标记为已读？" onConfirm={this.read} okText="是" cancelText="否">
                        <a href='javascript:Void(0)'><i className='icon iconfont'>&#xe617;</i></a>
                    </Popconfirm>
                    <span className="ant-divider"/>
                    <Popconfirm title="是否清空所有消息？" onConfirm={this.del} okText="是" cancelText="否">
                        <a href='javascript:Void(0)'><i className='icon iconfont'>&#xe615;</i></a>
                    </Popconfirm>
                </div>
                <div className="content-2">
                    <ul className='notice'>
                        {dataList.length > 0 ? list : <li> 暂无内容</li>}
                    </ul>
                    <div className='pages'><Pagination onChange={this.handlePages} current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} /></div>
                </div>
            </div>
        );
    }
}

export default Notice;

