import React from 'react';
import Translate from 'react-translate-component';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {connect} from 'react-redux';
import VotingActions from 'actions/VotingActions';
/*COMPONENTS*/
import Proxy from './Proxy';
import Witnesses from './Witnesses';
import CommitteeMembers from './CommitteeMembers';
import SLoader from '../Loaders/SLoader';

@connect(null, {fetchData: VotingActions.fetchData})
class VotingContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  componentWillMount() {
    this.props.fetchData().then(() => {
      this.setState({loaded: true});
    });
  }

  onChangeActiveMenuItem(e) {
    let selectedTab;

    switch (e) {
      case 0:
        selectedTab = 'proxy';
        break;
      case 1:
        selectedTab = 'witness';
        break;
      case 2:
        selectedTab = 'committee';
        break;
      default:
        selectedTab = 'proxy';
    }

    this.props.router.push(`/explore/voting/${selectedTab}`);
  }

  getCurrentTabFromParams(props) {
    return props.routes[props.routes.length - 1]['params']['tab'];
  }

  render() {
    let selectedIndex;

    switch (this.getCurrentTabFromParams(this.props)) {
      case 'proxy':
        selectedIndex = 0;
        break;
      case 'witness':
        selectedIndex = 1;
        break;
      case 'committee':
        selectedIndex = 2;
        break;
      default:
        selectedIndex = 0;
    }

    return (
      <div className='main'>
        <section className='content'>
          <div className='box'>
            {this.state.loaded
              ? <Tabs
                className='pt40'
                onSelect={ this.onChangeActiveMenuItem.bind(this) }
                selectedIndex={ selectedIndex }>
                <TabList>
                  <Tab><Translate content='votes.proxy_short'/></Tab>
                  <Tab><Translate content='votes.add_witness_label'/></Tab>
                  <Tab><Translate content='votes.advisors'/></Tab>
                </TabList>
                <TabPanel><Proxy/></TabPanel>
                <TabPanel><Witnesses/></TabPanel>
                <TabPanel><CommitteeMembers/></TabPanel>
              </Tabs>
              : <SLoader/>
            }
          </div>
        </section>
      </div>
    );
  }
}

export default VotingContainer;