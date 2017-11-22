/**
 * Created by casteloyee on 2017/7/20.
 */
import React from 'react';
import API_URL from '../../common/url';
import SearchSelect from '../common/SearchSelect';

class DoctorCustomerSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    };

    parserData = dt => {
        const data = [];
        if (dt.datas && dt.totalCount > 0) {
            dt.datas.map(r => {
                data.push({
                    text: r.userCompellation,
                    value: r.userId,
                    hospitalName: r.hospitalName,
                    departmentLocalName: r.departmentLocalName,
                    doctorPosition: r.doctorPosition,
                    userMobile: r.userMobile,
                    userTelphone: r.userTelphone,
                    userEmail: r.userEmail,
                });
            });
        }
        this.setState({
            data,
        });
    };

    handleSelect = doc => {
        this.state.data.map( doctor => {
            if (doctor.value == doc.key){
                this.props.handleSelectUser(doctor);
            }
        });
    };

    render() {
        const { url, searchKey } = this.props;
        const params = {};
        const {data} = this.state;
        return (
            <SearchSelect url={url}
                          style={this.props.style}
                          searchKey={searchKey}
                          searchParam={params}
                          sourceData={data}
                          parserData={this.parserData}
                          handleSelect = {this.handleSelect}
            />
        );
    };

}

export default DoctorCustomerSearchInput;
