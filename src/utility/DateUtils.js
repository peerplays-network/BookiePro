import moment from 'moment';
import {I18n} from 'react-redux-i18n';
import {TimeRangePeriodTypes} from '../constants';

const days = [
  I18n.t('mybets.sun'),
  I18n.t('mybets.mon'),
  I18n.t('mybets.tue'),
  I18n.t('mybets.wed'),
  I18n.t('mybets.thu'),
  I18n.t('mybets.fri'),
  I18n.t('mybets.sat')
];

const DateUtils = {
  /**
   * calculate start date and end date given time range period data
   *
   * @param {date} - dateToFormat, date to be formated, assumed to be in unixformat date
   * @param {boolean} forExport - is the date for export?
   * @returns {string} - formatted string
   */
  getFormattedDate(dateToFormat, forExport=false) {
    if (moment(new Date(dateToFormat)).format('MM-DD-YYYY') === moment().format('MM-DD-YYYY')) {
      return I18n.t('mybets.today') + ', ' + moment(new Date(dateToFormat)).format('HH:mm');
    } else if (
      moment(new Date(dateToFormat)).format('MM-DD-YYYY') ===
      moment()
        .add(1, 'days')
        .format('MM-DD-YYYY')
    ) {
      return I18n.t('mybets.tomorrow') + ', ' + moment(new Date(dateToFormat)).format('HH:mm');
    } else if (
      moment(new Date(dateToFormat)).week() === moment().week() &&
      moment(new Date(dateToFormat)) > moment()
    ) {
      return (
        days[moment(new Date(dateToFormat)).day()] +
        ', ' +
        moment(new Date(dateToFormat)).format('HH:mm')
      );
    } else {
      if (forExport) {
        let full = dateToFormat.toLowerCase().replace('today,', '');
        return moment().format('MM-DD-YYYY') + full;
      } else {
        return moment(new Date(dateToFormat)).format('MM-DD-YYYY HH:mm');
      }
    }
  },
  /**
   *
   *
   * @param {Date} date to convert to local.
   * @returns localized date by pulling the users local timezone.
   */
  getLocalDate(dateToLocalize) {
    var workingDate = dateToLocalize.toString();

    // Ensure the date has been parsed into a date object.
    if (workingDate.indexOf('Z') === -1) {
      workingDate += 'Z';
    }

    return new Date(workingDate);
  },
  /**
   *
   *
   * @param {array} events
   * @returns
   */
  sortEventsByDate(events) {
    let sortedEvents = [];
    // Sort by event time
    sortedEvents = events.sort((a, b) => {
      let timeA = this.getLocalDate(new Date(a.get('time')));
      let timeB = this.getLocalDate(new Date(b.get('time')));

      if (timeA - timeB < 0) {
        return -1;
      }

      if (timeA - timeB > 0) {
        return 1;
      }

      return 0;
    });
    return sortedEvents;
  },

  /*
   * takes a unix time and returns the month and day MMM D
   *  if date === today, then returns "today"
   *
   * @param {date} - date
   * @returns {string} - formatted date
   */
  getMonthAndDay(date) {
    let wrappedDate = moment(date);
    let formatted = wrappedDate.format('MMM D');

    if (
      wrappedDate
        .calendar()
        .toLowerCase()
        .indexOf('today') !== -1
    ) {
      formatted = I18n.t('mybets.today');
    }

    return formatted;
  },

  /**
   * calculate start date and end date given time range period data
   *
   * @param {string} - timeRangePeriodType, defined in constants
   * @returns {object} - time range object, i.e.
   * {
   *  startDate,
   *  endDate
   * }
   */
  getTimeRangeGivenTimeRangePeriodType(timeRangePeriodType) {
    let startDate,
      endDate = null;

    switch (timeRangePeriodType) {
      case TimeRangePeriodTypes.LAST_7_DAYS: {
        //Subtract 6 days from the current day
        startDate = moment()
          .subtract(6, 'days')
          .startOf('day');
        endDate = moment().endOf('day');
        break;
      }

      case TimeRangePeriodTypes.LAST_14_DAYS: {
        //Subtract 14 days from the current day
        startDate = moment()
          .subtract(13, 'days')
          .startOf('day');
        endDate = moment().endOf('day');
        break;
      }

      case TimeRangePeriodTypes.THIS_MONTH: {
        //First of the current month, 12:00 am
        startDate = moment().startOf('month');
        endDate = moment().endOf('month');
        break;
      }

      case TimeRangePeriodTypes.LAST_MONTH: {
        //Last month's 1st day
        startDate = moment()
          .subtract(1, 'months')
          .startOf('month');
        //Last month's last day
        endDate = moment()
          .subtract(1, 'months')
          .endOf('month');
        break;
      }

      case TimeRangePeriodTypes.CUSTOM: {
        startDate = null;
        endDate = null;
        break;
      }

      default:
        break;
    }

    const timeRange = {
      startDate,
      endDate
    };
    return timeRange;
  }
};

export default DateUtils;
