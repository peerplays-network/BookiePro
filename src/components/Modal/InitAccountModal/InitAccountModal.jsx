import React, { Component } from 'react';
import { Modal, Spin } from 'antd';
import PropTypes from 'prop-types';

class InitAccountModal extends Component {

  render() {
    return (
      <Modal
        wrapClassName={ 'vertical-center-modal' }
        visible={ this.props.visible }
        footer={ null }
        closable={ false }
      >
        <p>{ 'Setting up your account for the first time... ' }</p>
        <p>{ 'This might take few minutes. Please be patient.' }</p>
        <div style={ { display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '20px', paddingBottom: '20px' } }>
          <Spin size='large'/>
        </div>
      </Modal>
    );
  }
}

InitAccountModal.propTypes = {
  visible: PropTypes.bool.isRequired,
};

InitAccountModal.defaultProps = {
  visible: false,
};

export default InitAccountModal;
