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