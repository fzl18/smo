/**
 * Created by casteloyee on 2017/7/20.
 */
import React from 'react';
import API_URL from '../../common/url';
import SearchSelect from '../common/SearchSelect';

class UserSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    };

    parserData = dt => {
        if ((dt.data || dt.datas) && dt.totalCount > 0) {
            const sourceData = dt.data ? dt.data : dt.datas;
            const data = sourceData.map(r => ({
                text: r.userCompellation + '[' + r.employeeCode + ']',
                value: r.userId,
            }));
            this.setState({
                data,
            });
        } else {
            this.setState({
                data: [],
            });
        }
    };

    handleSelect = keyValue => {
        this.state.data.map( user => {
            if (user.value == keyValue.key){
                this.props.handleSelectUser(user);
            }
        });
    };

    render() {
        const searchParams = {};
        const {data} = this.state;
        return (
            <SearchSelect url={ this.props.url }
                          style={this.props.style}
                          placeholder={this.props.placeholder}
                          searchKey={ this.props.searchKey }
                          searchParam={searchParams}
                          sourceData={data}
                          parserData={this.parserData}
                          handleSelect = {this.handleSelect}
            />
        );
    };
}

export default UserSearchInput;
