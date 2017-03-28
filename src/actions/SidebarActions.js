import { ActionTypes } from '../constants';
import FakeApi from '../communication/FakeApi';
import SportActions from './SportActions';
import EventGroupActions from './EventGroupActions';
import EventActions from './EventActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import _ from 'lodash';
import { getBettingMarketGroupsByEvents } from './utilities';
import Immutable from 'immutable';

class SidebarActions{

  static getData() {
    return (dispatch) => {

      // First get list of sports
      FakeApi.getSports().then((sports) => {
        dispatch(SportActions.addSportsAction(sports))
        const eventGroupIds = _.flatMap(sports, (sport) => sport.get('event_group_ids').toJS());
        // Get all event groups for all sports
        return FakeApi.getObjects(eventGroupIds);

        // get related event groups
      }).then((eventGroups) => {
        dispatch(EventGroupActions.addEventGroupsAction(eventGroups));
        return Promise.all(eventGroups.map((group) => FakeApi.getEvents(group.get('sport_id'))));

        // get related events
      }).then((result) => {
        const events = _.flatMap(result);
        // Store events inside redux store
        dispatch(EventActions.addEventsAction(events));
        return getBettingMarketGroupsByEvents(events);

        // get related betting market groups
      }).then((result) => {
        const bettingMktGroups = _.flatMap(result);
        dispatch(BettingMarketGroupActions.addBettingMarketGroupsAction(bettingMktGroups));
        // TODO: There may be a synchronization problem here
        // TODO: This should be done in mapStateToProps of the Sidebar
        dispatch(SidebarActions.setTreeForSidebar());
      });

    };
  }


  // TODO: Should move the bulk of this logic to the mapStateToProps in Sidebar
  static setTreeForSidebar(){

    return (dispatch, getState) => {
      const sportsById = getState().getIn(['sport', 'sportsById']);
      const eventGroupsById = getState().getIn(['eventGroup', 'eventGroupsById']);
      const eventsById = getState().getIn(['event', 'eventsById']);
      const bettingMarketGroupsById = getState().getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);

      const eventGroupsList = Immutable.List(eventGroupsById.values());
      const eventList = Immutable.List(eventsById.values());
      const bettingMktGroupList = Immutable.List(bettingMarketGroupsById.values());

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

      sportsById.forEach((sport) => {

        let sportNode = {};

        sportNode.name = sport.get('name');
        sportNode.id = sport.get('id');
        sportNode.isOpen = false;
        sportNode.customComponent = "Sport";
        sportNode.objectId = sport.get('id');

        sportNode.children = [];


        const targetEventGroups = eventGroupsList.filter(function(metric) {
          return metric.get('sport_id') === sport.get('id');
        })
        _.forEach(targetEventGroups.toJS(), (eventGroup) => {

          let eventGroupNode = {};
          eventGroupNode.name = eventGroup.name;
          eventGroupNode.id = eventGroup.id;
          eventGroupNode.isOpen = false;
          eventGroupNode.customComponent = "EventGroup";
          eventGroupNode.objectId = eventGroup.id;
          eventGroupNode.children = [];

          const targetEvents = eventList.filter(function(metric) {
            return metric.get('event_group_id') === eventGroupNode.id;
          })
          _.forEach(targetEvents.toJS(), (event) => {

            let eventNode = {};
            eventNode.name = event.name;
            eventNode.id = event.id;
            eventNode.isOpen = false;
            eventNode.customComponent = "Event";
            eventNode.objectId = event.id;
            eventNode.children = [];

            const targetBettingMktGps = bettingMktGroupList.filter(function(metric) {
              return metric.get('event_id') === eventNode.id;
            })
            _.forEach(targetBettingMktGps.toJS(), (mktGroup) => {

              let mktGroupNode = {};
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
