import React from 'react';
import { $_date } from 'services';
import DayPicker from 'react-day-picker';
import {BMonthPicker} from 'bcomponents';
import  {YearMonthForm, Navbar}from './commonFunction'; //自定义切换
import YearPicker from './YearPicker';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.handleYearMonthClick = this.handleYearMonthClick.bind(this);
        this.state = {
            dateValue: props.value || '',
            selectedDay: new Date($_date.getDate(-1)),
            month: props.value || new Date($_date.getDate(0)),
            isShowMonth: false,
            isShowYear: false
        }
        this.format = props.dateFormat || 'YYYY/MM/DD';
    }

    formatDate(date) {
        return $_date.init(this.format, date);
    }

    handleYearMonthClick(type){
        this.setState({
            isShowMonth: type === 'month'? true : false,
            isShowYear: type === 'year' ? true : false
        })
    }

    handleDayClick(day, { selected }, e) {
        e.nativeEvent.stopImmediatePropagation();
        let dayZeroHour = new Date(day.getFullYear(),day.getMonth(),day.getDate());
        if((this.props.endValue && dayZeroHour.getTime() < this.props.endValue.getTime() || this.props.startValue && dayZeroHour.getTime() > this.props.startValue.getTime())){
            this.setState({
                selectedDay:  dayZeroHour,
                dateValue:  dayZeroHour
            }, () => {
                this.props.onChange([this.state.selectedDay])
            });
        }
    }

    render() {
        const {isShowMonth, isShowYear} = this.state;
        return [
            !isShowMonth && !isShowYear ? 
            <DayPicker
                key="picker"
                selectedDays={this.state.selectedDay}
                disabledDays={{ before: this.props.startValue, after: this.props.endValue }}
                onDayClick={this.handleDayClick.bind(this)}
                month={this.state.month}
                locale='zh-cn'
                months={$_date._i18n.months}
                weekdaysLong={$_date._i18n.weekdays}
                weekdaysShort={$_date._i18n.weekdaysShort}
                navbarElement={<Navbar date={this.state.dateValue} onPreYear={() => {
                    this.setState({
                        month: new Date(new Date(this.state.month).getFullYear() - 1, new Date(this.state.month).getMonth())
                    })
                }} onNextYear={() => {
                    this.setState({
                        month: new Date(new Date(this.state.month).getFullYear() + 1, new Date(this.state.month).getMonth())
                    })
                }} />}
                captionElement={({ date, localeUtils }) => (
                    <YearMonthForm
                      date={date}
                      localeUtils={localeUtils}
                      onClick={this.handleYearMonthClick}
                    />
                  )}
            />: null,
            isShowMonth ?
            <div key="2" className="month">
                <BMonthPicker value={this.state.dateValue} onChange={(res)=>{
                    this.setState({
                        isShowMonth:false,
                        month: new Date(res.getFullYear(),res.getMonth())
                    })
                }} />
            </div> : null,
            isShowYear ? 
            <div key='3' className="year">
                <YearPicker value={this.state.dateValue} onChange={(res)=>{
                    this.setState({
                        isShowYear:false,
                        month: new Date(res,this.state.dateValue.getMonth())
                    })
                }} />
            </div>:null
        ];
    }
}
