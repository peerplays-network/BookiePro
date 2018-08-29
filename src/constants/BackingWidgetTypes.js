const orderPriority = {
  TOP: 0,
  MIDDLE: 5,
  BOTTOM: 10,
};

const BackingWidgetTypes = {
  MATCHODDS: 'MATCHODDS',
  MONEYLINE: 'MONEYLINE',
  OVERUNDER: 'OVERUNDER',
};

const BackingWidgetLayouts = {
  MATCHODDS: {
    columns: 8, // 3 Columns
    order: orderPriority.TOP, // Highest Priority, always show on the top.
    numberOfMarkets: 3,
  },
  MONEYLINE: {
    columns: 12, // 3 Columns
    order: orderPriority.TOP, // Highest Priority, always show on the top.
  },
  OVERUNDER: {
    columns: 12, // 2 Columns
    order: orderPriority.MIDDLE, // Middle priority, show below the top.
  },
};

export { BackingWidgetTypes, BackingWidgetLayouts };
