import React, { Component } from 'react';
import logo from '../../assets/images/login-logo.png';
import { Form } from 'antd';
import SignUpForm from './Form';
import { NavigateActions, RegisterActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Signup extends Component {

  onClickLogin(e) {
    e.preventDefault();
    this.props.navigateTo('/login')
  }

  handleSubmit(values) {
    this.props.signup(values.accountName, values.password);
  }

  render() {
    return (
      <div className='ant-layout' id='main-content'>
        <div className='registerComponent' >
          <div className='wrapper'>
            <div className='text-center'>
              <img src={ logo } alt=''/>
              <h2 className='margin-tb-25'> Welcome to Application </h2>
              <p className='font20 margin-btm-20'>Please create your new account</p>
              <div className='center-ele'>
                <SignUpForm
                  loadingStatus={ this.props.loadingStatus }
                  onClickLogin={ this.onClickLogin.bind(this) }
                  onSubmit={ this.handleSubmit.bind(this) }
                  errors={ this.props.errors } />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loadingStatus: state.register.loadingStatus,
    errors: state.register.errors
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    signup: RegisterActions.signup
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Signup))
