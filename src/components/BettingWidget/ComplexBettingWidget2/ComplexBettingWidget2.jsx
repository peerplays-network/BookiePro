import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MarketDrawerActions } from '../../../actions';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Immutable from 'immutable';

/**
 * NOTES: This version of ComplexBettingWidget2 is in DEVELOPMENT stage and primary goal is for BASIC visualization,
 * going to replace ComplexBettingWidget when integration to dummy api is done
 *
 * Planning to move every betting-widget-related componets to BettingWidget folder, serving similar purpose as BettingDrawers
 **/

const itemDisplay = 3;
const bitcoinSymbol = '\u0243';

//NOTE hardcoded data before integration, structure does not match with binnedOrderBooks yet.
const marketData = [{
  id: '1.105.85',
  name: 'Levski Sofia',
  "offer": {
    "backIndex": 0,
    "backOrigin": [
      {
        "odds": 3.25,
        "price": 0.173
      },
      {
        "odds": 3.1,
        "price": 0.082
      }
    ],
    "layIndex": 0,
    "layOrigin": [
      {
        "odds": 2.1,
        "price": 0.25
      },
      {
        "odds": 2.89,
        "price": 0.056
      }
    ]
  },
  "key": "1.103.2"
},{
  id: '1.105.86',
  name: 'Academic Plovdiv',
  "offer": {
    "backIndex": 0,

    "backOrigin": [
      {
        "odds": 1.40,
        "price": 0.015
      },
      {
        "odds": 1.41,
        "price": 0.04
      },
      {
        "odds": 1.42,
        "price": 1.952
      },
      {
        "odds": 1.43,
        "price": 1.952
      },
      {
        "odds": 1.44,
        "price": 1.952
      }
    ],
    "layIndex": 0,

    "layOrigin": [
      {
        "odds": 1.48,
        "price": 1.467
      },
      {
        "odds": 1.49,
        "price": 0.012
      },
      {
        "odds": 1.50,
        "price": 0.032
      },
      {
        "odds": 1.51,
        "price": 0.132
      },
      {
        "odds": 1.52,
        "price": 0.332
      }
    ]
  },
  "key": "1.103.2"
}]

class ComplexBettingWidget2 extends Component {

  constructor(props) {
    super(props);

    const index = 0
    const orig = Immutable.fromJS(marketData);

    //NOTE will be moved to a sepearted fucntion for resuabllity
    let firstTeamBack = orig.getIn([0, 'offer', 'backOrigin'])
      .sort((a, b) => b.get('odds') - a.get('odds'))
      .slice(index, index + itemDisplay);
    let firstTeamLay = orig.getIn([0, 'offer', 'layOrigin'])
      .slice(index, index + itemDisplay)
    let secondTeamBack = orig.getIn([1, 'offer', 'backOrigin'])
      .sort((a, b) => b.get('odds') - a.get('odds'))
      .slice(index, index + itemDisplay);
    let secondTeamLay = orig.getIn([1, 'offer', 'layOrigin'])
      .slice(index, index + itemDisplay)

    let updated = orig.setIn([0, 'offer', 'back'], firstTeamBack)
      .setIn([0, 'offer', 'lay'], firstTeamLay)
      .setIn([1, 'offer', 'back'], secondTeamBack)
      .setIn([1, 'offer', 'lay'], secondTeamLay);

    this.state = {
      tree: this.props.completeTree.toJS(),
      displayData: updated

    }
    this.onOfferClicked = this.onOfferClicked.bind(this);
    this.displaySwift = this.displaySwift.bind(this);
    this.updateTeamName = this.updateTeamName.bind(this);
  }

  componentDidMount(){
    this.updateTeamName(this.props.completeTree.toJS(), this.props.objectId);
  }

  componentWillReceiveProps(nextProps) {
    this.updateTeamName(nextProps.completeTree.toJS(), nextProps.objectId);
  }

  updateTeamName(completeTree, targetObjectId) {
    //NOTE note yet implemented
  }

