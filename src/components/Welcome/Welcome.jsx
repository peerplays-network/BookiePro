import React, {PureComponent} from 'react';
import {Carousel} from 'antd';
import WelcomeCarouselChild from './WelcomeCarouselChild';
import onboardDepositImage from '../../assets/images/onb_deposit.png';
import onboardWelcomeImage from '../../assets/images/onb_welcome_logo.png';
import onboardTickImage from '../../assets/images/onb_tick.png';
import {I18n} from 'react-redux-i18n';
import {NavigateActions, AppActions} from '../../actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {AppBackgroundTypes, Config} from '../../constants';
import FloatingHelp from '../FloatingHelp';

class Welcome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentCarouselIndex: 0
    };
    this.onClickStartBetting = this.onClickStartBetting.bind(this);
    this.onCarouselChange = this.onCarouselChange.bind(this);
    this.onArrowLeftClick = this.onArrowLeftClick.bind(this);
    this.onArrowRightClick = this.onArrowRightClick.bind(this);
  }

  componentDidMount() {
    // Set app background to sports bg
    this.props.setAppBackground(AppBackgroundTypes.AUDIENCE_BG);
  }

  componentWillUnmount() {
    // Reset app background to gradient
    this.props.setAppBackground(AppBackgroundTypes.GRADIENT_BG);
  }

  onArrowLeftClick(event) {
    event.preventDefault();

    if (this.carousel) {
      this.carousel.refs.slick.slickPrev();
    }
  }

  onArrowRightClick(event) {
    event.preventDefault();
    event.preventDefault();

    if (this.carousel) {
      this.carousel.refs.slick.slickNext();
    }
  }

  renderCarouselChild(index) {
    let headerText, contentText, imageSource, imageWidth, imageHeight, type;

    switch (index) {
      case 0: {
        headerText = I18n.t('welcome.headerText1');
        contentText = I18n.t('welcome.contentText1');
        imageWidth = 300;
        imageHeight = 141;
        imageSource = onboardWelcomeImage;
        break;
      }

      case 1: {
        headerText = I18n.t('welcome.headerText2');
        contentText = I18n.t('welcome.contentText2');
        imageWidth = 300;
        imageHeight = 300;
        imageSource = onboardDepositImage;
        break;
      }

      case 2: {
        headerText = I18n.t('welcome.headerText3');
        contentText = I18n.t('welcome.contentText3');
        break;
      }

      case 3: {
        type = WelcomeCarouselChild.SINGLE_COLUMN_TYPE;
        contentText = I18n.t('welcome.contentText4');
        imageWidth = 92;
        imageHeight = 92;
        imageSource = onboardTickImage;
        break;
      }

      default:
        break;
    }

    return (
      <WelcomeCarouselChild
        type={ type }
        headerText={ headerText }
        contentText={ contentText }
        imageSource={ imageSource }
        imageWidth={ imageWidth }
        imageHeight={ imageHeight }
      />
    );
  }

  onCarouselChange(to) {
    this.setState({currentCarouselIndex: to});
  }

  //Navigate to the 'Home' screen after clicking on the 'Start Betting Now' button
  onClickStartBetting(e) {
    e.preventDefault();
    this.props.navigateTo('/betting/exchange');
  }
  render() {
    return (
      <div className='welcomeComponent'>
        <div className='welcomeHeader'>{I18n.t('welcome.getting_started')}</div>
        <div className='welcomeContent'>
          <Carousel
            ref={ (c) => (this.carousel = c) }
            className='bookieCarousel'
            afterChange={ this.onCarouselChange }
          >
            <div>{this.renderCarouselChild(0)}</div>
            {this.props.depositsEnabled ? <div>{this.renderCarouselChild(1)}</div> : null}
            <div>{this.renderCarouselChild(2)}</div>
            <div>{this.renderCarouselChild(3)}</div>
          </Carousel>
          {this.state.currentCarouselIndex !== 0 && (
            <a className='arrowLeft' onClick={ this.onArrowLeftClick }>Left</a>
          )}
          {this.state.currentCarouselIndex !== 3 && (
            <a className='arrowRight' onClick={ this.onArrowRightClick }>Right</a>
          )}
        </div>
        <button className='btn btn-regular startButton' onClick={ this.onClickStartBetting }>
          {I18n.t('welcome.start_betting_now')}
        </button>
        <FloatingHelp />
      </div>
    );
  }
}

Welcome.defaultProps = {
  depositsEnabled: Config.features.deposits
};

const mapStateToProps = () => ({
  // Manual Feature Overrides
  /*depositsEnabled: true*/
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    navigateTo: NavigateActions.navigateTo,
    setAppBackground: AppActions.setAppBackgroundAction
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Welcome);
