import React from 'react';
import {message, Calendar } from 'antd';
import './style/ecalendar.less';
import moment from 'moment';

class ECalendar extends React.Component {
    state = {
        loading: false,
        pointList:[]
    };
    
    getListData = value => {
        let listData;
        // switch (value.date()) {
        //     case 5:
        //         listData = [
        //             { type: 'warning', content: 'warning' },
        //             { type: 'normal', content: 'normal' },
        //             { type: 'error', content: 'error' },
        //         ]; 
        //         break;
        //     default:
        // }
        return listData || [];
    };

    dateCellRender = value => {
        //const listData = this.getListData(value);
        const {pointList} = this.state;
        const dateArr = [];
        pointList.map((list,index) => {
            // const arr = list.split('-');
            // const date = arr[arr.length -1];
            dateArr.push(moment(list).format('YYYY-MM-DD'));
        })
        if(dateArr.indexOf(moment(value).format('YYYY-MM-DD')) > -1){
            return (
                <i className="calPoint">
                ●
                </i>
            )
        }else{
            return null
        }
        // return (
        //     <ul className="events">
        //     {
        //         listData.map(item => (
        //         <li key={item.content}>
        //             <span className={`event-${item.type}`}>●</span>
        //             {item.content}
        //         </li>
        //         ))
        //     }
        //     </ul>
        // );
    };

    getMonthData = value => {
        if (value.month() === 8) {
            return 1394;
        }
    };

    monthCellRender = value => {
        const num = this.getMonthData(value);
        return num ? <div className="notes-month">
            <section>{num}</section>
            <span>Backlog number</span>
        </div> : null;
    };

    onPanelChange = (value, mode) => {
    };
    
    componentDidMount() {
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.pointList){
            this.setState({
                pointList: nextProps.pointList,
            });
        }
    }

    render() {
        return (
            <div className="home-cal" style={{ width: '100%', border: '1px solid #d9d9d9', borderRadius: 4 }}>
                <Calendar fullscreen={false} 
                    onPanelChange={this.onPanelChange} 
                    dateCellRender={this.dateCellRender} 
                    monthCellRender={this.monthCellRender}
                    onPanelChange = {(value) => this.props.onSelect(value,true)}
                    onSelect = {(value) => this.props.onSelect(value,false)}
                    />
            </div>
        );
    }
}

export default ECalendar;
