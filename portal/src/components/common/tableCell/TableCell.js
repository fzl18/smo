import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Table, Input, Icon, Button, Popconfirm, Popover, message, Modal, DatePicker, InputNumber, Select, Checkbox } from 'antd';
import './style/TableCell.less';
import { Radio } from 'antd';
import PatientCodeSearchInput from '../../execute/PatientCodeSearchInput';

const TextArea = Input.TextArea;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;


class EditableCell extends React.Component {

    state = {
      value: (this.props.cellValue !== undefined && this.props.cellValue !== null) ? this.props.cellValue.value : '',
      comment: (this.props.cellValue !== undefined && this.props.cellValue !== null) ? this.props.cellValue.comment : '',
      editable: false,
      text: this.props.cellValue || {},
      config : this.props.config
    }
  
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value : value },function(){
      this.props.onChange(this.state.value,"value");
    });
  }
  commentChange = (e) => {
    const value = e.target.value;
    this.setState({ comment : value});
    if (this.props.onChange) {
      this.props.onChange(value, "comment");
    }
  }

  clearValue = () =>{
    this.setState({
      value: ''
    })
    if (this.props.onChange) {
      this.props.onChange('',"value");
    }
  }

  handleBlur = (e) => {
    this.setState({ editable: false, value: e.target.value },function(){
      //this.props.onChange(this.state.value,"value");
    });
    // if (this.props.onChange) {
    
    // }
  }

  handleValueBlur = (value) => {
    this.setState({ editable: false, value: value })
  }

  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value,"value");
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  Dbclick = () => {
    this.setState({ editable: true });
  }

  onTextAreaChange = e => {
    const value = e.target.value;
    this.setState({ value : value });
    if (this.props.onChange) {
      this.props.onChange(value,"value");
    }
  }

  onRadioChange = (e) => {
    const value = e.target.value;
    this.setState({ value : value });
    if (this.props.onChange) {
      this.props.onChange(value,"value");
    }
  }
  
  onSelectChange = value => {
    this.setState({ value : value });
    if (this.props.onChange) {
      this.props.onChange(value,"value");
    }
  }
  
  onCheckBoxChange = array => {
    const value = array.join("//");
    this.setState({ value : value });
    if (this.props.onChange) {
      this.props.onChange(value,"value");
    }
  }

  onControlBulr = array => {
    this.setState({ editable: false})
  }

  onNumberChange = (number) =>{
    const value = number;
    this.setState({ value : value });
    if (this.props.onChange) {
      this.props.onChange(value,"value");
    }
  }

  onDateChange = value =>{
    // if(value == null || value == ""){
    //   return;
    // }
    let { config } = this.props;
    const fv = config.type.formatValue == "YYYY-MM-DD HH:MI" ? "YYYY-MM-DD HH:mm" : config.type.formatValue;
    const valueString = moment(value).format(fv);
    let valueFormat = valueString == "Invalid date" ? "" : valueString;
    // if (valueString == null || valueString == ""){
    //   return;
    // }
    this.setState({ value : valueFormat, editable: false });
    if (this.props.onChange) {
      this.props.onChange(valueFormat,"value");
    }
  }

  handleSelectPatient = object => {
    const value = object.patientCode;
    this.setState({ value : value });
    if (this.props.onChange) {
      this.props.onChange(value,"value");
      this.props.onPatientCodeChange(object, "value");
    }
  }

  getRenderDom = (editable, comment) => {
    const {text, value, config} = this.state;
    const formatValue = config.type.formatValue;//'YYYY-MM-DD';//@todo from config
    let commentPop;
    let lockIcon = <Icon type="lock" className="un-editable" />;
    if(text.editable == 0 || this.props.isEdit == false){
      config.isEdit = false;
    }else{
      config.isEdit = true;
    }
    if(text.color){
      config.colorClass = text.color;
    }else{
      config.colorClass = "";
    }
    
    config.content = (
      <div>
        <Input type="textarea" rows={4} value={comment} disabled={!config.isEdit} onChange={this.commentChange} onContextMenu={this.contextMenu}/>
      </div>
    );
    if(config.comment.iscomment){
      let popClass = comment == "" ? "pop nopop" : "pop";
      commentPop = <Popover className="popover-cell" content={config.content} title="方案违背备注" trigger="click"><i className={popClass}></i></Popover>;
    }else{
      commentPop ="";
    }
    
    const getRadioCell = () =>{
      let optionValue= config.type.moduleDefineConstraintValue == undefined || config.type.moduleDefineConstraintValue == null ?
        null : config.type.moduleDefineConstraintValue.split("//");
      if(optionValue != null && config.isEdit){
        return (
          <div className="editable-cell" onClick={this.edit}>
            {
            editable ?
            <div>
              <RadioGroup value={value} onBulr={this.onControlBulr} options={optionValue} onChange={this.onRadioChange} />
              <Icon type="close-circle" onClick={this.clearValue} className="clear-icon" />
            </div>
            :
            <div>
              <p className="nowrap">{value || ' '}</p>
            </div>
            }
          </div>
        );
      }else{
        return (
          <div className="editable-cell">
            {lockIcon}
            {/* <RadioGroup value={value} options={optionValue} disabled /> */}
            {value || ' '}
          </div>
        );
      }
    }
    
    const getCheckBoxCell = () =>{
      let optionValue= config.type.moduleDefineConstraintValue == undefined || config.type.moduleDefineConstraintValue == null ?
        null : config.type.moduleDefineConstraintValue.split("//");
      const defaultValue = value == "" ? [] : value.split("//");
      if(optionValue != null && config.isEdit){
        let checkboxShowVal = ''
        if(value){
          checkboxShowVal = value.split("//").join(";");
        }
        return (
          <div className="editable-cell" onClick={this.edit}>
            {
            editable ?
            <div>
              <CheckboxGroup options={optionValue} onBulr={this.onControlBulr} onChange={this.onCheckBoxChange} value={defaultValue} />
              <Icon type="close-circle" onClick={this.clearValue} className="clear-icon" />
            </div>
            :
            <div>
              <p className="nowrap">{checkboxShowVal}</p>
            </div>
            }
          </div>
        );
      }else{
        let checkboxShowVal = ''
        if(value){
          checkboxShowVal = value.split("//").join(";");
        }
        return (
          <div className="editable-cell">
            {lockIcon}
            <p className="nowrap">{checkboxShowVal}</p>
            {/* <CheckboxGroup options={optionValue} disabled value={defaultValue} /> */}
          </div>
        );
      }
    }
      
    const getSelectCell = () =>{
      let optionValue= config.type.moduleDefineConstraintValue == undefined || config.type.moduleDefineConstraintValue == null ?
        null : config.type.moduleDefineConstraintValue.split("//");
      if(optionValue != null && config.isEdit){
        const options = optionValue.map(d => <Option key={d}>{d}</Option>);
        return (
          <div className="editable-cell" onClick={this.edit}>
          {
            editable ?
            <Select style={{ width: 90 }} allowClear = {true} onBlur={this.handleValueBlur} defaultValue={value} onChange={this.onSelectChange}>
              {options}
            </Select>
            :
            <div>
              <p className="nowrap">{value || ' '}</p>
            </div>
          }
          </div>
        );
      }else{
        return (
          <div className="editable-cell">
            {lockIcon}
            <p className="nowrap">{value || ' '}</p>
          </div>
        );
      }
    }
    
    const getInputCell = () =>{
      if(config.isEdit){
        return (
          <div className="editable-cell" onClick={this.edit}>
            {
              editable ?
              <div className="editable-cell-input-wrapper">
                <Input value={value} onChange={this.handleChange} onBlur={this.handleBlur} onPressEnter={this.check} />
                {/*<Icon type="check" className="editable-cell-icon-check" onClick={this.check} />*/}
              </div>
              :
              <div>
                <p className="nowrap">{value || ' '}</p>
                {/*<Icon type="edit" className="editable-cell-icon" onClick={this.edit} />*/}
              </div>
            }
            {commentPop}
          </div>
        );
      }else{
        return (
          <div className="editable-cell">
            <div>
              <p className="nowrap">{value || ' '}</p>
            </div>
            {lockIcon}
            {commentPop}
          </div>
        );
      }
    }

    const getTextAreaCell = () => {
      if(config.isEdit){
        return (
          <div className="editable-cell" onClick={this.edit}>
            {
              editable ?
              <TextArea style={{ width: 155, resize: 'none' }} onBlur={this.handleBlur} autosize={{ minRows: 1, maxRows: 1}} value={value} rows={1} onChange={this.onTextAreaChange} />
              :
              <div>
                <p className="nowrap">{value || ' '}</p>
              </div>
            }
          </div>
        );
      }else{
        return (
          <div className="editable-cell">
            <p className="nowrap">{value || ' '}</p>
            {lockIcon}
          </div>
        );
      }
    }
    
    const getDateCell = () =>{
      let showTime = false;
      let formatValuePicker = "";
      if (config.type.formatValue){
        if(config.type.formatValue == "YYYY-MM-DD HH:MI"){
          showTime = true;
          formatValuePicker = "YYYY-MM-DD HH:mm";
        } else if (config.type.formatValue == "YYYY-MM"){
          formatValuePicker = "YYYY-MM";
        } else {
          formatValuePicker = "YYYY-MM-DD";
        }
      } else {
        formatValuePicker = "YYYY-MM-DD";
      }
      const defaultValue = !value ? null : moment(value, formatValuePicker);
      let color = "";
      if(config.colorClass){
        color = config.colorClass;
      }
      
      if(config.isEdit){
        if (showTime){
          return (
            <div className="editable-cell" onClick={this.edit}>
            {
              editable ?
              <div className="editable-cell-date-wrapper">
                <DatePicker style={{width: 140}} format={formatValuePicker} style={{color: color}} onChange={this.onDateChange} value={defaultValue} showTime placeholder="请选择时间" />
              </div>
              :
              <div className="editable-cell-date-wrapper" onClick={this.edit}>
                <p className="nowrap" style={{color: color}}>{value || ' '}</p>
              </div>
            }
            {commentPop}
          </div>
            
          
          );
        } else {
          return (
            <div className="editable-cell" onClick={this.edit}>
              {
                editable ?
                <div className="editable-cell-date-wrapper">
                <DatePicker style={{width: 100}} format={formatValuePicker} style={{color: color}} onChange={this.onDateChange} value={defaultValue} />
                </div>
                :
                <div className="editable-cell-date-wrapper" onClick={this.edit}>
                  <p className="nowrap" style={{color: color}}>{value || ' '}</p>
                </div>
              }
              {commentPop}
            </div>
            
          );
        }
      }else{
        return (
          <div className="editable-cell">
            <p style={{color: color}}>{value}</p>
            {lockIcon}
            {commentPop}
          </div>
        );
      }
    }

    const getNumberCell = () =>{
      const limitDecimals = (value: string | number): string => {
          const reg = /^(\-)*(\d+)\.(\d\d).*$/;
          if(typeof value === 'string') {
              return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
          } else if (typeof value === 'number') {
              return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
          } else {
              return ''
          }
      };
      if(config.isEdit){
        return ( 
        <div className="editable-cell" onClick={this.edit}>
        {
          editable ?
          <InputNumber value={value} onBlur={this.onControlBulr} onChange={this.onNumberChange}
              formatter={limitDecimals}
              parser={limitDecimals} />
          :
          <div>
            <p className="nowrap">{value || ' '}</p>
          </div>
        }
        </div>
        );
      }else{
        return (
          <div className="editable-cell">
            <p className="nowrap">{value || ' '}</p>
            {lockIcon}
          </div>
        );
      }
    }

    const getPatientCodeSearchInput = () => {
      if(config.isEdit){
        const initPatientCodeValue = {key: value, label: value};
        return (
          <PatientCodeSearchInput 
              defaultValue={value} style={{width: 120}} 
              handleSelectPatient = {this.handleSelectPatient} 
              initValue = {initPatientCodeValue} />
        );
      }else{
        return (
          <div className="editable-cell">
            <p className="nowrap">{value || ' '}</p>
            {lockIcon}
          </div>
        );
      }
    }

    switch(config.type.type){
      case "TEXT":
          switch(config.type.webType){
            case "RADIO":
              return getRadioCell();
            case "SELECT":
              return getSelectCell();
            case "CHECKBOX":
              return getCheckBoxCell();
            case "TEXTAREA":
              return getTextAreaCell();
            default:
              return getInputCell();
          }
      break;
      case "DATE":
          return getDateCell();
      break;
      case "NUMBER":
          return getNumberCell();
      break;
      case "PatientCodeSearchSelect":
          return getPatientCodeSearchInput();
      break;
      default:
          return getInputCell();
    }
  }

  onContextMenu = (e) =>{
    //e.preventDefault();
    //alert("right")
    //addMenu.popup(e.clientX, e.clientY);
  }

  componentWillMount(){
    if(this.props.config.moduleDefineIsRequired == "1" && !this.props.cellValue){
      this.setState({
        editable: true
      })
    }
    
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.cellValue && (nextProps.cellValue.value || nextProps.cellValue.value == "")){
      this.setState({
        value: nextProps.cellValue.value
      })
    }
    this.setState({
      config: nextProps.config
    })  

  }

  render() {
    //let { config } = this.props;
    const {value, comment, editable} = this.state;
    return (
      <div onContextMenu={this.onContextMenu}>
      {this.getRenderDom(editable, comment)}
      </div>
    )
    
    
  }
}

export default EditableCell;