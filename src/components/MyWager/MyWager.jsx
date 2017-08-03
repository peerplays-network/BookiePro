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


  //Redirect to 'Home' screen when clicked on 'Home' link on the Breadcrumb
  onHomeLinkClick(e){
    e.preventDefault();
    this.props.navigateTo('/exchange');
  }

  //Search transaction history with filters
  handleSearchClick(periodType, customTimeRangeStartDate, customTimeRangeEndDate){
    // Set time range.
    this.props.setResolvedBetsTimeRange(periodType, customTimeRangeStartDate, customTimeRangeEndDate);
  }

  //Export transaction history
  handleExportClick(periodType, customTimeRangeStartDate, customTimeRangeEndDate){
    // First set the history time range, so the search result is re-filtered
    this.props.setResolvedBetsTimeRange(periodType, customTimeRangeStartDate, customTimeRangeEndDate);
    // Then generate export data
    this.props.generateResolvedBetsExportData(this.props.betsColumns);
  }

  handleExportFinishDownload() {
    // Reset
    this.props.resetResolvedBetsExportLoadingStatus();
    this.props.clearResolvedBetsExport();
    this.setState({ exportButtonClicked: false });
  }

  handleResetExport() {
    // Reset
    this.props.resetResolvedBetsExportDataAction();
  }

  onTabChange(key) {
    this.props.setActiveTab(key);
  }


  //Redirect to event market screen
  handleUnmatchedEventClick(record, event){
    this.props.navigateTo('/exchange/bettingmarketgroup/' + record.group_id);
  }

  //cancel single bet
  //record is presentaional record not a blockchain bet object
  cancelBet(record, event) {
    //cancelBets expects array of blockchain bet objects so passing single bet object in array
    this.props.cancelBets(List([Map(record)]));
  }

  //cancel all bets on Confirmation and hide confirm modal
  handleCancelAllBets = () => {
    this.props.cancelBets(this.props.betsData);
    this.setState({ isCancelAllConfirmModalVisible: false });
  }
  //hide cancelAllConfirmModal on decline
  declineCancelAllBets = () => {
    this.setState({isCancelAllConfirmModalVisible: false,});
  }
  // Confirmation pop-up for deleting all bets.
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
