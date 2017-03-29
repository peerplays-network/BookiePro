import { ActionTypes } from '../constants';

class QuickBetDrawerActions {
  static create_bet(event_id, bet_type, odds) {
    console.log('QuickBetDrawerActions create_bet', event_id, bet_type, odds);
  }
}

export default QuickBetDrawerActions;
