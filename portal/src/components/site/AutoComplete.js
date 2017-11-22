import React from 'react';
import { Icon, Button, Input, AutoComplete } from 'antd';
import API_URL from '../../common/url';
import $ from '../../common/XDomainJquery';

const Option = AutoComplete.Option;

function onSelect(value) {
}

function getRandomInt(max, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
}

function searchResult(query) {
    return (new Array(getRandomInt(5))).join('.').split('.')
        .map((item, idx) => ({
            query,
            category: `${query}${idx}`,
            count: getRandomInt(200, 100),
        }));
}

function renderOption(item) {
    return (
        <Option key={item.value} text={item.value}>
            <span className="global-search-item-count">item.text</span>
        </Option>
    );
}

class Complete extends React.Component {
    state = {
        dataSource: [],
    }

    handleSearch = (value) => {
        $.ajax({
            method: 'get',
            url: `${API_URL.hospital.hospitalList}`,
            data: {
                hospitalName: value,
            },
        }).done(dt => {
            const data = dt.data.hospitalList.datas.map(r => ({
                text: r.hospitalName,
                value: r.hospitalId,
            }));
            this.setState(data);
        });
    }

    render() {
        const { dataSource } = this.state;
        return (
            <div className="global-search-wrapper">
                <AutoComplete
                    className="global-search"
                    size="large"
                    style={{ width: '100%' }}
                    dataSource={dataSource.map(renderOption)}
                    onSelect={onSelect}
                    onSearch={this.handleSearch}
                    placeholder="input here"
                    optionLabelProp="text"
                >
                    <Input
                        suffix={(
                            <Button className="search-btn" size="large" type="primary" onClick={this.handleSearch()}>
                                <Icon type="search" />
                            </Button>
                        )}
                    />
                </AutoComplete>
            </div>
        );
    }
}

export default Complete;
