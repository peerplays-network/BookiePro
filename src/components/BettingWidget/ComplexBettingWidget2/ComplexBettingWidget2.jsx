import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { MarketDrawerActions } from '../../../actions';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import Immutable from 'immutable';

/**
 * NOTES: This version of ComplexBettingWidget is just a clone of the
 *        SimpleBettingWidget. This is only used as a stub to test the
 *        basic Market Drawer. Please feel free to modify/replace this.
 **/

const bitcoinSymbol = '\u0243';
// We cannot use CSS to override antd Table column width using CSS
// This can only be done via the code
const eventTimeColumnWidth = 90;
const offerColumnWidth = 70;

// TODO: Consider moving this to a utility library later
// TODO: The implementation below is for demo purpose. Will review this in future iterations.
const renderEventTime = (text, record) => {
  const eventTime = moment(parseInt(record.get('time'), 10))
  let timeString = eventTime.calendar();
  // TODO: Need a better way as this is NOT going to work once we have localization
  if (timeString.toLowerCase().includes('tomorrow')) {
    return `Tomorrow, ${eventTime.format('HH:mm')}`;
  }

  return eventTime.format('DD/MM/YYYY HH:mm');
}

const data = [{
  name: 'Tanner Linsley',
  age: 269,
  friend: {
    name: 'Jason Maurer',
    age: 233,
  },
  'index': 0,
  "offers": [
    {
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
          "odds": 2.89,
          "price": 0.25
        },
        {
          "odds": 2.1,
          "price": 0.056
        }
      ]
    }
  ],
  "key": "1.103.2"
},{
  name: 'Tanner Linsley',
  age: 269,
  friend: {
    name: 'Jason Maurer',
    age: 233,
  },
  'index': 1,
  "offers": [
    {
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
    }
  ],
  "key": "1.103.2"
}]

class ComplexBettingWidget2 extends Component {

  constructor(props) {
    super(props);

    const index = 0
    const orig = Immutable.fromJS(data);

    let firstTeamBack = orig.getIn([0, 'offers', 0, 'backOrigin']).sort(
      (a, b) => b.get('odds') - a.get('odds')
    );
    let updated = orig.setIn([0, 'offers', 0, 'back'], firstTeamBack);

    let firstTeamLay = orig.getIn([0, 'offers', 0, 'layOrigin']).slice(index, index + 3)
    updated = updated.setIn([0, 'offers', 0, 'lay'], firstTeamLay);

    let secondTeamBack = orig.getIn([1, 'offers', 0, 'backOrigin']).sort(
      (a, b) => b.get('odds') - a.get('odds')
    );

    updated = updated.setIn([1, 'offers', 0, 'back'], secondTeamBack);

    let secondTeamLay = orig.getIn([1, 'offers', 0, 'layOrigin']).slice(index, index + 3)
    updated = updated.setIn([1, 'offers', 0, 'lay'], secondTeamLay);

    console.log( updated.toJS())
    this.state = {
      tree: this.props.completeTree.toJS(),
      displayData: updated.toJS()

    }
    this.onOfferClicked = this.onOfferClicked.bind(this);
    this.displaySwift = this.displaySwift.bind(this);
  }

  componentDidMount(){
    this.updateSider(this.props.completeTree.toJS(), this.props.objectId);




  }
  componentWillReceiveProps(nextProps) {
    this.updateSider(nextProps.completeTree.toJS(), nextProps.objectId);
  }

  updateSider(completeTree, targetObjectId) {

  }

  displaySwift(index, type, change){

    let updated = Immutable.fromJS(this.state.displayData);
    let offerIndex = updated.getIn([index, 'offers', 0, type + 'Index'])
    let layList = updated.getIn([index, 'offers', 0, type + 'Origin'])

    if ( type === 'lay'){

      console.log( offerIndex)

      if ( layList.size < 3){
        return
      }

      if ( change === -1 && offerIndex === 0){
        return
      }

      if ( change === 1 && offerIndex + 3  > layList.size){
        return
      }

      offerIndex += change
      updated = updated.setIn([index, 'offers', 0, type + 'Index'], offerIndex);
      updated = updated.setIn([index, 'offers', 0, type], layList.slice(offerIndex, offerIndex + 3));


    } else if ( type === 'back'){


      layList = layList.sort(
        (a, b) => b.get('odds') - a.get('odds')
      );

      change *= -1

      if ( layList.size < 3){
        return
      }

      if ( change === -1 && offerIndex === 0){
        return
      }

      if ( change === 1 && offerIndex + 3  > layList.size){
        return
      }

      offerIndex += change
      console.log( offerIndex)

      updated = updated.setIn([index, 'offers', 0, type + 'Index'], offerIndex);


      console.log( layList.slice(offerIndex, offerIndex + 3).toJS())


      updated = updated.setIn([index, 'offers', 0, type], layList.slice(offerIndex, offerIndex + 3));

    }

    this.setState({
      displayData: updated.toJS()
    })

  }

  onOfferClicked(event, record, team, marketType, offer) {
    event.preventDefault();
    this.props.createBet(record, team, marketType, offer);
  }

