/**
 * AmountDropDown displays the available balance of the account and in-game balance.
 * In-game balance refers to the amount currently locked in both matched and unmatched bets.
 *
 * This widget used to be part of the top menu bar but it is now not in use.
 */
import React, { PureComponent } from 'react';
let I18n = require('react-redux-i18n').I18n;
import {
  Card,
  Row,
  Col
} from 'antd';

//TODO Rename this component in order to match the file name (or rename the file if appropriate)
class Amount extends PureComponent{

  renderAmount(amountTypeText,amount){
    return(
      <Col span={ 12 }>
        <div className='icon-main bitcoin-icon-main'>
          <p>
            { this.props.currencyFormat } { amount } <span> { I18n.t(amountTypeText) } </span>
          </p>
        </div>
      </Col>
    )
  }

  render(){
    return(
      <Card className={ this.props.cardClass } title={ I18n.t('topbar.account_balance') }>
        <Row>
          { this.renderAmount('topbar.available',this.props.availableBalance) }
          { this.renderAmount('topbar.in_game',this.props.inGameAmount) }
        </Row>
      </Card>
    )
  }
}

export default Amount;
