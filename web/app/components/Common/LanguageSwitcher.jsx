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
import {connect} from 'react-redux';
import classNames from 'classnames';
import {switchLocale} from 'actions/RSettingsActions';

@connect((state) => {
  return {
    defaultLocales: state.settings.defaults.locale,
    locale: state.settings.locale
  };
}, {switchLocale})
class LanguageSwitcher extends React.Component {
  onSwitchLocale(lang, e) {
    this.props.switchLocale(lang);
    e.preventDefault();
  }

  getItems() {
    return (
      this.props.defaultLocales.map((lang) => {
        let flag;

        switch (lang) {
          case 'en':
            flag = 'us';
            break;
          default:
            flag = lang;
        }

        return (
          <li
            key={ flag }
            className={ classNames('lang__item us', {
              active: this.props.locale === lang
            }) }>
            <a
              onClick={ this.onSwitchLocale.bind(this, lang) }
              href={ '#language/' + lang }
              className='lang__link'><img src={ `images/flags/${flag}.png` } alt=''/>
            </a>
          </li>
        );
      })
    );
  }

  render() {
    return null; //TODO::uncomment
    return (
      <div className='lang__wrap'>
        <ul className='lang__list'>
          {this.getItems()}
        </ul>
      </div>
    );
  }
}

export default LanguageSwitcher;