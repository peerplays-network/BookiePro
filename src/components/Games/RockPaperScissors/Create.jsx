import React from 'react';
import {connect} from 'react-redux';
import {RWalletUnlockActions} from '../../../actions';
import CreateForm from './CreateForm';
import Translate from 'react-translate-component';
import {bindActionCreators} from 'redux';

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
    let {walletLocked, walletModalOpened} = this.props;

    if (walletLocked && !walletModalOpened) {
      callback.exists = true;
      callback.run = this.props.createTournament.bind(this, values);
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
        className='tab__deploy block'>
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

const mapStateToProps = (state) => {
  return {
    walletLocked: state.wallet.locked,
    walletIsOpen: state.wallet.isOpen
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    setWalletPosition: RWalletUnlockActions.setWalletPosition
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Create);