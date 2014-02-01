/*!
 * Lo-Dash 1.0.0-rc.3 (Custom Build) <http://lodash.com>
 * Build: `lodash include="template,each,debounce" -o source/assets/js/.tmp/lodash.js -d`
 * (c) 2012 John-David Dalton <http://allyoucanleet.com/>
 * Based on Underscore.js 1.4.3 <http://underscorejs.org>
 * (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
 * Available under MIT license <http://lodash.com/license>
 */
;(function(window, undefined) {

  /** Detect free variable `exports` */
  var freeExports = typeof exports == 'object' && exports;

  /** Detect free variable `global` and use it as `window` */
  var freeGlobal = typeof global == 'object' && global;
  if (freeGlobal.global === freeGlobal) {
    window = freeGlobal;
  }

  /** Used for array and object method references */
  var arrayRef = [],
      // avoid a Closure Compiler bug by creatively creating an object
      objectRef = new function(){};

  /** Used to generate unique IDs */
  var idCounter = 0;

  /** Used internally to indicate various things */
  var indicatorObject = objectRef;

  /** Used by `cachedContains` as the default size when optimizations are enabled for large arrays */
  var largeArraySize = 30;

  /** Used to restore the original `_` reference in `noConflict` */
  var oldDash = window._;

  /** Used to detect template delimiter values that require a with-statement */
  var reComplexDelimiter = /[-?+=!~*%&^<>|{(\/]|\[\D|\b(?:delete|in|instanceof|new|typeof|void)\b/;

  /** Used to match HTML entities */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#x27);/g;

  /** Used to match empty string literals in compiled template source */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match regexp flags from their coerced string values */
  var reFlags = /\w*$/;

  /** Used to insert the data object variable into compiled template source */
  var reInsertVariable = /(?:__e|__t = )\(\s*(?![\d\s"']|this\.)/g;

  /** Used to detect if a method is native */
  var reNative = RegExp('^' +
    (objectRef.valueOf + '')
      .replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&')
      .replace(/valueOf|for [^\]]+/g, '.+?') + '$'
  );

  /**
   * Used to match ES6 template delimiters
   * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-7.8.6
   */
  var reEsTemplate = /\$\{((?:(?=\\?)\\?[\s\S])*?)}/g;

  /** Used to match "interpolate" template delimiters */
  var reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to ensure capturing order of template delimiters */
  var reNoMatch = /($^)/;

  /** Used to match HTML characters */
  var reUnescapedHtml = /[&<>"']/g;

  /** Used to match unescaped characters in compiled string literals */
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  /** Used to fix the JScript [[DontEnum]] bug */
  var shadowed = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    'toLocaleString', 'toString', 'valueOf'
  ];

  /** Used to make template sourceURLs easier to identify */
  var templateCounter = 0;

  /** Native method shortcuts */
  var ceil = Math.ceil,
      concat = arrayRef.concat,
      floor = Math.floor,
      getPrototypeOf = reNative.test(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
      hasOwnProperty = objectRef.hasOwnProperty,
      push = arrayRef.push,
      propertyIsEnumerable = objectRef.propertyIsEnumerable,
      toString = objectRef.toString;

  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeBind = reNative.test(nativeBind = slice.bind) && nativeBind,
      nativeIsArray = reNative.test(nativeIsArray = Array.isArray) && nativeIsArray,
      nativeIsFinite = window.isFinite,
      nativeIsNaN = window.isNaN,
      nativeKeys = reNative.test(nativeKeys = Object.keys) && nativeKeys,
      nativeMax = Math.max,
      nativeMin = Math.min,
      nativeRandom = Math.random;

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Detect various environments */
  var isIeOpera = !!window.attachEvent,
      isV8 = nativeBind && !/\n|true/.test(nativeBind + isIeOpera);

  /* Detect if `Function#bind` exists and is inferred to be fast (all but V8) */
  var isBindFast = nativeBind && !isV8;

  /* Detect if `Object.keys` exists and is inferred to be fast (IE, Opera, V8) */
  var isKeysFast = nativeKeys && (isIeOpera || isV8);

  /**
   * Detect the JScript [[DontEnum]] bug:
   *
   * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
   * made non-enumerable as well.
   */
  var hasDontEnumBug;

  /** Detect if own properties are iterated after inherited properties (IE < 9) */
  var iteratesOwnLast;

  /** Detect if an `arguments` object's indexes are non-enumerable (IE < 9) */
  var nonEnumArgs = true;

  (function() {
    var props = [];
    function ctor() { this.x = 1; }
    ctor.prototype = { 'valueOf': 1, 'y': 1 };
    for (var prop in new ctor) { props.push(prop); }
    for (prop in arguments) { nonEnumArgs = !prop; }

    hasDontEnumBug = !/valueOf/.test(props);
    iteratesOwnLast = props[0] != 'x';
  }(1));

  /** Detect if `arguments` objects are `Object` objects (all but Opera < 10.5) */
  var argsAreObjects = arguments.constructor == Object;

  /** Detect if `arguments` objects [[Class]] is unresolvable (Firefox < 4, IE < 9) */
  var noArgsClass = !isArguments(arguments);

  /**
   * Detect lack of support for accessing string characters by index:
   *
   * IE < 8 can't access characters by index and IE 8 can only access
   * characters by index on string literals.
   */
  var noCharByIndex = ('x'[0] + Object('x')[0]) != 'xx';

  /**
   * Detect if a node's [[Class]] is unresolvable (IE < 9)
   * and that the JS engine won't error when attempting to coerce an object to
   * a string without a `toString` property value of `typeof` "function".
   */
  try {
    var noNodeClass = ({ 'toString': 0 } + '', toString.call(document) == objectClass);
  } catch(e) { }

  /**
   * Detect if sourceURL syntax is usable without erroring:
   *
   * The JS engine embedded in Adobe products will throw a syntax error when
   * it encounters a single line comment beginning with the `@` symbol.
   *
   * The JS engine in Narwhal will generate the function `function anonymous(){//}`
   * and throw a syntax error.
   *
   * Avoid comments beginning `@` symbols in IE because they are part of its
   * non-standard conditional compilation support.
   * http://msdn.microsoft.com/en-us/library/121hztk3(v=vs.94).aspx
   */
  try {
    var useSourceURL = (Function('//@')(), !isIeOpera);
  } catch(e) { }

  /** Used to identify object classifications that `_.clone` supports */
  var cloneableClasses = {};
  cloneableClasses[funcClass] = false;
  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

  /** Used to lookup a built-in constructor by [[Class]] */
  var ctorByClass = {};
  ctorByClass[arrayClass] = Array;
  ctorByClass[boolClass] = Boolean;
  ctorByClass[dateClass] = Date;
  ctorByClass[objectClass] = Object;
  ctorByClass[numberClass] = Number;
  ctorByClass[regexpClass] = RegExp;
  ctorByClass[stringClass] = String;

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  /** Used to escape characters for inclusion in compiled string literals */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a `lodash` object, that wraps the given `value`, to enable
   * method chaining.
   *
   * The chainable wrapper functions are:
   * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`, `compose`,
   * `concat`, `countBy`, `debounce`, `defaults`, `defer`, `delay`, `difference`,
   * `filter`, `flatten`, `forEach`, `forIn`, `forOwn`, `functions`, `groupBy`,
   * `initial`, `intersection`, `invert`, `invoke`, `keys`, `map`, `max`, `memoize`,
   * `merge`, `min`, `object`, `omit`, `once`, `pairs`, `partial`, `pick`, `pluck`,
   * `push`, `range`, `reject`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
   * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `union`, `uniq`,
   * `unshift`, `values`, `where`, `without`, `wrap`, and `zip`
   *
   * The non-chainable wrapper functions are:
   * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `has`, `identity`,
   * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`, `isEmpty`,
   * `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`, `isObject`,
   * `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`, `lastIndexOf`,
   * `mixin`, `noConflict`, `pop`, `random`, `reduce`, `reduceRight`, `result`,
   * `shift`, `size`, `some`, `sortedIndex`, `template`, `unescape`, and `uniqueId`
   *
   * The wrapper functions `first` and `last` return wrapped values when `n` is
   * passed, otherwise they return unwrapped values.
   *
   * @name _
   * @constructor
   * @category Chaining
   * @param {Mixed} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns a `lodash` instance.
   */
  function lodash() {
    // no operation performed
  }

  /**
   * By default, the template delimiters used by Lo-Dash are similar to those in
   * embedded Ruby (ERB). Change the following template settings to use alternative
   * delimiters.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  lodash.templateSettings = {

    /**
     * Used to detect `data` property values to be HTML-escaped.
     *
     * @static
     * @memberOf _.templateSettings
     * @type RegExp
     */
    'escape': /<%-([\s\S]+?)%>/g,

    /**
     * Used to detect code to be evaluated.
     *
     * @static
     * @memberOf _.templateSettings
     * @type RegExp
     */
    'evaluate': /<%([\s\S]+?)%>/g,

    /**
     * Used to detect `data` property values to inject.
     *
     * @static
     * @memberOf _.templateSettings
     * @type RegExp
     */
    'interpolate': reInterpolate,

    /**
     * Used to reference the data object in the template text.
     *
     * @static
     * @memberOf _.templateSettings
     * @type String
     */
    'variable': ''
  };

  /*--------------------------------------------------------------------------*/

  /**
   * The template used to create iterator functions.
   *
   * @private
   * @param {Obect} data The data object used to populate the text.
   * @returns {String} Returns the interpolated text.
   */
  var iteratorTemplate = function(obj) {
    
    var __p = 'var index, iteratee = ' +
    (obj.firstArg ) +
    ', result = ' +
    (obj.firstArg ) +
    ';\nif (!' +
    (obj.firstArg ) +
    ') return result;\n' +
    (obj.top ) +
    ';\n';
     if (obj.arrayLoop) {
    __p += 'var length = iteratee.length; index = -1;\nif (typeof length == \'number\') {  ';
     if (obj.noCharByIndex) {
    __p += '\n  if (isString(iteratee)) {\n    iteratee = iteratee.split(\'\')\n  }  ';
     } ;
    __p += '\n  while (++index < length) {\n    ' +
    (obj.arrayLoop ) +
    '\n  }\n}\nelse {  ';
      } else if (obj.nonEnumArgs) {
    __p += '\n  var length = iteratee.length; index = -1;\n  if (length && isArguments(iteratee)) {\n    while (++index < length) {\n      index += \'\';\n      ' +
    (obj.objectLoop ) +
    '\n    }\n  } else {  ';
     } ;
    
     if (!obj.hasDontEnumBug) {
    __p += '\n  var skipProto = typeof iteratee == \'function\' && \n    propertyIsEnumerable.call(iteratee, \'prototype\');\n  ';
     } ;
    
     if (obj.isKeysFast && obj.useHas) {
    __p += '\n  var ownIndex = -1,\n      ownProps = objectTypes[typeof iteratee] ? nativeKeys(iteratee) : [],\n      length = ownProps.length;\n\n  while (++ownIndex < length) {\n    index = ownProps[ownIndex];\n    ';
     if (!obj.hasDontEnumBug) {
    __p += 'if (!(skipProto && index == \'prototype\')) {\n  ';
     } ;
    __p += 
    (obj.objectLoop ) +
    '';
     if (!obj.hasDontEnumBug) {
    __p += '}\n';
     } ;
    __p += '  }  ';
     } else {
    __p += '\n  for (index in iteratee) {';
        if (!obj.hasDontEnumBug || obj.useHas) {
    __p += '\n    if (';
          if (!obj.hasDontEnumBug) {
    __p += '!(skipProto && index == \'prototype\')';
     }      if (!obj.hasDontEnumBug && obj.useHas) {
    __p += ' && ';
     }      if (obj.useHas) {
    __p += 'hasOwnProperty.call(iteratee, index)';
     }    ;
    __p += ') {    ';
     } ;
    __p += 
    (obj.objectLoop ) +
    ';    ';
     if (!obj.hasDontEnumBug || obj.useHas) {
    __p += '\n    }';
     } ;
    __p += '\n  }  ';
     } ;
    
     if (obj.hasDontEnumBug) {
    __p += '\n\n  var ctor = iteratee.constructor;\n    ';
     for (var k = 0; k < 7; k++) {
    __p += '\n  index = \'' +
    (obj.shadowed[k] ) +
    '\';\n  if (';
          if (obj.shadowed[k] == 'constructor') {
    __p += '!(ctor && ctor.prototype === iteratee) && ';
          } ;
    __p += 'hasOwnProperty.call(iteratee, index)) {\n    ' +
    (obj.objectLoop ) +
    '\n  }    ';
     } ;
    
     } ;
    
     if (obj.arrayLoop || obj.nonEnumArgs) {
    __p += '\n}';
     } ;
    __p += 
    (obj.bottom ) +
    ';\nreturn result';
    
    
    return __p
  };

  /** Reusable iterator options for `assign` and `defaults` */
  var assignIteratorOptions = {
    'args': 'object, source, guard',
    'top':
      "for (var argsIndex = 1, argsLength = typeof guard == 'number' ? 2 : arguments.length; argsIndex < argsLength; argsIndex++) {\n" +
      '  if ((iteratee = arguments[argsIndex])) {',
    'objectLoop': 'result[index] = iteratee[index]',
    'bottom': '  }\n}'
  };

  /**
   * Reusable iterator options shared by `each`, `forIn`, and `forOwn`.
   */
  var eachIteratorOptions = {
    'args': 'collection, callback, thisArg',
    'top': "callback = callback && typeof thisArg == 'undefined' ? callback : createCallback(callback, thisArg)",
    'arrayLoop': 'if (callback(iteratee[index], index, collection) === false) return result',
    'objectLoop': 'if (callback(iteratee[index], index, collection) === false) return result'
  };

  /** Reusable iterator options for `forIn` and `forOwn` */
  var forOwnIteratorOptions = {
    'arrayLoop': null
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a function optimized to search large arrays for a given `value`,
   * starting at `fromIndex`, using strict equality for comparisons, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Mixed} value The value to search for.
   * @param {Number} [fromIndex=0] The index to search from.
   * @param {Number} [largeSize=30] The length at which an array is considered large.
   * @returns {Boolean} Returns `true` if `value` is found, else `false`.
   */
  function cachedContains(array, fromIndex, largeSize) {
    fromIndex || (fromIndex = 0);

    var length = array.length,
        isLarge = (length - fromIndex) >= (largeSize || largeArraySize);

    if (isLarge) {
      var cache = {},
          index = fromIndex - 1;

      while (++index < length) {
        // manually coerce `value` to a string because `hasOwnProperty`, in some
        // older versions of Firefox, coerces objects incorrectly
        var key = array[index] + '';
        (hasOwnProperty.call(cache, key) ? cache[key] : (cache[key] = [])).push(array[index]);
      }
    }
    return function(value) {
      if (isLarge) {
        var key = value + '';
        return hasOwnProperty.call(cache, key) && indexOf(cache[key], value) > -1;
      }
      return indexOf(array, value, fromIndex) > -1;
    }
  }

  /**
   * Used by `_.max` and `_.min` as the default `callback` when a given
   * `collection` is a string value.
   *
   * @private
   * @param {String} value The character to inspect.
   * @returns {Number} Returns the code unit of given character.
   */
  function charAtCallback(value) {
    return value.charCodeAt(0);
  }

  /**
   * Used by `sortBy` to compare transformed `collection` values, stable sorting
   * them in ascending order.
   *
   * @private
   * @param {Object} a The object to compare to `b`.
   * @param {Object} b The object to compare to `a`.
   * @returns {Number} Returns the sort order indicator of `1` or `-1`.
   */
  function compareAscending(a, b) {
    var ai = a.index,
        bi = b.index;

    a = a.criteria;
    b = b.criteria;

    // ensure a stable sort in V8 and other engines
    // http://code.google.com/p/v8/issues/detail?id=90
    if (a !== b) {
      if (a > b || typeof a == 'undefined') {
        return 1;
      }
      if (a < b || typeof b == 'undefined') {
        return -1;
      }
    }
    return ai < bi ? -1 : 1;
  }

  /**
   * Creates a function that, when called, invokes `func` with the `this`
   * binding of `thisArg` and prepends any `partailArgs` to the arguments passed
   * to the bound function.
   *
   * @private
   * @param {Function|String} func The function to bind or the method name.
   * @param {Mixed} [thisArg] The `this` binding of `func`.
   * @param {Array} partialArgs An array of arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   */
  function createBound(func, thisArg, partialArgs) {
    var isFunc = isFunction(func),
        isPartial = !partialArgs,
        key = thisArg;

    // juggle arguments
    if (isPartial) {
      partialArgs = thisArg;
    }
    if (!isFunc) {
      thisArg = func;
    }

    function bound() {
      // `Function#bind` spec
      // http://es5.github.com/#x15.3.4.5
      var args = arguments,
          thisBinding = isPartial ? this : thisArg;

      if (!isFunc) {
        func = thisArg[key];
      }
      if (partialArgs.length) {
        args = args.length
          ? partialArgs.concat(slice(args))
          : partialArgs;
      }
      if (this instanceof bound) {
        // ensure `new bound` is an instance of `bound` and `func`
        noop.prototype = func.prototype;
        thisBinding = new noop;
        noop.prototype = null;

        // mimic the constructor's `return` behavior
        // http://es5.github.com/#x13.2.2
        var result = func.apply(thisBinding, args);
        return isObject(result) ? result : thisBinding;
      }
      return func.apply(thisBinding, args);
    }
    return bound;
  }

  /**
   * Produces an iteration callback bound to an optional `thisArg`. If `func` is
   * a property name, the callback will return the property value for a given element.
   *
   * @private
   * @param {Function|String} [func=identity|property] The function called per
   * iteration or property name to query.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @param {Object} [accumulating] Used to indicate that the callback should
   *  accept an `accumulator` argument.
   * @returns {Function} Returns a callback function.
   */
  function createCallback(func, thisArg, accumulating) {
    if (!func) {
      return identity;
    }
    if (typeof func != 'function') {
      return function(object) {
        return object[func];
      };
    }
    if (typeof thisArg != 'undefined') {
      if (accumulating) {
        return function(accumulator, value, index, object) {
          return func.call(thisArg, accumulator, value, index, object);
        };
      }
      return function(value, index, object) {
        return func.call(thisArg, value, index, object);
      };
    }
    return func;
  }

  /**
   * Creates compiled iteration functions.
   *
   * @private
   * @param {Object} [options1, options2, ...] The compile options object(s).
   *  useHas - A boolean to specify using `hasOwnProperty` checks in the object loop.
   *  args - A string of comma separated arguments the iteration function will accept.
   *  top - A string of code to execute before the iteration branches.
   *  arrayLoop - A string of code to execute in the array loop.
   *  objectLoop - A string of code to execute in the object loop.
   *  bottom - A string of code to execute after the iteration branches.
   *
   * @returns {Function} Returns the compiled function.
   */
  function createIterator() {
    var data = {
      'arrayLoop': '',
      'bottom': '',
      'hasDontEnumBug': hasDontEnumBug,
      'isKeysFast': isKeysFast,
      'objectLoop': '',
      'nonEnumArgs': nonEnumArgs,
      'noCharByIndex': noCharByIndex,
      'shadowed': shadowed,
      'top': '',
      'useHas': true
    };

    // merge options into a template data object
    for (var object, index = 0; object = arguments[index]; index++) {
      for (var key in object) {
        data[key] = object[key];
      }
    }
    var args = data.args;
    data.firstArg = /^[^,]+/.exec(args)[0];

    // create the function factory
    var factory = Function(
        'createCallback, hasOwnProperty, isArguments, isString, objectTypes, ' +
        'nativeKeys, propertyIsEnumerable',
      'return function(' + args + ') {\n' + iteratorTemplate(data) + '\n}'
    );
    // return the compiled function
    return factory(
      createCallback, hasOwnProperty, isArguments, isString, objectTypes,
      nativeKeys, propertyIsEnumerable
    );
  }

  /**
   * A function compiled to iterate `arguments` objects, arrays, objects, and
   * strings consistenly across environments, executing the `callback` for each
   * element in the `collection`. The `callback` is bound to `thisArg` and invoked
   * with three arguments; (value, index|key, collection). Callbacks may exit
   * iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Array|Object|String} Returns `collection`.
   */
  var each = createIterator(eachIteratorOptions);

  /**
   * Used by `template` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {String} match The matched character to escape.
   * @returns {String} Returns the escaped character.
   */
  function escapeStringChar(match) {
    return '\\' + stringEscapes[match];
  }

  /**
   * Used by `escape` to convert characters to HTML entities.
   *
   * @private
   * @param {String} match The matched character to escape.
   * @returns {String} Returns the escaped character.
   */
  function escapeHtmlChar(match) {
    return htmlEscapes[match];
  }

  /**
   * Checks if `value` is a DOM node in IE < 9.
   *
   * @private
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a DOM node, else `false`.
   */
  function isNode(value) {
    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
    // methods that are `typeof` "string" and still can coerce nodes to strings
    return typeof value.toString != 'function' && typeof (value + '') == 'string';
  }

  /**
   * A no-operation function.
   *
   * @private
   */
  function noop() {
    // no operation performed
  }

  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used, instead of `Array#slice`, to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|String} collection The collection to slice.
   * @param {Number} start The start index.
   * @param {Number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);

    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }

  /**
   * Used by `unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {String} match The matched character to unescape.
   * @returns {String} Returns the unescaped character.
   */
  function unescapeHtmlChar(match) {
    return htmlUnescapes[match];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Checks if `value` is an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
   * @example
   *
   * (function() { return _.isArguments(arguments); })(1, 2, 3);
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    return toString.call(value) == argsClass;
  }
  // fallback for browsers that can't detect `arguments` objects by [[Class]]
  if (noArgsClass) {
    isArguments = function(value) {
      return value ? hasOwnProperty.call(value, 'callee') : false;
    };
  }

  /**
   * A fallback implementation of `isPlainObject` that checks if a given `value`
   * is an object created by the `Object` constructor, assuming objects created
   * by the `Object` constructor have no inherited enumerable properties and that
   * there are no `Object.prototype` extensions.
   *
   * @private
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if `value` is a plain object, else `false`.
   */
  function shimIsPlainObject(value) {
    // avoid non-objects and false positives for `arguments` objects
    var result = false;
    if (!(value && typeof value == 'object') || isArguments(value)) {
      return result;
    }
    // check that the constructor is `Object` (i.e. `Object instanceof Object`)
    var ctor = value.constructor;
    if ((!isFunction(ctor) && (!noNodeClass || !isNode(value))) || ctor instanceof ctor) {
      // IE < 9 iterates inherited properties before own properties. If the first
      // iterated property is an object's own property then there are no inherited
      // enumerable properties.
      if (iteratesOwnLast) {
        forIn(value, function(value, key, object) {
          result = !hasOwnProperty.call(object, key);
          return false;
        });
        return result === false;
      }
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      forIn(value, function(value, key) {
        result = key;
      });
      return result === false || hasOwnProperty.call(value, result);
    }
    return result;
  }

  /**
   * A fallback implementation of `Object.keys` that produces an array of the
   * given object's own enumerable property names.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns a new array of property names.
   */
  function shimKeys(object) {
    var result = [];
    forOwn(object, function(value, key) {
      result.push(key);
    });
    return result;
  }

  /**
   * Used to convert characters to HTML entities:
   *
   * Though the `>` character is escaped for symmetry, characters like `>` and `/`
   * don't require escaping in HTML and have no special meaning unless they're part
   * of a tag or an unquoted attribute value.
   * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
   */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };

  /** Used to convert HTML entities to characters */
  var htmlUnescapes = {'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#x27;':"'"};

  /*--------------------------------------------------------------------------*/

  /**
   * Checks if `value` is an array.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is an array, else `false`.
   * @example
   *
   * (function() { return _.isArray(arguments); })();
   * // => false
   *
   * _.isArray([1, 2, 3]);
   * // => true
   */
  var isArray = nativeIsArray || function(value) {
    // `instanceof` may cause a memory leak in IE 7 if `value` is a host object
    // http://ajaxian.com/archives/working-aroung-the-instanceof-memory-leak
    return (argsAreObjects && value instanceof Array) || toString.call(value) == arrayClass;
  };

  /**
   * Checks if `value` is a string.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Mixed} value The value to check.
   * @returns {Boolean} Returns `true` if the `value` is a string, else `false`.
   * @example
   *
   * _.isString('moe');
   * // => true
   */
  function isString(value) {
    return typeof value == 'string' || toString.call(value) == stringClass;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Iterates over a `collection`, executing the `callback` for each element in
   * the `collection`. The `callback` is bound to `thisArg` and invoked with three
   * arguments; (value, index|key, collection). Callbacks may exit iteration early
   * by explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @alias each
   * @category Collections
   * @param {Array|Object|String} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {Mixed} [thisArg] The `this` binding of `callback`.
   * @returns {Array|Object|String} Returns `collection`.
   * @example
   *
   * _([1, 2, 3]).forEach(alert).join(',');
   * // => alerts each number and returns '1,2,3'
   *
   * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, alert);
   * // => alerts each number value (order is not guaranteed)
   */
  function forEach(collection, callback, thisArg) {
    if (callback && typeof thisArg == 'undefined' && isArray(collection)) {
      var index = -1,
          length = collection.length;

      while (++index < length) {
        if (callback(collection[index], index, collection) === false) {
          break;
        }
      }
    } else {
      each(collection, callback, thisArg);
    }
    return collection;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a function that will delay the execution of `func` until after
   * `wait` milliseconds have elapsed since the last time it was invoked. Pass
   * `true` for `immediate` to cause debounce to invoke `func` on the leading,
   * instead of the trailing, edge of the `wait` timeout. Subsequent calls to
   * the debounced function will return the result of the last `func` call.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to debounce.
   * @param {Number} wait The number of milliseconds to delay.
   * @param {Boolean} immediate A flag to indicate execution is on the leading
   *  edge of the timeout.
   * @returns {Function} Returns the new debounced function.
   * @example
   *
   * var lazyLayout = _.debounce(calculateLayout, 300);
   * jQuery(window).on('resize', lazyLayout);
   */
  function debounce(func, wait, immediate) {
    var args,
        result,
        thisArg,
        timeoutId;

    function delayed() {
      timeoutId = null;
      if (!immediate) {
        result = func.apply(thisArg, args);
      }
    }
    return function() {
      var isImmediate = immediate && !timeoutId;
      args = arguments;
      thisArg = this;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(delayed, wait);

      if (isImmediate) {
        result = func.apply(thisArg, args);
      }
      return result;
    };
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
   * corresponding HTML entities.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {String} string The string to escape.
   * @returns {String} Returns the escaped string.
   * @example
   *
   * _.escape('Moe, Larry & Curly');
   * // => 'Moe, Larry &amp; Curly'
   */
  function escape(string) {
    return string == null ? '' : (string + '').replace(reUnescapedHtml, escapeHtmlChar);
  }

  /**
   * This function returns the first argument passed to it.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Mixed} value Any value.
   * @returns {Mixed} Returns `value`.
   * @example
   *
   * var moe = { 'name': 'moe' };
   * moe === _.identity(moe);
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * A micro-templating method that handles arbitrary delimiters, preserves
   * whitespace, and correctly escapes quotes within interpolated code.
   *
   * Note: In the development build `_.template` utilizes sourceURLs for easier
   * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
   *
   * Note: Lo-Dash may be used in Chrome extensions by either creating a `lodash csp`
   * build and avoiding `_.template` use, or loading Lo-Dash in a sandboxed page.
   * See http://developer.chrome.com/trunk/extensions/sandboxingEval.html
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {String} text The template text.
   * @param {Obect} data The data object used to populate the text.
   * @param {Object} options The options object.
   *  escape - The "escape" delimiter regexp.
   *  evaluate - The "evaluate" delimiter regexp.
   *  interpolate - The "interpolate" delimiter regexp.
   *  sourceURL - The sourceURL of the template's compiled source.
   *  variable - The data object variable name.
   *
   * @returns {Function|String} Returns a compiled function when no `data` object
   *  is given, else it returns the interpolated text.
   * @example
   *
   * // using a compiled template
   * var compiled = _.template('hello <%= name %>');
   * compiled({ 'name': 'moe' });
   * // => 'hello moe'
   *
   * var list = '<% _.forEach(people, function(name) { %><li><%= name %></li><% }); %>';
   * _.template(list, { 'people': ['moe', 'larry', 'curly'] });
   * // => '<li>moe</li><li>larry</li><li>curly</li>'
   *
   * // using the "escape" delimiter to escape HTML in data property values
   * _.template('<b><%- value %></b>', { 'value': '<script>' });
   * // => '<b>&lt;script&gt;</b>'
   *
   * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
   * _.template('hello ${ name }', { 'name': 'curly' });
   * // => 'hello curly'
   *
   * // using the internal `print` function in "evaluate" delimiters
   * _.template('<% print("hello " + epithet); %>!', { 'epithet': 'stooge' });
   * // => 'hello stooge!'
   *
   * // using custom template delimiters
   * _.templateSettings = {
   *   'interpolate': /{{([\s\S]+?)}}/g
   * };
   *
   * _.template('hello {{ name }}!', { 'name': 'mustache' });
   * // => 'hello mustache!'
   *
   * // using the `sourceURL` option to specify a custom sourceURL for the template
   * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
   * compiled(data);
   * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
   *
   * // using the `variable` option to ensure a with-statement isn't used in the compiled template
   * var compiled = _.template('hello <%= data.name %>!', null, { 'variable': 'data' });
   * compiled.source;
   * // => function(data) {
   *   var __t, __p = '', __e = _.escape;
   *   __p += 'hello ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
   *   return __p;
   * }
   *
   * // using the `source` property to inline compiled templates for meaningful
   * // line numbers in error messages and a stack trace
   * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
   *   var JST = {\
   *     "main": ' + _.template(mainText).source + '\
   *   };\
   * ');
   */
  function template(text, data, options) {
    // based on John Resig's `tmpl` implementation
    // http://ejohn.org/blog/javascript-micro-templating/
    // and Laura Doktorova's doT.js
    // https://github.com/olado/doT
    text || (text = '');
    options || (options = {});

    var isEvaluating,
        result,
        settings = lodash.templateSettings,
        index = 0,
        interpolate = options.interpolate || settings.interpolate || reNoMatch,
        source = "__p += '",
        variable = options.variable || settings.variable,
        hasVariable = variable;

    // compile regexp to match each delimiter
    var reDelimiters = RegExp(
      (options.escape || settings.escape || reNoMatch).source + '|' +
      interpolate.source + '|' +
      (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
      (options.evaluate || settings.evaluate || reNoMatch).source + '|$'
    , 'g');

    text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
      interpolateValue || (interpolateValue = esTemplateValue);

      // escape characters that cannot be included in string literals
      source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

      // replace delimiters with snippets
      if (escapeValue) {
        source += "' +\n__e(" + escapeValue + ") +\n'";
      }
      if (evaluateValue) {
        source += "';\n" + evaluateValue + ";\n__p += '";
      }
      if (interpolateValue) {
        source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
      }
      isEvaluating || (isEvaluating = evaluateValue || reComplexDelimiter.test(escapeValue || interpolateValue));
      index = offset + match.length;

      // the JS engine embedded in Adobe products requires returning the `match`
      // string in order to produce the correct `offset` value
      return match;
    });

    source += "';\n";

    // if `variable` is not specified and the template contains "evaluate"
    // delimiters, wrap a with-statement around the generated code to add the
    // data object to the top of the scope chain
    if (!hasVariable) {
      variable = 'obj';
      if (isEvaluating) {
        source = 'with (' + variable + ') {\n' + source + '\n}\n';
      }
      else {
        // avoid a with-statement by prepending data object references to property names
        var reDoubleVariable = RegExp('(\\(\\s*)' + variable + '\\.' + variable + '\\b', 'g');
        source = source
          .replace(reInsertVariable, '$&' + variable + '.')
          .replace(reDoubleVariable, '$1__d');
      }
    }

    // cleanup code by stripping empty strings
    source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
      .replace(reEmptyStringMiddle, '$1')
      .replace(reEmptyStringTrailing, '$1;');

    // frame code as the function body
    source = 'function(' + variable + ') {\n' +
      (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
      "var __t, __p = '', __e = _.escape" +
      (isEvaluating
        ? ', __j = Array.prototype.join;\n' +
          "function print() { __p += __j.call(arguments, '') }\n"
        : (hasVariable ? '' : ', __d = ' + variable + '.' + variable + ' || ' + variable) + ';\n'
      ) +
      source +
      'return __p\n}';

    // use a sourceURL for easier debugging
    // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
    var sourceURL = useSourceURL
      ? '\n//@ sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']')
      : '';

    try {
      result = Function('_', 'return ' + source + sourceURL)(lodash);
    } catch(e) {
      e.source = source;
      throw e;
    }

    if (data) {
      return result(data);
    }
    // provide the compiled function's source via its `toString` method, in
    // supported environments, or the `source` property as a convenience for
    // inlining compiled templates during the build process
    result.source = source;
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Produces the `toString` result of the wrapped value.
   *
   * @name toString
   * @memberOf _
   * @category Chaining
   * @returns {String} Returns the string result.
   * @example
   *
   * _([1, 2, 3]).toString();
   * // => '1,2,3'
   */
  function wrapperToString() {
    return this.__wrapped__ + '';
  }

  /**
   * Extracts the wrapped value.
   *
   * @name valueOf
   * @memberOf _
   * @alias value
   * @category Chaining
   * @returns {Mixed} Returns the wrapped value.
   * @example
   *
   * _([1, 2, 3]).valueOf();
   * // => [1, 2, 3]
   */
  function wrapperValueOf() {
    return this.__wrapped__;
  }

  /*--------------------------------------------------------------------------*/
  lodash.debounce = debounce;
  lodash.forEach = forEach;
  lodash.each = forEach;
  /*--------------------------------------------------------------------------*/
  lodash.escape = escape;
  lodash.identity = identity;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isString = isString;
  lodash.template = template;

  /*--------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type String
   */
  lodash.VERSION = '1.0.0-rc.3';

  /*--------------------------------------------------------------------------*/

  // expose Lo-Dash
  // some AMD build optimizers, like r.js, check for specific condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash was injected by a third-party script and not intended to be
    // loaded as a module. The global assignment can be reverted in the Lo-Dash
    // module via its `noConflict()` method.
    window._ = lodash;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    define(function() {
      return lodash;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports) {
    // in Node.js or RingoJS v0.8.0+
    if (typeof module == 'object' && module && module.exports == freeExports) {
      (module.exports = lodash)._ = lodash;
    }
    // in Narwhal or RingoJS v0.7.0-
    else {
      freeExports._ = lodash;
    }
  }
  else {
    // in a browser or Rhino
    window._ = lodash;
  }
}(this));
