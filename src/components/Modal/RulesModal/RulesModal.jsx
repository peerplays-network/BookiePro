import React, { Component } from 'react';
import { Modal, Button, Icon } from 'antd';

class RulesModal extends Component {
  state = {
    visible: false
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    return (
      <div className='modal-inline'>
        <Button onClick={ this.showModal }><Icon type='info-circle-o' />{ this.props.buttonTitle }</Button>
        <Modal
          title={ this.props.title }
          wrapClassName={ this.props.parentClass + '-modal' }
          visible={ this.state.visible }
          footer=''
          width='747'
          onCancel={ this.handleCancel }
        >
          { this.props.children }
        </Modal>
      </div>
    );
  }
}


export default RulesModal;
