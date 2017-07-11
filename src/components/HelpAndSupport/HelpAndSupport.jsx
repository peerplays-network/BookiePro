import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { NavigateActions } from '../../actions';
import { FaqTopics } from '../../constants';
import Faq from './Faq';
import _ from 'lodash';


class HelpAndSupport extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentTopic: FaqTopics.OVERVIEW
    }
    this.handleNavigateToHome = this.handleNavigateToHome.bind(this);
    this.renderQuestionAnswerPair = this.renderQuestionAnswerPair.bind(this)
  }

  //Redirect to 'Home' screen when clicked on 'Home' link on the Breadcrumb
  handleNavigateToHome(){
    this.props.navigateTo('/exchange');
  }

  renderQuestionAnswerPair(question, answer) {
    return (
      <div className='question-answer-pair'>
        <div className='question'>
          { question }
        </div>
        <div className='answer'>
          { answer }
        </div>
      </div>
    )
  }

  renderTopics() {
    const currentTopic = this.state.currentTopic;
    return _.map(FaqTopics, (topic) => {
      let topicComponentText;
      switch(topic) {
        case FaqTopics.OVERVIEW: {
          topicComponentText = I18n.t('help.topicOverview.header');
          break;
        }
        case FaqTopics.ACCOUNT: {
          topicComponentText = I18n.t('help.topicAccount.header');
          break;
        }
        case FaqTopics.FUNDS: {
          topicComponentText = I18n.t('help.topicFunds.header');
          break;
        }
        case FaqTopics.BETTING: {
          topicComponentText = I18n.t('help.topicBetting.header');
          break;
        }
        case FaqTopics.FEES: {
          topicComponentText = I18n.t('help.topicFees.header');
          break;
        }
        case FaqTopics.SPORTS: {
          topicComponentText = I18n.t('help.topicSports.header');
          break;
        }
        case FaqTopics.ABOUT: {
          topicComponentText = I18n.t('help.topicAbout.header');
          break;
        }
        case FaqTopics.MISC: {
          topicComponentText = I18n.t('help.topicMisc.header');
          break;
        }
        default: break;
      }

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
          { topicComponentText }
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
          <div className='topicColumn'>
            <div className='header'>{ I18n.t('help.header') }</div>
            { this.renderTopics() }
          </div>
          <div className='faqColumn'>
            <Faq  />
          </div>
        </div>
      </div>
    )
  }
}

// { this.renderQuestionAnswerPair(I18n.t('help.question1'), I18n.t('help.answer1')) }
// { this.renderQuestionAnswerPair(I18n.t('help.question2'), I18n.t('help.answer2')) }
// { this.renderQuestionAnswerPair(I18n.t('help.question3'), I18n.t('help.answer3')) }
// { this.renderQuestionAnswerPair(I18n.t('help.question4'), I18n.t('help.answer4')) }
// { this.renderQuestionAnswerPair(I18n.t('help.question5'), I18n.t('help.answer5')) }
// { this.renderQuestionAnswerPair(I18n.t('help.question6'), I18n.t('help.answer6')) }
// { this.renderQuestionAnswerPair(I18n.t('help.question7'), I18n.t('help.answer7')) }
// { this.renderQuestionAnswerPair(I18n.t('help.question8'), I18n.t('help.answer8')) }
// { this.renderQuestionAnswerPair(I18n.t('help.question9'), I18n.t('help.answer9')) }
// { this.renderQuestionAnswerPair(I18n.t('help.question10'), I18n.t('help.answer10')) }
// { this.renderQuestionAnswerPair(I18n.t('help.question11'), I18n.t('help.answer11')) }
// { this.renderQuestionAnswerPair(I18n.t('help.question12'), I18n.t('help.answer12')) }
// { this.renderQuestionAnswerPair(I18n.t('help.question13'), I18n.t('help.answer13')) }
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(HelpAndSupport);
