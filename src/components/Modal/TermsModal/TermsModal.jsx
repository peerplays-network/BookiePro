import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import Ps from 'perfect-scrollbar';
import ReactDOM from 'react-dom'
class TermsModal extends Component {
  state = {
    visible: false
  };
  componentDidUpdate() {
    Ps.initialize(ReactDOM.findDOMNode(this.refs.scrollableSection));
  }
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
        <Button onClick={ this.showModal }> { this.props.buttonTitle } </Button>
        <Modal
          title={ this.props.title }
          wrapClassName={ this.props.parentClass + '-modal' }
          visible={ this.state.visible }
          footer=''
          width={ 747 }
          onCancel={ this.handleCancel }
        >
          <div style={ { 'height' : '100%', 'position' : 'relative' } } ref='scrollableSection'>
            { this.props.children }
          </div>
        </Modal>
      </div>
    );
  }
}


export default TermsModal;
