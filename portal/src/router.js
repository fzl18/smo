import React, {Component} from "react";
import {Route, Redirect} from "react-router-dom";
import Login from "./components/home/Login";
import Home from "./components/home/Home";
import InvestigationList from "./components/investigation/InvestigationList";
import SiteList from "./components/investigation/SiteList";
import InvestigationView from "./components/investigation/InvestigationView";
import ManHourFTE from "./components/manHour/FTE";
import MyWeekly from "./components/manHour/MyWeekly";
import MyEfficiency from "./components/manHour/MyEfficiency";
import Search from "./components/manHour/Search";
import ManHourWrite from "./components/manHour/Write";
import Report from "./components/manHour/Report";
import DegreePlan from "./components/plan/Degree";
import InvestigationPlan from "./components/plan/Investigation";
import SitePlan from "./components/plan/Site";
import VisitTypePlan from "./components/plan/VisitType";
import SiteDetail from "./components/site/SiteDetail";
import PI from "./components/site/PI";
import CRA from "./components/site/CRA";
import CRC from "./components/member/CRC";
import Require from "./components/member/Require";
import Distribution from "./components/member/Distribution";
import ExecuteMgrCrf from "./components/executeMgr/Crf";
import ExecuteMgrManHourList from "./components/executeMgr/ManHourList";
import ExecuteMgrPatients from "./components/executeMgr/Patients";
import ExecuteMgrQA from "./components/executeMgr/QA";
import ExecuteMgrSite from "./components/executeMgr/Site";
import ExecuteMgrTransfer from "./components/executeMgr/Transfer";
import Crf from "./components/execute/Crf";
import ManHourList from "./components/execute/ManHourList";
import Patients from "./components/execute/Patients";
import QA from "./components/execute/QA";
import Site from "./components/execute/Site";
import Transfer from "./components/execute/Transfer";
import ProjectList from "./components/project/ProjectList";
import ProCharts from "./components/projectstatus/ProCharts";
import ProChartsVisit from "./components/projectstatus/ProChartsVisit";
import Charts from "./components/summary/Charts";
import ChartsVisit from "./components/summary/ChartsVisit";
import ChartsSiteFilter from "./components/summary/ChartsSiteFilter";
import ChartsFTE from "./components/summary/ChartsFTE";
import ChartsSiteFTE from "./components/summary/ChartsSiteFTE";
import ChartsFilter from "./components/summary/ChartsFilter";
import HospitalList from "./components/hospital/HospitalList";
import HospitalDepartmentList from "./components/hospital/HospitalDepartmentList";
import DoctorList from "./components/hospital/DoctorList";
import Summary from "./components/sumTotal/Summary";
import Centremonthsum from "./components/sumTotal/Centremonthsum";
import Monthsum from "./components/sumTotal/Monthsum";

import Efficiency from "./components/sumTotal/Efficiency";
import UserView from "./components/user/UserView";
import UserPlan from "./components/user/UserPlan";
import UserEfficiency from "./components/user/UserEfficiency";
import UserDistribution from "./components/user/UserDistribution";
import UserAnalysis from "./components/user/UserAnalysis";
import Notice from "./components/layout/Notice";
import Setting from "./components/layout/Setting";
import ProjectPercent from "./components/sumTotal/ProjectPercent";
import ProPercent from "./components/investigation/ProPercent";
import InvContract from "./components/investigation/InvContract";
import InvContractChild from "./components/investigation/InvContractChild";
import ListContract from "./components/investigation/ListContract";

