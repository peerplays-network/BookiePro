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

const floatPlaces = 2;
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
    this.shiftOfferDisplay = this.shiftOfferDisplay.bind(this);
    this.setTableData = this.setTableData.bind(this);
  }

  componentDidMount(){
    this.setTableData(this.props.marketData, this.props.unconfirmedBets)


  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.marketData.equals( nextProps.marketData) ||
      this.props.unconfirmedBets !== nextProps.unconfirmedBets){
      this.setTableData(nextProps.marketData, nextProps.unconfirmedBets)
    }
  }

  // betting widget full :
  //                 ----------------------------------------  BACK ALL    |     LAY ALL ---------------------------------------
  // COMPTEITOR 1 | backTableData[2] | backTableData[1] | backTableData[0] | layTableData[0] | layTableData[1] | layTableData[2]
  // COMPTEITOR 2 | backTableData[2] | backTableData[1] | backTableData[0] | layTableData[0] | layTableData[1] | layTableData[2]
  setTableData(marketData, unconfirmedBets){
    let tableData = marketData;


    if ( !tableData.equals(Immutable.fromJS([]) ) ){

      let backBookPercent = 0.0;
      let layBookPercent = 0.0;

      tableData.forEach((row, i) => {

        //get backTableData for i th row
        let backStartingIndex = 0
        if ( this.state.tableData && this.state.tableData.hasIn([i, 'offer', 'backIndex']) ){
          backStartingIndex = this.state.tableData.getIn([i, 'offer', 'backIndex'])
        }
        const backTableData = tableData.getIn([i, 'offer', 'backOrigin'])
          .sort((a, b) => b.get('odds') - a.get('odds')) //descending order
          .slice(backStartingIndex, backStartingIndex + itemDisplay);

        //get layTableData for i th row
        let layStartingIndex = 0
        if ( this.state.tableData && this.state.tableData.hasIn([i, 'offer', 'layIndex']) ){
          layStartingIndex = this.state.tableData.getIn([i, 'offer', 'layIndex'])
        }
        const layTableData = tableData.getIn([i, 'offer', 'layOrigin'])
          .sort((a, b) => a.get('odds') - b.get('odds')) //assending order
          .slice(layStartingIndex, layStartingIndex + itemDisplay)

        tableData = tableData.setIn([i, 'offer', 'back'], backTableData)
          .setIn([i, 'offer', 'lay'], layTableData)
          .setIn([i, 'offer', 'betting_market_id'], tableData.getIn([i, 'offer', 'betting_market_id']))
          .setIn([i, 'offer', 'backIndex'], backStartingIndex)
          .setIn([i, 'offer', 'layIndex'], layStartingIndex);

        //back percentage calculation
        //i.e. adding up based on the best price that is being offered i.e. backTableData[0] of each market
        if (backTableData.size > 0){
          backBookPercent = parseFloat(backBookPercent) + parseFloat( (100 / backTableData.getIn([0, 'odds'])) );
          backBookPercent = parseFloat(backBookPercent).toFixed(floatPlaces)
        }

        //lay percentage calculation
        //i.e. adding up based on the best price that is being offered i.e. layTableData[0] of each market
        if (layTableData.size > 0){
          layBookPercent = parseFloat(layBookPercent) + parseFloat( (100 / layTableData.getIn([0, 'odds'])) );
          layBookPercent = parseFloat(layBookPercent).toFixed(floatPlaces)
        }

        if ( unconfirmedBets.size > 0){
          // console.log('row 0 ' ,  JSON.stringify( row.toJS() , null , 2 ) )
          //
          // console.log('unconfirmedBets 0 ' , JSON.stringify( unconfirmedBets.get(0).toJS(), null , 2 ) )
        }

      });

      this.setState({
        tableData: tableData,
        backBookPercent: Math.round(backBookPercent) ,
        layBookPercent: Math.round(layBookPercent)
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
    updatedTableData = updatedTableData.setIn([index, 'offer', type + 'Index'], offerIndex)
      .setIn([index, 'offer', type], layList.slice(offerIndex, offerIndex + itemDisplay));

    this.setState({
      tableData: updatedTableData
    })

  }

  onOfferClicked(rowInfo, column) {
    const record = Immutable.fromJS(rowInfo.row).set('name', this.props.eventName);
    const competitor = rowInfo.rowValues.name;
    const betType = column.className;

    // for 'null OFFER' case in which we only see 'OFFER' in item, offer will be empty
    const offer = Immutable.fromJS(rowInfo.rowValues[column.id]);
    const betting_market_id = rowInfo.row.offer.betting_market_id;
    this.props.createBet(record, competitor, betType, betting_market_id, offer);
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
      // TODO: width adjustment will do later because I
      // cant manipulate width of the th tag
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
           <div className='odds'>{ parseFloat(props.value.odds).toFixed(floatPlaces) }</div>
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
           <div className='odds'>{ parseFloat(props.value.odds).toFixed(floatPlaces) }</div>
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
           <div className='odds'>{ parseFloat(props.value.odds).toFixed(floatPlaces) }</div>
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
           <div className='odds'>{ parseFloat(props.value.odds).toFixed(floatPlaces) }</div>
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
           <div className='odds'>{ parseFloat(props.value.odds).toFixed(floatPlaces) }</div>
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
           <div className='odds'>{ parseFloat(props.value.odds).toFixed(floatPlaces) }</div>
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
                    this.shiftOfferDisplay(rowInfo.index, 'lay', 1)
                  } else if ( column.className === 'lay-left'){
                    this.shiftOfferDisplay(rowInfo.index, 'lay', -1)
                  } else if ( column.className === 'back-right'){
                    this.shiftOfferDisplay(rowInfo.index, 'back', 1)
                  } else if ( column.className === 'back-left'){
                    this.shiftOfferDisplay(rowInfo.index, 'back', -1)
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

const mapStateToProps = (state) => {
  const marketDrawer = state.get('marketDrawer');
  return {
    unconfirmedBets: marketDrawer.get('unconfirmedBets'),
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    createBet: MarketDrawerActions.createBet,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComplexBettingWidget2);
