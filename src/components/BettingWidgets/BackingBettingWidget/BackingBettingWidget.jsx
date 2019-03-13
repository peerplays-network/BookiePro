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
import {MarketDrawerActions, QuickBetDrawerActions, NavigateActions} from '../../../actions';
import PropTypes from 'prop-types';
import BettingMarket from './BettingMarket';
import {Col} from 'antd';
import {SportsbookUtils} from '../../../utility';
import {DateUtils} from '../../../utility';
import moment from 'moment';

class BackingBettingWidget extends PureComponent {
  render() {
    // The betting markets get passed in with the marketData
    const bettingMarkets = this.props.marketData.get('bettingMarkets');

    let dateString;

    let title = this.props.title;

    let createBet = this.props.marketDrawerCreateBet;

    // The event flag will render an event if true, BMG otherwise
    let eventFlag = false;

    let span = 24;
    let eventTime;

    // If the following if statement is true, then the component is an event
    if (this.props.eventTime) {
      eventFlag = true;
      dateString = DateUtils.getMonthAndDay(this.props.eventTime);
      createBet = this.props.quickBetDrawerCreateBet;
      eventTime = moment.utc(this.props.eventTime).local().format('H:mm');
    }

    return (
      <div className={ 'backingBettingWidget ' +
        (SportsbookUtils.isAbleToBet(this.props.eventStatus) ? 'active ' : 'disabled ') }>
        <div>

          { eventFlag && 
            <Col span={ 10 }>
              <Col className='date' span={ 5 }>
                { dateString }
                <br/>
                { eventTime }
              </Col>

              <Col className='name' span={ 19 }>
                <p onClick={
                  () => this.props.navigateTo('/sportsbook/events/' + this.props.eventID) }>
                  { title }
                </p>
              </Col>
            </Col>
          }
          
          {bettingMarkets && bettingMarkets.map((item, index) => {

            let description = item.get('description');

            if (eventFlag && description === 'The Draw') {
              description = 'Draw';
              span = 2;
            } else if (eventFlag) {
              span = SportsbookUtils.getColumnSize(this.props.columnType, eventFlag);
            } else {
              span = SportsbookUtils.getColumnSize(title, eventFlag);
            }

            return (
              <Col
                key={ index } 
                span={ span }
              >
                <BettingMarket
                  title={ description }
                  eventName={ this.props.title }
                  eventID={ this.props.eventID }
                  backOrigin={ item.get('backOrigin') }
                  bettingMarketId={ item.get('id') }
                  eventStatus={ this.props.eventStatus }
                  isLiveMarket={ this.props.isLiveMarket }
                  createBet={ createBet }
                  eventFlag={ eventFlag }
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
  eventStatus: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      marketDrawerCreateBet: MarketDrawerActions.createBet,
      quickBetDrawerCreateBet: QuickBetDrawerActions.createBet,
      navigateTo: NavigateActions.navigateTo
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(BackingBettingWidget);
