import React, { Component } from 'react';
import { BettingMarketGroupBanner } from '../Banners';
// import ComplexBettingWidget from '../ComplexBettingWidget';
import ComplexBettingWidget2 from '../BettingWidget/ComplexBettingWidget2';
import Immutable from 'immutable';
import _ from 'lodash';
// import moment from 'moment'; // TODO: Remove later. For hardcoded data only
import { BettingMarketGroupPageActions } from '../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//////// HARDCODED DATA BEGINS //////////
// const fakeData =
//   Immutable.fromJS([
//     {
//       id: '1.999.1',
//       time: moment().add(1, 'days').unix() * 1000,
//       name: 'Zanarkand Abes vs Besaid Aurochs',
//       offers: [
//         {
//           back: [{ odds: 3.85, price: 2.781 }, { odds: 2.31, price: 1.843 }],
//           lay: [{ odds: 2.71, price: 1.89 }, { odds: 2.71, price: 1.89 } ]
//         }
//       ]
//     }
//   ])
///////// HARDCODED DATA ENDS  //////////

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
        {/* <ComplexBettingWidget
          title='Test Title'
          events={ fakeData }
        /> */}
        <ComplexBettingWidget2
          eventName={ this.props.eventName }
          marketData={
            /*TODO: don't user toJS here but update the selector of ComplexBettingWidget2 to support immutable instead*/
            this.props.marketData.toJS() }
        />
      </div>
    )
  }
}

// NOTE: this function is the refactored version of updateMarketData with minimal change, better to revisit later
// Convert data for ComplexBettingWidget2
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
      backOrigin: aggregated_lay_bets,
      layOrigin: aggregated_back_bets
    })
    data = data.set('offer', offer);
    marketData = marketData.push(data);
  });
  return marketData;
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getData: BettingMarketGroupPageActions.getData,
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

  return {
    bettingMarketGroup,
    bettingMarkets: relatedBettingMarkets,
    marketData,
    eventName
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BettingMarketGroup);
