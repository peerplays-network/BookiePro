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

var {PrivateKey, Serializer, SerializerValidation, types} = require("peerplaysjs-lib");
var config = require('../chain/serializer_config')
var ApplicationApi = require('./ApplicationApi')

class DebugApi {
    
    set_hex_dump(flag = !config.hex_dump) {
        return config.hex_dump = flag
    }
    
    type(operation_name) {
        SerializerValidation.required(operation_name, "operation_name")
        var operation_type = types[operation_name]
        SerializerValidation.required(operation_type, "unknown operation name " + operation_name)
        return operation_type
    }
    
    template(operation_name, debug = {use_default: true, annotate: false}) {
        var operation_type = this.type(operation_name)
        return operation_type.toObject(undefined, debug)
    }
    
    hex_dump(operation_name, object) {
        var operation_type = this.type(operation_name)
        SerializerValidation.required(object, "transaction json object")
        var operation = operation_type.fromObject(object)
        var hex_dump = config.hex_dump
        try {
            config.hex_dump = true
            return operation_type.toObject(operation)
        } finally {
            config.hex_dump = hex_dump
        }
    }
    
}

module.exports = DebugApi
