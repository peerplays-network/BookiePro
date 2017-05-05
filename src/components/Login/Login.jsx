import React, { Component } from 'react';
import logo from '../../assets/images/bookie_logo_login.png';
import { Form } from 'antd';
import LoginForm from './Form.jsx';
import { NavigateActions, AuthActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Login extends Component {
  constructor(props) {
    super(props);
    this.onClickSignup = this.onClickSignup.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //Navigate to signup page
  onClickSignup(e) {
    e.preventDefault();
    this.props.navigateTo('/signup');
  }

  //validates accountName password and navigate to home page
  handleSubmit(e) {
    this.props.login(e.get('userName'), e.get('password'));
  }

  render() {
    return (
      <div className='loginBackground'>
        <div className='loginComponent' >
          <div className='wrapper'>
            <div className='text-center'>
              <img src={ logo } height='148' width='132' alt=''/>
              <div className='center-ele'>
                <LoginForm onClickSignup={ this.onClickSignup }
                  onSubmit={ this.handleSubmit } errors={ this.props.errors } status={ this.props.status } />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    errors: state.getIn(['auth','loginErrors']),
    status: state.getIn(['auth','loginLoadingStatus'])
  });
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    login: AuthActions.login
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login))
