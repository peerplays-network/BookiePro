import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { NavigateActions } from '../../actions';

class HelpAndSupport extends PureComponent {
  constructor(props) {
    super(props);
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
          { this.renderQuestionAnswerPair(I18n.t('help.question1'), I18n.t('help.answer1')) }
          { this.renderQuestionAnswerPair(I18n.t('help.question2'), I18n.t('help.answer2')) }
          { this.renderQuestionAnswerPair(I18n.t('help.question3'), I18n.t('help.answer3')) }
          { this.renderQuestionAnswerPair(I18n.t('help.question4'), I18n.t('help.answer4')) }
          { this.renderQuestionAnswerPair(I18n.t('help.question5'), I18n.t('help.answer5')) }
          { this.renderQuestionAnswerPair(I18n.t('help.question6'), I18n.t('help.answer6')) }
          { this.renderQuestionAnswerPair(I18n.t('help.question7'), I18n.t('help.answer7')) }
          { this.renderQuestionAnswerPair(I18n.t('help.question8'), I18n.t('help.answer8')) }
          { this.renderQuestionAnswerPair(I18n.t('help.question9'), I18n.t('help.answer9')) }
          { this.renderQuestionAnswerPair(I18n.t('help.question10'), I18n.t('help.answer10')) }
          { this.renderQuestionAnswerPair(I18n.t('help.question11'), I18n.t('help.answer11')) }
          { this.renderQuestionAnswerPair(I18n.t('help.question12'), I18n.t('help.answer12')) }
          { this.renderQuestionAnswerPair(I18n.t('help.question13'), I18n.t('help.answer13')) }
          { this.renderQuestionAnswerPair(I18n.t('help.question14'), I18n.t('help.answer14')) }
          { this.renderQuestionAnswerPair(I18n.t('help.question15'), I18n.t('help.answer15')) }
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
