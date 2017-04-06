import React, { Component } from 'react';
import { Modal } from 'antd';

class UnplacedBetModal extends Component {

  render() {
    return (
      <Modal
        title={ 'Confirm navigation' }
        wrapClassName={ 'unplaced-bet-modal' }
        closable={ true }
        maskClosable={ true }
        visible={ this.props.visible }
        onOk={ this.props.onLeave }
        onCancel={ this.props.onStay }
        okText={ 'Leave this page' }
        cancelText={ 'Stay on this page' }
      >
        <p>You have UNPLACED bets in your betslip. Your selections will be discarded when you leave this page. Are you sure you want to leave this page?</p>
      </Modal>
    );
  }
}

UnplacedBetModal.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  onLeave: React.PropTypes.func,
  onStay: React.PropTypes.func,

};

export default UnplacedBetModal;
