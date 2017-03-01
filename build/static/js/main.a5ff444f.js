/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(31);
	module.exports = __webpack_require__(62);


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("graphenejs-lib");

/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/icon");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/icon/style");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/button");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/button/style");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ChainTypes = exports.BlockchainUtils = exports.BindToChainState = undefined;
	
	var _BindToChainState = __webpack_require__(66);
	
	var _BindToChainState2 = _interopRequireDefault(_BindToChainState);
	
	var _BlockchainUtils = __webpack_require__(13);
	
	var _BlockchainUtils2 = _interopRequireDefault(_BlockchainUtils);
	
	var _ChainTypes = __webpack_require__(23);
	
	var _ChainTypes2 = _interopRequireDefault(_ChainTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.BindToChainState = _BindToChainState2.default;
	exports.BlockchainUtils = _BlockchainUtils2.default;
	exports.ChainTypes = _ChainTypes2.default;

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/menu");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/menu/style");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _graphenejsLib = __webpack_require__(2);
	
	var numeral = __webpack_require__(96);
	
	var id_regex = /\b\d+\.\d+\.(\d+)\b/;
	
	var object_type = _graphenejsLib.ChainTypes.object_type,
	    operations = _graphenejsLib.ChainTypes.operations;
	
	
	var Utils = {
	    get_object_id: function get_object_id(obj_id) {
	        var id_regex_res = id_regex.exec(obj_id);
	        return id_regex_res ? Number.parseInt(id_regex_res[1], 10) : 0;
	    },
	
	    is_object_id: function is_object_id(obj_id) {
	        if ('string' !== typeof obj_id) return false;
	        var match = id_regex.exec(obj_id);
	        return match !== null && obj_id.split(".").length === 3;
	    },
	
	    is_object_type: function is_object_type(obj_id, type) {
	        var prefix = object_type[type];
	        if (!prefix || !obj_id) return null;
	        prefix = "1." + prefix.toString();
	        return obj_id.substring(0, prefix.length) === prefix;
	    },
	
	    get_satoshi_amount: function get_satoshi_amount(amount, asset) {
	        var precision = asset.toJS ? asset.get("precision") : asset.precision;
	        var assetPrecision = this.get_asset_precision(precision);
	        amount = typeof amount === "string" ? amount : amount.toString();
	
	        var decimalPosition = amount.indexOf(".");
	        if (decimalPosition === -1) {
	            return parseInt(amount, 10) * assetPrecision;
	        } else {
	            amount = amount.replace(".", "");
	            amount = amount.substr(0, decimalPosition + precision);
	            for (var i = 0; i < precision; i++) {
	                decimalPosition += 1;
	                if (decimalPosition > amount.length) {
	                    amount += "0";
	                }
	            };
	
	            return parseInt(amount, 10);
	        }
	    },
	
	
	    get_asset_precision: function get_asset_precision(precision) {
	        precision = precision.toJS ? precision.get("precision") : precision;
	        return Math.pow(10, precision);
	    },
	
	    get_asset_amount: function get_asset_amount(amount, asset) {
	        if (amount === 0) return amount;
	        if (!amount) return null;
	        return amount / this.get_asset_precision(asset.toJS ? asset.get("precision") : asset.precision);
	    },
	
	    get_asset_price: function get_asset_price(quoteAmount, quoteAsset, baseAmount, baseAsset) {
	        var inverted = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
	
	        if (!quoteAsset || !baseAsset) {
	            return 1;
	        }
	        var price = this.get_asset_amount(quoteAmount, quoteAsset) / this.get_asset_amount(baseAmount, baseAsset);
	        return inverted ? 1 / price : price;
	    },
	
	    round_number: function round_number(number, asset) {
	        var assetPrecision = asset.toJS ? asset.get("precision") : asset.precision;
	        var precision = this.get_asset_precision(assetPrecision);
	        return Math.round(number * precision) / precision;
	    },
	
	    format_volume: function format_volume(amount) {
	
	        if (amount < 10000) {
	            return this.format_number(amount, 3);
	        } else if (amount < 1000000) {
	            return (Math.round(amount / 10) / 100).toFixed(2) + "k";
	        } else {
	            return (Math.round(amount / 10000) / 100).toFixed(2) + "M";
	        }
	    },
	
	
	    format_number: function format_number(number, decimals) {
	        var trailing_zeros = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
	
	        if (isNaN(number) || !isFinite(number) || number === undefined || number === null) return "";
	        var zeros = ".";
	        for (var i = 0; i < decimals; i++) {
	            zeros += "0";
	        }
	        var num = numeral(number).format("0,0" + zeros);
	        if (num.indexOf('.') > 0 && !trailing_zeros) return num.replace(/0+$/, "").replace(/\.$/, "");
	        return num;
	    },
	
	    format_asset: function format_asset(amount, asset, noSymbol) {
	        var trailing_zeros = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
	
	        var symbol = void 0;
	        var digits = 0;
	        if (asset === undefined) return undefined;
	        if ('symbol' in asset) {
	            // console.log( "asset: ", asset )
	            symbol = asset.symbol;
	            digits = asset.precision;
	        } else {
	            // console.log( "asset: ", asset.toJS() )
	            symbol = asset.get('symbol');
	            digits = asset.get('precision');
	        }
	        var precision = this.get_asset_precision(digits);
	        // console.log( "precision: ", precision )
	
	        return "" + this.format_number(amount / precision, digits, trailing_zeros) + (!noSymbol ? " " + symbol : "");
	    },
	
	    format_price: function format_price(quoteAmount, quoteAsset, baseAmount, baseAsset, noSymbol) {
	        var inverted = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
	        var trailing_zeros = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;
	
	        if (quoteAsset.size) quoteAsset = quoteAsset.toJS();
	        if (baseAsset.size) baseAsset = baseAsset.toJS();
	
	        var precision = this.get_asset_precision(quoteAsset.precision);
	        var basePrecision = this.get_asset_precision(baseAsset.precision);
	
	        if (inverted) {
	            if (parseInt(quoteAsset.id.split(".")[2], 10) < parseInt(baseAsset.id.split(".")[2], 10)) {
	                var value = quoteAmount / precision / (baseAmount / basePrecision);
	                return "" + this.format_number(value, Math.max(5, quoteAsset.precision), trailing_zeros) + (!noSymbol ? "" + quoteAsset.symbol + "/" + baseAsset.symbol : "");
	            } else {
	                var _value = baseAmount / basePrecision / (quoteAmount / precision);
	                return "" + this.format_number(_value, Math.max(5, baseAsset.precision), trailing_zeros) + (!noSymbol ? "" + baseAsset.symbol + "/" + quoteAsset.symbol : "");
	            }
	        } else {
	            if (parseInt(quoteAsset.id.split(".")[2], 10) > parseInt(baseAsset.id.split(".")[2], 10)) {
	                var _value2 = quoteAmount / precision / (baseAmount / basePrecision);
	                return "" + this.format_number(_value2, Math.max(5, quoteAsset.precision), trailing_zeros) + (!noSymbol ? "" + quoteAsset.symbol + "/" + baseAsset.symbol : "");
	            } else {
	                var _value3 = baseAmount / basePrecision / (quoteAmount / precision);
	                return "" + this.format_number(_value3, Math.max(5, baseAsset.precision), trailing_zeros) + (!noSymbol ? "" + baseAsset.symbol + "/" + quoteAsset.symbol : "");
	            }
	        }
	    },
	
	    price_text: function price_text(price, base, quote) {
	        var maxDecimals = 8;
	        var priceText = void 0;
	        var quoteID = quote.toJS ? quote.get("id") : quote.id;
	        var quotePrecision = quote.toJS ? quote.get("precision") : quote.precision;
	        var baseID = base.toJS ? base.get("id") : base.id;
	        var basePrecision = base.toJS ? base.get("precision") : base.precision;
	        if (quoteID === "1.3.0") {
	            priceText = this.format_number(price, quotePrecision);
	        } else if (baseID === "1.3.0") {
	            priceText = this.format_number(price, Math.min(maxDecimals, quotePrecision + 2));
	        } else {
	            priceText = this.format_number(price, Math.min(maxDecimals, quotePrecision + basePrecision));
	        }
	        return priceText;
	    },
	
	    price_to_text: function price_to_text(price, base, quote) {
	        var forcePrecision = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
	
	        if (typeof price !== "number" || !base || !quote) {
	            return;
	        }
	
	        if (price === Infinity) {
	            price = 0;
	        }
	        var priceText = void 0;
	
	        if (forcePrecision) {
	            priceText = this.format_number(price, forcePrecision);
	        } else {
	            priceText = this.price_text(price, base, quote);
	        }
	        var price_split = priceText.split(".");
	        var int = price_split[0];
	        var dec = price_split[1];
	        var i = void 0;
	
	        var zeros = 0;
	        if (dec) {
	            if (price > 1) {
	                var l = dec.length;
	                for (i = l - 1; i >= 0; i--) {
	                    if (dec[i] !== "0") {
	                        break;
	                    }
	                    zeros++;
	                };
	            } else {
	                var _l = dec.length;
	                for (i = 0; i < _l; i++) {
	                    if (dec[i] !== "0") {
	                        i--;
	                        break;
	                    }
	                    zeros++;
	                };
	            }
	        }
	
	        var trailing = zeros ? dec.substr(Math.max(0, i + 1), dec.length) : null;
	
	        if (trailing) {
	            if (trailing.length === dec.length) {
	                dec = null;
	            } else if (trailing.length) {
	                dec = dec.substr(0, i + 1);
	            }
	        }
	
	        return {
	            text: priceText,
	            int: int,
	            dec: dec,
	            trailing: trailing,
	            full: price
	        };
	    },
	
	    get_op_type: function get_op_type(object) {
	        var type = parseInt(object.split(".")[1], 10);
	
	        for (var id in object_type) {
	            if (object_type[id] === type) {
	                return id;
	            }
	        }
	    },
	
	    add_comma: function add_comma(value) {
	        if (typeof value === "number") {
	            value = value.toString();
	        }
	        value = value.trim();
	        value = value.replace(/,/g, "");
	        if (value === "." || value === "") {
	            return value;
	        } else if (value.length) {
	            // console.log( "before: ",value )
	            var n = Number(value);
	            if (isNaN(n)) return;
	            var parts = value.split('.');
	            // console.log( "split: ", parts )
	            n = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	            if (parts.length > 1) n += "." + parts[1];
	            // console.log( "after: ",transfer.amount )
	            return n;
	        }
	    },
	
	    parse_float_with_comma: function parse_float_with_comma(value) {
	        // let value = new_state.transfer.amount
	        value = value.replace(/,/g, "");
	        var fvalue = parseFloat(value);
	        if (value.length && isNaN(fvalue) && value !== ".") throw new Error("parse_float_with_comma: must be a number");else if (fvalue < 0) return 0;
	
	        return fvalue;
	    },
	
	    are_equal_shallow: function are_equal_shallow(a, b) {
	        if (Array.isArray(a) && Array.isArray(a)) {
	            if (a.length > b.length) {
	                return false;
	            }
	        }
	        for (var key in a) {
	            if (!(key in b) || a[key] !== b[key]) {
	                return false;
	            }
	        }
	        for (var _key in b) {
	            if (!(_key in a) || a[_key] !== b[_key]) {
	                return false;
	            }
	        }
	        return true;
	    },
	
	    format_date: function format_date(date_str) {
	        var date = new Date(date_str);
	        return date.toLocaleDateString();
	    },
	
	    format_time: function format_time(time_str) {
	        var date = new Date(time_str);
	        return date.toLocaleString();
	    },
	
	    limitByPrecision: function limitByPrecision(value, assetPrecision) {
	        var valueString = value.toString();
	        var splitString = valueString.split(".");
	        if (splitString.length === 1 || splitString.length === 2 && splitString[1].length <= assetPrecision) {
	            return valueString;
	        } else {
	            return splitString[0] + "." + splitString[1].substr(0, assetPrecision);
	        }
	        // let precision = this.get_asset_precision(assetPrecision);
	        // value = Math.floor(value * precision) / precision;
	        // if (isNaN(value) || !isFinite(value)) {
	        //     return 0;
	        // }
	        // return value;
	    },
	
	    estimateFee: function estimateFee(op_type, options, globalObject) {
	        if (!globalObject) return 0;
	        var op_code = operations[op_type];
	        var currentFees = globalObject.getIn(["parameters", "current_fees", "parameters", op_code, 1]).toJS();
	
	        var fee = 0;
	        if (currentFees.fee) {
	            fee += currentFees.fee;
	        }
	
	        if (options) {
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;
	
	            try {
	                for (var _iterator = options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var option = _step.value;
	
	                    fee += currentFees[option];
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	        }
	
	        return fee * globalObject.getIn(["parameters", "current_fees", "scale"]) / 10000;
	    },
	
	    convertPrice: function convertPrice(fromRate, toRate, fromID, toID) {
	
	        if (!fromRate || !toRate) {
	            return null;
	        }
	        // Handle case of input simply being a fromAsset and toAsset
	        if (fromRate.toJS && this.is_object_type(fromRate.get("id"), "asset")) {
	            fromID = fromRate.get("id");
	            fromRate = fromRate.get("bitasset") ? fromRate.getIn(["bitasset", "current_feed", "settlement_price"]).toJS() : fromRate.getIn(["options", "core_exchange_rate"]).toJS();
	        }
	
	        if (toRate.toJS && this.is_object_type(toRate.get("id"), "asset")) {
	            toID = toRate.get("id");
	            toRate = toRate.get("bitasset") ? toRate.getIn(["bitasset", "current_feed", "settlement_price"]).toJS() : toRate.getIn(["options", "core_exchange_rate"]).toJS();
	        }
	        var fromRateQuoteID = fromRate.quote.asset_id;
	        var toRateQuoteID = toRate.quote.asset_id;
	
	        var fromRateQuoteAmount = void 0,
	            fromRateBaseAmount = void 0;
	        if (fromRateQuoteID === fromID) {
	            fromRateQuoteAmount = fromRate.quote.amount;
	            fromRateBaseAmount = fromRate.base.amount;
	        } else {
	            fromRateQuoteAmount = fromRate.base.amount;
	            fromRateBaseAmount = fromRate.quote.amount;
	        }
	
	        var toRateQuoteAmount = void 0,
	            toRateBaseAmount = void 0;
	        if (toRateQuoteID === toID) {
	            toRateQuoteAmount = toRate.quote.amount;
	            toRateBaseAmount = toRate.base.amount;
	        } else {
	            toRateQuoteAmount = toRate.base.amount;
	            toRateBaseAmount = toRate.quote.amount;
	        }
	
	        var baseRatio = void 0,
	            finalQuoteAmount = void 0,
	            finalBaseAmount = void 0;
	        if (toRateBaseAmount > fromRateBaseAmount) {
	            baseRatio = toRateBaseAmount / fromRateBaseAmount;
	            finalQuoteAmount = fromRateQuoteAmount * baseRatio;
	            finalBaseAmount = toRateQuoteAmount;
	        } else {
	            baseRatio = fromRateBaseAmount / toRateBaseAmount;
	            finalQuoteAmount = fromRateQuoteAmount;
	            finalBaseAmount = toRateQuoteAmount * baseRatio;
	        }
	
	        return {
	            quote: {
	                amount: finalQuoteAmount,
	                asset_id: toID
	            },
	            base: {
	                amount: finalBaseAmount,
	                asset_id: fromID
	            }
	        };
	    },
	
	    convertValue: function convertValue(priceObject, amount, fromAsset, toAsset) {
	        priceObject = priceObject.toJS ? priceObject.toJS() : priceObject;
	        var quotePrecision = this.get_asset_precision(fromAsset.get("precision"));
	        var basePrecision = this.get_asset_precision(toAsset.get("precision"));
	
	        var assetPrice = this.get_asset_price(priceObject.quote.amount, fromAsset, priceObject.base.amount, toAsset);
	
	        var eqValue = fromAsset.get("id") !== toAsset.get("id") ? basePrecision * (amount / quotePrecision) / assetPrice : amount;
	
	        if (isNaN(eqValue) || !isFinite(eqValue)) {
	            return null;
	        }
	        return eqValue;
	    },
	
	    isValidPrice: function isValidPrice(rate) {
	        if (!rate || !rate.toJS) {
	            return false;
	        }
	        var base = rate.get("base").toJS();
	        var quote = rate.get("quote").toJS();
	        if (base.amount > 0 && quote.amount > 0 && base.asset_id !== quote.asset_id) {
	            return true;
	        } else {
	            return false;
	        }
	    },
	    sortText: function sortText(a, b) {
	        var inverse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	        if (a > b) {
	            return inverse ? 1 : -1;
	        } else if (a < b) {
	            return inverse ? -1 : 1;
	        } else {
	            return 0;
	        }
	    },
	    sortID: function sortID(a, b) {
	        var inverse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	        // inverse = false => low to high
	        var intA = parseInt(a.split(".")[2], 10);
	        var intB = parseInt(b.split(".")[2], 10);
	
	        return inverse ? intB - intA : intA - intB;
	    },
	    calc_block_time: function calc_block_time(block_number, globalObject, dynGlobalObject) {
	        if (!globalObject || !dynGlobalObject) return null;
	        var block_interval = globalObject.get("parameters").get("block_interval");
	        var head_block = dynGlobalObject.get("head_block_number");
	        var head_block_time = new Date(dynGlobalObject.get("time") + "+00:00");
	        var seconds_below = (head_block - block_number) * block_interval;
	        return new Date(head_block_time - seconds_below * 1000);
	    },
	    get_translation_parts: function get_translation_parts(str) {
	        var re = /{(.*?)}/g;
	        return str.split(re);
	    },
	    get_percentage: function get_percentage(a, b) {
	        return Math.round(a / b * 100) + "%";
	    },
	    replaceName: function replaceName(name) {
	        var isBitAsset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	        var toReplace = ["TRADE.", "OPEN.", "METAEX."];
	        var suffix = "";
	        var i = void 0;
	        for (i = 0; i < toReplace.length; i++) {
	            if (name.indexOf(toReplace[i]) !== -1) {
	                name = name.replace(toReplace[i], "") + suffix;
	                break;
	            }
	        }
	
	        return {
	            name: name,
	            prefix: isBitAsset ? "bit" : toReplace[i] ? toReplace[i].toLowerCase() : null
	        };
	    },
	    get_odds_of_order: function get_odds_of_order(order) {
	        var baseAssetId = order.getIn(['sell_price', 'base', 'asset_id']);
	        var quoteAssetId = order.getIn(['sell_price', 'quote', 'asset_id']);
	        var odds = void 0;
	        if (baseAssetId === '1.3.0') {
	            odds = order.getIn(['sell_price', 'quote']);
	        } else if (quoteAssetId === '1.3.0') {
	            odds = order.getIn(['sell_price', 'base']);
	        }
	        return odds;
	    },
	    get_stake_of_order: function get_stake_of_order(order) {
	        var baseAssetId = order.getIn(['sell_price', 'base', 'asset_id']);
	        var quoteAssetId = order.getIn(['sell_price', 'quote', 'asset_id']);
	        var stake = void 0;
	        if (baseAssetId === '1.3.0') {
	            stake = order.getIn(['sell_price', 'base']);
	        } else if (quoteAssetId === '1.3.0') {
	            stake = order.getIn(['sell_price', 'quote']);
	        }
	        return stake;
	    }
	};
	
	exports.default = Utils;

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/layout");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/layout/style");

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/table");

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/table/style");

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("graphenejs-ws");

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("react-redux");

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("react-router");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("react-router-redux");

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// List all the actions type used in the app here
	var RECEIVE_ASSET_LIST = exports.RECEIVE_ASSET_LIST = 'RECEIVE_ASSET_LIST';

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _BlockchainUtils = __webpack_require__(13);
	
	var _BlockchainUtils2 = _interopRequireDefault(_BlockchainUtils);
	
	var _immutable = __webpack_require__(29);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var object_type = __webpack_require__(2).ChainTypes.object_type;
	
	function createChainableTypeChecker(validate) {
	    function checkType(isRequired, props, propName, componentName, location) {
	        componentName = componentName || "ANONYMOUS";
	        if (props[propName] == null) {
	            if (isRequired) {
	                return new Error("Required " + location + " `" + propName + "` was not specified in " + ("`" + componentName + "`."));
	            }
	            return null;
	        } else {
	            return validate(props, propName, componentName, location);
	        }
	    }
	
	    var chainedCheckType = checkType.bind(null, false);
	    chainedCheckType.isRequired = checkType.bind(null, true);
	
	    return chainedCheckType;
	}
	
	function objectIdChecker(props, propName, componentName, location) {
	    componentName = componentName || "ANONYMOUS";
	    if (props[propName]) {
	        var value = props[propName];
	        if (typeof value === "string") {
	            return _BlockchainUtils2.default.is_object_id(value) ? null : new Error(propName + " in " + componentName + " should be an object id");
	        } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
	            // TODO: check object type (probably we should require an object to be a tcomb structure)
	        } else {
	            return new Error(propName + " in " + componentName + " should be an object id or object");
	        }
	    }
	    // assume all ok
	    return null;
	}
	
	function keyChecker(props, propName, componentName, location) {
	    componentName = componentName || "ANONYMOUS";
	    if (props[propName]) {
	        var value = props[propName];
	        if (typeof value === "string") {
	            // TODO: check if it's valid key
	            // PublicKey.fromPublicKeyString(value)
	            return null;
	        } else {
	            return new Error(propName + " in " + componentName + " should be a key string");
	        }
	    }
	    // assume all ok
	    return null;
	}
	
	function assetChecker(props, propName, componentName, location) {
	    componentName = componentName || "ANONYMOUS";
	    if (props[propName]) {
	        var value = props[propName];
	        if (typeof value === "string") {
	            return null;
	        } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
	            // TODO: check object type (probably we should require an object to be a tcomb structure)
	        } else {
	            return new Error(propName + " of " + value + " in " + componentName + " should be an asset symbol or id");
	        }
	    }
	    // assume all ok
	    return null;
	}
	
	function accountChecker(props, propName, componentName, location) {
	    componentName = componentName || "ANONYMOUS";
	    if (props[propName]) {
	        var value = props[propName];
	        if (typeof value === "string") {
	            if (_BlockchainUtils2.default.is_object_id(value) && value.split(".")[1] === object_type.account) {
	                return null;
	            } else {
	                return new Error(propName + " of " + value + " in " + componentName + " should be an account id");
	            }
	        } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
	            // TODO: check object type (probably we should require an object to be a tcomb structure)
	        } else {
	            return new Error(propName + " of " + value + " in " + componentName + " should be an account id");
	        }
	    }
	    // assume all ok
	    return null;
	}
	
	function objectsListChecker(props, propName, componentName, location) {
	    componentName = componentName || "ANONYMOUS";
	    if (props[propName]) {
	        var value = props[propName];
	        if (_immutable2.default.List.isList(value) || _immutable2.default.Set.isSet(value) || value instanceof Object) {
	            return null;
	        } else {
	            return new Error(propName + " in " + componentName + " should be Immutable.List");
	        }
	    }
	    // assume all ok
	    return null;
	}
	
	function assetsListChecker(props, propName, componentName, location) {
	    componentName = componentName || "ANONYMOUS";
	    if (props[propName]) {
	        var value = props[propName];
	        if (_immutable2.default.List.isList(value) || _immutable2.default.Set.isSet(value) || value instanceof Object) {
	            return null;
	        } else {
	            return new Error(propName + " in " + componentName + " should be Immutable.List");
	        }
	    }
	    // assume all ok
	    return null;
	}
	
	function accountsListChecker(props, propName, componentName, location) {
	    componentName = componentName || "ANONYMOUS";
	    if (props[propName]) {
	        var value = props[propName];
	        if (_immutable2.default.List.isList(value) || _immutable2.default.Set.isSet(value) || value instanceof Object) {
	            return null;
	        } else {
	            return new Error(propName + " in " + componentName + " should be Immutable.List");
	        }
	    }
	    // assume all ok
	    return null;
	}
	
	var ChainObject = createChainableTypeChecker(objectIdChecker);
	var ChainAccount = createChainableTypeChecker(accountChecker);
	var ChainKeyRefs = createChainableTypeChecker(keyChecker);
	var ChainAddressBalances = createChainableTypeChecker(keyChecker);
	var ChainAsset = createChainableTypeChecker(assetChecker);
	var ChainObjectsList = createChainableTypeChecker(objectsListChecker);
	var ChainAccountsList = createChainableTypeChecker(accountsListChecker);
	var ChainAssetsList = createChainableTypeChecker(assetsListChecker);
	
	exports.default = { ChainObject: ChainObject, ChainAccount: ChainAccount, ChainKeyRefs: ChainKeyRefs, ChainAddressBalances: ChainAddressBalances, ChainAsset: ChainAsset, ChainObjectsList: ChainObjectsList, ChainAccountsList: ChainAccountsList, ChainAssetsList: ChainAssetsList };

