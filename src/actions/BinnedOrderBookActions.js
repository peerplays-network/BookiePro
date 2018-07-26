import {ActionTypes, LoadingStatus} from '../constants';
import {CommunicationService} from '../services';

class BinnedOrderBookPrivateActions {
  static setGetBinnedOrderBooksByBettingMarketIdsLoadingStatusAction(
    bettingMarketIds,
    loadingStatus
  ) {
    return {
      type: ActionTypes.BINNED_ORDER_BOOK_SET_GET_BINNED_ORDER_BOOKS_BY_BETTING_MARKET_IDS_LOADING_STATUS, // eslint-disable-line
      bettingMarketIds,
      loadingStatus
    };
  }

  static addOrUpdateBinnedOrderBooksByBettingMarketIdsAction(binnedOrderBooksByBettingMarketId) {
    return {
      type: ActionTypes.BINNED_ORDER_BOOK_ADD_OR_UPDATE_BINNED_ORDER_BOOKS_BY_BETTING_MARKET_ID,
      binnedOrderBooksByBettingMarketId
    };
  }

  static removeBettingMarketsByBettingMarketIdsAction(bettingMarketIds) {
    return {
      type: ActionTypes.BINNED_ORDER_BOOK_REMOVE_BINNED_ORDER_BOOKS_BY_BETTING_MARKET_ID,
      bettingMarketIds
    };
  }
}

/**
 * Public actions
 */
class BinnedOrderBookActions {
  /**
   * Get betting markets given array of their ids (can be immutable array)
   * Perform no caching for binned order books because of the amount of data can be huge
   */
  static getBinnedOrderBooksByBettingMarketIds(bettingMarketIds) {
    return (dispatch) => {
      dispatch(
        BinnedOrderBookPrivateActions.setGetBinnedOrderBooksByBettingMarketIdsLoadingStatusAction(
          bettingMarketIds,
          LoadingStatus.LOADING
        )
      );
      return CommunicationService.getBinnedOrderBooksByBettingMarketIds(bettingMarketIds, 2).then(
        (binnedOrderBooksByBettingMarketId) => {
          // Add to store
          dispatch(
            BinnedOrderBookPrivateActions.addOrUpdateBinnedOrderBooksByBettingMarketIdsAction(
              binnedOrderBooksByBettingMarketId
            )
          );
          dispatch(
            BinnedOrderBookPrivateActions.setGetBinnedOrderBooksByBettingMarketIdsLoadingStatusAction( // eslint-disable-line
              bettingMarketIds,
              LoadingStatus.DONE
            )
          );
          // Return
          return binnedOrderBooksByBettingMarketId;
        }
      );
    };
  }

  /**
   * Refresh binned order books
   */
  static refreshBinnedOrderBooksByBettingMarketIds(bettingMarketIds) {
    return (dispatch, getState) => {
      // Only refresh binned order book of betting market that is inside the redux store
      let binnedOrderBooksByBettingMarketId = getState().getIn([
        'binnedOrderBook',
        'binnedOrderBooksByBettingMarketId'
      ]);
      let bettingMarketIdsOfBinnedOrderBooksToBeRefreshed = bettingMarketIds.filter(
        (bettingMarketId) => binnedOrderBooksByBettingMarketId.has(bettingMarketId)
      );

      // Fetch the updated info from the blockchain
      return CommunicationService.getBinnedOrderBooksByBettingMarketIds(
        bettingMarketIdsOfBinnedOrderBooksToBeRefreshed,
        2
      ).then((binnedOrderBooksByBettingMarketId) => {
        // Update store
        dispatch(
          BinnedOrderBookPrivateActions.addOrUpdateBinnedOrderBooksByBettingMarketIdsAction(
            binnedOrderBooksByBettingMarketId
          )
        );
        // Return
        return binnedOrderBooksByBettingMarketId;
      });
    };
  }

  /**
   * Remove binned order books betting market ids
   * TODO: Use this whenever the user is leaving a page related to the binned order books
   * (Since we want to avoid keep storing and keep updating binnedOrderBooks since the 
   * amount of data is potentially huge)
   */
  static removeBinnedOrderBooksByBettingMarketIds(bettingMarketIds) {
    return (dispatch) => {
      // Add to store
      dispatch(
        BinnedOrderBookPrivateActions.removeBinnedOrderBooksByBettingMarketIds(bettingMarketIds)
      );
      // Set status to default
      dispatch(
        BinnedOrderBookPrivateActions.setGetBinnedOrderBooksByBettingMarketIdsLoadingStatusAction(
          bettingMarketIds,
          LoadingStatus.DEFAULT
        )
      );
    };
  }
}

export default BinnedOrderBookActions;
