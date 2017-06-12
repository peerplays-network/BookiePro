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

import React from 'react'
import Translate from "react-translate-component";
import counterpart from 'counterpart';
import { connect } from 'react-redux';
import { Modal, ModalBody } from 'react-modal-bootstrap';
import {PrivateKey, key, Aes} from "peerplaysjs-lib";

import {setWalletPosition, setWalletStatus} from 'actions/RWalletUnlockActions';
import RWalletUnlockNewActions from 'actions/RWalletUnlockNewActions';
import CryptoService from 'services/CryptoService';
import { setAesPrivate } from 'actions/RWalletDataActions';

@connect(state => {
    return {
        newWallet: state.wallet.newWallet,
        currentWallet: state.wallet.currentWallet,
        walletNames: state.wallet.walletNames,
        locked : state.wallet.locked,
        isOpen: state.wallet.isOpen,
        wallet: state.walletData.wallet,
        success: state.wallet.success,
        cancel: state.wallet.cancel
    }
}, {
    setWalletPosition,
    setWalletStatus,
    setAesPrivate,
    resetWalletPasswordWindow: RWalletUnlockNewActions.resetWalletPasswordWindow
})
class WalletUnlockModal extends React.Component {

    constructor(props) {
        super()
        this.state = {
            password_error: null,
            password_input: '',
            isOpen: props.isOpen
        }
    }

    onPasswordChange(e) {
        let password_input = e.target.value;

        this.setState({ password_input, password_error: null });
    }

    onKeyDown(e) {
        if (e.keyCode === 13) this.onUnlock();
    }

    onClose(){
        this.props.setWalletPosition(false);

        this.resetPasswordField();

        if (this.props.cancel) {
            this.props.cancel();
        }
        this.props.resetWalletPasswordWindow();
    }

    resetPasswordField() {
        this.setState({
            password_input: '',
            password_error: null
        });
    }
    onUnlock() {
        let password = this.state.password_input;

        const password_private = PrivateKey.fromSeed( password );

        const password_pubkey = password_private.toPublicKey().toPublicKeyString();

        if(this.props.wallet.password_pubkey !== password_pubkey){
            this.setState({password_error: true});
            return;
        }

        const aes_private = CryptoService.getAesPrivate(password, this.props.wallet.encryption_key);

        this.props.setWalletPosition(false);
        this.props.setWalletStatus(false);
        this.props.setAesPrivate(aes_private);

        if (this.props.success) {
            this.props.success(aes_private)
        }

        this.props.resetWalletPasswordWindow();

        this.resetPasswordField();

    }

    render() {

        let {password_input, password_error} = this.state;

        return (
            <Modal isOpen={this.props.isOpen} autoFocus={true}>
                <ModalBody>
                    <div className="modal-dialog">
                        <div className="modal-dialogAlignOut">
                            <div className="modal-dialogAlignIn">
                                <div className="modal-dialogContent">
                                    <div className="modalTitle"><Translate content="modal.unlock.title" /></div>
                                    <div className="row">
                                        <div className="col-12">
                                            <label className="label"><Translate content="modal.unlock.password" /></label>
                                            <input type="password" className={`field field-type2 ${password_error ? 'error' : null}`} placeholder={counterpart.translate('modal.unlock.password_placeholder')}
                                              onChange={this.onPasswordChange.bind(this)} onKeyDown={this.onKeyDown.bind(this)} value={password_input}  autoFocus={true}/>
                                            {password_error ? <span className="error__hint">{counterpart.translate('errors.incorrect_password')}</span> : null}
                                        </div>
                                    </div>
                                    <div className="modalFooter text_r">
                                        <button type="button" className="btn btn-neutral" onClick={this.onClose.bind(this)}><Translate content="cancel" /></button>
                                        <button type="button" className="btn btn-success" onClick={this.onUnlock.bind(this)}><Translate content="modal.unlock.unlock_btn" /></button>
                                    </div>
                                </div>
                           </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        )
    }
}

export default WalletUnlockModal
