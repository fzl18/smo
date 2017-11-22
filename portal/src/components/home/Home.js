import React from 'react';
import moment from 'moment';
import $ from '../../common/AjaxRequest';
import DateRange from '../common/DateRange';
import {message,Input, Calendar,Button,Select, DatePicker,Modal,Tag,Table,Spin,Tree} from 'antd';
import ECalendar from './ECalendar';
import AddEvent from './addEvent';
import Highcharts from 'react-highcharts';
import chartsConfig from '../common/chartsConfig';
import API_URL from '../../common/url';
import './style/home.less';

const TreeNode = Tree.TreeNode;
const Option = Select.Option
const dateformat='YYYY-MM-DD'
const monthformat='YYYY-MM'
const { MonthPicker, RangePicker } = DatePicker;
class Home extends React.Component {
    state = {
        loading: false,
        visible: false,
        RemindVisible:false,
        mywork:[],
        myPro:[],
        userOutPut:[],
        enterpriseWorkCategoryId:'',
        investigationId:'',
        onwork:'cur',
        onpro:'',
        output:'',
        pro:[],
        params:{},
        proid:'',
        type:'day',
        freeStartDate:moment().subtract(7, 'days').format(dateformat),
        freeEndDate:moment().format(dateformat),
        outputStartDate:'',
        outputEndDate:'',
        dateString:'',
        tableDataSource:[],
        regionIds:[],
        noticeList:[],
        total:0,
        spinning:false,
        noticeListBytype:[],
        showTree:false,
        treeData:{},
        checkedArea:[],
        xname:[],
        monthList:[],
        categories:[],
        series:[],
        pointList:[],
        grey:'#ccc',
        blue:'#108ee9',
        read1:'',
        read2:'',
        read3:'',
        read4:'',
        read5:'',
        read6:'',
        c1:'',
        c2:'',
        c3:'',
        c4:'',
        c5:'',
        c6:'',
        txt:'',
        calendarDate:null,
        LinkType:'',
    };

    btnChangeWork = () => {
        this.setState({
            onwork:'cur',
            onpro:'',
            output:'',  
            proid:'',
            type:'day'    
        },() => {
            this.loadData()
            this.loadPro()
        })
    }
    btnChangePro = () => {
        this.setState({
            onwork:'',
            onpro:'cur',
            output:'',
            proid:'',
            type:'day'  
        },() => {
            this.loadData()
            this.loadPro()
        })
    }
    btnChangeOutPut = () => {
        this.setState({
            onwork:'',
            onpro:'',
            output:'cur',        
        },() => {
            this.loadData({'params[全国]':'COUNTRY_0'})
        })
    }
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

    dateOnChange = (date, dateString) => {
        this.setState({
            dateString:dateString,
        })     
        
    }
    chooseDate = () => {
        const {dateString} = this.state
        //console.log(dateString)
        this.setState({
            freeStartDate:dateString[0],
            freeEndDate:dateString[1],
            visible:false,
        })
    }
    clearStartDate=()=>{
        this.setState({
            outputStartDate:''
        })
    }
    clearEndDate=()=>{
        this.setState({
            outputEndDate:''
        })
    }

