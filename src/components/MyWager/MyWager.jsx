/**
 * This is mywager component with tabbed view of Unmatched, Matched and Resolved bets
 * Bets listed in mybets are dummy bet objects. This are not fetched from blockchain.
 * Unmatched bets - Placed bets that are pending for someone to make an opposite bet with same odds to match on
 * Matched bets - Bets that are matched with certain opposite bets, pending for the market to end and get resolved
 * Resolved bets - When a market with the user’s bet is ended and bets resolved
 * MyWagerSelector is the source of bets listing
 */
import React, { PureComponent } from 'react';
import { Tabs, Breadcrumb } from 'antd';
import UnmatchedBets from './UnmatchedBets';
import MatchedBets from './MatchedBets';
import ResolvedBets from './ResolvedBets';
import { NavigateActions, BetActions, MywagerActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { List, Map } from 'immutable';
import { I18n } from 'react-redux-i18n';
import { MyWagerSelector } from '../../selectors';
import { MyWagerTabTypes } from '../../constants';
import PeerPlaysLogo from '../PeerPlaysLogo';

const {  getBetData, getBetTotal, getCurrencyFormat, getBetsLoadingStatus } = MyWagerSelector;
const TabPane = Tabs.TabPane;

class MyWager extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exportButtonClicked: false,
      isCancelAllConfirmModalVisible: false
    };

    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleExportClick = this.handleExportClick.bind(this);
    this.handleResetExport = this.handleResetExport.bind(this);

    this.onHomeLinkClick = this.onHomeLinkClick.bind(this);
    this.handleUnmatchedEventClick = this.handleUnmatchedEventClick.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.cancelBet = this.cancelBet.bind(this);
    this.cancelAllBets = this.cancelAllBets.bind(this);
  }

  componentDidMount() {
    // Set default to unmatched bets
    this.props.setActiveTab(MyWagerTabTypes.UNMATCHED_BETS);
  }

  componentWillUnmount() {
    // Reset time range
    this.props.resetTimeRange();
  }


  /**
   * Redirect to 'Home' screen when clicked on 'Home' link on the Breadcrumb
   * @param {synthetic_event} e - React defines these synthetic events according to the W3C spec, so you don't need to worry about cross-browser compatibility.
   */
  onHomeLinkClick(e){
    e.preventDefault();
    this.props.navigateTo('/exchange');
  }

  /**
   * Search transaction history with filters
   * @param {string} periodType - date filter selection
   * @param {object} customTimeRangeStartDate - start date of time range
   * @param {object} customTimeRangeEndDate - end date of time range
   */
  handleSearchClick(periodType, customTimeRangeStartDate, customTimeRangeEndDate){
    // Set time range.
    this.props.setResolvedBetsTimeRange(periodType, customTimeRangeStartDate, customTimeRangeEndDate);
  }

  /**
   * Export resolved bets
   * @param {string} periodType - date filter selection
   * @param {object} customTimeRangeStartDate - start date of time range
   * @param {object} customTimeRangeEndDate - end date of time range
   */
  handleExportClick(periodType, customTimeRangeStartDate, customTimeRangeEndDate){
    // First set the history time range, so the search result is re-filtered
    this.props.setResolvedBetsTimeRange(periodType, customTimeRangeStartDate, customTimeRangeEndDate);
    // Then generate export data
    this.props.generateResolvedBetsExportData(this.props.betsColumns);
  }

  /**
   * Reset export data to empty list
   * set export loading status to default and error to null
   * This will called on export data downloaded or on export process cancel
   * Export modal popup hides on reset
   */
  handleResetExport() {
    // Reset
    this.props.resetResolvedBetsExportDataAction();
  }

  /**
   * switch tabs - UnmatchedBets, MatchedBets and ResolvedBets
   * @param {string} key - active tab key
   * This will set activeTab key in redux state. change in state will trigger to load data for active tab
   */
  onTabChange(key) {
    this.props.setActiveTab(key);
  }


  /**
   * UnmatchedBets tab lists bets with event link. this link navigat user to  event full market screen
   * @param {object} record - bet object
   */
  handleUnmatchedEventClick(record, event){
    this.props.navigateTo('/exchange/bettingmarketgroup/' + record.group_id);
  }

  /**
   * Cancel single bet
   * cancelled bet ids stored in redux store under 'bets.cancelBetsByIdsLoadingStatus' with status. This is temporary cancel. This doesn't have any effect on blockchain data yet.
   * UnmatchedBets avoid listing of the bets which are marked cancelled
   * @param {object} record - bet  object to cancel. This are dummy bet objects. This are not fetched from blockchain
   */
  cancelBet(record, event) {
    //cancelBets expects array of immutable bet objects. converting simple object to immutable list
    this.props.cancelBets(List([Map(record)]));
  }

  /**
   * bets data sent to cancel bets which will mark all bets cancelled in redx store 'bets.cancelBetsByIdsLoadingStatus'
   * component state 'isCancelAllConfirmModalVisible' value set to false. this will hide cancel bets confirmation modal
   */
  handleCancelAllBets = () => {
    this.props.cancelBets(this.props.betsData);
    this.setState({ isCancelAllConfirmModalVisible: false });
  }
  /** set local state isCancelAllConfirmModalVisible to false - hide cancelAllConfirmModal on decline */
  declineCancelAllBets = () => {
    this.setState({isCancelAllConfirmModalVisible: false,});
  }
  /** Confirmation pop-up for deleting all unmatched bets. */
  cancelAllBets(){

    event.preventDefault();
    //To show export related status after the 'Export' button is clicked
    this.setState({ isCancelAllConfirmModalVisible: true });
    //this.props.cancelBets(this.props.betsData);
  }


  render() {
    return (
      <div className='my-wager section-padding'>
        <Breadcrumb className='bookie-breadcrumb'>
          <Breadcrumb.Item><a onClick={ this.onHomeLinkClick }>{ I18n.t('mybets.home') } </a></Breadcrumb.Item>
          <Breadcrumb.Item>{ I18n.t('mybets.mybets') }</Breadcrumb.Item>
        </Breadcrumb>

        <Tabs className='content bookie-tab' defaultActiveKey={ MyWagerTabTypes.UNMATCHED_BETS } onChange={ this.onTabChange }>
          <TabPane tab={ I18n.t('mybets.unmatched_bets') } key={ MyWagerTabTypes.UNMATCHED_BETS }>
            <UnmatchedBets
              unmatchedBets={ this.props.betsData }
              unmatchedBetsLoadingStatus={ this.props.betsLoadingStatus }
              onEventClick={ this.handleUnmatchedEventClick }
              currencyFormat={ this.props.betsCurrencyFormat }
              betsTotal={ this.props.betsTotal }
              onCancelBetClick={ this.cancelBet }
              onCancelAllBetsClick={ this.cancelAllBets }
              isCancelAllConfirmModalVisible={ this.state.isCancelAllConfirmModalVisible }
              handleCancelAllBets={ this.handleCancelAllBets }
              declineCancelAllBets={ this.declineCancelAllBets }/>
          </TabPane>
          <TabPane tab={ I18n.t('mybets.matched_bets') } key={ MyWagerTabTypes.MATCHED_BETS }>
            <MatchedBets
              matchedBets={ this.props.betsData }
              matchedBetsLoadingStatus={ this.props.betsLoadingStatus }
              currencyFormat={ this.props.betsCurrencyFormat }
              betsTotal={ this.props.betsTotal }/>
          </TabPane>
          <TabPane tab={ I18n.t('mybets.resolved_bets') } key={ MyWagerTabTypes.RESOLVED_BETS }>
            <ResolvedBets
              resolvedBets={ this.props.betsData }
              resolvedBetsLoadingStatus={ this.props.betsLoadingStatus }
              currencyFormat={ this.props.betsCurrencyFormat }
              betsTotal={ this.props.betsTotal }
              handleSearchClick={ this.handleSearchClick }
              handleExportClick={ this.handleExportClick }
              exportData={ this.props.resolvedBetsExportData }
              exportLoadingStatus={ this.props.resolvedBetsExportLoadingStatus }
              handleResetExport={ this.handleResetExport }
            />
          </TabPane>
        </Tabs>
        <div className='margin-top-18'>
          <PeerPlaysLogo />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    betsData: getBetData(state),
    betsLoadingStatus: getBetsLoadingStatus(state),
    betsCurrencyFormat: getCurrencyFormat(state),
    targetCurrency: getCurrencyFormat(state),
    betsTotal: getBetTotal(state),
    resolvedBetsExportData: state.getIn(['mywager','resolvedBetsExportData']),
    resolvedBetsExportLoadingStatus: state.getIn(['mywager','generateResolvedBetsExportDataLoadingStatus'])
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    generateResolvedBetsExportData: MywagerActions.generateResolvedBetsExportData,
    resetResolvedBetsExportDataAction: MywagerActions.resetResolvedBetsExportDataAction,
    cancelBets: BetActions.cancelBets,
    setActiveTab: MywagerActions.setMywagerActiveTab,
    setResolvedBetsTimeRange: MywagerActions.setResolvedBetsTimeRangeAction,
    resetTimeRange: MywagerActions.resetTimeRange
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyWager);
