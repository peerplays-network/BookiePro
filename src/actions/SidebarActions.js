//const uid = () => Math.random().toString(34).slice(2);
import { ActionTypes } from '../constants';

class SidebarActions{

  static treeUpdate(complete_tree) {
    return {
      type: ActionTypes.UPDATE_SIDEBAR_COMPLETE_TREE,
      complete_tree
    }
  }

}

export default SidebarActions;
