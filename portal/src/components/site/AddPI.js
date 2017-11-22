/**
 * Created by casteloyee on 2017/7/28.
 */
import React from 'react';
import {Modal, Row, Col, Input, Radio, Select, message} from 'antd';
import API_URL from '../../common/url';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';
import SiteSearchInput from "./SiteSearchInput";
import DoctorSearchInput from "./DoctorSearchInput";
import './style.less'
const Option = Select.Option;

class AddPI extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false,
            investigationSiteId: '',
            investigationSiteCode: '',
            hospitalName: '',
            user: {},
        };
    };


    show = () => {
        this.setState({
            visible: true,
        });
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    handleSelectSite = value => {
        this.setState({
            investigationSiteId: value.value,
            investigationSiteCode: value.text,
            hospitalName: value.hospitalName,
        });
        this.doctorSearchInputRef.setHospitalDepartment(value.hospitalId, value.hospitalDepartmentId);
    };

    handleSelectUser = value => {
        this.setState({
            user: value,
        });
    };

    handleSubmit = () => {
        const { user, investigationSiteId } = this.state;
        if (!user || !user.value){
            Modal.error({title:'研究者不能为空'});
            return;
        }
        const options = {
            url: `${API_URL.user.addPI}`,
            data: {
                userId: user.value,
                invSiteId: investigationSiteId,
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    visible: false,
                });
                message.success("添加成功");
                this.props.reload();
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    render() {
        const { visible, confirmLoading, hospitalName, user } = this.state;
        return (
            <Modal
                title="添加研究者"
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                confirmLoading={confirmLoading}
            >
                <div>
                    <ul className="preview-list">                        
                        <li>                    
                            <div className="item">        
                                <label className="ui-label">*中心编号\中心名称</label>
                                <span className="ui-text" className="bug">
                                    <SiteSearchInput placeholder="输入中心编号\中心名称" style={{width: 235}}
                                                handleSelectSite = {this.handleSelectSite}
                                                
                                /></span>    
                            </div>                       
                        </li>
                        <li>
                            <div className="item">
                                <label className="ui-label">*选择研究者</label>
                                <span className="ui-text" style={{display:'inline-block'}} className="bug2">
                                <DoctorSearchInput placeholder="输入姓名\手机号码" style={{width: 200}}
                                        handleSelectUser = {this.handleSelectUser}
                                        url = {`${API_URL.hospital.queryDoctorListByDepId}`}
                                        searchKey='searchKey'
                                        ref={el => { this.doctorSearchInputRef = el; }}
                                        
                                />
                                </span>
                            </div> 
                        </li>
                        <li>
                            <div className="item">                            
                                <label className="ui-label">所在医院</label>
                                <span className="ui-text">{ hospitalName }</span> 
                            </div>                          
                        </li>
                        <li>            
                            <div className="item">                
                                <label className="ui-label">所在科室</label>
                                <span className="ui-text">{ user.departmentLocalName }</span>     
                            </div>                      
                        </li>
                        <li>
                            <div className="item">                            
                                <label className="ui-label">职务</label>
                                <span className="ui-text">{ user.doctorPosition }</span>
                            </div>                           
                        </li>
                        <li>              
                            <div className="item">          
                                <label className="ui-label">手机号码</label>
                                <span className="ui-text">{ user.userMobile }</span>  
                            </div>                         
                        </li>
                        <li>         
                            <div className="item">                   
                                <label className="ui-label">固定电话</label>
                                <span className="ui-text">{ user.userTelphone }</span> 
                            </div>                          
                        </li>
                        <li>           
                            <div className="item">                 
                                <label className="ui-label">邮箱</label>
                                <span className="ui-text">{ user.userEmail }</span>
                            </div>                           
                        </li>
                    </ul>


                    {/* <Row>
                        <Col span={9}>手机号码：</Col>
                        <Col span={1}/>
                        <Col>{ user.userMobile }</Col>
                    </Row>
                    <Row>
                        <Col span={9}>固定电话：</Col>
                        <Col span={1}/>
                        <Col>{ user.userTelphone }</Col>
                    </Row>
                    <Row>
                        <Col span={9}>邮箱：</Col>
                        <Col span={1}/>
                        <Col>{ user.userEmail }</Col>
                    </Row> */}
                </div>
            </Modal>
        )
    }
}

export default AddPI;
