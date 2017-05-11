import Immutable from 'immutable';

// Take an ongoing bet and return if it is a 100% unmatched bet
const isUnmatchedBet = bet => bet.get('remaining_amount_to_bet') === bet.get('amount_to_bet')

// Take an ongoing bet and return if it is a 100% matched bet
const isMatchedBet = bet => bet.get('remaining_amount_to_bet') === 0

/*
 * Transform the source bet object into a normalized form for the app
 * The function returns the matched (if available) and unmatched (if available)
 * portions of a bet separately.
 *
 * NOTE: Currently odds and stake are stored as number in dummy data
 *       Tney are converted to String here for easier comparsion with User Input
 * TODO: REVIEW this again once we have real Blockchain data
 *
 * Parameters:
 * bet - a bet object coming from the Blockchain (dummy data)
 *
 * Return an immuatble map that may contain either or both the matched and unmatched
 * portion of the bet as newly created bet object(s) using the original Bet Id.
 */
const transformBetObject = bet => {
  const base = Immutable.fromJS({
    id: bet.get('id'),
    bettor_id: bet.get('bettor_id'),
    // TODO: may not need toLowerCase once we got the real data
    bet_type: bet.get('back_or_lay').toLowerCase(),
    odds: bet.get('remaining_amount_to_win'),
    betting_market_id: bet.get('betting_market_id'),
  });

  const unmatched = base.set('stake', bet.get('remaining_amount_to_bet'));
  // If remaining_amount_to_bet is 0, then this is a 100% Unmatched bet
  const matched = base.set('stake', bet.get('amount_to_bet') - bet.get('remaining_amount_to_bet'));
  let result = Immutable.Map();

  if (isMatchedBet(bet)) {
    result = result.set('matched', matched);  // 100% matched
  } else if (isUnmatchedBet(bet)) {
    result = result.set('unmatched', unmatched); // 100% unmatched
  } else {
    result = result.set('matched', matched);    // the partially matched portion
    result = result.set('unmatched', unmatched); // the remaining unmatched portion
  }

  return result;
}

export {
  isUnmatchedBet,
  isMatchedBet,
  transformBetObject,
}
