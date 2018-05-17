/**
 * The HelpAndSupportUtils contains all the functions related to content generation
 */
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
    case FaqTopics.RULES: {
      translationKeyword = 'topicRules';
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
  var questionAnswerPairs = [];
  let translationKeyword = getTopicTranslationKeyword(topic);
  if (translationKeyword) {
    // TODO: If contains link in 'questionAnswerPairs...', pull link and apply AppUtils.openExternalLink({extracted link})
    debugger;
    
    questionAnswerPairs = I18n.t('help.' + translationKeyword + '.questionAnswerPairs');
    var matches = [];
    var split, match;
    for(let i=0; i<questionAnswerPairs.length;i++){
      split = questionAnswerPairs[i].answer.split('<a href="');
      for(let j=0; j<split.length; j++){
        match = split[j].match(/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/);
        if(match !== null){
          matches.push(match[0]);
        }
      }
    }
    console.log(matches);    
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
