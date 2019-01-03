import React from 'react';
import {connect} from 'react-redux';
import NavigateActions from 'actions/NavigateActions';

export function requireAuthentication(Component) {
  class AuthenticatedComponent extends React.Component {
    componentWillMount() {
      this.checkAuth();
    }

    componentWillReceiveProps() {
      this.checkAuth();
    }

    checkAuth() {
      if (!this.props.isLogin) {
        let redirectAfterLogin = this.props.location.pathname;
        this.props.dispatch(NavigateActions.navigateToSignIn(redirectAfterLogin));
      }
    }

    render() {
      return (
        this.props.isLogin === true
          ? <Component { ...this.props }/>
          : null
      );
    }
  }

  const mapStateToProps = (state) => ({isLogin: state.app.isLogin});

  return connect(mapStateToProps)(AuthenticatedComponent);
}