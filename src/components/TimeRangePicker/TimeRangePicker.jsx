/**
 * This component generates the search filter controls as well as the 'Search' and 'Export' buttons
 * It uses 'antd' Select and DatePicker controls to generate
 * the 'Period' dropdown and 'From and To date' fields respectively
 * Constants used in this component are defined in 'TimeRangePeriodTypes'
 * This component is used in the following 2 components:
 *   {@link TransactionHistory}
 *   {@link ResolvedBets}
 */
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

  /**
   * Called when the 'Search' button is clicked
   * All selected filter option data and the result data are saved in their respective stores
   * and displayed on the transaction history or resolved bets table
   *
   * @param {object} e - The 'Search' button click event
   */
  onSearchClick(e) {
    e.preventDefault();
    this.props.onSearchClick(this.state.periodType, this.state.customTimeRangeStartDate, this.state.customTimeRangeEndDate);
    this.setState({ disableExportButton: false });
  }

  /**
   * Called when the 'Export' button is clicked
   * All selected filter option data and the result data are saved in their respective stores
   * and made ready to be exported to an excel file, which will be downloaded
   *
   * @param {object} e - The 'Export' button click event
   */
  onExportClick(e) {
    e.preventDefault();
    this.props.onExportClick(this.state.periodType, this.state.customTimeRangeStartDate, this.state.customTimeRangeEndDate);
  }

  /**
   * This function is bound to the 'onChange' callback function of the 'From Date' datepicker control (antd)
   * It will be called everytime the 'from' date value is changed
   * It tracks the selected 'from' date
   *
   * @param {string} customTimeRangeStartDate - The selected 'From' Date
   */
  onCustomTimeRangePickerStartDateChange(customTimeRangeStartDate) {
    // Get start of day
    customTimeRangeStartDate = customTimeRangeStartDate.startOf('day');
    this.setState({ customTimeRangeStartDate, disableExportButton: true });
    // Call callback
    this.props.onPeriodChange(this.state.periodType, customTimeRangeStartDate, this.state.customTimeRangeEndDate);
  }

  /**
   * This function is bound to the 'onChange' callback function of the 'To Date' datepicker control (antd)
   * It will be called everytime the 'To' date value is changed
   * It tracks the selected 'To' date
   *
   * @param {string} customTimeRangeEndDate - The selected 'To' Date
   */
  onCustomTimeRangePickerEndDateChange(customTimeRangeEndDate) {
    // Get end of day
    customTimeRangeEndDate = customTimeRangeEndDate.endOf('day');
    this.setState({ customTimeRangeEndDate, disableExportButton: true });
    // Call callback
    this.props.onPeriodChange(this.state.periodType, this.state.customTimeRangeStartDate, customTimeRangeEndDate);
  }

  /**
   * This function is bound to the 'onChange' callback function of the 'Period' dropdown control (antd)
   * It will be called everytime the period type is changed
   * It tracks the selected period type
   *
   * @param {string} periodType - The selected period type
   */
  onChange(periodType) {
    this.setState({ periodType, customTimeRangeStartDate: null, endDate: null, disableExportButton: true });
    // Call callback
    this.props.onPeriodChange(periodType, null, null);
  }

  /**
   * This function renders 'antd' datepicker controls for From and To dates
   * when the 'Custom' period type is selected.
   * It performs validations to disable out of range dates for 'From' and 'To' dates :
   *   If the 'From' Date is selected :
   *    all dates before the selected 'From' date will be disabled in 'To' date control
   *   If the 'To' Date is selected :
   *    all dates after the selected 'To' date will be disabled in 'From' date controm
   * The format of the dates selected would be in 'YYYY-MM-DD' format
   */
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
                className={ 'btn ' + (disableButton ? 'btn-disabled':' btn-regular') }
                disabled={ disableButton }
                onClick={ this.onSearchClick }>
                { I18n.t('application.search') }
              </button>
              <button
                className={ 'btn ' +
                  (disableButton ? 'btn-disabled':' btn-regular') + ' margin-left-10' }
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
