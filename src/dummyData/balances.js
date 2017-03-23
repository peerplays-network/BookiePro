import _ from 'lodash';
import Immutable from 'immutable';

const balances = [
  {
    id: '2.5.44',
    owner: '1.2.44',
    asset_type: '1.3.0',
    balance: 10000000
  }
];

const immutableBalances = _.map(balances, balance => Immutable.fromJS(balance));
export default immutableBalances;
