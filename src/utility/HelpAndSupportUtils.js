import { FaqTopics } from '../../constants';

import { I18n } from 'react-redux-i18n';

const getOverviewQuestionAnswerPairs = () => {
  let questionAnswerPairs = [];
  questionAnswerPairs.push({
    question: I18n.t('help.topicOverview.question1'),
    answer: I18n.t('help.topicOverview.answer1')
  })
  questionAnswerPairs.push({
    question: I18n.t('help.topicOverview.question2'),
    answer: I18n.t('help.topicOverview.answer2')
  })
  questionAnswerPairs.push({
    question: I18n.t('help.topicOverview.question3'),
    answer: I18n.t('help.topicOverview.answer3')
  })
  questionAnswerPairs.push({
    question: I18n.t('help.topicOverview.question4'),
    answer: I18n.t('help.topicOverview.answer4')
  })
  questionAnswerPairs.push({
    question: I18n.t('help.topicOverview.question4'),
    answer: I18n.t('help.topicOverview.answer4')
  })
  questionAnswerPairs.push({
    question: I18n.t('help.topicOverview.question5'),
    answer: I18n.t('help.topicOverview.answer5')
  })
  questionAnswerPairs.push({
    question: I18n.t('help.topicOverview.question6'),
    answer: I18n.t('help.topicOverview.answer6')
  })
  questionAnswerPairs.push({
    question: I18n.t('help.topicOverview.question7'),
    answer: I18n.t('help.topicOverview.answer7')
  })
  questionAnswerPairs.push({
    question: I18n.t('help.topicOverview.question8'),
    answer: I18n.t('help.topicOverview.answer8')
  })
}



const getQuestionAnswerPairs = (topic) => {
  // TODO: find a better way to do this
  switch(topic) {
    case FaqTopics.OVERVIEW: {
      return getOverviewQuestionAnswerPairs();
    }
    case FaqTopics.ACCOUNT: {
      return getAccountQuestionAnswerPairs();
    }
    case FaqTopics.FUNDS: {
      return getFundsQuestionAnswerPairs();
    }
    case FaqTopics.BETTING: {
      return getBettingQuestionAnswerPairs();
    }
    case FaqTopics.FEES: {
      return getFeesQuestionAnswerPairs();
    }
    case FaqTopics.SPORTS: {
      return getSportsQuestionAnswerPairs();
    }
    case FaqTopics.ABOUT: {
      return getAboutQuestionAnswerPairs();
    }
    case FaqTopics.MISC: {
      return getMiscQuestionAnswerPairs();
    }
    default: break;
  }
}

const getTopicHeader = (topic) => {
  switch(topic) {
    case FaqTopics.OVERVIEW: {
      return I18n.t('help.topicOverview.header');
    }
    case FaqTopics.ACCOUNT: {
      return I18n.t('help.topicOverview.header');
    }
    case FaqTopics.FUNDS: {
      return I18n.t('help.topicOverview.header');
    }
    case FaqTopics.BETTING: {
      return I18n.t('help.topicOverview.header');
    }
    case FaqTopics.FEES: {
      return I18n.t('help.topicOverview.header');
    }
    case FaqTopics.SPORTS: {
      return I18n.t('help.topicOverview.header');
    }
    case FaqTopics.ABOUT: {
      return I18n.t('help.topicOverview.header');
    }
    case FaqTopics.MISC: {
      return I18n.t('help.topicOverview.header');
    }
    default: break;
  }
}

const HelpAndSupportUtils = {
  getQuestionAnswerPairs
}

export default HelpAndSupportUtils;
