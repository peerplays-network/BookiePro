import { ChainTypes } from 'peerplaysjs-lib';
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
  // TODO: replaced with actual prefix later on
  SPORT_PREFIX : 'SPORT_PREFIX',
  EVENT_GROUP_PREFIX : 'EVENT_GROUP_PREFIX',
  EVENT_PREFIX : 'EVENT_PREFIX',
  BETTING_MARKET_GROUP_PREFIX : 'BETTING_MARKET_GROUP_PREFIX',
  BETTING_MARKET_PREFIX : 'BETTING_MARKET_PREFIX',
  BET_PREFIX : 'BET_PREFIX',
}


export default ObjectPrefix;
