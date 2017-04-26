import React, { PureComponent } from 'react';
import { Row, Col, Input } from 'antd'
import QRCode from 'qrcode.react';
import { I18n, Translate } from 'react-redux-i18n';
import { NavigateActions, AccountActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import copy from 'copy-to-clipboard'

class Deposit extends PureComponent {
  constructor(props) {
    super(props);
    this.onClickContinue = this.onClickContinue.bind(this);
  }
  componentDidMount() {
    //Get the deposit address
    this.props.getDepositAddress();
  }
  //Navigate to the 'Welcome' screen on 'Continue' button click
  onClickContinue(e) {
    e.preventDefault();
    this.props.navigateTo('/welcome');
  }
  //Copy the Deposit Address to clipboard
  onClickCopy(depAddr, e) {
    e.preventDefault();
    copy(depAddr);
  }
  render() {
    return (
      <div className='sportsBannerBg' id='main-content'>
        <div className='depositComponent'>
          <div className='wrapper'>
            <div className='text-center'>
              <i className='deposit-icon'></i>
              <h2>
                { I18n.t('deposit.title') }
              </h2>
              <div className='center-section deposit-content'>
                <Row type='flex' gutter={ 100 } className='row-divided'>
                  <Col span={ 12 }>
                    <p>
                      { <Translate value='deposit.left_description' dangerousHTML /> }
                    </p>
                    <div className='depositAddress pos-relative'>
                      <Input readOnly className='bookie-input' value={ this.props.depositAddress }/>
                      <button className='btn btn-regular copy-btn' onClick={ this.onClickCopy.bind(this, this.props.depositAddress) }>
                        { I18n.t('deposit.copy') }
                      </button>
                    </div>
                  </Col>
                  <div className='vertical-divider'>{ I18n.t('deposit.or') }</div>
                  <Col span={ 12 }>
                    <p>{ <Translate value='deposit.right_description' dangerousHTML /> }
                    </p>
                    <div className='text-center'>
                      <div className='bookie-qr'><QRCode className='bookie-qr' size='165' value={ JSON.stringify(this.props.depositAddress) }/>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className='text-center margin-top-100'>
                  <button onClick={ this.onClickContinue } className='btn btn-regular'>
                    { I18n.t('deposit.continue') }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  const account = state.get('account');
  return {
    //Not using the 'loadingStatus' prop for now. Will use it later when the 'loader' is available
    loadingStatus: account.get('getDepositAddressLoadingStatus'),
    depositAddress: account.get('depositAddress')
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getDepositAddress: AccountActions.getDepositAddress,
    navigateTo: NavigateActions.navigateTo
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Deposit)
