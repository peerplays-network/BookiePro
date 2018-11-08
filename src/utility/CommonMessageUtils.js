import CommonMessageActions from '../actions/CommonMessageActions';
import {I18n} from 'react-redux-i18n';
import MessageId from '../constants/MessageId';
import MessageLocation from '../constants/MessageLocation';
import MessageType from '../constants/MessageTypes';


var CommonMessageUtils = {
  betslipAddRemove(betsError, id) {
    // Determine what the message type is.
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

    // If there exists invalid bets, display warning message to indicate as such.
    if (betsError !== '') {
      return CommonMessageActions.newMessage(betsError, type, MessageLocation.BETSLIP, id);
    } else {
      // If there are no erronous bets, ensure there are no warning messages to indicate
      // otherwise.
      return CommonMessageActions.clearMessage(id);
    }
  },

  determineMessageAndId(numberOfBets, numberOfBadBets, sufficientFunds) {
    let betsError = '';
    let messageId = '';

    if (numberOfBets !== 0) {
      if (numberOfBadBets > 0) {
        // Incomplete bets error.
        betsError = I18n.t('bet_error.incomplete_bet');
        messageId = MessageId.BETSLIP.WARNING.INCOMPLETE_BET;
      }

      if (!sufficientFunds) {
        // Insufficient Funds for the bets existing.
        betsError = I18n.t('bet_error.insufficient_balance');
        messageId = MessageId.BETSLIP.ERROR.INSUFFICIENT_FUNDS;
      }
    }

    return [betsError, messageId];
  }
};

export default CommonMessageUtils;
