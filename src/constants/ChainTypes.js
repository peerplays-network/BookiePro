import Config from './Config';
import { ChainTypes } from 'peerplaysjs-lib';

// This is a temporary extended ChainTypes that is used to support dummy data
// TODO: When dummy data is not needed, please remove this and use ChainTypes from peerplaysjs-lib directly

if (Config.useDummyData) {
  ChainTypes.operations.bet_place = 201;
  ChainTypes.operations.bet_cancel = 202;
  ChainTypes.operations.bet_matched = 203;
  ChainTypes.operations.betting_market_group_resolved = 204;
  ChainTypes.operations.bet_canceled = 205;

  ChainTypes.object_type.sport = 100;
  ChainTypes.object_type.event_group = 101;
  ChainTypes.object_type.event = 102;
  ChainTypes.object_type.betting_market_rules = 107;
  ChainTypes.object_type.betting_market_group = 104;
  ChainTypes.object_type.betting_market = 105;
  ChainTypes.object_type.bet = 106;
}


export default ChainTypes;
