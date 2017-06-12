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

import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Translate from "react-translate-component";

import BlockChainContainer from './BlockChain/BlockChainContainer';
import Accounts from './Accounts/Accounts';
import BasicAssets from './BasicAssets';
import SmartCoins from './SmartCoins';
import FeeSchedule from './FeeSchedule/FeeSchedule';

class ExploreContainer extends React.Component {

	onChangeActiveMenuItem(e){
        let selectedTab;
		switch(e){
			case 0:
				selectedTab = 'blockchain';
				break;
			case 1:
				selectedTab = 'accounts';
				break;
			// case 2:
			//  	selectedTab = 'assets';
			// 	break;
			// case 3:
			// 	selectedTab = 'smartcoins';
			// 	break;
			case 2:
				selectedTab = 'fee';
				break;
			default:
			selectedTab = 'blockchain';
		}

        if(selectedTab != 'blockchain'){
            this.props.router.push(`/explore/blockchain/${selectedTab}`)
		} else {
            this.props.router.push(`/explore/blockchain`)
		}

  	}

  	getCurrentTabFromParams(props) {
        return props.routes[props.routes.length - 1]['params']['tab'];
	}
	render() {

	    let selectedIndex;

        switch(this.getCurrentTabFromParams(this.props)){
            case 'blockchain':
                selectedIndex = 0;
                break;
            case 'accounts':
                selectedIndex = 1;
                break;
            // case 'assets':
            //     selectedIndex = 2;
            //     break;
            // case 'smartcoins':
            //     selectedIndex = 3;
            //     break;
            case 'fee':
                selectedIndex = 2;
                break;
            default:
                selectedIndex = 0;
        }

		return (
			<div className="main">
				<section className="content">
					<div className="box">
						<Tabs className="pt40" onSelect={this.onChangeActiveMenuItem.bind(this)}
		                selectedIndex={selectedIndex}>
							<TabList>
								<Tab key="blockchain"><Translate content="explore.blockchain.title" /></Tab>
								<Tab key="accounts"><Translate content="explore.accounts.title" /></Tab>
								{/*<Tab key="assets"><Translate content="explore.basicAssets.title" /></Tab>*/}
								{/*<Tab key="smartcoins"><Translate content="explore.smartCoins.title" /></Tab>*/}
								<Tab key="fee"><Translate content="explore.feeSchedule.title" /></Tab>
							</TabList>
							<TabPanel><BlockChainContainer /></TabPanel>
							<TabPanel><Accounts /></TabPanel>
							{/*<TabPanel><BasicAssets /></TabPanel>*/}
							{/*<TabPanel><SmartCoins /></TabPanel>*/}
							<TabPanel><FeeSchedule /></TabPanel>
						</Tabs>
					</div>
				</section>
			</div>
		);
	}
}

export default ExploreContainer;
