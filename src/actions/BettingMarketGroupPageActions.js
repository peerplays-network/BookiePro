import FakeApi from '../communication/FakeApi';
import { ActionTypes, LoadingStatus } from '../constants';
import EventActions from './EventActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import BettingMarketActions from './BettingMarketActions';
import _ from 'lodash';
import {
  getBettingMarketGroupsByEvents,
  getBettingMarketsInBettingMarketGroups,
  getBinnedOrderBooksByBettingMarkets,
  groupBinnedOrderBooksByBettingMarketId,
} from './utilities'

class BettingMarketGroupPagePrivateActions {
  static setLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.EVENT_GROUP_PAGE_SET_LOADING_STATUS,// TODO
      loadingStatus
    }
  }

}

class BettingMarketGroupPageActions {
  static getData(bettingMktGrpId) {
    return (dispatch) => {
      dispatch(BettingMarketGroupPagePrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));

      let eventGroup;
      let sport;
      let events = [];
      let bettingMarketGroups = [];
      FakeApi.getObjects([bettingMktGrpId]).then((retrievedObjects) => {
        // Store the resolved event group object in the outer scope variable
        eventGroup = retrievedObjects[0];

        return FakeApi.getObjects([eventGroup.get('sport_id')]);
      }).then((result) => {
        // Store the resolve sport object in the outer scope variable
        sport = result[0];

        return FakeApi.getEvents(eventGroup.get('sport_id'));
      }).then((result) => {
        // Without a proper call to get events by event group, we can only filter the results like this
        events = _.flatMap(result).filter((event) => event.get('event_group_id') === bettingMktGrpId);

        // Store events inside redux store
        dispatch(EventActions.addEventsAction(events));

        return getBettingMarketGroupsByEvents(events);
      }).then((result) => {
        // Combine the resulting betting market groups
        bettingMarketGroups = _.flatMap(result);
        // Store betting market groups inside redux store
        dispatch(BettingMarketGroupActions.addBettingMarketGroupsAction(bettingMarketGroups));

        return getBettingMarketsInBettingMarketGroups(bettingMarketGroups);
      }).then((result) => {
        // Combine the result betting markets
        let bettingMarkets = _.flatMap(result);
        // Store betting markets inside redux store
        dispatch(BettingMarketActions.addBettingMarketsAction(bettingMarkets));

        return getBinnedOrderBooksByBettingMarkets(bettingMarkets);
      }).then((result) => {
        const binnedOrderBooks = groupBinnedOrderBooksByBettingMarketId(_.flatMap(result));

        // Stored all retrieve data in the EventGroupPage state in Redux store
        dispatch(BettingMarketGroupPageActions.setDataAction(
          sport.get('name'),
          eventGroup.get('name'),
          _.map(events, (event) => event.get('id')),    // list of event ids
          binnedOrderBooks
        ));

        // Finish loading (TODO: Are we sure this is really the last action dispatched?)
        dispatch(BettingMarketGroupPageActions.setLoadingStatusAction(LoadingStatus.DONE));
      });
    }
  }

}
export default BettingMarketGroupPageActions;
