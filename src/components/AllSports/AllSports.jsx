import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AllSportsBanner } from '../Banners';
import { SimpleBettingWidget } from '../BettingWidgets';
import { AllSportsActions } from '../../actions';
import { LoadingStatus } from '../../constants';
import Immutable from 'immutable';
import { AllSportsSelector } from '../../selectors';

const MAX_EVENTS_PER_WIDGET = 3;
const { getData } = AllSportsActions;

class AllSports extends Component {
  constructor(props) {
    super(props);
    this.props.dispatch(getData());
  }

  render() {
    const { sports, currencyFormat } = this.props;
    return (
      <div id='all-sports-wrapper'>
        <AllSportsBanner />
        {
          // convert the list of keys into vanilla JS array so that I can grab the index
          sports.keySeq().toArray().map((sportId, idx) => {
            const sport = sports.get(sportId);
            const events = sport.get('events');
            return (
              <SimpleBettingWidget
                key={ idx }                   // required by React to have unique key
                title={ sport.get('name') }
                events={ events.slice(0, MAX_EVENTS_PER_WIDGET) }
                currencyFormat={ currencyFormat }
                showFooter={ events.size > MAX_EVENTS_PER_WIDGET }
                footerLink={ `/exchange/sport/${sportId}` }
                pagination={ false }          // No pagination, only show top records
              />
            )
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sports: AllSportsSelector.getAllSportsData(state)
  }
}

export default connect(mapStateToProps)(AllSports);
