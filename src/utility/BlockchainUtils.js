import {ObjectPrefix} from '../constants';
import _ from 'lodash';

const relevantObjectPrefixes = _.values(ObjectPrefix);

const Utils = {
  get_satoshi_amount(amount, asset) {
    let precision = asset.toJS ? asset.get('precision') : asset.precision;
    let assetPrecision = this.get_asset_precision(precision);
    amount = typeof amount === 'string' ? amount : amount.toString();

    let decimalPosition = amount.indexOf('.');

    if (decimalPosition === -1) {
      return parseInt(amount, 10) * assetPrecision;
    } else {
      amount = amount.replace('.', '');
      amount = amount.substr(0, decimalPosition + precision);

      for (let i = 0; i < precision; i++) {
        decimalPosition += 1;

        if (decimalPosition > amount.length) {
          amount += '0';
        }
      }

      return parseInt(amount, 10);
    }
  },

  are_equal_shallow: function(a, b) {
    if (Array.isArray(a) && Array.isArray(a)) {
      if (a.length > b.length) {
        return false;
      }
    }

    for (let key in a) {
      if (!(key in b) || a[key] !== b[key]) {
        return false;
      }
    }

    for (let key in b) {
      if (!(key in a) || a[key] !== b[key]) {
        return false;
      }
    }

    return true;
  },

  get_asset_precision: (precision) => {
    precision = precision.toJS ? precision.get('precision') : precision;
    return Math.pow(10, precision);
  },

  calcBlockTime(block_number, globalObject, dynGlobalObject) {
    if (!globalObject || !dynGlobalObject) {
      return null;
    }

    const block_interval = globalObject.get('parameters').get('block_interval');
    const head_block = dynGlobalObject.get('head_block_number');
    const head_block_time = new Date(dynGlobalObject.get('time') + '+00:00');
    const seconds_below = (head_block - block_number) * block_interval;

    return new Date(head_block_time - seconds_below * 1000);
  },

  blockchainTimeStringToDate(timeString) {
    if (!timeString) {
      return new Date('1970-01-01T00:00:00.000Z');
    }

    // does not end in Z
    // https://github.com/cryptonomex/graphene/issues/368
    if (!/Z$/.test(timeString)) {
      timeString += 'Z';
    }

    return new Date(timeString);
  },
  /**
   * Return the prefix in string
   */
  getObjectIdPrefix(objectId) {
    let regex = /^\d+\.\d+/;
    let matches = regex.exec(objectId);
    return matches && matches[0] && matches[0];
  },
  /**
   * Return an instance number in Integer
   */
  getObjectIdInstanceNumber(objectId) {
    let regex = /\d+$/;
    let matches = regex.exec(objectId);
    return matches && matches[0] && parseInt(matches[0], 10);
  },

  isRelevantObject(objectIdPrefix) {
    return _.includes(relevantObjectPrefixes, objectIdPrefix);
  }
};

export default Utils;
