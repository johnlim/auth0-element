/**
 * auth0-js v9.8.2
 * Author: Auth0
 * Date: 2018-11-13
 * License: MIT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.CordovaAuth0Plugin = factory());
}(this, (function () { 'use strict';

  var version = { raw: '9.8.2' };

  var toString = Object.prototype.toString;

  function attribute(o, attr, type, text) {
    type = type === 'array' ? 'object' : type;
    if (o && typeof o[attr] !== type) {
      throw new Error(text);
    }
  }

  function variable(o, type, text) {
    if (typeof o !== type) {
      throw new Error(text);
    }
  }

  function value(o, values, text) {
    if (values.indexOf(o) === -1) {
      throw new Error(text);
    }
  }

  function check(o, config, attributes) {
    if (!config.optional || o) {
      variable(o, config.type, config.message);
    }
    if (config.type === 'object' && attributes) {
      var keys = Object.keys(attributes);

      for (var index = 0; index < keys.length; index++) {
        var a = keys[index];
        if (!attributes[a].optional || o[a]) {
          if (!attributes[a].condition || attributes[a].condition(o)) {
            attribute(o, a, attributes[a].type, attributes[a].message);
            if (attributes[a].values) {
              value(o[a], attributes[a].values, attributes[a].value_message);
            }
          }
        }
      }
    }
  }

  /**
   * Wrap `Array.isArray` Polyfill for IE9
   * source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
   *
   * @param {Array} array
   * @private
   */
  function isArray(array) {
    if (this.supportsIsArray()) {
      return Array.isArray(array);
    }

    return toString.call(array) === '[object Array]';
  }

  function supportsIsArray() {
    return Array.isArray != null;
  }

  var assert = {
    check: check,
    attribute: attribute,
    variable: variable,
    value: value,
    isArray: isArray,
    supportsIsArray: supportsIsArray
  };

  /* eslint-disable no-continue */

  function get() {
    if (!Object.assign) {
      return objectAssignPolyfill;
    }

    return Object.assign;
  }

  function objectAssignPolyfill(target) {
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert first argument to object');
    }

    var to = Object(target);
    for (var i = 1; i < arguments.length; i++) {
      var nextSource = arguments[i];
      if (nextSource === undefined || nextSource === null) {
        continue;
      }

      var keysArray = Object.keys(Object(nextSource));
      for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
        var nextKey = keysArray[nextIndex];
        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== undefined && desc.enumerable) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
    return to;
  }

  var objectAssign = {
    get: get,
    objectAssignPolyfill: objectAssignPolyfill
  };

  /* eslint-disable no-param-reassign */

  function pick(object, keys) {
    return keys.reduce(function(prev, key) {
      if (object[key]) {
        prev[key] = object[key];
      }
      return prev;
    }, {});
  }

  function getKeysNotIn(obj, allowedKeys) {
    var notAllowed = [];
    for (var key in obj) {
      if (allowedKeys.indexOf(key) === -1) {
        notAllowed.push(key);
      }
    }
    return notAllowed;
  }

  function objectValues(obj) {
    var values = [];
    for (var key in obj) {
      values.push(obj[key]);
    }
    return values;
  }

  function extend() {
    var params = objectValues(arguments);
    params.unshift({});
    return objectAssign.get().apply(undefined, params);
  }

  function merge(object, keys) {
    return {
      base: keys ? pick(object, keys) : object,
      with: function(object2, keys2) {
        object2 = keys2 ? pick(object2, keys2) : object2;
        return extend(this.base, object2);
      }
    };
  }

  function blacklist(object, blacklistedKeys) {
    return Object.keys(object).reduce(function(p, key) {
      if (blacklistedKeys.indexOf(key) === -1) {
        p[key] = object[key];
      }
      return p;
    }, {});
  }

  function camelToSnake(str) {
    var newKey = '';
    var index = 0;
    var code;
    var wasPrevNumber = true;
    var wasPrevUppercase = true;

    while (index < str.length) {
      code = str.charCodeAt(index);
      if (
        (!wasPrevUppercase && code >= 65 && code <= 90) ||
        (!wasPrevNumber && code >= 48 && code <= 57)
      ) {
        newKey += '_';
        newKey += str[index].toLowerCase();
      } else {
        newKey += str[index].toLowerCase();
      }
      wasPrevNumber = code >= 48 && code <= 57;
      wasPrevUppercase = code >= 65 && code <= 90;
      index++;
    }

    return newKey;
  }

  function snakeToCamel(str) {
    var parts = str.split('_');
    return parts.reduce(function(p, c) {
      return p + c.charAt(0).toUpperCase() + c.slice(1);
    }, parts.shift());
  }

  function toSnakeCase(object, exceptions) {
    if (typeof object !== 'object' || assert.isArray(object) || object === null) {
      return object;
    }
    exceptions = exceptions || [];

    return Object.keys(object).reduce(function(p, key) {
      var newKey = exceptions.indexOf(key) === -1 ? camelToSnake(key) : key;
      p[newKey] = toSnakeCase(object[key]);
      return p;
    }, {});
  }

  function toCamelCase(object, exceptions) {
    if (typeof object !== 'object' || assert.isArray(object) || object === null) {
      return object;
    }

    exceptions = exceptions || [];

    return Object.keys(object).reduce(function(p, key) {
      var newKey = exceptions.indexOf(key) === -1 ? snakeToCamel(key) : key;
      p[newKey] = toCamelCase(object[key]);
      return p;
    }, {});
  }

  function getLocationFromUrl(href) {
    var match = href.match(
      /^(https?:|file:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
    );
    return (
      match && {
        href: href,
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7]
      }
    );
  }

  function getOriginFromUrl(url) {
    if (!url) {
      return undefined;
    }
    var parsed = getLocationFromUrl(url);
    var origin = parsed.protocol + '//' + parsed.hostname;
    if (parsed.port) {
      origin += ':' + parsed.port;
    }
    return origin;
  }

  var objectHelper = {
    toSnakeCase: toSnakeCase,
    toCamelCase: toCamelCase,
    blacklist: blacklist,
    merge: merge,
    pick: pick,
    getKeysNotIn: getKeysNotIn,
    extend: extend,
    getOriginFromUrl: getOriginFromUrl,
    getLocationFromUrl: getLocationFromUrl
  };

  function redirect(url) {
    getWindow().location = url;
  }

  function getDocument() {
    return getWindow().document;
  }

  function getWindow() {
    return window;
  }

  function getOrigin() {
    var location = getWindow().location;
    var origin = location.origin;

    if (!origin) {
      origin = objectHelper.getOriginFromUrl(location.href);
    }

    return origin;
  }

  var windowHandler = {
    redirect: redirect,
    getDocument: getDocument,
    getWindow: getWindow,
    getOrigin: getOrigin
  };

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var urlJoin = createCommonjsModule(function (module) {
  (function (name, context, definition) {
    if (module.exports) module.exports = definition();
    else if (typeof undefined === 'function' && undefined.amd) undefined(definition);
    else context[name] = definition();
  })('urljoin', commonjsGlobal, function () {

    function normalize (strArray) {
      var resultArray = [];

      // If the first part is a plain protocol, we combine it with the next part.
      if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
        var first = strArray.shift();
        strArray[0] = first + strArray[0];
      }

      // There must be two or three slashes in the file protocol, two slashes in anything else.
      if (strArray[0].match(/^file:\/\/\//)) {
        strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1:///');
      } else {
        strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1://');
      }

      for (var i = 0; i < strArray.length; i++) {
        var component = strArray[i];

        if (typeof component !== 'string') {
          throw new TypeError('Url must be a string. Received ' + component);
        }

        if (component === '') { continue; }

        if (i > 0) {
          // Removing the starting slashes for each component but the first.
          component = component.replace(/^[\/]+/, '');
        }
        if (i < strArray.length - 1) {
          // Removing the ending slashes for each component but the last.
          component = component.replace(/[\/]+$/, '');
        } else {
          // For the last component we will combine multiple slashes to a single one.
          component = component.replace(/[\/]+$/, '/');
        }

        resultArray.push(component);

      }

      var str = resultArray.join('/');
      // Each input component is now separated by a single slash except the possible first plain protocol part.

      // remove trailing slash before parameters or hash
      str = str.replace(/\/(\?|&|#[^!])/g, '$1');

      // replace ? in parameters with &
      var parts = str.split('?');
      str = parts.shift() + (parts.length > 0 ? '?': '') + parts.join('&');

      return str;
    }

    return function () {
      var input;

      if (typeof arguments[0] === 'object') {
        input = arguments[0];
      } else {
        input = [].slice.call(arguments);
      }

      return normalize(input);
    };

  });
  });

  var utils = createCommonjsModule(function (module, exports) {

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
  });
  var utils_1 = utils.arrayToObject;
  var utils_2 = utils.merge;
  var utils_3 = utils.decode;
  var utils_4 = utils.encode;
  var utils_5 = utils.compact;
  var utils_6 = utils.isRegExp;
  var utils_7 = utils.isBuffer;

  var replace = String.prototype.replace;
  var percentTwenties = /%20/g;

  var formats = {
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

  var stringify_1 = function (object, opts) {
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

  var has = Object.prototype.hasOwnProperty;

  var defaults$1 = {
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

  var parse = function (str, opts) {
      var options = opts || {};

      if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
          throw new TypeError('Decoder has to be a function.');
      }

      options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults$1.delimiter;
      options.depth = typeof options.depth === 'number' ? options.depth : defaults$1.depth;
      options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults$1.arrayLimit;
      options.parseArrays = options.parseArrays !== false;
      options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults$1.decoder;
      options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults$1.allowDots;
      options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults$1.plainObjects;
      options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults$1.allowPrototypes;
      options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults$1.parameterLimit;
      options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults$1.strictNullHandling;

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

  var lib = {
      formats: formats,
      parse: parse,
      stringify: stringify_1
  };

  function PopupHandler(webAuth) {
    this.webAuth = webAuth;
    this._current_popup = null;
    this.options = null;
  }

  PopupHandler.prototype.preload = function(options) {
    var _this = this;
    var _window = windowHandler.getWindow();

    var url = options.url || 'about:blank';
    var popupOptions = options.popupOptions || {};

    popupOptions.location = 'yes';
    delete popupOptions.width;
    delete popupOptions.height;

    var windowFeatures = lib.stringify(popupOptions, {
      encode: false,
      delimiter: ','
    });

    if (this._current_popup && !this._current_popup.closed) {
      return this._current_popup;
    }

    this._current_popup = _window.open(url, '_blank', windowFeatures);

    this._current_popup.kill = function(success) {
      _this._current_popup.success = success;
      this.close();
      _this._current_popup = null;
    };

    return this._current_popup;
  };

  PopupHandler.prototype.load = function(url, _, options, cb) {
    var _this = this;
    this.url = url;
    this.options = options;
    if (!this._current_popup) {
      options.url = url;
      this.preload(options);
    } else {
      this._current_popup.location.href = url;
    }

    this.transientErrorHandler = function(event) {
      _this.errorHandler(event, cb);
    };

    this.transientStartHandler = function(event) {
      _this.startHandler(event, cb);
    };

    this.transientExitHandler = function() {
      _this.exitHandler(cb);
    };

    this._current_popup.addEventListener('loaderror', this.transientErrorHandler);
    this._current_popup.addEventListener('loadstart', this.transientStartHandler);
    this._current_popup.addEventListener('exit', this.transientExitHandler);
  };

  PopupHandler.prototype.errorHandler = function(event, cb) {
    if (!this._current_popup) {
      return;
    }

    this._current_popup.kill(true);

    cb({ error: 'window_error', errorDescription: event.message });
  };

  PopupHandler.prototype.unhook = function() {
    this._current_popup.removeEventListener('loaderror', this.transientErrorHandler);
    this._current_popup.removeEventListener('loadstart', this.transientStartHandler);
    this._current_popup.removeEventListener('exit', this.transientExitHandler);
  };

  PopupHandler.prototype.exitHandler = function(cb) {
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

  PopupHandler.prototype.startHandler = function(event, cb) {
    var _this = this;

    if (!this._current_popup) {
      return;
    }

    var callbackUrl = urlJoin('https:', this.webAuth.baseOptions.domain, '/mobile');

    if (event.url && !(event.url.indexOf(callbackUrl + '#') === 0)) {
      return;
    }

    var parts = event.url.split('#');

    if (parts.length === 1) {
      return;
    }

    var opts = { hash: parts.pop() };

    if (this.options.nonce) {
      opts.nonce = this.options.nonce;
    }

    this.webAuth.parseHash(opts, function(error, result) {
      if (error || result) {
        _this._current_popup.kill(true);
        cb(error, result);
      }
    });
  };

  function PluginHandler(webAuth) {
    this.webAuth = webAuth;
  }

  PluginHandler.prototype.processParams = function (params) {
    params.redirectUri = urlJoin('https://' + params.domain, 'mobile');
    delete params.owp;
    return params;
  };

  PluginHandler.prototype.getPopupHandler = function () {
    return new PopupHandler(this.webAuth);
  };

  function CordovaPlugin() {
    this.webAuth = null;
    this.version = version.raw;
    this.extensibilityPoints = ['popup.authorize', 'popup.getPopupHandler'];
  }

  CordovaPlugin.prototype.setWebAuth = function(webAuth) {
    this.webAuth = webAuth;
  };

  CordovaPlugin.prototype.supports = function(extensibilityPoint) {
    var _window = windowHandler.getWindow();
    return (
      (!!_window.cordova || !!_window.electron) &&
      this.extensibilityPoints.indexOf(extensibilityPoint) > -1
    );
  };

  CordovaPlugin.prototype.init = function() {
    return new PluginHandler(this.webAuth);
  };

  return CordovaPlugin;

})));
