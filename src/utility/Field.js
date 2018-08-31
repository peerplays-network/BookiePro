import CurrencyUtils from './CurrencyUtils';

class Field {
  constructor(field, currencyType, precision) {
    this._type = field;
    this._precision = this.precision(this._type, currencyType, precision);
    this._average = this.average();
  }
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
  }

  average() {
    if (
      this._field === 'avgProfitLiability' ||
      this._field === 'avgStake'
    ) {
      return true;
    } else {
      return false;
    }
  }

  precision(field, currencyType, value=0) {
    let precision;
    
    if (field === 'total') {
      precision = value;
    } else {
      precision = CurrencyUtils.fieldPrecisionMap[field][currencyType];
    }

    return precision;
  }
}

export default Field;
