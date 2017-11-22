import React, { Component } from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;

class Sider extends Component {

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

    componentWillReceiveProps(){
        this.setState({
            current: location.hash.substr(1)
        })
    }

    componentWillMount(){
        this.setState({
            current: location.hash.substr(1)
        })
    }

    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }

    render() {
        const siteId = sessionStorage.siteId;
        return (
            <aside className="sidebar">
                <Menu
                    onClick={this.handleClick}
                    defaultOpenKeys={['sub1']}
                    selectedKeys={[this.state.current]}
                    mode="inline"
                >
                    <SubMenu key="sub1" title={<span><i className="icon iconfont">&#xe639;</i><span>项目计划</span></span>}>
                        {
                            siteId == 0 && <Menu.Item key="/plan/degree">
                                <a href="#/plan/degree">项目阶段进度计划</a>
                            </Menu.Item>
                        }
                        {
                            siteId == 0 && <Menu.Item key="/plan/investigation/Type_Informed">
                                <a href="#/plan/investigation/Type_Informed">项目知情计划</a>
                            </Menu.Item>
                        }
                        {
                            siteId == 0 && <Menu.Item key="/plan/investigation/Type_Filter">
                                <a href="#/plan/investigation/Type_Filter">项目筛选计划</a>
                            </Menu.Item>
                        }
                        {
                            siteId == 0 && <Menu.Item key="/plan/investigation/Type_Random">
                                <a href="#/plan/investigation/Type_Random">项目随机(入组)计划</a>
                            </Menu.Item>
                        }
                        <Menu.Item key="/plan/site/Type_Informed">
                            <a href="#/plan/site/Type_Informed">{siteId == 0 ? '各' : ''}中心知情计划</a>
                        </Menu.Item>
                        <Menu.Item key="/plan/site/Type_Filter">
                            <a href="#/plan/site/Type_Filter">{siteId == 0 ? '各' : ''}中心筛选计划</a>
                        </Menu.Item>
                        <Menu.Item key="/plan/site/Type_Random">
                            <a href="#/plan/site/Type_Random">{siteId == 0 ? '各' : ''}中心随机(入组)计划</a>
                        </Menu.Item>
                        <Menu.Item key="/plan/visitType">
                            <a href="#/plan/visitType">项目访视周期计划</a>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </aside>
        );
    }
}

export default Sider;
