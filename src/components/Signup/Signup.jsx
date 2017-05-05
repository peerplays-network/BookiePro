import React, { PureComponent } from 'react';
import logo from '../../assets/images/bookie_logo_signup.png';
import { Form } from 'antd';
import SignupForm from './SignupForm';
import { NavigateActions, AuthActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { I18n }  from 'react-redux-i18n'

class Signup extends PureComponent {

  constructor(props){
    super(props);
    this.onClickLogin = this.onClickLogin.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //Navigate to login page
  onClickLogin(event) {
    event.preventDefault();
    this.props.navigateTo('/login')
  }

  //Sign up the user
  handleSubmit(values) {
    this.props.signup(values.get('accountName'), values.get('password'));
  }

  render() {
    return (
      <div className='onboardingSportsBackground'>
        <div className='signupComponent' >
          <div className='wrapper'>
            <div className='text-center'>
              <img src={ logo } className='logo' width='110px' height='112px' alt=''/>
              <p className='font18 margin-btm-24'>{I18n.t('signup.new_acc_req_text')}</p>
              <div className='center-ele'>
                <SignupForm
                  loadingStatus={ this.props.loadingStatus }
                  onClickLogin={ this.onClickLogin }
                  onSubmit={ this.handleSubmit }
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
    errors: state.getIn(['auth','signupErrors']),
    status: state.getIn(['auth','signupLoadingStatus'])
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    signup: AuthActions.signup
  }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Signup))
