//unused
import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import {connect} from 'react-redux';
import utils from 'common/utils';
import {VotingActions, RTransactionConfirmActions, RWalletUnlockActions} from '../../actions';
import Repository from 'repositories/chain/repository';
import {bindActionCreators} from 'redux';

class Proposals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showExpired: false,
      proposals: props.proposals,
      votes: props.votes
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.proposals && !this.props.proposals) {
      this.setState({
        proposals: nextProps.proposals
      });
    }

    if (nextProps.votes && !this.props.votes) {
      this.setState({
        votes: nextProps.votes
      });
    }

    if (nextProps.walletLocked !== this.props.walletLocked) {
      this.onPublish(nextProps.walletLocked);
    }
  }

  onToggleExpired() {
    let showExpired = !this.state.showExpired;
    this.setState({showExpired});
  }

  onApprove(obj) {
    let {proposals} = this.state;
    let approvedProposal = proposals.filter((p) => p.id === obj.id)[0];

    approvedProposal.approval = approvedProposal
      ? counterpart.translate('account.votes.status.supported')
      : approvedProposal.approval;

    proposals = proposals.filter((p) => p.id !== obj.id).concat(approvedProposal);

    let {votes} = this.state;
    let addVotes = [], removeVotes = [];

    if (votes.has(obj.vote_against)) {
      removeVotes.push(obj.vote_against);
    }

    if (!votes.has(obj.vote_for)) {
      addVotes.push(obj.vote_for);
    }

    if (addVotes.length) {
      addVotes.forEach((vote) => {
        votes = votes.add(vote);
      });

    }

    if (removeVotes) {
      removeVotes.forEach((vote) => {
        votes = votes.delete(vote);
      });
    }

    this.setState({votes, proposals});
  }

  onReject(obj) {
    let {proposals} = this.state;
    let approvedProposal = proposals.filter((p) => p.id === obj.id)[0];

    approvedProposal.approval = approvedProposal
      ? counterpart.translate('account.votes.status.neutral')
      : approvedProposal.approval;

    proposals = proposals.filter((p) => p.id !== obj.id).concat(approvedProposal);

    let {votes} = this.state;
    let addVotes = [], removeVotes = [];

    if (votes.has(obj.vote_against)) {
      removeVotes.push(obj.vote_against);
    }

    if (votes.has(obj.vote_for)) {
      removeVotes.push(obj.vote_for);
    }

    if (addVotes.length) {
      addVotes.forEach((vote) => {
        votes = votes.add(vote);
      });
    }

    if (removeVotes) {
      removeVotes.forEach((vote) => {
        votes = votes.delete(vote);
      });
    }

    this.setState({votes, proposals});
  }

  onReset() {
    this.setState({
      proposals: this.props.proposals
    });
  }

  onPublish(walletLocked) {
    if (walletLocked && !this.props.walletIsOpen) {
      this.props.setWalletPosition(true);
    }

    if (walletLocked) {
      return;
    } else {
      this.props.publishProposals(this.state.votes).then((tr) => {
        tr.set_required_fees('1.3.0').then(() => {
          Repository.getAsset(tr.operations[0][1].fee.asset_id).then((asset) => {
            this.props.setTransaction('account_update', {
              account: this.props.currentAccount,
              transactionObject: tr,
              transactionFunction: VotingActions.holdTransaction,
              functionArguments: tr,
              errorCallback: () => {
                this.setState({proposals: this.props.proposals});
              },
              proposedOperation: `Update account for ${this.props.currentAccount}`,
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

  render() {
    let expired = this.state.proposals
      ? this.state.proposals.filter((p) => p.isExpired === true)
      : null;
    let expiredRows = expired && expired[0] ? expired.map((row) => {
      return (
        <div key={ row.id } className='tableRow'>
          <div className='tableCell'>
            {row.name}
            <span className='tableCell__desc'>{row.startDate} - {row.endDate}</span>
          </div>
          <div className='tableCell'>{row.creator}</div>
          <div className='tableCell text_r'>{row.netVotes} {row.assetSymbol}</div>
          <div className='tableCell text_r'>{row.dailyPay} {row.assetSymbol}</div>
          <div className='tableCell text_r'>
            {
              row.unclaimedPay
                ? `${row.unclaimedPay} ${row.assetSymbol}`
                : row.recycled
                  ? `(${row.recycled} ${row.assetSymbol})`
                  : `0 ${row.assetSymbol}`
            }
          </div>
          <div className='tableCell text_r'>{utils.format_number(row.fundedPercent, 2)}%</div>
          <div className='tableCell'>{row.approval}</div>
          <div className='tableCell text_r'>
            {
              (row.approval === 'Neutral') || (row.approval === 'Rejected')
                ? <button
                  type='button'
                  className='btn btn-proposal'
                  onClick={ this.onApprove.bind(this, row) }>
                  <Translate content='account.votes.approve_worker' />
                </button>
                : <button
                  type='button'
                  className='btn btn-proposal'
                  onClick={ this.onReject.bind(this, row) }>
                  <Translate content='account.votes.reject_worker' />
                </button>
            }
          </div>
        </div>
      );
    })
      : null;

    let rows = this.state.proposals
      ? this.state.proposals.filter((p) => p.isExpired === false).map((row, index) => {
        return (
          <div key={ row.id } className='tableRow'>
            <div className='tableCell'>
              <div className={ `rank__btn ${row.fundedPercent > 0 ? 'pos' : 'neg'}` }>#{index + 1}
              </div>
            </div>
            <div className='tableCell'>
              {row.name}
              <span className='tableCell__desc'>{row.startDate} - {row.endDate}</span>
            </div>
            <div className='tableCell'>{row.creator}</div>
            <div className='tableCell text_r'>{row.netVotes} {row.assetSymbol}</div>
            <div className='tableCell text_r'>{row.dailyPay} {row.assetSymbol}</div>
            <div className='tableCell text_r'>
              {
                row.unclaimedPay
                  ? `${row.unclaimedPay} ${row.assetSymbol}`
                  : row.recycled
                    ? `(${row.recycled} ${row.assetSymbol})`
                    : `0 ${row.assetSymbol}`
              }
            </div>
            <div className='tableCell text_r'>{utils.format_number(row.fundedPercent, 2)}%</div>
            <div className='tableCell'>{row.approval}</div>
            <div className='tableCell text_r'>
              {(row.approval === 'Neutral') || (row.approval === 'Rejected')
                ? <button
                  type='button'
                  className='btn btn-proposal'
                  onClick={ this.onApprove.bind(this, row) }>
                  <Translate content='account.votes.approve_worker' />
                </button>
                : <button
                  type='button'
                  className='btn btn-proposal'
                  onClick={ this.onReject.bind(this, row) }>
                  <Translate content='account.votes.reject_worker' />
                </button>
              }
            </div>
          </div>
        );
      })
      : null;

    return (
      <div id='proposals' className='tab__deploy block'>
        <div className='tab__deployHead'>
          <div className='title'><Translate content='account.votes.proposals.title' /></div>
          <div className='row'>
            <div className='col col-7 col-offset-05'>
              <p>&nbsp;
              </p>
            </div>
            <div className='col col-5 col-offset-05 text_r'>
              <div className='col col-6'>
                <strong className='tab__qty'>
                  {this.props.totalBudget} {this.props.assetSymbol}
                </strong>
                <span className='tab__qtyDesc'>
                  <Translate content='account.votes.total_budget' />
                </span>
              </div>
              <div className='col col-6'>
                <strong className='tab__qty'>
                  {this.props.unusedBudget} {this.props.assetSymbol}
                </strong>
                <span className='tab__qtyDesc'>
                  <Translate content='account.votes.unused_budget' />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='box-inner box-inner-2'>
          <div className='table table2 table-voting-proposals'>
            <div className='table__head tableRow'>
              <div className='tableCell'>
                <Translate content='account.votes.proposals.rank' />
              </div>
              <div className='tableCell'>
                <Translate content='account.votes.proposals.description' />
              </div>
              <div className='tableCell'>
                <Translate content='account.votes.proposals.creator' />
              </div>
              <div className='tableCell text_r'>
                <Translate content='account.votes.proposals.net_votes' />
              </div>
              <div className='tableCell text_r'>
                <Translate content='account.votes.proposals.pay' />
              </div>
              <div className='tableCell text_r'>
                <Translate content='account.votes.proposals.unclaimed_pay' />
              </div>
              <div className='tableCell text_r'>
                <Translate content='account.votes.proposals.funding' />
              </div>
              <div className='tableCell'>
                <Translate content='account.votes.proposals.status' />
              </div>
              <div className='tableCell'> </div>
            </div>
            <div className='table__body'>
              {rows}
            </div>
          </div>
          <div className='limiter'></div>
          <div className='table2__btns noXPad text_r'>
            <button
              type='button'
              className='btn btn-neutral fl_l'
              onClick={ this.onToggleExpired.bind(this) }
            >
              {
                this.state.showExpired
                  ? <Translate content='account.votes.proposals.hide_expired' />
                  : <Translate content='account.votes.proposals.show_expired' />
              }
            </button>
            <button type='button' className='btn btn-neutral' onClick={ this.onReset.bind(this) }>
              <Translate content='account.votes.reset_changes' />
            </button>
            <button
              type='button'
              className='btn btn-success'
              onClick={ this.onPublish.bind(this, this.props.walletLocked) }>
              <Translate content='account.votes.publish' />
            </button>
          </div>
          {
            this.state.showExpired
              ? [
                <div key='limiter' className='limiter'></div>,
                <div key='expiredTable' className='table table2 table-voting-proposals'>
                  <div className='table__head tableRow'>
                    <div className='tableCell'>
                      <Translate content='account.votes.proposals.description' />
                    </div>
                    <div className='tableCell'>
                      <Translate content='account.votes.proposals.creator' />
                    </div>
                    <div className='tableCell text_r'>
                      <Translate content='account.votes.proposals.net_votes' />
                    </div>
                    <div className='tableCell text_r'>
                      <Translate content='account.votes.proposals.pay' />
                    </div>
                    <div className='tableCell text_r'>
                      <Translate content='account.votes.proposals.unclaimed_pay' />
                    </div>
                    <div className='tableCell text_r'>
                      <Translate content='account.votes.proposals.funding' />
                    </div>
                    <div className='tableCell'>
                      <Translate content='account.votes.proposals.status' />
                    </div>
                    <div className='tableCell'> </div>
                  </div>
                  <div className='table__body'>
                    {expiredRows}
                  </div>
                </div>
              ]
              : null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    proposals: state.voting.proposals.list,
    totalBudget: state.voting.proposals.budget.total,
    unusedBudget: state.voting.proposals.budget.unused,
    assetSymbol: state.voting.proposals.budget.assetSymbol,
    votes: state.voting.proposals.votes,
    walletLocked: state.wallet.locked,
    walletIsOpen: state.wallet.isOpen
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    setWalletPosition: RWalletUnlockActions.setWalletPosition,
    publishProposals: VotingActions.publishProposals,
    setTransaction: RTransactionConfirmActions.setTransaction
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Proposals);
