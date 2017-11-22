import React from 'react';
import moment from 'moment';
import $ from '../../common/AjaxRequest';
import {message,Input, Calendar,Button,Select, DatePicker,Modal,Tag,Table,Spin,Tree} from 'antd';
import UserSider from './UserSider';
import Highcharts from 'react-highcharts';
import chartsConfig from '../common/chartsConfig';
import API_URL from '../../common/url';
// import './style/home.less';


const TreeNode = Tree.TreeNode;
const Option = Select.Option
const dateformat='YYYY-MM-DD'
const monthformat='YYYY-MM'
const { MonthPicker, RangePicker } = DatePicker;



class UserAnalysis extends React.Component {
    state = {
        loading: false,
        visible: false,
        params:{},
        analyseType:'',
        spinning:false,
        showTree:false,
        treeData:{},
        checkedArea:[],
        categoryList:[],
        categories:[],
        series:[],
    };


    hide = () => {
        this.setState({
            visible: false,
            showTree:false,
        })
    }
    
    show =() => {
        this.setState({
            visible:true,
        })
    }

    SelectChange =(value)=>{
        this.setState({
            analyseType:value,
        })
    }

    loadData = (params={}) => {        
        this.setState({
            loading: true,
        });
        const options ={
            method: 'POST',
            url: API_URL.user.queryUserAnalyse,
            data: {
                ...params,
            },
            dateType: 'json',
            doneResult:(data => {
                if (!data.error) {
                    let categories = data.categoryList.map(d => d)
                    let series = []
                    data.regionList.map((d,i)=>{
                        let dataok = []
                        data.dataList.map(v => {
                            d == v.regionName ? dataok.push(v.count) : null
                        })
                        series.push({
                            data: dataok,
                            name: d,
                        })
                    })
                    this.setState({
                        categories,
                        series
                    })
                } else {
                    this.setState({
                        loading: false,
                    });
                    Modal.error({ title: data.error });
                }
            })
        }
            $.sendRequest(options)      
        }


        reload = () => {
            const {checkedArea,analyseType} = this.state 
            if(analyseType == ''){
                message.warn('请选择分析项！')
            }else if(checkedArea.length==0){
                message.warn('请选择区域！')                
            }else{
            const params = {
                analyseType,
                }
            if(checkedArea.length>0){                
                checkedArea.map(d =>{
                    const k = `params[${d.props.title}]`
                    params[k] = d.key
                })                
            }
            this.loadData(params);
            }            
        }

        componentDidMount() {
            this.loadTreeData()
        }

        onSelect = (value) => {
            console.log(value.format(dateformat))
            this.createModalRef.show()
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

        onTreeCheck=(checkedKeys, info)=>{
            this.setState({
                checkedArea:info.checkedNodes,
            })
        }

    render() {
        const {checkedArea,showTree,visible,loading,categories,series} = this.state
        const config={
            title:{
              text:''
            },
            chart: {
                type: 'column'
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                x: 0,
                y: 20,
                layout:'vertical',
            },
            yAxis: {
              title: {
                text: ''
              },
            },
            xAxis: {
              categories: categories
            },
            series:series ,
            exporting: {
                chartOptions: {
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            credits: {
                enabled:false,
                text:'SMO医疗大数据',
            },
          };
          const treeNode = this.loop(this.state.treeData.children)
          console.log(series)
        return (
            
            <div className="content">
                <UserSider selectKey='UserDistribution' ref={el => {this.siderRef = el;}} />
                <div className='main'>
                    <div className='main-content'>
                    <div className='' style={{padding:'0 30px'}}>                        
                        <div className='filter' style={{marginBottom:30}}>
                             {/* 地区选择 */}
                            <Input value={checkedArea.map(d=>d.props.title)} style={{width:250}} onClick={this.openTree} placeholder = '选择区域'/>      
                            <span className="ant-divider" />
                            <Select 
                                    style={{width:100}}
                                    onChange={this.SelectChange}
                                    placeholder='请选择分析项'
                            >                                
                                <Option value="Education">学历</Option>
                                <Option value="Subject">专业</Option>
                                <Option value="ClinicalExperience">临床研究经验</Option>
                            </Select >
                            <span className="ant-divider" />
                            <Button type='primary' onClick={this.reload}> 统计分析</Button>                            
                        </div>
                        <div><Highcharts config={{...config, ...chartsConfig}} /></div>
                    </div>
                </div> 
                <Modal
                title="选择地区"
                visible={showTree}
                onOk={this.chooseArea}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                >
                <div style={{padding:'30px 40px'}}>
                    <Tree onSelect={this.onTreeSelect} onCheck={this.onTreeCheck} multiple={true} checkable={true} checkStrictly={true}>
                        <TreeNode key={this.state.treeData.key} title={this.state.treeData.title}>
                            {treeNode}
                        </TreeNode>
                        
                    </Tree>
                </div>                
                </Modal>
                </div>
            </div>
        );
    }
}


export default UserAnalysis;
