import FakeApi from '../communication/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';
import SportActions from './SportActions';
import EventActions from './EventActions';
import SidebarActions from './SidebarActions';

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


  static setDataForSidebar(){

    return (dispatch, getState) => {
      const {sports} = getState().sport;
      const {eventGroups} = getState().eventGroup;
      //
      //
      //
      //
      //

      let completeTree = []
      completeTree.push({
        name: "ALL SPORTS", /*require for menu lib */
        id: "0", /*require for menu lib */
        isOpen: false, /*optional for menu lib */
        isSelected: false, /*optional for node component  */
        customComponent: "Sport",  /*require for custom component*/
        objectId: "0",
        children: []  /*require for TreeUtil.js*/
      });
      _.forEach(sports, (sport) => {

        var sportNode = {};

        sportNode.name = sport.name;
        sportNode.id = sport.id;
        sportNode.isOpen = false;
        sportNode.customComponent = "Sport";
        sportNode.objectId = sport.id;
        sportNode.children = [];

        console.log('sportNode: ', sportNode);
        completeTree.push(sportNode);
      });

      console.log('completeTree: ', completeTree);


      dispatch(SidebarActions.treeUpdate(completeTree));
    }
  }
    // return (dispatch) => {
    //   // dispatch(HomePrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));
    //
    //   let events = [];
    //   // First get list of sports
    //   FakeApi.getSports().then((sports) => {
    //     // Store sports inside redux store
    //     dispatch(SportActions.addSportsAction(sports))
    //
    //     // Create promise to get events for each sports
    //     let getEventsPromiseArray = [];
    //     _.forEach(sports, (sport) => {
    //       const getEventsPromise = FakeApi.getEvents(sport.id);
    //       getEventsPromiseArray.push(getEventsPromise);
    //     });
    //
    //     // Call the promise together
    //     return Promise.all(getEventsPromiseArray);
    //   }).then((result) => {
    //     // Store the final events id inside Home Redux store
    //     dispatch(HomePrivateActions.addEventIdsAction(eventIds));
    //   });
    //
    //
  // }
  static getDataForSidebar() {
    return (dispatch) => {
      // dispatch(HomePrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));

      let events = [];
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
        console.log('resultttt', result);
        // Combine the resulting events
        _.forEach(result, (retrievedEvents) => {
          events = _.concat(events, retrievedEvents);
        });
        console.log('eventss', events);
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
        let bettingMarketGroups = [];
        _.forEach(result, (retrievedBettingMarketGroups) => {
          console.log(" retrievedBettingMarketGroups " + retrievedBettingMarketGroups);

          bettingMarketGroups.concat(retrievedBettingMarketGroups);
        });
        // Store betting market groups inside redux store
        console.log(" bettingMarketGroups " + bettingMarketGroups);

        dispatch(BettingMarketGroupActions.addBettingMarketGroupsAction(bettingMarketGroups));
        // TODO: to be continued with getting order
      }).then(() => {
        // Store the final events id inside Home Redux store
        const eventIds = _.map(events, 'id');
        // dispatch(HomePrivateActions.addEventIdsAction(eventIds));
        dispatch(HomeActions.setDataForSidebar());

      });

    };
  }
  static getData() {
    return (dispatch) => {
      // dispatch(HomePrivateActions.setLoadingStatusAction(LoadingStatus.LOADING));

      let events = [];
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
          events = _.concat(events, retrievedEvents);
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
        let bettingMarketGroups = [];
        _.forEach(result, (retrievedBettingMarketGroups) => {
          console.log(" retrievedBettingMarketGroups " + retrievedBettingMarketGroups);

          bettingMarketGroups.concat(retrievedBettingMarketGroups);
        });
        // Store betting market groups inside redux store
        console.log(" bettingMarketGroups " + bettingMarketGroups);

        dispatch(BettingMarketGroupActions.addBettingMarketGroupsAction(bettingMarketGroups));
        // TODO: to be continued with getting order
      }).then(() => {
        // Store the final events id inside Home Redux store
        const eventIds = _.map(events, 'id');
        // dispatch(HomePrivateActions.addEventIdsAction(eventIds));
        dispatch(HomeActions.setDataForSidebar());

      });

    };
  }
}

export default HomeActions;
