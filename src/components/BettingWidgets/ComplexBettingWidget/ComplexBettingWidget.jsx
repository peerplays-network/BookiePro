import React, { Component } from 'react';
import { BettingModuleUtils, CurrencyUtils } from '../../../utility';
import { BetTypes, LoadingStatus } from '../../../constants';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Immutable from 'immutable';
import { Icon } from 'antd';
import RulesModal from '../../Modal/RulesModal'
import { I18n, Translate } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import moment from 'moment';

const oddFloatPlaces = 2;
const itemDisplay = 3;

class ComplexBettingWidget extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tableData:  Immutable.fromJS([]),
      backAllPercent: 0,
      layAllPercent: 0,
    }

    this.onOfferClicked = this.onOfferClicked.bind(this);
    this.shiftOfferDisplay = this.shiftOfferDisplay.bind(this);
    this.setTableData = this.setTableData.bind(this);
    this.placeAllBestBets = this.placeAllBestBets.bind(this);
    this.getBestOfferOfEachmarket = this.getBestOfferOfEachmarket.bind(this);
  }

  componentDidMount(){
    this.setTableData(this.props.marketData, this.props.unconfirmedBets, false)
  }

  componentWillReceiveProps(nextProps) {
    //only perform calculation when there exists changes in related data
    if (this.props.marketData !==  nextProps.marketData ||
      this.props.unconfirmedBets !== nextProps.unconfirmedBets){
      this.setTableData(nextProps.marketData, nextProps.unconfirmedBets, this.props.bettingMarketGroupName === nextProps.bettingMarketGroupName)
    }
  }

  // betting widget full :
  //                 ---------------------|-------------------  BACK ALL (row.back)   --------|     LAY ALL (row.lay) -------------------------|
  // COMPTETITOR 1 row.firstColumn--------| backTableData[2] | backTableData[1] | backTableData[0] | layTableData[0] | layTableData[1] | layTableData[2] |
  // COMPTETITOR 2 row.firstColumn--------| backTableData[2] | backTableData[1] | backTableData[0] | layTableData[0] | layTableData[1] | layTableData[2] |
  //
  // genereate firstColumn + layTableData + backTableData for Display
  // among which firstColumn contains team name + exposure caluclation
  setTableData(tableData, unconfirmedBets, reserveIndex){

    if ( !tableData.isEmpty()){

      let backBookPercent = BettingModuleUtils.getBookPercentage( this.getBestOfferOfEachmarket(tableData, BetTypes.BACK) );
      let layBookPercent = BettingModuleUtils.getBookPercentage( this.getBestOfferOfEachmarket(tableData, BetTypes.LAY) );
      tableData.forEach((row, i) => {
        //in i th row

        //get backTableData
        let backStartingIndex = 0
        if ( reserveIndex && this.state.tableData && this.state.tableData.hasIn([i, 'offer', 'backIndex']) ){
          backStartingIndex = this.state.tableData.getIn([i, 'offer', 'backIndex']) //retrieve scrolling Index from previous state
        }
        const backTableData = tableData.getIn([i, 'offer', 'backOrigin'])
          .slice(backStartingIndex, backStartingIndex + itemDisplay);

        //get layTableData
        let layStartingIndex = 0
        if ( reserveIndex && this.state.tableData && this.state.tableData.hasIn([i, 'offer', 'layIndex']) ){
          layStartingIndex = this.state.tableData.getIn([i, 'offer', 'layIndex']) //retrieve scrolling Index from previous state
        }
        const layTableData = tableData.getIn([i, 'offer', 'layOrigin'])
          .slice(layStartingIndex, layStartingIndex + itemDisplay)

        //get Exposure
        let market_exposure = 0.00
        const bettingMarketId = row.getIn(['offer', 'bettingMarketId']);
        const betslip_exposure = BettingModuleUtils.getExposure(bettingMarketId, unconfirmedBets);

        //update i th row
        // equivalant to  rowInfo.row in function onOfferClicked(rowInfo, column)
        tableData = tableData.setIn([i, 'offer', 'back'], backTableData)
          .setIn([i, 'offer', 'lay'], layTableData)
          .setIn([i, 'offer', 'backIndex'], backStartingIndex)
          .setIn([i, 'offer', 'layIndex'], layStartingIndex)
          .setIn([i, 'firstColumn'], {
            'name': tableData.getIn([i, 'name']),
            'displayedName': tableData.getIn([i, 'displayedName']),
            'marketTypeId': tableData.getIn([i, 'marketTypeId']),
            'marketTypeValue': tableData.getIn([i, 'marketTypeValue']),
            'market_exposure': market_exposure,
            'betslip_exposure': parseFloat(betslip_exposure) !== 0 ?  betslip_exposure : undefined })

      });

      this.setState({
        tableData,
        backBookPercent,
        layBookPercent
      })
    } else {
      this.setState({
        tableData: Immutable.List()
      })
    }

  }

  //the arrow onclick funciton
  shiftOfferDisplay(index, type, change){

    let updatedTableData = this.state.tableData;
    let offerIndex = updatedTableData.getIn([index, 'offer', type + 'Index'])
    let layList = updatedTableData.getIn([index, 'offer', type + 'Origin'])

    if ( type === BetTypes.BACK){

      change *= -1

    }

    // marginal case checking.
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

  onOfferClicked(rowInfo, column) {
    const competitor =  rowInfo.rowValues.firstColumn.name;
    const betType = column.className;

    // for 'null OFFER' case in which we only see 'OFFER' in item, offer will be empty
    const offer = Immutable.fromJS(rowInfo.rowValues[column.id]);
    // Only need the odds value
    const odds = offer && offer.get('odds');
    const bettingMarketId = rowInfo.row.offer.bettingMarketId;
    this.props.createBet(competitor, betType, bettingMarketId,
                         rowInfo.rowValues.firstColumn.marketTypeId,
                         rowInfo.rowValues.firstColumn.marketTypeValue,
                         odds);
  }

  placeAllBestBets(event) {
    const {id} = event.target;
    const betType = id
    this.state.tableData.filter( item => item.hasIn([ 'offer', betType + 'Origin', '0' ]) )
    .forEach( row => {
      const competitor =  row.get('name');
      const offer = row.getIn([ 'offer', betType + 'Origin', '0' ])
      const odds = offer && offer.get('odds');
      const bettingMarketId = row.getIn( ['offer', 'bettingMarketId'])

      this.props.createBet(competitor, betType, bettingMarketId, row.get('marketTypeId'),
                           row.get('marketTypeValue'), odds);
    });



  }

  getBestOfferOfEachmarket(tableData, betType){
    return tableData.map( item => {

      return item.getIn([ 'offer', betType + 'Origin', '0' ])

    }).filter( item => {
      return item !== undefined
    });
  }

  render() {
    const { currencyFormat, bettingMarketGroup, bettingMarketGroupName,
            totalMatchedBetsAmount, eventTime, sportName, eventName,
            widgetTitle
    } = this.props;

    const minNameWidth = 200;
    const minOfferWidth = 50;
    const minArrowWidth = 7;
    // to match the back bet-type in placebet action dispatch
    const classNameBack = BetTypes.BACK;
    // to match the lay bet-type in placebet action dispatch
    const classNameLay = BetTypes.LAY;
    const columns = [{
      header: props => null,
      minWidth: minNameWidth,
      accessor: 'firstColumn' ,
      render: props => {
        const marketExposure = CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(
           parseFloat(props.value.market_exposure),
           currencyFormat,
           BettingModuleUtils.exposurePlaces);

        const potentialExposure = CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(
           parseFloat(BettingModuleUtils.getPotentialExposure(props.value.market_exposure, props.value.betslip_exposure )),
           currencyFormat,
           BettingModuleUtils.exposurePlaces);

        const marketExposureClass = props.value.market_exposure >= 0 ?
          'increased-value' : 'decreased-value';
        const potentialExposureClass = props.value.betslip_exposure + props.value.market_exposure >= 0 ?
          'increased-value' : 'decreased-value';

        return (
          <div className='competitor'>
            <div className='name'>{props.value.displayedName}</div>
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
    }, {
      className: 'back-arrows-col',
      header: props => null,
      minWidth: minArrowWidth,
      render: props =>
        <div className='back-offer'>
          <i className='icon-left-arrow' onClick={ () => this.shiftOfferDisplay(props.viewIndex, 'back', -1) }></i>
          <i className='icon-right-arrow' onClick={ () => this.shiftOfferDisplay(props.viewIndex, 'back', 1) }></i>
        </div>
    }, {
      // TODO: width adjustment will do later because I
      // cant manipulate width of the th tag
      header:  props =>
      // NOTE will be seperated comopent for header
        <div className='offer-header clearfix'>
          <p className='alignleft'>{ this.state.backBookPercent }%</p>
          <p className='alignright' id={ BetTypes.BACK } onClick={ this.placeAllBestBets } >{I18n.t('complex_betting_widget.back_all')}</p>
        </div>,
      columns: [{
        id: 'back3',
        header: props => null,
        minWidth: minOfferWidth,
        className: classNameBack, // we must use 'back' here for actions. ie. this.props.createBet(record, competitor, 'back', offer);
        accessor: row => row.offer.back.length > 2 ? row.offer.back[2] : undefined,
        render: props => props.value ?
         <div className='back-offer back-bg'>
           <div className='odds'>{ props.value.odds.toFixed(oddFloatPlaces) }</div>
           <div className='price'>
             { CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(props.value.price,
               currencyFormat,
               BettingModuleUtils.stakePlaces, true)}</div>
         </div> :
         <div className='back-offer empty-offer'><div className='odds-offer'><p>{I18n.t('complex_betting_widget.offer')}</p></div></div>
      }, {
        id: 'back2',
        header: props => null,
        minWidth: minOfferWidth,
        className: classNameBack,
        accessor: row => row.offer.back.length > 1 ? row.offer.back[1] : undefined,
        render: props => props.value ?
         <div className='back-offer back-bg'>
           <div className='odds'>{ props.value.odds.toFixed(oddFloatPlaces) }</div>
           <div className='price'>
             { CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(props.value.price, currencyFormat, BettingModuleUtils.stakePlaces, true)}</div>
         </div> :
         <div className='back-offer empty-offer'><div className='odds-offer'><p>{I18n.t('complex_betting_widget.offer')}</p></div></div>
      }, {
        id: 'back1',
        header: props => null,
        minWidth: minOfferWidth,
        className: classNameBack,
        accessor: row => row.offer.back.length > 0 ? row.offer.back[0] : undefined,
        render: props => props.value ?
         <div className='back-offer back-all-offer'>
           <div className='odds'>{ props.value.odds.toFixed(oddFloatPlaces) }</div>
           <div className='price'>
             { CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(props.value.price, currencyFormat, BettingModuleUtils.stakePlaces, true)}</div>
         </div> :
         <div className='back-offer empty-offer'><div className='odds-offer'><p>{I18n.t('complex_betting_widget.offer')}</p></div></div>
      }]
    }, {
      // NOTE will be seperated comopent for header
      header:  props =>
        <div className='offer-header'>
          <p className='alignleft' id={ BetTypes.LAY } onClick={ this.placeAllBestBets } >{I18n.t('complex_betting_widget.lay_all')}</p>
          <p className='alignright'>{ this.state.layBookPercent }%</p>
        </div>,
      columns: [{
        id: 'lay1',
        header: props => null,
        minWidth: minOfferWidth,
        className: classNameLay,
        accessor: row => row.offer.lay.length > 0 ? row.offer.lay[0] : undefined,
        render: props => props.value ?
         <div className='lay-offer lay-all-offer'>
           <div className='odds'>{ props.value.odds.toFixed(oddFloatPlaces) }</div>
           <div className='price'>
             { CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(props.value.price, currencyFormat, BettingModuleUtils.stakePlaces, true)}</div>
         </div> :
         <div className='lay-offer empty-offer'><div className='odds-offer'><p>{I18n.t('complex_betting_widget.offer')}</p></div></div>
      }, {
        id: 'lay2',
        header: props => null,
        minWidth: minOfferWidth,
        className: classNameLay,
        accessor: row => row.offer.lay.length > 1 ? row.offer.lay[1] : undefined,
        render: props => props.value ?
         <div className='lay-offer lay-bg'>
           <div className='odds'>{ props.value.odds.toFixed(oddFloatPlaces) }</div>
           <div className='price'>
             { CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(props.value.price, currencyFormat, BettingModuleUtils.stakePlaces, true)}</div>
         </div> :
         <div className='lay-offer empty-offer'>
           <div className='odds-offer'>
             <p>{I18n.t('complex_betting_widget.offer')}</p>
           </div>
         </div>
      }, {
        id: 'lay3',
        header: props => null,
        minWidth: minOfferWidth,
        className: classNameLay,
        accessor: row => row.offer.lay.length > 2 ? row.offer.lay[2] : undefined,
        render: props => props.value ?
         <div className='lay-offer lay-bg'>
           <div className='odds'>{ props.value.odds.toFixed(oddFloatPlaces) }</div>
           <div className='price'>
             { CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(props.value.price, currencyFormat, BettingModuleUtils.stakePlaces, true)}</div>
         </div> :
         <div className='lay-offer empty-offer'>
           <div className='odds-offer'>
             <p>{I18n.t('complex_betting_widget.offer')}</p>
           </div>
         </div>
      }]
    }, {
      className: 'lay-arrows-col',
      header: props => null,
      minWidth: minArrowWidth,
      render: props =>
        <div className='lay-offer'>
          <i className='icon-left-arrow' onClick={ () => this.shiftOfferDisplay(props.viewIndex, 'lay', -1) }></i>
          <i className='icon-right-arrow' onClick={ () => this.shiftOfferDisplay(props.viewIndex, 'lay', 1) }></i>
        </div>
    }]

    //TODO using string for market_type_id instead of 1.xxxx.x
    const ruleModalText =  ( bettingMarketGroup && sportName  &&
      'rules_dialogue.' + sportName.replace(/\s/g,'') + '.' + bettingMarketGroup.get('market_type_id') + '.content' ) || 'rules_dialogue.content'

    //retrieve system language when running in Electron app
    const currentLocale = window.navigator.language || window.navigator.userLanguage;

    return (

      <div className='complex-betting'>
        <div className='title'>
          <div className='name'> { widgetTitle } </div>
          <div className='rules'>
            <span>
              { I18n.t('complex_betting_widget.matched') }: { this.props.loadingStatus === LoadingStatus.DONE ? totalMatchedBetsAmount : '' }
            </span>
            {/* Rules Dialogue box */}
            <RulesModal parentClass='rules' title={ I18n.t('rules_dialogue.title') } buttonTitle={ I18n.t('rules_dialogue.buttonTitle') } >
              <Translate value={ ruleModalText }
                datetime={ moment(eventTime).locale(currentLocale).format('LLL') }
                eventName={ eventName }
                marketName={ bettingMarketGroupName }
                dangerousHTML/>
            </RulesModal>
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
            showPagination={ false }
            getTdProps={ (state, rowInfo, column, instance) => {
              return {
                onClick: (event) => {
                  if ( column.className === BetTypes.LAY || column.className === BetTypes.BACK){
                    this.onOfferClicked(rowInfo, column)
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
  eventName: PropTypes.string.isRequired,
  bettingMarketGroupName: PropTypes.string.isRequired,
  marketData: PropTypes.any.isRequired,
  totalMatchedBetsAmount: PropTypes.any.isRequired,
  createBet: PropTypes.func.isRequired,
  unconfirmedBets: PropTypes.any,
  currencyFormat: PropTypes.string.isRequired,
};

export default ComplexBettingWidget;
