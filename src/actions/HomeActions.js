import FakeApi from '../communication/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';
import SportActions from './SportActions';
import EventActions from './EventActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import _ from 'lodash';

/**
 * Private actions
 */
class HomePrivateActions {
  static setLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.HOME_SET_LOADING_STATUS,
      loadingStatus
    }
  }

  static addEventIdsAction(eventIds) {
    return {
      type: ActionTypes.HOME_ADD_EVENT_IDS,
      eventIds
    }
  }
}

/**
 * Public actions
 */
class HomeActions {
  static getData() {
    return (dispatch) => {
      dispatch(HomePrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));

      const events = [];
      // First get list of sports
      FakeApi.getSports().then((sports) => {
        // Store sports inside redux store
        dispatch(SportActions.addSportsAction(sports))

        // Create promise to get events for each sports
        let getEventsPromiseArray = [];
        _.forEach(sports, (sport) => {
          const getEventsPromise = FakeApi.getEvents(sport.id);
          getEventsPromiseArray.push(getEventsPromise);
        });

        // Call the promise together
        return Promise.all(getEventsPromiseArray);
      }).then((result) => {
        // Combine the resulting events
        _.forEach(result, (retrievedEvents) => {
          events.concat(retrievedEvents);
        });
        // Store events inside redux store
        dispatch(EventActions.addEventsAction(events));

        // Create promise to get betting market group for each events
        let getBettingMarketGroupPromiseArray = [];
        _.forEach(events, (event) => {
          const getBettingMarketGroupPromise = FakeApi.getObjects(event.betting_market_group_ids);
          getBettingMarketGroupPromiseArray.push(getBettingMarketGroupPromise);
        });

        // Call the promise together
        return Promise.all(getBettingMarketGroupPromiseArray);
      }).then((result) => {
        // Combine the resulting betting market groups
        const bettingMarketGroups = [];
        _.forEach(result, (retrievedBettingMarketGroups) => {
          // NOTE : need to update bettingMarketGroups when using concat
          // bettingMarketGroups = bettingMarketGroups.concat(retrievedBettingMarketGroups);
          bettingMarketGroups.concat(retrievedBettingMarketGroups);
        });
        // Store betting market groups inside redux store
        dispatch(BettingMarketGroupActions.addBettingMarketGroupsAction(bettingMarketGroups));
        // TODO: to be continued with getting order
      }).then(() => {
        // Store the final events id inside Home Redux store
        const eventIds = _.map(events, 'id');
        dispatch(HomePrivateActions.addEventIdsAction(eventIds));
      });

    };
  }
}

export default SportActions;
