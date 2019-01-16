import React from 'react';
import {Link} from 'react-router';
import ChainTypes from '../Utility/ChainTypes';
import BindToChainState from '../Utility/BindToChainState';

@BindToChainState()
class LinkToAccountById extends React.Component {
  static propTypes = {
    account: ChainTypes.ChainObject.isRequired,
    subpage: React.PropTypes.string.isRequired
  };

  static defaultProps = {
    subpage: 'overview'
  };

  shouldComponentUpdate(nextProps) {
    let returnValue = true;

    if (
      nextProps.account.get('name') &&
      this.props.account.get('name') &&
      nextProps.account.get('name') === this.props.account.get('name')
    ) {
      returnValue = false;
    }

    return returnValue;
  }

  render() {
    let account_name = this
      .props
      .account
      .get('name');

    if (!account_name) {
      return (
        <span>
          {this.props.account.get('id')}
        </span>
      );
    } else {
      // TODO handle account already existing better.
      // console.log( "account_name exists: ", this.props.account.get("id"),
      // this.props.account.get("name") );
    }

    return (
      <Link onClick={ this.props.onClick ? this.props.onClick : () => {} }>
        {account_name}
      </Link>
    );
  }
}

export default LinkToAccountById;
