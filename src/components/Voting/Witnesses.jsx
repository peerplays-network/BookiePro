import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import {connect} from 'react-redux';
import AccountImage from '../Account/AccountImage';
import LinkToAccountById from '../Blockchain/LinkToAccountById';
import WitnessList from './WitnessList';
import FormattedAsset from '../Utility/FormattedAsset';
import Tooltip from './Tooltip';
import {VotingActions, RWalletUnlockActions, RTransactionConfirmActions} from '../../actions';
import AccountRepository from 'repositories/AccountRepository';
import Repository from 'repositories/chain/repository';
import moment from 'moment-timezone';
import {FormattedRelative} from 'react-intl';
import _ from 'lodash';
import {bindActionCreators} from 'redux';
class Witnesses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      witnesses: props.approvedWitnesseIds,
      prev_witnesses: props.approvedWitnesseIds,
      item_name_input: '',
      disabled: true,
      error: null,
      requestInProcess: false
    };

    this.uniqueRequestId = null;
    this.debounceOnInputChange = _.debounce(this.checkAccount.bind(this), 500);
  }

  checkAccount() {
    if (this.state.item_name_input.trim().length) {
      this.verifyInputValue(this.state.item_name_input.trim(), this.uniqueRequestId);
    } else {
      this.setState({requestInProcess: false, error: null});
    }
  }

  onInputChange(e) {
    this.uniqueRequestId = _.uniqueId();
    this.debounceOnInputChange();
    const GRAPHENE_MAX_ACCOUNT_NAME_LENGTH = 63;

    let value = e.target.value.trim().toLowerCase();

    if (value.length > GRAPHENE_MAX_ACCOUNT_NAME_LENGTH) {
      value = value.substring(0, GRAPHENE_MAX_ACCOUNT_NAME_LENGTH);
    }

    if(value.toLowerCase() === value) {
      this.setState({requestInProcess: true, item_name_input: value});
    }
  }

  verifyInputValue(value, uniqueRequestId) {
    this.setState({requestInProcess: true});

    AccountRepository.fetchFullAccount(value).then((result) => {
      if (!result) {
        throw 'Unknown account';
      }

      let account = result[1].account;

      if (this.uniqueRequestId === uniqueRequestId) {
        return this.validateAccount(account);
      }
    }).then((isWitness) => {
      if (isWitness) {
        throw isWitness;
      }

      if (this.uniqueRequestId === uniqueRequestId) {
        this.setState({error: null, requestInProcess: false});
      }
    }).catch((error) => {
      if (this.uniqueRequestId === uniqueRequestId) {
        this.setState({item_name_input: value, requestInProcess: false, error});
      }
    });
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.onAddSelectItem();
    }
  }

  onAddSelectItem() {
    let item = this.state.item_name_input;

    if (!item) {
      return;
    }

    if (this.state.error) {
      return;
    }

    Repository.getAccount(item).then((result) => {
      let id = result.get('id');

      return Repository.getWitnessById(id).then((witness) => {
        this.props.addNewWitnessData(witness.get('id'));
        this.onAddItem(id);
        this.props.fetchWitnessData();
      });
    });
    this.setState({item_name_input: ''});
  }

  onAddItem(item_id) {
    let witnesses = this.state.witnesses.set(item_id, item_id);

    this.setState({
      witnesses,
      disabled: this.checkWitnessesIsDiff(witnesses, this.state.prev_witnesses)
    });
  }

  onRemoveItem(item_id) {
    let witnesses = this.state.witnesses.filter((i) => i !== item_id);

    this.setState({
      witnesses,
      disabled: this.checkWitnessesIsDiff(witnesses, this.state.prev_witnesses)
    });
  }

  checkWitnessesIsDiff(witnesses, prev_witnesses) {
    let disabled = true;

    if (witnesses.size !== prev_witnesses.size) {
      disabled = false;
    } else {
      prev_witnesses.find((item) => {
        if (!witnesses.has(item)) {
          disabled = false;
          return true;
        }

        return false;
      });
    }

    return disabled;
  }

  validateAccount(account) {
    return Repository.getWitnessById(account.id).then((witness) => {
      return witness
        ? null
        : counterpart.translate('errors.not_witness');
    });
  }

  onResetChanges() {
    let witnesses = this.state.prev_witnesses;
    this.setState({witnesses, disabled: true});
  }

  onPublishChanges(walletLocked) {
    if (walletLocked && !this.props.walletIsOpen) {
      this.props.setWalletPosition(true);
    }

    if (walletLocked) {
      return;
    } else {
      this.props.publishWitnesses(this.state.witnesses).then((tr) => {
        return tr.set_required_fees('1.3.0').then(() => {
          return Repository.getAsset(tr.operations[0][1].fee.asset_id).then((asset) => {
            this.props.setTransaction('account_update', {
              account: this.props.account,
              transactionObject: tr,
              num_witnesses: this.state.witnesses.size,
              transactionFunction: VotingActions.holdTransaction,
              functionArguments: tr,
              transactionFunctionCallback: () => {
                this.setState({disabled: true});
              },
              proposedOperation: `Update account for ${this.props.account}`,
              fee: {
                amount: tr.operations[0][1].fee.amount,
                asset: asset.toJS()
              }
            });
          });
        });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.walletLocked !== this.props.walletLocked && !nextProps.walletLocked) {
      this.onPublishChanges(nextProps.walletLocked);
    }

    if (
      JSON.stringify(nextProps.approvedWitnesseIds) !==
      JSON.stringify(this.props.approvedWitnesseIds)
    ) {
      this.setState({
        witnesses: nextProps.approvedWitnesseIds,
        prev_witnesses: nextProps.approvedWitnesseIds
      });
    }
  }

  render() {
    let {
      account,
      activeWitnesseAccounts,
      currentWitnessAccount,
      asset,
      proxyIsEnabled
    } = this.props;

    let {
      witnesses,
      requestInProcess,
      item_name_input,
      error,
      disabled
    } = this.state;

    let precision = Math.pow(10, asset.precision);

    let votedActiveWitnesses = activeWitnesseAccounts
      .filter((a) => witnesses.has(a.id) && (a != null));
    let voted = votedActiveWitnesses.toArray().map((a) => {
      let {url, total_votes} = this.props.activeWitnesseObjects
        .filter((w) => w.witness_account === a.id).toArray()[0];

      let link = url && url.length > 0 && url.indexOf('http') === -1
        ? 'http://' + url
        : url;
      return (
        <div key={ a.id } className='tableRow'>
          <div className='tableCell'>
            <span className='picH32'><AccountImage
              size={ {
                height: 32,
                width: 32
              } }
              account={ a.name }
              custom_image={ null }/></span>
          </div>
          <div className='tableCell'><LinkToAccountById account={ a.id }/></div>
          <div className='tableCell'>
            <a href={ link } target='_blank'>{url.length < 45
              ? url
              : url.substr(0, 45) + '...'}</a>
          </div>
          <div className='tableCell text_r'>
            <FormattedAsset
              amount={ total_votes }
              asset={ asset.id }
              decimalOffset={ asset.precision }/> {asset.symbol}
          </div>
          <div className='tableCell text_r'>
            <button
              type='button'
              className='btn btn-remove'
              onClick={ this.onRemoveItem.bind(this, a.id) }>
              <Translate content={ 'votes.remove_witness' }/>
            </button>
          </div>
        </div>
      );
    });

    let unVotedActiveWitnesses = activeWitnesseAccounts
      .filter((a) => !witnesses.has(a.id) && (a != null));
    let unvoted = unVotedActiveWitnesses.toArray().map((a) => {
      let {url, total_votes} = this.props.activeWitnesseObjects
        .filter((w) => w.witness_account === a.id).toArray()[0];

      let link = url && url.length > 0 && url.indexOf('http') === -1
        ? 'http://' + url
        : url;
      return (
        <div key={ a.id } className='tableRow'>
          <div className='tableCell'>
            <span className='picH32'><AccountImage
              size={ {
                height: 32,
                width: 32
              } }
              account={ a.name }
              custom_image={ null }/></span>
          </div>
          <div className='tableCell'><LinkToAccountById account={ a.id }/></div>
          <div className='tableCell'>
            <a href={ link } target='_blank'>{url.length < 45
              ? url
              : url.substr(0, 45) + '...'}</a>
          </div>
          <div className='tableCell text_r'>
            <FormattedAsset
              amount={ total_votes }
              asset={ asset.id }
              decimalOffset={ asset.precision }/> {asset.symbol}
          </div>
          <div className='tableCell text_r'>
            <button
              type='button'
              className='btn btn-remove'
              onClick={ this.onAddItem.bind(this, a.id) }>
              <Translate content={ 'votes.add_witness' }/>
            </button>
          </div>
        </div>
      );
    });

    return (
      <div
        id='witnesses'
        className='tab__deploy'
        style={ {
          display: 'block'
        } }>
        <div className='tab__deployHead'>
          <div className='title'>
            <Translate content='votes.add_witness_label'/>
            <Tooltip
              text={ < Translate content = 'votes.witnesses_tab.question_mark_note' /> }/>
          </div>

          <Translate
            component='div'
            unsafe={ true }
            className='title__sm'
            content='votes.witnesses_tab.help_note_1'/>

          <div className='row'>
            <label className='label'><Translate content='votes.select_witness'/></label>
            <div className='fieldWrap col-7'>
              <span className='fieldPic2'>
                <AccountImage
                  size={ {
                    height: 33,
                    width: 33
                  } }
                  account={ item_name_input
                    ? item_name_input
                    : account }
                  custom_image={ null }/>
              </span>
              <input
                type='text'
                className={ `field field-type2 field-pic ${error
                  ? 'error'
                  : null}` }
                value={ item_name_input }
                onChange={ this.onInputChange.bind(this) }
                onKeyDown={ this.onKeyDown.bind(this) }
                placeholder={ counterpart.translate('account.name') }/>
              <button
                type='button'
                className='btn btn-floatedRight btn-voteHead'
                onClick={ this.onAddSelectItem.bind(this) }
                disabled={ error || item_name_input === '' || requestInProcess }>
                <Translate content='votes.add_witness'/>
              </button>
            </div>
            {error
              ? <span className='error__hint'>{error}</span>
              : null
            }
          </div>
        </div>
        <div className='box-inner box-inner-2'>
          {activeWitnesseAccounts.size
            ? <div className='table2__btns text_r'>
              <button
                type='button'
                className='btn btn-neutral'
                onClick={ this.onResetChanges.bind(this) }
                disabled={ disabled }>
                <Translate content='votes.reset_changes'/>
              </button>
              <button
                type='button'
                className='btn btn-success'
                onClick={ this.onPublishChanges.bind(this, this.props.walletLocked) }
                disabled={ disabled || proxyIsEnabled }>
                <Translate content='votes.publish'/>
              </button>
            </div>
            : null
          }

          {votedActiveWitnesses.size
            ? <div className='table__section'>
              <h2 className='h2'><Translate content='votes.w_approved_by' account={ account }/></h2>
              <div className='table table2 table-voting-witnesses'>
                <div className='table__head tableRow'>
                  <div className='tableCell'>&nbsp;</div>
                  <div className='tableCell'><Translate content='votes.name'/></div>
                  <div className='tableCell'><Translate content='votes.url'/></div>
                  <div className='tableCell text_r'><Translate content='votes.votes'/></div>
                  <div className='tableCell text_r'>
                    <div className='table__thAction'><Translate content='votes.action'/></div>
                  </div>
                </div>
                <div className='table__body'>
                  {voted}
                </div>
              </div>
            </div>
            : null
          }

          {unVotedActiveWitnesses.size
            ? <div className='table__section'>
              <h2 className='h2'>
                <Translate content='votes.w_not_approved_by' account={ account }/>
              </h2>
              <div className='table table2 table-voting-witnesses'>
                <div className='table__head tableRow'>
                  <div className='tableCell'>&nbsp;</div>
                  <div className='tableCell'><Translate content='votes.name'/></div>
                  <div className='tableCell'><Translate content='votes.url'/></div>
                  <div className='tableCell text_r'><Translate content='votes.votes'/></div>
                  <div className='tableCell text_r'>
                    <div className='table__thAction'><Translate content='votes.action'/></div>
                  </div>
                </div>
                <div className='table__body'>
                  {unvoted}
                </div>
              </div>
            </div>
            : null
          }
          <div className='limiter'></div>
          <div className='title pdl-inside'><Translate content='votes.witness_stats'/></div>
          <div className='assets__list'>
            <div className='assets__item col col-2'>
              <div className='assets__label'><Translate content='witnesses.current'/></div>
              <div className='assets__labeled'>{currentWitnessAccount
                ? currentWitnessAccount.name
                : null}</div>
            </div>
            <div className='assets__item col col-2'>
              <div className='assets__label'><Translate content='witnesses.active_witness'/></div>
              <div className='assets__labeled'>{this.props.witnessAmount}</div>
            </div>
            <div className='assets__item col col-2'>
              <div className='assets__label'><Translate content='witnesses.participation'/></div>
              <div className='assets__labeled'>{this.props.participation}%</div>
            </div>
            <div className='assets__item col col-2'>
              <div className='assets__label'><Translate content='witnesses.pay'/></div>
              <div className='assets__labeled mark'>
                {this.props.witnessPayPerBlock / precision}
                <div className='assets__unit'>{this.props.asset.symbol}</div>
              </div>
            </div>
            <div className='assets__item col col-2'>
              <div className='assets__label'><Translate content='witnesses.budget'/></div>
              <div className='assets__labeled mark'>{this.props.witnessBudget}
                <div className='assets__unit'>{this.props.asset.symbol}</div>
              </div>
            </div>
            <div className='assets__item col col-2 text_r'>
              <div className='assets__itemIn text_l'>
                <div className='assets__label'><Translate content='witnesses.next_vote'/></div>
                <span className='assets__labeled'>
                  {this.props.nextMaintenanceTime
                    ? <FormattedRelative
                      updateInterval={ 500 }
                      value={ parseInt(moment.utc(this.props.nextMaintenanceTime).format('x')) }
                      initialNow={ parseInt(moment.utc().format('x')) }/>
                    : 0
                  }
                </span>
              </div>
            </div>
          </div>
          <WitnessList/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account : state.app.account,
    currentWitnessAccount : state.voting.witnesses.currentWitnessAccount,
    witnessAmount : state.voting.witnesses.witnessAmount,
    participation : state.voting.witnesses.participation,
    witnessPayPerBlock : state.voting.witnesses.witnessPayPerBlock,
    asset : state.voting.witnesses.asset,
    witnessBudget : state.voting.witnesses.witnessBudget,
    nextMaintenanceTime : state.voting.witnesses.nextMaintenanceTime,
    approvedWitnesseIds : state.voting.witnesses.approvedWitnesseIds,
    activeWitnesseAccounts : state.voting.witnesses.activeWitnesseAccounts,
    activeWitnesseObjects : state.voting.witnesses.activeWitnesseObjects,
    proxyIsEnabled : state.voting.witnesses.proxyIsEnabled,
    walletLocked : state.wallet.locked,
    walletIsOpen : state.wallet.isOpen
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    setWalletPosition: RWalletUnlockActions.setWalletPosition,
    publishWitnesses: VotingActions.publishWitnesses,
    addNewWitnessData: VotingActions.addNewWitnessData,
    fetchWitnessData: VotingActions.fetchWitnessData,
    setTransaction: RTransactionConfirmActions.setTransaction
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Witnesses);
