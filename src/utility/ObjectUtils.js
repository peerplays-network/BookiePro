/**
 * The ObjectUtils contains all the functions related to blockchain-objects such as
 * event, bet etc.
 *
 * For the list of supported blockchain-objects, 
 * please refer to https://bitbucket.org/ii5/bookie/wiki/blockchain-objects/index
 */
import {BetCategories, EventStatus, BettingMarketResolutionTypes, BetTypes} from '../constants';

/**
 * Function   :     getStakeFromBetObject()
 * Purpose    :     Return the stake of the Bet Object depending on matched/Unmatched and Back/Lay
 *
 * @param {bet} Immutable Object, bet object
 * @returns {integer} - stake of the bet object, in terms of 'BTC'
 */
const getStakeFromBetObject = function(bet) {
  let betAmount;

  if (bet.get('category') === BetCategories.UNMATCHED_BET) {
    betAmount = bet.get('unmatched_bet_amount');
  } else {
    betAmount = bet.get('matched_bet_amount');
  }

  // Resolved bets are handled a little bit differently, no need to format depending on back/lay
  if (bet.get('category') === BetCategories.RESOLVED_BET) {
    return betAmount;
  }

  // Author   :   Keegan Francis - k.francis@pbsa.info
  // Tickets  :   BOOK-341,
  // Summary  :   The below code returns a different Bet amount depending on if the betType
  //              is BACK or LAY.
  switch (bet.get('back_or_lay')) {
    case BetTypes.BACK:
      return betAmount;
    case BetTypes.LAY:
      return Math.round(betAmount / (bet.get('backer_multiplier') - 1));
    default:
      return betAmount;
  }
};

/**
 * calculate the profitability of bet, supporting cases including resolved bets, 
 * unmatched bets and matched bets.
 *
 * @param {bet} Immutable Object, bet object
 * @returns {integer} - bet amount, in terms of 'BTC', calculated based on bet type and bet category
 */
const getProfitLiabilityFromBetObject = function(bet) {
  let betCategory = bet.get('category');

  if (betCategory === BetCategories.RESOLVED_BET) {
    return bet.get('amount_won');
  } else {
    let betAmount;

    if (bet.get('category') === BetCategories.UNMATCHED_BET) {
      betAmount = bet.get('unmatched_bet_amount');
    } else if (bet.get('category') === BetCategories.MATCHED_BET) {
      betAmount = bet.get('matched_bet_amount');
    }

    switch (bet.get('back_or_lay')) {
      case BetTypes.BACK:
        return Math.round(betAmount * (bet.get('backer_multiplier') - 1));
      default:
        return betAmount;
    }
  }
};

/**
 * calculate amount won of a bet given the game result
 *
 * @param {bet} Immutable Object, bet object
 * @param {BettingMarketResolutionTypes} game result
 * @returns {BetTypes} - amount won
 */
const getAmountWonFromBetObject = function(bet, bettingMarketResolutionType) {
  let amountWon = 0;

  switch (bettingMarketResolutionType) {
    case BettingMarketResolutionTypes.WIN: {
      // If the betting market was won
      if (bet.get('back_or_lay') === BetTypes.BACK) {
        // if the bet we have is a back
        amountWon = Math.round(bet.get('matched_bet_amount') * (bet.get('backer_multiplier') - 1)); 
      } else if (bet.get('back_or_lay') === BetTypes.LAY) {
        // if the bet we have is a lay then the bet was lost.
        amountWon = -1 * bet.get('matched_bet_amount');
      }

      break;
    }

    case BettingMarketResolutionTypes.NOT_WIN: {
      // If the BMG was not won
      if (bet.get('back_or_lay') === BetTypes.BACK) {
        // If the bet is a back
        amountWon = -1 * bet.get('matched_bet_amount');
      } else if (bet.get('back_or_lay') === BetTypes.LAY) {
        // If the bet is a lay, it has won.
        amountWon = Math.round(bet.get('matched_bet_amount') / (bet.get('backer_multiplier') - 1));
      }

      break;
    }

    case BettingMarketResolutionTypes.CANCEL: {
      amountWon = 0;
      break;
    }

    default:
      break;
  }

  return amountWon;
};

/**
 * Replace the localised string JSON object with localised string, based on lang parameter provided.
 * For reference of blockchain object and localisation, 
 * please refer to https://bitbucket.org/ii5/bookie/wiki/blockchain-objects/index
 *
 * Examples of blockchain-objects include sport, event group, event , betting market, bet , 
 * rules and market position for account.
 * For JSON object structure of blockchain object, 
 * please refer to https://bitbucket.org/ii5/bookie/wiki/browse/blockchain-objects
 *
 * @param {Immutable JS} Immutable JS object, blockchain objects contain localised string fields 
 * and they need to be updated with related string value.
 * @param {fieldsToLocalize} string array, in which key names mean the object in param need to 
 * be translated
 * @returns {object} - object with internationalized string fields updated based 
 * on fieldsToLocalize.
 */
const localizeObject = function(object, fieldsToLocalize = [], lang = 'en') {
  let result = object;
  fieldsToLocalize.forEach((field) => {
    const intlStringArrays = object.get(field);
    let targetString = '';
    intlStringArrays.forEach((intlStringArray) => {
      if (intlStringArray.get(0) === lang) {
        targetString = intlStringArray.get(1) || '';
      }
    });
    result = result.set(field, targetString);
  });
  return result;
};

/**
 * Extend localizeObject for an array of objects
 *
 * @param {Immutable JS} Immutable JS array of objects, blockchain objects contain localised string 
 * fields and they need to be updated with related string value.
 * @param {fieldsToLocalize} string array, in which key names mean the object in param need 
 * to be translated
 * @returns {object} - object with internationalized string fields updated based 
 * on fieldsToLocalize.
 */
const localizeArrayOfObjects = function (arrayOfObjects, fieldsToLocalize = [], lang = 'en') {
  return arrayOfObjects.map((object) => localizeObject(object, fieldsToLocalize, lang));
};

/**
 * Report if the event is active by checking its status
 *
 * @param {event} event Immutable.JSobject in Immutable.JS
 * @returns {boolean} - if the event active.
 */
const isActiveEvent = function(event) {
  const eventStatus = event.get('status');
  // Event is active if it is not completed or canceled
  return eventStatus !== EventStatus.COMPLETED && eventStatus !== EventStatus.CANCELED;
};

const determineStatusResult = function(enumStatus) {
  var className = 'going-live';
  var status = enumStatus || 'error';

  if (enumStatus === 'in_play' || enumStatus === 'in_progress') {
    // Only BMG and BM status' can fulfill this.
    className = 'live';
  }

  return [className, status];
};

const eventStatus = function(event) {
  if (event) {
    return determineStatusResult(event.get('status'));
  } else {
    return null;
  }
};

const bettingMarketStatus = function(bettingMarket) {
  if (bettingMarket !== undefined) {
    return determineStatusResult(bettingMarket);
  }
};

const bettingMarketGroupStatus = function (betting_market_group) {
  return determineStatusResult(betting_market_group.get('status'));
};

const ObjectUtils = {
  getStakeFromBetObject,
  getProfitLiabilityFromBetObject,
  getAmountWonFromBetObject,
  localizeObject,
  localizeArrayOfObjects,
  isActiveEvent,
  eventStatus,
  bettingMarketStatus,
  bettingMarketGroupStatus
};

export default ObjectUtils;
