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
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import {Modal, ModalBody} from 'react-modal-bootstrap';

@connect((state) => {
  return {
    showCantConnectModal: state.app.showCantConnectModal
  };
}, {

})
class CantConnectModal extends React.Component {

  tryAgainHandler() {
    window.location.reload();
  }

  render() {

    return (
      <Modal isOpen={ this.props.showCantConnectModal } autoFocus={ true } backdropStyles={ {base: {
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
      }} }>
        <ModalBody>
          <div className='modal-dialog'>
            <div className='modal-dialogAlignOut'>
              <div className='modal-dialogAlignIn'>
                <div className='modal-dialogContent modal-dialogContent-w400 modal-dialogContent-type02'> {/* eslint-disable-line */}
                  <Translate
                    component='div'
                    className='modalTitle'
                    content='cant_connect_modal_blockchain.title'
                  />
                  <div className='modalFooter text_c'>
                    <button onClick={ this.tryAgainHandler } className='btn btn-sbm'>
                      <Translate content='cant_connect_modal_blockchain.try_again' />
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

export default CantConnectModal;