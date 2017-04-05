import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Icon, Table } from 'antd';
import { MarketDrawerActions } from '../../actions';

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

class ComplexBettingWidget2 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tree: this.props.completeTree.toJS()
    }
    this.onOfferClicked = this.onOfferClicked.bind(this);
    this.renderOffer = this.renderOffer.bind(this);
  }

  componentDidMount(){
    this.updateSider(this.props.completeTree.toJS(), this.props.objectId);

  }
  componentWillReceiveProps(nextProps) {
    this.updateSider(nextProps.completeTree.toJS(), nextProps.objectId);
  }


  onOfferClicked(event, record, team, marketType, offer) {
    event.preventDefault();
    this.props.createBet(record, team, marketType, offer);
  }

  // marketType: [ back | lay ]
  // index: [ 1 (Home Team) | 2 (Away Team)]
  renderOffer(marketType, index) {
    return (text, record) => {

      console.log('text : ', text);
      console.log('record : ', record.toJS());
      const offers = record.get('offers');
      // TODO: Need a better way to check this after the Immutable JS changes
      if (offers === undefined || offers.isEmpty()) {
        return '';
      }
      // TODO: Check if we always have only one offer here. If yes, get rid of the list
      const offer = offers.get(0).get(marketType).get(index-1);
      // TODO: REVIEW This is temp solution. The better way is to use the Competitor data.
      const team = record.get('name').split('vs')[index-1].trim()
      return (
        <a href='#' onClick={ (event) => this.onOfferClicked(event, record, team, marketType, offer) }>
          <div className='offer'>
            <div className='odds'>{ offer.get('odds') }</div>
            <div className='price'>{ bitcoinSymbol } { offer.get('price') }</div>
          </div>
        </a>
      );
    };
  };

  render() {
    let events = [];
    if (this.props.events !== undefined) {
      // Introduce the key attribute to suppress the React warning
      events = this.props.events.map((event) => event.set('key', event.get('id')));
      // Sort by event time
      events = events.sort((a, b) => {
        let timeA = a.get('time');
        let timeB = b.get('time');
        if (timeA < timeB) { return -1; }
        if (timeA > timeB) { return 1; }
        return 0;
      })
      events = events.toArray();  // antd table only accepts vanilla JS arrays
    }

    ///////////

    console.log( ' state tree : ', this.state.tree)

    const data = [{
      teamName: '',
      name: 'Tanner Linsley',
      age: 26,
      friend: {
        name: 'Jason Maurer',
        age: 233,
      }
    },{
      name: 'Tanner Linsley',
      age: 269,
      friend: {
        name: 'Jason Maurer',
        age: 233,
      }
    }]

    const columns = [{
      header: 'Name',
      accessor: 'name' // String-based value accessors!
    }, {
      header: 'Age',
      accessor: 'age',
      render: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
      id: 'friendName', // Required because our accessor is not a string
      header: 'Friend Name',
      accessor: d => d.friend.name, // Custom value accessors!
      render: props => <div className='offer'><div className='odds'>2.89</div><div className='price'>0.082</div></div>
    }, {
      header: props => <span>Friend Age</span>, // Custom header components!
      accessor: 'friend.age'
    }, {
      LayAll: 'Name',
      columns: [{
        header: 'First Name',
        accessor: 'firstName'
      }, {
        header: 'Last Name',
        id: 'lastName',
        accessor: d => d.lastName
      }]
    }]

    return (
      <ReactTable
        data={ data }
        columns={ columns }
      />

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