    loadData = (params={},date = {startDate:moment().subtract(6,'Days').format(dateformat), endDate:moment().format(dateformat)}) => {
        
        this.setState({
            loading: true,
        });
        let {type,onpro,onwork,output,regionIds,checkedArea} = this.state
        let url
                
        if(type ==='day'){
            url =  onpro === 'cur' ? API_URL.home.myProjectStatisticsByDate : API_URL.home.queryManHourMyWorkByDate
        }else if(type ==='week'){
            url = onpro === 'cur' ? API_URL.home.myProjectStatisticsByWeek : API_URL.home.queryManHourMyWorkByWeek
            date = {
                    startDate:moment().week() - 4 ,
                    endDate:moment().week(),
                    year:moment().format('YYYY'),
                    }
        }else if(type ==='year'){
            url = onpro === 'cur' ? API_URL.home.myProjectStatisticsByMonth : API_URL.home.queryManHourMyWorkByMonth
            date = {
                startDate:moment().subtract(6,'months').format(monthformat),
                endDate:moment().add(1,'months').format(monthformat),
                }
        }else if(type=== 'free'){
            url = onpro === 'cur' ? API_URL.home.myProjectStatisticsByDate : API_URL.home.queryManHourMyWorkByDate,
            date = {
                startDate:this.state.freeStartDate,
                endDate:this.state.freeEndDate,
                }
        }else{
            url = onpro === 'cur' ? API_URL.home.myProjectStatisticsByDate :  API_URL.home.queryManHourMyWorkByDate
        }

        if(output==='cur'){
            type = 'months'
            regionIds.map((d,i)=> {
                let re = `regionIds[${i}]`
                params[re]=d
            }) 
            date = {
                startDate:this.state.outputStartDate || moment().subtract(11,'months').format(monthformat), 
                endDate:this.state.outputEndDate || moment().format(monthformat)}
            url = API_URL.home.queryAreaProduct 
        }

        const options ={
            method: 'POST',
            url: url,
            data: {
            ...params,
            ...date,
        },
        dateType: 'json',
        doneResult:(data => {
        if (!data.error) {
            // output != 'cur' ? data.data.length == 0 &&
            // message.warn('暂无数据！') : data.datas.length == 0 &&
            // message.warn('暂无数据！')             

            let categories =[]
            let series = []

            if(output === 'cur'){
                categories = data.monthList
                //console.log(categories)
                data.names.map((d,i)=> {
                    series.push({
                        data: data.datas[i].map(d => d.producePercent*100),
                        name: data.names[i]
                    })
                })
            }
            if(onpro ==='cur'){
                categories = type==='week' ? data.data.map(d => `${d.weekNum}周` ) : type ==='year' ? data.data.map(d => `${d.yearNum}-${d.monthNum}月` ) : data.data.map(d => moment(d.date).format(dateformat)) 
                series = [
                    {
                    data: data.data.map(d => d.typeInformed*1),
                    name: '知情数'
                    },{
                    data: data.data.map(d => d.typeFilter*1),
                    name: '筛选数'
                    },{
                    data: data.data.map(d => d.typeRandom*1),
                    name: '随机(入组)数'
                    }
                ]
            }
            if(onwork==='cur'){
                categories = type==='week' ? data.data.map(d => `${d.weekNum}周` ) : type ==='year' ? data.data.map(d => `${d.yearNum}-${d.monthNum}月`) : data.data.map(d => moment(d.manHourDate).format(dateformat)) 
                series = [{
                    data: data.data.map(d => d.duration*1),
                    name: '工时'
                }]
            }

            this.setState({
                categories,
                series,
            })

            // if(type==='week'){
            //     categories = onpro ==='cur' ? myPro.map(d => `${d.weekNum}周` ) : mywork.map(d => `${d.weekNum}周` )
            // }else if(type ==='year'){
            //     categories = onpro ==='cur' ? myPro.map(d => `${d.yearNum}-${d.monthNum}月` ) : mywork.map(d => `${d.yearNum}-${d.monthNum}月`)
            // }else if(type==='months'){
            //     categories = monthList
            // }else{
            //     categories = onpro ==='cur' ? myPro.map(d => moment(d.data).format(dateformat)) : mywork.map(d => moment(d.manHourDate).format(dateformat))
            // }
            // if(checkedArea.length >0){
            //     categories = monthList
            // }

            // const series = onpro ==='cur' ?
            //   [{
            //     data: myPro.map(d => d.typeFilter*1),
            //     name: '筛选数'
            //   },{
            //     data: myPro.map(d => d.typeRandom*1),
            //     name: '随机(入组)数'
            //   },{
            //     data: myPro.map(d => d.typeInformed*1),
            //     name: '知情数'
            //   },]
            //  :
            //   output === 'cur' ? checkedArea.length >0 ? 
            //   [{
            //     data: userOutPut.map(d => d.producePercent*1),
            //     name: xname
            //   }]
            //   :
            //   [{
            //     data: userOutPut.map(d => d.producePercent*1),
            //     name: '全国总情况'
            //   }]
            //   :
            //   [{
            //     data: mywork.map(d => d.duration*1),
            //     name: '工时'
            //   }]



            // if(onpro ==='cur'){
            //     this.setState({
            //         loading: false,
            //         myPro:data.data,
            //     });
            // }else if(onwork==='cur'){
            //     this.setState({
            //         loading: false,
            //         mywork:data.data,
            //     });
            // }else if(output === 'cur'){
            //     this.setState({
            //         loading: false,
            //         userOutPut:data.datas,
            //         monthList:data.monthList,
            //         xname:data.name,
            //     });
            // }
            


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

        loadNotice = () =>{
            const options ={
                method: 'POST',
                url: API_URL.home.queryTodayNotice,
                data: {

                },
                dataType: 'json',
                doneResult: data => {
                    if (!data.error) {               
                        this.setState({
                            noticeList: data.data,
                            total:data.totalCount
                        });                        
                    } else {
                        Modal.error({ title: data.error });
                    }
                }
            }
            $.sendRequest(options)         
        }

        loadNoticeBytype = (type) =>{
            const options ={
                method: 'POST',
                url: API_URL.home.queryTodayNoticeByType,
                data: {
                    type,
                },
                dataType: 'json',
                doneResult: data => {
                    if (!data.error) {               
                        this.setState({
                            noticeListBytype: data.data,
                            spinning:false,
                        });                        
                    } else {
                        Modal.error({ title: data.error });
                    }
                }
            }
            $.sendRequest(options)         
        }

        loadRemindPoint = (month) => {
            const options ={
                method: 'POST',
                url: API_URL.home.queryAllSignByMonth,
                data: {
                    date: month
                },
                dataType: 'json',
                doneResult: data => {
                    if (!data.error) {               
                        this.setState({
                            pointList: data.data
                        });                        
                    } else {
                        Modal.error({ title: data.error });
                    }
                }
            }
            $.sendRequest(options)         
        }

        reload = () => {
            const {type,proid,checkedArea,output,investigationId,enterpriseWorkCategoryId,onpro} = this.state 
            const params = {
                investigationId:onpro == 'cur' ? proid : investigationId,
                // investigationId : proid,
                enterpriseWorkCategoryId
            }
            if(checkedArea.length>0){                
                checkedArea.map(d =>{
                    const k = `params[${d.props.title}]`
                    params[k] = d.key
                })                
            }
            this.loadData(params);
        }


        componentDidMount() {
            this.loadNotice()
            this.loadTreeData()
            this.loadRemindPoint(moment().format('YYYY-MM'))
            const curRole = sessionStorage.curRole;
            switch (curRole){
                case 'PM' :
                case 'CRC' :
                case 'CRCC' :
                this.setState({
                    onwork:'cur',
                    onpro:'',
                    output:'',        
                },() => {
                    this.loadData()
                    this.loadPro()  
                })
                break;
                case 'CRCM' :
                this.setState({
                    onwork:'',
                    onpro:'',
                    output:'cur',        
                },() => {
                    this.loadData({'params[全国]':'COUNTRY_0'})
                })
                break;
                case 'BD' :
                case 'BDO' :
                case 'BO' :
                this.setState({
                    onwork:'',
                    onpro:'cur',
                    output:'',        
                },() => {
                    this.loadData()
                    this.loadPro()  
                })
                break;
            }
            // this.loadPro()
        }

        SelectChangeDay = (v) => {
            if(v==='free'){
                this.show()
            }

            this.setState({
                type:v
            })
        }
        SelectChangePro= (v) => {
            this.state.pro.map(d=>{
                if(d.enterpriseWorkCategoryId==v){
                    if(d.isInves){
                        this.setState({
                            enterpriseWorkCategoryId:'',
                            investigationId:d.invesId
                        })
                    }else{
                        this.setState({
                            enterpriseWorkCategoryId:d.enterpriseWorkCategoryId,
                            investigationId:''
                        })
                    }
                }
            })
            // console.log(v,enterpriseWorkCategoryId,investigationId)
            this.setState({
                proid:v
            })
        }

        loadPro = (params={}) => {
            const options ={
                method: 'POST',
                url: this.state.onpro=='cur' ? API_URL.investigation.queryUserInvestigationList : `${API_URL.investigation.queryUserInvestigationList2}`,
                data: {
                    offset: 1,
                    limit: 15,
                    isFinish:'a',
                    ...params,
                },
                dataType: 'json',
                doneResult: data => {
                    if (!data.error) {
                        this.setState({
                            pro: this.state.onpro=='cur' ? data.data.investigations : data.data.enterpriseWorkCategories,
                        });
                    } else {
                        Modal.error({ title: data.error });
                    }
                }
            }
            $.sendRequest(options)            
        }

        loadRemind = (params={}) => {
            const options ={
                method: 'POST',
                url: `${API_URL.home.queryAllInves}`,
                data: {
                    offset: 1,
                    limit: 15,
                    ...params,
                },
                dataType: 'json',
                doneResult: data => {
                    if (!data.error) {
                        const  tableDataSource = data.data.map(d => d.investigationName)
                        this.setState({
                            tableDataSource,
                            loading:false,
                        });
                    } else {
                        Modal.error({ title: data.error });
                    }
                }
            }
            $.sendRequest(options)
        }

        showRemind = (type,read,txt) => {
            this.loadNoticeBytype(type)            
            this.setState({
                RemindVisible:true,
                spinning:true,
                [read]:'clicked',
                txt,
                LinkType:type,
            })
        }
        RemindHide = () => {
            this.setState({
                RemindVisible: false,
                showTree:false,
            })
        }


        onSelect = (value,hide) => {
            this.loadRemindPoint(value.format('YYYY-MM'));
            this.setState({
                calendarDate:value.format('YYYY-MM')
            })
            if(!hide){
                this.createModalRef.show(value.format(dateformat))
            }
        }
        // dataSource = () => {
        //     const dataSource = this.state.RemindData.map(d => d.investigationName);
        //     return dataSource;
        // }


        SelectChangeCity = (value) => {
            this.setState({
                regionIds:value,
            })
            //console.log(value)
        }

        handleDateRange = (value,date) => {
            this.setState({
                outputStartDate:date.begin,
                outputEndDate:date.end,
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

        onTreeCheck=(checkedKeys, info)=>{
            // console.log(info.checkedNodes)
            this.setState({
                checkedArea:info.checkedNodes,
            })
        }

        clickNotice = (path, setSession) => {
            if(Object.keys(setSession).length !== 0 && setSession.constructor === Object){
                sessionStorage.invId = setSession.invId;
                sessionStorage.invName = setSession.invName;
                sessionStorage.investigationSiteCode = setSession.investigationSiteCode;
                sessionStorage.investigationSiteName = setSession.investigationSiteName;
                sessionStorage.siteId = setSession.siteId;
            }
            if(path !== "javascript:void(0)" || path){
                location.href = path;
            }
        }
    
    render() {
        let {c1,c2,c3,c4,c5,c6,read1,read2,read3,read4,read5,read6,blue,grey,categories,series,checkedArea,showTree,noticeListBytype,noticeList,userOutPut,output,onwork,onpro,mywork,pro,visible,freeStartDate,freeEndDate,type,loading,RemindVisible,myPro,total,pointList,calendarDate,LinkType} = this.state
        let type1=0, type2=0, type3=0, type4=0, type5=0, type6=0
        const todayNotice = []
        noticeList.map(d => {            
            switch(d.noticeType){
                case 'INVESTIGATION_REQUIREMENT' :
                type1 += 1
                d.readStatus !=='READ' ? read1=blue : read1=grey
                break;
                case 'HANDOVER_REQUIREMENT' :
                type2 += 1
                d.readStatus !=='READ' ? read2=blue : read2=grey
                break;
                case 'VISIT' :
                type3 += 1
                d.readStatus !=='READ' ? read3=blue : read3=grey
                break;
                case 'EVENT' :
                type4 += 1
                d.readStatus !=='READ' ? read4=blue : read4=grey
                break;
                case 'AUTHORITY' :
                type5 += 1
                d.readStatus !=='READ' ? read5=blue : read5=grey
                break;
                case 'MANHOUR' :
                type6 += 1
                d.readStatus !=='READ' ? read6=blue : read6=grey
                break;                              
            }       
        })

        if(type1){
            todayNotice.push( <li key='INVESTIGATION_REQUIREMENT'><a href='javascript:void(0);' onClick={this.showRemind.bind(this,'INVESTIGATION_REQUIREMENT','c1','人员需求')}   style={c1=='clicked' ? {color:grey} :{color:read1}}>人员需求通知({type1}条)</a></li>)
        }
        if(type2){
            todayNotice.push( <li key='HANDOVER_REQUIREMENT'><a href='javascript:void(0);' onClick={this.showRemind.bind(this,'HANDOVER_REQUIREMENT','c2','人员交接')} style={c2=='clicked' ? {color:grey} :{color:read2}}>人员交接通知({type2}条)</a></li>)
        }
        if(type3){
            todayNotice.push( <li key='VISIT'><a href='javascript:void(0);' onClick={this.showRemind.bind(this,'VISIT','c3','访视')} style={c3=='clicked' ? {color:grey} :{color:read3}}>访视通知({type3}条)</a></li>)
        }
        if(type4){
            todayNotice.push( <li key='EVENT'><a href='javascript:void(0);' onClick={this.showRemind.bind(this,'EVENT','c4','事件')} style={c4=='clicked' ? {color:grey} :{color:read4}}>事件通知({type4}条)</a></li>)
        }
        if(type5){
            todayNotice.push( <li key='AUTHORITY'><a href='javascript:void(0);' onClick={this.showRemind.bind(this,'AUTHORITY','c5','授权')} style={c5=='clicked' ? {color:grey} :{color:read5}}>授权通知({type5}条)</a></li>)
        }
        if(type6){
            todayNotice.push( <li key='MANHOUR'><a href='javascript:void(0);' onClick={this.showRemind.bind(this,'MANHOUR','c6','工时')} style={c6=='clicked' ? {color:grey} :{color:read6}}>工时通知({type6}条)</a></li>)
        }

        // BO, //总监
        // BDO, //BD总监
        // BD,
        // PA, //项目管理员
        // PM, //项目经理
        // CRCC, //CRC主管
        // CRCM, //CRC经理
        // CRC, //临床协调员
        // CPM, //客户项目经理
        const curRole = sessionStorage.curRole;
        let showMywork,showMyPro,showOutput
        showMywork = showMyPro = showOutput = false
        switch (curRole){
            case 'PM' :
            showMywork = true
            showMyPro = true
            break;
            case 'CRC' :
            showMywork = true
            break;
            case 'CRCM' :
            showOutput = true
            break;
            case 'CRCC' :
            showMywork = true
            showOutput = true
            break;
            case 'BD' :
            showMyPro = true
            showOutput = true
            break;
            case 'BDO' :
            showMyPro = true
            showOutput = true
            break;
            case 'BO' :
            showMyPro = true
            showOutput = true
            break;
        }
        // console.log(curRole,showMywork,showMyPro,showOutput)

        
            const options = pro.map((d,i) => 
            onpro=='cur' ? 
            <Option key={i} value={`${d.investigationId}`}>{d.investigationName}</Option>
            :
            <Option key={i} value={`${d.enterpriseWorkCategoryId}`}>{d.enterpriseWorkCategoryName}</Option>
            )
               
        
        
        const config={
            title:{
              text:''
            },
            // chart: {
            //     type: ''
            // },
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
              labels: {
                formatter: function(){
                    if(this.chart.series && this.chart.series[0] && this.chart.series[0].name == '全国'){
                        return `${this.value}%`;
                    }else{
                        return this.value;
                    }
                },
              },
            },
            tooltip: {
                formatter: function() {
                    if(this.series.name == '全国'){
                        return `<p style="font-size:10px">${this.x}</p><br/>${this.series.name}:<b>${this.y}%</b>`
                    }else{
                        return `<p style="font-size:10px">${this.x}</p><br/>${this.series.name}:<b>${this.y}</b>`
                    }
                }
            },
            xAxis: {
              categories: categories
            },
            series:series,
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
            plotOptions: {
                series: {
                    animation: false
                }
            },
            credits: {
                enabled:false,
                text:'SMO医疗大数据',
            },
          };
          const treeNode = this.loop(this.state.treeData.children)
        //   console.log(onpro)
        return (            
            <div className="con home">
                <div className='side' >
                    <div className='bgwhite' style={{marginBottom:'20px'}}><ECalendar pointList={pointList} onSelect = {this.onSelect}/></div>
                    <div className='bgwhite today'>
                        <div className='bluebg'></div>
                        <div className='tit'>今日消息（共{total}条）</div>
                        <ul>
                            {todayNotice.map(d => d)}
                        </ul>

                    </div>
                </div>
                <div className='bgwhite right'>
                    <div className='change-btn'>                        
                       {showMywork ? <a href='javascript:void(0);' onClick={this.btnChangeWork} className={onwork} >我的工作</a> : null}  
                       {showMyPro ? <a href='javascript:void(0);' onClick={this.btnChangePro} className={onpro} >我的项目</a> : null}  
                       {showOutput ? <a href='javascript:void(0);' onClick={this.btnChangeOutPut} className={output} >人员产出率</a> : null} 
                    </div>
                    <div className='' style={{padding:'0 30px'}}>                        
                        <div className='tit'> {onpro ==='cur' ? '近期入组情况': output ==='cur' ? ' 近期人员产出率' : '近期工时情况'}</div>
                        <div className='filter'>
                         {output === 'cur' ? 
                         <span>
                             {/* 地区选择 */}
                            <Input value={checkedArea.map(d=>d.props.title)} style={{width:150}} onClick={this.openTree} placeholder = '选择区域'/>      
                            <span className="ant-divider" />
                            <DateRange 
                                style={{marginRight:10,height:'28px',lineHeight:'28px',display:"inline-block",verticalAlign:"bottom"}}
                                loadData ={this.handleDateRange}
                                clearStartDate={this.clearStartDate}
                                clearEndDate={this.clearEndDate}
                            />
                        </span>
                         :  
                         <span>
                            <Select 
                                    style={{width:100}}
                                    onChange={this.SelectChangeDay}
                                    placeholder='近七天'
                                    value={this.state.type}
                            >
                                <Option value="day">近七天</Option>
                                <Option value="week">近四周</Option>
                                <Option value="year">近半年</Option>
                                <Option value="free">自定义</Option>
                            </Select >
                            
                            <Select 
                                    style={{width:200}}
                                    onChange={this.SelectChangePro}
                                    placeholder='选择项目'
                                    value={this.state.proid}
                            >
                                <Option value="">所有项目</Option>
                                {options}
                            </Select >
                            
                        </span>
                        }
                            <Button type='primary' onClick={this.reload}> 统计 </Button>
                        <div style={{display: type =='free' ? 'block': 'none',marginTop:8 }}><Tag color="orange">自定义时间段：{freeStartDate} 至 {freeEndDate}</Tag></div>
                            
                        </div>
                        <div><Highcharts config={{...config, ...chartsConfig}} /></div>
                    </div>
                </div> 

                <Modal
                title="选择时间段"
                visible={visible}
                onOk={this.chooseDate}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                >
                <div style={{padding:'30px 40px'}}><RangePicker onChange={this.dateOnChange} /></div>                
                </Modal>

                <Modal
                    title={`今日${this.state.txt}通知`}
                    visible={RemindVisible}
                    onCancel={this.RemindHide}
                    className="preview-modal"
                    wrapClassName="vertical-center-modal"
                    width="700px"
                    footer={<Button key="back" type="ghost" size="large" onClick={this.RemindHide}>关闭</Button>}
                    >
                    <div style={{padding:30}}>
                        <Spin spinning={this.state.spinning}>
                        <ul className='notice'>
                            { noticeListBytype.map((d,i) => {
                                let path;
                                const setSession = {};
                                switch (LinkType) {
                                    case 'INVESTIGATION_REQUIREMENT' :
                                    //Link = d.noticeTargetList[0].roleCode ==='CRC' ? 'javascript:void(0)' :`/front/#/user/Require/${d.relateId}`
                                    if(d.noticeTargetList && d.noticeTargetList[0]){
                                        const roleCode = d.noticeTargetList[0].roleCode;
                                        if(roleCode == 'CRCM' || roleCode == 'CRCC' || roleCode == 'CRC'){
                                            path = d.noticeTargetList[0].roleCode ==='CRC' ? 'javascript:void(0)' :`/front/#/user/Require/${d.relateId}`
                                        }else{
                                            const {investigationId, investigationName, investigationSiteCode, investigationSiteId, investigationSiteName} = d.noticeTargetList[0];
                                            setSession.invId = investigationId;
                                            setSession.invName = investigationName;
                                            setSession.investigationSiteCode = investigationSiteCode;
                                            setSession.investigationSiteName = investigationSiteName;
                                            setSession.siteId = investigationSiteId;
                                            path = `/front/#/member/require/${d.relateId}`;                      
                                        }
                                    }
                                    break;
                                    case 'HANDOVER_REQUIREMENT' :
                                    //Link = `/front/#/user/UserTransfer/${d.relateId}`
                                    if(d.noticeTargetList && d.noticeTargetList[0]){
                                        const roleCode = d.noticeTargetList[0].roleCode;
                                        if(roleCode == 'CRCM' || roleCode == 'CRCC' || roleCode == 'CRC'){
                                            path = d.noticeTargetList[0].roleCode ==='CRC' ? 'javascript:void(0)' : `/front/#/user/UserTransfer/${d.relateId}` 
                                        }else{
                                            const {investigationId, investigationName, investigationSiteCode, investigationSiteId, investigationSiteName} = d.noticeTargetList[0];
                                            setSession.invId = investigationId;
                                            setSession.invName = investigationName;
                                            setSession.investigationSiteCode = investigationSiteCode;
                                            setSession.investigationSiteName = investigationSiteName;
                                            setSession.siteId = investigationSiteId;
                                            path = `/front/#/execute/transfer/${d.relateId}` ;                      
                                        }
                                    }    
                                    break;
                                    case 'VISIT' :
                                    path = `/front/#/execute/crf/Type_Visit/${d.relateId}`
                                    const {visitInvestigationId, visitInvestigationName, visitInvestigationSiteCode, visitInvestigationSiteId, visitInvestigationSiteName} = d;
                                    setSession.invId = visitInvestigationId;
                                    setSession.invName = visitInvestigationName;
                                    setSession.investigationSiteCode = visitInvestigationSiteCode;
                                    setSession.investigationSiteName = visitInvestigationSiteName;
                                    setSession.siteId = visitInvestigationSiteId;
                                    break;
                                    case 'EVENT' :
                                    path = 'javascript:void(0)'
                                    break;
                                    case 'AUTHORITY' :
                                    path = `/front/#/invList/${d.relateId}`
                                    break;
                                    case 'MANHOUR' :
                                    path = d.relateId ? `/front/#/manHour/write/${d.relateId}/${d.noticeInfo.substring(0,10)}` : 'javascript:void(0)'
                                    break;
                                }
                            return(
                            <li key={i}><a onClick={() => {this.clickNotice(path,setSession)}}> {d.noticeInfo}</a></li>)
                            }
                            )}
                        </ul>
                        </Spin>
                    </div>                
                </Modal>

                <Modal
                title="选择地区"
                visible={showTree}
                onOk={this.chooseArea}
                onCancel={this.hide}
                className="preview-modal"
                wrapClassName="vertical-center-modal"
                width="400px"
                footer={<Button key="back" type="ghost" size="large" onClick={this.RemindHide}>关闭</Button>}
                >
                <div style={{padding:'30px 40px'}}>
                    <Tree onSelect={this.onTreeSelect} onCheck={this.onTreeCheck} multiple={true} checkable={true} checkStrictly={true}>
                        <TreeNode key={this.state.treeData.key} title={this.state.treeData.title}>
                            {treeNode}
                        </TreeNode>                        
                    </Tree>
                </div>                
                </Modal>
                <AddEvent
                    ref={el => { this.createModalRef = el; }}
                    reloadRemind = {this.loadRemindPoint}
                    calendarDate = {calendarDate}
                />
            </div>
        );
    }
}

export default Home;
