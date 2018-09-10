/**
 * The SimpleBettingWidget, also known as Quick Market Betting Widget, is used in
 * AllSports (Home), Sport and EventGroup (Division) components. It displays the
 * best back / lay odds available in 2 or 3 (depends on the type of sport) selections
 * in the Moneyline market.
 *
 * The main underlying component of the SimpleBettingWidget is a Table component
 * from the Ant-Design library. Each table cell displays the Odds and the associated
 * Liquidity value. If there is no available odds in one of the selection, an "offer"
 * cell which will be displayed instead (with the word OFFER inside).
 *
 * When a user clicks on a cell, a Betslip will be added with the odds value (if
 * available) in the Quick Bet Drawer.
 *
 * This component does not rely on any state in the Redux store. All data displayed
 * are provided by outer component as props.
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {Table} from 'antd';
import {QuickBetDrawerActions, NavigateActions} from '../../../actions';
import {I18n} from 'react-redux-i18n';
import {BettingModuleUtils, CurrencyUtils, EventNameUtils, DateUtils} from '../../../utility';
import {MyAccountPageSelector} from '../../../selectors';
import {Config} from '../../../constants';

/**
 * We cannot use CSS to override antd Table column width using CSS
 * This can only be done via the code
 */
const eventTimeColumnWidth = 65;
const offerColumnWidth = 70;
const coinDust = Config.dust.exchangeCoin;

const {OFFER_PRECISION} = CurrencyUtils;

const renderEventTime = (text, record) => {
  var isLiveMarket;
  let eventStatus = record.get('eventStatus');

  if (eventStatus.toLowerCase() === 'in_progress') {
    isLiveMarket = true;
  }

  if (isLiveMarket) {
    return (
      <span className='live'>
        <span className='' />
        {I18n.t('object_status_enumerator.live')}
      </span>
    );
  } else {
    const eventTime = moment(record.get('time')).format('H:mm');
    let dateString = DateUtils.getMonthAndDay(record.get('time'));

    return (
      <div>
        {eventStatus !== 'upcoming' ? (
          <div className='simple-outcome'>
            {I18n.t('object_status_enumerator.' + record.get('eventStatus'))}
          </div>
        ) : null}
        <span>
          {dateString}
          <br />
          {eventTime}
        </span>
      </div>
    );
  }
};

const getColumns = (renderOffer, navigateTo, currencyFormat, sportName, oddsFormat) => {
  // 1 = home , 2 = away, 3 = draw
  let columns = [
    {
      dataIndex: 'time',
      key: 'time',
      width: eventTimeColumnWidth,
      className: 'event-time',
      render: renderEventTime
    },
    {
      dataIndex: 'event_name',
      key: 'event_name',
      // Do not specify width so the column
      // will grow/shrink with the size of the table
      className: 'event-name',
      render: (text, record) => EventNameUtils.breakAtVs(record.get('event_name')),
      onCellClick: (record) => {
        record.get('bettingMarketGroupId') &&
          navigateTo('/exchange/bettingmarketgroup/' + record.get('bettingMarketGroupId'));
      }
    },
    {
      title: '1',
      children: [
        {
          dataIndex: 'back_offer_home',
          key: 'back_offer_home',
          width: offerColumnWidth,
          className: 'back-offer',
          render: renderOffer('back', 'lay', 1, currencyFormat, oddsFormat)
        },
        {
          dataIndex: 'lay_offer_home',
          key: 'lay_offer_home',
          width: offerColumnWidth,
          className: 'lay-offer',
          render: renderOffer('lay', 'back', 1, currencyFormat, oddsFormat)
        }
      ]
    },
    {
      title: 'X',
      children: [
        {
          dataIndex: 'back_offer_draw',
          key: 'back_offer_draw',
          width: offerColumnWidth,
          className: 'back-offer',
          render: renderOffer('back', 'lay', 3, currencyFormat, oddsFormat)
        },
        {
          dataIndex: 'lay_Offer_away',
          key: 'lay_offer_draw',
          width: offerColumnWidth,
          className: 'lay-offer',
          render: renderOffer('lay', 'back', 3, currencyFormat, oddsFormat)
        }
      ]
    },
    {
      title: '2',
      children: [
        {
          dataIndex: 'back_offer_away',
          key: 'back_offer_away',
          width: offerColumnWidth,
          className: 'back-offer',
          render: renderOffer('back', 'lay', 2, currencyFormat, oddsFormat)
        },
        {
          dataIndex: 'lay_Offer_away',
          key: 'lay_offer_away',
          width: offerColumnWidth,
          className: 'lay-offer',
          render: renderOffer('lay', 'back', 2, currencyFormat, oddsFormat)
        }
      ]
    }
  ];

  // TODO: This is an ad-hoc method to decide whether we need to display the
  //       3rd selection for DRAW
  if (sportName.toUpperCase() !== 'SOCCER') {
    columns.splice(3, 1); // remove the X column group
  }

  return columns;
};

