import React from 'react';
import { Menu, Icon } from 'antd';

import auth from '../../common/auth';

import './style/layout.less';

const SubMenu = Menu.SubMenu;

class Nav extends React.Component {
    state = {
        current: 'home',
    }

    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }

    // SY, //系统管理员
    // EA, //企业管理员

    render() {
        return (
            <nav className="nav-bar">
                <div className="wrapper">
                    {
                        /* 企业管理员菜单*/
                        auth('role', ['EA'])(
                            <Menu
                                onClick={this.handleClick.bind(this)}
                                selectedKeys={[this.state.current]}
                                mode="horizontal"
                            >
                                <Menu.Item key="invManager"><a href="#/"><i className="icon iconfont">&#xe6d1;</i>项目管理</a></Menu.Item>
                                <SubMenu key="teamMgr" title={<a href="#/team"><i className="icon iconfont">&#xe69c;</i>团队管理</a>}>
                                    <Menu.Item key="team"><a href="#/team">部门管理</a></Menu.Item>
                                    <Menu.Item key="teamPosition"><a href="#/team/position">职位管理</a></Menu.Item>
                                    <Menu.Item key="teamUser"><a href="#/team/user">人员管理</a></Menu.Item>
                                    <Menu.Item key="teamCity"><a href="#/team/city">分管城市管理</a></Menu.Item>
                                </SubMenu>
                                <Menu.Item key="role"><a href="#/role"><i className="icon iconfont">&#xe61c;</i>角色管理</a></Menu.Item>
                                <SubMenu key="hospitalMgr" title={<a href="#/hospital"><i className="icon iconfont">&#xe600;</i>医院管理</a>}>
                                    <Menu.Item key="hospitalList"><a href="#/hospital">医院信息</a></Menu.Item>
                                    <Menu.Item key="hospitalDepartment"><a href="#/hospital/departmentList">医院科室信息</a></Menu.Item>
                                    <Menu.Item key="hospitalDoctor"><a href="#/hospital/doctor">医生信息</a></Menu.Item>
                                </SubMenu>
                                <SubMenu key="dailyMgr" title={<a href="#/daily"><i className="icon iconfont">&#xe60c;</i>日常管理</a>}>
                                    <Menu.Item key="dailyList"><a href="#/daily">工时类型管理</a></Menu.Item>
                                    <Menu.Item key="dailyAreaList"><a href="#/arealist">大区管理</a></Menu.Item>
                                </SubMenu>
                                <Menu.Item key="customerMgr"><a href="#/customer"><i className="icon iconfont">&#xe63a;</i>客户管理</a></Menu.Item>
                            </Menu>
                        )
                    }
                    {
                        /* 企业管理员菜单*/
                        auth('role', ['SY'])(
                            <Menu
                                onClick={this.handleClick.bind(this)}
                                selectedKeys={[this.state.current]}
                                mode="horizontal"
                            >
                                <Menu.Item key="enterpriseList"><a href="#/enterpriseList"><i className="icon iconfont">&#xe6d1;</i>企业管理</a></Menu.Item>
                                <Menu.Item key="enterpriseManagerList"><a href="#/enterpriseManagerList"><i className="icon iconfont">&#xe6d1;</i>企业管理员管理</a></Menu.Item>
                            </Menu>
                        )
                    }
                </div>
            </nav>
        );
    }
}

export default Nav;
