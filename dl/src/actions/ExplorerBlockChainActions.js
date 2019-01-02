import ActionTypes from '../constants/ActionTypes';
import ObjectRepository from '../repositories/ObjectRepository';
import ExplorerBlockChainService from '../services/ExplorerBlockChainService';
import ColorHelper from '../helpers/ColorHelper';
import TimeHelper from '../helpers/TimeHelper';
import Repository from '../repositories/chain/repository';

/**
 * Private Redux Action Creator (EXPLORER_BLOCK_CHAIN_CHANGE_STATISTIC)
 * Set statistic page block
 * @param data
 * @returns {{type, payload: *}}
 */
function changeStatisticAction(data) {
  return {
    type: ActionTypes.EXPLORER_BLOCK_CHAIN_CHANGE_STATISTIC,
    payload: data
  };
}

/**
 * Private Redux Action Creator (EXPLORER_BLOCK_CHAIN_CHANGE_RECENT_BLOCKS)
 * Set recent blocks on explore page
 * @param data
 * @returns {{type, payload: *}}
 */
function changeRecentBlockAction(data) {
  return {
    type: ActionTypes.EXPLORER_BLOCK_CHAIN_CHANGE_RECENT_BLOCKS,
    payload: data
  };
}

/**
 * Private Redux Action Creator (EXPLORER_BLOCK_CHAIN_CHANGE_OPERATION_BLOCKS)
 * Set operation list
 * @param data
 * @returns {{type, payload: *}}
 */
function changeOperationBlockAction(data) {
  return {
    type: ActionTypes.EXPLORER_BLOCK_CHAIN_CHANGE_OPERATION_BLOCKS,
    payload: data
  };
}

/**
 * Private Redux Action Creator (EXPLORER_BLOCK_CHAIN_SET_DATA_IS_FETCHED)
 * At least once the data were collected
 * @param data
 * @returns {{type, payload: *}}
 */
function setDataIsFetchedAction(data) {
  return {
    type: ActionTypes.EXPLORER_BLOCK_CHAIN_SET_DATA_IS_FETCHED,
    payload: data
  };
}

let MAX_LATEST_BLOCKS = 20;
let MAX_LATEST_OPERATIONS = 100;
let operationIncrement = 1;
let latestBlock = 0;
let fetchedObjects = {};

