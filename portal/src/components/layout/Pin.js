import React from 'react';
import './style/layout.less';
import API_URL from "../../common/url";
import $ from "../../common/AjaxRequest";
import HourModal from "./HourModal"

class Pin extends React.Component {
    state = {
        show: true,
    };

    displayPin = () =>{
        if(sessionStorage.invId == "0" || !sessionStorage.invId){
            this.setState({
                show: false
            })
        }else{
            const {curRole} = sessionStorage;
            if(curRole == "CRC" || curRole == "CRCC" || curRole == "PM"){
                this.setState({
                    show: true
                })
            }else{
                this.setState({
                    show: false
                })
            }
        }
    }

    componentWillMount(){
        this.displayPin();
    }

    componentWillReceiveProps(nextProps) {
        this.displayPin();
    }

    showHourModal = () => {
        this.hourModalRef.show();
    }

    render() {
        const {show} = this.state;
        return (
            <div>
            {show ?
            <div className="pin-hour" onClick={this.showHourModal}><i className="icon iconfont">&#xe64f;</i>填写工时</div>
            :
            null
            }
            <HourModal
                ref={el => { this.hourModalRef = el; }}
            />
            </div>
        );
    }
}

export default Pin;
