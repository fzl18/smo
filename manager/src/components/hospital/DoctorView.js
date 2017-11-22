/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import { Breadcrumb } from 'antd';

class DoctorView extends React.Component {
    state = {
        loading: false,
        dataList: [],
    };

    render() {
        return (
            <div className="content">
                <div className="main">
                    <h1>医生信息</h1>
                </div>
            </div>
        );
    }
}

export default DoctorView;
