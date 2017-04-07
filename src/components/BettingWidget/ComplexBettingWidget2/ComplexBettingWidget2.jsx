import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MarketDrawerActions } from '../../../actions';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Immutable from 'immutable';
var I18n = require('react-redux-i18n').I18n;

/**
 * NOTES: This version of ComplexBettingWidget2 is in DEVELOPMENT stage and primary goal is for BASIC visualization,
 * going to replace ComplexBettingWidget when integration to dummy api is done
 *
 * Planning to move every betting-widget-related componets to BettingWidget folder, serving similar purpose as BettingDrawers
 **/

const itemDisplay = 3;
const bitcoinSymbol = '\u0243';

//NOTE should we rename it as FullBettingWidget according to URD?
class ComplexBettingWidget2 extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tableData:  Immutable.fromJS([]),
    }

    this.onOfferClicked = this.onOfferClicked.bind(this);
    this.swiftOfferDisplay = this.swiftOfferDisplay.bind(this);
    this.setTableData = this.setTableData.bind(this);
  }

  componentDidMount(){
    this.setTableData(this.props.marketData)

  }

  componentWillReceiveProps(nextProps) {
    this.setTableData(nextProps.marketData)
  }

  // betting widget full :
  //                 ----------------------------------------  BACK ALL    |     LAY ALL ---------------------------------------
  // COMPTEITOR 1 | backTableData[2] | backTableData[1] | backTableData[0] | layTableData[0] | layTableData[1] | layTableData[2]
  // COMPTEITOR 2 | backTableData[2] | backTableData[1] | backTableData[0] | layTableData[0] | layTableData[1] | layTableData[2]
  setTableData(marketData){

    let orig = Immutable.fromJS(marketData);
    const startingIndex = 0

    if ( !orig.equals(Immutable.fromJS([]) ) ){

      orig.forEach((row, i) => {

        const backTableData = orig.getIn([i, 'offer', 'backOrigin'])
          .sort((a, b) => b.get('odds') - a.get('odds')) //descending order
          .slice(startingIndex, startingIndex + itemDisplay);

        const layTableData = orig.getIn([i, 'offer', 'layOrigin'])
          .sort((a, b) => a.get('odds') - b.get('odds')) //assending order
          .slice(startingIndex, startingIndex + itemDisplay)

        orig = orig.setIn([i, 'offer', 'back'], backTableData)
          .setIn([i, 'offer', 'lay'], layTableData)

      });

      this.setState({
        tableData: orig
      })
    } else {
      this.setState({
        tableData: Immutable.fromJS([])
      })
    }

  }

  //the arrow onclick funciton
  swiftOfferDisplay(index, type, change){

    let updated = this.state.tableData;
    let offerIndex = updated.getIn([index, 'offer', type + 'Index'])
    let layList = updated.getIn([index, 'offer', type + 'Origin'])

    if ( type === 'back'){

      //reverse the sorting and change for display
      layList = layList.sort(
        (a, b) => b.get('odds') - a.get('odds')
      );
      change *= -1

    }

    // marginal case checking.
    if ( layList.size < itemDisplay ||
      ( change === -1 && offerIndex === 0) ||
      ( change === 1 && offerIndex + itemDisplay  > layList.size)){
      return
    }

    offerIndex += change
    updated = updated.setIn([index, 'offer', type + 'Index'], offerIndex)
      .setIn([index, 'offer', type], layList.slice(offerIndex, offerIndex + itemDisplay));

    this.setState({
      tableData: updated
    })

  }

  onOfferClicked(rowInfo, column) {

    const record = Immutable.fromJS(rowInfo.row).set('name', this.props.eventName)
    const team = rowInfo.rowValues.name
    const marketType = column.className
    // for 'OFFER' case, offer will be empty
    const offer = Immutable.fromJS(rowInfo.rowValues[column.id])
    this.props.createBet(record, team, marketType, offer);
  }

  render() {

    const minNameWidth = 200;
    const minOfferWidth = 40;
    const minArrowWidth = 15;

    const columns = [{
      header: props => null,
      accessor: 'name', // String-based value accessors
      minWidth: minNameWidth,
    }, {
      className: 'back-left',
      header: props => null,
      style: { 'padding': '0px'},
      minWidth: minArrowWidth,
      render: props => <div className='back-offer'>{ '<' }</div>
    }, {
      className: 'back-right',
      header: props => null,
      style: { 'padding': '0px'},
      minWidth: minArrowWidth,
      render: props => <div className='back-offer'>{ '>' }</div>
    }, {
      header:  props =>
      // NOTE will be seperated comopent for header
        <div className='offer-header'>
          <p className='alignleft'>104%</p>
          <p className='alignright'>{I18n.t('complex_betting_widget.back_all')}</p>
        </div>,
      columns: [{
        id: 'back3',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: minOfferWidth,
        className: 'back', // we must use 'back' here for actions. ie. this.props.createBet(record, team, 'back', offer);
        accessor: row => row.offer.back.length > 2 ? row.offer.back[2] : undefined,
        render: props => props.value ?
         <div className='back-offer'>
           <div className='odds'>{props.value.odds}</div>
           <div className='price'>{ bitcoinSymbol }{props.value.price} </div>
         </div> :
         <div className='back-offer'><div className='odds-offer'><p>{I18n.t('complex_betting_widget.offer')}</p></div></div>
      }, {
        id: 'back2',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: minOfferWidth,
        className: 'back',
        accessor: row => row.offer.back.length > 1 ? row.offer.back[1] : undefined,
        render: props => props.value ?
         <div className='back-offer'>
           <div className='odds'>{props.value.odds}</div>
           <div className='price'>{ bitcoinSymbol }{props.value.price} </div>
         </div> :
         <div className='back-offer'><div className='odds-offer'><p>{I18n.t('complex_betting_widget.offer')}</p></div></div>
      }, {
        id: 'back1',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: minOfferWidth,
        className: 'back',
        accessor: row => row.offer.back.length > 0 ? row.offer.back[0] : undefined,
        render: props => props.value ?
         <div className='back-offer'>
           <div className='odds'>{props.value.odds}</div>
           <div className='price'>{ bitcoinSymbol }{props.value.price} </div>
         </div> :
         <div className='back-offer'><div className='odds-offer'><p>{I18n.t('complex_betting_widget.offer')}</p></div></div>
      }]
    }, {
      // NOTE will be seperated comopent for header
      header:  props =>
        <div className='offer-header'><p className='alignleft'>{I18n.t('complex_betting_widget.lay_all')}</p>
          <p className='alignright'>99.4%</p>
        </div>,
      columns: [{
        id: 'lay1',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: minOfferWidth,
        className: 'lay', // we must use 'lay' here for actions, ie. this.props.createBet(record, team, 'lay', offer);
        accessor: row => row.offer.lay.length > 0 ? row.offer.lay[0] : undefined,
        render: props => props.value ?
         <div className='lay-offer'>
           <div className='odds'>{props.value.odds}</div>
           <div className='price'>{ bitcoinSymbol }{props.value.price} </div>
         </div> :
         <div className='lay-offer'><div className='odds-offer'><p>{I18n.t('complex_betting_widget.offer')}</p></div></div>
      }, {
        id: 'lay2',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: minOfferWidth,
        className: 'lay',
        accessor: row => row.offer.lay.length > 1 ? row.offer.lay[1] : undefined,
        render: props => props.value ?
         <div className='lay-offer'>
           <div className='odds'>{props.value.odds}</div>
           <div className='price'>{ bitcoinSymbol }{props.value.price} </div>
         </div> :
         <div className='lay-offer'>
           <div className='odds-offer'>
             <p>{I18n.t('complex_betting_widget.offer')}</p>
           </div>
         </div>
      }, {
        id: 'lay3',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: minOfferWidth,
        className: 'lay',
        accessor: row => row.offer.lay.length > 2 ? row.offer.lay[2] : undefined,
        render: props => props.value ?
         <div className='lay-offer'>
           <div className='odds'>{props.value.odds}</div>
           <div className='price'>{ bitcoinSymbol }{props.value.price} </div>
         </div> :
         <div className='lay-offer'>
           <div className='odds-offer'>
             <p>{I18n.t('complex_betting_widget.offer')}</p>
           </div>
         </div>
      }]
    }, {
      className: 'lay-left',
      header: props => null,
      style: { 'padding': '0px'},
      minWidth: minArrowWidth,
      render: props => <div className='lay-offer'>{ '<' }</div>
    }, {
      className: 'lay-right',
      header: props => null,
      style: { 'padding': '0px'},
      minWidth: minArrowWidth,
      render: props => <div className='lay-offer'>{ '>' }</div>
    }]

    return (
      <div className='comlex-betting'>

        {
          this.state.tableData.equals(Immutable.fromJS([])) ?
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

                  if ( column.className === 'lay-right'){
                    this.swiftOfferDisplay(rowInfo.index, 'lay', 1)
                  } else if ( column.className === 'lay-left'){
                    this.swiftOfferDisplay(rowInfo.index, 'lay', -1)
                  } else if ( column.className === 'back-right'){
                    this.swiftOfferDisplay(rowInfo.index, 'back', 1)
                  } else if ( column.className === 'back-left'){
                    this.swiftOfferDisplay(rowInfo.index, 'back', -1)
                  } else if ( column.className === 'lay' || column.className === 'back'){
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

ComplexBettingWidget2.propTypes = {
  eventName: React.PropTypes.string.isRequired,
  marketData: React.PropTypes.any.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    createBet: MarketDrawerActions.createBet,
  }, dispatch);
}

export default connect(
  null,
  mapDispatchToProps
)(ComplexBettingWidget2);
