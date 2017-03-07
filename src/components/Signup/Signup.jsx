import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RegisterStatus } from '../../constants';
import { RegisterActions } from '../../actions';
import { Button } from 'antd';

class Signup extends Component {
  constructor(props) {
    super(props);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._renderSubmitButton = this._renderSubmitButton.bind(this);
  }

  _handleSubmit() {
    // Start Signup
    this.props.signup('abc1234', 'EfZQd3s1xZp8CE55XOf9rHD1na9EHCzQ6IL4bPoE8FVF1e4XPt47')
  }

  _renderSubmitButton() {
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
      <Button onClick={ this._handleSubmit } disabled={ disabled }>
        { text }
      </Button>
    );
  }


  render() {
    return (
      <div>
        <div>
          THIS IS SIGNUP PAGE
        </div>
        { this._renderSubmitButton() }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const register = state.register;
  return {
    registerStatus: register.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (accountName, password) => {
      dispatch(RegisterActions.signup(accountName, password));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
