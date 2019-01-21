import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import {connect} from 'react-redux';
import {Modal, ModalBody} from 'react-modal-bootstrap';
import AccountRepository from 'repositories/AccountRepository';
import AssetRepository from 'repositories/AssetRepository';
import {RTransactionConfirmActions} from '../../../actions';
import Transfer from './Transfer';
import CreateProposal from './CreateProposal';
import AccountUpdate from './AccountUpdate';
import LimitOrderCreate from './LimitOrderCreate';
import LimitOrderCancel from './LimitOrderCancel';
import AccountUpgrade from './AccountUpgrade';
import BalanceClaim from './BalanceClaim';
import VestingBalanceWithdraw from './VestingBalanceWithdraw';
import RockPaperScissorsTournamentCreate from './RockPaperScissorsTournamentCreate';
import RockPaperScissorsTournamentJoin from './RockPaperScissorsTournamentJoin';
import {bindActionCreators} from 'redux';

require('./operations.scss');
require('./json-inspector.scss');

class TransactionConfirmModal extends React.Component {
  constructor() {
    super();
    this.state = {
      proposeCheckedStatus: false
    };
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.onConfirm();
    }
  }

  onClose() {
    this.props.clearTransaction();
  }

  onConfirm() {
    this.props.confirmTransaction(
      this.props.transactionFunction,
      this.props.functionArguments,
      this.props.transactionFunctionCallback
    );
  }

  onSelectPropose() {
    let proposeCheckedStatus = !!this.props.propose ? false : true;

    if(!proposeCheckedStatus) {
      this.props.setProposeAccount(null);
      this.setState({proposeCheckedStatus});
      return;
    }

    this.props.setProposeAccount(this.props.proposeAccount);
    this.setState({proposeCheckedStatus});
  }

  onPropose() {
    let {transactionFunction, functionArguments} = this.props;
    AccountRepository.fetchFullAccount(this.props.propose).then((obj) => {
      let transactionObject = this.props.transactionObject.propose({
        fee_paying_account:  obj[1].account.id
      });
      transactionObject.operations[0][1].expiration_time = parseInt(Date.now()/1000 + 86400);
      transactionObject.set_required_fees('1.3.0').then(() => {
        AssetRepository.fetchAssetsByIds([
          transactionObject.operations[0][1].fee.asset_id
        ]).then((assets) => {
          this.props.setTransaction('proposal_create', {
            type: this.props.transactionType,
            review_period_seconds: this.props.transactionObject.operations[0][1]
              .review_period_seconds,
            expiration_time: this.props.transactionObject.operations[0][1].expiration_time,
            proposed_operations: this.props.proposedOperation,
            fee_paying_account: this.props.propose,
            fee: {
              amount: transactionObject.operations[0][1].fee.amount,
              asset: assets[0]
            },
            transactionObject,
            transactionFunction,
            functionArguments
          });
        });
      });
    });
  }

  render() {
    let transaction, title;

    switch(this.props.transactionType) {
      case 'transfer':
        transaction = <Transfer />;
        title = <Translate content='transaction.trxTypes.transfer' />;
        break;
      case 'proposal_create':
        transaction = <CreateProposal />;
        title=<Translate content='transaction.trxTypes.proposal_create' />;
        break;
      case 'account_update':
        transaction = <AccountUpdate />;
        title=<Translate content='transaction.trxTypes.account_update' />;
        break;
      case 'limit_order_create':
        transaction = <LimitOrderCreate />;
        title=<Translate content='transaction.trxTypes.limit_order_create' />;
        break;
      case 'limit_order_cancel':
        transaction = <LimitOrderCancel />;
        title=<Translate content='transaction.trxTypes.limit_order_cancel' />;
        break;
      case 'account_upgrade':
        transaction = <AccountUpgrade />;
        title=<Translate content='transaction.trxTypes.account_upgrade' />;
        break;
      case 'balance_claim':
        transaction = <BalanceClaim />;
        title=<Translate content='transaction.trxTypes.balance_claim' />;
        break;
      case 'vesting_balance_withdraw':
        transaction = <VestingBalanceWithdraw />;
        title=<Translate content='transaction.trxTypes.vesting_balance_withdraw' />;
        break;
        /**
       * Games
       */
      case 'tournament_create':
        transaction = <RockPaperScissorsTournamentCreate />;
        title=<Translate content='transaction.trxTypes.tournament_create' />;
        break;
      case 'tournament_join':
        transaction = <RockPaperScissorsTournamentJoin />;
        title=<Translate content='transaction.trxTypes.tournament_join' />;
        break;
    }

    let buttons;

    switch(this.props.btnStatus) {
      case 'default':
        buttons = (
          <div className='ull-right'>
            <button type='button' className='btn btn-neutral2' onClick={ this.onClose.bind(this) }>
              <Translate content='cancel'/>
            </button>
            <button type='button' className='btn btn-success' onClick={ this.onConfirm.bind(this) }>
              <Translate content='transfer.confirm' />
            </button>
          </div>
        );
        break;
      case 'propose':
        buttons = (
          <div className='ull-right'>
            <button type='button' className='btn btn-neutral2' onClick={ this.onClose.bind(this) }>
              <Translate content='cancel'/>
            </button>
            <button type='button' className='btn btn-success' onClick={ this.onPropose.bind(this) }>
              <Translate content='propose' />
            </button>
          </div>
        );
        break;
      case 'loading':
        buttons = (
          <div className='ull-right'>
            <button className='btn btn-sbm pull-right btn-loader' type='button' disabled={ true }>
              <span className='loader loader-white loader-xs'/>
            </button>
          </div>
        );
        break;
      case 'done':
        buttons = (
          <div className='ull-right'>
            <button className='btn btn-sbm pull-right' onClick={ this.onClose.bind(this) }>
              <span className='loaderIcon icon-verify'/>
              <span className='btnText'>{counterpart.translate('buttons.done')}</span>
            </button>
          </div>
        );
        break;
      case 'error':
        buttons = (
          <div className='ull-right'>
            <button className='btn btn-sbm pull-right' onClick={ this.onClose.bind(this) }>
              <span className='loaderIcon icon-verify'/>
              <span className='btnText'><Translate content='transfer.close'/></span>
            </button>
          </div>
        );
        break;
    }

    let disabledProposeCheckbox = true;/*this.props.broadcasting || this.props.broadcastError
    || this.props.isConfirm || this.props.transactionType === 'proposal_create' ||
    this.props.transaction.memo_key;*/

    return (
      <Modal isOpen={ this.props.isOpen }>
        <ModalBody>
          <div className='modal-dialog'>
            <div className='modal-dialogAlignOut'>
              <div className='modal-dialogAlignIn'>
                <div className='modal-dialogContent'>
                  <div className='modalTitle'>
                    {
                      this.props.isConfirm
                        ? <Translate content='transaction.transaction_confirmed' />
                        : this.props.broadcastSuccess
                          ? <Translate content='transaction.broadcast_success' />
                          : this.props.broadcastError
                            ? <Translate content='transaction.broadcast_fail' />
                            : this.props.broadcasting
                              ? <Translate content='transaction.broadcasting' />
                              : <Translate content='transaction.confirm' />
                    }
                  </div>
                  {
                    this.props.broadcastError
                      ? <span className='error__hint'>
                        {this.props.broadcastError}
                      </span>
                      : null
                  }
                  <div className='mConf__content'>
                    <div className='mConf__title'>{title}</div>
                    {transaction}
                  </div>
                  <div className='modalFooter text_r'>
                    {
                      disabledProposeCheckbox
                        ? null
                        : <div className='switcher switcher-modalConfirm pull-left'>
                          <input
                            id='sw1'
                            type='checkbox'
                            className='switcher__value'
                            onChange={ this.onSelectPropose.bind(this) }
                            checked={ this.props.propose }
                          />
                          <label htmlFor='sw1' className='switcher__btn'></label>
                          <div className='switcher__barBox'>
                            <div className='switcher__bar'>
                              <div className='switcher__pipe'></div>
                            </div>
                          </div>
                          <ul className='switcher__labelList'>
                            <li><Translate content='propose' />:</li>
                          </ul>
                        </div>
                    }
                    {buttons}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    proposeAccount: state.account.currentAccount,
    isOpen: state.transactionConfirm.isOpen,
    transactionType: state.transactionConfirm.transactionType,
    transaction: state.transactionConfirm.transaction,
    transactionObject: state.transactionConfirm.transaction.transactionObject,
    transactionFunction: state.transactionConfirm.transaction.transactionFunction,
    transactionFunctionCallback: state.transactionConfirm.transaction.transactionFunctionCallback,
    functionArguments: state.transactionConfirm.transaction.functionArguments,
    propose: state.transactionConfirm.propose,
    proposedOperation: state.transactionConfirm.transaction.proposedOperation,
    broadcasting: state.transactionConfirm.broadcasting,
    broadcastSuccess: state.transactionConfirm.broadcastSuccess,
    broadcastError: state.transactionConfirm.broadcastError,
    isConfirm: state.transactionConfirm.isConfirm,
    btnStatus: state.transactionConfirm.btnStatus
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    clearTransaction: RTransactionConfirmActions.clearTransaction,
    setProposeAccount: RTransactionConfirmActions.setProposeAccount,
    confirmTransaction: RTransactionConfirmActions.confirmTransaction,
    setTransaction: RTransactionConfirmActions.setTransaction
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(TransactionConfirmModal);
