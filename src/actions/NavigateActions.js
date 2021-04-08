import {push, replace} from 'connected-react-router';
import log from 'loglevel';

class NavigateActions {
  /**
   * Action to navigate to the given path
   * path - path to go
   * pushPage - true to push on top of current page, false to replace current page
   */
  static navigateTo(path, pushPage = true) {
    return (dispatch) => {

      // Get the current location.
      let hash = location.hash.replace('#', '');

      // Don't dispatch a change if the url is already the current url.
      if (path && path !== hash) {
        log.debug('Navigate to ', path);
        
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
