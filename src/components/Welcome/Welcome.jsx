import React, { Component } from 'react';
import { Carousel, Row, Col } from 'antd';
var I18n = require('react-redux-i18n').I18n;
export default React.createClass({
  render: function () {
    return(
      <div className='sportsbg' id='main-content'>
        <div className='welcomeComponent' >
          <div className='wrapper'>
            <div className='text-center'>
              <h3 className='text-center'>{I18n.t('welcome.getting_started')}</h3>
            </div>
            <div className='welcomeCarousel'>
              <Carousel className='bookie-carousel'>
                <div className='welcomeContent'>
                  <Row className='align-center' gutter='30' type='flex' align='center'>
                    <Col span={ 16 }>
                      <div className='simple-widget'>
                        <Row className='margin-tb-10'>
                          <Col  span={ 9 } push={ 15 }>
                            <Row>
                              <Col  span={ 12 } >
                                <p className='text-center'> 1 </p>
                              </Col>
                              <Col  span={ 12 }>
                                <p className='text-center'> 2 </p>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row type='flex' align='center' justify='center'>
                        <Col span={ 4 }>
                          Tomorrow,
                          22:00
                        </Col>
                        <Col span={ 11 }>
                          NY Giants vs Green Bay
                        </Col>
                        <Col span={ 9 }>
                          <Row type='flex' className='text-center'>
                            <Col span={ 6 } className='bg-lightblue'>
                              <p className='text-center'> 1.81 <span>  0.185 </span> </p>
                            </Col>
                            <Col span={ 6 } className='bg-lightgreen'>
                              <p className='text-center'> 1.81 <span>  0.185 </span> </p>
                            </Col>
                            <Col span={ 6 } className='bg-lightblue'>
                              <p className='text-center'> 1.81 <span>  0.185 </span> </p>
                            </Col>
                            <Col span={ 6 } className='bg-lightgreen'>
                              <p className='text-center'> 1.81 <span>  0.185 </span> </p>
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
                      <p  className='middle-content'>
                        {I18n.t('welcome.place_bet_desc')}
                      </p>
                    </Col>
                  </Row>
                </div>
                <div className='welcomeContent'>
                  <Row className='align-center' gutter='30' type='flex' align='center'>
                    <Col span={ 16 }>
                      <div className='simple-widget'>
                        <Row className='margin-tb-10'>
                          <Col  span={ 9 } push={ 15 }>
                            <Row>
                              <Col  span={ 12 } >
                                <p className='text-center'> 1 </p>
                              </Col>
                              <Col  span={ 12 }>
                                <p className='text-center'> 2 </p>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row type='flex' align='center' justify='center'>
                          <Col span={ 4 }>
                            Tomorrow,
                            22:00
                          </Col>
                          <Col span={ 11 }>
                            NY Giants vs Green Bay
                          </Col>
                          <Col span={ 9 }>
                            <Row type='flex' className='text-center'>
                              <Col span={ 6 } className='bg-lightblue'>
                                <p className='text-center'> 1.81 <span>  0.185 </span> </p>
                              </Col>
                              <Col span={ 6 } className='bg-lightgreen'>
                                <p className='text-center'> 1.81 <span>  0.185 </span> </p>
                              </Col>
                              <Col span={ 6 } className='bg-lightblue'>
                                <p className='text-center'> 1.81 <span>  0.185 </span> </p>
                              </Col>
                              <Col span={ 6 } className='bg-lightgreen'>
                                <p className='text-center'> 1.81 <span>  0.185 </span> </p>
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
                      <p  className='middle-content'>
                        {I18n.t('welcome.place_bet_desc')}
                      </p>
                    </Col>
                  </Row>
                </div>
                <div className='welcomeContent'>
                  <Row className='align-center' gutter='30' type='flex' align='center'>
                    <Col span={ 16 }>
                      <div className='simple-widget'>
                        <Row className='margin-tb-10'>
                          <Col  span={ 9 } push={ 15 }>
                            <Row>
                              <Col  span={ 12 } >
                                <p className='text-center'> 1 </p>
                              </Col>
                              <Col  span={ 12 }>
                                <p className='text-center'> 2 </p>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row type='flex' align='center' justify='center'>
                          <Col span={ 4 }>
                            Tomorrow,
                            22:00
                          </Col>
                          <Col span={ 11 }>
                            NY Giants vs Green Bay
                          </Col>
                          <Col span={ 9 }>
                            <Row type='flex' className='text-center'>
                              <Col span={ 6 } className='bg-lightblue'>
                                <p className='text-center'> 1.81 <span>  0.185 </span> </p>
                              </Col>
                              <Col span={ 6 } className='bg-lightgreen'>
                                <p className='text-center'> 1.81 <span>  0.185 </span> </p>
                              </Col>
                              <Col span={ 6 } className='bg-lightblue'>
                                <p className='text-center'> 1.81 <span>  0.185 </span> </p>
                              </Col>
                              <Col span={ 6 } className='bg-lightgreen'>
                                <p className='text-center'> 1.81 <span>  0.185 </span> </p>
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
                      <p  className='middle-content'>
                        {I18n.t('welcome.place_bet_desc')}
                      </p>
                    </Col>
                  </Row>
                </div>
                <div className='welcomeContent'>
                  <Row className='align-center' gutter='30' type='flex' align='center'>
                    <Col span={ 16 }>
                      <div className='simple-widget'>
                        <Row className='margin-tb-10'>
                          <Col  span={ 9 } push={ 15 }>
                            <Row>
                              <Col  span={ 12 } >
                                <p className='text-center'> 1 </p>
                              </Col>
                              <Col  span={ 12 }>
                                <p className='text-center'> 2 </p>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row type='flex' align='center' justify='center'>
                          <Col span={ 4 }>
                            Tomorrow,
                            22:00
                          </Col>
                          <Col span={ 11 }>
                            NY Giants vs Green Bay
                          </Col>
                          <Col span={ 9 }>
                            <Row type='flex' className='text-center'>
                              <Col span={ 6 } className='bg-lightblue'>
                                <p className='text-center'> 1.81 <span>  0.185 </span> </p>
                              </Col>
                              <Col span={ 6 } className='bg-lightgreen'>
                                <p className='text-center'> 1.81 <span>  0.185 </span> </p>
                              </Col>
                              <Col span={ 6 } className='bg-lightblue'>
                                <p className='text-center'> 1.81 <span>  0.185 </span> </p>
                              </Col>
                              <Col span={ 6 } className='bg-lightgreen'>
                                <p className='text-center'> 1.81 <span>  0.185 </span> </p>
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
                      <p  className='middle-content'>
                        {I18n.t('welcome.place_bet_desc')}
                      </p>
                    </Col>
                  </Row>
                </div>
              </Carousel>
            </div>
            <div className='registerComponent text-center'>
              <button className='btn btn-regular'> Start Betting now! </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
});