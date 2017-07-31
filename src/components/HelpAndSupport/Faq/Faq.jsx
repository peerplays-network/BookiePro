import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { FaqTopics } from '../../../constants';
import { HelpAndSupportUtils } from '../../../utility';
import FaqContent from './FaqContent';
import _ from 'lodash';


class Faq extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentTopic: FaqTopics.OVERVIEW
    }
    this.handleOverviewFeesClick = this.handleOverviewFeesClick.bind(this);
  }

  handleOverviewFeesClick(e){
    e.preventDefault();
    this.setState({ currentTopic: FaqTopics.FEES })
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
      <div className='faq'>
        <div className='faqTopicColumn'>
          <div className='header'>{ I18n.t('help.header') }</div>
          { this.renderTopics() }
        </div>
        <div className='faqContentColumn'>
          <FaqContent topic={ this.state.currentTopic } handleOverviewFeesClick={ this.handleOverviewFeesClick }/>
        </div>
      </div>
    )
  }
}

export default Faq;
