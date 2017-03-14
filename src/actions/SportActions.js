import FakeApi from '../dummyData/FakeApi';
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
 * Public actions
 */
class SportActions {
  // Generate set account action
  static getSportList() {
    return (dispatch) => {
      // Simulate getting sport
      dispatch(SportPrivateActions.setLoadingStatus(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      FakeApi.getSportList().then((sportList) => {
        dispatch(SportPrivateActions.setLoadingStatus(LoadingStatus.DONE));
        // Set sport list
        dispatch(SportPrivateActions.setSportList(sportList));
      });

    };
  }
}

export default SportActions;
