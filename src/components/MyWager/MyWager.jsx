import React, { PureComponent } from 'react';
import { Tabs, Breadcrumb } from 'antd';
import UnmatchedBets from './UnmatchedBets';
import MatchedBets from './MatchedBets';
import ResolvedBets from './ResolvedBets';
import { NavigateActions, BetActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFormattedDate } from '../../utility/DateUtils';
import { mergeRelationData} from '../../utility/MergeObjectUtils';
import _ from 'lodash';
import { List, Map } from 'immutable';
import { LoadingStatus } from '../../constants';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { CurrencyUtils, BettingModuleUtils } from '../../utility';

const TabPane = Tabs.TabPane;
var tabKey = 'unmatchedBets';
//TODO: Declared it at global level because I have to use it in mapStateToProps
//need to check if this variables can be moved at component level
let startDate = moment().subtract(6, 'days').hour(0).minute(0);
let endDate = moment();

class MyWagerPrivateFunctions{
  //merge betting market group data to bets for display
  //created seperate function otherwise column data with the same column name will be replaced in main data;
  static mergeBettingMarketGroup(data, relData, col){
    data.forEach((row, index) => {
    	var matchObj = relData.get(row.get(col));
      if(matchObj){
        row = row.set('event_id', matchObj.get('event_id'));
        row = row.set('market_type_id', matchObj.get('market_type_id'));
        if(matchObj.get('market_type_id') === 'Moneyline'){
          row = row.set('options', '');
        }
        else if(matchObj.get('market_type_id') === 'Spread'){
          if(matchObj.get('options').get('margin') > 0)
            row = row.set('options', ('+' + matchObj.get('options').get('margin')));
          else
            row = row.set('options', matchObj.get('options').get('margin'));
        }
        else{
      	  row = row.set('options', matchObj.get('options').get('score'));
        }
        data[index] = row;
      }
    })
    return data;
  }

  //formatting data after getting all reuired data merged
  static formatBettingData(data, precision, targetCurrency){
    //showing past data as resolvedBets and future data as matchedBets unmatchedBets
    if(tabKey === 'resolvedBets')
      data = data.filter(row => (moment(row.get('event_time')).isBetween(startDate, endDate)));
    else
      data = data.filter(row => (((moment(row.get('event_time')).isAfter(moment().hour(0).minute(0))))));

    //check if this can be improved
    //TODO: use .map() instead of foreach as suggested
    data.forEach((row, index) => {
      let rowObj = {
        'type' : (row.get('back_or_lay') + ' | ' + row.get('payout_condition_string') + ' ' + row.get('options') + ' | ' + row.get('market_type_id')),
        'odds' : (row.get('amount_to_win') / row.get('amount_to_bet')).toFixed(BettingModuleUtils.oddsPlaces),
        'amount_to_bet' : CurrencyUtils.getFormattedCurrency(row.get('amount_to_bet')/ Math.pow(10, precision), targetCurrency, BettingModuleUtils.stakePlaces),
        'amount_to_win' : CurrencyUtils.getFormattedCurrency(row.get('amount_to_win')/ Math.pow(10, precision), targetCurrency, BettingModuleUtils.exposurePlaces),
        'event_time': getFormattedDate(row.get('event_time'))
      };
      //randomly changed win value to negative for liability display
      //applied class based on profit or loss
      if(tabKey === 'resolvedBets'){
        rowObj.amount_to_win *= Math.floor(Math.random()*2) === 1 ? 1 : -1;
        rowObj.amount_to_win = <span className={ rowObj.amount_to_win > 0 ? 'profit' : 'loss' }>
          {(rowObj.amount_to_win > 0 ? '+' : '')}{ rowObj.amount_to_win }</span>;
      }
      if(tabKey === 'unmatchedBets')
        rowObj.cancel = (row.get('cancelled') ? '' : <a className='btn cancel-btn' target='_self'>{ I18n.t('mybets.cancel') }</a>);
      data[index] = row.merge(rowObj);
    });
    return data;
  }

  //Resolved bets Export - formatting data after getting all reuired data merged
  static formatBettingDataToExport(data, precision, targetCurrency){
    //showing past data as resolvedBets and future data as matchedBets unmatchedBets
    data = data.filter(row => (moment(row.get('event_time')).isBetween(startDate, endDate)))
    //check if this can be improved
    //TODO: use .map() instead of foreach as suggested
    data.forEach((row, index) => {
      let rowObj = {
        'event_time': getFormattedDate(row.get('event_time')),
        'type' : (row.get('back_or_lay') + ' | ' + row.get('payout_condition_string') + ' ' + row.get('options') + ' | ' + row.get('market_type_id')),
        'odds' : (row.get('amount_to_win') / row.get('amount_to_bet')).toFixed(2),

        //randomly changed win value to negative for liability display
        'amount_to_bet' : CurrencyUtils.getFormattedCurrency(row.get('amount_to_bet')/ Math.pow(10, precision), targetCurrency, BettingModuleUtils.stakePlaces),
        'amount_to_win' : CurrencyUtils.getFormattedCurrency(row.get('amount_to_win')/ Math.pow(10, precision) * ( Math.floor(Math.random()*2) === 1 ? 1 : -1 ),
          targetCurrency, BettingModuleUtils.exposurePlaces),
      };
      data[index] = row.merge(rowObj);
    });
    return data;
  }

