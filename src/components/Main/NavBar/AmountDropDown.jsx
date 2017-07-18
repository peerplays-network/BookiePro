import React, { PureComponent } from 'react';
let I18n = require('react-redux-i18n').I18n;
import {
  Card,
  Row,
  Col
} from 'antd';
class Amount extends PureComponent{
  render(){
    return(
      <Card className={ this.props.cardClass } title={ I18n.t('topbar.account_balance') }>
        <Row>
          <Col span={ 12 }>
            <p> { this.props.availableBalance } <span> { I18n.t('topbar.available') } </span> </p>
          </Col>
          <Col span={ 12 }>
            <p> { this.props.inGameAmount } <span> { I18n.t('topbar.in_game') } </span> </p>
          </Col>
        </Row>
      </Card>
    )
  }
}

export default Amount;
