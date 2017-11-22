import React, { Component } from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
class ExecuteMgrSider extends Component {
    constructor(props) {
        super(props);
        this.selectKey(props.selectKey);
    }

    selectKey = selectKey => {
        let current = 'menu1';
        if (selectKey) {
            if (selectKey == 'Type_Visit'){
                current = 'visit';
            } else if (selectKey == 'Type_Pre_Filter'){
                current = 'preFilter';
            } else if (selectKey == 'Type_Site_Start'){
                current = 'siteStart';
            } else if (selectKey == 'Type_Site'){
                current = 'site';
            } else if (selectKey == 'Type_Drop'){
                current = 'drop';
            } else if (selectKey == 'Type_Violation'){
                current = 'violation';
            } else if (selectKey == 'Type_SAE'){
                current = 'sae';
            } else if (selectKey == 'handOver'){
                current = 'handOver';
            } else {
                current = selectKey;
            }
        }
        this.state = {
            current,
        };
    };

    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }

    render() {
        return (
            <aside className="sidebar">
                <Menu
                    onClick={this.handleClick}
                    defaultOpenKeys={['sub1']}
                    selectedKeys={[this.state.current]}
                    mode="inline"
                >
                <SubMenu key="sub1" title={<span><i className="icon iconfont">&#xe639;</i><span>项目执行</span></span>}>
                    {/* <Menu.ItemGroup title="项目执行" /> */}
                    <Menu.Item key="manHour">
                        <a href="#/executeMgr/manHour">项目工时记录</a>
                    </Menu.Item>
                    <Menu.Item key="patients">
                        <a href="#/executeMgr/patients">病例数记录</a>
                    </Menu.Item>
                    <Menu.Item key="visit">
                        <a href="#/executeMgr/crf/Type_Visit">访视记录</a>
                    </Menu.Item>
                    <Menu.Item key="preFilter">
                        <a href="#/executeMgr/crf/Type_Pre_Filter">预筛记录</a>
                    </Menu.Item>
                    <Menu.Item key="qa">
                        <a href="#/executeMgr/qa">Q&Alog</a>
                    </Menu.Item>
                    <Menu.Item key="siteStart">
                        <a href="#/executeMgr/site/Type_Site_Start">中心启动记录</a>
                    </Menu.Item>
                    <Menu.Item key="site">
                        <a href="#/executeMgr/site/Type_Site">中心记录</a>
                    </Menu.Item>
                    <Menu.Item key="drop">
                        <a href="#/executeMgr/crf/Type_Drop">脱落记录</a>
                    </Menu.Item>
                    <Menu.Item key="violation">
                        <a href="#/executeMgr/crf/Type_Violation">重大违背记录</a>
                    </Menu.Item>
                    <Menu.Item key="sae">
                        <a href="#/executeMgr/crf/Type_SAE">SAE记录</a>
                    </Menu.Item>
                    <Menu.Item key="handOver">
                        <a href="#/executeMgr/transfer">交接记录</a>
                    </Menu.Item>
                </SubMenu>
                </Menu>
            </aside>
        );
    }
}

export default ExecuteMgrSider;