/***/ },
/* 24 */,
/* 25 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/col");

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/col/style");

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/row");

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/row/style");

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = require("immutable");

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = require("redux");

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	if (typeof Promise === 'undefined') {
	  // Rejection tracking prevents a common issue where React gets into an
	  // inconsistent state due to an error, but it gets swallowed by a Promise,
	  // and the user has no idea what causes React's erratic future behavior.
	  __webpack_require__(100).enable();
	  window.Promise = __webpack_require__(99);
	}
	
	// fetch() polyfill for making API calls.
	__webpack_require__(104);
	
	// Object.assign() is commonly used with React.
	// It will use the native implementation if it's present and isn't buggy.
	Object.assign = __webpack_require__(97);


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _ActionTypes = __webpack_require__(22);
	
	var types = _interopRequireWildcard(_ActionTypes);
	
	var _graphenejsWs = __webpack_require__(18);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var receiveAssetList = function receiveAssetList(assetList) {
	  return {
	    type: types.RECEIVE_ASSET_LIST,
	    assetList: assetList
	  };
	};
	
	var fetchAssetList = function fetchAssetList(start, count) {
	  return function (dispatch) {
	    // Fetch data from blockchain
	    _graphenejsWs.Apis.instance().db_api().exec("list_assets", [start, count]).then(function (assetList) {
	      // Store it inside redux
	      dispatch(receiveAssetList(assetList));
	    });
	  };
	};
	
	var clearAssetList = function clearAssetList() {
	  return receiveAssetList([]);
	};
	
	// List variables that you want to expose here
	exports.default = {
	  fetchAssetList: fetchAssetList,
	  clearAssetList: clearAssetList
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style2 = __webpack_require__(15);
	
	var _layout = __webpack_require__(14);
	
	var _layout2 = _interopRequireDefault(_layout);
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _SideBar = __webpack_require__(41);
	
	var _SideBar2 = _interopRequireDefault(_SideBar);
	
	var _NavBar = __webpack_require__(37);
	
	var _NavBar2 = _interopRequireDefault(_NavBar);
	
	var _SyncError = __webpack_require__(61);
	
	var _SyncError2 = _interopRequireDefault(_SyncError);
	
	var _graphenejsLib = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Content = _layout2.default.Content;
	
	var App = function (_Component) {
	  _inherits(App, _Component);
	
	  function App(props) {
	    _classCallCheck(this, App);
	
	    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));
	
	    _this.state = {
	      synced: false,
	      syncFail: false,
	      loading: false
	    };
	    _this._syncWithBlockchain = _this._syncWithBlockchain.bind(_this);
	    return _this;
	  }
	
	  _createClass(App, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this._syncWithBlockchain();
	    }
	  }, {
	    key: '_syncWithBlockchain',
	    value: function _syncWithBlockchain() {
	      var _this2 = this;
	
	      console.log('sync blockchain');
	      this.setState({ loading: true });
	      _graphenejsLib.ChainStore.init().then(function () {
	        _this2.setState({ synced: true, loading: false, syncFail: false });
	      }).catch(function (error) {
	        console.error('ChainStore.init error', error);
	        _this2.setState({ loading: false, synced: false, syncFail: true });
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var content = null;
	
	      if (this.state.syncFail) {
	        content = _react2.default.createElement(_SyncError2.default, null);
	      } else if (this.props.connectingToBlockchain) {
	        // If it is loading, no need to show header and sider
	        content = _react2.default.createElement(
	          'span',
	          null,
	          'loading...'
	        );
	      } else if (this.props.location.pathname === '/init-error') {
	        // If init error, no need to show header and sider
	        content = this.props.children;
	      } else {
	        content = _react2.default.createElement(
	          _layout2.default,
	          { className: 'layout' },
	          _react2.default.createElement(_NavBar2.default, null),
	          _react2.default.createElement(
	            _layout2.default,
	            null,
	            _react2.default.createElement(_SideBar2.default, null),
	            _react2.default.createElement(
	              Content,
	              { id: 'main-content' },
	              this.props.children
	            )
	          )
	        );
	      }
	
	      return content;
	    }
	  }]);
	
	  return App;
	}(_react.Component);
	
	exports.default = App;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style2 = __webpack_require__(15);
	
	var _layout = __webpack_require__(14);
	
	var _layout2 = _interopRequireDefault(_layout);
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _SearchMenu = __webpack_require__(35);
	
	var _SearchMenu2 = _interopRequireDefault(_SearchMenu);
	
	var _TopMenu = __webpack_require__(36);
	
	var _TopMenu2 = _interopRequireDefault(_TopMenu);
	
	var _logo = __webpack_require__(83);
	
	var _logo2 = _interopRequireDefault(_logo);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Header = _layout2.default.Header;
	
	
	var NavBar = function NavBar() {
	  return _react2.default.createElement(
	    Header,
	    { id: 'betex-header' },
	    _react2.default.createElement(
	      'div',
	      { className: 'float-left' },
	      _react2.default.createElement(
	        'div',
	        { className: 'logo' },
	        _react2.default.createElement('img', { alt: 'logo', src: _logo2.default })
	      ),
	      _react2.default.createElement(
	        'div',
	        { className: 'search' },
	        _react2.default.createElement(_SearchMenu2.default, null)
	      )
	    ),
	    _react2.default.createElement(
	      'div',
	      { className: 'float-right' },
	      _react2.default.createElement(_TopMenu2.default, null)
	    ),
	    _react2.default.createElement('div', { className: 'clearfix' })
	  );
	};
	
	exports.default = NavBar;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style4 = __webpack_require__(11);
	
	var _menu = __webpack_require__(10);
	
	var _menu2 = _interopRequireDefault(_menu);
	
	var _style5 = __webpack_require__(91);
	
	var _input = __webpack_require__(90);
	
	var _input2 = _interopRequireDefault(_input);
	
	var _style6 = __webpack_require__(6);
	
	var _icon = __webpack_require__(5);
	
	var _icon2 = _interopRequireDefault(_icon);
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var SearchMenu = function SearchMenu() {
	  return _react2.default.createElement(
	    _menu2.default,
	    {
	      className: 'search-menu',
	      theme: 'dark'
	    },
	    _react2.default.createElement(
	      _menu2.default.Item,
	      null,
	      _react2.default.createElement(_input2.default, {
	        prefix: _react2.default.createElement(_icon2.default, { type: 'search' }),
	        placeholder: 'Search Team'
	      })
	    )
	  );
	};
	
	exports.default = SearchMenu;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style4 = __webpack_require__(85);
	
	var _badge = __webpack_require__(84);
	
	var _badge2 = _interopRequireDefault(_badge);
	
	var _style5 = __webpack_require__(11);
	
	var _menu = __webpack_require__(10);
	
	var _menu2 = _interopRequireDefault(_menu);
	
	var _style6 = __webpack_require__(6);
	
	var _icon = __webpack_require__(5);
	
	var _icon2 = _interopRequireDefault(_icon);
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var TopMenu = function (_Component) {
	  _inherits(TopMenu, _Component);
	
	  function TopMenu(props) {
	    _classCallCheck(this, TopMenu);
	
	    var _this = _possibleConstructorReturn(this, (TopMenu.__proto__ || Object.getPrototypeOf(TopMenu)).call(this, props));
	
	    _this.state = {
	      current: 'smile'
	    };
	
	    _this.handleClick = _this.handleClick.bind(_this);
	    return _this;
	  }
	
	  _createClass(TopMenu, [{
	    key: 'handleClick',
	    value: function handleClick(e) {
	      console.log('click ', e);
	      this.setState({
	        current: e.key
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        _menu2.default,
	        {
	          className: 'top-menu',
	          theme: 'dark',
	          onClick: this.handleClick,
	          selectedKeys: [this.state.current],
	          mode: 'horizontal'
	        },
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { key: 'money', className: 'amount' },
	          _react2.default.createElement(_icon2.default, { type: 'pay-circle-o' }),
	          ' 1.133006'
	        ),
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { key: 'smile' },
	          _react2.default.createElement(_icon2.default, { type: 'smile-o' })
	        ),
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { key: 'frown' },
	          _react2.default.createElement(_icon2.default, { type: 'frown-o' })
	        ),
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { key: 'star', className: 'notification' },
	          _react2.default.createElement(
	            _badge2.default,
	            { count: 5 },
	            _react2.default.createElement(_icon2.default, { type: 'star-o' })
	          )
	        )
	      );
	    }
	  }]);
	
	  return TopMenu;
	}(_react.Component);
	
	exports.default = TopMenu;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _NavBar = __webpack_require__(34);
	
	var _NavBar2 = _interopRequireDefault(_NavBar);
	
	__webpack_require__(75);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _NavBar2.default;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style3 = __webpack_require__(11);
	
	var _menu = __webpack_require__(10);
	
	var _menu2 = _interopRequireDefault(_menu);
	
	var _style4 = __webpack_require__(6);
	
	var _icon = __webpack_require__(5);
	
	var _icon2 = _interopRequireDefault(_icon);
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var FooterMenu = function (_Component) {
	  _inherits(FooterMenu, _Component);
	
	  function FooterMenu() {
	    _classCallCheck(this, FooterMenu);
	
	    return _possibleConstructorReturn(this, (FooterMenu.__proto__ || Object.getPrototypeOf(FooterMenu)).apply(this, arguments));
	  }
	
	  _createClass(FooterMenu, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        _menu2.default,
	        {
	          theme: 'dark',
	          className: 'footer-menu',
	          mode: 'vertical'
	        },
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { className: 'connectivity' },
	          _react2.default.createElement(_icon2.default, { type: 'smile-o' }),
	          _react2.default.createElement(
	            'span',
	            { className: 'submenu-title nav-text' },
	            'CONNECTED'
	          )
	        ),
	        _react2.default.createElement(_menu2.default.Divider, null),
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { className: 'clock' },
	          _react2.default.createElement(
	            'span',
	            null,
	            '13:15'
	          )
	        )
	      );
	    }
	  }]);
	
	  return FooterMenu;
	}(_react.Component);
	
	exports.default = FooterMenu;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style2 = __webpack_require__(15);
	
	var _layout = __webpack_require__(14);
	
	var _layout2 = _interopRequireDefault(_layout);
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _SideMenu = __webpack_require__(40);
	
	var _SideMenu2 = _interopRequireDefault(_SideMenu);
	
	var _FooterMenu = __webpack_require__(38);
	
	var _FooterMenu2 = _interopRequireDefault(_FooterMenu);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Sider = _layout2.default.Sider;
	
	var SideBar = function (_Component) {
	  _inherits(SideBar, _Component);
	
	  function SideBar(props) {
	    _classCallCheck(this, SideBar);
	
	    var _this = _possibleConstructorReturn(this, (SideBar.__proto__ || Object.getPrototypeOf(SideBar)).call(this, props));
	
	    _this.state = {
	      collapsed: true
	    };
	
	    _this._onMouseOver = _this._onMouseOver.bind(_this);
	    _this._onMouseOut = _this._onMouseOut.bind(_this);
	    return _this;
	  }
	
	  _createClass(SideBar, [{
	    key: '_onMouseOver',
	    value: function _onMouseOver() {
	      this.setState({ collapsed: false });
	    }
	  }, {
	    key: '_onMouseOut',
	    value: function _onMouseOut() {
	      this.setState({ collapsed: true });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        Sider,
	        {
	          id: 'betex-sider',
	          collapsible: true,
	          collapsed: this.state.collapsed,
	          trigger: null,
	          onMouseOver: this._onMouseOver,
	          onMouseOut: this._onMouseOut
	        },
	        _react2.default.createElement(_SideMenu2.default, null),
	        _react2.default.createElement(_FooterMenu2.default, null)
	      );
	    }
	  }]);
	
	  return SideBar;
	}(_react.Component);
	
	exports.default = SideBar;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style3 = __webpack_require__(11);
	
	var _menu = __webpack_require__(10);
	
	var _menu2 = _interopRequireDefault(_menu);
	
	var _style4 = __webpack_require__(6);
	
	var _icon = __webpack_require__(5);
	
	var _icon2 = _interopRequireDefault(_icon);
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(20);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SideMenu = function (_Component) {
	  _inherits(SideMenu, _Component);
	
	  function SideMenu(props) {
	    _classCallCheck(this, SideMenu);
	
	    var _this = _possibleConstructorReturn(this, (SideMenu.__proto__ || Object.getPrototypeOf(SideMenu)).call(this, props));
	
	    _this.state = {
	      current: '0'
	    };
	
	    _this._handleClick = _this._handleClick.bind(_this);
	    return _this;
	  }
	
	  _createClass(SideMenu, [{
	    key: '_handleClick',
	    value: function _handleClick(e) {
	      console.log('click ', e);
	      var current = e.key;
	      this.setState({ current: current });
	      switch (current) {
	        case 'blockchain_test_page':
	          {
	            _reactRouter.browserHistory.push('/blockchain-test-page');
	            break;
	          }
	        case 'home':
	          {
	            _reactRouter.browserHistory.push('/home');
	            break;
	          }
	        case 'my_account':
	          {
	            _reactRouter.browserHistory.push('/my-account');
	            break;
	          }
	        case 'my_wager':
	          {
	            _reactRouter.browserHistory.push('/my-wager');
	            break;
	          }
	        default:
	          {
	            _reactRouter.browserHistory.push('/empty-page');
	            break;
	          }
	
	      }
	    }
	  }, {
	    key: '_renderMenuTitle',
	    value: function _renderMenuTitle(icon, title) {
	      return _react2.default.createElement(
	        'span',
	        null,
	        _react2.default.createElement(_icon2.default, { type: icon }),
	        _react2.default.createElement(
	          'span',
	          { className: 'submenu-title nav-text' },
	          title
	        )
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        _menu2.default,
	        {
	          className: 'side-menu',
	          theme: 'dark',
	          onClick: this._handleClick,
	          defaultOpenKeys: ['american_football'],
	          selectedKeys: [this.state.current],
	          mode: 'vertical'
	        },
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { key: 'home' },
	          this._renderMenuTitle('home', 'HOME')
	        ),
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { key: 'american_football' },
	          this._renderMenuTitle('like-o', 'AMERICAN FOOTBALL')
	        ),
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { key: 'hockey' },
	          this._renderMenuTitle('check', 'HOCKEY')
	        ),
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { key: 'baseball' },
	          this._renderMenuTitle('rocket', 'BASEBALL')
	        ),
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { key: 'basketball' },
	          this._renderMenuTitle('pause-circle-o', 'BASKETBALL')
	        ),
	        _react2.default.createElement(_menu2.default.Divider, null),
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { key: 'my_account' },
	          this._renderMenuTitle('user', 'MY ACCOUNT')
	        ),
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { key: 'my_wager' },
	          this._renderMenuTitle('calendar', 'MY WAGER')
	        ),
	        _react2.default.createElement(_menu2.default.Divider, null),
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { key: 'question' },
	          this._renderMenuTitle('question-circle-o', 'HELP & SUPPORT')
	        ),
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { key: 'logout' },
	          this._renderMenuTitle('logout', 'SIGN OUT')
	        ),
	        _react2.default.createElement(_menu2.default.Divider, null),
	        _react2.default.createElement(
	          _menu2.default.Item,
	          { key: 'blockchain_test_page' },
	          this._renderMenuTitle('eye', 'BLOCKCHAIN TEST PAGE')
	        )
	      );
	    }
	  }]);
	
	  return SideMenu;
	}(_react.Component);
	
	exports.default = SideMenu;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _SideBar = __webpack_require__(39);
	
	var _SideBar2 = _interopRequireDefault(_SideBar);
	
	__webpack_require__(76);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _SideBar2.default;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _App = __webpack_require__(33);
	
	var _App2 = _interopRequireDefault(_App);
	
	__webpack_require__(74);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _App2.default;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style3 = __webpack_require__(6);
	
	var _icon = __webpack_require__(5);
	
	var _icon2 = _interopRequireDefault(_icon);
	
	var _style4 = __webpack_require__(89);
	
	var _collapse = __webpack_require__(88);
	
	var _collapse2 = _interopRequireDefault(_collapse);
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _BetSlipTable = __webpack_require__(44);
	
	var _BetSlipTable2 = _interopRequireDefault(_BetSlipTable);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Panel = _collapse2.default.Panel;
	
	var BetSlip = function (_Component) {
	  _inherits(BetSlip, _Component);
	
	  function BetSlip() {
	    _classCallCheck(this, BetSlip);
	
	    return _possibleConstructorReturn(this, (BetSlip.__proto__ || Object.getPrototypeOf(BetSlip)).apply(this, arguments));
	  }
	
	  _createClass(BetSlip, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        _collapse2.default,
	        { className: 'betslip-wrapper', onChange: BetSlip.callback },
	        _react2.default.createElement(
	          Panel,
	          {
	            className: 'betslip-panel',
	            header: _react2.default.createElement(
	              'span',
	              null,
	              _react2.default.createElement(
	                'span',
	                null,
	                'BETSLIP'
	              ),
	              _react2.default.createElement(
	                'span',
	                { style: { float: 'right', marginRight: '5px' } },
	                _react2.default.createElement(_icon2.default, {
	                  type: 'close-circle',
	                  onClick: BetSlip.deleteAllPanels
	                })
	              )
	            ),
	            key: 'betslip'
	          },
	          _react2.default.createElement(_BetSlipTable2.default, null)
	        )
	      );
	    }
	  }], [{
	    key: 'callback',
	    value: function callback(key) {
	      window.console.log('callcack', key);
	    }
	  }, {
	    key: 'deleteAllPanels',
	    value: function deleteAllPanels(event) {
	      event.preventDefault();
	      // this stops the event from bubbling up to the Collapse header
	      event.stopPropagation();
	      window.console.log('clicked delete all panels', event);
	    }
	  }]);
	
	  return BetSlip;
	}(_react.Component);
	
	exports.default = BetSlip;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style3 = __webpack_require__(17);
	
	var _table = __webpack_require__(16);
	
	var _table2 = _interopRequireDefault(_table);
	
	var _style4 = __webpack_require__(8);
	
	var _button = __webpack_require__(7);
	
	var _button2 = _interopRequireDefault(_button);
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var renderBetType = function renderBetType(text, record) {
	  return _react2.default.createElement(
	    'span',
	    null,
	    _react2.default.createElement(
	      'span',
	      null,
	      record.team
	    ),
	    _react2.default.createElement('br', null),
	    _react2.default.createElement(
	      'span',
	      { className: 'bet_type' },
	      record.bet_type
	    )
	  );
	};
	
	var backColumns = [{
	  title: 'BACK',
	  dataIndex: 'back',
	  key: 'back',
	  width: '23%',
	  render: renderBetType
	}, {
	  title: 'ODDS',
	  dataIndex: 'odds',
	  key: 'odds',
	  width: '23%',
	  className: 'numeric'
	}, {
	  title: 'STAKE(B)',
	  dataIndex: 'stake',
	  key: 'stake',
	  width: '24%',
	  className: 'numeric'
	}, {
	  title: 'PROFIT(B)',
	  dataIndex: 'profit',
	  key: 'profit',
	  width: '24%',
	  className: 'numeric'
	}, {
	  title: '',
	  dataIndex: 'delete',
	  key: 'delete',
	  className: 'delete-button',
	  render: function render(text, record) {
	    return _react2.default.createElement(
	      _button2.default,
	      {
	        onClick: function onClick() {
	          return window.console.log('delete', record.key);
	        }
	      },
	      'X'
	    );
	  }
	}];
	
	var backData = [{
	  key: 1,
	  team: 'Clemson',
	  bet_type: 'Moneyline',
	  odds: '02.78',
	  stake: '0000.18',
	  profit: '00000.32'
	}, {
	  key: 2,
	  team: 'Alabama',
	  bet_type: 'Moneyline',
	  odds: '3.1',
	  stake: '0.89',
	  profit: '1.87'
	}];
	
	var layColumns = [{
	  title: 'LAY',
	  dataIndex: 'lay',
	  key: 'lay',
	  width: '23%',
	  render: renderBetType
	}, {
	  title: 'ODDS',
	  dataIndex: 'odds',
	  key: 'odds',
	  width: '23%',
	  className: 'numeric'
	}, {
	  title: "BACKER'S STAKE(B)",
	  dataIndex: 'stake',
	  key: 'stake',
	  width: '24%',
	  className: 'numeric'
	}, {
	  title: 'LIABILITY(B)',
	  dataIndex: 'liability',
	  key: 'liability',
	  width: '24%',
	  className: 'numeric'
	}, {
	  title: '',
	  dataIndex: 'delete',
	  key: 'delete',
	  className: 'delete-button',
	  render: function render(text, record) {
	    return _react2.default.createElement(
	      _button2.default,
	      {
	        onClick: function onClick() {
	          return window.console.log('delete', record.key);
	        }
	      },
	      'X'
	    );
	  }
	}];
	
	var layData = [{
	  key: 1,
	  team: 'Clemson',
	  bet_type: 'Moneyline',
	  odds: '02.78',
	  stake: '0000.18',
	  liability: '00000.32'
	}, {
	  key: 2,
	  team: 'Alabama',
	  bet_type: '+6.5',
	  odds: '3.1',
	  stake: '0.89',
	  liability: '1.87'
	}];
	
	var BetSlipTable = function (_Component) {
	  _inherits(BetSlipTable, _Component);
	
	  function BetSlipTable() {
	    _classCallCheck(this, BetSlipTable);
	
	    return _possibleConstructorReturn(this, (BetSlipTable.__proto__ || Object.getPrototypeOf(BetSlipTable)).apply(this, arguments));
	  }
	
	  _createClass(BetSlipTable, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { className: 'betslip' },
	        _react2.default.createElement(
	          'div',
	          { className: 'back' },
	          _react2.default.createElement(_table2.default, {
	            pagination: false,
	            columns: backColumns,
	            dataSource: backData
	          })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'lay' },
	          _react2.default.createElement(_table2.default, {
	            pagination: false,
	            columns: layColumns,
	            dataSource: layData
	          })
	        ),
	        _react2.default.createElement(
	          _button2.default,
	          { className: 'place_bet' },
	          'PLACE BET $0.295'
	        )
	      );
	    }
	  }]);
	
	  return BetSlipTable;
	}(_react.Component);
	
	exports.default = BetSlipTable;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _BetSlip = __webpack_require__(43);
	
	var _BetSlip2 = _interopRequireDefault(_BetSlip);
	
	__webpack_require__(77);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _BetSlip2.default;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style2 = __webpack_require__(8);
	
	var _button = __webpack_require__(7);
	
	var _button2 = _interopRequireDefault(_button);
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _lodash = __webpack_require__(12);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _graphenejsLib = __webpack_require__(2);
	
	var _graphenejsWs = __webpack_require__(18);
	
	var _utility = __webpack_require__(9);
	
	var _reactRedux = __webpack_require__(19);
	
	var _AssetActions = __webpack_require__(32);
	
	var _AssetActions2 = _interopRequireDefault(_AssetActions);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var BlockchainTestPage = function (_Component) {
	  _inherits(BlockchainTestPage, _Component);
	
	  function BlockchainTestPage(props) {
	    _classCallCheck(this, BlockchainTestPage);
	
	    var _this = _possibleConstructorReturn(this, (BlockchainTestPage.__proto__ || Object.getPrototypeOf(BlockchainTestPage)).call(this, props));
	
	    _this.state = {
	      objectIdTextInputValue: '',
	      orderList: [],
	      orderCancelInProgressList: [],
	      makeOpenOrderInProgress: false,
	      fetchRecentHistoryInProgress: false,
	      fetchMarketLimitOrdersInSeriesInProgress: false,
	      fetchMarketLimitOrdersInParallelInProgress: false,
	      getObjectInProgress: false
	    };
	
	    _this._makeOpenOrder = _this._makeOpenOrder.bind(_this);
	    _this._onObjectIdTextInputChange = _this._onObjectIdTextInputChange.bind(_this);
	    _this._getObject = _this._getObject.bind(_this);
	    _this._cancelOrder = _this._cancelOrder.bind(_this);
	    _this._renderOrderList = _this._renderOrderList.bind(_this);
	    _this._renderAssetList = _this._renderAssetList.bind(_this);
	    _this._getListOfOpenOrders = _this._getListOfOpenOrders.bind(_this);
	    _this._fetchRecentTransactionHistory = _this._fetchRecentTransactionHistory.bind(_this);
	    _this._fetchMarketLimitOrdersInSeries = _this._fetchMarketLimitOrdersInSeries.bind(_this);
	    _this._fetchMarketLimitOrdersInParallel = _this._fetchMarketLimitOrdersInParallel.bind(_this);
	    return _this;
	  }
	
	  _createClass(BlockchainTestPage, [{
	    key: '_getObject',
	    value: function _getObject() {
	      var _this2 = this;
	
	      this.setState({ getObjectInProgress: true });
	      // Demonstrate async way of getting object by transforming getObject with FetchChain
	      (0, _graphenejsLib.FetchChain)('getObject', this.state.objectIdTextInputValue).then(function (object) {
	        if (object === null) {
	          console.log('No such object');
	        } else {
	          console.log('Object ', _this2.state.objectIdTextInputValue + ':\n', object.toJS());
	        }
	      }).catch(function (error) {
	        console.log('CAUGHT AN ERROR');
	        console.error(error);
	      }).then(function () {
	        _this2.setState({ getObjectInProgress: false });
	      });
	    }
	  }, {
	    key: '_getCurrentBlockchainData',
	    value: function _getCurrentBlockchainData() {
	      // Demonstrate sync way of getting object
	      // Since object 2.1.0 is already retrieved in ChainStore.init, the following call will fetch the object from the cache
	      var object = _graphenejsLib.ChainStore.getObject('2.1.0');
	      if (!object) {
	        console.log('Fetching data in progress... Please try again in a moment...');
	        return;
	      }
	      console.log('Current Blockchain data:\n', object.toJS());
	    }
	  }, {
	    key: '_getGlobalParameter',
	    value: function _getGlobalParameter() {
	      // Demonstrate sync way of getting object
	      // Since object 2.0.0 has never been retrieved before, the first call will return undefined until it finishes fetching it from blockchain
	      // The next time you call this again, it will fetch it from the cache
	      // Normally (and ought to) the usage of ChainStore in sync way is used together with BindToChainState
	      var object = _graphenejsLib.ChainStore.getObject('2.0.0');
	      if (!object) {
	        console.log('Fetching data in progress... Please try again in a moment...');
	        return;
	      }
	      console.log('Blockchain Global Parameter:\n', object.toJS());
	    }
	  }, {
	    key: '_getAccount',
	    value: function _getAccount() {
	      // Demonstrate sync way of getting object
	      // Notice that ii-5 account object is already binded with BindToChainState
	      // Therefore the following call will result in fetching the right object from cache
	      var object = _graphenejsLib.ChainStore.getAccount('ii-5'); // this is ii-5 account id
	      console.log('Account:\n', object.toJS());
	    }
	  }, {
	    key: '_fetchRecentTransactionHistory',
	    value: function _fetchRecentTransactionHistory() {
	      // Transaction history is contained inside account object
	      // Similar to _getAccount(), notice that account is already binded by BindToChainState
	      // Therefore the following call will result in an object
	      var account = _graphenejsLib.ChainStore.getAccount('ii-5'); // this is ii-5 account id
	      var history = account.get('history');
	      console.log('Transaction History:', history.toJS());
	    }
	  }, {
	    key: '_fetchMarketLimitOrdersInParallel',
	    value: function _fetchMarketLimitOrdersInParallel() {
	      var _this3 = this;
	
	      // Demonstrate the speed of fetching 10 market orders in parallel
	      this.setState({ fetchMarketLimitOrdersInParallelInProgress: true });
	      Promise.all([_graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.943', 20]), _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.113', 10]), _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.121', 5]), _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.562', 0]), _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.861', 1000]), _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.973', 10000]), _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.103', 100]), _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.120', 100]), _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.106', 100]), _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.924', 100])]).then(function (values) {
	        var marketLimitOrders = [];
	        for (var i = 0; i < values.length; i++) {
	          marketLimitOrders = _lodash2.default.concat(marketLimitOrders, values[i]);
	        }
	        _this3.setState({ fetchMarketLimitOrdersInParallelInProgress: false });
	        console.log('MARKET LIMIT ORDERS', marketLimitOrders);
	      });
	    }
	  }, {
	    key: '_fetchMarketLimitOrdersInSeries',
	    value: function _fetchMarketLimitOrdersInSeries() {
	      var _this4 = this;
	
	      // Demonstrate the speed of fetching 10 market orders in series
	      var marketLimitOrders = [];
	      var appendMarketLimitOrders = function appendMarketLimitOrders(newFetchedLimitOrders) {
	        marketLimitOrders = _lodash2.default.concat(marketLimitOrders, newFetchedLimitOrders);
	      };
	
	      // Test fetching twenty market limit orders sequentially
	      this.setState({ fetchMarketLimitOrdersInSeriesInProgress: true });
	      _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.943', 100]).then(function (limitOrders) {
	        console.log('LIMIT ORDERS FETCHED');
	        appendMarketLimitOrders(limitOrders);
	        return _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.113', 100]);
	      }).then(function (limitOrders) {
	        console.log('LIMIT ORDERS FETCHED');
	        appendMarketLimitOrders(limitOrders);
	        return _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.121', 100]);
	      }).then(function (limitOrders) {
	        console.log('LIMIT ORDERS FETCHED');
	        appendMarketLimitOrders(limitOrders);
	        return _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.562', 100]);
	      }).then(function (limitOrders) {
	        console.log('LIMIT ORDERS FETCHED');
	        appendMarketLimitOrders(limitOrders);
	        return _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.861', 100]);
	      }).then(function (limitOrders) {
	        console.log('LIMIT ORDERS FETCHED');
	        appendMarketLimitOrders(limitOrders);
	        return _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.973', 100]);
	      }).then(function (limitOrders) {
	        console.log('LIMIT ORDERS FETCHED');
	        appendMarketLimitOrders(limitOrders);
	        return _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.103', 100]);
	      }).then(function (limitOrders) {
	        console.log('LIMIT ORDERS FETCHED');
	        appendMarketLimitOrders(limitOrders);
	        return _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.120', 100]);
	      }).then(function (limitOrders) {
	        console.log('LIMIT ORDERS FETCHED');
	        appendMarketLimitOrders(limitOrders);
	        return _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.106', 100]);
	      }).then(function (limitOrders) {
	        console.log('LIMIT ORDERS FETCHED');
	        appendMarketLimitOrders(limitOrders);
	        return _graphenejsWs.Apis.instance().db_api().exec('get_limit_orders', ['1.3.0', '1.3.924', 100]);
	      }).then(function (limitOrders) {
	        console.log('LIMIT ORDERS FETCHED');
	        appendMarketLimitOrders(limitOrders);
	      }).catch(function (error) {
	        console.log('CAUGHT AN ERROR');
	        console.log(error);
	      }).then(function () {
	        console.log('LIMIT ORDERS FETCH DONE');
	        _this4.setState({ fetchMarketLimitOrdersInSeriesInProgress: false });
	        console.log('MARKET LIMIT ORDERS', marketLimitOrders);
	      });
	    }
	  }, {
	    key: '_getListOfOpenOrders',
	    value: function _getListOfOpenOrders() {
	      // List of open orders is contained inside account object
	      // Similar to _getAccount(), notice that account is already binded by BindToChainState
	      // Therefore the following call will result in an object
	      var object = _graphenejsLib.ChainStore.getAccount('ii-5'); // this is ii-5 account id
	      var orderList = object.get('orders').toJS();
	      console.log('Orders:\n', orderList);
	      // Store order inside internal state
	      this.setState({ orderList: orderList });
	    }
	  }, {
	    key: '_processTransaction',
	    value: function _processTransaction(tr, callback) {
	      // In this case, both public key and private key are hardcoded
	      var ii5PublicKeys = ['BTS76Ht7MbK6hDqGSdJvXnrmmUU2v9XfNZRJVaf6E4mAHUpCcfc8G'];
	      var ii5PrivateKeys = {
	        'BTS76Ht7MbK6hDqGSdJvXnrmmUU2v9XfNZRJVaf6E4mAHUpCcfc8G': _graphenejsLib.PrivateKey.fromWif('5JxYc27FySQWqacFWogGqTjuV6mhVoceao5bZFTsJ3v9kTgK8Hj')
	      };
	
	      // Set required fees
	      tr.set_required_fees().then(function () {
	        // Get potential signatures
	        // Inside, it's trying to ask the blockchain based on the seller account id attached in the transaction
	        return tr.get_potential_signatures();
	      }).then(function (_ref) {
	        var pubkeys = _ref.pubkeys;
	
	        // Check if none of the potential public keys is equal to our public keys
	        var myPubKeys = _lodash2.default.intersection(pubkeys, ii5PublicKeys);
	        if (_lodash2.default.isEmpty(myPubKeys)) {
	          throw new Error('No Potential Signatures');
	        }
	        // Filter potential signatures to get required keys needed to sign the transaction
	        return tr.get_required_signatures(myPubKeys);
	      }).then(function (requiredPubKeys) {
	        _lodash2.default.forEach(requiredPubKeys, function (requiredPubKey) {
	          // Get private key pair
	          var requiredPrivKey = ii5PrivateKeys[requiredPubKey];
	          // Add signature
	          tr.add_signer(requiredPrivKey, requiredPubKey);
	        });
	        // Broadcast transaction
	        return tr.broadcast();
	      }).then(function (res) {
	        console.log('PROCESSING TRANSACTION SUCCESS', res);
	        callback(true);
	      }).catch(function (error) {
	        console.error('PROCESSING TRANSACTION FAIL', error);
	        callback(false);
	      });
	    }
	  }, {
	    key: '_makeOpenOrder',
	    value: function _makeOpenOrder() {
	      var _this5 = this;
	
	      // Notice that sell asset and buy asset has been retrieved before this component is renderred
	      // It is because both of them are already binded by BindToChainState
	      var sellAsset = this.props.sellAsset; // Core token
	      var buyAsset = this.props.buyAsset; // BIT USD
	      var sellAssetAmount = 0.0123;
	      var buyAssetAmount = 10;
	      var accountId = '1.2.153075'; // this is ii-5 account id
	      var sellAssetSatoshiAmount = _utility.BlockchainUtils.get_satoshi_amount(sellAssetAmount, sellAsset);
	      var buyAssetSatoshiAmount = _utility.BlockchainUtils.get_satoshi_amount(buyAssetAmount, buyAsset);
	      var expiration = new Date();
	      expiration.setYear(expiration.getFullYear() + 5);
	      var fillOrKill = false; // Don't know what this one is used for, but from the wallet, "false" value is always used
	      var feeId = '1.3.0'; // Just use core token to pay the fee
	
	      // Create transaction and add operation
	      var tr = new _graphenejsLib.TransactionBuilder();
	      var operationParams = {
	        fee: {
	          amount: 0,
	          asset_id: feeId
	        },
	        seller: accountId,
	        amount_to_sell: {
	          amount: sellAssetSatoshiAmount,
	          asset_id: sellAsset.get('id')
	        },
	        min_to_receive: {
	          amount: buyAssetSatoshiAmount,
	          asset_id: buyAsset.get('id')
	        },
	        expiration: expiration,
	        fill_or_kill: fillOrKill,
	        feeId: feeId,
	        extensions: []
	      };
	      tr.add_type_operation('limit_order_create', operationParams);
	
	      // Mark open order in progress
	      this.setState({ makeOpenOrderInProgress: true });
	      // Process transaction
	      this._processTransaction(tr, function (success) {
	        // Mark open order in progress finish
	        _this5.setState({ makeOpenOrderInProgress: false });
	        if (success) {
	          // Refresh order list
	          _this5._getListOfOpenOrders();
	        }
	      });
	    }
	  }, {
	    key: '_cancelOrder',
	    value: function _cancelOrder(orderId) {
	      var _this6 = this;
	
	      var accountId = '1.2.153075'; // this is ii-5 account id
	      var feeId = '1.3.0'; // this is core asset (BTS)
	
	      // Create transaction and add operation
	      var tr = new _graphenejsLib.TransactionBuilder();
	      var operationParams = {
	        fee: {
	          amount: 0,
	          asset_id: feeId
	        },
	        fee_paying_account: accountId,
	        order: orderId
	      };
	      tr.add_type_operation('limit_order_cancel', operationParams);
	
	      // Add order id to order in progress list, this disable the Button
	      var orderCancelInProgressList = this.state.orderCancelInProgressList;
	      orderCancelInProgressList = _lodash2.default.concat(orderCancelInProgressList, orderId);
	      this.setState({ orderCancelInProgressList: orderCancelInProgressList });
	      // Process transaction
	      this._processTransaction(tr, function () {
	        // Remove order id from order in progress list, this enable back the button
	        orderCancelInProgressList = _lodash2.default.remove(orderCancelInProgressList, orderId);
	        _this6.setState({ orderCancelInProgressList: orderCancelInProgressList });
	        // Refresh order list
	        _this6._getListOfOpenOrders();
	      });
	    }
	  }, {
	    key: '_onObjectIdTextInputChange',
	    value: function _onObjectIdTextInputChange(event) {
	      var text = event.target.value;
	      this.setState({ objectIdTextInputValue: text });
	    }
	  }, {
	    key: '_renderOrderList',
	    value: function _renderOrderList() {
	      var _this7 = this;
	
	      if (!_lodash2.default.isEmpty(this.state.orderList)) {
	        var orderListItems = _lodash2.default.map(this.state.orderList, function (orderId) {
	          var disabled = _lodash2.default.includes(_this7.state.orderCancelInProgressList, orderId);
	          return _react2.default.createElement(
	            'div',
	            { key: orderId },
	            _react2.default.createElement(
	              'span',
	              { key: orderId + 'label' },
	              'Order Id: ' + orderId
	            ),
	            _react2.default.createElement(
	              _button2.default,
	              { key: orderId + 'button', disabled: disabled, onClick: function onClick() {
	                  _this7._cancelOrder(orderId);
	                } },
	              'Cancel Order'
	            )
	          );
	        });
	        return _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'div',
	            null,
	            '------------------------------------------------'
	          ),
	          _react2.default.createElement(
	            'div',
	            null,
	            'Order List'
	          ),
	          _react2.default.createElement(
	            'div',
	            null,
	            orderListItems
	          )
	        );
	      }
	      return null;
	    }
	  }, {
	    key: '_renderAssetList',
	    value: function _renderAssetList() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        this.props.assetList.map(function (asset, index) {
	          return _react2.default.createElement(
	            'div',
	            { key: index },
	            asset.symbol
	          );
	        })
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this8 = this;
	
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'b',
	            null,
	            'DISCLAIMER: THIS TEST PAGE ONLY WORKS IF YOU ARE CONNECTED TO BITSHARES BLOCKCHAIN'
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          'Welcome To Blockchain! Use your ',
	          _react2.default.createElement(
	            'b',
	            null,
	            'Chrome Developer Tools\' Console'
	          ),
	          ' to see the output'
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          'If you want to see how BindToChainState works, pay attention on propTypes, defaultProps, _getAccount(), and BindedBlockchainTestPage '
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          '------------------------------------------------'
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            'span',
	            null,
	            'Object Id: '
	          ),
	          _react2.default.createElement('input', { type: 'text', name: 'objectId', value: this.state.objectIdTextInputValue, onChange: this._onObjectIdTextInputChange }),
	          _react2.default.createElement(
	            _button2.default,
	            { onClick: this._getObject, disabled: !this.state.objectIdTextInputValue || this.state.getObjectInProgress },
	            'Get Object ' + this.state.objectIdTextInputValue
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          '------------------------------------------------'
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            _button2.default,
	            { onClick: this._getCurrentBlockchainData },
	            'Get Object 2.1.0 (Current Blockchain data)'
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            _button2.default,
	            { onClick: this._getGlobalParameter },
	            'Get Object 2.0.0 (Blockchain Global Parameter)'
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            _button2.default,
	            { onClick: this._getAccount },
	            'Get Account Info'
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            _button2.default,
	            { onClick: this._getListOfOpenOrders },
	            'Get List of Open Orders'
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            _button2.default,
	            { onClick: this._fetchRecentTransactionHistory, disabled: this.state.fetchRecentHistoryInProgress },
	            'Fetch Recent Transaction History'
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            _button2.default,
	            { onClick: this._makeOpenOrder, disabled: this.state.makeOpenOrderInProgress },
	            'Make Open Order'
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            _button2.default,
	            { onClick: this._fetchMarketLimitOrdersInSeries, disabled: this.state.fetchMarketLimitOrdersInSeriesInProgress },
	            'Fetch Market Limit Orders in Series'
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            _button2.default,
	            { onClick: this._fetchMarketLimitOrdersInParallel, disabled: this.state.fetchMarketLimitOrdersInParallelInProgress },
	            'Fetch Market Limit Orders in Parallel'
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          '------------------------------------------------'
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            _button2.default,
	            { onClick: function onClick() {
	                _this8.props.fetchAssetList('A', 100);
	              }, disabled: this.state.makeOpenOrderInProgress },
	            'Get List of Assets and Store it in Redux (Redux demo)'
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(
	            _button2.default,
	            { onClick: function onClick() {
	                _this8.props.clearAssetList();
	              } },
	            'Clear List of Assets from Redux (Redux demo)'
	          )
	        ),
	        this._renderOrderList(),
	        this._renderAssetList()
	      );
	    }
	  }]);
	
	  return BlockchainTestPage;
	}(_react.Component);
	
	BlockchainTestPage.propTypes = {
	  account: _utility.ChainTypes.ChainAccount.isRequired,
	  sellAsset: _utility.ChainTypes.ChainAsset.isRequired,
	  buyAsset: _utility.ChainTypes.ChainAsset.isRequired
	};
	BlockchainTestPage.defaultProps = {
	  account: 'ii-5',
	  sellAsset: '1.3.0',
	  buyAsset: '1.3.121'
	};
	
	
	var BindedBlockchainTestPage = (0, _utility.BindToChainState)()(BlockchainTestPage);
	var mapStateToProps = function mapStateToProps(state) {
	  var asset = state.asset;
	
	  return {
	    assetList: asset.assetList
	  };
	};
	
	var mapDispatchToProps = function mapDispatchToProps(dispatch) {
	  return {
	    fetchAssetList: function fetchAssetList(start, count) {
	      dispatch(_AssetActions2.default.fetchAssetList(start, count));
	    },
	    clearAssetList: function clearAssetList() {
	      dispatch(_AssetActions2.default.clearAssetList());
	    }
	  };
	};
	
	exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(BindedBlockchainTestPage);

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _BlockchainTestPage = __webpack_require__(46);
	
	var _BlockchainTestPage2 = _interopRequireDefault(_BlockchainTestPage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _BlockchainTestPage2.default;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var EmptyPage = function (_Component) {
	  _inherits(EmptyPage, _Component);
	
	  function EmptyPage() {
	    _classCallCheck(this, EmptyPage);
	
	    return _possibleConstructorReturn(this, (EmptyPage.__proto__ || Object.getPrototypeOf(EmptyPage)).apply(this, arguments));
	  }
	
	  _createClass(EmptyPage, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        'Nothing here yet!'
	      );
	    }
	  }]);
	
	  return EmptyPage;
	}(_react.Component);
	
	exports.default = EmptyPage;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Banner = function Banner() {
	  return _react2.default.createElement(
	    'div',
	    { className: 'banner' },
	    _react2.default.createElement(
	      'div',
	      { className: 'statistics' },
	      _react2.default.createElement(
	        'div',
	        { className: 'digits' },
	        _react2.default.createElement(
	          'span',
	          { className: 'digit' },
	          '1'
	        ),
	        _react2.default.createElement(
	          'span',
	          { className: 'digit' },
	          '1'
	        ),
	        _react2.default.createElement(
	          'span',
	          { className: 'digit' },
	          '0'
	        ),
	        _react2.default.createElement(
	          'span',
	          { className: 'digit' },
	          '0'
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        { className: 'text' },
	        _react2.default.createElement(
	          'span',
	          { className: 'text' },
	          'IN PLAY IN 100 OPEN GAMES'
	        )
	      )
	    )
	  );
	};
	
	exports.default = Banner;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _BetSlip = __webpack_require__(45);
	
	var _BetSlip2 = _interopRequireDefault(_BetSlip);
	
	var _Banner = __webpack_require__(49);
	
	var _Banner2 = _interopRequireDefault(_Banner);
	
	var _MarketTable = __webpack_require__(54);
	
	var _MarketTable2 = _interopRequireDefault(_MarketTable);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Home = function Home() {
	  return _react2.default.createElement(
	    'div',
	    { id: 'home-wrapper' },
	    _react2.default.createElement(
	      'div',
	      { className: 'left-content' },
	      _react2.default.createElement(_Banner2.default, null),
	      _react2.default.createElement(_MarketTable2.default, null)
	    ),
	    _react2.default.createElement(
	      'div',
	      { className: 'right-content' },
	      _react2.default.createElement(_BetSlip2.default, null),
	      _react2.default.createElement(_BetSlip2.default, null),
	      _react2.default.createElement(_BetSlip2.default, null)
	    )
	  );
	};
	
	exports.default = Home;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Home = __webpack_require__(50);
	
	var _Home2 = _interopRequireDefault(_Home);
	
	__webpack_require__(78);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _Home2.default;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style2 = __webpack_require__(8);
	
	var _button = __webpack_require__(7);
	
	var _button2 = _interopRequireDefault(_button);
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var InitError = function (_Component) {
	  _inherits(InitError, _Component);
	
	  function InitError(props) {
	    _classCallCheck(this, InitError);
	
	    var _this = _possibleConstructorReturn(this, (InitError.__proto__ || Object.getPrototypeOf(InitError)).call(this, props));
	
	    _this._onReloadClick = _this._onReloadClick.bind(_this);
	    return _this;
	  }
	
	  _createClass(InitError, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          null,
	          'Fail to Connect to Blockchain'
	        ),
	        _react2.default.createElement(
	          _button2.default,
	          { type: 'primary', size: 'large', onClick: this._onReloadClick },
	          'Click here to retry'
	        )
	      );
	    }
	  }, {
	    key: '_onReloadClick',
	    value: function _onReloadClick(e) {
	      if (e) {
	        e.preventDefault();
	      }
	      if (window.electron) {
	        window.remote.getCurrentWindow().reload();
	      } else {
	        window.location.href = '/';
	      }
	    }
	  }]);
	
	  return InitError;
	}(_react.Component);
	
	exports.default = InitError;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style4 = __webpack_require__(28);
	
	var _row = __webpack_require__(27);
	
	var _row2 = _interopRequireDefault(_row);
	
	var _style5 = __webpack_require__(26);
	
	var _col = __webpack_require__(25);
	
	var _col2 = _interopRequireDefault(_col);
	
	var _style6 = __webpack_require__(6);
	
	var _icon = __webpack_require__(5);
	
	var _icon2 = _interopRequireDefault(_icon);
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var renderOffer = function renderOffer(odds, price) {
	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(
	      'div',
	      { className: 'odds' },
	      odds
	    ),
	    _react2.default.createElement(
	      'div',
	      { className: 'price' },
	      'B ',
	      price
	    )
	  );
	};
	
	var renderControl = function renderControl() {
	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(
	      'a',
	      { href: '/', onClick: function onClick(e) {
	          return e.preventDefault();
	        } },
	      _react2.default.createElement(_icon2.default, { type: 'left' })
	    ),
	    _react2.default.createElement(
	      'a',
	      { href: '/', onClick: function onClick(e) {
	          return e.preventDefault();
	        } },
	      _react2.default.createElement(_icon2.default, { type: 'right' })
	    )
	  );
	};
	
	var MarketTable = function MarketTable() {
	  return _react2.default.createElement(
	    'div',
	    { className: 'market-table-wrapper' },
	    _react2.default.createElement(
	      _row2.default,
	      { className: 'market-type-header' },
	      _react2.default.createElement(
	        _col2.default,
	        { span: 15, className: 'market-type' },
	        'MONEYLINE'
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 3, push: 4 },
	        _react2.default.createElement(
	          'span',
	          { className: 'matched' },
	          'Matched: B 4.65'
	        )
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, push: 4 },
	        _react2.default.createElement(
	          'span',
	          { className: 'rules' },
	          _react2.default.createElement(_icon2.default, { type: 'info-circle-o' }),
	          ' Rules'
	        )
	      )
	    ),
	    _react2.default.createElement(
	      _row2.default,
	      { className: 'all-header' },
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, push: 15, className: 'back all' },
	        _react2.default.createElement(
	          'span',
	          null,
	          'Back all'
	        )
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, push: 15, className: 'lay all' },
	        _react2.default.createElement(
	          'span',
	          null,
	          'Lay all'
	        )
	      )
	    ),
	    _react2.default.createElement(
	      _row2.default,
	      { className: 'event' },
	      _react2.default.createElement(
	        _col2.default,
	        { span: 10, className: 'team' },
	        'CLEMSON'
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 1, className: 'control' },
	        renderControl()
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, className: 'offer' },
	        'OFFER'
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, className: 'back' },
	        renderOffer(3.10, 0.018)
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, className: 'back best' },
	        renderOffer(3.15, 0.185)
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, className: 'lay best' },
	        renderOffer(3.35, 0.12)
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, className: 'lay' },
	        renderOffer(3.40, 0.024)
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, className: 'lay' },
	        renderOffer(3.45, 0.026)
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 1, className: 'control' },
	        renderControl()
	      )
	    ),
	    _react2.default.createElement(
	      _row2.default,
	      { className: 'event' },
	      _react2.default.createElement(
	        _col2.default,
	        { span: 10, className: 'team' },
	        'ALABAMA'
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 1, className: 'control' },
	        renderControl()
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, className: 'back' },
	        renderOffer(1.40, 0.015)
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, className: 'back' },
	        renderOffer(1.41, 0.04)
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, className: 'back best' },
	        renderOffer(1.42, 1.952)
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, className: 'lay best' },
	        renderOffer(1.48, 1.467)
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, className: 'lay' },
	        renderOffer(1.49, 0.012)
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 2, className: 'lay' },
	        renderOffer(1.50, 0.032)
	      ),
	      _react2.default.createElement(
	        _col2.default,
	        { span: 1, className: 'control' },
	        renderControl()
	      )
	    )
	  );
	};
	
	exports.default = MarketTable;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _MarketTable = __webpack_require__(53);
	
	var _MarketTable2 = _interopRequireDefault(_MarketTable);
	
	__webpack_require__(79);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _MarketTable2.default;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style6 = __webpack_require__(28);
	
	var _row = __webpack_require__(27);
	
	var _row2 = _interopRequireDefault(_row);
	
	var _style7 = __webpack_require__(8);
	
	var _button = __webpack_require__(7);
	
	var _button2 = _interopRequireDefault(_button);
	
	var _style8 = __webpack_require__(26);
	
	var _col = __webpack_require__(25);
	
	var _col2 = _interopRequireDefault(_col);
	
	var _style9 = __webpack_require__(87);
	
	var _card = __webpack_require__(86);
	
	var _card2 = _interopRequireDefault(_card);
	
	var _style10 = __webpack_require__(17);
	
	var _table = __webpack_require__(16);
	
	var _table2 = _interopRequireDefault(_table);
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _qrcode = __webpack_require__(101);
	
	var _qrcode2 = _interopRequireDefault(_qrcode);
	
	var _graphenejsLib = __webpack_require__(2);
	
	var _lodash = __webpack_require__(12);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _immutable = __webpack_require__(29);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _utility = __webpack_require__(9);
	
	var _perfectScrollbar = __webpack_require__(98);
	
	var _perfectScrollbar2 = _interopRequireDefault(_perfectScrollbar);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	// import { Scrollbars } from 'react-custom-scrollbars';
	
	// import { connect } from 'react-redux';
	
	
	var operations = __webpack_require__(2).ChainTypes.operations;
	
	var ops = Object.keys(operations);
	
	var columns = [{
	  title: 'id',
	  dataIndex: 'id',
	  key: 'id',
	  // width: 150,
	  render: function render(text) {
	    return _react2.default.createElement(
	      'a',
	      { href: '#' },
	      text
	    );
	  }
	}, {
	  title: 'op',
	  dataIndex: 'op_value',
	  key: 'op_value'
	}, {
	  title: 'status',
	  dataIndex: 'status',
	  key: 'status'
	}, {
	  title: 'virtual_op',
	  dataIndex: 'virtual_op',
	  key: 'virtual_op'
	}, {
	  title: 'time',
	  dataIndex: 'tx_time',
	  key: 'tx_time'
	}, {
	  title: 'amount',
	  dataIndex: 'amount',
	  key: 'amount'
	}];
	
	var expandedRowRender = function expandedRowRender(record) {
	  return _react2.default.createElement(
	    'p',
	    null,
	    record.id
	  );
	};
	var title = function title() {
	  return 'Here is title';
	};
	var showHeader = true;
	var footer = function footer() {
	  return 'Here is footer';
	};
	var scroll = { y: 240 };
	
	var MyAccount = function (_Component) {
	  _inherits(MyAccount, _Component);
	
	  function MyAccount(props) {
	    _classCallCheck(this, MyAccount);
	
	    var _this = _possibleConstructorReturn(this, (MyAccount.__proto__ || Object.getPrototypeOf(MyAccount)).call(this, props));
	
	    _this.state = {
	      bordered: false,
	      loading: false,
	      pagination: true,
	      size: 'default',
	      // expandedRowRender,
	      title: title,
	      showHeader: showHeader,
	      footer: footer,
	      // rowSelection: {},
	      scroll: undefined,
	      txList: []
	    };
	
	    _this.fetchRecentTransactionHistory = _this.fetchRecentTransactionHistory.bind(_this);
	    _this.renderTxList = _this.renderTxList.bind(_this);
	
	    return _this;
	  }
	
	  _createClass(MyAccount, [{
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps) {
	      console.log(" should component update");
	      var _props = this.props,
	          block = _props.block,
	          dynGlobalObject = _props.dynGlobalObject;
	
	      var last_irreversible_block_num = dynGlobalObject.get("last_irreversible_block_num");
	      if (nextProps.dynGlobalObject === this.props.dynGlobalObject) {
	        return false;
	      }
	
	      this.fetchRecentTransactionHistory();
	
	      return true;
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      console.log('component did mount');
	      var dispatch = this.props.dispatch;
	
	      this.fetchRecentTransactionHistory();
	      _perfectScrollbar2.default.initialize(this.refs.global);
	
	      // ps.initialize(this.refs.global_object);
	      // ps.initialize(this.refs.dyn_global_object);
	      // ps.initialize(this.refs.global);
	    }
	
	    // calcTime(block_number) {
	    // this.setState({time: BlockchainUtils.calc_block_time(block_number, this.props.globalObject, this.props.dynGlobalObject)});
	    // }
	
	  }, {
	    key: 'fetchRecentTransactionHistory',
	    value: function fetchRecentTransactionHistory() {
	      var _this2 = this;
	
	      // console.log('fetchRecentTransactionHistory');
	
	      // It seems to fetch transaction history, one needs to have account stored in ChainStore cache first
	      var account = _graphenejsLib.ChainStore.getAccount('1.2.153075'); // this is ii-5 account id
	
	      if (!account) {
	        console.log('Fetching data in progress... Please try again in a moment...');
	        return;
	      }
	      this.setState({ fetchRecentHistoryInProgress: true });
	      // Unlike getObject or get Asset, fetchRecentHistory returns a Promise....
	      // Honestly, I don't like this inconsistency... ._.
	      _graphenejsLib.ChainStore.fetchRecentHistory(account.get('id')).then(function (updatedAccount) {
	        _this2.setState({ fetchRecentHistoryInProgress: false });
	        // console.log('Transaction History:', updatedAccount.get('history').toJS());
	
	        var txList = updatedAccount.get('history').toJS();
	        // Store order inside internal state
	        _this2.setState({ txList: txList });
	
	        var newTxList = [];
	        txList.forEach(function (order) {
	
	          order.tx_time = "" + _utility.BlockchainUtils.calc_block_time(order.block_num, _this2.props.globalObject, _this2.props.dynGlobalObject);
	          order.history = 'history';
	          order.amount = order.op[1].fee.amount + " mBTS";
	          order.op_value = order.op[0] + " op";
	
	          var last_irreversible_block_num = _this2.props.dynGlobalObject.get("last_irreversible_block_num");
	          var status = "completed";
	          if (order.block_num > last_irreversible_block_num) {
	            status = order.block_num - last_irreversible_block_num + "imcomplete";
	          }
	          order.status = status;
	
	          newTxList.push(order);
	          // return  b
	        });
	
	        console.log(newTxList);
	        _this2.setState({ txList: newTxList });
	        _perfectScrollbar2.default.update(_this2.refs.global);
	      });
	    }
	  }, {
	    key: 'renderTxList',
	    value: function renderTxList() {
	      if (!_lodash2.default.isEmpty(this.state.txList)) {
	        return _react2.default.createElement(
	          _col2.default,
	          { span: 24, style: { 'padding': '5px' } },
	          _react2.default.createElement(
	            _card2.default,
	            { title: 'Card title', bordered: false, style: { width: '100%' } },
	            _react2.default.createElement(
	              'div',
	              { style: { 'height': '500px', 'overflow': 'auto', 'overflow-x': 'hidden' },
	                ref: 'global'
	              },
	              _react2.default.createElement(_table2.default, Object.assign({}, this.state, { columns: columns, dataSource: this.state.txList,
	                ref: 'table' }))
	            )
	          )
	        );
	      }
	      return null;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;
	
	      return (
	        // <Scrollbars
	        //          style={ { height: 733 } }>
	        _react2.default.createElement(
	          'div',
	          { style: { 'padding': '5px' }
	          },
	          _react2.default.createElement(
	            _row2.default,
	            null,
	            _react2.default.createElement(
	              _col2.default,
	              { span: 8, style: { 'padding': '5px' } },
	              _react2.default.createElement(
	                _card2.default,
	                { title: 'Card title', bordered: false, style: { width: '100%' } },
	                _react2.default.createElement(
	                  'p',
	                  null,
	                  'Card content'
	                ),
	                _react2.default.createElement(
	                  'p',
	                  null,
	                  'Card content'
	                ),
	                _react2.default.createElement(
	                  'p',
	                  null,
	                  _react2.default.createElement(_qrcode2.default, { value: 'http://facebook.github.io/react/' })
	                )
	              )
	            ),
	            _react2.default.createElement(
	              _col2.default,
	              { span: 8, style: { 'padding': '5px' } },
	              _react2.default.createElement(
	                _card2.default,
	                { title: 'Card title', bordered: false, style: { width: '100%' } },
	                _react2.default.createElement(
	                  'p',
	                  null,
	                  'Card content'
	                ),
	                _react2.default.createElement(
	                  'p',
	                  null,
	                  'Card content'
	                ),
	                _react2.default.createElement(
	                  'p',
	                  { style: { height: '133px' } },
	                  _react2.default.createElement(
	                    _button2.default,
	                    { onClick: function onClick() {
	                        _this3.fetchRecentTransactionHistory();
	                      } },
	                    'refresh Order'
	                  )
	                )
	              )
	            ),
	            _react2.default.createElement(
	              _col2.default,
	              { span: 8, style: { 'padding': '5px' } },
	              _react2.default.createElement(
	                _card2.default,
	                { title: 'Card title', bordered: false, style: { width: '100%' } },
	                _react2.default.createElement(
	                  'p',
	                  null,
	                  'Card content'
	                ),
	                _react2.default.createElement(
	                  'div',
	                  {
	                    style: { height: '133px' },
	                    ref: 'global_object'
	                  },
	                  _react2.default.createElement(
	                    'div',
	                    null,
	                    JSON.stringify(this.props.dynGlobalObject)
	                  )
	                ),
	                _react2.default.createElement(
	                  'p',
	                  null,
	                  'Card content'
	                )
	              )
	            )
	          ),
	          _react2.default.createElement(
	            _row2.default,
	            null,
	            _react2.default.createElement(
	              'div',
	              null,
	              this.renderTxList()
	            )
	          )
	        )
	        //  </Scrollbars>
	
	      );
	    }
	  }]);
	
	  return MyAccount;
	}(_react.Component);
	
	MyAccount.propTypes = {
	  dynGlobalObject: _utility.ChainTypes.ChainObject.isRequired,
	  globalObject: _utility.ChainTypes.ChainObject.isRequired
	};
	MyAccount.defaultProps = {
	  dynGlobalObject: '2.1.0',
	  globalObject: '2.0.0'
	
	};
	
	
	var BindedMyAccount = (0, _utility.BindToChainState)()(MyAccount);
	
	var mapStateToProps = function mapStateToProps(state) {
	  //Mock implementation
	  return {
	    accountName: 'ii-5'
	  };
	};
	exports.default = BindedMyAccount;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _MyAccount = __webpack_require__(55);
	
	var _MyAccount2 = _interopRequireDefault(_MyAccount);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _MyAccount2.default;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style2 = __webpack_require__(95);
	
	var _tabs = __webpack_require__(94);
	
	var _tabs2 = _interopRequireDefault(_tabs);
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _utility = __webpack_require__(9);
	
	var _reactRedux = __webpack_require__(19);
	
	var _UnmatchedBets = __webpack_require__(58);
	
	var _UnmatchedBets2 = _interopRequireDefault(_UnmatchedBets);
	
	__webpack_require__(80);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var TabPane = _tabs2.default.TabPane;
	
	var MyWager = function (_Component) {
	  _inherits(MyWager, _Component);
	
	  function MyWager(props) {
	    _classCallCheck(this, MyWager);
	
	    var _this = _possibleConstructorReturn(this, (MyWager.__proto__ || Object.getPrototypeOf(MyWager)).call(this, props));
	
	    _this._onTabChange = _this._onTabChange.bind(_this);
	    return _this;
	  }
	
	  _createClass(MyWager, [{
	    key: '_onTabChange',
	    value: function _onTabChange(key) {
	      console.log(key);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var allOpenOrders = this.props.account.get('orders') ? this.props.account.get('orders').toJS() : [];
	      return _react2.default.createElement(
	        'div',
	        { className: 'my-wager' },
	        _react2.default.createElement(
	          'div',
	          { className: 'title' },
	          'My Wager'
	        ),
	        _react2.default.createElement(
	          _tabs2.default,
	          { className: 'content', defaultActiveKey: 'unmatchedBets', onChange: this._onTabChange },
	          _react2.default.createElement(
	            TabPane,
	            { tab: 'UNMATCHED BETS', key: 'unmatchedBets' },
	            _react2.default.createElement(_UnmatchedBets2.default, { allOpenOrders: allOpenOrders })
	          ),
	          _react2.default.createElement(
	            TabPane,
	            { tab: 'MATCHED BETS', key: 'matchedBets' },
	            'Content of Tab Pane 2'
	          ),
	          _react2.default.createElement(
	            TabPane,
	            { tab: 'RESOLVED BETS', key: 'resolvedBets' },
	            'Content of Tab Pane 3'
	          )
	        )
	      );
	    }
	  }]);
	
	  return MyWager;
	}(_react.Component);
	
	MyWager.propTypes = {
	  account: _utility.ChainTypes.ChainAccount.isRequired,
	  accountName: _react2.default.PropTypes.string
	};
	MyWager.defaultProps = {
	  account: 'props.accountName'
	};
	
	
	var BindedMyWager = (0, _utility.BindToChainState)()(MyWager);
	
	var mapStateToProps = function mapStateToProps(state) {
	  //Mock implementation
	  return {
	    accountName: 'ii-5'
	  };
	};
	exports.default = (0, _reactRedux.connect)(mapStateToProps)(BindedMyWager);

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style4 = __webpack_require__(17);
	
	var _table = __webpack_require__(16);
	
	var _table2 = _interopRequireDefault(_table);
	
	var _style5 = __webpack_require__(8);
	
	var _button = __webpack_require__(7);
	
	var _button2 = _interopRequireDefault(_button);
	
	var _style6 = __webpack_require__(6);
	
	var _icon = __webpack_require__(5);
	
	var _icon2 = _interopRequireDefault(_icon);
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _utility = __webpack_require__(9);
	
	var _lodash = __webpack_require__(12);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _graphenejsLib = __webpack_require__(2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var OddsOrStakeCell = function (_Component) {
	  _inherits(OddsOrStakeCell, _Component);
	
	  function OddsOrStakeCell() {
	    _classCallCheck(this, OddsOrStakeCell);
	
	    return _possibleConstructorReturn(this, (OddsOrStakeCell.__proto__ || Object.getPrototypeOf(OddsOrStakeCell)).apply(this, arguments));
	  }
	
	  _createClass(OddsOrStakeCell, [{
	    key: 'render',
	    value: function render() {
	      var value = _utility.BlockchainUtils.get_asset_amount(this.props.amount, this.props.asset);
	      return _react2.default.createElement(
	        'span',
	        null,
	        value
	      );
	    }
	  }]);
	
	  return OddsOrStakeCell;
	}(_react.Component);
	
	OddsOrStakeCell.propTypes = {
	  amount: _react2.default.PropTypes.number,
	  asset: _utility.ChainTypes.ChainAsset.isRequired
	};
	
	var BindedOddsOrStakeCell = (0, _utility.BindToChainState)()(OddsOrStakeCell);
	
	var ProfitLiabilityCell = function (_Component2) {
	  _inherits(ProfitLiabilityCell, _Component2);
	
	  function ProfitLiabilityCell() {
	    _classCallCheck(this, ProfitLiabilityCell);
	
	    return _possibleConstructorReturn(this, (ProfitLiabilityCell.__proto__ || Object.getPrototypeOf(ProfitLiabilityCell)).apply(this, arguments));
	  }
	
	  _createClass(ProfitLiabilityCell, [{
	    key: 'render',
	    value: function render() {
	      var odds = _utility.BlockchainUtils.get_asset_amount(this.props.oddsAmount, this.props.oddsAsset);
	      var stake = _utility.BlockchainUtils.get_asset_amount(this.props.stakeAmount, this.props.stakeAsset);
	      return _react2.default.createElement(
	        'span',
	        null,
	        Math.round((odds * stake - stake) * 100) / 100
	      );
	    }
	  }]);
	
	  return ProfitLiabilityCell;
	}(_react.Component);
	
	ProfitLiabilityCell.propTypes = {
	  oddsAmount: _react2.default.PropTypes.number,
	  oddsAsset: _utility.ChainTypes.ChainAsset.isRequired,
	  stakeAmount: _react2.default.PropTypes.number,
	  stakeAsset: _utility.ChainTypes.ChainAsset.isRequired
	};
	
	var BindedProfitLiabilityCell = (0, _utility.BindToChainState)()(ProfitLiabilityCell);
	
	var UnmatchedBets = function (_Component3) {
	  _inherits(UnmatchedBets, _Component3);
	
	  function UnmatchedBets(props) {
	    _classCallCheck(this, UnmatchedBets);
	
	    var _this3 = _possibleConstructorReturn(this, (UnmatchedBets.__proto__ || Object.getPrototypeOf(UnmatchedBets)).call(this, props));
	
	    _this3.state = {
	      orderCancelInProgressList: []
	    };
	    _this3._calculateTotalMoneyOnUnmatchedBets = _this3._calculateTotalMoneyOnUnmatchedBets.bind(_this3);
	    _this3._processTransaction = _this3._processTransaction.bind(_this3);
	    _this3._cancelOrder = _this3._cancelOrder.bind(_this3);
	    _this3._getColumns = _this3._getColumns.bind(_this3);
	    return _this3;
	  }
	
	  _createClass(UnmatchedBets, [{
	    key: '_getColumns',
	    value: function _getColumns() {
	      var _this4 = this;
	
	      return [{
	        title: 'Event Time',
	        render: function render(text, record, index) {
	          return _react2.default.createElement(
	            'span',
	            null,
	            record.get('id')
	          );
	        }
	      }, {
	        title: 'Event',
	        render: function render(text, record, index) {
	          return _react2.default.createElement(
	            'span',
	            null,
	            record.get('id').split('.')[2]
	          );
	        }
	      }, {
	        title: 'Type',
	        render: function render(text, record, index) {
	          return _react2.default.createElement(
	            'span',
	            null,
	            record.get('id').split('.')[1]
	          );
	        }
	      }, {
	        title: 'Sport',
	        render: function render(text, record, index) {
	          return _react2.default.createElement(_icon2.default, { type: 'rocket' });
	        }
	      }, {
	        title: 'Odds',
	        render: function render(text, record, index) {
	          var odds = _utility.BlockchainUtils.get_odds_of_order(record);
	          return _react2.default.createElement(BindedOddsOrStakeCell, { amount: odds.get('amount'), asset: odds.get('asset_id') });
	        }
	      }, {
	        title: 'Stake(B)',
	        render: function render(text, record, index) {
	          var stake = _utility.BlockchainUtils.get_stake_of_order(record);
	          return _react2.default.createElement(BindedOddsOrStakeCell, { amount: stake.get('amount'), asset: stake.get('asset_id') });
	        }
	      }, {
	        title: 'Profit / Liability(B)',
	        render: function render(text, record, index) {
	          var odds = _utility.BlockchainUtils.get_odds_of_order(record);
	          var stake = _utility.BlockchainUtils.get_stake_of_order(record);
	          return _react2.default.createElement(BindedProfitLiabilityCell, {
	            oddsAmount: odds.get('amount'),
	            oddsAsset: odds.get('asset_id'),
	            stakeAmount: stake.get('amount'),
	            stakeAsset: stake.get('asset_id')
	          });
	        }
	      }, {
	        key: 'cancel',
	        render: function render(text, record, index) {
	          var orderId = record.get('id');
	          var onClick = function onClick() {
	            _this4._cancelOrder(orderId);
	          };
	          var disabled = _lodash2.default.includes(_this4.state.orderCancelInProgressList, orderId);
	          return _react2.default.createElement(
	            _button2.default,
	            { onClick: onClick, disabled: disabled },
	            'Cancel'
	          );
	        }
	      }];
	    }
	  }, {
	    key: '_getUnmatchedBets',
	    value: function _getUnmatchedBets() {
	      return _lodash2.default.filter(this.props.allOpenOrders, function (order) {
	        if (!order) return false;
	        return order.getIn(['sell_price', 'base', 'asset_id']) === '1.3.0' || order.getIn(['sell_price', 'quote', 'asset_id']) === '1.3.0';
	      });
	    }
	  }, {
	    key: '_cancelOrder',
	    value: function _cancelOrder(orderId) {
	      var _this5 = this;
	
	      var accountId = '1.2.153075'; // this is ii-5 account id
	      var feeId = '1.3.0'; // this is core asset (BTS)
	
	      // Create transaction and add operation
	      var tr = new _graphenejsLib.TransactionBuilder();
	      var operationParams = {
	        fee: {
	          amount: 0,
	          asset_id: feeId
	        },
	        fee_paying_account: accountId,
	        order: orderId
	      };
	      tr.add_type_operation('limit_order_cancel', operationParams);
	
	      // Add order id to order in progress list, this disable the Button
	      this.setState(function (prevState) {
	        return { orderCancelInProgressList: _lodash2.default.concat(prevState.orderCancelInProgressList, orderId) };
	      });
	      // Process transaction
	      this._processTransaction(tr, function () {
	        // Remove order id from order in progress list, this enable back the button
	        _this5.setState(function (prevState) {
	          return { orderCancelInProgressList: _lodash2.default.remove(prevState.orderCancelInProgressList) };
	        });
	      });
	    }
	  }, {
	    key: '_processTransaction',
	    value: function _processTransaction(tr, callback) {
	      // In this case, both public key and private key are hardcoded
	      var ii5PublicKeys = ['BTS76Ht7MbK6hDqGSdJvXnrmmUU2v9XfNZRJVaf6E4mAHUpCcfc8G'];
	      var ii5PrivateKeys = {
	        'BTS76Ht7MbK6hDqGSdJvXnrmmUU2v9XfNZRJVaf6E4mAHUpCcfc8G': _graphenejsLib.PrivateKey.fromWif('5JxYc27FySQWqacFWogGqTjuV6mhVoceao5bZFTsJ3v9kTgK8Hj')
	      };
	
	      // Set required fees
	      tr.set_required_fees().then(function () {
	        // Get potential signatures
	        // Inside, it's trying to ask the blockchain based on the seller account id attached in the transaction
	        return tr.get_potential_signatures();
	      }).then(function (_ref) {
	        var pubkeys = _ref.pubkeys;
	
	        // Check if none of the potential public keys is equal to our public keys
	        var myPubKeys = _lodash2.default.intersection(pubkeys, ii5PublicKeys);
	        if (_lodash2.default.isEmpty(myPubKeys)) {
	          throw new Error('No Potential Signatures');
	        }
	        // Filter potential signatures to get required keys needed to sign the transaction
	        return tr.get_required_signatures(myPubKeys);
	      }).then(function (requiredPubKeys) {
	        _lodash2.default.forEach(requiredPubKeys, function (requiredPubKey) {
	          // Get private key pair
	          var requiredPrivKey = ii5PrivateKeys[requiredPubKey];
	          // Add signature
	          tr.add_signer(requiredPrivKey, requiredPubKey);
	        });
	        // Broadcast transaction
	        return tr.broadcast();
	      }).then(function (res) {
	        console.log('PROCESSING TRANSACTION SUCCESS', res);
	        callback(true);
	      }).catch(function (error) {
	        console.error('PROCESSING TRANSACTION FAIL', error);
	        callback(false);
	      });
	    }
	  }, {
	    key: '_calculateTotalMoneyOnUnmatchedBets',
	    value: function _calculateTotalMoneyOnUnmatchedBets(unmatchedBets) {
	      var total = 0; // Total in satoshi
	      _lodash2.default.forEach(unmatchedBets, function (unmatchedBet) {
	        var stake = _utility.BlockchainUtils.get_stake_of_order(unmatchedBet);
	        total += stake.get('amount');
	      });
	      var coreAsset = _graphenejsLib.ChainStore.getAsset('1.3.0');
	      // Convert from satoshi amount to correct precision
	      return _utility.BlockchainUtils.get_asset_amount(total, coreAsset);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var unmatchedBets = this._getUnmatchedBets();
	      var columns = this._getColumns();
	      var totalMoneyOnUnmatchedBets = this._calculateTotalMoneyOnUnmatchedBets(unmatchedBets);
	      return _react2.default.createElement(
	        'div',
	        { className: 'unmatched-bets' },
	        _react2.default.createElement(
	          'div',
	          null,
	          'TOTAL: $' + totalMoneyOnUnmatchedBets
	        ),
	        _react2.default.createElement(_table2.default, { pagination: false, dataSource: unmatchedBets, columns: columns, rowKey: function rowKey(record) {
	            return record.get('id');
	          } })
	      );
	    }
	  }]);
	
	  return UnmatchedBets;
	}(_react.Component);
	
	UnmatchedBets.propTypes = {
	  allOpenOrders: _utility.ChainTypes.ChainObjectsList.isRequired,
	  coreAsset: _utility.ChainTypes.ChainAsset.isRequired
	};
	UnmatchedBets.defaultProps = {
	  allOpenOrders: [],
	  coreAsset: '1.3.0'
	};
	
	
	var BindedUnmatchedBets = (0, _utility.BindToChainState)()(UnmatchedBets);
	
	exports.default = BindedUnmatchedBets;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _MyWager = __webpack_require__(57);
	
	var _MyWager2 = _interopRequireDefault(_MyWager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _MyWager2.default;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _style2 = __webpack_require__(8);
	
	var _button = __webpack_require__(7);
	
	var _button2 = _interopRequireDefault(_button);
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SyncError = function (_Component) {
	  _inherits(SyncError, _Component);
	
	  function SyncError(props) {
	    _classCallCheck(this, SyncError);
	
	    var _this = _possibleConstructorReturn(this, (SyncError.__proto__ || Object.getPrototypeOf(SyncError)).call(this, props));
	
	    _this._onReloadClick = _this._onReloadClick.bind(_this);
	    return _this;
	  }
	
	  _createClass(SyncError, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          null,
	          'Fail to Sync With Blockchain'
	        ),
	        _react2.default.createElement(
	          _button2.default,
	          { type: 'primary', size: 'large', onClick: this._onReloadClick },
	          'Click here to retry'
	        )
	      );
	    }
	  }, {
	    key: '_onReloadClick',
	    value: function _onReloadClick(e) {
	      if (e) {
	        e.preventDefault();
	      }
	      if (window.electron) {
	        window.remote.getCurrentWindow().reload();
	      } else {
	        window.location.href = '/';
	      }
	    }
	  }]);
	
	  return SyncError;
	}(_react.Component);
	
	exports.default = SyncError;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _SyncError = __webpack_require__(60);
	
	var _SyncError2 = _interopRequireDefault(_SyncError);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _SyncError2.default;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(102);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _reactRedux = __webpack_require__(19);
	
	var _reactRouter = __webpack_require__(20);
	
	var _App = __webpack_require__(42);
	
	var _App2 = _interopRequireDefault(_App);
	
	var _BlockchainTestPage = __webpack_require__(47);
	
	var _BlockchainTestPage2 = _interopRequireDefault(_BlockchainTestPage);
	
	var _EmptyPage = __webpack_require__(48);
	
	var _EmptyPage2 = _interopRequireDefault(_EmptyPage);
	
	var _InitError = __webpack_require__(52);
	
	var _InitError2 = _interopRequireDefault(_InitError);
	
	var _Home = __webpack_require__(51);
	
	var _Home2 = _interopRequireDefault(_Home);
	
	var _MyAccount = __webpack_require__(56);
	
	var _MyAccount2 = _interopRequireDefault(_MyAccount);
	
	var _MyWager = __webpack_require__(59);
	
	var _MyWager2 = _interopRequireDefault(_MyWager);
	
	var _configureStore = __webpack_require__(65);
	
	var _configureStore2 = _interopRequireDefault(_configureStore);
	
	var _reactRouterRedux = __webpack_require__(21);
	
	var _graphenejsWs = __webpack_require__(18);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// On enter handler
	var onEnter = function onEnter(nextState, replace, callback) {
	
	  var connectionString = 'wss://bitshares.openledger.info/ws';
	  // let connectionString = 'wss://bit.btsabc.org/ws';
	  // let connectionString = 'wss://bts.transwiser.com/ws';
	  // let connectionString = 'wss://bitshares.dacplay.org:8089/ws';
	  // let connectionString = 'wss://openledger.hk/ws';
	  // let connectionString = 'wss://secure.freedomledger.com/ws';
	  // let connectionString = 'wss://testnet.bitshares.eu/ws';
	
	  // Reset connection if we are going to init-error page
	  if (nextState.location.pathname === "/init-error") {
	    return _graphenejsWs.Apis.reset(connectionString, true).init_promise.then(function () {
	      return callback();
	    }).catch(function (error) {
	      console.error('Fail to reset connection to blockchain', error);
	      return callback();
	    });
	  }
	
	  // Connecting to blockchain
	  // Mark connecting to blockchain
	  _graphenejsWs.Apis.instance(connectionString, true).init_promise.then(function (res) {
	    console.log('Connected to:', res[0].network);
	    callback();
	  }).catch(function (error) {
	    console.error('Fail to connect to blockchain', error);
	    // Go to init error page
	    replace('/init-error');
	    callback();
	  });
	};
	
	// Add new page here
	var routes = _react2.default.createElement(
	  _reactRouter.Route,
	  { path: '/', component: _App2.default, onEnter: onEnter },
	  _react2.default.createElement(_reactRouter.IndexRoute, { component: _Home2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/blockchain-test-page', component: _BlockchainTestPage2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/empty-page', component: _EmptyPage2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/init-error', component: _InitError2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/home', component: _Home2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/my-account', component: _MyAccount2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/my-wager', component: _MyWager2.default })
	);
	
	var store = (0, _configureStore2.default)();
	var history = (0, _reactRouterRedux.syncHistoryWithStore)(_reactRouter.browserHistory, store);
	
	_reactDom2.default.render(_react2.default.createElement(
	  _reactRedux.Provider,
	  { store: store },
	  _react2.default.createElement(_reactRouter.Router, { history: history, routes: routes })
	), document.getElementById('root'));

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function () {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	  var action = arguments[1];
	
	  switch (action.type) {
	    case types.RECEIVE_ASSET_LIST:
	      {
	        var assetList = action.assetList;
	        return Object.assign({}, state, { assetList: assetList });
	      }
	    default:
	      return state;
	  }
	};
	
	var _ActionTypes = __webpack_require__(22);
	
	var types = _interopRequireWildcard(_ActionTypes);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var initialState = {
	  assetList: []
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _redux = __webpack_require__(30);
	
	var _AssetReducer = __webpack_require__(63);
	
	var _AssetReducer2 = _interopRequireDefault(_AssetReducer);
	
	var _reactRouterRedux = __webpack_require__(21);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var rootReducer = (0, _redux.combineReducers)({
	  asset: _AssetReducer2.default,
	  routing: _reactRouterRedux.routerReducer
	});
	
	exports.default = rootReducer;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = configureStore;
	
	var _redux = __webpack_require__(30);
	
	var _reduxThunk = __webpack_require__(103);
	
	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);
	
	var _reactRouter = __webpack_require__(20);
	
	var _reactRouterRedux = __webpack_require__(21);
	
	var _reducers = __webpack_require__(64);
	
	var _reducers2 = _interopRequireDefault(_reducers);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var createStoreWithMiddleware = (0, _redux.applyMiddleware)(_reduxThunk2.default, (0, _reactRouterRedux.routerMiddleware)(_reactRouter.browserHistory))(_redux.createStore);
	
	function configureStore(initialState) {
	  var store = createStoreWithMiddleware(_reducers2.default, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
	  return store;
	}

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _style2 = __webpack_require__(93);
	
	var _spin = __webpack_require__(92);
	
	var _spin2 = _interopRequireDefault(_spin);
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _lodash = __webpack_require__(12);
	
	var _graphenejsLib = __webpack_require__(2);
	
	var _ChainTypes = __webpack_require__(23);
	
	var _ChainTypes2 = _interopRequireDefault(_ChainTypes);
	
	var _BlockchainUtils = __webpack_require__(13);
	
	var _BlockchainUtils2 = _interopRequireDefault(_BlockchainUtils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * @brief provides automatic fetching and updating of chain data
	 *
	 * After applying this decorator to component any property of a type from ChainTypes
	 * specified in component's propTypes will be automatically converted from object or account id
	 * into a state object that is either undefined, null or an Immutable object.   The
	 * Immutable object will automatically be updated anytime it changes on the
	 * blockchain.
	 *
	 * Example:
	 *
	 * @BindToChainState()
	 * class Balance {
	 *    static propTypes = {
	 *        balance: ChainTypes.ChainObject.isRequired
	 *    }
	 *    render() {
	 *        let amount = Number(this.props.balance.get('balance'));
	 *        let type = this.props.balance.get('asset_type');
	 *        return (<FormattedAsset amount={amount} asset={type}/>);
	 *    }
	 * }
	 *
	 * <Balance balance="1.5.3"/>
	 */
	
	var arrayElement = function arrayElement(element_number, array) {
	    return array[element_number];
	};
	var firstEl = (0, _lodash.curry)(arrayElement)(0);
	var secondEl = (0, _lodash.curry)(arrayElement)(1);
	var checkChainType = (0, _lodash.curry)(function (chain_type, t) {
	    return t === chain_type || t === chain_type.isRequired;
	});
	var isObjectType = checkChainType(_ChainTypes2.default.ChainObject);
	var isAccountType = checkChainType(_ChainTypes2.default.ChainAccount);
	var isKeyRefsType = checkChainType(_ChainTypes2.default.ChainKeyRefs);
	var isAddressBalancesType = checkChainType(_ChainTypes2.default.ChainAddressBalances);
	var isAssetType = checkChainType(_ChainTypes2.default.ChainAsset);
	var isObjectsListType = checkChainType(_ChainTypes2.default.ChainObjectsList);
	var isAccountsListType = checkChainType(_ChainTypes2.default.ChainAccountsList);
	var isAssetsListType = checkChainType(_ChainTypes2.default.ChainAssetsList);
	
	function checkIfRequired(t) {
	    for (var k in _ChainTypes2.default) {
	        if (Object.prototype.hasOwnProperty.call(_ChainTypes2.default, k)) {
	            var v = _ChainTypes2.default[k];
	            if (t === v.isRequired) return true;
	        }
	    }
	    return false;
	}
	
	function BindToChainState(options) {
	    return function (Component) {
	
	        return function (_React$Component) {
	            _inherits(Wrapper, _React$Component);
	
	            function Wrapper(props) {
	                _classCallCheck(this, Wrapper);
	
	                var _this = _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call(this, props));
	
	                var prop_types_array = (0, _lodash.toPairs)(Component.propTypes);
	                if (options && options.all_props) {
	                    _this.chain_objects = (0, _lodash.reject)(Object.keys(_this.props), function (e) {
	                        return e === "children" || e === "keep_updating" || e === "show_loader";
	                    });
	                    _this.chain_accounts = [];
	                    _this.chain_key_refs = [];
	                    _this.chain_address_balances = [];
	                    _this.chain_assets = [];
	                    _this.chain_objects_list = [];
	                    _this.chain_accounts_list = [];
	                    _this.chain_assets_list = [];
	                    _this.required_props = [];
	                    _this.all_chain_props = _this.chain_objects;
	                } else {
	                    _this.chain_objects = prop_types_array.filter((0, _lodash.flow)(secondEl, isObjectType)).map(firstEl);
	                    _this.chain_accounts = prop_types_array.filter((0, _lodash.flow)(secondEl, isAccountType)).map(firstEl);
	                    _this.chain_key_refs = prop_types_array.filter((0, _lodash.flow)(secondEl, isKeyRefsType)).map(firstEl);
	                    _this.chain_address_balances = prop_types_array.filter((0, _lodash.flow)(secondEl, isAddressBalancesType)).map(firstEl);
	                    _this.chain_assets = prop_types_array.filter((0, _lodash.flow)(secondEl, isAssetType)).map(firstEl);
	                    _this.chain_objects_list = prop_types_array.filter((0, _lodash.flow)(secondEl, isObjectsListType)).map(firstEl);
	                    _this.chain_accounts_list = prop_types_array.filter((0, _lodash.flow)(secondEl, isAccountsListType)).map(firstEl);
	                    _this.chain_assets_list = prop_types_array.filter((0, _lodash.flow)(secondEl, isAssetsListType)).map(firstEl);
	                    _this.required_props = prop_types_array.filter((0, _lodash.flow)(secondEl, checkIfRequired)).map(firstEl);
	                    _this.all_chain_props = [].concat(_toConsumableArray(_this.chain_objects), _toConsumableArray(_this.chain_accounts), _toConsumableArray(_this.chain_key_refs), _toConsumableArray(_this.chain_address_balances), _toConsumableArray(_this.chain_assets), _toConsumableArray(_this.chain_objects_list));
	                }
	                if (options && options.require_all_props) {
	                    _this.required_props = _this.all_chain_props;
	                }
	                _this.dynamic_props = {};
	                _this.default_props = (0, _lodash.clone)(Component.defaultProps) || {};
	                for (var key in _this.default_props) {
	                    if (Object.prototype.hasOwnProperty.call(_this.default_props, key)) {
	                        var value = _this.default_props[key];
	                        if (typeof value === "string" && value.indexOf("props.") === 0) {
	                            _this.dynamic_props[key] = (0, _lodash.get)(_this, value);
	                        }
	                    }
	                }
	
	                _this.tempComponent = Component.defaultProps ? Component.defaultProps.tempComponent || null : null;
	
	                //console.log("----- Wrapper constructor ----->", this.all_chain_props);
	                _this.update = _this.update.bind(_this);
	                _this.state = { resolved: false };
	                return _this;
	            }
	
	            _createClass(Wrapper, [{
	                key: "shouldComponentUpdate",
	                value: function shouldComponentUpdate(nextProps, nextState) {
	                    return !_BlockchainUtils2.default.are_equal_shallow(this.props, nextProps) || !_BlockchainUtils2.default.are_equal_shallow(this.state, nextState);
	                }
	            }, {
	                key: "componentWillMount",
	                value: function componentWillMount() {
	                    _graphenejsLib.ChainStore.subscribe(this.update);
	                    this.update();
	                }
	            }, {
	                key: "componentWillUnmount",
	                value: function componentWillUnmount() {
	                    _graphenejsLib.ChainStore.unsubscribe(this.update);
	                }
	            }, {
	                key: "componentWillReceiveProps",
	                value: function componentWillReceiveProps(next_props) {
	                    if (options && options.all_props) {
	                        this.chain_objects = (0, _lodash.reject)(Object.keys(next_props), function (e) {
	                            return e === "children" || e === "keep_updating" || e === "show_loader";
	                        });
	                        this.all_chain_props = this.chain_objects;
	                        this.state = (0, _lodash.pick)(this.state, this.chain_objects);
	                    }
	                    var props_obj = null;
	                    for (var k in this.dynamic_props) {
	                        if (Object.prototype.hasOwnProperty.call(this.dynamic_props, k)) {
	                            var selector = this.default_props[k];
	                            if (!props_obj) props_obj = { props: next_props };
	                            var cur_value = (0, _lodash.get)(this, selector);
	                            var next_value = (0, _lodash.get)(props_obj, selector);
	                            if (next_value && next_value !== cur_value) {
	                                this.dynamic_props[k] = (0, _lodash.get)(props_obj, selector);
	                            }
	                        }
	                    }
	                    this.update(next_props);
	                }
	            }, {
	                key: "update",
	                value: function update() {
	                    var _this2 = this;
	
	                    var next_props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	
	                    //let keep_updating = (options && options.keep_updating) || this.props.keep_updating;
	                    //if(!next_props && !keep_updating && this.state.resolved) return;
	
	                    var props = next_props || this.props;
	                    var new_state = {};
	                    var all_objects_counter = 0;
	                    var resolved_objects_counter = 0;
	                    var _iteratorNormalCompletion = true;
	                    var _didIteratorError = false;
	                    var _iteratorError = undefined;
	
	                    try {
	                        for (var _iterator = this.chain_objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                            var key = _step.value;
	
	                            var prop = props[key] || this.dynamic_props[key] || this.default_props[key];
	                            if (prop) {
	                                var new_obj = _graphenejsLib.ChainStore.getObject(prop);
	                                if (new_obj === undefined && this.required_props.indexOf(key) === -1 && new_obj !== this.state[key]) new_state[key] = new_obj;else if (new_obj && new_obj !== this.state[key]) new_state[key] = new_obj;
	                                ++all_objects_counter;
	                                if (new_obj !== undefined) ++resolved_objects_counter;
	                            } else {
	                                if (this.state[key]) new_state[key] = null;
	                            }
	                        }
	                    } catch (err) {
	                        _didIteratorError = true;
	                        _iteratorError = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion && _iterator.return) {
	                                _iterator.return();
	                            }
	                        } finally {
	                            if (_didIteratorError) {
	                                throw _iteratorError;
	                            }
	                        }
	                    }
	
	                    var _iteratorNormalCompletion2 = true;
	                    var _didIteratorError2 = false;
	                    var _iteratorError2 = undefined;
	
	                    try {
	                        for (var _iterator2 = this.chain_accounts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                            var _key = _step2.value;
	
	                            var _prop = props[_key] || this.dynamic_props[_key] || this.default_props[_key];
	                            if (_prop) {
	                                if (_prop[0] === "#" && Number.parseInt(_prop.substring(1), 10)) _prop = "1.2." + _prop.substring(1);
	                                var _new_obj = _graphenejsLib.ChainStore.getAccount(_prop);
	                                if (_new_obj === undefined && this.required_props.indexOf(_key) === -1 && _new_obj !== this.state[_key]) new_state[_key] = _new_obj;else if (_new_obj && _new_obj !== this.state[_key]) new_state[_key] = _new_obj;
	                                ++all_objects_counter;
	                                if (_new_obj !== undefined) ++resolved_objects_counter;
	                            } else {
	                                if (this.state[_key]) new_state[_key] = null;
	                            }
	                        }
	                    } catch (err) {
	                        _didIteratorError2 = true;
	                        _iteratorError2 = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                                _iterator2.return();
	                            }
	                        } finally {
	                            if (_didIteratorError2) {
	                                throw _iteratorError2;
	                            }
	                        }
	                    }
	
	                    var _iteratorNormalCompletion3 = true;
	                    var _didIteratorError3 = false;
	                    var _iteratorError3 = undefined;
	
	                    try {
	                        for (var _iterator3 = this.chain_key_refs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                            var _key2 = _step3.value;
	
	                            var _prop2 = props[_key2] || this.dynamic_prop[_key2] || this.default_props[_key2];
	                            if (_prop2) {
	                                var _new_obj2 = _graphenejsLib.ChainStore.getAccountRefsOfKey(_prop2);
	                                if (_new_obj2 === undefined && this.required_props.indexOf(_key2) === -1 && _new_obj2 !== this.state[_key2]) new_state[_key2] = _new_obj2;else if (_new_obj2 && _new_obj2 !== this.state[_key2]) new_state[_key2] = _new_obj2;
	                                ++all_objects_counter;
	                                if (_new_obj2 !== undefined) ++resolved_objects_counter;
	                            } else {
	                                if (this.state[_key2]) new_state[_key2] = null;
	                            }
	                        }
	                    } catch (err) {
	                        _didIteratorError3 = true;
	                        _iteratorError3 = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                                _iterator3.return();
	                            }
	                        } finally {
	                            if (_didIteratorError3) {
	                                throw _iteratorError3;
	                            }
	                        }
	                    }
	
	                    var _iteratorNormalCompletion4 = true;
	                    var _didIteratorError4 = false;
	                    var _iteratorError4 = undefined;
	
	                    try {
	                        for (var _iterator4 = this.chain_address_balances[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                            var _key3 = _step4.value;
	
	                            var _prop3 = props[_key3] || this.dynamic_props[_key3] || this.default_props[_key3];
	                            if (_prop3) {
	                                var _new_obj3 = _graphenejsLib.ChainStore.getBalanceObjects(_prop3);
	                                if (_new_obj3 === undefined && this.required_props.indexOf(_key3) === -1 && _new_obj3 !== this.state[_key3]) new_state[_key3] = _new_obj3;else if (_new_obj3 && _new_obj3 !== this.state[_key3]) new_state[_key3] = _new_obj3;
	                                ++all_objects_counter;
	                                if (_new_obj3 !== undefined) ++resolved_objects_counter;
	                            } else {
	                                if (this.state[_key3]) new_state[_key3] = null;
	                            }
	                        }
	                    } catch (err) {
	                        _didIteratorError4 = true;
	                        _iteratorError4 = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                                _iterator4.return();
	                            }
	                        } finally {
	                            if (_didIteratorError4) {
	                                throw _iteratorError4;
	                            }
	                        }
	                    }
	
	                    var _iteratorNormalCompletion5 = true;
	                    var _didIteratorError5 = false;
	                    var _iteratorError5 = undefined;
	
	                    try {
	                        for (var _iterator5 = this.chain_assets[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                            var _key4 = _step5.value;
	
	                            var _prop4 = props[_key4] || this.dynamic_props[_key4] || this.default_props[_key4];
	                            if (_prop4) {
	                                var _new_obj4 = _graphenejsLib.ChainStore.getAsset(_prop4);
	                                if (_new_obj4 === undefined && this.required_props.indexOf(_key4) === -1 && _new_obj4 !== this.state[_key4]) new_state[_key4] = _new_obj4;else if (_new_obj4 && _new_obj4 !== this.state[_key4]) new_state[_key4] = _new_obj4;
	                                ++all_objects_counter;
	                                if (_new_obj4 !== undefined) ++resolved_objects_counter;
	                            } else {
	                                if (this.state[_key4]) new_state[_key4] = null;
	                            }
	                        }
	                    } catch (err) {
	                        _didIteratorError5 = true;
	                        _iteratorError5 = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                                _iterator5.return();
	                            }
	                        } finally {
	                            if (_didIteratorError5) {
	                                throw _iteratorError5;
	                            }
	                        }
	                    }
	
	                    var _iteratorNormalCompletion6 = true;
	                    var _didIteratorError6 = false;
	                    var _iteratorError6 = undefined;
	
	                    try {
	                        for (var _iterator6 = this.chain_objects_list[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                            var _key5 = _step6.value;
	
	                            // console.log("-- Wrapper.update -->", this.chain_objects_list);
	                            var _prop5 = props[_key5] || this.dynamic_props[_key5] || this.default_props[_key5];
	                            if (_prop5) {
	                                (function () {
	                                    var prop_prev_state = _this2.state[_key5];
	                                    var prop_new_state = [];
	                                    var changes = false;
	                                    if (!prop_prev_state || prop_prev_state.length !== _prop5.size) {
	                                        prop_prev_state = [];
	                                        changes = true;
	                                    }
	                                    var index = 0;
	                                    _prop5.forEach(function (obj_id) {
	                                        // console.log("-- Wrapper.chain_objects_list item -->", obj_id, index);
	                                        if (obj_id) {
	                                            var _new_obj5 = _graphenejsLib.ChainStore.getObject(obj_id);
	                                            if (_new_obj5) ++resolved_objects_counter;
	                                            if (prop_prev_state[index] !== _new_obj5) {
	                                                changes = true;
	                                                prop_new_state[index] = _new_obj5;
	                                            } else {
	                                                prop_new_state[index] = prop_prev_state[index];
	                                            }
	                                        }
	                                        ++index;
	                                        ++all_objects_counter;
	                                    });
	                                    // console.log("-- Wrapper.chain_objects_list: ", prop_new_state);
	                                    if (changes) new_state[_key5] = prop_new_state;
	                                })();
	                            } else {
	                                if (this.state[_key5]) new_state[_key5] = null;
	                            }
	                        }
	                    } catch (err) {
	                        _didIteratorError6 = true;
	                        _iteratorError6 = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                                _iterator6.return();
	                            }
	                        } finally {
	                            if (_didIteratorError6) {
	                                throw _iteratorError6;
	                            }
	                        }
	                    }
	
	                    var _iteratorNormalCompletion7 = true;
	                    var _didIteratorError7 = false;
	                    var _iteratorError7 = undefined;
	
	                    try {
	                        for (var _iterator7 = this.chain_accounts_list[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                            var _key6 = _step7.value;
	
	                            //console.log("-- Wrapper.update -->", this.chain_accounts_list);
	                            var _prop6 = props[_key6] || this.dynamic_props[_key6] || this.default_props[_key6];
	                            if (_prop6) {
	                                (function () {
	                                    var prop_prev_state = _this2.state[_key6];
	                                    var prop_new_state = [];
	                                    var changes = false;
	                                    if (!prop_prev_state || prop_prev_state.length !== _prop6.size) {
	                                        prop_prev_state = [];
	                                        changes = true;
	                                    }
	                                    var index = 0;
	                                    _prop6.forEach(function (obj_id) {
	                                        //console.log("-- Wrapper.chain_accounts_list item -->", obj_id, index);
	                                        if (obj_id) {
	                                            var _new_obj6 = _graphenejsLib.ChainStore.getAccount(obj_id);
	                                            if (_new_obj6) ++resolved_objects_counter;
	                                            if (prop_prev_state[index] !== _new_obj6) {
	                                                changes = true;
	                                                prop_new_state[index] = _new_obj6;
	                                            } else {
	                                                prop_new_state[index] = prop_prev_state[index];
	                                            }
	                                        }
	                                        ++index;
	                                        ++all_objects_counter;
	                                    });
	                                    //console.log("-- Wrapper.chain_accounts_list: ", prop_new_state);
	                                    if (changes) new_state[_key6] = prop_new_state;
	                                })();
	                            } else {
	                                if (this.state[_key6]) new_state[_key6] = null;
	                            }
	                        }
	                    } catch (err) {
	                        _didIteratorError7 = true;
	                        _iteratorError7 = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion7 && _iterator7.return) {
	                                _iterator7.return();
	                            }
	                        } finally {
	                            if (_didIteratorError7) {
	                                throw _iteratorError7;
	                            }
	                        }
	                    }
	
	                    var _iteratorNormalCompletion8 = true;
	                    var _didIteratorError8 = false;
	                    var _iteratorError8 = undefined;
	
	                    try {
	                        for (var _iterator8 = this.chain_assets_list[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	                            var _key7 = _step8.value;
	
	                            //console.log("-- Wrapper.update -->", this.chain_assets_list);
	                            var _prop7 = props[_key7] || this.dynamic_props[_key7] || this.default_props[_key7];
	                            if (_prop7) {
	                                (function () {
	                                    var prop_prev_state = _this2.state[_key7];
	                                    var prop_new_state = [];
	                                    var changes = false;
	                                    if (!prop_prev_state || prop_prev_state.length !== _prop7.size) {
	                                        prop_prev_state = [];
	                                        changes = true;
	                                    }
	                                    var index = 0;
	                                    _prop7.forEach(function (obj_id) {
	                                        ++index;
	                                        //console.log("-- Wrapper.chain_assets_list item -->", obj_id, index);
	                                        if (obj_id) {
	                                            var _new_obj7 = _graphenejsLib.ChainStore.getAsset(obj_id);
	                                            if (_new_obj7) ++resolved_objects_counter;
	                                            if (prop_prev_state[index] !== _new_obj7) {
	                                                changes = true;
	                                                prop_new_state[index] = _new_obj7;
	                                            } else {
	                                                prop_new_state[index] = prop_prev_state[index];
	                                            }
	                                        }
	                                        ++all_objects_counter;
	                                    });
	                                    //console.log("-- Wrapper.chain_assets_list: ", prop_new_state);
	                                    if (changes) new_state[_key7] = prop_new_state;
	                                })();
	                            } else {
	                                if (this.state[_key7]) new_state[_key7] = null;
	                            }
	                        }
	
	                        //console.log("----- Wrapper update ----->", this.all_chain_props, this.all_chain_props.length, all_objects_counter, resolved_objects_counter);
	                    } catch (err) {
	                        _didIteratorError8 = true;
	                        _iteratorError8 = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion8 && _iterator8.return) {
	                                _iterator8.return();
	                            }
	                        } finally {
	                            if (_didIteratorError8) {
	                                throw _iteratorError8;
	                            }
	                        }
	                    }
	
	                    if (all_objects_counter <= resolved_objects_counter) new_state.resolved = true;
	                    this.setState(new_state);
	                }
	            }, {
	                key: "componentName",
	                value: function componentName() {
	                    var cf = Component.toString();
	                    return cf.substr(9, cf.indexOf('(') - 9);
	                }
	            }, {
	                key: "render",
	                value: function render() {
	                    var props = (0, _lodash.omit)(this.props, this.all_chain_props);
	
	                    //console.log("----- Wrapper render ----->", this.componentName(), this.props, this.state);
	                    var _iteratorNormalCompletion9 = true;
	                    var _didIteratorError9 = false;
	                    var _iteratorError9 = undefined;
	
	                    try {
	                        for (var _iterator9 = this.required_props[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	                            var prop = _step9.value;
	
	                            if (!this.state[prop]) {
	                                if (typeof options !== "undefined" && options.show_loader) {
	                                    return _react2.default.createElement(_spin2.default, { size: "large" });
	                                } else {
	                                    // returning a temp component of the desired type prevents invariant violation errors, notably when rendering tr components
	                                    // to use, specicy a defaultProps field of tempComponent: "tr" (or "div", "td", etc as desired)
	                                    return this.tempComponent ? _react2.default.createElement(this.tempComponent) : null;
	                                }
	                            }
	                        }
	                        //return <span className={this.state.resolved ? "resolved":"notresolved"}><Component {...props} {...this.state}/></span>;
	                    } catch (err) {
	                        _didIteratorError9 = true;
	                        _iteratorError9 = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion9 && _iterator9.return) {
	                                _iterator9.return();
	                            }
	                        } finally {
	                            if (_didIteratorError9) {
	                                throw _iteratorError9;
	                            }
	                        }
	                    }
	
	                    return _react2.default.createElement(Component, Object.assign({}, props, this.state));
	                }
	            }]);
	
	            return Wrapper;
	        }(_react2.default.Component);
	    };
	}
	
	var Wrapper = function (_React$Component2) {
	    _inherits(Wrapper, _React$Component2);
	
	    function Wrapper() {
	        _classCallCheck(this, Wrapper);
	
	        return _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).apply(this, arguments));
	    }
	
	    _createClass(Wrapper, [{
	        key: "render",
	        value: function render() {
	            return _react2.default.createElement(
	                "span",
	                { className: "wrapper" },
	                this.props.children(this.props)
	            );
	        }
	    }]);
	
	    return Wrapper;
	}(_react2.default.Component);
	
	BindToChainState.Wrapper = BindToChainState({ all_props: true, require_all_props: true })(Wrapper);
	
	exports.default = BindToChainState;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	
	
	// module
	exports.push([module.id, ".float-left {\n  float: left;\n}\n.float-right {\n  float: right;\n}\nhtml {\n  height: 100%;\n}\nhtml body {\n  height: 100%;\n  overflow: hidden;\n}\nhtml body div#main-content {\n  padding-left: 68px;\n}\n", ""]);
	
	// exports


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	
	
	// module
	exports.push([module.id, "#betex-header {\n  padding: 0;\n  font-size: 16px;\n  background-color: #004378;\n  overflow: hidden;\n}\n#betex-header div.logo {\n  border-right: solid 1px #061F33;\n  display: inline-block;\n  padding-left: 15px;\n  padding-right: 15px;\n  padding-top: 5px;\n}\n#betex-header div.logo img {\n  width: 40px;\n}\n#betex-header div.search {\n  display: inline-block;\n}\n#betex-header .search-menu {\n  background-color: #004378;\n}\n#betex-header .search-menu li {\n  padding: 0 16px 0 14px;\n}\n#betex-header .search-menu li input[type=\"text\"] {\n  background-color: #004378;\n  color: #00BEF4;\n  font-size: 16px;\n  border: none;\n  border-bottom: solid 1px #00BEF4;\n  border-bottom-left-radius: initial;\n  border-bottom-right-radius: initial;\n  margin-left: 7px;\n  -webkit-padding-start: 35px;\n  -webkit-text-fill-color: #00BEF4;\n}\n#betex-header .search-menu li input[type=\"text\"]:focus {\n  box-shadow: 0 0 0 0px;\n}\n#betex-header .search-menu li .anticon {\n  font-size: 20px;\n  padding-bottom: 2px;\n  color: #00BEF4;\n}\n#betex-header .top-menu {\n  background-color: #004378;\n  line-height: inherit;\n}\n#betex-header .top-menu li {\n  border-left: solid 1px #061F33;\n}\n#betex-header .top-menu li.amount {\n  background-color: #004B87;\n}\n#betex-header .top-menu li .anticon {\n  font-size: 20px;\n  color: #00BEF4;\n}\n#betex-header .top-menu li.notification span.ant-badge > .anticon {\n  padding-bottom: 6px;\n  font-size: 20px;\n  color: #00BEF4;\n}\n#betex-header .top-menu li.notification span.ant-badge > sup.ant-badge-count {\n  box-shadow: 0 0 0 0;\n  background-color: #00BEF4;\n}\n", ""]);
	
	// exports


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	
	
	// module
	exports.push([module.id, "#betex-sider {\n  position: absolute;\n  height: 100%;\n  background-color: #1563A0;\n  z-index: 10;\n}\n#betex-sider .side-menu {\n  background-color: #1563A0;\n}\n#betex-sider .side-menu .submenu-title {\n  margin-left: 20px;\n}\n#betex-sider .footer-menu {\n  position: absolute;\n  bottom: 70px;\n  left: 0;\n  width: 100%;\n  background-color: #1563A0;\n}\n#betex-sider .footer-menu .submenu-title {\n  margin-left: 20px;\n}\n#betex-sider .footer-menu li.connectivity * {\n  color: lawngreen;\n}\n#betex-sider .footer-menu li.clock {\n  padding-left: 20px;\n}\n.ant-layout-sider-collapsed .anticon {\n  font-size: 16px;\n}\n.ant-layout-sider-collapsed .nav-text {\n  display: none;\n}\n", ""]);
	
	// exports


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	
	
	// module
	exports.push([module.id, "div.betslip-wrapper > div.betslip-panel > div.ant-collapse-header {\n  background-color: #1563A0;\n  color: white;\n}\ndiv.betslip-wrapper > div.betslip-panel > div.ant-collapse-header > .arrow:before {\n  color: white;\n}\ndiv.betslip-wrapper > div.betslip-panel > div.ant-collapse-content {\n  padding: 0;\n  background-color: black;\n}\ndiv.betslip > button.place_bet {\n  background-color: #37C1FF;\n  color: white;\n  width: 100%;\n}\ndiv.betslip table td.delete-button {\n  padding: 0;\n  margin: 0;\n}\ndiv.betslip table td.delete-button button {\n  width: 100%;\n  padding: 20px 0px;\n}\ndiv.betslip .ant-table-tbody > tr > td.numeric {\n  font-size: 15px;\n}\ndiv.betslip > .back table td.delete-button > button {\n  background-color: #37C1FF;\n  color: white;\n}\ndiv.betslip > .back .ant-table-thead > tr > th {\n  background-color: #004378;\n  color: white;\n}\ndiv.betslip > .back .ant-table-tbody > tr > td {\n  border-color: #166ABC;\n  background-color: #004E9B;\n  color: white;\n  line-height: 15px;\n}\ndiv.betslip > .back .ant-table-tbody > tr > td span.bet_type {\n  color: #37C1FF;\n  font-size: 10px;\n}\ndiv.betslip > .lay table td.delete-button > button {\n  background-color: #1ACBB4;\n  color: white;\n}\ndiv.betslip > .lay .ant-table-thead > tr > th {\n  background-color: #05696B;\n  color: white;\n}\ndiv.betslip > .lay .ant-table-tbody > tr > td {\n  border-color: #359C9F;\n  background-color: #008487;\n  color: white;\n  line-height: 15px;\n}\ndiv.betslip > .lay .ant-table-tbody > tr > td span.bet_type {\n  color: #1ACBB4;\n  font-size: 10px;\n}\n", ""]);
	
	// exports


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	
	
	// module
	exports.push([module.id, "#home-wrapper > div.left-content {\n  position: absolute;\n  left: 73px;\n  right: 400px;\n  overflow: scroll;\n  height: 100%;\n  background: -webkit-linear-gradient(#094B88, #00152A);\n  background: linear-gradient(#094B88, #00152A);\n  color: white;\n  padding: 20px 20px 64px 20px;\n}\n#home-wrapper > div.right-content {\n  position: absolute;\n  width: 400px;\n  right: 0;\n  overflow: scroll;\n  height: 100%;\n  background: -webkit-linear-gradient(#094B88, #00152A);\n  background: linear-gradient(#094B88, #00152A);\n  color: white;\n  padding-bottom: 64px;\n}\n#home-wrapper div.banner {\n  position: relative;\n}\n@media only screen and (max-width: 1366px) {\n  #home-wrapper div.banner {\n    background: url(" + __webpack_require__(82) + ") no-repeat;\n    height: 150px;\n  }\n}\n@media only screen and (min-width: 1366px) {\n  #home-wrapper div.banner {\n    background: url(" + __webpack_require__(81) + ") no-repeat;\n    height: 228px;\n  }\n}\n#home-wrapper div.banner > div.statistics {\n  position: absolute;\n  right: 50px;\n  bottom: 20px;\n}\n#home-wrapper div.banner > div.statistics > div.digits {\n  margin-left: 150px;\n}\n#home-wrapper div.banner > div.statistics > div.digits > span.digit {\n  background-color: black;\n  color: white;\n  font-size: 24px;\n  padding: 4px;\n  margin: 3px;\n}\n#home-wrapper div.banner > div.statistics > div.text {\n  margin-left: 10px;\n}\n#home-wrapper div.banner > div.statistics > div.text > span.text {\n  display: block;\n  color: white;\n  font-size: 16px;\n}\n", ""]);
	
	// exports


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	
	
	// module
	exports.push([module.id, ".market-table-wrapper {\n  background-color: rgba(6, 92, 183, 0.35);\n  margin-top: 10px;\n  padding-bottom: 20px;\n}\n.market-table-wrapper div.ant-row {\n  border-bottom: 1px solid #FFFFFF;\n}\n.market-table-wrapper div.ant-row > div[class^='ant-col-'] {\n  padding-top: 10px;\n  padding-bottom: 10px;\n}\n.market-table-wrapper div.ant-row.market-type-header {\n  border-bottom: 1px solid #00BEF4;\n}\n.market-table-wrapper div.ant-row.market-type-header > div.market-type {\n  font-size: 18px;\n  padding-left: 20px;\n  text-transform: uppercase;\n}\n.market-table-wrapper div.ant-row.market-type-header > div > span {\n  font-size: 14px;\n}\n.market-table-wrapper div.ant-row.all-header > div.all > span {\n  font-size: 14px;\n}\n.market-table-wrapper div.ant-row.all-header > div.all.back {\n  padding: 0;\n  padding-top: 15px;\n}\n.market-table-wrapper div.ant-row.all-header > div.all.back > span {\n  border: 1px solid;\n  border-bottom: none;\n  padding: 2px 5px;\n  float: right;\n}\n.market-table-wrapper div.ant-row.all-header > div.all.lay {\n  padding: 0;\n  padding-top: 15px;\n}\n.market-table-wrapper div.ant-row.all-header > div.all.lay > span {\n  background-color: #008487;\n  border: 1px solid;\n  border-left: none;\n  border-bottom: none;\n  padding: 2px 6px;\n  float: left;\n}\n.market-table-wrapper div.ant-row.event > div.team {\n  padding-left: 20px;\n  font-size: 16px;\n  text-tranform: uppercase;\n}\n.market-table-wrapper div.ant-row.event > div.back,\n.market-table-wrapper div.ant-row.event div.lay {\n  padding-top: 3px;\n  padding-bottom: 3px;\n}\n.market-table-wrapper div.ant-row.event > div.back.back,\n.market-table-wrapper div.ant-row.event div.lay.back {\n  background-color: #005CB8;\n}\n.market-table-wrapper div.ant-row.event > div.back.back.best,\n.market-table-wrapper div.ant-row.event div.lay.back.best {\n  background-color: #004E9B;\n}\n.market-table-wrapper div.ant-row.event > div.back.lay,\n.market-table-wrapper div.ant-row.event div.lay.lay {\n  background-color: #129CA0;\n}\n.market-table-wrapper div.ant-row.event > div.back.lay.best,\n.market-table-wrapper div.ant-row.event div.lay.lay.best {\n  background-color: #008487;\n}\n.market-table-wrapper div.ant-row.event > div.back div.odds,\n.market-table-wrapper div.ant-row.event div.lay div.odds {\n  padding: 0;\n  font-size: 16px;\n  text-align: center;\n}\n.market-table-wrapper div.ant-row.event > div.back div.price,\n.market-table-wrapper div.ant-row.event div.lay div.price {\n  font-size: 12px;\n  text-align: center;\n}\n.market-table-wrapper div.ant-row.event > div.offer {\n  font-size: 16px;\n  text-align: center;\n  text-transform: uppercase;\n}\n.market-table-wrapper div.ant-row.event > div.control > div {\n  white-space: nowrap;\n}\n.market-table-wrapper div.ant-row.event > div.control a {\n  color: #FFFFFF;\n  font-size: large;\n}\n.market-table-wrapper div.ant-row.event > div[class^='ant-col-'] {\n  border-right: 1px solid #FFFFFF;\n  height: 48px;\n}\n.market-table-wrapper div.ant-row.event > div[class^='ant-col-']:first-child {\n  border: none;\n  padding-right: 5px;\n}\n.market-table-wrapper div.ant-row.event > div[class^='ant-col-']:last-child {\n  border: none;\n  padding-left: 10px;\n}\n", ""]);
	
	// exports


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	
	
	// module
	exports.push([module.id, "", ""]);
	
	// exports


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(67);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/less-loader/index.js!./App.less", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/less-loader/index.js!./App.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(68);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/index.js!../../../../node_modules/less-loader/index.js!./NavBar.less", function() {
				var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/index.js!../../../../node_modules/less-loader/index.js!./NavBar.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(69);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/index.js!../../../../node_modules/less-loader/index.js!./SideBar.less", function() {
				var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/index.js!../../../../node_modules/less-loader/index.js!./SideBar.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(70);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/less-loader/index.js!./BetSlip.less", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/less-loader/index.js!./BetSlip.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(71);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/less-loader/index.js!./Home.less", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/less-loader/index.js!./Home.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(72);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/less-loader/index.js!./MarketTable.less", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/less-loader/index.js!./MarketTable.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(73);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/less-loader/index.js!./MyWager.less", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/less-loader/index.js!./MyWager.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/media/home_banner_dark_big.c238ee23.png";

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/media/home_banner_dark_small.26307f63.png";

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "static/media/logo.f5a3f88d.png";

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/badge");

/***/ },
/* 85 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/badge/style");

/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/card");

/***/ },
/* 87 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/card/style");

/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/collapse");

/***/ },
/* 89 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/collapse/style");

/***/ },
/* 90 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/input");

/***/ },
/* 91 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/input/style");

/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/spin");

/***/ },
/* 93 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/spin/style");

/***/ },
/* 94 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/tabs");

/***/ },
/* 95 */
/***/ function(module, exports) {

	module.exports = require("antd/lib/tabs/style");

/***/ },
/* 96 */
/***/ function(module, exports) {

	module.exports = require("numeral");

/***/ },
/* 97 */
/***/ function(module, exports) {

	module.exports = require("object-assign");

/***/ },
/* 98 */
/***/ function(module, exports) {

	module.exports = require("perfect-scrollbar");

/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports = require("promise/lib/es6-extensions.js");

/***/ },
/* 100 */
/***/ function(module, exports) {

	module.exports = require("promise/lib/rejection-tracking");

/***/ },
/* 101 */
/***/ function(module, exports) {

	module.exports = require("qrcode.react");

/***/ },
/* 102 */
/***/ function(module, exports) {

	module.exports = require("react-dom");

/***/ },
/* 103 */
/***/ function(module, exports) {

	module.exports = require("redux-thunk");

/***/ },
/* 104 */
/***/ function(module, exports) {

	module.exports = require("whatwg-fetch");

/***/ }
/******/ ]);
//# sourceMappingURL=main.a5ff444f.js.map