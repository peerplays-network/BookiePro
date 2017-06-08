import _ from 'lodash';
import { I18n } from 'react-redux-i18n';
import { StringUtils } from '../utility';

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
  resolveMarketTypeValue,
  resolveBettingMarketGroupDisplayName,
};
