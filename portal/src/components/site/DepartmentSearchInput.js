/**
 * Created by casteloyee on 2017/7/20.
 */
import React from 'react';
import API_URL from '../../common/url';
import SearchSelect from '../common/SearchSelect';

class DepartmentSearchInput extends React.Component {
    state = {
        data: [],
    };

    parserData = (dt) => {
        const data = dt.datas.map(r => ({
            text: r.departmentLocalName,
            value: r.hospitalDepartmentId,
        }));
        this.setState({
            data,
        });
    }

    getDynamicParams = () => {
        const hospitalId = this.props.getHospitalId();
        if (hospitalId){
            return {hospitalId};
        }
        return null;
    }

    handleSelect = value => {
        this.props.handleSelectHospitalDepartment(value);
    };

    render() {
        const url = `${API_URL.hospital.queryDepWhenAddDoctor}`;
        const { data } = this.state;
        return (
            <SearchSelect url={url}
                          style={this.props.style}
                          searchKey='hospitalDepName'
                          sourceData={data}
                          parserData={this.parserData}
                          handleSelect = {this.handleSelect}
                          initValue = {this.props.initValue}
                          getDynamicParams = {this.getDynamicParams}
            />
        );
    }

}

export default DepartmentSearchInput;
