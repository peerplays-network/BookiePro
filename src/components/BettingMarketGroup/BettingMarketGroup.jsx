import React, { Component } from 'react';
import { BettingMarketGroupBanner } from '../Banners';
// import ComplexBettingWidget from '../ComplexBettingWidget';
import ComplexBettingWidget2 from '../BettingWidget/ComplexBettingWidget2';
import Immutable from 'immutable';
import _ from 'lodash';
import moment from 'moment'; // TODO: Remove later. For hardcoded data only
import { BettingMarketGroupPageActions } from '../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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

    this.props.getData(this.props.params.objectId);
    this.updateMarketData = this.updateMarketData.bind(this);
    this.mergeObjectArrays = this.mergeObjectArrays.bind(this);
  }

  componentWillMount(){
  }

  componentWillReceiveProps(nextProps){

    if (nextProps.params.objectId !== this.props.params.objectId){
      this.setState({
        marketData: []
      })
      this.props.getData(nextProps.params.objectId);
    }

    // NOTE: this one is not needed, since the event should already available in redux store by the time user reaches this page
    // which means it can be extracted in mapStateToProps
    // ---------------------------------------------------------
    //when content of sidebar is ready, we could retrieve the event name directly I.e. without api call
    // if ( this.state.eventName === '' || nextProps.params.objectId !== this.props.params.objectId){
    //   const nested = Immutable.fromJS(nextProps.completeTree);
    //   var keyPath = findKeyPathOf(nested, 'children', (node => node.get('id') === this.props.params.objectId) );
    //
    //   if ( keyPath !==  undefined){
    //     this.setState({
    //       //retrive the event Node
    //       eventName: nested.getIn(keyPath.slice(0,5)).get('name')
    //     })
    //   }
    //
    // }

    if ( nextProps.binnedOrderBooks === null || !this.props.binnedOrderBooks.equals(nextProps.binnedOrderBooks)){
      this.updateMarketData(nextProps.bettingMarkets, nextProps.binnedOrderBooks)
    }

  }

  //merge two json object based on key value in javascript
  // modified based on soluton in
  //http://stackoverflow.com/questions/30093561/merge-two-json-object-based-on-key-value-in-javascript
  mergeObjectArrays (arr1, arr2, match1, match2) {
    return _.union(
      _.map(arr1, function (obj1) {
        var same = _.find(arr2, function (obj2) {
          return obj1[match1] === obj2[match2];
        });
        return same ? _.extend(obj1, same) : obj1;
      }),
      _.reject(arr2, function (obj2) {
        return _.find(arr1, function(obj1) {
          return obj2[match2] === obj1[match1];
        });
      })
    );
  }

  //update the data in table of complex betting widget
  updateMarketData(bettingMarkets, binnedOrderBooks){
    let marketData;
    try {
      marketData = this.mergeObjectArrays(bettingMarkets.toJS(), binnedOrderBooks.toJS(), 'id', 'betting_market_id');
      marketData.forEach(function (data, i) {
        data.name = data.payout_condition_string;

        data.offer = {
          'backIndex': 0,
          'layIndex': 0,
          'backOrigin': data.aggregated_lay_bets,
          'layOrigin': data.aggregated_back_bets
        }

        delete data.payout_condition_string;
        delete data.betting_market_id;
        delete data.aggregated_lay_bets;
        delete data.aggregated_back_bets;

      });
      this.setState({
        marketData
      })

    } catch(error){
      //assuming both aggregated_lay_bets and aggregated_back_bets are empty
      console.error('missing binnedOrderBooks in dummy data')
      marketData = bettingMarkets.toJS()
      marketData.forEach(function (data, i) {
        data.name = data.payout_condition_string;

        data.offer = {
          'backIndex': 0,
          'layIndex': 0,
          'backOrigin': [],
          'layOrigin': []
        }

        delete data.payout_condition_string;

      });
      this.setState({
        marketData
      })
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
  // Extract related binned order books
  let relatedBinnedOrderBooksByBettingMarketId = Immutable.Map();
  bettingMarketIds.forEach((bettingMarketId) => {
    const binnedOrderBook = binnedOrderBooksByBettingMarketId.get(bettingMarketId);
    if (binnedOrderBook) relatedBinnedOrderBooksByBettingMarketId = relatedBinnedOrderBooksByBettingMarketId.set(bettingMarketId, binnedOrderBook);
  })

  return {
    bettingMarketGroup,
    bettingMarkets: relatedBettingMarkets,
    binnedOrderBooks: relatedBinnedOrderBooksByBettingMarketId,
    eventName
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BettingMarketGroup);
