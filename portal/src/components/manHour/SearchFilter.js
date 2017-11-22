import React from "react";
import $ from '../../common/AjaxRequest';
import {Button, DatePicker, Input, Select,Modal,Tree} from "antd";
import moment from "moment";
import SelectCitys from "../common/SelectCitys";
import API_URL from '../../common/url';
import ExportUtil from '../../common/ExportUtil';

const TreeNode = Tree.TreeNode;
const InputGroup = Input.Group;
const Option = Select.Option;
const monthFormat = 'YYYY-MM';
const {MonthPicker, RangePicker} = DatePicker;

function disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
}

class Filter extends React.Component {
    state = {
        // startDate: moment().format(monthFormat),
        //  endDate: moment().format(monthFormat),
        startDate: moment().add(-11,'M').format(monthFormat),
        endDate: moment().format(monthFormat),
        employeeCode: '',
        userCompellation: '',
        workCityName: '',
        Province:'',
        showTree:false,
        treeData:{},
        checkedArea:'',
        checkedAreaName:''
    };

    search = () => {
        const params = {}
        const {checkedArea,
            userCompellation,
            employeeCode,
            endDate,
            startDate,
        }=this.state
        // if(checkedArea.length>0){
        //     checkedArea.map(d =>{
        //         const k = `params[${d.props.title}]`
        //         params[k] = d.key
        //     })                
        // }
        this.props.reload({
            userCompellation,
            employeeCode,
            endDate,
            startDate,
            region:checkedArea
        },"search");
        this.props.setParams({
            userCompellation,
            employeeCode,
            endDate,
            startDate,
            region:checkedArea,
        });
    };

    getSearchParams =() => {
        return(  {...this.state} )
    }

    handleChange2 = (field, v, s) => {
        this.setState({
            [field]: s.label,
        });
    };

    handleChange = (field, e) => {
        this.setState({
            [field]: e.target.value,
        });
    };

    onChangeMonth1 = (date, dateString) => {
        this.setState({
            startDate: dateString,
            begin:dateString,
        });
    };

    onChangeMonth2 = (date, dateString) => {
        this.setState({
            endDate: dateString,
            end:dateString,
        });
    };

    enterSearch = e => {
        if (e.charCode === 13) {
            this.search();
        }
    };

    reset = () => {
        this.setState({
            monthNum: '',
            investigationCode: '',
            investigationName: '',
            investigationSiteCode: '',
            investigationSiteName: '',
        });

        this.props.reset();
    };

    export = () => {
        this.props.export({...this.state});
    };

    clear = () =>{
        this.setState({
            workCityName:'',
            Province:''
        })
    }



    openTree = () => {
            this.setState({
                showTree:true,
            })
        }

        loadTreeData = () => {
            const options ={
                method: 'POST',
                url: `${API_URL.summary.getRegionTree}`,
                data: {
                },
                dataType: 'json',
                doneResult: data => {
                    if (!data.error) {
                        this.setState({
                            treeData:data.treeData,
                        })
                    } else {
                        Modal.error({ title: data.error });
                    }
                }
            }
            $.sendRequest(options)
        }

        loop = (data =[]) => 
            data.map((item) => {
                if (item.children) {
                  return (
                    <TreeNode key={item.key} title={item.title}>
                      {this.loop(item.children)}
                    </TreeNode>
                  );
                }
                return <TreeNode key={item.key} title={item.title} />;
            })
        

        chooseArea = () => {
            this.setState({
                showTree:false,
            })
        }

        hide = () => {
            this.setState({
                showTree:false,
            })
        }

        onTreeSelect=(selectedKeys, info)=>{
            console.log(selectedKeys,info)
            const {checkedArea,checkedAreaName}=this.state
            if(checkedArea !== selectedKeys[1] && selectedKeys.length>0){
                this.setState({
                    checkedArea:selectedKeys[1],
                    checkedAreaName:info.selectedNodes[1] ? checkedAreaName == info.selectedNodes[1].props.title ? info.selectedNodes[0].props.title:info.selectedNodes[1].props.title  :info.selectedNodes[0].props.title,
                    showTree:false,
                },()=>{
                    console.log(this.state.checkedArea)
                })
            }else{
                this.setState({
                    checkedArea:'',
                    checkedAreaName:''
                },()=>{
                    console.log(this.state.checkedArea)            
                })
            }
        }

