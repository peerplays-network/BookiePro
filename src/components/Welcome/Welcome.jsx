import React, { Component } from 'react';
import { Carousel } from 'antd';
import CarouselComponent1 from './CarouselComponent1'
import CarouselComponent2 from './CarouselComponent2'
import CarouselComponent3 from './CarouselComponent3'
var I18n = require('react-redux-i18n').I18n;
class Welcome extends Component{
  render() {
    return (
      <div className='sportsbg' id='main-content'>
        <div className='welcomeComponent'>
          <div className='wrapper'>
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
              <button className='btn btn-regular'> Start
                Betting now!
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Welcome;
