import { BetTypes } from '../constants';
import _ from 'lodash';
import Immutable from 'immutable';

const oddsPlaces = 2;
const stakePlaces = 3; //minimum stake = 0.001 BTC
const exposurePlaces = oddsPlaces + stakePlaces;
const bitcoinSymbol = '\u0243';
const mBitcoinSymbol = 'm' + bitcoinSymbol;

var isFieldInvalid = function(object, field) {
  if (!object.has(field)) return true;
  const floatValue = parseFloat(object.get(field));
  if (floatValue === 0) return true;

  return isNaN(floatValue);
}

var BettingModuleUtils = {

  oddsPlaces:oddsPlaces,
  stakePlaces:stakePlaces,
  exposurePlaces:exposurePlaces,

  //TODO migrate to curruency util
  getCurruencySymbol: function( currency = 'BTC' ){
    if ( currency === 'mBTC'){
      return mBitcoinSymbol;
    } else if ( currency === 'BTC'){
      return bitcoinSymbol;
    } else{
      return
    }
  },

  //TODO migrate to curruency util


  // return formatted string to support negative bitcoin curruency values
  // amount : float,  amount with BTC as backStartingIndex
  // precision : integer, percision
  // currency : string, display currency, 'BTC' or 'mBTC'
  // showSymbol : boolean
  getFormattedCurrency: function( amount, currency = 'BTC', precision = 0, showSymbol = true){

    const currencySymbol = this.getCurruencySymbol(currency);

    if (currency === 'mBTC'){
      let mPrecision = precision -3;
      if ( mPrecision < 0 ){
        mPrecision = 0;
      }

      return ( amount >= 0 ? '' : '-') + ( showSymbol ? currencySymbol : '' ) + (1000 * Math.abs(amount) ).toFixed(mPrecision);

    } else if (currency === 'BTC'){

      return ( amount >= 0 ? '' : '-') + ( showSymbol ? currencySymbol : '' ) + Math.abs(amount).toFixed(precision);

    } else {
      return
    }

  },

  //  =========== Bet Calculations ===========

  //Appendix I – Summary of Formulas
  // Stake = Profit / (Odds – 1)
  // Backer's Stake = Liability / (Odds – 1)
  getStake: function(odds, profit, currency = 'BTC') {
    const floatProfit = parseFloat(profit);
    const floatOdds = parseFloat(odds);

    //check invalid input
    if (isNaN(floatProfit) || isNaN(floatOdds) ) {
      return;
    }
    if ( floatOdds.toFixed(oddsPlaces) < 1.01 ){
      return;
    }

    return this.getFormattedCurrency( floatProfit / ( floatOdds - 1 ) , currency, stakePlaces, false);

  },

  // Profit = Stake * (Odds – 1)
  // Liability = Backer's Stake * (Odds – 1)
  getProfitOrLiability: function(stake, odds, currency = 'BTC') {
    const floatStake = parseFloat(stake);
    const floatOdds = parseFloat(odds);

    //check invalid input
    if (isNaN(floatStake) || isNaN(floatOdds) ) {
      return;
    }
    if ( floatOdds.toFixed(oddsPlaces) < 1.01 ){
      return;
    }

    return this.getFormattedCurrency( floatStake * ( floatOdds - 1 ) , currency, exposurePlaces, false);

  },

  //Payout = Backer’s Stake * Odds
  getPayout: function(stake, odds, currency = 'BTC') {
    const floatStake = parseFloat(stake);
    const floatOdds = parseFloat(odds);

    //check invalid input
    if (isNaN(floatStake) || isNaN(floatOdds) ) {
      return;
    }
    if ( floatOdds.toFixed(oddsPlaces) < 1.01 ){
      return;
    }

    return this.getFormattedCurrency( floatStake * floatOdds , currency, exposurePlaces, false);

  },


  //  =========== Exposure ===========

  // Matched Exposure (Pending Change Request)
  // Case    Exposure of the selection that the bet originates from    All other selection’s exposure
  // A back bet is matched    + Profit(BTC)   - Stake(BTC)
  // A lay bet is matched    - Liability(BTC)    + Backer’s Stake(BTC)
  //
  // Betslip Exposure (Pending Change Request)
  // Case    Exposure of the selection that the bet originates from    All other selection’s exposure
  // A full back bet betslip is filled    + Profit(BTC)   - Stake(BTC)
  // A full lay bet betslip is filled    - Liability(BTC)   + Backer’s Stake(BTC)
  //
  // Parameters:
  //  bettingMarketId, String : id of the betting market for which expsoure calculation specified
  //  bets: unconfirmedBets, Immutable.List : marketDrawer.unconfirmedBets stored in redux

  // Returns:
  //  exposure of the target betting market
  getExposure: function(bettingMarketId, bets , currency = 'BTC'){
    let exposure = 0.0

    //NOTE using bet.get('stake') for stake related calculation
    bets.forEach((bet, i) => {

      // TODO: Confirm if stake should be empty or having having a zero value if it is not available
      // TODO: Confirm if profit/liability should be empty or having a zero value if it is not available
      if ( isFieldInvalid(bet, 'odds') || isFieldInvalid(bet, 'stake') ||
           isFieldInvalid(bet, 'profit') || isFieldInvalid(bet, 'liability') ) {
        return;
      }

      if (bettingMarketId === bet.get('betting_market_id')){

        //Exposure of the selection that the bet originates from
        if ( bet.get('bet_type') === BetTypes.BACK){
          // A full back bet betslip is filled --> + Profit
          exposure += parseFloat( bet.get('profit') );
        } else if ( bet.get('bet_type') === BetTypes.LAY){
          // A full lay bet betslip is filled --> - Liability
          exposure -= parseFloat( bet.get('liability') );
        }
      } else {
        //  All other selection’s exposure
        if ( bet.get('bet_type') === BetTypes.BACK){
          // A full back bet betslip is filled --> - Stake
          exposure -= parseFloat( bet.get('stake') );
        } else if ( bet.get('bet_type') === BetTypes.LAY){
          // A full lay bet betslip is filled --> + Backer’s Stake
          exposure += parseFloat( bet.get('stake') );
        }
      }

    });

    return this.getFormattedCurrency( exposure , currency, exposurePlaces, false);
  },


  getPotentialExposure: function( marketExposure, betslipExposure){
    return (parseFloat(marketExposure) + parseFloat(betslipExposure)).toFixed(exposurePlaces);
  },

  //  =========== Book Percentage  ===========

  // Back Book Percentage: (100% / Best Back Odds of Selection 1) + … + (100% / Best Back Odds of Selection n)
  // Lay Book Percentage: (100% / Best Lay Odds of Selection 1) + … + (100% / Best Lay Odds of Selection n)

  // Parameters:
  //  bestOfferList : BestBackOddsPerMarket  Immutable.List : the best grouped back odds of each selection
  // Returns:
  //  BackBookPercentage: the back book percentage of the market
  getBookPercentage: function( bestOfferList){
    let backBookPercent = 0.0;

    bestOfferList.forEach( (offer) => {
      backBookPercent += ( (100 / offer.get('odds')) );
    } )

    return Math.round(backBookPercent);
  },

  //  =========== Betting Drawer =========== CR-036 page 2

  // Total (Betslip) = ∑ Back Bet’s Stake(BTC) & Lay Bet’s Liability(BTC) in the Betslip section
  //
  // Parameters:
  // bets : unconfirmedBets, Immutable.List : marketDrawer.unconfirmedBets stored in redux
  // currency : display currency
  //
  // Returns:
  //  total
  getBetslipTotal: function( bets, currency = 'BTC'){

    const accumulator = (total, bet) => {

      if ( isFieldInvalid(bet, 'odds') || isFieldInvalid(bet, 'stake') ||
           isFieldInvalid(bet, 'profit') || isFieldInvalid(bet, 'liability') ) {
        return total;
      }

      if ( bet.get('bet_type') === BetTypes.BACK){
        // + Back Bet’s Stake(BTC)
        return total + parseFloat( bet.get('stake') );
      } else if ( bet.get('bet_type') === BetTypes.LAY){
        // + Lay Bet’s Liability(BTC)
        return total + parseFloat( bet.get('liability') );
      } else {
        return total;
      }
    }
     // this can be reused many times within the module
    let total = bets.reduce(accumulator, 0.0);

    return this.getFormattedCurrency( total , currency, exposurePlaces, false);

  },


  //  =========== Average Odds =========== CR-036 page 2

  // Matched Back Bets (Pending Change Request)
  // Grouped Profit = ∑ Profit
  // Grouped Stake = ∑ Stake
  // Average Odds (round to 2 decimal places) = (∑ Stake + ∑ Profit) / ∑ Stake

  //  Matched Lay Bets (Pending Change Request)
  //  Grouped Liability = ∑ Liability
  // Grouped Backer’s Stake = ∑ Backer’s Stake
  // Average Odds (round to 2 decimal places) = (∑ Backer’s Stake + ∑ Liability) / ∑ Backer’s Stake

  // NOTE format below is outdated according to the wiki
  // https://bitbucket.org/ii5/bookie/wiki/blockchain-objects/bet
  // Parameters:
  // matchedBets :  Immutable.List( Array(bets) )
  // bets.js
  // "id": "1.106.2",
  // "bettor_id": "1.2.48",
  // "betting_market_id": "1.105.12",
  // "amount_to_bet": 2150,
  // "amount_to_win": 5290,
  // "back_or_lay": "Lay",
  // "remaining_amount_to_bet": 2150,
  // "remaining_amount_to_win": 5290,
  // "cancelled": falset



  // Returns:
  //  Immutable.toJS(
  // average Odds,
  //  Grouped Profit
  // Grouped Stake
  //  )

  getAverageOddsFromMatchedBets: function( matchedBets, currency = 'BTC', assetPrecision = 5){


    // Grouped Profit = ∑ Profit
    // Grouped Stake = ∑ Stake
    //  Grouped Liability = ∑ Liability
    // Grouped Backer’s Stake = ∑ Backer’s Stake
    const accumulator = (result, bet) => {

      if ( bet.get('back_or_lay') === BetTypes.BACK){
        // for back bet, amount to bet is stake, amount to win is profit
        return result.update( 'groupedStake', result.get('groupedStake') + bet.get('amount_to_bet'))
          .update( 'groupedLiability', result.get('groupedLiability') + bet.get('amount_to_win'))
          .update( 'groupedProfit', result.get('groupedProfit') + bet.get('amount_to_win'))
      } else if ( bet.get('back_or_lay') === BetTypes.LAY){
        // for lay bet amount to bet is liability, amount to win is backers stake
        return result.update( 'groupedStake', result.get('groupedStake') + bet.get('amount_to_win'))
          .update( 'groupedLiability', result.get('groupedLiability') + bet.get('amount_to_bet'))
          .update( 'groupedProfit', result.get('groupedProfit') + bet.get('amount_to_bet'))
      } else {
        return result;
      }
    }

    let averageOddsresult =  matchedBets.reduce(accumulator, Immutable.fromJS({
      'groupedProfit' : 0.0,
      'groupedLiability' : 0.0,
      'groupedStake' : 0.0,
      'averageOdds' : 0.0,
    }));

    // Average Odds (round to 2 decimal places) = (∑ Backer’s Stake + ∑ Liability) / ∑ Backer’s Stake
    // Average Odds (round to 2 decimal places) = (∑ Stake + ∑ Profit) / ∑ Stake
    const averageOdds = ( averageOddsresult.get('groupedStake') + averageOddsresult.get('groupedProfit')) /  averageOddsresult.get('groupedStake')

    averageOddsresult = averageOddsresult.set('averageOdds', BettingModuleUtils.getFormattedCurrency(averageOdds,
      currency,
      BettingModuleUtils.oddsPlaces,
      false ));

    return averageOddsresult;
  }

}

export default BettingModuleUtils;
