import FakeApi from '../communication/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';

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

  static getSportList() {
    return (dispatch) => {
      dispatch(SportPrivateActions.setGetSportsLoadingStatusAction(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      FakeApi.getSports().then((sports) => {
        dispatch(SportActions.addSportsAction(sports));
        dispatch(SportPrivateActions.setGetSportsLoadingStatusAction(LoadingStatus.DONE));
      });

    };
  }
}

export default SportActions;
