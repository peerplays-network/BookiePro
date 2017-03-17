import { ActionTypes } from '../constants';

/**
 * Public actions
 */
class BinnedOrderBookActions {
  static addBinnedOrderBooksAction(binnedOrderBooks) {
    return {
      type: ActionTypes.BINNED_ORDER_BOOK_ADD_BINNED_ORDER_BOOKS,
      binnedOrderBooks
    }
  }
}

export default BinnedOrderBookActions;
