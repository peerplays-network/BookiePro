import React from 'react';
import {connect} from 'react-redux';
import Translate from 'react-translate-component';
// import UnitSelect from './UnitSelect';
import {FormattedNumber} from 'react-intl';
import AccountImage from '../../Account/AccountImage';
import DashboardPageActions from 'actions/DashboardPageActions';
import NavigateActions from 'actions/NavigateActions';
import asset_utils from 'common/asset_utils';
import AppActions from 'actions/AppActions';

import SideVesting from './SideVesting';
// import SideMember from './SideMember';
//TODO:: Derived Data
@connect((state) => {
  return {
    //side: state.dashboardPage.side
    account: state.app.account,
    // precision: state.dashboardPage.precision, decimals:
    // state.dashboardPage.decimals, assetSymbol: state.dashboardPage.assetSymbol,
    // coreSymbol: state.dashboardPage.coreSymbol, coreTokenTotal:
    // state.dashboardPage.coreTokenTotal, fiatTotal: state.dashboardPage.fiatTotal,
    // cryptoTokensTotal: state.dashboardPage.cryptoTokensTotal, smartCoinTotal:
    // state.dashboardPage.smartCoinTotal, otherAssetsTotal:
    // state.dashboardPage.otherAssetsTotal,
    availableBalances: state.dashboardPage.availableBalances
  };
}, {
  fetchCurrentBalance: DashboardPageActions.fetchCurrentBalance,
  navigateToDepositWithDraw: NavigateActions.navigateToDepositWithDraw,
  logout: AppActions.logout
})
class Side extends React.Component {

  componentWillMount() {
    //TODO::
    this.props.fetchCurrentBalance();
  }
  //
  // onHandleChangeUnit() {
  //
  //     setTimeout(() => {         this.props.updateData();     }, 0);
  //
  // } navigateToAdvancedOptions() {
  //
  //     this.props.navigateToDashboardAdvancedOptions();
  //
  // }
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logout();
  }

  navigateToDepositWithDraw() {
    this.props.navigateToDepositWithDraw();
  }

  render() {
    let {
      /*precision,
      assetSymbol,
      coreSymbol,
      coreTokenTotal,
      cryptoTokensTotal,
      otherAssetsTotal,
      decimals,*/
      availableBalances,
      // hideDepositWithdrawButton
    } = this.props;
    // let decimals = Math.max(0, precision) - coreSymbol.indexOf("BTC") === -1 ?
    // precision : 4; console.log(decimals) let currentBalance = coreTokenTotal +
    // cryptoTokensTotal;
    //
    // assetSymbol = asset_utils.getSymbol(assetSymbol); coreSymbol =
    // asset_utils.getSymbol(coreSymbol);

    let availableKeys = Object.keys(availableBalances);

    return (
      <aside className='aside'>
        <div className='nav__user dd dd-hover'>
          <div className='nav__userDDTrigger ddTrigger'>
            <div className='nav__userPic'>
              <AccountImage
                size={ {
                  height: 40,
                  width: 40
                } }
                className='aside__headPic'
                account={
                  this.props.account
                    ? this.props.account
                    : null
                }
                custom_image={ null }
              />
            </div>
            <div className='nav__userInfo'>
              <div className='nav__userName'>
                {this.props.account}
              </div>
            </div>
          </div>
          <div className='nav__userDDMenu ddMenu'>
            <a
              href='#/logout'
              className='logout'
              onClick={ this.onLogoutClick.bind(this) }
            >
              <Translate component='span' className='' content='dashboard.side.logout'/>
            </a>
          </div>
        </div>
        <div className='aside__item bb'>
          <Translate
            component='div'
            className='aside__title'
            content='dashboard.side.available_balances'
          />
          {availableKeys.map((availableKey) => {
            let balance = availableBalances[availableKey];

            if (!balance) {
              return null;
            }

            let currentBalance = balance.coreTokenTotal + balance.cryptoTokensTotal;
            let precision = balance.precision;
            let decimals = balance.decimals;

            return (
              <div key={ balance.assetSymbol } className='aside__row'>
                <div className='aside__unit'>
                  {asset_utils.getSymbol(balance.assetSymbol)}
                </div>
                <div className='aside__num'>
                  <FormattedNumber
                    value={
                      (currentBalance && !isNaN(currentBalance / precision))
                        ? (currentBalance / precision)
                        : 0
                    }
                    minimumFractionDigits={ 0 }
                    maximumFractionDigits={ decimals }
                  />
                </div>
              </div>
            );
          })}

          {/*{(hideDepositWithdrawButton === true) ?*/
          }
          {/*''*/
          }
          {/*:*/
          }
          {/*<div className="aside__btnWrap">*/
          }
          {/*<button
            className="btn aside__btn"
            type="button"
            onClick={this.navigateToDepositWithDraw.bind(this)}
          >*/
          }
          {/*<span className="aside__btnIcon icon-arrows3"></span>*/
          }
          {/*<Translate component="span" className="" content="dashboard.side.deposit_withdraw" />*/
          }
          {/*</button>*/
          }
          {/*</div>*/
          }
          {/*}*/}
        </div>
        <SideVesting/> {/*<SideMember />*/}
        {/*
        <div className="aside__balance bb">
            <div className="aside__balanceLabel">Current Balance:</div>
            <div className="aside__balanceSum">
                <div className="aside__balanceVal">
                    <FormattedNumber
                        value={
                          (currentBalance &&
                          !isNaN(currentBalance / precision))
                            ?(currentBalance / precision)
                            : 0
                          }
                        minimumFractionDigits={0}
                        maximumFractionDigits={decimals}
                    />
                    <span className="aside__balanceValUnit">{assetSymbol}</span></div>
                <UnitSelect onHandleChange={this.onHandleChangeUnit.bind(this)}/>
            </div>
        </div> */}
        {/*
        <div className="aside__balance bb">
            <dl className="aside__curList">
                <dt className="aside__curName aside__curName-main">
                    <img src="images/bitsahres/p.png" alt="" className="aside__curPic" />
                    Core Tokens ({coreSymbol})
                </dt>

                <dd className="aside__curVal aside__curVal-main aside__curVal-pic">
                    <FormattedNumber
                        value={coreTokenTotal / precision}
                        minimumFractionDigits={0}
                        maximumFractionDigits={decimals}
                    /> <span>{assetSymbol}</span>
                </dd>

                <dt className="aside__curName">CryptoCurrencies</dt>
                <dd className="aside__curVal">
                    <FormattedNumber
                        value={cryptoTokensTotal / precision}
                        minimumFractionDigits={0}
                        maximumFractionDigits={decimals}
                    /> <span>{assetSymbol}</span>
                </dd>

              <dt className="aside__curName">Others Assets</dt>
                <dd className="aside__curVal">
                    <FormattedNumber
                        value={otherAssetsTotal / precision}
                        minimumFractionDigits={0}
                        maximumFractionDigits={decimals}
                    /> <span>{assetSymbol}</span>
                </dd>
            </dl>
        </div>*/
        }
      </aside>
    );
  }
}

export default Side;
