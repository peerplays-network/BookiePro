import React, {Component} from 'react';
import {Row, Col} from 'antd';
let I18n = require('react-redux-i18n').I18n;


class CarouselComponent1 extends Component {
  render() {
    return (
      <div className='welcomeContent'>
          <Row className='align-center' gutter={ 46 }
               type='flex' align='center'>
            <Col span={ 16 }>
              <div className='simple-widget'>
                <Row className='margin-tb-10'>
                  <Col span={ 9 } push={ 15 }>
                    <Row>
                      <Col span={ 12 }>
                        <p className='text-center'>
                          1 </p>
                      </Col>
                      <Col span={ 12 }>
                        <p className='text-center'>
                          2 </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row type='flex' align='center'
                     justify='center'>
                  <Col span={ 4 }>
                    Tomorrow,
                    22:00
                  </Col>
                  <Col span={ 11 }>
                    NY Giants vs Green Bay
                  </Col>
                  <Col span={ 9 }>
                    <Row type='flex'
                         className='text-center'>
                      <Col span={ 6 }
                           className='bg-lightblue'>
                        <p className='text-center'>
                          1.81 <span> <i className='icon-bitcoin-white'></i>  0.185 </span>
                        </p>
                      </Col>
                      <Col span={ 6 }
                           className='bg-lightgreen'>
                        <p className='text-center'>
                          1.81 <span>  <i className='icon-bitcoin-white'></i>  0.185 </span>
                        </p>
                      </Col>
                      <Col span={ 6 }
                           className='bg-lightblue'>
                        <p className='text-center'>
                          1.81 <span>  <i className='icon-bitcoin-white'></i>  0.185 </span>
                        </p>
                      </Col>
                      <Col span={ 6 }
                           className='bg-lightgreen'>
                        <p className='text-center'>
                          1.81 <span>  <i className='icon-bitcoin-white'></i>  0.185 </span>
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col span={ 8 }>
              <h4>
                {I18n.t('welcome.place_bet')}
              </h4>
              <p className='middle-content'>
                {I18n.t('welcome.place_bet_desc')}
              </p>
            </Col>
          </Row>
        </div>
    )
  }
}

export default CarouselComponent1;