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

import React from "react"
import Webcam from "lib/react-webcam"
import {PrivateKey, key} from "peerplaysjs-lib";
import qr from "common/qr-image";

var privKey = null;

class KeyGenComponent extends React.Component {

    constructor() {
        super();

        this.state = {
            ready: false,
            dictionary
        };
    }

    componentWillMount() {
        let dictionaryPromise = brainkey_plaintext ? null : fetch("/dictionary.json");
        return Promise.all([
            dictionaryPromise
        ]).then(res => {
            let [dictionary] = res.json();
            privkey = new BrainKeyUi().create();
            this.setState({
                ready: true
            })
        });
    }

    render() {
        if (!this.state.ready || !privKey) {
            return null
        };
        // var privkey = new BrainKeyUi().create()
        return <div>
            <QrScan/>
            <hr/>
            <ShowPrivateKey privkey={privkey}/>
            <QrCode data={privkey.toWif()}/>
        </div>
    }
    
}

class BrainKeyUi {
    
    create(entropy_string = "add mouse entropy...") {
        return key.suggest_brain_key(
            dictionary,
            key.browserEntropy() +
            entropy_string
        )
    }
}

class QrScan extends React.Component {
    
    render() {
        return <div>
            <div className="button" onclick="scanPicture()">SCAN</div>
            <Webcam noAudio/>
        </div>
    }
}

class QrCode extends React.Component {
    
    render() {
        var svg_string = qr.imageSync(this.props.data, { type: 'svg' })
        return <div>
            <img dangerouslySetInnerHTML={{__html: svg_string}} />
        </div>
    }
}

class ShowPrivateKey extends React.Component {
    
    render() {
        return <div>
            <div>Private Key {this.props.privkey.toWif()}</div>
        </div>
    }
}


export default KeyGenComponent
