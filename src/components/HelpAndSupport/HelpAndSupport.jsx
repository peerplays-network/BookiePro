import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { NavigateActions } from '../../actions';
import Faq from './Faq';
import FaqBanner from '../../assets/images/FAQ_banner@2x.png'
import _ from 'lodash';
import PeerPlaysLogo from '../PeerPlaysLogo';

class HelpAndSupport extends PureComponent {
  constructor(props) {
    super(props);
    this.handleNavigateToHome = this.handleNavigateToHome.bind(this);
  }

  //Redirect to 'Home' screen when clicked on 'Home' link on the Breadcrumb
  handleNavigateToHome(){
    this.props.navigateTo('/exchange');
  }


  render() {
    const bannerSource = `url(${FaqBanner})`;
    return (
      <div className='help-and-support'>
        <Breadcrumb className='bookie-breadcrumb'>
          <Breadcrumb.Item>
            <a onClick={ this.handleNavigateToHome }>{ I18n.t('myAccount.home') } </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{ I18n.t('help.title') }</Breadcrumb.Item>
        </Breadcrumb>
        <div className='faqBanner' style={ { backgroundImage: bannerSource } }>
        </div>
        <Faq />
        <div className='margin-top-18'>
          <PeerPlaysLogo />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(HelpAndSupport);
