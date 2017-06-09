import React, { PureComponent } from 'react';
import { Carousel } from 'antd';
import CarouselComponent1 from './CarouselComponent1'
import CarouselComponent2 from './CarouselComponent2'
import CarouselComponent3 from './CarouselComponent3'
var I18n = require('react-redux-i18n').I18n;
import { NavigateActions, AppActions } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AppBackgroundTypes } from '../../constants';

class Welcome extends PureComponent{
  constructor(props){
    super(props);
    this.onClickStartBetting = this.onClickStartBetting.bind(this);
  }

  componentDidMount() {
    // Set app background to sports bg
    this.props.setAppBackground(AppBackgroundTypes.FIELD_BG);
  }

  componentWillUnmount() {
    // Reset app background to gradient
    this.props.setAppBackground(AppBackgroundTypes.GRADIENT_BG);
  }

  //Navigate to the 'Home' screen after clicking on the 'Start Betting Now' button
  onClickStartBetting(e) {
    e.preventDefault();
    this.props.navigateTo('/exchange');
  }
  render() {
    return (
      <div className='onboardingSportsBackground welcomeComponent wrapper'>
        <div className='text-center'>
          <h3
            className='text-center'>{I18n.t('welcome.getting_started')}</h3>
        </div>
        <div className='welcomeCarousel'>
          <Carousel className='bookie-carousel'>
            <div> <CarouselComponent1/> </div>
            <div> <CarouselComponent2/> </div>
            <div> <CarouselComponent3/> </div>
          </Carousel>
        </div>
        <div className='registerComponent text-center'>
          <button className='btn btn-regular' onClick={ this.onClickStartBetting }>
            {I18n.t('welcome.start_betting_now')}
          </button>
        </div>
      </div>
    )
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    navigateTo: NavigateActions.navigateTo,
    setAppBackground: AppActions.setAppBackgroundAction,
  }, dispatch);
}
export default connect(null, mapDispatchToProps)(Welcome)
