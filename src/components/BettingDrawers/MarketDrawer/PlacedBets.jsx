import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import Ps from 'perfect-scrollbar';
import { BetActions, MarketDrawerActions, NavigateActions } from '../../../actions';
import UnmatchedBets from './UnmatchedBets';
import MatchedBets from './MatchedBets';
import './PlacedBets.less';
import { Empty, Overlay, Waiting } from '../Common';

class PlacedBets extends PureComponent {
  componentDidMount() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.placedBets));
  }

  componentDidUpdate() {
    Ps.update(ReactDOM.findDOMNode(this.refs.placedBets));
  }

  // TODO We only need this when the user refresh the browser in web mode
  //      However, this should not happen in the actual desktop app
  componentWillMount() {
    // Extract the current Betting Market Group Id the user is viewing
    // This is required to filter the data from all ongoing bets
    // TODO REVIEW feel free to replace this with a better method!
    const bettingMarketGroupId = window.location.href.split('/').pop();
    this.props.getPlacedBets(bettingMarketGroupId);
  }

  render() {
    return (
      <div className='placed-bets'>
        <div className='content' ref='placedBets'>
          { !this.props.isEmpty && <UnmatchedBets currencyFormat={ this.props.currencyFormat }/> }
          { !this.props.isEmpty && <MatchedBets currencyFormat={ this.props.currencyFormat }/> }
          { this.props.isEmpty &&
            <Empty
              showSuccess={ this.props.showPlacedBetsSuccess }
              className='market_drawer.placed_bets'
            />
          }
        </div>
        { this.props.showPlacedBetsConfirmation &&
          <Overlay
            className='market_drawer.placed_bets.confirmation'
            cancelAction={ this.props.cancelUpdateBet }
            confirmAction={ () => this.props.editBets(this.props.unmatchedBets) }
            replacements={ { amount: 0.051 } }
          />
        }
        { this.props.showPlacedBetsError &&
          <Overlay
            className='market_drawer.placed_bets.error'
            cancelAction={ this.props.cancelUpdateBet }
            confirmAction={ () => this.props.editBets(this.props.unmatchedBets) }
          />
        }
        { this.props.showDeleteUnmatchedBetsConfirmation &&
          <Overlay
            className='market_drawer.unmatched_bets.delete_bets'
            cancelAction={ this.props.cancelDeleteUnmatchedBets }
            confirmAction={ () => this.props.deleteUnmatchedBets(this.props.unmatchedbetsToBeDeleted) }
          />
        }
        { this.props.showPlacedBetsWaiting && <Waiting/> }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const unmatchedBets = state.getIn(['marketDrawer', 'unmatchedBets']);
  const matchedBets = state.getIn(['marketDrawer', 'matchedBets']);
  const showPlacedBetsConfirmation = state.getIn(['marketDrawer', 'showPlacedBetsConfirmation']);
  const showPlacedBetsSuccess = state.getIn(['marketDrawer', 'showPlacedBetsSuccess']);
  const showPlacedBetsWaiting = state.getIn(['marketDrawer', 'showPlacedBetsWaiting']);
  const showPlacedBetsError = state.getIn(['marketDrawer', 'showPlacedBetsError']);
  const showDeleteUnmatchedBetsConfirmation = state.getIn(['marketDrawer', 'showDeleteUnmatchedBetsConfirmation']);
  return {
    unmatchedBets,
    isEmpty: unmatchedBets.isEmpty() && matchedBets.isEmpty(),
    showPlacedBetsConfirmation,
    showPlacedBetsSuccess,
    showPlacedBetsWaiting,
    showPlacedBetsError,
    showDeleteUnmatchedBetsConfirmation,
    unmatchedbetsToBeDeleted: state.getIn(['marketDrawer', 'unmatchedbetsToBeDeleted']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    getPlacedBets: MarketDrawerActions.getPlacedBets,
    cancelUpdateBet: MarketDrawerActions.cancelUpdateBet,
    editBets: BetActions.editBets,
    deleteUnmatchedBets: MarketDrawerActions.deleteUnmatchedBets,
    cancelDeleteUnmatchedBets: MarketDrawerActions.cancelDeleteUnmatchedBets,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlacedBets);
