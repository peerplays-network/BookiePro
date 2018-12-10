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

import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import BlockchainStore from 'stores/BlockchainStore';
import SettingsStore from 'stores/SettingsStore';
import Translate from 'react-translate-component';
import WebSocketModal from './Settings/WebSocketModal';
import SettingsActions from 'actions/SettingsActions';
import {Apis} from 'peerplaysjs-ws';

@connectToStores
class InitError extends React.Component {

  static getStores() {
    return [BlockchainStore, SettingsStore];
  }

  static getPropsFromStores() {
    return {
      rpc_connection_status: BlockchainStore
        .getState()
        .rpc_connection_status,
      apis: SettingsStore
        .getState()
        .defaults
        .connection,
      connection: SettingsStore
        .getState()
        .settings
        .get('connection'),
      defaultConnection: SettingsStore
        .getState()
        .defaultSettings
        .get('connection')
    };
  }

  triggerModal(e) {
    this
      .refs
      .ws_modal
      .getWrappedInstance()
      .show(e);
  }

  onChangeWS(e) {
    SettingsActions.changeSetting({setting: 'connection', value: e.target.value});
    Apis.reset(e.target.value);
  }

  onReloadClick(e) {
    if (e) {
      e.preventDefault();
    }

    if (window.electron) {
      window.location.hash = '';
      window
        .remote
        .getCurrentWindow()
        .reload();
    } else {
      window.location.href = '/';
    }
  }

  onReset() {
    SettingsActions.changeSetting({setting: 'connection', value: this.props.defaultConnection});
    SettingsActions.clearSettings();
  }

  render() {
    console.log('-- InitError.render -->', this.props);

    let options = this
      .props
      .apis
      .map((entry) => {
        return <option key={ entry } value={ entry }>{entry}</option>;
      });

    return (
      <div className='grid-block page-layout'>
        <div className='grid-container'>
          <div className='grid-content no-overflow'>
            <br/>
            <Translate component='h3' content={ 'init_error.title' }/>
            <br/>
            <section className='block-list'>
              <header><Translate component='span' content={ 'settings.connection' }/></header>
              <ul>
                <li className='with-dropdown'>
                  <select
                    onChange={ this
                      .onChangeWS
                      .bind(this) }
                    value={ this.props.connection }>
                    {options}
                  </select>
                  <div
                    style={ {
                      paddingTop: 10
                    } }
                    className='button-group'>
                    <div
                      onClick={ this
                        .triggerModal
                        .bind(this) }
                      className='button outline'
                      id='add'>
                      <Translate id='add_text' content='settings.add_api'/>
                    </div>
                  </div>
                </li>
                <li className='key-value clearfix'>
                  <div className='float-left'>Connection Status</div>
                  <div className='float-right'>
                    {this.props.rpc_connection_status === 'open'
                      ? <span className='txtlabel success'>
                        <Translate content={ 'init_error.connected' }/>
                      </span>
                      : <span className='txtlabel warning'>
                        <Translate content={ 'init_error.not_connected' }/>
                      </span>
                    }
                  </div>
                </li>
              </ul>
            </section>
            <br/>
            <div className='button-group'>
              <div className='button outline' href onClick={ this.onReloadClick }>
                <Translate content={ 'init_error.retry' }/>
              </div>

              <div
                onClick={ this
                  .onReset
                  .bind(this) }
                className='button outline'>
                <Translate content='settings.reset'/>
              </div>
            </div>
            <WebSocketModal ref='ws_modal'/>
          </div>
        </div>
      </div>
    );
  }
}

export default InitError;
