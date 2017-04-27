import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { I18n, Translate } from 'react-redux-i18n';
import { Button } from 'antd';
import { BetActions, NavigateActions } from '../../../actions';
import UnmatchedBets from './UnmatchedBets';
import './PlacedBets.less';

class PlacedBets extends PureComponent {
  componentWillMount() {
    this.props.getOngoingBets();
  }

  render() {
    return (
      <div className='placed-bets'>
        <div className='content'>
          { !this.props.isEmpty &&
            <UnmatchedBets/>
          }
          { this.props.isEmpty &&
            <div className='empty'>
              <div className='instructions'>
                <Translate value='market_drawer.unconfirmed_bets.empty.instructions' dangerousHTML/>
              </div>
              <div className='my-bet-button'>
                <Button onClick={ () => this.props.navigateTo('/my-wager/') }>
                  { I18n.t('market_drawer.unconfirmed_bets.empty.my_bet_button') }
                </Button>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const unmatchedBets = state.getIn(['marketDrawer', 'unmatchedBets']);
  const matchedBets = state.getIn(['marketDrawer', 'matchedBets']);
  return {
    isEmpty: unmatchedBets.isEmpty() && matchedBets.isEmpty()
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    getOngoingBets: BetActions.getOngoingBets,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlacedBets);
