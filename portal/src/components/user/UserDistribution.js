
import React from 'react';
import { } from 'antd';
import UserSider from './UserSider';
// import chinamap from './chinamap';
import ReactHighmaps from 'react-highcharts/ReactHighmaps';
import Highcharts from 'react-highcharts';



class UserDistribution extends React.Component {
    state = {
        loading: false,
        dataList: [],
    };

    render() {
    //     const mapconfig = {
    //         chart: {
    //             spacingBottom: 20
    //         },
    //         title: {
    //             text: '人员分布'
    //         },
        
    //         legend: {
    //             enabled: true
    //         },
        
    //         plotOptions: {
    //         map: {
    //             allAreas: false,
    //             joinBy: ['iso-a2', 'code'],
    //             dataLabels: {
    //                 enabled: true,
    //                 color: 'white',
    //                 style: {
    //                     fontWeight: 'bold'
    //                 }
    //             },
    //             mapData: chinamap,
    //             tooltip: {
    //                 headerFormat: '',
    //                 pointFormat: '{point.name}: <b>{series.name}</b>'
    //             }
        
    //         }
    //         },
            
    //         series: [{
    //         name: 'UTC',
    //         data: ['IE', 'IS', 'GB', 'PT'].map(function (code) {
    //             return { code: code };
    //         })
    //         }, {
    //         name: 'UTC + 1',
    //         data: ['NO', 'SE', 'DK', 'DE', 'NL', 'BE', 'LU', 'ES', 'FR', 'PL', 'CZ', 'AT', 'CH', 'LI', 'SK', 'HU', 'SI', 'IT', 'SM', 'HR', 'BA', 'YF', 'ME', 'AL', 'MK'].map(function (code) {
    //             return { code: code };
    //         })
    //         }]
    //     }
        return (
            <div className="content">
            <UserSider selectKey='UserDis' ref={el => {this.siderRef = el;}} />
                <div className="main">
                    <div className="main-content">
                        {/* <ReactHighmaps  config={ mapconfig } /> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default UserDistribution;
