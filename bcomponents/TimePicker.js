import React from 'react';
import {$_date} from 'services';
import moment from 'moment';
import {
  XIcon,
  XInput,
  XToggle,
  XButton,
  XDatePicker,
  XWeekPicker,
  XRangePicker,
} from 'xcomponents';
import {BMonthPicker} from 'bcomponents';
import {EPROTONOSUPPORT} from 'constants';

//获取日期所在周
function getWeekDays (weekStart) {
  const days = [weekStart];
  for (let i = 1; i < 7; i += 1) {
    days.push (moment (weekStart).add (i, 'days').toDate ());
  }
  return days;
}

function getWeekRange (date) {
  return {
    from: moment (date).startOf ('week').add ('days', 1).toDate (),
    to: moment (date).endOf ('week').add ('days', 1).toDate (),
  };
}

function formatDate (date) {
  return date ? $_date.init ('YYYY/MM/DD', date) : null;
}

export default class extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      type: props.type, //type=mul-select，历史日期都为多选
      maxDayRangeSelected: props.maxDayRangeSelected,
      maxDayWeekSelected: props.maxDayWeekSelected,
      dateValue: props.value.length > 0 ? props.value : [],
      isShowDayPicker: false,
      historyScopeVal: '日',
      selectMonth: '',
      month: props.value.length > 0
        ? new Date (props.value[0])
        : new Date ($_date.getDate (0)),
      dateType: 2,
    };
  }

  quickSelectFn (val, type, e) {
    e.nativeEvent.stopImmediatePropagation ();
    let valMap = {'0': '今日', '-7': '近7天', '-30': '近30天'};
    this.setState ({
      dateValue: val === 0
        ? [new Date ($_date.getDate (val))]
        : [new Date ($_date.getDate (val)), new Date ($_date.getDate (-1))],
      // dateWords: valMap[val],
      dateType: type,
    });
  }

  monthSelectChange (res) {
    if (
      this.state.type === 'mul-select' &&
      Object.prototype.toString.call (res) === '[object Array]'
    ) {
      let minTime = new Date (
        res[0].toString ().substr (0, 4),
        res[0].toString ().substr (4)
      );
      let maxTime = new Date (
        res[res.length - 1].toString ().substr (0, 4),
        res[res.length - 1].toString ().substr (4)
      );
      let minDayList = $_date.getDayListOfMonth (
        minTime.getFullYear (),
        minTime.getMonth ()
      );
      let maxDayList = $_date.getDayListOfMonth (
        maxTime.getFullYear (),
        maxTime.getMonth ()
      );
      this.setState ({
        selectMonth: res,
        dateValue: [
          new Date (minDayList[0]['timeStamp']),
          new Date (maxDayList[maxDayList.length - 1]['timeStamp']),
        ],
        dateType: 6,
      });
    } else {
      let dayList = $_date.getDayListOfMonth (
        res.getFullYear (),
        res.getMonth ()
      );
      this.setState ({
        selectMonth: res,
        dateValue: [
          new Date (dayList[0]['timeStamp']),
          new Date (dayList[dayList.length - 1]['timeStamp']),
        ],
        dateType: 6,
      });
    }
  }

  render () {
    const {dateValue} = this.state;
    const displayValue = dateValue.length > 0
      ? dateValue.length === 1
          ? formatDate (dateValue[0])
          : formatDate (dateValue[0]) + '至' + formatDate (dateValue[1])
      : '';
    let dateWords;
    if (formatDate (dateValue[0]) === $_date.getDate (0)) {
      dateWords = '今日';
    }
    if (
      formatDate (dateValue[0]) === $_date.getDate (-7) &&
      formatDate (dateValue[1]) === $_date.getDate (-1)
    ) {
      dateWords = '近7天';
    }
    if (
      formatDate (dateValue[0]) === $_date.getDate (-30) &&
      formatDate (dateValue[1]) === $_date.getDate (-1)
    ) {
      dateWords = '近30天';
    }
    const DayTypeTemp = this.state.type === 'mul-select'
      ? XRangePicker
      : XDatePicker;
    return (
      <XToggle className="b-timepicker">
        <XToggle.Top className="timepicker-top date-picker-top">
          <XInput
            size={'sm'}
            value={displayValue + (dateWords ? ' (' + dateWords + ')' : '')}
          />
          <XIcon type="angle-right" className="up-icon dropdown-select-icon" />
        </XToggle.Top>
        <XToggle.Box className="timepicker-box">
          {this.state.isShowDayPicker
            ? <div
                className="calendar-wrap"
                onClick={e => {
                  e.nativeEvent.stopImmediatePropagation ();
                }}
              >
                <div
                  className="select-scope"
                  onClick={e => {
                    e.nativeEvent.stopImmediatePropagation ();
                  }}
                >
                  <p
                    className={`scope-item ${this.state.historyScopeVal === '日' ? 'active' : ''}`}
                    onClick={() => {
                      this.setState ({
                        historyScopeVal: '日',
                        dateType: 4,
                        dateValue: [new Date ($_date.getDate (-1))],
                      });
                    }}
                  >
                    日
                  </p>
                  <p
                    className={`scope-item ${this.state.historyScopeVal === '周' ? 'active' : ''}`}
                    onClick={() => {
                      let selectPreRange = getWeekDays (
                        getWeekRange (
                          new Date ().setDate (new Date ().getDate () - 7)
                        ).from
                      );
                      this.setState ({
                        historyScopeVal: '周',
                        dateValue: [selectPreRange[0], selectPreRange[6]],
                        dateType: 5,
                      });
                    }}
                  >
                    周
                  </p>
                  <p
                    className={`scope-item ${this.state.historyScopeVal === '月' ? 'active' : ''}`}
                    onClick={() => {
                      //判断一月的上个月
                      let preMonthDay = new Date (
                        new Date ().getMonth () !== 0
                          ? new Date ().getFullYear ()
                          : new Date ().getFullYear () - 1,
                        new Date ().getMonth () !== 0
                          ? new Date ().getMonth () - 1
                          : 11,
                        1
                      );
                      this.monthSelectChange (preMonthDay);
                      this.setState ({
                        historyScopeVal: '月',
                        dateType: 6,
                      });
                    }}
                  >
                    月
                  </p>
                </div>
                <div className="calendar-content">
                  {this.state.historyScopeVal === '日'
                    ? <DayTypeTemp
                        value={new Date ($_date.getDate (-1))}
                        maxDayRangeSelected={this.state.maxDayRangeSelected}
                        maxDate={new Date ($_date.getDate (0))}
                        endValue={new Date ($_date.getDate (0))}
                        onChange={res => {
                          this.setState ({
                            dateValue: res,
                            dateType: 4,
                          });
                        }}
                      />
                    : null}
                  {this.state.historyScopeVal === '周'
                    ? <XWeekPicker
                        type={this.state.type}
                        value={[new Date ($_date.getDate (-8))]}
                        maxDayWeekSelected={this.state.maxDayWeekSelected}
                        endValue={new Date ($_date.getDate (-1))}
                        onChange={res => {
                          this.setState ({
                            dateValue: [res[0], res[1]],
                            dateType: 5,
                          });
                        }}
                      />
                    : null}
                  {this.state.historyScopeVal === '月'
                    ? <BMonthPicker
                        value={this.state.dateValue[0]}
                        type={this.state.type}
                        onChange={::this.monthSelectChange}
                      />
                    : null}
                </div>

              </div>
            : <div
                className="timepicker-content"
                onClick={e => {
                  e.nativeEvent.stopImmediatePropagation ();
                }}
              >
                <div className="content-item">近期</div>
                <div className="content-item quick-select">
                  {this.props.todayNotAllow
                    ? <span className={`select-item not-allowed`}>今日</span>
                    : <span
                        className={`select-item ${formatDate (dateValue[0]) === $_date.getDate (0) ? 'active' : null}`}
                        onClick={this.quickSelectFn.bind (this, 0, 1)}
                      >
                        今日
                      </span>}
                  {/*<span*/}
                  {/*className={`select-item ${formatDate(dateValue[0]) === $_date.getDate(0) ? 'active' : null}`}*/}
                  {/*onClick={this.quickSelectFn.bind(this, 0, 1)}>今日</span>*/}
                  <span
                    className={`select-item ${formatDate (dateValue[0]) + '至' + formatDate (dateValue[1]) === $_date.getDate (-7) + '至' + $_date.getDate (-1) ? 'active' : null}`}
                    onClick={this.quickSelectFn.bind (this, -7, 2)}
                  >
                    近7天
                  </span>
                  <span
                    className={`select-item ${formatDate (dateValue[0]) + '至' + formatDate (dateValue[1]) === $_date.getDate (-30) + '至' + $_date.getDate (-1) ? 'active' : null}`}
                    onClick={this.quickSelectFn.bind (this, -30, 3)}
                  >
                    近30天
                  </span>
                </div>
                <div className="content-item">历史</div>
                <div
                  className="content-item picker-input"
                  onClick={e => {
                    e.nativeEvent.stopImmediatePropagation ();
                    this.setState ({
                      isShowDayPicker: true,
                      dateValue: [new Date ($_date.getDate (-1))],
                      dateType: 4,
                    });
                  }}
                >
                  {displayValue}
                </div>
              </div>}
          <div className="timepicker-footer">
            <XButton
              size="sm"
              className="operate-btn"
              onClick={() => {
                this.setState ({
                  isShowDayPicker: false,
                  historyScopeVal: '日',
                  hoverRange: undefined,
                  selectMonth: '',
                  month: new Date (this.props.value[0]) ||
                    new Date ($_date.getDate (0)),
                });
                this.props.onChange (
                  this.state.dateValue,
                  this.state.dateWords,
                  this.state.dateType
                );
              }}
              type={'primary'}
            >
              确定
            </XButton>
            <XButton
              size="sm"
              onClick={() => {
                this.setState ({
                  isShowDayPicker: false,
                  dateValue: this.props.value.length > 0
                    ? this.props.value
                    : [],
                  historyScopeVal: '日',
                  hoverRange: undefined,
                  selectMonth: '',
                  month: new Date (this.props.value[0]) ||
                    new Date ($_date.getDate (0)),
                });
              }}
            >
              取消
            </XButton>
          </div>
        </XToggle.Box>
      </XToggle>
    );
  }
}
