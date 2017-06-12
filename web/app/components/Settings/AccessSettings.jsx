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
import {connect} from 'react-redux';
import Select from 'react-select';
import Translate from "react-translate-component";

import {changeFaucetAddress} from 'actions/RSettingsActions';
import {addConnection, removeConnection} from 'actions/PageSettingsActions';
import AppSettingsActions from 'actions/AppSettingsActions';

const mapStateToProps = (state) => {
    return {
        currentConnection: state.settings.connection,
        connections: state.pageSettings.connection,
        defaultConnection: state.pageSettings.defaults.connection,

        faucetAddress: state.settings.faucetAddress,
        defaultFaucetAddress: state.pageSettings.defaults.faucetAddress,
    };
};
@connect(
    mapStateToProps,
    {
        changeConnection: AppSettingsActions.changeConnection,
        changeFaucetAddress,
        addConnection,
        removeConnection
    }
)
class AccessSettings extends React.Component {
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

    onChangeFaucetAddress() {
        this.props.changeFaucetAddress(this.state.newFaucetAddress);
        this.setState({
            disableFaucetAddress: true,
        });

    }

    onResetFaucetAddress(e) {
        this.props.changeFaucetAddress(this.props.defaultFaucetAddress);
        this.setState({
            newFaucetAddress: this.props.defaultFaucetAddress,
            disableFaucetAddress: true,
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

    onSelectRemoveApi(e) {
        this.setState({
            removeApi: e.value,
            disableRemoveApi: false,
        });
    }

    onRemoveApi() {
        let {connections, defaultConnection} = this.props;
        let currentConnection = this.state.currentConnection;
        let removeConnection = this.state.removeApi;
        if (removeConnection === currentConnection) {
            if (connections.includes(defaultConnection) && defaultConnection != removeConnection) {
                currentConnection = defaultConnection;
            } else {
                connections = connections.filter(e => e != removeConnection);
                currentConnection = connections[0];
            }
            this.props.changeConnection(currentConnection);
        }
        this.props.removeConnection(this.state.removeApi);
        this.setState({
            removeApi: '',
            disableRemoveApi: true,
            currentConnection: currentConnection,
        });
    }

    changeFaucetAddress(e) {
        let status = e.target.value === this.props.faucetAddress ? true : false;
        this.setState({
            newFaucetAddress: e.target.value,
            disableFaucetAddress: status,
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

    render() {
        let options = this.props.connections.map(opt => {
            return {value: opt, label: opt};
        });
        let {disableConnection, disableFaucetAddress, disableAddNew, disableRemoveApi, newConnection, currentConnection, newFaucetAddress, removeApi} = this.state;

        return (
            <div id="access" className="tab__deploy" style={{display: 'block'}}>
                <div className="tab__deployHead">
                    <div className="title"><Translate content="settings.access"/></div>
                    <div className="desc"><Translate content="settings.access_text"/></div>
                </div>
                <div className="box-inner box-inner-2">

                    <form className="clearfix">
                        <div className="clearfix">
                            <div className="col col-5 col-offset-05">
                                <div className="row2">
                                    <label className="label"><Translate content="settings.connection"/></label>
                                    <Select
                                        value={currentConnection}
                                        options={options}
                                        onChange={this.onConnectionSelect.bind(this)}
                                    />
                                </div>
                                <div className="row2 rowOptions text_r">
                                    <button className="btn btn-neutral" type="button" disabled={disableConnection}
                                            onClick={this.onResetConnection.bind(this)}>
                                        <Translate content="settings.reset"/>
                                    </button>
                                    <button className="btn btn-success" type="button" disabled={disableConnection}
                                            onClick={this.onChangeConnection.bind(this)}>
                                        <Translate content="settings.confirm"/>
                                    </button>
                                </div>
                            </div>
                            <div className="col col-5 col-offset-05">
                                <div className="row2">
                                    <label className="label"><Translate content="settings.add_ws"/></label>
                                    <input ref="newConnection" type="text" className="field field-type3"
                                           value={newConnection} onChange={this.changeNewConnection.bind(this)}/>
                                </div>
                                <div className="row2 rowOptions text_r">
                                    <button type="button" className="btn btn-neutral" disabled={disableAddNew}
                                            onClick={this.onCancelConnection.bind(this)}>
                                        <Translate content="settings.cancel"/>
                                    </button>
                                    <button type="button" className="btn btn-success" disabled={disableAddNew}
                                            onClick={this.onAddConnection.bind(this)}>
                                        <Translate content="settings.add_api"/>
                                    </button>
                                </div>
                            </div>
                            {/*<div className="col col-5 col-offset-05">
                             <div className="row2">
                             <label className="label"><Translate content="settings.faucet_address" /></label>
                             <input type="text" className="field field-type3" value={newFaucetAddress} onChange={this.changeFaucetAddress.bind(this)}/>
                             </div>
                             <div className="row2 rowOptions text_r">
                             <button type="button" className="btn btn-neutral" disabled={disableFaucetAddress} onClick={this.onResetFaucetAddress.bind(this)}>
                             <Translate content="settings.reset" />
                             </button>
                             <button type="button" className="btn btn-success" disabled={disableFaucetAddress} onClick={this.onChangeFaucetAddress.bind(this)}>
                             <Translate content="settings.confirm" />
                             </button>
                             </div>
                             </div>
                             */}
                        </div>

                        <div className="hr"></div>
                        <div className="clearfix">
                            <div className="col col-5 col-offset-05">
                                <div className="row2">
                                    <label className="label"><Translate content="settings.remove_ws"/></label>
                                    <Select
                                        value={removeApi}
                                        options={options}
                                        onChange={this.onSelectRemoveApi.bind(this)}
                                    />
                                </div>
                                <div className="row2 rowOptions text_r">
                                    <button type="button" className="btn btn-success"
                                            onClick={this.onRemoveApi.bind(this)}
                                            disabled={(options.length <= 1 && removeApi != '') || disableRemoveApi}>
                                        <Translate content="settings.remove_api"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

}

export default AccessSettings;