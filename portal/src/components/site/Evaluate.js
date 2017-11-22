/**
 * Created by casteloyee on 2017/7/28.
 */
import React from 'react';
import {connect} from 'react-redux';
import { InputNumber, Popconfirm, Modal, Button, Input, Row, Col, Radio, Checkbox, DatePicker} from 'antd';
import API_URL from '../../common/url';
import AjaxRequest from '../../common/AjaxRequest';
import moment from 'moment';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

const DateFormat = 'YYYY-MM-DD';

class Evaluate extends React.Component {
    state = {
        visible: false,
        loading: false,
        investigatorUserId: '',
        invistigatorName: '',
        beds: '',            //床位数
        experience: 0,      //项目经验
        enthusiasm: 0,      //积极性
        birthday: moment(), //生日
        interest: '',       //兴趣爱好
        english: 0,         //英文
        children: [],       //子女
        other: '',          //其他
    };

    show = (investigatorUserId, invistigatorName) => {
        this.setState({
            investigatorUserId,
            invistigatorName,
            visible: true,
        });
        const options = {
            url: `${API_URL.user.queryEvaluation}`,
            data: {
                investigatorUserId,
            },
            dataType: 'json',
            doneResult: ( data => {
                let evaluate = data.data ? data.data.evaluation : {};
                let children = [];
                if (evaluate.children && evaluate.children.length > 0){
                    children = evaluate.children.split(';');
                }
                this.setState({
                    beds: evaluate.beds,
                    experience: evaluate.experience,
                    enthusiasm: evaluate.enthusiasm,
                    birthday: evaluate.birthday ? moment(evaluate.birthday, DateFormat) : '',
                    interest: evaluate.interest,
                    english: evaluate.english,
                    children,
                    other: evaluate.other,
                    loading: false,
                    investigatorUserId,
                    invistigatorName,
                    visible: true,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    };

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    onInputBeds = value => {
        this.setState({
            beds: value,
        });
    };

    onSelectExperience = e => {
        this.setState({
            experience: e.target.value,
        });
    };

    onSelectEnthusiasm = e => {
        this.setState({
            enthusiasm: e.target.value,
        });
    };

    onSelectBirthday = moment => {
        this.setState({
            birthday: moment,
        });
    };

    onInputInterest = e => {
        this.setState({
            interest: e.target.value,
        });
    }

    onSelectEnglish = e => {
        this.setState({
            english: e.target.value,
        });
    };

    onSelectChildren = checkedList => {
        this.setState({
            children: checkedList,
        });
    }

    onInputOther = e => {
        this.setState({
            other: e.target.value,
        });
    }

    handleSubmit = () => {
        const { investigatorUserId, beds, experience, enthusiasm, birthday, interest, english, other,children } = this.state;
       
        let childrenString = '';
        if (children.length == 1){
            childrenString = children[0];
        } else if(children.length == 2){
            childrenString = children[0] + ';' + children[1];
        }
        const options = {
            url: `${API_URL.user.saveEvaluation}`,
            data: {
                
                investigatorUserId,
                beds,
                experience,
                enthusiasm,
                birthday: !birthday ? '' : birthday.format(DateFormat),
                interest,
                english,
                other,
                children: childrenString,
            },
            dataType: 'json',
            doneResult: ( data => {
                this.setState({
                    visible: false,
                });
            }),
        };
        AjaxRequest.sendRequest(options);
    }

    render() {
        const { visible, confirmLoading, invistigatorName } = this.state;
        return (
            <Modal
                title="评价"
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hide}
                className="create-modal"
                wrapClassName="vertical-center-modal"
                width="600px"
                height='700px'
                confirmLoading={confirmLoading}
            >
                <div>
                    <Row>
                        <Col span={8}>1.基本信息：</Col>
                    </Row>
                    <Row>
                        <Col span={20} offset={4}>
                            <Row>
                                <Col span={8}>研究者：</Col>
                                <Col span={14}>{invistigatorName}</Col>
                            </Row>
                            <Row>
                                <Col span={8}>床位数：</Col>
                                <Col span={14}><InputNumber value={this.state.beds} onChange={this.onInputBeds} /></Col>
                            </Row>
                            <Row>
                                <Col span={8}>项目经验：</Col>
                                <Col span={14}>
                                    <RadioGroup onChange={this.onSelectExperience} value={this.state.experience}>
                                        <Radio value={1}>多</Radio>
                                        <Radio value={2}>少</Radio>
                                        <Radio value={3}>无</Radio>
                                    </RadioGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>积极性：</Col>
                                <Col span={14}>
                                    <RadioGroup onChange={this.onSelectEnthusiasm} value={this.state.enthusiasm}>
                                        <Radio value={1}>高</Radio>
                                        <Radio value={2}>中</Radio>
                                        <Radio value={3}>差</Radio>
                                    </RadioGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>生日：</Col>
                                <Col span={14}><DatePicker value={this.state.birthday} onChange={this.onSelectBirthday} format={DateFormat}/></Col>
                            </Row>
                            <Row>
                                <Col span={8}>兴趣爱好：</Col>
                                <Col span={14}><Input value={this.state.interest} onChange={this.onInputInterest}/></Col>
                            </Row>
                            <Row>
                                <Col span={8}>英文：</Col>
                                <Col span={14}>
                                    <RadioGroup onChange={this.onSelectEnglish} value={this.state.english}>
                                        <Radio value={1}>好</Radio>
                                        <Radio value={2}>中</Radio>
                                        <Radio value={3}>差</Radio>
                                    </RadioGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>子女：</Col>
                                <Col span={14}>
                                    <CheckboxGroup options={['子', '女', '无']} value={this.state.children} onChange={this.onSelectChildren} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>2.其他信息：</Col>
                    </Row>
                    <Row>
                        <Col span={20} offset={4}>
                            <Row>
                                <Col span={8}>其他：</Col>
                                <Col span={14}><TextArea value={this.state.other} onChange={this.onInputOther} rows={4} /></Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }
}

export default Evaluate;
