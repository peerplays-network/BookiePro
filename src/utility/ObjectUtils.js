
/**
 * The ObjectUtils contains all the functions related to blockchain-objects such as
 * event, bet etc.
 *
 * For the list of supported blockchain-objects, please refer to https://bitbucket.org/ii5/bookie/wiki/blockchain-objects/index
 */
import { BetCategories, EventStatus, BettingMarketResolutionTypes, BetTypes } from '../constants';

/**
 * calculate the stake from bet object, supporting categories including unmatched bets and matched bets, and bet type including both back and lay.
 *
 * @param {bet} Immutable Object, bet object
 * @returns {integer} - stake of the bet object, in terms of 'BTC'
 */
const getStakeFromBetObject = (bet) => {
  let betAmount;
  if (bet.get('category') === BetCategories.UNMATCHED_BET) {
    betAmount = bet.get('unmatched_bet_amount')
  } else {
    betAmount = bet.get('matched_bet_amount');
  }

  return betAmount

  // Author   :   Keegan Francis - k.francis@pbsa.info
  // Tickets  :   BOOK-341,
  // Summary  :   The below code returns a different Bet amount depending on if the betType
  //              is BACK or LAY. I changed this so that the function always returns the
  //              betAmount.
  //
  // switch (bet.get('back_or_lay')) {
  //   case BetTypes.BACK:
  //     return betAmount;
  //   default:
  //     return betAmount / (bet.get('backer_multiplier') - 1);
  // }
}

/**
 * calculate the profitability of bet, supporting cases including resolved bets, unmatched bets and matched bets.
 *
 * @param {bet} Immutable Object, bet object
 * @returns {integer} - bet amount, in terms of 'BTC', calculated based on bet type and bet category
 */
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
    switch (bet.get('back_or_lay')) {
      case BetTypes.BACK:
        return betAmount * (bet.get('backer_multiplier') - 1);
      default:
        return betAmount;
    }
  }
}

/**
 * calculate amount won of a bet given the game result
 *
 * @param {bet} Immutable Object, bet object
 * @param {BettingMarketResolutionTypes} game result
 * @returns {BetTypes} - amount won
 */
const getAmountWonFromBetObject = (bet, bettingMarketResolutionType) => {
  let amountWon = 0;
  switch (bettingMarketResolutionType) {
    case BettingMarketResolutionTypes.WIN: {
      if (bet.get('back_or_lay') === BetTypes.BACK) {
        amountWon = Math.round(bet.get('matched_bet_amount') * (bet.get('backer_multiplier') - 1));
      } else if (bet.get('back_or_lay') === BetTypes.LAY) {
        amountWon = (-1) * bet.get('matched_bet_amount');
      }
      break;
    }
    case BettingMarketResolutionTypes.NOT_WIN: {
      if (bet.get('back_or_lay') === BetTypes.BACK) {
        amountWon = (-1) * bet.get('matched_bet_amount');
      } else if (bet.get('back_or_lay') === BetTypes.LAY) {
        amountWon = Math.round(bet.get('matched_bet_amount') * (bet.get('backer_multiplier') - 1));
      }
      break;
    }
    case BettingMarketResolutionTypes.CANCEL: {
      amountWon = 0;
      break;
    }
    default: break;
  }
  return amountWon;
}

/**
 * Replace the localised string JSON object with localised string, based on lang parameter provided.
 * For reference of blockchain object and localisation, please refer to https://bitbucket.org/ii5/bookie/wiki/blockchain-objects/index
 *
 * Examples of blockchain-objects include sport, event group, event , betting market, bet , rules and market position for account.
 * For JSON object structure of blockchain object, please refer to https://bitbucket.org/ii5/bookie/wiki/browse/blockchain-objects
 *
 * @param {Immutable JS} Immutable JS object, blockchain objects contain localised string fields and they need to be updated with related string value.
 * @param {fieldsToLocalize} string array, in which key names mean the object in param need to be translated
 * @returns {object} - object with internationalized string fields updated based on fieldsToLocalize.
 */
const localizeObject = (object, fieldsToLocalize=[], lang='en') => {
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

/**
 * Extend localizeObject for an array of objects
 *
 * @param {Immutable JS} Immutable JS array of objects, blockchain objects contain localised string fields and they need to be updated with related string value.
 * @param {fieldsToLocalize} string array, in which key names mean the object in param need to be translated
 * @returns {object} - object with internationalized string fields updated based on fieldsToLocalize.
 */
const localizeArrayOfObjects = (arrayOfObjects, fieldsToLocalize=[], lang='en') => {
  return arrayOfObjects.map(object => {
    return localizeObject(object, fieldsToLocalize, lang);
  })
}

/**
 * Report if the event is active by checking its status
 *
 * @param {event} event Immutable.JSobject in Immutable.JS
 * @returns {boolean} - if the event active.
 */
const isActiveEvent = (event) => {
  const eventStatus = event.get('status');

  // Event is active if it is not completed or canceled
  return eventStatus !== EventStatus.COMPLETED && eventStatus !== EventStatus.CANCELED;
}

const ObjectUtils = {
  getStakeFromBetObject,
  getProfitLiabilityFromBetObject,
  getAmountWonFromBetObject,
  localizeObject,
  localizeArrayOfObjects,
  isActiveEvent
}

export default ObjectUtils;
