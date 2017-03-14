import SportListDummyData from '../dummyData/SportList';
import { LoadingStatus, ActionTypes } from '../constants';

/**
 * Private actions
 */
class SportPrivateActions {
  // Generate set account action
  static setSportList(sportList) {
    return {
      type: ActionTypes.SPORT_SET_SPORT_LIST,
      sportList
    }
  }

  static setLoadingStatus(loadingStatus) {
    return {
      type: ActionTypes.SPORT_SET_LOADING_STATUS,
      loadingStatus
    }
  }
}

/**
 * Private actions
 */
class SportActions {
  // Generate set account action
  static getSportList() {
    return (dispatch) => {
      // Simulate getting sport
      dispatch(SportPrivateActions.setLoadingStatus(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      setTimeout(() => {
        dispatch(SportPrivateActions.setLoadingStatus(LoadingStatus.DONE));
        // Set sport list
        dispatch(SportPrivateActions.setSportList(SportListDummyData));
      }, 500);

    };
  }
}

export default SportActions;
