import { LoadingStatus, ActionTypes } from '../constants';
import Immutable from 'immutable';
import { CommunicationService } from '../services';

/**
 * Private actions
 */
class SportPrivateActions {
  static setGetAllSportsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.SPORT_SET_GET_ALL_SPORTS_LOADING_STATUS,
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

  static addSportsAction(sports) {
    return {
      type: ActionTypes.SPORT_ADD_SPORTS,
      sports
    }
  }
}

/**
 * Public actions
 */
class SportActions {

  /**
   * Get all sports
   */
  static getAllSports() {
    return (dispatch, getState) => {
      const getAllSportsLoadingStatus = getState().getIn(['sport', 'getAllSportsLoadingStatus']);
      // Fetch sports only if it is not retrived yet
      if (getAllSportsLoadingStatus === LoadingStatus.DONE) {
        // Return the stored sports
        const sports = getState().getIn(['sport', 'sportsById']).toList();
        return Promise.resolve(sports);
      } else {
        // Retrieve sports from blockchain
        // Set status
        dispatch(SportPrivateActions.setGetAllSportsLoadingStatusAction(LoadingStatus.LOADING));
        return CommunicationService.getAllSports().then((sports) => {
          // Add data
          dispatch(SportPrivateActions.addSportsAction(sports));
          // Set status
          dispatch(SportPrivateActions.setGetAllSportsLoadingStatusAction(LoadingStatus.DONE));
          const sportIds = sports.map(sport => sport.get('id'));
          dispatch(SportPrivateActions.setGetSportsByIdsLoadingStatusAction(sportIds, LoadingStatus.DONE));
          return Immutable.fromJS(sports);
        });
      }
    };
  }

  /**
   * Get sports given array of sportIds (can be immutable array)
   */
  static getSportsByIds(sportIds) {
    return (dispatch, getState) => {
      sportIds = Immutable.List().concat(sportIds);

      let retrievedSports = Immutable.List();
      let idsOfSportsToBeRetrieved = Immutable.List();

      // Check if the requested data is already inside redux store
      const getSportsByIdsLoadingStatus = getState().getIn(['sport', 'getSportsByIdsLoadingStatus']);
      const sportsById = getState().getIn(['sport', 'sportsById']);;
      sportIds.forEach( sportId => {
        if (getSportsByIdsLoadingStatus.get(sportId) === LoadingStatus.DONE) {
          if (sportsById.has(sportId)) {
            retrievedSports = retrievedSports.push(sportsById.get(sportId));
          }
        } else {
          idsOfSportsToBeRetrieved = idsOfSportsToBeRetrieved.push(sportId);
        }
      })

      if (idsOfSportsToBeRetrieved.size === 0) {
        // No sports to be retrieved from blockchain, return retrieved data from redux store
        return Promise.resolve(retrievedSports);
      } else {
        // Retrieve sports from blockchain
        // Set status
        dispatch(SportPrivateActions.setGetSportsByIdsLoadingStatusAction(idsOfSportsToBeRetrieved, LoadingStatus.LOADING));
        return CommunicationService.getObjectsByIds(idsOfSportsToBeRetrieved).then((sports) => {
          console.log(' retrieved', sports.toJS());
          // Add sports
          dispatch(SportPrivateActions.addSportsAction(sports));
          // Set status
          dispatch(SportPrivateActions.setGetSportsByIdsLoadingStatusAction(idsOfSportsToBeRetrieved, LoadingStatus.DONE));
          // Combine list and return the result
          return retrievedSports.concat(sports);
        });
      }
    };
  }

}

export default SportActions;
