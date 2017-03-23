import _ from 'lodash';
import Immutable from 'immutable';

const accounts = [
  {
    blacklisting_accounts: [],
    proposals: [],
    statistics: '2.6.44',
    vesting_balances: [],
    active_special_authority: [
      0,
      {}
    ],
    network_fee_percentage: 2000,
    orders: [],
    active: {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [
        [
          'TEST77nTdNUpsSmUd9oScjPLGcMWSCD336iGtgWEr7fLz79ZapV766',
          1
        ]
      ],
      address_auths: []
    },
    call_orders: [],
    blacklisted_accounts: [],
    top_n_control_flags: 0,
    whitelisting_accounts: [],
    name: 'testaccount123',
    referrer_name: 'nathan',
    registrar: '1.2.18',
    owner_special_authority: [
      0,
      {}
    ],
    owner: {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [
        [
          'TEST7UviDZp9a35SkVEJmzyPKtwWLbaTrKZGxFqTx8kx7YAFYrztXS',
          1
        ]
      ],
      address_auths: []
    },
    lifetime_referrer_name: 'nathan',
    membership_expiration_date: '1970-01-01T00:00:00',
    pending_dividend_payments: [],
    referrer_rewards_percentage: 0,
    lifetime_referrer: '1.2.18',
    balances: {
      '1.3.0': '2.5.44'
    },
    id: '1.2.44',
    lifetime_referrer_fee_percentage: 3000,
    registrar_name: 'nathan',
    options: {
      memo_key: 'TEST77nTdNUpsSmUd9oScjPLGcMWSCD336iGtgWEr7fLz79ZapV766',
      voting_account: '1.2.5',
      num_witness: 0,
      num_committee: 0,
      votes: [],
      extensions: []
    },
    referrer: '1.2.18',
    whitelisted_accounts: []
  }
];

const immutableAccounts = _.map(accounts, (account) => Immutable.fromJS(account));
export default immutableAccounts;