class ExplorerBlockChainActions {
  /**
   * get and update All Data on explorer page
   * @returns {function(*=, *)}
   */
  static updateAllData() {
    return (dispatch, getState) => {
      Promise.all(
        [Repository.getObject('2.1.0'),
          Repository.getObject('2.0.0'),
          Repository.getObject('1.3.0')]
      ).then(([object210, object200, coreAsset]) => {
        let recentBlocks = Repository.getRecentBlocks();
        let recentOperations = Repository.getRecentOperations();

        if (!object210 || !object200 || !coreAsset || recentBlocks.size < MAX_LATEST_BLOCKS) {
          return null;
        }

        if (coreAsset.get('dynamic_asset_data_id')) {
          let dynamic = coreAsset.get('dynamic'),
            last_irreversible_block_num = object210.get('last_irreversible_block_num'),
            maxHeight = object210.get('head_block_number'),
            updateData = {
              head_block_number: maxHeight,
              last_irreversible_block_num: last_irreversible_block_num,
              recently_missed_count: object210.get('recently_missed_count'),
              time: object210.get('time'),
              active_witnesses: object200.get('active_witnesses'),
              active_committee_members: object200.get('active_committee_members'),
              block_interval: object200.getIn(['parameters', 'block_interval']),
              current_supply: dynamic.get('current_supply'),
              confidential_supply: dynamic.get('confidential_supply'),
              coreAsset: coreAsset,
              latestFetchedBlocks: []
            };

          if (recentBlocks.get(0).id > latestBlock) {
            dispatch(changeRecentBlockAction({
              latestBlocks: recentBlocks
            }));
            latestBlock = recentBlocks.get(0).id;
            let operationsNew = [],
              operationData = {},
              neededObjects = {};
            let state = getState();
            let increment = 0;

            recentOperations.toJS().forEach((operation) => {
              if (increment < MAX_LATEST_OPERATIONS) {
                let obj = {
                  block_id: operation[1].block_id,
                  created_at: operation[1].created_at,
                  fee_amount: operation[1]['fee']['amount'],
                  fee_asset_id: operation[1]['fee']['asset_id'],
                  fee_asset: null,
                  operation_index: operationIncrement,
                  type: operation[0],
                  deltaBlocks: 0,
                  operation: null
                };

                operationsNew.unshift(obj);
                operationData[operationIncrement] = operation;
                operationIncrement++;
                increment++;
                neededObjects = ExplorerBlockChainService.setNeededObjects(
                  operation, neededObjects
                );
              }
            });

            let blockTimes = [],
              graphBlockTimes = [],
              graphBlockTransactions = [],
              previousTime,
              lastBlock = 0,
              firstBlock = 0,
              trxCount = 0;

            recentBlocks.toJS().forEach((block, index) => {
              let trxLength = block.transactions.length;
              trxCount += trxLength;

              if (index > 0) {
                let delta = (previousTime - block.timestamp) / 1000;

                blockTimes.push([block.id, delta]);
                graphBlockTimes.push({
                  id: block.id,
                  y: delta,
                  x: block.id,
                  color: ColorHelper.getExplorerTimeColor(delta)
                });
                lastBlock = block.timestamp;
              } else {
                firstBlock = block.timestamp;
              }

              previousTime = block.timestamp;
              graphBlockTransactions.push({
                id: block.id,
                y: trxLength,
                x: block.id,
                color: ColorHelper.getExplorerTransactionColor(trxLength)
              });
            });

            let avgTime = blockTimes.reduce((previous, current, idx, array) => {
              return previous + current[1] / array.length;
            }, 0);

            let offset_mills = new Date().getTime() - TimeHelper.timeStringToDate(
              state.explorerBlockchainPage.time
            ).getTime();
            let updatedAt = new Date(state.explorerBlockchainPage.time)
              .getTime() + offset_mills;// * 0.75;

            updateData.avgTime = avgTime;
            updateData.graphBlockTimes = graphBlockTimes;
            updateData.graphBlockTransactions = graphBlockTransactions;
            updateData.latestBlocks = recentBlocks;
            updateData.updatedAt = updatedAt;
            updateData.trxPerSec = trxCount / ((firstBlock - lastBlock) / 1000);
            updateData.trxPerBlock = trxCount / recentBlocks.size;

            dispatch(changeStatisticAction(updateData));
            dispatch(setDataIsFetchedAction({
              dataIsFetched: true
            }));
            let operations = state.explorerBlockchainPage.operations;
            Promise.all([]).then(() => {
              let neededKeys = Object.keys(neededObjects);
              let filteredKeys = [];
              // TODO:: chainstore repository
              neededKeys.forEach((neededKey) => {
                if (!fetchedObjects[neededKey]) {
                  filteredKeys.push(neededKey);
                }
              });
              Promise.all(
                (filteredKeys.length)
                  ? [ObjectRepository.fetchObjectsByIds(filteredKeys)]
                  : []
              ).then((data) => {
                if (data && data.length) {
                  let bitAssets = {};
                  data[0].forEach((item) => {
                    fetchedObjects[item.id] = item;

                    if (item.id.substring(0, '1.3.'.length) === '1.3.' && item.bitasset_data_id) {
                      if (!bitAssets[item.bitasset_data_id]) {
                        bitAssets[item.bitasset_data_id] = [];
                      }

                      bitAssets[item.bitasset_data_id].push(item.id);
                    }
                  });
                  let bitAssetsKeys = Object.keys(bitAssets);

                  if (bitAssetsKeys.length) {
                    return ObjectRepository.fetchObjectsByIds(bitAssetsKeys).then((data) => {
                      data.forEach((bitObject) => {
                        bitAssets[bitObject.id].forEach((assetId) => {
                          fetchedObjects[assetId]['bitasset'] = bitObject;
                        });
                      });
                    });
                  }
                }
              }).then(() => {
                operations = operations.clear();
                operationsNew.forEach((newOperation) => {
                  let operation = operationData[newOperation['operation_index']];
                  let updatedOperation = ExplorerBlockChainService.setOperationField(
                    newOperation, operation, fetchedObjects
                  );

                  if (updatedOperation) {
                    operations = operations.unshift(updatedOperation);
                  }
                });

                if (operations.size > MAX_LATEST_OPERATIONS) {
                  let iterations = operations.size - MAX_LATEST_OPERATIONS;

                  for (let i = 0; i < iterations; i++) {
                    operations = operations.pop();
                  }
                }

                operations = operations.map((operation) => {
                  operation.deltaBlocks = (operation.block_id - last_irreversible_block_num > 0)
                    ? operation.block_id - last_irreversible_block_num
                    : 0;
                  return operation;
                });
                dispatch(changeOperationBlockAction({
                  operations: operations
                }));
              });
            }).catch((error) => {
              console.log('Error in BlockchainActions.getLatest: ', error);
            });
          } else {
            console.log('Not upd...');
            return null;
          }
        }
      });
    };
  }
}

export default ExplorerBlockChainActions;