const renderTitle = (title) => (
  <div className='title'>
    <div className='sport'>{title}</div>
  </div>
);

class SimpleBettingWidget extends PureComponent {
  constructor(props) {
    super(props);
    this.onOfferClicked = this.onOfferClicked.bind(this);
    this.renderOffer = this.renderOffer.bind(this);
  }

  /**
   * Cick handler of the offer cells
   *
   * Once a user has clicked on a cell (with or without Odds), this function will
   * be triggered and fired a `createBet` event via the QuickBetDrawerAction.
   *
   * This function will not fire any event if the props `canCreateBet` is true.
   * This value set by the parent component when the Quick Bet Drawer cannot accept
   * new bet, such as a Confirmation overlay has popped up and user has not responded
   * to it yet.
   *
   * Parameter definition are omitted as they are self explanatory.
   */
  onOfferClicked(event, record, betType, betting_market_id, odds = '') {
    event.preventDefault();

    if (this.props.canCreateBet === true) {
      this.props.createBet(
        record.get('event_id'),
        record.get('event_name'),
        betType,
        betting_market_id,
        odds
      );
    }
  }

  renderFooter(props) {
    return (
      <div className='footer'>
        <a onClick={ () => props.navigateTo(props.footerLink) }>More {props.title}</a>
      </div>
    );
  }
  /**
   * This function returns a function that will be used by the Ant-Design table
   * for cell rendering the betting offers in the widget.
   *
   * By default, the antd Table render each element from the dataSource prop as
   * text. To override this behavior, we need to supply a function with the following
   * signature:
   *   Function(text, record, index) {}
   *
   * We need to generate the render function mostly because antd Table expects
   * the data records to be Simple JavaScriot Objects. However, we are using
   * Immutable JS objects. Another reason is that the offers/bets data are stored
   * as nested attributes, which the antd Table default cell rendering function
   * is not designed to handle.
   *
   * @param {string} action - either 'lay' (laying a bet) or 'back' (backing a bet)
   * @param {string} typeOfBet - either 'lay' bet or 'back' bet. This value is always
   * the opposite of `action`. The idea is to perform an `action` to a `typeOfBet`.
   * For example, 'laying a back bet' or 'backing a lay bet'.
   * @param {integer} index - 1: Home Team, 2: Away Team, 3: Draw (for some sports only)
   * @param {string} currencyFormat - Base coin or mili coin format.
   * @returns {Function} - the actual cell rendering function used by antd Table
   */
  renderOffer(action, typeOfBet, index, currencyFormat) {
    return (text, record) => {
      // Retrieve the nested offers data from the data record
      let offers = record.get('offers');
      let eventStatus = record.get('eventStatus');
      var canBet, className;

      if (
        eventStatus !== 'settled' &&
        eventStatus !== 'graded' &&
        eventStatus !== 'finished' &&
        eventStatus !== 'frozen'
      ) {
        canBet = true;
      }

      if (
        offers === undefined ||
        offers.isEmpty() ||
        offers.getIn([index - 1, 'betting_market_id']) === undefined ||
        !canBet
      ) {
        return '';
      }

      // TODO: Shall we sort the list of offers first before we pass it to the betting widget?
      offers = offers.sort((a, b) => {
        return a.get('betting_market_id')
          .localeCompare(b.get('betting_market_id'));
      });

      const betting_market_id = offers.getIn([index - 1, 'betting_market_id']);
      let offer = offers.getIn([index - 1, typeOfBet, 0]);

      if (typeOfBet === 'lay') {
        if (offer) {
          let odds = offer.get('odds');
          let price = offer.get('price');
          offer = offer.set('price', price / (odds - 1)
            .toFixed(CurrencyUtils.fieldPrecisionMap['odds']['BTF']));
        }
      }

      if ( offer === undefined || offer.get('price') < coinDust.toString()){
        return (
          <div className={ className }>
            <a
              href='#'
              onClick={ (event) => this.onOfferClicked(event, record, action, betting_market_id) }
            >
              <div className='offer empty'>
                <div className='odds'>{I18n.t('simple_betting_widget.offer')}</div>
              </div>
            </a>
          </div>
        );
      }

      let currencySymbol = CurrencyUtils.getCurrencySymbol(Config.features.currency);
      return (
        <div className={ className }>
          <a
            href='#'
            onClick={ (event) => this.onOfferClicked(event, record, action, betting_market_id, offer.get('odds')) } // eslint-disable-line
          >
            <div className='offer'>
              <div className='odds'>
                {BettingModuleUtils.oddsFormatFilter(offer.get('odds'), this.props.oddsFormat)}
              </div>
              <div className='price'>
                {currencySymbol}
                {CurrencyUtils.formatByCurrencyAndPrecisionWithSymbol(
                  offer.get('price'),
                  currencyFormat,
                  OFFER_PRECISION,
                  true
                )}
              </div>
            </div>
          </a>
        </div>
      );
    };
  }

