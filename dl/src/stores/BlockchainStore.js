/*
 * Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 * The MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var Immutable = require("immutable");
var alt = require("../alt-instance");
var BlockchainActions = require("../actions/BlockchainActions");
import BaseStore from "./BaseStore";
import {ChainStore} from "peerplaysjs-lib";

import {
    Block
}
from "./tcomb_structs";

class BlockchainStore extends BaseStore{
    constructor() {
        super();
        // This might not need to be an immutable map, a normal struc ture might suffice..
        this.blocks = Immutable.Map();
        this.latestBlocks = Immutable.List();
        this.latestTransactions = Immutable.List();
        this.rpc_connection_status = null;
        this.no_ws_connection = false;

        this.bindListeners({
            onGetBlock: BlockchainActions.getBlock,
            onGetTest: BlockchainActions.getTest,
            onGetLatest: BlockchainActions.getLatest,
            onUpdateRpcConnectionStatus: BlockchainActions.updateRpcConnectionStatus
        });

        this.maxBlocks = 100;
    }

    onGetTest() {
        console.log('onGetTest ');
    }

    onGetBlock(block) {console.log('on get block');
        if (!this.blocks.get(block.id)) {
            block.timestamp = new Date(block.timestamp);
            this.blocks = this.blocks.set(
                block.id,
                Block(block)
            );
        }
    }

    onGetLatest(payload) {console.log('on get latest sad');
        let {block, maxBlock} = payload;
        if (typeof block.timestamp === "string") {
            block.timestamp += "+00:00";
        }
        block.timestamp = new Date(block.timestamp);
        if (block.id > maxBlock - this.maxBlocks) {
            this.latestBlocks = this.latestBlocks.unshift(Block(block));
            if (this.latestBlocks.size > this.maxBlocks) {
                this.latestBlocks = this.latestBlocks.pop();
            }
            

            if (block.transactions.length > 0) {
                block.transactions.forEach(trx => {
                    trx.block_num = block.id;
                    this.latestTransactions = this.latestTransactions.unshift(trx);
                })
            }

            if (this.latestTransactions.size > this.maxBlocks) {
                this.latestTransactions = this.latestTransactions.pop();
            }
        }

    }

    onUpdateRpcConnectionStatus(status){
        let prev_status = this.rpc_connection_status;
        if(status === "reconnect")  ChainStore.resetCache();
        else this.rpc_connection_status = status;
        if (prev_status === null && status === "error")
            this.no_ws_connection = true;
        if (this.no_ws_connection && status === "open")
            this.no_ws_connection = false;
    }

}

export default alt.createStore(BlockchainStore, "BlockchainStore");
