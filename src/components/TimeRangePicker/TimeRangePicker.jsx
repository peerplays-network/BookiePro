import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Select, DatePicker } from 'antd';
import { TimeRangePeriodTypes } from '../../constants';
const Option = Select.Option;

class TimeRangePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      periodType: TimeRangePeriodTypes.LAST_7_DAYS,
      startDate: moment().subtract(6, 'days'),
      endDate: moment(),
    }
    this.onChange = this.onChange.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.renderCustomTimeRangePicker = this.renderCustomTimeRangePicker.bind(this);
    this.onCustomTimeRangePickerStartDateChange = this.onCustomTimeRangePickerStartDateChange.bind(this);
    this.onCustomTimeRangePickerEndDateChange = this.onCustomTimeRangePickerEndDateChange.bind(this);
  }

  onSearchClick(e) {
    e.preventDefault();
    this.props.onSearchClick(this.state.periodType, this.state.startDate, this.state.endDate);
  }


  onCustomTimeRangePickerStartDateChange(startDate) {
    this.setState({ startDate });
    this.props.onPeriodChange(this.state.periodType, startDate, this.state.endDate);
  }

  onCustomTimeRangePickerEndDateChange(endDate) {
    this.setState({ endDate });
    this.props.onPeriodChange(this.state.periodType, this.state.startDate, endDate);
  }

  onChange(periodType) {
    let startDate, endDate;
    switch(periodType){
      case TimeRangePeriodTypes.LAST_7_DAYS: {
        //Subtract 6 days from the current day
        startDate = moment().subtract(6, 'days');
        endDate = moment();
        break;
      }
      case TimeRangePeriodTypes.LAST_14_DAYS: {
        //Subtract 14 days from the current day
        startDate = moment().subtract(13, 'days');
        endDate = moment();
        break;
      }
      case TimeRangePeriodTypes.THIS_MONTH: {
        //First of the current month, 12:00 am
        startDate = moment().startOf('month');
        endDate = moment();
        break;
      }
      case TimeRangePeriodTypes.LAST_MONTH: {
        //Last month's 1st day
        startDate = moment().subtract(1, 'months').startOf('month');
        //Last month's last day
        endDate = moment().subtract(1, 'months').endOf('month');
        break;
      }
      case TimeRangePeriodTypes.CUSTOM: {
        startDate = null;
        endDate = null;
        break;
      }
      default: break;
    }
    this.setState({ periodType, startDate, endDate });
    // Call callback
    this.props.onPeriodChange(periodType, startDate, endDate);
  }

  renderCustomTimeRangePicker() {
    // Only shows when period type is custom
    if (this.state.periodType === TimeRangePeriodTypes.CUSTOM) {
      //Disable out of range dates for 'From Date'
      const disabledStartDate = (date) => {
        const endDate = this.state.endDate;
        if (!date || !endDate) {
          return false;
        }
        return date.valueOf() > endDate.valueOf();
      }

      //Disable out of range dates for 'To Date'
      const disabledEndDate = (date) => {
        const startDate = this.state.startDate;
        if (!date || !startDate) {
          return false;
        }
        return date.valueOf() <= startDate.valueOf();
      }

      return (
          <div className='ant-form-item'>
            <label><i className='calendar-icon'></i></label>
              <DatePicker
               disabledDate={ disabledStartDate }
               allowClear={ false }
               format='YYYY/MM/DD'
               placeholder='From'
               onChange={ this.onCustomTimeRangePickerStartDateChange } />
              <span className='margin-lr-10 font16'>  - </span>
              <DatePicker
                disabledDate={ disabledEndDate }
                allowClear={ false }
                format='YYYY-MM-DD'
                placeholder='To'
                onChange={ this.onCustomTimeRangePickerEndDateChange }/>
          </div>
      )
    }
  }

  render() {
    const disableSearchAndExportButtons = (this.state.periodType === TimeRangePeriodTypes.CUSTOM) && (!this.state.startDate|| !this.state.endDate);
    return (
        <div className='ant-form-item' style={ { marginRight: '0px' } } >
          <div className='ant-form-item'>
            <label>{ I18n.t('application.period') }</label>
            <Select className='bookie-select' defaultValue={ TimeRangePeriodTypes.LAST_7_DAYS } onChange={ this.onChange }>
              <Option value={ TimeRangePeriodTypes.LAST_7_DAYS }>{ I18n.t('application.last_7_Days') }</Option>
              <Option value={ TimeRangePeriodTypes.LAST_14_DAYS }>{ I18n.t('application.last_14_Days') }</Option>
              <Option value={ TimeRangePeriodTypes.THIS_MONTH }>{ I18n.t('application.this_Month') }</Option>
              <Option value={ TimeRangePeriodTypes.LAST_MONTH }>{ I18n.t('application.last_Month') }</Option>
              <Option value={ TimeRangePeriodTypes.CUSTOM }>{ I18n.t('application.custom') }</Option>
            </Select>
          </div>
          { this.renderCustomTimeRangePicker() }
          <button
            className={ 'btn ' + (disableSearchAndExportButtons ? 'btn-regular-disabled':' btn-regular') }
            disabled={ disableSearchAndExportButtons }
            onClick={ this.onSearchClick }>{ I18n.t('application.search') }</button>
      </div>

    )
  }
}

TimeRangePicker.propTypes = {
  onSearchClick: PropTypes.func,
  onPeriodChange: PropTypes.func,
}

TimeRangePicker.defaultProps = {
  onSearchClick: () => {},
  onPeriodChange: () => {},
}

export default TimeRangePicker;
