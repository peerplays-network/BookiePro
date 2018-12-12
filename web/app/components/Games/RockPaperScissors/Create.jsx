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
import RockPaperScissorsActions from 'actions/Games/RockPaperScissors/RockPaperScissorsActions';
import CreateForm from './CreateForm';
import {setWalletPosition} from 'actions/RWalletUnlockActions';
import Translate from 'react-translate-component';

let callback = {
  exists: false,
  run: null
};

class Create extends React.Component {
  componentWillUpdate(nextProps) {
    const {walletLocked} = this.props;
    //TODO:: new unlock

    if (!nextProps.walletLocked && nextProps.walletLocked !== walletLocked) {
      if (callback.exists && callback.run) {
        callback.exists = false;
        callback.run(nextProps.walletLocked);
        callback.run = null;
      }
    }
  }

  componentWillMount() {
    this.props.subscribe('create');
    this.props.fetchAvailableUnits();
  }

  componentWillUnmount() {
    this.props.unSubscribe('create');
  }

  handleSubmit(values) {
    //TODO:: new unlock
    let {walletLocked, walletModalOpened} = this.props;

    if (walletLocked && !walletModalOpened) {
      callback.exists = true;
      callback.run = this
        .props
        .createTournament
        .bind(this, values);
      this.props.setWalletPosition(true);
      return;
    }

    this.props.createTournament(values);
  }

  render() {
    let {unitList, unit} = this.props;

    return (
      <div
        id='create'
        className='tab__deploy'
        style={ {
          display: 'block'
        } }>
        <div className='tab__deployHead'>
          <Translate
            component='div'
            className='title'
            content='games.rps_game.create_new_tournament'/>
        </div>
        <div className='box-inner box-inner-2'>
          <div className='clearfix'>
            <CreateForm
              onSubmit={ this.handleSubmit.bind(this) }
              unit={ unit }
              unitList={ unitList }/>
          </div>
        </div>
      </div>
    );
  }
}

Create = connect((state) => {
  return {
    unit: state.rockPaperScissorsReducer.unit,
    unitList: state.rockPaperScissorsReducer.unitList,
    walletLocked: state.wallet.locked,
    walletIsOpen: state.wallet.isOpen
  };
}, {
  subscribe: RockPaperScissorsActions.subscribe,
  unSubscribe: RockPaperScissorsActions.unSubscribe,
  fetchAvailableUnits: RockPaperScissorsActions.fetchAvailableUnits,
  createTournament: RockPaperScissorsActions.createTournament,
  setWalletPosition: setWalletPosition
})(Create);

export default Create;