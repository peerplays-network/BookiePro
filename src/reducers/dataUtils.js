import Immutable from 'immutable';

/**
 * Transform the source bet object into a normalized form for the app
 *
 * NOTE: Currently odds and stake are stored as number in dummy data
 *       Tney are converted to String here for easier comparsion with User Input
 * TODO: REVIEW this again once we have real Blockchain data
 *
 * @param {object} bet - a bet object coming from the Blockchain
 *
 * @return {object} - an immuatble map that contains the unmatched
 * portion of the bet as newly created bet object(s) using the original Bet Id.
 */
const transformUnmatchedBetObject = bet => {
  let result = Immutable.fromJS({
    id: bet.get('id'),
    bettor_id: bet.get('bettor_id'),
    // TODO: may not need toLowerCase once we got the real data
    bet_type: bet.get('back_or_lay').toLowerCase(),
    odds: bet.get('backer_multiplier'),
    betting_market_id: bet.get('betting_market_id'),
    betting_market_description: bet.get('betting_market_description'),
    betting_market_group_description: bet.get('betting_market_group_description'),
  });

  if (result.get('bet_type') === 'back') {
    result = result.set('stake', bet.get('unmatched_bet_amount'));
  } else if (result.get('bet_type') === 'lay') {
    result = result.set('stake', (bet.get('backer_multiplier') - 1) * bet.get('unmatched_bet_amount'));
  }

  return result;
}


/*
 * Transform the source bet object into a normalized form for the app
 *
 * NOTE: Currently odds and stake are stored as number in dummy data
 *       Tney are converted to String here for easier comparsion with User Input
 * TODO: REVIEW this again once we have real Blockchain data
 *
 * @param {object} bet - a bet object coming from the Blockchain
 *
 * @return {object} - an immuatble map that contains the matched
 * portion of the bet as newly created bet object(s) using the original Bet Id.
 */
const transformMatchedBetObject = bet => {
  let result = Immutable.fromJS({
    id: bet.get('id'),
    bettor_id: bet.get('bettor_id'),
    // TODO: may not need toLowerCase once we got the real data
    bet_type: bet.get('back_or_lay').toLowerCase(),
    odds: bet.get('backer_multiplier'),
    betting_market_id: bet.get('betting_market_id'),
    betting_market_description: bet.get('betting_market_description'),
    betting_market_group_description: bet.get('betting_market_group_description'),
  });
  if (result.get('bet_type') === 'back') {
    result = result.set('stake', bet.get('matched_bet_amount'));
  } else if (result.get('bet_type') === 'lay') {
    result = result.set('stake', (bet.get('backer_multiplier') - 1) * bet.get('matched_bet_amount'));
  }

  return result;
}

export {
  transformUnmatchedBetObject,
  transformMatchedBetObject,
}
