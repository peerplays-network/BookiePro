import React, { Component } from 'react';
import { BettingMarketGroupBanner } from '../Banners';
import { ComplexBettingWidget } from '../BettingWidgets/';
import Immutable from 'immutable';
import _ from 'lodash';
import { BettingModuleUtils } from '../../utility';
import { BettingMarketGroupPageActions, MarketDrawerActions } from '../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class BettingMarketGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      marketData: []
    }

    this.props.getData(this.props.params.objectId);
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.params.objectId !== this.props.params.objectId){
      this.props.getData(nextProps.params.objectId);
    }
  }

  render() {

    return (
      <div className='betting-market-group-wrapper'>
        <BettingMarketGroupBanner
          eventName={ this.props.eventName }
        />
        <ComplexBettingWidget
          eventName={ this.props.eventName }
          bettingMarketGroupName={ this.props.bettingMarketGroupName }
          marketData={ this.props.marketData }
          totalMatchedBetsAmount={ this.props.totalMatchedBetsAmount }
          createBet={ this.props.createBet }
          unconfirmedBets={ this.props.unconfirmedBets }
          currencyFormat={ this.props.currencyFormat }
        />
      </div>
    )
  }
}

// NOTE: this function is the refactored version of updateMarketData with minimal change, better to revisit later
// Convert data for ComplexBettingWidget
const createMarketData = (bettingMarkets, binnedOrderBooksByBettingMarketId) => {
  let marketData = Immutable.List();
  bettingMarkets.forEach((bettingMarket) => {
    const binnedOrderBook = binnedOrderBooksByBettingMarketId.get(bettingMarket.get('id'));
    let data = Immutable.Map();
    data = data.set('name', bettingMarket.get('payout_condition_string'));
    const aggregated_lay_bets = (binnedOrderBook && binnedOrderBook.get('aggregated_lay_bets')) || Immutable.List();
    const aggregated_back_bets = (binnedOrderBook && binnedOrderBook.get('aggregated_back_bets')) || Immutable.List();
    let offer = Immutable.Map({
      backIndex: 0,
      layIndex: 0,
      betting_market_id: bettingMarket.get('id'),
      backOrigin: aggregated_lay_bets.sort((a, b) => b.get('odds') - a.get('odds')),  //display in descending order, ensure best odd is in the first index
      layOrigin: aggregated_back_bets.sort((a, b) => a.get('odds') - b.get('odds'))  //display in ascending order, ensure best odd is in the first index
    })
    data = data.set('offer', offer);
    marketData = marketData.push(data);
  });
  return marketData;
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getData: BettingMarketGroupPageActions.getData,
    createBet: MarketDrawerActions.createBet,
  }, dispatch);
}

const mapStateToProps = (state, ownProps) => {

  const bettingMarketGroupId = ownProps.params.objectId;
  const bettingMarketGroupsById = state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
  const binnedOrderBooksByBettingMarketId = state.getIn(['binnedOrderBook', 'binnedOrderBooksByBettingMarketId']);
  const bettingMarketsById = state.getIn(['bettingMarket', 'bettingMarketsById']);
  const eventsById = state.getIn(['event', 'eventsById']);

  // Extract betting market group
  const bettingMarketGroup = bettingMarketGroupsById.get(bettingMarketGroupId);

  //NOTE using market_type_id to retrieve team name
  const bettingMarketGroupName = (bettingMarketGroup && bettingMarketGroup.get('market_type_id')) || '';

  // Extract event name
  const event = bettingMarketGroup && eventsById.get(bettingMarketGroup.get('event_id'));
  const eventName = (event && event.get('name')) || '';
  // Extract betting markets related to the betting market group
  const bettingMarketIds = (bettingMarketGroup && bettingMarketGroup.get('betting_market_ids')) || Immutable.List();
  let relatedBettingMarkets = Immutable.List();
  bettingMarketIds.forEach((bettingMarketId) => {
    const bettingMarket = bettingMarketsById.get(bettingMarketId);
    if (bettingMarket) relatedBettingMarkets = relatedBettingMarkets.push(bettingMarket);
  });
  // Create market data
  const marketData = createMarketData(relatedBettingMarkets, binnedOrderBooksByBettingMarketId);

  // Extract total Bets
  const totalMatchedBetsByMarketGroupId = state.getIn(['liquidity', 'totalMatchedBetsByBettingMarketGroupId']);

  //TODO migrate to curruencyUtil in next curruency related PR
  const totalMatchedBetsAssetId = totalMatchedBetsByMarketGroupId.getIn([bettingMarketGroupId, 'asset_id']);
  const totalMatchedBetsAsset = state.getIn(['asset','assetsById', totalMatchedBetsAssetId])

  const totalMatchedBetsAmount = BettingModuleUtils.getFormattedCurrency(
    totalMatchedBetsAsset ?
      totalMatchedBetsByMarketGroupId.getIn([bettingMarketGroupId, 'amount']) / Math.pow(10, totalMatchedBetsAsset.get('precision')) : 0,
    ownProps.currencyFormat,
    totalMatchedBetsAsset ? totalMatchedBetsAsset.get('precision') : 0 );


  const marketDrawer = state.get('marketDrawer');

  return {
    bettingMarketGroup,
    bettingMarkets: relatedBettingMarkets,
    marketData,
    eventName,
    bettingMarketGroupName,
    totalMatchedBetsAmount,
    unconfirmedBets: marketDrawer.get('unconfirmedBets'),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BettingMarketGroup);
