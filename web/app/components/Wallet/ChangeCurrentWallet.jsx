import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import Translate from 'react-translate-component';
import {changeCurrentWallet} from 'actions/RWalletActions';

const mapStateToProps = (state) => {
  return {
    newWallet: state.wallet.newWallet,
    currentWallet: state.wallet.currentWallet,
    walletNames: state.wallet.walletNames
  };
};

@connect(mapStateToProps, {changeCurrentWallet})
export default class ChangeCurrentWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWallet: this.props.currentWallet
    };
  }

  render() {
    var options = [];

    this.props.walletNames.forEach((walletName) => {
      options.push(
        <option key={ walletName } value={ walletName }>{walletName.toLowerCase()}</option>
      );
    });

    var isDirty = this.state.currentWallet !== this.props.currentWallet;

    return (
      <div>
        <section className='block-list'>
          <header><Translate content='wallet.active_wallet'/>:</header>

          <ul>
            <li className='with-dropdown'>
              {this.props.walletNames.count() <= 1
                ? <div style={ {
                  paddingLeft: 10
                } }>{this.state.currentWallet}</div>
                : (
                  <select
                    value={ this.state.currentWallet }
                    onChange={ this.onChange.bind(this) }>
                    {options}
                  </select>
                )}
            </li>
          </ul>
        </section>

        <Link to='wallet/create'>
          <div className='button outline'><Translate content='wallet.new_wallet'/></div>
        </Link>

        {isDirty
          ? (
            <div
              className='button outline'
              onClick={ this.onConfirm.bind(this) }>
              <Translate content='wallet.change' name={ this.state.currentWallet }/>
            </div>
          )
          : null}
      </div>
    );
  }

  onConfirm() {
    this.props.changeCurrentWallet(this.state.currentWallet);

    if (window.electron) {
      window.location.hash = '';
      window.remote.getCurrentWindow().reload();
    } else {
      window.location.href = '/';
    }
  }

  onChange(event) {
    var currentWallet = event.target.value;
    this.setState({currentWallet});
  }
}