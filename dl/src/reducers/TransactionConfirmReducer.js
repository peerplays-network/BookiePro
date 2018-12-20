import {ActionTypes} from '../constants/ActionTypes';

/**
 *
 * Transaction Confirm Reduxer is used to conducting transactions through modal windows
 *
 * Initial state
 *
 * isOpen - Open|Close transaction modal window
 * isConfirm - The transaction was successful and confirmed
 * transactionType - types to look at TransactionConfirmModal
 * transaction - Transaction Object
 * propose - TODO::rm
 * broadcasting - transaction in process
 * broadcastSuccess - The transaction was successful
 * broadcastError - The transaction was not successful
 * btnStatus - type of button
 *
 * @type {{isOpen: boolean, isConfirm: boolean, transactionType: null, transaction: {}, propose: null, broadcasting: boolean, broadcastSuccess: boolean, broadcastError: null, btnStatus: string}}
 */
const initialState = {
  isOpen: false,
  isConfirm: false,
  transactionType: null,
  transaction: {},
  propose: null,
  broadcasting: false,
  broadcastSuccess: false,
  broadcastError: null,
  btnStatus: 'default'
};
/*in object transaction you must have:
      transactionFunction(it will be called after field isConfirm would be true) - function(must
      return promise),
      functionArguments - whatever that you need in transactionFunction,
      proposedOperation(if user choose proposal transaction) - string,
      transactionObject(for field common options) - object
      and other options - as they need into components
*/

/*
    ATTENTION!!!!!
    if current transaction needs owner key's signature, you must foresee a situation where user
    create proposal transaction, because it needs active key's signature
*/

export default (state = initialState, action) => {
  switch (action.type) {
    // open modal, set transaction object, transaction type and button type
    case ActionTypes.TRCONFIRM_SET_TRANSACTION:
      return Object.assign({}, state, {
        isOpen: true,
        transactionType: action.payload.transaction,
        transaction: action.payload.data,
        btnStatus: 'default'
      });
      // set propose btn status
    case ActionTypes.TRCONFIRM_PROPOSE:
      return Object.assign({}, state, {
        propose: action.payload,
        btnStatus: action.payload ? 'propose' : 'default'
      });
      // set: transaction in process
    case ActionTypes.TRCONFIRM_BROADCASTING:
      return Object.assign({}, state, {
        broadcasting: true,
        btnStatus: 'loading'
      });
      // set broadcast SUCCESS
    case ActionTypes.TRCONFIRM_BROADCAST_SUCCESS:
      return Object.assign({}, state, {
        broadcasting: false,
        broadcastSuccess: true
      });
      // set broadcast ERROR
    case ActionTypes.TRCONFIRM_BROADCAST_ERROR:
      return Object.assign({}, state, {
        broadcasting: false,
        broadcastError: action.payload,
        btnStatus: 'error'
      });
      // set: The transaction was successful
    case ActionTypes.TRCONFIRM_TRCONFIRMED:
      return Object.assign({}, state, {
        broadcasting: false,
        broadcastSuccess: false,
        isConfirm: true,
        btnStatus: 'done'
      });
      // close and reset modal
    case ActionTypes.TRCONFIRM_CLEAR:
      return initialState;

    default:
      // We return the previous state in the default case
      return state;
  }
};