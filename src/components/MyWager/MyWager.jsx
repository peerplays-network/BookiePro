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
import moment from 'moment';
import { CurrencyUtils } from '../../utility';
import { MyWagerSelector } from '../../selectors';

const {  getBetData, getBetTotal, getCurrencyFormat } = MyWagerSelector;
const TabPane = Tabs.TabPane;

class MyWager extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      period: 'last7Days',
      startDate: moment().subtract(6, 'days'),
      endDate: moment(),
      exportButtonClicked: false
    };
    this.onTabChange = this.onTabChange.bind(this);
    this.onHomeLinkClick = this.onHomeLinkClick.bind(this);
    this.cancelBet = this.cancelBet.bind(this);
    this.cancelAllBets = this.cancelAllBets.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onResolvedBetsExport = this.onResolvedBetsExport.bind(this);
    this.onPeriodSelect = this.onPeriodSelect.bind(this);
    this.disabledStartDate = this.disabledStartDate.bind(this);
    this.disabledEndDate = this.disabledEndDate.bind(this);
    this.onStartDateSelect = this.onStartDateSelect.bind(this);
    this.onEndDateSelect = this.onEndDateSelect.bind(this);
    this.resetResolvedBetsExportLoadingStatus = this.resetResolvedBetsExportLoadingStatus.bind(this);
    this.clearResolvedBetsExport = this.clearResolvedBetsExport.bind(this);
    this.handleExportFinishDownload = this.handleExportFinishDownload.bind(this);
  }

  handleExportFinishDownload() {
    this.resetResolvedBetsExportLoadingStatus();
    this.clearResolvedBetsExport();
  }

  onTabChange(key) {
    this.props.onTabChange(key);
    if (key === 'resolvedBets') {
      //set startDate and endDate in redux store
      this.props.setStartEndDate(this.state.startDate, this.state.endDate);
      this.props.getResolvedBets(this.state.startDate, this.state.endDate);
    }
    else{
      //get matched and unmatched bets
      this.props.getOngoingBets();
    }
  }

  componentDidMount()
  {
    this.props.onTabChange('unmatchedBets');
    //get data for default active tab unmatched Bets
    this.props.getOngoingBets();
  }

  //Redirect to 'Home' screen when clicked on 'Home' link on the Breadcrumb
  onHomeLinkClick(e){
    e.preventDefault();
    this.props.navigateTo('/exchange');
  }

  //cancel single bet
  //record is presentaional record not a blockchain bet object
  cancelBet(record, event){
    //cancelBets expects array of blockchain bet objects so passing single bet object in array
    this.props.cancelBets(List([Map(record)]));
  }

  //cacel all bets and load unmatchedBets
  cancelAllBets(){
    this.props.cancelBets(this.props.betsData);
  }

  //Resolved Bets - set min date for End Date depending on the selection of Start Date
  disabledStartDate = (selectedDate) => {
    const endDate = this.state.endDate;
    if (!selectedDate || !endDate) {
      return false;
    }
    return selectedDate.valueOf() > endDate.valueOf();
  }

  //Resolved Bets - Disabled End Date depending on the selection of Start Date
  disabledEndDate = (selectedDate) => {
    const startDate = this.state.startDate;
    if (!selectedDate || !startDate) {
      return false;
    }
    return selectedDate.valueOf() <= startDate.valueOf();
  }

  //Resolved Bets Period select change handler
  onPeriodSelect(value) {

    this.setState({
      period: value
    });

    if (value !== 'custom') {
      var startDate = new Date();
      this.setState({endDate: moment()});
      switch (value) {
        case 'last7Days':
          startDate = moment().subtract(6, 'days');
          break;
        case 'last14Days':
          startDate = moment().subtract(13, 'days');
          break;
        case 'thisMonth':
          startDate = moment().startOf('month');
          break;
        case 'lastMonth':
          //Last month's 1st day
          startDate = moment().subtract(1, 'months').startOf('month');
          //Last month's last day
          this.setState({endDate: moment().subtract(1, 'months').endOf('month')});
          break;
        default:
          startDate.subtract(6, 'days');
          break;
      }
      this.setState({startDate: startDate.hour(0).minute(0)});
    }
    else
        this.setState({startDate: null, endDate: null});
  }

  //Resolved Bets - Start Date change handler
  onStartDateSelect(value) {
    this.setState({startDate: moment(value).hour(0).minute(0)});
  }

  //Resolved Bets End Date change handler
  onEndDateSelect(value) {
    this.setState({endDate: moment(value).hour(23).minute(59)});
  }

  //Resolved Bets Search handler
  onSearchClick(e) {
    e.preventDefault();
    //set startDate and endDate in redux store
    this.props.setStartEndDate(this.state.startDate, this.state.endDate);
    this.props.getResolvedBets(this.state.startDate, this.state.endDate);
  }

  //Export Resolved Bets
  onResolvedBetsExport(event){
    event.preventDefault();
    //To show export related status after the 'Export' button is clicked
    this.setState({ exportButtonClicked: true });
    this.props.getResolvedBetsToExport(this.props.targetCurrency, this.props.betsColumns);
  }

  //Cancel Resolved Bets export - Resetting it's loading status to 'default'
  resetResolvedBetsExportLoadingStatus(){
    this.props.resetResolvedBetsExportLoadingStatus();
    this.setState({ exportButtonClicked: false });
  }

  //Clear Resolved Bets data after downloading it to release memory
  clearResolvedBetsExport(){
    this.props.clearResolvedBetsExport();
  }

  render() {
    return (
      <div className='my-wager section-padding'>
        <Breadcrumb className='bookie-breadcrumb'>
          <Breadcrumb.Item><a onClick={ this.onHomeLinkClick }>{ I18n.t('mybets.home') }</a></Breadcrumb.Item>
          <Breadcrumb.Item> { I18n.t('mybets.mybets') } </Breadcrumb.Item>
        </Breadcrumb>

        <Tabs className='content bookie-tab' defaultActiveKey='unmatchedBets' onChange={ this.onTabChange }>
          <TabPane tab={ I18n.t('mybets.unmatched_bets') } key='unmatchedBets'>
            <UnmatchedBets columns={ this.props.betsColumns } unmatchedBets={ this.props.betsData }
              unmatchedBetsLoadingStatus={ this.props.betsLoadingStatus }
              currencyFormat={ this.props.betsCurrencyFormat } betsTotal={ this.props.betsTotal }
              cancelBet={ this.cancelBet } cancelAllBets={ this.cancelAllBets }/>
          </TabPane>
          <TabPane tab={ I18n.t('mybets.matched_bets') } key='matchedBets'>
            <MatchedBets columns={ this.props.betsColumns } matchedBets={ this.props.betsData }
              matchedBetsLoadingStatus={ this.props.betsLoadingStatus }
              currencyFormat={ this.props.betsCurrencyFormat } betsTotal={ this.props.betsTotal }/>
          </TabPane>
          <TabPane tab={ I18n.t('mybets.resolved_bets') } key='resolvedBets'>
            <ResolvedBets columns={ this.props.betsColumns }
              resolvedBets={ this.props.betsData } resolvedBetsLoadingStatus={ this.props.resolvedBetsLoadingStatus }
              currencyFormat={ this.props.betsCurrencyFormat } betsTotal={ this.props.betsTotal }
              period={ this.state.period } startDate={ this.state.startDate } endDate={ this.state.endDate }
              disabledStartDate={ this.disabledStartDate } disabledEndDate={ this.disabledEndDate }
              onStartDateSelect={ this.onStartDateSelect } onEndDateSelect={ this.onEndDateSelect }
              onPeriodSelect={ this.onPeriodSelect } onSearchClick={ this.onSearchClick }
              exportButtonClicked={ this.state.exportButtonClicked }
              handleExportFinishDownload={ this.handleExportFinishDownload }
              onResolvedBetsExport={ this.onResolvedBetsExport }
              resolvedBetsExport={ this.props.resolvedBetsExportData }
              resolvedBetsExportLoadingStatus={ this.props.resolvedBetsExportLoadingStatus }
              resetResolvedBetsExportLoadingStatus={ this.resetResolvedBetsExportLoadingStatus }
              clearResolvedBetsExport={ this.clearResolvedBetsExport }
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const columns = [
    {
      title: (state.getIn(['mywager','activeTab']) === 'resolvedBets' ? I18n.t('resolved_time') : I18n.t('mybets.event_time') ),
      dataIndex: 'event_time',
      key: 'event_time',
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
      dataIndex: 'amount_to_bet',
      key: 'amount_to_bet',
    },
    {
      title: I18n.t('mybets.profit') + (state.getIn(['mywager','activeTab']) === 'resolvedBets' ? '' : '/' + I18n.t('mybets.liability') )
        + '(' + CurrencyUtils.getCurruencySymbol(getCurrencyFormat(state)) + ')',
      dataIndex: 'amount_to_win',
      key: 'amount_to_win'
    }
  ];

  return {
    betsColumns: columns,
    betsData: getBetData(state),
    betsLoadingStatus: state.getIn(['bet','getOngoingBetsLoadingStatus']),
    resolvedBetsLoadingStatus: state.getIn(['bet','getResolvedBetsLoadingStatus']),
    betsCurrencyFormat: CurrencyUtils.getCurruencySymbol(getCurrencyFormat(state)),
    targetCurrency: getCurrencyFormat(state),
    betsTotal: getBetTotal(state),
    resolvedBetsExportData: state.getIn(['bet','resolvedBetsExportById']),
    resolvedBetsExportLoadingStatus: state.getIn(['bet','getResolvedBetsExportLoadingStatus'])
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    getOngoingBets: BetActions.getOngoingBets,
    getResolvedBets: BetActions.getResolvedBets,
    getResolvedBetsToExport: BetActions.getResolvedBetsToExport,
    resetResolvedBetsExportLoadingStatus: BetActions.resetResolvedBetsExportLoadingStatus,
    clearResolvedBetsExport: BetActions.clearResolvedBetsExport,
    cancelBets: BetActions.cancelBets,
    onTabChange : MywagerActions.onTabChange,
    setStartEndDate: MywagerActions.setStartEndDate,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyWager);
