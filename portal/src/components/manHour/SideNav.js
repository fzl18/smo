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
        };
    }


    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }
    
    componentWillReceiveProps(){
        let hashStr = location.hash.substr(1);
        if(hashStr.startsWith("/manHour/write")){
            hashStr = "/manHour/write"
        }
        this.setState({
            current: hashStr
        })
    }

    componentWillMount(){
        let hashStr = location.hash.substr(1);
        if(hashStr.startsWith("/manHour/write")){
            hashStr = "/manHour/write"
        }
        this.setState({
            current: hashStr
        })
    }

    render() {
        const curRole = sessionStorage.curRole;
        let isPM , isCRC , isCRCM, isCRCC, isBO;
        isPM = isCRC = isCRCM = isCRCC = isBO = false
        if (curRole == 'PM'){
            isPM = true;
        } else if (curRole == 'CRC'){
            isCRC = true;
        } else if (curRole == 'CRCC'){
            isCRCC = true;
        } else if (curRole == 'CRCM'){
            isCRCM = true;
        } else if (curRole == 'BO'){
            isBO = true;
        }

        return (
            <aside className="sidebar">
            {
                /* 项目汇总*/                
                <Menu
                    onClick={this.handleClick}
                    defaultOpenKeys={['sub1']}
                    selectedKeys={[this.state.current]}
                    mode="inline"
                    >
                    <SubMenu key="sub1" title={<span><i className="icon iconfont">&#xe639;</i><span>工时记录</span></span>}>
                    { 
                        (isPM || isCRC || isCRCC) &&
                        <Menu.Item key="/manHour/write">
                            <a href="#/manHour/write">填写工时</a>
                        </Menu.Item>
                    }
                    {
                        (isPM || isCRC || isCRCC) &&
                        <Menu.Item key="/manHour/fte">
                            <a href="#/manHour/fte">月度FTE</a>
                        </Menu.Item>
                    }
                    { 
                        (isPM || isCRC || isCRCC) &&
                        <Menu.Item key="/manHour/myWeekly">
                            <a href="#/manHour/myWeekly">我的周报</a>
                        </Menu.Item>
                    }
                    { 
                        (isCRC || isCRCC) &&                 
                        <Menu.Item key="/manHour/myEfficiency">
                            <a href="#/manHour/myEfficiency">我的效率</a>
                        </Menu.Item>
                    }
                    { 
                        (isCRCC || isCRCM || isBO) &&        
                        <Menu.Item key="/manHour/search">
                            <a href="#/manHour/search">工时查询</a>
                        </Menu.Item>
                    }
                    { 
                        isBO &&        
                        <Menu.Item key="/manHour/report">
                            <a href="#/manHour/report">工时报告</a>
                        </Menu.Item>
                    }
                    </SubMenu>
                </Menu>
            }                
            </aside>
        );
    }
}

export default SideNav;
