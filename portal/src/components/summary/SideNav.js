import React, {Component} from "react";
import {Menu} from "antd";
const SubMenu = Menu.SubMenu;
class SideNav extends Component {
    constructor(props) {
        super(props);
        let current = '';
        // if (props.selectKey) {
        //     current = props.selectKey;
        // }
        this.state = {
            current,
            curOpenKeys: ["sub1"]
        };
    }

    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }

    setOpenKeys = () => {
        const sub1 = ['/summary/view/cumInfRan','/summary/view/monInfRam','/summary/view/cumFilRan','/summary/view/monFilRan','/summary/visit/cumVisit','/summary/visit/monVisit',
        "/summary/site/siteInformed","/summary/site/siteFilter","/summary/site/siteRandom"];
        const sub2 = ["/summary/fte/cumFTE","/summary/fte/monFTE","/summary/siteFTE"];
        const sub3 = ["/summary/filter/filterSource","/summary/filter/filterReason"];
        const curHash = location.hash.substr(1);
        let curOpenKeys = ["sub1"];
        if(sub1.includes(curHash)){
            curOpenKeys = ["sub1"];
        }else if(sub2.includes(curHash)){
            curOpenKeys = ["sub2"];
        }else if(sub3.includes(curHash)){
            curOpenKeys = ["sub3"];
        }
        this.setState({curOpenKeys});
    }

    componentWillMount(){
        this.setOpenKeys();
    }

    onOpenChange = (curOpenKeys) =>{
        this.setState({
            curOpenKeys
        })
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
                    selectedKeys={[this.state.current]}
                    mode="inline"
                    onOpenChange={this.onOpenChange}
                    openKeys = {this.state.curOpenKeys}
                >
                <SubMenu key="sub1" title={<span><i className="icon iconfont">&#xe639;</i><span>入组情况</span></span>}>
                    {/* <Menu.ItemGroup title="入组情况"> */}
                        <Menu.Item key="/summary/view/cumInfRan"><a href="#/summary/view/cumInfRan">累计知情随机(入组)</a></Menu.Item>
                        <Menu.Item key="/summary/view/monInfRam"><a href="#/summary/view/monInfRam">每月知情随机(入组)</a></Menu.Item>
                        <Menu.Item key="/summary/view/cumFilRan"><a href="#/summary/view/cumFilRan">累计筛选随机(入组)</a></Menu.Item>
                        <Menu.Item key="/summary/view/monFilRan"><a href="#/summary/view/monFilRan">每月筛选随机(入组)</a></Menu.Item>
                        <Menu.Item key="/summary/visit/cumVisit"><a href="#/summary/visit/cumVisit">累计完成访视</a></Menu.Item>
                        <Menu.Item key="/summary/visit/monVisit"><a href="#/summary/visit/monVisit">每月完成访视</a></Menu.Item>
                        {
                            siteId == 0 && <Menu.Item key="/summary/site/siteInformed"><a href="#/summary/site/siteInformed">各中心知情情况</a></Menu.Item>
                        }
                        {
                            siteId == 0 && <Menu.Item key="/summary/site/siteFilter"><a href="#/summary/site/siteFilter">各中心筛选情况</a></Menu.Item>
                        }
                        {
                            siteId == 0 && <Menu.Item key="/summary/site/siteRandom"><a href="#/summary/site/siteRandom">各中心随机(入组)情况</a></Menu.Item>
                        }
                </SubMenu>
                <SubMenu key="sub2" title={<span><i className="icon iconfont">&#xe639;</i><span>FTE情况</span></span>}>
                    {/* <Menu.ItemGroup title="FTE情况"> */}
                        <Menu.Item key="/summary/fte/cumFTE"><a href="#/summary/fte/cumFTE">累计FTE情况</a></Menu.Item>
                        <Menu.Item key="/summary/fte/monFTE"><a href="#/summary/fte/monFTE">每月FTE情况</a></Menu.Item>
                        {
                            siteId == 0 && <Menu.Item key="/summary/siteFTE"><a href="#/summary/siteFTE">各中心FTE情况</a></Menu.Item>
                        }
                </SubMenu>
                <SubMenu  key="sub3" title={<span><i className="icon iconfont">&#xe639;</i><span>数据分析</span></span>}>
                    {/* <Menu.ItemGroup title="数据分析"> */}
                        <Menu.Item key="/summary/filter/filterSource"><a href="#/summary/filter/filterSource">筛选来源统计</a></Menu.Item>
                        <Menu.Item key="/summary/filter/filterReason"><a href="#/summary/filter/filterReason">筛选失败原因统计</a></Menu.Item>
                </SubMenu>
                </Menu>
            </aside>
        );
    }
}

export default SideNav;
