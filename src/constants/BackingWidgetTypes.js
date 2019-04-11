const orderPriority = {
  TOP: 0,
  MIDDLE: 5,
  BOTTOM: 10,
};

// This constant object maps onto BMG descriptions produced by BOS
const BackingWidgetTypes = {
  MATCHODDS: 'MATCHODDS',
  MONEYLINE: 'MONEYLINE',
  OVERUNDER: 'OVERUNDER',
};

const BackingWidgetLayouts = {
  MATCHODDS: {
    columns: {
      eventFlag: 6,
      default: 8
    },
    order: orderPriority.TOP, // Highest Priority, always show on the top.
    numberOfMarkets: 3,
  },
  MONEYLINE: {
    columns: {
      eventFlag: 7,
      default: 12
    },
    order: orderPriority.TOP, // Highest Priority, always show on the top.
  },
  OVERUNDER: {
    columns: {
      eventFlag: 12,
      default: 12
    },
    order: orderPriority.MIDDLE, // Middle priority, show below the top.
  },
};

export {BackingWidgetTypes, BackingWidgetLayouts};
