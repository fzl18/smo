import $ from 'jquery';
import React from 'react';
import API_URL from '../../common/url';
import SearchSelect from '../common/SearchSelect';

class HospitalSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            crcSite: {}
        };
    };

    parserData = dt => {
        const data = dt.data.crcList.map(r => ({
            text: `${r.employeeName}(${r.employeeCode})`,
            value: r.userId,
            crcSite: r.investigationSiteList
        }));
        this.setState({
            data,
        });
    };

    handleSelect = value => {
        this.state.data.map( val => {
            if (val.value == value.key){
                this.props.handleSelectCrc(val);
            }
        });
    };
    render() {
        const {url} = this.props;
        const params = {};
        const {data} = this.state;
        return (
            <SearchSelect url={url}
                          style={this.props.style}
                          searchKey='keyword'
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