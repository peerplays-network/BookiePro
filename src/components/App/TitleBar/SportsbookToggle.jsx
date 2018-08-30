import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {AppActions, NavigateActions} from '../../../actions';
import {I18n} from 'react-redux-i18n';
import {BookieModes} from '../../../constants';
import {EventPageSelector} from '../../../selectors';
import {ChainTypes} from 'peerplaysjs-lib';

class SportsbookToggle extends PureComponent {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle(mode) {
    let subroute = '';

    if (this.props.eventID) {
      subroute = '/events/' + this.props.eventID;
    } else if (this.props.bmgID) {
      subroute = '/BettingMarketGroup/' + this.props.bmgID;
    }

    switch (mode) {
      case BookieModes.EXCHANGE: {
        this.props.setMode(BookieModes.EXCHANGE);
        this.props.navigateTo('/betting/exchange' + subroute);
        break;
      }

      case BookieModes.SPORTSBOOK: {
        this.props.setMode(BookieModes.SPORTSBOOK);
        this.props.navigateTo('/betting/sportsbook' + subroute);
        break;
      }

      default:
        break;
    }
  }

  render() {
    return (
      <div className='sportsBookToggle'>
        <p
          onClick={ () => this.toggle(BookieModes.EXCHANGE) }
          className={ this.props.bookMode === BookieModes.EXCHANGE ? 'active' : '' }
        >
          {I18n.t('titleBar.sportsbookToggle.exchange')}
        </p>

        <p
          onClick={ () => this.toggle(BookieModes.SPORTSBOOK) }
          className={ this.props.bookMode === BookieModes.SPORTSBOOK ? 'active' : '' }
        >
          {I18n.t('titleBar.sportsbookToggle.sportsbook')}
        </p>
      </div>
    );
  }
}

SportsbookToggle.propTypes = {
  bookMode: PropTypes.string,
  setMode: PropTypes.func,
  navigateTo: PropTypes.func,
};

const mapStateToProps = (state) => {
  const previousRoute = state.getIn(['routing', 'locationBeforeTransitions']);
  let eventID, bmgID;

  // If the previous route exists
  if (previousRoute) {
    let splitRoute = previousRoute.pathname.split('/');

    // If we're deeper than the base routes
    if (splitRoute.length > 3) {
      // Get the object that we're currently looking at
      let blockchainObject = splitRoute[splitRoute.length - 1];

      // The object type lives in the 'y' position (x.y.z)
      let objectType = blockchainObject.split('.')[1];

      // If we've got a BMG, then we need to pull an eventID
      if (objectType === ChainTypes.object_type.betting_market_group.toString()) {
        // We want to have the parent eventID on hand in case the user toggles to the exchange
        eventID = EventPageSelector.getEventIdByFromBMGId(state, blockchainObject);
      } else if (objectType === ChainTypes.object_type.event.toString()) {
        // We want to have the 'first' bmgID on hand incase the user toggles to the sportsbook
        bmgID = EventPageSelector.getFirstBettingMarketGroupByEventId(state, {
          params: {
            eventId: blockchainObject,
          },
        }).get('id');
      }
    }
  }

  return {
    bookMode: state.getIn(['app', 'bookMode']),
    previousRoute: state.getIn(['routing', 'previousRoute']),
    eventID,
    bmgID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setMode: AppActions.setBookMode,
      navigateTo: NavigateActions.navigateTo,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SportsbookToggle);
