import React from 'react';
import Translate from 'react-translate-component';

class BalanceEmptyRow extends React.Component {
  render() {
    return (
      <tr className={ 'tr-main tr' }>
        <td className='td td__assetsSym'>
          <div className='td__in'>
            <Translate content='dashboard.none'/>
          </div>
        </td>
        <td className='td td__assetsName'>
          <div className='td__in'>
            <Translate content='dashboard.n_a'/>
          </div>
        </td>
        <td className='td'>
          <div className='td__in'>
            <Translate content='dashboard.n_a'/>
          </div>
        </td>
        <td className='td'>
          <div className='td__in'>
            <Translate content='dashboard.n_a'/>
          </div>
        </td>
        <td className='td td__action'>
          <div className='td__in'>
            —
          </div>
        </td>
      </tr>
    );
  }
}

export default BalanceEmptyRow;
