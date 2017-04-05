import { ChainTypes } from 'graphenejs-lib';
const {
  reserved_spaces,
  object_type,
  impl_object_type
} = ChainTypes;

const {
  protocol_ids,
  implementation_ids
} = reserved_spaces;

class ObjectPrefix {
  static ACCOUNT_PREFIX = protocol_ids + '.' + object_type.account;
  static ASSET_PREFIX = protocol_ids + '.' + object_type.asset;
  static OPERATION_HISTORY_PREFIX = protocol_ids + '.' + object_type.operation_history;
  static GLOBAL_PROPERTY_PREFIX = implementation_ids + '.' + impl_object_type.global_property;
  static DYNAMIC_GLOBAL_PROPERTY_PREFIX = implementation_ids + '.' + impl_object_type.dynamic_global_property;
  static ACCOUNT_STAT_PREFIX = implementation_ids + '.' + impl_object_type.account_statistics;
  static ACCOUNT_BALANCE_PREFIX = implementation_ids + '.' + impl_object_type.account_balance;
  // TODO: replaced with actual prefix later on
  static SPORT_PREFIX = 'SPORT_PREFIX';
  static EVENT_GROUP_PREFIX = 'EVENT_GROUP_PREFIX';
  static COMPETITOR_PREFIX = 'COMPETITOR_PREFIX';
  static EVENT_PREFIX = 'EVENT_PREFIX';
  static BETTING_MARKET_GROUP_PREFIX = 'BETTING_MARKET_GROUP_PREFIX';
  static BETTING_MARKET_PREFIX = 'BETTING_MARKET_PREFIX';
  static BET_PREFIX = 'BET_PREFIX';
}


export default ObjectPrefix;
