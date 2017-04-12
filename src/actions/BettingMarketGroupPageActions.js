import { ActionTypes, LoadingStatus } from '../constants';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import EventActions from './EventActions';
import BinnedOrderBookActions from './BinnedOrderBookActions';
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
      type: ActionTypes.EVENT_GROUP_PAGE_SET_ERROR,
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
        // get related betting markets objects and event object
        return Promise.all([
          dispatch(EventActions.getEventsByIds([eventId])),
          dispatch(BettingMarketActions.getBettingMarketsByIds(bettingMarketIds))
        ]);
      }).then((result) => {
        const bettingMarkets = result[1];
        const bettingMarketIds = bettingMarkets.map( bettingMarket => bettingMarket.get('id'));
        return dispatch(BinnedOrderBookActions.getBinnedOrderBooksByBettingMarketIds(bettingMarketIds));
      }).then((binnedOrderBooksByBettingMarketId) => {
        dispatch(BettingMarketGroupPagePrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
      }).catch((error) => {
        log.error('Betting market group page get data error', error);
        dispatch(BettingMarketGroupPagePrivateActions.setErrorAction(error));
      });
    }
  }

}

export default BettingMarketGroupPageActions;
