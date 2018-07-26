import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

class WelcomeCarouselChild extends PureComponent {

  constructor(props) {
    super(props);
    this.renderTwoColumn = this.renderTwoColumn.bind(this);
    this.renderSingleColumn = this.renderSingleColumn.bind(this);
  }

  renderTwoColumn() {
    return (
      <div className='welcomeCarouselChildTwoColumn'>
        <div className='welcomeCarouselChildLeftPart'>
          {this.props.imageSource && (
            <img
              className='welcomeCarouselChildImage'
              alt='onboarding'
              src={ this.props.imageSource }
              width={ this.props.imageWidth }
              height={ this.props.imageHeight }
            />
          )}
        </div>
        <div className='welcomeCarouselChildRightPart'>
          <div className='welcomeCarouselChildHeader'>{this.props.headerText}</div>
          <div className='welcomeCarouselChildSeparator' />
          <div className='welcomeCarouselChildContent'>{this.props.contentText}</div>
        </div>
      </div>
    );
  }

  renderSingleColumn() {
    return (
      <div className='welcomeCarouselChildSingleColumn'>
        {this.props.imageSource && (
          <img
            className='welcomeCarouselChildImage'
            alt='onboarding'
            src={ this.props.imageSource }
            width={ this.props.imageWidth }
            height={ this.props.imageHeight }
          />
        )}
        <div className='welcomeCarouselChildContent'>{this.props.contentText}</div>
      </div>
    );
  }
  render() {
    let child;

    if (this.props.type === WelcomeCarouselChild.TWO_COLUMN_TYPE) {
      child = this.renderTwoColumn();
    } else if (this.props.type === WelcomeCarouselChild.SINGLE_COLUMN_TYPE) {
      child = this.renderSingleColumn();
    }

    return <div className='welcomeCarouselChild'>{child}</div>;
  }
}

WelcomeCarouselChild.propTypes = {
  type: PropTypes.string,
  imageSource: PropTypes.string,
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  headerText: PropTypes.string,
  contentText: PropTypes.string
};

WelcomeCarouselChild.defaultProps = {
  type: WelcomeCarouselChild.TWO_COLUMN_TYPE,
  imageSource: '',
  imageWidth: 300,
  imageHeight: 300,
  headerText: '',
  contentText: ''
};

WelcomeCarouselChild.TWO_COLUMN_TYPE = 'TWO_COLUMN_TYPE';
WelcomeCarouselChild.SINGLE_COLUMN_TYPE = 'SINGLE_COLUMN_TYPE';

export default WelcomeCarouselChild;
