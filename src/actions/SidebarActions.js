//const uid = () => Math.random().toString(34).slice(2);
import { ActionTypes } from '../constants';
import FakeApi from '../communication/FakeApi';
import SportActions from './SportActions';
import EventActions from './EventActions';
import BettingMarketGroupActions from './BettingMarketGroupActions';
import _ from 'lodash';


class SidebarActions{

  static setDataForSidebar(){

    return (dispatch, getState) => {
      const {sports} = getState().sport;
      const {eventGroups} = getState().eventGroup;
      //
      //
      //
      //
      //

      let completeTree = []
      completeTree.push({
        name: "ALL SPORTS", /*require for menu lib */
        id: "0", /*require for menu lib */
        isOpen: false, /*optional for menu lib */
        isSelected: false, /*optional for node component  */
        customComponent: "Sport",  /*require for custom component*/
        objectId: "0",
        children: []  /*require for TreeUtil.js*/
      });
      _.forEach(sports, (sport) => {

        var sportNode = {};

        sportNode.name = sport.name;
        sportNode.id = sport.id;
        sportNode.isOpen = false;
        sportNode.customComponent = "Sport";
        sportNode.objectId = sport.id;
        sportNode.children = [];

        console.log('sportNode: ', sportNode);
        completeTree.push(sportNode);
      });

      console.log('completeTree: ', completeTree);


      dispatch(SidebarActions.treeUpdate(completeTree));
    }
  }
  static treeUpdate(complete_tree) {
    return {
      type: ActionTypes.UPDATE_SIDEBAR_COMPLETE_TREE,
      complete_tree
    }
  }

}

export default SidebarActions;
