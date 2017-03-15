import React, { Component } from 'react';
import InfinityMenu from "react-infinity-menu";
import "react-infinity-menu/src/infinity-menu.css";
import Immutable from 'immutable';

import BettingMarketGroup from './BettingMarketGroup';
import Event from './Event';
import EventGroup from './EventGroup';
import Sport from './Sport';

// import NavigateActions from '../../actions/NavigateActions';
import { push } from 'react-router-redux';
import { connect } from 'react-redux'

import { findKeyPathOf, differences } from '../../utility/TreeUtils'

//http://stackoverflow.com/questions/33479866/js-change-object-inside-array-in-for-each-loop

//https://www.toptal.com/react/react-redux-and-immutablejs
//http://thomastuts.com/blog/immutable-js-101-maps-lists.html

// for customComponent in InfinityMenu : https://www.bountysource.com/issues/30555786-having-trouble-with-search

class SideBar extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount() {
		  this.setState({
  			tree: this.props.completeTree
  		});
    this.updateSider = this.updateSider.bind(this);
	 }

  componentDidMount(){
    this.updateSider(this.props.completeTree, this.props.objectId);

  }
  componentWillReceiveProps(nextProps) {
    this.updateSider(nextProps.completeTree, nextProps.objectId);
  }

  updateSider(completeTree, targetObjectId) {
      //to use immutable-js to update tree
      //http://stackoverflow.com/questions/41298577/how-to-get-altered-tree-from-immutable-tree-maximising-reuse-of-nodes?rq=1
    const nested = Immutable.fromJS(completeTree);

    if ( targetObjectId){
      var keyPath = findKeyPathOf(nested, 'children', (node => node.get('objectId') === targetObjectId) );
      // console.log('keyPath: ', keyPath); //[1, "children", 0, "children", 0, "children", 4]


      // Found path?
      if (keyPath) {
        var newTree = nested;
          // Sample code Set 'name' to 'Hello' in that node:
        // var newTree = nested.updateIn(keyPath, node =>
        //   node.set('name', 'Hello')
        //   .set('isOpen', true)
        // );

          //for sport
        if ( keyPath.length === 1){
          newTree = newTree.updateIn(keyPath.slice(0,1), node =>
            node.set('isSelected', true)
            .set('isOpen', true)
          );
        }

          //for event group
        else if ( keyPath.length === 3){
          newTree = newTree.updateIn(keyPath.slice(0,1), node =>
            node.set('isSelected', true)
            .set('isOpen', true)
          ).updateIn(keyPath.slice(0,3), node =>
            node.set('isSelected', true)
            .set('isOpen', true)
          );



        }

          //for event
        else if ( keyPath.length === 5){
          newTree = newTree.updateIn(keyPath.slice(0,1), node =>
            node.set('isOpen', true)
          ).updateIn(keyPath.slice(0,3), node =>
            node.set('isSelected', true)
            .set('isOpen', true)
          ).updateIn(keyPath.slice(0,5), node =>
            node.set('isSelected', true)
            .set('isOpen', true)
          );


        }

          //for betting market group
        else if ( keyPath.length === 7){
          newTree = newTree.updateIn(keyPath.slice(0,1), node =>
            node.set('isOpen', true)
          ).updateIn(keyPath.slice(0,3), node =>
            node.set('isOpen', true)
          ).updateIn(keyPath.slice(0,5), node =>
            node.set('isSelected', true)
            .set('isOpen', true)
          ).updateIn(keyPath.slice(0,7), node =>
            node.set('isSelected', true)
            .set('isOpen', true)
          );
        }

          // Print the new tree for debug:
          // console.log(JSON.stringify(newTree.toJS(), null, 2));
          // Compare all nodes to see which ones were altered:
        var altered = differences(nested, newTree, 'children').map(x => x.get('id'));
        // console.log('IDs of nodes that were replaced: ', altered);
          //[1101111, 12222, 13333, 2305]

        if ( keyPath.length >= 3){
          newTree = newTree.setIn(keyPath.slice(0,2),
            newTree.getIn(keyPath.slice(0,2)).filter(function(metric) {
              return metric.get('id') === altered[1];
            })
          )
        }

        if ( keyPath.length >= 5){
          newTree = newTree.setIn(keyPath.slice(0,4),
            newTree.getIn(keyPath.slice(0,4)).filter(function(metric) {
              return metric.get('id') === altered[2];
            })
          )
        }

        // if ( keyPath.length >= 7 ){
        //   newTree = newTree.setIn(keyPath.slice(0,6),
        //     newTree.getIn(keyPath.slice(0,6)).filter(function(metric) {
        //       return metric.get('id') === altered[4];
        //     })
        //   )
        // }

        var updatedTree = newTree.toJS();


        if (keyPath[0] === 0){

        } else{
          updatedTree = updatedTree.filter(function(p) {
            return (p.id === "0" || p.isOpen === true);
          });
        }
        // var newPeople = [];
        // updatedTree.forEach(function(p){
        //   if(p.id === "0" || p.isOpen === true){
        //     newPeople.push(p);
        //   }
        // });


        this.setState({
          tree: updatedTree
        });
      } else {
        console.log('Not found! ', targetObjectId);
      }


    }

  }



  onNodeMouseClick(event, tree, node, level, keyPath) {
    this.setState({
      tree: tree
    });
    this.props.push('/market-screen/' + node.customComponent + '/' + node.id);

    // /// special id for all sports
    // if ( node.id === '0'){
    //   this.props.push('/market-screen/');
    //   this.forceUpdate()
    //
    //
    // } else {
    //   this.props.push('/market-screen/' + node.customComponent + '/' + node.id);
    //
    // }

  }

  onLeafMouseClick(event, leaf) {
    // console.log( leaf.id ); // Prints the leaf id
    // console.log( leaf.name ); // Prints the leaf name
  }

  onLeafMouseUp(event, leaf) {
    // console.log( leaf.id ); // Prints the leaf id
    // console.log( leaf.name ); // Prints the leaf name
  }

  onLeafMouseDown(event, leaf) {
    // console.log( leaf.id ); // Prints the leaf id
    // console.log( leaf.name ); // Prints the leaf name
  }


  render() {
    // console.log(JSON.stringify(newTree.toJS(), null, 2));

    return (
          <InfinityMenu
              disableDefaultHeaderContent={ true }
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
                "BettingMarketGroup" : BettingMarketGroup
              }
            }
          />

    );
  }
}

SideBar.propTypes = {
  completeTree: React.PropTypes.array.isRequired,
  objectId: React.PropTypes.string.isRequired,
};

SideBar.defaultProps = {
  objectId: '0'
};


const mapStateToProps = (state) => {
  const { sidebar } = state;
  return {
    sidebarObjectId: sidebar.objectId,

  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    push: (url) => {
      dispatch(push(url))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);
