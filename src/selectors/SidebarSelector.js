import {createSelector} from 'reselect';
import CommonSelector from './CommonSelector';
import Immutable from 'immutable';
import {DateUtils} from '../utility';
import {Config} from '../constants';
import {I18n} from 'react-redux-i18n';
import {LoadingStatus} from '../constants';

const {
  getSportsById,
  getEventGroupsById,
  getActiveEventsById,
  getBettingMarketGroupsById
} = CommonSelector;

const getSidebarLoadingStatus = (state) => state.getIn(['sidebar', 'loadingStatus']);

// item : immutable.js
// componentClass : String
const createNode = (item, componentClass) => Immutable.fromJS({
  name: item.get('name'),
  id: item.get('id'),
  objectId: item.get('id'),
  isOpen: false,
  children: [],
  customComponent: componentClass
});

/**
 * to construct Tree Structure for sport, event, event groups and betting market groups
 *
 * tree nodes only visible if and only if
 * i) the node is active
 * ii) more than one descendant node is active
 *
 * ordering:
 * Currently nodes in same level are other by "object id"
 *
 * completeTree data is shared by BOTH components/Sidbar as well as components/SearchMenu.
 */
const getSidebarCompleteTree = createSelector(
  [
    getSidebarLoadingStatus,
    getSportsById,
    getEventGroupsById,
    getActiveEventsById,
    getBettingMarketGroupsById
  ],
  (
    sidebarLoadingStatus,
    sportsById,
    eventGroupsById,
    activeEventsById,
    bettingMarketGroupsById
  ) => {
    let completeTree = Immutable.List();

    // Create the tree only when the sidebar loading is done
    if (sidebarLoadingStatus === LoadingStatus.DONE) {
      var assetId = Config.coreAsset;

      // Map each item according to its parent id
      const eventGroupsBySportId = eventGroupsById
        .toList()
        .groupBy((eventGroup) => eventGroup.get('sport_id'));
      const activeEventsByEventGroupId = activeEventsById
        .toList()
        .groupBy((event) => event.get('event_group_id'));
      const bettingMktGroupByEventId = bettingMarketGroupsById
        .toList()
        .groupBy((bettingMktGroup) => bettingMktGroup.get('event_id'));
      // Add hard code header "all sports"
      const allSportsHeader = Immutable.fromJS({
        name: I18n.t('AllSports.allSports') /*require for menu lib */,
        id: '0' /*require for menu lib */,
        isOpen: false /*optional for menu lib */,
        isSelected: false /*optional for node component  */,
        customComponent: 'Sport' /*require for custom component*/,
        objectId: '0',
        children: [] /*require for TreeUtil.js*/
      });
      completeTree = completeTree.push(allSportsHeader);

      const filters = Config.filters;
      const sortById = (a, b) => a.get('id').localeCompare(b.get('id'));
      // Sort sport by id
      const sportList = sportsById.toList().sort(sortById);
      // For each sport, create sport node
      const sportNodes = sportList
        .map((sport) => {
          let sportNode = createNode(sport, 'Sport');
          // Sort event group by id
          let eventGroupList = eventGroupsBySportId.get(sport.get('id')) || Immutable.List();
          eventGroupList = eventGroupList.sort(sortById);
          // For each event group, create event group node
          const eventGroupNodes = eventGroupList
            .map((eventGroup) => {
              let eventGroupNode = createNode(eventGroup, 'EventGroup');
              // Sort event by id
              let eventList =
                activeEventsByEventGroupId.get(eventGroup.get('id')) || Immutable.List();
              eventList = eventList.sort(sortById);
              // For each active event, create event node
              const eventNodes = eventList
                .map((event) => {
                  let eventNode = createNode(event, 'Event');
                  // Set isLiveMarket
                  eventNode = eventNode.set(
                    'start_time',
                    DateUtils.getLocalDate(event.get('start_time'))
                  );
                  eventNode = eventNode.set('isLiveMarket', event.get('is_live_market'));
                  // Sort & filter betting market group by id and core asset.
                  let bettingMktGroupList =
                    bettingMktGroupByEventId.get(event.get('id')) || Immutable.List();
                  bettingMktGroupList = bettingMktGroupList
                    .filter((bmg) => bmg.get('asset_id') === assetId);

                  bettingMktGroupList = bettingMktGroupList.sort(sortById);
                  // For each betting market group, create betting market group node
                  const bettingMktGroupNodes = bettingMktGroupList.map((mktGroup) => {
                    let mktGroupNode = createNode(mktGroup, 'BettingMarketGroup');
                    mktGroupNode = mktGroupNode.set('description', mktGroup.get('description'));
                    mktGroupNode = mktGroupNode.set('name', mktGroup.get('description'));
                    return mktGroupNode;
                  });
                  // Append betting market group to event node
                  eventNode = eventNode.set('children', bettingMktGroupNodes);
                  return eventNode;
                  // filter events that do not have BMGs
                })
                .filter((event) => event.get('children').size > 0); 
                
              // Append event to event group
              eventGroupNode = eventGroupNode.set('children', eventNodes);
              return eventGroupNode;
            })
            .filter((eventGroup) => {
              // filter eventGroups that have no events
              let eventGroupName = eventGroup.get('name').toUpperCase();

              // Remove friendly international from beta bookie pro fun
              return (eventGroup.get('children').size > 0 &&
                !filters.eventGroup.name.includes(eventGroupName));
            });
          // Append event group to sport
          sportNode = sportNode.set('children', eventGroupNodes);
          return sportNode;
        })
        .filter((sport) => sport.get('children').size > 0); 
        // filter sports that have no event groups

      // Append sport to complete tree
      completeTree = completeTree.concat(sportNodes);
    }

    return completeTree;
  }
);
const SidebarSelector = {
  getSidebarCompleteTree
};

export default SidebarSelector;
