import React from 'react';
import {Link} from 'react-router';
import {FormattedNumber} from 'react-intl';
import classNames from 'classnames';
import Translate from 'react-translate-component';
import asset_utils from 'common/asset_utils';

class BalanceRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popup: false
    };
    this._closePopup = this._closePopup.bind(this);
    this.changeVisible = this.changeVisible.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this._closePopup, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._closePopup, false);
  }

  _closePopup() {
    if (this.state.popup) {
      this.setState({popup: false});
    }
  }

  _togglePopup(e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    this.setState({
      popup: !this.state.popup
    });
  }

  _show() {
    if (this.props.onAfterChangeShow) {
      this.props.onAfterChangeShow(this.props.data.id);
    }
  }

  _hide() {
    if (this.props.onAfterChangeHide) {
      this.props.onAfterChangeHide(this.props.data.id);
    }
  }

  changeVisible(e) {
    e.preventDefault();

    if (this.props.data.hidden) {
      this._show();
    } else {
      this._hide();
    }
  }

  onMenuSend(symbol) {
    if (this.props.onNavigateToSend) {
      this.props.onNavigateToSend(symbol);
    }
  }

  onMenuDepositWithDraw(symbol) {
    if (this.props.onNavigateToDeposit) {
      this.props.onNavigateToDeposit(symbol);
    }
  }

  render() {
    let {precision, decimals, data} = this.props; // eslint-disable-line

    let showPopup = this.state.popup;
    //TODO:: config f PIXEL.BITCOIN
    let marketLink = (data.symbol == 'PIXEL.BITCOIN') // eslint-disable-line
      ? (data.symbol + '_' + CORE_ASSET) // eslint-disable-line
      : ('PIXEL.BITCOIN_' + data.symbol);

    return (
      <tr
        key={ data.id }
        className={ classNames('tr', {'tr-hidden active': data.hidden, 'tr-main': !data.hidden}) }
      >
        <td className='td td__assetsSym'>
          <div className='td__in'>
            {asset_utils.getSymbol(data.symbol)}
          </div>
        </td>
        <td className='td td__assetsName'>
          <div className='td__in'>
            {data.name}
          </div>
        </td>
        <td className='td'>
          <div className='td__in'>
            <FormattedNumber
              value={ data.available / data.precision }
              minimumFractionDigits={ 0 }
              maximumFractionDigits={ data.decimals }/>
          </div>
        </td>
        {/*<td className="td">*/}
        {/*<div className="td__in">*/}
        {/*{data.orders === 0 ? 'N/A' :*/
        }
        {/*<FormattedNumber*/
        }
        {/*value={data.orders / data.precision}*/
        }
        {/*minimumFractionDigits={0}*/
        }
        {/*maximumFractionDigits={data.decimals}*/
        }
        {/*/>*/
        }
        {/*}*/}
        {/*</div>*/}
        {/*</td>*/}
        <td className='td'>
          <div className='td__in'>
            <FormattedNumber
              value={ data.totalBalance / data.precision }
              minimumFractionDigits={ 0 }
              maximumFractionDigits={ data.decimals }
            />
          </div>
        </td>
        {/*<td className="td">*/}
        {/*<div className="td__in">*/}
        {/*{(!data.totalValue || isNaN(data.totalValue / precision)) ? 'N/A' :*/
        }
        {/*<FormattedNumber*/
        }
        {/*value={data.totalValue / precision}*/
        }
        {/*minimumFractionDigits={0}*/
        }
        {/*maximumFractionDigits={this.props.currentDecimals}*/
        }
        {/*/>*/
        }
        {/*}*/}
        {/*</div>*/}
        {/*</td>*/}
        <td className='td td__action'>
          <div className='td__in'>
            <div className={ classNames('tableAction__dd', 'dd', {'open': showPopup}) }>
              <a className='tableAction tableAction__trigger ddTrigger' onClick={ this._togglePopup.bind(this) }> {/* eslint-disable-line */}
                <span className='tableAction__text ddTrigger__text'>
                  <Translate content='dashboard.actions'/>
                </span>
                <span className='tableAction__icon icon-str_close'/>
                <span className='tableAction__icon icon-str_open'/>
              </a>
              <div className='tableAction__ddMenu ddMenu'>
                <ul className='ddMenu__list'>
                  {/*<li className="ddMenu__item" onClick={this.onMenuDepositWithDraw.bind(this, data.symbol)}>*/} {/* eslint-disable-line */}
                  {/*<Link to="" className="ddMenu__link active">*/}
                  {/*<span className="ddMenu__icon icon-arrows3"/>*/}
                  {/*<Translate content="dashboard.balances_row_menu.deposit_withdraw" />*/}
                  {/*</Link>*/}
                  {/*</li>*/}
                  <li className='ddMenu__item'>
                    <Link
                      className='ddMenu__link active'
                      onClick={ this.onMenuSend.bind(this, data.symbol) }
                    >
                      <span className='ddMenu__icon icon-arrow2'/>
                      <Translate content='dashboard.balances_row_menu.send'/>
                    </Link>
                  </li>
                  {/*<li className="ddMenu__item">
                    <Link to={"/exchange/" + marketLink} className="ddMenu__link active">
                      <span className="ddMenu__icon chart icon-chart2"/>
                      <Translate content="dashboard.balances_row_menu.markets" />
                    </Link>
                  </li>*/}

                  {(this.props.showHideOption
                    ? <li className='ddMenu__item'>
                      <a href='' className='ddMenu__link active' onClick={ this.changeVisible }> {/* eslint-disable-line */}
                        <span className='ddMenu__icon close icon-close2'/>
                        <span className=''>
                          {data.hidden
                            ? <Translate content='dashboard.balances_row_menu.show_asset'/>
                            : <Translate content='dashboard.balances_row_menu.hide_asset'/>}
                        </span>
                      </a>
                    </li>
                    : null)}

                  <div className='tableAction__ddMenu ddMenu'>
                    <ul className='ddMenu__list'></ul>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  }
}

export default BalanceRow;
