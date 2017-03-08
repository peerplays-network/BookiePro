import React, { Component } from 'react';
import { Table, Button, Icon } from 'antd';
import { ChainTypes, BindToChainState, BlockchainUtils } from '../../utility';
import _ from 'lodash';
import { ChainStore, PrivateKey, TransactionBuilder } from 'graphenejs-lib';

class OddsOrStakeCell extends Component {
  static propTypes = {
    amount: React.PropTypes.number,
    asset: ChainTypes.ChainAsset.isRequired
  }

  render() {
    const value = BlockchainUtils.get_asset_amount(this.props.amount, this.props.asset);
    return (
      <span>{ value }</span>
    );
  }
}
const BindedOddsOrStakeCell = BindToChainState()(OddsOrStakeCell);

class ProfitLiabilityCell extends Component {
  static propTypes = {
    oddsAmount: React.PropTypes.number,
    oddsAsset: ChainTypes.ChainAsset.isRequired,
    stakeAmount: React.PropTypes.number,
    stakeAsset: ChainTypes.ChainAsset.isRequired,
  }

  render() {
    const odds = BlockchainUtils.get_asset_amount(this.props.oddsAmount, this.props.oddsAsset);
    const stake = BlockchainUtils.get_asset_amount(this.props.stakeAmount, this.props.stakeAsset);
    return (
      <span>{Math.round(((odds * stake) - stake) * 100) / 100}</span>
    );
  }
}
const BindedProfitLiabilityCell = BindToChainState()(ProfitLiabilityCell);



class UnmatchedBets extends Component {
  static propTypes = {
    allOpenOrders: ChainTypes.ChainObjectsList.isRequired,
    coreAsset: ChainTypes.ChainAsset.isRequired
  };

  static defaultProps = {
    allOpenOrders: [],
    coreAsset: '1.3.0'
  };

  constructor(props) {
    super(props);
    this.state = {
      orderCancelInProgressList: []
    };
    this._calculateTotalMoneyOnUnmatchedBets = this._calculateTotalMoneyOnUnmatchedBets.bind(this);
    this._processTransaction = this._processTransaction.bind(this);
    this._cancelOrder = this._cancelOrder.bind(this);
    this._getColumns = this._getColumns.bind(this);
  }

  _getColumns() {

    return [{
      title: 'Event Time',
      render: (text, record, index) => {
        return <span>{ record.get('id') }</span>
      }
    }, {
      title: 'Event',
      render: (text, record, index) => {
        return <span>{ record.get('id').split('.')[2] }</span>
      }
    }, {
      title: 'Type',
      render: (text, record, index) => {
        return <span>{ record.get('id').split('.')[1] }</span>
      }
    }, {
      title: 'Sport',
      render: (text, record, index) => {
        return <Icon type='rocket' />
      }
    }, {
      title: 'Odds',
      render: (text, record, index) => {
        let odds = BlockchainUtils.get_odds_of_order(record);
        return (<BindedOddsOrStakeCell amount={ odds.get('amount') } asset={ odds.get('asset_id') } />);
      }
    }, {
      title: 'Stake(B)',
      render: (text, record, index) => {
        let stake = BlockchainUtils.get_stake_of_order(record);
        return (<BindedOddsOrStakeCell amount={ stake.get('amount') } asset={ stake.get('asset_id') } />);
      }
    }, {
      title: 'Profit / Liability(B)',
      render: (text, record, index) => {
        let odds = BlockchainUtils.get_odds_of_order(record);
        let stake = BlockchainUtils.get_stake_of_order(record);
        return (
          <BindedProfitLiabilityCell
            oddsAmount={ odds.get('amount') }
            oddsAsset={ odds.get('asset_id') }
            stakeAmount={ stake.get('amount') }
            stakeAsset={ stake.get('asset_id') }
            />
        );
      }
    }, {
      key: 'cancel',
      render: (text, record, index) => {
        const orderId = record.get('id');
        const onClick = () => {
          this._cancelOrder(orderId);
        }
        const disabled = _.includes(this.state.orderCancelInProgressList, orderId);
        return <Button onClick={ onClick } disabled={ disabled } >Cancel</Button>
      }
    }];
  }

