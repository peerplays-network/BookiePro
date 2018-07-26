import React, {PureComponent} from 'react';
import {I18n, Translate} from 'react-redux-i18n';
import {AppBackgroundTypes} from '../../constants';
import {AppActions} from '../../actions';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
class LicenseScreen extends PureComponent {
  componentDidMount() {
    // Set app background to license bg
    this.props.setAppBackground(AppBackgroundTypes.LICENSE_BG);
  }
  componentWillUnmount() {
    // Reset app background to gradient
    this.props.setAppBackground(AppBackgroundTypes.GRADIENT_BG);
  }
  render() {
    return (
      <div className='licenseComponent' style={ this.props.style }>
        <div className='container'>
          <h2> {I18n.t('license_screen.title')} </h2>
          <p>
            <Translate value='license_screen.content' dangerousHTML />
          </p>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    setAppBackground: AppActions.setAppBackgroundAction
  },
  dispatch
);

export default connect(
  null,
  mapDispatchToProps
)(LicenseScreen);
