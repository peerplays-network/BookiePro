import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RegisterStatus } from '../../constants';
import { RegisterActions, NavigateActions } from '../../actions';
import { Button } from 'antd';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderSubmitButton = this.renderSubmitButton.bind(this);
    this.renderSkipButton = this.renderSkipButton.bind(this);
    this.renderError = this.renderError.bind(this);
  }

  handleSubmit() {
    // Start Signup
    this.props.signup('abc1234', 'EfZQd3s1xZp8CE55XOf9rHD1na9EHCzQ6IL4bPoE8FVF1e4XPt47')
  }

  renderSubmitButton() {
    let text, disabled;
    switch (this.props.registerStatus) {
      case RegisterStatus.DEFAULT: {
        text = 'SIGN UP';
        disabled = false;
        break;
      }
      case RegisterStatus.LOADING: {
        text = 'LOADING';
        disabled = true;
        break;
      }
      case RegisterStatus.DONE: {
        text = 'DONE';
        disabled = true;
        break;
      }
      default: break;
    }

    return (
      <Button onClick={ this.handleSubmit } disabled={ disabled }>
        { text }
      </Button>
    );
  }

  renderError() {
    // Render error message if any, just to help debugging for now
    // TODO: remove this when unneeded
    if (this.props.error && this.props.error.message) {
      return (
        <h3 style={ {color: 'red'} }>
          { this.props.error.message.substr(0, 200) }
        </h3>
      )
    }
  }

  renderSkipButton() {
    // For testing purpose only when you just want to skip signup
    // TODO: remove this when it is unneeded anymore
    return (
      <Button onClick={ () => { this.props.navigateTo('/home') } } >
        { 'SKIP SIGNUP AND GO TO MAIN PAGE' }
      </Button>
    )
  }


  render() {
    return (
      <div>
        <div>
          THIS IS SIGNUP PAGE
        </div>
        { this.renderError() }
        { this.renderSubmitButton() }
        { this.renderSkipButton() }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const register = state.register;
  return {
    registerStatus: register.status,
    error: register.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    signup: RegisterActions.signup,
    navigateTo: NavigateActions.navigateTo
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
