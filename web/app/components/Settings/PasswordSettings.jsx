/*
 *  Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 *  The MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

import React from "react";
import Translate from "react-translate-component";
import { connect } from 'react-redux';
import counterpart from "counterpart";
import { PrivateKey, Aes} from "peerplaysjs-lib";

import ChangePasswordActions from 'actions/ChangePasswordActions';
import {setTransaction} from 'actions/RTransactionConfirmActions';
import AssetRepository from 'repositories/AssetRepository';

@connect(state => {
    return {
        accountName: state.account.currentAccount,
        password_pubkey: state.walletData.wallet.password_pubkey
    }
}, {
    generateWallet: ChangePasswordActions.generateWallet,
    setTransaction
})
export default class PasswordSettings extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
          invalidPassword: null,
          invalidNewPassword: null,
          invalidConfirmNewPassword: null
      };
  }

  onChangeInputCurrentPassword(e) {
      let currentPassword = e.target.value;

      if(!currentPassword) {
        this.setState({ currentPassword, invalidPassword: null });
        return;
      }

      if(currentPassword.length < 22) {
          this.setState({
              currentPassword,
              invalidPassword: counterpart.translate("errors.password_must_be_X_characters_or_more", {cnt: 22})
          });
          return;
      }
      this.setState({ currentPassword, invalidPassword: null });
  }

  onChangeInputNewPassword(e) {
      let newPassword = e.target.value;

      if(!newPassword) {
        this.setState({ newPassword, invalidNewPassword: null });
        return;
      }

      if(newPassword.length < 22) {
          this.setState({
              newPassword,
              invalidNewPassword: counterpart.translate("errors.password_must_be_X_characters_or_more", {cnt: 22})
          });
          return;
      }

      this.setState({ newPassword, invalidNewPassword: null });
  }

  onChangeInputConfirmNewPassword(e) {
      let confirmNewPassword = e.target.value;

      if(!confirmNewPassword) {
        this.setState({ confirmNewPassword, invalidConfirmNewPassword: null });
        return;
      }

      if(confirmNewPassword.length < 22) {
          this.setState({
              confirmNewPassword,
              invalidConfirmNewPassword: counterpart.translate("errors.password_must_be_X_characters_or_more", {cnt: 22})
          });
          return;
      }

      this.setState({ confirmNewPassword, invalidConfirmNewPassword: null });
  }

  onAccept() {
      let password = this.state.currentPassword;
      const password_private = PrivateKey.fromSeed( password );
      const password_pubkey = password_private.toPublicKey().toPublicKeyString();

      if(this.props.password_pubkey !== password_pubkey){
          this.setState({invalidPassword: counterpart.translate("errors.incorrect_password")});
          return;
      }

      if(this.state.newPassword != this.state.confirmNewPassword) {
          this.setState({invalidConfirmNewPassword: counterpart.translate("errors.password_retype_match")});
          return;
      }

      this.props.generateWallet(this.state.newPassword, this.state.currentPassword).then( res => {
          res.transactionObject.set_required_fees('1.3.0').then(() => {

              AssetRepository.fetchAssetsByIds([res.transactionObject.operations[0][1].fee.asset_id]).then(assets => {
                  this.props.setTransaction('account_update', {
                      account: this.props.accountName,
                      transactionObject: res.transactionObject,
                      memo_key: res.wallet.brainkey_pubkey,
                      transactionFunction: ChangePasswordActions.changePassword,
                      functionArguments: res,
                      proposedOperation: `Update account for ${this.props.accountName}`,
                      fee: {
                          amount: res.transactionObject.operations[0][1].fee.amount,
                          asset: assets[0]
                      },
                      transactionFunctionCallback: () => {

                          this.setState({
                              currentPassword: '',
                              newPassword: '',
                              confirmNewPassword: '',
                              invalidPassword: null,
                              invalidNewPassword: null,
                              invalidConfirmNewPassword: null
                          });

                      }
                  })
              })
          });
      })
  }

  onCancel() {
      this.setState({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
          invalidPassword: null,
          invalidNewPassword: null,
          invalidConfirmNewPassword: null
      });
  }

  render() {

      let {currentPassword, newPassword, confirmNewPassword, invalidPassword, invalidNewPassword, invalidConfirmNewPassword} = this.state

      let disabledCancel = (!currentPassword && !newPassword && !confirmNewPassword);
      let disabledAccept = (!currentPassword || !newPassword || !confirmNewPassword) || !!(invalidPassword || invalidNewPassword || invalidConfirmNewPassword);

      return (
          <div id="password" className="tab__deploy" style={{display: 'block'}}>
              <div className="tab__deployHead">
                  <div className="title"><Translate content="settings.password_text" /></div>
              </div>
              <div className="box-inner box-inner-2">
                  <form className="clearfix">
                      <div className="col-6 col-offset-05">
                          <div className="row2">
                              <label className="label"><Translate content="settings.current_password" /></label>
                              <input type="password" autoComplete="off" value={currentPassword} className={`field field-type3 ${invalidPassword ? 'error' : null}`} onChange={this.onChangeInputCurrentPassword.bind(this)}/>
                              {invalidPassword ? <span className="error__hint">{invalidPassword}</span> : null}
                        </div>
                          <div className="row2">
                              <label className="label"><Translate content="settings.new_password" /></label>
                              <input type="password" autoComplete="off" value={newPassword} className={`field field-type3 ${invalidNewPassword ? 'error' : null}`} onChange={this.onChangeInputNewPassword.bind(this)}/>
                              {invalidNewPassword ? <span className="error__hint">{invalidNewPassword}</span> : null}
                          </div>
                          <div className="row2">
                              <label className="label"><Translate content="settings.new_confirm" /></label>
                              <input type="password" autoComplete="off" value={confirmNewPassword} className={`field field-type3 ${invalidConfirmNewPassword ? 'error' : null}`} onChange={this.onChangeInputConfirmNewPassword.bind(this)}/>
                              {invalidConfirmNewPassword ? <span className="error__hint">{invalidConfirmNewPassword}</span> : null}
                        </div>
                          <div className="row2 rowOptions">
                              <button type="button" className="btn btn-neutral" onClick={this.onCancel.bind(this)} disabled={disabledCancel}><Translate content="settings.cancel" /></button>
                              <button type="button" className="btn btn-success" onClick={this.onAccept.bind(this)} disabled={disabledAccept}><Translate content="settings.accept" /></button>
                          </div>
                      </div>
                  </form>
              </div>
          </div>
      );
  }
};
