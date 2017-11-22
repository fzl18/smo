import React, { Component } from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
class ExecuteSider extends Component {

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

    selectKey = selectKey => {
        this.state = {
            current: selectKey,
        };
    };

    handleClick = e => {
        this.setState({
            current: e.key,
        });
    }

    componentWillReceiveProps(){
        let hashStr = location.hash.substr(1);
        if(hashStr.startsWith("/execute/crf/Type_Visit/")){
            hashStr = "/execute/crf/Type_Visit"
        }else if(hashStr.startsWith("/execute/transfer/")){
            hashStr = "/execute/transfer"
        }
        this.setState({
            current: hashStr
        })
    }

    componentWillMount(){
        let hashStr = location.hash.substr(1);
        if(hashStr.startsWith("/execute/crf/Type_Visit/")){
            hashStr = "/execute/crf/Type_Visit"
        }else if(hashStr.startsWith("/execute/transfer/")){
            hashStr = "/execute/transfer"
        }
        this.setState({
            current: hashStr
        })
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
                    <Menu.Item key="/execute/manHour">
                        <a href="#/execute/manHour">项目工时记录</a>
                    </Menu.Item>
                    <Menu.Item key="/execute/patients">
                        <a href="#/execute/patients">病例数记录</a>
                    </Menu.Item>
                    <Menu.Item key="/execute/crf/Type_Visit">
                        <a href="#/execute/crf/Type_Visit">访视记录</a>
                    </Menu.Item>
                    <Menu.Item key="/execute/crf/Type_Pre_Filter">
                        <a href="#/execute/crf/Type_Pre_Filter">预筛记录</a>
                    </Menu.Item>
                    <Menu.Item key="/execute/qa">
                        <a href="#/execute/qa">Q&Alog</a>
                    </Menu.Item>
                    <Menu.Item key="/execute/site/Type_Site_Start">
                        <a href="#/execute/site/Type_Site_Start">中心启动记录</a>
                    </Menu.Item>
                    <Menu.Item key="/execute/site/Type_Site">
                        <a href="#/execute/site/Type_Site">中心记录</a>
                    </Menu.Item>
                    <Menu.Item key="/execute/crf/Type_Drop">
                        <a href="#/execute/crf/Type_Drop">脱落记录</a>
                    </Menu.Item>
                    <Menu.Item key="/execute/crf/Type_Violation">
                        <a href="#/execute/crf/Type_Violation">重大违背记录</a>
                    </Menu.Item>
                    <Menu.Item key="/execute/crf/Type_SAE">
                        <a href="#/execute/crf/Type_SAE">SAE记录</a>
                    </Menu.Item>
                    <Menu.Item key="/execute/transfer">
                        <a href="#/execute/transfer">交接记录</a>
                    </Menu.Item> 
                    </SubMenu>
                </Menu>
            </aside>
        );
    }
}

export default ExecuteSider;
