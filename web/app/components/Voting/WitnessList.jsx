import React from 'react';
import Translate from 'react-translate-component';
import WitnessRow from './WitnessRow';
import {connect} from 'react-redux';

@connect((state) => {
  return {
    current: state.voting.witnesses.currentWitnessId,
    activeWitnesseObjects: state.voting.witnesses.activeWitnesseObjects,
    activeWitnesseAccounts: state.voting.witnesses.activeWitnesseAccounts,
    sortBy: state.voting.witnesses.sortBy,
    inverseSort: state.voting.witnesses.inverseSort
  };
})
class WitnessListNew extends React.Component {

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.current !== this.props.current
    );
  }

  render() {
    let {inverseSort, activeWitnesseAccounts, activeWitnesseObjects} = this.props;
    let most_recent_aslot = 0;
    let ranks = {};
    let witnesses = activeWitnesseObjects;

    witnesses.sort((a, b) => {
      if (a && b) {
        return parseInt(b.total_votes, 10) - parseInt(a.total_votes, 10);
      }

      return null;
    }).forEach( (w, index) => {
      if (w) {
        let s = w.last_aslot;

        if( most_recent_aslot < s ) {
          most_recent_aslot = s;
        }

        ranks[w.id] = index + 1;
      }
    });

    let itemRows = null;

    if (witnesses.size > 0) {
      itemRows = witnesses.filter((a) => {
        if (!a) {
          return false;
        }

        let account = activeWitnesseAccounts.get(a.witness_account);

        if (!account) {
          return false;
        }

        let name = account.name;

        if (!name) {
          return false;
        }

        return true;
      }).sort((a, b) => {
        let a_account = activeWitnesseAccounts.get(a.witness_account);
        let b_account = activeWitnesseAccounts.get(b.witness_account);

        if (!a_account || !b_account) {
          return 0;
        }

        if (a_account.votes > b_account.votes) {
          return inverseSort ? 1 : -1;
        } else if (a_account.votes < b_account.votes) {
          return inverseSort ? -1 : 1;
        } else {
          return 0;
        }
      }).map((a) => {
        let a_account = activeWitnesseAccounts.get(a.witness_account);
        return (
          <WitnessRow
            key={ a.id }
            rank={ ranks[a.id] }
            witnessAccount={ a_account }
            witness={ a }
          />
        );
      });
    }

    return (
      <div className='table table2 table-voting-witnesses2'>
        <div className='table__head tableRow'>
          <div className='tableCell'><Translate content='witnesses.rank'/></div>
          <div className='tableCell'><Translate content='votes.name'/></div>
          <div className='tableCell text_r'><Translate content='witnesses.last_block'/></div>
          <div className='tableCell text_r'><Translate content='witnesses.last_confirmed'/></div>
          <div className='tableCell text_r'><Translate content='witnesses.missed'/></div>
          <div className='tableCell text_r'><Translate content='votes.votes'/></div>
        </div>
        <div className='table__body'>
          {itemRows}
        </div>
      </div>
    );
  }
}

export default WitnessListNew;
