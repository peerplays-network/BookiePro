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
// import {BackupRestore} from "../Wallet/Backup";
// import ImportKeys from "../Wallet/ImportKeys";
import Translate from "react-translate-component";
import counterpart from "counterpart";

export default class RestoreSettings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedType: 0,
            types: ["backup", "key", "legacy"]
        };
    }

    _changeType(e) {

        this.setState({
            selectedType: this.state.types.indexOf(e.target.value)
        });
    }

    render() {
        let {types, selectedType} = this.state;

        let options = types.map(type => {
            return <option key={type} value={type}>{counterpart.translate(`settings.backup_${type}`)} </option>;
        });

        let content;

        switch (types[selectedType]) {
            case "backup":
                break;
            case "key":
                break;
            default:
        }
        return (
            <div>
                <select value={types[selectedType]} onChange={this._changeType.bind(this)} className="bts-select">
                    {options}
                </select>
                {content}
            </div>
        );

        // let content;
        //
        //
        // case "backup":
        //     // content = (
        //     //     <div>
        //     //         <BackupRestore />
        //     //     </div>
        //     // );
        //     break;
        //
        // default:
        //     content = <ImportKeys privateKey={restoreType === 1} />;
        //     break;
        // }
    }
};
