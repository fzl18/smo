import React from 'react';
import { Redirect } from 'react-router-dom';
import EnterpriseList from './components/enterprise/EnterpriseList';
import EnterpriseManagerList from './components/user/EnterpriseManagerList';
import InvestigationList from './components/investigation/index';
import TeamList from './components/team/index';
import UserIndex from './components/team/UserIndex';
import CityIndex from './components/team/CityIndex';
import PositionIndex from './components/team/PositionIndex';
import HospitalList from './components/hospital/index'; // 医院信息
import DepartmentList from './components/hospital/DepartmentList'; // 医院科室信息
import DoctorList from './components/hospital/DoctorList'; // 医生信息
import AreaList from './components/daily/areaList';
import DailyView from './components/daily/dailyView';
import Daily from './components/daily/index';
import Role from './components/role/index';
import Customer from './components/customer/index';

const routes = [{
    path: '/',
    exact: true,
    render: () => <Redirect to={sessionStorage.roleCode == 'EA' ? "/investigationList" : "/enterpriseList"} />,
}, {
    path: '/enterpriseList',
    exact: true,
    render: () => <EnterpriseList />,
}, {
    path: '/enterpriseManagerList',
    exact: true,
    render: () => <EnterpriseManagerList />,
}, {
    path: '/investigationList',
    exact: true,
    render: () => <InvestigationList />,
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
    path: '/hospital',
    exact: true,
    render: () => <HospitalList />,
}, {
    path: '/hospital/departmentList',
    exact: true,
    render: () => <DepartmentList />,
}, {
    path: '/hospital/doctor',
    exact: true,
    render: () => <DoctorList />,
}, {
    path: '/role',
    exact: true,
    render: () => <Role />,
}, {
    path: '/daily',
    exact: true,
    render: () => <Daily />,
}, {
    path: '/daily/View/:id',
    exact: true,
    render: (props) => <DailyView {...props}/>,
}, {
    path: '/arealist',
    exact: true,
    render: () => <AreaList />,
}, {
    path: '/customer',
    exact: true,
    render: () => <Customer />,
}];

export default routes;
