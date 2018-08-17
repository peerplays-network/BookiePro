import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { AppActions } from '../../../actions';
import { I18n } from 'react-redux-i18n';
import { BookieModes } from '../../../constants';

class SportsbookToggle extends PureComponent {  
  render() {
    return (
        <div id='sportsBookToggle'>
            <p onClick={ () => this.props.setMode(BookieModes.EXCHANGE) }
                className={ this.props.bookMode === BookieModes.EXCHANGE ? 'active' : '' }>
                { I18n.t('titleBar.sportsbookToggle.exchange') }
            </p>
            
            <p onClick={ () => this.props.setMode(BookieModes.SPORTSBOOK) } 
                className={ this.props.bookMode === BookieModes.SPORTSBOOK ? 'active' : '' }>
                { I18n.t('titleBar.sportsbookToggle.sportsbook') }
            </p>
        </div>
    );
  }
}

SportsbookToggle.propTypes = {
  bookMode: PropTypes.string,
  setMode: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  return {
    bookMode: state.getIn(['app', 'bookMode'])
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setMode: AppActions.setBookMode
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SportsbookToggle);
