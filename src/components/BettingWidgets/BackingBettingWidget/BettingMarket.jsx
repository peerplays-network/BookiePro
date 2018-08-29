import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { MarketDrawerActions } from '../../../actions';

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
    let odds = this.getBestOdds(this.props.backOrigin);

    if (odds === '--') {
      odds = 1.01;
    }

    this.props.createBet('back', this.props.bettingMarketId, odds);
  }

  render() {
    const { title, backOrigin } = this.props;
    return (
      <div className='backBettingMarket' onClick={ this.offerClicked }>
        <div className='bmTitle'>{title}</div>
        <div className='odds'>{this.getBestOdds(backOrigin)}</div>
      </div>
    );
  }
}

BettingMarket.propTypes = {
  title: PropTypes.string.isRequired,
};

const mapDispatchToProps = dispatch => {
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
