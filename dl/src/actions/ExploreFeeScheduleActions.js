import {EXPLORER_FEE_SCHEDULE_SET} from "../constants/ActionTypes";
import Repository from "../repositories/chain/repository";
import {ChainTypes} from 'peerplaysjs-lib'
import counterpart from 'counterpart';
import assetUtils from "common/asset_utils";

/**
 * Fnc: get equivalent amount value
 *
 * @param {Object} fromAsset
 * @param {Object} toAsset
 * @param {number} amount
 * @returns {number}
 */
function equivalentValue(fromAsset, toAsset, amount){
    let price = getPrice(fromAsset, toAsset);

    let equivalentAmount = price * amount / Math.pow(10, fromAsset.precision);

    return equivalentAmount;
}

/**
 * get price by assets
 *
 * @param {Object} coreAsset
 * @param {Object} currentAsset
 * @returns {number}
 */
function getPrice(coreAsset, currentAsset) {
    let coreAmount = currentAsset.options.core_exchange_rate.base.amount / Math.pow(10, coreAsset.precision);
    let currentAmount = currentAsset.options.core_exchange_rate.quote.amount / Math.pow(10, currentAsset.precision);

    return currentAmount / coreAmount;
}


class ExploreFeeScheduleActions {
    /**
     * load data for blockchain fee page (Fee Schedule Page/Tab)
     * @returns {function(*, *)}
     */
    static load() {
        return (dispatch, getState) => {
            Promise.all([
                Repository.fetchObject('2.0.0'),
                Repository.fetchObject('1.3.0'),
                Repository.getAsset(getState().dashboardPage.assetSymbol)
            ]).then(result => {
                let globalObject = result[0].toJS();
                let coreAsset = result[1].toJS();
                let currentAsset = result[2].toJS();

                let currentFees = globalObject.parameters.current_fees;

                let feeGrouping = {
                    general  : [0,25,26,27,28,32,33,37,39,40],
                    asset    : [10,11,12,13,14,15,16,17,18,19,38],
                    // market   : [1,2,3,4,17,18],
                    account  : [5,6,7,8,9],
                    business : [20,21,22,23,24,29,30,31,34,35,36],
                    game : [45,46]
                };

                let ltmRequired = [5, 7, 20, 21, 34];

                let scale   = currentFees.scale;
                let feesRaw = currentFees.parameters;

                let trxTypes = counterpart.translate("transaction.trxTypes");

                let feeTypes = counterpart.translate("transaction.feeTypes");

                let ops = Object.keys(ChainTypes.operations);



                let fees = Object.values(ChainTypes.operations).map((feeIdx) => {
                    if (feeIdx >= feesRaw.length) {
                     console.warn("Asking for non-existing fee id %d! Check group settings in Fees.jsx", feeIdx);
                     return; // FIXME, if I ask for a fee that does not exist?
                    }



                    let feeStruct = feesRaw[feeIdx];
                    let opId = feeStruct[0];
                    let feeObj = feeStruct[1];
                    let operation_name = ops[ opId ];
                    let operation = trxTypes[ operation_name ] ? trxTypes[ operation_name ] : operation_name;


                    let fee = [];
                    for (let key in feeObj) {
                        let amount = feeObj[key]*scale/1e4;

                        let symbol = assetUtils.getSymbol(currentAsset.symbol);

                        let equivalentAmount = amount ? `${equivalentValue(coreAsset, currentAsset, amount)} ${symbol}` : feeTypes["_none"];
                        let equivalentAmountLTM = amount * 0.2 ?`${equivalentValue(coreAsset, currentAsset, amount * 0.2)} ${symbol}` : feeTypes["_none"];

                        if (ltmRequired.indexOf(opId)<0) {
                            fee.push({
                                feeKey: key,
                                feeType: feeTypes[key],
                                standartFee: equivalentAmount,
                                memberFee: equivalentAmountLTM
                            })
                        } else {
                            fee.push({
                                feeKey: key,
                                feeType: feeTypes[key],
                                standartFee: null,
                                memberFee: equivalentAmountLTM
                            })
                        }
                    }
                    return {operation_name, operation, fee}
                })

                let feeGroups = {};

                let FeeGroupsTitle  = counterpart.translate("transaction.feeGroups");

                for (let groupName in feeGrouping) {
                    let groupNameText = FeeGroupsTitle[groupName];
                    let group = feeGrouping[groupName].map(id => fees[id]);
                    feeGroups = Object.assign({}, feeGroups, {
                        [groupName]: { title: groupNameText, group }
                    });
                }

                dispatch({
                    type: EXPLORER_FEE_SCHEDULE_SET,
                    payload: feeGroups
                })
            })
        }
    }
}

export default ExploreFeeScheduleActions;
