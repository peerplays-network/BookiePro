/*
 *  Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 *  The MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

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

        //return name.indexOf(this.props.filter) !== -1;
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

        // switch (sortBy) {
        //     case 'name':
        //         if (a_account.get("name") > b_account.get("name")) {
        //             return inverseSort ? 1 : -1;
        //         } else if (a_account.get("name") < b_account.get("name")) {
        //             return inverseSort ? -1 : 1;
        //         } else {
        //             return 0;
        //         }
        //         break;
        //
        //     case "rank":
        //         return !inverseSort
        // ? ranks[b.get("id")] - ranks[a.get("id")]
        // : ranks[a.get("id")] - ranks[b.get("id")];
        //         break;
        //
        //     default:
        //         return !inverseSort
        // ? parseInt(b.get(sortBy), 10) - parseInt(a.get(sortBy), 10)
        // : parseInt(a.get(sortBy), 10) - parseInt(b.get(sortBy), 10);
        // }
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
