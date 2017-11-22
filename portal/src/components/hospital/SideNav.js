import React, {Component} from "react";
import {Menu} from "antd";
const SubMenu = Menu.SubMenu;
class SideNav extends Component {

    constructor(props) {
        super(props);
        let current = 'degree';
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
                    defaultOpenKeys={['sub1']}
                    selectedKeys={[this.state.current]}
                    mode="inline"
                >
                <SubMenu key="sub1" title={<span><i className="icon iconfont">&#xe639;</i><span>医院档案</span></span>}>
                    {/* <Menu.ItemGroup title="医院档案"/> */}
                    <Menu.Item key="detail">
                        <a href="#/hospital/detail">医院信息</a>
                    </Menu.Item>
                    <Menu.Item key="departmentDetail">
                        <a href="#/hospital/departmentDetail">医院科室信息</a>
                    </Menu.Item>
                    <Menu.Item key="doctor">
                        <a href="#/hospital/doctor">医生信息</a>
                    </Menu.Item>
                    </SubMenu>
                </Menu>
            </aside>
        );
    }
}

export default SideNav;
