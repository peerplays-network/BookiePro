import {ActionTypes, LoadingStatus} from '../constants';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import EventActions from './EventActions';
import BinnedOrderBookActions from './BinnedOrderBookActions';
import MarketDrawerActions from './MarketDrawerActions';
import LiquidityActions from './LiquidityActions';
import RuleActions from './RuleActions';
import log from 'loglevel';

class BettingMarketGroupPagePrivateActions {
  static setLoadingStatusAction(bettingMarketGroupId, loadingStatus) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_PAGE_SET_LOADING_STATUS,
      bettingMarketGroupId,
      loadingStatus
    };
  }

  static setErrorAction(bettingMarketGroupId, error) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_PAGE_SET_ERROR,
      bettingMarketGroupId,
      error
    };
  }

  static setWidgetTitle(title) {
    return {
      type: ActionTypes.BETTING_MARKET_GROUP_PAGE_SET_WIDGET_TITLE,
      title
    };
  }
}

class BettingMarketGroupPageActions {
  static getData(bettingMktGrpId) {
    return dispatch => {
      dispatch(
        BettingMarketGroupPagePrivateActions.setLoadingStatusAction(
          bettingMktGrpId,
          LoadingStatus.LOADING
        )
      );

      // get related betting market group object
      dispatch(BettingMarketGroupActions.getBettingMarketGroupsByIds([bettingMktGrpId]))
        .then(bettingMarketGroups => {
          // Get placed bets for market drawer
          dispatch(MarketDrawerActions.getPlacedBets(bettingMktGrpId));

          const bettingMarketGroup = bettingMarketGroups.get(0);
          const eventId = bettingMarketGroup && bettingMarketGroup.get('event_id');
          const ruleId = bettingMarketGroup && bettingMarketGroup.get('rules_id');
          // get related betting markets objects, event object, and total matched bets in 
          // parallel (since they are mutually exclusive)
          return Promise.all([
            dispatch(
              BettingMarketActions.getBettingMarketsByBettingMarketGroupIds([bettingMktGrpId])
            ),
            dispatch(EventActions.getEventsByIds([eventId])),
            dispatch(
              LiquidityActions.getTotalMatchedBetsByBettingMarketGroupIds([bettingMktGrpId])
            ),
            dispatch(RuleActions.getRulesByIds([ruleId])),
            dispatch(
              BettingMarketGroupPagePrivateActions.setWidgetTitle(
                bettingMarketGroup.get('description')
              )
            )
          ]);
        })
        .then(result => {
          const bettingMarkets = result[0];
          const bettingMarketIds = bettingMarkets.map(bettingMarket => bettingMarket.get('id'));
          // Get binned order books
          return dispatch(
            BinnedOrderBookActions.getBinnedOrderBooksByBettingMarketIds(bettingMarketIds)
          );
        })
        .then(() => {
          // Set status to done
          dispatch(
            BettingMarketGroupPagePrivateActions.setLoadingStatusAction(
              bettingMktGrpId,
              LoadingStatus.DONE
            )
          );
        })
        .catch(error => {
          log.error('Betting market group page get data error', bettingMktGrpId, error);
          dispatch(BettingMarketGroupPagePrivateActions.setErrorAction(bettingMktGrpId, error));
        });
    };
  }
}

export default BettingMarketGroupPageActions;
