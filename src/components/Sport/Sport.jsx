import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SportBanner } from '../Banners';
import { SimpleBettingWidget } from '../BettingWidgets';
import { SportPageActions } from '../../actions';
import { SportPageSelector } from '../../selectors';

const MAX_EVENTS_PER_WIDGET = 10;
const { getData } = SportPageActions;

class Sport extends PureComponent {
  constructor(props) {
    super(props);
    this.props.dispatch(getData(props.params.objectId));
  }

  render() {
    const { sportName, sportPageData, currencyFormat } = this.props;
    return (
      <div className='sport-wrapper'>
        <SportBanner sport={ sportName }/>
        {
          // convert the list of keys into vanilla JS array so that I can grab the index
          sportPageData.map((eventGroupData) => {
            const eventGroupId = eventGroupData.get('event_group_id');
            const events = eventGroupData.get('events');
            return (
              <SimpleBettingWidget
                sportName={ sportName }

                key={ eventGroupId }                    // required by React to have unique key
                title={ eventGroupData.get('name') }
                events={ events.slice(0, MAX_EVENTS_PER_WIDGET) }
                currencyFormat={ currencyFormat }
                showFooter={ events.size > MAX_EVENTS_PER_WIDGET }
                footerLink={ `/exchange/eventgroup/${eventGroupId}` }
                pagination={ false }          // No pagination, only show top records
              />
            );
          })
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    sportName: SportPageSelector.getSportName(state, ownProps),
    sportPageData: SportPageSelector.getSportPageData(state, ownProps)
  };
}

export default connect(mapStateToProps)(Sport);
