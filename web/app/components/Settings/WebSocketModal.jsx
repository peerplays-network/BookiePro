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
import { connect } from 'react-redux';
import Translate from "react-translate-component";
import Trigger from "react-foundation-apps/src/trigger"
import Modal from "react-foundation-apps/src/modal"
import ZfApi from "react-foundation-apps/src/utils/foundation-api"

import {
    addConnection,
    removeConnection
} from 'actions/PageSettingsActions';

const mapStateToProps = (state) => {
    return {
        connection : state.settings.connection,
        defaultConnection : state.pageSettings.defaults.connection
    };
};

@connect(
    mapStateToProps,
    {addConnection,removeConnection},
    null,
    { withRef: true }
)
export default class WebSocketsModal extends React.Component {

    constructor() {
        super();

        let protocol = window.location.protocol;

        this.state = {
            protocol: protocol,
            ws: protocol === "https:" ? "wss://" : "ws://",
            type: "remove"
        };
    }

    show (e) {
        let target;

        if (e.target.id.indexOf("add") !== -1) {
            target = "add";
        } else if (e.target.id.indexOf("remove") !== -1) {
            target = "remove";
        }

        this.setState({
            type: target
        });

        ZfApi.publish("ws_modal_" + target, "open")
    }

    close() {
        ZfApi.publish("ws_modal_" + this.state.type, "close")
    }


    _onInput(e) {
        if (this.state.protocol === "https:") {
            e.target.value = e.target.value.replace("ws://", "wss://")
        }
        if (e.target.value.indexOf("ws://") !== -1 || e.target.value.indexOf("wss://") !== -1) {
            this.setState({ws: e.target.value});
        }
    }

    _onAddSubmit(e) {
        e.preventDefault();
        this.props.addConnection(this.state.ws);
        this.close();
    }

    _onRemoveSubmit(e) {
        e.preventDefault();
        this.props.removeConnection(this.refs.select.value);
        this.close();
    }

    _renderAddModal() {
        return (
            <Modal id="ws_modal_add" ref="ws_modal_add" overlay={true} overlayClose={false}>
                <Trigger close="">
                    <div className="close-button">&times;</div>
                </Trigger>
                <div className="grid-content">
                    <Translate component="h3" content="settings.add_ws" />
                    <form onSubmit={this._onAddSubmit.bind(this)} noValidate>
                        <section className="block-list">
                            <ul>
                                <li className="with-dropdown">
                                    <input type="text" onChange={this._onInput.bind(this)} value={this.state.ws} />
                                </li>
                            </ul>
                        </section>
                        <div className="button-group">
                            <button type="submit" className={"button"} onClick={this._onAddSubmit.bind(this)}>
                                <Translate content="transfer.confirm" />
                            </button>
                            <Trigger close={"ws_modal_add"}>
                                <div  className=" button"><Translate content="account.perm.cancel" /></div>
                            </Trigger>
                        </div>
                    </form>
                </div>
            </Modal>
        )
    }



    _renderRemoveModal() {
        if (!this.props.connection) {
            return null;
        }
        let options = this.props.defaultConnection.map((entry, index) => {
            if (entry !=  this.props.connection) {
                return <option value={entry} key={entry}>{entry}</option>;
            }
        }).filter(a => {
            return !!a;
        });

        return (
            <Modal id="ws_modal_remove" ref="ws_modal_remove" overlay={true} overlayClose={false}>
                <Trigger close="">
                    <a href="#" className="close-button">&times;</a>
                </Trigger>
                <div className="grid-content no-overflow">
                    <Translate component="h3" content="settings.remove_ws" />
                    <section className="block-list">
                        <header><Translate component="span" content={"settings.connection"} /></header>
                        <ul>
                            <li className="with-dropdown">
                                <select ref="select">
                                    {options}
                                </select>
                            </li>
                        </ul>
                    </section>
                    <form onSubmit={this._onRemoveSubmit.bind(this)} noValidate>

                        <div className="button-group">
                            <button type="submit" className={"button"} onClick={this._onRemoveSubmit.bind(this)}>
                                <Translate content="transfer.confirm" />
                            </button>
                            <Trigger close={"ws_modal_remove"}>
                                <div className="button"><Translate content="account.perm.cancel" /></div>
                            </Trigger>
                        </div>
                    </form>
                </div>
            </Modal>
        )
    }

    render() {
        return (
            <div>
                {this._renderAddModal()}
                {this._renderRemoveModal()}
            </div>
        );
    }
}