  render() {

    ///////////

    const offerWidth = 40;
    const arrowWidth = 15;


    const columns = [{
      header: props => null,
      accessor: 'name', // String-based value accessors!
      minWidth: 150,

    // }, {
    //   header: 'Age',
    //   accessor: 'age', //26 or 269
    //   render: props => <span className='number'>{props.value}</span> // Custom cell components!
    // }, {
    //   id: 'friendName', // Required because our accessor is not a string
    //   header: 'Friend Name',
    //   accessor: row => row.friend.name, // Custom value accessors! //'Jason Maurer'
    // }, {
    //   header: props => <span>Friend Age</span>, // Custom header components!
    //   accessor: 'friend.age' //233
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
        <div className='offer-header'><p className='alignleft'>104%</p>
          <p className='alignright'>Back All</p>
        </div>,
      columns: [{
        id: 'back3',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: offerWidth,
        accessor: row => row.offers[0].back,
        render: props => props.value.length > 2 ?
         <div className='back-offer'><div className='odds'>{props.value[2].odds}</div><div className='price'>{ bitcoinSymbol }{props.value[2].price} </div></div> :
         <div className='back-offer'><div className='odds-offer'><p>OFFER</p></div></div>
      }, {
        id: 'back2',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: offerWidth,
        className : props => props.value.length > 1 ? 'ddd' : 'ddd',
        accessor: row => row.offers[0].back,
        render: props => props.value.length > 1 ?
         <div className='back-offer'><div className='odds'>{props.value[1].odds}</div><div className='price'>{ bitcoinSymbol }{props.value[1].price} </div></div> :
         <div className='back-offer'><div className='odds-offer'><p>OFFER</p></div></div>
      }, {
        id: 'back1',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: offerWidth,
        accessor: row => row.offers[0].back,
        render: props => props.value.length > 0 ?
         <div className='back-offer'><div className='odds'>{props.value[0].odds}</div><div className='price'>{ bitcoinSymbol }{props.value[0].price} </div></div> :
         <div className='back-offer'><div className='odds-offer'><p>OFFER</p></div></div>
      }]
    }, {
      header:  props =>
        <div className='offer-header'><p className='alignleft'>Lay All</p>
          <p className='alignright'>99.4%</p>
        </div>,
      columns: [{
        id: 'lay1',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: offerWidth,
        accessor: row => row.offers[0].lay,
        render: props => props.value.length > 0 ?
         <div className='lay-offer'><div className='odds'>{props.value[0].odds}</div><div className='price'>{ bitcoinSymbol }{props.value[0].price} </div></div> :
         <div className='lay-offer'><div className='odds-offer'><p>OFFER</p></div></div>
      }, {
        id: 'lay2',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: offerWidth,
        accessor: row => row.offers[0].lay,
        render: props => props.value.length > 1 ?
         <div className='lay-offer'><div className='odds'>{props.value[1].odds}</div><div className='price'>{ bitcoinSymbol }{props.value[1].price} </div></div> :
         <div className='lay-offer'><div className='odds-offer'><p>OFFER</p></div></div>
      }, {
        id: 'lay3',
        header: props => null,
        style: { 'padding': '0px'},
        minWidth: offerWidth,
        accessor: row => row.offers[0].lay,
        render: props => props.value.length > 2 ?
         <div className='lay-offer'><div className='odds'>{props.value[2].odds}</div><div className='price'>{ bitcoinSymbol }{props.value[2].price} </div></div> :
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
          data={ this.state.displayData }
          columns={ columns }
          showPagination={ false }
          getTdProps={ (state, rowInfo, column, instance) => {
            return {
              onClick: e => {
              //  console.log('A Td Element was clicked!')
              //  console.log('it produced this event:', e)
                // console.log('It was in this column:', JSON.stringify(column, null, 4))
                // console.log('It was in this row:', JSON.stringify(rowInfo, null, 4))
              //  console.log('It was in this table instance:',instance)

                if ( column.className === 'lay-right'){
                  this.displaySwift(rowInfo.index, 'lay', 1)
                } else if ( column.className === 'lay-left'){
                  this.displaySwift(rowInfo.index, 'lay', -1)
                } else if ( column.className === 'back-right'){
                  this.displaySwift(rowInfo.index, 'back', 1)
                } else if ( column.className === 'back-left'){
                  this.displaySwift(rowInfo.index, 'back', -1)
                }

              }
            }
          }
         }
        />
      </div>
    );
    // return (
    //   // Note that we have to explicitly tell antd Table how to find the rowKey
    //   // because it is not compatible with Immutable JS
    //   <div className='complex-betting'>
    //     <Table
    //       bordered
    //       pagination={ false }
    //       columns={ getColumns(this.renderOffer) }
    //       dataSource={ events }
    //       title={ () => renderTitle(this.props.title) }
    //       footer={ () => renderFooter(this.props.title) }
    //       locale={ {emptyText: 'No Data'} }
    //       rowKey={ (record) => record.get('key') }
    //     />
    //   </div>
    // );
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

export default connect(mapStateToProps, mapDispatchToProps)(ComplexBettingWidget2);
