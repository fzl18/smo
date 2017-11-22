/**
 * Created by casteloyee on 2017/7/20.
 */
import $ from 'jquery';
import React from 'react';
import API_URL from '../../common/url';
import SearchSelect from '../common/SearchSelect';

class InvSiteSearchInput extends React.Component {
    state = {
        data: [],
    };

    parserData = (dt) => {
        const data = dt.data.siteList.datas.map(r => ({
            value: r.investigationSiteId,
            text: r.investigationSiteName,
            city: r.city,
        }));
        this.setState({
            data,
        });
    }

    render() {
        const url = `${API_URL.investigation.queryInvestigationSiteByKeyword}`;
        const params = {invId:sessionStorage.invId};
        const {data} = this.state;
        return (
            <SearchSelect labelInValue url={url}
                          style={this.props.style}
                          searchKey='keyword'
                          searchParam={params}
                          sourceData={data}
                          parserData={this.parserData}
                          handleSelect = {this.handleSelect}
                          initValue = {this.props.initValue}
            />
        );
    }

    handleSelect = (value, option) => {
        this.props.handSelectInvesgationSite(value, option);
    }
}

export default InvSiteSearchInput;
