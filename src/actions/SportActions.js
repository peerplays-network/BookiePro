import FakeApi from '../communication/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';
import Immutable from 'immutable';

/**
 * Private actions
 */
class SportPrivateActions {
  static setGetSportsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.SPORT_SET_GET_SPORTS_LOADING_STATUS,
      loadingStatus
    }
  }
  static setGetSportsByIdsLoadingStatusAction(sportIds, loadingStatus) {
    return {
      type: ActionTypes.SPORT_SET_GET_SPORTS_BY_IDS_LOADING_STATUS,
      sportIds,
      loadingStatus
    }
  }
}

/**
 * Public actions
 */
class SportActions {
  static addSportsAction(sports) {
    return {
      type: ActionTypes.SPORT_ADD_SPORTS,
      sports
    }
  }

  static getAllSports() {
    return (dispatch, getState) => {
      const getSportsLoadingStatus = getState().getIn(['sport', 'getSportsLoadingStatus']);
      // Fetch sports only if it is not retrived yet
      if (getSportsLoadingStatus === LoadingStatus.DONE) {
        // Return the stored sports
        const sports = getState().getIn(['sport', 'sportsById']).toList();
        return Promise.resolve(sports);
      } else {
        // Retrieve sports from blockchain
        dispatch(SportPrivateActions.setGetSportsLoadingStatusAction(LoadingStatus.LOADING));
        // TODO: Replace with actual blockchain call
        return FakeApi.getSports().then((sports) => {
          dispatch(SportActions.addSportsAction(sports));
          dispatch(SportPrivateActions.setGetSportsLoadingStatusAction(LoadingStatus.DONE));
          const sportIds = sports.map(sport => sport.get('id'));
          dispatch(SportPrivateActions.setGetSportsByIdsLoadingStatusAction(sportIds, LoadingStatus.DONE));
          return Immutable.fromJS(sports);
        });
      }
    };
  }

  static getSportsByIds(sportIds) {
    return (dispatch, getState) => {
      sportIds = Immutable.List().concat(sportIds);

      let retrievedSports = Immutable.List();
      let idsOfSportsToBeRetrieved = Immutable.List();

      const getSportsByIdsLoadingStatus = getState().getIn(['sport', 'getSportsByIdsLoadingStatus']);
      const sportsById = getState().getIn(['sport', 'sportsById']);;
      sportIds.forEach( sportId => {
        if (getSportsByIdsLoadingStatus.get(sportId) === LoadingStatus.DONE) {
          if (sportsById.has(sportId)) {
            retrievedSports = retrievedSports.concat(sportsById.get(sportId));
          }
        } else {
          idsOfSportsToBeRetrieved = idsOfSportsToBeRetrieved.push(sportId);
        }
      })

      if (idsOfSportsToBeRetrieved.size === 0) {
        // No sports to be retrieved
        return Promise.resolve(retrievedSports);
      } else {
        dispatch(SportPrivateActions.setGetSportsByIdsLoadingStatusAction(idsOfSportsToBeRetrieved, LoadingStatus.LOADING));
        // TODO: Replace with actual blockchain call
        return FakeApi.getSportsByIds(idsOfSportsToBeRetrieved).then((sports) => {
          dispatch(SportActions.addSportsAction(sports));
          dispatch(SportPrivateActions.setGetSportsByIdsLoadingStatusAction(idsOfSportsToBeRetrieved, LoadingStatus.DONE));
          return retrievedSports.concat(sports);
        });
      }
    };
  }

}

export default SportActions;
