/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import { Breadcrumb } from 'antd';

class UserRequire extends React.Component {
    ///这里不用，直接用member/require  
    ///wzy 2017.8.11
    state = {
        loading: false,
        dataList: [],
    };

    render() {
        return (
            <div className="content">
                <div className="main">
                    <h1>人员需求</h1>
                </div>
            </div>
        );
    }
}

export default UserRequire;
