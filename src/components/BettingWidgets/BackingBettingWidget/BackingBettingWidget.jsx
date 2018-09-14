/*
 * BackingBettingWidget
 * 
 * The Backing Betting Widget has two types. Either your are rendering ...
 *    - An Event
 *    - A Betting Market Group
 * 
 * The variable @eventFlag is set to true if the component detects and eventName and 
 *  an eventTime. Otherwise the component assumes it is rendering a bettingMarketGroup
 */ 

import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {MarketDrawerActions, QuickBetDrawerActions} from '../../../actions';
import PropTypes from 'prop-types';
import BettingMarket from './BettingMarket';
import {Col} from 'antd';
import {SportsbookUtils} from '../../../utility';
import {DateUtils} from '../../../utility';

class BackingBettingWidget extends PureComponent {
  render() {
    // The betting markets get passed in with the marketData
    const bettingMarkets = this.props.marketData.get('bettingMarkets');

    let dateString;

    let title = this.props.title;

    let createBet = this.props.marketDrawerCreateBet;

    // The event flag will render an event if true, BMG otherwise
    let eventFlag = false;

    // Used to determine the exact column widths for the BettingMarket components
    let multiplier = 1;
    let divisor = 1;
    let span = 24;
    

    // If the following if statement is true, then the component is an event
    if (this.props.eventTime) {
      eventFlag = true;
      dateString = DateUtils.getMonthAndDay(this.props.eventTime);
      divisor = 2;
      createBet = this.props.quickBetDrawerCreateBet;
    }

    return (
      <div className='backingBettingWidget'>
        <div>

          { eventFlag && 
            <Col span={ 10 }>
              <Col className='date' span={ 4 }>
                { dateString }
              </Col>

              <Col className='name' span={ 20 }>
                { title }
              </Col>
            </Col>
          }
          
          {bettingMarkets && bettingMarkets.map((item, index) => {

            if (eventFlag && item.get('description') === 'The Draw') {
              span = 2;
            } else {
              span = (multiplier * SportsbookUtils.getColumnSize(title)) / divisor;
            }

            return (
              <Col
                key={ index } 
                span={ span }
              >
                <BettingMarket
                  title={ item.get('description') }
                  eventName={ this.props.title }
                  eventID={ this.props.eventID }
                  backOrigin={ item.get('backOrigin') }
                  bettingMarketId={ item.get('id') }
                  eventStatus={ this.props.eventStatus }
                  isLiveMarket={ this.props.isLiveMarket }
                  createBet={ createBet }
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
  eventStatus: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      marketDrawerCreateBet: MarketDrawerActions.createBet,
      quickBetDrawerCreateBet: QuickBetDrawerActions.createBet
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(BackingBettingWidget);
