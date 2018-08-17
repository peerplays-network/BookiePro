import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {HelpAndSupportUtils} from '../../../../utility';
import {Modal} from 'antd';
import LicenseScreen from '../../../LicenseScreen';

class FaqContent extends PureComponent {
  constructor(props) {
    super(props);
    // Set initial question answer pairs
    this.state = {
      questionAnswerPairs: HelpAndSupportUtils.getQuestionAnswerPairs(props.topic),
      modalIsOpen: false
    };
    // Set initial ref
    this.qaPairRefs = {};
    this.renderFaqDetailPart = this.renderFaqDetailPart.bind(this);
    this.renderFaqTopicHeader = this.renderFaqTopicHeader.bind(this);
    this.handleMITClick = this.handleMITClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  createHTMLMarkup(data) {
    return {__html: data};
  }

  handleMITClick(e) {
    e.preventDefault();
    this.setState({
      modalIsOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.topic !== nextProps.topic) {
      // Update question answer pairs
      this.setState({
        questionAnswerPairs: HelpAndSupportUtils.getQuestionAnswerPairs(nextProps.topic)
      });
    }
  }
  componentDidUpdate() {
    let getAnchor = document.getElementsByClassName('fees-scroll')[0];

    if (getAnchor) {
      getAnchor.addEventListener('click', this.props.handleOverviewFeesClick);
    }

    let MITAnchor = document.getElementsByClassName('mit-license-anchor')[0];

    if (MITAnchor) {
      MITAnchor.addEventListener('click', this.handleMITClick);
    }
  }
  componentDidMount() {
    let getAnchor = document.getElementsByClassName('fees-scroll')[0];

    if (getAnchor) {
      getAnchor.addEventListener('click', this.props.handleOverviewFeesClick);
    }

    let MITAnchor = document.getElementsByClassName('mit-license-anchor')[0];

    if (MITAnchor) {
      MITAnchor.addEventListener('click', this.handleMITClick);
    }
  }
  renderFaqDetailPart() {
    const faqDetail = this.state.questionAnswerPairs.map((pair, index) => (
      <div className='questionAnswerPair' key={ index }>
        <div key={ 'question' + index } className='question'>
          {pair.question}
        </div>
        <div dangerouslySetInnerHTML={ this.createHTMLMarkup(pair.answer) } className='answer' />
      </div>
    ));
    return <div className='faqDetailPart'>{faqDetail}</div>;
  }

  renderFaqTopicHeader() {
    const topicHeader = HelpAndSupportUtils.getTopicHeader(this.props.topic);

    if (topicHeader) {
      return <div className='faqTopicHeader'>{topicHeader.toUpperCase()}</div>;
    }
  }

  render() {
    const {className} = this.props;
    const licenseStyle = {
      'padding-top': '75px'
    };

    return (
      <div className={ 'faqContent ' + (className || '') }>
        {this.renderFaqTopicHeader()}
        {this.renderFaqDetailPart()}
        <Modal visible={ this.state.modalIsOpen } footer={ null } onCancel={ this.closeModal }>
          <LicenseScreen style={ licenseStyle } />
        </Modal>
      </div>
    );
  }
}

FaqContent.propTypes = {
  topic: PropTypes.string
};

export default FaqContent;