  displaySwift(index, type, change){

    let updated = this.state.displayData;
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
      displayData: updated
    })

  }

  onOfferClicked(rowInfo, column) {

    // console.log('It was in this column:', JSON.stringify(column, null, 4))
    // console.log('It was in this row:', JSON.stringify(rowInfo.row, null, 4))

    const record = Immutable.fromJS(rowInfo.row)
    const team = rowInfo.rowValues.name
    const marketType = column.className
    // for 'OFFER' case, offer will be empty
    const offer = Immutable.fromJS(rowInfo.rowValues[column.id])
    this.props.createBet(record, team, marketType, offer);
  }

  render() {

    const nameWidth = 200;
    const offerWidth = 40;
    const arrowWidth = 15;

    const columns = [{
      header: props => null,
      accessor: 'name', // String-based value accessors
      minWidth: nameWidth,
    }, {
      className: 'back-left',
      header: props => null,
      style: { 'padding': '0px'},
      minWidth: arrowWidth,
      render: props => <div className='back-offer'>{ '<' }</div>
    }, {
      className: 'back-right',
      header: props => null,
      style: { 'padding': '0px'},
      minWidth: arrowWidth,
      render: props => <div className='back-offer'>{ '>' }</div>
    }, {
      header:  props =>
      // NOTE will be seperated comopent for header
        <div className='offer-header'>
          <p className='alignleft'>104%</p>
          <p className='alignright'>Back All</p>
        </div>,
      columns: [{
        id: 'back3',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: offerWidth,
        className: 'back', // we must use 'back' here for actions. ie. this.props.createBet(record, team, 'back', offer);
        accessor: row => row.offer.back.length > 2 ? row.offer.back[2] : undefined,
        render: props => props.value ?
         <div className='back-offer'><div className='odds'>{props.value.odds}</div><div className='price'>{ bitcoinSymbol }{props.value.price} </div></div> :
         <div className='back-offer'><div className='odds-offer'><p>OFFER</p></div></div>
      }, {
        id: 'back2',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: offerWidth,
        className: 'back',
        accessor: row => row.offer.back.length > 1 ? row.offer.back[1] : undefined,
        render: props => props.value ?
         <div className='back-offer'><div className='odds'>{props.value.odds}</div><div className='price'>{ bitcoinSymbol }{props.value.price} </div></div> :
         <div className='back-offer'><div className='odds-offer'><p>OFFER</p></div></div>
      }, {
        id: 'back1',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: offerWidth,
        className: 'back',
        accessor: row => row.offer.back.length > 0 ? row.offer.back[0] : undefined,
        render: props => props.value ?
         <div className='back-offer'><div className='odds'>{props.value.odds}</div><div className='price'>{ bitcoinSymbol }{props.value.price} </div></div> :
         <div className='back-offer'><div className='odds-offer'><p>OFFER</p></div></div>
      }]
    }, {
      // NOTE will be seperated comopent for header
      header:  props =>
        <div className='offer-header'><p className='alignleft'>Lay All</p>
          <p className='alignright'>99.4%</p>
        </div>,
      columns: [{
        id: 'lay1',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: offerWidth,
        className: 'lay', // we must use 'lay' here for actions, ie. this.props.createBet(record, team, 'lay', offer);
        accessor: row => row.offer.lay.length > 0 ? row.offer.lay[0] : undefined,
        render: props => props.value ?
         <div className='lay-offer'><div className='odds'>{props.value.odds}</div><div className='price'>{ bitcoinSymbol }{props.value.price} </div></div> :
         <div className='lay-offer'><div className='odds-offer'><p>OFFER</p></div></div>
      }, {
        id: 'lay2',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: offerWidth,
        className: 'lay',
        accessor: row => row.offer.lay.length > 1 ? row.offer.lay[1] : undefined,
        render: props => props.value ?
         <div className='lay-offer'><div className='odds'>{props.value.odds}</div><div className='price'>{ bitcoinSymbol }{props.value.price} </div></div> :
         <div className='lay-offer'><div className='odds-offer'><p>OFFER</p></div></div>
      }, {
        id: 'lay3',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: offerWidth,
        className: 'lay',
        accessor: row => row.offer.lay.length > 2 ? row.offer.lay[2] : undefined,
        render: props => props.value ?
         <div className='lay-offer'><div className='odds'>{props.value.odds}</div><div className='price'>{ bitcoinSymbol }{props.value.price} </div></div> :
         <div className='lay-offer'><div className='odds-offer'><p>OFFER</p></div></div>
      }]
    }, {
      className: 'lay-left',
      header: props => null,
      style: { 'padding': '0px'},
      minWidth: arrowWidth,
      render: props => <div className='lay-offer'>{ '<' }</div>
    }, {
      className: 'lay-right',
      header: props => null,
      style: { 'padding': '0px'},
      minWidth: arrowWidth,
      render: props => <div className='lay-offer'>{ '>' }</div>
    }]

    return (
      <div className='comlex-betting'>
        <ReactTable
          defaultPageSize={ 2 }
          data={ this.state.displayData.toJS() }
          columns={ columns }
          showPagination={ false }
          getTdProps={ (state, rowInfo, column, instance) => {
            return {
              onClick: e => {

                if ( column.className === 'lay-right'){
                  this.displaySwift(rowInfo.index, 'lay', 1)
                } else if ( column.className === 'lay-left'){
                  this.displaySwift(rowInfo.index, 'lay', -1)
                } else if ( column.className === 'back-right'){
                  this.displaySwift(rowInfo.index, 'back', 1)
                } else if ( column.className === 'back-left'){
                  this.displaySwift(rowInfo.index, 'back', -1)
                } else if ( column.className === 'lay' || column.className === 'back'){
                  this.onOfferClicked(rowInfo, column)
                }

              }
            }
          }
         }
        />
      </div>
    );

  }
}

const mapStateToProps = (state) => {
  const sidebar = state.get('sidebar');
  return {
    completeTree: sidebar.get('complete_tree'),
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
