import _ from 'lodash';
import Immutable from 'immutable';

const histories =  [
];

const immutableHistories = _.map(histories, history => Immutable.fromJS(history));
export default immutableHistories;
