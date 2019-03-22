import React from 'react';
import {I18n} from 'react-redux-i18n';
import './Subtotal.less';
import {CurrencyUtils} from '../../../utility';

const Subtotal = (props) => {
  const amount = CurrencyUtils.toFixed(
    'transaction',
    props.betAmount,
    props.currencyFormat
  );
  const transactionFee = CurrencyUtils.toFixed(
    'transaction',
    props.transactionFee,
    props.currencyFormat
  );
  const total = CurrencyUtils.toFixed(
    'transaction',
    props.betAmount + props.transactionFee,
    props.currencyFormat
  );
  const currencySymbol = CurrencyUtils.getCurrencySymbol(
    props.currencyFormat,
    'white'
  );

  return (
    <table className='subtotal'>
      <tbody>
        <tr>
          <td>
            {I18n.t('market_drawer.subtotal.amount')}
          </td>
          <td>
            <span>{currencySymbol} {amount}</span>
          </td>
        </tr>
        <tr>
          <td>
            {I18n.t('market_drawer.subtotal.fee')}
          </td>
          <td>
            <span>{currencySymbol} {transactionFee}</span>
          </td>
        </tr>
        <tr className='total'>
          <td>
            {I18n.t('market_drawer.subtotal.total')}
          </td>
          <td>
            <span>{currencySymbol} {total}</span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Subtotal;
