(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("cordova-auth0-plugin", [], factory);
	else if(typeof exports === 'object')
		exports["cordova-auth0-plugin"] = factory();
	else
		root["CordovaAuth0Plugin"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(37);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (name, context, definition) {
	  if (typeof module !== 'undefined' && module.exports) module.exports = definition();
	  else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  else context[name] = definition();
	})('urljoin', this, function () {
	
	  function normalize (str, options) {
	
	    // make sure protocol is followed by two slashes
	    str = str.replace(/:\//g, '://');
	
	    // remove consecutive slashes
	    str = str.replace(/([^:\s])\/+/g, '$1/');
	
	    // remove trailing slash before parameters or hash
	    str = str.replace(/\/(\?|&|#[^!])/g, '$1');
	
	    // replace ? in parameters with &
	    str = str.replace(/(\?.+)\?/g, '$1&');
	
	    return str;
	  }
	
	  return function () {
	    var input = arguments;
	    var options = {};
	
	    if (typeof arguments[0] === 'object') {
	      // new syntax with array and options
	      input = arguments[0];
	      options = arguments[1] || {};
	    }
	
	    var joined = [].slice.call(input, 0).join('/');
	    return normalize(joined, options);
	  };
	
	});


/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {function redirect(url) {
	  global.window.location = url;
	}
	
	function getDocument() {
	  return global.window.document;
	}
	
	function getWindow() {
	  return global.window;
	}
	
	module.exports = {
	  redirect: redirect,
	  getDocument: getDocument,
	  getWindow: getWindow
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var stringify = __webpack_require__(13);
	var parse = __webpack_require__(12);
	var formats = __webpack_require__(7);
	
	module.exports = {
	    formats: formats,
	    parse: parse,
	    stringify: stringify
	};


/***/ },
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	var replace = String.prototype.replace;
	var percentTwenties = /%20/g;
	
	module.exports = {
	    'default': 'RFC3986',
	    formatters: {
	        RFC1738: function (value) {
	            return replace.call(value, percentTwenties, '+');
	        },
	        RFC3986: function (value) {
	            return value;
	        }
	    },
	    RFC1738: 'RFC1738',
	    RFC3986: 'RFC3986'
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	var has = Object.prototype.hasOwnProperty;
	
	var hexTable = (function () {
	    var array = [];
	    for (var i = 0; i < 256; ++i) {
	        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
	    }
	
	    return array;
	}());
	
	exports.arrayToObject = function (source, options) {
	    var obj = options && options.plainObjects ? Object.create(null) : {};
	    for (var i = 0; i < source.length; ++i) {
	        if (typeof source[i] !== 'undefined') {
	            obj[i] = source[i];
	        }
	    }
	
	    return obj;
	};
	
	exports.merge = function (target, source, options) {
	    if (!source) {
	        return target;
	    }
	
	    if (typeof source !== 'object') {
	        if (Array.isArray(target)) {
	            target.push(source);
	        } else if (typeof target === 'object') {
	            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
	                target[source] = true;
	            }
	        } else {
	            return [target, source];
	        }
	
	        return target;
	    }
	
	    if (typeof target !== 'object') {
	        return [target].concat(source);
	    }
	
	    var mergeTarget = target;
	    if (Array.isArray(target) && !Array.isArray(source)) {
	        mergeTarget = exports.arrayToObject(target, options);
	    }
	
	    if (Array.isArray(target) && Array.isArray(source)) {
	        source.forEach(function (item, i) {
	            if (has.call(target, i)) {
	                if (target[i] && typeof target[i] === 'object') {
	                    target[i] = exports.merge(target[i], item, options);
	                } else {
	                    target.push(item);
	                }
	            } else {
	                target[i] = item;
	            }
	        });
	        return target;
	    }
	
	    return Object.keys(source).reduce(function (acc, key) {
	        var value = source[key];
	
	        if (Object.prototype.hasOwnProperty.call(acc, key)) {
	            acc[key] = exports.merge(acc[key], value, options);
	        } else {
	            acc[key] = value;
	        }
	        return acc;
	    }, mergeTarget);
	};
	
	exports.decode = function (str) {
	    try {
	        return decodeURIComponent(str.replace(/\+/g, ' '));
	    } catch (e) {
	        return str;
	    }
	};
	
	exports.encode = function (str) {
	    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
	    // It has been adapted here for stricter adherence to RFC 3986
	    if (str.length === 0) {
	        return str;
	    }
	
	    var string = typeof str === 'string' ? str : String(str);
	
	    var out = '';
	    for (var i = 0; i < string.length; ++i) {
	        var c = string.charCodeAt(i);
	
	        if (
	            c === 0x2D || // -
	            c === 0x2E || // .
	            c === 0x5F || // _
	            c === 0x7E || // ~
	            (c >= 0x30 && c <= 0x39) || // 0-9
	            (c >= 0x41 && c <= 0x5A) || // a-z
	            (c >= 0x61 && c <= 0x7A) // A-Z
	        ) {
	            out += string.charAt(i);
	            continue;
	        }
	
	        if (c < 0x80) {
	            out = out + hexTable[c];
	            continue;
	        }
	
	        if (c < 0x800) {
	            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }
	
	        if (c < 0xD800 || c >= 0xE000) {
	            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }
	
	        i += 1;
	        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
	        out += hexTable[0xF0 | (c >> 18)] + hexTable[0x80 | ((c >> 12) & 0x3F)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]; // eslint-disable-line max-len
	    }
	
	    return out;
	};
	
	exports.compact = function (obj, references) {
	    if (typeof obj !== 'object' || obj === null) {
	        return obj;
	    }
	
	    var refs = references || [];
	    var lookup = refs.indexOf(obj);
	    if (lookup !== -1) {
	        return refs[lookup];
	    }
	
	    refs.push(obj);
	
	    if (Array.isArray(obj)) {
	        var compacted = [];
	
	        for (var i = 0; i < obj.length; ++i) {
	            if (obj[i] && typeof obj[i] === 'object') {
	                compacted.push(exports.compact(obj[i], refs));
	            } else if (typeof obj[i] !== 'undefined') {
	                compacted.push(obj[i]);
	            }
	        }
	
	        return compacted;
	    }
	
	    var keys = Object.keys(obj);
	    keys.forEach(function (key) {
	        obj[key] = exports.compact(obj[key], refs);
	    });
	
	    return obj;
	};
	
	exports.isRegExp = function (obj) {
	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};
	
	exports.isBuffer = function (obj) {
	    if (obj === null || typeof obj === 'undefined') {
	        return false;
	    }
	
	    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = { raw: '8.8.0' };


/***/ },
/* 10 */,
/* 11 */,
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(8);
	
	var has = Object.prototype.hasOwnProperty;
	
	var defaults = {
	    allowDots: false,
	    allowPrototypes: false,
	    arrayLimit: 20,
	    decoder: utils.decode,
	    delimiter: '&',
	    depth: 5,
	    parameterLimit: 1000,
	    plainObjects: false,
	    strictNullHandling: false
	};
	
	var parseValues = function parseQueryStringValues(str, options) {
	    var obj = {};
	    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);
	
	    for (var i = 0; i < parts.length; ++i) {
	        var part = parts[i];
	        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;
	
	        var key, val;
	        if (pos === -1) {
	            key = options.decoder(part);
	            val = options.strictNullHandling ? null : '';
	        } else {
	            key = options.decoder(part.slice(0, pos));
	            val = options.decoder(part.slice(pos + 1));
	        }
	        if (has.call(obj, key)) {
	            obj[key] = [].concat(obj[key]).concat(val);
	        } else {
	            obj[key] = val;
	        }
	    }
	
	    return obj;
	};
	
	var parseObject = function parseObjectRecursive(chain, val, options) {
	    if (!chain.length) {
	        return val;
	    }
	
	    var root = chain.shift();
	
	    var obj;
	    if (root === '[]') {
	        obj = [];
	        obj = obj.concat(parseObject(chain, val, options));
	    } else {
	        obj = options.plainObjects ? Object.create(null) : {};
	        var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
	        var index = parseInt(cleanRoot, 10);
	        if (
	            !isNaN(index) &&
	            root !== cleanRoot &&
	            String(index) === cleanRoot &&
	            index >= 0 &&
	            (options.parseArrays && index <= options.arrayLimit)
	        ) {
	            obj = [];
	            obj[index] = parseObject(chain, val, options);
	        } else {
	            obj[cleanRoot] = parseObject(chain, val, options);
	        }
	    }
	
	    return obj;
	};
	
	var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
	    if (!givenKey) {
	        return;
	    }
	
	    // Transform dot notation to bracket notation
	    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;
	
	    // The regex chunks
	
	    var brackets = /(\[[^[\]]*])/;
	    var child = /(\[[^[\]]*])/g;
	
	    // Get the parent
	
	    var segment = brackets.exec(key);
	    var parent = segment ? key.slice(0, segment.index) : key;
	
	    // Stash the parent if it exists
	
	    var keys = [];
	    if (parent) {
	        // If we aren't using plain objects, optionally prefix keys
	        // that would overwrite object prototype properties
	        if (!options.plainObjects && has.call(Object.prototype, parent)) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }
	
	        keys.push(parent);
	    }
	
	    // Loop through children appending to the array until we hit depth
	
	    var i = 0;
	    while ((segment = child.exec(key)) !== null && i < options.depth) {
	        i += 1;
	        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }
	        keys.push(segment[1]);
	    }
	
	    // If there's a remainder, just add whatever is left
	
	    if (segment) {
	        keys.push('[' + key.slice(segment.index) + ']');
	    }
	
	    return parseObject(keys, val, options);
	};
	
	module.exports = function (str, opts) {
	    var options = opts || {};
	
	    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
	        throw new TypeError('Decoder has to be a function.');
	    }
	
	    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
	    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
	    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
	    options.parseArrays = options.parseArrays !== false;
	    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
	    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
	    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
	    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
	    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
	    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
	
	    if (str === '' || str === null || typeof str === 'undefined') {
	        return options.plainObjects ? Object.create(null) : {};
	    }
	
	    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
	    var obj = options.plainObjects ? Object.create(null) : {};
	
	    // Iterate over the keys and setup the new object
	
	    var keys = Object.keys(tempObj);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var newObj = parseKeys(key, tempObj[key], options);
	        obj = utils.merge(obj, newObj, options);
	    }
	
	    return utils.compact(obj);
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(8);
	var formats = __webpack_require__(7);
	
	var arrayPrefixGenerators = {
	    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
	        return prefix + '[]';
	    },
	    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
	        return prefix + '[' + key + ']';
	    },
	    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
	        return prefix;
	    }
	};
	
	var toISO = Date.prototype.toISOString;
	
	var defaults = {
	    delimiter: '&',
	    encode: true,
	    encoder: utils.encode,
	    encodeValuesOnly: false,
	    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
	        return toISO.call(date);
	    },
	    skipNulls: false,
	    strictNullHandling: false
	};
	
	var stringify = function stringify( // eslint-disable-line func-name-matching
	    object,
	    prefix,
	    generateArrayPrefix,
	    strictNullHandling,
	    skipNulls,
	    encoder,
	    filter,
	    sort,
	    allowDots,
	    serializeDate,
	    formatter,
	    encodeValuesOnly
	) {
	    var obj = object;
	    if (typeof filter === 'function') {
	        obj = filter(prefix, obj);
	    } else if (obj instanceof Date) {
	        obj = serializeDate(obj);
	    } else if (obj === null) {
	        if (strictNullHandling) {
	            return encoder && !encodeValuesOnly ? encoder(prefix) : prefix;
	        }
	
	        obj = '';
	    }
	
	    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
	        if (encoder) {
	            var keyValue = encodeValuesOnly ? prefix : encoder(prefix);
	            return [formatter(keyValue) + '=' + formatter(encoder(obj))];
	        }
	        return [formatter(prefix) + '=' + formatter(String(obj))];
	    }
	
	    var values = [];
	
	    if (typeof obj === 'undefined') {
	        return values;
	    }
	
	    var objKeys;
	    if (Array.isArray(filter)) {
	        objKeys = filter;
	    } else {
	        var keys = Object.keys(obj);
	        objKeys = sort ? keys.sort(sort) : keys;
	    }
	
	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];
	
	        if (skipNulls && obj[key] === null) {
	            continue;
	        }
	
	        if (Array.isArray(obj)) {
	            values = values.concat(stringify(
	                obj[key],
	                generateArrayPrefix(prefix, key),
	                generateArrayPrefix,
	                strictNullHandling,
	                skipNulls,
	                encoder,
	                filter,
	                sort,
	                allowDots,
	                serializeDate,
	                formatter,
	                encodeValuesOnly
	            ));
	        } else {
	            values = values.concat(stringify(
	                obj[key],
	                prefix + (allowDots ? '.' + key : '[' + key + ']'),
	                generateArrayPrefix,
	                strictNullHandling,
	                skipNulls,
	                encoder,
	                filter,
	                sort,
	                allowDots,
	                serializeDate,
	                formatter,
	                encodeValuesOnly
	            ));
	        }
	    }
	
	    return values;
	};
	
	module.exports = function (object, opts) {
	    var obj = object;
	    var options = opts || {};
	
	    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
	        throw new TypeError('Encoder has to be a function.');
	    }
	
	    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
	    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
	    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
	    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
	    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
	    var sort = typeof options.sort === 'function' ? options.sort : null;
	    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
	    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
	    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
	    if (typeof options.format === 'undefined') {
	        options.format = formats.default;
	    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
	        throw new TypeError('Unknown format option provided.');
	    }
	    var formatter = formats.formatters[options.format];
	    var objKeys;
	    var filter;
	
	    if (typeof options.filter === 'function') {
	        filter = options.filter;
	        obj = filter('', obj);
	    } else if (Array.isArray(options.filter)) {
	        filter = options.filter;
	        objKeys = filter;
	    }
	
	    var keys = [];
	
	    if (typeof obj !== 'object' || obj === null) {
	        return '';
	    }
	
	    var arrayFormat;
	    if (options.arrayFormat in arrayPrefixGenerators) {
	        arrayFormat = options.arrayFormat;
	    } else if ('indices' in options) {
	        arrayFormat = options.indices ? 'indices' : 'repeat';
	    } else {
	        arrayFormat = 'indices';
	    }
	
	    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
	
	    if (!objKeys) {
	        objKeys = Object.keys(obj);
	    }
	
	    if (sort) {
	        objKeys.sort(sort);
	    }
	
	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];
	
	        if (skipNulls && obj[key] === null) {
	            continue;
	        }
	
	        keys = keys.concat(stringify(
	            obj[key],
	            key,
	            generateArrayPrefix,
	            strictNullHandling,
	            skipNulls,
	            encode ? encoder : null,
	            filter,
	            sort,
	            allowDots,
	            serializeDate,
	            formatter,
	            encodeValuesOnly
	        ));
	    }
	
	    return keys.join(delimiter);
	};


