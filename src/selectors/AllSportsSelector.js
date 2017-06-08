import CommonSelector from './CommonSelector';
import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { LoadingStatus } from '../constants';

const {
  getBettingMarketsById,
  getSportsById,
  getActiveEventsBySportId,
  getSimpleBettingWidgetBinnedOrderBooksByEventId
} = CommonSelector;

const getAllSportsLoadingStatus = (state) => state.getIn(['allSports', 'loadingStatus']);


const getAllSportsData = createSelector(
  [
    getAllSportsLoadingStatus,
    getSportsById,
    getActiveEventsBySportId,
    getBettingMarketsById,
    getSimpleBettingWidgetBinnedOrderBooksByEventId
  ],
  (allSportsLoadingStatus, sportsById, activeEventsBySportId, bettingMarketsById, simpleBettingWidgetBinnedOrderBooksByEventId) => {
    // Process all sports data only if the necessary data has been finished loaded
    // NOTE if you do not want to see incremental update, re-enable this if clause
    // if (allSportsLoadingStatus !== LoadingStatus.DONE) {
    //   return Immutable.Map();
    // }

    let allSportsData = Immutable.Map();
    // Create a map using sport id as keys
    sportsById.forEach((sport) => {
      // Initialize sport node
      let sportNode = Immutable.Map().set('name', sport.get('name'));

      // Create event nodes based on active events
      const activeEvents = activeEventsBySportId.get(sport.get('id')) || Immutable.List();
      const eventNodes = activeEvents.map((event) => {
        const offers = simpleBettingWidgetBinnedOrderBooksByEventId.get(event.get('id')) || Immutable.List();
        // Find the MoneyLine Betting Market Group of this event
        const moneylineBettingMarketId = offers.getIn(['0', 'betting_market_id']);
        const moneylineBettingMarketGroupId = bettingMarketsById.getIn([moneylineBettingMarketId, 'betting_market_group_id']);
        // Create event node
        return Immutable.fromJS({
          event_id: event.get('id'),
          event_name: event.get('name'),
          time: event.get('start_time'),
          offers,
          moneyline: moneylineBettingMarketGroupId,
        });
      });
      // Set events to the sport
      sportNode = sportNode.set('events', eventNodes);
      // Set sport to the all sports data
      allSportsData = allSportsData.set(sport.get('id'), sportNode);
    });

    return allSportsData;
  }
)

const AllSportsSelector = {
  getAllSportsData
}

export default AllSportsSelector;
