import Config from './Config';
import { ChainTypes } from 'peerplaysjs-lib';

// TODO: when js library is ready, remove this and use ChainTypes
let DummyOperationTypes;
if (Config.useDummyData) {
  DummyOperationTypes = {
    MAKE_BET: 201,
    CANCEL_BET: 202,
    BET_MATCHED: 203,
    BETTING_MARKET_RESOLVED: 204,
    BET_CANCELLED: 205,
  }
} else {
  DummyOperationTypes = {
    MAKE_BET: ChainTypes.operations.bet_place,
    CANCEL_BET: ChainTypes.operations.bet_cancel,
    BET_MATCHED: ChainTypes.operations.bet_matched,
    BETTING_MARKET_RESOLVED: ChainTypes.operations.betting_market_group_resolved,
    BET_CANCELLED: ChainTypes.operations.bet_canceled,
  }
}


export default DummyOperationTypes;
