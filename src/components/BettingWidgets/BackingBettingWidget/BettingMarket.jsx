import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {MarketDrawerActions} from '../../../actions';
import {EventStatus} from '../../../constants';

class BettingMarket extends PureComponent {
  constructor(props) {
    super(props);
    this.getBestOdds = this.getBestOdds.bind(this);
    this.offerClicked = this.offerClicked.bind(this);
    this.isAbleToBet = this.isAbleToBet.bind(this);
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
    if (!this.isAbleToBet()) {
      return;
    }

    let odds = this.getBestOdds(this.props.backOrigin);

    if (odds === '--') {
      odds = 1.01;
    }

    this.props.createBet('back', this.props.bettingMarketId, odds);
  }

  isAbleToBet() {
    switch (this.props.eventStatus[1]) {
      case EventStatus.FINISHED:
      case EventStatus.FROZEN:
      case EventStatus.COMPLETED:
      case EventStatus.SETTLED:
      case EventStatus.CANCELED:
        return false;
      default:
        return true;
    }
  }

  render() {
    const {title, backOrigin} = this.props;
    return (
      <div 
        className={ 'backBettingMarket ' + (this.isAbleToBet() ? 'active' : 'disabled') } 
        onClick={ this.offerClicked }
      >
        <div className='bmTitle'>{title}</div>
        <div className='odds'>{this.getBestOdds(backOrigin)}</div>
      </div>
    );
  }
}

BettingMarket.propTypes = {
  title: PropTypes.string.isRequired,
  isLiveMarket: PropTypes.bool.isRequired,
  eventStatus: PropTypes.array.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      createBet: MarketDrawerActions.createBet,
    },
    dispatch
  );
};

export default connect(
  null,
  mapDispatchToProps
)(BettingMarket);
