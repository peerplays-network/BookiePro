import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SimpleBettingWidget } from '../BettingWidgets';
import { AllSportsActions } from '../../actions';
import { AllSportsSelector, QuickBetDrawerSelector } from '../../selectors';
import PeerPlaysLogo from '../PeerPlaysLogo';
import moment from 'moment';

const MAX_EVENTS_PER_WIDGET = 3;
const { getData } = AllSportsActions;

class AllSports extends PureComponent {
  componentDidMount() {
    this.props.dispatch(getData());
  }

  render() {
    const { allSportsData, currencyFormat } = this.props;
    return (
      <div id='all-sports-wrapper'>
        {
          allSportsData.map((sportData) => {
            const sportId = sportData.get('sport_id');
            const events = sportData.get('events');
            const sportName = sportData.get('name');
            let sortedEvents = [];
            // Sort by event time
            sortedEvents = events.sort((a, b) => {
              let timeA = moment(a.get('time'));
              let timeB = moment(b.get('time'));
              if (timeA.isBefore(timeB)) { return -1; }
              if (timeA.isAfter(timeB)) { return 1; }
              return 0;
            })
            return (
              events.size > 0 &&
              <SimpleBettingWidget
                sportName={ sportName }
                key={ sportId }                   // required by React to have unique key
                title={ sportData.get('name') }
                events={ sortedEvents.slice(0, MAX_EVENTS_PER_WIDGET) }
                currencyFormat={ currencyFormat }
                showFooter={ events.size > MAX_EVENTS_PER_WIDGET }
                footerLink={ `/exchange/sport/${sportId}` }
                pagination={ false }          // No pagination, only show top records
                canCreateBet={ this.props.canCreateBet }
              />
            )
          })
        }
        <div className='margin-top-18 logo-container'>
          <PeerPlaysLogo />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allSportsData: AllSportsSelector.getAllSportsData(state),
    canCreateBet: QuickBetDrawerSelector.canAcceptBet(state),
  }
}

export default connect(mapStateToProps)(AllSports);
