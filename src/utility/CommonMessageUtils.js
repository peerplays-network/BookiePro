import CommonMessageActions from '../actions/CommonMessageActions';
import {I18n} from 'react-redux-i18n';
import MessageId from '../constants/MessageId';
import MessageLocation from '../constants/MessageLocation';
import MessageType from '../constants/MessageTypes';
import LoadingStatus from '../constants/LoadingStatus';


var CommonMessageUtils = {
  /**
 * Determine the message type from the id.
 *
 * @param {string} id : the id of the message.
 * @returns {string} : MessageType (error, warning, success, info)
 */
  getMessageType(id) {
    let type;

    if (id) {
      if (id.indexOf('err') !== -1) {
        // Message type is error
        type = MessageType.ERROR;
      } else if (id.indexOf('war') !== -1) {
        // Message type is warning
        type = MessageType.WARNING;
      } else if (id.indexOf('suc') !== -1) {
        // Message type is success
        type = MessageType.SUCCESS;
      } else if (id.indexOf('inf') !== -1) {
        // Message type is info
        type = MessageType.INFO;
      }
    }

    return type;
  },
  /**
   * Checks if the message already exists, if it does, clear it.
   *    - should not be triggered under normal circumstances as betslip messages currently
   *      configured are ones that remove automatically on a timer.
   * If the message does not exist, and should, dispatch the message.
   *
   * @param {string} message : the message to display
   * @param {string} id : the message id to tie to the message. (used for removal/uniquen purposes)
   * @returns {dispatch} : dispatches one of two actions. Adding a new message or 
   *                       removing an existing one.
   */
  betslipAddRemove(message, id) {
    // Determine what the message type is.
    let type = CommonMessageUtils.getMessageType(id);

    // If there exists invalid bets, display warning message to indicate as such.
    if (message !== '') {
      return CommonMessageActions.newMessage(message, type, MessageLocation.BETSLIP, id);
    } else {
      // If there are no erronous bets, ensure there are no warning messages to indicate
      // otherwise.
      return CommonMessageActions.resetMessages();
    }
  },

  /**
 * Dispatch a message based on the loading state provided
 *
 * @param {string} loadingState - the user's selected currency
 * @returns {dispatch} : dispatches a new message
 */
  messageFromLoadState(loadingState) {
    let type;
    let message;
    let location;
    let id;

    switch (loadingState) {
      case LoadingStatus.DONE_UNMATCHED_BET_CANCEL: {
        id = MessageId.BETSLIP.SUCCESS.CANCEL_BET;
        type = CommonMessageUtils.getMessageType(id);
        location = MessageLocation.BETSLIP;
        message = I18n.t('market_drawer.open_bets.confirmation.imperfect.cancel_bet');
        break;
      }

      case LoadingStatus.DONE_UNMATCHED_BET_CANCEL_ALL: {
        id = MessageId.BETSLIP.SUCCESS.CANCEL_BET;
        type = CommonMessageUtils.getMessageType(id);
        location = MessageLocation.BETSLIP;
        message = I18n.t('market_drawer.open_bets.confirmation.imperfect.cancel_bets');
        break;
      }

      default:
        break;
    }

    return CommonMessageActions.newMessage(message, type, location, id);
  },
  
  /**
 * Based on provided paramters, determine if the message to dispatch (at a later time) should
 * be an error or a warning.
 * Also sets the message based on aforementioned paramters.
 *
 * @param {number} numberOfBets : total number of bets in the betslip to be submitted
 * @param {number} numberOfBadBets : total number of "bad" bets in the betslip.
 * @param {boolean} sufficientFunds : whether or not the user has sufficient funds to submit 
 *                                    queued bets
 * @returns {array} [message, messageId] : the message, the message id.
 */
  determineMessageAndId(numberOfBets, numberOfBadBets, sufficientFunds) {
    let message = '';
    let messageId = '';

    if (numberOfBets !== 0) {
      if (numberOfBadBets > 0) {
        // Incomplete bets error.
        message = I18n.t('bet_error.incomplete_bet');
        messageId = MessageId.BETSLIP.WARNING.INCOMPLETE_BET;
      }

      if (!sufficientFunds) {
        // Insufficient Funds for the bets existing.
        message = I18n.t('bet_error.insufficient_balance');
        messageId = MessageId.BETSLIP.ERROR.INSUFFICIENT_FUNDS;
      }
    }

    return [message, messageId];
  }
};

export default CommonMessageUtils;
