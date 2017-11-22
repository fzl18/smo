import React from 'react';
import { Menu, Icon } from 'antd';

import auth from '../../common/Auth';
import { PAGEAUTH } from '../../common/AuthConfig';
import './style/layout.less';

const SubMenu = Menu.SubMenu;

class Nav extends React.Component {
    state = {
        current: '/home',
    }

    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }

    getHashUrl = () => {
        let hashStr = location.hash.substr(1);
        if(hashStr.startsWith("/member/require/")){
            hashStr = "/member/require"
        }else if(hashStr.startsWith("/execute/crf/Type_Visit/")){
            hashStr = "/execute/crf/Type_Visit"
        }else if(hashStr.startsWith("/execute/transfer/")){
            hashStr = "/execute/transfer"
        }else if(hashStr.startsWith("/manHour/write")){
            hashStr = "/manHour/write"
        }else if(hashStr.startsWith("/user/UserTransfer/")){
            hashStr = "/user/UserTransfer"
        }else if(hashStr.startsWith("/user/Require/")){
            hashStr = "/user/Require"
        }else if(hashStr.startsWith("/invList/")){
            hashStr = "/invList"
        }
        return hashStr;
    }

	checkPageAuth = () => {
        const {siteId, curRole, invId} = sessionStorage;
        const hashStr = this.getHashUrl();
        let pageAuth = {};
        if(siteId == "0" || siteId == ""){
            pageAuth = PAGEAUTH.allSites;
        }else{
            pageAuth = PAGEAUTH.detailSite;
        }
        if(invId != "0"){
            if(pageAuth.hasOwnProperty(hashStr)){
                if(pageAuth[hashStr][0] == "*"){
                    return;
                }
                if(!pageAuth[hashStr].includes(curRole)){
                    location.href = `./#/summary/view/cumInfRan`;
                }
            }else{
                location.href = `./#/summary/view/cumInfRan`;
            }
        }
        
    }

    componentWillReceiveProps(){
        this.checkPageAuth();
        const hashStr = this.getHashUrl();
        this.setState({
            current: hashStr
        })
    }

    componentWillMount(){
        this.checkPageAuth();
        const hashStr = this.getHashUrl();
        this.setState({
            current: hashStr
        })
    }
    // SY, //系统管理员
    // EA, //企业管理员
    // BO, //总监
    // BDO, //BD总监
    // BD,
    // PA, //项目管理员
    // PM, //项目经理
    // CRCC, //CRC主管
    // CRCM, //CRC经理
    // CRC, //临床协调员
    // CPM, //客户项目经理
    // PI, //研究者
    // CRA, //监察员
    // OTH, //其它

    render() {
        const role = sessionStorage.curRole;
        let isCRC = role == 'CRC';
        let isCRCC = role == 'CRCC';
        let isPM = role == 'PM';
        let isCRCM = role == 'CRCM';
        let isBO = role == 'BO';
        let isBD = role == 'BD';
        let isBDO = role == 'BDO';
       
        return (
            <nav className="nav-bar">
                <div className="wrapper">
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    {
                        /* 首页、临床项目*/
                        auth('role', [ 'PM', 'CRC', 'CRCC', 'CRCM', 'BO', 'BD', 'BDO'], 0)(
                            //'PA', 'PM', 'CRC', 'CRCC', 'CRCM', 'BO', 'BD', 'BOD'
                                <Menu.Item key="/home"><a href="#/home"><i className="icon iconfont">&#xe644;</i>首页</a></Menu.Item>                                
                            
                        )
                    }
                    {
                        /* 首页、临床项目*/
                        auth('role', ['PA', 'PM', 'CRC', 'CRCC', 'CRCM', 'BO', 'BD', 'BDO'], 0)(
                            //'PA', 'PM', 'CRC', 'CRCC', 'CRCM', 'BO', 'BD', 'BOD'
                               
                                <Menu.Item key="/invList"><a href="#/invList"><i className="icon iconfont">&#xe782;</i>临床项目</a></Menu.Item>
                            
                        )
                    }
                    {
                        /* 工时记录*/
                        auth('role', ['PM', 'CRC', 'CRCC', 'CRCM', 'BO'], 0)(
                            
                                <SubMenu title={<span><i className="icon iconfont">&#xe629;</i>工时记录</span>}>
                                    {
                                        (isPM || isCRC || isCRCC) && <Menu.Item key="/manHour/write"><a href="#/manHour/write"><i className="icon iconfont">&#xe64f;</i>填写工时</a></Menu.Item>
                                    }
                                    {
                                        (isPM || isCRC || isCRCC) && <Menu.Item key="/manHour/fte"><a href="#/manHour/fte"><i className="icon iconfont">&#xe898;</i>月度FTE</a></Menu.Item>
                                    }
                                    {
                                        (isPM || isCRC || isCRCC) && <Menu.Item key="/manHour/myWeekly"><a href="#/manHour/myWeekly"><i className="icon iconfont">&#xe60f;</i>我的周报</a></Menu.Item>
                                    }
                                    {
                                        (isCRC || isCRCC) && <Menu.Item key="/manHour/myEfficiency"><a href="#/manHour/myEfficiency"><i className="icon iconfont">&#xe636;</i>我的效率</a></Menu.Item>
                                    }
                                    {
                                        (isCRCC || isCRCM || isBO) && <Menu.Item key="/manHour/search"><a href="#/manHour/search"><i className="icon iconfont">&#xe709;</i>工时查询</a></Menu.Item>
                                    }
                                    {
                                        isBO && <Menu.Item key="/manHour/report"><a href="#/manHour/report"><i className="icon iconfont">&#xe601;</i>工时报告</a></Menu.Item>
                                    }
                                </SubMenu>
                            










                                


                        )
                    }
                    {

                        /* 人员管理*/
                        auth('role', ['CRCC', 'CRCM', 'BO'], 0)(
                            
                                <SubMenu title={<span><i className="icon iconfont">&#xe648;</i>人员管理</span>}>
                                    <Menu.Item key="/user/UserView"><a href="#/user/UserView"><i className="icon iconfont">&#xe73c;</i>人员信息</a></Menu.Item>
                                    <Menu.Item key="/user/UserPlan"><a href="#/user/UserPlan"><i className="icon iconfont">&#xe648;</i>人员安排</a></Menu.Item>
                                    <Menu.Item key="/user/Require"><a href="#/user/Require"><i className="icon iconfont">&#xe69a;</i>人员需求</a></Menu.Item>
                                    <Menu.Item key="/user/UserEfficiency"><a href="#/user/UserEfficiency"><i className="icon iconfont">&#xe636;</i>人员效率</a></Menu.Item>
                                    <Menu.Item key="/user/UserDistribution"><a href="#/user/UserDistribution"><i className="icon iconfont">&#xe69c;</i>人员分布</a></Menu.Item>
                                    <Menu.Item key="/user/UserTransfer"><a href="#/user/UserTransfer"><i className="icon iconfont">&#xe612;</i>人员交接</a></Menu.Item>
                                    <Menu.Item key="/user/UserAnalysis"><a href="#/user/UserAnalysis"><i className="icon iconfont">&#xe613;</i>人员分析</a></Menu.Item>
                                </SubMenu>
                            
                        )
                    }
                    {
                        /* 医院档案*/
                        auth('role', ['PM', 'CRC', 'CRCC', 'CRCM', 'BO', 'BD', 'BDO'], 0)(
                            
                                <SubMenu title={<span><i className="icon iconfont">&#xe600;</i>医院档案</span>}>
                                    <Menu.Item key="/hospital/detail"><a href="#/hospital/detail"><i className="icon iconfont">&#xe600;</i>医院信息</a></Menu.Item>
                                    <Menu.Item key="/hospital/departmentDetail"><a href="#/hospital/departmentDetail"><i className="icon iconfont">&#xe675;</i>医院科室信息</a></Menu.Item>
                                    <Menu.Item key="/hospital/doctor"><a href="#/hospital/doctor"><i className="icon iconfont">&#xe63a;</i>医生信息</a></Menu.Item>
                                </SubMenu>
                            
                        )
                    }
                    {
                        /* 项目信息*/
                        auth('role', ['PA'], 1)(
                            
                                <Menu.Item key="/invDetails"><a href="#/invDetails"><i className="icon iconfont">&#xe6d1;</i>项目信息</a></Menu.Item>
                            
                        )
                    }
                    
                    {
                        /* 项目状态*/
                        auth('role', ['PM', 'BO', 'BD', 'BDO', 'CRCM'], 1)(
                            
                                <SubMenu title={<span><i className="icon iconfont">&#xe60d;</i>项目状态</span>}>
                                    <SubMenu title={<span><i className="icon iconfont">&#xe675;</i>入组情况</span>}>
                                        <Menu.Item key="/summary/view/cumInfRan"><a href="#/summary/view/cumInfRan"><i className="icon iconfont">&#xe69a;</i>累计知情随机(入组)</a></Menu.Item>
                                        <Menu.Item key="/summary/view/monInfRam"><a href="#/summary/view/monInfRam"><i className="icon iconfont">&#xe69a;</i>每月知情随机(入组)</a></Menu.Item>
                                        <Menu.Item key="/summary/view/cumFilRan"><a href="#/summary/view/cumFilRan"><i className="icon iconfont">&#xe69a;</i>累计筛选随机(入组)</a></Menu.Item>
                                        <Menu.Item key="/summary/view/monFilRan"><a href="#/summary/view/monFilRan"><i className="icon iconfont">&#xe69a;</i>每月筛选随机(入组)</a></Menu.Item>
                                        <Menu.Item key="/summary/visit/cumVisit"><a href="#/summary/visit/cumVisit"><i className="icon iconfont">&#xe6b5;</i>累计完成访视</a></Menu.Item>
                                        <Menu.Item key="/summary/visit/monVisit"><a href="#/summary/visit/monVisit"><i className="icon iconfont">&#xe6b5;</i>每月完成访视</a></Menu.Item>
                                        <Menu.Item key="/summary/site/siteInformed"><a href="#/summary/site/siteInformed"><i className="icon iconfont">&#xe6a7;</i>各中心知情情况</a></Menu.Item>
                                        <Menu.Item key="/summary/site/siteFilter"><a href="#/summary/site/siteFilter"><i className="icon iconfont">&#xe6a7;</i>各中心筛选情况</a></Menu.Item>
                                        <Menu.Item key="/summary/site/siteRandom"><a href="#/summary/site/siteRandom"><i className="icon iconfont">&#xe6a7;</i>各中心随机(入组)情况</a></Menu.Item>
                                    </SubMenu>
                                    <SubMenu title={<span><i className="icon iconfont">&#xe675;</i>FTE情况</span>}>
                                        <Menu.Item key="/summary/fte/cumFTE"><a href="#/summary/fte/cumFTE"><i className="icon iconfont">&#xe6b3;</i>累计FTE情况</a></Menu.Item>
                                        <Menu.Item key="/summary/fte/monFTE"><a href="#/summary/fte/monFTE"><i className="icon iconfont">&#xe6b3;</i>每月FTE情况</a></Menu.Item>
                                        <Menu.Item key="/summary/siteFTE"><a href="#/summary/siteFTE"><i className="icon iconfont">&#xe6b3;</i>各中心FTE情况</a></Menu.Item>
                                    </SubMenu>
                                    <SubMenu title={<span><i className="icon iconfont">&#xe675;</i>数据分析</span>}>
                                        <Menu.Item key="/summary/filter/filterSource"><a href="#/summary/filter/filterSource"><i className="icon iconfont">&#xe613;</i>筛选来源统计</a></Menu.Item>
                                        <Menu.Item key="/summary/filter/filterReason"><a href="#/summary/filter/filterReason"><i className="icon iconfont">&#xe613;</i>筛选失败原因统计</a></Menu.Item>
                                    </SubMenu>
                                </SubMenu>
                            
                        )
                    }
                    {
                        /* 项目计划*/
                        auth('role', ['PA', 'PM', 'BO', 'BD', 'BDO'], 1)(
                            
                                <SubMenu title={<span><i className="icon iconfont">&#xe639;</i>项目计划</span>}>
                                    <Menu.Item key="/plan/degree"><a href="#/plan/degree"><i className="icon iconfont">&#xe60d;</i>项目阶段进度计划</a></Menu.Item>
                                    <Menu.Item key="/plan/investigation/Type_Informed"><a href="#/plan/investigation/Type_Informed"><i className="icon iconfont">&#xe6b3;</i>项目知情计划</a></Menu.Item>
                                    <Menu.Item key="/plan/investigation/Type_Filter"><a href="#/plan/investigation/Type_Filter"><i className="icon iconfont">&#xe624;</i>项目筛选计划</a></Menu.Item>
                                    <Menu.Item key="/plan/investigation/Type_Random"><a href="#/plan/investigation/Type_Random"><i className="icon iconfont">&#xe6b5;</i>项目随机(入组)计划</a></Menu.Item>
                                    <Menu.Item key="/plan/site/Type_Informed"><a href="#/plan/site/Type_Informed"><i className="icon iconfont">&#xe6b3;</i>各中心知情计划</a></Menu.Item>
                                    <Menu.Item key="/plan/site/Type_Filter"><a href="#/plan/site/Type_Filter"><i className="icon iconfont">&#xe6a7;</i>各中心筛选计划</a></Menu.Item>
                                    <Menu.Item key="/plan/site/Type_Random"><a href="#/plan/site/Type_Random"><i className="icon iconfont">&#xe6b5;</i>各中心随机(入组)计划</a></Menu.Item>
                                    <Menu.Item key="/plan/visitType"><a href="#/plan/visitType"><i className="icon iconfont">&#xe60f;</i>项目访视周期计划</a></Menu.Item>
                                </SubMenu>
                            
                        )
                    }
                    {
                        /* 研究中心*/
                        auth('role', ['PA', 'PM', 'BO', 'BD', 'BDO'], 1)(
                            
                                <SubMenu title={<span><i className="icon iconfont">&#xe6b2;</i>研究中心</span>}>
                                    <Menu.Item key="/site/detail"><a href="#/site/detail"><i className="icon iconfont">&#xe6b2;</i>研究中心信息</a></Menu.Item>
                                    <Menu.Item key="/site/pi"><a href="#/site/pi"><i className="icon iconfont">&#xe61c;</i>研究者信息</a></Menu.Item>
                                    <Menu.Item key="/site/cra"><a href="#/site/cra"><i className="icon iconfont">&#xe73c;</i>CRA信息</a></Menu.Item>
                                </SubMenu>
                            
                        )
                    }
                    {
                        /* 项目成员*/
                        auth('role', ['PA', 'PM', 'BO', 'BD', 'BDO'], 1)(
                            
                                <SubMenu title={<span><i className="icon iconfont">&#xe73c;</i>项目成员</span>}>
                                    <Menu.Item key="/member/crc"><a href="#/member/crc"><i className="icon iconfont">&#xe73c;</i>CRC信息</a></Menu.Item>
                                    {
                                        (isPM || isBO || isBD || isBDO) && <Menu.Item key="/member/require"><a href="#/member/require"><i className="icon iconfont">&#xe6a7;</i>人员需求</a></Menu.Item>
                                    }
                                    {
                                        (isPM || isBO || isBD || isBDO) && <Menu.Item key="/member/distribution"><a href="#/member/distribution"><i className="icon iconfont">&#xe6cf;</i>人员分布</a></Menu.Item>
                                    }
                                </SubMenu>
                            
                        )
                    }
                    {
                        /* 项目执行管理端*/
                        auth('role', ['PA'], 1)(
                            
                                <SubMenu title={<span><i className="icon iconfont">&#xe702;</i>项目执行</span>}>
                                    <Menu.Item key="/executeMgr/manHour"><a href="#/executeMgr/manHour"><i className="icon iconfont">&#xe6e1;</i>项目工时记录</a></Menu.Item>
                                    <Menu.Item key="/executeMgr/patients"><a href="#/executeMgr/patients"><i className="icon iconfont">&#xe8cd;</i>病例数记录</a></Menu.Item>
                                    <Menu.Item key="/executeMgr/crf/Type_Visit"><a href="#/executeMgr/crf/Type_Visit"><i className="icon iconfont">&#xe73e;</i>访视记录</a></Menu.Item>
                                    <Menu.Item key="/executeMgr/crf/Type_Pre_Filter"><a href="#/executeMgr/crf/Type_Pre_Filter"><i className="icon iconfont">&#xe60e;</i>预筛记录</a></Menu.Item>
                                    <Menu.Item key="/executeMgr/qa"><a href="#/executeMgr/qa"><i className="icon iconfont">&#xe698;</i>Q&Alog</a></Menu.Item>
                                    <Menu.Item key="/executeMgr/site/Type_Site_Start"><a href="#/executeMgr/site/Type_Site_Start"><i className="icon iconfont">&#xe702;</i>中心启动记录</a></Menu.Item>
                                    <Menu.Item key="/executeMgr/site/Type_Site"><a href="#/executeMgr/site/Type_Site"><i className="icon iconfont">&#xe639;</i>中心记录</a></Menu.Item>
                                    <Menu.Item key="/executeMgr/crf/Type_Drop"><a href="#/executeMgr/crf/Type_Drop"><i className="icon iconfont">&#xe613;</i>脱落记录</a></Menu.Item>
                                    <Menu.Item key="/executeMgr/crf/Type_Violation"><a href="#/executeMgr/crf/Type_Violation"><i className="icon iconfont">&#xe7d2;</i>重大违背记录</a></Menu.Item>
                                    <Menu.Item key="/executeMgr/crf/Type_SAE"><a href="#/executeMgr/crf/Type_SAE"><i className="icon iconfont">&#xe691;</i>SAE记录</a></Menu.Item>
                                    <Menu.Item key="/executeMgr/transfer"><a href="#/executeMgr/transfer"><i className="icon iconfont">&#xe612;</i>交接记录</a></Menu.Item>
                                </SubMenu>

                        )
                    }
                    {
                        /* 项目执行运行端*/
                        auth('role', ['PM', 'BO','CRC', 'BD', 'BDO'], 1)(
                            
                                <SubMenu title={<span><i className="icon iconfont">&#xe702;</i>项目执行</span>}>
                                    <Menu.Item key="/execute/manHour"><a href="#/execute/manHour"><i className="icon iconfont">&#xe6e1;</i>项目工时记录</a></Menu.Item>
                                    <Menu.Item key="/execute/patients"><a href="#/execute/patients"><i className="icon iconfont">&#xe8cd;</i>病例数记录</a></Menu.Item>
                                    <Menu.Item key="/execute/crf/Type_Visit"><a href="#/execute/crf/Type_Visit"><i className="icon iconfont">&#xe73e;</i>访视记录</a></Menu.Item>
                                    <Menu.Item key="/execute/crf/Type_Pre_Filter"><a href="#/execute/crf/Type_Pre_Filter"><i className="icon iconfont">&#xe60e;</i>预筛记录</a></Menu.Item>
                                    {
                                        (isPM || isBD || isBDO || isBO) && <Menu.Item key="/execute/qa"><a href="#/execute/qa"><i className="icon iconfont">&#xe698;</i>Q&Alog</a></Menu.Item>
                                    }
                                    <Menu.Item key="/execute/site/Type_Site_Start"><a href="#/execute/site/Type_Site_Start"><i className="icon iconfont">&#xe702;</i>中心启动记录</a></Menu.Item>
                                    <Menu.Item key="/execute/site/Type_Site"><a href="#/execute/site/Type_Site"><i className="icon iconfont">&#xe639;</i>中心记录</a></Menu.Item>
                                    <Menu.Item key="/execute/crf/Type_Drop"><a href="#/execute/crf/Type_Drop"><i className="icon iconfont">&#xe613;</i>脱落记录</a></Menu.Item>
                                    <Menu.Item key="/execute/crf/Type_Violation"><a href="#/execute/crf/Type_Violation"><i className="icon iconfont">&#xe7d2;</i>重大违背记录</a></Menu.Item>
                                    <Menu.Item key="/execute/crf/Type_SAE"><a href="#/execute/crf/Type_SAE"><i className="icon iconfont">&#xe691;</i>SAE记录</a></Menu.Item>
                                    <Menu.Item key="/execute/transfer"><a href="#/execute/transfer"><i className="icon iconfont">&#xe612;</i>交接记录</a></Menu.Item>
                                </SubMenu>
                            
                        )
                    }
                    {
                        /* 项目汇总*/
                        auth('role', ['PM', 'BO', 'BD', 'BDO', 'CRCM'], 1)(
                            
                                <SubMenu title={<span><i className="icon iconfont">&#xe6a7;</i>项目汇总</span>}>
                                    <Menu.Item key="/sumTotal/summary"><a href="#/sumTotal/summary"><i className="icon iconfont">&#xe6b5;</i>项目周汇总</a></Menu.Item>
                                     <Menu.Item key="/sumTotal/Monthsum"><a href="#/sumTotal/Monthsum"><i className="icon iconfont">&#xe6b5;</i>项目月汇总</a></Menu.Item>
                                    <Menu.Item key="/sumTotal/efficiency/pro"><a href="#/sumTotal/efficiency/pro"><i className="icon iconfont">&#xe69a;</i>项目效率</a></Menu.Item>
                                    <Menu.Item key="/sumTotal/percent"><a href="#/sumTotal/percent"><i className="icon iconfont">&#xe69a;</i>项完工百分比</a></Menu.Item>
                                </SubMenu>
                            
                        )
                    }
                    {
                        /* 项目状态*/
                        auth('role', ['PM', 'BO', 'BD', 'BDO', 'CRC', 'CRCC', 'CRCM'], 2)(
                            
                                <SubMenu title={<span><i className="icon iconfont">&#xe60d;</i>项目状态</span>}>
                                    <SubMenu title={<span><i className="icon iconfont">&#xe675;</i>入组情况</span>}>
                                        <Menu.Item key="/summary/view/cumInfRan"><a href="#/summary/view/cumInfRan"><i className="icon iconfont">&#xe69a;</i>累计知情随机(入组)</a></Menu.Item>
                                        <Menu.Item key="/summary/view/monInfRam"><a href="#/summary/view/monInfRam"><i className="icon iconfont">&#xe69a;</i>每月知情随机(入组)</a></Menu.Item>
                                        <Menu.Item key="/summary/view/cumFilRan"><a href="#/summary/view/cumFilRan"><i className="icon iconfont">&#xe69a;</i>累计筛选随机(入组)</a></Menu.Item>
                                        <Menu.Item key="/summary/view/monFilRan"><a href="#/summary/view/monFilRan"><i className="icon iconfont">&#xe69a;</i>每月筛选随机(入组)</a></Menu.Item>
                                        <Menu.Item key="/summary/visit/cumVisit"><a href="#/summary/visit/cumVisit"><i className="icon iconfont">&#xe6b5;</i>累计完成访视</a></Menu.Item>
                                        <Menu.Item key="/summary/visit/monVisit"><a href="#/summary/visit/monVisit"><i className="icon iconfont">&#xe6b5;</i>每月完成访视</a></Menu.Item>
                                    </SubMenu>
                                    <SubMenu title={<span><i className="icon iconfont">&#xe675;</i>FTE情况</span>}>
                                        <Menu.Item key="/summary/fte/cumFTE"><a href="#/summary/fte/cumFTE"><i className="icon iconfont">&#xe6a7;</i>累计FTE情况</a></Menu.Item>
                                        <Menu.Item key="/summary/fte/monFTE"><a href="#/summary/fte/monFTE"><i className="icon iconfont">&#xe6a7;</i>每月FTE情况</a></Menu.Item>
                                    </SubMenu>
                                    <SubMenu title={<span><i className="icon iconfont">&#xe675;</i>数据分析</span>}>
                                        <Menu.Item key="/summary/filter/filterSource"><a href="#/summary/filter/filterSource"><i className="icon iconfont">&#xe613;</i>筛选来源统计</a></Menu.Item>
                                        <Menu.Item key="/summary/filter/filterReason"><a href="#/summary/filter/filterReason"><i className="icon iconfont">&#xe613;</i>筛选失败原因统计</a></Menu.Item>
                                    </SubMenu>
                                </SubMenu>
                            
                        )
                    }
                    {
                        /* 项目计划*/
                        auth('role', ['PM', 'BO', 'BD', 'BDO', 'CRC', 'CRCC', 'CRCM'], 2)(
                            
                                <SubMenu title={<span><i className="icon iconfont">&#xe639;</i>项目计划</span>}>
                                    <Menu.Item key="/plan/site/Type_Informed"><a href="#/plan/site/Type_Informed"><i className="icon iconfont">&#xe6b3;</i>中心知情计划</a></Menu.Item>
                                    <Menu.Item key="/plan/site/Type_Filter"><a href="#/plan/site/Type_Filter"><i className="icon iconfont">&#xe6b5;</i>中心筛选计划</a></Menu.Item>
                                    <Menu.Item key="/plan/site/Type_Random"><a href="#/plan/site/Type_Random"><i className="icon iconfont">&#xe6a7;</i>中心随机(入组)计划</a></Menu.Item>
                                    <Menu.Item key="/plan/visitType"><a href="#/plan/visitType"><i className="icon iconfont">&#xe609;</i>项目访视周期计划</a></Menu.Item>
                                </SubMenu>
                            
                        )
                    }
                    {
                        /* 研究中心*/
                        auth('role', ['PM', 'BO', 'BD', 'BDO', 'CRC', 'CRCC', 'CRCM'], 2)(
                            
                                <SubMenu title={<span><i className="icon iconfont">&#xe6b2;</i>研究中心</span>}>
                                    <Menu.Item key="/site/detail"><a href="#/site/detail"><i className="icon iconfont">&#xe6b2;</i>研究中心信息</a></Menu.Item>
                                    <Menu.Item key="/site/pi"><a href="#/site/pi"><i className="icon iconfont">&#xe61c;</i>研究者信息</a></Menu.Item>
                                    <Menu.Item key="/site/cra"><a href="#/site/cra"><i className="icon iconfont">&#xe614;</i>CRA信息</a></Menu.Item>
                                </SubMenu>
                            
                        )
                    }
                    {
                        /* 项目成员*/
                        auth('role', ['PM', 'BO', 'BD', 'BDO', 'CRC', 'CRCC', 'CRCM'], 2)(
                            
                                <SubMenu title={<span><i className="icon iconfont">&#xe73c;</i>项目成员</span>}>
                                    <Menu.Item key="/member/crc"><a href="#/member/crc"><i className="icon iconfont">&#xe73c;</i>CRC信息</a></Menu.Item>
                                    {
                                        (isPM || isCRCC || isCRCM || isBD || isBO || isBDO) && <Menu.Item key="/member/require"><a href="#/member/require"><i className="icon iconfont">&#xe6d1;</i>人员需求</a></Menu.Item>
                                    }
                                </SubMenu>
                            
                        )
                    }
                    {
                        /* 项目执行*/
                        auth('role', ['PM', 'BO', 'BD', 'BDO', 'CRC', 'CRCC', 'CRCM'], 2)(                            
                            <SubMenu title={<span><i className="icon iconfont">&#xe702;</i>项目执行</span>}>
                                <Menu.Item key="/execute/manHour"><a href="#/execute/manHour"><i className="icon iconfont">&#xe6e1;</i>项目工时记录</a></Menu.Item>
                                <Menu.Item key="/execute/patients"><a href="#/execute/patients"><i className="icon iconfont">&#xe8cd;</i>病例数记录</a></Menu.Item>
                                <Menu.Item key="/execute/crf/Type_Visit"><a href="#/execute/crf/Type_Visit"><i className="icon iconfont">&#xe73e;</i>访视记录</a></Menu.Item>
                                <Menu.Item key="/execute/crf/Type_Pre_Filter"><a href="#/execute/crf/Type_Pre_Filter"><i className="icon iconfont">&#xe60e;</i>预筛记录</a></Menu.Item>
                                <Menu.Item key="/execute/qa"><a href="#/execute/qa"><i className="icon iconfont">&#xe698;</i>Q&Alog</a></Menu.Item>
                                <Menu.Item key="/execute/site/Type_Site_Start"><a href="#/execute/site/Type_Site_Start"><i className="icon iconfont">&#xe702;</i>中心启动记录</a></Menu.Item>
                                <Menu.Item key="/execute/site/Type_Site"><a href="#/execute/site/Type_Site"><i className="icon iconfont">&#xe639;</i>中心记录</a></Menu.Item>
                                <Menu.Item key="/execute/crf/Type_Drop"><a href="#/execute/crf/Type_Drop"><i className="icon iconfont">&#xe613;</i>脱落记录</a></Menu.Item>
                                <Menu.Item key="/execute/crf/Type_Violation"><a href="#/execute/crf/Type_Violation"><i className="icon iconfont">&#xe7d2;</i>重大违背记录</a></Menu.Item>
                                <Menu.Item key="/execute/crf/Type_SAE"><a href="#/execute/crf/Type_SAE"><i className="icon iconfont">&#xe691;</i>SAE记录</a></Menu.Item>
                                <Menu.Item key="/execute/transfer"><a href="#/execute/transfer"><i className="icon iconfont">&#xe612;</i>交接记录</a></Menu.Item>
                            </SubMenu>                            
                        )
                    }
                    {
                        /* 项目汇总*/
                        auth('role', ['PM', 'BO', 'BD', 'BDO', 'CRC', 'CRCC', 'CRCM'], 2)(
                                <SubMenu title={<span><i className="icon iconfont">&#xe6a7;</i>项目汇总</span>}>
                                    <Menu.Item key="/sumTotal/summary"><a href="#/sumTotal/summary"><i className="icon iconfont">&#xe6b5;</i>中心周汇总</a></Menu.Item>
                                    <Menu.Item key="/sumTotal/Centremonthsum"><a href="#/sumTotal/Centremonthsum"><i className="icon iconfont">&#xe6b5;</i>中心月汇总</a></Menu.Item>
                                    <Menu.Item key="/sumTotal/efficiency/site"><a href="#/sumTotal/efficiency/site"><i className="icon iconfont">&#xe69a;</i>中心效率</a></Menu.Item>
                                	{/* <Menu.Item key="/sumTotal/percent"><a href="#/sumTotal/percent"><i className="icon iconfont">&#xe69a;</i>项完工百分比</a></Menu.Item> */}
								</SubMenu>
                            
                        )
                    }
                    {
                        /* 项目合同*/
                        auth('role', ['PA'], 1)(
                            <SubMenu title={<span><i className="icon iconfont">&#xe6a7;</i>项目合同</span>}>
                                    <Menu.Item key="/invContract"><a href="#/invContract"><i className="icon iconfont">&#xe6b5;</i>主合同记录</a></Menu.Item>
                                    <Menu.Item key="/invContractChild"><a href="#/invContractChild"><i className="icon iconfont">&#xe69a;</i>子合同记录</a></Menu.Item>
                            </SubMenu>
                        )
                    }
                    {
                        /* 项目合同*/
                        auth('role', ['PM', 'BO', 'BD', 'BDO'], 1)(
                            <SubMenu title={<span><i className="icon iconfont">&#xe6a7;</i>项目合同</span>}>
                                    <Menu.Item key="/listContract"><a href="#/listContract"><i className="icon iconfont">&#xe6b5;</i>合同记录</a></Menu.Item>
                            </SubMenu>
                        )
                    }
                    </Menu>
                </div>
            </nav>
        );
    }
}

export default Nav;
