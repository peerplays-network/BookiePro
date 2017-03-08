import { push, replace } from 'react-router-redux';

class NavigateActions {

  /**
   * Action to navigate to the given path
   * path - path to go
   * pushPage - true to push on top of current page, false to replace current page
   */
  static navigateTo(path, pushPage = true) {
    return (dispatch) => {
      if (path) {
        if (pushPage) {
          dispatch(push(path));
        } else {
          dispatch(replace(path));
        }
      }
    };
  }

}

export default NavigateActions;
