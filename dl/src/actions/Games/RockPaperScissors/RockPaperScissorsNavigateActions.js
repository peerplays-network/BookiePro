import {push} from 'react-router-redux';

class RockPaperScissorsNavigateActions {
  /**
     * Explore Tab
     *
     * @returns {Function}
     */
  static navigateToAllTournaments(page) {
    return (dispatch) => {
      if (page && page !== 1) {
        dispatch(push(`/games/rock-paper-scissors/explore/all?page=${page}`));
      } else {
        dispatch(push('/games/rock-paper-scissors/explore/all'));
      }
    };
  }

  /**
     * Find Tab
     *
     * @returns {Function}
     */
  static navigateToOpenTournaments() {
    return (dispatch) => {
      dispatch(push('/games/rock-paper-scissors/explore/find'));
    };
  }

  /**
     * Create Tab
     *
     * @returns {Function}
     */
  static navigateToCreateTournament() {
    return (dispatch) => {
      dispatch(push('/games/rock-paper-scissors/create'));
    };
  }

  /**
     * Dashboard Tab
     *
     * @returns {Function}
     */
  static navigateToDashboardTournaments() {
    return (dispatch) => {
      dispatch(push('/games/rock-paper-scissors/dashboard'));
    };
  }

  /**
     * Game page
     *
     * @param id
     * @returns {Function}
     */
  static navigateToGame(id) {
    return (dispatch) => {
      dispatch(push('/games/rock-paper-scissors/game/' + id));
    };
  }
}

export default RockPaperScissorsNavigateActions;