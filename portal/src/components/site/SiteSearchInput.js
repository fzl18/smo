/**
 * Created by casteloyee on 2017/7/20.
 */
import React from 'react';
import API_URL from '../../common/url';
import SearchSelect from '../common/SearchSelect';

class SiteSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    };

    parserData = dt => {
        if (dt.data && dt.data.siteList && dt.data.siteList.count > 0) {
            const data = dt.data.siteList.datas.map(r => ({
                text: r.investigationSiteName + '(' + r.investigationSiteCode + ')',
                value: r.investigationSiteId,
                hospitalName: r.hospitalName,
                hospitalId: r.hospitalId,
                hospitalDepartmentId: r.hospitalDepartmentId ? r.hospitalDepartmentId : '',
            }));
            this.setState({
                data,
            });
        }
    };

    handleSelect = value => {
        this.state.data.map(site => {
            if(site.value == value.key){
                this.props.handleSelectSite(site);
            }
        });
    };

    render() {
        const url = `${API_URL.site.list}`;
        const params = {};
        const {data} = this.state;
        return (
            <SearchSelect url={url}
                          style={this.props.style}
                          searchKey='searchKey'
                          searchParam={params}
                          sourceData={data}
                          parserData={this.parserData}
                          handleSelect = {this.handleSelect}
            />
        );
    };

}

export default SiteSearchInput;
