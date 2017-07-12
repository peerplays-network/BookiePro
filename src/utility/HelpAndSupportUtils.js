import { FaqTopics } from '../constants';
import { I18n } from 'react-redux-i18n';
import _ from 'lodash';

const getTopicTranslationKeyword = (topic) => {
  let translationKeyword;
  switch(topic) {
    case FaqTopics.OVERVIEW: {
      translationKeyword = 'topicOverview';
      break;
    }
    case FaqTopics.ACCOUNT: {
      translationKeyword = 'topicAccount';
      break;
    }
    case FaqTopics.FUNDS: {
      translationKeyword = 'topicFunds';
      break;
    }
    case FaqTopics.BETTING: {
      translationKeyword = 'topicBetting';
      break;
    }
    case FaqTopics.FEES: {
      translationKeyword = 'topicFees';
      break;
    }
    case FaqTopics.SPORTS: {
      translationKeyword = 'topicSports';
      break;
    }
    case FaqTopics.ABOUT: {
      translationKeyword = 'topicAbout';
      break;
    }
    case FaqTopics.MISC: {
      translationKeyword = 'topicMisc';
      break;
    }
    default: break;
  }
  return translationKeyword;
}

const getQuestionAnswerPairs = (topic) => {
  let questionAnswerPairs = [];
  let translationKeyword = getTopicTranslationKeyword(topic);
  if (translationKeyword) {
    questionAnswerPairs = I18n.t('help.' + translationKeyword + '.questionAnswerPairs');
  }
  return questionAnswerPairs;
}

const getTopicHeader = (topic) => {
  let translationKeyword = getTopicTranslationKeyword(topic);
  let topicHeader = '';
  if (translationKeyword) {
    topicHeader = I18n.t('help.' + translationKeyword + '.header');
  }
  return topicHeader;
}

const HelpAndSupportUtils = {
  getQuestionAnswerPairs,
  getTopicHeader
}

export default HelpAndSupportUtils;
