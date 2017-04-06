import { CommunicationService } from '../services';
import { LoadingStatus, ActionTypes } from '../constants';
import Immutable from 'immutable';

/**
 * Private actions
 */
class CompetitorPrivateActions {
  static setGetCompetitorsBySportIdsLoadingStatusAction(sportIds, loadingStatus) {
    return {
      type: ActionTypes.COMPETITOR_SET_GET_COMPETITORS_BY_SPORT_IDS_LOADING_STATUS,
      sportIds,
      loadingStatus
    }
  }

  static setGetCompetitorsByIdsLoadingStatusAction(competitorIds, loadingStatus) {
    return {
      type: ActionTypes.COMPETITOR_SET_GET_COMPETITORS_BY_IDS_LOADING_STATUS,
      competitorIds,
      loadingStatus
    }
  }

  static addCompetitorsAction(competitors) {
    return {
      type: ActionTypes.COMPETITOR_ADD_COMPETITORS,
      competitors
    }
  }
}

/**
 * Public actions
 */
class CompetitorActions {

  /**
   * Get list of competitors given sport ids
   */
  static getCompetitorsBySportIds(sportIds) {
    return (dispatch, getState) => {
      let retrievedCompetitors = Immutable.List();
      let sportIdsOfCompetitorsToBeRetrieved = Immutable.List();

      // Get competitorIdsBySportId
      const competitorsById = getState().getIn(['competitor', 'competitorsById']);
      let competitorsBySportId = Immutable.Map();
      competitorsById.forEach( (competitor, id) => {
        const sportId = competitor.get('sport_id');
        competitorsBySportId = competitorsBySportId.update(sportId, competitors => {
          if (!competitors) competitors = Immutable.List();
          return competitors.push(competitor);
        })
      })

      // Check if the data is already inside the redux store
      const getCompetitorsBySportIdsLoadingStatus = getState().getIn(['competitor', 'getCompetitorsBySportIdsLoadingStatus']);
      sportIds.forEach( sportId => {
        if (getCompetitorsBySportIdsLoadingStatus.get(sportId) === LoadingStatus.DONE) {
          if (competitorsBySportId.has(sportId)) {
            retrievedCompetitors = retrievedCompetitors.push(competitorsBySportId.get(sportId));
          }
        } else {
          sportIdsOfCompetitorsToBeRetrieved = sportIdsOfCompetitorsToBeRetrieved.push(sportId);
        }
      })

      if (sportIdsOfCompetitorsToBeRetrieved.size === 0) {
        // All data is inside redux store, return it
        return Promise.resolve(retrievedCompetitors);
      } else {
        // Retrieve data from blockchain
        // Set status
        dispatch(CompetitorPrivateActions.setGetCompetitorsBySportIdsLoadingStatusAction(sportIdsOfCompetitorsToBeRetrieved, LoadingStatus.LOADING));
        return CommunicationService.getCompetitorsBySportIds(sportIdsOfCompetitorsToBeRetrieved).then((competitors) => {
          // Add to redux store
          dispatch(CompetitorPrivateActions.addCompetitorsAction(competitors));
          // Set status
          dispatch(CompetitorPrivateActions.setGetCompetitorsBySportIdsLoadingStatusAction(sportIdsOfCompetitorsToBeRetrieved, LoadingStatus.DONE));
          const competitorIds = competitors.map(competitor => competitor.get('id'));
          dispatch(CompetitorPrivateActions.setGetCompetitorsByIdsLoadingStatusAction(competitorIds, LoadingStatus.DONE));
          // Concat with data inside redux store and return
          return retrievedCompetitors.concat(competitors);
        });
      }
    };
  }

  /**
   * Get competitors given their ids (can be immutable array)
   */
  static getCompetitorsByIds(competitorIds) {
    return (dispatch, getState) => {
      let retrievedCompetitors = Immutable.List();
      let idsOfCompetitorsToBeRetrieved = Immutable.List();

      // Check if the data is already inside redux store
      const getCompetitorsByIdsLoadingStatus = getState().getIn(['competitor', 'getCompetitorsByIdsLoadingStatus']);
      const competitorsById = getState().getIn(['competitor', 'competitorsById']);;
      competitorIds.forEach( competitorId => {
        if (getCompetitorsByIdsLoadingStatus.get(competitorId) === LoadingStatus.DONE) {
          if (competitorsById.has(competitorId)) {
            retrievedCompetitors = retrievedCompetitors.concat(competitorsById.get(competitorId));
          }
        } else {
          idsOfCompetitorsToBeRetrieved = idsOfCompetitorsToBeRetrieved.push(competitorId);
        }
      })

      if (idsOfCompetitorsToBeRetrieved.size === 0) {
        // No competitors to be retrieved from blockchain, all data is in blockchain
        return Promise.resolve(retrievedCompetitors);
      } else {
        // Retrieve data from blockchain
        dispatch(CompetitorPrivateActions.setGetCompetitorsByIdsLoadingStatusAction(idsOfCompetitorsToBeRetrieved, LoadingStatus.LOADING));

        return CommunicationService.getObjectsByIds(idsOfCompetitorsToBeRetrieved).then((competitors) => {
          // Add to redux store
          dispatch(CompetitorPrivateActions.addCompetitorsAction(competitors));
          // Set status
          dispatch(CompetitorPrivateActions.setGetCompetitorsByIdsLoadingStatusAction(idsOfCompetitorsToBeRetrieved, LoadingStatus.DONE));
          // Concat and return
          return retrievedCompetitors.concat(competitors);
        });
      }
    };
  }
}

export default CompetitorActions;