const routes = [{
    path: '/',
    breadcrumbName: '首页/',
    exact: true,
    render: () => 1 ? <Redirect to="/home"/> : <Redirect to="/login"/>,
}, {
    path: '/home',
    exact: true,
    breadcrumbName: '首页/',
    render: () => <Home />,
}, {
    path: '/notice',
    exact: true,
    breadcrumbName: '通知/',
    render: () => <Notice />,
}, {
    path: '/setting',
    exact: true,
    breadcrumbName: '设置/',
    render: () => <Setting />,
}, {
    path: '/login',
    exact: true,
    breadcrumbName: '登录/',
    render: () => <Login />,
}, {
    path: '/permission-403',
    exact: true,
    render: () => <Login />,
}, {
    path: '/invList/:invId',
    exact: true,
    render: (props) => <InvestigationList {...props}/>,
}, {
    path: '/invList',
    exact: true,
    render: () => <InvestigationList />,
}, {
    path: '/siteList/:selRole/:selInvId',
    exact: true,
    render: (props) => <SiteList {...props}/>,
}, {
    path: '/invDetails',
    exact: true,
    render: () => <InvestigationView />,
}, {
    path: '/plan/degree',
    exact: true,
    render: () => <DegreePlan />,
}, {
    path: '/plan/investigation/:statisticalType',
    exact: true,
    render: (props) => <InvestigationPlan {...props}/>,
}, {
    path: '/plan/site/:statisticalType',
    exact: true,
    render: (props) => <SitePlan {...props}/>,
}, {
    path: '/plan/visitType',
    exact: true,
    render: () => <VisitTypePlan />,
}, {
    path: '/site/detail',
    exact: true,
    render: () => <SiteDetail />,
}, {
    path: '/site/pi',
    exact: true,
    render: () => <PI />,
}, {
    path: '/site/cra',
    exact: true,
    render: () => <CRA />,
}, {
    path: '/member/crc',
    exact: true,
    render: () => <CRC />,
}, {
    path: '/member/require',
    exact: true,
    render: () => <Require src='Member' />,
}, {
    path: '/member/require/:requireId',
    exact: true,
    render: (props) => <Require src='Member' {...props}/>,
},  {
    path: '/member/distribution',
    exact: true,
    render: () => <Distribution />,
}, {
    path: '/executeMgr/manHour',
    exact: true,
    render: () => <ExecuteMgrManHourList />,
}, {
    path: '/executeMgr/patients',
    exact: true,
    render: () => <ExecuteMgrPatients />,
}, {
    path: '/executeMgr/crf/:typeName',
    exact: true,
    render: (props) => <ExecuteMgrCrf {...props} />,
}, {
    path: '/executeMgr/qa',
    exact: true,
    render: () => <ExecuteMgrQA />,
}, {
    path: '/executeMgr/site/:typeName',
    exact: true,
    render: (props) => <ExecuteMgrSite {...props} />,
}, {
    path: '/executeMgr/transfer',
    exact: true,
    render: () => <ExecuteMgrTransfer />,
}, {
    path: '/execute/manHour',
    exact: true,
    render: () => <ManHourList />,
}, {
    path: '/execute/patients',
    exact: true,
    render: () => <Patients />,
}, {
    path: '/execute/crf/:typeName',
    exact: true,
    render: (props) => <Crf {...props}/>,
}, {
    path: '/execute/crf/:typeName/:patientId',
    exact: true,
    render: (props) => <Crf {...props}/>,
}, {
    path: '/execute/qa',
    exact: true,
    render: () => <QA />,
}, {
    path: '/execute/site/:typeName',
    exact: true,
    render: (props) => <Site {...props}/>,
}, {
    path: '/execute/transfer',
    exact: true,
    render: (props) => <Transfer {...props} scr="Execute" />,
}, {
    path: '/execute/transfer/:handoverId',
    exact: true,
    render: (props) => <Transfer {...props} scr="Execute" />,
}, {
    path: '/invMgr/list',
    exact: true,
    render: () => <InvestigationMgrList />,
}, {
    path: '/team',
    exact: true,
    render: () => <TeamList />,
}, {
    path: '/team/position',
    exact: true,
    render: () => <PositionIndex />,
}, {
    path: '/team/user',
    exact: true,
    render: () => <UserIndex />,
}, {
    path: '/team/city',
    exact: true,
    render: () => <CityIndex />,
}, {
    path: '/role',
    exact: true,
    render: () => <Role />,
}, {
    path: '/hospital/detail',
    exact: true,
    render: () => <HospitalList />,
}, {
    path: '/hospital/departmentDetail',
    exact: true,
    render: () => <HospitalDepartmentList />,
}, {
    path: '/hospital/doctor',
    exact: true,
    render: () => <DoctorList />,
}, {
    path: '/daily',
    exact: true,
    render: () => <DailyView />,
}, {
    path: '/arealist',
    exact: true,
    render: () => <AreaList />,
}, {
    path: '/customer',
    exact: true,
    render: () => <Customer />,
}, {
    path: '/manHour/write',
    exact: true,
    render: () => <ManHourWrite />,
},{
    path: '/manHour/write/:manHourId/:date',
    exact: true,
    render: (props) => <ManHourWrite {...props}/>,
}, {
    path: '/manHour/fte',
    exact: true,
    render: () => <ManHourFTE />,
}, {
    path: '/manHour/myWeekly',
    exact: true,
    render: () => <MyWeekly />,
}, {
    path: '/manHour/myEfficiency',
    exact: true,
    render: () => <MyEfficiency/>,
},{
    path: '/manHour/search',
    exact: true,
    render: () => <Search/>,
},{
    path: '/manHour/MyWeekly/:name',
    exact: true,
    render: (props) => <MyWeekly {...props}/>,
},{
    path: '/manHour/FTE/:name',
    exact: true,
    render: (props) => <ManHourFTE {...props}/>,
    },{
    path: '/manHour/report',
    exact: true,
    render: (props) => <Report/>,
}, {
    path: '/summary/visit/:name',
    exact: true,
    render: (props) => <ChartsVisit {...props} />,
}, {
    path: '/summary/filter/:name',
    exact: true,
    render: (props) => <ChartsFilter {...props} />,
}, {
    path: '/summary/site/:name',
    exact: true,
    render: (props) => <ChartsSiteFilter {...props} />,
}, {
    path: '/summary/siteFTE',
    exact: true,
    render: () => <ChartsSiteFTE />,
},{
    path: '/summary/fte/:name',
    exact: true,
    render: (props) => <ChartsFTE {...props} />,
}, {
    path: '/summary/view/:name',
    exact: true,
    render: (props) => <Charts {...props} />,
}, {
    path: '/sumTotal/summary',
    exact: true,
    render: () => <Summary />,
}, {
    path: '/sumTotal/efficiency/:name',
    exact: true,
    render: (props) => <Efficiency {...props} />,
} ,{
    path: '/user/UserView',
    exact: true,
    render: () => <UserView/>,
},{
    path: '/user/UserPlan',
    exact: true,
    render: () => <UserPlan/>,
},{
    path: '/user/require',
    exact: true,
    render: () => <Require src='User'/>,
},{
    path: '/user/require/:requireId',
    exact: true,
    render: (props) => <Require {...props}/>,
},{
    path: '/user/UserEfficiency',
    exact: true,
    render: () => <UserEfficiency/>,
},{
    path: '/user/UserDistribution',
    exact: true,
    render: () => <Distribution src="UserManage" />,
},{
    path: '/user/UserTransfer/:handoverId',
    exact: true,
    render: (props) => <Transfer src="User" {...props}/>,
},{
    path: '/user/UserTransfer',
    exact: true,
    render: (props) => <Transfer src="User" {...props}/>,
},{
    path: '/user/UserAnalysis',
    exact: true,
    render: () => <UserAnalysis/>,
},{
    path: '/sumTotal/percent',
    exact: true,
    render: () => <ProjectPercent/>,
},{
    path: '/proPercent',
    exact: true,
    render: () => <ProPercent/>,
},{
    path: '/invContract',
    exact: true,
    render: () => <InvContract/>,
},{
    path: '/invContractChild',
    exact: true,
    render: () => <InvContractChild/>,
},{
    path: '/listContract',
    exact: true,
    render: () => <ListContract/>,
},{
    path:'/sumTotal/Centremonthsum',
    exact:true,
    render:()=><Centremonthsum/>,
},{
    path:'/sumTotal/Monthsum',
    exact:true,
    render:()=><Monthsum/>,
}

];

export default routes;
