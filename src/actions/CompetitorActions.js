import FakeApi from '../communication/FakeApi';
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
}

/**
 * Public actions
 */
class CompetitorActions {
  static addCompetitorsAction(competitors) {
    return {
      type: ActionTypes.COMPETITOR_ADD_COMPETITORS,
      competitors
    }
  }

  static getCompetitors(sportId) {
    return (dispatch) => {
      dispatch(CompetitorPrivateActions.setGetCompetitorsLoadingStatusAction(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      FakeApi.getCompetitors(sportId).then((competitors) => {
        dispatch(CompetitorActions.addCompetitorsAction(competitors));
        dispatch(CompetitorPrivateActions.setGetCompetitorsLoadingStatusAction(LoadingStatus.DONE));
      });

    };
  }


    static getCompetitorsBySportIds(sportIds) {
      return (dispatch, getState) => {
        sportIds = Immutable.List().concat(sportIds);

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

        const getCompetitorsBySportIdsLoadingStatus = getState().getIn(['competitor', 'getCompetitorsBySportIdsLoadingStatus']);
        sportIds.forEach( sportId => {
          if (getCompetitorsBySportIdsLoadingStatus.get(sportId) === LoadingStatus.DONE) {
            if (competitorsBySportId.has(sportId)) {
              retrievedCompetitors = retrievedCompetitors.concat(competitorsBySportId.get(sportId));
            }
          } else {
            sportIdsOfCompetitorsToBeRetrieved = sportIdsOfCompetitorsToBeRetrieved.push(sportId);
          }
        })

        if (sportIdsOfCompetitorsToBeRetrieved.size === 0) {
          // No competitors to be retrieved
          return Promise.resolve(retrievedCompetitors);
        } else {
          dispatch(CompetitorPrivateActions.setGetCompetitorsBySportIdsLoadingStatusAction(sportIdsOfCompetitorsToBeRetrieved, LoadingStatus.LOADING));

          // TODO: Replace with actual blockchain call
          return FakeApi.getCompetitorsBySportIds(sportIdsOfCompetitorsToBeRetrieved).then((competitors) => {
            dispatch(CompetitorActions.addCompetitorsAction(competitors));
            dispatch(CompetitorPrivateActions.setGetCompetitorsBySportIdsLoadingStatusAction(sportIdsOfCompetitorsToBeRetrieved, LoadingStatus.DONE));
            return retrievedCompetitors.concat(competitors);
          });
        }
      };
    }

    static getCompetitorsByIds(competitorIds) {
      return (dispatch, getState) => {
        competitorIds = Immutable.List().concat(competitorIds);

        let retrievedCompetitors = Immutable.List();
        let idsOfCompetitorsToBeRetrieved = Immutable.List();

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
          // No competitors to be retrieved
          return Promise.resolve(retrievedCompetitors);
        } else {
          dispatch(CompetitorPrivateActions.setGetCompetitorsByIdsLoadingStatusAction(idsOfCompetitorsToBeRetrieved, LoadingStatus.LOADING));

          // TODO: Replace with actual blockchain call
          return FakeApi.getCompetitorsByIds(idsOfCompetitorsToBeRetrieved).then((competitors) => {
            dispatch(CompetitorActions.addCompetitorsAction(competitors));
            dispatch(CompetitorPrivateActions.setGetCompetitorsByIdsLoadingStatusAction(idsOfCompetitorsToBeRetrieved, LoadingStatus.DONE));
            return retrievedCompetitors.concat(competitors);
          });
        }
      };
    }
}

export default CompetitorActions;
