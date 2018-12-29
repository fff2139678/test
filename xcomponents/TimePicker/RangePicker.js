import React from 'react';
import DayPicker,{DateUtils} from 'react-day-picker';
import moment from 'moment';
import {$_date} from 'services';
import {Navbar} from './commonFunction';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxDayRangeSelected: props.maxDayRangeSelected || 30,//以天为单位
            month: props.value.length >0 ? props.value[0] : new Date($_date.getDate(0)),
            from: props.value.length >0 ? props.value[0] : null,
            to: props.value.length >0 ? props.value[1] : null
        }
        this.format = props.dateFormat || 'YYYY/MM/DD';
    }

    formatDate(date){
        return $_date.init(this.format,date);
    }

    handleDayClick(day) {
        const range = DateUtils.addDayToRange(day, this.state);
        if(day.getTime() > this.props.maxDate.getTime()){
            return;
        }
        if(this.props.maxDate && range.from.getTime() < this.props.maxDate.getTime() || this.props.minDate && range.from.getTime() > this.props.minDate.getTime()){
            if(range.from && Math.abs(day.getTime() - (range.to && day.getTime() === range.from.getTime() ? range.to.getTime(): range.from.getTime())) >= this.state.maxDayRangeSelected*24*3600*1000){
                range.from = day;
                range.to= null;
            }
            this.setState(range,()=>{
                if (this.state.from && this.state.to) {
                    this.props.onChange([this.state.from, this.state.to]);
                } else if (this.state.from && !this.state.to) {
                    this.props.onChange([this.state.from, this.state.from]);
                }
            });
        }
    }

    render() {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        return (
                    <DayPicker
                        selectedDays= {[from, {from, to}]}
                        month={this.state.month}
                        showOutsideDays
                        modifiers={modifiers}
                        disabledDays={{before: this.props.minDate ,after: this.props.maxDate }}
                        onDayClick={(day)=>{
                            if (from && to) {
                                this.state.from = null;
                                this.state.to = null;
                            }
                            this.handleDayClick(day);
                        }}
                        onDayChange={() => {
                            this.state.from && this.state.to ? this.props.onChange(this.state.from, this.state.to) : null
                        }}
                        numberOfMonths= {1}
                        className= "range-picker"
                        locale='zh-cn'
                        months={$_date._i18n.months}
                        weekdaysLong={$_date._i18n.weekdays}
                        weekdaysShort={$_date._i18n.weekdaysShort}
                        navbarElement={<Navbar date={this.state.dateValue} onPreYear={()=>{
                            this.setState({
                                month:new Date(new Date(this.state.month).getFullYear() -1,new Date(this.state.month).getMonth())
                            })
                        }} onNextYear={()=>{
                            this.setState({
                                month:new Date(new Date(this.state.month).getFullYear() +1,new Date(this.state.month).getMonth())
                            })
                        }}/>}
                    />
        );
    }
}


