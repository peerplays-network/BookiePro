import FakeApi from '../communication/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';

/**
 * Private actions
 */
class CompetitorPrivateActions {
  static setGetCompetitorsLoadingStatusAction(loadingStatus) {
    return {
      type: ActionTypes.COMPETITOR_SET_GET_COMPETITORS_LOADING_STATUS,
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
}

export default CompetitorActions;
