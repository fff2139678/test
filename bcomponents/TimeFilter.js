/**
 * name:
 * desc:
 * date: 2018/8/28
 * author: kelvin
 */
import React from 'react';
import {BTimePicker} from 'bcomponents';
import {$_date} from 'services';

export default class TimeFilter extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      type: props.type,
      date: [new Date ($_date.getDate (-7)), new Date ($_date.getDate (-1))],
    };
  }

  render () {
    return (
      <div className="time-filter filter-item">
        <BTimePicker
          value={this.state.date}
          type={this.state.type}
          maxDate={new Date ()}
          minDate={'2017/08/08'}
          type={this.props.type}
          maxDayRangeSelected={this.props.maxDayRangeSelected}
          maxDayWeekSelected={this.props.maxDayWeekSelected}
          todayNotAllow={this.props.todayNotAllow}
          onChange={(res, words, type) => {
            this.props.onChange (res, type);
            this.setState ({date: res});
          }}
        />
      </div>
    );
  }
}
