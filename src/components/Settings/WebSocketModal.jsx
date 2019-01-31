import React from 'react';
import {connect} from 'react-redux';
import Translate from 'react-translate-component';
import Trigger from 'react-foundation-apps/src/trigger';
import Modal from 'react-foundation-apps/src/modal';
import ZfApi from 'react-foundation-apps/src/utils/foundation-api';
import {
  addConnection,
  removeConnection
} from 'actions/PageSettingsActions';
import {bindActionCreators} from 'redux';

class WebSocketsModal extends React.Component {
  constructor() {
    super();
    let protocol = window.location.protocol;
    this.state = {
      protocol: protocol,
      ws: protocol === 'https:' ? 'wss://' : 'ws://',
      type: 'remove'
    };
  }

  show (e) {
    let target;

    if (e.target.id.indexOf('add') !== -1) {
      target = 'add';
    } else if (e.target.id.indexOf('remove') !== -1) {
      target = 'remove';
    }

    this.setState({
      type: target
    });
    ZfApi.publish('ws_modal_' + target, 'open');
  }

  close() {
    ZfApi.publish('ws_modal_' + this.state.type, 'close');
  }

  _onInput(e) {
    if (this.state.protocol === 'https:') {
      e.target.value = e.target.value.replace('ws://', 'wss://');
    }

    if (e.target.value.indexOf('ws://') !== -1 || e.target.value.indexOf('wss://') !== -1) {
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
      <Modal id='ws_modal_add' ref='ws_modal_add' overlay={ true } overlayClose={ false }>
        <Trigger close=''>
          <div className='close-button'>&times;</div>
        </Trigger>
        <div className='grid-content'>
          <Translate component='h3' content='settings.add_ws' />
          <form onSubmit={ this._onAddSubmit.bind(this) } noValidate>
            <section className='block-list'>
              <ul>
                <li className='with-dropdown'>
                  <input
                    type='text'
                    onChange={ this._onInput.bind(this) }
                    value={ this.state.ws }
                  />
                </li>
              </ul>
            </section>
            <div className='button-group'>
              <button type='submit' className={ 'button' } onClick={ this._onAddSubmit.bind(this) }>
                <Translate content='transfer.confirm' />
              </button>
              <Trigger close={ 'ws_modal_add' }>
                <div  className=' button'><Translate content='account.perm.cancel' /></div>
              </Trigger>
            </div>
          </form>
        </div>
      </Modal>
    );
  }



  _renderRemoveModal() {
    if (!this.props.connection) {
      return null;
    }

    let options = this.props.defaultConnection.map((entry) => { // eslint-disable-line
      if (entry !== this.props.connection) {
        return (
          <option value={ entry } key={ entry }>{entry}</option>
        );
      }
    }).filter((a) => {
      return !!a;
    });

    return (
      <Modal id='ws_modal_remove' ref='ws_modal_remove' overlay={ true } overlayClose={ false }>
        <Trigger close=''>
          <a href='#' className='close-button'>&times;</a> { /* eslint-disable-line */}
        </Trigger>
        <div className='grid-content no-overflow'>
          <Translate component='h3' content='settings.remove_ws' />
          <section className='block-list'>
            <header><Translate component='span' content={ 'settings.connection' } /></header>
            <ul>
              <li className='with-dropdown'>
                <select ref='select'>
                  {options}
                </select>
              </li>
            </ul>
          </section>
          <form onSubmit={ this._onRemoveSubmit.bind(this) } noValidate>
            <div className='button-group'>
              <button
                type='submit'
                className={ 'button' }
                onClick={ this._onRemoveSubmit.bind(this) }
              >
                <Translate content='transfer.confirm' />
              </button>
              <Trigger close={ 'ws_modal_remove' }>
                <div className='button'><Translate content='account.perm.cancel' /></div>
              </Trigger>
            </div>
          </form>
        </div>
      </Modal>
    );
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

const mapStateToProps = (state) => {
  return {
    connection: state.settings.connection,
    defaultConnection: state.pageSettings.defaults.connection
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    addConnection,
    removeConnection
  },
  dispatch
);

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(WebSocketsModal);