import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import { Select, DatePicker } from 'antd';
import { TimeRangePeriodTypes } from '../../constants';
const Option = Select.Option;

class TimeRangePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      periodType: TimeRangePeriodTypes.LAST_7_DAYS,
      customTimeRangeStartDate: null,
      customTimeRangeEndDate: null,
      disableExportButton: false
    }
    this.onChange = this.onChange.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onExportClick = this.onExportClick.bind(this);
    this.renderCustomTimeRangePicker = this.renderCustomTimeRangePicker.bind(this);
    this.onCustomTimeRangePickerStartDateChange = this.onCustomTimeRangePickerStartDateChange.bind(this);
    this.onCustomTimeRangePickerEndDateChange = this.onCustomTimeRangePickerEndDateChange.bind(this);
  }

  onSearchClick(e) {
    e.preventDefault();
    this.props.onSearchClick(this.state.periodType, this.state.customTimeRangeStartDate, this.state.customTimeRangeEndDate);
    this.setState({ disableExportButton: false });
  }

  onExportClick(e) {
    e.preventDefault();
    this.props.onExportClick(this.state.periodType, this.state.customTimeRangeStartDate, this.state.customTimeRangeEndDate);
  }


  onCustomTimeRangePickerStartDateChange(customTimeRangeStartDate) {
    // Get start of day
    customTimeRangeStartDate = customTimeRangeStartDate.startOf('day');
    this.setState({ customTimeRangeStartDate, disableExportButton: true });
    // Call callback
    this.props.onPeriodChange(this.state.periodType, customTimeRangeStartDate, this.state.customTimeRangeEndDate);
  }

  onCustomTimeRangePickerEndDateChange(customTimeRangeEndDate) {
    // Get end of day
    customTimeRangeEndDate = customTimeRangeEndDate.endOf('day');
    this.setState({ customTimeRangeEndDate, disableExportButton: true });
    // Call callback
    this.props.onPeriodChange(this.state.periodType, this.state.customTimeRangeStartDate, customTimeRangeEndDate);
  }

  onChange(periodType) {
    this.setState({ periodType, customTimeRangeStartDate: null, endDate: null, disableExportButton: true });
    // Call callback
    this.props.onPeriodChange(periodType, null, null);
  }

  renderCustomTimeRangePicker() {
    // Only shows when period type is custom
    if (this.state.periodType === TimeRangePeriodTypes.CUSTOM) {
      //Disable out of range dates for 'From Date'
      const disabledStartDate = (date) => {
        const endDate = this.state.customTimeRangeEndDate;
        if (!date || !endDate) {
          return false;
        }
        return date.valueOf() > endDate.valueOf();
      }

      //Disable out of range dates for 'To Date'
      const disabledEndDate = (date) => {
        const startDate = this.state.customTimeRangeStartDate;
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
    const disableButton = (this.state.periodType === TimeRangePeriodTypes.CUSTOM)
                            && (!this.state.customTimeRangeStartDate || !this.state.customTimeRangeEndDate);
    return (
      <div className='filter'>
        <div className='ant-form-inline'>
          <div className='ant-form-item' >
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
            <div className='ant-form-item'>
              <button
                className={ 'btn ' + (disableButton ? 'btn-regular-disabled':' btn-regular') }
                disabled={ disableButton }
                onClick={ this.onSearchClick }>
                { I18n.t('application.search') }
              </button>
              <button
                className={ 'btn ' +
                  (disableButton ? 'btn-regular-disabled':' btn-regular') + ' margin-left-10' }
                  disabled={ disableButton }
                onClick={ this.onExportClick }>
                { I18n.t('application.export') }
              </button>
            </div>
          </div>
        </div>
      </div>


    )
  }
}

TimeRangePicker.propTypes = {
  onSearchClick: PropTypes.func,
  onExportClick: PropTypes.func,
  onPeriodChange: PropTypes.func,
  searchResultsCount: PropTypes.number,
}

TimeRangePicker.defaultProps = {
  onSearchClick: () => {},
  onExportClick: () => {},
  onPeriodChange: () => {},
  searchResultsCount: 0,
}

export default TimeRangePicker;
