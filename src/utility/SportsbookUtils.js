import { BackingWidgetTypes, BackingWidgetLayouts } from '../constants/BackingWidgetTypes';
import Immutable from 'immutable';

const getDescriptionAsType = description => description.replace(/[\/\- ]/, '').toUpperCase();

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
    type = getDescriptionAsType(type);
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

/**
 * centerTheDraw()
 *
 * With respect to Match Odds, there are 3 betting markets, not just win and lose.
 *  "The Draw" needs to come second, or in the middle, with respect to the two other teams.
 *
 * @param {*} bettingMarketGroup - The bettingMarketGroup containing the two teams and a draw bm
 * @returns - The bettingMarketGroup wherein the draw lives in the [1] element of the list
 */
const centerTheDraw = bettingMarketGroup => {
  let bettingMarkets = bettingMarketGroup.get('bettingMarkets');
  const description = getDescriptionAsType(bettingMarketGroup.get('description'));

  // If there is not the correct number of markets within the BMG, then return the original object
  if (bettingMarkets.length !== BackingWidgetLayouts[description].numberOfMarkets) {
    return bettingMarketGroup;
  }

  // Find the index that the draw is in
  let drawIndex = -1;
  bettingMarkets.forEach((bm, index) => {
    if (bm.get('description').replace(/\s/g, '').toUpperCase() === 'THEDRAW') {
      drawIndex = index;
    }
  });

  // If the draw is not in the middle. Swap it with the middle index.
  if (drawIndex !== 1) {
    let temp = bettingMarkets[1];
    bettingMarkets[1] = bettingMarkets[drawIndex];
    bettingMarkets[drawIndex] = temp;
  }

  bettingMarketGroup = bettingMarketGroup.set('bettingMarkets', bettingMarkets);

  return bettingMarketGroup;
};

/**
 * prioritySort()
 *
 * Priority sort uses the layout priorities defined in the constant BackingWidgetLayouts to order
 *  the bettingMarketGroups inside of the bettingMarketGroups list.
 *
 * @param {*} bettingMarketGroups - An Immutable list containing bettingMarketGroups
 * @returns - A listed sorted by the priorities defined in BackingWidgetLayouts
 */
const prioritySort = bettingMarketGroups => {
  bettingMarketGroups = bettingMarketGroups.sort((a, b) => {
    let typeA = getDescriptionAsType(a.get('description'));
    let typeB = getDescriptionAsType(b.get('description'));

    return BackingWidgetLayouts[typeA].order > BackingWidgetLayouts[typeB].order;
  });
  return bettingMarketGroups;
};

/**
 * isMatchOdds()
 *
 * This function will determine if the betting market group is a match odds betting market group
 *
 * @param {*} bettingMarketGroup - The betting market group in question.
 * @returns - True if the bmg is a match odds bmg. False otherwise.
 */
const isMatchodds = bettingMarketGroup => {
  const description = getDescriptionAsType(bettingMarketGroup.get('description'));
  if (description === BackingWidgetTypes.MATCHODDS) {
    return true;
  }
  return false;
};

const SportsbookUtils = {
  getColumnSize,
  groupOverUnders,
  prioritySort,
  centerTheDraw,
  isMatchodds,
  getDescriptionAsType,
};

export default SportsbookUtils;
