/**
 * Created by casteloyee on 2017/7/20.
 */
import $ from 'jquery';
import React from 'react';
import API_URL from '../../common/url';
import SearchSelect from '../common/SearchSelect';

class HospitalSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    };

    parserData = dt => {
        const data = dt.data.hospitalList.datas.map(r => ({
            text: r.hospitalName,
            value: r.hospitalId,
        }));
        this.setState({
            data,
        });
    };

    handleSelect = value => {
        this.props.handleSelectHospital(value);
    };

    render() {
        const url = `${API_URL.hospital.hospitalList}`;
        const params = {};
        const {data} = this.state;
        return (
            <SearchSelect url={url}
                          style={this.props.style}
                          searchKey='hospitalName'
                          searchParam={params}
                          sourceData={data}
                          parserData={this.parserData}
                          handleSelect = {this.handleSelect}
                          initValue = {this.props.initValue}
            />
        );
    };

}

export default HospitalSearchInput;
