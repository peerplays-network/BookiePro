import { ActionTypes, LoadingStatus } from '../constants';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import EventActions from './EventActions';
import BinnedOrderBookActions from './BinnedOrderBookActions';
import LiquidityActions from './LiquidityActions';
import log from 'loglevel';

class BettingMarketGroupPagePrivateActions {

  static setLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_PAGE_SET_LOADING_STATUS,
      loadingStatus
    }
  }

  static setErrorAction(error) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_PAGE_SET_ERROR,
      error
    }
  }

}

class BettingMarketGroupPageActions {

  static getData(bettingMktGrpId) {
    return (dispatch) => {
      dispatch(BettingMarketGroupPagePrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));

      // get related betting market group object
      dispatch(BettingMarketGroupActions.getBettingMarketGroupsByIds([bettingMktGrpId])).then((bettingMarketGroups) => {
        const bettingMarketGroup = bettingMarketGroups.get(0);
        const bettingMarketIds = bettingMarketGroup.get('betting_market_ids');
        const eventId = bettingMarketGroup.get('event_id');
        // get related betting markets objects, event object, and total matched bets in parallel (since they are mutually exclusive)
        return Promise.all([
          dispatch(BettingMarketActions.getBettingMarketsByIds(bettingMarketIds)),
          dispatch(EventActions.getEventsByIds([eventId])),
          dispatch(LiquidityActions.getTotalMatchedBetsByBettingMarketGroupIds([bettingMktGrpId]))
        ]);
      }).then((result) => {
        const bettingMarkets = result[0];
        const bettingMarketIds = bettingMarkets.map( bettingMarket => bettingMarket.get('id'));
        // Get binned order books
        return dispatch(BinnedOrderBookActions.getBinnedOrderBooksByBettingMarketIds(bettingMarketIds));
      }).then(() => {
        // Set status to done
        dispatch(BettingMarketGroupPagePrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Betting market group page get data error', error);
        dispatch(BettingMarketGroupPagePrivateActions.setErrorAction(error));
      });
    }
  }

}

export default BettingMarketGroupPageActions;
