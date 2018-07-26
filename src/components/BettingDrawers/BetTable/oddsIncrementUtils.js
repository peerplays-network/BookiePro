/**
 * This utility module contains functions that handle the increment and decrement
 * of Odds value in the {@link BetTable}.
 */
import _ from 'lodash';
import {BettingModuleUtils} from '../../../utility';

const ODDS_PRECISION = 2;
const MIN_ODDS = 1.01;
const MAX_ODDS = 1000;
const AMERICAN_MID_LOWER_BOUND = -100;
const AMERICAN_MID_UPPER_BOUND = 100;

const ODDS_BOUNDS = {
  decimal: {
    min: MIN_ODDS,
    max: MAX_ODDS
  },
  american: {
    mid_lower: AMERICAN_MID_LOWER_BOUND,
    mid_upper: AMERICAN_MID_UPPER_BOUND,
    min: BettingModuleUtils.oddsFormatFilter(MIN_ODDS, 'american'),
    max: BettingModuleUtils.oddsFormatFilter(MAX_ODDS, 'american')
  }
};

/**
 * Return the increment based on which range does the Odds value fall into
 * -1 is returned if the Odds value is out of range
 * THIS FUNCTION MUST TAKE THE ODDS IN DECIMAL FORMAT
 */
const getOddsIncrement = (odds, decrementing) => {
  if (_.inRange(odds, 1.01, 2)) {
    return 0.01;
  }

  if (_.inRange(odds, 2, 3)) {
    if (odds === 2 && decrementing) {
      return 0.01;
    } else {
      return 0.02;
    }
  }

  if (_.inRange(odds, 3, 4)) {
    if (odds === 3 && decrementing) {
      return 0.02;
    } else {
      return 0.05;
    }
  }

  if (_.inRange(odds, 4, 6)) {
    if (odds === 4 && decrementing) {
      return 0.05;
    } else {
      return 0.1;
    }
  }

  if (_.inRange(odds, 6, 10)) {
    if (odds === 6 && decrementing) {
      return 0.1;
    } else {
      return 0.2;
    }
  }

  if (_.inRange(odds, 10, 20)) {
    if (odds === 10 && decrementing) {
      return 0.2;
    } else {
      return 0.5;
    }
  }

  if (_.inRange(odds, 20, 30)) {
    if (odds === 20 && decrementing) {
      return 0.5;
    } else {
      return 1;
    }
  }

  if (_.inRange(odds, 30, 50)) {
    if (odds === 30 && decrementing) {
      return 1;
    } else {
      return 2;
    }
  }

  if (_.inRange(odds, 50, 100)) {
    if (odds === 50 && decrementing) {
      return 2;
    } else {
      return 5;
    }
  }

  if (_.inRange(odds, 100, 1000)) {
    if (odds === 100 && decrementing) {
      return 5;
    } else {
      return 10;
    }
  }

  // REVIEW special handling for decreasing the odds value from the MAX
  if (odds === MAX_ODDS) {
    return 10;
  }

  return -1;
};

/**
 * Scale a floating number by the default precision value
 * This is an internal utility function used in calculating the floating point remainder.
 */
const fscale = (
  number, 
  precision = ODDS_PRECISION
) => number.toFixed(precision) * Math.pow(10, precision);

/**
 * A very loose implementation of fmod (floating point modulo)
 *
 * We cannot use the modulo operator on floating point nubmers directly so we need
 * to implement the operation ourselves in order to find remainder in floating
 * point numer division.
 *
 * The trick here is to convert floating numbers into integer by scaling them up
 * and then perform integer modulo operation.
 *
 * toFixed() is used to eliminate the very small fractional number resulted after
 * the scaling up. (e.g. try 1.1 * 100 in JS, the result is NOT an integer)
 *
 * Can consider some other solution later:
 */
 /*http://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript*/ // eslint-disable-line
const fmod = (
  number1, 
  number2
) => fscale(number1).toFixed(ODDS_PRECISION) % fscale(number2).toFixed(ODDS_PRECISION);

/*
 * Return the proper function for rounding based on bet type
 *
 * Parameters:
 *  betType - back or lay (seriously don't expect a third value here!)
 *
 * Return:
 *   Math.ceil for Back bets (round up)
 *   Math.floor for Lay bets (round down)
 */
const rounding = (betType) => (betType === 'back' ? Math.ceil : Math.floor);

/*
 * Increase the Odds value by one unit defined in the increment ladder in CR#34
 * The maximum Odds is returned if the new value exceeds the upper limit
 */
const incrementOdds = (odds) => {
  const floatNumber = parseFloat(odds);
  let newOdds = floatNumber + getOddsIncrement(floatNumber);

  if (newOdds > MAX_ODDS) {
    newOdds = MAX_ODDS;
  }

  return newOdds.toFixed(ODDS_PRECISION);
};

/*
 * Decrease the Odds value by one unit defined in the increment ladder in CR#34
 * The minimum Odds is returned if the new value falls below the lower limit
 */
const decrementOdds = (odds) => {
  const floatNumber = parseFloat(odds);
  let newOdds = floatNumber - getOddsIncrement(floatNumber, true);

  if (newOdds < MIN_ODDS) {
    newOdds = MIN_ODDS;
  }

  return newOdds.toFixed(ODDS_PRECISION);
};

/*
 * Adjust the Odds values
 * This is based on the definitions in CR#34
 * The Odds value will be rounded (up for Back bets / down for Lay bets) to the nearest
 * multiple of the designated increment value
 */
const adjustOdds = (odds, betType, oddsFormat) => {
  const floatNumber = BettingModuleUtils.oddsFormatFilter(odds, 'decimal', oddsFormat);
  const increment = getOddsIncrement(floatNumber, oddsFormat);

  if (increment === -1) {
    // If the odds does not fall into any valid range, we either return the smallest
    // or the largest odds.
    // 100 is the lower limit of the last defined range (with the highest odds value)
    if (floatNumber > 100) {
      return ODDS_BOUNDS['decimal'].max;
    }

    return ODDS_BOUNDS['decimal'].min;
  }

  let adjusted = floatNumber;

  if (fmod(floatNumber, increment) !== 0) {
    const ratio = fscale(floatNumber) / fscale(increment);
    adjusted = rounding(betType)(ratio) * increment;
  }

  return adjusted.toFixed(ODDS_PRECISION);
};

export {incrementOdds, decrementOdds, adjustOdds, MIN_ODDS, MAX_ODDS, ODDS_BOUNDS};
