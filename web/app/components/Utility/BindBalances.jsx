import BindToChainState from '../Utility/BindToChainState';
import {connect} from 'react-redux';
import React from 'react';
import ChainTypes from 'components/Utility/ChainTypes';
import Immutable from 'immutable';

@connect(
  (state)=>{
    return {
      unit : state.settings.unit,
      marketStats: state.market.allMarketStats
    };
  }
)
@BindToChainState({keep_updating: true})
class BindBalances extends React.Component {
    static propTypes = {
      balances: ChainTypes.ChainObjectsList
    };

    render(){
      let {balances, unit} = this.props,
        assets = Immutable.List(),
        amounts = [];

      unit = unit || '1.3.0';

      balances.forEach((balance) => {
        if (balance) {
          assets = assets.push(balance.get('asset_type'));
          amounts.push({
            asset_id: balance.get('asset_type'),
            amount: parseInt(balance.get('balance'), 10)
          });
        }
      });


      return (
        <BindAssets { ...this.props } balances={ amounts } fromAssets={ assets } toAsset={ unit } />
      );
    }

}

@BindToChainState({keep_updating: true})
class BindAssets extends React.Component {
    static propTypes = {
      fromAssets: ChainTypes.ChainAssetsList.isRequired,
      toAsset: ChainTypes.ChainAsset.isRequired,
    };

    render() {
      let Component = this.props.component;

      return (
        <Component { ...this.props } />
      );
    }
}

export default BindBalances;