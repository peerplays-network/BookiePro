import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { NavigateActions } from '../../actions';
import { FaqTopics } from '../../constants';
import { HelpAndSupportUtils } from '../../utility';
import FaqContent from './FaqContent';
import _ from 'lodash';


class HelpAndSupport extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentTopic: FaqTopics.OVERVIEW
    }
    this.handleNavigateToHome = this.handleNavigateToHome.bind(this);
  }

  //Redirect to 'Home' screen when clicked on 'Home' link on the Breadcrumb
  handleNavigateToHome(){
    this.props.navigateTo('/exchange');
  }

  renderTopics() {
    const currentTopic = this.state.currentTopic;
    return _.map(FaqTopics, (topic) => {
      const topicHeader = HelpAndSupportUtils.getTopicHeader(topic);

      const onClick = (event) => {
        event.preventDefault();
        this.setState({ currentTopic: topic })
      }

      const topicComponent = (
        <a
          key={ topic }
          className={ 'topic' + (currentTopic === topic ? ' highlighted' : '') }
          onClick={ onClick }
          >
          { topicHeader }
        </a>
      )
      return topicComponent;
    })
  }

  render() {
    return (
      <div className='help-and-support'>
        <Breadcrumb className='bookie-breadcrumb'>
          <Breadcrumb.Item>
            <a onClick={ this.handleNavigateToHome }>{ I18n.t('myAccount.home') } </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{ I18n.t('help.title') }</Breadcrumb.Item>
        </Breadcrumb>
        <div className='content'>
          <div className='faqTopicColumn'>
            <div className='header'>{ I18n.t('help.header') }</div>
            { this.renderTopics() }
          </div>
          <div className='faqContentColumn'>
            <FaqContent topic={ this.state.currentTopic }/>
          </div>
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
