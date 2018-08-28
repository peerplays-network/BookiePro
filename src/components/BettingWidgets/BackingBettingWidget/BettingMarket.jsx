import React, { PureComponent } from 'react';
import 'react-table/react-table.css';
import PropTypes from 'prop-types';

class BettingMarket extends PureComponent {
  render() {
    const { title } = this.props;
    return (
      <div className='backBettingMarket'>
        <div className='bmTitle'>{title}</div>
        <div className='odds'>1.22</div>
      </div>
    );
  }
}

BettingMarket.propTypes = {
  title: PropTypes.string.isRequired,
};

export default BettingMarket;
