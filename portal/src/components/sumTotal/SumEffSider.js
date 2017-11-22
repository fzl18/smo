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


    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }

    componentWillReceiveProps(){
        this.setState({
            current: location.hash.substr(1)
        })
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
                    <SubMenu key="sub1" title={<span><i className="icon iconfont">&#xe639;</i><span>项目汇总</span></span>}>
                        {
                            siteId == 0 && <Menu.Item key="/sumTotal/summary">
                                <a href="#/sumTotal/summary">项目周汇总</a>
                            </Menu.Item>
                        }
                        {
                            siteId == 0 && <Menu.Item key="/sumTotal/Monthsum">
                                <a href="#/sumTotal/Monthsum">项目月汇总</a>
                            </Menu.Item>
                        }
                        {
                            siteId == 0 && <Menu.Item key="/sumTotal/efficiency/pro">
                                <a href="#/sumTotal/efficiency/pro">项目效率</a>
                            </Menu.Item>
                        }
                      	{
                            siteId == 0 && <Menu.Item key="/sumTotal/percent">
                                <a href="#/sumTotal/percent">项完工百分比</a>
                            </Menu.Item>
                        }
                        {
                            siteId > 0 && <Menu.Item key="/sumTotal/summary">
                                <a href="#/sumTotal/summary">中心周汇总</a>
                            </Menu.Item>
                        }
                        {
                            siteId > 0 && <Menu.Item key="/sumTotal/Centremonthsum">
                                <a href="#/sumTotal/Centremonthsum">中心月汇总</a>
                            </Menu.Item>
                        }
                        {
                            siteId > 0 && <Menu.Item key="/sumTotal/efficiency/site">
                                <a href="#/sumTotal/efficiency/site">中心效率</a>
                            </Menu.Item>
                        }
                        



                    </SubMenu>
                </Menu>
            </aside>
        );
    }
}

export default Sider;
