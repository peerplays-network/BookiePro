import Config from './Config';

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
    MAKE_BET: 57,
    CANCEL_BET: 63,
    BET_MATCHED: 62,
    BETTING_MARKET_RESOLVED: 59,
    BET_CANCELLED: 64,
  }
}


export default DummyOperationTypes;
