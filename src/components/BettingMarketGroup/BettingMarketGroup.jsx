import React, { PureComponent } from 'react';
import { BettingMarketGroupBanner } from '../Banners';
import { ComplexBettingWidget } from '../BettingWidgets/';
import _ from 'lodash';
import { BettingMarketGroupPageSelector, MarketDrawerSelector } from '../../selectors';
import { BettingMarketGroupPageActions, MarketDrawerActions } from '../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PeerPlaysLogo from '../PeerPlaysLogo';

class BettingMarketGroup extends PureComponent {

  constructor(props) {
    super(props);
    // Get the data
    this.props.getData(this.props.params.objectId);

  }

  componentWillReceiveProps(nextProps){
    const prevBettingMarketGroupId = this.props.params.objectId;
    const nextBettingMarketGroupId = nextProps.params.objectId;
    if (nextBettingMarketGroupId !== prevBettingMarketGroupId){
      // Get the data
      this.props.getData(nextBettingMarketGroupId);

    }
  }

  render() {

    return (
      <div className='betting-market-group-wrapper'>
        <BettingMarketGroupBanner
          eventName={ this.props.eventName }
          eventTime={ this.props.eventTime }
          isLiveMarket={ this.props.isLiveMarket }
        />
        <ComplexBettingWidget
          isLiveMarket={ this.props.isLiveMarket }
          marketData={ this.props.marketData }
          totalMatchedBetsAmount={ this.props.totalMatchedBetsAmount }
          createBet={ this.props.createBet }
          unconfirmedBets={ this.props.unconfirmedBets }
          currencyFormat={ this.props.currencyFormat }
          loadingStatus={ this.props.loadingStatus }
          widgetTitle={ this.props.widgetTitle }
          rules={ this.props.rules }
          canCreateBet={ this.props.canCreateBet }
        />
        <div className='margin-top-18'>
          <PeerPlaysLogo />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getData: BettingMarketGroupPageActions.getData,
    createBet: MarketDrawerActions.createBet,
    getPlacedBets: MarketDrawerActions.getPlacedBets,
  }, dispatch);
}

const mapStateToProps = (state, ownProps) => {
  return {
    marketData: BettingMarketGroupPageSelector.getMarketData(state, ownProps),
    eventName: BettingMarketGroupPageSelector.getEventName(state, ownProps),
    eventTime: BettingMarketGroupPageSelector.getEventTime(state, ownProps),
    isLiveMarket: BettingMarketGroupPageSelector.getIsLiveMarket(state, ownProps),
    totalMatchedBetsAmount: BettingMarketGroupPageSelector.getTotalMatchedBetsAmount(state, ownProps),
    unconfirmedBets: BettingMarketGroupPageSelector.getUnconfirmedBets(state, ownProps),
    loadingStatus: BettingMarketGroupPageSelector.getLoadingStatus(state, ownProps),
    widgetTitle: BettingMarketGroupPageSelector.getWidgetTitle(state, ownProps),
    rules: BettingMarketGroupPageSelector.getRules(state, ownProps),
    canCreateBet: MarketDrawerSelector.canAcceptBet(state, ownProps),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BettingMarketGroup);
