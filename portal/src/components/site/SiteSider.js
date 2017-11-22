import React, { Component } from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
class SiteSider extends Component {
    constructor(props) {
        super(props);
        let current = 'menu1';
        if (props.selectKey) {
            current = props.selectKey;
        }
        this.state = {
            current,
        };
    };


    handleClick = e => {
        this.setState({
            current: e.key,
        });
    };

    render() {
        return (
            <aside className="sidebar">
                <Menu
                    onClick={this.handleClick}
                    defaultOpenKeys={['sub1']}
                    selectedKeys={[this.state.current]}
                    mode="inline"
                >
                <SubMenu key="sub1" title={<span><i className="icon iconfont">&#xe639;</i><span>研究中心</span></span>}>
                    {/* <Menu.ItemGroup title="研究中心" /> */}
                    <Menu.Item key="site">
                        <a href="#/site/detail">研究中心信息</a>
                    </Menu.Item>
                    <Menu.Item key="sitePi">
                        <a href="#/site/pi">研究者信息</a>
                    </Menu.Item>
                    <Menu.Item key="siteCra">
                        <a href="#/site/cra">CRA信息</a>
                    </Menu.Item>
                </SubMenu>
                </Menu>
            </aside>
        );
    }
}

export default SiteSider;
