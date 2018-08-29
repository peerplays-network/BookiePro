import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { AppActions, NavigateActions } from '../../../actions';
import { I18n } from 'react-redux-i18n';
import { BookieModes } from '../../../constants';
import { EventPageSelector } from '../../../selectors';

class SportsbookToggle extends PureComponent {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle(mode) {
    let subroute = '';

    if (this.props.eventID) {
      subroute  = '/events/' + this.props.eventID;
    }

    switch (mode) {
      case BookieModes.EXCHANGE: {
        this.props.setMode(BookieModes.EXCHANGE);
        this.props.navigateTo('/betting/exchange');
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
        <p onClick={ () => this.toggle(BookieModes.EXCHANGE) } 
            className={ this.props.bookMode === BookieModes.EXCHANGE ? 'active' : '' }>
          {I18n.t('titleBar.sportsbookToggle.exchange')}
        </p>

        <p onClick={ () => this.toggle(BookieModes.SPORTSBOOK) } 
            className={ this.props.bookMode === BookieModes.SPORTSBOOK ? 'active' : '' }>
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

const mapStateToProps = (state, ownProps) => {
  const previousRoute = state.getIn(['routing', 'locationBeforeTransitions']);
  let eventID;


  if (previousRoute) {
    let splitRoute = previousRoute.pathname.split('/');

    if (splitRoute.length > 3) {
      let bmgID = splitRoute[splitRoute.length - 1];
      eventID = EventPageSelector.getEventIdByFromBMGId(state, bmgID);
    }
  }

  return {
    bookMode: state.getIn(['app', 'bookMode']),
    previousRoute: state.getIn(['routing', 'previousRoute']),
    eventID
  };
};

const mapDispatchToProps = dispatch => {
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
