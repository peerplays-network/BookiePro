import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {SportsbookUtils} from '../../../utility';

class BettingMarket extends PureComponent {
  constructor(props) {
    super(props);
    this.getBestOdds = this.getBestOdds.bind(this);
    this.offerClicked = this.offerClicked.bind(this);
  }

  getBestOdds(layBets) {
    let bestOffer = layBets.last();

    if (bestOffer) {
      return bestOffer.get('odds');
    } else {
      return '--';
    }
  }

  offerClicked() {
    // Return early if the cell was clicked and the market is not live
    if (!SportsbookUtils.isAbleToBet(this.props.eventStatus)) {
      return;
    }

    let odds = this.getBestOdds(this.props.backOrigin);

    if (odds === '--') {
      odds = 1.01;
    }

    if (this.props.eventFlag) {
      this.props.createBet(
        this.props.eventID,
        this.props.eventName,
        'back', 
        this.props.bettingMarketId,
        odds,
      );
    } else {
      this.props.createBet(
        'back',
        this.props.bettingMarketId,
        odds
      );
    }

  }

  render() {
    const {title, backOrigin} = this.props;
    return (
      <div 
        className={
          'backBettingMarket ' +
          (SportsbookUtils.isAbleToBet(this.props.eventStatus) ? 'active ' : 'disabled ') +
          (this.props.eventFlag ? 'eventFlag' : '')
        }
        onClick={ this.offerClicked }
      >
        <div className='bmTitle'>{title}</div>
        <div className='odds'>{this.getBestOdds(backOrigin)}</div>
      </div>
    );
  }
}

BettingMarket.propTypes = {
  isLiveMarket: PropTypes.bool.isRequired,
  createBet: PropTypes.func.isRequired,
  bettingMarketId: PropTypes.string.isRequired,
  eventFlag: PropTypes.bool
};

export default BettingMarket;