  //common function to merge betsData, bettingMarket, bettingMarketGroup, Event and sports for display and export functionality
  static mergeBetData(BetData, state){
    let mergeData = [];
    BetData.forEach(row =>
    {
      let rowObj = {
        key: row.get('id'),
        id: row.get('id'),
        'betting_market_id': row.get('betting_market_id'),
        'back_or_lay': row.get('back_or_lay')
      }
      //used same name amount_to_bet and amount_to_win for matchedBets and unmatchedBets to shorten code
      if(tabKey === 'unmatchedBets'){
        rowObj.cancelled = row.get('cancelled');
        rowObj.amount_to_bet = row.get('remaining_amount_to_bet');
        rowObj.amount_to_win = row.get('remaining_amount_to_win');
      }
      else {
        rowObj.amount_to_bet = row.get('amount_to_bet');
        rowObj.amount_to_win = row.get('amount_to_win');
      }
      mergeData.push(Map(rowObj));
    });

    //merging betting market data for display and betting_market_group_id for reference
    mergeData = mergeRelationData(mergeData, state.getIn(['bettingMarket','bettingMarketsById']), 'betting_market_id',
      {betting_market_group_id: 'betting_market_group_id' , payout_condition_string: 'payout_condition_string'});

    //merging betting market group data for display and eventid for reference
    mergeData = MyWagerPrivateFunctions.mergeBettingMarketGroup(mergeData,
      state.getIn(['bettingMarketGroup','bettingMarketGroupsById']), 'betting_market_group_id');

    //merging evemt data for display and sport id for reference
    mergeData = mergeRelationData(mergeData, state.getIn(['event','eventsById']), 'event_id',
      {'name': 'event_name' , 'start_time': 'event_time', 'sport_id': 'sport_id'});

    //merging sport data for display
    mergeData = mergeRelationData(mergeData, state.getIn(['sport','sportsById']), 'sport_id',
      {'name': 'sport_name'});

    return mergeData;
  }
}

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
  }

  onTabChange(key) {
    if (key === 'resolvedBets') {
      //set default period - startDate and endDate
      // this.setState({'startDate': moment().subtract(6, 'days').hour(0).minute(0),
      //   'endDate': moment(), 'period': 'last7Days'});
      this.props.getResolvedBets(this.state.startDate, this.state.endDate);
      tabKey = key;
    }
    else{
      //get matched and unmatched bets
      this.props.getOngoingBets();
      tabKey = key;
    }
  }

  componentDidMount()
  {
    tabKey = 'unmatchedBets';
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
    this.props.cancelBets(this.props.unmatchedBetsData);
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
    startDate = this.state.startDate;
    endDate = this.state.endDate;
    this.props.getResolvedBets(this.state.startDate, this.state.endDate);
  }

  //Export Resolved Bets
  onResolvedBetsExport(event){
    event.preventDefault();
    //To show export related status after the 'Export' button is clicked
    this.setState({ exportButtonClicked: true });
    startDate = this.state.startDate;
    endDate = this.state.endDate;
    this.props.getResolvedBetsToExport(this.state.startDate, this.state.endDate);
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
            <UnmatchedBets columns={ this.props.unmatchedBetsColumns } unmatchedBets={ this.props.unmatchedBetsData }
              unmatchedBetsLoadingStatus={ this.props.unmatchedBetsLoadingStatus }
              currencyFormat={ this.props.unmatchedBetsCurrencyFormat } betsTotal={ this.props.unmatchedBetsTotal }
              cancelBet={ this.cancelBet } cancelAllBets={ this.cancelAllBets }/>
          </TabPane>
          <TabPane tab={ I18n.t('mybets.matched_bets') } key='matchedBets'>
            <MatchedBets columns={ this.props.matchedBetsColumns } matchedBets={ this.props.matchedBetsData }
              matchedBetsLoadingStatus={ this.props.matchedBetsLoadingStatus }
              currencyFormat={ this.props.matchedBetsCurrencyFormat } betsTotal={ this.props.matchedBetsTotal }/>
          </TabPane>
          <TabPane tab={ I18n.t('mybets.resolved_bets') } key='resolvedBets'>
            <ResolvedBets columns={ this.props.resolvedBetsColumns }
              resolvedBets={ this.props.resolvedBetsData } resolvedBetsLoadingStatus={ this.props.resolvedBetsLoadingStatus }
              currencyFormat={ this.props.resolvedBetsCurrencyFormat } betsTotal={ this.props.resolvedBetsTotal }
              period={ this.state.period } startDate={ this.state.startDate } endDate={ this.state.endDate }
              disabledStartDate={ this.disabledStartDate } disabledEndDate={ this.disabledEndDate }
              onStartDateSelect={ this.onStartDateSelect } onEndDateSelect={ this.onEndDateSelect }
              onPeriodSelect={ this.onPeriodSelect } onSearchClick={ this.onSearchClick }
              exportButtonClicked={ this.state.exportButtonClicked }
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

  const account = state.get('account');
  const accountId = account.getIn(['account','id']);
  const setting = state.getIn(['setting', 'settingByAccountId', accountId]) || state.getIn(['setting', 'defaultSetting'])

  const columns = [
    {
      title: I18n.t('mybets.event_time'),
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
      title: I18n.t('mybets.stake') + '(' + (setting.get('currencyFormat') === 'BTC' ? 'Ƀ' : 'm') + ')',
      dataIndex: 'amount_to_bet',
      key: 'amount_to_bet',
    },
    {
      title: I18n.t('mybets.profit')  + '(' + (setting.get('currencyFormat') === 'BTC' ? 'Ƀ' : 'm') + ')',
      dataIndex: 'amount_to_win',
      key: 'amount_to_win'
    }
  ];

  let mergeData = [];
  let exportData = [];
  let total = 0;
  if((tabKey !== 'resolvedBets' &&  state.getIn(['bet','getOngoingBetsLoadingStatus']) === LoadingStatus.DONE) ||
    (tabKey === 'resolvedBets' &&  state.getIn(['bet','getResolvedBetsLoadingStatus']) === LoadingStatus.DONE)){

    //merge bets data based on tab selected
    if(tabKey === 'unmatchedBets'){
      mergeData = MyWagerPrivateFunctions.mergeBetData(
        state.getIn(['bet',tabKey + 'ById'])
          //filtering unmatchedBets - cancelled bets
          .filter(row => !state.getIn(['bet','cancelBetsByIdsLoadingStatus']).get(row.get('id')))
        , state);
    }
    else
      mergeData = MyWagerPrivateFunctions.mergeBetData(state.getIn(['bet',tabKey + 'ById']), state);

    //formating data for display
    mergeData = MyWagerPrivateFunctions.formatBettingData(mergeData, state.getIn(['asset', 'assetsById', '1.3.0']).get('precision'),
      setting.get('currencyFormat'));

    //totalling the Bets stake and profit/liability
    mergeData.forEach((row, index) => {
      total += parseFloat(row.get('amount_to_bet') + row.get('amount_to_win'));
    });

    //TODO: verify if we will use 5 or 6 digits after decimal
    total = total.toFixed(5);
  }

  if(tabKey === 'resolvedBets' &&  state.getIn(['bet','getResolvedBetsExportLoadingStatus']) === LoadingStatus.DONE){
    exportData = MyWagerPrivateFunctions.mergeBetData(state.getIn(['bet','resolvedBetsExportById']), state);
    //formating data for display
    exportData = MyWagerPrivateFunctions.formatBettingDataToExport(exportData, state.getIn(['asset', 'assetsById', '1.3.0']).get('precision'),
      setting.get('currencyFormat'));

    //Generated Resolved bets export object array using foreach to display properties in particular order in excel.
    //TODO: Need to check if this can be improved
    /*NOTE: Things to be taken care of for Resolved bet export data are listed below:-
      1. Object property name change as per column configuration
      2. Sequence of properties in Object as per column configuration
      3. Removing unwanted columns from export data
    */
    exportData.forEach((row, index) => {
      let formattedRow = {};
      for (var i = 0; i < columns.length; i++) {
        formattedRow[columns[i].title] = row.get(columns[i].key);
      }
      exportData[index] = formattedRow;
    });
  }

  switch (tabKey) {
    case 'unmatchedBets':
      return {
        unmatchedBetsColumns: columns,
        unmatchedBetsData: mergeData,
        unmatchedBetsLoadingStatus: state.getIn(['bet','getOngoingBetsLoadingStatus']),
        unmatchedBetsCurrencyFormat: setting.get('currencyFormat'),
        unmatchedBetsTotal: total
      }
    case 'matchedBets':
      return {
        matchedBetsColumns: columns,
        matchedBetsData: mergeData,
        matchedBetsLoadingStatus: state.getIn(['bet','getOngoingBetsLoadingStatus']),
        matchedBetsCurrencyFormat: setting.get('currencyFormat'),
        matchedBetsTotal: total
      }
    case 'resolvedBets':
      return {
        resolvedBetsColumns: columns,
        resolvedBetsData: mergeData,
        resolvedBetsLoadingStatus: state.getIn(['bet','getResolvedBetsLoadingStatus']),
        resolvedBetsCurrencyFormat: setting.get('currencyFormat'),
        resolvedBetsTotal: total,
        resolvedBetsExportData: exportData,
        resolvedBetsExportLoadingStatus: state.getIn(['bet','getResolvedBetsExportLoadingStatus'])
      }
    default:
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
    cancelBets: BetActions.cancelBets
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyWager);
