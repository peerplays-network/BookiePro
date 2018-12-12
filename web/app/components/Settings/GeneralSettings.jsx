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
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import Select from 'react-select';

import {switchLocale, changeSettleStatus, changeChatStatus} from 'actions/RSettingsActions';

const mapStateToProps = (store) => {
  return {
    locale: store.settings.locale,
    defaultLocales: store.settings.defaults.locale,
    showSettles: store.settings.showSettles,
    defaultShowSettles: store.pageSettings.defaults.showSettles,
    disableChat: store.settings.disableChat,
    defaultDisableChat: store.pageSettings.defaults.disableChat
  };
};

@connect(mapStateToProps,
  {
    switchLocale,
    changeSettleStatus,
    changeChatStatus
  }
)
export default class GeneralSettings extends React.Component {
  onSwitchLocale(e) {
    this.props.switchLocale(e.value);
  }

  onChangeSettleStatus() {
    this.props.changeSettleStatus();
  }

  onChangeChatStatus() {
    this.props.changeChatStatus();
  }

  render() {
    let localeOptions = this.props.defaultLocales.map((entry) => {
      return {value: entry, label: counterpart.translate('languages.' + entry)};
    });

    let {locale} = this.props;

    return (
      <div id='general' className='tab__deploy general__tab' style={ {display: 'block'} }>
        <div className='tab__deployHead'>
          <div className='title'><Translate content='settings.general' /></div>
          <div className='desc'><Translate content='settings.general_text' /></div>
        </div>
        <div className='box-inner box-inner-2'>
          <form className='clearfix'>
            <div className='col col-4 col-offset-05'>
              <div className='row2'>
                <label className='label'><Translate content='settings.locale' /></label>
                <Select
                  value={ locale }
                  options={ localeOptions }
                  onChange={ this.onSwitchLocale.bind(this) }
                />
              </div>
            </div>

            {/*<div className="col col-5 general__switch">
              <div className="row2">
                <div className="switch__big switch__big-inline">
                  <input
                    type="checkbox"
                    className="switch"
                    id="showOrders"
                    onChange={this.onChangeSettleStatus.bind(this)}
                    defaultChecked={showSettles ? true : false}
                  />
                  <label htmlFor="showOrders" className="switch__label">
                    <Translate content="settings.showSettles" />
                  </label>
                  <label htmlFor="showOrders" className="switch__slider"></label>
                </div>
              </div>
            </div>*
            <div className="col col-3 general__switch">
              <div className="row2">
                <div className="switch__big switch__big-inline">
                  <input
                    type="checkbox"
                    className="switch"
                    id="disableChat"
                    onChange={this.onChangeChatStatus.bind(this)}
                    defaultChecked={disableChat ? true : false}
                  />
                  <label htmlFor="disableChat" className="switch__label">
                    <Translate content="settings.disableChat" />
                  </label>
                  <label htmlFor="disableChat" className="switch__slider"></label>
                </div>
              </div>
            </div>*/}
          </form>
        </div>
      </div>
    );
  }
}
