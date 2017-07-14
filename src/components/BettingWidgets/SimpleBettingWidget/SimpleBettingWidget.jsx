import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import {  Table } from 'antd';
import RulesModal from '../../Modal/RulesModal'
import { QuickBetDrawerActions,NavigateActions } from '../../../actions';
import { I18n, Translate } from 'react-redux-i18n';
import { BettingModuleUtils, CurrencyUtils, EventNameUtils } from '../../../utility';
// We cannot use CSS to override antd Table column width using CSS
// This can only be done via the code
const eventTimeColumnWidth = 65;
const offerColumnWidth = 70;

// TODO: Consider moving this to a utility library later
// TODO: The implementation below is for demo purpose. Will review this in future iterations.
const renderEventTime = (text, record) => {
  const eventTime = moment(parseInt(record.get('time'), 10))
  let dateString = eventTime.format('MMM D');
  let timeString = eventTime.calendar();
  // TODO: Need a better way as this is NOT going to work once we have localization
  if (timeString.toLowerCase().includes('today')) {
    dateString = 'Today';
  }

  return <span>{ dateString }<br/>{ eventTime.format('h:mm a') }</span>;
}

const getColumns = (renderOffer, navigateTo, currencyFormat) => ([
  {
    dataIndex: 'time',
    key: 'time',
    width: eventTimeColumnWidth,
    className: 'event-time',
    render: renderEventTime
  }, {
    dataIndex: 'event_name',
    key: 'event_name',
    // Do not specify width so the column
    // will grow/shrink with the size of the table
    className: 'event-name',
    render: (text, record) => EventNameUtils.breakAtVs(record.get('event_name')),
    onCellClick: (record, event) => {
      record.get('moneyline') && navigateTo('/exchange/bettingmarketgroup/' + record.get('moneyline'))
    }
  }, {
    title: '1',
    children: [{
      dataIndex: 'back_offer_home',
      key: 'back_offer_home',
      width: offerColumnWidth,
      className: 'back-offer',
      render: renderOffer('back', 'lay', 1, currencyFormat)
    }, {
      dataIndex: 'lay_offer_home',
      key: 'lay_offer_home',
      width: offerColumnWidth,
      className: 'lay-offer',
      render: renderOffer('lay', 'back', 1, currencyFormat)
    }]
  }, {
    title: '2',
    children: [{
      dataIndex: 'back_offer_away',
      key: 'back_offer_away',
      width: offerColumnWidth,
      className: 'back-offer',
      render: renderOffer('back', 'lay', 2, currencyFormat)
    }, {
      dataIndex: 'lay_Offer_away',
      key: 'lay_offer_away',
      width: offerColumnWidth,
      className: 'lay-offer',
      render: renderOffer('lay', 'back', 2, currencyFormat)
    }]
  }
]);

const renderTitle = (title) => (
  <div className='title'>
    <div className='sport'>{ title }</div>
    <div className='rules'>
      {/* Rules Dialogue box */}
      <RulesModal parentClass='rules' title={ I18n.t('rules_dialogue.title') } buttonTitle={ I18n.t('rules_dialogue.buttonTitle') } >
        <Translate value='rules_dialogue.content' dangerousHTML/>
      </RulesModal>
    </div>
  </div>
);

class SimpleBettingWidget extends PureComponent {
  constructor(props) {
    super(props);
    this.onOfferClicked = this.onOfferClicked.bind(this);
    this.renderOffer = this.renderOffer.bind(this);
  }

  onOfferClicked(event, record, team, betType, betting_market_id, odds) {
    event.preventDefault();
    this.props.createBet(record.get('event_id'), record.get('event_name'), team, betType, betting_market_id, odds);
  }

  renderFooter(props) {
    return  (
      <div className='footer'>
        <a onClick={ () => props.navigateTo(props.footerLink) }>
          More { props.title }
        </a>
      </div>
    )
  }

  // action: [ lay(ing) | back(ing) ]
  // betType: [ back | lay ]
  // index: [ 1 (Home Team) | 2 (Away Team)]
  renderOffer(action, typeOfBet, index, currencyFormat) {
    return (text, record) => {
      const offers = record.get('offers');
      if (offers.isEmpty()) {
        return '';
      }
      // TODO: Exception handling
      const betting_market_id = offers.get(index-1).get('betting_market_id');
      const offer = offers.get(index-1).get(typeOfBet).get(0);
      if (offer === undefined) {
        return '';
      }
      // TODO: REVIEW This is temp solution. The better way is to use the Competitor data.
      const team = record.get('event_name').split('vs')[index-1].trim();
      return (
        <a href='#' onClick={ (event) => this.onOfferClicked(event, record, team, action, betting_market_id, offer.get('odds')) }>
          <div className='offer'>
            <div className='odds'>{ offer.get('odds') }</div>
            <div className='price'>
              { CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol( offer.get('price'), currencyFormat, BettingModuleUtils.stakePlaces, true)}
            </div>
          </div>
        </a>
      );
    };
  };

  render() {
    let events = [];
    if (this.props.events !== undefined) {
      // Introduce the key attribute to suppress the React warning
      events = this.props.events.map((event) => event.set('key', event.get('event_id')));

      // Sort by event time
      events = events.sort((a, b) => {
        let timeA = a.get('time');
        let timeB = b.get('time');
        if (timeA < timeB) { return -1; }
        if (timeA > timeB) { return 1; }
        return 0;
      })
    }
    return (
      // Note that we have to explicitly tell antd Table how to find the rowKey
      // because it is not compatible with Immutable JS
      <div className='simple-betting'>
        <Table
          bordered
          columns={ getColumns(this.renderOffer, this.props.navigateTo, this.props.currencyFormat) }
          dataSource={ events.toArray() }
          title={ () => renderTitle(this.props.title) }
          footer={ () => this.props.showFooter ? this.renderFooter(this.props) : null }
          pagination={ this.props.showPagination ? { pageSize: this.props.pageSize } : false }
          locale={ {emptyText: I18n.t('simple_betting_widget.no_data')} }
          rowKey={ (record) => record.get('key') }
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    createBet: QuickBetDrawerActions.createBet,
    navigateTo: NavigateActions.navigateTo,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(SimpleBettingWidget);
