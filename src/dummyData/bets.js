const bets = [
  {
    id: '1.106.1',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.1',
    amount_to_bet: '1000',
    amount_to_win: '2000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '1000',
    remaining_amount_to_win: '2000',
    cancelled: false
  },
  {
    id: '1.106.2',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.2',
    amount_to_bet: '2000',
    amount_to_win: '3000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '3000',
    cancelled: false
  },
  {
    id: '1.106.3',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.1',
    amount_to_bet: '2000',
    amount_to_win: '4000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '0',
    remaining_amount_to_win: '4000',
    cancelled: false
  },
  {
    id: '1.106.4',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.2',
    amount_to_bet: '3000',
    amount_to_win: '6000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '0',
    remaining_amount_to_win: '6000',
    cancelled: false
  },
  {
    id: '1.106.5',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.1',
    amount_to_bet: '2000',
    amount_to_win: '4000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '1000',
    remaining_amount_to_win: '4000',
    cancelled: false
  },
  {
    id: '1.106.6',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.2',
    amount_to_bet: '3000',
    amount_to_win: '6000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '1000',
    remaining_amount_to_win: '6000',
    cancelled: false
  },
  {
    id: '1.106.7',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.1',
    amount_to_bet: '2000',
    amount_to_win: '4000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '4000',
    cancelled: true
  },
  {
    id: '1.106.8',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.2',
    amount_to_bet: '3000',
    amount_to_win: '6000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '3000',
    remaining_amount_to_win: '6000',
    cancelled: true
  },
  {
    id: '1.106.9',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.13',
    amount_to_bet: '1000',
    amount_to_win: '2000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '1000',
    remaining_amount_to_win: '2000',
    cancelled: false
  },
  {
    id: '1.106.10',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.14',
    amount_to_bet: '2000',
    amount_to_win: '3000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '3000',
    cancelled: false
  },
  {
    id: '1.106.11',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.13',
    amount_to_bet: '2000',
    amount_to_win: '4000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '4000',
    cancelled: true
  },
  {
    id: '1.106.12',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.14',
    amount_to_bet: '3000',
    amount_to_win: '6000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '3000',
    remaining_amount_to_win: '6000',
    cancelled: true
  },
  {
    id: '1.106.13',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.15',
    amount_to_bet: '1000',
    amount_to_win: '2000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '1000',
    remaining_amount_to_win: '2000',
    cancelled: false
  },
  {
    id: '1.106.14',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.16',
    amount_to_bet: '2000',
    amount_to_win: '3000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '3000',
    cancelled: false
  },
  {
    id: '1.106.15',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.15',
    amount_to_bet: '2000',
    amount_to_win: '4000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '4000',
    cancelled: true
  },
  {
    id: '1.106.16',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.16',
    amount_to_bet: '3000',
    amount_to_win: '6000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '3000',
    remaining_amount_to_win: '6000',
    cancelled: true
  },
  {
    id: '1.106.17',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.17',
    amount_to_bet: '1000',
    amount_to_win: '2000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '1000',
    remaining_amount_to_win: '2000',
    cancelled: false
  },
  {
    id: '1.106.18',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.18',
    amount_to_bet: '2000',
    amount_to_win: '3000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '3000',
    cancelled: false
  },
  {
    id: '1.106.19',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.17',
    amount_to_bet: '2000',
    amount_to_win: '4000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '4000',
    cancelled: true
  },
  {
    id: '1.106.20',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.18',
    amount_to_bet: '3000',
    amount_to_win: '6000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '3000',
    remaining_amount_to_win: '6000',
    cancelled: true
  },
  {
    id: '1.106.21',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.19',
    amount_to_bet: '1000',
    amount_to_win: '2000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '1000',
    remaining_amount_to_win: '2000',
    cancelled: false
  },
  {
    id: '1.106.22',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.20',
    amount_to_bet: '2000',
    amount_to_win: '3000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '3000',
    cancelled: false
  },
  {
    id: '1.106.23',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.19',
    amount_to_bet: '2000',
    amount_to_win: '4000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '4000',
    cancelled: true
  },
  {
    id: '1.106.24',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.20',
    amount_to_bet: '3000',
    amount_to_win: '6000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '3000',
    remaining_amount_to_win: '6000',
    cancelled: true
  },
  {
    id: '1.106.25',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.21',
    amount_to_bet: '1000',
    amount_to_win: '2000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '1000',
    remaining_amount_to_win: '2000',
    cancelled: false
  },
  {
    id: '1.106.26',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.22',
    amount_to_bet: '2000',
    amount_to_win: '3000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '3000',
    cancelled: false
  },
  {
    id: '1.106.27',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.21',
    amount_to_bet: '2000',
    amount_to_win: '4000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '4000',
    cancelled: true
  },
  {
    id: '1.106.28',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.22',
    amount_to_bet: '3000',
    amount_to_win: '6000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '3000',
    remaining_amount_to_win: '6000',
    cancelled: true
  },
  {
    id: '1.106.29',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.23',
    amount_to_bet: '1000',
    amount_to_win: '2000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '1000',
    remaining_amount_to_win: '2000',
    cancelled: false
  },
  {
    id: '1.106.30',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.24',
    amount_to_bet: '2000',
    amount_to_win: '3000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '3000',
    cancelled: false
  },
  {
    id: '1.106.31',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.23',
    amount_to_bet: '2000',
    amount_to_win: '4000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '4000',
    cancelled: true
  },
  {
    id: '1.106.32',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.24',
    amount_to_bet: '3000',
    amount_to_win: '6000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '3000',
    remaining_amount_to_win: '6000',
    cancelled: true
  },
  {
    id: '1.106.33',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.23',
    amount_to_bet: '1000',
    amount_to_win: '2000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '1000',
    remaining_amount_to_win: '2000',
    cancelled: false
  },
  {
    id: '1.106.34',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.24',
    amount_to_bet: '2000',
    amount_to_win: '3000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '3000',
    cancelled: false
  },
  {
    id: '1.106.35',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.23',
    amount_to_bet: '2000',
    amount_to_win: '4000',
    back_or_lay: 'lay',
    remaining_amount_to_bet: '2000',
    remaining_amount_to_win: '4000',
    cancelled: true
  },
  {
    id: '1.106.36',
    bettor_id: '1.2.48',
    betting_market_id: '1.105.24',
    amount_to_bet: '3000',
    amount_to_win: '6000',
    back_or_lay: 'back',
    remaining_amount_to_bet: '3000',
    remaining_amount_to_win: '6000',
    cancelled: true
  },

];

//TODO: add more in this list, pay attention on the relation with the account, betting_market dummy data
// also make variety of the type of bets, i.e.
// Unmatched bets -> amount_to_bet === remaining_amount_to_bet && amount_to_win === remaining_amount_to_win
// Matched bets -> remaining_amount_to_bet === 0
// Cancelled bets -> cancelled === true (and it must be an unmatched bets since matched bets can't be cancelled)

export default bets;
