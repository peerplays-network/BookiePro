/*
 *  Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 *  The MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

import React from "react";
import Translate from "react-translate-component";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {connect} from 'react-redux';

import VotingActions from "actions/VotingActions";

/*COMPONENTS*/
import Proxy from "./Proxy";
import Witnesses from "./Witnesses";
import CommitteeMembers from './CommitteeMembers';
import Proposals from './Proposals';

import SLoader from '../Loaders/SLoader';

@connect(
    null,
    {
        fetchData: VotingActions.fetchData
    }
)
class VotingContainer extends React.Component {

    constructor(props){

        super(props);

        this.state = {
            loaded: false
        };
    }

    componentWillMount() {

        this.props.fetchData().then(() => {

            this.setState({
                loaded: true
            });

        });

    }

    onChangeActiveMenuItem(e){
        let selectedTab;
        switch(e){
            case 0:
                selectedTab = 'proxy';
                break;
            case 1:
                selectedTab = 'witness';
                break;
            case 2:
                selectedTab = 'committee';
                break;
            // case 3:
            //     selectedTab = 'proposals';
            //     break;
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

        switch(this.getCurrentTabFromParams(this.props)){
            case 'proxy':
                selectedIndex = 0;
                break;
            case 'witness':
                selectedIndex = 1;
                break;
            case 'committee':
                selectedIndex = 2;
                break;
            // case 'proposals':
            //     selectedIndex = 3;
                break;
            default:
                selectedIndex = 0;
        }

        return (
            <div className="main">
                <section className="content">
                    <div className="box">
                        {/*<Translate component="h1" className="h1 h1__main" content="votes.title_page" />*/}

                        {this.state.loaded ?

                            <Tabs className="pt40" onSelect={this.onChangeActiveMenuItem.bind(this)}
                                  selectedIndex={selectedIndex}>
                                <TabList>
                                    <Tab><Translate content="votes.proxy_short" /></Tab>
                                    <Tab><Translate content="votes.add_witness_label" /></Tab>
                                    <Tab><Translate content="votes.advisors" /></Tab>
                                    {/*<Tab><Translate content="account.votes.proposals.title_tab" /></Tab>*/}
                                </TabList>
                                <TabPanel><Proxy /></TabPanel>
                                <TabPanel><Witnesses /></TabPanel>
                                <TabPanel><CommitteeMembers /></TabPanel>
                                {/*<TabPanel><Proposals /></TabPanel>*/}
                            </Tabs>
                            :
                            <SLoader />
                        }

                    </div>
                </section>
            </div>

        );
    }
}

export default VotingContainer;