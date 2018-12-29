import React from 'react';
import DayPicker from 'react-day-picker';
import moment from 'moment';
import {BMonthPicker} from 'bcomponents';
import YearPicker from './YearPicker';
import { $_date } from 'services';
import {YearMonthForm, Navbar} from './commonFunction';//自定义左右切换按钮


//获取日期所在周
function getWeekDays(weekStart) {
    const days = [weekStart];
    for (let i = 1; i < 7; i += 1) {
        days.push(
            moment(weekStart)
                .add(i, 'days')
                .toDate()
        );
    }
    return days;
}

function getWeekRange(date) {
    return {
        from: moment(date)
            .startOf('week')
            .add('days', 1) 
            .toDate(),
        to: moment(date)
            .endOf('week')
            .add('days', 1)
            .toDate(),
    };
}

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            props:props.type,
            maxDayRangeSelected: props.maxDayRangeSelected || 12, //以周为单位
            dateValue: props.value.length > 0 ? props.value[0] : '',
            month: props.value.length > 0 ? props.value[0] : new Date($_date.getDate(0)),
            hoverRange: undefined,
            selectedDays: props.value.length > 0 ? getWeekDays(getWeekRange(new Date(props.value[0])).from) : [], //默认值去第一个日期获取本周数据
            before: this.props.startValue,
            after: this.props.endValue && getWeekDays(getWeekRange(props.endValue).from)[0],
            isShowMonth: false,
            isShowYear: false,
            mulDateValueArr: props.value.length > 0 ? getWeekDays(getWeekRange(new Date(props.value[0])).from) : [], //默认值去第一个日期获取本周数据 
        }
        this.format = props.dateFormat || 'YYYY/MM/DD';
    }

    formatDate(date) {
        return $_date.init(this.format, date);
    }

    handleDayChange = date => {
        const {type} = this.props;
        const {mulDateValueArr} = this.state;
        
        if((this.state.after && getWeekDays(getWeekRange(date).from)[0].getTime() < this.state.after.getTime() || this.state.before && getWeekDays(getWeekRange(date).from)[0].getTime() > this.state.before.getTime())){
            this.setState({
                selectedDays: getWeekDays(getWeekRange(date).from),
                dateValue: [getWeekDays(getWeekRange(date).from)[0], getWeekDays(getWeekRange(date).from)[6]]
            }, () => {
                 if(type === 'mul-select'){
                     //判断>7天的数据，再次点击时重置选中时间
                     if((mulDateValueArr[mulDateValueArr.length-1].getTime() - mulDateValueArr[0].getTime()) > 7*24*3600*1000 || Math.abs((getWeekDays(getWeekRange(date).from)[0]) - mulDateValueArr[0].getTime()) >= this.state.maxDayRangeSelected*7*24*3600*1000){
                        this.setState({
                            mulDateValueArr : this.state.dateValue
                        })
                        this.props.onChange(this.state.dateValue)
                     }else{
                        mulDateValueArr[0].getTime() > getWeekDays(getWeekRange(date).from)[0].getTime() ? mulDateValueArr.splice(0,1,getWeekDays(getWeekRange(date).from)[0])  :mulDateValueArr.splice(mulDateValueArr.length-1,1,getWeekDays(getWeekRange(date).from)[getWeekDays(getWeekRange(date).from).length - 1])
                        this.props.onChange([this.state.mulDateValueArr[0],this.state.mulDateValueArr[this.state.mulDateValueArr.length-1]])
                    }
                 }else{
                     this.props.onChange(this.state.dateValue)
                 }
            });
        }
        
    };

    handleYearMonthClick(type){
        this.setState({
            isShowMonth: type === 'month'? true : false,
            isShowYear: type === 'year' ? true : false
        })
    }

    handleDayEnter = date => {
        if((this.state.after && getWeekDays(getWeekRange(date).from)[0].getTime() < this.state.after.getTime() || this.state.before && getWeekDays(getWeekRange(date).from)[0].getTime() > this.state.before.getTime())){
            this.setState({
                hoverRange: getWeekRange(date),
            });
        }
        
    };

    handleDayLeave = () => {
        this.setState({
            hoverRange: undefined,
        });
    };

    render() {
        const { hoverRange, selectedDays, isShowMonth, isShowYear, mulDateValueArr} = this.state;
        const {type} = this.props;

        const daysAreSelected = type === 'mul-select' ? mulDateValueArr.length > 0 : selectedDays.length > 0;

        const modifiers = {
            hoverRange,
            selectedRange: daysAreSelected && {
                from: type === 'mul-select' ? mulDateValueArr[0] : selectedDays[0],
                to: type === 'mul-select' ? mulDateValueArr[mulDateValueArr.length-1] : selectedDays[6],
            },
            hoverRangeStart: hoverRange && hoverRange.from,
            hoverRangeEnd: hoverRange && hoverRange.to,
            selectedRangeStart: daysAreSelected && type === 'mul-select' ? mulDateValueArr[0] : selectedDays[0],
            selectedRangeEnd: daysAreSelected && type === 'mul-select' ? mulDateValueArr[mulDateValueArr.length-1] : selectedDays[6],
        };
        return [
            !isShowMonth && !isShowYear ?
            <DayPicker
                key="weekPicker"
                selectedDays={selectedDays}
                month={this.state.month}
                showOutsideDays
                modifiers={modifiers}
                disabledDays={{ before: this.state.before, after: new Date(this.state.after.getFullYear(),this.state.after.getMonth(),this.state.after.getDate()-1)}}
                onDayClick={this.handleDayChange}
                onDayMouseEnter={this.handleDayEnter}
                onDayMouseLeave={this.handleDayLeave}
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
                      onClick={::this.handleYearMonthClick}
                    />
                  )}
            />: null,
            isShowMonth ? 
            <div key="2" className="month">
                <BMonthPicker value={this.state.dateValue[0]} onChange={(res)=>{
                    this.setState({
                        isShowMonth:false,
                        month: new Date(res.getFullYear(),res.getMonth())
                    })
                }} />
            </div> : null,
            isShowYear ? 
            <div key='3' className="year">
                <YearPicker value={this.state.dateValue[0]} onChange={(res)=>{
                    this.setState({
                        isShowYear:false,
                        month: new Date(res,this.props.value[0].getMonth())
                    })
                }} />
            </div>:null
        ];
    }
}


