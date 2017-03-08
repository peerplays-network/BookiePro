import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigateActions } from '../../actions';
import { Button } from 'antd';

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    // Go to signup page
    this.props.navigateTo('/signup');
  }

  renderSubmitButton() {
    return (
      <Button onClick={ this.handleSubmit } >
        { 'Go to Signup' }
      </Button>
    );
  }


  render() {
    return (
      <div>
        <div>
          THIS IS LOGIN PAGE
        </div>
        { this.renderSubmitButton() }
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(Login);
