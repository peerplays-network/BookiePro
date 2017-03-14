import FakeApi from '../dummyData/FakeApi';
import { LoadingStatus, ActionTypes } from '../constants';

/**
 * Private actions
 */
class CompetitorPrivateActions {
  static addCompetitors(competitors) {
    return {
      type: ActionTypes.COMPETITOR_ADD_COMPETITORS,
      competitors
    }
  }

  static setLoadingStatus(loadingStatus) {
    return {
      type: ActionTypes.COMPETITOR_SET_LOADING_STATUS,
      loadingStatus
    }
  }
}

/**
 * Public actions
 */
class CompetitorActions {
  static getCompetitors(sportId) {
    return (dispatch) => {
      dispatch(CompetitorPrivateActions.setLoadingStatus(LoadingStatus.LOADING));

      // TODO: Replace with actual blockchain call
      FakeApi.getCompetitors(sportId).then((competitors) => {
        dispatch(CompetitorPrivateActions.setLoadingStatus(LoadingStatus.DONE));
        dispatch(CompetitorPrivateActions.addCompetitors(competitors));
      });

    };
  }
}

export default CompetitorActions;
