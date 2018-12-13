/*
 *  Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 *  The MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

import React from 'react';
import FormattedAsset from './FormattedAsset';
import ChainTypes from './ChainTypes';
import BindToChainState from './BindToChainState';
import utils from 'common/utils';
import MarketsActions from 'actions/MarketsActions';
import {ChainStore} from 'peerplaysjs-lib';
import connectToStores from 'alt/utils/connectToStores';
import MarketsStore from 'stores/MarketsStore';
import Translate from 'react-translate-component';

/**
 *  Given an asset amount, displays the equivalent value in baseAsset if possible
 *
 *  Expects three properties
 *  -'toAsset' which should be a asset id
 *  -'fromAsset' which is the asset id of the original asset amount
 *  -'amount' which is the amount to convert
 *  -'fullPrecision' boolean to tell if the amount uses the full precision of the asset
 */

@BindToChainState({keep_updating: true})
class ValueComponent extends React.Component {
    static propTypes = {
      toAsset: ChainTypes.ChainAsset.isRequired,
      fromAsset: ChainTypes.ChainAsset.isRequired
    };

    static defaultProps = {
      toAsset: '1.3.0',
      fullPrecision: true,
      noDecimals: false
    };

    constructor() {
      super();
      this.fromStatsInterval = null;
      this.toStatsInterval = null;
    }

    componentWillMount() {
      let coreAsset = ChainStore.getAsset('1.3.0');

      if (coreAsset) {
        if (this.props.fromAsset.get('id') !== coreAsset.get('id')) {
          MarketsActions.getMarketStats(coreAsset, this.props.fromAsset);
          this.fromStatsInterval = setInterval(
            MarketsActions.getMarketStats.bind(this, coreAsset, this.props.fromAsset), 5 * 60 * 1000
          );
        }

        if (this.props.toAsset.get('id') !== coreAsset.get('id')) {
          // wrap this in a timeout to prevent dispatch in the middle of a dispatch
          setTimeout(() => {
            MarketsActions.getMarketStats.bind(this, coreAsset, this.props.toAsset);
            this.toStatsInterval = setInterval(
              MarketsActions.getMarketStats.bind(this, coreAsset, this.props.toAsset), 5 * 60 * 1000
            );
          }, 150);
        }
      }
    }

    componentWillUnmount() {
      clearInterval(this.fromStatsInterval);
      clearInterval(this.toStatsInterval);
    }

    getValue() {
      let {amount, toAsset, fromAsset, fullPrecision, marketStats} = this.props;
      let coreAsset = ChainStore.getAsset('1.3.0');
      let toStats, fromStats;
      let toID = toAsset.get('id');
      let toSymbol = toAsset.get('symbol');
      let fromID = fromAsset.get('id');
      let fromSymbol = fromAsset.get('symbol');

      if (!fullPrecision) {
        amount = utils.get_asset_amount(amount, fromAsset);
      }

      if (coreAsset && marketStats) {
        let coreSymbol = coreAsset.get('symbol');

        toStats = marketStats.get(toSymbol + '_' + coreSymbol);
        fromStats = marketStats.get(fromSymbol + '_' + coreSymbol);
      }

      let price = utils.convertPrice(
        fromStats && fromStats.close
          ? fromStats.close
          : fromAsset, toStats
        && toStats.close
          ? toStats.close
          : toAsset, fromID, toID
      );

      return utils.convertValue(price, amount, fromAsset, toAsset);
    }

    render() {
      let {amount, toAsset, fromAsset, fullPrecision, marketStats} = this.props;
      let coreAsset = ChainStore.getAsset('1.3.0');
      let toStats, fromStats;

      let toID = toAsset.get('id');
      let toSymbol = toAsset.get('symbol');
      let fromID = fromAsset.get('id');
      let fromSymbol = fromAsset.get('symbol');

      if (!fullPrecision) {
        amount = utils.get_asset_amount(amount, fromAsset);
      }

      if (coreAsset && marketStats) {
        let coreSymbol = coreAsset.get('symbol');

        toStats = marketStats.get(toSymbol + '_' + coreSymbol);
        fromStats = marketStats.get(fromSymbol + '_' + coreSymbol);
      }

      let price = utils.convertPrice(
        fromStats && fromStats.close
          ? fromStats.close
          : fromID === '1.3.0'
            ? fromAsset
            : null,
        toStats && toStats.close
          ? toStats.close
          : toID === '1.3.0'
            ? toAsset
            : null,
        fromID,
        toID
      );

      let eqValue = price ? utils.convertValue(price, amount, fromAsset, toAsset) : null;

      if (!eqValue) {
        return (
          <span style={ {fontSize: '0.9rem'} }><Translate content='account.no_price' /></span>
        );
      }

      return (
        <FormattedAsset
          amount={ eqValue }
          asset={ toID }
          decimalOffset={ this.props.noDecimals
            ? toAsset.get('precision')
            : 0
          }
        />
      );
    }
}

@connectToStores
class ValueStoreWrapper extends React.Component {
  static getStores() {
    return [MarketsStore];
  };

  static getPropsFromStores() {
    return {
      marketStats: MarketsStore.getState().allMarketStats
    };
  };

  render() {
    return <ValueComponent { ...this.props } />;
  }
}


@BindToChainState({keep_updating: true})
class BalanceValueComponent extends React.Component {

    static propTypes = {
      balance: ChainTypes.ChainObject.isRequired
    }

    render() {
      let amount = Number(this.props.balance.get('balance'));
      let fromAsset = this.props.balance.get('asset_type');

      return (
        <ValueStoreWrapper
          amount={ amount }
          fromAsset={ fromAsset }
          noDecimals={ true }
          toAsset={ this.props.toAsset }
        />
      );
    }
}

ValueStoreWrapper.BalanceValueComponent = BalanceValueComponent;
export default ValueStoreWrapper;
