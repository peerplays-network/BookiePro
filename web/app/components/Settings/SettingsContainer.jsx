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
import {connect} from 'react-redux';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import GeneralSettings from "./GeneralSettings";
import PasswordSettings from "./PasswordSettings";
import PermissionSettings from "./PermissionSettings";
import AccessSettings from "./AccessSettings";
import ClaimSettings from "./ClaimSettings";

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
            // case 2:
            //   selectedSettings = 'permissions';
            //   break;
            case 2:
                selectedTab = 'access';
                break;
            case 3:
                selectedTab = 'claim';
                break;
            default:
                selectedTab = 'general';
        }


        if (selectedTab != 'general') {
            this.props.router.push(`/settings/${selectedTab}`);
        } else {
            this.props.router.push(`/settings`);
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
            <div className="main">
                <section className="content">
                    <div className="box">
                        {/*<h1 className="h1 h1__main">*/}
                            {/*<Translate content="header.settings"/>*/}
                        {/*</h1>*/}
                        <Tabs className="pt40"
                            onSelect={this.onChangeActiveMenuItem.bind(this)}
                            selectedIndex={selectedIndex}>
                            <TabList>
                                <Tab style={{display: 'none'}} key="general"><Translate content="settings.general"/></Tab>
                                <Tab style={{display: 'none'}} key="password"><Translate content="settings.password"/></Tab>
                                {/*<Tab key="permissions"><Translate content="account.permissions" /></Tab>*/}
                                <Tab key="access"><Translate content="settings.access"/></Tab>
                                <Tab key="claim"><Translate content="settings.claim"/></Tab>
                            </TabList>
                            <TabPanel><GeneralSettings /></TabPanel>
                            <TabPanel><PasswordSettings /></TabPanel>
                            {/*<TabPanel><PermissionSettings /></TabPanel>*/}
                            <TabPanel><AccessSettings /></TabPanel>
                            <TabPanel><ClaimSettings /></TabPanel>
                        </Tabs>
                    </div>
                </section>
            </div>

        );
    }
}

export default SettingsContainer;