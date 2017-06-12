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

import React, {Component} from "react"
import ReactDOM from "react-dom";
import Modal from "react-foundation-apps/src/modal"
import ZfApi from "react-foundation-apps/src/utils/foundation-api"
import WalletUnlockActions from "actions/WalletUnlockActions"
import WalletDb from "stores/WalletDb"
import Translate from "react-translate-component";
import PrivateKeyStore from "stores/PrivateKeyStore";


export default class PrivateKeyView extends Component {
    
    static propTypes = {
        pubkey: React.PropTypes.string.isRequired
    }
    
    constructor() {
        super()
        this.state = this._getInitialState()
    }
    
    _getInitialState() {
        return { wif: null }
    }
    
    reset() {
        this.setState(this._getInitialState())
    }
    
    componentDidMount() {
        var modalId = "key_view_modal" + this.props.pubkey
        let modal = ReactDOM.findDOMNode(this.refs[modalId])
        ZfApi.subscribe(modalId, (name, msg) => {
            if(name !== modalId) return
            if(msg === "close") this.reset()
        })
    }
    
    render() {
        var modalId = "key_view_modal" + this.props.pubkey
        var keys = PrivateKeyStore.getState().keys

        var has_private = keys.has(this.props.pubkey)
        if( ! has_private) return <span>{this.props.children}</span>
        var key = keys.get(this.props.pubkey)
        return <span>
            <a onClick={this.onOpen.bind(this)}>{this.props.children}</a>
            <Modal ref={modalId} id={modalId} overlay={true} overlayClose={false}>
                <a onClick={this.onClose.bind(this)} className="close-button">&times;</a>
                <h3><Translate content="account.perm.key_viewer" /></h3>
                <div className="grid-block vertical">
                    <div className="content-block">
                    
                        <div className="grid-content">
                            <label><Translate content="account.perm.public" /></label>
                            {this.props.pubkey}
                        </div>
                        <br/>
                        
                        <div className="grid-block grid-content">
                            <label><Translate content="account.perm.private" /></label>
                            <div>
                                {this.state.wif ? <span>
                                    {this.state.wif}
                                    &nbsp;(<a onClick={this.onHide.bind(this)}>hide</a>)
                                </span>:<span>
                                    (<a onClick={this.onShow.bind(this)}><Translate content="account.perm.show" /></a>)
                                </span>}
                            </div>
                        </div>
                        <br/>

                        <div className="grid-block grid-content">
                            <label><Translate content="account.perm.brain" /></label>
                            {key.brainkey_sequence == null ? "Non-deterministic" : key.brainkey_sequence}
                        </div>
                        <br/>

                        {key.import_account_names && key.import_account_names.length ?
                        <div className="grid-block grid-content">
                            <label><Translate content="account.perm.from" /></label>
                            {key.import_account_names.join(", ")}
                            <br/>
                        </div>
                        :null}

                    </div>
                </div>
                <div className="button-group">
                    <div onClick={this.onClose.bind(this)} className=" button"><Translate content="transfer.close" /></div>
                </div>
            </Modal>
        </span>
    }
    
    onOpen() {
        var modalId = "key_view_modal" + this.props.pubkey
        ZfApi.publish(modalId, "open")
    }
    
    onClose() {
        this.reset()
        var modalId = "key_view_modal" + this.props.pubkey
        ZfApi.publish(modalId, "close")
    }
    
    onShow() {
        WalletUnlockActions.unlock().then( () => {
            var private_key = WalletDb.getPrivateKey(this.props.pubkey)
            this.setState({ wif: private_key.toWif() })
        })
    }
    
    onHide() {
        this.setState({ wif: null })
    }
    
}