/***/ },
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(9);
	var windowHandler = __webpack_require__(3);
	var PluginHandler = __webpack_require__(38);
	
	function CordovaPlugin() {
	  this.webAuth = null;
	  this.version = version.raw;
	  this.extensibilityPoints = [
	    'popup.authorize',
	    'popup.getPopupHandler'
	  ];
	}
	
	CordovaPlugin.prototype.setWebAuth = function (webAuth) {
	  this.webAuth = webAuth;
	};
	
	CordovaPlugin.prototype.supports = function (extensibilityPoint) {
	  var _window = windowHandler.getWindow();
	  return (!!_window.cordova || !!_window.electron) &&
	          this.extensibilityPoints.indexOf(extensibilityPoint) > -1;
	};
	
	CordovaPlugin.prototype.init = function () {
	  return new PluginHandler(this.webAuth);
	};
	
	module.exports = CordovaPlugin;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var urljoin = __webpack_require__(1);
	var PopupHandler = __webpack_require__(39);
	
	function PluginHandler(webAuth) {
	  this.webAuth = webAuth;
	}
	
	PluginHandler.prototype.processParams = function (params) {
	  params.redirectUri = urljoin('https://' + params.domain, 'mobile');
	  delete params.owp;
	  return params;
	};
	
	PluginHandler.prototype.getPopupHandler = function () {
	  return new PopupHandler(this.webAuth);
	};
	
	module.exports = PluginHandler;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var windowHandler = __webpack_require__(3);
	var qs = __webpack_require__(5);
	var urljoin = __webpack_require__(1);
	
	function PopupHandler(webAuth) {
	  this.webAuth = webAuth;
	  this._current_popup = null;
	  this.options = null;
	}
	
	PopupHandler.prototype.preload = function (options) {
	  var _this = this;
	  var _window = windowHandler.getWindow();
	
	  var url = options.url || 'about:blank';
	  var popupOptions = options.popupOptions || {};
	
	  popupOptions.location = 'yes';
	  delete popupOptions.width;
	  delete popupOptions.height;
	
	  var windowFeatures = qs.stringify(popupOptions, {
	    encode: false,
	    delimiter: ','
	  });
	
	  if (this._current_popup && !this._current_popup.closed) {
	    return this._current_popup;
	  }
	
	  this._current_popup = _window.open(url, '_blank', windowFeatures);
	
	  this._current_popup.kill = function (success) {
	    _this._current_popup.success = success;
	    this.close();
	    _this._current_popup = null;
	  };
	
	  return this._current_popup;
	};
	
	PopupHandler.prototype.load = function (url, _, options, cb) {
	  var _this = this;
	  this.url = url;
	  this.options = options;
	  if (!this._current_popup) {
	    options.url = url;
	    this.preload(options);
	  } else {
	    this._current_popup.location.href = url;
	  }
	
	  this.transientErrorHandler = function (event) {
	    _this.errorHandler(event, cb);
	  };
	
	  this.transientStartHandler = function (event) {
	    _this.startHandler(event, cb);
	  };
	
	  this.transientExitHandler = function () {
	    _this.exitHandler(cb);
	  };
	
	  this._current_popup.addEventListener('loaderror', this.transientErrorHandler);
	  this._current_popup.addEventListener('loadstart', this.transientStartHandler);
	  this._current_popup.addEventListener('exit', this.transientExitHandler);
	};
	
	PopupHandler.prototype.errorHandler = function (event, cb) {
	  if (!this._current_popup) {
	    return;
	  }
	
	  this._current_popup.kill(true);
	
	  cb({ error: 'window_error', errorDescription: event.message });
	};
	
	PopupHandler.prototype.unhook = function () {
	  this._current_popup.removeEventListener('loaderror', this.transientErrorHandler);
	  this._current_popup.removeEventListener('loadstart', this.transientStartHandler);
	  this._current_popup.removeEventListener('exit', this.transientExitHandler);
	};
	
	PopupHandler.prototype.exitHandler = function (cb) {
	  if (!this._current_popup) {
	    return;
	  }
	
	  // when the modal is closed, this event is called which ends up removing the
	  // event listeners. If you move this before closing the modal, it will add ~1 sec
	  // delay between the user being redirected to the callback and the popup gets closed.
	  this.unhook();
	
	  if (!this._current_popup.success) {
	    cb({ error: 'window_closed', errorDescription: 'Browser window closed' });
	  }
	};
	
	PopupHandler.prototype.startHandler = function (event, cb) {
	  var _this = this;
	
	  if (!this._current_popup) {
	    return;
	  }
	
	  var callbackUrl = urljoin('https:', this.webAuth.baseOptions.domain, '/mobile');
	
	  if (event.url && !(event.url.indexOf(callbackUrl + '#') === 0)) { return; }
	
	  var parts = event.url.split('#');
	
	  if (parts.length === 1) {
	    return;
	  }
	
	  var opts = { hash: parts.pop(), _idTokenVerification: false };
	
	  if (this.options.nonce) {
	    opts.nonce = this.options.nonce;
	  }
	
	  this.webAuth.parseHash(
	    opts,
	    function (error, result) {
	      if (error || result) {
	        _this._current_popup.kill(true);
	        cb(error, result);
	      }
	    }
	  );
	};
	
	module.exports = PopupHandler;


/***/ }
/******/ ])
});
;