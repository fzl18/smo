import React, { Component } from 'react';
import { Menu } from 'antd';

const SubMenu = Menu.SubMenu;

class UserSider extends Component {

    constructor(props) {
        super(props);
        let current = '';
        // if (props.selectKey) {
        //     current = props.selectKey;
        // }
        this.state = {
            current,
        };
    }


    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }

    componentWillReceiveProps(){
        let hashStr = location.hash.substr(1);
        if(hashStr.startsWith("/user/UserTransfer/")){
            hashStr = "/user/UserTransfer"
        }else if(hashStr.startsWith("/user/Require/")){
            hashStr = "/user/Require"
        }
        this.setState({
            current: hashStr
        })
    }

    componentWillMount(){
        let hashStr = location.hash.substr(1);
        if(hashStr.startsWith("/user/UserTransfer/")){
            hashStr = "/user/UserTransfer"
        }else if(hashStr.startsWith("/user/Require/")){
            hashStr = "/user/Require"
        }
        this.setState({
            current: hashStr
        })
    }

    render() {
        const curRole = sessionStorage.curRole;
        const siteId = sessionStorage.siteId;
       
        return (
            <aside className="sidebar">
                <Menu
                    onClick={this.handleClick}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    selectedKeys={[this.state.current]}
                >
                    <SubMenu key="sub1" title={<span><i className="icon iconfont">&#xe639;</i><span>人员管理</span></span>}>
                        <Menu.Item key="/user/UserView">
                            <a href="#/user/UserView">人员信息</a>
                        </Menu.Item>
                        <Menu.Item key="/user/UserPlan">
                            <a href="#/user/UserPlan">人员安排</a>
                        </Menu.Item>
                        <Menu.Item key="/user/Require">
                            <a href="#/user/Require">人员需求</a>
                        </Menu.Item>
                        <Menu.Item key="/user/UserEfficiency">
                            <a href="#/user/UserEfficiency">人员效率</a>
                        </Menu.Item>
                        <Menu.Item key="/user/UserDistribution">
                            <a href="#/user/UserDistribution">人员分布</a>
                        </Menu.Item>
                        <Menu.Item key="/user/UserTransfer">
                            <a href="#/user/UserTransfer">人员交接</a>
                        </Menu.Item>
                        <Menu.Item key="/user/UserAnalysis">
                            <a href="#/user/UserAnalysis">人员分析</a>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </aside>
        );
    }
}

export default UserSider;
