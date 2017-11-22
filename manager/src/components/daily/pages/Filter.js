import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import { Form, Button, Row, Col, DatePicker, Input, Select, Cascader, Switch, Icon } from 'antd';
import store from '../../store';
import { initInvestigation } from '../../actions/investigationActions';

const Search = Input.Search;
const Option = Select.Option;
const { RangePicker } = DatePicker;


class Filter extends React.Component {

    showCreateModal = () => {
        store.dispatch(initInvestigation());
        this.props.showCreateModal();
    }
    render() {
        return (
            <div className="filter-bar">
                <div className="filter-bar-investigation">
                    <div className="cell" />

                    <Button className="add-btn" size="large" type="ghost" onClick={this.showCreateModal}>添加</Button>
                </div>
            </div>
        );
    }
}
//
//
// const Filter = ({
//                     showCreateModal
// }) => {
//
//
//     console.log(showCreateModal)
//     return (
//         <div className="filter-bar">
//
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 {/*<div >*/}
//                     {/*<Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>搜索</Button>*/}
//                     {/*<Button size="large" onClick={handleReset}>重置</Button>*/}
//                 {/*</div>*/}
//                 <div>
//                     <Button size="large" type="ghost" onClick={showCreateModal}>添加</Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

export default Filter;
