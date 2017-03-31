import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Icon, Table } from 'antd';
import { QuickBetDrawerActions } from '../../actions';

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

const getColumns = (renderOffer) => ([
  {
    dataIndex: 'time',
    key: 'time',
    width: eventTimeColumnWidth,
    className: 'event-time',
    render: renderEventTime
  }, {
    dataIndex: 'name',
    key: 'name',
    // Do not specify width so the column
    // will grow/shrink with the size of the table
    className: 'team',
    render: (text, record) => record.get('name')
  }, {
    title: '1',
    children: [{
      dataIndex: 'back_offer_1',
      key: 'back_offer_1',
      width: offerColumnWidth,
      className: 'back-offer',
      render: renderOffer('back', 1)
    }, {
      dataIndex: 'lay_offer_1',
      key: 'lay_offer_1',
      width: offerColumnWidth,
      className: 'lay-offer',
      render: renderOffer('lay', 1)
    }]
  }, {
    title: '2',
    children: [{
      dataIndex: 'back_offer_2',
      key: 'back_offer_2',
      width: offerColumnWidth,
      className: 'back-offer',
      render: renderOffer('back', 2)
    }, {
      dataIndex: 'lay_Offer_2',
      key: 'lay_offer_2',
      width: offerColumnWidth,
      className: 'lay-offer',
      render: renderOffer('lay', 2)
    }]
  }
]);

const renderTitle = (title) => (
  <div className='title'>
    <div className='sport'>{ title }</div>
    <div className='rules'>
      <Icon type='info-circle-o' /> Rules
    </div>
  </div>
);

const renderFooter = (title) => (
  <div className='footer'>
    <a href='/' onClick={ e => e.preventDefault() }>
      More { title }
    </a>
  </div>
)

class SimpleBettingWidget extends Component {
  constructor(props) {
    super(props);
    this.onOfferClicked = this.onOfferClicked.bind(this);
    this.renderOffer = this.renderOffer.bind(this);
  }

  onOfferClicked(event, record, team, marketType, offer) {
    event.preventDefault();
    this.props.createBet(record, team, marketType, offer);
  }

  // marketType: [ back | lay ]
  // index: [ 1 (Home Team) | 2 (Away Team)]
  renderOffer(marketType, index) {
    return (text, record) => {
      const offers = record.get('offers');
      // TODO: Need a better way to check this after the Immutable JS changes
      if (offers === undefined || offers.isEmpty()) {
        return '';
      }
      // TODO: Check if we always have only one offer here. If yes, get rid of the list
      // TODO: Need to come back here once we converted the Binned Order Books dummy data to ImmutableJS Map too
      const offer = offers.get(0).get(marketType).get(index-1);
      // TODO: REVIEW This is temp solution. The better way is to use the Competitor data.
      const team = record.get('name').split('vs')[index-1].trim()
      return (
        <a href='#' onClick={ (event) => this.onOfferClicked(event, record, team, marketType, offer) }>
          <div className='offer'>
            <div className='odds'>{ offer.odds }</div>
            <div className='price'>{ bitcoinSymbol } { offer.price }</div>
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

    return (
      // Note that we have to explicitly tell antd Table how to find the rowKey
      // because it is not compatible with Immutable JS
      <div className='simple-betting'>
        <Table
          bordered
          pagination={ false }
          columns={ getColumns(this.renderOffer) }
          dataSource={ events }
          title={ () => renderTitle(this.props.title) }
          footer={ () => renderFooter(this.props.title) }
          locale={ {emptyText: 'No Data'} }
          rowKey={ (record) => record.get('key') }
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    createBet: QuickBetDrawerActions.createBet,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(SimpleBettingWidget);
