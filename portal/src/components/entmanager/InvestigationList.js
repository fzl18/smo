/**
 * Created by casteloyee on 2017/7/18.
 */
import React from 'react';
import { Breadcrumb } from 'antd';

class InvestigationList extends React.Component {
    state = {
        loading: false,
        dataList: [],
    };

    render() {
        return (
            <div className="content">
                <div className="main">
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            临床项目
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
        );
    }
}

export default InvestigationList;
