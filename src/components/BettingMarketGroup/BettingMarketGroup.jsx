import React, { Component } from 'react';
import { BettingMarketGroupBanner } from '../Banners';
import { ComplexBettingWidget } from '../BettingWidgets/';
import Immutable from 'immutable';
import _ from 'lodash';
import { CurrencyUtils, StringUtils } from '../../utility';
import { BettingMarketGroupPageActions, MarketDrawerActions } from '../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';


const homeId = 0;
const awayId = 1;
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
      // Extract the current Betting Market Group Id the user is viewing
      // This is required to filter the data from all ongoing bets
      // TODO REVIEW feel free to replace this with a better method!
      const bettingMarketGroupId = window.location.href.split('/').pop();
      this.props.getPlacedBets(bettingMarketGroupId);
    }
  }

  render() {

    return (
      <div className='betting-market-group-wrapper'>
        <BettingMarketGroupBanner
          eventName={ this.props.eventName }
          eventTime={ this.props.eventTime }
        />
        <ComplexBettingWidget
          sportName={ this.props.sportName }
          eventName={ this.props.eventName }
          eventTime={ this.props.eventTime }
          bettingMarketGroup={ this.props.bettingMarketGroup }
          bettingMarketGroupName={ this.props.bettingMarketGroupName }
          marketData={ this.props.marketData }
          totalMatchedBetsAmount={ this.props.totalMatchedBetsAmount }
          createBet={ this.props.createBet }
          unconfirmedBets={ this.props.unconfirmedBets }
          currencyFormat={ this.props.currencyFormat }
          loadingStatus={ this.props.loadingStatus }
        />
      </div>
    )
  }
}

