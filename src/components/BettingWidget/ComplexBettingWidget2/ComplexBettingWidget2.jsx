import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MarketDrawerActions } from '../../../actions';
import ReactTable from 'react-table'
import { Icon } from 'antd'
import 'react-table/react-table.css'
import Immutable from 'immutable';
import { I18n } from 'react-redux-i18n';

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
      backAllPercent: 0,
      layAllPercent: 0,
    }

    this.onOfferClicked = this.onOfferClicked.bind(this);
    this.swiftOfferDisplay = this.swiftOfferDisplay.bind(this);
    this.setTableData = this.setTableData.bind(this);
  }

  componentDidMount(){
    this.setTableData(this.props.marketData)

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.marketData !== nextProps.marketData){
      this.setTableData(nextProps.marketData)
    }

  }

  // betting widget full :
  //                 ----------------------------------------  BACK ALL    |     LAY ALL ---------------------------------------
  // COMPTEITOR 1 | backTableData[2] | backTableData[1] | backTableData[0] | layTableData[0] | layTableData[1] | layTableData[2]
  // COMPTEITOR 2 | backTableData[2] | backTableData[1] | backTableData[0] | layTableData[0] | layTableData[1] | layTableData[2]
  setTableData(marketData){

    let orig = Immutable.fromJS(marketData);
    const startingIndex = 0

    if ( !orig.equals(Immutable.fromJS([]) ) ){

      let backBookPercent = 0.0;
      let layBookPercent = 0.0;

      orig.forEach((row, i) => {

        const backTableData = orig.getIn([i, 'offer', 'backOrigin'])
          .sort((a, b) => b.get('odds') - a.get('odds')) //descending order
          .slice(startingIndex, startingIndex + itemDisplay);

        const layTableData = orig.getIn([i, 'offer', 'layOrigin'])
          .sort((a, b) => a.get('odds') - b.get('odds')) //assending order
          .slice(startingIndex, startingIndex + itemDisplay)

        orig = orig.setIn([i, 'offer', 'back'], backTableData)
          .setIn([i, 'offer', 'lay'], layTableData)

        //adding up based on the best price that is being offered i.e. backTableData[0]
        if (backTableData.size > 0){
          backBookPercent = parseFloat(backBookPercent, 10) + parseFloat( (100 / backTableData.getIn([0, 'odds'])).toFixed(2));
        }

        //adding up based on the best price that is being offered i.e. layTableData[0]
        if (layTableData.size > 0){
          layBookPercent = parseFloat(layBookPercent, 10) + parseFloat( (100 / layTableData.getIn([0, 'odds'])).toFixed(2));
        }
      });

      this.setState({
        tableData: orig,
        backBookPercent: Math.round(backBookPercent) ,
        layBookPercent: Math.round(layBookPercent)
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
    const competitor = rowInfo.rowValues.name
    const betType = column.className
    // for 'null OFFER' case in which we only see 'OFFER' in item, offer will be empty
    const offer = Immutable.fromJS(rowInfo.rowValues[column.id])
    this.props.createBet(record, competitor, betType, offer);
  }

  render() {

    const minNameWidth = 200;
    const minOfferWidth = 50;
    const minArrowWidth = 7;
     // we must use 'back' here for actions. ie. this.props.createBet(record, competitor, 'back', offer);
    const classNameBack = 'back';
    // we must use 'lay' here for actions, ie. this.props.createBet(record, competitor, 'lay', offer);
    const classNameLay = 'lay';

    const columns = [{
      header: props => null,
      accessor: 'name', // String-based value accessors
      minWidth: minNameWidth,
    }, {
      className: 'back-left',
      header: props => null,
      minWidth: minArrowWidth,
      render: props => <div className='back-offer'>{ '<' }</div>
    }, {
      className: 'back-right',
      header: props => null,
      minWidth: minArrowWidth,
      render: props => <div className='back-offer'>{ '>' }</div>
    }, {
      minWidth: 100,
      header:  props =>
      // NOTE will be seperated comopent for header
        <div className='offer-header clearfix'>
          <p className='alignleft'>{ this.state.backBookPercent }%</p>
          <p className='alignright'>{I18n.t('complex_betting_widget.back_all')}</p>
        </div>,
      columns: [{
        id: 'back3',
        header: props => null,
        minWidth: minOfferWidth,
        className: classNameBack, // we must use 'back' here for actions. ie. this.props.createBet(record, competitor, 'back', offer);
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
        minWidth: minOfferWidth,
        className: classNameBack,
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
        minWidth: minOfferWidth,
        className: classNameBack,
        accessor: row => row.offer.back.length > 0 ? row.offer.back[0] : undefined,
        render: props => props.value ?
         <div className='back-offer back-all-offer'>
           <div className='odds'>{props.value.odds}</div>
           <div className='price'>{ bitcoinSymbol }{props.value.price} </div>
         </div> :
         <div className='back-offer'><div className='odds-offer'><p>{I18n.t('complex_betting_widget.offer')}</p></div></div>
      }]
    }, {
      // NOTE will be seperated comopent for header
      header:  props =>
        <div className='offer-header'><p className='alignleft'>{I18n.t('complex_betting_widget.lay_all')}</p>
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
           <div className='odds'>{props.value.odds}</div>
           <div className='price'>{ bitcoinSymbol }{props.value.price} </div>
         </div> :
         <div className='lay-offer'><div className='odds-offer'><p>{I18n.t('complex_betting_widget.offer')}</p></div></div>
      }, {
        id: 'lay2',
        header: props => null,
        minWidth: minOfferWidth,
        className: classNameLay,
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
        minWidth: minOfferWidth,
        className: classNameLay,
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
      minWidth: minArrowWidth,
      render: props => <div className='lay-offer'>{ '<' }</div>
    }, {
      className: 'lay-right',
      header: props => null,
      minWidth: minArrowWidth,
      render: props => <div className='lay-offer'>{ '>' }</div>
    }]

    return (
      <div className='complex-betting'>
        <div className='title'>
          <div className='name'> {I18n.t('complex_betting_widget.moneyline')} </div>
          <div className='rules'>
            <span>{I18n.t('complex_betting_widget.matched')}: <i className='icon-bitcoin'></i> 4.65</span>
            {/* TODO: Rules dialogue will do after
             homepage_changes branch will merge to
              develop */}
            <Icon type='info-circle-o' /> Rules
          </div>
        </div>
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