  render() {
    let events = [];

    if (this.props.events !== undefined) {
      // Introduce the key attribute to suppress the React warning
      events = this.props.events.map((event) => event.set('key', event.get('event_id')));

      // Sort by event time
      events = events.sort((a, b) => {
        let timeA = moment(a.get('time'));
        let timeB = moment(b.get('time'));

        if (timeA.isBefore(timeB)) {
          return -1;
        }

        if (timeA.isAfter(timeB)) {
          return 1;
        }

        return 0;
      });
    }

    return (
      // Note that we have to explicitly tell antd Table how to find the rowKey
      // because it is not compatible with Immutable JS
      <div className='simple-betting'>
        <Table
          bordered
          columns={ getColumns(
            this.renderOffer,
            this.props.navigateTo,
            this.props.currencyFormat,
            this.props.sportName,
            this.props.oddsFormat,
            this.renderClass
          ) }
          dataSource={ events.toArray() }
          title={ () => renderTitle(this.props.title) }
          footer={ () => (this.props.showFooter ? this.renderFooter(this.props) : null) }
          pagination={ this.props.showPagination ? {pageSize: this.props.pageSize} : false }
          locale={ {emptyText: I18n.t('simple_betting_widget.no_data')} }
          rowKey={ (record) => record.get('key') }
          rowClassName={ (record) => {
            let eventStatus = record.get('eventStatus');

            if (
              eventStatus === 'settled' ||
              eventStatus === 'graded' ||
              eventStatus === 'finished' ||
              eventStatus === 'frozen'
            ) {
              return 'simple-betting-disabled';
            } else {
              return null;
            }
          } }
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    oddsFormat: MyAccountPageSelector.oddsFormatSelector(state)
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    createBet: QuickBetDrawerActions.createBet,
    navigateTo: NavigateActions.navigateTo
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleBettingWidget);
