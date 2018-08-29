import React, { PureComponent } from 'react';
import 'react-table/react-table.css';
import PropTypes from 'prop-types';
import BettingMarket from './BettingMarket';
import { Col } from 'antd';
import { SportsbookUtils } from '../../../utility';

class BackingBettingWidget extends PureComponent {
  render() {
    // The title is the title of the widget (Ex. Match Odds, Moneyline)
    const title = this.props.marketData.get('description');
    const bettingMarkets = this.props.marketData.get('bettingMarkets');
    return (
      <div className='backingBettingWidget'>
        <div className='title'>{title}</div>
        <div>
          {bettingMarkets.map((item, index) => {
            return (
              <Col key={ index } span={ SportsbookUtils.getColumnSize(title) }>
                <BettingMarket
                  title={ item.get('description') }
                  backOrigin={ item.get('backOrigin') }
                  bettingMarketId={ item.get('id') }
                />
              </Col>
            );
          })}
        </div>
      </div>
    );
  }
}

BackingBettingWidget.propTypes = {
  isLiveMarket: PropTypes.bool.isRequired,
};

export default BackingBettingWidget;
