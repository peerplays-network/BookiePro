import Immutable from 'immutable';

const globalBettingStatistics = {
  id: '1.107.0',
  total_amount_staked: {
    '1.3.100': 10000,
    '1.3.101': 1000,
    '1.3.102': 200
  },
  number_of_active_events: 5
};

export default Immutable.fromJS(globalBettingStatistics);
