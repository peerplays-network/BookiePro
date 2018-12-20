import {
  SOFTWARE_UPDATE_SET_ACCOUNT_DATA
} from '../constants/ActionTypes';
import {ChainTypes} from 'peerplaysjs-lib';
import Repository from '../repositories/chain/repository';
import NotificationsActions from './NotificationsActions';
import NotificationMessage from '../app/NotificationMessage';
import StringHelper from '../helpers/StringHelper';
import VersionHelper from '../helpers/VersionHelper';
import _ from 'lodash';
import CONFIG from '../config/main';

/**
 * Private Action Creator (SOFTWARE_UPDATE_SET_ACCOUNT_DATA)
 *
 * @param {Object} data
 * @returns {{type, payload: *}}
 */
function setAccountDataAction(data) {
  return {
    type: SOFTWARE_UPDATE_SET_ACCOUNT_DATA,
    payload: data
  };
}

class SoftwareUpdateActions {

  /**
   * We monitor a Peerplays controlled account
   *
   * @returns {function(*=, *)}
   */
  static checkForSoftwareUpdate() {
    return (dispatch, getState) => {
      return Repository.fetchFullAccount(CONFIG.SOFTWARE_UPDATE_REFERENCE_ACCOUNT_NAME)
        .then((account) => { //Get Controlled account
          if (!account) {
            return null;
          }

          let state = getState();

          /**
           * Compare with the current account
           */
          if (state.softwareUpdateReducer.account !== account) {
            /**
             * Get latest transaction histories and parse it
             */
            let history = account.get('history');

            if (history && history.size) {
              history.find((historyItem) => {
                let operationType = historyItem.getIn(['op', 0]);

                if (operationType === ChainTypes.operations.transfer) {
                  let memo = historyItem.getIn(['op', 1, 'memo']);

                  if (memo) {
                    /**
                   * Assuming that we need to decrypt the message to parse 'software update'
                   * memo message
                   */
                    try {
                      let memoJson =  JSON.parse(StringHelper.hex2a(memo.toJS().message)),
                        version = memoJson.version,
                        displayText = memoJson.displayText;

                      /**
                     * If it has version then it is an update transaction
                     */
                      if (version) {
                        console.log('[APP] NEW VERSION', version);
                        console.log('[APP] CURRENT VERSION', CONFIG.APP_PACKAGE_VERSION);

                        /**
                       * Check if we need to add it to notification list
                       */
                        if (VersionHelper.compare(version, CONFIG.APP_PACKAGE_VERSION) === 1) {
                          dispatch(NotificationsActions.addUpdateSoftwareMessage(
                            new NotificationMessage(
                              _.uniqueId('msg_'),
                              displayText,
                              NotificationMessage.TYPES.SOFTWARE_UPDATE
                            )
                          ));
                        }

                        return true;
                      } else {
                        return null;
                      }
                    } catch (e) {
                      return false;
                    }
                  } else {
                    return null;
                  }
                } else {
                  return null;
                }
              });
            }

            /**
             * Set new controlled account
             */
            dispatch(setAccountDataAction({
              account
            }));
          }

          return account;
        });
    };
  }
}

export default SoftwareUpdateActions;