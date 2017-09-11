import ChainTypes from './ChainTypes';

const {
  reserved_spaces,
  object_type,
  impl_object_type
} = ChainTypes;

const {
  protocol_ids,
  implementation_ids
} = reserved_spaces;


const ObjectPrefix = {
  ACCOUNT_PREFIX : protocol_ids + '.' + object_type.account,
  ASSET_PREFIX : protocol_ids + '.' + object_type.asset,
  OPERATION_HISTORY_PREFIX : protocol_ids + '.' + object_type.operation_history,
  GLOBAL_PROPERTY_PREFIX : implementation_ids + '.' + impl_object_type.global_property,
  DYNAMIC_GLOBAL_PROPERTY_PREFIX : implementation_ids + '.' + impl_object_type.dynamic_global_property,
  ACCOUNT_STAT_PREFIX : implementation_ids + '.' + impl_object_type.account_statistics,
  ACCOUNT_BALANCE_PREFIX : implementation_ids + '.' + impl_object_type.account_balance,
  SPORT_PREFIX : protocol_ids + '.' + object_type.sport ,
  EVENT_GROUP_PREFIX : protocol_ids + '.' + object_type.event_group ,
  EVENT_PREFIX : protocol_ids + '.' + object_type.event ,
  RULE_PREFIX: protocol_ids + '.' + object_type.betting_market_rules,
  BETTING_MARKET_GROUP_PREFIX : protocol_ids + '.' + object_type.betting_market_group ,
  BETTING_MARKET_PREFIX : protocol_ids + '.' + object_type.betting_market ,
  BET_PREFIX : protocol_ids + '.' + object_type.bet ,
}


export default ObjectPrefix;
