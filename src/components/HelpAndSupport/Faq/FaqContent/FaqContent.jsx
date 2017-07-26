import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { HelpAndSupportUtils } from '../../../../utility';
import _ from 'lodash';

class FaqContent extends PureComponent {
  constructor(props) {
    super(props);
    // Set initial question answer pairs
    this.state = {
      questionAnswerPairs: HelpAndSupportUtils.getQuestionAnswerPairs(props.topic)
    }
    // Set initial ref
    this.qaPairRefs = {};
    this.renderFaqDetailPart = this.renderFaqDetailPart.bind(this);
    this.renderFaqTopicHeader = this.renderFaqTopicHeader.bind(this);
  }
  createHTMLMarkup(data){
    return {__html: data };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.topic !== nextProps.topic) {
      // Update question answer pairs
      this.setState({
        questionAnswerPairs: HelpAndSupportUtils.getQuestionAnswerPairs(nextProps.topic)
      })
    }
  }
  renderFaqDetailPart() {
    const faqDetail = _.map(this.state.questionAnswerPairs, (pair, index) => {
      return (
        <div className='questionAnswerPair' key={ index }>
          <div key={ 'question' + index } className='question'>{ pair.question }</div>
          <div dangerouslySetInnerHTML={ this.createHTMLMarkup(pair.answer) } className='answer' />
        </div>
      )
    });
    return (
      <div className='faqDetailPart'>
        { faqDetail }
      </div>
    )
  }

  renderFaqTopicHeader() {
    const topicHeader = HelpAndSupportUtils.getTopicHeader(this.props.topic);
    if (topicHeader) {
      return (
        <div className='faqTopicHeader'>
          { topicHeader.toUpperCase() }
        </div>
      )
    }
  }

  render() {
    const { className } = this.props;
    return (
      <div className={ 'faqContent ' +  ( className || '') } >
        { this.renderFaqTopicHeader() }
        { this.renderFaqDetailPart() }
      </div>
    )
  }
}

FaqContent.propTypes = {
  topic: PropTypes.string
}

export default FaqContent;
