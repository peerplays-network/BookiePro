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
import { I18n, Translate } from 'react-redux-i18n';
import { CurrencyUtils } from '../../utility';
import { MyWagerSelector } from '../../selectors';
import { MyWagerTabTypes } from '../../constants';

const {  getBetData, getBetTotal, getCurrencyFormat, getBetsLoadingStatus } = MyWagerSelector;
const TabPane = Tabs.TabPane;

class MyWager extends PureComponent {
  constructor(props) {
    super(props);

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
    this.props.navigateTo('/exchange/bettingmarketgroup/' + record.betting_market_group_id);
  }

  //cancel single bet
  //record is presentaional record not a blockchain bet object
  cancelBet(record, event) {
    //cancelBets expects array of blockchain bet objects so passing single bet object in array
    this.props.cancelBets(List([Map(record)]));
  }

  //cancel all bets and load unmatchedBets
  cancelAllBets() {
    this.props.cancelBets(this.props.betsData);
  }


  render() {
    return (
      <div className='my-wager section-padding'>
        <Breadcrumb className='bookie-breadcrumb'>
          <Breadcrumb.Item><a onClick={ this.onHomeLinkClick }>{ I18n.t('mybets.home') }</a></Breadcrumb.Item>
          <Breadcrumb.Item> { I18n.t('mybets.mybets') } </Breadcrumb.Item>
        </Breadcrumb>

        <Tabs className='content bookie-tab' defaultActiveKey={ MyWagerTabTypes.UNMATCHED_BETS } onChange={ this.onTabChange }>
          <TabPane tab={ I18n.t('mybets.unmatched_bets') } key={ MyWagerTabTypes.UNMATCHED_BETS }>
            <UnmatchedBets columns={ this.props.betsColumns } unmatchedBets={ this.props.betsData }
              unmatchedBetsLoadingStatus={ this.props.betsLoadingStatus }
              currencyFormat={ this.props.betsCurrencyFormat } betsTotal={ this.props.betsTotal }
              cancelBet={ this.cancelBet } cancelAllBets={ this.cancelAllBets }
              onEventClick={ this.handleUnmatchedEventClick }/>
          </TabPane>
          <TabPane tab={ I18n.t('mybets.matched_bets') } key={ MyWagerTabTypes.MATCHED_BETS }>
            <MatchedBets columns={ this.props.betsColumns } matchedBets={ this.props.betsData }
              matchedBetsLoadingStatus={ this.props.betsLoadingStatus }
              currencyFormat={ this.props.betsCurrencyFormat } betsTotal={ this.props.betsTotal }/>
          </TabPane>
          <TabPane tab={ I18n.t('mybets.resolved_bets') } key={ MyWagerTabTypes.RESOLVED_BETS }>
            <ResolvedBets
              columns={ this.props.betsColumns }
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
  let currencyVal = '(' + CurrencyUtils.getCurruencySymbol(getCurrencyFormat(state)) + ')';
  let profit_liability  = state.getIn(['mywager','activeTab']) === MyWagerTabTypes.RESOLVED_BETS ?
    I18n.t('mybets.profit') + currencyVal : <Translate value='mybets.profit_liability' currency={ currencyVal } dangerousHTML/> ;
  const columns = [
    {
      title: (state.getIn(['mywager','activeTab']) === MyWagerTabTypes.RESOLVED_BETS ? I18n.t('resolved_time') : I18n.t('mybets.event_time') ),
      dataIndex: (state.getIn(['mywager','activeTab']) === MyWagerTabTypes.RESOLVED_BETS ? 'resolved_time' : 'event_time'),
      key: (state.getIn(['mywager','activeTab']) === MyWagerTabTypes.RESOLVED_BETS ? 'resolved_time' : 'event_time'),
    },
    {
      title: I18n.t('mybets.event'),
      dataIndex: 'event_name',
      key: 'event_name',
    },
    {
      title: I18n.t('mybets.type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: I18n.t('mybets.sport'),
      dataIndex: 'sport_name',
      key: 'sport_name',
    },
    {
      title: I18n.t('mybets.odds'),
      dataIndex: 'odds',
      key: 'odds',
    },
    {
      title: I18n.t('mybets.stake') + '(' + CurrencyUtils.getCurruencySymbol(getCurrencyFormat(state)) + ')',
      dataIndex: 'stake',
      key: 'stake',
    },
    {
      title: profit_liability,
      dataIndex: 'profit_liability',
      key: 'profit_liability'
    }
  ];

  return {
    betsColumns: columns,
    betsData: getBetData(state),
    betsLoadingStatus: getBetsLoadingStatus,
    betsCurrencyFormat: CurrencyUtils.getCurruencySymbol(getCurrencyFormat(state)),
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
    setResolvedBetsTimeRange: MywagerActions.setResolvedBetsTimeRangeAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyWager);
