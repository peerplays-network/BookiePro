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
import { connect } from 'react-redux';
import Select from 'react-select';
import AppSettingsActions from 'actions/AppSettingsActions';
import {addConnection} from 'actions/PageSettingsActions';

@connect(state => {
    return {
        currentConnection: state.settings.connection,
        connections: state.pageSettings.connection,
        defaultConnection: state.pageSettings.defaults.connection
    }
}, {
    changeConnection: AppSettingsActions.changeConnection,
    addConnection
})
class ReconnectModal extends React.Component {

    constructor(props) {

        super();
        this.state = {
            newConnection: 'wss://',
            currentConnection: props.currentConnection,
            newFaucetAddress: props.faucetAddress,
            removeApi: '',

            disableConnection: true,
            disableAddNew: true,
            disableFaucetAddress: true,
            disableRemoveApi: true,
        };

    }

    onConnectionSelect(e) {

        if (e.value != this.props.currentConnection) {
            this.setState({
                currentConnection: e.value,
                disableConnection: false,
            });
        } else {
            this.setState({
                currentConnection: e.value,
                disableConnection: true,
            });
        }

    }

    onChangeConnection(e) {

        this.props.changeConnection(this.state.currentConnection);

        this.setState({
            disableConnection: true,
        });

    }

    onResetConnection(e) {

        this.props.changeConnection(this.props.defaultConnection);

        this.setState({
            currentConnection: this.props.defaultConnection,
            disableConnection: true,
        });

    }

    onAddConnection() {

        if (!this.props.connections.includes(this.state.newConnection)) {
            this.props.addConnection(this.state.newConnection);
        }

        this.setState({
            newConnection: 'wss://',
            disableAddNew: true,
        });

    }

    onCancelConnection() {
        this.setState({
            newConnection: 'wss://',
            disableAddNew: true,
        });
    }

    changeNewConnection(e) {

        let newConnection = e.target.value.replace(/\s/, '');
        if (window.location.protocol.match(/https/)) {
            if (!newConnection.match(/^wss:\/\//)) {
                newConnection = 'wss://';
            }
        } else {
            if (!newConnection.match(/^wss:\/\//) && !newConnection.match(/^ws:\/\//)) {
                newConnection = 'wss://';
            }
        }
        let status = newConnection === 'wss://' ? true : false;
        this.setState({
            newConnection,
            disableAddNew: status,
        });

    }

    tryAgainHandler() {
        window.location.reload();
    }

    render() {

        let {currentConnection, disableConnection, disableAddNew, newConnection} = this.state;

        let options = this.props.connections.map(opt => {
            return {value: opt, label: opt};
        });

        return (
            <div className="wrapper wrapper-with-footer">
                <div className="main">
                    <div className="yHelper active"></div>
                    <section className="content">
                        <div className="box box-inPadding">
                            <div className="dialog dialog-login">
                                <h1 className="h1 pt-75">Can’t Connect to Blockchain</h1>
                                <div className="form">
                                    <form>
                                        <div className="clearfix">
                                            <div className="row6">
                                                <label className="label"><Translate content="settings.connection"/></label>

                                                <Select
                                                    className="select2"
                                                    value={currentConnection}
                                                    options={options}
                                                    onChange={this.onConnectionSelect.bind(this)}
                                                />

                                            </div>
                                            <div className="row7 rowOptions text_r">
                                                <button className="btn btn-reset" disabled={disableConnection}
                                                        onClick={this.onResetConnection.bind(this)}><Translate content="settings.reset"/></button>
                                                <button className="btn btn-sbm btn-w-100 ml-2" disabled={disableConnection}
                                                        onClick={this.onChangeConnection.bind(this)}><Translate content="settings.confirm"/></button>
                                            </div>
                                            <div className="row6">
                                                <label className="label"><Translate content="settings.add_ws"/></label>
                                                <input type="text" className="field" placeholder="wss" value={newConnection} onChange={this.changeNewConnection.bind(this)} />
                                            </div>
                                            <div className="row7 rowOptions text_r">
                                                <button className="btn btn-reset" disabled={disableAddNew}
                                                        onClick={this.onCancelConnection.bind(this)}><Translate content="settings.reset"/></button>
                                                <button className="btn btn-sbm btn-w-100 ml-2" disabled={disableAddNew}
                                                        onClick={this.onAddConnection.bind(this)}><Translate content="settings.confirm"/></button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="login__footer">
                                    <button onClick={this.tryAgainHandler} className="btn btn-sbm btn-fsz-18">
                                        <Translate className="btnText" content="cant_connect_modal.try_again"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }

}

export default ReconnectModal;