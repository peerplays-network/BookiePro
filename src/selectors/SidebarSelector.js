import { createSelector } from 'reselect';
import CommonSelector from './CommonSelector';
import Immutable from 'immutable';

const {
  getSportsById,
  getEventGroupsById,
  getActiveEventsById,
  getBettingMarketGroupsById,
} = CommonSelector;
import { I18n } from 'react-redux-i18n';
import { LoadingStatus } from '../constants'

const getSidebarLoadingStatus = (state) => state.getIn(['sidebar', 'loadingStatus']);

// item : immutable.js
// componentClass : String
const createNode = (item, componentClass) => {
  return Immutable.fromJS({
    'name': item.get('name'),
    'id': item.get('id'),
    'objectId': item.get('id'),
    'isOpen': false,
    'children': [],
    'customComponent': componentClass
  });
}



const getSidebarCompleteTree = createSelector(
  [
    getSidebarLoadingStatus,
    getSportsById,
    getEventGroupsById,
    getActiveEventsById,
    getBettingMarketGroupsById
  ],
  (sidebarLoadingStatus, sportsById, eventGroupsById, activeEventsById, bettingMarketGroupsById) => {

    let completeTree = Immutable.List();

    // Create the tree only when the sidebar loading is done
    if (sidebarLoadingStatus === LoadingStatus.DONE) {

      // Map each item according to its parent id
      const eventGroupsBySportId = eventGroupsById.toList().groupBy((eventGroup) => eventGroup.get('sport_id'));
      const activeEventsByEventGroupId = activeEventsById.toList().groupBy((event) => event.get('event_group_id'));
      const bettingMktGroupByEventId = bettingMarketGroupsById.toList().groupBy((bettingMktGroup) => bettingMktGroup.get('event_id'));
      // Add hard code header "all sports"
      const allSportsHeader = Immutable.fromJS({
        name: I18n.t('AllSports.allSports'), /*require for menu lib */
        id: '0', /*require for menu lib */
        isOpen: false, /*optional for menu lib */
        isSelected: false, /*optional for node component  */
        customComponent: 'Sport',  /*require for custom component*/
        objectId: '0',
        children: []  /*require for TreeUtil.js*/
      })
      completeTree = completeTree.push(allSportsHeader);

      const sortById = (a, b) => a.get('id').localeCompare(b.get('id'));
      // Sort sport by id
      const sportList = sportsById.toList().sort(sortById);
      // For each sport, create sport node
      const sportNodes = sportList.map((sport) => {
        let sportNode = createNode(sport, 'Sport');
        // Sort event group by id
        let eventGroupList = eventGroupsBySportId.get(sport.get('id')) || Immutable.List();
        eventGroupList = eventGroupList.sort(sortById);
        // For each event group, create event group node
        const eventGroupNodes = eventGroupList.map((eventGroup) => {
          let eventGroupNode = createNode(eventGroup, 'EventGroup');
          // Sort event by id
          let eventList = activeEventsByEventGroupId.get(eventGroup.get('id')) || Immutable.List();
          eventList = eventList.sort(sortById);
          // For each active event, create event node
          const eventNodes = eventList.map((event) => {
            let eventNode = createNode(event, 'Event');
            // Sort betting market group by id
            let bettingMktGroupList = bettingMktGroupByEventId.get(event.get('id')) || Immutable.List();
            bettingMktGroupList = bettingMktGroupList.sort(sortById);
            // For each betting market group, create betting market group node
            const bettingMktGroupNodes = bettingMktGroupList.map((mktGroup) => {
              let mktGroupNode = createNode(mktGroup, 'BettingMarketGroup');
              mktGroupNode = mktGroupNode.set('description', mktGroup.get('description') );
              mktGroupNode = mktGroupNode.set('name', mktGroup.get('description'));
              return mktGroupNode;
            });
            // Append betting market group to event node
            eventNode = eventNode.set('children', bettingMktGroupNodes);
            return eventNode;
          });
          // Append event to event group
          eventGroupNode = eventGroupNode.set('children', eventNodes);
          return eventGroupNode;
        });
        // Append event group to sport
        sportNode = sportNode.set('children', eventGroupNodes);
        return sportNode;
      });
      // Append sport to complete tree
      completeTree = completeTree.concat(sportNodes);
    }
    return completeTree;
  }
);
const SidebarSelector = {
  getSidebarCompleteTree
}

export default SidebarSelector;
