import React, {Component} from 'react';
let I18n = require('react-redux-i18n').I18n;
import {
  Card,
  Row,
  Col
} from 'antd';
class Amount extends Component{
  render(){
    return(
      <Card className={ this.props.cardClass }>
        <Row>
          <Col span={ 12 }>
            <p> 1.133006 <span> { I18n.t('topbar.available') } </span> </p>
          </Col>
          <Col span={ 12 }>
            <p> 0.001 <span> { I18n.t('topbar.in_game') } </span> </p>
          </Col>
        </Row>
      </Card>
    )
  }
}

export default Amount;