/**
 * The BettingModuleUtils contains all the common calculation related to betting.
 *
 * Ranging from odds/stake/exposure to payout/book percentage/ calculation
 *
 * Those utility functions are mostly used in betslips, betting widgets and
 *  betting drawers components.
 */
import {BetTypes, Config} from '../constants';
import Immutable from 'immutable';
import {CurrencyUtils} from './';

/*
If current currency is BTF: 
  odds precision             -> 2
  stake precision            -> 5
  profit/liability precision -> 5
If current currency is mBTF: 
  odds precision             -> 2
  stake precision            -> 2
  profit/liability precision -> 2
*/
const oddsPlaces = 2;
const stakePlaces = 5; //minimum stake = 0.001 BTF
const exposurePlaces = 5;
const configCurrency = Config.features.currency;

var isFieldInvalid = function(object, field) {
  if (!object.has(field)) {
    return true;
  }

  const floatValue = parseFloat(object.get(field));

  if (floatValue === 0) {
    return true;
  }

  return isNaN(floatValue);
};

var BettingModuleUtils = {
  //odds percision (BTF)
  oddsPlaces: oddsPlaces,
  //stake / backers' stake percision (BTF)
  stakePlaces: stakePlaces,
  //exposure / profit / liability percision (BTF)
  exposurePlaces: exposurePlaces,

  //  =========== Bet Calculations ===========

  /**
   *  Calculate stake or liability based on odds, profit/liability
   *
   *  Stake = Profit / (Odds – 1)
   *  Backer's Stake = Liability / (Odds – 1)
   *
   * @param {string} odds
   * @param {string} profit - profit or liability
   * @param {string} currency - display currency, 'coin' or 'mCoin'
   * @returns {string} - stake, based on either coin or mCoin
   */
  getStake: function(odds, profit, currency = configCurrency) {
    const floatProfit = parseFloat(profit);
    const floatOdds = parseFloat(odds);

    //check invalid input
    if (isNaN(floatProfit) || isNaN(floatOdds)) {
      return;
    }

    if (floatOdds.toFixed(oddsPlaces) < 1.01) {
      return;
    }

    return CurrencyUtils.getFormattedCurrency(floatProfit / (floatOdds - 1), currency, stakePlaces);
  },

  /**
   *  Calculate profit or liability based on stake and odds
   *
   *  Profit = Stake * (Odds – 1)
   *  Liability = Backer's Stake * (Odds – 1)
   *
   * @param {string} stake
   * @param {string} odds
   * @param {string} currency - display currency, 'coin' or 'mCoin'
   * @returns {string} - profit of liability, based on either coin or mCoin
   */
  getProfitOrLiability: function(stake, odds, currencyFormat = configCurrency, profitOrLiability) {
    if (stake && stake.toString().indexOf('*') === -1) {
      let floatStake = parseFloat(stake);
      let floatOdds = parseFloat(odds);
      let currencyType = CurrencyUtils.getCurrencyType(currencyFormat);
      
      //check invalid input
      if (isNaN(floatStake) || isNaN(floatOdds)) {
        return;
      }

      if (floatOdds.toFixed(oddsPlaces) < 1.01) {
        return;
      }

      // Any mBTF passed into this function will be 1000 times larger than it needs to be.
      //  The return function will multiply the mBTF value by 1000.
      if (currencyType === 'mCoin') {
        floatStake = floatStake / 1000;
      }
      
      let precision = CurrencyUtils.fieldPrecisionMap[profitOrLiability][currencyType];
      let amount = (floatStake * (floatOdds - 1)).toFixed(precision);
        
      return CurrencyUtils.getFormattedCurrency(amount, currencyFormat, precision);
    } else {
      return stake;
    }
  },

  /**
   *  Calculate payout based on stake and odds
   *
   *  Payout = Backer’s Stake * Odds
   *
   * @param {string} odds : odds
   * @param {string} stake : stake
   * @param {string} currency - display currency, 'coin' or 'mCoin'
   * @returns {string} - payout, based on either coin or mCoin
   */
  getPayout: function(stake, odds, currency = configCurrency) {
    const floatStake = parseFloat(stake);
    const floatOdds = parseFloat(odds);

    //check invalid input
    if (isNaN(floatStake) || isNaN(floatOdds)) {
      return;
    }

    if (floatOdds.toFixed(oddsPlaces) < 1.01) {
      return;
    }

    return CurrencyUtils.getFormattedCurrency(floatStake * floatOdds, currency, exposurePlaces);
  },

  //  =========== Exposure ===========

  /**
   *  Calculate Matched exposure based on betting market data and bets
   *  NOTE :  Matched Exposure is not ready yet
   *
   *  Matched Exposure (Pending Change Request)
   *  Case                   |  Exposure of the selection that   | All other selection’s exposure
   *                         |  the bet originates from          |
   * ------------------------+-----------------------------------+---------------------------------
   *  A back bet is matched  |      + Profit(BTF)                | - Stake(BTF)
   *  A lay bet is matched   |      - Liability(BTF)             | + Backer’s Stake(BTF)
   *
   *  Betslip Exposure (Pending Change Request)
   *  Case    Exposure of the selection that the bet originates from
   *  All other selection’s exposure
   *  A full back bet betslip is filled    + Profit(BTF)   - Stake(BTF)
   *  A full lay bet betslip is filled    - Liability(BTF)   + Backer’s Stake(BTF)
   *
   * @param {string} bettingMarketId : id of the betting market for which expsoure
   * calculation specified
   * @param {Immutable.List} bets - unconfirmedBets, marketDrawer.unconfirmedBets stored in redux
   * @param {string} currency - display currency, 'coin' or 'mCoin'
   * @returns {string} - exposure of the target betting market, either BTF or mBTF, based
   * on currency param
   */
  getExposure: function(bettingMarketId, bets, currency = configCurrency) {
    let exposure = 0.0;

    bets.forEach((bet) => {
      // TODO: Confirm if stake should be empty or having having a zero
      // value if it is not available
      // TODO: Confirm if profit/liability should be empty or having a zero
      // value if it is not available
      if (
        isFieldInvalid(bet, 'odds') ||
        isFieldInvalid(bet, 'stake') ||
        isFieldInvalid(bet, 'profit') ||
        isFieldInvalid(bet, 'liability')
      ) {
        return;
      }

      if (bettingMarketId === bet.get('betting_market_id')) {
        //Exposure of the selection that the bet originates from
        if (bet.get('bet_type') === BetTypes.BACK) {
          // A full back bet betslip is filled --> + Profit
          exposure += parseFloat(bet.get('profit'));
        } else if (bet.get('bet_type') === BetTypes.LAY) {
          // A full lay bet betslip is filled --> - Liability
          exposure -= parseFloat(bet.get('liability'));
        }
      } else {
        //  All other selection’s exposure
        if (bet.get('bet_type') === BetTypes.BACK) {
          // A full back bet betslip is filled --> - Stake
          exposure -= parseFloat(bet.get('stake'));
        } else if (bet.get('bet_type') === BetTypes.LAY) {
          // A full lay bet betslip is filled --> + Backer’s Stake
          exposure += parseFloat(bet.get('stake'));
        }
      }
    });

    return CurrencyUtils.getFormattedCurrency(exposure, currency, exposurePlaces);
  },

  getPotentialExposure: function(marketExposure, betslipExposure) {
    return (parseFloat(marketExposure) + parseFloat(betslipExposure)).toFixed(exposurePlaces);
  },

  //  =========== Book Percentage  ===========

  /**
   *  Calculate book percentage with provided best back/lay odds of selection. Formula is as follow:
   *
   *  Back Book Percentage: (100% / Best Back Odds of Selection 1) +
   *  … + (100% / Best Back Odds of Selection n)
   *  Lay Book Percentage: (100% / Best Lay Odds of Selection 1) +
   *  … + (100% / Best Lay Odds of Selection n)
   *
   * @param {Immutable.List} - bestOfferList-  bets which have the best offer among the
   * bets in same market.
   * @returns {integer} - book percentage in a certain market, rounded to nearest integer
   */
  getBookPercentage: function(bestOfferList) {
    const backBookPercent = bestOfferList.reduce(
      (total, offer) => total + 100 / offer.get('odds'),
      0.0
    );

    return Math.round(backBookPercent);
  },

  //  =========== Betting Drawer =========== CR-036 page 2

  /**
   *  calculate total vale of betslip,
   *
   *  Total (Betslip) = ∑ Back Bet’s Stake(BTF) & Lay Bet’s Liability(BTF) in the Betslip section
   *
   * @param {Immutable.List} bets - unconfirmedBets in betslip,
   * marketDrawer.unconfirmedBets stored in redux
   * @param {string} currency - display currency, 'coin' or 'mCoin'
   * @returns {double} - total: total value of betslip
   */
  getBetslipTotal: function(bets, currency = configCurrency) {
    const accumulator = (total, bet) => {
      if (
        isFieldInvalid(bet, 'odds') ||
        isFieldInvalid(bet, 'stake') ||
        isFieldInvalid(bet, 'profit') ||
        isFieldInvalid(bet, 'liability')
      ) {
        return total;
      }

      if (bet.get('bet_type') === BetTypes.BACK) {
        // + Back Bet’s Stake(BTF)
        return total + parseFloat(bet.get('stake'));
      } else if (bet.get('bet_type') === BetTypes.LAY) {
        // + Lay Bet’s Liability(BTF)
        return total + parseFloat(bet.get('liability'));
      } else {
        return total;
      }
    };

    // this can be reused many times within the module
    let total = bets.reduce(accumulator, 0.0);

    return CurrencyUtils.getFormattedCurrency(total, currency, exposurePlaces);
  },

  /**
   *  =========== Average Odds (CR-036) ===========
   *  Matched Back Bets
   *  Grouped Profit = ∑ Profit
   *  Grouped Stake = ∑ Stake
   *  Average Odds (round to 2 decimal places) = (∑ Stake + ∑ Profit) / ∑ Stake
   *
   *  Matched Lay Bets
   *  Grouped Liability = ∑ Liability
   *  Grouped Backer’s Stake = ∑ Backer’s Stake
   *  Average Odds (round to 2 decimal places) = (∑ Backer’s Stake + ∑ Liability) / ∑ Backer’s Stake
   *
   *  There is no clear distinction between profit and liability. They are
   *  essentially calculated in the same way using odds and stake (back) or
   *  backer's stake (lay) but are presented using different labels.
   *
   *  Notes:
   *  This function expects a `normalized` bet objects. This `normalized` format
   *  is only used within the betting application.
   *
   * @param {Immutable.List} matchedBets - list of matched bets with the same bet
   * type, i.e. all back or all lay
   * @param {string} currency - display currency, 'BTF' or 'mBTF'
   * @param {integer} precision - ( ***BTF*** base), either BettingModuleUtils.oddsPlaces or
   * BettingModuleUtils.stakePlaces or BettingModuleUtils.exposurePlaces
   * @returns {Immutable.Maps} - total valu object which has the following fields:
   *    - averageOdds
   *    - groupedProfitOrLiability
   *    - groupedStake
   */
  calculateAverageOddsFromMatchedBets: function(matchedBets, currency = configCurrency) {
    const currencyType = CurrencyUtils.getCurrencyType(currency);
    // Assume all the bets are of the same bet type so we can just sample from the first bet
    const profitOrLiability =
      matchedBets
        .get(0)
        .get('bet_type')
        .toLowerCase() === 'back'
        ? 'profit'
        : 'liability';
    // profit and liability are consider the same thing with different label
    const groupedProfitOrLiability = matchedBets.reduce(
      (sum, bet) => sum + parseFloat(bet.get(profitOrLiability)),
      0.0
    );
    const groupedStake = matchedBets.reduce((sum, bet) => sum + parseFloat(bet.get('stake')), 0.0);
    const averageOdds = (groupedStake + groupedProfitOrLiability) / groupedStake;
    return Immutable.fromJS({
      averageOdds: averageOdds.toFixed(oddsPlaces),
      groupedProfitOrLiability: CurrencyUtils.getFormattedCurrency(
        groupedProfitOrLiability,
        currency,
        CurrencyUtils.fieldPrecisionMap['avgProfitLiability'][currencyType],
        true,
        true
      ),
      groupedStake: CurrencyUtils.getFormattedCurrency(
        groupedStake,
        currency,
        CurrencyUtils.fieldPrecisionMap['avgStake'][currencyType],
        true,
        true
      )
    });
  },

  /**
   * check if the bet valud to submit to the Blockchain
   *
   * @param { Immutable.Maps} - bet
   * @returns {boolean} - if the bet valid
   */
  isValidBet: function(bet, balance, currencyFormat) {
    
    let proposedBetAmount = 0;
    let bet_type = bet.get('bet_type');
    let stake =  parseFloat(bet.get('stake'));
    let liability = parseFloat(bet.get('liability'));
    let validBetAmount = false;
    // Calculate price of bet, balance.
    // Convert the balance to a human recognizable number.
    // mili[coin] = balance / 100,000
    // [coin] = balance / 100,000,000
    balance = currencyFormat.indexOf('m') === 0 
      ? balance / Math.pow(10, 5) 
      : balance / Math.pow(10, 8);

    let transactionFee = currencyFormat === 'BTF' 
      ? Config.btfTransactionFee 
      : Config.mbtfTransactionFee;

    // Check if bet is larger than the balance available.
    if (bet_type && bet_type.toLowerCase() === 'back'){
      proposedBetAmount = transactionFee + stake;
    } else if (bet_type && bet_type.toLowerCase() === 'lay'){
      proposedBetAmount = transactionFee + liability;
    }

    if (proposedBetAmount <= balance){
      validBetAmount = true;
    }

    return !isFieldInvalid(bet, 'odds') && !isFieldInvalid(bet, 'stake') && validBetAmount;
  },

  /**
   * Changes the odds to the selected format (decimal, american)
   * @param  { double } odds   The Odds in the current format
   * @param  { string } toFormat The requested format
   * @param  { string } fromFormat The current format
   * @return { string }        The formatted odds
   */
  oddsFormatFilter: function(odds, toFormat = 'decimal', fromFormat = 'decimal') {
    if ((odds === undefined || odds === null || odds === '') && toFormat === 'decimal') {
      return '';
    }

    if ((odds === undefined || odds === null || odds === '') && toFormat === 'american') {
      return '';
    }

    let parsedOdds = parseFloat(odds);

    if (toFormat === fromFormat) {
      return parsedOdds;
    }

    if (fromFormat === 'decimal') {
      if (toFormat === 'american') {
        if (parsedOdds >= 2.0) {
          return ((parsedOdds - 1) * 100).toFixed(0);
        } else {
          return (-100 / (parsedOdds - 1)).toFixed(0);
        }
      }
    }

    if (fromFormat === 'american') {
      if (toFormat === 'decimal') {
        if (parsedOdds >= 100) {
          return parsedOdds / 100 + 1;
        } else if (parsedOdds < 100 && parsedOdds >= 0) {
          return 2.0;
        } else if (parsedOdds < 0 && parsedOdds >= -100) {
          return 1.99;
        } else if (parsedOdds < -100) {
          return -100 / parsedOdds + 1;
        } else {
          return 1.01;
        }
      }
    }
  }
};

export default BettingModuleUtils;
