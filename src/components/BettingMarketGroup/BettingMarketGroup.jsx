import React, { Component } from 'react';
import { BettingMarketGroupBanner } from '../Banners';
// import ComplexBettingWidget from '../ComplexBettingWidget';
import ComplexBettingWidget2 from '../BettingWidget/ComplexBettingWidget2';
import Immutable from 'immutable';
import moment from 'moment'; // TODO: Remove later. For hardcoded data only
import { BettingMarketGroupPageActions } from '../../actions';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { findKeyPathOf } from '../../utility/TreeUtils'

// // dummy data -- bettting market groups
// {
//   "id": "1.104.43",
//   "event_id": "1.103.15",
//   "market_type_id": "Moneyline",
//   "options": {
//     "margin": 0,
//     "score": 5
//   },
//   "betting_market_ids": [
//     "1.105.85",
//     "1.105.86",
//     "1.105.223"
//   ]
// },


// // dummy data -- bettting market
// {
//   "id": "1.105.85",
//   "betting_market_group_id": "1.104.43",
//   "payout_condition_string": "Levski Sofia",
//   "bet_asset_type": "1.3.0"
// },
// {
//   "id": "1.105.86",
//   "betting_market_group_id": "1.104.43",
//   "payout_condition_string": "Academic Plovdiv",
//   "bet_asset_type": "1.3.0"
// },
// {
//   "id": "1.105.223",
//   "betting_market_group_id": "1.104.43",
//   "payout_condition_string": "The Draw",
//   "bet_asset_type": "1.3.0"
// },

// dummy data -- binned order books
// {
//   "betting_market_id": "1.105.85",
//   "aggregated_back_bets": [createOrderBookBin(3.1, 0.25), createOrderBookBin(3.25, 0.241)],
//   "aggregated_lay_bets": [createOrderBookBin(2.89, 0.769), createOrderBookBin(2.1, 0.22)]
// },
// {
//   "betting_market_id": "1.105.86",
//   "aggregated_back_bets": [createOrderBookBin(4.8, 0.59), createOrderBookBin(4.9, 0.19), createOrderBookBin(5.0, 0.19), createOrderBookBin(5.1, 0.19), createOrderBookBin(5.2, 0.19)],
//   "aggregated_lay_bets": [createOrderBookBin(1.44, 0.45), createOrderBookBin(1.43, 0.39), createOrderBookBin(1.42, 0.39), createOrderBookBin(1.41, 0.39), createOrderBookBin(1.40, 0.39)]
// },
// {
//   "betting_market_id": "1.105.223",
//   "aggregated_back_bets": [createOrderBookBin(4.8, 0.59)],
//   "aggregated_lay_bets": [createOrderBookBin(2.44, 0.45), createOrderBookBin(2.43, 0.39), createOrderBookBin(2.42, 0.39), createOrderBookBin(2.41, 0.39), createOrderBookBin(2.40, 0.39)]
// },

//////// HARDCODED DATA BEGINS //////////
const fakeData =
  Immutable.fromJS([
    {
      id: '1.999.1',
      time: moment().add(1, 'days').unix() * 1000,
      name: 'Zanarkand Abes vs Besaid Aurochs',
      offers: [
        {
          back: [{ odds: 3.85, price: 2.781 }, { odds: 2.31, price: 1.843 }],
          lay: [{ odds: 2.71, price: 1.89 }, { odds: 2.71, price: 1.89 } ]
        }
      ]
    }
  ])
///////// HARDCODED DATA ENDS  //////////

class BettingMarketGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eventName: '',
      marketData: []
    }
    this.updateMarketData = this.updateMarketData.bind(this);

  }


  componentDidMount(){
    this.props.getData(this.props.params.objectId);
  }

  componentWillReceiveProps(nextProps){

    if (nextProps.params.objectId !== this.props.params.objectId){
      this.props.getData(nextProps.params.objectId);
    }

    //when sidebar is ready, we could retrieve the event name directly

    if ( this.state.eventName === '' || nextProps.params.objectId !== this.props.params.objectId){
      const nested = Immutable.fromJS(nextProps.completeTree);
      var keyPath = findKeyPathOf(nested, 'children', (node => node.get('id') === this.props.params.objectId) );

      if ( keyPath !==  undefined){
        this.setState({
          //retrive the event Node
          eventName: nested.getIn(keyPath.slice(0,5)).get('name')
        })
      }

    }

    if ( !this.props.binnedOrderBooks.equals(nextProps.binnedOrderBooks)){
      this.updateMarketData(nextProps.bettingMarkets, nextProps.binnedOrderBooks)
    }

  }

  //update the data in table of complex betting widget
  updateMarketData(bettingMarkets, binnedOrderBooks){

  }

  // componentWillUpdate(nextProps, nextState){
  //
  // }

  render() {



    return (
      <div className='betting-market-group-wrapper'>
        <BettingMarketGroupBanner
          eventName={ this.state.eventName }
        />
        {/* <ComplexBettingWidget
          title='Test Title'
          events={ fakeData }
        /> */}
        <ComplexBettingWidget2
          title={ this.state.eventName }
          marketData={ this.state.marketData }
        />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getData: BettingMarketGroupPageActions.getData,
  }, dispatch);
}

const mapStateToProps = (state) => {
  const bettingMktGroupPage = state.get('bettingMarketGroupPage');
  const sidebar = state.get('sidebar');

  return {
    bettingMarketGroup: bettingMktGroupPage.get('bettingMarketGroup'),
    bettingMarkets: bettingMktGroupPage.get('bettingMarkets'),
    binnedOrderBooks: bettingMktGroupPage.get('binnedOrderBooks'),
    completeTree: sidebar.get('complete_tree'),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BettingMarketGroup);
