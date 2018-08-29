import { BackingWidgetTypes } from '../constants';
import Immutable from 'immutable';

/**
 * getColumnSize()
 *
 * Depending on the type of the backingWidget (determined by the title),
 *  the UI needs to render the BM's in the widget on a column basis.
 *
 * The number of columns will vary from type to type with some overlap between
 *  widgets.
 *
 * @param {*} backingWidget
 * @returns - An integer containing the column size with respect to ant designs column layout.
 *
 * @note - Antd uses a 24 column layout. This function takes that into account. The calling function
 *  should be able to call this function like so <Col span={ getColumnSize(title) }>
 */
const getColumnSize = type => {
  if (type) {
    type = type.replace(/[\/\- ]/, '').toUpperCase();
  }

  switch (type) {
    case BackingWidgetTypes.MATCHODDS:
    case BackingWidgetTypes.MONEYLINE: {
      return 8; // Three Columns
    }
    case BackingWidgetTypes.OVERUNDER: {
      return 12; // Two Columns
    }
    default:
      return 6; // Four Columns
  }
};

/**
 * groupOverUnders()
 *
 * This function examines the bmgs passed in, and groups the bmgs that belong to the
 *  category over/under.
 *
 * @param {*} bettingMarketGroups -
 * @returns - A new list of wherein all over/under betting markets appear to live within a single BMG
 */
const groupOverUnders = bettingMarketGroups => {
  let overUnders = Immutable.Map();
  overUnders = overUnders.set('event_id', bettingMarketGroups.first().get('event_id'));
  overUnders = overUnders.set('asset_id', bettingMarketGroups.first().get('asset_id'));
  overUnders = overUnders.set('delay_before_settling', bettingMarketGroups.first().get('delay_before_settling'));
  overUnders = overUnders.set('description', 'Over/Under');
  overUnders = overUnders.set('total_matched_bets_amount', 0);
  overUnders = overUnders.set('bettingMarkets', Immutable.List());

  let overUnderBMs = [];

  let nonOverUnders = Immutable.Map();

  let newBettingMarketGroups = Immutable.List();

  const overUnder = 'over/under';

  // Iterate through the BMGs passed in
  bettingMarketGroups.forEach(bmg => {
    // Check the current BMG's description to see if it matches over/under
    let description = bmg.get('description').toLowerCase();
    if (description.includes(overUnder)) {
      // Add the list of BMs in the current BM to the list of over/unders
      for (let i = 0; i < bmg.get('bettingMarkets').length; i++) {
        overUnderBMs.push(bmg.get('bettingMarkets')[i]);
      }
    } else {
      nonOverUnders = bmg;
    }
  });

  overUnders = overUnders.set('bettingMarkets', overUnderBMs.sort());
  newBettingMarketGroups = newBettingMarketGroups.push(overUnders);
  newBettingMarketGroups = newBettingMarketGroups.push(nonOverUnders);
  return newBettingMarketGroups;
};

const SportsbookUtils = {
  getColumnSize,
  groupOverUnders,
};

export default SportsbookUtils;
