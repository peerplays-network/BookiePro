import React, { Component } from 'react';
import InfinityMenu from "react-infinity-menu";
import "react-infinity-menu/src/infinity-menu.css";

import BettingMarket from './BettingMarket';
import Event from './Event';
import EventGroup from './EventGroup';
import Sport from './Sport';

//https://www.bountysource.com/issues/30555786-having-trouble-with-search
// for customComponent doc : https://www.bountysource.com/issues/30555786-having-trouble-with-search
// good https://github.com/sitepoint-editors/immutable-redux-todo/blob/master/src/actions.js

// to update the keypath of isOpen
//http://stackoverflow.com/questions/41298577/how-to-get-altered-tree-from-immutable-tree-maximising-reuse-of-nodes
class TestNewSideBar extends Component {

  static callback(key) {
    window.console.log('callcack', key);
  }

  static deleteAllPanels(event) {
    event.preventDefault();
    // this stops the event from bubbling up to the Collapse header
    event.stopPropagation();
    window.console.log('clicked delete all panels', event);
  }


  componentWillMount() {
    const tree = [
      {
        name: "ALL SPORT", /*require*/
        id: '999', /*require*/
        isOpen: false, /*require*/
        customComponent: "Sport",
        children: []
      },
      {
        name: "American Football", /*require*/
        id: 1, /*require*/
        isOpen: false, /*require*/
        customComponent: "Sport",
        objectId: "1.A.111111",
        children: [
          {
            name: "NFL",
            id: 1,
            isOpen: false,
            customComponent: "EventGroup",
            objectId: "1.A.111111",
            children: [
              {
                name: "New England Patriots vs/n Pittsburgh Steelers",
                id: 1,
                isOpen: false,
                customComponent: "Event",
                objectId: "1.C.111111",
                children: [
                  {
                    name: "Moneyline",
                    id: 1,
                    customComponent: "BettingMarket",
                    objectId: "1.C.111111",
                  },
                  {
                    name: "Spread +/- 2.5",
                    id: 125,
                    customComponent: "BettingMarket",
                    objectId: "1.C.25",
                  },
                  {
                    name: "Spread +/- 5.5",
                    id: 155,
                    customComponent: "BettingMarket",
                    objectId: "1.C.55",
                  },
                  {
                    name: "Spread +/- 8.5",
                    id: 185,
                    customComponent: "BettingMarket",
                    objectId: "1.C.85",
                  },
                  {
                    name: "Over/Under 30.5",
                    id: 2305,
                    customComponent: "BettingMarket",
                    objectId: "1.C.85",
                  },
                  {
                    name: "Over/Under 40.5",
                    id: 2405,
                    customComponent: "BettingMarket",
                    objectId: "1.C.85",
                  },
                  {
                    name: "Over/Under 50.5",
                    id: 2505,
                    customComponent: "BettingMarket",
                    objectId: "1.C.85",
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
                    id: 1,
                    customComponent: "BettingMarket",
                    objectId: "1.C.111111",
                  },
                  {
                    name: "Spread +/- 2.5",
                    id: 125,
                    customComponent: "BettingMarket",
                    objectId: "1.C.25",
                  },
                  {
                    name: "Spread +/- 5.5",
                    id: 155,
                    customComponent: "BettingMarket",
                    objectId: "1.C.55",
                  },
                  {
                    name: "Spread +/- 8.5",
                    id: 185,
                    customComponent: "BettingMarket",
                    objectId: "1.C.85",
                  },
                  {
                    name: "Over/Under 30.5",
                    id: 2305,
                    customComponent: "BettingMarket",
                    objectId: "1.C.85",
                  },
                  {
                    name: "Over/Under 40.5",
                    id: 2405,
                    customComponent: "BettingMarket",
                    objectId: "1.C.85",
                  },
                  {
                    name: "Over/Under 50.5",
                    id: 2505,
                    customComponent: "BettingMarket",
                    objectId: "1.C.85",
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
                id: 1
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
            id: 1
          }
        ]
      },
      {
        name: "Basketball", /*require*/
        id: "1.C.111111", /*require*/
        isOpen: false, /*require*/
        customComponent: "Sport",
        children: []
      },
      {
        name: "Ice Hockey", /*require*/
        id: "1.C.11221111", /*require*/
        isOpen: false, /*require*/
        customComponent: "Sport",
        children: []
      },
    ];
		  this.setState({
  			tree: tree
  		});
  	}

  onNodeMouseClick(event, tree, node, level, keyPath) {
    this.setState({
      tree: tree
    });
  }

  onLeafMouseClick(event, leaf) {
    console.log( leaf.id ); // Prints the leaf id
    console.log( leaf.name ); // Prints the leaf name
  }

  onLeafMouseUp(event, leaf) {
    console.log( leaf.id ); // Prints the leaf id
    console.log( leaf.name ); // Prints the leaf name
  }

  onLeafMouseDown(event, leaf) {
    console.log( leaf.id ); // Prints the leaf id
    console.log( leaf.name ); // Prints the leaf name
  }


  render() {

    return (
          <InfinityMenu
              tree={ this.state.tree }
              onNodeMouseClick={ this.onNodeMouseClick.bind(this) }
              onLeafMouseClick={ this.onLeafMouseClick.bind(this) }/*optional*/
              onLeafMouseDown={ this.onLeafMouseDown.bind(this) }/*optional*/
              onLeafMouseUp={ this.onLeafMouseUp.bind(this) }/*optional*/
              customComponentMappings={
              {
                "Sport" : Sport,
                "EventGroup" : EventGroup,
                "Event" : Event,
                "BettingMarket" : BettingMarket
              }
            }
          />

    );
  }
}

export default TestNewSideBar;
