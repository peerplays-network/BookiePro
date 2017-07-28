import { BetCategories } from '../constants';
const getStakeFromBetObject = (bet) => {
  let betAmount;
  if (bet.get('category') === BetCategories.UNMATCHED_BET) {
    betAmount = bet.get('unmatched_bet_amount')
  } else {
    betAmount = bet.get('matched_bet_amount');
  }

  switch (bet.get('back_or_lay').toUpperCase()) {
    case 'BACK':
      return betAmount;
    default:
      return betAmount * (bet.get('backer_multiplier') - 1);
  }
}

const getProfitLiabilityFromBetObject = (bet) => {
  let betCategory = bet.get('category');

  if (betCategory === BetCategories.RESOLVED_BET) {
    return bet.get('amount_won');
  } else {
    let betAmount;
    if (bet.get('category') === BetCategories.UNMATCHED_BET) {
      betAmount = bet.get('unmatched_bet_amount')
    } else if (bet.get('category') === BetCategories.MATCHED_BET) {
      betAmount = bet.get('matched_bet_amount');
    }
    switch (bet.get('back_or_lay').toUpperCase()) {
      case 'BACK':
        return betAmount / (bet.get('backer_multiplier') - 1);
      default:
        return betAmount;
    }
  }
}

const localizeStringOfObject = (object, fieldsToLocalize=[], lang='en') => {
  let result = object;
  fieldsToLocalize.forEach(field => {
    const intlStringArrays = object.get(field);
    let targetString = '';
    intlStringArrays.forEach(intlStringArray => {
      if (intlStringArray.get(0) === lang) {
        targetString = intlStringArray.get(1) || '';
      }
    })
    result = result.set(field, targetString);
  })
  return result;
}

const ObjectUtils = {
  getStakeFromBetObject,
  getProfitLiabilityFromBetObject,
  localizeStringOfObject
}

export default ObjectUtils;
