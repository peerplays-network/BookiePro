/**
 * The ComplexBettingWidget, also known as Full Market Betting Widget, is used in
 * the BettingMarketGroup (Market) component only. It displays 6 best odds from
 * each selection, 3 in Back and 3 in Lay.
 *
 * The main underlying component is a ReactTable object. Each table cell displays
 * the Odds and the associated Liquidity value. If there is no available odds in
 * one of the selection, an "offer" cell which will be displayed instead (with
 * the word OFFER inside).
 *
 * User can also use the arrow buttons < and > to view the full book to look at
 * the rest of the avaialble odds. Only the best 6 of both selections are shown
 * initially.
 *
 * When a user clicks on a cell, a Betslip will be added with the odds value (if
 * available) in the Market Drawer.
 *
 * This component does not rely on any state in the Redux store. All data displayed
 * are provided by outer component as props.
 */
import React, { PureComponent } from 'react';
import { BettingModuleUtils, CurrencyUtils } from '../../../utility';
import { BetTypes, LoadingStatus } from '../../../constants';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Immutable from 'immutable';
import { Icon } from 'antd';
import RulesButton from '../RulesButton'
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';

// number of best odds to be shown in each market ( Back and Lay )
const itemDisplay = 3;

class ComplexBettingWidget extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      // tableData used in data props in react-table
      tableData:  Immutable.fromJS([]),
      backAllPercent: 0,
      layAllPercent: 0,
    }

    /*
     * Only call the function argument if the Market Drawer is ready for new bet (i.e. no overlay)
     * This allows us to control the various event handler's behavior without modifying the
     * actual handler code. Otherwise, we need to add an if-statement in every handler function.
     */
    const callIfMarketDrawerIsReady = (fn) => {
      return (...args) => { if (this.props.canCreateBet === true) fn(...args) }
    };

    this.onOfferClicked = callIfMarketDrawerIsReady(this.onOfferClicked.bind(this));
    this.shiftOfferDisplay = callIfMarketDrawerIsReady(this.shiftOfferDisplay.bind(this));
    this.setTableData = this.setTableData.bind(this);
    this.placeAllBestBets = callIfMarketDrawerIsReady(this.placeAllBestBets.bind(this));
    this.getBestOfferOfEachmarket = this.getBestOfferOfEachmarket.bind(this);
    this.displayStatus = this.displayStatus.bind(this);
  }

  componentDidMount(){
    this.setTableData(this.props.marketData, this.props.unconfirmedBets, false)
  }

  // re-render when there is update in bets or navigation
  componentWillReceiveProps(nextProps) {
    //only perform calculation when there exists changes in related data
    if (this.props.marketData !==  nextProps.marketData ||
      this.props.unconfirmedBets !== nextProps.unconfirmedBets){
      this.setTableData(nextProps.marketData, nextProps.unconfirmedBets, this.props.bettingMarketGroupName === nextProps.bettingMarketGroupName)
    }
  }

  /**
   * updating the tableData consumed by react-table
   *
   *                 ---------------------|-------------------  BACK ALL (row.back)   --------|     LAY ALL (row.lay) -------------------------|
   * ROW 1 row.firstColumn--------| backTableData[2] | backTableData[1] | backTableData[0] | layTableData[0] | layTableData[1] | layTableData[2] |
   * ROW 2 row.firstColumn--------| backTableData[2] | backTableData[1] | backTableData[0] | layTableData[0] | layTableData[1] | layTableData[2] |
   *
   * @param {object} tableData - a ImmutableJS List of ImmutableJS Map objects representing, existing tableData used by react-table
   * @param {object} unconfirmedBets - a ImmutableJS List of ImmutableJS Map objects representing, unconfirmed bets in bet table
   * @param {integer} reserveIndex - whether to reset the paging to zero. false => reset, true => no reset
   */
  setTableData(tableData, unconfirmedBets, reserveIndex){
    let bmgs = tableData ? tableData.size : -1
    let backs = 0, lays = 0

    if ( tableData && !tableData.isEmpty()){

      let backBookPercent = BettingModuleUtils.getBookPercentage( this.getBestOfferOfEachmarket(tableData, BetTypes.BACK) );
      let layBookPercent = BettingModuleUtils.getBookPercentage( this.getBestOfferOfEachmarket(tableData, BetTypes.LAY) );
      var winOrLose = false;
      tableData.forEach((row, i) => {
        //in i th row
        // Retrieve the status of the betting market from the table data. A value of true means that the betting market has a status that is equivalent to resolved.
        var stat = tableData.getIn([i, 'bmStatus']);
        if(stat[0]){
          winOrLose = true;
        }
        //retrieve paging Index from previous state
        let backStartingIndex = 0
        if ( reserveIndex && this.state.tableData && this.state.tableData.hasIn([i, 'offer', 'backIndex']) ){
          backStartingIndex = this.state.tableData.getIn([i, 'offer', 'backIndex']) //retrieve scrolling Index from previous state
        }
        //get back offer data
        let backTableData = tableData.getIn([i, 'offer', 'backOrigin'])
          .slice(backStartingIndex, backStartingIndex + itemDisplay);

        // BOOK-384
        // Author: Keegan Francis   :   k.francis@pbsa.info
        // This forEach loop on the backTable will correct the price of each cell
        //  so that the amount of money sitting in the bettingMarket is correct.
        backTableData.forEach((item, index) => {
          let newPrice = backTableData.getIn([index, 'price']) / (backTableData.getIn([index, 'odds']) - 1)
          backTableData = backTableData.setIn([index, 'price'], newPrice )
        })


        if (backTableData.size > 0) backs++

        //retrieve paging Index from previous state
        let layStartingIndex = 0
        if ( reserveIndex && this.state.tableData && this.state.tableData.hasIn([i, 'offer', 'layIndex']) ){
          layStartingIndex = this.state.tableData.getIn([i, 'offer', 'layIndex']) //retrieve scrolling Index from previous state
        }
        //get lay offer data
        const layTableData = tableData.getIn([i, 'offer', 'layOrigin'])
          .slice(layStartingIndex, layStartingIndex + itemDisplay)

        if (layTableData.size > 0) lays++

        //get Exposure
        let market_exposure = 0.00
        const bettingMarketId = row.getIn(['offer', 'bettingMarketId']);
        const betslip_exposure = BettingModuleUtils.getExposure(bettingMarketId, unconfirmedBets);

        // get data for 'firstColumn' in which exposure and team name reside in .
        tableData = tableData.setIn([i, 'offer', 'back'], backTableData)
          .setIn([i, 'offer', 'lay'], layTableData)
          .setIn([i, 'offer', 'backIndex'], backStartingIndex)
          .setIn([i, 'offer', 'layIndex'], layStartingIndex)
          .setIn([i, 'firstColumn'], {
            'name': tableData.getIn([i, 'name']),
            'displayedName': tableData.getIn([i, 'displayedName']),
            'market_exposure': market_exposure,
            'bettingMarket_status': tableData.getIn([i, 'bettingMarket_status']),
            'bmStatus': tableData.getIn([i, 'bmStatus']),
            'betslip_exposure': parseFloat(betslip_exposure) !== 0 ?  betslip_exposure : undefined })
      });

      this.setState({
        tableData,
        backBookPercent: backs === bmgs ? backBookPercent : 0,
        layBookPercent: lays === bmgs ? layBookPercent : 0,
        winOrLose
      })
    } else {
      this.setState({
        tableData: Immutable.List()
      })
    }

  }

  /**
   * This function is used by arrow buttons in both back and lay sides.
   *
   * Arrow buttons are for user to go through the back/lay odds from best available to worst available and the Offer option,
   * it will be disabled when it reaches the end of available odds and the Offer cell.
   *
   * @param {integer} index - rowIndex / viewIndex, the index of the row relative to the current view https://github.com/react-tools/react-table#renderers
   * @param {string} type - BetTypes.BACK or BetTypes.LAY
   * @param {integer} change - position shift upon clicking the arrow, use positive value for forward, use negative value for backword
   */
  shiftOfferDisplay(index, type, change){

    let updatedTableData = this.state.tableData;
    let offerIndex = updatedTableData.getIn([index, 'offer', type + 'Index'])
    let layList = updatedTableData.getIn([index, 'offer', type + 'Origin'])

    // in UI back odds and lay odds are in different orders in
    // so the arror button with same direction in back and lay are of difference shifting direction.
    if ( type === BetTypes.BACK){

      change *= -1

    }

     // marginal case checking : reaching the end of available odds.
    if ( layList.size < itemDisplay ||
      ( change === -1 && offerIndex === 0) ||
      ( change === 1 && offerIndex + itemDisplay  > layList.size)){
      return
    }

    offerIndex += change
    updatedTableData = updatedTableData.setIn([index, 'offer', type + 'Index'], offerIndex)
      .setIn([index, 'offer', type], layList.slice(offerIndex, offerIndex + itemDisplay));

    this.setState({
      tableData: updatedTableData
    })

  }

  /**
   * This callback function is used by odds cell in both back and lay sides
   *
   * Create a new betslip in the betting drawer, with the odds pre-filled.
   *
   * please refer to https://github.com/react-tools/react-table#custom-props for rowInfo and column
   * @param {object} rowInfo - built-in param in func props of react-table   getTdProps={(state, rowInfo, column, instance)
   * @param {object} column - built-in param in func props of react-table   getTdProps={(state, rowInfo, column, instance)
   */
  onOfferClicked(rowInfo, column) {
    const betType = column.className;

    // for 'null OFFER' case in which we only see 'OFFER' in item, offer will be empty
    const offer = Immutable.fromJS(rowInfo.rowValues[column.id]);
    // Only need the odds value
    const odds = offer && offer.get('odds');
    const bettingMarketId = rowInfo.row.offer.bettingMarketId;
    this.props.createBet(betType, bettingMarketId, odds);
  }

  /**
    * This function is used by 'back all' and 'lay all' buttons
    *
    * It will create betslips for all team's best back odds/ best lay odds, if offer exist.
    *
    * @param {object} event - onclick event
    */
  placeAllBestBets(event) {
    const {id} = event.target;
    const betType = id
    this.state.tableData.filter( item => item.hasIn([ 'offer', betType + 'Origin', '0' ]) )
    .forEach( row => {
      const offer = row.getIn([ 'offer', betType + 'Origin', '0' ])
      const odds = offer && offer.get('odds');
      const bettingMarketId = row.getIn( ['offer', 'bettingMarketId'])

      this.props.createBet(betType, bettingMarketId, odds);
    });



  }
  /**
    * get the best back/lay odds in tableData.
    *
    * @param {object} tableData - a ImmutableJS List of ImmutableJS Map objects representing existing tableData in react-table
    * @param {string} type - BetTypes.BACK or BetTypes.LAY
    * @return {Immutable.List} list of best odds to be used for book percentage caluclation.
    */
  getBestOfferOfEachmarket(tableData, betType){
    return tableData.map( item => {

      return item.getIn([ 'offer', betType + 'Origin', '0' ])

    }).filter( item => {
      return item !== undefined
    });
  }
  displayStatus(status, typeOfDisplay){
    if(status === 'unresolved' || status[3][1] === 'unresolved'){ // [3][1] <- references the betting market information in the status array
      return null;
    }
    if(typeOfDisplay === 'indicator'){
      return (
        <span className={ status[3][0] }>
        <span className='indicator'/>{ I18n.t('object_status_enumerator.' + status[3][1]) }</span>
      )     
    } else{ // complex-outcome overlay
      let i = status[4];
      if(i === 3){ // result needed is in child array.
        return I18n.t('object_status_enumerator.' + status[3][1]);
      } else{
        return I18n.t('object_status_enumerator.' + status[i]);
      }
    }
  }

  render() {
    const { currencyFormat,
            totalMatchedBetsAmount,
            widgetTitle,
            rules,
            oddsFormat
    } = this.props;

    const minNameWidth = 194;
    const minOfferWidth = 52;
    const minArrowWidth = 22;
    // to match the back bet-type in placebet action dispatch
    const classNameBack = BetTypes.BACK;
    // to match the lay bet-type in placebet action dispatch
    const classNameLay = BetTypes.LAY;

    // Column names;
    const competitorColumn = {
      header: props => null,
      minWidth: minNameWidth,
      accessor: 'firstColumn',
      sortable: false,
      render: props => {
        const marketExposure =
          CurrencyUtils.toFixedWithSymbol('exposure', parseFloat(props.value.market_exposure), currencyFormat);

        const potentialExposure = CurrencyUtils.toFixedWithSymbol(
           'exposure',
           parseFloat(BettingModuleUtils.getPotentialExposure(props.value.market_exposure, props.value.betslip_exposure )),
           currencyFormat);

        const marketExposureClass = props.value.market_exposure >= 0 ?
          'increased-value' : 'decreased-value';
        const potentialExposureClass = props.value.betslip_exposure + props.value.market_exposure >= 0 ?
          'increased-value' : 'decreased-value';  

        return (
          <div className='competitor'>
            { this.state.winOrLose ? <div className='complex-outcome'>{ this.displayStatus(props.value.bmStatus, 'complex-outcome') }</div> : null }
            <div className='name'>{props.value.displayedName} 
              { this.state.winOrLose ? null : this.displayStatus(props.value.bmStatus, 'indicator') }
            </div>
            { props.value.betslip_exposure &&
              <div className='exposure'>
                {  props.value.market_exposure > 0 &&
                  <span className={ marketExposureClass }>{ marketExposure }</span>
                }
                <Icon type='caret-right'></Icon>
                <span className={ potentialExposureClass  }>{ potentialExposure }</span>
              </div>
            }
          </div>
        )
      }
    };

    const backArrowsColumn = {
      header: props => null,
      minWidth: minArrowWidth,
      sortable: false,
      render: props =>
        <div className={ `back-arrows-col arrows-col${this.state.winOrLose ? ' disabled' : '' }` }>
          <i className='icon-left-arrow' onClick={ () => this.shiftOfferDisplay(props.viewIndex, 'back', -1) }></i>
          <i className='icon-right-arrow' onClick={ () => this.shiftOfferDisplay(props.viewIndex, 'back', 1) }></i>
        </div>
    };

    const backOfferOne = {
      id: 'back3',
      minWidth: minOfferWidth,
      className: classNameBack,
      sortable: false,
      accessor: row => row.offer.back.length > 2 ? row.offer.back[2] : undefined,
      header:  props =>
        <div className={ props.data[0].firstColumn.bmStatus[0] ? 'offer-header back disabled' : 'offer-header back disabled' }>
          { this.state.backBookPercent > 0 ? (<p>{ this.state.backBookPercent }%</p>) : '' }
        </div>,
      render: props => props.value ?
        <div className={ props.row.bmStatus[0] ? 'back-offer back-bg disabled' : 'back-offer back-bg' }>                
          <div className='odds'>{ props.row.bmStatus[0] ? null : BettingModuleUtils.oddsFormatFilter(props.value.odds, oddsFormat) }</div>
          <div className='price'>
            {  props.row.bmStatus[0] ? null : CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(props.value.price, 'BTC', BettingModuleUtils.stakePlaces, true)}</div>
        </div> :
        <div className={ props.row.bmStatus[0] ? 'back-offer empty-offer disabled' : 'back-offer empty-offer' }>                
          <div className='odds-offer'>
            <p>{props.row.bmStatus[0] ? null : I18n.t('complex_betting_widget.offer')}</p>
          </div>
        </div>
    };

    const backOfferTwo = {
      id: 'back2',
      minWidth: minOfferWidth,
      className: classNameBack,
      sortable: false,
      accessor: row => row.offer.back.length > 1 ? row.offer.back[1] : undefined,
      header: props => null,
      headerClassName: 'back-all-offer-border',
      render: props => props.value ?
        <div className={ props.row.bmStatus[0] ? 'back-offer back-bg disabled' : 'back-offer back-bg' }>        
          <div className='odds'>{ props.row.bmStatus[0] ? null : BettingModuleUtils.oddsFormatFilter(props.value.odds, oddsFormat) }</div>
          <div className='price'>
            { props.row.bmStatus[0] ? null : CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(props.value.price, 'BTC', BettingModuleUtils.stakePlaces, true)}</div>
        </div> :
        <div className={ props.row.bmStatus[0] ? 'back-offer empty-offer disabled' : 'back-offer empty-offer' }>        
          <div className='odds-offer'>
            <p>{props.row.bmStatus[0] ? null : I18n.t('complex_betting_widget.offer')}</p>
          </div>
        </div>
    };

    const backOfferThree = {
      id: 'back1',
      minWidth: minOfferWidth,
      className: classNameBack,
      sortable: false,
      accessor: row => row.offer.back.length > 0 ? row.offer.back[0] : undefined,
      header: (props) => {
        const isDisabled = props.data[0].firstColumn.bmStatus[0];

        return (<div className={ `offer-header back-all-offer${isDisabled ? ' disabled' : ''}` }>
          <p id={ BetTypes.BACK } onClick={ this.placeAllBestBets } >{ !isDisabled ? I18n.t('complex_betting_widget.back_all') : null }</p>
        </div>)
      },
      render: props => props.value ?
      <div className={ props.row.bmStatus[0] ? 'back-offer back-all-offer best-offer disabled' : 'back-offer back-all-offer best-offer' }>
        <div className='odds'>{ props.row.bmStatus[0] ? null : BettingModuleUtils.oddsFormatFilter(props.value.odds, oddsFormat) }</div>
        <div className='price'>
            { props.row.bmStatus[0] ? null : CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(props.value.price, "BTC", BettingModuleUtils.stakePlaces, true)}</div>
        </div> :
        <div className={ props.row.bmStatus[0] ? 'back-offer empty-offer disabled' : 'back-offer empty-offer best-offer' }>
          <div className='odds-offer'>
            <p>{ props.row.bmStatus[0] ? null : I18n.t('complex_betting_widget.offer')}</p>
          </div>
        </div>
    };

    const layOfferOne = {
      id: 'lay1',
      minWidth: minOfferWidth,
      className: classNameLay,
      sortable: false,
      accessor: row => row.offer.lay.length > 0 ? row.offer.lay[0] : undefined,
      header:  (props) => {   
        const isDisabled = props.data[0].firstColumn.bmStatus[0];

        return (<div className={ `offer-header lay-all-offer${isDisabled ? ' disabled' : ''}` }>
          <p id={ BetTypes.LAY } onClick={ this.placeAllBestBets } >{ !isDisabled ? I18n.t('complex_betting_widget.lay_all') : null }</p>
        </div>);
      },
      render: props => props.value ?
        <div className={ props.row.bmStatus[0] ? 'lay-offer lay-all-offer best-offer disabled' : 'lay-offer lay-all-offer best-offer' }>
          <div className='odds'>{ props.row.bmStatus[0] ? null : BettingModuleUtils.oddsFormatFilter(props.value.odds, oddsFormat) }</div>
          <div className='price'>
            {  props.row.bmStatus[0] ? null : CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(props.value.price, 'BTC', BettingModuleUtils.stakePlaces, true)}</div>
        </div> :
        <div className={ props.row.bmStatus[0] ? 'lay-offer empty-offer best-offer disabled' : 'lay-offer empty-offer best-offer' }>
          <div className='odds-offer'>
            <p>{ props.row.bmStatus[0] ? null : I18n.t('complex_betting_widget.offer')}</p>
          </div>
        </div>
    };

    const layOfferTwo = {
      id: 'lay2',
      minWidth: minOfferWidth,
      className: classNameLay,
      sortable: false,
      accessor: row => row.offer.lay.length > 1 ? row.offer.lay[1] : undefined,
      header: props => null,
      render: props => props.value ?
      <div className={ props.row.bmStatus[0] ? 'lay-offer lay-bg disabled' : 'lay-offer lay-bg' }>      
          <div className='odds'>{  props.row.bmStatus[0] ? null : BettingModuleUtils.oddsFormatFilter(props.value.odds, oddsFormat) }</div>
          <div className='price'>
            {  props.row.bmStatus[0] ? null : CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(props.value.price, 'BTC', BettingModuleUtils.stakePlaces, true)}</div>
        </div> :
        <div className={ props.row.bmStatus[0] ? 'lay-offer empty-offer disabled' : 'lay-offer empty-offer' }>
          <div className='odds-offer'>
            <p>{ props.row.bmStatus[0] ? null : I18n.t('complex_betting_widget.offer')}</p>
          </div>
        </div>
    };

    const layOfferThree = {
      id: 'lay3',
      minWidth: minOfferWidth,
      className: classNameLay,
      sortable: false,
      accessor: row => row.offer.lay.length > 2 ? row.offer.lay[2] : undefined,
      header: props => 
       <div className={ props.data[0].firstColumn.bmStatus[0] ? 'offer-header lay disabled' : 'offer-header lay' }>
          { this.state.layBookPercent > 0 ? (<p>{ this.state.layBookPercent }%</p>) : '' }
       </div>,
      render: props => props.value ?
        <div className={ props.row.bmStatus[0] ? 'lay-offer lay-bg disabled' : 'lay-offer lay-bg' }>
          <div className='odds'>{ props.row.bmStatus[0] ? null : BettingModuleUtils.oddsFormatFilter(props.value.odds, oddsFormat) }</div>
          <div className='price'>
            { props.row.bmStatus[0] ? null : CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(props.value.price, 
            "BTC", BettingModuleUtils.stakePlaces, true)}</div>
      </div> :
      <div className={ props.row.bmStatus[0] ? 'lay-offer empty-offer disabled' : 'lay-offer empty-offer' }>
        <div className='odds-offer'>
          <p>{ props.row.bmStatus[0] ? null : I18n.t('complex_betting_widget.offer')}</p>
        </div>
      </div>
    };

    const layArrowsColumn = {
      header: props => null,
      minWidth: minArrowWidth,
      sortable: false,
      render: props =>
        <div className={ `lay-arrows-col arrows-col${this.state.winOrLose ? ' disabled' : '' }` }>
          <i className='icon-left-arrow' onClick={ () => this.shiftOfferDisplay(props.viewIndex, 'lay', -1) }></i>
          <i className='icon-right-arrow' onClick={ () => this.shiftOfferDisplay(props.viewIndex, 'lay', 1) }></i>
        </div>
    };

    const columns = [
      competitorColumn,
      backArrowsColumn,
      backOfferOne,
      backOfferTwo,
      backOfferThree,
      layOfferOne,
      layOfferTwo,
      layOfferThree,
      layArrowsColumn
    ];

    return (

      <div className='complex-betting'>
        <div className='title'>
          <div className='name'>
            { widgetTitle }
            <span className={ this.props.bettingMarketGroupStatus }>
            <span className='indicator'/>{I18n.t('object_status_enumerator.' + this.props.bettingMarketGroupStatusClassName)}</span>
          </div>
          <div className='rules'>
            <span>{ I18n.t('complex_betting_widget.matched') }</span>
            { this.props.loadingStatus === LoadingStatus.DONE ? totalMatchedBetsAmount : '' }
            <RulesButton rules={ rules } />
          </div>
        </div>
        {
          this.state.tableData.isEmpty() ?
          <div/>
          :
          <ReactTable 
            pageSize={ this.state.tableData.size }
            data={ this.state.tableData.toJS() }
            columns={ columns }
            resizable={ false }
            multiSort={ false }
            sortable={ false }
            showPagination={ false }
            getTrProps={ (state, rowInfo, column) => {
              return {
                style: {
                  background: rowInfo.row.bmStatus[0] ? 'lightSlateGray' : null, 
                }
              }
            }
            }
            getTdProps={ (state, rowInfo, column, instance) => {  
              return {
                onClick: (event) => {
                  if ( column.className === BetTypes.LAY || column.className === BetTypes.BACK){
                    if(!rowInfo.row.bmStatus[0]){
                      this.onOfferClicked(rowInfo, column)
                    }
                  }
                }
              }
            }
          }
          />
        }
      </div>
    );

  }
}

ComplexBettingWidget.propTypes = {
  marketData: PropTypes.any.isRequired,
  totalMatchedBetsAmount: PropTypes.any.isRequired,
  createBet: PropTypes.func.isRequired,
  // unconfirmedBets data in bet table
  eventStatus: PropTypes.any,
  bettingMarketGroupStatus: PropTypes.string,
  bettingMarketGroupStatusClassName: PropTypes.string,
  unconfirmedBets: PropTypes.any,
  currencyFormat: PropTypes.string.isRequired,
  oddsFormat: PropTypes.string.isRequired,
  canCreateBet: PropTypes.any.isRequired,
  isLiveMarket: PropTypes.bool,
};

export default ComplexBettingWidget;
