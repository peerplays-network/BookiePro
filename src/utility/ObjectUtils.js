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
const localizeArrayOfObjects = function(arrayOfObjects, fieldsToLocalize = [], lang = 'en') {
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
  let className;
  let status = enumStatus || 'error';

  switch (enumStatus) {
    case EventStatus.UPCOMING: {
      className = 'going-live';
      break;
    }

    case EventStatus.IN_PROGRESS: {
      className = 'live';
      break;
    }

    case EventStatus.FROZEN: {
      className = 'stalled';
      break;
    }

    case EventStatus.CANCELED: {
      className = 'stalled';
      break;
    }

    case EventStatus.FINISHED: {
      className = 'finished';
      break;
    }

    case EventStatus.SETTLED: {
      className = 'finished';
      break;
    }

    case EventStatus.COMPLETED: {
      className = 'finished';
      break;
    }

    default: {
      className = 'error';
    }
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

const bettingMarketGroupStatus = function(betting_market_group) {
  return determineStatusResult(betting_market_group.get('status'));
};

/**
 * isStatusUpdate()
 *
 * This function takes the current state, an event object, and a bmgID, and determines whether or
 *  not there has been a status update on the event in quesiton.
 *
 * @param {*} state - The current state of the application
 * @param {*} event - The event that is to be checked
 * @param {*} bmgID - The bmgID that the user is currently viewing
 * @returns - A boolean value. True if there has been a status update, otherwise false.
 */
const isStatusUpdate = function(state, updatedEvent, eventID) {
  // Return early if the bmgID is invalid
  if (!eventID) {
    return false;
  }

  // Get the current Event
  let currentEvent = state.getIn(['event', 'eventsById', eventID]);

  // Return early if the current event or the updated event is invalid.
  if (!currentEvent || !updatedEvent) {
    return false;
  }

  // Do the actual check to see if there has been a status update
  if (updatedEvent.get('status') !== currentEvent.get('status')) {
    return true;
  } else {
    return false;
  }
};

/**
 * isMyBet()
 *
 * This function checks to see whether or not the bet passed in belongs to the current user
 *
 * @param {*} state - The current state of the application
 * @param {*} theBetInQuestion - The betID of the bet that were checking to see if the current user
 *                                owns
 * @returns - A boolean value. True if the bet belongs to the current user. False otherwise.
 */
const isMyBet = function(state, theBetInQuestion) {
  let myBets = state.getIn(['bet', 'unmatchedBetsById']);

  let isMyBet = false;

  myBets.forEach((bet) => {
    if (bet.get('original_bet_id') === theBetInQuestion) {
      isMyBet = true;
    }
  });
  return isMyBet;
};



/**
 * betBelongsToBMG()
 *
 * This functions checks to see whether or not the bet passed in belongs to the BMG that the user
 *  is currently viewing
 * 
 * @param {*} state - The current state of the application
 * @param {*} theBetInQuestion - The betID of thebet that we're checking to see if the current user
 *                                owns
 * @param {*} currentBMG - The current BMG ID
 * @returns - A boolean value. True if the bet belongs to the currently viewed BMG. False Otherwise.
 */
const betBelongsToBMG = function(state, theBetInQuestion, currentBMG) {

  // Exit early if the function is missing sufficient information to make the decision.
  if (!currentBMG || !theBetInQuestion) {
    return false;
  }

  let myBets = state.getIn(['bet', 'unmatchedBetsById']);
  let bettingMarkets = state.getIn(['bettingMarket', 'bettingMarketsById']);

  let betBelongs = false;

  // Iterate through the betting markets to find the BMG that the bettingMarket belongs to
  bettingMarkets.forEach((bm) => {
    // When the BMG that the BM belongs to is found
    if (bm.get('group_id') === currentBMG) {
      // Iterate through the bets... 
      myBets.forEach((bet) => {
        // If the bet matches the bet in question, check to see if that bet belongs to the currently
        //  viewed betting market
        if (bet.get('original_bet_id') === theBetInQuestion && 
            bet.get('betting_market_id') === bm.get('id')) {
          betBelongs = true;
        }
      });
    }
  });

  return betBelongs;
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
  bettingMarketGroupStatus,
  isStatusUpdate,
  isMyBet,
  betBelongsToBMG
};

export default ObjectUtils;
