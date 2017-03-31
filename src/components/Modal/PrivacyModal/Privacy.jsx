import React, { Component } from 'react';
import { Modal, Button } from 'antd';

class Privacy extends Component {
  state = {
    visible: false
  }
  showModal = () => {
    this.setState({
      visible: true
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  render() {
    return (
      <div>
        <Button className='privacy-button' type='primary' onClick={ this.showModal }> { this.props.buttonTitle } </Button>
        <Modal
          title={ this.props.title }
          wrapClassName={ this.props.parentClass + '-modal' }
          visible={ this.state.visible }
          footer=''
          width='989'
          onCancel={ this.handleCancel }
        >
          { this.props.children }
        </Modal>
      </div>
    );
  }
}


export default Privacy;
