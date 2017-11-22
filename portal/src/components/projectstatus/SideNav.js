import React, {Component} from "react";
import {Menu} from "antd";

class SideNav extends Component {

    constructor(props) {
        super(props);
        let current = 'monthFte';
        if (props.selectKey) {
            current = props.selectKey;
        }
        this.state = {
            current,
        };
    }


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
                    selectedKeys={[this.state.current]}
                    mode="inline"
                >
                    <Menu.ItemGroup title="入组情况">
                        <Menu.Item key="manHour">
                            <a href="#/projectstatus/" >累计知情随机(入组)</a>
                        </Menu.Item>
                        <Menu.Item key="monthFte" >
                            <a href="#/projectstatus/" >每月知情随机(入组)</a>
                        </Menu.Item>
                        <Menu.Item key="MyWeekly" >
                            <a href="#/projectstatus/" >累计筛选随机(入组)</a>
                        </Menu.Item>
                        <Menu.Item key="MyEfficiency" >
                            <a href="#/projectstatus/" >每月筛选随机(入组)</a>
                        </Menu.Item>
                        <Menu.Item key="fs">
                            <a href="#/projectstatus/Visit">累计完成访视数</a>
                        </Menu.Item>
                        <Menu.Item key="fs1">
                            <a href="#/projectstatus/Visit">每月完成访视数</a>
                        </Menu.Item>
                        <Menu.Item key="zx2">
                            <a href="#/manHour/Seach">各中心知情情况</a>
                        </Menu.Item>
                        <Menu.Item key="zx">
                            <a href="#/manHour/Seach">各中心筛选情况</a>
                        </Menu.Item>
                        <Menu.Item key="zx3">
                            <a href="#/manHour/Seach">各中心随机(入组)情况</a>
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title="FTE情况">
                        <Menu.Item key="FTE1">
                            <a href="#/manHour/Seach">累计FTE情况</a>
                        </Menu.Item>
                        <Menu.Item key="FTE2">
                            <a href="#/manHour/Seach">每月FTE情况</a>
                        </Menu.Item>
                        <Menu.Item key="FTE3">
                            <a href="#/manHour/Seach">各中心FTE情况</a>
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup title="数据分析">
                        <Menu.Item key="data1">
                            <a href="#/manHour/Seach">筛选来源统计</a>
                        </Menu.Item>
                        <Menu.Item key="data2">
                            <a href="#/manHour/Seach">筛选失败原因统计</a>
                        </Menu.Item>
                    </Menu.ItemGroup>
                </Menu>
            </aside>
        );
    }
}

export default SideNav;
