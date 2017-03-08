import { push, replace } from 'react-router-redux';

class NavigateActions {

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
