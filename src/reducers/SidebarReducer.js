import { ActionTypes } from '../constants';
// import { fromJS } from 'immutable';

let initialState = {
  //PLEASE DO NOT REMOVE THIS !!!!
  complete_tree: [
    {
      name: "ALL SPORTS", /*require for menu lib */
      id: "0", /*require for menu lib */
      isOpen: false, /*optional for menu lib */
      isSelected: false, /*optional for node component  */
      customComponent: "Sport",  /*require for custom component*/
      objectId: "0",
      children: []  /*require for TreeUtil.js*/
    },
    {
      name: "American Football", /*require*/
      id: "1.A.85", /*require*/
      customComponent: "Sport",
      objectId: "1.A.85",
      children: [
        {
          name: "NFL",
          id: "1.B.85",
          customComponent: "EventGroup",
          objectId: "1.B.85",
          children: [
            {
              name: "New England Patriots vs/n Pittsburgh Steelers",
              id: "1.C.85",
              customComponent: "Event",
              objectId: "1.C.85",
              children: [
                {
                  name: "Moneyline",
                  id: "1.D.111111EventGroup",
                  customComponent: "BettingMarketGroup",
                  objectId: "1.D.111111EventGroup",
                  children: []
                },
                {
                  name: "Spread +/- 2.5",
                  id: "1.D.25EventGroup",
                  customComponent: "BettingMarketGroup",
                  objectId: "1.D.25EventGroup",
                  children: []
                },
                {
                  name: "Spread +/- 5.5",
                  id: "1.D.55EventGroup",
                  customComponent: "BettingMarketGroup",
                  objectId: "1.D.55EventGroup",
                  children: []
                },
                {
                  name: "Spread +/- 8.5",
                  id: "1.D.854EventGroup",
                  customComponent: "BettingMarketGroup",
                  objectId: "1.D.854EventGroup",
                  children: []
                },
                {
                  name: "Over/Under 30.5",
                  id: "1.D.85dEventGroup",
                  customComponent: "BettingMarketGroup",
                  objectId: "1.D.85dEventGroup",
                  children: []
                },
                {
                  name: "Over/Under 40.5",
                  id: "1.D.856EventGroup",
                  customComponent: "BettingMarketGroup",
                  objectId: "1.D.856EventGroup",
                  children: []
                },
                {
                  name: "Over/Under 50.5",
                  id: "1.D.85EventGroup",
                  customComponent: "BettingMarketGroup",
                  objectId: "1.D.85EventGroup",
                  children: []
                }
              ]
            },
            {
              name: "Houston Texans vs Tampa Bay Buccaneers",
              id: "1.C.111111",
              customComponent: "Event",
              objectId: "1.C.111111",
              children: [
                {
                  name: "Moneyline",
                  id: "1.D.111111111111",
                  customComponent: "BettingMarketGroup",
                  objectId: "1.D.111111111111",
                  children: []
                },
                {
                  name: "Spread +/- 2.5",
                  id: "1.D.25",
                  customComponent: "BettingMarketGroup",
                  objectId: "1.D.25",
                  children: []
                },
                {
                  name: "Spread +/- 5.5",
                  id: "1.D.55",
                  customComponent: "BettingMarketGroup",
                  objectId: "1.D.55",
                  children: []
                },
                {
                  name: "Spread +/- 8.5",
                  id: "1.D.85",
                  customComponent: "BettingMarketGroup",
                  objectId: "1.D.85",
                  children: []
                },
                {
                  name: "Over/Under 30.5",
                  id: "1.D.853853",
                  customComponent: "BettingMarketGroup",
                  objectId: "1.D.853853",
                  children: []
                },
                {
                  name: "Over/Under 40.5",
                  id: "1.D.853",
                  customComponent: "BettingMarketGroup",
                  objectId: "1.D.853",
                  children: []
                },
                {
                  name: "Over/Under 50.5",
                  id: "1.D.8544",
                  customComponent: "BettingMarketGroup",
                  objectId: "1.D.8544",
                  children: []
                }
              ]
            }
          ]
        },
        {
          name: "NCAA",
          id: "1.B.112211",
          isOpen: false,
          customComponent: "EventGroup",
          objectId: "1.B.112211",
          children: [
            {
              name: "item2-1 vs item asdfasdf asdflkasjdfsa",
              id: "1.C.85454",
              customComponent: "Event",
              objectId: "1.C.85454",
              children: []

            }
          ]
        }
      ]
    },
    {
      name: "Baseball", /*require*/
      id: "1.A.805", /*require*/
      customComponent: "Sport",
      objectId: "1.A.805",
      children: [
        {
          name: "EventGroup Wrold cup-1",
          id: "1.B.1992211",
          customComponent: "EventGroup",
          objectId: "1.B.1992211",
          children: []

        }
      ]
    },
    {
      name: "Basketball", /*require*/
      id: "1.A.8054", /*require*/
      customComponent: "Sport",
      objectId: "1.A.8054",
      children: []
    },
    {
      name: "Ice Hockey", /*require*/
      id: "1.A.805400", /*require*/
      customComponent: "Sport",
      objectId: "1.A.805400",
      children: []
    },
  ],
  display_tree: null,
  objectId: null,
  level: null,
};

export default function (state = initialState, action) {
  switch(action.type) {

    case ActionTypes.UPDATE_SIDEBAR_COMPLETE_TREE: {
      return Object.assign({}, state, {
        complete_tree: action.complete_tree,

      });
    }




    default:
      return state;
  }
}
