import React from 'react';
import Translate from 'react-translate-component';
import {connect} from 'react-redux';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import GeneralSettings from './GeneralSettings';
import PasswordSettings from './PasswordSettings';
import ClaimSettings from './ClaimSettings';

const mapStateToProps = (state) => {
  return {
    menuEntries: state.pageSettings.menuEntries,
  };
};

@connect(
  mapStateToProps
)
class SettingsContainer extends React.Component {

  onChangeActiveMenuItem(e) {
    let selectedTab;

    switch (e) {
      case 0:
        selectedTab = 'general';
        break;
      case 1:
        selectedTab = 'password';
        break;
      case 3:
        selectedTab = 'claim';
        break;
      default:
        selectedTab = 'general';
    }


    if (selectedTab !== 'general') {
      this.props.router.push(`/settings/${selectedTab}`);
    } else {
      this.props.router.push('/settings');
    }
  }


  getCurrentTabFromParams(props) {
    return props.routes[props.routes.length - 1]['params']['tab'];
  }

  render() {
    let selectedIndex;

    switch (this.getCurrentTabFromParams(this.props)) {
      case 'general':
        selectedIndex = 0;
        break;
      case 'password':
        selectedIndex = 1;
        break;
        // case 'permissions':
        //   selectedIndex = 2;
        //   break;
      case 'access':
        selectedIndex = 2;
        break;
      case 'claim':
        selectedIndex = 3;
        break;
      default:
        selectedIndex = 0;
    }

    return (
      <div className='main'>
        <section className='content'>
          <div className='box'>
            {/*<h1 className="h1 h1__main">*/}
            {/*<Translate content="header.settings"/>*/}
            {/*</h1>*/}
            <Tabs className='pt40'
              onSelect={ this.onChangeActiveMenuItem.bind(this) }
              selectedIndex={ selectedIndex }>
              <TabList>
                <Tab style={ {display: 'none'} } key='general'>
                  <Translate content='settings.general'/>
                </Tab>
                <Tab style={ {display: 'none'} } key='password'>
                  <Translate content='settings.password'/>
                </Tab>
                {/*<Tab key="permissions"><Translate content="account.permissions" /></Tab>*/}
                <Tab key='claim'><Translate content='settings.claim'/></Tab>
              </TabList>
              <TabPanel><GeneralSettings /></TabPanel>
              <TabPanel><PasswordSettings /></TabPanel>
              {/*<TabPanel><PermissionSettings /></TabPanel>*/}
              <TabPanel><ClaimSettings /></TabPanel>
            </Tabs>
          </div>
        </section>
      </div>
    );
  }
}

export default SettingsContainer;