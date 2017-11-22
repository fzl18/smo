/**
 * Created by casteloyee on 2017/7/22.
 */
import $ from 'jquery';
import React from 'react';
import {AutoComplete} from 'antd';
import StringUtil from '../../common/StringUtil';
import AjaxRequest from '../../common/AjaxRequest';
const Option = AutoComplete.Option;

class SearchSelect extends AutoComplete {
    state = {
        searchValue: '',
    };

    // 搜索医院
    handleSearch = (value) => {
        // 输入的是空格，不搜索
        if (value != null && StringUtil.isNull(value) && value.length > 0) {
            return null;
        }
        // 和之前内容相同，不搜索
        const {searchValue, data} = this.state;
        if (!StringUtil.isNull(value) && !StringUtil.isNull(searchValue) && StringUtil.trim(value) == StringUtil.trim(searchValue)) {
            return null;
        }
        if (searchValue == '' && value == '' && data != undefined && data.length > 0) {
            return null;
        }
        this.setState({
            searchValue: value,
        });
        const {url, searchKey, searchParam} = this.props;
        const options = {
            url,
            data: {
                showError: 0,
                [searchKey]: value,
                ...searchParam,
            },
            dataType: 'json',
            doneResult: ( dt => {
                    this.props.parserData(dt);
                }
            ),
        };
        AjaxRequest.sendRequest(options);
    };

    handleSelect = (value) => {
        const {sourceData} = this.props;
        let option = {};
        sourceData.map((dataItem, i) => {
            if (dataItem.value == value.key) {
                option = dataItem;
            }
        });
        this.props.handleSelect(value, option);
    }

    render() {
        const {sourceData} = this.props;
        return (
            <AutoComplete labelInValue style={this.props.style}
                          placeholder={this.props.placeholder}
                          onSearch={this.handleSearch}
                          onSelect={this.handleSelect}
                          onFocus={this.handleSearch}
                          defaultValue={this.props.initValue}
                          dropdownClassName={this.props.autoClassName || null}
            >
                {sourceData.map(d => <Option key={d.value} >{d.text}</Option>)}
            </AutoComplete>
        );
    }
}

export default SearchSelect;