  _getUnmatchedBets() {
    return _.filter(this.props.allOpenOrders, (order) => {
      if (!order) return false;
      return order.getIn(['sell_price', 'base', 'asset_id']) === '1.3.0' ||
      order.getIn(['sell_price', 'quote', 'asset_id']) === '1.3.0';
    });
  }

  _cancelOrder(orderId) {
    const accountId = '1.2.153075'; // this is ii-5 account id
    const feeId = '1.3.0'; // this is core asset (BTS)

    // Create transaction and add operation
    const tr = new TransactionBuilder();
    const operationParams = {
      fee: {
        amount: 0,
        asset_id: feeId,
      },
      fee_paying_account: accountId,
      order: orderId,
    };
    tr.add_type_operation('limit_order_cancel', operationParams);

    // Add order id to order in progress list, this disable the Button
    this.setState((prevState) => {
      return { orderCancelInProgressList: _.concat(prevState.orderCancelInProgressList, orderId) }
    });
    // Process transaction
    this._processTransaction(tr, () => {
      // Remove order id from order in progress list, this enable back the button
      this.setState((prevState) => {
        return { orderCancelInProgressList: _.remove(prevState.orderCancelInProgressList) }
      });
    });
  }

  _processTransaction(tr, callback) {
    // In this case, both public key and private key are hardcoded
    const ii5PublicKeys = ['BTS76Ht7MbK6hDqGSdJvXnrmmUU2v9XfNZRJVaf6E4mAHUpCcfc8G'];
    const ii5PrivateKeys = {
      'BTS76Ht7MbK6hDqGSdJvXnrmmUU2v9XfNZRJVaf6E4mAHUpCcfc8G': PrivateKey.fromWif('5JxYc27FySQWqacFWogGqTjuV6mhVoceao5bZFTsJ3v9kTgK8Hj')
    };

    // Set required fees
    tr.set_required_fees().then(() => {
      // Get potential signatures
      // Inside, it's trying to ask the blockchain based on the seller account id attached in the transaction
      return tr.get_potential_signatures();
    }).then(({ pubkeys }) => {
      // Check if none of the potential public keys is equal to our public keys
      const myPubKeys = _.intersection(pubkeys, ii5PublicKeys);
      if (_.isEmpty(myPubKeys)) {
        throw new Error('No Potential Signatures');
      }
      // Filter potential signatures to get required keys needed to sign the transaction
      return tr.get_required_signatures(myPubKeys);
    }).then((requiredPubKeys) => {
      _.forEach(requiredPubKeys, (requiredPubKey) => {
        // Get private key pair
        const requiredPrivKey = ii5PrivateKeys[requiredPubKey];
        // Add signature
        tr.add_signer(requiredPrivKey, requiredPubKey);
      });
      // Broadcast transaction
      return tr.broadcast()
    }).then((res) => {
      console.log('PROCESSING TRANSACTION SUCCESS', res);
      callback(true);
    }).catch((error) => {
      console.error('PROCESSING TRANSACTION FAIL', error);
      callback(false);
    });
  }

  _calculateTotalMoneyOnUnmatchedBets(unmatchedBets) {
    let total = 0; // Total in satoshi
    _.forEach(unmatchedBets, (unmatchedBet) => {
      let stake = BlockchainUtils.get_stake_of_order(unmatchedBet);
      total += stake.get('amount');
    });
    const coreAsset = ChainStore.getAsset('1.3.0');
    // Convert from satoshi amount to correct precision
    return BlockchainUtils.get_asset_amount(total, coreAsset);

  }

  render() {
    const unmatchedBets = this._getUnmatchedBets();
    const columns = this._getColumns();
    let totalMoneyOnUnmatchedBets = this._calculateTotalMoneyOnUnmatchedBets(unmatchedBets);
    return (
      <div className='unmatched-bets'>
        <div>
          {`TOTAL: $${totalMoneyOnUnmatchedBets}`}
        </div>
        <Table pagination={ false } dataSource={ unmatchedBets } columns={ columns } rowKey={ record => record.get('id') } />
      </div>
    );
  }
}

const BindedUnmatchedBets = BindToChainState()(UnmatchedBets);

export default BindedUnmatchedBets;
