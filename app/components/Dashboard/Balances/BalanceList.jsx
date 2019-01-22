import React from 'react';
import BalanceRow from './BalanceRow';
import BalanceEmptyRow from './BalanceEmptyRow';
import Translate from 'react-translate-component';

class BalanceList extends React.Component {
  render() {
    let {title, list, precision, decimals, showHiddenAssets} = this.props;
    let renderList;
    let showList = false;

    renderList = list.map((immItem) => {
      let data = immItem.toJS();

      if (!showHiddenAssets && data.hidden) {
        return null;
      } else {
        showList = true;
      }

      return (
        <BalanceRow
          showHideOption={ this.props.showHideOption }
          onNavigateToDeposit={ this.props.onNavigateToDeposit }
          onNavigateToSend={ this.props.onNavigateToSend }
          onAfterChangeHide={ this.props.onAfterChangeHide }
          onAfterChangeShow={ this.props.onAfterChangeShow }
          key={ data.id }
          precision={ precision }
          decimals={ decimals }
          data={ data }/>
      );
    });

    if (!showList) {
      renderList = (<BalanceEmptyRow/>);
    }

    return (
      <div className='table__wrap'>
        <div className='table__title'>{title}</div>
        <table className='table'>
          <thead>
            <tr className='tr tr-head'>
              <th className='th th__assetsSym'>
                <div className='th__in'>
                  <Translate content='dashboard.assetSymbol'/>
                </div>
              </th>
              <th className='th th__assetsName'>
                <div className='th__in'>
                  <Translate content='dashboard.assetName'/>
                </div>
              </th>
              <th className='th'>
                <div className='th__in'>
                  <Translate content='dashboard.availableBalance'/>
                </div>
              </th>
              <th className='th'>
                <div className='th__in'>
                  <Translate content='dashboard.totalBalance'/>
                </div>
              </th>
              <th className='th th__action'>
                <div className='th__in'>
                  <Translate content='dashboard.actions'/>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className='tr tr-main'>
            {renderList}
          </tbody>
        </table>
      </div>
    );
  }
}

export default BalanceList;