/**
 * This is mywager component with tabbed view of Unmatched, Matched and Resolved bets
 *
 * following are sub-components used in MyWager
 *   {@link UnmatchedBets} - This component list unmatched bet transactions
 *   Unmatched bets - Placed bets that are pending for someone to make an opposite bet with same 
 *   odds to match on
 *
 *   {@link MatchedBets} - This component list Matched bet transactions
 *   Matched bets - Bets that are matched with certain opposite bets, pending for the market to end 
 *   and get resolved
 *
 *   {@link ResolvedBets} - This component list Resolved bet transactions
 *   Resolved bets - When a market with the user’s bet is ended and bets resolved
 *
 * The states of this component are maintained in a number of Redux stores
 * which are encapsulated in 'MyWager'
 *
 * Following are the actions dispatched for various purposes in this component:
 *   {@link MywagerActions#setResolvedBetsTimeRangeAction}
 *   {@link MywagerActions#generateResolvedBetsExportData}
 *   {@link MywagerActions#resetResolvedBetsExportDataAction}
 *   {@link MywagerActions#setMywagerActiveTab}
 *   {@link NavigateActions#navigateTo}
 *   {@link BetActions#cancelBets}
 *
 * MyWagerSelector is the source of bets listing
 */
import React, {PureComponent} from 'react';
import {CurrencyUtils} from '../../utility';
import {Tabs, Breadcrumb} from 'antd';
import UnmatchedBets from './UnmatchedBets';
import MatchedBets from './MatchedBets';
import ResolvedBets from './ResolvedBets';
import {NavigateActions, BetActions, MywagerActions} from '../../actions';
import {BettingModuleUtils} from '../../utility';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Map} from 'immutable';
import {I18n} from 'react-redux-i18n';
import {MyWagerSelector, MyAccountPageSelector} from '../../selectors';
import {MyWagerTabTypes} from '../../constants';
import PeerPlaysLogo from '../PeerPlaysLogo';

const {getBetData, getBetTotal, getCurrencyFormat, getBetsLoadingStatus} = MyWagerSelector;
const TabPane = Tabs.TabPane;

