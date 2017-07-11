import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Faq extends PureComponent {
  render() {
    const { className } = this.props;
    return (
      <div className={ 'faq ' +  ( className || '') } >
        <div className='faqHeaderPart'>
        </div>
        <div className='faqSeparator' />
        <div className='faqContentPart'>
        </div>
      </div>
    )
  }
}

Faq.propTypes = {
  // Question answer pairs in the following format
  // [ { question: ..., answer: ... }, { question: ..., answer: ... }, ...]
  questionAnswerPairs: PropTypes.array
}

export default Faq;
