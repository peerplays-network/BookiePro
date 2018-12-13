import React from 'react';
import Translate from 'react-translate-component';
import {FormattedNumber} from 'react-intl';
import TimeAgo from '../Utility/TimeAgo';

class SendHistory extends React.Component {
  render() {
    const action = this.props.action === 'send'
      ? <Translate content='operation.action.send'/>
      : <Translate content='operation.action.receive'/>;
    const status = this.props.status === 'pending'
      ? <Translate content='operation.pending' blocks={ this.props.blocks } />
      : <Translate content='operation.done' />;
    const precision = Math.pow(10, this.props.precision);
    return (
      <div className='tableRow'>
        <div className='tableCell'>{action}</div>
        <div className='tableCell text__gray '><TimeAgo time={ this.props.time } /></div>
        <div className='tableCell '>{status}</div>
        <div className='tableCell '>{this.props.symbol}</div>
        <div className='tableCell text_r'>
          <FormattedNumber
            value={
              (this.props.amount && !isNaN(this.props.amount / precision))
                ? (this.props.amount / precision)
                : 0
            }
            minimumFractionDigits={ 0 }
            maximumFractionDigits={ this.props.precision }
          /></div>
      </div>
    );
  }
}

export default SendHistory;