        onTreeCheck=(checkedKeys, info)=>{
            console.log(checkedKeys,info)
            const {checkedArea}=this.state
            if(checkedArea !== checkedKeys.checked[1]){
                this.setState({
                    checkedArea:checkedKeys.checked[1],
                    checkedAreaName:''
                },()=>{
                    console.log(this.state.checkedArea)            
                })
            }else{
                this.setState({
                    checkedArea:'',
                    checkedAreaName:''
                },()=>{
                    console.log(this.state.checkedArea)            
                })
            }
            
        }

        componentDidMount(){
            this.loadTreeData()
        }

    render() {
        const {
            monthStart,
            begin,
            end,
            startDate,
            endDate,
            investigationCode,
            investigationName,
            investigationSiteCode,
            investigationSiteName,
            checkedArea,
            showTree,
            checkedAreaName,
        } = this.state;
        const treeNode = this.loop(this.state.treeData.children)
        return (
            <div className="filter-bar bar2">
                <div className="form-item">
                    <label htmlFor="" className="ui-label">时间</label>
                    {/* // defaultValue={moment()}*/}
                    <MonthPicker  format={monthFormat}
                                  disabledDate={disabledDate} placeholder="选择月份"
                                  onChange={this.onChangeMonth1}
                                  allowClear={false} defaultValue={moment(startDate)}
                    />

                </div>
                <div className="form-item">
                    <label htmlFor="" className="ui-label">至</label>
                    <MonthPicker format={monthFormat}
                                 disabledDate={disabledDate(monthStart)} placeholder="选择月份"
                                 onChange={this.onChangeMonth2}
                                 allowClear={false}
                                 defaultValue={moment(endDate)}
                    />
                </div>

                <div className="form-item">
                    <label htmlFor="" className="ui-label">工号</label>
                    <Input
                        placeholder="请输入项目工号"
                        onChange={this.handleChange.bind(this, 'employeeCode')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                <div className="form-item">
                    <label htmlFor="" className="ui-label">姓名</label>
                    <Input
                        placeholder="请输入姓名"
                        onChange={this.handleChange.bind(this, 'userCompellation')}
                        onKeyPress={this.enterSearch}
                    />
                </div>
                <div className="form-item">
                    <label htmlFor="" className="ui-label">工作城市 </label>
                    <Input value={checkedAreaName} style={{width:150}} onClick={this.openTree} placeholder = '选择城市或大区'/> 
                    {/* <SelectCitys
                        ChangeSelectprovinces={this.handleChange2.bind(this, 'Province')}
                        ChangeSelect={this.handleChange2.bind(this, 'workCityName')}
                        clear={this.clear}
                        onKeyPress={this.enterSearch}
                    /> */}
                </div>
                <div className="btn" style={{float: 'right'}}>
                    <Button type="primary" onClick={this.export}>导出</Button>
                    <Button type="primary" onClick={this.search}>搜索</Button>
                    {/* <Button type="primary" icon="reload" onClick={this.reset}>导出</Button> */}
                </div>
                <Modal
                    title="选择地区"
                    visible={showTree}
                    onOk={this.chooseArea}
                    onCancel={this.hide}
                    className="preview-modal"
                    wrapClassName="vertical-center-modal"
                    width="400px"
                    footer={<Button key="back" type="ghost" size="large" onClick={this.hide}>关闭</Button>}
                >
                    <div style={{padding:'30px 40px'}}>
                        <Tree onSelect={this.onTreeSelect} multiple={true} checkable={false} checkStrictly={true} selectedKeys={[checkedArea]}>
                            <TreeNode key={this.state.treeData.key} title={this.state.treeData.title}>
                                {treeNode}
                            </TreeNode>                        
                        </Tree>
                    </div>                
                </Modal>

            </div>
            
        );
    }


}

export default Filter;
