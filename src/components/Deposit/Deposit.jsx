/**
 * This component is used for fetching deposit information of the user in order to make a deposit
 * The user can make a deposit by
 *    Scanning the QR code version of the deposit address
 *    Entering the deposit address and copying it to the clipboard
 * It uses the
 *   'qrcode.react' library to generate the QR code from the deposit address
 *   'copy-to-clipboard' module to copy text to clipboard
 * It is mapped to the path '/deposit' and appears after a user has successfully signed up
 * It uses the {@ FloatingHelp} component to display help information on clicking on '?' button
 * All constants used in this component are obtained from 'AppBackgroundTypes'
 * Following are the actions dispatched for various purposes in this component:
 *    {@link BalanceActions#getDepositAddress}
 *    {@link NavigateActions#navigateTo}
 *    {@link AppActions#setAppBackgroundAction}
 * Effects of the above actions on the Redux stores are explained furthur
 */
import React, {PureComponent} from 'react';
import {Row, Col, Input} from 'antd';
import QRCode from 'qrcode.react';
import {I18n, Translate} from 'react-redux-i18n';
import {NavigateActions, BalanceActions, AppActions} from '../../actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import copy from 'copy-to-clipboard';
import {AppBackgroundTypes} from '../../constants';
import FloatingHelp from '../FloatingHelp';

class Deposit extends PureComponent {
  constructor(props) {
    super(props);
    this.onClickContinue = this.onClickContinue.bind(this);
  }
  /**
   * When the component mounts,
   * - the deposit address of the user is fetched
   * - the application background is set to sports bg
   *
   * Dispatched actions:
   *   {@link BalanceActions#getDepositAddress}
   *     the state 'depositAddress','getDepositAddressLoadingStatus' is updated under 
   *  the 'balance' store
   *   {@link AppActions#setAppBackgroundAction}
   *     the state 'appBackgroundType' is updated under the 'app' store
   */
  componentDidMount() {
    this.props.getDepositAddress();
    this.props.setAppBackground(AppBackgroundTypes.FIELD_BG);
  }
  /**
   * When the component unmounts,
   * the application background is reset to gradient
   *
   * Dispatched action: {@link AppActions#setAppBackgroundAction}
   *   the state 'appBackgroundType' is updated under the 'app' store
   */
  componentWillUnmount() {
    this.props.setAppBackground(AppBackgroundTypes.GRADIENT_BG);
  }
  /**
   * Navigate to the 'Welcome' screen on 'Continue' button click - {@link Welcome}
   *
   * @param {object} e - the 'Continue' button click event
   */
  onClickContinue(e) {
    e.preventDefault();
    this.props.navigateTo('/welcome');
  }
  /**
   * Copy the Deposit Address to clipboard
   *
   * @param {string} depAddr - The deposit address that is to be copied to clipboard
   * @param {object} e - the 'Copy' button click event
   */
  onClickCopy(depAddr, e) {
    e.preventDefault();
    copy(depAddr);
  }
  render() {
    return (
      <div className='onboardingSportsBackground depositComponent' id='main-content'>
        <div className='wrapper'>
          <div className='text-center'>
            <i className='deposit-icon' />
            <h2>{I18n.t('deposit.title')}</h2>
            <div className='center-section deposit-content'>
              <Row type='flex' gutter={ 100 } className='row-divided'>
                <Col span={ 12 }>
                  <p>{<Translate value='deposit.left_description' dangerousHTML />}</p>
                  <div className='depositAddress pos-rel'>
                    <Input readOnly className='bookie-input' value={ this.props.depositAddress } />
                    <button
                      className='btn btn-regular inputWithButton'
                      onClick={ this.onClickCopy.bind(this, this.props.depositAddress) }
                    >
                      {I18n.t('deposit.copy')}
                    </button>
                  </div>
                </Col>
                <div className='vertical-divider'>{I18n.t('deposit.or')}</div>
                <Col span={ 12 }>
                  <p>{<Translate value='deposit.right_description' dangerousHTML />}</p>
                  <div className='text-center'>
                    <div className='bookie-qr'>
                      <QRCode
                        className='bookie-qr'
                        size={ 165 }
                        value={ JSON.stringify(this.props.depositAddress) }
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <div className='text-center margin-top-100'>
                <button onClick={ this.onClickContinue } className='btn btn-regular'>
                  {I18n.t('deposit.continue')}
                </button>
              </div>
            </div>
          </div>
        </div>
        <FloatingHelp />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  //Not using the 'loadingStatus' prop for now. Will use it later when the 'loader' is available
  loadingStatus: state.getIn(['balance', 'getDepositAddressLoadingStatus']),
  depositAddress: state.getIn(['balance', 'depositAddress'])
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    getDepositAddress: BalanceActions.getDepositAddress,
    navigateTo: NavigateActions.navigateTo,
    setAppBackground: AppActions.setAppBackgroundAction
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Deposit);
