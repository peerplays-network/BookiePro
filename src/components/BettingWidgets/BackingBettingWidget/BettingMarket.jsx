import React, { PureComponent } from 'react';
import 'react-table/react-table.css';
import PropTypes from 'prop-types';

class BettingMarket extends PureComponent {
  constructor(props) {
    super(props);
    this.getBestOdds = this.getBestOdds.bind(this);
  }

  getBestOdds(layBets) {
    let bestOffer = layBets.first();
    if (bestOffer) {
      return bestOffer.get('odds');
    } else {
      return '--';
    }
  }

  render() {
    const { title, backOrigin } = this.props;
    return (
      <div className='backBettingMarket'>
        <div className='bmTitle'>{title}</div>
        <div className='odds'>{this.getBestOdds(backOrigin)}</div>
      </div>
    );
  }
}

BettingMarket.propTypes = {
  title: PropTypes.string.isRequired,
};

export default BettingMarket;
