import React, { PureComponent } from 'react';
import { BettingMarketGroupBanner } from '../Banners';
import { ComplexBettingWidget } from '../BettingWidgets/';
import _ from 'lodash';
import { BettingMarketGroupPageSelector } from '../../selectors';
import { BettingMarketGroupPageActions, MarketDrawerActions } from '../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
          widgetTitle={ this.props.widgetTitle }
          rules={ this.props.rules }
        />
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
    sportName: BettingMarketGroupPageSelector.getSportName(state, ownProps),
    bettingMarketGroup: BettingMarketGroupPageSelector.getBettingMarketGroup(state, ownProps),
    bettingMarkets: BettingMarketGroupPageSelector.getBettingMarkets(state, ownProps),
    marketData: BettingMarketGroupPageSelector.getMarketData(state, ownProps),
    eventName: BettingMarketGroupPageSelector.getEventName(state, ownProps),
    eventTime: BettingMarketGroupPageSelector.getEventTime(state, ownProps),
    bettingMarketGroupName: BettingMarketGroupPageSelector.getBettingMarketGroupName(state, ownProps),
    totalMatchedBetsAmount: BettingMarketGroupPageSelector.getTotalMatchedBetsAmount(state, ownProps),
    unconfirmedBets: BettingMarketGroupPageSelector.getUnconfirmedBets(state, ownProps),
    loadingStatus: BettingMarketGroupPageSelector.getLoadingStatus(state, ownProps),
    widgetTitle: BettingMarketGroupPageSelector.getWidgetTitle(state, ownProps),
    rules: BettingMarketGroupPageSelector.getRules(state, ownProps),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BettingMarketGroup);
