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

import Repository from '../repositories/chain/repository';

/**
 * Is used in ChainStoreService
 */
class SendService {

    constructor() {
        this.assetSymbol = CORE_ASSET;
    }

    /**
     * Update Send page data
     *
     * @param account
     */
    static fetchData(account) {
        return Promise.all([
            Repository.getObject('2.0.0'),
            Repository.getObject('2.1.0'),
            Repository.getObject('1.3.0')
        ]).then(results => {
            let object200 = results[0].toJS();
            let object210 = results[1].toJS();
            let coreAsset = results[2].toJS();
            return {
                head_block_number: object210.head_block_number,
                last_irreversible_block_num: object210.last_irreversible_block_num,
                recently_missed_count: object210.recently_missed_count,
                time: object210.time,
                block_interval: object200.parameters.block_interval,
                coreAsset: coreAsset,
                latestFetchedBlocks: []
            };
        })
    }

}


export default SendService;
