import FakeApi from '../communication/FakeApi';
import { ActionTypes, LoadingStatus } from '../constants';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import {
  getBinnedOrderBooksByBettingMarkets,
} from './utilities'

class BettingMarketGroupPagePrivateActions {
  
  static setLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_PAGE_SET_LOADING_STATUS,
      loadingStatus
    }
  }

  static setDataAction(bettingMarketGroup, bettingMarkets, binnedOrderBooks) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_PAGE_SET_DATA,
      bettingMarketGroup,
      bettingMarkets,
      binnedOrderBooks,
    }
  }

}

class BettingMarketGroupPageActions {

  static getData(bettingMktGrpId) {
    return (dispatch) => {
      dispatch(BettingMarketGroupPagePrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));

      let bettingMarketGroup;
      let bettingMarkets = [];
      let binnedOrderBooks = [];

      // get related betting market group object
      FakeApi.getObjects([bettingMktGrpId]).then((bettingMarketGroups) => {

        dispatch(BettingMarketGroupActions.addBettingMarketGroupsAction(bettingMarketGroups));

        bettingMarketGroup = bettingMarketGroups[0]
        // get related betting markets objects
        return FakeApi.getObjects(bettingMarketGroup.get('betting_market_ids').toJS());

      }).then((bettingMarketsObjects) => {

        dispatch(BettingMarketActions.addBettingMarketsAction(bettingMarketsObjects));

        bettingMarkets = bettingMarketsObjects
        // get related binned order books objects
        return getBinnedOrderBooksByBettingMarkets(bettingMarkets);

      }).then((result) => {

        binnedOrderBooks =  result.map((market) => market[0])

        // Stored all retrieve data in the EventGroupPage state in Redux store
        dispatch(BettingMarketGroupPagePrivateActions.setDataAction(
          bettingMarketGroup,
          bettingMarkets,
          binnedOrderBooks
        ));

        // Finish loading (TODO: Are we sure this is really the last action dispatched?)
        dispatch(BettingMarketGroupPagePrivateActions.setLoadingStatusAction(LoadingStatus.DONE));
      });
    }
  }

}

export default BettingMarketGroupPageActions;
