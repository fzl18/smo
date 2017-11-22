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
            hospitalId: '',
            hospitalDepartmentId: '',
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

    setHospitalDepartment = (hospitalId, hospitalDepartmentId) => {
        this.setState({
            hospitalId, 
            hospitalDepartmentId,
            data: [],
        });
        this.searchSelectRef.clearValue();
        const user = {};
        this.props.handleSelectUser(user);
    }

    getDynamicParams = () => {
        const {hospitalId, hospitalDepartmentId} = this.state;
        if (hospitalId){
            const params = {hospitalId, hospitalDepartmentId};
            return params;
        }
        return null;
    }

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
                          getDynamicParams = {this.getDynamicParams}
                          ref={el => { this.searchSelectRef = el; }}
            />
        );
    };

}

export default DoctorCustomerSearchInput;
