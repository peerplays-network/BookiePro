import FakeApi from '../dummyData/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';

/**
 * Private actions
 */
class SportPrivateActions {
  static addSports(sports) {
    return {
      type: ActionTypes.SPORT_ADD_SPORTS,
      sports
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
  static getSportList() {
    return (dispatch) => {
      dispatch(SportPrivateActions.setLoadingStatus(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      FakeApi.getSports().then((sports) => {
        dispatch(SportPrivateActions.setLoadingStatus(LoadingStatus.DONE));
        dispatch(SportPrivateActions.addSports(sports));
      });

    };
  }
}

export default SportActions;
