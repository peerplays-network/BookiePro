import React, { Component } from 'react';
// import { Collapse, Icon } from 'antd';
// import SplitPane from 'react-split-pane'
import InfinityMenu from "react-infinity-menu";
import "react-infinity-menu/src/infinity-menu.css";

import Node from './Node';
// const Panel = Collapse.Panel;
//https://www.bountysource.com/issues/30555786-having-trouble-with-search
// for customComponent doc : https://www.bountysource.com/issues/30555786-having-trouble-with-search
// good https://github.com/sitepoint-editors/immutable-redux-todo/blob/master/src/actions.js
class BetSlip extends Component {

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
				         name: "Menu1",
                 id: 0,
                 isOpen: false,
        customComponent: "Node",
        key: 'asdfsadfasdf',
				children: [
					{
						name: "SubMenu1-1",
						id: 0,
						isOpen: false,
						children: [
							{
								name: "Sub-SubMenu1-111",
								id: 0,
                children: [
    							{
    								name: "Sub-SubMenu1-1111-1",
    								id: 11,
                    customComponent: "Node",
    							},
                  {
    								name: "Sub-SubMenu1-1111-2",
    								id: 111
    							}
                ]
      },
      {
      name: "Sub-SubMenu1-2",
      id: 1
      },
      {
      name: "Sub-SubMenu1-3",
      id: 2
      },
      {
      name: "Sub-SubMenu1-4",
      id: 3
      },
      {
      name: "Sub-SubMenu1-5",
      id: 4
      },
      {
      name: "Sub-SubMenu1-6",
      id: 5
      },
      {
      name: "Sub-SubMenu1-7",
      id: 6
      },
      {
      name: "Sub-SubMenu1-8",
      id: 7
      },
      {
      name: "Sub-SubMenu1-9",
      id: 8
      },
      {
      name: "Sub-SubMenu1-99",
      id: 9
      },
      ]
      },
      {
      name: "SubMenu2-1",
      id: 1,
      children: [
      {
      name: "Sub-SubMenu2-1",
      id: 0
      }
      ]
      }
      ]
      },
      {
      name: "Menu2",
      id: 1,
      isOpen: false,
      children: [
      {
      name: "SubMenu2-1",
      id: 0
      },
      {
      name: "SubMenu2-2",
      id: 1
      },
      {
      name: "SubMenu2-3",
      id: 2
      }
      ]
      },
			{
				name: "Menu3",
				id: 2,
				isOpen: false,
				children: [
					{
						name: "SubMenu3-1",
						id: 0
					},
					{
						name: "SubMenu3-2",
						id: 1
					}
				]
			}
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

    // const customPanelStyle = {
    //     background: '#f7f7f7',
    //     borderRadius: 4,
    //     marginBottom: 24,
    //     border: 0,
    //   };


    var myComponentMappings = {
        "Node": Node
    }
    return (
      <div  style={ { width: '200px', 'height': '100%' } }>
        {/* <SplitPane split='vertical' minSize={ 150 } maxSize={ 300 } defaultSize={ 200 }> */}
          <InfinityMenu
              tree={ this.state.tree }
              onNodeMouseClick={ this.onNodeMouseClick.bind(this) }
              onLeafMouseClick={ this.onLeafMouseClick.bind(this) }/*optional*/
              onLeafMouseDown={ this.onLeafMouseDown.bind(this) }/*optional*/
              onLeafMouseUp={ this.onLeafMouseUp.bind(this) }/*optional*/
              customComponentMappings = {
                {
                  "Node" : Node
                }
              }
          />

          {/* </SplitPane> */}
      </div>
    );
  }
}

export default BetSlip;
