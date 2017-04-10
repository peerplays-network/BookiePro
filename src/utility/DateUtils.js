import moment from 'moment';
import { I18n } from 'react-redux-i18n';

var days = [I18n.t('mybets.sun'), I18n.t('mybets.mon'),I18n.t('mybets.tue'), I18n.t('mybets.wed'),
  I18n.t('mybets.thu'),I18n.t('mybets.fri'),I18n.t('mybets.sat')];

//dateToFormat is unixformat date
export function getFormattedDate(dateToFormat){
  if(moment(new Date(dateToFormat)).format("MM-DD-YYYY") === moment().format("MM-DD-YYYY"))
    return I18n.t('mybets.today') + ', ' + moment(new Date(dateToFormat)).format("HH:mm");
  else if(moment(new Date(dateToFormat)).format("MM-DD-YYYY") === moment().add(1, 'days').format("MM-DD-YYYY"))
    return I18n.t('mybets.tomorrow') + ', ' + moment(new Date(dateToFormat)).format("HH:mm");
  else if(moment(new Date(dateToFormat)).week() === moment().week() && moment(new Date(dateToFormat)) > moment())
    return days[moment(new Date(dateToFormat)).day()] + ', ' + moment(new Date(dateToFormat)).format("HH:mm");
  else{
    return moment(new Date(dateToFormat)).format("MM-DD-YYYY HH:mm");
  }
}
