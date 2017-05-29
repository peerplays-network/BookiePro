import _ from 'lodash';
import Immutable from 'immutable';
import { I18n } from 'react-redux-i18n';
import { StringUtils } from '../utility';

const groupMoneyLineBinnedOrderBooks = (event, bettingMarketGroups, binnedOrderBooksByBettingMarketId) => {
  // Get the Moneyline betting market group
  const moneyline = bettingMarketGroups.find(
    (group) => event.get('betting_market_group_ids').includes(group.get('id')) &&
               group.get('market_type_id').toUpperCase() === 'MONEYLINE'
  );

  let groupedBinnedOrderBooks = Immutable.List();
  // Implicit Rule: the first betting market is for the home team
  moneyline.get('betting_market_ids').forEach((bettingMarketId) => {
    let immutableOrderBook = Immutable.Map().set('betting_market_id', bettingMarketId);
    const orderBook = binnedOrderBooksByBettingMarketId.get(bettingMarketId);
    if (orderBook === undefined) {
      immutableOrderBook = immutableOrderBook
                            .set('back', Immutable.List())
                            .set('lay', Immutable.List());
    } else {
      immutableOrderBook = immutableOrderBook
                            .set('back', orderBook.get('aggregated_back_bets'))
                            .set('lay', orderBook.get('aggregated_lay_bets'));
    }
    groupedBinnedOrderBooks = groupedBinnedOrderBooks.push(immutableOrderBook);
  });
  return groupedBinnedOrderBooks;
}

/*
 * This function resolve the display name of a Betting Market (or Market Type Value)
 */
const resolveMarketTypeValue = (bettingMarketGroup, bettingMarketId) => {
  const isHomeTeam = bettingMarketGroup.get('betting_market_ids').keyOf(bettingMarketId) === 0;
  const marketTypeId = bettingMarketGroup.get('market_type_id');

  if ( marketTypeId === 'Spread') {
    const margin = bettingMarketGroup.getIn(['options', 'margin']);
    return StringUtils.formatSignedNumber(isHomeTeam ? margin : margin * -1);
  }

  if (marketTypeId === 'OverUnder') {
    const score = bettingMarketGroup.getIn(['options', 'score']);
    return (isHomeTeam ? I18n.t('bettingMarketGroup.over') : I18n.t('bettingMarketGroup.under')) + score;
  }

  //if (marketTypeId === 'Moneyline')
  return marketTypeId;
}

/*
 * This function resolve the display name of a Betting Market Group
 */
const resolveBettingMarketGroupDisplayName = (bettingMarketGroup) => {
  const marketTypeId = bettingMarketGroup.get('market_type_id');

  if (marketTypeId === 'Spread'){
    const margin = bettingMarketGroup.getIn(['options','margin']);
    return I18n.t('bettingMarketGroup.spread') + (margin >= 0 ? '+' : '') + margin;
  }

  if (marketTypeId === 'OverUnder'){
    return I18n.t('bettingMarketGroup.overunder') + bettingMarketGroup.getIn(['options', 'score']);
  }

  return marketTypeId;
}

export {
  groupMoneyLineBinnedOrderBooks,
  resolveMarketTypeValue,
  resolveBettingMarketGroupDisplayName,
};