// NOTE: this function is the refactored version of updateMarketData with minimal change, better to revisit later
// Convert data for ComplexBettingWidget
const createMarketData = (bettingMarkets, binnedOrderBooksByBettingMarketId,
  bettingMarketGroup, homeName, awayName) => {

  let marketData = Immutable.List();
  bettingMarkets.forEach((bettingMarket, i) => {
    const binnedOrderBook = binnedOrderBooksByBettingMarketId.get(bettingMarket.get('id'));

    const marketTypeId = bettingMarketGroup.get('market_type_id');

    // TODO: REMOVE this once we have the real Blockchain
    // Using payout_condition_string as PLACEHOLDER in case of (dummy) data integrity issue
    let data = Immutable.Map().set('displayName', bettingMarket.get('payout_condition_string'))
      .set('name', bettingMarket.get('payout_condition_string'))
      .set('marketTypeId', marketTypeId)

    const homeSelection = homeName ? homeName : data.get('displayName')
    const awaySelection = awayName ? awayName : data.get('displayName')

    //parse market type id to get team name ( for first column in complex betting widget)
    if ( marketTypeId === 'Spread'){

      const margin = bettingMarketGroup.getIn(['options', 'margin']);
      if ( i === homeId ){
        const signedMargin = StringUtils.formatSignedNumber(margin);
        data = data.set('displayedName', homeSelection + signedMargin )
          .set('name', homeSelection)
          .set('marketTypeValue', signedMargin);
      } else if ( i === awayId ){
        const signedMargin = StringUtils.formatSignedNumber(margin*-1);
        data = data.set('displayedName', awaySelection + signedMargin)
          .set('name', awaySelection)
          .set('marketTypeValue', signedMargin);
      }

    } else if ( marketTypeId === 'OverUnder'){

      const score = bettingMarketGroup.getIn(['options', 'score']);
      if ( i === 0 ){
        data = data.set('displayedName', I18n.t('bettingMarketGroup.over') + score )
          .set('name', homeSelection)
          .set('marketTypeValue', I18n.t('bettingMarketGroup.over') + score);
      } else if ( i === 1 ){
        data = data.set('displayedName', I18n.t('bettingMarketGroup.under') + score )
          .set('name', awaySelection)
          .set('marketTypeValue', I18n.t('bettingMarketGroup.under') + score );
      }

    } else if ( marketTypeId === 'Moneyline'){
      data = data.set('marketTypeValue', marketTypeId); // Moneyline has no extra option 
      if ( i === homeId && homeName ){
        data = data.set('displayedName', homeSelection )
          .set('name', homeSelection);
      } else if ( i === awayId && awayName ){
        data = data.set('displayedName', awaySelection )
          .set('name', awaySelection);
      }

    }

    const aggregated_lay_bets = (binnedOrderBook && binnedOrderBook.get('aggregated_lay_bets')) || Immutable.List();
    const aggregated_back_bets = (binnedOrderBook && binnedOrderBook.get('aggregated_back_bets')) || Immutable.List();
    let offer = Immutable.Map({
      backIndex: 0,
      layIndex: 0,
      bettingMarketId: bettingMarket.get('id'),
      backOrigin: aggregated_lay_bets.sort((a, b) => b.get('odds') - a.get('odds')),  //display in descending order, ensure best odd is in the first index
      layOrigin: aggregated_back_bets.sort((a, b) => a.get('odds') - b.get('odds')),  //display in ascending order, ensure best odd is in the first index
      bettingMarketGroup: bettingMarketGroup,
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
    getPlacedBets: MarketDrawerActions.getPlacedBets,
  }, dispatch);
}

const mapStateToProps = (state, ownProps) => {

  const bettingMarketGroupId = ownProps.params.objectId;
  const bettingMarketGroupsById = state.getIn(['bettingMarketGroup', 'bettingMarketGroupsById']);
  const binnedOrderBooksByBettingMarketId = state.getIn(['binnedOrderBook', 'binnedOrderBooksByBettingMarketId']);
  const bettingMarketsById = state.getIn(['bettingMarket', 'bettingMarketsById']);
  const sportsById = state.getIn(['sport', 'sportsById']);
  const eventsById = state.getIn(['event', 'eventsById']);
  const competitorsById = state.getIn(['competitor', 'competitorsById']);

  //Extract loading status
  const loadingStatus = state.getIn(['bettingMarketGroupPage', 'loadingStatusByBettingMarketGroupId', bettingMarketGroupId]);

  // Extract betting market group
  const bettingMarketGroup = bettingMarketGroupsById.get(bettingMarketGroupId);

  //NOTE using market_type_id to retrieve team name
  let bettingMarketGroupName = (bettingMarketGroup && bettingMarketGroup.get('market_type_id')) || '';

  if ( bettingMarketGroupName === 'Spread'){
    bettingMarketGroupName = I18n.t('bettingMarketGroup.spread');
  } else if ( bettingMarketGroupName === 'OverUnder'){
    bettingMarketGroupName = I18n.t('bettingMarketGroup.overunder');
  } else if ( bettingMarketGroupName === 'Moneyline'){
    bettingMarketGroupName = I18n.t('bettingMarketGroup.moneyline');
  }

  // Extract event name
  const event = bettingMarketGroup && eventsById.get(bettingMarketGroup.get('event_id'));
  const eventName = (event && event.get('name')) || '';
  const eventTime = (event && event.get('start_time') && new Date(event.get('start_time'))) || new Date();

  // Extract home name and away name ( competitors)
  let homeName = ''
  let awayName = ''
  let sportName = ''

  if ( event){
    const homeCompetitorId = event.getIn(['scores', homeId, 'competitor_id']);
    const awayCompetitorId = event.getIn(['scores', awayId, 'competitor_id']);
    homeName = competitorsById.getIn([homeCompetitorId, 'name']);
    awayName = competitorsById.getIn([awayCompetitorId, 'name']);

    const sportId = competitorsById.getIn([homeCompetitorId, 'sport_id']);
    sportName = sportsById.getIn([sportId, 'name']);
  }

  // Extract betting markets related to the betting market group
  const bettingMarketIds = (bettingMarketGroup && bettingMarketGroup.get('betting_market_ids')) || Immutable.List();
  let relatedBettingMarkets = Immutable.List();
  bettingMarketIds.forEach((bettingMarketId) => {
    const bettingMarket = bettingMarketsById.get(bettingMarketId);
    if (bettingMarket) relatedBettingMarkets = relatedBettingMarkets.push(bettingMarket);
  });
  // Create market data
  const marketData = createMarketData(relatedBettingMarkets,
    binnedOrderBooksByBettingMarketId,
    bettingMarketGroup,
    homeName, awayName);

  // Extract total Bets
  const totalMatchedBetsByMarketGroupId = state.getIn(['liquidity', 'totalMatchedBetsByBettingMarketGroupId']);

  const totalMatchedBetsAssetId = totalMatchedBetsByMarketGroupId.getIn([bettingMarketGroupId, 'asset_id']);
  const totalMatchedBetsAsset = state.getIn(['asset','assetsById', totalMatchedBetsAssetId])

  const totalMatchedBetsAmount = CurrencyUtils.getFormattedCurrency(
    totalMatchedBetsAsset ?
      totalMatchedBetsByMarketGroupId.getIn([bettingMarketGroupId, 'amount']) / Math.pow(10, totalMatchedBetsAsset.get('precision')) : 0,
    ownProps.currencyFormat,
    totalMatchedBetsAsset ? totalMatchedBetsAsset.get('precision') : 0,
    true );

  const marketDrawer = state.get('marketDrawer');

  return {
    sportName,
    bettingMarketGroup,
    bettingMarkets: relatedBettingMarkets,
    marketData,
    eventName,
    eventTime,
    bettingMarketGroupName,
    totalMatchedBetsAmount,
    unconfirmedBets: marketDrawer.get('unconfirmedBets'),
    loadingStatus,
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BettingMarketGroup);
