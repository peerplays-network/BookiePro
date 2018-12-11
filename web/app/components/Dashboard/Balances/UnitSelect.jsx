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
import {changeUnit} from 'actions/RSettingsActions';
import classNames from 'classnames';
import asset_utils from 'common/asset_utils';

@connect((state) => {
  return {
    unit: state.settings.unit,
    unitList: state.settings.defaults.unit
  };
}, {changeUnit})
class UnitSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popup: false
    };
  }

  _closePopup() {
    if (this.state.popup) {
      this.setState({popup: false});
    }
  }

  componentWillMount() {
    document.addEventListener('click', this._closePopup.bind(this), false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._closePopup.bind(this), false);
  }

  openPopup(e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    this.setState({
      popup: !this.state.popup
    });
  }

  changeUnit(value) {
    this.props.changeUnit(value);

    if (this.props.onHandleChange) {
      this.props.onHandleChange(value);
    }
  }

  _renderList(value, index) {
    let {unit} = this.props;
    return (
      <li
        className='ddMenu__item'
        key={ index }
        onClick={ this.changeUnit.bind(this, value) }
      >
        <a className={ classNames('ddMenu__link', 'js-sel_dropDown', {'active': (unit == value)}) }> { /* eslint-disable-line */ }
          {asset_utils.getSymbol(value)}
        </a>
      </li>
    );
  }

  render() {
    let showPopup = this.state.popup, {unitList} = this.props;
    let list = [];

    unitList.forEach((value, index) => {
      list.push(this._renderList(value, index));
    });

    return (
      <div className={ classNames('aside__balanceUnit', 'dd', {'open': showPopup}) }>
        <a onClick={this.openPopup.bind(this)} className='aside__balanceUnitText ddTrigger js_dropDown'> { /* eslint-disable-line */ }
          <span className='ddTrigger__text'>Preferred Unit</span>
        </a>
        <div className='ddMenu'>
          <ul className='ddMenu__list'>
            {list}
          </ul>
        </div>
      </div>
    );
  };
}

export default UnitSelect;