import { ActionTypes } from '../constants';
import { fromJS } from 'immutable';

let initialState = {
  complete_tree: [
    {
      name: "ALL SPORTS", /*require*/
      id: 999, /*require*/
      isOpen: false, /*require*/
      customComponent: "Sport",
      children: []
    },
    {
      name: "American Football", /*require*/
      id: 1101111, /*require*/
      isOpen: false, /*require*/
      customComponent: "Sport",
      objectId: "1.A.111111",
      children: [
        {
          name: "NFL",
          id: 12222,
          isOpen: false,
          customComponent: "EventGroup",
          objectId: "1.A.111111",
          children: [
            {
              name: "New England Patriots vs/n Pittsburgh Steelers",
              id: 13333,
              isOpen: false,
              customComponent: "Event",
              objectId: "1.C.111111",
              children: [
                {
                  name: "Moneyline",
                  id: 1,
                  customComponent: "BettingMarket",
                  objectId: "1.D.111111",
                  children: []
                },
                {
                  name: "Spread +/- 2.5",
                  id: 125,
                  customComponent: "BettingMarket",
                  objectId: "1.D.25",
                  children: []
                },
                {
                  name: "Spread +/- 5.5",
                  id: 155,
                  customComponent: "BettingMarket",
                  objectId: "1.D.55",
                  children: []
                },
                {
                  name: "Spread +/- 8.5",
                  id: 185,
                  customComponent: "BettingMarket",
                  objectId: "1.D.85",
                  children: []
                },
                {
                  name: "Over/Under 30.5",
                  id: 2305,
                  customComponent: "BettingMarket",
                  objectId: "1.C.85",
                  children: []
                },
                {
                  name: "Over/Under 40.5",
                  id: 2405,
                  customComponent: "BettingMarket",
                  objectId: "1.D.856",
                  children: []
                },
                {
                  name: "Over/Under 50.5",
                  id: 2505,
                  customComponent: "BettingMarket",
                  objectId: "1.D.856",
                  children: []
                }
              ]
            },
            {
              name: "Houston Texans vs Tampa Bay Buccaneers",
              id: 2,
              customComponent: "Event",
              objectId: "1.C.111111",
              children: [
                {
                  name: "Moneyline",
                  id: 1444,
                  customComponent: "BettingMarket",
                  objectId: "1.C.111111",
                  children: []
                },
                {
                  name: "Spread +/- 2.5",
                  id: 125,
                  customComponent: "BettingMarket",
                  objectId: "1.C.25",
                  children: []
                },
                {
                  name: "Spread +/- 5.5",
                  id: 155,
                  customComponent: "BettingMarket",
                  objectId: "1.C.55",
                  children: []
                },
                {
                  name: "Spread +/- 8.5",
                  id: 185,
                  customComponent: "BettingMarket",
                  objectId: "1.C.85",
                  children: []
                },
                {
                  name: "Over/Under 30.5",
                  id: 2305,
                  customComponent: "BettingMarket",
                  objectId: "1.C.853",
                  children: []
                },
                {
                  name: "Over/Under 40.5",
                  id: 2405,
                  customComponent: "BettingMarket",
                  objectId: "1.C.853",
                  children: []
                },
                {
                  name: "Over/Under 50.5",
                  id: 2505,
                  customComponent: "BettingMarket",
                  objectId: "1.C.8544",
                  children: []
                }
              ]
            }
          ]
        },
        {
          name: "NCAA",
          id: 2,
          isOpen: true,
          customComponent: "EventGroup",
          children: [
            {
              name: "item2-1",
              id: 11111,
              customComponent: "Event",
              children: []

            }
          ]
        }
      ]
    },
    {
      name: "Baseball", /*require*/
      id: 2, /*require*/
      isOpen: false, /*require*/
      customComponent: "Sport",
      children: [
        {
          name: "item3-1",
          id: 1,
          customComponent: "EventGroup",
          children: []

        }
      ]
    },
    {
      name: "Basketball", /*require*/
      id: 111, /*require*/
      isOpen: false, /*require*/
      customComponent: "Sport",
      children: []
    },
    {
      name: "Ice Hockey", /*require*/
      id: 13311, /*require*/
      isOpen: false, /*require*/
      customComponent: "Sport",
      children: []
    },
  ],
  display_tree: null,
  level: 'BettingMarket',
  objectId: '1.D.111111'
};

export default function (state = initialState, action) {
  switch(action.type) {

    case ActionTypes.UPDATE_SIDEBAR_COMPLETE_TREE: {
      return Object.assign({}, state, {
        complete_tree: action.complete_tree,

      });
    }

    case ActionTypes.UPDATE_SIDEBAR_HIGHLIGHT: {
      return Object.assign({}, state, {
        level: action.level,
        object_id: action.object_id

      });
    }

    default:
      return state;
  }
}
