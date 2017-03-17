import { ActionTypes } from '../constants';
import FakeApi from '../communication/FakeApi';
import SportActions from './SportActions';
import EventGroupActions from './EventGroupActions';
import EventActions from './EventActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import _ from 'lodash';
import Immutable from 'immutable';


class SidebarActions{

  static getData() {
    return (dispatch) => {

      // First get list of sports
      FakeApi.getSports().then((sports) => {

        dispatch(SportActions.addSportsAction(sports))

        const getEventsGpPromiseArray = [];
        _.forEach(sports, (sport) => {
          const eventGpPromise = FakeApi.getEventGroups(sport.id);
          getEventsGpPromiseArray.push(eventGpPromise);
        });

        return Promise.all(getEventsGpPromiseArray);

        // get related event groups
      }).then((eventGroups) => {

        const eventGpArray = [];
        _.forEach(eventGroups, (items) => {

          //NOTE to be fine tune later to move dispatch out of the loop
          dispatch(EventGroupActions.addEventGroupsAction(items));

          _.forEach(items, (item) => {
            eventGpArray.push(item);
          });
        });

        const getEventsPromiseArray = [];
        _.forEach(eventGpArray, (eventGp) => {
          const eventGpPromise = FakeApi.getEvents(eventGp.sport_id);
          getEventsPromiseArray.push(eventGpPromise);
        });

        return Promise.all(getEventsPromiseArray);

        // get related events
      }).then((eventResults) => {

        var mkGroupIds = Immutable.List([]);
        _.forEach(eventResults, (items) => {

          //NOTE to be fine tune later to move dispatch out of the loop
          dispatch(EventActions.addEventsAction(items));

          _.forEach(items, (item) => {
            // get related betting market groups

            const newGroupIds = Immutable.List(item.betting_market_group_ids);
            mkGroupIds = mkGroupIds.toSet().union(newGroupIds.toSet()).toList();
          });
        });

        return FakeApi.getObjects(mkGroupIds.toJS());

        // get related betting market groups
      }).then((bettingMktGroups) => {

        dispatch(BettingMarketGroupActions.addBettingMarketGroupsAction(bettingMktGroups));

      }).then((events) => {
        // Store the final events id inside Home Redux store
        dispatch(SidebarActions.setTreeForSidebar());
      });

    };
  }


  static setTreeForSidebar(){

    return (dispatch, getState) => {
      const {sports} = getState().sport;
      const {eventGroups} = getState().eventGroup;
      const {events} = getState().event;
      const {bettingMarketGroups} = getState().bettingMarketGroup;

      const { List } = require('immutable')
      const eventGroupsList = List(eventGroups);
      const eventList = List(events);
      const bettingMktGroupList = List(bettingMarketGroups);

      let completeTree = []

      //add hard code header "all sports"
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


        const targetEventGroups = eventGroupsList.filter(function(metric) {
          return metric.sport_id === sport.id;
        })

        _.forEach(targetEventGroups.toJS(), (eventGroup) => {

          var eventGroupNode = {};
          eventGroupNode.name = eventGroup.name;
          eventGroupNode.id = eventGroup.id;
          eventGroupNode.isOpen = false;
          eventGroupNode.customComponent = "EventGroup";
          eventGroupNode.objectId = eventGroup.id;
          eventGroupNode.children = [];

          const targetEvents = eventList.filter(function(metric) {
            return metric.event_group_id === eventGroupNode.id;
          })

          _.forEach(targetEvents.toJS(), (event) => {

            var eventNode = {};
            eventNode.name = event.name;
            eventNode.id = event.id;
            eventNode.isOpen = false;
            eventNode.customComponent = "Event";
            eventNode.objectId = event.id;
            eventNode.children = [];

            const targetBettingMktGps = bettingMktGroupList.filter(function(metric) {
              return metric.event_id === eventNode.id;
            })

            _.forEach(targetBettingMktGps.toJS(), (mktGroup) => {

              var mktGroupNode = {};
              mktGroupNode.name = mktGroup.market_type_id;
              mktGroupNode.id = mktGroup.id;
              mktGroupNode.isOpen = false;
              mktGroupNode.customComponent = "BettingMarketGroup";
              mktGroupNode.objectId = mktGroup.id;
              mktGroupNode.children = [];

              eventNode.children.push(mktGroupNode);

            })

            eventGroupNode.children.push(eventNode);

          })

          sportNode.children.push(eventGroupNode);
        });

        completeTree.push(sportNode);
      });

      dispatch(SidebarActions.updateTree(completeTree));
    }
  }

  static updateTree(complete_tree) {
    return {
      type: ActionTypes.SIDEBAR_UPDATE_COMPLETE_TREE,
      complete_tree
    }
  }

}

export default SidebarActions;
