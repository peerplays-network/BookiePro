import { ActionTypes } from '../constants';
import Immutable from 'immutable';

class MarketDrawerPrivateActions {
  static addUnconfirmedBet(bet) {
    return {
      type: ActionTypes.MARKET_DRAWER_ADD_UNCONFIRMED_BET,
      bet
    };
  }
}

class MarketDrawerActions {
  static createBet(record, team, marketType, offer) {
    return (dispatch) => {
      const bet = Immutable.fromJS({
        event_id: record.get('id'),
        event_name: record.get('name'),
        team_name: team,
        market_type: marketType,
        offer: offer
      });
      dispatch(MarketDrawerPrivateActions.addUnconfirmedBet(bet));
    };
  }
}

export default MarketDrawerActions;
