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

/** Generic set of components for dealing with data in the ChainStore */
import React, {Component, Children} from "react"
import connectToStores from "alt/utils/connectToStores";
import ChainTypes from "components/Utility/ChainTypes"
import BindToChainState from "components/Utility/BindToChainState"
import Immutable from "immutable"
import AccountStore from "stores/AccountStore"
import {pairs} from "lodash"

@connectToStores
export class ResolveLinkedAccounts extends Component {
    static getStores() {
        return [AccountStore]
    }
    static getPropsFromStores() {
        return AccountStore.getState()
    }
    render() {
        return <ResolveLinkedAccountsChainState
            linkedAccounts={this.props.linkedAccounts}
            children={this.props.children}/>
    }
}

@BindToChainState()
class ResolveLinkedAccountsChainState extends Component {

    static propTypes = {
        linkedAccounts: ChainTypes.ChainAccountsList.isRequired
    }

    render() {
        var linkedAccounts = []
        pairs(this.props.linkedAccounts).forEach( account => {
            if( !account[1]) return
            console.log("... account.toJS()", account[1].toJS())
            linkedAccounts.push(account[1])
        })
        var child = Children.only(this.props.children)
        if( ! child) return <span>{linkedAccounts.map(a => <br>{a.toJS()}</br>)}</span>
        // Pass the list to a child reactjs component as this.props.resolvedLinkedAccounts
        child = React.addons.cloneWithProps(child, { linkedAccounts })
        return <span>{child}</span>
    }

}
