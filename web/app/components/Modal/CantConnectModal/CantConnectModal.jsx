import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import {Modal, ModalBody} from 'react-modal-bootstrap';
import AppService from '../../../../../dl/src/services/AppService';
import store from 'store/configureStore';

class CantConnectModal extends React.Component {
  tryAgainHandler() {
    AppService.init(store);
  }

  render() {
    return (
      <Modal
        isOpen={ this.props.showCantConnectModal }
        autoFocus={ true }
        backdropStyles={ {
          base: {
            background: 'rgba(255, 255, 255, .5)',
            opacity: 0,
            visibility: 'hidden',
            transition: 'all 0.4s',
            overflowX: 'hidden',
            overflowY: 'auto'
          },
          open: {
            opacity: 1,
            visibility: 'visible'
          }
        } }>
        <ModalBody>
          <div className='modal-dialog'>
            <div className='modal-dialogAlignOut'>
              <div className='modal-dialogAlignIn'>
                <div
                  className='modal-dialogContent modal-dialogContent-w400 modal-dialogContent-type02'> { /*eslint-disable-line */ }
                  <Translate
                    component='div'
                    className='modalTitle'
                    content='cant_connect_modal_blockchain.title'/>
                  <div className='modalFooter text_c'>
                    <button onClick={ this.tryAgainHandler } className='btn btn-sbm'>
                      <Translate content='cant_connect_modal_blockchain.try_again'/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    showCantConnectModal : state.app.showCantConnectModal
  };
};

export default connect(mapStateToProps)(CantConnectModal);