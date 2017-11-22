/**
 * Created by casteloyee on 2017/7/20.
 */
import React from 'react';
import API_URL from '../../common/url';
import SearchSelect from '../common/SearchSelect';

class PatientCodeSearchInput extends React.Component {
    constructor(props) {
        super(props);
        if(props.defaultValue){
            this.state = {
                data: [{text: props.defaultValue, value: 0}],
            };
        } else {
            this.state = {
                data: [],
            };
        }
    };

    parserData = dt => {
        const data = [];
        if (dt.datas && dt.datas.length > 0) {
            dt.datas.map(r => {
                data.push({
                    text: r.patientCode,
                    value: r.patientId,
                    patientId: r.patientId,
                    patientCode: r.patientCode,
                    investigationSiteId: r.investigationSiteId,
                    createUserId: r.createUserId,
                    userId: r.userId,
                });
            });
        }
        this.setState({
            data,
        });
    };

    handleSelect = sel => {
        this.state.data.map( item => {
            if (item.value == sel.key){
                this.props.handleSelectPatient(item);
            }
        });
    };

    render() {
        const url = `${API_URL.execute.queryPatientCodeList}`;
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

export default PatientCodeSearchInput;
