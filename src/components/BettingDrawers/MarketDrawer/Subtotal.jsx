import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {I18n} from 'react-redux-i18n';
import './Subtotal.less';
import {CurrencyUtils} from '../../../utility';

class Subtotal extends PureComponent {
  render() {
    return (
      <table className='subtotal'>
        <tbody>
          <tr>
            <td>
              {I18n.t('market_drawer.subtotal.amount')}
            </td>
            <td>
              <span>{this.props.currencySymbol} {this.props.amount}</span>
            </td>
          </tr>
          <tr>
            <td>
              {I18n.t('market_drawer.subtotal.fee')}
            </td>
            <td>
              <span>{this.props.currencySymbol} {this.props.transactionFee}</span>
            </td>
          </tr>
          <tr className='total'>
            <td>
              {I18n.t('market_drawer.subtotal.total')}
            </td>
            <td>
              <span>{this.props.currencySymbol} {this.props.total}</span>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const amount = CurrencyUtils.toFixed(
    'transaction',
    ownProps.betAmount,
    ownProps.currencyFormat
  );
  const transactionFee = CurrencyUtils.toFixed(
    'transaction',
    ownProps.transactionFee,
    ownProps.currencyFormat
  );
  const total = CurrencyUtils.toFixed(
    'transaction',
    ownProps.betAmount + ownProps.transactionFee,
    ownProps.currencyFormat
  );
  const currencySymbol = CurrencyUtils.getCurrencySymbol(
    ownProps.currencyFormat,
    'white'
  );

  return {
    amount,
    transactionFee,
    total,
    currencySymbol
  };
};

export default connect(mapStateToProps)(Subtotal);
