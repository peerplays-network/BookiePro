/**
 * The ObjectUtils contains all the functions related to blockchain-objects such as
 * event, bet etc.
 *
 * For the list of supported blockchain-objects, please refer to https://bitbucket.org/ii5/bookie/wiki/blockchain-objects/index
 */
import { BetCategories } from '../constants';
import moment from 'moment';

/**
 * caluclate the stake from be object, supporting categories including unmatched bets and matched bets, and bet type including both back and lay.
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

  switch (bet.get('back_or_lay').toUpperCase()) {
    case 'BACK':
      return betAmount;
    default:
      return betAmount / (bet.get('backer_multiplier') - 1);
  }
}

/**
 * caluclate the profitability of bet, supporting cases including resolved bets, unmatched bets and matched bets.
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
    switch (bet.get('back_or_lay').toUpperCase()) {
      case 'BACK':
        return betAmount * (bet.get('backer_multiplier') - 1);
      default:
        return betAmount;
    }
  }
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

/**
 * report if the event is active by comparing with current time and event start time
 *
 * @param {event} event Immutable.JSobject in Immutable.JS
 * @returns {boolean} - if the event active.
 */
const isActiveEvent = (event) => {
  let isActive = false;
  // TODO: should use event status instead, revisit this when the enum code for event_status is known
  const eventTime = event.get('start_time');
  isActive = moment(eventTime).isAfter();
  return isActive;
}

const ObjectUtils = {
  getStakeFromBetObject,
  getProfitLiabilityFromBetObject,
  localizeStringOfObject,
  isActiveEvent
}

export default ObjectUtils;