//* Mywager component */
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
    this.handleEventClick = this.handleEventClick.bind(this);
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

  /** Redirect to 'Home' screen when clicked on 'Home' link on the Breadcrumb */
  onHomeLinkClick(e) {
    e.preventDefault();
    this.props.navigateTo('/exchange');
  }

  /**
   * Called when 'Search' button clicked in Resolved bets screen
   * @param {string} periodType - date filter selection
   * @param {object} customTimeRangeStartDate - start date of time range
   * @param {object} customTimeRangeEndDate - end date of time range
   *
   * Dispatched action: {@link MywagerActions#setResolvedBetsTimeRangeAction}
   *    the state 'periodType','customTimeRangeStartDate','customTimeRangeEndDate'
   *    is updated under the 'MyWager' store when Resolved bets are searched
   */
  handleSearchClick(periodType, customTimeRangeStartDate, customTimeRangeEndDate) {
    // Set time range.
    this.props.setResolvedBetsTimeRange(
      periodType,
      customTimeRangeStartDate,
      customTimeRangeEndDate
    );
  }

  /**
   * Called when 'Export' button clicked in Resolved bets screen
   * @param {string} periodType - date filter selection
   * @param {object} customTimeRangeStartDate - start date of time range
   * @param {object} customTimeRangeEndDate - end date of time range
   *
   * Dispatched action: {@link MywagerActions#setResolvedBetsTimeRangeAction}
   *    the state 'periodType','customTimeRangeStartDate','customTimeRangeEndDate'
   *    is updated under the 'MyWager' store
   * Dispatched action: {@link MywagerActions#generateResolvedBetsExportData}
   *    the state 'resolvedBetsExportData','generateResolvedBetsExportDataLoadingStatus' ,
   *    'generateResolvedBetsExportDataError' are updated under the 'MyWager' store
   */
  handleExportClick(periodType, customTimeRangeStartDate, customTimeRangeEndDate) {
    // First set the history time range, so the search result is re-filtered
    this.props.setResolvedBetsTimeRange(
      periodType,
      customTimeRangeStartDate,
      customTimeRangeEndDate
    );
    // Then generate export data
    this.props.generateResolvedBetsExportData(this.props.betsData);
  }

  handleExportFinishDownload() {
    // Reset
    this.props.resetResolvedBetsExportLoadingStatus();
    this.props.clearResolvedBetsExport();
    this.setState({exportButtonClicked: false});
  }

  /**
   * Called when 'Export' process is cancelled or download of exported data file is completed
   * export state in redux store set to default
   *
   * Dispatched action: {@link MywagerActions#resetResolvedBetsExportDataAction}
   *    the state 'resolvedBetsExportData','generateResolvedBetsExportDataLoadingStatus' ,
   *    'generateResolvedBetsExportDataError' are updated under the 'MyWager' store
   *
   * Export modal popup hides on reset
   */
  handleResetExport() {
    this.props.resetResolvedBetsExportDataAction();
  }

  /**
   * Called on tab click - Unmatched Bets, Matched Bets, Resolved Bets
   * @param {string} key - active tab key
   *
   * Dispatched action: {@link MywagerActions#setMywagerActiveTab}
   *    the state 'activeTab' is  updated under the 'MyWager' store
   *    change in state will trigger to load data for active tab
   */
  onTabChange(key) {
    this.props.setActiveTab(key);
  }

  /**
   * Called on 'event name' click in Unmatched bets list {@link UnmatchedBets}
   * @param {object} record - bet object
   * @param {object} event - the click event
   *
   * Dispatched action: {@link NavigateActions#navigateTo}
   *    This will navigat user to event full market screen
   */
  handleEventClick(record) {
    this.props.navigateTo(`/exchange/bettingmarketgroup/${record.group_id}`);
  }

  /**
   * Called on 'Cancel' click in {@link UnmatchedBets}
   * This is not actual cancel of transaction in blockchain.
   * @param {object} record - bet object to cancel.
   * @param {object} event - the click event
   *
   * Dispatched action: {@link BetActions#cancelBets}
   *    the state 'cancelBetsByIdsLoadingStatus' is  updated under the 'Bet' store
   *    change in state will trigger to load Unmatched Transactions
   *    This is temporary cancel. This doesn't have any effect on blockchain data yet.
   */
  cancelBet(record) {
    //cancelBets expects array of immutable bet objects. converting simple object to immutable list
    this.props.cancelBets([Map(record)]);
  }

  /**
   * Called on 'Confirm' click in Cancel all confirm modal popup {@link UnmatchedBets}
   *
   * Dispatched action: {@link BetActions#cancelBets}
   *    the state 'cancelBetsByIdsLoadingStatus' is  updated under the 'Bet' store
   *    change in state will trigger to load Unmatched Transactions
   *    This is temporary cancel. This doesn't have any effect on blockchain data yet.
   */
  handleCancelAllBets() {
    this.props.cancelBets(this.props.betsData);
    this.setState({isCancelAllConfirmModalVisible: false});
  };

  /** set local state isCancelAllConfirmModalVisible to false - This will hide 
   * cancelAllConfirmModal on decline 
   */
  declineCancelAllBets() {
    this.setState({isCancelAllConfirmModalVisible: false});
  };

  /**
   * Called on 'Cancel All' click in {@link UnmatchedBets}
   * set local state isCancelAllConfirmModalVisible to true
   * isCancelAllConfirmModalVisible value true will trigger to show Confirmation pop-up
   * for deleting all Unmatched bets.
   */
  cancelAllBets() {
    event.preventDefault();
    //To show export related status after the 'Export' button is clicked
    this.setState({isCancelAllConfirmModalVisible: true});
    //this.props.cancelBets(this.props.betsData);
  }

  render() {
    return (
      <div className='my-wager section-padding'>
        <Breadcrumb className='bookie-breadcrumb'>
          <Breadcrumb.Item>
            <a onClick={ this.onHomeLinkClick }>{I18n.t('mybets.home')} </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{I18n.t('mybets.mybets')}</Breadcrumb.Item>
        </Breadcrumb>

        <Tabs
          className='content bookie-tab'
          defaultActiveKey={ MyWagerTabTypes.UNMATCHED_BETS }
          onChange={ this.onTabChange }
        >
          <TabPane tab={ I18n.t('mybets.unmatched_bets') } key={ MyWagerTabTypes.UNMATCHED_BETS }>
            <UnmatchedBets
              unmatchedBets={ filterOdds(this.props.betsData.toJS(), this.props.oddsFormat) }
              unmatchedBetsLoadingStatus={ this.props.betsLoadingStatus }
              onEventClick={ this.handleEventClick }
              currencyFormat={ this.props.betsCurrencyFormat }
              betsTotal={ this.props.betsTotal }
              onCancelBetClick={ this.cancelBet }
              onCancelAllBetsClick={ this.cancelAllBets }
              isCancelAllConfirmModalVisible={ this.state.isCancelAllConfirmModalVisible }
              handleCancelAllBets={ this.handleCancelAllBets }
              declineCancelAllBets={ this.declineCancelAllBets }
            />
          </TabPane>
          <TabPane tab={ I18n.t('mybets.matched_bets') } key={ MyWagerTabTypes.MATCHED_BETS }>
            <MatchedBets
              matchedBets={ filterOdds(this.props.betsData.toJS(), this.props.oddsFormat) }
              onEventClick={ this.handleEventClick }
              matchedBetsLoadingStatus={ this.props.betsLoadingStatus }
              currencyFormat={ this.props.betsCurrencyFormat }
              betsTotal={ this.props.betsTotal }
              oddsFormat={ this.props.oddsFormat }
            />
          </TabPane>
          <TabPane tab={ I18n.t('mybets.resolved_bets') } key={ MyWagerTabTypes.RESOLVED_BETS }>
            <ResolvedBets
              resolvedBets={ filterOdds(this.props.betsData.toJS(), this.props.oddsFormat) }
              resolvedBetsLoadingStatus={ this.props.betsLoadingStatus }
              currencyFormat={ this.props.betsCurrencyFormat }
              betsTotal={ this.props.betsTotal }
              handleSearchClick={ this.handleSearchClick }
              handleExportClick={ this.handleExportClick }
              exportData={ this.props.resolvedBetsExportData }
              exportLoadingStatus={ this.props.resolvedBetsExportLoadingStatus }
              handleResetExport={ this.handleResetExport }
              oddsFormat={ this.props.oddsFormat }
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

function filterOdds(tableData, oddsFormat) {
  if (tableData) {
    for (let row in tableData) {
      if (tableData[row]) {
        tableData[row].backer_multiplier = BettingModuleUtils.oddsFormatFilter(
          tableData[row].backer_multiplier,
          oddsFormat
        ).toFixed(CurrencyUtils.fieldPrecisionMap['odds']['BTF']);
      }
    }
  }

  return tableData;
}

const mapStateToProps = state => ({
  betsData: getBetData(state),
  betsLoadingStatus: getBetsLoadingStatus(state),
  betsCurrencyFormat: getCurrencyFormat(state),
  targetCurrency: getCurrencyFormat(state),
  betsTotal: getBetTotal(state),
  oddsFormat: MyAccountPageSelector.oddsFormatSelector(state),
  resolvedBetsExportData: state.getIn(['mywager', 'resolvedBetsExportData']),
  resolvedBetsExportLoadingStatus: state.getIn([
    'mywager',
    'generateResolvedBetsExportDataLoadingStatus'
  ])
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      navigateTo: NavigateActions.navigateTo,
      generateResolvedBetsExportData: MywagerActions.generateResolvedBetsExportData,
      resetResolvedBetsExportDataAction: MywagerActions.resetResolvedBetsExportDataAction,
      cancelBets: BetActions.cancelBets,
      setActiveTab: MywagerActions.setMywagerActiveTab,
      setResolvedBetsTimeRange: MywagerActions.setResolvedBetsTimeRangeAction,
      resetTimeRange: MywagerActions.resetTimeRange
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyWager);
