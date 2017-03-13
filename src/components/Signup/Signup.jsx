import React, { Component } from 'react';
import logo from '../../assets/images/login-logo.png';
import { Form } from 'antd';
import SignUpForm from './Form';
import { NavigateActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.onClickLogin = this.onClickLogin.bind(this);
  }

  onClickLogin(e) {
    e.preventDefault();
    this.props.navigateTo('/login')
  }

  render() {
    return (
        <div className='ant-layout' id='main-content'>
          <div className='registerComponent' >
            <div className='wrapper'>
                <div className='text-center'>
                    <img src={ logo } alt=''/>
                    <h2 className='margin-tb-25'> Welcome to Application </h2>
                    <p className='font22 margin-btm-20'>Please create your new account</p>
                    <div className='center-ele'>
                        <SignUpForm onClickLogin={ this.onClickLogin } />
                    </div>
                </div>
            </div>
          </div>
        </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo
  }, dispatch);
}
export default connect(null, mapDispatchToProps)(Form.create()(Signup))
