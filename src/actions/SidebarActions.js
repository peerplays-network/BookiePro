import { ActionTypes, LoadingStatus } from '../constants';
import SportActions from './SportActions';
import CompetitorActions from './CompetitorActions';
import EventGroupActions from './EventGroupActions';
import EventActions from './EventActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import _ from 'lodash';
import Immutable from 'immutable';
import log from 'loglevel';
import { I18n } from 'react-redux-i18n';

class SidebarActions{

  static getData() {
    return (dispatch) => {

      // Loading status
      dispatch(SidebarActions.setLoadingStatusAction(LoadingStatus.LOADING));
      let retrievedSportIds;
      // Get sports
      dispatch(SportActions.getAllSports()).then((sports) => {
        retrievedSportIds = sports.map( sport => sport.get('id'));
        const eventGroupIds = sports.flatMap( sport => sport.get('event_group_ids'));
        // Get event groups related to the sports
        return dispatch(EventGroupActions.getEventGroupsByIds(eventGroupIds));
      }).then((eventGroups) => {
        // Get competitiors related to the sports
        return dispatch(CompetitorActions.getCompetitorsBySportIds(retrievedSportIds));
      }).then((competitors) => {
        // Get events related to the sports (because we don't have get event based on event groups)
        return dispatch(EventActions.getActiveEventsBySportIds(retrievedSportIds));
      }).then((events) => {
        // Get betting market groups
        const bettingMarketGroupIds = events.flatMap( event => event.get('betting_market_group_ids'));
        return dispatch(BettingMarketGroupActions.getBettingMarketGroupsByIds(bettingMarketGroupIds));
      }).then((bettingMarketGroups) => {
        // Loading status
        dispatch(SidebarActions.setLoadingStatusAction(LoadingStatus.DONE));
        // TODO: There may be a synchronization problem here
        // TODO: This should be done in mapStateToProps of the Sidebar
        dispatch(SidebarActions.setTreeForSidebar());
      }).catch((error) => {
        log.error('Sidebar get data error', error);
        // Loading status
        dispatch(SidebarActions.setErrorAction(error));
      })

    };
  }

  // item : immutable.js
  // componentClass : String
  static createNode(item, componentClass){
    return Immutable.fromJS({
      'name': item.get('name'),
      'id': item.get('id'),
      'objectId': item.get('id'),
      'isOpen': false,
      'children': [],
      'customComponent': componentClass
    });

  }

  // TODO: Should move the bulk of this logic to the mapStateToProps in Sidebar
  static setTreeForSidebar(){

    return (dispatch, getState) => {
      const sportsById = getState().getIn(['sport', 'sportsById']);
      const eventGroupsById = getState().getIn(['eventGroup', 'eventGroupsById']);
      const eventsById = getState().getIn(['event', 'eventsById']);
      const bettingMarketGroupsById = getState().getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);

      //sort the ordering of items in same level
      // currently they are sorted by object id
      const eventGroupsList = Immutable.List(eventGroupsById.values())
        .sort((a, b) => a.get('id').localeCompare(b.get('id')) );
      const eventList = Immutable.List(eventsById.values())
        .sort((a, b) => a.get('id').localeCompare(b.get('id')) );
      const bettingMktGroupList = Immutable.List(bettingMarketGroupsById.values())
        .sort((a, b) => a.get('id').localeCompare(b.get('id')) );

      let completeTree = Immutable.List();

      //add hard code header "all sports"
      completeTree = completeTree.push(Immutable.fromJS({
        name: I18n.t('AllSports.allSports'), /*require for menu lib */
        id: "0", /*require for menu lib */
        isOpen: false, /*optional for menu lib */
        isSelected: false, /*optional for node component  */
        customComponent: "Sport",  /*require for custom component*/
        objectId: "0",
        children: []  /*require for TreeUtil.js*/
      }) );

      sportsById.forEach((sport) => {

        let sportNode = this.createNode(sport, 'Sport');

        eventGroupsList.filter(eventGroup => {
          return eventGroup.get('sport_id') === sport.get('id');
        }).forEach( (eventGroup) => {

          let eventGroupNode = this.createNode(eventGroup, 'EventGroup');

          eventList.filter(event => {
            return event.get('event_group_id') === eventGroupNode.get('id');
          }).forEach( (event) => {

            const eventTime = event.start_time;
            const currentTime = new Date().getTime();
            const isEventActive = (eventTime - currentTime) > 0;
            if (isEventActive) {
              let eventNode = this.createNode(event, 'Event');

              bettingMktGroupList.filter(bettingMktGroup => {
                return bettingMktGroup.get('event_id') === eventNode.get('id');
              }).forEach( (mktGroup) => {

                let mktGroupNode = this.createNode(mktGroup, 'BettingMarketGroup');
                const marketTypeId = mktGroup.get('market_type_id');
                mktGroupNode = mktGroupNode.set('market_type_id', marketTypeId )
                  .set('options',mktGroup.get('options') )
                  .set('name',marketTypeId );

                if ( mktGroup.get('options') ){

                  // update the name to be shown in sidebar based on market typd
                  // currently we have 'Spread', 'OverUnder' and 'Moneyline'
                  mktGroupNode = mktGroupNode.update('name',
                    (name) => {

                      if ( marketTypeId === 'Spread'){
                        return I18n.t('bettingMarketGroup.spread') +  ( mktGroup.get('options').get('margin') >= 0 ? '+' : '' )+ mktGroup.get('options').get('margin');
                      } else if ( marketTypeId === 'OverUnder'){
                        return I18n.t('bettingMarketGroup.overunder') + mktGroup.get('options').get('score');
                      } else {
                        return name;

                      }
                    });
                };

                eventNode = eventNode.update('children',
                  (children) => {return (children) ? children.push(mktGroupNode) : null;}
                );
              })

              eventGroupNode = eventGroupNode.update('children',
                (children) => { return (children) ? children.push(eventNode) : null;}
              );
            }


          })

          sportNode = sportNode.update('children',
            (children) => { return (children) ? children.push(eventGroupNode) : null; }
          );


        });

        completeTree = completeTree.push(sportNode);
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

  static setErrorAction(error) {
    return {
      type: ActionTypes.SIDEBAR_SET_ERROR,
      error
    }
  }

  static setLoadingStatusAction(loadingstatus) {
    return {
      type: ActionTypes.SIDEBAR_SET_LOADING_STATUS,
      loadingstatus
    }
  }

}

export default SidebarActions;
