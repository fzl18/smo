/**
 * Created by casteloyee on 2017/7/20.
 */
import React from 'react';
import API_URL from '../../common/url';
import SearchSelect from '../common/SearchSelect';

class BDSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    };

    parserData = dt => {
        if (dt.datas && dt.totalCount > 0) {
            const data = dt.datas.map(r => ({
                text: `${r.userCompellation}[${r.employeeCode}]`,
                value: r.userId,
            }));
            this.setState({
                data,
            });
        }
    };

    handleSelect = selectValue => {
        this.state.data.map( item => {
            if (item.value == selectValue.key){
                this.props.setFieldsValue({ bdUserId: item.value });
            }
        });
    };

    render() {
        const url = API_URL.investigation.queryUserByKey;
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
                          placeholder = {this.props.placeholder ? this.props.placeholder : '姓名/工号'}
                          initValue ={this.props.initValue}
                          autoClassName = 'bd-search'
            />
        );
    };

}

export default BDSearchInput;
