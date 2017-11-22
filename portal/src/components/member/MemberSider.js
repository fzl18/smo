import React, { Component } from 'react';
import { Menu } from 'antd';

const SubMenu = Menu.SubMenu;

class MemberSider extends Component {

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
        if(hashStr.startsWith("/member/require/")){
            hashStr = "/member/require"
        }
        this.setState({
            current: hashStr
        })
    }

    componentWillMount(){
        let hashStr = location.hash.substr(1);
        if(hashStr.startsWith("/member/require/")){
            hashStr = "/member/require"
        }
        this.setState({
            current: hashStr
        })
    }

    render() {
        const curRole = sessionStorage.curRole;
        const siteId = sessionStorage.siteId;
        let showRequire = false;
        if (curRole == 'PM' || curRole == 'CRCC' || curRole == 'CRCM' || curRole == 'BO' || curRole == 'BD' || curRole == 'BDO'){
            showRequire = true;
        }
        let showDistribution = false;
        if ((curRole == 'PM' || curRole == 'BO' || curRole == 'BD' || curRole == 'BDO') && siteId == 0){
            showDistribution = true;
        }
        return (
            <aside className="sidebar">
                <Menu
                    onClick={this.handleClick}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    selectedKeys={[this.state.current]}
                >
                    <SubMenu key="sub1" title={<span><i className="icon iconfont">&#xe639;</i><span>项目成员</span></span>}>
                        <Menu.Item key="/member/crc">
                            <a href="#/member/crc">CRC信息</a>
                        </Menu.Item>
                        {
                            showRequire && 
                            <Menu.Item key="/member/require">
                                <a href="#/member/require">人员需求</a>
                            </Menu.Item>
                        }
                        {
                            showDistribution && 
                            <Menu.Item key="/member/distribution">
                                <a href="#/member/distribution">人员分布</a>
                            </Menu.Item>
                        }
                    </SubMenu>
                </Menu>
            </aside>
        );
    }
}

export default MemberSider;
