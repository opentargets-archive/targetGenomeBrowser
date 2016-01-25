(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

// tnt global
if (typeof tnt === "undefined") {
    tnt = {};
}
tnt.board = require("tnt.genome");
tnt.utils = require("tnt.utils");
tnt.tooltip = require("tnt.tooltip");

module.exports = require("./index.js");

},{"./index.js":2,"tnt.genome":23,"tnt.tooltip":58,"tnt.utils":62}],2:[function(require,module,exports){
module.exports = targetGenomeBrowser = require("./src/targetGenomeBrowser.js");

},{"./src/targetGenomeBrowser.js":70}],3:[function(require,module,exports){
module.exports = cttvApi = require("./src/cttvApi.js");

},{"./src/cttvApi.js":18}],4:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.3.0
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$toString = {}.toString;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertex();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$es6$promise$utils$$isArray(input);
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;

      var length  = enumerator.length;
      var promise = enumerator.promise;
      var input   = enumerator._input;

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;

      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
          entry._onerror = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = entry;
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        enumerator._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = value;
        }
      }

      if (enumerator._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        if (!lib$es6$promise$utils$$isFunction(resolver)) {
          lib$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
          lib$es6$promise$promise$$needsNew();
        }

        lib$es6$promise$$internal$$initializePromise(this, resolver);
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor(lib$es6$promise$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          lib$es6$promise$asap$$asap(function(){
            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


}).call(this,require("IrXUsu"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"IrXUsu":19}],5:[function(require,module,exports){
/*globals define */
'use strict';


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return (root.httppleasepromises = factory(root));
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.httppleasepromises = factory(root);
    }
}(this, function (root) { // jshint ignore:line
    return function (Promise) {
        Promise = Promise || root && root.Promise;
        if (!Promise) {
            throw new Error('No Promise implementation found.');
        }
        return {
            processRequest: function (req) {
                var resolve, reject,
                    oldOnload = req.onload,
                    oldOnerror = req.onerror,
                    promise = new Promise(function (a, b) {
                        resolve = a;
                        reject = b;
                    });
                req.onload = function (res) {
                    var result;
                    if (oldOnload) {
                        result = oldOnload.apply(this, arguments);
                    }
                    resolve(res);
                    return result;
                };
                req.onerror = function (err) {
                    var result;
                    if (oldOnerror) {
                        result = oldOnerror.apply(this, arguments);
                    }
                    reject(err);
                    return result;
                };
                req.then = function () {
                    return promise.then.apply(promise, arguments);
                };
                req['catch'] = function () {
                    return promise['catch'].apply(promise, arguments);
                };
            }
        };
    };
}));

},{}],6:[function(require,module,exports){
'use strict';

var Response = require('./response');

function RequestError(message, props) {
    var err = new Error(message);
    err.name = 'RequestError';
    this.name = err.name;
    this.message = err.message;
    if (err.stack) {
        this.stack = err.stack;
    }

    this.toString = function () {
        return this.message;
    };

    for (var k in props) {
        if (props.hasOwnProperty(k)) {
            this[k] = props[k];
        }
    }
}

RequestError.prototype = Error.prototype;

RequestError.create = function (message, req, props) {
    var err = new RequestError(message, props);
    Response.call(err, req);
    return err;
};

module.exports = RequestError;

},{"./response":9}],7:[function(require,module,exports){
'use strict';

var i,
    cleanURL = require('../plugins/cleanurl'),
    XHR = require('./xhr'),
    delay = require('./utils/delay'),
    createError = require('./error').create,
    Response = require('./response'),
    Request = require('./request'),
    extend = require('xtend'),
    once = require('./utils/once');

function factory(defaults, plugins) {
    defaults = defaults || {};
    plugins = plugins || [];

    function http(req, cb) {
        var xhr, plugin, done, k, timeoutId;

        req = new Request(extend(defaults, req));

        for (i = 0; i < plugins.length; i++) {
            plugin = plugins[i];
            if (plugin.processRequest) {
                plugin.processRequest(req);
            }
        }

        // Give the plugins a chance to create the XHR object
        for (i = 0; i < plugins.length; i++) {
            plugin = plugins[i];
            if (plugin.createXHR) {
                xhr = plugin.createXHR(req);
                break; // First come, first serve
            }
        }
        xhr = xhr || new XHR();

        req.xhr = xhr;

        // Because XHR can be an XMLHttpRequest or an XDomainRequest, we add
        // `onreadystatechange`, `onload`, and `onerror` callbacks. We use the
        // `once` util to make sure that only one is called (and it's only called
        // one time).
        done = once(delay(function (err) {
            clearTimeout(timeoutId);
            xhr.onload = xhr.onerror = xhr.onreadystatechange = xhr.ontimeout = xhr.onprogress = null;
            var res = err && err.isHttpError ? err : new Response(req);
            for (i = 0; i < plugins.length; i++) {
                plugin = plugins[i];
                if (plugin.processResponse) {
                    plugin.processResponse(res);
                }
            }
            if (err) {
                if (req.onerror) {
                    req.onerror(err);
                }
            } else {
                if (req.onload) {
                    req.onload(res);
                }
            }
            if (cb) {
                cb(err, res);
            }
        }));

        // When the request completes, continue.
        xhr.onreadystatechange = function () {
            if (req.timedOut) return;

            if (req.aborted) {
                done(createError('Request aborted', req, {name: 'Abort'}));
            } else if (xhr.readyState === 4) {
                var type = Math.floor(xhr.status / 100);
                if (type === 2) {
                    done();
                } else if (xhr.status === 404 && !req.errorOn404) {
                    done();
                } else {
                    var kind;
                    switch (type) {
                        case 4:
                            kind = 'Client';
                            break;
                        case 5:
                            kind = 'Server';
                            break;
                        default:
                            kind = 'HTTP';
                    }
                    var msg = kind + ' Error: ' +
                              'The server returned a status of ' + xhr.status +
                              ' for the request "' +
                              req.method.toUpperCase() + ' ' + req.url + '"';
                    done(createError(msg, req));
                }
            }
        };

        // `onload` is only called on success and, in IE, will be called without
        // `xhr.status` having been set, so we don't check it.
        xhr.onload = function () { done(); };

        xhr.onerror = function () {
            done(createError('Internal XHR Error', req));
        };

        // IE sometimes fails if you don't specify every handler.
        // See http://social.msdn.microsoft.com/Forums/ie/en-US/30ef3add-767c-4436-b8a9-f1ca19b4812e/ie9-rtm-xdomainrequest-issued-requests-may-abort-if-all-event-handlers-not-specified?forum=iewebdevelopment
        xhr.ontimeout = function () { /* noop */ };
        xhr.onprogress = function () { /* noop */ };

        xhr.open(req.method, req.url);

        if (req.timeout) {
            // If we use the normal XHR timeout mechanism (`xhr.timeout` and
            // `xhr.ontimeout`), `onreadystatechange` will be triggered before
            // `ontimeout`. There's no way to recognize that it was triggered by
            // a timeout, and we'd be unable to dispatch the right error.
            timeoutId = setTimeout(function () {
                req.timedOut = true;
                done(createError('Request timeout', req, {name: 'Timeout'}));
                try {
                    xhr.abort();
                } catch (err) {}
            }, req.timeout);
        }

        for (k in req.headers) {
            if (req.headers.hasOwnProperty(k)) {
                xhr.setRequestHeader(k, req.headers[k]);
            }
        }

        xhr.send(req.body);

        return req;
    }

    var method,
        methods = ['get', 'post', 'put', 'head', 'patch', 'delete'],
        verb = function (method) {
            return function (req, cb) {
                req = new Request(req);
                req.method = method;
                return http(req, cb);
            };
        };
    for (i = 0; i < methods.length; i++) {
        method = methods[i];
        http[method] = verb(method);
    }

    http.plugins = function () {
        return plugins;
    };

    http.defaults = function (newValues) {
        if (newValues) {
            return factory(extend(defaults, newValues), plugins);
        }
        return defaults;
    };

    http.use = function () {
        var newPlugins = Array.prototype.slice.call(arguments, 0);
        return factory(defaults, plugins.concat(newPlugins));
    };

    http.bare = function () {
        return factory();
    };

    http.Request = Request;
    http.Response = Response;

    return http;
}

module.exports = factory({}, [cleanURL]);

},{"../plugins/cleanurl":14,"./error":6,"./request":8,"./response":9,"./utils/delay":10,"./utils/once":11,"./xhr":12,"xtend":13}],8:[function(require,module,exports){
'use strict';

function Request(optsOrUrl) {
    var opts = typeof optsOrUrl === 'string' ? {url: optsOrUrl} : optsOrUrl || {};
    this.method = opts.method ? opts.method.toUpperCase() : 'GET';
    this.url = opts.url;
    this.headers = opts.headers || {};
    this.body = opts.body;
    this.timeout = opts.timeout || 0;
    this.errorOn404 = opts.errorOn404 != null ? opts.errorOn404 : true;
    this.onload = opts.onload;
    this.onerror = opts.onerror;
}

Request.prototype.abort = function () {
    if (this.aborted) return;
    this.aborted = true;
    this.xhr.abort();
    return this;
};

Request.prototype.header = function (name, value) {
    var k;
    for (k in this.headers) {
        if (this.headers.hasOwnProperty(k)) {
            if (name.toLowerCase() === k.toLowerCase()) {
                if (arguments.length === 1) {
                    return this.headers[k];
                }

                delete this.headers[k];
                break;
            }
        }
    }
    if (value != null) {
        this.headers[name] = value;
        return value;
    }
};


module.exports = Request;

},{}],9:[function(require,module,exports){
'use strict';

var Request = require('./request');


function Response(req) {
    var i, lines, m,
        xhr = req.xhr;
    this.request = req;
    this.xhr = xhr;
    this.headers = {};

    // Browsers don't like you trying to read XHR properties when you abort the
    // request, so we don't.
    if (req.aborted || req.timedOut) return;

    this.status = xhr.status || 0;
    this.text = xhr.responseText;
    this.body = xhr.response || xhr.responseText;
    this.contentType = xhr.contentType || (xhr.getResponseHeader && xhr.getResponseHeader('Content-Type'));

    if (xhr.getAllResponseHeaders) {
        lines = xhr.getAllResponseHeaders().split('\n');
        for (i = 0; i < lines.length; i++) {
            if ((m = lines[i].match(/\s*([^\s]+):\s+([^\s]+)/))) {
                this.headers[m[1]] = m[2];
            }
        }
    }

    this.isHttpError = this.status >= 400;
}

Response.prototype.header = Request.prototype.header;


module.exports = Response;

},{"./request":8}],10:[function(require,module,exports){
'use strict';

// Wrap a function in a `setTimeout` call. This is used to guarantee async
// behavior, which can avoid unexpected errors.

module.exports = function (fn) {
    return function () {
        var
            args = Array.prototype.slice.call(arguments, 0),
            newFunc = function () {
                return fn.apply(null, args);
            };
        setTimeout(newFunc, 0);
    };
};

},{}],11:[function(require,module,exports){
'use strict';

// A "once" utility.
module.exports = function (fn) {
    var result, called = false;
    return function () {
        if (!called) {
            called = true;
            result = fn.apply(this, arguments);
        }
        return result;
    };
};

},{}],12:[function(require,module,exports){
module.exports = window.XMLHttpRequest;

},{}],13:[function(require,module,exports){
module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],14:[function(require,module,exports){
'use strict';

module.exports = {
    processRequest: function (req) {
        req.url = req.url.replace(/[^%]+/g, function (s) {
            return encodeURI(s);
        });
    }
};

},{}],15:[function(require,module,exports){
'use strict';

var jsonrequest = require('./jsonrequest'),
    jsonresponse = require('./jsonresponse');

module.exports = {
    processRequest: function (req) {
        jsonrequest.processRequest.call(this, req);
        jsonresponse.processRequest.call(this, req);
    },
    processResponse: function (res) {
        jsonresponse.processResponse.call(this, res);
    }
};

},{"./jsonrequest":16,"./jsonresponse":17}],16:[function(require,module,exports){
'use strict';

module.exports = {
    processRequest: function (req) {
        var
            contentType = req.header('Content-Type'),
            hasJsonContentType = contentType &&
                                 contentType.indexOf('application/json') !== -1;

        if (contentType != null && !hasJsonContentType) {
            return;
        }

        if (req.body) {
            if (!contentType) {
                req.header('Content-Type', 'application/json');
            }

            req.body = JSON.stringify(req.body);
        }
    }
};

},{}],17:[function(require,module,exports){
'use strict';

module.exports = {
    processRequest: function (req) {
        var accept = req.header('Accept');
        if (accept == null) {
            req.header('Accept', 'application/json');
        }
    },
    processResponse: function (res) {
        // Check to see if the contentype is "something/json" or
        // "something/somethingelse+json"
        if (res.contentType && /^.*\/(?:.*\+)?json(;|$)/i.test(res.contentType)) {
            var raw = typeof res.body === 'string' ? res.body : res.text;
            if (raw) {
                res.body = JSON.parse(raw);
            }
        }
    }
};

},{}],18:[function(require,module,exports){
var http = require("httpplease");
var promises = require('httpplease-promises');
var Promise = require('es6-promise').Promise;
var json = require("httpplease/plugins/json");
jsonHttp = http.use(json).use(promises(Promise));
http = http.use(promises(Promise));

var cttvApi = function () {
    // prefixes
    var prefix = "https://beta.targetvalidation.org/api/latest/";
    var prefixFilterby = "filterby?";
    var prefixAssociations = "association?";
    var prefixSearch = "search?";
    var prefixGene = "gene/";
    var prefixDisease = "disease/"; // updated from "efo" to "disease"
    var prefixToken = "auth/request_token?";
    var prefixAutocomplete = "autocomplete?";
    var prefixQuickSearch = "quicksearch?";
    var prefixExpression = "expression?";
    var prefixProxy = "proxy/generic/";
    var prefixTarget = "target/"; // this replaces prefixGene

    var credentials = {
        token : "",
        appname : "",
        secret : ""
    };

    var onError = function (err) {
        console.log(err);
    };

    var getToken = function () {
        var tokenUrl = _.url.requestToken(credentials);
        //console.log("TOKEN URL: " + tokenUrl);
        return jsonHttp.get({
            "url": tokenUrl
        });
    };

    var _ = {};
    _.call = function (myurl, callback, data) {
        // No auth
        if ((!credentials.token) && (!credentials.appname) && (!credentials.secret)) {
            console.log("    CttvApi running in non-authentication mode");
            if (data){ // post
                return jsonHttp.post({
                    "url": myurl,
                    "body": data
                });
            }
            return jsonHttp.get({
                "url" : myurl
            }, callback);
        }
        if (!credentials.token) {
            //		    console.log("No credential token, requesting one...");

            return getToken()
                .then(function (resp) {
                    //console.log("   ======>> Got a new token: " + resp.body.token);
                    //credentials.token = resp.body.token;
                    var headers = {
                        "Auth-token": resp.body.token
                    };
                    var myPromise;
                    if (data) { // post
                        myPromise = jsonHttp.post ({
                            "url": myurl,
                            "headers": headers,
                            "body": data
                        });
                    } else { // get
                        myPromise = jsonHttp.get ({
                            "url": myurl,
                            "headers": headers
                        }, callback).catch(onError);

                    }
                    return myPromise;

                });
        } else {
            //		    console.log("Current token is: " + credentials.token);
            return jsonHttp.get({
                "url" : myurl,
                "headers": {
                    "Auth-token": credentials.token
                }
            }, callback).catch(function (err) {
                // Logic to deal with expired tokens
                // console.log("     --- Received an api error -- Possibly the token has expired, so I'll request a new one");
                onError(err);
                credentials.token = "";
                return _.call(myurl, callback, data);
            });
        }
    };

    _.onError = function (cbak) {
        if (!arguments.length) {
            return onError;
        }
        onError = cbak;
        return this;
    };

    // Credentials API
    _.appname = function (name) {
        if (!arguments.length) {
            return credentials.appname;
        }
        credentials.appname = name;
        return this;
    };

    _.secret = function (sec) {
        if (!arguments.length) {
            return credentials.secret;
        }
        credentials.secret = sec;
        return this;
    };

    _.token = function (tok) {
        if (!arguments.length) {
            return credentials.token;
        }
        credentials.token = tok;
        return this;
    };

    // getter / setter for REST api prefix (TODO: Call it domain?)
    _.prefix = function (dom) {
        if (!arguments.length) {
            return prefix;
        }
        prefix = dom;
        return this;
    };

    // URL object
    _.url = {};

    _.url.gene = function (obj) {
        return prefix + prefixGene + obj.gene_id;
    };

    _.url.target = function (obj) {
        return prefix + prefixTarget + obj.target_id;
    };

    _.url.disease = function (obj) {
        return prefix + prefixDisease + obj.code;
    };

    _.url.search = function (obj) {
        return prefix + prefixSearch + parseUrlParams(obj);
    };

    _.url.associations = function (obj) {
        return prefix + prefixAssociations + parseUrlParams(obj);
    };


    _.url.filterby = function (obj) {
        return prefix + prefixFilterby + parseUrlParams(obj);
    };


    _.url.requestToken = function (obj) {
        return prefix + prefixToken + "appname=" + obj.appname + "&secret=" + obj.secret;
    };

    _.url.autocomplete = function (obj) {
        return prefix + prefixAutocomplete + parseUrlParams(obj);
    };

    _.url.quickSearch = function (obj) {
        return prefix + prefixQuickSearch + parseUrlParams(obj);
    };

    _.url.expression = function (obj) {
        return prefix + prefixExpression + parseUrlParams(obj);
    };

    _.url.proxy = function (obj) {
        return prefix + prefixProxy + obj.url;
    };



    /**
    * This takes a params object and returns the params concatenated in a string.
    * If a parameter is an array, it adds each item, all with hte same key.
    * Example:
    *   obj = {q:'braf',size:20,filters:['id','pvalue']};
    *   console.log( parseUrlParams(obj) );
    *   // prints "q=braf&size=20&filters=id&filters=pvalue"
    */
    var parseUrlParams = function(obj){
        var opts = [];
        for(var i in obj){
            if( obj.hasOwnProperty(i)){
                if(obj[i].constructor === Array){
                    opts.push(i+"="+(obj[i].join("&"+i+"=")));
                } else {
                    opts.push(i+"="+obj[i]);
                }
            }
        }
        return opts.join("&");
    };


    return _;
};

module.exports = cttvApi;

},{"es6-promise":4,"httpplease":7,"httpplease-promises":5,"httpplease/plugins/json":15}],19:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],20:[function(require,module,exports){
(function (process,global){
/*!
 * @overview RSVP - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/tildeio/rsvp.js/master/LICENSE
 * @version   3.1.0
 */

(function() {
    "use strict";
    function lib$rsvp$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$rsvp$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$rsvp$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$rsvp$utils$$_isArray;
    if (!Array.isArray) {
      lib$rsvp$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$rsvp$utils$$_isArray = Array.isArray;
    }

    var lib$rsvp$utils$$isArray = lib$rsvp$utils$$_isArray;

    var lib$rsvp$utils$$now = Date.now || function() { return new Date().getTime(); };

    function lib$rsvp$utils$$F() { }

    var lib$rsvp$utils$$o_create = (Object.create || function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      lib$rsvp$utils$$F.prototype = o;
      return new lib$rsvp$utils$$F();
    });
    function lib$rsvp$events$$indexOf(callbacks, callback) {
      for (var i=0, l=callbacks.length; i<l; i++) {
        if (callbacks[i] === callback) { return i; }
      }

      return -1;
    }

    function lib$rsvp$events$$callbacksFor(object) {
      var callbacks = object._promiseCallbacks;

      if (!callbacks) {
        callbacks = object._promiseCallbacks = {};
      }

      return callbacks;
    }

    var lib$rsvp$events$$default = {

      /**
        `RSVP.EventTarget.mixin` extends an object with EventTarget methods. For
        Example:

        ```javascript
        var object = {};

        RSVP.EventTarget.mixin(object);

        object.on('finished', function(event) {
          // handle event
        });

        object.trigger('finished', { detail: value });
        ```

        `EventTarget.mixin` also works with prototypes:

        ```javascript
        var Person = function() {};
        RSVP.EventTarget.mixin(Person.prototype);

        var yehuda = new Person();
        var tom = new Person();

        yehuda.on('poke', function(event) {
          console.log('Yehuda says OW');
        });

        tom.on('poke', function(event) {
          console.log('Tom says OW');
        });

        yehuda.trigger('poke');
        tom.trigger('poke');
        ```

        @method mixin
        @for RSVP.EventTarget
        @private
        @param {Object} object object to extend with EventTarget methods
      */
      'mixin': function(object) {
        object['on']      = this['on'];
        object['off']     = this['off'];
        object['trigger'] = this['trigger'];
        object._promiseCallbacks = undefined;
        return object;
      },

      /**
        Registers a callback to be executed when `eventName` is triggered

        ```javascript
        object.on('event', function(eventInfo){
          // handle the event
        });

        object.trigger('event');
        ```

        @method on
        @for RSVP.EventTarget
        @private
        @param {String} eventName name of the event to listen for
        @param {Function} callback function to be called when the event is triggered.
      */
      'on': function(eventName, callback) {
        if (typeof callback !== 'function') {
          throw new TypeError('Callback must be a function');
        }

        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks;

        callbacks = allCallbacks[eventName];

        if (!callbacks) {
          callbacks = allCallbacks[eventName] = [];
        }

        if (lib$rsvp$events$$indexOf(callbacks, callback) === -1) {
          callbacks.push(callback);
        }
      },

      /**
        You can use `off` to stop firing a particular callback for an event:

        ```javascript
        function doStuff() { // do stuff! }
        object.on('stuff', doStuff);

        object.trigger('stuff'); // doStuff will be called

        // Unregister ONLY the doStuff callback
        object.off('stuff', doStuff);
        object.trigger('stuff'); // doStuff will NOT be called
        ```

        If you don't pass a `callback` argument to `off`, ALL callbacks for the
        event will not be executed when the event fires. For example:

        ```javascript
        var callback1 = function(){};
        var callback2 = function(){};

        object.on('stuff', callback1);
        object.on('stuff', callback2);

        object.trigger('stuff'); // callback1 and callback2 will be executed.

        object.off('stuff');
        object.trigger('stuff'); // callback1 and callback2 will not be executed!
        ```

        @method off
        @for RSVP.EventTarget
        @private
        @param {String} eventName event to stop listening to
        @param {Function} callback optional argument. If given, only the function
        given will be removed from the event's callback queue. If no `callback`
        argument is given, all callbacks will be removed from the event's callback
        queue.
      */
      'off': function(eventName, callback) {
        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks, index;

        if (!callback) {
          allCallbacks[eventName] = [];
          return;
        }

        callbacks = allCallbacks[eventName];

        index = lib$rsvp$events$$indexOf(callbacks, callback);

        if (index !== -1) { callbacks.splice(index, 1); }
      },

      /**
        Use `trigger` to fire custom events. For example:

        ```javascript
        object.on('foo', function(){
          console.log('foo event happened!');
        });
        object.trigger('foo');
        // 'foo event happened!' logged to the console
        ```

        You can also pass a value as a second argument to `trigger` that will be
        passed as an argument to all event listeners for the event:

        ```javascript
        object.on('foo', function(value){
          console.log(value.name);
        });

        object.trigger('foo', { name: 'bar' });
        // 'bar' logged to the console
        ```

        @method trigger
        @for RSVP.EventTarget
        @private
        @param {String} eventName name of the event to be triggered
        @param {*} options optional value to be passed to any event handlers for
        the given `eventName`
      */
      'trigger': function(eventName, options, label) {
        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks, callback;

        if (callbacks = allCallbacks[eventName]) {
          // Don't cache the callbacks.length since it may grow
          for (var i=0; i<callbacks.length; i++) {
            callback = callbacks[i];

            callback(options, label);
          }
        }
      }
    };

    var lib$rsvp$config$$config = {
      instrument: false
    };

    lib$rsvp$events$$default['mixin'](lib$rsvp$config$$config);

    function lib$rsvp$config$$configure(name, value) {
      if (name === 'onerror') {
        // handle for legacy users that expect the actual
        // error to be passed to their function added via
        // `RSVP.configure('onerror', someFunctionHere);`
        lib$rsvp$config$$config['on']('error', value);
        return;
      }

      if (arguments.length === 2) {
        lib$rsvp$config$$config[name] = value;
      } else {
        return lib$rsvp$config$$config[name];
      }
    }

    var lib$rsvp$instrument$$queue = [];

    function lib$rsvp$instrument$$scheduleFlush() {
      setTimeout(function() {
        var entry;
        for (var i = 0; i < lib$rsvp$instrument$$queue.length; i++) {
          entry = lib$rsvp$instrument$$queue[i];

          var payload = entry.payload;

          payload.guid = payload.key + payload.id;
          payload.childGuid = payload.key + payload.childId;
          if (payload.error) {
            payload.stack = payload.error.stack;
          }

          lib$rsvp$config$$config['trigger'](entry.name, entry.payload);
        }
        lib$rsvp$instrument$$queue.length = 0;
      }, 50);
    }

    function lib$rsvp$instrument$$instrument(eventName, promise, child) {
      if (1 === lib$rsvp$instrument$$queue.push({
        name: eventName,
        payload: {
          key: promise._guidKey,
          id:  promise._id,
          eventName: eventName,
          detail: promise._result,
          childId: child && child._id,
          label: promise._label,
          timeStamp: lib$rsvp$utils$$now(),
          error: lib$rsvp$config$$config["instrument-with-stack"] ? new Error(promise._label) : null
        }})) {
          lib$rsvp$instrument$$scheduleFlush();
        }
      }
    var lib$rsvp$instrument$$default = lib$rsvp$instrument$$instrument;

    function  lib$rsvp$$internal$$withOwnPromise() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$rsvp$$internal$$noop() {}

    var lib$rsvp$$internal$$PENDING   = void 0;
    var lib$rsvp$$internal$$FULFILLED = 1;
    var lib$rsvp$$internal$$REJECTED  = 2;

    var lib$rsvp$$internal$$GET_THEN_ERROR = new lib$rsvp$$internal$$ErrorObject();

    function lib$rsvp$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$rsvp$$internal$$GET_THEN_ERROR.error = error;
        return lib$rsvp$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$rsvp$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$rsvp$$internal$$handleForeignThenable(promise, thenable, then) {
      lib$rsvp$config$$config.async(function(promise) {
        var sealed = false;
        var error = lib$rsvp$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$rsvp$$internal$$resolve(promise, value);
          } else {
            lib$rsvp$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$rsvp$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$rsvp$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$rsvp$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$rsvp$$internal$$FULFILLED) {
        lib$rsvp$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$rsvp$$internal$$REJECTED) {
        thenable._onError = null;
        lib$rsvp$$internal$$reject(promise, thenable._result);
      } else {
        lib$rsvp$$internal$$subscribe(thenable, undefined, function(value) {
          if (thenable !== value) {
            lib$rsvp$$internal$$resolve(promise, value);
          } else {
            lib$rsvp$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          lib$rsvp$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$rsvp$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$rsvp$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$rsvp$$internal$$getThen(maybeThenable);

        if (then === lib$rsvp$$internal$$GET_THEN_ERROR) {
          lib$rsvp$$internal$$reject(promise, lib$rsvp$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$rsvp$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$rsvp$utils$$isFunction(then)) {
          lib$rsvp$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$rsvp$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$rsvp$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$rsvp$$internal$$fulfill(promise, value);
      } else if (lib$rsvp$utils$$objectOrFunction(value)) {
        lib$rsvp$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$rsvp$$internal$$fulfill(promise, value);
      }
    }

    function lib$rsvp$$internal$$publishRejection(promise) {
      if (promise._onError) {
        promise._onError(promise._result);
      }

      lib$rsvp$$internal$$publish(promise);
    }

    function lib$rsvp$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$rsvp$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$rsvp$$internal$$FULFILLED;

      if (promise._subscribers.length === 0) {
        if (lib$rsvp$config$$config.instrument) {
          lib$rsvp$instrument$$default('fulfilled', promise);
        }
      } else {
        lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish, promise);
      }
    }

    function lib$rsvp$$internal$$reject(promise, reason) {
      if (promise._state !== lib$rsvp$$internal$$PENDING) { return; }
      promise._state = lib$rsvp$$internal$$REJECTED;
      promise._result = reason;
      lib$rsvp$config$$config.async(lib$rsvp$$internal$$publishRejection, promise);
    }

    function lib$rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onError = null;

      subscribers[length] = child;
      subscribers[length + lib$rsvp$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$rsvp$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish, parent);
      }
    }

    function lib$rsvp$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (lib$rsvp$config$$config.instrument) {
        lib$rsvp$instrument$$default(settled === lib$rsvp$$internal$$FULFILLED ? 'fulfilled' : 'rejected', promise);
      }

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$rsvp$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$rsvp$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$rsvp$$internal$$TRY_CATCH_ERROR = new lib$rsvp$$internal$$ErrorObject();

    function lib$rsvp$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$rsvp$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$rsvp$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$rsvp$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$rsvp$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$rsvp$$internal$$tryCatch(callback, detail);

        if (value === lib$rsvp$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$rsvp$$internal$$reject(promise, lib$rsvp$$internal$$withOwnPromise());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$rsvp$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$rsvp$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$rsvp$$internal$$reject(promise, error);
      } else if (settled === lib$rsvp$$internal$$FULFILLED) {
        lib$rsvp$$internal$$fulfill(promise, value);
      } else if (settled === lib$rsvp$$internal$$REJECTED) {
        lib$rsvp$$internal$$reject(promise, value);
      }
    }

    function lib$rsvp$$internal$$initializePromise(promise, resolver) {
      var resolved = false;
      try {
        resolver(function resolvePromise(value){
          if (resolved) { return; }
          resolved = true;
          lib$rsvp$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          if (resolved) { return; }
          resolved = true;
          lib$rsvp$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$rsvp$$internal$$reject(promise, e);
      }
    }

    function lib$rsvp$enumerator$$makeSettledResult(state, position, value) {
      if (state === lib$rsvp$$internal$$FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
         return {
          state: 'rejected',
          reason: value
        };
      }
    }

    function lib$rsvp$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$rsvp$$internal$$noop, label);
      enumerator._abortOnReject = abortOnReject;

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$rsvp$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$rsvp$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$rsvp$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    var lib$rsvp$enumerator$$default = lib$rsvp$enumerator$$Enumerator;

    lib$rsvp$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$rsvp$utils$$isArray(input);
    };

    lib$rsvp$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$rsvp$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    lib$rsvp$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;
      var length     = enumerator.length;
      var promise    = enumerator.promise;
      var input      = enumerator._input;

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;
      if (lib$rsvp$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$rsvp$$internal$$PENDING) {
          entry._onError = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = enumerator._makeResult(lib$rsvp$$internal$$FULFILLED, i, entry);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$rsvp$$internal$$PENDING) {
        enumerator._remaining--;

        if (enumerator._abortOnReject && state === lib$rsvp$$internal$$REJECTED) {
          lib$rsvp$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = enumerator._makeResult(state, i, value);
        }
      }

      if (enumerator._remaining === 0) {
        lib$rsvp$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };

    lib$rsvp$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$rsvp$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$rsvp$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$rsvp$$internal$$REJECTED, i, reason);
      });
    };
    function lib$rsvp$promise$all$$all(entries, label) {
      return new lib$rsvp$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
    }
    var lib$rsvp$promise$all$$default = lib$rsvp$promise$all$$all;
    function lib$rsvp$promise$race$$race(entries, label) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$rsvp$$internal$$noop, label);

      if (!lib$rsvp$utils$$isArray(entries)) {
        lib$rsvp$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$rsvp$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$rsvp$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        lib$rsvp$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$rsvp$promise$race$$default = lib$rsvp$promise$race$$race;
    function lib$rsvp$promise$resolve$$resolve(object, label) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$rsvp$$internal$$noop, label);
      lib$rsvp$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$rsvp$promise$resolve$$default = lib$rsvp$promise$resolve$$resolve;
    function lib$rsvp$promise$reject$$reject(reason, label) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$rsvp$$internal$$noop, label);
      lib$rsvp$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$rsvp$promise$reject$$default = lib$rsvp$promise$reject$$reject;

    var lib$rsvp$promise$$guidKey = 'rsvp_' + lib$rsvp$utils$$now() + '-';
    var lib$rsvp$promise$$counter = 0;

    function lib$rsvp$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$rsvp$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    function lib$rsvp$promise$$Promise(resolver, label) {
      var promise = this;

      promise._id = lib$rsvp$promise$$counter++;
      promise._label = label;
      promise._state = undefined;
      promise._result = undefined;
      promise._subscribers = [];

      if (lib$rsvp$config$$config.instrument) {
        lib$rsvp$instrument$$default('created', promise);
      }

      if (lib$rsvp$$internal$$noop !== resolver) {
        if (!lib$rsvp$utils$$isFunction(resolver)) {
          lib$rsvp$promise$$needsResolver();
        }

        if (!(promise instanceof lib$rsvp$promise$$Promise)) {
          lib$rsvp$promise$$needsNew();
        }

        lib$rsvp$$internal$$initializePromise(promise, resolver);
      }
    }

    var lib$rsvp$promise$$default = lib$rsvp$promise$$Promise;

    // deprecated
    lib$rsvp$promise$$Promise.cast = lib$rsvp$promise$resolve$$default;
    lib$rsvp$promise$$Promise.all = lib$rsvp$promise$all$$default;
    lib$rsvp$promise$$Promise.race = lib$rsvp$promise$race$$default;
    lib$rsvp$promise$$Promise.resolve = lib$rsvp$promise$resolve$$default;
    lib$rsvp$promise$$Promise.reject = lib$rsvp$promise$reject$$default;

    lib$rsvp$promise$$Promise.prototype = {
      constructor: lib$rsvp$promise$$Promise,

      _guidKey: lib$rsvp$promise$$guidKey,

      _onError: function (reason) {
        var promise = this;
        lib$rsvp$config$$config.after(function() {
          if (promise._onError) {
            lib$rsvp$config$$config['trigger']('error', reason, promise._label);
          }
        });
      },

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfillment
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection, label) {
        var parent = this;
        var state = parent._state;

        if (state === lib$rsvp$$internal$$FULFILLED && !onFulfillment || state === lib$rsvp$$internal$$REJECTED && !onRejection) {
          if (lib$rsvp$config$$config.instrument) {
            lib$rsvp$instrument$$default('chained', parent, parent);
          }
          return parent;
        }

        parent._onError = null;

        var child = new parent.constructor(lib$rsvp$$internal$$noop, label);
        var result = parent._result;

        if (lib$rsvp$config$$config.instrument) {
          lib$rsvp$instrument$$default('chained', parent, child);
        }

        if (state) {
          var callback = arguments[state - 1];
          lib$rsvp$config$$config.async(function(){
            lib$rsvp$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection, label) {
        return this.then(undefined, onRejection, label);
      },

    /**
      `finally` will be invoked regardless of the promise's fate just as native
      try/catch/finally behaves

      Synchronous example:

      ```js
      findAuthor() {
        if (Math.random() > 0.5) {
          throw new Error();
        }
        return new Author();
      }

      try {
        return findAuthor(); // succeed or fail
      } catch(error) {
        return findOtherAuther();
      } finally {
        // always runs
        // doesn't affect the return value
      }
      ```

      Asynchronous example:

      ```js
      findAuthor().catch(function(reason){
        return findOtherAuther();
      }).finally(function(){
        // author was either found, or not
      });
      ```

      @method finally
      @param {Function} callback
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'finally': function(callback, label) {
        var promise = this;
        var constructor = promise.constructor;

        return promise.then(function(value) {
          return constructor.resolve(callback()).then(function(){
            return value;
          });
        }, function(reason) {
          return constructor.resolve(callback()).then(function(){
            throw reason;
          });
        }, label);
      }
    };

    function lib$rsvp$all$settled$$AllSettled(Constructor, entries, label) {
      this._superConstructor(Constructor, entries, false /* don't abort on reject */, label);
    }

    lib$rsvp$all$settled$$AllSettled.prototype = lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);
    lib$rsvp$all$settled$$AllSettled.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$all$settled$$AllSettled.prototype._makeResult = lib$rsvp$enumerator$$makeSettledResult;
    lib$rsvp$all$settled$$AllSettled.prototype._validationError = function() {
      return new Error('allSettled must be called with an array');
    };

    function lib$rsvp$all$settled$$allSettled(entries, label) {
      return new lib$rsvp$all$settled$$AllSettled(lib$rsvp$promise$$default, entries, label).promise;
    }
    var lib$rsvp$all$settled$$default = lib$rsvp$all$settled$$allSettled;
    function lib$rsvp$all$$all(array, label) {
      return lib$rsvp$promise$$default.all(array, label);
    }
    var lib$rsvp$all$$default = lib$rsvp$all$$all;
    var lib$rsvp$asap$$len = 0;
    var lib$rsvp$asap$$toString = {}.toString;
    var lib$rsvp$asap$$vertxNext;
    function lib$rsvp$asap$$asap(callback, arg) {
      lib$rsvp$asap$$queue[lib$rsvp$asap$$len] = callback;
      lib$rsvp$asap$$queue[lib$rsvp$asap$$len + 1] = arg;
      lib$rsvp$asap$$len += 2;
      if (lib$rsvp$asap$$len === 2) {
        // If len is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        lib$rsvp$asap$$scheduleFlush();
      }
    }

    var lib$rsvp$asap$$default = lib$rsvp$asap$$asap;

    var lib$rsvp$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$rsvp$asap$$browserGlobal = lib$rsvp$asap$$browserWindow || {};
    var lib$rsvp$asap$$BrowserMutationObserver = lib$rsvp$asap$$browserGlobal.MutationObserver || lib$rsvp$asap$$browserGlobal.WebKitMutationObserver;
    var lib$rsvp$asap$$isNode = typeof self === 'undefined' &&
      typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$rsvp$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$rsvp$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$rsvp$asap$$flush);
      };
    }

    // vertx
    function lib$rsvp$asap$$useVertxTimer() {
      return function() {
        lib$rsvp$asap$$vertxNext(lib$rsvp$asap$$flush);
      };
    }

    function lib$rsvp$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$rsvp$asap$$BrowserMutationObserver(lib$rsvp$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$rsvp$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$rsvp$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$rsvp$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$rsvp$asap$$flush, 1);
      };
    }

    var lib$rsvp$asap$$queue = new Array(1000);
    function lib$rsvp$asap$$flush() {
      for (var i = 0; i < lib$rsvp$asap$$len; i+=2) {
        var callback = lib$rsvp$asap$$queue[i];
        var arg = lib$rsvp$asap$$queue[i+1];

        callback(arg);

        lib$rsvp$asap$$queue[i] = undefined;
        lib$rsvp$asap$$queue[i+1] = undefined;
      }

      lib$rsvp$asap$$len = 0;
    }

    function lib$rsvp$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$rsvp$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$rsvp$asap$$useVertxTimer();
      } catch(e) {
        return lib$rsvp$asap$$useSetTimeout();
      }
    }

    var lib$rsvp$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$rsvp$asap$$isNode) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useNextTick();
    } else if (lib$rsvp$asap$$BrowserMutationObserver) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useMutationObserver();
    } else if (lib$rsvp$asap$$isWorker) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useMessageChannel();
    } else if (lib$rsvp$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$attemptVertex();
    } else {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useSetTimeout();
    }
    function lib$rsvp$defer$$defer(label) {
      var deferred = {};

      deferred['promise'] = new lib$rsvp$promise$$default(function(resolve, reject) {
        deferred['resolve'] = resolve;
        deferred['reject'] = reject;
      }, label);

      return deferred;
    }
    var lib$rsvp$defer$$default = lib$rsvp$defer$$defer;
    function lib$rsvp$filter$$filter(promises, filterFn, label) {
      return lib$rsvp$promise$$default.all(promises, label).then(function(values) {
        if (!lib$rsvp$utils$$isFunction(filterFn)) {
          throw new TypeError("You must pass a function as filter's second argument.");
        }

        var length = values.length;
        var filtered = new Array(length);

        for (var i = 0; i < length; i++) {
          filtered[i] = filterFn(values[i]);
        }

        return lib$rsvp$promise$$default.all(filtered, label).then(function(filtered) {
          var results = new Array(length);
          var newLength = 0;

          for (var i = 0; i < length; i++) {
            if (filtered[i]) {
              results[newLength] = values[i];
              newLength++;
            }
          }

          results.length = newLength;

          return results;
        });
      });
    }
    var lib$rsvp$filter$$default = lib$rsvp$filter$$filter;

    function lib$rsvp$promise$hash$$PromiseHash(Constructor, object, label) {
      this._superConstructor(Constructor, object, true, label);
    }

    var lib$rsvp$promise$hash$$default = lib$rsvp$promise$hash$$PromiseHash;

    lib$rsvp$promise$hash$$PromiseHash.prototype = lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);
    lib$rsvp$promise$hash$$PromiseHash.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$promise$hash$$PromiseHash.prototype._init = function() {
      this._result = {};
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._validateInput = function(input) {
      return input && typeof input === 'object';
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._validationError = function() {
      return new Error('Promise.hash must be called with an object');
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._enumerate = function() {
      var enumerator = this;
      var promise    = enumerator.promise;
      var input      = enumerator._input;
      var results    = [];

      for (var key in input) {
        if (promise._state === lib$rsvp$$internal$$PENDING && Object.prototype.hasOwnProperty.call(input, key)) {
          results.push({
            position: key,
            entry: input[key]
          });
        }
      }

      var length = results.length;
      enumerator._remaining = length;
      var result;

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        result = results[i];
        enumerator._eachEntry(result.entry, result.position);
      }
    };

    function lib$rsvp$hash$settled$$HashSettled(Constructor, object, label) {
      this._superConstructor(Constructor, object, false, label);
    }

    lib$rsvp$hash$settled$$HashSettled.prototype = lib$rsvp$utils$$o_create(lib$rsvp$promise$hash$$default.prototype);
    lib$rsvp$hash$settled$$HashSettled.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$hash$settled$$HashSettled.prototype._makeResult = lib$rsvp$enumerator$$makeSettledResult;

    lib$rsvp$hash$settled$$HashSettled.prototype._validationError = function() {
      return new Error('hashSettled must be called with an object');
    };

    function lib$rsvp$hash$settled$$hashSettled(object, label) {
      return new lib$rsvp$hash$settled$$HashSettled(lib$rsvp$promise$$default, object, label).promise;
    }
    var lib$rsvp$hash$settled$$default = lib$rsvp$hash$settled$$hashSettled;
    function lib$rsvp$hash$$hash(object, label) {
      return new lib$rsvp$promise$hash$$default(lib$rsvp$promise$$default, object, label).promise;
    }
    var lib$rsvp$hash$$default = lib$rsvp$hash$$hash;
    function lib$rsvp$map$$map(promises, mapFn, label) {
      return lib$rsvp$promise$$default.all(promises, label).then(function(values) {
        if (!lib$rsvp$utils$$isFunction(mapFn)) {
          throw new TypeError("You must pass a function as map's second argument.");
        }

        var length = values.length;
        var results = new Array(length);

        for (var i = 0; i < length; i++) {
          results[i] = mapFn(values[i]);
        }

        return lib$rsvp$promise$$default.all(results, label);
      });
    }
    var lib$rsvp$map$$default = lib$rsvp$map$$map;

    function lib$rsvp$node$$Result() {
      this.value = undefined;
    }

    var lib$rsvp$node$$ERROR = new lib$rsvp$node$$Result();
    var lib$rsvp$node$$GET_THEN_ERROR = new lib$rsvp$node$$Result();

    function lib$rsvp$node$$getThen(obj) {
      try {
       return obj.then;
      } catch(error) {
        lib$rsvp$node$$ERROR.value= error;
        return lib$rsvp$node$$ERROR;
      }
    }


    function lib$rsvp$node$$tryApply(f, s, a) {
      try {
        f.apply(s, a);
      } catch(error) {
        lib$rsvp$node$$ERROR.value = error;
        return lib$rsvp$node$$ERROR;
      }
    }

    function lib$rsvp$node$$makeObject(_, argumentNames) {
      var obj = {};
      var name;
      var i;
      var length = _.length;
      var args = new Array(length);

      for (var x = 0; x < length; x++) {
        args[x] = _[x];
      }

      for (i = 0; i < argumentNames.length; i++) {
        name = argumentNames[i];
        obj[name] = args[i + 1];
      }

      return obj;
    }

    function lib$rsvp$node$$arrayResult(_) {
      var length = _.length;
      var args = new Array(length - 1);

      for (var i = 1; i < length; i++) {
        args[i - 1] = _[i];
      }

      return args;
    }

    function lib$rsvp$node$$wrapThenable(then, promise) {
      return {
        then: function(onFulFillment, onRejection) {
          return then.call(promise, onFulFillment, onRejection);
        }
      };
    }

    function lib$rsvp$node$$denodeify(nodeFunc, options) {
      var fn = function() {
        var self = this;
        var l = arguments.length;
        var args = new Array(l + 1);
        var arg;
        var promiseInput = false;

        for (var i = 0; i < l; ++i) {
          arg = arguments[i];

          if (!promiseInput) {
            // TODO: clean this up
            promiseInput = lib$rsvp$node$$needsPromiseInput(arg);
            if (promiseInput === lib$rsvp$node$$GET_THEN_ERROR) {
              var p = new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);
              lib$rsvp$$internal$$reject(p, lib$rsvp$node$$GET_THEN_ERROR.value);
              return p;
            } else if (promiseInput && promiseInput !== true) {
              arg = lib$rsvp$node$$wrapThenable(promiseInput, arg);
            }
          }
          args[i] = arg;
        }

        var promise = new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);

        args[l] = function(err, val) {
          if (err)
            lib$rsvp$$internal$$reject(promise, err);
          else if (options === undefined)
            lib$rsvp$$internal$$resolve(promise, val);
          else if (options === true)
            lib$rsvp$$internal$$resolve(promise, lib$rsvp$node$$arrayResult(arguments));
          else if (lib$rsvp$utils$$isArray(options))
            lib$rsvp$$internal$$resolve(promise, lib$rsvp$node$$makeObject(arguments, options));
          else
            lib$rsvp$$internal$$resolve(promise, val);
        };

        if (promiseInput) {
          return lib$rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self);
        } else {
          return lib$rsvp$node$$handleValueInput(promise, args, nodeFunc, self);
        }
      };

      fn.__proto__ = nodeFunc;

      return fn;
    }

    var lib$rsvp$node$$default = lib$rsvp$node$$denodeify;

    function lib$rsvp$node$$handleValueInput(promise, args, nodeFunc, self) {
      var result = lib$rsvp$node$$tryApply(nodeFunc, self, args);
      if (result === lib$rsvp$node$$ERROR) {
        lib$rsvp$$internal$$reject(promise, result.value);
      }
      return promise;
    }

    function lib$rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self){
      return lib$rsvp$promise$$default.all(args).then(function(args){
        var result = lib$rsvp$node$$tryApply(nodeFunc, self, args);
        if (result === lib$rsvp$node$$ERROR) {
          lib$rsvp$$internal$$reject(promise, result.value);
        }
        return promise;
      });
    }

    function lib$rsvp$node$$needsPromiseInput(arg) {
      if (arg && typeof arg === 'object') {
        if (arg.constructor === lib$rsvp$promise$$default) {
          return true;
        } else {
          return lib$rsvp$node$$getThen(arg);
        }
      } else {
        return false;
      }
    }
    var lib$rsvp$platform$$platform;

    /* global self */
    if (typeof self === 'object') {
      lib$rsvp$platform$$platform = self;

    /* global global */
    } else if (typeof global === 'object') {
      lib$rsvp$platform$$platform = global;
    } else {
      throw new Error('no global: `self` or `global` found');
    }

    var lib$rsvp$platform$$default = lib$rsvp$platform$$platform;
    function lib$rsvp$race$$race(array, label) {
      return lib$rsvp$promise$$default.race(array, label);
    }
    var lib$rsvp$race$$default = lib$rsvp$race$$race;
    function lib$rsvp$reject$$reject(reason, label) {
      return lib$rsvp$promise$$default.reject(reason, label);
    }
    var lib$rsvp$reject$$default = lib$rsvp$reject$$reject;
    function lib$rsvp$resolve$$resolve(value, label) {
      return lib$rsvp$promise$$default.resolve(value, label);
    }
    var lib$rsvp$resolve$$default = lib$rsvp$resolve$$resolve;
    function lib$rsvp$rethrow$$rethrow(reason) {
      setTimeout(function() {
        throw reason;
      });
      throw reason;
    }
    var lib$rsvp$rethrow$$default = lib$rsvp$rethrow$$rethrow;

    // defaults
    lib$rsvp$config$$config.async = lib$rsvp$asap$$default;
    lib$rsvp$config$$config.after = function(cb) {
      setTimeout(cb, 0);
    };
    var lib$rsvp$$cast = lib$rsvp$resolve$$default;
    function lib$rsvp$$async(callback, arg) {
      lib$rsvp$config$$config.async(callback, arg);
    }

    function lib$rsvp$$on() {
      lib$rsvp$config$$config['on'].apply(lib$rsvp$config$$config, arguments);
    }

    function lib$rsvp$$off() {
      lib$rsvp$config$$config['off'].apply(lib$rsvp$config$$config, arguments);
    }

    // Set up instrumentation through `window.__PROMISE_INTRUMENTATION__`
    if (typeof window !== 'undefined' && typeof window['__PROMISE_INSTRUMENTATION__'] === 'object') {
      var lib$rsvp$$callbacks = window['__PROMISE_INSTRUMENTATION__'];
      lib$rsvp$config$$configure('instrument', true);
      for (var lib$rsvp$$eventName in lib$rsvp$$callbacks) {
        if (lib$rsvp$$callbacks.hasOwnProperty(lib$rsvp$$eventName)) {
          lib$rsvp$$on(lib$rsvp$$eventName, lib$rsvp$$callbacks[lib$rsvp$$eventName]);
        }
      }
    }

    var lib$rsvp$umd$$RSVP = {
      'race': lib$rsvp$race$$default,
      'Promise': lib$rsvp$promise$$default,
      'allSettled': lib$rsvp$all$settled$$default,
      'hash': lib$rsvp$hash$$default,
      'hashSettled': lib$rsvp$hash$settled$$default,
      'denodeify': lib$rsvp$node$$default,
      'on': lib$rsvp$$on,
      'off': lib$rsvp$$off,
      'map': lib$rsvp$map$$default,
      'filter': lib$rsvp$filter$$default,
      'resolve': lib$rsvp$resolve$$default,
      'reject': lib$rsvp$reject$$default,
      'all': lib$rsvp$all$$default,
      'rethrow': lib$rsvp$rethrow$$default,
      'defer': lib$rsvp$defer$$default,
      'EventTarget': lib$rsvp$events$$default,
      'configure': lib$rsvp$config$$configure,
      'async': lib$rsvp$$async
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$rsvp$umd$$RSVP; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$rsvp$umd$$RSVP;
    } else if (typeof lib$rsvp$platform$$default !== 'undefined') {
      lib$rsvp$platform$$default['RSVP'] = lib$rsvp$umd$$RSVP;
    }
}).call(this);


}).call(this,require("IrXUsu"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"IrXUsu":19}],21:[function(require,module,exports){
module.exports = require("./src/api.js");

},{"./src/api.js":22}],22:[function(require,module,exports){
var api = function (who) {

    var _methods = function () {
	var m = [];

	m.add_batch = function (obj) {
	    m.unshift(obj);
	};

	m.update = function (method, value) {
	    for (var i=0; i<m.length; i++) {
		for (var p in m[i]) {
		    if (p === method) {
			m[i][p] = value;
			return true;
		    }
		}
	    }
	    return false;
	};

	m.add = function (method, value) {
	    if (m.update (method, value) ) {
	    } else {
		var reg = {};
		reg[method] = value;
		m.add_batch (reg);
	    }
	};

	m.get = function (method) {
	    for (var i=0; i<m.length; i++) {
		for (var p in m[i]) {
		    if (p === method) {
			return m[i][p];
		    }
		}
	    }
	};

	return m;
    };

    var methods    = _methods();
    var api = function () {};

    api.check = function (method, check, msg) {
	if (method instanceof Array) {
	    for (var i=0; i<method.length; i++) {
		api.check(method[i], check, msg);
	    }
	    return;
	}

	if (typeof (method) === 'function') {
	    method.check(check, msg);
	} else {
	    who[method].check(check, msg);
	}
	return api;
    };

    api.transform = function (method, cbak) {
	if (method instanceof Array) {
	    for (var i=0; i<method.length; i++) {
		api.transform (method[i], cbak);
	    }
	    return;
	}

	if (typeof (method) === 'function') {
	    method.transform (cbak);
	} else {
	    who[method].transform(cbak);
	}
	return api;
    };

    var attach_method = function (method, opts) {
	var checks = [];
	var transforms = [];

	var getter = opts.on_getter || function () {
	    return methods.get(method);
	};

	var setter = opts.on_setter || function (x) {
	    for (var i=0; i<transforms.length; i++) {
		x = transforms[i](x);
	    }

	    for (var j=0; j<checks.length; j++) {
		if (!checks[j].check(x)) {
		    var msg = checks[j].msg || 
			("Value " + x + " doesn't seem to be valid for this method");
		    throw (msg);
		}
	    }
	    methods.add(method, x);
	};

	var new_method = function (new_val) {
	    if (!arguments.length) {
		return getter();
	    }
	    setter(new_val);
	    return who; // Return this?
	};
	new_method.check = function (cbak, msg) {
	    if (!arguments.length) {
		return checks;
	    }
	    checks.push ({check : cbak,
			  msg   : msg});
	    return this;
	};
	new_method.transform = function (cbak) {
	    if (!arguments.length) {
		return transforms;
	    }
	    transforms.push(cbak);
	    return this;
	};

	who[method] = new_method;
    };

    var getset = function (param, opts) {
	if (typeof (param) === 'object') {
	    methods.add_batch (param);
	    for (var p in param) {
		attach_method (p, opts);
	    }
	} else {
	    methods.add (param, opts.default_value);
	    attach_method (param, opts);
	}
    };

    api.getset = function (param, def) {
	getset(param, {default_value : def});

	return api;
    };

    api.get = function (param, def) {
	var on_setter = function () {
	    throw ("Method defined only as a getter (you are trying to use it as a setter");
	};

	getset(param, {default_value : def,
		       on_setter : on_setter}
	      );

	return api;
    };

    api.set = function (param, def) {
	var on_getter = function () {
	    throw ("Method defined only as a setter (you are trying to use it as a getter");
	};

	getset(param, {default_value : def,
		       on_getter : on_getter}
	      );

	return api;
    };

    api.method = function (name, cbak) {
	if (typeof (name) === 'object') {
	    for (var p in name) {
		who[p] = name[p];
	    }
	} else {
	    who[name] = cbak;
	}
	return api;
    };

    return api;
    
};

module.exports = exports = api;
},{}],23:[function(require,module,exports){
// if (typeof tnt === "undefined") {
//     module.exports = tnt = {}
// }
module.exports = require("./src/index.js");


},{"./src/index.js":56}],24:[function(require,module,exports){
module.exports=require(21)
},{"./src/api.js":25}],25:[function(require,module,exports){
module.exports=require(22)
},{}],26:[function(require,module,exports){
// if (typeof tnt === "undefined") {
//     module.exports = tnt = {}
// }
// tnt.utils = require("tnt.utils");
// tnt.tooltip = require("tnt.tooltip");
// tnt.board = require("./src/index.js");

module.exports = require("./src/index");

},{"./src/index":30}],27:[function(require,module,exports){
var apijs = require ("tnt.api");
var deferCancel = require ("tnt.utils").defer_cancel;

var board = function() {
    "use strict";

    //// Private vars
    var svg;
    var div_id;
    var tracks = [];
    var min_width = 50;
    var height    = 0;    // This is the global height including all the tracks
    var width     = 920;
    var height_offset = 20;
    var loc = {
	species  : undefined,
	chr      : undefined,
        from     : 0,
        to       : 500
    };

    // Limit caps
    var caps = {
        left : undefined,
        right : undefined
    };
    var cap_width = 3;


    // TODO: We have now background color in the tracks. Can this be removed?
    // It looks like it is used in the too-wide pane etc, but it may not be needed anymore
    var bgColor   = d3.rgb('#F8FBEF'); //#F8FBEF
    var pane; // Draggable pane
    var svg_g;
    var xScale;
    var zoomEventHandler = d3.behavior.zoom();
    var limits = {
        min : 0,
        max : 1000,
        zoom_out : 1000,
        zoom_in  : 100
    };
    var dur = 500;
    var drag_allowed = true;

    var exports = {
        ease          : d3.ease("cubic-in-out"),
        extend_canvas : {
            left : 0,
            right : 0
        },
        show_frame : true
        // limits        : function () {throw "The limits method should be defined"}
    };

    // The returned closure / object
    var track_vis = function(div) {
    	div_id = d3.select(div).attr("id");

    	// The original div is classed with the tnt class
    	d3.select(div)
    	    .classed("tnt", true);

    	// TODO: Move the styling to the scss?
    	var browserDiv = d3.select(div)
    	    .append("div")
    	    .attr("id", "tnt_" + div_id)
    	    .style("position", "relative")
    	    .classed("tnt_framed", exports.show_frame ? true : false)
    	    .style("width", (width + cap_width*2 + exports.extend_canvas.right + exports.extend_canvas.left) + "px");

    	var groupDiv = browserDiv
    	    .append("div")
    	    .attr("class", "tnt_groupDiv");

    	// The SVG
    	svg = groupDiv
    	    .append("svg")
    	    .attr("class", "tnt_svg")
    	    .attr("width", width)
    	    .attr("height", height)
    	    .attr("pointer-events", "all");

    	svg_g = svg
    	    .append("g")
                .attr("transform", "translate(0,20)")
                .append("g")
    	    .attr("class", "tnt_g");

    	// caps
    	caps.left = svg_g
    	    .append("rect")
    	    .attr("id", "tnt_" + div_id + "_5pcap")
    	    .attr("x", 0)
    	    .attr("y", 0)
    	    .attr("width", 0)
    	    .attr("height", height)
    	    .attr("fill", "red");
    	caps.right = svg_g
    	    .append("rect")
    	    .attr("id", "tnt_" + div_id + "_3pcap")
    	    .attr("x", width-cap_width)
    	    .attr("y", 0)
    	    .attr("width", 0)
    	    .attr("height", height)
    	    .attr("fill", "red");

    	// The Zooming/Panning Pane
    	pane = svg_g
    	    .append("rect")
    	    .attr("class", "tnt_pane")
    	    .attr("id", "tnt_" + div_id + "_pane")
    	    .attr("width", width)
    	    .attr("height", height)
    	    .style("fill", bgColor);

    	// ** TODO: Wouldn't be better to have these messages by track?
    	// var tooWide_text = svg_g
    	//     .append("text")
    	//     .attr("class", "tnt_wideOK_text")
    	//     .attr("id", "tnt_" + div_id + "_tooWide")
    	//     .attr("fill", bgColor)
    	//     .text("Region too wide");

    	// TODO: I don't know if this is the best way (and portable) way
    	// of centering the text in the text area
    	// var bb = tooWide_text[0][0].getBBox();
    	// tooWide_text
    	//     .attr("x", ~~(width/2 - bb.width/2))
    	//     .attr("y", ~~(height/2 - bb.height/2));
    };

    // API
    var api = apijs (track_vis)
    	.getset (exports)
    	.getset (limits)
    	.getset (loc);

    api.transform (track_vis.extend_canvas, function (val) {
    	var prev_val = track_vis.extend_canvas();
    	val.left = val.left || prev_val.left;
    	val.right = val.right || prev_val.right;
    	return val;
    });

    // track_vis always starts on loc.from & loc.to
    api.method ('start', function () {
        // make sure that zoom_out is within the min-max range
        if ((limits.max - limits.min) < limits.zoom_out) {
            limits.zoom_out = limits.max - limits.min;
        }

        plot();

        // Reset the tracks
        for (var i=0; i<tracks.length; i++) {
            if (tracks[i].g) {
                //    tracks[i].display().reset.call(tracks[i]);
                tracks[i].g.remove();
            }
            _init_track(tracks[i]);
        }
        _place_tracks();

        // The continuation callback
        var cont = function () {

            if ((loc.to - loc.from) < limits.zoom_in) {
                if ((loc.from + limits.zoom_in) > limits.max) {
                    loc.to = limits.max;
                } else {
                    loc.to = loc.from + limits.zoom_in;
                }
            }

            for (var i=0; i<tracks.length; i++) {
                _update_track(tracks[i], loc);
            }
        };

        cont();
    });

    api.method ('update', function () {
    	for (var i=0; i<tracks.length; i++) {
    	    _update_track (tracks[i]);
    	}
    });

    var _update_track = function (track, where) {
    	if (track.data()) {
    	    var track_data = track.data();
            var data_updater = track_data;

    	    data_updater.call(track, {
                'loc' : where,
                'on_success' : function () {
                    track.display().update.call(track, where);
                }
    	    });
    	}
    };

    var plot = function() {
    	xScale = d3.scale.linear()
    	    .domain([loc.from, loc.to])
    	    .range([0, width]);

    	if (drag_allowed) {
    	    svg_g.call( zoomEventHandler
    		       .x(xScale)
    		       .scaleExtent([(loc.to-loc.from)/(limits.zoom_out-1), (loc.to-loc.from)/limits.zoom_in])
    		       .on("zoom", _move)
    		     );
    	}
    };

    var _reorder = function (new_tracks) {
        // TODO: This is defining a new height, but the global height is used to define the size of several
        // parts. We should do this dynamically

        var found_indexes = [];
        for (var j=0; j<new_tracks.length; j++) {
            var found = false;
            for (var i=0; i<tracks.length; i++) {
                if (tracks[i].id() === new_tracks[j].id()) {
                    found = true;
                    found_indexes[i] = true;
                    // tracks.splice(i,1);
                    break;
                }
            }
            if (!found) {
                _init_track(new_tracks[j]);
                _update_track(new_tracks[j], {from : loc.from, to : loc.to});
            }
        }

        for (var x=0; x<tracks.length; x++) {
            if (!found_indexes[x]) {
                tracks[x].g.remove();
            }
        }

        tracks = new_tracks;
        _place_tracks();
    };

    // right/left/zoom pans or zooms the track. These methods are exposed to allow external buttons, etc to interact with the tracks. The argument is the amount of panning/zooming (ie. 1.2 means 20% panning) With left/right only positive numbers are allowed.
    api.method ('scroll', function (factor) {
        var amount = Math.abs(factor);
    	if (factor > 0) {
    	    _manual_move(amount, 1);
    	} else if (factor < 0){
            _manual_move(amount, -1);
        }
    });

    api.method ('zoom', function (factor) {
        _manual_move(1/factor, 0);
    });

    api.method ('find_track', function (id) {
        for (var i=0; i<tracks.length; i++) {
            if (tracks[i].id() === id) {
                return tracks[i];
            }
        }
    });

    api.method ('remove_track', function (track) {
        track.g.remove();
    });

    api.method ('add_track', function (track) {
        if (track instanceof Array) {
            for (var i=0; i<track.length; i++) {
                track_vis.add_track (track[i]);
            }
            return track_vis;
        }
        tracks.push(track);
        return track_vis;
    });

    api.method('tracks', function (ts) {
        if (!arguments.length) {
            return tracks;
        }
        _reorder(ts);
        return this;
    });

    //
    api.method ('width', function (w) {
    	// TODO: Allow suffixes like "1000px"?
    	// TODO: Test wrong formats
    	if (!arguments.length) {
    	    return width;
    	}
    	// At least min-width
    	if (w < min_width) {
    	    w = min_width;
    	}

    	// We are resizing
    	if (div_id !== undefined) {
    	    d3.select("#tnt_" + div_id).select("svg").attr("width", w);
    	    // Resize the zooming/panning pane
    	    d3.select("#tnt_" + div_id).style("width", (parseInt(w) + cap_width*2) + "px");
    	    d3.select("#tnt_" + div_id + "_pane").attr("width", w);
            caps.right
                .attr("x", w-cap_width);

    	    // Replot
    	    width = w;
            xScale.range([0, width]);

    	    plot();
    	    for (var i=0; i<tracks.length; i++) {
        		tracks[i].g.select("rect").attr("width", w);
                tracks[i].display().scale(xScale);
        		tracks[i].display().reset.call(tracks[i]);
                tracks[i].display().init.call(tracks[i], w);
        		tracks[i].display().update.call(tracks[i], loc);
    	    }
    	} else {
    	    width = w;
    	}
        return track_vis;
    });

    api.method('allow_drag', function(b) {
        if (!arguments.length) {
            return drag_allowed;
        }
        drag_allowed = b;
        if (drag_allowed) {
            // When this method is called on the object before starting the simulation, we don't have defined xScale
            if (xScale !== undefined) {
                svg_g.call( zoomEventHandler.x(xScale)
                    // .xExtent([0, limits.right])
                    .scaleExtent([(loc.to-loc.from)/(limits.zoom_out-1), (loc.to-loc.from)/limits.zoom_in])
                    .on("zoom", _move) );
            }
        } else {
            // We create a new dummy scale in x to avoid dragging the previous one
            // TODO: There may be a cheaper way of doing this?
            zoomEventHandler.x(d3.scale.linear()).on("zoom", null);
        }
        return track_vis;
    });

    var _place_tracks = function () {
        var h = 0;
        for (var i=0; i<tracks.length; i++) {
            var track = tracks[i];
            if (track.g.attr("transform")) {
                track.g
                    .transition()
                    .duration(dur)
                    .attr("transform", "translate(" + exports.extend_canvas.left + "," + h + ")");
            } else {
                track.g
                    .attr("transform", "translate(" + exports.extend_canvas.left + "," + h + ")");
            }

            h += track.height();
        }

        // svg
        svg.attr("height", h + height_offset);

        // div
        d3.select("#tnt_" + div_id)
            .style("height", (h + 10 + height_offset) + "px");

        // caps
        d3.select("#tnt_" + div_id + "_5pcap")
            .attr("height", h)
            .each(function (d) {
                move_to_front(this);
            });

        d3.select("#tnt_" + div_id + "_3pcap")
            .attr("height", h)
            .each (function (d) {
                move_to_front(this);
            });

        // pane
        pane
            .attr("height", h + height_offset);

        return track_vis;
    };

    var _init_track = function (track) {
        track.g = svg.select("g").select("g")
    	    .append("g")
    	    .attr("class", "tnt_track")
    	    .attr("height", track.height());

    	// Rect for the background color
    	track.g
    	    .append("rect")
    	    .attr("x", 0)
    	    .attr("y", 0)
    	    .attr("width", track_vis.width())
    	    .attr("height", track.height())
    	    .style("fill", track.color())
    	    .style("pointer-events", "none");

    	if (track.display()) {
    	    track.display()
                .scale(xScale)
                .init.call(track, width);
    	}

    	return track_vis;
    };

    var _manual_move = function (factor, direction) {
        var oldDomain = xScale.domain();

    	var span = oldDomain[1] - oldDomain[0];
    	var offset = (span * factor) - span;

    	var newDomain;
    	switch (direction) {
            case 1 :
            newDomain = [(~~oldDomain[0] - offset), ~~(oldDomain[1] - offset)];
    	    break;
        	case -1 :
        	    newDomain = [(~~oldDomain[0] + offset), ~~(oldDomain[1] - offset)];
        	    break;
        	case 0 :
        	    newDomain = [oldDomain[0] - ~~(offset/2), oldDomain[1] + (~~offset/2)];
    	}

    	var interpolator = d3.interpolateNumber(oldDomain[0], newDomain[0]);
    	var ease = exports.ease;

    	var x = 0;
    	d3.timer(function() {
    	    var curr_start = interpolator(ease(x));
    	    var curr_end;
    	    switch (direction) {
        	    case -1 :
        		curr_end = curr_start + span;
        		break;
        	    case 1 :
        		curr_end = curr_start + span;
        		break;
        	    case 0 :
        		curr_end = oldDomain[1] + oldDomain[0] - curr_start;
        		break;
    	    }

    	    var currDomain = [curr_start, curr_end];
    	    xScale.domain(currDomain);
    	    _move(xScale);
    	    x+=0.02;
    	    return x>1;
    	});
    };


    var _move_cbak = function () {
        var currDomain = xScale.domain();
    	track_vis.from(~~currDomain[0]);
    	track_vis.to(~~currDomain[1]);

    	for (var i = 0; i < tracks.length; i++) {
    	    var track = tracks[i];
    	    _update_track(track, loc);
    	}
    };
    // The deferred_cbak is deferred at least this amount of time or re-scheduled if deferred is called before
    var _deferred = deferCancel(_move_cbak, 300);

    // api.method('update', function () {
    // 	_move();
    // });

    var _move = function (new_xScale) {
    	if (new_xScale !== undefined && drag_allowed) {
    	    zoomEventHandler.x(new_xScale);
    	}

    	// Show the red bars at the limits
    	var domain = xScale.domain();
    	if (domain[0] <= (limits.min + 5)) {
    	    d3.select("#tnt_" + div_id + "_5pcap")
    		.attr("width", cap_width)
    		.transition()
    		.duration(200)
    		.attr("width", 0);
    	}

    	if (domain[1] >= (limits.max)-5) {
    	    d3.select("#tnt_" + div_id + "_3pcap")
    		.attr("width", cap_width)
    		.transition()
    		.duration(200)
    		.attr("width", 0);
    	}


    	// Avoid moving past the limits
    	if (domain[0] < limits.min) {
    	    zoomEventHandler.translate([zoomEventHandler.translate()[0] - xScale(limits.min) + xScale.range()[0], zoomEventHandler.translate()[1]]);
    	} else if (domain[1] > limits.max) {
    	    zoomEventHandler.translate([zoomEventHandler.translate()[0] - xScale(limits.max) + xScale.range()[1], zoomEventHandler.translate()[1]]);
    	}

    	_deferred();

    	for (var i = 0; i < tracks.length; i++) {
    	    var track = tracks[i];
    	    track.display().mover.call(track);
    	}
    };

    // api.method({
    // 	allow_drag : api_allow_drag,
    // 	width      : api_width,
    // 	add_track  : api_add_track,
    // 	reorder    : api_reorder,
    // 	zoom       : api_zoom,
    // 	left       : api_left,
    // 	right      : api_right,
    // 	start      : api_start
    // });

    // Auxiliar functions
    function move_to_front (elem) {
        elem.parentNode.appendChild(elem);
    }

    return track_vis;
};

module.exports = exports = board;

},{"tnt.api":24,"tnt.utils":62}],28:[function(require,module,exports){
var apijs = require ("tnt.api");
var spinner = require ("./spinner.js")();

tnt_data = {};

tnt_data.sync = function() {
    var update_track = function(obj) {
        var track = this;
        track.data().elements(update_track.retriever().call(track, obj.loc));
        obj.on_success();
    };

    apijs (update_track)
        .getset ('elements', [])
        .getset ('retriever', function () {});

    return update_track;
};

tnt_data.async = function () {
    var update_track = function (obj) {
        var track = this;
        spinner.on.call(track);
        update_track.retriever().call(track, obj.loc)
            .then (function (resp) {
                track.data().elements(resp);
                obj.on_success();
                spinner.off.call(track);
            });
    };

    var api = apijs (update_track)
        .getset ('elements', [])
        .getset ('retriever');

    return update_track;
};


// A predefined track displaying no external data
// it is used for location and axis tracks for example
tnt_data.empty = function () {
    var updater = tnt_data.sync();

    return updater;
};

module.exports = exports = tnt_data;

},{"./spinner.js":32,"tnt.api":24}],29:[function(require,module,exports){
var apijs = require ("tnt.api");
var layout = require("./layout.js");

// FEATURE VIS
// var board = {};
// board.track = {};
var tnt_feature = function () {
    var dispatch = d3.dispatch ("click", "dblclick", "mouseover", "mouseout");

    ////// Vars exposed in the API
    var config = {
        create   : function () {throw "create_elem is not defined in the base feature object";},
        move    : function () {throw "move_elem is not defined in the base feature object";},
        distribute  : function () {},
        fixed   : function () {},
        //layout   : function () {},
        index    : undefined,
        layout   : layout.identity(),
        color : '#000',
        scale : undefined
    };


    // The returned object
    var feature = {};

    var reset = function () {
    	var track = this;
    	track.g.selectAll(".tnt_elem").remove();
        track.g.selectAll(".tnt_guider").remove();
    };

    var init = function (width) {
        var track = this;

        track.g
            .append ("text")
            .attr ("x", 5)
            .attr ("y", 12)
            .attr ("font-size", 11)
            .attr ("fill", "grey")
            .text (track.label());

        config.fixed.call(track, width);
    };

    var plot = function (new_elems, track, xScale) {
        new_elems.on("click", function (d, i) {
            if (d3.event.defaultPrevented) {
                return;
            }
            dispatch.click.call(this, d, i);
        });
        new_elems.on("mouseover", function (d, i) {
            if (d3.event.defaultPrevented) {
                return;
            }
            dispatch.mouseover.call(this, d, i);
        });
        new_elems.on("dblclick", function (d, i) {
            if (d3.event.defaultPrevented) {
                return;
            }
            dispatch.dblclick.call(this, d, i);
        });
        new_elems.on("mouseout", function (d, i) {
            if (d3.event.defaultPrevented) {
                return;
            }
            dispatch.mouseout.call(this, d, i);
        });
        // new_elem is a g element the feature is inserted
        config.create.call(track, new_elems, xScale);
    };

    var update = function (loc, field) {
        var track = this;
        var svg_g = track.g;

        var elements = track.data().elements();

        if (field !== undefined) {
            elements = elements[field];
        }

        var data_elems = config.layout.call(track, elements);


        if (data_elems === undefined) {
            return;
        }

        var vis_sel;
        var vis_elems;
        if (field !== undefined) {
            vis_sel = svg_g.selectAll(".tnt_elem_" + field);
        } else {
            vis_sel = svg_g.selectAll(".tnt_elem");
        }

        if (config.index) { // Indexing by field
            vis_elems = vis_sel
                .data(data_elems, function (d) {
                    if (d !== undefined) {
                        return config.index(d);
                    }
                });
        } else { // Indexing by position in array
            vis_elems = vis_sel
                .data(data_elems);
        }

        config.distribute.call(track, vis_elems, config.scale);

    	var new_elem = vis_elems
    	    .enter();

    	new_elem
    	    .append("g")
    	    .attr("class", "tnt_elem")
    	    .classed("tnt_elem_" + field, field)
    	    .call(feature.plot, track, config.scale);

    	vis_elems
    	    .exit()
    	    .remove();
    };

    var mover = function (field) {
    	var track = this;
    	var svg_g = track.g;
    	var elems;
    	// TODO: Is selecting the elements to move too slow?
    	// It would be nice to profile
    	if (field !== undefined) {
    	    elems = svg_g.selectAll(".tnt_elem_" + field);
    	} else {
    	    elems = svg_g.selectAll(".tnt_elem");
    	}

    	config.move.call(this, elems);
    };

    var mtf = function (elem) {
        elem.parentNode.appendChild(elem);
    };

    var move_to_front = function (field) {
        if (field !== undefined) {
            var track = this;
            var svg_g = track.g;
            svg_g.selectAll(".tnt_elem_" + field)
                .each( function () {
                    mtf(this);
                });
        }
    };

    // API
    apijs (feature)
    	.getset (config)
    	.method ({
    	    reset  : reset,
    	    plot   : plot,
    	    update : update,
    	    mover   : mover,
    	    init   : init,
    	    move_to_front : move_to_front
    	});

    return d3.rebind(feature, dispatch, "on");
};

tnt_feature.composite = function () {
    var displays = {};
    var display_order = [];

    var features = {};

    var reset = function () {
    	var track = this;
    	for (var i=0; i<displays.length; i++) {
    	    displays[i].reset.call(track);
    	}
    };

    var init = function (width) {
        var track = this;
        for (var display in displays) {
            if (displays.hasOwnProperty(display)) {
                displays[display].scale(features.scale());
                displays[display].init.call(track, width);
            }
        }
    };

    var update = function () {
    	var track = this;
    	for (var i=0; i<display_order.length; i++) {
    	    displays[display_order[i]].update.call(track, undefined, display_order[i]);
    	    displays[display_order[i]].move_to_front.call(track, display_order[i]);
    	}
        // for (var display in displays) {
        //     if (displays.hasOwnProperty(display)) {
        //         displays[display].update.call(track, xScale, display);
        //     }
        // }
    };

    var mover = function () {
        var track = this;
        for (var display in displays) {
            if (displays.hasOwnProperty(display)) {
                displays[display].mover.call(track, display);
            }
        }
    };

    var add = function (key, display) {
    	displays[key] = display;
    	display_order.push(key);
    	return features;
    };

    var get_displays = function () {
    	var ds = [];
    	for (var i=0; i<display_order.length; i++) {
    	    ds.push(displays[display_order[i]]);
    	}
    	return ds;
    };

    // API
    apijs (features)
        .getset("scale")
    	.method ({
    	    reset  : reset,
    	    update : update,
    	    mover   : mover,
    	    init   : init,
    	    add    : add,
    	    displays : get_displays
    	});

    return features;
};

tnt_feature.area = function () {
    var feature = tnt_feature.line();
    var line = feature.line();

    var area = d3.svg.area()
    	.interpolate(line.interpolate())
    	.tension(feature.tension());

    var data_points;

    var line_create = feature.create(); // We 'save' line creation

    feature.create (function (points) {
    	var track = this;
        var xScale = feature.scale();

    	if (data_points !== undefined) {
    	    track.g.select("path").remove();
    	}

    	line_create.call(track, points, xScale);

    	area
    	    .x(line.x())
    	    .y1(line.y())
    	    .y0(track.height());

    	data_points = points.data();
    	points.remove();

    	track.g
    	    .append("path")
    	    .attr("class", "tnt_area")
    	    .classed("tnt_elem", true)
    	    .datum(data_points)
    	    .attr("d", area)
    	    .attr("fill", d3.rgb(feature.color()).brighter());
    });

    var line_move = feature.move();
    feature.move (function (path) {
    	var track = this;
        var xScale = feature.scale();
    	line_move.call(track, path, xScale);

    	area.x(line.x());
    	track.g
    	    .select(".tnt_area")
    	    .datum(data_points)
    	    .attr("d", area);
    });

    return feature;

};

tnt_feature.line = function () {
    var feature = tnt_feature();

    var x = function (d) {
        return d.pos;
    };
    var y = function (d) {
        return d.val;
    };
    var tension = 0.7;
    var yScale = d3.scale.linear();
    var line = d3.svg.line()
        .interpolate("basis");

    // line getter. TODO: Setter?
    feature.line = function () {
        return line;
    };

    feature.x = function (cbak) {
    	if (!arguments.length) {
    	    return x;
    	}
    	x = cbak;
    	return feature;
    };

    feature.y = function (cbak) {
    	if (!arguments.length) {
    	    return y;
    	}
    	y = cbak;
    	return feature;
    };

    feature.tension = function (t) {
    	if (!arguments.length) {
    	    return tension;
    	}
    	tension = t;
    	return feature;
    };

    var data_points;

    // For now, create is a one-off event
    // TODO: Make it work with partial paths, ie. creating and displaying only the path that is being displayed
    feature.create (function (points) {
    	var track = this;
        var xScale = feature.scale();

    	if (data_points !== undefined) {
    	    // return;
    	    track.g.select("path").remove();
    	}

    	line
    	    .tension(tension)
    	    .x(function (d) {
                return xScale(x(d));
    	    })
    	    .y(function (d) {
                return track.height() - yScale(y(d));
    	    });

    	data_points = points.data();
    	points.remove();

    	yScale
    	    .domain([0, 1])
    	    // .domain([0, d3.max(data_points, function (d) {
    	    // 	return y(d);
    	    // })])
    	    .range([0, track.height() - 2]);

    	track.g
    	    .append("path")
    	    .attr("class", "tnt_elem")
    	    .attr("d", line(data_points))
    	    .style("stroke", feature.color())
    	    .style("stroke-width", 4)
    	    .style("fill", "none");
    });

    feature.move (function (path) {
    	var track = this;
        var xScale = feature.scale();

    	line.x(function (d) {
    	    return xScale(x(d));
    	});
    	track.g.select("path")
    	    .attr("d", line(data_points));
    });

    return feature;
};

tnt_feature.conservation = function () {
        // 'Inherit' from feature.area
        var feature = tnt_feature.area();

        var area_create = feature.create(); // We 'save' area creation
        feature.create  (function (points) {
        	var track = this;
            var xScale = feature.scale();
        	area_create.call(track, d3.select(points[0][0]), xScale);
        });

    return feature;
};

tnt_feature.ensembl = function () {
    // 'Inherit' from board.track.feature
    var feature = tnt_feature();

    var color2 = "#7FFF00";
    var color3 = "#00BB00";

    feature.fixed (function (width) {
    	var track = this;
    	var height_offset = ~~(track.height() - (track.height()  * 0.8)) / 2;

    	track.g
    	    .append("line")
    	    .attr("class", "tnt_guider")
    	    .attr("x1", 0)
    	    .attr("x2", width)
    	    .attr("y1", height_offset)
    	    .attr("y2", height_offset)
    	    .style("stroke", feature.color())
    	    .style("stroke-width", 1);

    	track.g
    	    .append("line")
    	    .attr("class", "tnt_guider")
    	    .attr("x1", 0)
    	    .attr("x2", width)
    	    .attr("y1", track.height() - height_offset)
    	    .attr("y2", track.height() - height_offset)
    	    .style("stroke", feature.color())
    	    .style("stroke-width", 1);

    });

    feature.create (function (new_elems) {
    	var track = this;
        var xScale = feature.scale();

    	var height_offset = ~~(track.height() - (track.height()  * 0.8)) / 2;

    	new_elems
    	    .append("rect")
    	    .attr("x", function (d) {
                return xScale (d.start);
    	    })
    	    .attr("y", height_offset)
    // 	    .attr("rx", 3)
    // 	    .attr("ry", 3)
    	    .attr("width", function (d) {
                return (xScale(d.end) - xScale(d.start));
    	    })
    	    .attr("height", track.height() - ~~(height_offset * 2))
    	    .attr("fill", track.color())
    	    .transition()
    	    .duration(500)
    	    .attr("fill", function (d) {
        		if (d.type === 'high') {
        		    return d3.rgb(feature.color());
        		}
        		if (d.type === 'low') {
        		    return d3.rgb(feature.color2());
        		}
        		return d3.rgb(feature.color3());
    	    });
    });

    feature.distribute (function (blocks) {
        var xScale = feature.scale();
    	blocks
    	    .select("rect")
    	    .attr("width", function (d) {
                return (xScale(d.end) - xScale(d.start));
    	    });
    });

    feature.move (function (blocks) {
        var xScale = feature.scale();
    	blocks
    	    .select("rect")
    	    .attr("x", function (d) {
                return xScale(d.start);
    	    })
    	    .attr("width", function (d) {
                return (xScale(d.end) - xScale(d.start));
    	    });
    });

    feature.color2 = function (col) {
    	if (!arguments.length) {
    	    return color2;
    	}
    	color2 = col;
    	return feature;
    };

    feature.color3 = function (col) {
    	if (!arguments.length) {
    	    return color3;
    	}
    	color3 = col;
    	return feature;
    };

    return feature;
};

tnt_feature.vline = function () {
    // 'Inherit' from feature
    var feature = tnt_feature();

    feature.create (function (new_elems) {
        var xScale = feature.scale();
    	var track = this;
    	new_elems
    	    .append ("line")
    	    .attr("x1", function (d) {
                return xScale(feature.index()(d));
    	    })
    	    .attr("x2", function (d) {
                return xScale(feature.index()(d));
    	    })
    	    .attr("y1", 0)
    	    .attr("y2", track.height())
    	    .attr("stroke", feature.color())
    	    .attr("stroke-width", 1);
    });

    feature.move (function (vlines) {
        var xScale = feature.scale();
    	vlines
    	    .select("line")
    	    .attr("x1", function (d) {
                return xScale(feature.index()(d));
    	    })
    	    .attr("x2", function (d) {
                return xScale(feature.index()(d));
    	    });
    });

    return feature;

};

tnt_feature.pin = function () {
    // 'Inherit' from board.track.feature
    var feature = tnt_feature();

    var yScale = d3.scale.linear()
    	.domain([0,0])
    	.range([0,0]);

    var opts = {
        pos : d3.functor("pos"),
        val : d3.functor("val"),
        domain : [0,0]
    };

    var pin_ball_r = 5; // the radius of the circle in the pin

    apijs(feature)
        .getset(opts);


    feature.create (function (new_pins) {
    	var track = this;
        var xScale = feature.scale();
    	yScale
    	    .domain(feature.domain())
    	    .range([pin_ball_r, track.height()-pin_ball_r-10]); // 10 for labelling

    	// pins are composed of lines, circles and labels
    	new_pins
    	    .append("line")
    	    .attr("x1", function (d, i) {
    	    	return xScale(d[opts.pos(d, i)]);
    	    })
    	    .attr("y1", function (d) {
                return track.height();
    	    })
    	    .attr("x2", function (d,i) {
    	    	return xScale(d[opts.pos(d, i)]);
    	    })
    	    .attr("y2", function (d, i) {
    	    	return track.height() - yScale(d[opts.val(d, i)]);
    	    })
    	    .attr("stroke", function (d) {
                return d3.functor(feature.color())(d);
            });

    	new_pins
    	    .append("circle")
    	    .attr("cx", function (d, i) {
                return xScale(d[opts.pos(d, i)]);
    	    })
    	    .attr("cy", function (d, i) {
                return track.height() - yScale(d[opts.val(d, i)]);
    	    })
    	    .attr("r", pin_ball_r)
    	    .attr("fill", function (d) {
                return d3.functor(feature.color())(d);
            });

        new_pins
            .append("text")
            .attr("font-size", "13")
            .attr("x", function (d, i) {
                return xScale(d[opts.pos(d, i)]);
            })
            .attr("y", function (d, i) {
                return 10;
            })
            .style("text-anchor", "middle")
            .text(function (d) {
                return d.label || "";
            });

    });

    feature.distribute (function (pins) {
        pins
            .select("text")
            .text(function (d) {
                return d.label || "";
            });
    });

    feature.move(function (pins) {
    	var track = this;
        var xScale = feature.scale();

    	pins
    	    //.each(position_pin_line)
    	    .select("line")
    	    .attr("x1", function (d, i) {
                return xScale(d[opts.pos(d, i)]);
    	    })
    	    .attr("y1", function (d) {
        		return track.height();
    	    })
    	    .attr("x2", function (d,i) {
        		return xScale(d[opts.pos(d, i)]);
    	    })
    	    .attr("y2", function (d, i) {
        		return track.height() - yScale(d[opts.val(d, i)]);
    	    });

    	pins
    	    .select("circle")
    	    .attr("cx", function (d, i) {
                return xScale(d[opts.pos(d, i)]);
    	    })
    	    .attr("cy", function (d, i) {
                return track.height() - yScale(d[opts.val(d, i)]);
    	    });

        pins
            .select("text")
            .attr("x", function (d, i) {
                return xScale(d[opts.pos(d, i)]);
            })
            .text(function (d) {
                return d.label || "";
            });

    });

    feature.fixed (function (width) {
        var track = this;
        track.g
            .append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", track.height())
            .attr("y2", track.height())
            .style("stroke", "black")
            .style("stroke-with", "1px");
    });

    return feature;
};

tnt_feature.block = function () {
    // 'Inherit' from board.track.feature
    var feature = tnt_feature();

    apijs(feature)
    	.getset('from', function (d) {
    	    return d.start;
    	})
    	.getset('to', function (d) {
    	    return d.end;
    	});

    feature.create(function (new_elems) {
    	var track = this;
        var xScale = feature.scale();
    	new_elems
    	    .append("rect")
    	    .attr("x", function (d, i) {
        		// TODO: start, end should be adjustable via the tracks API
        		return xScale(feature.from()(d, i));
    	    })
    	    .attr("y", 0)
    	    .attr("width", function (d, i) {
        		return (xScale(feature.to()(d, i)) - xScale(feature.from()(d, i)));
    	    })
    	    .attr("height", track.height())
    	    .attr("fill", track.color())
    	    .transition()
    	    .duration(500)
    	    .attr("fill", function (d) {
        		if (d.color === undefined) {
        		    return feature.color();
        		} else {
        		    return d.color;
        		}
    	    });
    });

    feature.distribute(function (elems) {
        var xScale = feature.scale();
    	elems
    	    .select("rect")
    	    .attr("width", function (d) {
        		return (xScale(d.end) - xScale(d.start));
    	    });
    });

    feature.move(function (blocks) {
        var xScale = feature.scale();
    	blocks
    	    .select("rect")
    	    .attr("x", function (d) {
        		return xScale(d.start);
    	    })
    	    .attr("width", function (d) {
        		return (xScale(d.end) - xScale(d.start));
    	    });
    });

    return feature;

};

tnt_feature.axis = function () {
    var xAxis;
    var orientation = "top";
    var xScale;

    // Axis doesn't inherit from feature
    var feature = {};
    feature.reset = function () {
    	xAxis = undefined;
    	var track = this;
    	track.g.selectAll("rect").remove();
    	track.g.selectAll(".tick").remove();
    };
    feature.plot = function () {};
    feature.mover = function () {
    	var track = this;
    	var svg_g = track.g;
    	svg_g.call(xAxis);
    };

    feature.init = function () {
        xAxis = undefined;
    };

    feature.update = function () {
    	// Create Axis if it doesn't exist
        if (xAxis === undefined) {
            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient(orientation);
        }

    	var track = this;
    	var svg_g = track.g;
    	svg_g.call(xAxis);
    };

    feature.orientation = function (pos) {
    	if (!arguments.length) {
    	    return orientation;
    	}
    	orientation = pos;
    	return this;
    };

    feature.scale = function (s) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = s;
        return this;
    };

    return feature;
};

tnt_feature.location = function () {
    var row;
    var xScale;

    var feature = {};
    feature.reset = function () {
        row = undefined;
    };
    feature.plot = function () {};
    feature.init = function () {
        row = undefined;
    };
    feature.mover = function() {
    	var domain = xScale.domain();
    	row.select("text")
    	    .text("Location: " + ~~domain[0] + "-" + ~~domain[1]);
    };

    feature.scale = function (sc) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = sc;
        return this;
    };

    feature.update = function (loc) {
    	var track = this;
    	var svg_g = track.g;
    	var domain = xScale.domain();
    	if (row === undefined) {
    	    row = svg_g;
    	    row
        		.append("text")
        		.text("Location: " + Math.round(domain[0]) + "-" + Math.round(domain[1]));
    	}
    };

    return feature;
};

module.exports = exports = tnt_feature;

},{"./layout.js":31,"tnt.api":24}],30:[function(require,module,exports){
var board = require ("./board.js");
board.track = require ("./track");
board.track.data = require ("./data.js");
board.track.layout = require ("./layout.js");
board.track.feature = require ("./feature.js");
board.track.layout = require ("./layout.js");

module.exports = exports = board;

},{"./board.js":27,"./data.js":28,"./feature.js":29,"./layout.js":31,"./track":33}],31:[function(require,module,exports){
var apijs = require ("tnt.api");

// var board = {};
// board.track = {};
var layout = function () {

    // The returned closure / object
    var l = function (new_elems)  {
        var track = this;
        l.elements().call(track, new_elems);
        return new_elems;
    };

    var api = apijs(l)
        .getset ('elements', function () {});

    return l;
};

layout.identity = function () {
    return layout()
        .elements (function (e) {
            return e;
        });
};

module.exports = exports = layout;

},{"tnt.api":24}],32:[function(require,module,exports){
var spinner = function () {
    // var n = 0;
    var sp_elem;
    var sp = {};

    sp.on = function () {
        var track = this;
        if (!track.spinner) {
            track.spinner = 1;
        } else {
            track.spinner++;
        }
        if (track.spinner==1) {
            var container = track.g;
            var bgColor = track.color();
            sp_elem = container
                .append("svg")
                .attr("class", "tnt_spinner")
                .attr("width", "30px")
                .attr("height", "30px")
                .attr("xmls", "http://www.w3.org/2000/svg")
                .attr("viewBox", "0 0 100 100")
                .attr("preserveAspectRatio", "xMidYMid");


            sp_elem
                .append("rect")
                .attr("x", '0')
                .attr("y", '0')
                .attr("width", "100")
                .attr("height", "100")
                .attr("rx", '50')
                .attr("ry", '50')
                .attr("fill", bgColor);
                //.attr("opacity", 0.6);

            for (var i=0; i<12; i++) {
                tick(sp_elem, i, bgColor);
            }

        } else if (track.spinner>0){
            // Move the spinner to front
            var node = sp_elem.node();
            if (node.parentNode) {
                node.parentNode.appendChild(node);
            }
        }
    };

    sp.off = function () {
        var track = this;
        track.spinner--;
        if (!track.spinner) {
            var container = track.g;
            container.selectAll(".tnt_spinner")
                .remove();

        }
    };

    function tick (elem, i, bgColor) {
        elem
            .append("rect")
            .attr("x", "46.5")
            .attr("y", '40')
            .attr("width", "7")
            .attr("height", "20")
            .attr("rx", "5")
            .attr("ry", "5")
            .attr("fill", d3.rgb(bgColor).darker(2))
            .attr("transform", "rotate(" + (360/12)*i + " 50 50) translate(0 -30)")
            .append("animate")
            .attr("attributeName", "opacity")
            .attr("from", "1")
            .attr("to", "0")
            .attr("dur", "1s")
            .attr("begin", (1/12)*i + "s")
            .attr("repeatCount", "indefinite");

    }

    return sp;
};
module.exports = exports = spinner;

},{}],33:[function(require,module,exports){
var apijs = require ("tnt.api");
var iterator = require("tnt.utils").iterator;


var track = function () {
    "use strict";

    var display;

    var conf = {
    	color : d3.rgb('#CCCCCC'),
    	height           : 250,
    	// data is the object (normally a tnt.track.data object) used to retrieve and update data for the track
    	data             : track.data.empty(),
        // display          : undefined,
        label            : "",
        id               : track.id()
    };

    // The returned object / closure
    var t = {};

    // API
    var api = apijs (t)
    	.getset (conf);

    // TODO: This means that height should be defined before display
    // we shouldn't rely on this
    t.display = function (new_plotter) {
        if (!arguments.length) {
            return display;
        }

        display = new_plotter;
        if (typeof (display) === 'function') {
            display.layout && display.layout().height(conf.height);
        } else {
            for (var key in display) {
                if (display.hasOwnProperty(key)) {
                    display[key].layout && display[key].layout().height(conf.height);
                }
            }
        }

        return this;
    };

    return t;
};

track.id = iterator(1);

module.exports = exports = track;

},{"tnt.api":24,"tnt.utils":62}],34:[function(require,module,exports){
module.exports = tnt_rest = require("./src/rest.js");

},{"./src/rest.js":51}],35:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   3.0.2
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$toString = {}.toString;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // see https://github.com/cujojs/when/issues/410 for details
      return function() {
        process.nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertx() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFulfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$es6$promise$utils$$isArray(input);
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;

      var length  = enumerator.length;
      var promise = enumerator.promise;
      var input   = enumerator._input;

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;

      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
          entry._onerror = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = entry;
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        enumerator._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = value;
        }
      }

      if (enumerator._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        if (!lib$es6$promise$utils$$isFunction(resolver)) {
          lib$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
          lib$es6$promise$promise$$needsNew();
        }

        lib$es6$promise$$internal$$initializePromise(this, resolver);
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor(lib$es6$promise$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          lib$es6$promise$asap$$asap(function(){
            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


}).call(this,require("IrXUsu"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"IrXUsu":19}],36:[function(require,module,exports){
module.exports=require(5)
},{}],37:[function(require,module,exports){
module.exports=require(6)
},{"./response":40}],38:[function(require,module,exports){
module.exports=require(7)
},{"../plugins/cleanurl":45,"./error":37,"./request":39,"./response":40,"./utils/delay":41,"./utils/once":42,"./xhr":43,"xtend":44}],39:[function(require,module,exports){
module.exports=require(8)
},{}],40:[function(require,module,exports){
module.exports=require(9)
},{"./request":39}],41:[function(require,module,exports){
module.exports=require(10)
},{}],42:[function(require,module,exports){
module.exports=require(11)
},{}],43:[function(require,module,exports){
module.exports=require(12)
},{}],44:[function(require,module,exports){
module.exports=require(13)
},{}],45:[function(require,module,exports){
module.exports=require(14)
},{}],46:[function(require,module,exports){
module.exports=require(15)
},{"./jsonrequest":47,"./jsonresponse":48}],47:[function(require,module,exports){
module.exports=require(16)
},{}],48:[function(require,module,exports){
module.exports=require(17)
},{}],49:[function(require,module,exports){
module.exports=require(21)
},{"./src/api.js":50}],50:[function(require,module,exports){
module.exports=require(22)
},{}],51:[function(require,module,exports){
var http = require("httpplease");
var apijs = require("tnt.api");
var promises = require('httpplease-promises');
var Promise = require('es6-promise').Promise;
var json = require("httpplease/plugins/json");
http = http.use(json).use(promises(Promise));

//var url = require("./url.js");

tnt_rest = function () {
    var config = {
        prefix: "",
        protocol: "http",
        domain: "",
        port: ""
    };
    var rest = {};
    rest.url = require("./url.js");

    var api = apijs (rest)
        .getset(config);

    api.method ('call', function (url, data) {
        var myurl;
        if (typeof(url) === "string") {
            myurl = url;
        } else { // It is a tnt.rest.url
            url
                ._prefix(config.prefix)
                ._protocol(config.protocol)
                ._domain(config.domain)
                ._port(config.port);

            myurl = url();
        }
        if (data) { // POST
            return http.post ({
                "url": myurl,
                "body": data
            });
        }
        return http.get ({
            "url": myurl
        });
    });

    return rest;
};

module.exports = exports = tnt_rest;

},{"./url.js":52,"es6-promise":35,"httpplease":38,"httpplease-promises":36,"httpplease/plugins/json":46,"tnt.api":49}],52:[function(require,module,exports){
var apijs = require("tnt.api");

var urlModule = function () {
    var paramPattern = /:\w+/g;

    var config = {
        _prefix: "",
        _protocol: "http",
        _domain: "",
        _port: "",
        endpoint: "",
        parameters: {},
        fragment: "",
        rest: undefined
    };

    // URL Method
    var url = function () {
        return getUrl();
    };

    var api = apijs (url)
        .getset(config);

    // Checks if the value is a string or an array
    // If array, recurse over all the available values
    function query1 (key) {
        var val = config.parameters[key];
        if (!Array.isArray(val)) {
            return val;
        }
        // It is an array
        var val1 = val.shift();
         if (val.length) {
            return val1 + "&" + key + "=" + query1(key);
        }
        return val1;
    }

    function queryString() {
        // We add 'content-type=application/json'
        if (config.parameters["content-type"] === undefined) {
            config.parameters["content-type"] = "application/json";
        }
        var qs = Object.keys(config.parameters).map(function (key) {
            return key + "=" + query1(key);
        }).join("&");
        return qs ? ("?" + qs) : qs;
    }

    //
    function getUrl() {
        var endpoint = config.endpoint;

        var substEndpoint = endpoint.replace(paramPattern, function (match) {
            match = match.substring(1, match.length);
            var param = config.parameters[match] || "";
            delete config.parameters[match];
            return param;
        });

        var url = config._prefix + config._protocol + "://" + config._domain + (config._port ? ":" + port : "") + "/" + substEndpoint + queryString() + (config.fragment ? "#" + config.fragment : "");
        return url;
    }

    return url;
};

module.exports = exports = urlModule;

},{"tnt.api":49}],53:[function(require,module,exports){
var board = require("tnt.board");
var apijs = require("tnt.api");

var data_gene = function () {
    var eRest = board.track.data.genome.ensembl;

    var data = board.track.data.async()
        .retriever (function (obj) {
            var track = this;
            // var eRest = data.ensembl();
            // var scale = track.display().scale();
            var url = eRest.url()
                .endpoint("overlap/region/:species/:region")
                .parameters({
                    species : obj.species,
                    region  : (obj.chr + ":" + obj.from + "-" + obj.to),
                    feature: obj.features || ["gene"]
                });
            // var url = eRest.url.region(obj);
            return eRest.call(url)
              .then (function (resp) {
                      var genes = resp.body;
                      // Set the display_label field
                      for (var i=0; i<genes.length; i++) {
                          var gene = genes[i];
                          if (gene.strand === -1) {
                              gene.display_label = "<" + gene.external_name;
                          } else {
                              gene.display_label = gene.external_name + ">";
                          }
                      }
                      return genes;
                  }
              );
        });

    apijs(data)
        .getset('ensembl');

    return data;
};

var data_transcript = function () {
    var eRest = board.track.data.genome.ensembl;

    var data = board.track.data.async()
        .retriever (function (obj) {
            var url = eRest.url()
                .endpoint("overlap/region/:species/:region")
                .parameters({
                    species : obj.species,
                    region : (obj.chr + ":" + obj.from + "-" + obj.to),
                    feature : ["gene", "transcript", "exon", "cds"]
                });
            return eRest.call(url)
              .then (function (resp) {
                  var elems = resp.body;
                  var genes = data.region2genes(elems);
                  var transcripts = [];
                  for (var i=0; i<genes.length; i++) {
                      var g = genes[i];
                      var ts = data.gene2Transcripts(g);
                      transcripts = transcripts.concat(ts);
                  }
                  return transcripts;
              });
        });

    apijs(data)
        .method("gene2Transcripts", function (g) {
            var ts = g.Transcript;
            var transcripts = [];
            for (var j=0; j<ts.length; j++) {
                var t = ts[j];
                t.exons = transformExons(t);
                t.introns = exonsToExonsAndIntrons(t);
                //var obj = exonsToExonsAndIntrons (transformExons(t), t);
                // t.name = [{
                //     pos: t.start,
                //     name : t.display_name,
                //     strand : t.strand,
                //     transcript : t
                // }];
                t.display_label = t.strand === 1 ? (t.display_name + ">") : ("<" + t.display_name);
                t.key = (t.id + "_" + t.exons.length);
                //obj.id = t.id;
                t.gene = g;
                // obj.transcript = t;
                // obj.external_name = t.display_name;
                //obj.display_label = t.display_label;
                //obj.start = t.start;
                //obj.end = t.end;
                transcripts.push(t);
            }
            return transcripts;
        })
        .method("region2genes", function (elems) {
            var geneTranscripts = {};
            var genes = [];
            var transcripts = {};

            // transcripts
            for (var i=0; i<elems.length; i++) {
                var e = elems[i];
                if (e.feature_type == "transcript") {
                    e.display_name = e.external_name;
                    transcripts[e.id] = e;
                    if (geneTranscripts[e.Parent] === undefined) {
                        geneTranscripts[e.Parent] = [];
                    }
                    geneTranscripts[e.Parent].push(e);
                }
            }

            // exons
            for (var j=0; j<elems.length; j++) {
                var e = elems[j];
                if (e.feature_type === "exon") {
                    var t = transcripts[e.Parent];
                    if (t.Exon === undefined) {
                        t.Exon = [];
                    }
                    t.Exon.push(e);
                }
            }

            // cds
            for (var k=0; k<elems.length; k++) {
                var e = elems[k];
                if (e.feature_type === "cds") {
                    var t = transcripts[e.Parent];
                    if (t.Translation === undefined) {
                        t.Translation = e;
                    }
                    if (e.start < t.Translation.start) {
                        t.Translation.start = e.start;
                    }
                    if (e.end > t.Translation.end) {
                        t.Translation.end = e.end;
                    }
                }
            }

            // genes
            for (var h=0; h<elems.length; h++) {
                var e = elems[h];
                if (e.feature_type === "gene") {
                    e.display_name = e.external_name;
                    e.Transcript = geneTranscripts[e.id];
                    genes.push(e);
                }
            }

            return genes;
        });


    function exonsToExonsAndIntrons (t) {
        var exons = t.exons;
        //var obj = {};
        //obj.exons = exons;
        var introns = [];
        for (var i=0; i<exons.length-1; i++) {
            var intron = {
                start : exons[i].transcript.strand === 1 ? exons[i].end : exons[i].start,
                end   : exons[i].transcript.strand === 1 ? exons[i+1].start : exons[i+1].end,
                transcript : t
            };
            introns.push(intron);
        }
        return introns;
    }


    function transformExons (transcript) {
        var translationStart;
        var translationEnd;
        if (transcript.Translation !== undefined) {
            translationStart = transcript.Translation.start;
            translationEnd = transcript.Translation.end;
        }
        var exons = transcript.Exon;

        var newExons = [];
        if (exons) {
            for (var i=0; i<exons.length; i++) {
                if (transcript.Translation === undefined) { // NO coding transcript
                    newExons.push({
                        start   : exons[i].start,
                        end     : exons[i].end,
                        transcript : transcript,
                        coding  : false,
                        offset  : exons[i].start - transcript.start
                    });
                } else {
                    if (exons[i].start < translationStart) {
                        // 5'
                        if (exons[i].end < translationStart) {
                            // Completely non coding
                            newExons.push({
                                start  : exons[i].start,
                                end    : exons[i].end,
                                transcript : transcript,
                                coding : false,
                                offset  : exons[i].start - transcript.start
                            });
                        } else {
                            // Has 5'UTR
                            var ncExon5 = {
                                start  : exons[i].start,
                                end    : translationStart,
                                transcript : transcript,
                                coding : false,
                                offset  : exons[i].start - transcript.start
                            };
                            var codingExon5 = {
                                start  : translationStart,
                                end    : exons[i].end,
                                transcript : transcript,
                                coding : true,
                                //offset  : exons[i].start - transcript.start
                                offset: translationStart - transcript.start
                            };
                            if (exons[i].strand === 1) {
                                newExons.push(ncExon5);
                                newExons.push(codingExon5);
                            } else {
                                newExons.push(codingExon5);
                                newExons.push(ncExon5);
                            }
                        }
                    } else if (exons[i].end > translationEnd) {
                        // 3'
                        if (exons[i].start > translationEnd) {
                            // Completely non coding
                            newExons.push({
                                start   : exons[i].start,
                                end     : exons[i].end,
                                transcript : transcript,
                                coding  : false,
                                offset  : exons[i].start - transcript.start
                            });
                        } else {
                            // Has 3'UTR
                            var codingExon3 = {
                                start  : exons[i].start,
                                end    : translationEnd,
                                transcript : transcript,
                                coding : true,
                                offset  : exons[i].start - transcript.start
                            };
                            var ncExon3 = {
                                start  : translationEnd,
                                end    : exons[i].end,
                                transcript : transcript,
                                coding : false,
                                //offset  : exons[i].start - transcript.start
                                offset : translationEnd - transcript.start
                            };
                            if (exons[i].strand === 1) {
                                newExons.push(codingExon3);
                                newExons.push(ncExon3);
                            } else {
                                newExons.push(ncExon3);
                                newExons.push(codingExon3);
                            }
                        }
                    } else {
                        // coding exon
                        newExons.push({
                            start  : exons[i].start,
                            end    : exons[i].end,
                            transcript : transcript,
                            coding : true,
                            offset  : exons[i].start - transcript.start
                        });
                    }
                }
            }
        }
        return newExons;
    }

    return data;
};

var data_sequence = function () {
    var eRest = board.track.data.genome.ensembl;

    var data = board.track.data.async()
        .retriever (function (obj) {
            if ((obj.to - obj.from) < data.limit()) {
                var url = eRest.url()
                    .endpoint("/sequence/region/:species/:region")
                    .parameters({
                        "species": obj.species,
                        "region": (obj.chr + ":" + obj.from + ".." + obj.to)
                    });
                // var url = eRest.url.sequence(obj);
                return eRest.call(url)
                    .then (function (resp) {
                        var seq = resp.body;
                        var fields = seq.id.split(":");
                        var from = fields[3];
                        var nts = [];
                        for (var i=0; i<seq.seq.length; i++) {
                            nts.push({
                                pos: +from + i,
                                sequence: seq.seq[i]
                            });
                        }
                        return nts;
                    });
            } else { // Region too wide for sequence
                return new Promise (function (resolve, reject) {
                    resolve([]);
                });
            }
        });

    apijs(data)
        .getset("limit", 150);

    return data;
};

// export
var genome_data = {
    gene : data_gene,
    sequence : data_sequence,
    transcript : data_transcript
};

module.exports = exports = genome_data;

},{"tnt.api":24,"tnt.board":26}],54:[function(require,module,exports){
var apijs = require ("tnt.api");
var layout = require("./layout.js");
var board = require("tnt.board");

var tnt_feature_transcript = function () {
    var feature = board.track.feature()
        .layout (board.track.layout.genome())
        .index (function (d) {
            return d.key;
        });

    feature.create (function (new_elems) {
        var track = this;
        var xScale = feature.scale();
        var gs = new_elems
            .append("g")
            .attr("transform", function (d) {
                return "translate(" + xScale(d.start) + "," + (feature.layout().gene_slot().slot_height * d.slot) + ")";
            });

        gs
            .append("line")
            .attr("x1", 0)
            .attr("y1", ~~(feature.layout().gene_slot().gene_height/2))
            .attr("x2", function (d) {
                return (xScale(d.end) - xScale(d.start));
            })
            .attr("y2", ~~(feature.layout().gene_slot().gene_height/2))
            .attr("fill", "none")
            .attr("stroke", track.color())
            .attr("stroke-width", 2)
            .transition()
            .duration(500)
            .attr("stroke", function (d) {
                return feature.color()(d);
            });
            //.attr("stroke", feature.color());

        // exons
        // pass the "slot" to the exons and introns
        new_elems.each (function (d) {
            if (d.exons) {
                for (var i=0; i<d.exons.length; i++) {
                    d.exons[i].slot = d.slot;
                }
            }
        });

        var exons = gs.selectAll(".exons")
            .data(function (d) {
                return d.exons || [];
            }, function (d) {
                return d.start;
            });

        exons
            .enter()
            .append("rect")
            .attr("class", "tnt_exons")
            .attr("x", function (d) {
                return (xScale(d.start + d.offset) - xScale(d.start));
            })
            .attr("y", 0)
            .attr("width", function (d) {
                return (xScale(d.end) - xScale(d.start));
            })
            .attr("height", feature.layout().gene_slot().gene_height)
            .attr("fill", track.color())
            .attr("stroke", track.color())
            .transition()
            .duration(500)
            //.attr("stroke", feature.color())
            .attr("stroke", function (d) {
                return feature.color()(d);
            })
            .attr("fill", function (d) {
                if (d.coding) {
                     return feature.color()(d);
                }
                if (d.coding === false) {
                    return track.color();
                }
                return feature.color()(d);
            });

        // labels
        gs
            .append("text")
            .attr("class", "tnt_name")
            .attr("x", 0)
            .attr("y", 25)
            .attr("fill", track.color())
            .text(function (d) {
                if (feature.layout().gene_slot().show_label) {
                    return d.display_label;
                } else {
                    return "";
                }
            })
            .style("font-weight", "normal")
            .transition()
            .duration(500)
            .attr("fill", function (d) {
                return feature.color()(d);
            });

    });

    feature.distribute (function (transcripts) {
        var track = this;
        var xScale = feature.scale();
        var gs = transcripts.select("g")
            .transition()
            .duration(200)
            .attr("transform", function (d) {
                return "translate(" + xScale(d.start) + "," + (feature.layout().gene_slot().slot_height * d.slot) + ")";
            });
        gs
            .selectAll ("rect")
            .attr("height", feature.layout().gene_slot().gene_height);
        gs
            .selectAll("line")
            .attr("x2", function (d) {
                return (xScale(d.end) - xScale(d.start));
            })
            .attr("y1", ~~(feature.layout().gene_slot().gene_height/2))
            .attr("y2", ~~(feature.layout().gene_slot().gene_height/2));
        gs
            .select ("text")
            .text (function (d) {
                if (feature.layout().gene_slot().show_label) {
                    return d.display_label;
                }
                return "";
            });
    });

    feature.move (function (transcripts) {
        var xScale = feature.scale();
        var gs = transcripts.select("g")
            .attr("transform", function (d) {
                return "translate(" + xScale(d.start) + "," + (feature.layout().gene_slot().slot_height * d.slot) + ")";
            });
        gs.selectAll("line")
            .attr("x2", function (d) {
                return (xScale(d.end) - xScale(d.start));
            })
            .attr("y1", ~~(feature.layout().gene_slot().gene_height/2))
            .attr("y2", ~~(feature.layout().gene_slot().gene_height/2));
            // .attr("width", function (d) {
            //     return (xScale(d.end) - xScale(d.start));
            // })
        gs.selectAll("rect")
            .attr("width", function (d) {
                return (xScale(d.end) - xScale(d.start));
            });
        gs.selectAll(".tnt_exons")
            .attr("x", function (d) {
                return (xScale(d.start + d.offset) - xScale(d.start));
            });

    });

    return feature;
};


var tnt_feature_sequence = function () {

    var config = {
        fontsize : 10,
        sequence : function (d) {
            return d.sequence;
        }
    };

    // 'Inherit' from tnt.track.feature
    var feature = board.track.feature()
    .index (function (d) {
        return d.pos;
    });

    var api = apijs (feature)
    .getset (config);


    feature.create (function (new_nts) {
        var track = this;
        var xScale = feature.scale();

        new_nts
            .append("text")
            .attr("fill", track.color())
            .style('font-size', config.fontsize + "px")
            .attr("x", function (d) {
                return xScale (d.pos) - (config.fontsize/2) + 1;
            })
            .attr("y", function (d) {
                return ~~(track.height() / 2) + 5;
            })
            .style("font-family", '"Lucida Console", Monaco, monospace')
            .text(config.sequence)
            .transition()
            .duration(500)
            .attr('fill', feature.color());
    });

    feature.move (function (nts) {
        var xScale = feature.scale();
        nts.select ("text")
            .attr("x", function (d) {
                return xScale(d.pos) - (config.fontsize/2) + 1;
            });
        });

    return feature;
};

var tnt_feature_gene = function () {

    // 'Inherit' from tnt.track.feature
    var feature = board.track.feature()
    	.layout(board.track.layout.genome())
    	.index(function (d) {
    	    return d.id;
    	});

    feature.create(function (new_elems) {
        var track = this;
        var xScale = feature.scale();
        new_elems
            .append("rect")
            .attr("x", function (d) {
                return xScale(d.start);
            })
            .attr("y", function (d) {
                return feature.layout().gene_slot().slot_height * d.slot;
            })
            .attr("width", function (d) {
                return (xScale(d.end) - xScale(d.start));
            })
            .attr("height", feature.layout().gene_slot().gene_height)
            .attr("fill", track.color())
            .transition()
            .duration(500)
            .attr("fill", function (d) {
                if (d.color === undefined) {
                    return feature.color();
                } else {
                    return d.color;
                }
            });

        new_elems
            .append("text")
            .attr("class", "tnt_name")
            .attr("x", function (d) {
                return xScale(d.start);
            })
            .attr("y", function (d) {
                return (feature.layout().gene_slot().slot_height * d.slot) + 25;
            })
            .attr("fill", track.color())
            .text(function (d) {
                if (feature.layout().gene_slot().show_label) {
                    return d.display_label;
                } else {
                    return "";
                }
            })
            .style("font-weight", "normal")
            .transition()
            .duration(500)
            .attr("fill", function() {
                return feature.color();
            });
    });

    feature.distribute(function (genes) {
        var track = this;
        genes
            .select("rect")
            .transition()
            .duration(500)
            .attr("y", function (d) {
                return (feature.layout().gene_slot().slot_height * d.slot);
            })
            .attr("height", feature.layout().gene_slot().gene_height);

        genes
            .select("text")
            .transition()
            .duration(500)
            .attr("y", function (d) {
                return (feature.layout().gene_slot().slot_height * d.slot) + 25;
            })
            .text(function (d) {
                if (feature.layout().gene_slot().show_label) {
                    return d.display_label;
                } else {
                    return "";
                }
            });
    });

    feature.move(function (genes) {
        var xScale = feature.scale();
        genes.select("rect")
            .attr("x", function (d) {
                return xScale(d.start);
            })
            .attr("width", function (d) {
                return (xScale(d.end) - xScale(d.start));
            });

        genes.select("text")
            .attr("x", function (d) {
                return xScale(d.start);
            });
    });

    return feature;
};

// genome location
 var tnt_feature_location = function () {
     var xScale;
     var row;
     var chr;
     var species;
     var text_cbak = function (sp, chr, from, to) {
         return sp + " " + chr + ":" + from + "-" + to;
     };

     var feature = {};
     feature.reset = function () {};
     feature.plot = function () {};
     feature.init = function () { row = undefined; };
     feature.mover = function () {
         var xScale = feature.scale();
         var domain = xScale.domain();
         row.select ("text")
            .text(text_cbak(species, chr, ~~domain[0], ~~domain[1]));
     };
     feature.update = function (where) {
         chr = where.chr;
         species = where.species;
         var track = this;
         var svg_g = track.g;
         var domain = xScale.domain();
         if (row === undefined) {
             row = svg_g;
             row
                 .append("text")
                 .text(text_cbak(species, chr, ~~domain[0], ~~domain[1]));
         }
     };

     feature.scale = function (s) {
         if (!arguments.length) {
             return xScale;
         }
         xScale = s;
         return this;
     };

     feature.text = function (cbak) {
        if (!arguments.length) {
            return text_cbak;
        }
        text_cbak = cbak;
        return this;
     };

     return feature;
 };

var genome_features = {
    gene : tnt_feature_gene,
    sequence : tnt_feature_sequence,
    transcript : tnt_feature_transcript,
    location : tnt_feature_location,
};
module.exports = exports = genome_features;

},{"./layout.js":57,"tnt.api":24,"tnt.board":26}],55:[function(require,module,exports){
// var ensembl_rest = require("tnt.ensembl")();
var apijs = require("tnt.api");
var tnt_board = require("tnt.board");
tnt_board.track.data.genome = require("./data.js");
tnt_board.track.feature.genome = require("./feature");
tnt_board.track.layout.genome = require("./layout");
tnt_board.track.data.genome.ensembl = require("tnt.rest")()
    .domain("rest.ensembl.org");

tnt_board_genome = function() {
    "use strict";

    var ensembl_rest = tnt_board.track.data.genome.ensembl;

    // Private vars
    var ens_re = /^ENS\w+\d+$/;
    var chr_length;

    // Vars exposed in the API
    var conf = {
        gene           : undefined,
        xref_search    : function () {},
        ensgene_search : function () {},
        context        : 0,
        rest           : ensembl_rest
    };
    // We "inherit" from board
    var genome_browser = tnt_board()
        .zoom_in(200)
        .zoom_out(5000000) // ensembl region limit
        .min(0);

    var gene;

    // The location and axis track
    var location_track = tnt_board.track()
        .height(20)
        .color("white")
        .data(tnt_board.track.data.empty())
        .display(tnt_board.track.feature.genome.location());

    var axis_track = tnt_board.track()
        .height(0)
        .color("white")
        .data(tnt_board.track.data.empty())
        .display(tnt_board.track.feature.axis());

    genome_browser
	   .add_track(location_track)
       .add_track(axis_track);

    // Default location:
    genome_browser
	   .species("human")
       .chr(7)
       .from(139424940)
       .to(141784100);

    // We save the start method of the 'parent' object
    genome_browser._start = genome_browser.start;

    // We hijack parent's start method
    var start = function (where) {
        if (where !== undefined) {
            if (where.gene !== undefined) {
                get_gene(where);
                return;
            } else {
                if (where.species === undefined) {
                    where.species = genome_browser.species();
                } else {
                    genome_browser.species(where.species);
                }
                if (where.chr === undefined) {
                    where.chr = genome_browser.chr();
                } else {
                    genome_browser.chr(where.chr);
                }
                if (where.from === undefined) {
                    where.from = genome_browser.from();
                } else {
                    genome_browser.from(where.from);
                }
                if (where.to === undefined) {
                    where.to = genome_browser.to();
                } else {
                    genome_browser.to(where.to);
                }
            }
        } else { // "where" is undef so look for gene or loc
            if (genome_browser.gene() !== undefined) {
                get_gene({ species : genome_browser.species(),
                    gene    : genome_browser.gene()
                });
                return;
            } else {
                where = {};
                where.species = genome_browser.species();
                where.chr     = genome_browser.chr();
                where.from    = genome_browser.from();
                where.to      = genome_browser.to();
            }
        }

        var url = ensembl_rest.url()
            .endpoint("info/assembly/:species/:region_name")
            .parameters({
                species: where.species,
                region_name: where.chr
            });
        ensembl_rest.call (url)
            .then (function (resp) {
                genome_browser.max(resp.body.length);
                genome_browser._start();
            });
    };

    var homologues = function (ensGene, callback)  {
        var url = ensembl_rest.url.homologues ({id : ensGene});
        ensembl_rest.call(url)
            .then (function(resp) {
                var homologues = resp.body.data[0].homologies;
                if (callback !== undefined) {
                    var homologues_obj = split_homologues(homologues);
                    callback(homologues_obj);
                }
        });
    };

    var isEnsemblGene = function(term) {
        if (term.match(ens_re)) {
            return true;
        } else {
            return false;
        }
    };

    var get_gene = function (where) {
        if (isEnsemblGene(where.gene)) {
            get_ensGene(where.gene);
        } else {
            var url = ensembl_rest.url()
                .endpoint("xrefs/symbol/:species/:symbol")
                .parameters({
                    species: where.species,
                    symbol: where.gene
                });
            ensembl_rest.call(url)
                .then (function(resp) {
                    var data = resp.body;
                    data = data.filter(function(d) {
                        return !d.id.indexOf("ENS");
                    });
                    if (data[0] !== undefined) {
                        get_ensGene(data[0].id);
                    }
                    conf.xref_search(resp, where.gene, where.species);
                });
        }
    };

    var get_ensGene = function (id) {
        var url = ensembl_rest.url()
            .endpoint("/lookup/id/:id")
            .parameters({
                id: id
            });

        ensembl_rest.call(url)
            .then (function(resp) {
                var data = resp.body;
                conf.ensgene_search(data);
                var extra = ~~((data.end - data.start) * (conf.context/100));
                genome_browser
                    .species(data.species)
                    .chr(data.seq_region_name)
                    .from(data.start - extra)
                    .to(data.end + extra);

                genome_browser.start( { species : data.species,
                    chr     : data.seq_region_name,
                    from    : data.start - extra,
                    to      : data.end + extra
                } );
            });
    };

    var split_homologues = function (homologues) {
        var orthoPatt = /ortholog/;
        var paraPatt = /paralog/;

        var orthologues = homologues.filter(function(d){return d.type.match(orthoPatt);});
        var paralogues  = homologues.filter(function(d){return d.type.match(paraPatt);});

        return {
            'orthologues' : orthologues,
            'paralogues'  : paralogues
        };
    };

    var api = apijs(genome_browser)
        .getset (conf);

    api.method ({
        start      : start,
        homologues : homologues
    });

    return genome_browser;
};

module.exports = exports = tnt_board_genome;

},{"./data.js":53,"./feature":54,"./layout":57,"tnt.api":24,"tnt.board":26,"tnt.rest":34}],56:[function(require,module,exports){
var board = require("tnt.board");
board.genome = require("./genome");

module.exports = exports = board;

},{"./genome":55,"tnt.board":26}],57:[function(require,module,exports){
var apijs = require ("tnt.api");

// The overlap detector used for genes
var gene_layout = function() {
    // Private vars
    var max_slots;

    // vars exposed in the API:
    var height = 150;

    var old_elements = [];

    var scale;

    var slot_types = {
        'expanded'   : {
            slot_height : 30,
            gene_height : 10,
            show_label  : true
        },
        'collapsed' : {
            slot_height : 10,
            gene_height : 7,
            show_label  : false
        }
    };
    var current_slot_type = 'expanded';

    // The returned closure / object
    var genes_layout = function (new_genes) {
        var track = this;
        scale = track.display().scale();

        // We make sure that the genes have name
        for (var i = 0; i < new_genes.length; i++) {
            if (new_genes[i].external_name === null) {
                new_genes[i].external_name = "";
            }
        }

        max_slots = ~~(track.height() / slot_types.expanded.slot_height);

        if (genes_layout.keep_slots()) {
            slot_keeper(new_genes, old_elements);
        }
        var needed_slots = collition_detector(new_genes);
        slot_types.collapsed.needed_slots = needed_slots;
        slot_types.expanded.needed_slots = needed_slots;
        if (genes_layout.fixed_slot_type()) {
            current_slot_type = genes_layout.fixed_slot_type();
        }
        else if (needed_slots > max_slots) {
            current_slot_type = 'collapsed';
        } else {
            current_slot_type = 'expanded';
        }

        // run the user-defined callback
        genes_layout.on_layout_run()(slot_types, current_slot_type);

        //conf_ro.elements = new_genes;
        old_elements = new_genes;
        return new_genes;
    };

    var gene_slot = function () {
        return slot_types[current_slot_type];
    };

    var collition_detector = function (genes) {
        var genes_placed = [];
        var genes_to_place = genes;
        var needed_slots = 0;
        for (var j=0; j<genes.length; j++) {
            if (genes[j].slot > needed_slots && genes[j].slot < max_slots) {
                needed_slots = genes[j].slot;
            }
        }

        for (var i=0; i<genes_to_place.length; i++) {
            var genes_by_slot = sort_genes_by_slot(genes_placed);
            var this_gene = genes_to_place[i];
            if (this_gene.slot !== undefined && this_gene.slot < max_slots) {
                if (slot_has_space(this_gene, genes_by_slot[this_gene.slot])) {
                    genes_placed.push(this_gene);
                    continue;
                }
            }
            var slot = 0;
            OUTER: while (true) {
                if (slot_has_space(this_gene, genes_by_slot[slot])) {
                    this_gene.slot = slot;
                    genes_placed.push(this_gene);
                    if (slot > needed_slots) {
                        needed_slots = slot;
                    }
                    break;
                }
                slot++;
            }
        }
        return needed_slots + 1;
    };

    var slot_has_space = function (query_gene, genes_in_this_slot) {
        if (genes_in_this_slot === undefined) {
            return true;
        }
        for (var j=0; j<genes_in_this_slot.length; j++) {
            var subj_gene = genes_in_this_slot[j];
            if (query_gene.id === subj_gene.id) {
                continue;
            }
            var y_label_end = subj_gene.display_label.length * 8 + scale(subj_gene.start); // TODO: It may be better to have a fixed font size (instead of the hardcoded value)?
            var y1  = scale(subj_gene.start);
            var y2  = scale(subj_gene.end) > y_label_end ? scale(subj_gene.end) : y_label_end;
            var x_label_end = query_gene.display_label.length * 8 + scale(query_gene.start);
            var x1 = scale(query_gene.start);
            var x2 = scale(query_gene.end) > x_label_end ? scale(query_gene.end) : x_label_end;
            if ( ((x1 <= y1) && (x2 >= y1)) ||
            ((x1 >= y1) && (x1 <= y2)) ) {
                return false;
            }
        }
        return true;
    };

    var slot_keeper = function (genes, prev_genes) {
        var prev_genes_slots = genes2slots(prev_genes);

        for (var i = 0; i < genes.length; i++) {
            if (prev_genes_slots[genes[i].id] !== undefined) {
                genes[i].slot = prev_genes_slots[genes[i].id];
            }
        }
    };

    var genes2slots = function (genes_array) {
        var hash = {};
        for (var i = 0; i < genes_array.length; i++) {
            var gene = genes_array[i];
            hash[gene.id] = gene.slot;
        }
        return hash;
    };

    var sort_genes_by_slot = function (genes) {
        var slots = [];
        for (var i = 0; i < genes.length; i++) {
            if (slots[genes[i].slot] === undefined) {
                slots[genes[i].slot] = [];
            }
            slots[genes[i].slot].push(genes[i]);
        }
        return slots;
    };

    // API
    var api = apijs (genes_layout)
        .getset ("elements", function () {})
        .getset ("on_layout_run", function () {})
        .getset ("fixed_slot_type")
        .getset ("keep_slots", true)
        .method ({
            gene_slot : gene_slot,
            // height : function () {
            //     return slot_types.expanded.needed_slots * slot_types.expanded.slot_height;
            // }
        });

    // Check that the fixed slot type is valid
    genes_layout.fixed_slot_type.check(function (val) {
            return ((val === "collapsed") || (val === "expanded"));
    });

    return genes_layout;
};

module.exports = exports = gene_layout;

},{"tnt.api":24}],58:[function(require,module,exports){
module.exports = tooltip = require("./src/tooltip.js");

},{"./src/tooltip.js":61}],59:[function(require,module,exports){
module.exports=require(21)
},{"./src/api.js":60}],60:[function(require,module,exports){
module.exports=require(22)
},{}],61:[function(require,module,exports){
var apijs = require("tnt.api");

var tooltip = function () {
    "use strict";

    var drag = d3.behavior.drag();
    var tooltip_div;

    var conf = {
        position : "right",
        allow_drag : true,
        show_closer : true,
        fill : function () { throw "fill is not defined in the base object"; },
        width : 180,
        id : 1
    };

    var t = function (data, event) {
        drag
            .origin(function(){
                return {
                    x : parseInt(d3.select(this).style("left")),
                    y : parseInt(d3.select(this).style("top"))
                };
            })
            .on("drag", function() {
                if (conf.allow_drag) {
                    d3.select(this)
                        .style("left", d3.event.x + "px")
                        .style("top", d3.event.y + "px");
                }
            });

        // TODO: Why do we need the div element?
        // It looks like if we anchor the tooltip in the "body"
        // The tooltip is not located in the right place (appears at the bottom)
        // See clients/tooltips_test.html for an example
        var containerElem = selectAncestor (this, "div");
        if (containerElem === undefined) {
            // We require a div element at some point to anchor the tooltip
            return;
        }

        tooltip_div = d3.select(containerElem)
            .append("div")
            .attr("class", "tnt_tooltip")
            .classed("tnt_tooltip_active", true)  // TODO: Is this needed/used???
            .call(drag);

        // prev tooltips with the same header
        d3.select("#tnt_tooltip_" + conf.id).remove();

        if ((d3.event === null) && (event)) {
            d3.event = event;
        }
        var d3mouse = d3.mouse(containerElem);
        d3.event = null;

        var xoffset = 0;
        if (conf.position === "left") {
            xoffset = conf.width;
        }

        tooltip_div.attr("id", "tnt_tooltip_" + conf.id);

        // We place the tooltip
        tooltip_div
            .style("left", (d3mouse[0] - xoffset) + "px")
            .style("top", (d3mouse[1]) + "px");

        // Close
        if (conf.show_closer) {
            tooltip_div
                .append("div")
                .attr("class", "tnt_tooltip_closer")
                .on ("click", function () {
                    t.close();
                });
        }

        conf.fill.call(tooltip_div.node(), data);

        // return this here?
        return t;
    };

    // gets the first ancestor of elem having tagname "type"
    // example : var mydiv = selectAncestor(myelem, "div");
    function selectAncestor (elem, type) {
        type = type.toLowerCase();
        if (elem.parentNode === null) {
            console.log("No more parents");
            return undefined;
        }
        var tagName = elem.parentNode.tagName;

        if ((tagName !== undefined) && (tagName.toLowerCase() === type)) {
            return elem.parentNode;
        } else {
            return selectAncestor (elem.parentNode, type);
        }
    }

    var api = apijs(t)
        .getset(conf);

    api.check('position', function (val) {
        return (val === 'left') || (val === 'right');
    }, "Only 'left' or 'right' values are allowed for position");

    api.method('close', function () {
        if (tooltip_div) {
            tooltip_div.remove();
        }
    });

    return t;
};

tooltip.list = function () {
    // list tooltip is based on general tooltips
    var t = tooltip();
    var width = 180;

    t.fill (function (obj) {
        var tooltip_div = d3.select(this);
        var obj_info_list = tooltip_div
            .append("table")
            .attr("class", "tnt_zmenu")
            .attr("border", "solid")
            .style("width", t.width() + "px");

        // Tooltip header
        if (obj.header) {
            obj_info_list
                .append("tr")
                .attr("class", "tnt_zmenu_header")
                .append("th")
                .text(obj.header);
        }

        // Tooltip rows
        var table_rows = obj_info_list.selectAll(".tnt_zmenu_row")
            .data(obj.rows)
            .enter()
            .append("tr")
            .attr("class", "tnt_zmenu_row");

        table_rows
            .append("td")
            .style("text-align", "center")
            .html(function(d,i) {
                return obj.rows[i].value;
            })
            .each(function (d) {
                if (d.link === undefined) {
                    return;
                }
                d3.select(this)
                    .classed("link", 1)
                    .on('click', function (d) {
                        d.link(d.obj);
                        t.close.call(this);
                    });
            });
    });
    return t;
};

tooltip.table = function () {
    // table tooltips are based on general tooltips
    var t = tooltip();

    var width = 180;

    t.fill (function (obj) {
        var tooltip_div = d3.select(this);

        var obj_info_table = tooltip_div
            .append("table")
            .attr("class", "tnt_zmenu")
            .attr("border", "solid")
            .style("width", t.width() + "px");

        // Tooltip header
        if (obj.header) {
            obj_info_table
                .append("tr")
                .attr("class", "tnt_zmenu_header")
                .append("th")
                .attr("colspan", 2)
                .text(obj.header);
        }

        // Tooltip rows
        var table_rows = obj_info_table.selectAll(".tnt_zmenu_row")
            .data(obj.rows)
            .enter()
            .append("tr")
            .attr("class", "tnt_zmenu_row");

        table_rows
            .append("th")
            .attr("colspan", function (d, i) {
                if (d.value === "") {
                    return 2;
                }
                return 1;
            })
            .attr("class", function (d) {
                if (d.value === "") {
                    return "tnt_zmenu_inner_header";
                }
                return "tnt_zmenu_cell";
            })
            .html(function(d,i) {
                return obj.rows[i].label;
            });

        table_rows
            .append("td")
            .html(function(d,i) {
                if (typeof obj.rows[i].value === 'function') {
                    obj.rows[i].value.call(this, d);
                } else {
                    return obj.rows[i].value;
                }
            })
            .each(function (d) {
                if (d.value === "") {
                    d3.select(this).remove();
                }
            })
            .each(function (d) {
                if (d.link === undefined) {
                    return;
                }
                d3.select(this)
                .classed("link", 1)
                .on('click', function (d) {
                    d.link(d.obj);
                    t.close.call(this);
                });
            });
    });

    return t;
};

tooltip.plain = function () {
    // plain tooltips are based on general tooltips
    var t = tooltip();

    t.fill (function (obj) {
        var tooltip_div = d3.select(this);

        var obj_info_table = tooltip_div
            .append("table")
            .attr("class", "tnt_zmenu")
            .attr("border", "solid")
            .style("width", t.width() + "px");

        if (obj.header) {
            obj_info_table
                .append("tr")
                .attr("class", "tnt_zmenu_header")
                .append("th")
                .text(obj.header);
        }

        if (obj.body) {
            obj_info_table
                .append("tr")
                .attr("class", "tnt_zmenu_row")
                .append("td")
                .style("text-align", "center")
                .html(obj.body);
        }
    });

    return t;
};

module.exports = exports = tooltip;

},{"tnt.api":59}],62:[function(require,module,exports){
module.exports = require("./src/index.js");

},{"./src/index.js":63}],63:[function(require,module,exports){
// require('fs').readdirSync(__dirname + '/').forEach(function(file) {
//     if (file.match(/.+\.js/g) !== null && file !== __filename) {
// 	var name = file.replace('.js', '');
// 	module.exports[name] = require('./' + file);
//     }
// });

// Same as
var utils = require("./utils.js");
utils.reduce = require("./reduce.js");
module.exports = exports = utils;

},{"./reduce.js":64,"./utils.js":65}],64:[function(require,module,exports){
var reduce = function () {
    var smooth = 5;
    var value = 'val';
    var redundant = function (a, b) {
	if (a < b) {
	    return ((b-a) <= (b * 0.2));
	}
	return ((a-b) <= (a * 0.2));
    };
    var perform_reduce = function (arr) {return arr;};

    var reduce = function (arr) {
	if (!arr.length) {
	    return arr;
	}
	var smoothed = perform_smooth(arr);
	var reduced  = perform_reduce(smoothed);
	return reduced;
    };

    var median = function (v, arr) {
	arr.sort(function (a, b) {
	    return a[value] - b[value];
	});
	if (arr.length % 2) {
	    v[value] = arr[~~(arr.length / 2)][value];	    
	} else {
	    var n = ~~(arr.length / 2) - 1;
	    v[value] = (arr[n][value] + arr[n+1][value]) / 2;
	}

	return v;
    };

    var clone = function (source) {
	var target = {};
	for (var prop in source) {
	    if (source.hasOwnProperty(prop)) {
		target[prop] = source[prop];
	    }
	}
	return target;
    };

    var perform_smooth = function (arr) {
	if (smooth === 0) { // no smooth
	    return arr;
	}
	var smooth_arr = [];
	for (var i=0; i<arr.length; i++) {
	    var low = (i < smooth) ? 0 : (i - smooth);
	    var high = (i > (arr.length - smooth)) ? arr.length : (i + smooth);
	    smooth_arr[i] = median(clone(arr[i]), arr.slice(low,high+1));
	}
	return smooth_arr;
    };

    reduce.reducer = function (cbak) {
	if (!arguments.length) {
	    return perform_reduce;
	}
	perform_reduce = cbak;
	return reduce;
    };

    reduce.redundant = function (cbak) {
	if (!arguments.length) {
	    return redundant;
	}
	redundant = cbak;
	return reduce;
    };

    reduce.value = function (val) {
	if (!arguments.length) {
	    return value;
	}
	value = val;
	return reduce;
    };

    reduce.smooth = function (val) {
	if (!arguments.length) {
	    return smooth;
	}
	smooth = val;
	return reduce;
    };

    return reduce;
};

var block = function () {
    var red = reduce()
	.value('start');

    var value2 = 'end';

    var join = function (obj1, obj2) {
        return {
            'object' : {
                'start' : obj1.object[red.value()],
                'end'   : obj2[value2]
            },
            'value'  : obj2[value2]
        };
    };

    // var join = function (obj1, obj2) { return obj1 };

    red.reducer( function (arr) {
	var value = red.value();
	var redundant = red.redundant();
	var reduced_arr = [];
	var curr = {
	    'object' : arr[0],
	    'value'  : arr[0][value2]
	};
	for (var i=1; i<arr.length; i++) {
	    if (redundant (arr[i][value], curr.value)) {
		curr = join(curr, arr[i]);
		continue;
	    }
	    reduced_arr.push (curr.object);
	    curr.object = arr[i];
	    curr.value = arr[i].end;
	}
	reduced_arr.push(curr.object);

	// reduced_arr.push(arr[arr.length-1]);
	return reduced_arr;
    });

    reduce.join = function (cbak) {
	if (!arguments.length) {
	    return join;
	}
	join = cbak;
	return red;
    };

    reduce.value2 = function (field) {
	if (!arguments.length) {
	    return value2;
	}
	value2 = field;
	return red;
    };

    return red;
};

var line = function () {
    var red = reduce();

    red.reducer ( function (arr) {
	var redundant = red.redundant();
	var value = red.value();
	var reduced_arr = [];
	var curr = arr[0];
	for (var i=1; i<arr.length-1; i++) {
	    if (redundant (arr[i][value], curr[value])) {
		continue;
	    }
	    reduced_arr.push (curr);
	    curr = arr[i];
	}
	reduced_arr.push(curr);
	reduced_arr.push(arr[arr.length-1]);
	return reduced_arr;
    });

    return red;

};

module.exports = reduce;
module.exports.line = line;
module.exports.block = block;


},{}],65:[function(require,module,exports){

module.exports = {
    iterator : function(init_val) {
	var i = init_val || 0;
	var iter = function () {
	    return i++;
	};
	return iter;
    },

    script_path : function (script_name) { // script_name is the filename
	var script_scaped = script_name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	var script_re = new RegExp(script_scaped + '$');
	var script_re_sub = new RegExp('(.*)' + script_scaped + '$');

	// TODO: This requires phantom.js or a similar headless webkit to work (document)
	var scripts = document.getElementsByTagName('script');
	var path = "";  // Default to current path
	if(scripts !== undefined) {
            for(var i in scripts) {
		if(scripts[i].src && scripts[i].src.match(script_re)) {
                    return scripts[i].src.replace(script_re_sub, '$1');
		}
            }
	}
	return path;
    },

    defer_cancel : function (cbak, time) {
        var tick;

        var defer_cancel = function () {
            var args = Array.prototype.slice.call(arguments);
            var that = this;
            clearTimeout(tick);
            tick = setTimeout (function () {
                cbak.apply (that, args);
            }, time);
        };

        return defer_cancel;
    }
};

},{}],66:[function(require,module,exports){
function aggregation (arr, xScale) {
    var lim = 5;
    arr.map (function (d) {
        d.label = "";
        d._px = xScale(d.pos);
    });
    arr.sort (function (a, b) {
        return a.pos - b.pos;
    });
    var groups = [];
    var currGroup = [arr[0]];
    var curr = arr[0];
    for (var i=1; i<arr.length; i++) {
        if ((arr[i]._px - curr._px) < lim) {
            currGroup.push(arr[i]);
            curr = arr[i];
        } else {
            groups.push (currGroup);
            currGroup = [arr[i]];
            curr = arr[i];
        }
    }
    groups.push (currGroup);
    for (var g=0; g<groups.length; g++) {
        if (groups[g].length > 1) {
            var med = groups[g][~~(groups[g].length / 2)];
            med.label = groups[g].length;
        }
    }
}

module.exports = exports = aggregation;

},{}],67:[function(require,module,exports){
var colors = {
    // proteins
    "protein coding"        : d3.rgb('#A00000'),
    "pseudogene"            : d3.rgb('#666666'),
    "processed transcript"  : d3.rgb('#0033FF'),
    "ncRNA"                 : d3.rgb('#8B668B'),
    "antisense"             : d3.rgb('#CBDD8B'),
    "TR gene"               : d3.rgb('#AA00AA'),

    // transcripts
    "non coding transcript" : d3.rgb('#8B668B'),
};

var legends = {
    // gene biotypes
    "protein_coding"                     : "protein coding",
    "pseudogene"                         : "pseudogene",
    "processed_pseudogene"               : "pseudogene",
    "transcribed_processed_pseudogene"   : "pseudogene",
    "unprocessed_pseudogene"             : "pseudogene",
    "polymorphic_pseudogene"             : "pseudogene",
    "unitary_pseudogene"                 : "pseudogene",
    "transcribed_unprocessed_pseudogene" : "pseudogene",
    "TR_V_pseudogene"                    : "pseudogene",
    "processed_transcript"               : "processed transcript",
    "TEC"                                : "processed transcript",
    "sense_overlapping"                  : "processed transcript",
    "miRNA"                              : "ncRNA",
    "lincRNA"                            : "ncRNA",
    "misc_RNA"                           : "ncRNA",
    "snoRNA"                             : "ncRNA",
    "snRNA"                              : "ncRNA",
    "rRNA"                               : "ncRNA",
    "antisense"                          : "antisense",
    "sense_intronic"                     : "antisense",
    "TR_V_gene"                          : "TR gene",
    "TR_C_gene"                          : "TR gene",
    "TR_J_gene"                          : "TR gene",
    "TR_D_gene"                          : "TR gene",


    // transcript biotypes
    "retained_intron"                    : "non coding transcript",
    "nonsense_mediated_decay"            : "protein coding",
};

module.exports = exports = {
    color : colors,
    legend : legends,
};

},{}],68:[function(require,module,exports){
var genome_browser_nav = function () {
    "use strict";

    var show_options = true;
    var show_title = true;
    var title = "";
    var orig;
    var fgColor = "#586471";
    // var chr = 0;
    var gBrowser;

    var theme = function (gB, container) {
        gBrowser = gB;
        var div = d3.select(container)
            .append("div")
            .attr("class", "tnt_nav_wrapper");

        var opts_pane = div
            .append ("div")
            .attr("class", "tnt_nav_pane")
            .style("display", function() {
                if (show_options) {
                    return "inline-block";
                }
                return "none";
            });

        opts_pane
            .append("span")
            .text("Human Chr: " + gB.chr());

        var left_button = opts_pane
            .append("i")
            .attr("title", "go left")
            .attr("class", "cttvGenomeBrowserIcon fa fa-arrow-circle-left fa-2x")
            .on("click", theme.left);

        var zoomIn_button = opts_pane
            .append("i")
            .attr("title", "zoom out")
            .attr("class", "cttvGenomeBrowserIcon fa fa-search-plus fa-2x")
            .on("click", theme.zoomOut);

        var zoomOut_button = opts_pane
            .append("i")
            .attr("title", "zoom in")
            .attr("class", "cttvGenomeBrowserIcon fa fa-search-minus fa-2x")
            .on("click", theme.zoomIn);

        var right_button = opts_pane
            .append("i")
            .attr("title", "go right")
            .attr("class", "cttvGenomeBrowserIcon fa fa-arrow-circle-right fa-2x")
            .on("click", theme.right);

        var origLabel = opts_pane
            .append("i")
            .attr("title", "reload location")
            .attr("class", "cttvGenomeBrowserIcon fa fa-refresh fa-lt")
            .on("click", function () {
                gBrowser.start(orig)
            });

            // We set up the origin:
        if (!orig) {
            if (gBrowser.gene() !== undefined) {
                orig = {
                    species : gBrowser.species(),
                    gene    : gBrowser.gene()
                };
            } else {
                orig = {
                    species : gBrowser.species(),
                    chr     : gBrowser.chr(),
                    from    : gBrowser.from(),
                    to      : gBrowser.to()
                }
            }
        }
        // orig = {
        //     species : gBrowser.species(),
        //     chr     : gBrowser.chr(),
        //     from    : gBrowser.from(),
        //     to      : gBrowser.to()
        // };
    };

    //// API
    theme.left = function () {
        gBrowser.move_left(1.5);
    };

    theme.right = function () {
        gBrowser.move_right(1.5);
    };

    theme.zoomIn = function () {
        gBrowser.zoom(0.5);
    };

    theme.zoomOut = function () {
        gBrowser.zoom(1.5);
    };

    theme.show_options = function(b) {
        show_options = b;
        return this;
    };
    theme.show_title = function(b) {
        show_title = b;
        return this;
    };

    theme.title = function (s) {
        if (!arguments.length) {
            return title;
        }
        title = s;
        return this;
    };

    theme.foreground_color = function (c) {
        if (!arguments.length) {
            return fgColor;
        }
        fgColor = c;
        return this;
    };

    theme.orig = function (p) {
        if (!arguments.length) {
            return orig;
        }
        orig = p;
        return this;
    };

    // theme.chr = function (c) {
    //     if (!arguments.length) {
    //         return chr;
    //     }
    //     chr = c;
    //     return this;
    // };


    return theme;
};

module.exports = exports = genome_browser_nav;

},{}],69:[function(require,module,exports){
var pipelines = function () {

    var rest = {
        ensembl: undefined,
        cttv: undefined,
    };

    var snps = {};
    var data;
    var highlight = {};

    var p = {};

    p.rare = function (genes, efo) {
        var opts, url;
        if (efo) {
            opts = getOpts (genes, ["uniprot", "eva"], efo);
            url = rest.cttv.url.filterby ();
            return rest.cttv.call(url, undefined, opts)
                .then (function (resp) {
                    cttv_highlight(resp);
                    return p.rare(genes);
                });
        }

        opts = getOpts(genes, ["uniprot", "eva"]);
        url = rest.cttv.url.filterby();
        return rest.cttv.call(url, undefined, opts)
            .then (cttv_clinvar)
            .then (ensembl_call_snps)
            .then (ensembl_parse_clinvar_snps)
            .then (extent);
    };

    p.common = function (genes, efo) {
        var opts, url;
        if (efo) {
            opts = getOpts (genes, ["gwas_catalog"], efo);
            url = rest.cttv.url.filterby ();
            return rest.cttv.call(url, undefined, opts)
                .then (function (resp) {
                    cttv_highlight(resp);
                    return p.common (genes);
                });
        }
        opts = getOpts(genes, ["gwas_catalog"]);
        url = rest.cttv.url.filterby ();

        return rest.cttv.call(url, undefined, opts)
            .then (cttv_gwas)
            .then (ensembl_call_snps)
            .then (ensembl_parse_gwas_snps)
            .then (extent);
    };

    // STEPS
    var cttv_highlight = function (resp) {
        for (var i=0; i<resp.body.data.length; i++) {
            var rec = resp.body.data[i];
            var snp_name = rec.variant.id[0].split("/").pop();
            highlight[snp_name] = 1;
        }
    };

    var cttv_clinvar = function (resp) {
        for (var i=0; i<resp.body.data.length; i++) {
            var rec = resp.body.data[i];
            if (rec.type === "genetic_association") {
                var this_snp = rec.variant.id[0];
                var snp_name = this_snp.split("/").pop();
                var variantDB = rec.evidence.gene2variant.provenance_type.database;
                var clinvarId;
                if (variantDB.dbxref) {
                    clinvarId = variantDB.dbxref.url.split("/").pop();
                }
                var this_disease = rec.disease.efo_info;
                var this_target = rec.target.gene_info;

                var refs = [];
                if (rec.evidence.variant2disease.provenance_type.literature) {
                        refs = rec.evidence.variant2disease.provenance_type.literature.references.map(function (ref) {
                            return ref.lit_id.split("/").pop();
                        });
                }

                if (snps[snp_name] === undefined) {
                    snps[snp_name] = {};
                    snps[snp_name].target = this_target;
                    snps[snp_name].name = snp_name;
                    snps[snp_name].efo = [];
                    snps[snp_name].associations = [];
                    snps[snp_name].clinvarId = clinvarId;
                }
                if (highlight[snp_name]) {
                    snps[snp_name].highlight = true;
                }


                var association = {
                    "efo": this_disease.efo_id,
                    "label": this_disease.label,
                    "name": snp_name,
                    "target": this_target.symbol,
                    "pmids": refs
                };
                snps[snp_name].associations.push(association);
                snps[snp_name].efo.push(this_disease.efo_id);

            } else {
                console.error(rec);
            }
        }
        // snps = clinvarSNPs;
        var snp_names = Object.keys(snps);
        return snp_names;
    };

    var ensembl_parse_clinvar_snps = function (resp) {
        // data = [];
        for (var snp_name in resp.body) {
            var snp = resp.body[snp_name];
            var info = snps[snp_name];
            info.pos = snp.mappings[0].start;
            info.val = 1;
            // data.push(info);
        }

        return snps;
    };

    var extent = function (data) {

        var a = [];
        for (var snp in data) {
            if (data.hasOwnProperty(snp)) {
                a.push(data[snp]);
            }
        }

        var xt = d3.extent(a, function (d) {
            return d.pos;
        });
        return {
            extent: xt,
            snps: snps
        };
    };

    var ensembl_parse_gwas_snps = function (resp) {
        // data = [];
        var min = function (arr) {
            var m = Infinity;
            var len = arr.length;
            while (len--) {
                var v = +arr[len].pvalue;
                if (v < m) {
                    m = v;
                }
            }
            return m;
        };

        for (var snp_name in resp.body) {
            if (resp.body.hasOwnProperty(snp_name)) {
                var snp = resp.body[snp_name];
                var info = snps[snp_name];
                info.pos = snp.mappings[0].start;
                info.val = 1 - min(info.study);
                // data.push(info);
            }
        }
        return snps;
    };

    var ensembl_call_snps = function (snp_names) {
        var var_url = rest.ensembl.url()
            .endpoint("/variation/:species")
            .parameters({
                species: "human"
            });
        // var var_url = rest.ensembl.url.variation ({
        //     species : "human"
        // });

        if (snp_names.length) {
            return rest.ensembl
                .call(var_url, {
                    "ids" : snp_names
                });
        }

        // If there are not snps, don't call ensembl
        return new Promise (function (resolve, reject) {
            resolve({body:{}});
        });

    };

    var cttv_gwas = function (resp) {
        for (var i=0; i<resp.body.data.length; i++) {
            var rec = resp.body.data[i];
            var this_snp = rec.variant.id[0];
            var this_disease = rec.disease.efo_info;
            var snp_name = this_snp.split("/").pop();
            var this_target = rec.target.gene_info;
            if (snps[snp_name] === undefined) {
                snps[snp_name] = {};
                snps[snp_name].target = this_target;
                snps[snp_name].study = [];
                snps[snp_name].name = snp_name;
                snps[snp_name].efo = [];
            }
            if (highlight[snp_name]) {
                snps[snp_name].highlight = true;
            }
            snps[snp_name].efo.push(this_disease.efo_id);
            snps[snp_name].study.push ({
                "pmid": rec.evidence.variant2disease.provenance_type.literature.references[0].lit_id,
                "pvalue": rec.evidence.variant2disease.resource_score.value,
                "efo": this_disease.efo_id,
                "efo_label": this_disease.label
            });
        }

        //snps = gwasSNPs;
        var snp_names = Object.keys(snps);
        return snp_names;
    };


    // API
    p.ensemblRestApi = function (r) {
        if (!arguments.length) {
            return rest.ensembl;
        }
        rest.ensembl = r;
        return this;
    };

    p.cttvRestApi = function (r) {
        if (!arguments.length) {
            return rest.cttv;
        }
        rest.cttv = r;
        return this;
    };

    function getOpts (genes, datasources, efo) {
        var opts = {
            //target : genes,
            //_post: genes,
            target: [genes],
            size : 1000,
            datasource : datasources,
            fields : [
                "target.gene_info",
                "disease.efo_info",
                "variant",
                "evidence",
                // "unique_association_fields",
                "type"
            ]
        };
        if (efo !== undefined) {
            opts.disease = [efo];
            opts.expandefo = false;
        }
        return opts;
    }

    return p;
};

module.exports = exports = pipelines;

},{}],70:[function(require,module,exports){
//var ensembl_rest_api = require("tnt.ensembl");
var nav = require("./navigation.js");
var browser_tooltips = require("./tooltips.js");
var aggregation = require("./aggregation.js");
var RSVP = require('rsvp');
var apijs = require("tnt.api");
var biotypes = require("./biotypes.js");
var cttvRestApi = require("cttv.api");
var pipelines = require("./pipelines.js");

var cttv_genome_browser = function() {
    "use strict";

    // Options for the widget
    var conf = {
        links_prefix: "https://www.targetvalidation.org",
        show_links: true,
        show_snps: true,
        show_nav: true,
        cttvRestApi: cttvRestApi().prefix("https://www.targetvalidation.org/api/latest/"),
        efo: undefined
    };

    var tracks = {};

    var navTheme = nav();

    // var show_links   = true;
    // var efo;

    var snp_new_legend;

    // Divs
    var snp_legend_div;
    var navDiv;

    var snpColors = {
        TargetDisease: "#FF0000", // red
        Target: "#3e9999", // blue
        Disease: "#FFD400", // orange
        Other: "#cccccc" // grey
    };

    var ensemblRestApi;

    // div_ids to display different elements
    // They have to be set dynamically because the IDs contain the div_id of the main element containing the plug-in
    var div_id;

    var geneTrackHeight = 0;

    var gBrowser;

    var gBrowserTheme = function(gB, div) {

        // Set the different #ids for the html elements (needs to be lively because they depend on the div_id)
        set_div_id(div);
        gBrowser = gB;
        gB.zoom_in(150);

        ensemblRestApi = tnt.board.track.data.genome.ensembl;
        //ensemblRestApi = gB.rest();

        // If the nav is shown or not
        navTheme
            .show_options(conf.show_nav);

        // tooltips
        var tooltips = browser_tooltips()
            .cttvRestApi (conf.cttvRestApi)
            .ensemblRestApi (ensemblRestApi)
            .prefix (conf.links_prefix)
            .view (gB);

        // Transcript data
        var mixedData = tnt.board.track.data.genome.gene();
        var gene_updater = mixedData.retriever();
        mixedData.retriever (function (loc) {
            return gene_updater(loc)
                .then (function (fullGenes) {
                    var genes = [];
                    for (var i=0; i<fullGenes.length; i++) {
                        var gene = fullGenes[i];
                        if (gene.id !== gB.gene()) {
                            gene.key = gene.id;
                            gene.isGene = true;
                            gene.exons = [{
                                start: gene.start,
                                end: gene.end,
                                coding: true,
                                offset: 0,
                                isGene: true
                            }];
                            genes.push(gene);
                        }
                    }

                    var url = ensemblRestApi.url()
                        .endpoint("/lookup/id/:id")
                        .parameters({
                            id: gB.gene(),
                            expand: true
                        });
                    // var url = ensemblRestApi.url.gene({
                    //     id: gB.gene(),
                    //     expand: true
                    // });
                    return ensemblRestApi.call(url)
                        .then (function (resp) {
                            var g = resp.body;
                            var tss = tnt.board.track.data.genome.transcript().gene2Transcripts(g);
                            for (var i=0; i<tss.length; i++) {
                                var ts = tss[i];
                                if (overlaps([loc.from, loc.to], [ts.start, ts.end])) {
                                    genes.push(ts);
                                }
                            }
                            // genes = genes.concat(tss);
                            genes.map(gene_color);
                            setupLegend(genes);
                            return genes;
                        });
                });
        });

        var overlaps = function (ref, feat) {
            if (ref[0] < feat[0] && ref[1] > feat[1]) { // feat inside
                return true;
            }
            if (ref[0] > feat[0] && ref[1] < feat[1]) { // inside -- right
                return true;
            }
            if (ref[0] > feat[0] && ref[1] > feat[1]) { // inside -- left
                return true;
            }
            if (ref[1] > feat[0] && ref[1] < feat[1]) { // feat expands both sides
                return true;
            }
            return false;
        };

        var setupLegend = function (genes) {
            // And we setup/update the legend
            var biotypes_array = genes.map(function(e){
                return biotypes.legend[e.biotype];
            });
            // also the ones for the transcript of the matching gene
            var transcript_biotypes = genes.filter (function (e2) {
                if (e2.gene) {
                    return e2.gene.id === gB.gene();
                }
                return e2.id === gB.gene();
                //return e2.gene.id === gB.gene();
            }).map (function (e) {
                return biotypes.legend[e.biotype];
                //return biotypes.legend[e.transcript.biotype];
            });

            biotypes_array = biotypes_array.concat(transcript_biotypes);

            var biotypes_hash = {};
            for (var i=0; i<biotypes_array.length; i++) {
                biotypes_hash[biotypes_array[i]] = 1;
            }
            var curr_biotypes = [];
            for (var p in biotypes_hash) {
                if (biotypes_hash.hasOwnProperty(p)) {
                    curr_biotypes.push(p);
                }
            }
            var biotype_legend = gene_legend_div.selectAll(".tnt_biotype_legend")
                .data(curr_biotypes, function(d){
                    return d;
                });

            var new_legend = biotype_legend
                .enter()
                .append("div")
                .attr("class", "tnt_biotype_legend")
                .style("display", "inline");

            new_legend
                .append("div")
                .style("display", "inline-block")
                .style("margin", "0px 5px 0px 15px")
                .style("width", "10px")
                .style("height", "10px")
                .style("border", "1px solid #000")
                .style("background", function(d){
                    return biotypes.color[d];
                });

            new_legend
                .append("text")
                .text(function(d){return d;});

            biotype_legend
                .exit()
                .remove();

        };

        // TRACKS!
        // ClinVar track
        var regionEnsemblPromise = function (loc) {
            var regionUrl = ensemblRestApi.url()
                .endpoint("overlap/region/:species/:region")
                .parameters({
                    species: loc.species,
                    region: (loc.chr + ":" + loc.from + "-" + loc.to),
                    feature: ["gene"]
                });
            // var regionUrl = ensemblRestApi.url.region ({
            //     species: loc.species,
            //     chr: loc.chr,
            //     from: loc.from,
            //     to: loc.to,
            //     features: ["gene"]
            // });
            return ensemblRestApi.call(regionUrl)
                .then (function (resp) {
                    return resp.body;
                });
        };

        var clinvar_updater = tnt.board.track.data.async()
            .retriever (function (loc) {
                return regionEnsemblPromise(loc)
                    .then (function (genes) {
                        var allGenesPromises = [];
                        var geneIds = [];
                        for (var i=0; i<genes.length; i++) {
                            geneIds.push(genes[i].id);
                        }
                        var p = pipelines()
                        .ensemblRestApi (ensemblRestApi)
                        .cttvRestApi (conf.cttvRestApi)
                        .rare(geneIds, conf.efo);
                        allGenesPromises.push(p);
                        return RSVP.all(allGenesPromises);
                    })
                    .then (function (resps) {
                        var flattenedSNPs = [];
                        for (var i=0; i<resps.length; i++) {
                            var resp = resps[i];
                            for (var snp in resp.snps) {
                                if (resp.snps.hasOwnProperty(snp)) {
                                    flattenedSNPs.push (resp.snps[snp]);
                                }
                            }
                        }
                        return flattenedSNPs;
                    });
            });

        var foreground_color = function (d) {
            // highlight means same disease
            if (d.highlight && (gB.gene() === d.target.geneid)) {
                return snpColors.TargetDisease;
            } else if (d.highlight) {
                return snpColors.Disease;
            } else if (gB.gene() === d.target.geneid) {
                return snpColors.Target;
            }
            return snpColors.Other;
        };

        var clinvar_display = tnt.board.track.feature.pin()
            .domain([0.3, 1.2])
            .color (foreground_color)
            .index(function (d) {
                return d.name;
            })
            .on("click", tooltips.snp)
            .layout(tnt.board.track.layout()
                .elements(function(elems) {
                    aggregation(elems, clinvar_display.scale());
                })
            );

        var clinvar_track = tnt.board.track()
            .label("Variants in rare diseases")
            .height(60)
            .color("white")
            .display(clinvar_display)
            .data (clinvar_updater);

        // Async Gwas updater for ALL genes
        // var gwas_spinner = spinner();
        var gwas_updater = tnt.board.track.data.async()
            .retriever (function (loc) {
                return regionEnsemblPromise(loc)
                    .then (function (genes) {
                        var allGenesPromises = [];
                        var geneIds = [];
                        for (var i=0; i<genes.length; i++) {
                            geneIds.push(genes[i].id);
                        }
                        var gene = genes[i];
                        var p = pipelines()
                        .ensemblRestApi (ensemblRestApi)
                        .cttvRestApi (conf.cttvRestApi)
                        .common(geneIds, conf.efo);
                        allGenesPromises.push(p);

                        return RSVP.all(allGenesPromises);
                    })
                    .then (function (resps) {
                        var flattenedSNPs = [];
                        for (var i=0; i<resps.length; i++) {
                            var resp = resps[i];
                            for (var snp in resp.snps) {
                                if (resp.snps.hasOwnProperty(snp)) {
                                    flattenedSNPs.push(resp.snps[snp]);
                                }
                            }
                        }
                        return flattenedSNPs;
                    });
            });

        // Gwas track
        var gwas_display = tnt.board.track.feature.pin()
            .domain([0.3,1.2])
            .index(function (d) {
                return d.name;
            })
            .color (foreground_color)
            .on("click", tooltips.snp)
            .layout(tnt.board.track.layout()
                .elements(function (elems) {
                    aggregation(elems, clinvar_display.scale());
                })
            );

        //var gwas_guider = gwas_display.guider();
        // gwas_display.guider (function (width) {
        //     var track = this;
        //     var p0_offset = 16.11;
        //     var p05_offset = 43.88
        //
        //     // pvalue 0
        //     track.g
        //     .append("line")
        //     .attr("x1", 0)
        //     .attr("y1", p0_offset)
        //     //.attr("y1", y_offset)
        //     .attr("x2", width)
        //         .attr("y2", p0_offset)
        //     //.attr("y2", y_offset)
        //     .attr("stroke", "lightgrey");
        //     track.g
        //     .append("text")
        //     .attr("x", width - 50)
        //     .attr("y", p0_offset + 10)
        //     .attr("font-size", 10)
        //     .attr("fill", "lightgrey")
        //     .text("pvalue 0");

        // pvalue 0.5
        // track.g
        // 	.append("line")
        // 	.attr("x1", 0)
        // 	.attr("y1", p05_offset)
        // 	.attr("x2", width)
        // 	.attr("y2", p05_offset)
        // 	.attr("stroke", "lightgrey")
        // track.g
        // 	.append("text")
        // 	.attr("x", width - 50)
        // 	.attr("y", p05_offset + 10)
        // 	.attr("font-size", 10)
        // 	.attr("fill", "lightgrey")
        // 	.text("pvalue 0.5");

        // continue with rest of guider
        //gwas_guider.call(track, width);

        //});

        var gwas_track = tnt.board.track()
            .label("Variants in common diseases")
            .height(60)
            .color("white")
            .display(gwas_display)
            .data (gwas_updater);

        // Aux track for label
        var transcript_label_track = tnt.board.track()
            .label ("Genes / Transcripts")
            .height(20)
            .color ("#FFFFFF")
            .display(tnt.board.track.feature.block())
            .data(tnt.board.track.data.sync()
                    .retriever (function () {
                        return [];
                    })
            );

        // Transcript / Gene track
        var transcript_track = tnt.board.track()
            .height(geneTrackHeight)
            .color("#FFFFFF")
            .display(tnt.board.track.feature.genome.transcript()
                .color (function (t) {
                    return t.featureColor;
                })
                .on("click", tooltips.gene)
            )
            // .data(transcript_data);
            .data(mixedData);

        // Update the track based on the number of needed slots for the genes
        transcript_track.display().layout()
            .keep_slots(false)
            .fixed_slot_type("expanded")
            .on_layout_run (function (types, current) {
                var needed_height = types.expanded.needed_slots * types.expanded.slot_height;
                if (needed_height !== geneTrackHeight) {
                    if (needed_height < 200) { // Minimum of 200
                        geneTrackHeight = 200;
                    } else {
                        geneTrackHeight = needed_height;
                    }
                    geneTrackHeight = needed_height;
                    transcript_track.height(needed_height);
                    gB.tracks(gB.tracks()); // reorder re-computes track heights
                }
        });


        // Sequence track
        var sequence_track = tnt.board.track()
            .label ("sequence")
            .height(30)
            .color("white")
            .display(tnt.board.track.feature.genome.sequence())
            .data(tnt.board.track.data.genome.sequence()
                .limit(200)
            );

        gBrowserTheme.start();

        // The order of the elements are: Nav div // genome browser div // legend div
        // nav div
        navDiv = d3.select(div)
            .append("div")
            .style("width", "950px");
        // Navigation
        navTheme (gBrowser, navDiv.node());

        gBrowser(div);

        // The legend for the gene colors
        var gene_legend_div = d3.select(div)
            .append("div")
            .attr("class", "tnt_legend_div");

        gene_legend_div
            .append("text")
            .attr("class", "tnt_legend_header")
            .text("Gene legend:");

         d3.selectAll("tnt_biotype")
            .data(transcript_track.data().elements());

        // The legen for the snps colors
        snp_legend_div = d3.select(div)
            .append("div")
            .attr("class", "tnt_legend_div");
        snp_legend_div
            .append("text")
            .attr("class", "tnt_legend_header")
            .text("SNPs legend:");

        if (conf.show_snps) {
            tracks.common_snps = gwas_track;
            gBrowser.add_track(gwas_track);

            tracks.rare_snps = clinvar_track;
            gBrowser.add_track(clinvar_track);
        }

        tracks.gene = transcript_track;
        gBrowser
            .add_track(sequence_track)
            .add_track(transcript_label_track)
            .add_track(transcript_track);


        // Links div
        var links_pane = d3.select(div)
            .append("div")
            .attr("class", "tnt_links_pane")
            .style("display", function() {
                if (conf.show_links) {
                    return "block";
                } else {
                    return "none";
                }
            });

        // ensembl
        links_pane
            .append("span")
            .text("Open in Ensembl");

        var ensemblLoc = links_pane
            .append("i")
            .attr("title", "open region in ensembl")
            .attr("class", "cttvGenomeBrowserIcon fa fa-external-link fa-2x")
            .on("click", function() {var link = buildEnsemblLink(); window.open(link, "_blank");});

    };

    ///*********************////
    /// RENDERING FUNCTIONS ////
    ///*********************////
    // API
    // DATA
    var start = function () {
        var geneUrl = ensemblRestApi.url()
            .endpoint("lookup/id/:id")
            .parameters({
                id: gBrowser.gene()
            });
        // var geneUrl = ensemblRestApi.url.gene ({
        //     id: gB.gene()
        // });
        var genePromise = ensemblRestApi.call(geneUrl)
            .then (function (resp) {
                return resp.body;
            });

        var diseasePromise;
        if (conf.efo) {
            var efoUrl = conf.cttvRestApi.url.disease({
                code: conf.efo
            });

            diseasePromise = conf.cttvRestApi.call(efoUrl)
                .then (function (resp) {
                    return resp.body;
                });
        }

        // // SNPs ClinVar
        var snpsClinvarPromise;
        if (conf.show_snps) {
            snpsClinvarPromise = pipelines()
                .ensemblRestApi (ensemblRestApi)
                .cttvRestApi (conf.cttvRestApi)
                .rare (gBrowser.gene());
        } else {
            snpsClinvarPromise = new Promise (function (res, rej) {
                res({});
            });
        }

        // // SNP GWASs
        var snpsGwasPromise;
        if (conf.show_snps) {
            snpsGwasPromise = pipelines()
                .ensemblRestApi (ensemblRestApi)
                .cttvRestApi (conf.cttvRestApi)
                .common (gBrowser.gene());
        } else {
            snpsGwasPromise = new Promise (function (resolve, reject) {
                resolve({});
            });
        }

        RSVP.all ([genePromise, snpsGwasPromise, snpsClinvarPromise, diseasePromise])
            .then (function (resps) {
                var disease = resps[3];
                var gene = resps[0];
                fillSNPLegend (gene, disease);
                var gene_extent = [gene.start, gene.end];
                var gwas_extent = resps[1].extent;
                var clinvar_extent = resps[2].extent;

                var gwasLength = gwas_extent ? (gwas_extent[1] - gwas_extent[0]) : 0;
                var clinvarLength = clinvar_extent ? (clinvar_extent[1] - clinvar_extent[0]) : 0;
                var geneLength = gene_extent[1] - gene_extent[0];
                //
                var gwasStart = gwas_extent ? (~~(gwas_extent[0] - (gwasLength/5))) : Infinity;
                var gwasEnd   = gwas_extent ? (~~(gwas_extent[1] + (gwasLength/5))) : -Infinity;
                var clinvarStart = clinvar_extent ? (~~(clinvar_extent[0] - (clinvarLength/5))) : Infinity;
                var clinvarEnd = clinvar_extent ? (~~(clinvar_extent[1] + (clinvarLength/5))) : -Infinity;
                var geneStart = ~~(gene_extent[0] - (geneLength/5));
                var geneEnd   = ~~(gene_extent[1] + (geneLength/5));
                //
                var start = d3.min([gwasStart||Infinity, geneStart, clinvarStart||Infinity]);
                var end   = d3.max([gwasEnd||0, geneEnd, clinvarEnd||0]);
                //
                // var zoomOut = (gene.end - gene.start) + 100;
                // gB.zoom_out(zoomOut);
                // We can finally start!
                gBrowser.chr(gene.seq_region_name);
                navTheme.orig ({
                    from : start,
                    to : end
                });
                gBrowser.start({from: start, to: end});

            });
    };

    var fillSNPLegend = function (gene, disease) {
        var snp_legend_data = [];
        if (disease) {
            snp_legend_data.push({
                label: "SNP in " + gene.display_name + " associated with " + disease.label,
                color: snpColors.TargetDisease
            });
            snp_legend_data.push({
                label: "SNP associated with " + disease.label + " in other genes",
                color: snpColors.Disease
            });
        }
        snp_legend_data.push({
            label: "SNP in " + gene.display_name,
            color: snpColors.Target
        });
        snp_legend_data.push({
            label: "Other SNP",
            color: snpColors.Other
        });

        snp_new_legend = snp_legend_div.selectAll(".tnt_snp_legend")
            .data(snp_legend_data)
            .enter()
            .append("div")
            .attr("class", "tnt_snp_legend");

        snp_new_legend
            .append("div")
            .attr("class", "tnt_legend_item")
            .style("display", "inline-block")
            .style("margin", "0px 5px 0px 15px")
            .style("width", "10px")
            .style("height", "10px")
            .style("border", "1px solid #000")
            .style("border-radius", "5px")
            .style("background", function(d){
                return d.color;
            });

        snp_new_legend
            .append("text")
            .text(function(d) {
                return d.label;
            });

    };

    apijs(gBrowserTheme)
        .getset(conf)
        .method('start', start)
        .method ("track", function (name) {
            switch (name) {
                case "gene":
                return tracks.gene;
                case "common_snps":
                return tracks.common_snps;
                case "rare_snps":
                return tracks.rare_snpsf;
            }
            return; // No track returned
        });

    var set_div_id = function(div) {
        div_id = d3.select(div).attr("id");
    };


    ///*********************////
    /// UTILITY METHODS     ////
    ///*********************////
    // Private methods

    var buildEnsemblLink = function() {
        var url = "http://www.ensembl.org/" + gBrowser.species() + "/Location/View?r=" + gBrowser.chr() + "%3A" + gBrowser.from() + "-" + gBrowser.to();
        return url;
    };


    function gene_color (transcript) {
        var biotype = transcript.biotype;

        var color = biotypes.color[biotypes.legend[biotype]];
        transcript.featureColor = color;

        // colors must be set in the exons too
        for (var i=0; i<transcript.exons.length; i++) {
            transcript.exons[i].featureColor = color;
        }

    }

    // Public methods


    /** <strong>buildEnsemblGeneLink</strong> returns the Ensembl url pointing to the gene summary of the given gene
    @param {String} gene The Ensembl gene id. Should be a valid ID of the form ENSGXXXXXXXXX"
    @returns {String} The Ensembl URL for the given gene
    */
    var buildEnsemblGeneLink = function(ensID) {
        //"http://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000139618"
        var url = "http://www.ensembl.org/" + gBrowser.species() + "/Gene/Summary?g=" + ensID;
        return url;
    };

    return gBrowserTheme;
};

module.exports = exports = cttv_genome_browser;

},{"./aggregation.js":66,"./biotypes.js":67,"./navigation.js":68,"./pipelines.js":69,"./tooltips.js":71,"cttv.api":3,"rsvp":20,"tnt.api":21}],71:[function(require,module,exports){

var tnt_tooltip = require("tnt.tooltip");
var apijs = require("tnt.api");

var tooltips = function () {

    var conf = {
        cttvRestApi : undefined,
        ensemblRestApi : undefined,
        prefix : undefined,
        view : undefined
    };

    var id = 1;
    var target;

    var m = {};

    var api = apijs(m)
        .getset(conf);

    var snp_data = function (data, ensembl_data) {
        var obj = {};
        obj.header = data.name;
        obj.rows = [];
        if (ensembl_data) {
            obj.rows.push({
                "label" : "Ancestral allele",
                "value" : ensembl_data.ancestral_allele
            });
            obj.rows.push({
                "label" : "Allele string",
                "value" : ensembl_data.mappings[0].allele_string
            });
            obj.rows.push({
                "label" : "Most severe consequence",
                "value" : ensembl_data.most_severe_consequence
            });
            if (ensembl_data.MAF) {
                obj.rows.push({
                    "label" : "MAF",
                    "value" : ensembl_data.MAF
                });
            }
            obj.rows.push({
                "label" : "Location",
                "link" : function (d) {
                conf.view.start({
                    from : d.pos - 50,
                    to   : d.pos + 50
                });
                },
                obj : data,
                value : "Jump to sequence"
            });
            obj.rows.push({
                "label": "target",
                "value": data.target.symbol
            });
        }
        if (data.associations && data.associations.length) {
            obj.rows.push({
                "label" : "Associations",
                "value" : ""
            });

            for (var i=0; i<data.associations.length; i++) {
                var association = data.associations[i];
                obj.rows.push({
                    "label" : "<a href=" + conf.prefix + "/evidence/" + data.target.geneid + "/" + (association.efo.split("/").pop()) + ">" + association.label + "</a>",
                    "value" : association.pmids.length + (association.pmids.length === 1 ? " article" : " articles") + "  <a href='http://europepmc.org/search?query=" + association.pmids.map(function (d) {return "EXT_ID:"+d;}).join("%20OR%20") + "' target=_blank <i class='fa fa-newspaper-o fa-lg'></i></a>"
                });
            }
        }
        if (data.study && data.study.length) {
            obj.rows.push({
                "label" : "Associations",
                "value" : ""
            });

            for (var i=0; i<data.study.length; i++) {
                obj.rows.push({
                    "label" : "<a href='" + conf.prefix + "/evidence/" + data.target.geneid + "/"+ (data.study[i].efo.split("/").pop()) + "'>" + data.study[i].efo_label + '</a>',
                    "value" : parseFloat(data.study[i].pvalue).toPrecision(1) + " <a target=_blank href='http://europepmc.org/abstract/med/" + (data.study[i].pmid.split("/").pop()) + "'><i class='fa fa-newspaper-o fa-lg'></i></a>"
                });
            }
        }

        return obj;

    };

    // Tooltip on GWAS
    api.method('snp', function (data) {
        var t = tnt.tooltip.table()
            .width(250)
            .id(id);
        var event = d3.event;
        var elem = this;
        var spinner = tnt.tooltip.plain()
            .id(id);
        var url = conf.ensemblRestApi.url()
            .endpoint("/variation/:species")
            .parameters({
                species: "human"
            });
        // var url = conf.ensemblRestApi.url.variation({
        //     species : "human"
        // });
        conf.ensemblRestApi.call (url, {
            "ids" : [data.name]
        })
            .catch (function () {
                console.log("NO VARIANT INFORMATION FOR THIS SNP");
            })
            .then (function (resp) {
                var obj = snp_data (data, resp.body[data.name]);
                t.call (elem, obj, event);
            });
            spinner.call (elem, {
                header : data.name,
                body : "<i class='fa fa-spinner fa-2x fa-spin'></i>"
            });
    });

    // Tooltip on genes
    api.method('gene', function (gene) {

        // Gene tooltip data
        var tooltip_obj = function (ensemblData, cttvData, transcriptData) {

            var obj = {};
            obj.header = (ensemblData.display_name || ensemblData.external_name) + " (" + ensemblData.id + ")";
            obj.rows = [];

            // Associations and target links maybe
            var associationsValue;
            var targetValue;
            if (cttvData && cttvData.data && cttvData.data.length > 0) {
                associationsValue = "<a href='" + conf.prefix + "/target/" + ensemblData.id + "/associations'>" + (cttvData.data.length) + " disease associations</a> ";
                targetValue = "<a href='" + conf.prefix + "/target/" + ensemblData.id + "'>View CTTV profile</a>";
            }

            obj.rows.push ({
                "label" : "Gene",
                "value" : ""
            });
            obj.rows.push( {
                "label" : "Biotype",
                "value" : ensemblData.biotype
            });
            obj.rows.push({
                "label" : "Location",
                "value" : "<a target='_blank' href='http://www.ensembl.org/Homo_sapiens/Location/View?db=core;g=" + ensemblData.id + "'>" + ensemblData.seq_region_name + ":" + ensemblData.start + "-" + ensemblData.end + "</a>"
            });
            if (associationsValue !== undefined) {
                obj.rows.push({
                    "label" : "Associations",
                    "value" : associationsValue
                });
            }
            if (targetValue !== undefined) {
                obj.rows.push({
                    "label" : "CTTV Profile",
                    "value" : targetValue
                });
            }
            obj.rows.push( {
                "label" : "Description",
                "value" : ensemblData.description
            });

            if (transcriptData) {
                obj.rows.push({
                    "label" : "Transcript",
                    "value" : ""
                });

                obj.rows.push({
                    "label" : "Name",
                    "value" : transcriptData.display_name
                });

                obj.rows.push({
                    "label" : "ID",
                    "value" : "<a target='_blank' href='http://www.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;t=" + transcriptData.id + "'>" + transcriptData.id + "</a>"
                });

                obj.rows.push({
                    "label" : "biotype",
                    "value" : transcriptData.biotype
                });
            }

            return obj;
        };


        var t = tnt_tooltip.table()
            .id(id);
        var event = d3.event;
        var elem = this;

        var s = tnt_tooltip.plain()
            .id(id);

        var url = conf.cttvRestApi.url.associations ({
            "target" : (gene.isGene ? gene.id : gene.gene.id),
            "datastructure" : "flat",
            "filterbyscorevalue_min": 0,
            "stringency": 1
        });
        conf.cttvRestApi.call(url)
            .catch (function (x) {
                var obj = tooltip_obj(gene);
                t.call(elem, obj, event);
            })
            .then(function (resp) {
                var obj;
                if (gene.isGene) {
                    obj = tooltip_obj (gene, resp.body);
                } else {
                    obj = tooltip_obj (gene.gene, resp.body, gene); // gene is a transcript
                }
                // var obj = tooltip_obj (gene, resp.body);
                t.call(elem, obj, event);
            });

        s.call(elem, {
            header : (gene.isGene? gene.external_name + " (" + gene.gene_id + ")" : gene.gene.display_name + "(" + gene.gene.id + ")"),
            body : "<i class='fa fa-spinner fa-2x fa-spin'></i>"
        });

    });


    // m.ensemblRestApi = function (api) {
    //     if (!arguments.length) {
    //         return ensemblRestApi;
    //     }
    //     ensemblRestApi = api;
    //     return this;
    // };
    //
    // m.cttvRestApi = function (api) {
    //     if (!arguments.length) {
    //         return cttvRestApi;
    //     }
    //     cttvRestApi = api;
    //     return this;
    // };
    //
    // m.view = function (v) {
    //     if (!arguments.length) {
    //         return view;
    //     }
    //     view = v;
    //     return this;
    // };

    return m;
};

module.exports = exports = tooltips;

},{"tnt.api":21,"tnt.tooltip":58}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL2Zha2VfOTI1MzI1NTIuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9pbmRleC5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy9jdHR2LmFwaS9pbmRleC5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy9jdHR2LmFwaS9ub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9lczYtcHJvbWlzZS5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy9jdHR2LmFwaS9ub2RlX21vZHVsZXMvaHR0cHBsZWFzZS1wcm9taXNlcy9odHRwcGxlYXNlLXByb21pc2VzLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RhcmdldEdlbm9tZUJyb3dzZXIvbm9kZV9tb2R1bGVzL2N0dHYuYXBpL25vZGVfbW9kdWxlcy9odHRwcGxlYXNlL2xpYi9lcnJvci5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy9jdHR2LmFwaS9ub2RlX21vZHVsZXMvaHR0cHBsZWFzZS9saWIvaW5kZXguanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvY3R0di5hcGkvbm9kZV9tb2R1bGVzL2h0dHBwbGVhc2UvbGliL3JlcXVlc3QuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvY3R0di5hcGkvbm9kZV9tb2R1bGVzL2h0dHBwbGVhc2UvbGliL3Jlc3BvbnNlLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RhcmdldEdlbm9tZUJyb3dzZXIvbm9kZV9tb2R1bGVzL2N0dHYuYXBpL25vZGVfbW9kdWxlcy9odHRwcGxlYXNlL2xpYi91dGlscy9kZWxheS5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy9jdHR2LmFwaS9ub2RlX21vZHVsZXMvaHR0cHBsZWFzZS9saWIvdXRpbHMvb25jZS5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy9jdHR2LmFwaS9ub2RlX21vZHVsZXMvaHR0cHBsZWFzZS9saWIveGhyLWJyb3dzZXIuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvY3R0di5hcGkvbm9kZV9tb2R1bGVzL2h0dHBwbGVhc2Uvbm9kZV9tb2R1bGVzL3h0ZW5kL2luZGV4LmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RhcmdldEdlbm9tZUJyb3dzZXIvbm9kZV9tb2R1bGVzL2N0dHYuYXBpL25vZGVfbW9kdWxlcy9odHRwcGxlYXNlL3BsdWdpbnMvY2xlYW51cmwuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvY3R0di5hcGkvbm9kZV9tb2R1bGVzL2h0dHBwbGVhc2UvcGx1Z2lucy9qc29uLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RhcmdldEdlbm9tZUJyb3dzZXIvbm9kZV9tb2R1bGVzL2N0dHYuYXBpL25vZGVfbW9kdWxlcy9odHRwcGxlYXNlL3BsdWdpbnMvanNvbnJlcXVlc3QuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvY3R0di5hcGkvbm9kZV9tb2R1bGVzL2h0dHBwbGVhc2UvcGx1Z2lucy9qc29ucmVzcG9uc2UuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvY3R0di5hcGkvc3JjL2N0dHZBcGkuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvcnN2cC9kaXN0L3JzdnAuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvdG50LmFwaS9pbmRleC5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy90bnQuYXBpL3NyYy9hcGkuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvdG50Lmdlbm9tZS9pbmRleC5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy90bnQuZ2Vub21lL25vZGVfbW9kdWxlcy90bnQuYm9hcmQvaW5kZXguanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvdG50Lmdlbm9tZS9ub2RlX21vZHVsZXMvdG50LmJvYXJkL3NyYy9ib2FyZC5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy90bnQuZ2Vub21lL25vZGVfbW9kdWxlcy90bnQuYm9hcmQvc3JjL2RhdGEuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvdG50Lmdlbm9tZS9ub2RlX21vZHVsZXMvdG50LmJvYXJkL3NyYy9mZWF0dXJlLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RhcmdldEdlbm9tZUJyb3dzZXIvbm9kZV9tb2R1bGVzL3RudC5nZW5vbWUvbm9kZV9tb2R1bGVzL3RudC5ib2FyZC9zcmMvaW5kZXguanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvdG50Lmdlbm9tZS9ub2RlX21vZHVsZXMvdG50LmJvYXJkL3NyYy9sYXlvdXQuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvdG50Lmdlbm9tZS9ub2RlX21vZHVsZXMvdG50LmJvYXJkL3NyYy9zcGlubmVyLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RhcmdldEdlbm9tZUJyb3dzZXIvbm9kZV9tb2R1bGVzL3RudC5nZW5vbWUvbm9kZV9tb2R1bGVzL3RudC5ib2FyZC9zcmMvdHJhY2suanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvdG50Lmdlbm9tZS9ub2RlX21vZHVsZXMvdG50LnJlc3QvaW5kZXguanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvdG50Lmdlbm9tZS9ub2RlX21vZHVsZXMvdG50LnJlc3Qvbm9kZV9tb2R1bGVzL2VzNi1wcm9taXNlL2Rpc3QvZXM2LXByb21pc2UuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvdG50Lmdlbm9tZS9ub2RlX21vZHVsZXMvdG50LnJlc3Qvc3JjL3Jlc3QuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvdG50Lmdlbm9tZS9ub2RlX21vZHVsZXMvdG50LnJlc3Qvc3JjL3VybC5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy90bnQuZ2Vub21lL3NyYy9kYXRhLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RhcmdldEdlbm9tZUJyb3dzZXIvbm9kZV9tb2R1bGVzL3RudC5nZW5vbWUvc3JjL2ZlYXR1cmUuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvdG50Lmdlbm9tZS9zcmMvZ2Vub21lLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RhcmdldEdlbm9tZUJyb3dzZXIvbm9kZV9tb2R1bGVzL3RudC5nZW5vbWUvc3JjL2luZGV4LmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RhcmdldEdlbm9tZUJyb3dzZXIvbm9kZV9tb2R1bGVzL3RudC5nZW5vbWUvc3JjL2xheW91dC5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy90bnQudG9vbHRpcC9pbmRleC5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy90bnQudG9vbHRpcC9zcmMvdG9vbHRpcC5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy90bnQudXRpbHMvaW5kZXguanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9ub2RlX21vZHVsZXMvdG50LnV0aWxzL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy90bnQudXRpbHMvc3JjL3JlZHVjZS5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90YXJnZXRHZW5vbWVCcm93c2VyL25vZGVfbW9kdWxlcy90bnQudXRpbHMvc3JjL3V0aWxzLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RhcmdldEdlbm9tZUJyb3dzZXIvc3JjL2FnZ3JlZ2F0aW9uLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RhcmdldEdlbm9tZUJyb3dzZXIvc3JjL2Jpb3R5cGVzLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RhcmdldEdlbm9tZUJyb3dzZXIvc3JjL25hdmlnYXRpb24uanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9zcmMvcGlwZWxpbmVzLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RhcmdldEdlbm9tZUJyb3dzZXIvc3JjL3RhcmdldEdlbm9tZUJyb3dzZXIuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdGFyZ2V0R2Vub21lQnJvd3Nlci9zcmMvdG9vbHRpcHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOThCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9qREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeDFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDejhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTs7Ozs7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVSQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3c0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLy8gdG50IGdsb2JhbFxuaWYgKHR5cGVvZiB0bnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB0bnQgPSB7fTtcbn1cbnRudC5ib2FyZCA9IHJlcXVpcmUoXCJ0bnQuZ2Vub21lXCIpO1xudG50LnV0aWxzID0gcmVxdWlyZShcInRudC51dGlsc1wiKTtcbnRudC50b29sdGlwID0gcmVxdWlyZShcInRudC50b29sdGlwXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2luZGV4LmpzXCIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB0YXJnZXRHZW5vbWVCcm93c2VyID0gcmVxdWlyZShcIi4vc3JjL3RhcmdldEdlbm9tZUJyb3dzZXIuanNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGN0dHZBcGkgPSByZXF1aXJlKFwiLi9zcmMvY3R0dkFwaS5qc1wiKTtcbiIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwpe1xuLyohXG4gKiBAb3ZlcnZpZXcgZXM2LXByb21pc2UgLSBhIHRpbnkgaW1wbGVtZW50YXRpb24gb2YgUHJvbWlzZXMvQSsuXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNCBZZWh1ZGEgS2F0eiwgVG9tIERhbGUsIFN0ZWZhbiBQZW5uZXIgYW5kIGNvbnRyaWJ1dG9ycyAoQ29udmVyc2lvbiB0byBFUzYgQVBJIGJ5IEpha2UgQXJjaGliYWxkKVxuICogQGxpY2Vuc2UgICBMaWNlbnNlZCB1bmRlciBNSVQgbGljZW5zZVxuICogICAgICAgICAgICBTZWUgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2pha2VhcmNoaWJhbGQvZXM2LXByb21pc2UvbWFzdGVyL0xJQ0VOU0VcbiAqIEB2ZXJzaW9uICAgMi4zLjBcbiAqL1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHV0aWxzJCRvYmplY3RPckZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJyB8fCAodHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNGdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHV0aWxzJCRpc01heWJlVGhlbmFibGUoeCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsO1xuICAgIH1cblxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkdXRpbHMkJF9pc0FycmF5O1xuICAgIGlmICghQXJyYXkuaXNBcnJheSkge1xuICAgICAgbGliJGVzNiRwcm9taXNlJHV0aWxzJCRfaXNBcnJheSA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkdXRpbHMkJF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgICB9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHV0aWxzJCRpc0FycmF5ID0gbGliJGVzNiRwcm9taXNlJHV0aWxzJCRfaXNBcnJheTtcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbiA9IDA7XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkdmVydHhOZXh0O1xuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkY3VzdG9tU2NoZWR1bGVyRm47XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXAgPSBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuXSA9IGNhbGxiYWNrO1xuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHF1ZXVlW2xpYiRlczYkcHJvbWlzZSRhc2FwJCRsZW4gKyAxXSA9IGFyZztcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRsZW4gKz0gMjtcbiAgICAgIGlmIChsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuID09PSAyKSB7XG4gICAgICAgIC8vIElmIGxlbiBpcyAyLCB0aGF0IG1lYW5zIHRoYXQgd2UgbmVlZCB0byBzY2hlZHVsZSBhbiBhc3luYyBmbHVzaC5cbiAgICAgICAgLy8gSWYgYWRkaXRpb25hbCBjYWxsYmFja3MgYXJlIHF1ZXVlZCBiZWZvcmUgdGhlIHF1ZXVlIGlzIGZsdXNoZWQsIHRoZXlcbiAgICAgICAgLy8gd2lsbCBiZSBwcm9jZXNzZWQgYnkgdGhpcyBmbHVzaCB0aGF0IHdlIGFyZSBzY2hlZHVsaW5nLlxuICAgICAgICBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGN1c3RvbVNjaGVkdWxlckZuKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGN1c3RvbVNjaGVkdWxlckZuKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2goKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzZXRTY2hlZHVsZXIoc2NoZWR1bGVGbikge1xuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGN1c3RvbVNjaGVkdWxlckZuID0gc2NoZWR1bGVGbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2V0QXNhcChhc2FwRm4pIHtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwID0gYXNhcEZuO1xuICAgIH1cblxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3NlcldpbmRvdyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRicm93c2VyR2xvYmFsID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJGJyb3dzZXJXaW5kb3cgfHwge307XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgbGliJGVzNiRwcm9taXNlJGFzYXAkJGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGlzTm9kZSA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB7fS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXSc7XG5cbiAgICAvLyB0ZXN0IGZvciB3ZWIgd29ya2VyIGJ1dCBub3QgaW4gSUUxMFxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkaXNXb3JrZXIgPSB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2YgaW1wb3J0U2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCc7XG5cbiAgICAvLyBub2RlXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZU5leHRUaWNrKCkge1xuICAgICAgdmFyIG5leHRUaWNrID0gcHJvY2Vzcy5uZXh0VGljaztcbiAgICAgIC8vIG5vZGUgdmVyc2lvbiAwLjEwLnggZGlzcGxheXMgYSBkZXByZWNhdGlvbiB3YXJuaW5nIHdoZW4gbmV4dFRpY2sgaXMgdXNlZCByZWN1cnNpdmVseVxuICAgICAgLy8gc2V0SW1tZWRpYXRlIHNob3VsZCBiZSB1c2VkIGluc3RlYWQgaW5zdGVhZFxuICAgICAgdmFyIHZlcnNpb24gPSBwcm9jZXNzLnZlcnNpb25zLm5vZGUubWF0Y2goL14oPzooXFxkKylcXC4pPyg/OihcXGQrKVxcLik/KFxcKnxcXGQrKSQvKTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZlcnNpb24pICYmIHZlcnNpb25bMV0gPT09ICcwJyAmJiB2ZXJzaW9uWzJdID09PSAnMTAnKSB7XG4gICAgICAgIG5leHRUaWNrID0gc2V0SW1tZWRpYXRlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBuZXh0VGljayhsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2gpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyB2ZXJ0eFxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VWZXJ0eFRpbWVyKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkdmVydHhOZXh0KGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgdmFyIG9ic2VydmVyID0gbmV3IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRCcm93c2VyTXV0YXRpb25PYnNlcnZlcihsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2gpO1xuICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBub2RlLmRhdGEgPSAoaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDIpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyB3ZWIgd29ya2VyXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZU1lc3NhZ2VDaGFubmVsKCkge1xuICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZVNldFRpbWVvdXQoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNldFRpbWVvdXQobGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoLCAxKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZSA9IG5ldyBBcnJheSgxMDAwKTtcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2goKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRsZW47IGkrPTIpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHF1ZXVlW2ldO1xuICAgICAgICB2YXIgYXJnID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHF1ZXVlW2krMV07XG5cbiAgICAgICAgY2FsbGJhY2soYXJnKTtcblxuICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWVbaV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtpKzFdID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuID0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXR0ZW1wdFZlcnRleCgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciByID0gcmVxdWlyZTtcbiAgICAgICAgdmFyIHZlcnR4ID0gcigndmVydHgnKTtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHZlcnR4TmV4dCA9IHZlcnR4LnJ1bk9uTG9vcCB8fCB2ZXJ0eC5ydW5PbkNvbnRleHQ7XG4gICAgICAgIHJldHVybiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlVmVydHhUaW1lcigpO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlU2V0VGltZW91dCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaDtcbiAgICAvLyBEZWNpZGUgd2hhdCBhc3luYyBtZXRob2QgdG8gdXNlIHRvIHRyaWdnZXJpbmcgcHJvY2Vzc2luZyBvZiBxdWV1ZWQgY2FsbGJhY2tzOlxuICAgIGlmIChsaWIkZXM2JHByb21pc2UkYXNhcCQkaXNOb2RlKSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VOZXh0VGljaygpO1xuICAgIH0gZWxzZSBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG4gICAgfSBlbHNlIGlmIChsaWIkZXM2JHByb21pc2UkYXNhcCQkaXNXb3JrZXIpIHtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZU1lc3NhZ2VDaGFubmVsKCk7XG4gICAgfSBlbHNlIGlmIChsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3NlcldpbmRvdyA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhdHRlbXB0VmVydGV4KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZVNldFRpbWVvdXQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKCkge31cblxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HICAgPSB2b2lkIDA7XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRCA9IDE7XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFJFSkVDVEVEICA9IDI7XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1IgPSBuZXcgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKTtcblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHNlbGZGdWxsZmlsbG1lbnQoKSB7XG4gICAgICByZXR1cm4gbmV3IFR5cGVFcnJvcihcIllvdSBjYW5ub3QgcmVzb2x2ZSBhIHByb21pc2Ugd2l0aCBpdHNlbGZcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkY2Fubm90UmV0dXJuT3duKCkge1xuICAgICAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZXMgY2FsbGJhY2sgY2Fubm90IHJldHVybiB0aGF0IHNhbWUgcHJvbWlzZS4nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRnZXRUaGVuKHByb21pc2UpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlLnRoZW47XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SLmVycm9yID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCR0cnlUaGVuKHRoZW4sIHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUsIHRoZW4pIHtcbiAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcChmdW5jdGlvbihwcm9taXNlKSB7XG4gICAgICAgIHZhciBzZWFsZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGVycm9yID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkdHJ5VGhlbih0aGVuLCB0aGVuYWJsZSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAoc2VhbGVkKSB7IHJldHVybjsgfVxuICAgICAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKHRoZW5hYmxlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgICAgaWYgKHNlYWxlZCkgeyByZXR1cm47IH1cbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xuXG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICAgIH0sICdTZXR0bGU6ICcgKyAocHJvbWlzZS5fbGFiZWwgfHwgJyB1bmtub3duIHByb21pc2UnKSk7XG5cbiAgICAgICAgaWYgKCFzZWFsZWQgJiYgZXJyb3IpIHtcbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0sIHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlKSB7XG4gICAgICBpZiAodGhlbmFibGUuX3N0YXRlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRGVUxGSUxMRUQpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgICAgIH0gZWxzZSBpZiAodGhlbmFibGUuX3N0YXRlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRSRUpFQ1RFRCkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRzdWJzY3JpYmUodGhlbmFibGUsIHVuZGVmaW5lZCwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSkge1xuICAgICAgaWYgKG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IgPT09IHByb21pc2UuY29uc3RydWN0b3IpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdGhlbiA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGdldFRoZW4obWF5YmVUaGVuYWJsZSk7XG5cbiAgICAgICAgaWYgKHRoZW4gPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SLmVycm9yKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGVuID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNGdW5jdGlvbih0aGVuKSkge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSkge1xuICAgICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRzZWxmRnVsbGZpbGxtZW50KCkpO1xuICAgICAgfSBlbHNlIGlmIChsaWIkZXM2JHByb21pc2UkdXRpbHMkJG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gICAgICBpZiAocHJvbWlzZS5fb25lcnJvcikge1xuICAgICAgICBwcm9taXNlLl9vbmVycm9yKHByb21pc2UuX3Jlc3VsdCk7XG4gICAgICB9XG5cbiAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2gocHJvbWlzZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSkge1xuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7IHJldHVybjsgfVxuXG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3N0YXRlID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEO1xuXG4gICAgICBpZiAocHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2gsIHByb21pc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pIHtcbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORykgeyByZXR1cm47IH1cbiAgICAgIHByb21pc2UuX3N0YXRlID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQ7XG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSByZWFzb247XG5cbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2hSZWplY3Rpb24sIHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICAgICAgdmFyIHN1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcbiAgICAgIHZhciBsZW5ndGggPSBzdWJzY3JpYmVycy5sZW5ndGg7XG5cbiAgICAgIHBhcmVudC5fb25lcnJvciA9IG51bGw7XG5cbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aF0gPSBjaGlsZDtcbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aCArIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xuICAgICAgc3Vic2NyaWJlcnNbbGVuZ3RoICsgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURURdICA9IG9uUmVqZWN0aW9uO1xuXG4gICAgICBpZiAobGVuZ3RoID09PSAwICYmIHBhcmVudC5fc3RhdGUpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXAobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcHVibGlzaCwgcGFyZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRwdWJsaXNoKHByb21pc2UpIHtcbiAgICAgIHZhciBzdWJzY3JpYmVycyA9IHByb21pc2UuX3N1YnNjcmliZXJzO1xuICAgICAgdmFyIHNldHRsZWQgPSBwcm9taXNlLl9zdGF0ZTtcblxuICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cblxuICAgICAgdmFyIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHNldHRsZWQsIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhkZXRhaWwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKSB7XG4gICAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SID0gbmV3IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCk7XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCR0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZGV0YWlsKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IuZXJyb3IgPSBlO1xuICAgICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgICAgIHZhciBoYXNDYWxsYmFjayA9IGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICAgICAgdmFsdWUsIGVycm9yLCBzdWNjZWVkZWQsIGZhaWxlZDtcblxuICAgICAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgICAgIHZhbHVlID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCk7XG5cbiAgICAgICAgaWYgKHZhbHVlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IpIHtcbiAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgICAgIGVycm9yID0gdmFsdWUuZXJyb3I7XG4gICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkY2Fubm90UmV0dXJuT3duKCkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGRldGFpbDtcbiAgICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgIC8vIG5vb3BcbiAgICAgIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChmYWlsZWQpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRSRUpFQ1RFRCkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGluaXRpYWxpemVQcm9taXNlKHByb21pc2UsIHJlc29sdmVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlcihmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSl7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIHJlamVjdFByb21pc2UocmVhc29uKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvcihDb25zdHJ1Y3RvciwgaW5wdXQpIHtcbiAgICAgIHZhciBlbnVtZXJhdG9yID0gdGhpcztcblxuICAgICAgZW51bWVyYXRvci5faW5zdGFuY2VDb25zdHJ1Y3RvciA9IENvbnN0cnVjdG9yO1xuICAgICAgZW51bWVyYXRvci5wcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3ApO1xuXG4gICAgICBpZiAoZW51bWVyYXRvci5fdmFsaWRhdGVJbnB1dChpbnB1dCkpIHtcbiAgICAgICAgZW51bWVyYXRvci5faW5wdXQgICAgID0gaW5wdXQ7XG4gICAgICAgIGVudW1lcmF0b3IubGVuZ3RoICAgICA9IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgZW51bWVyYXRvci5fcmVtYWluaW5nID0gaW5wdXQubGVuZ3RoO1xuXG4gICAgICAgIGVudW1lcmF0b3IuX2luaXQoKTtcblxuICAgICAgICBpZiAoZW51bWVyYXRvci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKGVudW1lcmF0b3IucHJvbWlzZSwgZW51bWVyYXRvci5fcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbnVtZXJhdG9yLmxlbmd0aCA9IGVudW1lcmF0b3IubGVuZ3RoIHx8IDA7XG4gICAgICAgICAgZW51bWVyYXRvci5fZW51bWVyYXRlKCk7XG4gICAgICAgICAgaWYgKGVudW1lcmF0b3IuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChlbnVtZXJhdG9yLnByb21pc2UsIGVudW1lcmF0b3IuX3Jlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QoZW51bWVyYXRvci5wcm9taXNlLCBlbnVtZXJhdG9yLl92YWxpZGF0aW9uRXJyb3IoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl92YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgIHJldHVybiBsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzQXJyYXkoaW5wdXQpO1xuICAgIH07XG5cbiAgICBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3ZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignQXJyYXkgTWV0aG9kcyBtdXN0IGJlIHByb3ZpZGVkIGFuIEFycmF5Jyk7XG4gICAgfTtcblxuICAgIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fcmVzdWx0ID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKTtcbiAgICB9O1xuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3I7XG5cbiAgICBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2VudW1lcmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuXG4gICAgICB2YXIgbGVuZ3RoICA9IGVudW1lcmF0b3IubGVuZ3RoO1xuICAgICAgdmFyIHByb21pc2UgPSBlbnVtZXJhdG9yLnByb21pc2U7XG4gICAgICB2YXIgaW5wdXQgICA9IGVudW1lcmF0b3IuX2lucHV0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgcHJvbWlzZS5fc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVudW1lcmF0b3IuX2VhY2hFbnRyeShpbnB1dFtpXSwgaSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fZWFjaEVudHJ5ID0gZnVuY3Rpb24oZW50cnksIGkpIHtcbiAgICAgIHZhciBlbnVtZXJhdG9yID0gdGhpcztcbiAgICAgIHZhciBjID0gZW51bWVyYXRvci5faW5zdGFuY2VDb25zdHJ1Y3RvcjtcblxuICAgICAgaWYgKGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNNYXliZVRoZW5hYmxlKGVudHJ5KSkge1xuICAgICAgICBpZiAoZW50cnkuY29uc3RydWN0b3IgPT09IGMgJiYgZW50cnkuX3N0YXRlICE9PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgICAgZW50cnkuX29uZXJyb3IgPSBudWxsO1xuICAgICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdChlbnRyeS5fc3RhdGUsIGksIGVudHJ5Ll9yZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVudW1lcmF0b3IuX3dpbGxTZXR0bGVBdChjLnJlc29sdmUoZW50cnkpLCBpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW51bWVyYXRvci5fcmVtYWluaW5nLS07XG4gICAgICAgIGVudW1lcmF0b3IuX3Jlc3VsdFtpXSA9IGVudHJ5O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3NldHRsZWRBdCA9IGZ1bmN0aW9uKHN0YXRlLCBpLCB2YWx1ZSkge1xuICAgICAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuICAgICAgdmFyIHByb21pc2UgPSBlbnVtZXJhdG9yLnByb21pc2U7XG5cbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORykge1xuICAgICAgICBlbnVtZXJhdG9yLl9yZW1haW5pbmctLTtcblxuICAgICAgICBpZiAoc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFJFSkVDVEVEKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbnVtZXJhdG9yLl9yZXN1bHRbaV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZW51bWVyYXRvci5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgZW51bWVyYXRvci5fcmVzdWx0KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl93aWxsU2V0dGxlQXQgPSBmdW5jdGlvbihwcm9taXNlLCBpKSB7XG4gICAgICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG5cbiAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHN1YnNjcmliZShwcm9taXNlLCB1bmRlZmluZWQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdChsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRGVUxGSUxMRUQsIGksIHZhbHVlKTtcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICBlbnVtZXJhdG9yLl9zZXR0bGVkQXQobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQsIGksIHJlYXNvbik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkYWxsKGVudHJpZXMpIHtcbiAgICAgIHJldHVybiBuZXcgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJGRlZmF1bHQodGhpcywgZW50cmllcykucHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkYWxsO1xuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJhY2UkJHJhY2UoZW50cmllcykge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICAgIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3ApO1xuXG4gICAgICBpZiAoIWxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNBcnJheShlbnRyaWVzKSkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byByYWNlLicpKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBsZW5ndGggPSBlbnRyaWVzLmxlbmd0aDtcblxuICAgICAgZnVuY3Rpb24gb25GdWxmaWxsbWVudCh2YWx1ZSkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gb25SZWplY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgcHJvbWlzZS5fc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHN1YnNjcmliZShDb25zdHJ1Y3Rvci5yZXNvbHZlKGVudHJpZXNbaV0pLCB1bmRlZmluZWQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyYWNlJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmFjZSQkcmFjZTtcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZXNvbHZlJCRyZXNvbHZlKG9iamVjdCkge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICAgIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSBDb25zdHJ1Y3Rvcikge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgb2JqZWN0KTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlc29sdmUkJHJlc29sdmU7XG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVqZWN0JCRyZWplY3QocmVhc29uKSB7XG4gICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3ApO1xuICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlamVjdCQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlamVjdCQkcmVqZWN0O1xuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRjb3VudGVyID0gMDtcblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRuZWVkc1Jlc29sdmVyKCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRuZWVkc05ldygpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdQcm9taXNlJzogUGxlYXNlIHVzZSB0aGUgJ25ldycgb3BlcmF0b3IsIHRoaXMgb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi5cIik7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2U7XG4gICAgLyoqXG4gICAgICBQcm9taXNlIG9iamVjdHMgcmVwcmVzZW50IHRoZSBldmVudHVhbCByZXN1bHQgb2YgYW4gYXN5bmNocm9ub3VzIG9wZXJhdGlvbi4gVGhlXG4gICAgICBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLCB3aGljaFxuICAgICAgcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGUgcmVhc29uXG4gICAgICB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cblxuICAgICAgVGVybWlub2xvZ3lcbiAgICAgIC0tLS0tLS0tLS0tXG5cbiAgICAgIC0gYHByb21pc2VgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB3aXRoIGEgYHRoZW5gIG1ldGhvZCB3aG9zZSBiZWhhdmlvciBjb25mb3JtcyB0byB0aGlzIHNwZWNpZmljYXRpb24uXG4gICAgICAtIGB0aGVuYWJsZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHRoYXQgZGVmaW5lcyBhIGB0aGVuYCBtZXRob2QuXG4gICAgICAtIGB2YWx1ZWAgaXMgYW55IGxlZ2FsIEphdmFTY3JpcHQgdmFsdWUgKGluY2x1ZGluZyB1bmRlZmluZWQsIGEgdGhlbmFibGUsIG9yIGEgcHJvbWlzZSkuXG4gICAgICAtIGBleGNlcHRpb25gIGlzIGEgdmFsdWUgdGhhdCBpcyB0aHJvd24gdXNpbmcgdGhlIHRocm93IHN0YXRlbWVudC5cbiAgICAgIC0gYHJlYXNvbmAgaXMgYSB2YWx1ZSB0aGF0IGluZGljYXRlcyB3aHkgYSBwcm9taXNlIHdhcyByZWplY3RlZC5cbiAgICAgIC0gYHNldHRsZWRgIHRoZSBmaW5hbCByZXN0aW5nIHN0YXRlIG9mIGEgcHJvbWlzZSwgZnVsZmlsbGVkIG9yIHJlamVjdGVkLlxuXG4gICAgICBBIHByb21pc2UgY2FuIGJlIGluIG9uZSBvZiB0aHJlZSBzdGF0ZXM6IHBlbmRpbmcsIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQuXG5cbiAgICAgIFByb21pc2VzIHRoYXQgYXJlIGZ1bGZpbGxlZCBoYXZlIGEgZnVsZmlsbG1lbnQgdmFsdWUgYW5kIGFyZSBpbiB0aGUgZnVsZmlsbGVkXG4gICAgICBzdGF0ZS4gIFByb21pc2VzIHRoYXQgYXJlIHJlamVjdGVkIGhhdmUgYSByZWplY3Rpb24gcmVhc29uIGFuZCBhcmUgaW4gdGhlXG4gICAgICByZWplY3RlZCBzdGF0ZS4gIEEgZnVsZmlsbG1lbnQgdmFsdWUgaXMgbmV2ZXIgYSB0aGVuYWJsZS5cblxuICAgICAgUHJvbWlzZXMgY2FuIGFsc28gYmUgc2FpZCB0byAqcmVzb2x2ZSogYSB2YWx1ZS4gIElmIHRoaXMgdmFsdWUgaXMgYWxzbyBhXG4gICAgICBwcm9taXNlLCB0aGVuIHRoZSBvcmlnaW5hbCBwcm9taXNlJ3Mgc2V0dGxlZCBzdGF0ZSB3aWxsIG1hdGNoIHRoZSB2YWx1ZSdzXG4gICAgICBzZXR0bGVkIHN0YXRlLiAgU28gYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCByZWplY3RzIHdpbGxcbiAgICAgIGl0c2VsZiByZWplY3QsIGFuZCBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IGZ1bGZpbGxzIHdpbGxcbiAgICAgIGl0c2VsZiBmdWxmaWxsLlxuXG5cbiAgICAgIEJhc2ljIFVzYWdlOlxuICAgICAgLS0tLS0tLS0tLS0tXG5cbiAgICAgIGBgYGpzXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAvLyBvbiBzdWNjZXNzXG4gICAgICAgIHJlc29sdmUodmFsdWUpO1xuXG4gICAgICAgIC8vIG9uIGZhaWx1cmVcbiAgICAgICAgcmVqZWN0KHJlYXNvbik7XG4gICAgICB9KTtcblxuICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgLy8gb24gcmVqZWN0aW9uXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBBZHZhbmNlZCBVc2FnZTpcbiAgICAgIC0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBQcm9taXNlcyBzaGluZSB3aGVuIGFic3RyYWN0aW5nIGF3YXkgYXN5bmNocm9ub3VzIGludGVyYWN0aW9ucyBzdWNoIGFzXG4gICAgICBgWE1MSHR0cFJlcXVlc3Rgcy5cblxuICAgICAgYGBganNcbiAgICAgIGZ1bmN0aW9uIGdldEpTT04odXJsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVyO1xuICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnanNvbic7XG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgeGhyLnNlbmQoKTtcblxuICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSB0aGlzLkRPTkUpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2dldEpTT046IGAnICsgdXJsICsgJ2AgZmFpbGVkIHdpdGggc3RhdHVzOiBbJyArIHRoaXMuc3RhdHVzICsgJ10nKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZ2V0SlNPTignL3Bvc3RzLmpzb24nKS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAvLyBvbiByZWplY3Rpb25cbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFVubGlrZSBjYWxsYmFja3MsIHByb21pc2VzIGFyZSBncmVhdCBjb21wb3NhYmxlIHByaW1pdGl2ZXMuXG5cbiAgICAgIGBgYGpzXG4gICAgICBQcm9taXNlLmFsbChbXG4gICAgICAgIGdldEpTT04oJy9wb3N0cycpLFxuICAgICAgICBnZXRKU09OKCcvY29tbWVudHMnKVxuICAgICAgXSkudGhlbihmdW5jdGlvbih2YWx1ZXMpe1xuICAgICAgICB2YWx1ZXNbMF0gLy8gPT4gcG9zdHNKU09OXG4gICAgICAgIHZhbHVlc1sxXSAvLyA9PiBjb21tZW50c0pTT05cblxuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQGNsYXNzIFByb21pc2VcbiAgICAgIEBwYXJhbSB7ZnVuY3Rpb259IHJlc29sdmVyXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgICBAY29uc3RydWN0b3JcbiAgICAqL1xuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlKHJlc29sdmVyKSB7XG4gICAgICB0aGlzLl9pZCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRjb3VudGVyKys7XG4gICAgICB0aGlzLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX3Jlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX3N1YnNjcmliZXJzID0gW107XG5cbiAgICAgIGlmIChsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wICE9PSByZXNvbHZlcikge1xuICAgICAgICBpZiAoIWxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNGdW5jdGlvbihyZXNvbHZlcikpIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkbmVlZHNSZXNvbHZlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlKSkge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRuZWVkc05ldygpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaW5pdGlhbGl6ZVByb21pc2UodGhpcywgcmVzb2x2ZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLmFsbCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkZGVmYXVsdDtcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5yYWNlID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmFjZSQkZGVmYXVsdDtcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5yZXNvbHZlID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdDtcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5yZWplY3QgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZWplY3QkJGRlZmF1bHQ7XG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UuX3NldFNjaGVkdWxlciA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzZXRTY2hlZHVsZXI7XG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UuX3NldEFzYXAgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2V0QXNhcDtcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5fYXNhcCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwO1xuXG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UucHJvdG90eXBlID0ge1xuICAgICAgY29uc3RydWN0b3I6IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLFxuXG4gICAgLyoqXG4gICAgICBUaGUgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCxcbiAgICAgIHdoaWNoIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlXG4gICAgICByZWFzb24gd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAgIC8vIHVzZXIgaXMgYXZhaWxhYmxlXG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyB1c2VyIGlzIHVuYXZhaWxhYmxlLCBhbmQgeW91IGFyZSBnaXZlbiB0aGUgcmVhc29uIHdoeVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQ2hhaW5pbmdcbiAgICAgIC0tLS0tLS0tXG5cbiAgICAgIFRoZSByZXR1cm4gdmFsdWUgb2YgYHRoZW5gIGlzIGl0c2VsZiBhIHByb21pc2UuICBUaGlzIHNlY29uZCwgJ2Rvd25zdHJlYW0nXG4gICAgICBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZmlyc3QgcHJvbWlzZSdzIGZ1bGZpbGxtZW50XG4gICAgICBvciByZWplY3Rpb24gaGFuZGxlciwgb3IgcmVqZWN0ZWQgaWYgdGhlIGhhbmRsZXIgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICByZXR1cm4gdXNlci5uYW1lO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICByZXR1cm4gJ2RlZmF1bHQgbmFtZSc7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh1c2VyTmFtZSkge1xuICAgICAgICAvLyBJZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHVzZXJOYW1lYCB3aWxsIGJlIHRoZSB1c2VyJ3MgbmFtZSwgb3RoZXJ3aXNlIGl0XG4gICAgICAgIC8vIHdpbGwgYmUgYCdkZWZhdWx0IG5hbWUnYFxuICAgICAgfSk7XG5cbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jyk7XG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAvLyBpZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHJlYXNvbmAgd2lsbCBiZSAnRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknLlxuICAgICAgICAvLyBJZiBgZmluZFVzZXJgIHJlamVjdGVkLCBgcmVhc29uYCB3aWxsIGJlICdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jy5cbiAgICAgIH0pO1xuICAgICAgYGBgXG4gICAgICBJZiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIGRvZXMgbm90IHNwZWNpZnkgYSByZWplY3Rpb24gaGFuZGxlciwgcmVqZWN0aW9uIHJlYXNvbnMgd2lsbCBiZSBwcm9wYWdhdGVkIGZ1cnRoZXIgZG93bnN0cmVhbS5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICB0aHJvdyBuZXcgUGVkYWdvZ2ljYWxFeGNlcHRpb24oJ1Vwc3RyZWFtIGVycm9yJyk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIC8vIFRoZSBgUGVkZ2Fnb2NpYWxFeGNlcHRpb25gIGlzIHByb3BhZ2F0ZWQgYWxsIHRoZSB3YXkgZG93biB0byBoZXJlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBBc3NpbWlsYXRpb25cbiAgICAgIC0tLS0tLS0tLS0tLVxuXG4gICAgICBTb21ldGltZXMgdGhlIHZhbHVlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSB0byBhIGRvd25zdHJlYW0gcHJvbWlzZSBjYW4gb25seSBiZVxuICAgICAgcmV0cmlldmVkIGFzeW5jaHJvbm91c2x5LiBUaGlzIGNhbiBiZSBhY2hpZXZlZCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIHRoZVxuICAgICAgZnVsZmlsbG1lbnQgb3IgcmVqZWN0aW9uIGhhbmRsZXIuIFRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCB0aGVuIGJlIHBlbmRpbmdcbiAgICAgIHVudGlsIHRoZSByZXR1cm5lZCBwcm9taXNlIGlzIHNldHRsZWQuIFRoaXMgaXMgY2FsbGVkICphc3NpbWlsYXRpb24qLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAgIC8vIFRoZSB1c2VyJ3MgY29tbWVudHMgYXJlIG5vdyBhdmFpbGFibGVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIElmIHRoZSBhc3NpbWxpYXRlZCBwcm9taXNlIHJlamVjdHMsIHRoZW4gdGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIGFsc28gcmVqZWN0LlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgZnVsZmlsbHMsIHdlJ2xsIGhhdmUgdGhlIHZhbHVlIGhlcmVcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCByZWplY3RzLCB3ZSdsbCBoYXZlIHRoZSByZWFzb24gaGVyZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgU2ltcGxlIEV4YW1wbGVcbiAgICAgIC0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgdmFyIHJlc3VsdDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gZmluZFJlc3VsdCgpO1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9XG4gICAgICBgYGBcblxuICAgICAgRXJyYmFjayBFeGFtcGxlXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kUmVzdWx0KGZ1bmN0aW9uKHJlc3VsdCwgZXJyKXtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBzdWNjZXNzXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFByb21pc2UgRXhhbXBsZTtcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgZmluZFJlc3VsdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQWR2YW5jZWQgRXhhbXBsZVxuICAgICAgLS0tLS0tLS0tLS0tLS1cblxuICAgICAgU3luY2hyb25vdXMgRXhhbXBsZVxuXG4gICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICB2YXIgYXV0aG9yLCBib29rcztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgYXV0aG9yID0gZmluZEF1dGhvcigpO1xuICAgICAgICBib29rcyAgPSBmaW5kQm9va3NCeUF1dGhvcihhdXRob3IpO1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9XG4gICAgICBgYGBcblxuICAgICAgRXJyYmFjayBFeGFtcGxlXG5cbiAgICAgIGBgYGpzXG5cbiAgICAgIGZ1bmN0aW9uIGZvdW5kQm9va3MoYm9va3MpIHtcblxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBmYWlsdXJlKHJlYXNvbikge1xuXG4gICAgICB9XG5cbiAgICAgIGZpbmRBdXRob3IoZnVuY3Rpb24oYXV0aG9yLCBlcnIpe1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmluZEJvb29rc0J5QXV0aG9yKGF1dGhvciwgZnVuY3Rpb24oYm9va3MsIGVycikge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBmb3VuZEJvb2tzKGJvb2tzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAgICAgICAgICAgZmFpbHVyZShyZWFzb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBzdWNjZXNzXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFByb21pc2UgRXhhbXBsZTtcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgZmluZEF1dGhvcigpLlxuICAgICAgICB0aGVuKGZpbmRCb29rc0J5QXV0aG9yKS5cbiAgICAgICAgdGhlbihmdW5jdGlvbihib29rcyl7XG4gICAgICAgICAgLy8gZm91bmQgYm9va3NcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBAbWV0aG9kIHRoZW5cbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsZmlsbGVkXG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGVkXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAgICovXG4gICAgICB0aGVuOiBmdW5jdGlvbihvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcztcbiAgICAgICAgdmFyIHN0YXRlID0gcGFyZW50Ll9zdGF0ZTtcblxuICAgICAgICBpZiAoc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRCAmJiAhb25GdWxmaWxsbWVudCB8fCBzdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQgJiYgIW9uUmVqZWN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGQgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHBhcmVudC5fcmVzdWx0O1xuXG4gICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50c1tzdGF0ZSAtIDFdO1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzdGF0ZSwgY2hpbGQsIGNhbGxiYWNrLCByZXN1bHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICB9LFxuXG4gICAgLyoqXG4gICAgICBgY2F0Y2hgIGlzIHNpbXBseSBzdWdhciBmb3IgYHRoZW4odW5kZWZpbmVkLCBvblJlamVjdGlvbilgIHdoaWNoIG1ha2VzIGl0IHRoZSBzYW1lXG4gICAgICBhcyB0aGUgY2F0Y2ggYmxvY2sgb2YgYSB0cnkvY2F0Y2ggc3RhdGVtZW50LlxuXG4gICAgICBgYGBqc1xuICAgICAgZnVuY3Rpb24gZmluZEF1dGhvcigpe1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkbid0IGZpbmQgdGhhdCBhdXRob3InKTtcbiAgICAgIH1cblxuICAgICAgLy8gc3luY2hyb25vdXNcbiAgICAgIHRyeSB7XG4gICAgICAgIGZpbmRBdXRob3IoKTtcbiAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICB9XG5cbiAgICAgIC8vIGFzeW5jIHdpdGggcHJvbWlzZXNcbiAgICAgIGZpbmRBdXRob3IoKS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQG1ldGhvZCBjYXRjaFxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3Rpb25cbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICAgKi9cbiAgICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3Rpb24pO1xuICAgICAgfVxuICAgIH07XG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRwb2x5ZmlsbCgpIHtcbiAgICAgIHZhciBsb2NhbDtcblxuICAgICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgbG9jYWwgPSBnbG9iYWw7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGxvY2FsID0gc2VsZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgbG9jYWwgPSBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwb2x5ZmlsbCBmYWlsZWQgYmVjYXVzZSBnbG9iYWwgb2JqZWN0IGlzIHVuYXZhaWxhYmxlIGluIHRoaXMgZW52aXJvbm1lbnQnKTtcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBQID0gbG9jYWwuUHJvbWlzZTtcblxuICAgICAgaWYgKFAgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFAucmVzb2x2ZSgpKSA9PT0gJ1tvYmplY3QgUHJvbWlzZV0nICYmICFQLmNhc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsb2NhbC5Qcm9taXNlID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJGRlZmF1bHQ7XG4gICAgfVxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcG9seWZpbGwkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcG9seWZpbGwkJHBvbHlmaWxsO1xuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSR1bWQkJEVTNlByb21pc2UgPSB7XG4gICAgICAnUHJvbWlzZSc6IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0LFxuICAgICAgJ3BvbHlmaWxsJzogbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRkZWZhdWx0XG4gICAgfTtcblxuICAgIC8qIGdsb2JhbCBkZWZpbmU6dHJ1ZSBtb2R1bGU6dHJ1ZSB3aW5kb3c6IHRydWUgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmVbJ2FtZCddKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBsaWIkZXM2JHByb21pc2UkdW1kJCRFUzZQcm9taXNlOyB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZVsnZXhwb3J0cyddKSB7XG4gICAgICBtb2R1bGVbJ2V4cG9ydHMnXSA9IGxpYiRlczYkcHJvbWlzZSR1bWQkJEVTNlByb21pc2U7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXNbJ0VTNlByb21pc2UnXSA9IGxpYiRlczYkcHJvbWlzZSR1bWQkJEVTNlByb21pc2U7XG4gICAgfVxuXG4gICAgbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRkZWZhdWx0KCk7XG59KS5jYWxsKHRoaXMpO1xuXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiSXJYVXN1XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIvKmdsb2JhbHMgZGVmaW5lICovXG4ndXNlIHN0cmljdCc7XG5cblxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChyb290Lmh0dHBwbGVhc2Vwcm9taXNlcyA9IGZhY3Rvcnkocm9vdCkpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5odHRwcGxlYXNlcHJvbWlzZXMgPSBmYWN0b3J5KHJvb3QpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKHJvb3QpIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChQcm9taXNlKSB7XG4gICAgICAgIFByb21pc2UgPSBQcm9taXNlIHx8IHJvb3QgJiYgcm9vdC5Qcm9taXNlO1xuICAgICAgICBpZiAoIVByb21pc2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gUHJvbWlzZSBpbXBsZW1lbnRhdGlvbiBmb3VuZC4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvY2Vzc1JlcXVlc3Q6IGZ1bmN0aW9uIChyZXEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZSwgcmVqZWN0LFxuICAgICAgICAgICAgICAgICAgICBvbGRPbmxvYWQgPSByZXEub25sb2FkLFxuICAgICAgICAgICAgICAgICAgICBvbGRPbmVycm9yID0gcmVxLm9uZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSA9IGE7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QgPSBiO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXEub25sb2FkID0gZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICBpZiAob2xkT25sb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBvbGRPbmxvYWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXEub25lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9sZE9uZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IG9sZE9uZXJyb3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcS50aGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuLmFwcGx5KHByb21pc2UsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXFbJ2NhdGNoJ10gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlWydjYXRjaCddLmFwcGx5KHByb21pc2UsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xufSkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVzcG9uc2UgPSByZXF1aXJlKCcuL3Jlc3BvbnNlJyk7XG5cbmZ1bmN0aW9uIFJlcXVlc3RFcnJvcihtZXNzYWdlLCBwcm9wcykge1xuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgZXJyLm5hbWUgPSAnUmVxdWVzdEVycm9yJztcbiAgICB0aGlzLm5hbWUgPSBlcnIubmFtZTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcbiAgICBpZiAoZXJyLnN0YWNrKSB7XG4gICAgICAgIHRoaXMuc3RhY2sgPSBlcnIuc3RhY2s7XG4gICAgfVxuXG4gICAgdGhpcy50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZTtcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgayBpbiBwcm9wcykge1xuICAgICAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgIHRoaXNba10gPSBwcm9wc1trXTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuUmVxdWVzdEVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblxuUmVxdWVzdEVycm9yLmNyZWF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlLCByZXEsIHByb3BzKSB7XG4gICAgdmFyIGVyciA9IG5ldyBSZXF1ZXN0RXJyb3IobWVzc2FnZSwgcHJvcHMpO1xuICAgIFJlc3BvbnNlLmNhbGwoZXJyLCByZXEpO1xuICAgIHJldHVybiBlcnI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcXVlc3RFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGksXG4gICAgY2xlYW5VUkwgPSByZXF1aXJlKCcuLi9wbHVnaW5zL2NsZWFudXJsJyksXG4gICAgWEhSID0gcmVxdWlyZSgnLi94aHInKSxcbiAgICBkZWxheSA9IHJlcXVpcmUoJy4vdXRpbHMvZGVsYXknKSxcbiAgICBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4vZXJyb3InKS5jcmVhdGUsXG4gICAgUmVzcG9uc2UgPSByZXF1aXJlKCcuL3Jlc3BvbnNlJyksXG4gICAgUmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpLFxuICAgIGV4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kJyksXG4gICAgb25jZSA9IHJlcXVpcmUoJy4vdXRpbHMvb25jZScpO1xuXG5mdW5jdGlvbiBmYWN0b3J5KGRlZmF1bHRzLCBwbHVnaW5zKSB7XG4gICAgZGVmYXVsdHMgPSBkZWZhdWx0cyB8fCB7fTtcbiAgICBwbHVnaW5zID0gcGx1Z2lucyB8fCBbXTtcblxuICAgIGZ1bmN0aW9uIGh0dHAocmVxLCBjYikge1xuICAgICAgICB2YXIgeGhyLCBwbHVnaW4sIGRvbmUsIGssIHRpbWVvdXRJZDtcblxuICAgICAgICByZXEgPSBuZXcgUmVxdWVzdChleHRlbmQoZGVmYXVsdHMsIHJlcSkpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBwbHVnaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBwbHVnaW4gPSBwbHVnaW5zW2ldO1xuICAgICAgICAgICAgaWYgKHBsdWdpbi5wcm9jZXNzUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgIHBsdWdpbi5wcm9jZXNzUmVxdWVzdChyZXEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2l2ZSB0aGUgcGx1Z2lucyBhIGNoYW5jZSB0byBjcmVhdGUgdGhlIFhIUiBvYmplY3RcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHBsdWdpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHBsdWdpbiA9IHBsdWdpbnNbaV07XG4gICAgICAgICAgICBpZiAocGx1Z2luLmNyZWF0ZVhIUikge1xuICAgICAgICAgICAgICAgIHhociA9IHBsdWdpbi5jcmVhdGVYSFIocmVxKTtcbiAgICAgICAgICAgICAgICBicmVhazsgLy8gRmlyc3QgY29tZSwgZmlyc3Qgc2VydmVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB4aHIgPSB4aHIgfHwgbmV3IFhIUigpO1xuXG4gICAgICAgIHJlcS54aHIgPSB4aHI7XG5cbiAgICAgICAgLy8gQmVjYXVzZSBYSFIgY2FuIGJlIGFuIFhNTEh0dHBSZXF1ZXN0IG9yIGFuIFhEb21haW5SZXF1ZXN0LCB3ZSBhZGRcbiAgICAgICAgLy8gYG9ucmVhZHlzdGF0ZWNoYW5nZWAsIGBvbmxvYWRgLCBhbmQgYG9uZXJyb3JgIGNhbGxiYWNrcy4gV2UgdXNlIHRoZVxuICAgICAgICAvLyBgb25jZWAgdXRpbCB0byBtYWtlIHN1cmUgdGhhdCBvbmx5IG9uZSBpcyBjYWxsZWQgKGFuZCBpdCdzIG9ubHkgY2FsbGVkXG4gICAgICAgIC8vIG9uZSB0aW1lKS5cbiAgICAgICAgZG9uZSA9IG9uY2UoZGVsYXkoZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICB4aHIub25sb2FkID0geGhyLm9uZXJyb3IgPSB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0geGhyLm9udGltZW91dCA9IHhoci5vbnByb2dyZXNzID0gbnVsbDtcbiAgICAgICAgICAgIHZhciByZXMgPSBlcnIgJiYgZXJyLmlzSHR0cEVycm9yID8gZXJyIDogbmV3IFJlc3BvbnNlKHJlcSk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGx1Z2lucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHBsdWdpbiA9IHBsdWdpbnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHBsdWdpbi5wcm9jZXNzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnByb2Nlc3NSZXNwb25zZShyZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVxLm9uZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxLm9uZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChyZXEub25sb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcS5vbmxvYWQocmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgICBjYihlcnIsIHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcblxuICAgICAgICAvLyBXaGVuIHRoZSByZXF1ZXN0IGNvbXBsZXRlcywgY29udGludWUuXG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocmVxLnRpbWVkT3V0KSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmIChyZXEuYWJvcnRlZCkge1xuICAgICAgICAgICAgICAgIGRvbmUoY3JlYXRlRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIHJlcSwge25hbWU6ICdBYm9ydCd9KSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBNYXRoLmZsb29yKHhoci5zdGF0dXMgLyAxMDApO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHhoci5zdGF0dXMgPT09IDQwNCAmJiAhcmVxLmVycm9yT240MDQpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBraW5kO1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBraW5kID0gJ0NsaWVudCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2luZCA9ICdTZXJ2ZXInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBraW5kID0gJ0hUVFAnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBtc2cgPSBraW5kICsgJyBFcnJvcjogJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnVGhlIHNlcnZlciByZXR1cm5lZCBhIHN0YXR1cyBvZiAnICsgeGhyLnN0YXR1cyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnIGZvciB0aGUgcmVxdWVzdCBcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxLm1ldGhvZC50b1VwcGVyQ2FzZSgpICsgJyAnICsgcmVxLnVybCArICdcIic7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoY3JlYXRlRXJyb3IobXNnLCByZXEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gYG9ubG9hZGAgaXMgb25seSBjYWxsZWQgb24gc3VjY2VzcyBhbmQsIGluIElFLCB3aWxsIGJlIGNhbGxlZCB3aXRob3V0XG4gICAgICAgIC8vIGB4aHIuc3RhdHVzYCBoYXZpbmcgYmVlbiBzZXQsIHNvIHdlIGRvbid0IGNoZWNrIGl0LlxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkgeyBkb25lKCk7IH07XG5cbiAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkb25lKGNyZWF0ZUVycm9yKCdJbnRlcm5hbCBYSFIgRXJyb3InLCByZXEpKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJRSBzb21ldGltZXMgZmFpbHMgaWYgeW91IGRvbid0IHNwZWNpZnkgZXZlcnkgaGFuZGxlci5cbiAgICAgICAgLy8gU2VlIGh0dHA6Ly9zb2NpYWwubXNkbi5taWNyb3NvZnQuY29tL0ZvcnVtcy9pZS9lbi1VUy8zMGVmM2FkZC03NjdjLTQ0MzYtYjhhOS1mMWNhMTliNDgxMmUvaWU5LXJ0bS14ZG9tYWlucmVxdWVzdC1pc3N1ZWQtcmVxdWVzdHMtbWF5LWFib3J0LWlmLWFsbC1ldmVudC1oYW5kbGVycy1ub3Qtc3BlY2lmaWVkP2ZvcnVtPWlld2ViZGV2ZWxvcG1lbnRcbiAgICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uICgpIHsgLyogbm9vcCAqLyB9O1xuICAgICAgICB4aHIub25wcm9ncmVzcyA9IGZ1bmN0aW9uICgpIHsgLyogbm9vcCAqLyB9O1xuXG4gICAgICAgIHhoci5vcGVuKHJlcS5tZXRob2QsIHJlcS51cmwpO1xuXG4gICAgICAgIGlmIChyZXEudGltZW91dCkge1xuICAgICAgICAgICAgLy8gSWYgd2UgdXNlIHRoZSBub3JtYWwgWEhSIHRpbWVvdXQgbWVjaGFuaXNtIChgeGhyLnRpbWVvdXRgIGFuZFxuICAgICAgICAgICAgLy8gYHhoci5vbnRpbWVvdXRgKSwgYG9ucmVhZHlzdGF0ZWNoYW5nZWAgd2lsbCBiZSB0cmlnZ2VyZWQgYmVmb3JlXG4gICAgICAgICAgICAvLyBgb250aW1lb3V0YC4gVGhlcmUncyBubyB3YXkgdG8gcmVjb2duaXplIHRoYXQgaXQgd2FzIHRyaWdnZXJlZCBieVxuICAgICAgICAgICAgLy8gYSB0aW1lb3V0LCBhbmQgd2UnZCBiZSB1bmFibGUgdG8gZGlzcGF0Y2ggdGhlIHJpZ2h0IGVycm9yLlxuICAgICAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmVxLnRpbWVkT3V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkb25lKGNyZWF0ZUVycm9yKCdSZXF1ZXN0IHRpbWVvdXQnLCByZXEsIHtuYW1lOiAnVGltZW91dCd9KSk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7fVxuICAgICAgICAgICAgfSwgcmVxLnRpbWVvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChrIGluIHJlcS5oZWFkZXJzKSB7XG4gICAgICAgICAgICBpZiAocmVxLmhlYWRlcnMuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrLCByZXEuaGVhZGVyc1trXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB4aHIuc2VuZChyZXEuYm9keSk7XG5cbiAgICAgICAgcmV0dXJuIHJlcTtcbiAgICB9XG5cbiAgICB2YXIgbWV0aG9kLFxuICAgICAgICBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnaGVhZCcsICdwYXRjaCcsICdkZWxldGUnXSxcbiAgICAgICAgdmVyYiA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAocmVxLCBjYikge1xuICAgICAgICAgICAgICAgIHJlcSA9IG5ldyBSZXF1ZXN0KHJlcSk7XG4gICAgICAgICAgICAgICAgcmVxLm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gaHR0cChyZXEsIGNiKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgZm9yIChpID0gMDsgaSA8IG1ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbWV0aG9kID0gbWV0aG9kc1tpXTtcbiAgICAgICAgaHR0cFttZXRob2RdID0gdmVyYihtZXRob2QpO1xuICAgIH1cblxuICAgIGh0dHAucGx1Z2lucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHBsdWdpbnM7XG4gICAgfTtcblxuICAgIGh0dHAuZGVmYXVsdHMgPSBmdW5jdGlvbiAobmV3VmFsdWVzKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWN0b3J5KGV4dGVuZChkZWZhdWx0cywgbmV3VmFsdWVzKSwgcGx1Z2lucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRzO1xuICAgIH07XG5cbiAgICBodHRwLnVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5ld1BsdWdpbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgICByZXR1cm4gZmFjdG9yeShkZWZhdWx0cywgcGx1Z2lucy5jb25jYXQobmV3UGx1Z2lucykpO1xuICAgIH07XG5cbiAgICBodHRwLmJhcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmYWN0b3J5KCk7XG4gICAgfTtcblxuICAgIGh0dHAuUmVxdWVzdCA9IFJlcXVlc3Q7XG4gICAgaHR0cC5SZXNwb25zZSA9IFJlc3BvbnNlO1xuXG4gICAgcmV0dXJuIGh0dHA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSh7fSwgW2NsZWFuVVJMXSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFJlcXVlc3Qob3B0c09yVXJsKSB7XG4gICAgdmFyIG9wdHMgPSB0eXBlb2Ygb3B0c09yVXJsID09PSAnc3RyaW5nJyA/IHt1cmw6IG9wdHNPclVybH0gOiBvcHRzT3JVcmwgfHwge307XG4gICAgdGhpcy5tZXRob2QgPSBvcHRzLm1ldGhvZCA/IG9wdHMubWV0aG9kLnRvVXBwZXJDYXNlKCkgOiAnR0VUJztcbiAgICB0aGlzLnVybCA9IG9wdHMudXJsO1xuICAgIHRoaXMuaGVhZGVycyA9IG9wdHMuaGVhZGVycyB8fCB7fTtcbiAgICB0aGlzLmJvZHkgPSBvcHRzLmJvZHk7XG4gICAgdGhpcy50aW1lb3V0ID0gb3B0cy50aW1lb3V0IHx8IDA7XG4gICAgdGhpcy5lcnJvck9uNDA0ID0gb3B0cy5lcnJvck9uNDA0ICE9IG51bGwgPyBvcHRzLmVycm9yT240MDQgOiB0cnVlO1xuICAgIHRoaXMub25sb2FkID0gb3B0cy5vbmxvYWQ7XG4gICAgdGhpcy5vbmVycm9yID0gb3B0cy5vbmVycm9yO1xufVxuXG5SZXF1ZXN0LnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5hYm9ydGVkKSByZXR1cm47XG4gICAgdGhpcy5hYm9ydGVkID0gdHJ1ZTtcbiAgICB0aGlzLnhoci5hYm9ydCgpO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuUmVxdWVzdC5wcm90b3R5cGUuaGVhZGVyID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGs7XG4gICAgZm9yIChrIGluIHRoaXMuaGVhZGVycykge1xuICAgICAgICBpZiAodGhpcy5oZWFkZXJzLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICBpZiAobmFtZS50b0xvd2VyQ2FzZSgpID09PSBrLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oZWFkZXJzW2tdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmhlYWRlcnNba107XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzW25hbWVdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJlcXVlc3QgPSByZXF1aXJlKCcuL3JlcXVlc3QnKTtcblxuXG5mdW5jdGlvbiBSZXNwb25zZShyZXEpIHtcbiAgICB2YXIgaSwgbGluZXMsIG0sXG4gICAgICAgIHhociA9IHJlcS54aHI7XG4gICAgdGhpcy5yZXF1ZXN0ID0gcmVxO1xuICAgIHRoaXMueGhyID0geGhyO1xuICAgIHRoaXMuaGVhZGVycyA9IHt9O1xuXG4gICAgLy8gQnJvd3NlcnMgZG9uJ3QgbGlrZSB5b3UgdHJ5aW5nIHRvIHJlYWQgWEhSIHByb3BlcnRpZXMgd2hlbiB5b3UgYWJvcnQgdGhlXG4gICAgLy8gcmVxdWVzdCwgc28gd2UgZG9uJ3QuXG4gICAgaWYgKHJlcS5hYm9ydGVkIHx8IHJlcS50aW1lZE91dCkgcmV0dXJuO1xuXG4gICAgdGhpcy5zdGF0dXMgPSB4aHIuc3RhdHVzIHx8IDA7XG4gICAgdGhpcy50ZXh0ID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICB0aGlzLmJvZHkgPSB4aHIucmVzcG9uc2UgfHwgeGhyLnJlc3BvbnNlVGV4dDtcbiAgICB0aGlzLmNvbnRlbnRUeXBlID0geGhyLmNvbnRlbnRUeXBlIHx8ICh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIgJiYgeGhyLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKSk7XG5cbiAgICBpZiAoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycykge1xuICAgICAgICBsaW5lcyA9IHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKS5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKChtID0gbGluZXNbaV0ubWF0Y2goL1xccyooW15cXHNdKyk6XFxzKyhbXlxcc10rKS8pKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVyc1ttWzFdXSA9IG1bMl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmlzSHR0cEVycm9yID0gdGhpcy5zdGF0dXMgPj0gNDAwO1xufVxuXG5SZXNwb25zZS5wcm90b3R5cGUuaGVhZGVyID0gUmVxdWVzdC5wcm90b3R5cGUuaGVhZGVyO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUmVzcG9uc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIFdyYXAgYSBmdW5jdGlvbiBpbiBhIGBzZXRUaW1lb3V0YCBjYWxsLiBUaGlzIGlzIHVzZWQgdG8gZ3VhcmFudGVlIGFzeW5jXG4vLyBiZWhhdmlvciwgd2hpY2ggY2FuIGF2b2lkIHVuZXhwZWN0ZWQgZXJyb3JzLlxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCksXG4gICAgICAgICAgICBuZXdGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIHNldFRpbWVvdXQobmV3RnVuYywgMCk7XG4gICAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIEEgXCJvbmNlXCIgdXRpbGl0eS5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgdmFyIHJlc3VsdCwgY2FsbGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgICByZXN1bHQgPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kXG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgICB2YXIgdGFyZ2V0ID0ge31cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV1cblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHByb2Nlc3NSZXF1ZXN0OiBmdW5jdGlvbiAocmVxKSB7XG4gICAgICAgIHJlcS51cmwgPSByZXEudXJsLnJlcGxhY2UoL1teJV0rL2csIGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgICByZXR1cm4gZW5jb2RlVVJJKHMpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIganNvbnJlcXVlc3QgPSByZXF1aXJlKCcuL2pzb25yZXF1ZXN0JyksXG4gICAganNvbnJlc3BvbnNlID0gcmVxdWlyZSgnLi9qc29ucmVzcG9uc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcHJvY2Vzc1JlcXVlc3Q6IGZ1bmN0aW9uIChyZXEpIHtcbiAgICAgICAganNvbnJlcXVlc3QucHJvY2Vzc1JlcXVlc3QuY2FsbCh0aGlzLCByZXEpO1xuICAgICAgICBqc29ucmVzcG9uc2UucHJvY2Vzc1JlcXVlc3QuY2FsbCh0aGlzLCByZXEpO1xuICAgIH0sXG4gICAgcHJvY2Vzc1Jlc3BvbnNlOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGpzb25yZXNwb25zZS5wcm9jZXNzUmVzcG9uc2UuY2FsbCh0aGlzLCByZXMpO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHByb2Nlc3NSZXF1ZXN0OiBmdW5jdGlvbiAocmVxKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAgY29udGVudFR5cGUgPSByZXEuaGVhZGVyKCdDb250ZW50LVR5cGUnKSxcbiAgICAgICAgICAgIGhhc0pzb25Db250ZW50VHlwZSA9IGNvbnRlbnRUeXBlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZS5pbmRleE9mKCdhcHBsaWNhdGlvbi9qc29uJykgIT09IC0xO1xuXG4gICAgICAgIGlmIChjb250ZW50VHlwZSAhPSBudWxsICYmICFoYXNKc29uQ29udGVudFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgICAgICAgaWYgKCFjb250ZW50VHlwZSkge1xuICAgICAgICAgICAgICAgIHJlcS5oZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlcS5ib2R5ID0gSlNPTi5zdHJpbmdpZnkocmVxLmJvZHkpO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcHJvY2Vzc1JlcXVlc3Q6IGZ1bmN0aW9uIChyZXEpIHtcbiAgICAgICAgdmFyIGFjY2VwdCA9IHJlcS5oZWFkZXIoJ0FjY2VwdCcpO1xuICAgICAgICBpZiAoYWNjZXB0ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJlcS5oZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHByb2Nlc3NSZXNwb25zZTogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGNvbnRlbnR5cGUgaXMgXCJzb21ldGhpbmcvanNvblwiIG9yXG4gICAgICAgIC8vIFwic29tZXRoaW5nL3NvbWV0aGluZ2Vsc2UranNvblwiXG4gICAgICAgIGlmIChyZXMuY29udGVudFR5cGUgJiYgL14uKlxcLyg/Oi4qXFwrKT9qc29uKDt8JCkvaS50ZXN0KHJlcy5jb250ZW50VHlwZSkpIHtcbiAgICAgICAgICAgIHZhciByYXcgPSB0eXBlb2YgcmVzLmJvZHkgPT09ICdzdHJpbmcnID8gcmVzLmJvZHkgOiByZXMudGV4dDtcbiAgICAgICAgICAgIGlmIChyYXcpIHtcbiAgICAgICAgICAgICAgICByZXMuYm9keSA9IEpTT04ucGFyc2UocmF3KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJ2YXIgaHR0cCA9IHJlcXVpcmUoXCJodHRwcGxlYXNlXCIpO1xudmFyIHByb21pc2VzID0gcmVxdWlyZSgnaHR0cHBsZWFzZS1wcm9taXNlcycpO1xudmFyIFByb21pc2UgPSByZXF1aXJlKCdlczYtcHJvbWlzZScpLlByb21pc2U7XG52YXIganNvbiA9IHJlcXVpcmUoXCJodHRwcGxlYXNlL3BsdWdpbnMvanNvblwiKTtcbmpzb25IdHRwID0gaHR0cC51c2UoanNvbikudXNlKHByb21pc2VzKFByb21pc2UpKTtcbmh0dHAgPSBodHRwLnVzZShwcm9taXNlcyhQcm9taXNlKSk7XG5cbnZhciBjdHR2QXBpID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIHByZWZpeGVzXG4gICAgdmFyIHByZWZpeCA9IFwiaHR0cHM6Ly9iZXRhLnRhcmdldHZhbGlkYXRpb24ub3JnL2FwaS9sYXRlc3QvXCI7XG4gICAgdmFyIHByZWZpeEZpbHRlcmJ5ID0gXCJmaWx0ZXJieT9cIjtcbiAgICB2YXIgcHJlZml4QXNzb2NpYXRpb25zID0gXCJhc3NvY2lhdGlvbj9cIjtcbiAgICB2YXIgcHJlZml4U2VhcmNoID0gXCJzZWFyY2g/XCI7XG4gICAgdmFyIHByZWZpeEdlbmUgPSBcImdlbmUvXCI7XG4gICAgdmFyIHByZWZpeERpc2Vhc2UgPSBcImRpc2Vhc2UvXCI7IC8vIHVwZGF0ZWQgZnJvbSBcImVmb1wiIHRvIFwiZGlzZWFzZVwiXG4gICAgdmFyIHByZWZpeFRva2VuID0gXCJhdXRoL3JlcXVlc3RfdG9rZW4/XCI7XG4gICAgdmFyIHByZWZpeEF1dG9jb21wbGV0ZSA9IFwiYXV0b2NvbXBsZXRlP1wiO1xuICAgIHZhciBwcmVmaXhRdWlja1NlYXJjaCA9IFwicXVpY2tzZWFyY2g/XCI7XG4gICAgdmFyIHByZWZpeEV4cHJlc3Npb24gPSBcImV4cHJlc3Npb24/XCI7XG4gICAgdmFyIHByZWZpeFByb3h5ID0gXCJwcm94eS9nZW5lcmljL1wiO1xuICAgIHZhciBwcmVmaXhUYXJnZXQgPSBcInRhcmdldC9cIjsgLy8gdGhpcyByZXBsYWNlcyBwcmVmaXhHZW5lXG5cbiAgICB2YXIgY3JlZGVudGlhbHMgPSB7XG4gICAgICAgIHRva2VuIDogXCJcIixcbiAgICAgICAgYXBwbmFtZSA6IFwiXCIsXG4gICAgICAgIHNlY3JldCA6IFwiXCJcbiAgICB9O1xuXG4gICAgdmFyIG9uRXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfTtcblxuICAgIHZhciBnZXRUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRva2VuVXJsID0gXy51cmwucmVxdWVzdFRva2VuKGNyZWRlbnRpYWxzKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIlRPS0VOIFVSTDogXCIgKyB0b2tlblVybCk7XG4gICAgICAgIHJldHVybiBqc29uSHR0cC5nZXQoe1xuICAgICAgICAgICAgXCJ1cmxcIjogdG9rZW5VcmxcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBfID0ge307XG4gICAgXy5jYWxsID0gZnVuY3Rpb24gKG15dXJsLCBjYWxsYmFjaywgZGF0YSkge1xuICAgICAgICAvLyBObyBhdXRoXG4gICAgICAgIGlmICgoIWNyZWRlbnRpYWxzLnRva2VuKSAmJiAoIWNyZWRlbnRpYWxzLmFwcG5hbWUpICYmICghY3JlZGVudGlhbHMuc2VjcmV0KSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgQ3R0dkFwaSBydW5uaW5nIGluIG5vbi1hdXRoZW50aWNhdGlvbiBtb2RlXCIpO1xuICAgICAgICAgICAgaWYgKGRhdGEpeyAvLyBwb3N0XG4gICAgICAgICAgICAgICAgcmV0dXJuIGpzb25IdHRwLnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICBcInVybFwiOiBteXVybCxcbiAgICAgICAgICAgICAgICAgICAgXCJib2R5XCI6IGRhdGFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBqc29uSHR0cC5nZXQoe1xuICAgICAgICAgICAgICAgIFwidXJsXCIgOiBteXVybFxuICAgICAgICAgICAgfSwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY3JlZGVudGlhbHMudG9rZW4pIHtcbiAgICAgICAgICAgIC8vXHRcdCAgICBjb25zb2xlLmxvZyhcIk5vIGNyZWRlbnRpYWwgdG9rZW4sIHJlcXVlc3Rpbmcgb25lLi4uXCIpO1xuXG4gICAgICAgICAgICByZXR1cm4gZ2V0VG9rZW4oKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCIgICA9PT09PT0+PiBHb3QgYSBuZXcgdG9rZW46IFwiICsgcmVzcC5ib2R5LnRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jcmVkZW50aWFscy50b2tlbiA9IHJlc3AuYm9keS50b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkF1dGgtdG9rZW5cIjogcmVzcC5ib2R5LnRva2VuXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHZhciBteVByb21pc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7IC8vIHBvc3RcbiAgICAgICAgICAgICAgICAgICAgICAgIG15UHJvbWlzZSA9IGpzb25IdHRwLnBvc3QgKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInVybFwiOiBteXVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlYWRlcnNcIjogaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvZHlcIjogZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIGdldFxuICAgICAgICAgICAgICAgICAgICAgICAgbXlQcm9taXNlID0ganNvbkh0dHAuZ2V0ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cmxcIjogbXl1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWFkZXJzXCI6IGhlYWRlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGNhbGxiYWNrKS5jYXRjaChvbkVycm9yKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBteVByb21pc2U7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vXHRcdCAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnQgdG9rZW4gaXM6IFwiICsgY3JlZGVudGlhbHMudG9rZW4pO1xuICAgICAgICAgICAgcmV0dXJuIGpzb25IdHRwLmdldCh7XG4gICAgICAgICAgICAgICAgXCJ1cmxcIiA6IG15dXJsLFxuICAgICAgICAgICAgICAgIFwiaGVhZGVyc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiQXV0aC10b2tlblwiOiBjcmVkZW50aWFscy50b2tlblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGNhbGxiYWNrKS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgLy8gTG9naWMgdG8gZGVhbCB3aXRoIGV4cGlyZWQgdG9rZW5zXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIgICAgIC0tLSBSZWNlaXZlZCBhbiBhcGkgZXJyb3IgLS0gUG9zc2libHkgdGhlIHRva2VuIGhhcyBleHBpcmVkLCBzbyBJJ2xsIHJlcXVlc3QgYSBuZXcgb25lXCIpO1xuICAgICAgICAgICAgICAgIG9uRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFscy50b2tlbiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8uY2FsbChteXVybCwgY2FsbGJhY2ssIGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgXy5vbkVycm9yID0gZnVuY3Rpb24gKGNiYWspIHtcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gb25FcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBvbkVycm9yID0gY2JhaztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIENyZWRlbnRpYWxzIEFQSVxuICAgIF8uYXBwbmFtZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWRlbnRpYWxzLmFwcG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgY3JlZGVudGlhbHMuYXBwbmFtZSA9IG5hbWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBfLnNlY3JldCA9IGZ1bmN0aW9uIChzZWMpIHtcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlZGVudGlhbHMuc2VjcmV0O1xuICAgICAgICB9XG4gICAgICAgIGNyZWRlbnRpYWxzLnNlY3JldCA9IHNlYztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIF8udG9rZW4gPSBmdW5jdGlvbiAodG9rKSB7XG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWRlbnRpYWxzLnRva2VuO1xuICAgICAgICB9XG4gICAgICAgIGNyZWRlbnRpYWxzLnRva2VuID0gdG9rO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gZ2V0dGVyIC8gc2V0dGVyIGZvciBSRVNUIGFwaSBwcmVmaXggKFRPRE86IENhbGwgaXQgZG9tYWluPylcbiAgICBfLnByZWZpeCA9IGZ1bmN0aW9uIChkb20pIHtcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJlZml4O1xuICAgICAgICB9XG4gICAgICAgIHByZWZpeCA9IGRvbTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIFVSTCBvYmplY3RcbiAgICBfLnVybCA9IHt9O1xuXG4gICAgXy51cmwuZ2VuZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHByZWZpeCArIHByZWZpeEdlbmUgKyBvYmouZ2VuZV9pZDtcbiAgICB9O1xuXG4gICAgXy51cmwudGFyZ2V0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gcHJlZml4ICsgcHJlZml4VGFyZ2V0ICsgb2JqLnRhcmdldF9pZDtcbiAgICB9O1xuXG4gICAgXy51cmwuZGlzZWFzZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHByZWZpeCArIHByZWZpeERpc2Vhc2UgKyBvYmouY29kZTtcbiAgICB9O1xuXG4gICAgXy51cmwuc2VhcmNoID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gcHJlZml4ICsgcHJlZml4U2VhcmNoICsgcGFyc2VVcmxQYXJhbXMob2JqKTtcbiAgICB9O1xuXG4gICAgXy51cmwuYXNzb2NpYXRpb25zID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gcHJlZml4ICsgcHJlZml4QXNzb2NpYXRpb25zICsgcGFyc2VVcmxQYXJhbXMob2JqKTtcbiAgICB9O1xuXG5cbiAgICBfLnVybC5maWx0ZXJieSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIHByZWZpeCArIHByZWZpeEZpbHRlcmJ5ICsgcGFyc2VVcmxQYXJhbXMob2JqKTtcbiAgICB9O1xuXG5cbiAgICBfLnVybC5yZXF1ZXN0VG9rZW4gPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBwcmVmaXggKyBwcmVmaXhUb2tlbiArIFwiYXBwbmFtZT1cIiArIG9iai5hcHBuYW1lICsgXCImc2VjcmV0PVwiICsgb2JqLnNlY3JldDtcbiAgICB9O1xuXG4gICAgXy51cmwuYXV0b2NvbXBsZXRlID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gcHJlZml4ICsgcHJlZml4QXV0b2NvbXBsZXRlICsgcGFyc2VVcmxQYXJhbXMob2JqKTtcbiAgICB9O1xuXG4gICAgXy51cmwucXVpY2tTZWFyY2ggPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBwcmVmaXggKyBwcmVmaXhRdWlja1NlYXJjaCArIHBhcnNlVXJsUGFyYW1zKG9iaik7XG4gICAgfTtcblxuICAgIF8udXJsLmV4cHJlc3Npb24gPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBwcmVmaXggKyBwcmVmaXhFeHByZXNzaW9uICsgcGFyc2VVcmxQYXJhbXMob2JqKTtcbiAgICB9O1xuXG4gICAgXy51cmwucHJveHkgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBwcmVmaXggKyBwcmVmaXhQcm94eSArIG9iai51cmw7XG4gICAgfTtcblxuXG5cbiAgICAvKipcbiAgICAqIFRoaXMgdGFrZXMgYSBwYXJhbXMgb2JqZWN0IGFuZCByZXR1cm5zIHRoZSBwYXJhbXMgY29uY2F0ZW5hdGVkIGluIGEgc3RyaW5nLlxuICAgICogSWYgYSBwYXJhbWV0ZXIgaXMgYW4gYXJyYXksIGl0IGFkZHMgZWFjaCBpdGVtLCBhbGwgd2l0aCBodGUgc2FtZSBrZXkuXG4gICAgKiBFeGFtcGxlOlxuICAgICogICBvYmogPSB7cTonYnJhZicsc2l6ZToyMCxmaWx0ZXJzOlsnaWQnLCdwdmFsdWUnXX07XG4gICAgKiAgIGNvbnNvbGUubG9nKCBwYXJzZVVybFBhcmFtcyhvYmopICk7XG4gICAgKiAgIC8vIHByaW50cyBcInE9YnJhZiZzaXplPTIwJmZpbHRlcnM9aWQmZmlsdGVycz1wdmFsdWVcIlxuICAgICovXG4gICAgdmFyIHBhcnNlVXJsUGFyYW1zID0gZnVuY3Rpb24ob2JqKXtcbiAgICAgICAgdmFyIG9wdHMgPSBbXTtcbiAgICAgICAgZm9yKHZhciBpIGluIG9iail7XG4gICAgICAgICAgICBpZiggb2JqLmhhc093blByb3BlcnR5KGkpKXtcbiAgICAgICAgICAgICAgICBpZihvYmpbaV0uY29uc3RydWN0b3IgPT09IEFycmF5KXtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5wdXNoKGkrXCI9XCIrKG9ialtpXS5qb2luKFwiJlwiK2krXCI9XCIpKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5wdXNoKGkrXCI9XCIrb2JqW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wdHMuam9pbihcIiZcIik7XG4gICAgfTtcblxuXG4gICAgcmV0dXJuIF87XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGN0dHZBcGk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwpe1xuLyohXG4gKiBAb3ZlcnZpZXcgUlNWUCAtIGEgdGlueSBpbXBsZW1lbnRhdGlvbiBvZiBQcm9taXNlcy9BKy5cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE0IFllaHVkYSBLYXR6LCBUb20gRGFsZSwgU3RlZmFuIFBlbm5lciBhbmQgY29udHJpYnV0b3JzXG4gKiBAbGljZW5zZSAgIExpY2Vuc2VkIHVuZGVyIE1JVCBsaWNlbnNlXG4gKiAgICAgICAgICAgIFNlZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vdGlsZGVpby9yc3ZwLmpzL21hc3Rlci9MSUNFTlNFXG4gKiBAdmVyc2lvbiAgIDMuMS4wXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHV0aWxzJCRvYmplY3RPckZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJyB8fCAodHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHV0aWxzJCRpc0Z1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCR1dGlscyQkaXNNYXliZVRoZW5hYmxlKHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkdXRpbHMkJF9pc0FycmF5O1xuICAgIGlmICghQXJyYXkuaXNBcnJheSkge1xuICAgICAgbGliJHJzdnAkdXRpbHMkJF9pc0FycmF5ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpYiRyc3ZwJHV0aWxzJCRfaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHV0aWxzJCRpc0FycmF5ID0gbGliJHJzdnAkdXRpbHMkJF9pc0FycmF5O1xuXG4gICAgdmFyIGxpYiRyc3ZwJHV0aWxzJCRub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpOyB9O1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkdXRpbHMkJEYoKSB7IH1cblxuICAgIHZhciBsaWIkcnN2cCR1dGlscyQkb19jcmVhdGUgPSAoT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiAobykge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU2Vjb25kIGFyZ3VtZW50IG5vdCBzdXBwb3J0ZWQnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgICAgIH1cbiAgICAgIGxpYiRyc3ZwJHV0aWxzJCRGLnByb3RvdHlwZSA9IG87XG4gICAgICByZXR1cm4gbmV3IGxpYiRyc3ZwJHV0aWxzJCRGKCk7XG4gICAgfSk7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZXZlbnRzJCRpbmRleE9mKGNhbGxiYWNrcywgY2FsbGJhY2spIHtcbiAgICAgIGZvciAodmFyIGk9MCwgbD1jYWxsYmFja3MubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgICBpZiAoY2FsbGJhY2tzW2ldID09PSBjYWxsYmFjaykgeyByZXR1cm4gaTsgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZXZlbnRzJCRjYWxsYmFja3NGb3Iob2JqZWN0KSB7XG4gICAgICB2YXIgY2FsbGJhY2tzID0gb2JqZWN0Ll9wcm9taXNlQ2FsbGJhY2tzO1xuXG4gICAgICBpZiAoIWNhbGxiYWNrcykge1xuICAgICAgICBjYWxsYmFja3MgPSBvYmplY3QuX3Byb21pc2VDYWxsYmFja3MgPSB7fTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNhbGxiYWNrcztcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkZXZlbnRzJCRkZWZhdWx0ID0ge1xuXG4gICAgICAvKipcbiAgICAgICAgYFJTVlAuRXZlbnRUYXJnZXQubWl4aW5gIGV4dGVuZHMgYW4gb2JqZWN0IHdpdGggRXZlbnRUYXJnZXQgbWV0aG9kcy4gRm9yXG4gICAgICAgIEV4YW1wbGU6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICB2YXIgb2JqZWN0ID0ge307XG5cbiAgICAgICAgUlNWUC5FdmVudFRhcmdldC5taXhpbihvYmplY3QpO1xuXG4gICAgICAgIG9iamVjdC5vbignZmluaXNoZWQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIC8vIGhhbmRsZSBldmVudFxuICAgICAgICB9KTtcblxuICAgICAgICBvYmplY3QudHJpZ2dlcignZmluaXNoZWQnLCB7IGRldGFpbDogdmFsdWUgfSk7XG4gICAgICAgIGBgYFxuXG4gICAgICAgIGBFdmVudFRhcmdldC5taXhpbmAgYWxzbyB3b3JrcyB3aXRoIHByb3RvdHlwZXM6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICB2YXIgUGVyc29uID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgUlNWUC5FdmVudFRhcmdldC5taXhpbihQZXJzb24ucHJvdG90eXBlKTtcblxuICAgICAgICB2YXIgeWVodWRhID0gbmV3IFBlcnNvbigpO1xuICAgICAgICB2YXIgdG9tID0gbmV3IFBlcnNvbigpO1xuXG4gICAgICAgIHllaHVkYS5vbigncG9rZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1llaHVkYSBzYXlzIE9XJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRvbS5vbigncG9rZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1RvbSBzYXlzIE9XJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHllaHVkYS50cmlnZ2VyKCdwb2tlJyk7XG4gICAgICAgIHRvbS50cmlnZ2VyKCdwb2tlJyk7XG4gICAgICAgIGBgYFxuXG4gICAgICAgIEBtZXRob2QgbWl4aW5cbiAgICAgICAgQGZvciBSU1ZQLkV2ZW50VGFyZ2V0XG4gICAgICAgIEBwcml2YXRlXG4gICAgICAgIEBwYXJhbSB7T2JqZWN0fSBvYmplY3Qgb2JqZWN0IHRvIGV4dGVuZCB3aXRoIEV2ZW50VGFyZ2V0IG1ldGhvZHNcbiAgICAgICovXG4gICAgICAnbWl4aW4nOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgb2JqZWN0WydvbiddICAgICAgPSB0aGlzWydvbiddO1xuICAgICAgICBvYmplY3RbJ29mZiddICAgICA9IHRoaXNbJ29mZiddO1xuICAgICAgICBvYmplY3RbJ3RyaWdnZXInXSA9IHRoaXNbJ3RyaWdnZXInXTtcbiAgICAgICAgb2JqZWN0Ll9wcm9taXNlQ2FsbGJhY2tzID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gYGV2ZW50TmFtZWAgaXMgdHJpZ2dlcmVkXG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICBvYmplY3Qub24oJ2V2ZW50JywgZnVuY3Rpb24oZXZlbnRJbmZvKXtcbiAgICAgICAgICAvLyBoYW5kbGUgdGhlIGV2ZW50XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9iamVjdC50cmlnZ2VyKCdldmVudCcpO1xuICAgICAgICBgYGBcblxuICAgICAgICBAbWV0aG9kIG9uXG4gICAgICAgIEBmb3IgUlNWUC5FdmVudFRhcmdldFxuICAgICAgICBAcHJpdmF0ZVxuICAgICAgICBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIG5hbWUgb2YgdGhlIGV2ZW50IHRvIGxpc3RlbiBmb3JcbiAgICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICAgICovXG4gICAgICAnb24nOiBmdW5jdGlvbihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbGxDYWxsYmFja3MgPSBsaWIkcnN2cCRldmVudHMkJGNhbGxiYWNrc0Zvcih0aGlzKSwgY2FsbGJhY2tzO1xuXG4gICAgICAgIGNhbGxiYWNrcyA9IGFsbENhbGxiYWNrc1tldmVudE5hbWVdO1xuXG4gICAgICAgIGlmICghY2FsbGJhY2tzKSB7XG4gICAgICAgICAgY2FsbGJhY2tzID0gYWxsQ2FsbGJhY2tzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaWIkcnN2cCRldmVudHMkJGluZGV4T2YoY2FsbGJhY2tzLCBjYWxsYmFjaykgPT09IC0xKSB7XG4gICAgICAgICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAgWW91IGNhbiB1c2UgYG9mZmAgdG8gc3RvcCBmaXJpbmcgYSBwYXJ0aWN1bGFyIGNhbGxiYWNrIGZvciBhbiBldmVudDpcblxuICAgICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICAgIGZ1bmN0aW9uIGRvU3R1ZmYoKSB7IC8vIGRvIHN0dWZmISB9XG4gICAgICAgIG9iamVjdC5vbignc3R1ZmYnLCBkb1N0dWZmKTtcblxuICAgICAgICBvYmplY3QudHJpZ2dlcignc3R1ZmYnKTsgLy8gZG9TdHVmZiB3aWxsIGJlIGNhbGxlZFxuXG4gICAgICAgIC8vIFVucmVnaXN0ZXIgT05MWSB0aGUgZG9TdHVmZiBjYWxsYmFja1xuICAgICAgICBvYmplY3Qub2ZmKCdzdHVmZicsIGRvU3R1ZmYpO1xuICAgICAgICBvYmplY3QudHJpZ2dlcignc3R1ZmYnKTsgLy8gZG9TdHVmZiB3aWxsIE5PVCBiZSBjYWxsZWRcbiAgICAgICAgYGBgXG5cbiAgICAgICAgSWYgeW91IGRvbid0IHBhc3MgYSBgY2FsbGJhY2tgIGFyZ3VtZW50IHRvIGBvZmZgLCBBTEwgY2FsbGJhY2tzIGZvciB0aGVcbiAgICAgICAgZXZlbnQgd2lsbCBub3QgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgZXZlbnQgZmlyZXMuIEZvciBleGFtcGxlOlxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgdmFyIGNhbGxiYWNrMSA9IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgdmFyIGNhbGxiYWNrMiA9IGZ1bmN0aW9uKCl7fTtcblxuICAgICAgICBvYmplY3Qub24oJ3N0dWZmJywgY2FsbGJhY2sxKTtcbiAgICAgICAgb2JqZWN0Lm9uKCdzdHVmZicsIGNhbGxiYWNrMik7XG5cbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ3N0dWZmJyk7IC8vIGNhbGxiYWNrMSBhbmQgY2FsbGJhY2syIHdpbGwgYmUgZXhlY3V0ZWQuXG5cbiAgICAgICAgb2JqZWN0Lm9mZignc3R1ZmYnKTtcbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ3N0dWZmJyk7IC8vIGNhbGxiYWNrMSBhbmQgY2FsbGJhY2syIHdpbGwgbm90IGJlIGV4ZWN1dGVkIVxuICAgICAgICBgYGBcblxuICAgICAgICBAbWV0aG9kIG9mZlxuICAgICAgICBAZm9yIFJTVlAuRXZlbnRUYXJnZXRcbiAgICAgICAgQHByaXZhdGVcbiAgICAgICAgQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBldmVudCB0byBzdG9wIGxpc3RlbmluZyB0b1xuICAgICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBvcHRpb25hbCBhcmd1bWVudC4gSWYgZ2l2ZW4sIG9ubHkgdGhlIGZ1bmN0aW9uXG4gICAgICAgIGdpdmVuIHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBldmVudCdzIGNhbGxiYWNrIHF1ZXVlLiBJZiBubyBgY2FsbGJhY2tgXG4gICAgICAgIGFyZ3VtZW50IGlzIGdpdmVuLCBhbGwgY2FsbGJhY2tzIHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBldmVudCdzIGNhbGxiYWNrXG4gICAgICAgIHF1ZXVlLlxuICAgICAgKi9cbiAgICAgICdvZmYnOiBmdW5jdGlvbihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBhbGxDYWxsYmFja3MgPSBsaWIkcnN2cCRldmVudHMkJGNhbGxiYWNrc0Zvcih0aGlzKSwgY2FsbGJhY2tzLCBpbmRleDtcblxuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgYWxsQ2FsbGJhY2tzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFja3MgPSBhbGxDYWxsYmFja3NbZXZlbnROYW1lXTtcblxuICAgICAgICBpbmRleCA9IGxpYiRyc3ZwJGV2ZW50cyQkaW5kZXhPZihjYWxsYmFja3MsIGNhbGxiYWNrKTtcblxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7IGNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpOyB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAgVXNlIGB0cmlnZ2VyYCB0byBmaXJlIGN1c3RvbSBldmVudHMuIEZvciBleGFtcGxlOlxuXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgb2JqZWN0Lm9uKCdmb28nLCBmdW5jdGlvbigpe1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdmb28gZXZlbnQgaGFwcGVuZWQhJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBvYmplY3QudHJpZ2dlcignZm9vJyk7XG4gICAgICAgIC8vICdmb28gZXZlbnQgaGFwcGVuZWQhJyBsb2dnZWQgdG8gdGhlIGNvbnNvbGVcbiAgICAgICAgYGBgXG5cbiAgICAgICAgWW91IGNhbiBhbHNvIHBhc3MgYSB2YWx1ZSBhcyBhIHNlY29uZCBhcmd1bWVudCB0byBgdHJpZ2dlcmAgdGhhdCB3aWxsIGJlXG4gICAgICAgIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byBhbGwgZXZlbnQgbGlzdGVuZXJzIGZvciB0aGUgZXZlbnQ6XG5cbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICBvYmplY3Qub24oJ2ZvbycsIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZS5uYW1lKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JqZWN0LnRyaWdnZXIoJ2ZvbycsIHsgbmFtZTogJ2JhcicgfSk7XG4gICAgICAgIC8vICdiYXInIGxvZ2dlZCB0byB0aGUgY29uc29sZVxuICAgICAgICBgYGBcblxuICAgICAgICBAbWV0aG9kIHRyaWdnZXJcbiAgICAgICAgQGZvciBSU1ZQLkV2ZW50VGFyZ2V0XG4gICAgICAgIEBwcml2YXRlXG4gICAgICAgIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgbmFtZSBvZiB0aGUgZXZlbnQgdG8gYmUgdHJpZ2dlcmVkXG4gICAgICAgIEBwYXJhbSB7Kn0gb3B0aW9ucyBvcHRpb25hbCB2YWx1ZSB0byBiZSBwYXNzZWQgdG8gYW55IGV2ZW50IGhhbmRsZXJzIGZvclxuICAgICAgICB0aGUgZ2l2ZW4gYGV2ZW50TmFtZWBcbiAgICAgICovXG4gICAgICAndHJpZ2dlcic6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgb3B0aW9ucywgbGFiZWwpIHtcbiAgICAgICAgdmFyIGFsbENhbGxiYWNrcyA9IGxpYiRyc3ZwJGV2ZW50cyQkY2FsbGJhY2tzRm9yKHRoaXMpLCBjYWxsYmFja3MsIGNhbGxiYWNrO1xuXG4gICAgICAgIGlmIChjYWxsYmFja3MgPSBhbGxDYWxsYmFja3NbZXZlbnROYW1lXSkge1xuICAgICAgICAgIC8vIERvbid0IGNhY2hlIHRoZSBjYWxsYmFja3MubGVuZ3RoIHNpbmNlIGl0IG1heSBncm93XG4gICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFja3NbaV07XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKG9wdGlvbnMsIGxhYmVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnID0ge1xuICAgICAgaW5zdHJ1bWVudDogZmFsc2VcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZXZlbnRzJCRkZWZhdWx0WydtaXhpbiddKGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnKTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlndXJlKG5hbWUsIHZhbHVlKSB7XG4gICAgICBpZiAobmFtZSA9PT0gJ29uZXJyb3InKSB7XG4gICAgICAgIC8vIGhhbmRsZSBmb3IgbGVnYWN5IHVzZXJzIHRoYXQgZXhwZWN0IHRoZSBhY3R1YWxcbiAgICAgICAgLy8gZXJyb3IgdG8gYmUgcGFzc2VkIHRvIHRoZWlyIGZ1bmN0aW9uIGFkZGVkIHZpYVxuICAgICAgICAvLyBgUlNWUC5jb25maWd1cmUoJ29uZXJyb3InLCBzb21lRnVuY3Rpb25IZXJlKTtgXG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnWydvbiddKCdlcnJvcicsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1tuYW1lXSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnW25hbWVdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRpbnN0cnVtZW50JCRxdWV1ZSA9IFtdO1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkaW5zdHJ1bWVudCQkc2NoZWR1bGVGbHVzaCgpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbnRyeTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaWIkcnN2cCRpbnN0cnVtZW50JCRxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGVudHJ5ID0gbGliJHJzdnAkaW5zdHJ1bWVudCQkcXVldWVbaV07XG5cbiAgICAgICAgICB2YXIgcGF5bG9hZCA9IGVudHJ5LnBheWxvYWQ7XG5cbiAgICAgICAgICBwYXlsb2FkLmd1aWQgPSBwYXlsb2FkLmtleSArIHBheWxvYWQuaWQ7XG4gICAgICAgICAgcGF5bG9hZC5jaGlsZEd1aWQgPSBwYXlsb2FkLmtleSArIHBheWxvYWQuY2hpbGRJZDtcbiAgICAgICAgICBpZiAocGF5bG9hZC5lcnJvcikge1xuICAgICAgICAgICAgcGF5bG9hZC5zdGFjayA9IHBheWxvYWQuZXJyb3Iuc3RhY2s7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWdbJ3RyaWdnZXInXShlbnRyeS5uYW1lLCBlbnRyeS5wYXlsb2FkKTtcbiAgICAgICAgfVxuICAgICAgICBsaWIkcnN2cCRpbnN0cnVtZW50JCRxdWV1ZS5sZW5ndGggPSAwO1xuICAgICAgfSwgNTApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGluc3RydW1lbnQkJGluc3RydW1lbnQoZXZlbnROYW1lLCBwcm9taXNlLCBjaGlsZCkge1xuICAgICAgaWYgKDEgPT09IGxpYiRyc3ZwJGluc3RydW1lbnQkJHF1ZXVlLnB1c2goe1xuICAgICAgICBuYW1lOiBldmVudE5hbWUsXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICBrZXk6IHByb21pc2UuX2d1aWRLZXksXG4gICAgICAgICAgaWQ6ICBwcm9taXNlLl9pZCxcbiAgICAgICAgICBldmVudE5hbWU6IGV2ZW50TmFtZSxcbiAgICAgICAgICBkZXRhaWw6IHByb21pc2UuX3Jlc3VsdCxcbiAgICAgICAgICBjaGlsZElkOiBjaGlsZCAmJiBjaGlsZC5faWQsXG4gICAgICAgICAgbGFiZWw6IHByb21pc2UuX2xhYmVsLFxuICAgICAgICAgIHRpbWVTdGFtcDogbGliJHJzdnAkdXRpbHMkJG5vdygpLFxuICAgICAgICAgIGVycm9yOiBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1tcImluc3RydW1lbnQtd2l0aC1zdGFja1wiXSA/IG5ldyBFcnJvcihwcm9taXNlLl9sYWJlbCkgOiBudWxsXG4gICAgICAgIH19KSkge1xuICAgICAgICAgIGxpYiRyc3ZwJGluc3RydW1lbnQkJHNjaGVkdWxlRmx1c2goKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIHZhciBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0ID0gbGliJHJzdnAkaW5zdHJ1bWVudCQkaW5zdHJ1bWVudDtcblxuICAgIGZ1bmN0aW9uICBsaWIkcnN2cCQkaW50ZXJuYWwkJHdpdGhPd25Qcm9taXNlKCkge1xuICAgICAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZXMgY2FsbGJhY2sgY2Fubm90IHJldHVybiB0aGF0IHNhbWUgcHJvbWlzZS4nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AoKSB7fVxuXG4gICAgdmFyIGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORyAgID0gdm9pZCAwO1xuICAgIHZhciBsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCA9IDE7XG4gICAgdmFyIGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQgID0gMjtcblxuICAgIHZhciBsaWIkcnN2cCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SID0gbmV3IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZ2V0VGhlbihwcm9taXNlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SLmVycm9yID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBsaWIkcnN2cCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkdHJ5VGhlbih0aGVuLCB2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcik7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUsIHRoZW4pIHtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGZ1bmN0aW9uKHByb21pc2UpIHtcbiAgICAgICAgdmFyIHNlYWxlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgZXJyb3IgPSBsaWIkcnN2cCQkaW50ZXJuYWwkJHRyeVRoZW4odGhlbiwgdGhlbmFibGUsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHNlYWxlZCkgeyByZXR1cm47IH1cbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICBpZiAoc2VhbGVkKSB7IHJldHVybjsgfVxuICAgICAgICAgIHNlYWxlZCA9IHRydWU7XG5cbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9LCAnU2V0dGxlOiAnICsgKHByb21pc2UuX2xhYmVsIHx8ICcgdW5rbm93biBwcm9taXNlJykpO1xuXG4gICAgICAgIGlmICghc2VhbGVkICYmIGVycm9yKSB7XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0sIHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUpIHtcbiAgICAgIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgICAgIH0gZWxzZSBpZiAodGhlbmFibGUuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEKSB7XG4gICAgICAgIHRoZW5hYmxlLl9vbkVycm9yID0gbnVsbDtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHN1YnNjcmliZSh0aGVuYWJsZSwgdW5kZWZpbmVkLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSkge1xuICAgICAgaWYgKG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IgPT09IHByb21pc2UuY29uc3RydWN0b3IpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB0aGVuID0gbGliJHJzdnAkJGludGVybmFsJCRnZXRUaGVuKG1heWJlVGhlbmFibGUpO1xuXG4gICAgICAgIGlmICh0aGVuID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbGliJHJzdnAkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUi5lcnJvcik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhlbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGxpYiRyc3ZwJHV0aWxzJCRpc0Z1bmN0aW9uKHRoZW4pKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKSB7XG4gICAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAobGliJHJzdnAkdXRpbHMkJG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gICAgICBpZiAocHJvbWlzZS5fb25FcnJvcikge1xuICAgICAgICBwcm9taXNlLl9vbkVycm9yKHByb21pc2UuX3Jlc3VsdCk7XG4gICAgICB9XG5cbiAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaChwcm9taXNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpIHtcbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7IHJldHVybjsgfVxuXG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3N0YXRlID0gbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQ7XG5cbiAgICAgIGlmIChwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgaWYgKGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmluc3RydW1lbnQpIHtcbiAgICAgICAgICBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0KCdmdWxmaWxsZWQnLCBwcm9taXNlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMobGliJHJzdnAkJGludGVybmFsJCRwdWJsaXNoLCBwcm9taXNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pIHtcbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7IHJldHVybjsgfVxuICAgICAgcHJvbWlzZS5fc3RhdGUgPSBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEO1xuICAgICAgcHJvbWlzZS5fcmVzdWx0ID0gcmVhc29uO1xuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWcuYXN5bmMobGliJHJzdnAkJGludGVybmFsJCRwdWJsaXNoUmVqZWN0aW9uLCBwcm9taXNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICAgICAgdmFyIHN1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcbiAgICAgIHZhciBsZW5ndGggPSBzdWJzY3JpYmVycy5sZW5ndGg7XG5cbiAgICAgIHBhcmVudC5fb25FcnJvciA9IG51bGw7XG5cbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aF0gPSBjaGlsZDtcbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aCArIGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEXSA9IG9uRnVsZmlsbG1lbnQ7XG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGggKyBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEXSAgPSBvblJlamVjdGlvbjtcblxuICAgICAgaWYgKGxlbmd0aCA9PT0gMCAmJiBwYXJlbnQuX3N0YXRlKSB7XG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGxpYiRyc3ZwJCRpbnRlcm5hbCQkcHVibGlzaCwgcGFyZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJHB1Ymxpc2gocHJvbWlzZSkge1xuICAgICAgdmFyIHN1YnNjcmliZXJzID0gcHJvbWlzZS5fc3Vic2NyaWJlcnM7XG4gICAgICB2YXIgc2V0dGxlZCA9IHByb21pc2UuX3N0YXRlO1xuXG4gICAgICBpZiAobGliJHJzdnAkY29uZmlnJCRjb25maWcuaW5zdHJ1bWVudCkge1xuICAgICAgICBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0KHNldHRsZWQgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEID8gJ2Z1bGZpbGxlZCcgOiAncmVqZWN0ZWQnLCBwcm9taXNlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cblxuICAgICAgdmFyIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgY2hpbGQsIGNhbGxiYWNrLCBkZXRhaWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKGRldGFpbCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCkge1xuICAgICAgdGhpcy5lcnJvciA9IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SID0gbmV3IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGRldGFpbCk7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IuZXJyb3IgPSBlO1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBwcm9taXNlLCBjYWxsYmFjaywgZGV0YWlsKSB7XG4gICAgICB2YXIgaGFzQ2FsbGJhY2sgPSBsaWIkcnN2cCR1dGlscyQkaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICAgICAgdmFsdWUsIGVycm9yLCBzdWNjZWVkZWQsIGZhaWxlZDtcblxuICAgICAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgICAgIHZhbHVlID0gbGliJHJzdnAkJGludGVybmFsJCR0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKTtcblxuICAgICAgICBpZiAodmFsdWUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SKSB7XG4gICAgICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgICBlcnJvciA9IHZhbHVlLmVycm9yO1xuICAgICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbGliJHJzdnAkJGludGVybmFsJCR3aXRoT3duUHJvbWlzZSgpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBkZXRhaWw7XG4gICAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgIC8vIG5vb3BcbiAgICAgIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGZhaWxlZCkge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRpbnRlcm5hbCQkaW5pdGlhbGl6ZVByb21pc2UocHJvbWlzZSwgcmVzb2x2ZXIpIHtcbiAgICAgIHZhciByZXNvbHZlZCA9IGZhbHNlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzb2x2ZXIoZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UodmFsdWUpe1xuICAgICAgICAgIGlmIChyZXNvbHZlZCkgeyByZXR1cm47IH1cbiAgICAgICAgICByZXNvbHZlZCA9IHRydWU7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZShyZWFzb24pIHtcbiAgICAgICAgICBpZiAocmVzb2x2ZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgcmVzb2x2ZWQgPSB0cnVlO1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGVudW1lcmF0b3IkJG1ha2VTZXR0bGVkUmVzdWx0KHN0YXRlLCBwb3NpdGlvbiwgdmFsdWUpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0ZTogJ2Z1bGZpbGxlZCcsXG4gICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0ZTogJ3JlamVjdGVkJyxcbiAgICAgICAgICByZWFzb246IHZhbHVlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvcihDb25zdHJ1Y3RvciwgaW5wdXQsIGFib3J0T25SZWplY3QsIGxhYmVsKSB7XG4gICAgICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG5cbiAgICAgIGVudW1lcmF0b3IuX2luc3RhbmNlQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgICAgIGVudW1lcmF0b3IucHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AsIGxhYmVsKTtcbiAgICAgIGVudW1lcmF0b3IuX2Fib3J0T25SZWplY3QgPSBhYm9ydE9uUmVqZWN0O1xuXG4gICAgICBpZiAoZW51bWVyYXRvci5fdmFsaWRhdGVJbnB1dChpbnB1dCkpIHtcbiAgICAgICAgZW51bWVyYXRvci5faW5wdXQgICAgID0gaW5wdXQ7XG4gICAgICAgIGVudW1lcmF0b3IubGVuZ3RoICAgICA9IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgZW51bWVyYXRvci5fcmVtYWluaW5nID0gaW5wdXQubGVuZ3RoO1xuXG4gICAgICAgIGVudW1lcmF0b3IuX2luaXQoKTtcblxuICAgICAgICBpZiAoZW51bWVyYXRvci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwoZW51bWVyYXRvci5wcm9taXNlLCBlbnVtZXJhdG9yLl9yZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVudW1lcmF0b3IubGVuZ3RoID0gZW51bWVyYXRvci5sZW5ndGggfHwgMDtcbiAgICAgICAgICBlbnVtZXJhdG9yLl9lbnVtZXJhdGUoKTtcbiAgICAgICAgICBpZiAoZW51bWVyYXRvci5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJGZ1bGZpbGwoZW51bWVyYXRvci5wcm9taXNlLCBlbnVtZXJhdG9yLl9yZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QoZW51bWVyYXRvci5wcm9taXNlLCBlbnVtZXJhdG9yLl92YWxpZGF0aW9uRXJyb3IoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQgPSBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yO1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3ZhbGlkYXRlSW5wdXQgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHV0aWxzJCRpc0FycmF5KGlucHV0KTtcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3ZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignQXJyYXkgTWV0aG9kcyBtdXN0IGJlIHByb3ZpZGVkIGFuIEFycmF5Jyk7XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9yZXN1bHQgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fZW51bWVyYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG4gICAgICB2YXIgbGVuZ3RoICAgICA9IGVudW1lcmF0b3IubGVuZ3RoO1xuICAgICAgdmFyIHByb21pc2UgICAgPSBlbnVtZXJhdG9yLnByb21pc2U7XG4gICAgICB2YXIgaW5wdXQgICAgICA9IGVudW1lcmF0b3IuX2lucHV0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgcHJvbWlzZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZW51bWVyYXRvci5fZWFjaEVudHJ5KGlucHV0W2ldLCBpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2VhY2hFbnRyeSA9IGZ1bmN0aW9uKGVudHJ5LCBpKSB7XG4gICAgICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG4gICAgICB2YXIgYyA9IGVudW1lcmF0b3IuX2luc3RhbmNlQ29uc3RydWN0b3I7XG4gICAgICBpZiAobGliJHJzdnAkdXRpbHMkJGlzTWF5YmVUaGVuYWJsZShlbnRyeSkpIHtcbiAgICAgICAgaWYgKGVudHJ5LmNvbnN0cnVjdG9yID09PSBjICYmIGVudHJ5Ll9zdGF0ZSAhPT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgICAgZW50cnkuX29uRXJyb3IgPSBudWxsO1xuICAgICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdChlbnRyeS5fc3RhdGUsIGksIGVudHJ5Ll9yZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVudW1lcmF0b3IuX3dpbGxTZXR0bGVBdChjLnJlc29sdmUoZW50cnkpLCBpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW51bWVyYXRvci5fcmVtYWluaW5nLS07XG4gICAgICAgIGVudW1lcmF0b3IuX3Jlc3VsdFtpXSA9IGVudW1lcmF0b3IuX21ha2VSZXN1bHQobGliJHJzdnAkJGludGVybmFsJCRGVUxGSUxMRUQsIGksIGVudHJ5KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGliJHJzdnAkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3NldHRsZWRBdCA9IGZ1bmN0aW9uKHN0YXRlLCBpLCB2YWx1ZSkge1xuICAgICAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuICAgICAgdmFyIHByb21pc2UgPSBlbnVtZXJhdG9yLnByb21pc2U7XG5cbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgIGVudW1lcmF0b3IuX3JlbWFpbmluZy0tO1xuXG4gICAgICAgIGlmIChlbnVtZXJhdG9yLl9hYm9ydE9uUmVqZWN0ICYmIHN0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEKSB7XG4gICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVudW1lcmF0b3IuX3Jlc3VsdFtpXSA9IGVudW1lcmF0b3IuX21ha2VSZXN1bHQoc3RhdGUsIGksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZW51bWVyYXRvci5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCBlbnVtZXJhdG9yLl9yZXN1bHQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fbWFrZVJlc3VsdCA9IGZ1bmN0aW9uKHN0YXRlLCBpLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fd2lsbFNldHRsZUF0ID0gZnVuY3Rpb24ocHJvbWlzZSwgaSkge1xuICAgICAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuXG4gICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHN1YnNjcmliZShwcm9taXNlLCB1bmRlZmluZWQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdChsaWIkcnN2cCQkaW50ZXJuYWwkJEZVTEZJTExFRCwgaSwgdmFsdWUpO1xuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdChsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVELCBpLCByZWFzb24pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJGFsbCQkYWxsKGVudHJpZXMsIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbmV3IGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQodGhpcywgZW50cmllcywgdHJ1ZSAvKiBhYm9ydCBvbiByZWplY3QgKi8sIGxhYmVsKS5wcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSRhbGwkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJGFsbCQkYWxsO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkcmFjZSQkcmFjZShlbnRyaWVzLCBsYWJlbCkge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICAgIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuXG4gICAgICBpZiAoIWxpYiRyc3ZwJHV0aWxzJCRpc0FycmF5KGVudHJpZXMpKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7XG5cbiAgICAgIGZ1bmN0aW9uIG9uRnVsZmlsbG1lbnQodmFsdWUpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gb25SZWplY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBwcm9taXNlLl9zdGF0ZSA9PT0gbGliJHJzdnAkJGludGVybmFsJCRQRU5ESU5HICYmIGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHN1YnNjcmliZShDb25zdHJ1Y3Rvci5yZXNvbHZlKGVudHJpZXNbaV0pLCB1bmRlZmluZWQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJHJhY2UkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJHJhY2UkJHJhY2U7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRyZXNvbHZlKG9iamVjdCwgbGFiZWwpIHtcbiAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgICBpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH1cblxuICAgICAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3IobGliJHJzdnAkJGludGVybmFsJCRub29wLCBsYWJlbCk7XG4gICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgb2JqZWN0KTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSRyZXNvbHZlJCRyZXNvbHZlO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkcmVqZWN0JCRyZWplY3QocmVhc29uLCBsYWJlbCkge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3AsIGxhYmVsKTtcbiAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkcmVqZWN0JCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSRyZWplY3QkJHJlamVjdDtcblxuICAgIHZhciBsaWIkcnN2cCRwcm9taXNlJCRndWlkS2V5ID0gJ3JzdnBfJyArIGxpYiRyc3ZwJHV0aWxzJCRub3coKSArICctJztcbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSQkY291bnRlciA9IDA7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJCRuZWVkc1Jlc29sdmVyKCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHByb21pc2UkJG5lZWRzTmV3KCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlKHJlc29sdmVyLCBsYWJlbCkge1xuICAgICAgdmFyIHByb21pc2UgPSB0aGlzO1xuXG4gICAgICBwcm9taXNlLl9pZCA9IGxpYiRyc3ZwJHByb21pc2UkJGNvdW50ZXIrKztcbiAgICAgIHByb21pc2UuX2xhYmVsID0gbGFiZWw7XG4gICAgICBwcm9taXNlLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgIHByb21pc2UuX3Jlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgIHByb21pc2UuX3N1YnNjcmliZXJzID0gW107XG5cbiAgICAgIGlmIChsaWIkcnN2cCRjb25maWckJGNvbmZpZy5pbnN0cnVtZW50KSB7XG4gICAgICAgIGxpYiRyc3ZwJGluc3RydW1lbnQkJGRlZmF1bHQoJ2NyZWF0ZWQnLCBwcm9taXNlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCAhPT0gcmVzb2x2ZXIpIHtcbiAgICAgICAgaWYgKCFsaWIkcnN2cCR1dGlscyQkaXNGdW5jdGlvbihyZXNvbHZlcikpIHtcbiAgICAgICAgICBsaWIkcnN2cCRwcm9taXNlJCRuZWVkc1Jlc29sdmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIShwcm9taXNlIGluc3RhbmNlb2YgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZSkpIHtcbiAgICAgICAgICBsaWIkcnN2cCRwcm9taXNlJCRuZWVkc05ldygpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRpbml0aWFsaXplUHJvbWlzZShwcm9taXNlLCByZXNvbHZlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQgPSBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlO1xuXG4gICAgLy8gZGVwcmVjYXRlZFxuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UuY2FzdCA9IGxpYiRyc3ZwJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLmFsbCA9IGxpYiRyc3ZwJHByb21pc2UkYWxsJCRkZWZhdWx0O1xuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UucmFjZSA9IGxpYiRyc3ZwJHByb21pc2UkcmFjZSQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRwcm9taXNlJCRQcm9taXNlLnJlc29sdmUgPSBsaWIkcnN2cCRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkcHJvbWlzZSQkUHJvbWlzZS5yZWplY3QgPSBsaWIkcnN2cCRwcm9taXNlJHJlamVjdCQkZGVmYXVsdDtcblxuICAgIGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UucHJvdG90eXBlID0ge1xuICAgICAgY29uc3RydWN0b3I6IGxpYiRyc3ZwJHByb21pc2UkJFByb21pc2UsXG5cbiAgICAgIF9ndWlkS2V5OiBsaWIkcnN2cCRwcm9taXNlJCRndWlkS2V5LFxuXG4gICAgICBfb25FcnJvcjogZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gICAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFmdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChwcm9taXNlLl9vbkVycm9yKSB7XG4gICAgICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1sndHJpZ2dlciddKCdlcnJvcicsIHJlYXNvbiwgcHJvbWlzZS5fbGFiZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgLyoqXG4gICAgICBUaGUgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCxcbiAgICAgIHdoaWNoIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlXG4gICAgICByZWFzb24gd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAgIC8vIHVzZXIgaXMgYXZhaWxhYmxlXG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyB1c2VyIGlzIHVuYXZhaWxhYmxlLCBhbmQgeW91IGFyZSBnaXZlbiB0aGUgcmVhc29uIHdoeVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQ2hhaW5pbmdcbiAgICAgIC0tLS0tLS0tXG5cbiAgICAgIFRoZSByZXR1cm4gdmFsdWUgb2YgYHRoZW5gIGlzIGl0c2VsZiBhIHByb21pc2UuICBUaGlzIHNlY29uZCwgJ2Rvd25zdHJlYW0nXG4gICAgICBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZmlyc3QgcHJvbWlzZSdzIGZ1bGZpbGxtZW50XG4gICAgICBvciByZWplY3Rpb24gaGFuZGxlciwgb3IgcmVqZWN0ZWQgaWYgdGhlIGhhbmRsZXIgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICByZXR1cm4gdXNlci5uYW1lO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICByZXR1cm4gJ2RlZmF1bHQgbmFtZSc7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh1c2VyTmFtZSkge1xuICAgICAgICAvLyBJZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHVzZXJOYW1lYCB3aWxsIGJlIHRoZSB1c2VyJ3MgbmFtZSwgb3RoZXJ3aXNlIGl0XG4gICAgICAgIC8vIHdpbGwgYmUgYCdkZWZhdWx0IG5hbWUnYFxuICAgICAgfSk7XG5cbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jyk7XG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAvLyBpZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHJlYXNvbmAgd2lsbCBiZSAnRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknLlxuICAgICAgICAvLyBJZiBgZmluZFVzZXJgIHJlamVjdGVkLCBgcmVhc29uYCB3aWxsIGJlICdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jy5cbiAgICAgIH0pO1xuICAgICAgYGBgXG4gICAgICBJZiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIGRvZXMgbm90IHNwZWNpZnkgYSByZWplY3Rpb24gaGFuZGxlciwgcmVqZWN0aW9uIHJlYXNvbnMgd2lsbCBiZSBwcm9wYWdhdGVkIGZ1cnRoZXIgZG93bnN0cmVhbS5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICB0aHJvdyBuZXcgUGVkYWdvZ2ljYWxFeGNlcHRpb24oJ1Vwc3RyZWFtIGVycm9yJyk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIC8vIFRoZSBgUGVkZ2Fnb2NpYWxFeGNlcHRpb25gIGlzIHByb3BhZ2F0ZWQgYWxsIHRoZSB3YXkgZG93biB0byBoZXJlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBBc3NpbWlsYXRpb25cbiAgICAgIC0tLS0tLS0tLS0tLVxuXG4gICAgICBTb21ldGltZXMgdGhlIHZhbHVlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSB0byBhIGRvd25zdHJlYW0gcHJvbWlzZSBjYW4gb25seSBiZVxuICAgICAgcmV0cmlldmVkIGFzeW5jaHJvbm91c2x5LiBUaGlzIGNhbiBiZSBhY2hpZXZlZCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIHRoZVxuICAgICAgZnVsZmlsbG1lbnQgb3IgcmVqZWN0aW9uIGhhbmRsZXIuIFRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCB0aGVuIGJlIHBlbmRpbmdcbiAgICAgIHVudGlsIHRoZSByZXR1cm5lZCBwcm9taXNlIGlzIHNldHRsZWQuIFRoaXMgaXMgY2FsbGVkICphc3NpbWlsYXRpb24qLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAgIC8vIFRoZSB1c2VyJ3MgY29tbWVudHMgYXJlIG5vdyBhdmFpbGFibGVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIElmIHRoZSBhc3NpbWxpYXRlZCBwcm9taXNlIHJlamVjdHMsIHRoZW4gdGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIGFsc28gcmVqZWN0LlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgZnVsZmlsbHMsIHdlJ2xsIGhhdmUgdGhlIHZhbHVlIGhlcmVcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCByZWplY3RzLCB3ZSdsbCBoYXZlIHRoZSByZWFzb24gaGVyZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgU2ltcGxlIEV4YW1wbGVcbiAgICAgIC0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgdmFyIHJlc3VsdDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gZmluZFJlc3VsdCgpO1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9XG4gICAgICBgYGBcblxuICAgICAgRXJyYmFjayBFeGFtcGxlXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kUmVzdWx0KGZ1bmN0aW9uKHJlc3VsdCwgZXJyKXtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBzdWNjZXNzXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFByb21pc2UgRXhhbXBsZTtcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgZmluZFJlc3VsdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQWR2YW5jZWQgRXhhbXBsZVxuICAgICAgLS0tLS0tLS0tLS0tLS1cblxuICAgICAgU3luY2hyb25vdXMgRXhhbXBsZVxuXG4gICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICB2YXIgYXV0aG9yLCBib29rcztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgYXV0aG9yID0gZmluZEF1dGhvcigpO1xuICAgICAgICBib29rcyAgPSBmaW5kQm9va3NCeUF1dGhvcihhdXRob3IpO1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9XG4gICAgICBgYGBcblxuICAgICAgRXJyYmFjayBFeGFtcGxlXG5cbiAgICAgIGBgYGpzXG5cbiAgICAgIGZ1bmN0aW9uIGZvdW5kQm9va3MoYm9va3MpIHtcblxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBmYWlsdXJlKHJlYXNvbikge1xuXG4gICAgICB9XG5cbiAgICAgIGZpbmRBdXRob3IoZnVuY3Rpb24oYXV0aG9yLCBlcnIpe1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmluZEJvb29rc0J5QXV0aG9yKGF1dGhvciwgZnVuY3Rpb24oYm9va3MsIGVycikge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBmb3VuZEJvb2tzKGJvb2tzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAgICAgICAgICAgZmFpbHVyZShyZWFzb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBzdWNjZXNzXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFByb21pc2UgRXhhbXBsZTtcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgZmluZEF1dGhvcigpLlxuICAgICAgICB0aGVuKGZpbmRCb29rc0J5QXV0aG9yKS5cbiAgICAgICAgdGhlbihmdW5jdGlvbihib29rcyl7XG4gICAgICAgICAgLy8gZm91bmQgYm9va3NcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBAbWV0aG9kIHRoZW5cbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsZmlsbG1lbnRcbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0aW9uXG4gICAgICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBsYWJlbGluZyB0aGUgcHJvbWlzZS5cbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICAgKi9cbiAgICAgIHRoZW46IGZ1bmN0aW9uKG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uLCBsYWJlbCkge1xuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcztcbiAgICAgICAgdmFyIHN0YXRlID0gcGFyZW50Ll9zdGF0ZTtcblxuICAgICAgICBpZiAoc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkRlVMRklMTEVEICYmICFvbkZ1bGZpbGxtZW50IHx8IHN0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFJFSkVDVEVEICYmICFvblJlamVjdGlvbikge1xuICAgICAgICAgIGlmIChsaWIkcnN2cCRjb25maWckJGNvbmZpZy5pbnN0cnVtZW50KSB7XG4gICAgICAgICAgICBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0KCdjaGFpbmVkJywgcGFyZW50LCBwYXJlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcGFyZW50Ll9vbkVycm9yID0gbnVsbDtcblxuICAgICAgICB2YXIgY2hpbGQgPSBuZXcgcGFyZW50LmNvbnN0cnVjdG9yKGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuICAgICAgICB2YXIgcmVzdWx0ID0gcGFyZW50Ll9yZXN1bHQ7XG5cbiAgICAgICAgaWYgKGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmluc3RydW1lbnQpIHtcbiAgICAgICAgICBsaWIkcnN2cCRpbnN0cnVtZW50JCRkZWZhdWx0KCdjaGFpbmVkJywgcGFyZW50LCBjaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbc3RhdGUgLSAxXTtcbiAgICAgICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hc3luYyhmdW5jdGlvbigpe1xuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzdGF0ZSwgY2hpbGQsIGNhbGxiYWNrLCByZXN1bHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICAgIH0sXG5cbiAgICAvKipcbiAgICAgIGBjYXRjaGAgaXMgc2ltcGx5IHN1Z2FyIGZvciBgdGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uKWAgd2hpY2ggbWFrZXMgaXQgdGhlIHNhbWVcbiAgICAgIGFzIHRoZSBjYXRjaCBibG9jayBvZiBhIHRyeS9jYXRjaCBzdGF0ZW1lbnQuXG5cbiAgICAgIGBgYGpzXG4gICAgICBmdW5jdGlvbiBmaW5kQXV0aG9yKCl7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGRuJ3QgZmluZCB0aGF0IGF1dGhvcicpO1xuICAgICAgfVxuXG4gICAgICAvLyBzeW5jaHJvbm91c1xuICAgICAgdHJ5IHtcbiAgICAgICAgZmluZEF1dGhvcigpO1xuICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgIH1cblxuICAgICAgLy8gYXN5bmMgd2l0aCBwcm9taXNlc1xuICAgICAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBAbWV0aG9kIGNhdGNoXG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxuICAgICAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgbGFiZWxpbmcgdGhlIHByb21pc2UuXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAgICovXG4gICAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGlvbiwgbGFiZWwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uLCBsYWJlbCk7XG4gICAgICB9LFxuXG4gICAgLyoqXG4gICAgICBgZmluYWxseWAgd2lsbCBiZSBpbnZva2VkIHJlZ2FyZGxlc3Mgb2YgdGhlIHByb21pc2UncyBmYXRlIGp1c3QgYXMgbmF0aXZlXG4gICAgICB0cnkvY2F0Y2gvZmluYWxseSBiZWhhdmVzXG5cbiAgICAgIFN5bmNocm9ub3VzIGV4YW1wbGU6XG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kQXV0aG9yKCkge1xuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQXV0aG9yKCk7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBmaW5kQXV0aG9yKCk7IC8vIHN1Y2NlZWQgb3IgZmFpbFxuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICByZXR1cm4gZmluZE90aGVyQXV0aGVyKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICAvLyBhbHdheXMgcnVuc1xuICAgICAgICAvLyBkb2Vzbid0IGFmZmVjdCB0aGUgcmV0dXJuIHZhbHVlXG4gICAgICB9XG4gICAgICBgYGBcblxuICAgICAgQXN5bmNocm9ub3VzIGV4YW1wbGU6XG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kQXV0aG9yKCkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgcmV0dXJuIGZpbmRPdGhlckF1dGhlcigpO1xuICAgICAgfSkuZmluYWxseShmdW5jdGlvbigpe1xuICAgICAgICAvLyBhdXRob3Igd2FzIGVpdGhlciBmb3VuZCwgb3Igbm90XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBAbWV0aG9kIGZpbmFsbHlcbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgb3B0aW9uYWwgc3RyaW5nIGZvciBsYWJlbGluZyB0aGUgcHJvbWlzZS5cbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICAgKi9cbiAgICAgICdmaW5hbGx5JzogZnVuY3Rpb24oY2FsbGJhY2ssIGxhYmVsKSB7XG4gICAgICAgIHZhciBwcm9taXNlID0gdGhpcztcbiAgICAgICAgdmFyIGNvbnN0cnVjdG9yID0gcHJvbWlzZS5jb25zdHJ1Y3RvcjtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aHJvdyByZWFzb247XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGxhYmVsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQoQ29uc3RydWN0b3IsIGVudHJpZXMsIGxhYmVsKSB7XG4gICAgICB0aGlzLl9zdXBlckNvbnN0cnVjdG9yKENvbnN0cnVjdG9yLCBlbnRyaWVzLCBmYWxzZSAvKiBkb24ndCBhYm9ydCBvbiByZWplY3QgKi8sIGxhYmVsKTtcbiAgICB9XG5cbiAgICBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkQWxsU2V0dGxlZC5wcm90b3R5cGUgPSBsaWIkcnN2cCR1dGlscyQkb19jcmVhdGUobGliJHJzdnAkZW51bWVyYXRvciQkZGVmYXVsdC5wcm90b3R5cGUpO1xuICAgIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRBbGxTZXR0bGVkLnByb3RvdHlwZS5fc3VwZXJDb25zdHJ1Y3RvciA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQucHJvdG90eXBlLl9tYWtlUmVzdWx0ID0gbGliJHJzdnAkZW51bWVyYXRvciQkbWFrZVNldHRsZWRSZXN1bHQ7XG4gICAgbGliJHJzdnAkYWxsJHNldHRsZWQkJEFsbFNldHRsZWQucHJvdG90eXBlLl92YWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ2FsbFNldHRsZWQgbXVzdCBiZSBjYWxsZWQgd2l0aCBhbiBhcnJheScpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkYWxsU2V0dGxlZChlbnRyaWVzLCBsYWJlbCkge1xuICAgICAgcmV0dXJuIG5ldyBsaWIkcnN2cCRhbGwkc2V0dGxlZCQkQWxsU2V0dGxlZChsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LCBlbnRyaWVzLCBsYWJlbCkucHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRkZWZhdWx0ID0gbGliJHJzdnAkYWxsJHNldHRsZWQkJGFsbFNldHRsZWQ7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYWxsJCRhbGwoYXJyYXksIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwoYXJyYXksIGxhYmVsKTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGFsbCQkZGVmYXVsdCA9IGxpYiRyc3ZwJGFsbCQkYWxsO1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRsZW4gPSAwO1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCR0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuICAgIHZhciBsaWIkcnN2cCRhc2FwJCR2ZXJ0eE5leHQ7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtsaWIkcnN2cCRhc2FwJCRsZW5dID0gY2FsbGJhY2s7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtsaWIkcnN2cCRhc2FwJCRsZW4gKyAxXSA9IGFyZztcbiAgICAgIGxpYiRyc3ZwJGFzYXAkJGxlbiArPSAyO1xuICAgICAgaWYgKGxpYiRyc3ZwJGFzYXAkJGxlbiA9PT0gMikge1xuICAgICAgICAvLyBJZiBsZW4gaXMgMSwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXG4gICAgICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgICAgIC8vIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoaXMgZmx1c2ggdGhhdCB3ZSBhcmUgc2NoZWR1bGluZy5cbiAgICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRkZWZhdWx0ID0gbGliJHJzdnAkYXNhcCQkYXNhcDtcblxuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRicm93c2VyV2luZG93ID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSA/IHdpbmRvdyA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkYnJvd3Nlckdsb2JhbCA9IGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJXaW5kb3cgfHwge307XG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gbGliJHJzdnAkYXNhcCQkYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkaXNOb2RlID0gdHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nO1xuXG4gICAgLy8gdGVzdCBmb3Igd2ViIHdvcmtlciBidXQgbm90IGluIElFMTBcbiAgICB2YXIgbGliJHJzdnAkYXNhcCQkaXNXb3JrZXIgPSB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2YgaW1wb3J0U2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCc7XG5cbiAgICAvLyBub2RlXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkdXNlTmV4dFRpY2soKSB7XG4gICAgICB2YXIgbmV4dFRpY2sgPSBwcm9jZXNzLm5leHRUaWNrO1xuICAgICAgLy8gbm9kZSB2ZXJzaW9uIDAuMTAueCBkaXNwbGF5cyBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgd2hlbiBuZXh0VGljayBpcyB1c2VkIHJlY3Vyc2l2ZWx5XG4gICAgICAvLyBzZXRJbW1lZGlhdGUgc2hvdWxkIGJlIHVzZWQgaW5zdGVhZCBpbnN0ZWFkXG4gICAgICB2YXIgdmVyc2lvbiA9IHByb2Nlc3MudmVyc2lvbnMubm9kZS5tYXRjaCgvXig/OihcXGQrKVxcLik/KD86KFxcZCspXFwuKT8oXFwqfFxcZCspJC8pO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmVyc2lvbikgJiYgdmVyc2lvblsxXSA9PT0gJzAnICYmIHZlcnNpb25bMl0gPT09ICcxMCcpIHtcbiAgICAgICAgbmV4dFRpY2sgPSBzZXRJbW1lZGlhdGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIG5leHRUaWNrKGxpYiRyc3ZwJGFzYXAkJGZsdXNoKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gdmVydHhcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCR1c2VWZXJ0eFRpbWVyKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBsaWIkcnN2cCRhc2FwJCR2ZXJ0eE5leHQobGliJHJzdnAkYXNhcCQkZmx1c2gpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCR1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgdmFyIG9ic2VydmVyID0gbmV3IGxpYiRyc3ZwJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGxpYiRyc3ZwJGFzYXAkJGZsdXNoKTtcbiAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgbm9kZS5kYXRhID0gKGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gd2ViIHdvcmtlclxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJHVzZU1lc3NhZ2VDaGFubmVsKCkge1xuICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGliJHJzdnAkYXNhcCQkZmx1c2g7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRhc2FwJCR1c2VTZXRUaW1lb3V0KCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGxpYiRyc3ZwJGFzYXAkJGZsdXNoLCAxKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJGFzYXAkJHF1ZXVlID0gbmV3IEFycmF5KDEwMDApO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGFzYXAkJGZsdXNoKCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaWIkcnN2cCRhc2FwJCRsZW47IGkrPTIpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gbGliJHJzdnAkYXNhcCQkcXVldWVbaV07XG4gICAgICAgIHZhciBhcmcgPSBsaWIkcnN2cCRhc2FwJCRxdWV1ZVtpKzFdO1xuXG4gICAgICAgIGNhbGxiYWNrKGFyZyk7XG5cbiAgICAgICAgbGliJHJzdnAkYXNhcCQkcXVldWVbaV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIGxpYiRyc3ZwJGFzYXAkJHF1ZXVlW2krMV0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGxpYiRyc3ZwJGFzYXAkJGxlbiA9IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkYXNhcCQkYXR0ZW1wdFZlcnRleCgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciByID0gcmVxdWlyZTtcbiAgICAgICAgdmFyIHZlcnR4ID0gcigndmVydHgnKTtcbiAgICAgICAgbGliJHJzdnAkYXNhcCQkdmVydHhOZXh0ID0gdmVydHgucnVuT25Mb29wIHx8IHZlcnR4LnJ1bk9uQ29udGV4dDtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJGFzYXAkJHVzZVZlcnR4VGltZXIoKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gbGliJHJzdnAkYXNhcCQkdXNlU2V0VGltZW91dCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoO1xuICAgIC8vIERlY2lkZSB3aGF0IGFzeW5jIG1ldGhvZCB0byB1c2UgdG8gdHJpZ2dlcmluZyBwcm9jZXNzaW5nIG9mIHF1ZXVlZCBjYWxsYmFja3M6XG4gICAgaWYgKGxpYiRyc3ZwJGFzYXAkJGlzTm9kZSkge1xuICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRyc3ZwJGFzYXAkJHVzZU5leHRUaWNrKCk7XG4gICAgfSBlbHNlIGlmIChsaWIkcnN2cCRhc2FwJCRCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRyc3ZwJGFzYXAkJHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbiAgICB9IGVsc2UgaWYgKGxpYiRyc3ZwJGFzYXAkJGlzV29ya2VyKSB7XG4gICAgICBsaWIkcnN2cCRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJHJzdnAkYXNhcCQkdXNlTWVzc2FnZUNoYW5uZWwoKTtcbiAgICB9IGVsc2UgaWYgKGxpYiRyc3ZwJGFzYXAkJGJyb3dzZXJXaW5kb3cgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRyc3ZwJGFzYXAkJGF0dGVtcHRWZXJ0ZXgoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGliJHJzdnAkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRyc3ZwJGFzYXAkJHVzZVNldFRpbWVvdXQoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkZGVmZXIkJGRlZmVyKGxhYmVsKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSB7fTtcblxuICAgICAgZGVmZXJyZWRbJ3Byb21pc2UnXSA9IG5ldyBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0KGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkZWZlcnJlZFsncmVzb2x2ZSddID0gcmVzb2x2ZTtcbiAgICAgICAgZGVmZXJyZWRbJ3JlamVjdCddID0gcmVqZWN0O1xuICAgICAgfSwgbGFiZWwpO1xuXG4gICAgICByZXR1cm4gZGVmZXJyZWQ7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRkZWZlciQkZGVmYXVsdCA9IGxpYiRyc3ZwJGRlZmVyJCRkZWZlcjtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRmaWx0ZXIkJGZpbHRlcihwcm9taXNlcywgZmlsdGVyRm4sIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwocHJvbWlzZXMsIGxhYmVsKS50aGVuKGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgICBpZiAoIWxpYiRyc3ZwJHV0aWxzJCRpc0Z1bmN0aW9uKGZpbHRlckZuKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJZb3UgbXVzdCBwYXNzIGEgZnVuY3Rpb24gYXMgZmlsdGVyJ3Mgc2Vjb25kIGFyZ3VtZW50LlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoO1xuICAgICAgICB2YXIgZmlsdGVyZWQgPSBuZXcgQXJyYXkobGVuZ3RoKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZmlsdGVyZWRbaV0gPSBmaWx0ZXJGbih2YWx1ZXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQuYWxsKGZpbHRlcmVkLCBsYWJlbCkudGhlbihmdW5jdGlvbihmaWx0ZXJlZCkge1xuICAgICAgICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgICAgICAgdmFyIG5ld0xlbmd0aCA9IDA7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyZWRbaV0pIHtcbiAgICAgICAgICAgICAgcmVzdWx0c1tuZXdMZW5ndGhdID0gdmFsdWVzW2ldO1xuICAgICAgICAgICAgICBuZXdMZW5ndGgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXN1bHRzLmxlbmd0aCA9IG5ld0xlbmd0aDtcblxuICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkZmlsdGVyJCRkZWZhdWx0ID0gbGliJHJzdnAkZmlsdGVyJCRmaWx0ZXI7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoKENvbnN0cnVjdG9yLCBvYmplY3QsIGxhYmVsKSB7XG4gICAgICB0aGlzLl9zdXBlckNvbnN0cnVjdG9yKENvbnN0cnVjdG9yLCBvYmplY3QsIHRydWUsIGxhYmVsKTtcbiAgICB9XG5cbiAgICB2YXIgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRkZWZhdWx0ID0gbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaDtcblxuICAgIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2gucHJvdG90eXBlID0gbGliJHJzdnAkdXRpbHMkJG9fY3JlYXRlKGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQucHJvdG90eXBlKTtcbiAgICBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoLnByb3RvdHlwZS5fc3VwZXJDb25zdHJ1Y3RvciA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaC5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX3Jlc3VsdCA9IHt9O1xuICAgIH07XG5cbiAgICBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJFByb21pc2VIYXNoLnByb3RvdHlwZS5fdmFsaWRhdGVJbnB1dCA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICByZXR1cm4gaW5wdXQgJiYgdHlwZW9mIGlucHV0ID09PSAnb2JqZWN0JztcbiAgICB9O1xuXG4gICAgbGliJHJzdnAkcHJvbWlzZSRoYXNoJCRQcm9taXNlSGFzaC5wcm90b3R5cGUuX3ZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignUHJvbWlzZS5oYXNoIG11c3QgYmUgY2FsbGVkIHdpdGggYW4gb2JqZWN0Jyk7XG4gICAgfTtcblxuICAgIGxpYiRyc3ZwJHByb21pc2UkaGFzaCQkUHJvbWlzZUhhc2gucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbnVtZXJhdG9yID0gdGhpcztcbiAgICAgIHZhciBwcm9taXNlICAgID0gZW51bWVyYXRvci5wcm9taXNlO1xuICAgICAgdmFyIGlucHV0ICAgICAgPSBlbnVtZXJhdG9yLl9pbnB1dDtcbiAgICAgIHZhciByZXN1bHRzICAgID0gW107XG5cbiAgICAgIGZvciAodmFyIGtleSBpbiBpbnB1dCkge1xuICAgICAgICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IGxpYiRyc3ZwJCRpbnRlcm5hbCQkUEVORElORyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaW5wdXQsIGtleSkpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgcG9zaXRpb246IGtleSxcbiAgICAgICAgICAgIGVudHJ5OiBpbnB1dFtrZXldXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGxlbmd0aCA9IHJlc3VsdHMubGVuZ3RoO1xuICAgICAgZW51bWVyYXRvci5fcmVtYWluaW5nID0gbGVuZ3RoO1xuICAgICAgdmFyIHJlc3VsdDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IHByb21pc2UuX3N0YXRlID09PSBsaWIkcnN2cCQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdHNbaV07XG4gICAgICAgIGVudW1lcmF0b3IuX2VhY2hFbnRyeShyZXN1bHQuZW50cnksIHJlc3VsdC5wb3NpdGlvbik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkSGFzaFNldHRsZWQoQ29uc3RydWN0b3IsIG9iamVjdCwgbGFiZWwpIHtcbiAgICAgIHRoaXMuX3N1cGVyQ29uc3RydWN0b3IoQ29uc3RydWN0b3IsIG9iamVjdCwgZmFsc2UsIGxhYmVsKTtcbiAgICB9XG5cbiAgICBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkLnByb3RvdHlwZSA9IGxpYiRyc3ZwJHV0aWxzJCRvX2NyZWF0ZShsaWIkcnN2cCRwcm9taXNlJGhhc2gkJGRlZmF1bHQucHJvdG90eXBlKTtcbiAgICBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkLnByb3RvdHlwZS5fc3VwZXJDb25zdHJ1Y3RvciA9IGxpYiRyc3ZwJGVudW1lcmF0b3IkJGRlZmF1bHQ7XG4gICAgbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRIYXNoU2V0dGxlZC5wcm90b3R5cGUuX21ha2VSZXN1bHQgPSBsaWIkcnN2cCRlbnVtZXJhdG9yJCRtYWtlU2V0dGxlZFJlc3VsdDtcblxuICAgIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkSGFzaFNldHRsZWQucHJvdG90eXBlLl92YWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ2hhc2hTZXR0bGVkIG11c3QgYmUgY2FsbGVkIHdpdGggYW4gb2JqZWN0Jyk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGhhc2gkc2V0dGxlZCQkaGFzaFNldHRsZWQob2JqZWN0LCBsYWJlbCkge1xuICAgICAgcmV0dXJuIG5ldyBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJEhhc2hTZXR0bGVkKGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQsIG9iamVjdCwgbGFiZWwpLnByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJGRlZmF1bHQgPSBsaWIkcnN2cCRoYXNoJHNldHRsZWQkJGhhc2hTZXR0bGVkO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJGhhc2gkJGhhc2gob2JqZWN0LCBsYWJlbCkge1xuICAgICAgcmV0dXJuIG5ldyBsaWIkcnN2cCRwcm9taXNlJGhhc2gkJGRlZmF1bHQobGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdCwgb2JqZWN0LCBsYWJlbCkucHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRyc3ZwJGhhc2gkJGRlZmF1bHQgPSBsaWIkcnN2cCRoYXNoJCRoYXNoO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG1hcCQkbWFwKHByb21pc2VzLCBtYXBGbiwgbGFiZWwpIHtcbiAgICAgIHJldHVybiBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0LmFsbChwcm9taXNlcywgbGFiZWwpLnRoZW4oZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICAgIGlmICghbGliJHJzdnAkdXRpbHMkJGlzRnVuY3Rpb24obWFwRm4pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIllvdSBtdXN0IHBhc3MgYSBmdW5jdGlvbiBhcyBtYXAncyBzZWNvbmQgYXJndW1lbnQuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGg7XG4gICAgICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgIHJlc3VsdHNbaV0gPSBtYXBGbih2YWx1ZXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQuYWxsKHJlc3VsdHMsIGxhYmVsKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkbWFwJCRkZWZhdWx0ID0gbGliJHJzdnAkbWFwJCRtYXA7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRSZXN1bHQoKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCRub2RlJCRFUlJPUiA9IG5ldyBsaWIkcnN2cCRub2RlJCRSZXN1bHQoKTtcbiAgICB2YXIgbGliJHJzdnAkbm9kZSQkR0VUX1RIRU5fRVJST1IgPSBuZXcgbGliJHJzdnAkbm9kZSQkUmVzdWx0KCk7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRnZXRUaGVuKG9iaikge1xuICAgICAgdHJ5IHtcbiAgICAgICByZXR1cm4gb2JqLnRoZW47XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGxpYiRyc3ZwJG5vZGUkJEVSUk9SLnZhbHVlPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJG5vZGUkJEVSUk9SO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkdHJ5QXBwbHkoZiwgcywgYSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZi5hcHBseShzLCBhKTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgbGliJHJzdnAkbm9kZSQkRVJST1IudmFsdWUgPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIGxpYiRyc3ZwJG5vZGUkJEVSUk9SO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJG1ha2VPYmplY3QoXywgYXJndW1lbnROYW1lcykge1xuICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgdmFyIG5hbWU7XG4gICAgICB2YXIgaTtcbiAgICAgIHZhciBsZW5ndGggPSBfLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbGVuZ3RoOyB4KyspIHtcbiAgICAgICAgYXJnc1t4XSA9IF9beF07XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhcmd1bWVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG5hbWUgPSBhcmd1bWVudE5hbWVzW2ldO1xuICAgICAgICBvYmpbbmFtZV0gPSBhcmdzW2kgKyAxXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRhcnJheVJlc3VsdChfKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gXy5sZW5ndGg7XG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShsZW5ndGggLSAxKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBhcmdzW2kgLSAxXSA9IF9baV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhcmdzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJHdyYXBUaGVuYWJsZSh0aGVuLCBwcm9taXNlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbihvbkZ1bEZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICAgICAgICAgIHJldHVybiB0aGVuLmNhbGwocHJvbWlzZSwgb25GdWxGaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJGRlbm9kZWlmeShub2RlRnVuYywgb3B0aW9ucykge1xuICAgICAgdmFyIGZuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGwgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShsICsgMSk7XG4gICAgICAgIHZhciBhcmc7XG4gICAgICAgIHZhciBwcm9taXNlSW5wdXQgPSBmYWxzZTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgIGFyZyA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgICAgIGlmICghcHJvbWlzZUlucHV0KSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBjbGVhbiB0aGlzIHVwXG4gICAgICAgICAgICBwcm9taXNlSW5wdXQgPSBsaWIkcnN2cCRub2RlJCRuZWVkc1Byb21pc2VJbnB1dChhcmcpO1xuICAgICAgICAgICAgaWYgKHByb21pc2VJbnB1dCA9PT0gbGliJHJzdnAkbm9kZSQkR0VUX1RIRU5fRVJST1IpIHtcbiAgICAgICAgICAgICAgdmFyIHAgPSBuZXcgbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdChsaWIkcnN2cCQkaW50ZXJuYWwkJG5vb3ApO1xuICAgICAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwLCBsaWIkcnN2cCRub2RlJCRHRVRfVEhFTl9FUlJPUi52YWx1ZSk7XG4gICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9taXNlSW5wdXQgJiYgcHJvbWlzZUlucHV0ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgIGFyZyA9IGxpYiRyc3ZwJG5vZGUkJHdyYXBUaGVuYWJsZShwcm9taXNlSW5wdXQsIGFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGFyZ3NbaV0gPSBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBsaWIkcnN2cCRwcm9taXNlJCRkZWZhdWx0KGxpYiRyc3ZwJCRpbnRlcm5hbCQkbm9vcCk7XG5cbiAgICAgICAgYXJnc1tsXSA9IGZ1bmN0aW9uKGVyciwgdmFsKSB7XG4gICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGVycik7XG4gICAgICAgICAgZWxzZSBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbCk7XG4gICAgICAgICAgZWxzZSBpZiAob3B0aW9ucyA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCBsaWIkcnN2cCRub2RlJCRhcnJheVJlc3VsdChhcmd1bWVudHMpKTtcbiAgICAgICAgICBlbHNlIGlmIChsaWIkcnN2cCR1dGlscyQkaXNBcnJheShvcHRpb25zKSlcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCBsaWIkcnN2cCRub2RlJCRtYWtlT2JqZWN0KGFyZ3VtZW50cywgb3B0aW9ucykpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxpYiRyc3ZwJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWwpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChwcm9taXNlSW5wdXQpIHtcbiAgICAgICAgICByZXR1cm4gbGliJHJzdnAkbm9kZSQkaGFuZGxlUHJvbWlzZUlucHV0KHByb21pc2UsIGFyZ3MsIG5vZGVGdW5jLCBzZWxmKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbGliJHJzdnAkbm9kZSQkaGFuZGxlVmFsdWVJbnB1dChwcm9taXNlLCBhcmdzLCBub2RlRnVuYywgc2VsZik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZuLl9fcHJvdG9fXyA9IG5vZGVGdW5jO1xuXG4gICAgICByZXR1cm4gZm47XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJG5vZGUkJGRlZmF1bHQgPSBsaWIkcnN2cCRub2RlJCRkZW5vZGVpZnk7XG5cbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRub2RlJCRoYW5kbGVWYWx1ZUlucHV0KHByb21pc2UsIGFyZ3MsIG5vZGVGdW5jLCBzZWxmKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gbGliJHJzdnAkbm9kZSQkdHJ5QXBwbHkobm9kZUZ1bmMsIHNlbGYsIGFyZ3MpO1xuICAgICAgaWYgKHJlc3VsdCA9PT0gbGliJHJzdnAkbm9kZSQkRVJST1IpIHtcbiAgICAgICAgbGliJHJzdnAkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVzdWx0LnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJG5vZGUkJGhhbmRsZVByb21pc2VJbnB1dChwcm9taXNlLCBhcmdzLCBub2RlRnVuYywgc2VsZil7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5hbGwoYXJncykudGhlbihmdW5jdGlvbihhcmdzKXtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGxpYiRyc3ZwJG5vZGUkJHRyeUFwcGx5KG5vZGVGdW5jLCBzZWxmLCBhcmdzKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gbGliJHJzdnAkbm9kZSQkRVJST1IpIHtcbiAgICAgICAgICBsaWIkcnN2cCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZXN1bHQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJHJzdnAkbm9kZSQkbmVlZHNQcm9taXNlSW5wdXQoYXJnKSB7XG4gICAgICBpZiAoYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGlmIChhcmcuY29uc3RydWN0b3IgPT09IGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbGliJHJzdnAkbm9kZSQkZ2V0VGhlbihhcmcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRwbGF0Zm9ybSQkcGxhdGZvcm07XG5cbiAgICAvKiBnbG9iYWwgc2VsZiAqL1xuICAgIGlmICh0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGxpYiRyc3ZwJHBsYXRmb3JtJCRwbGF0Zm9ybSA9IHNlbGY7XG5cbiAgICAvKiBnbG9iYWwgZ2xvYmFsICovXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgbGliJHJzdnAkcGxhdGZvcm0kJHBsYXRmb3JtID0gZ2xvYmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGdsb2JhbDogYHNlbGZgIG9yIGBnbG9iYWxgIGZvdW5kJyk7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRyc3ZwJHBsYXRmb3JtJCRkZWZhdWx0ID0gbGliJHJzdnAkcGxhdGZvcm0kJHBsYXRmb3JtO1xuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJHJhY2UkJHJhY2UoYXJyYXksIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5yYWNlKGFycmF5LCBsYWJlbCk7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRyYWNlJCRkZWZhdWx0ID0gbGliJHJzdnAkcmFjZSQkcmFjZTtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRyZWplY3QkJHJlamVjdChyZWFzb24sIGxhYmVsKSB7XG4gICAgICByZXR1cm4gbGliJHJzdnAkcHJvbWlzZSQkZGVmYXVsdC5yZWplY3QocmVhc29uLCBsYWJlbCk7XG4gICAgfVxuICAgIHZhciBsaWIkcnN2cCRyZWplY3QkJGRlZmF1bHQgPSBsaWIkcnN2cCRyZWplY3QkJHJlamVjdDtcbiAgICBmdW5jdGlvbiBsaWIkcnN2cCRyZXNvbHZlJCRyZXNvbHZlKHZhbHVlLCBsYWJlbCkge1xuICAgICAgcmV0dXJuIGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQucmVzb2x2ZSh2YWx1ZSwgbGFiZWwpO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcmVzb2x2ZSQkZGVmYXVsdCA9IGxpYiRyc3ZwJHJlc29sdmUkJHJlc29sdmU7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkcmV0aHJvdyQkcmV0aHJvdyhyZWFzb24pIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRocm93IHJlYXNvbjtcbiAgICAgIH0pO1xuICAgICAgdGhyb3cgcmVhc29uO1xuICAgIH1cbiAgICB2YXIgbGliJHJzdnAkcmV0aHJvdyQkZGVmYXVsdCA9IGxpYiRyc3ZwJHJldGhyb3ckJHJldGhyb3c7XG5cbiAgICAvLyBkZWZhdWx0c1xuICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jID0gbGliJHJzdnAkYXNhcCQkZGVmYXVsdDtcbiAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZy5hZnRlciA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgICBzZXRUaW1lb3V0KGNiLCAwKTtcbiAgICB9O1xuICAgIHZhciBsaWIkcnN2cCQkY2FzdCA9IGxpYiRyc3ZwJHJlc29sdmUkJGRlZmF1bHQ7XG4gICAgZnVuY3Rpb24gbGliJHJzdnAkJGFzeW5jKGNhbGxiYWNrLCBhcmcpIHtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLmFzeW5jKGNhbGxiYWNrLCBhcmcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRvbigpIHtcbiAgICAgIGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnWydvbiddLmFwcGx5KGxpYiRyc3ZwJGNvbmZpZyQkY29uZmlnLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRyc3ZwJCRvZmYoKSB7XG4gICAgICBsaWIkcnN2cCRjb25maWckJGNvbmZpZ1snb2ZmJ10uYXBwbHkobGliJHJzdnAkY29uZmlnJCRjb25maWcsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHVwIGluc3RydW1lbnRhdGlvbiB0aHJvdWdoIGB3aW5kb3cuX19QUk9NSVNFX0lOVFJVTUVOVEFUSU9OX19gXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3dbJ19fUFJPTUlTRV9JTlNUUlVNRU5UQVRJT05fXyddID09PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGxpYiRyc3ZwJCRjYWxsYmFja3MgPSB3aW5kb3dbJ19fUFJPTUlTRV9JTlNUUlVNRU5UQVRJT05fXyddO1xuICAgICAgbGliJHJzdnAkY29uZmlnJCRjb25maWd1cmUoJ2luc3RydW1lbnQnLCB0cnVlKTtcbiAgICAgIGZvciAodmFyIGxpYiRyc3ZwJCRldmVudE5hbWUgaW4gbGliJHJzdnAkJGNhbGxiYWNrcykge1xuICAgICAgICBpZiAobGliJHJzdnAkJGNhbGxiYWNrcy5oYXNPd25Qcm9wZXJ0eShsaWIkcnN2cCQkZXZlbnROYW1lKSkge1xuICAgICAgICAgIGxpYiRyc3ZwJCRvbihsaWIkcnN2cCQkZXZlbnROYW1lLCBsaWIkcnN2cCQkY2FsbGJhY2tzW2xpYiRyc3ZwJCRldmVudE5hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkcnN2cCR1bWQkJFJTVlAgPSB7XG4gICAgICAncmFjZSc6IGxpYiRyc3ZwJHJhY2UkJGRlZmF1bHQsXG4gICAgICAnUHJvbWlzZSc6IGxpYiRyc3ZwJHByb21pc2UkJGRlZmF1bHQsXG4gICAgICAnYWxsU2V0dGxlZCc6IGxpYiRyc3ZwJGFsbCRzZXR0bGVkJCRkZWZhdWx0LFxuICAgICAgJ2hhc2gnOiBsaWIkcnN2cCRoYXNoJCRkZWZhdWx0LFxuICAgICAgJ2hhc2hTZXR0bGVkJzogbGliJHJzdnAkaGFzaCRzZXR0bGVkJCRkZWZhdWx0LFxuICAgICAgJ2Rlbm9kZWlmeSc6IGxpYiRyc3ZwJG5vZGUkJGRlZmF1bHQsXG4gICAgICAnb24nOiBsaWIkcnN2cCQkb24sXG4gICAgICAnb2ZmJzogbGliJHJzdnAkJG9mZixcbiAgICAgICdtYXAnOiBsaWIkcnN2cCRtYXAkJGRlZmF1bHQsXG4gICAgICAnZmlsdGVyJzogbGliJHJzdnAkZmlsdGVyJCRkZWZhdWx0LFxuICAgICAgJ3Jlc29sdmUnOiBsaWIkcnN2cCRyZXNvbHZlJCRkZWZhdWx0LFxuICAgICAgJ3JlamVjdCc6IGxpYiRyc3ZwJHJlamVjdCQkZGVmYXVsdCxcbiAgICAgICdhbGwnOiBsaWIkcnN2cCRhbGwkJGRlZmF1bHQsXG4gICAgICAncmV0aHJvdyc6IGxpYiRyc3ZwJHJldGhyb3ckJGRlZmF1bHQsXG4gICAgICAnZGVmZXInOiBsaWIkcnN2cCRkZWZlciQkZGVmYXVsdCxcbiAgICAgICdFdmVudFRhcmdldCc6IGxpYiRyc3ZwJGV2ZW50cyQkZGVmYXVsdCxcbiAgICAgICdjb25maWd1cmUnOiBsaWIkcnN2cCRjb25maWckJGNvbmZpZ3VyZSxcbiAgICAgICdhc3luYyc6IGxpYiRyc3ZwJCRhc3luY1xuICAgIH07XG5cbiAgICAvKiBnbG9iYWwgZGVmaW5lOnRydWUgbW9kdWxlOnRydWUgd2luZG93OiB0cnVlICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lWydhbWQnXSkge1xuICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gbGliJHJzdnAkdW1kJCRSU1ZQOyB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZVsnZXhwb3J0cyddKSB7XG4gICAgICBtb2R1bGVbJ2V4cG9ydHMnXSA9IGxpYiRyc3ZwJHVtZCQkUlNWUDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaWIkcnN2cCRwbGF0Zm9ybSQkZGVmYXVsdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGxpYiRyc3ZwJHBsYXRmb3JtJCRkZWZhdWx0WydSU1ZQJ10gPSBsaWIkcnN2cCR1bWQkJFJTVlA7XG4gICAgfVxufSkuY2FsbCh0aGlzKTtcblxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIklyWFVzdVwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9zcmMvYXBpLmpzXCIpO1xuIiwidmFyIGFwaSA9IGZ1bmN0aW9uICh3aG8pIHtcblxuICAgIHZhciBfbWV0aG9kcyA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIG0gPSBbXTtcblxuXHRtLmFkZF9iYXRjaCA9IGZ1bmN0aW9uIChvYmopIHtcblx0ICAgIG0udW5zaGlmdChvYmopO1xuXHR9O1xuXG5cdG0udXBkYXRlID0gZnVuY3Rpb24gKG1ldGhvZCwgdmFsdWUpIHtcblx0ICAgIGZvciAodmFyIGk9MDsgaTxtLmxlbmd0aDsgaSsrKSB7XG5cdFx0Zm9yICh2YXIgcCBpbiBtW2ldKSB7XG5cdFx0ICAgIGlmIChwID09PSBtZXRob2QpIHtcblx0XHRcdG1baV1bcF0gPSB2YWx1ZTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdCAgICB9XG5cdFx0fVxuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdG0uYWRkID0gZnVuY3Rpb24gKG1ldGhvZCwgdmFsdWUpIHtcblx0ICAgIGlmIChtLnVwZGF0ZSAobWV0aG9kLCB2YWx1ZSkgKSB7XG5cdCAgICB9IGVsc2Uge1xuXHRcdHZhciByZWcgPSB7fTtcblx0XHRyZWdbbWV0aG9kXSA9IHZhbHVlO1xuXHRcdG0uYWRkX2JhdGNoIChyZWcpO1xuXHQgICAgfVxuXHR9O1xuXG5cdG0uZ2V0ID0gZnVuY3Rpb24gKG1ldGhvZCkge1xuXHQgICAgZm9yICh2YXIgaT0wOyBpPG0ubGVuZ3RoOyBpKyspIHtcblx0XHRmb3IgKHZhciBwIGluIG1baV0pIHtcblx0XHQgICAgaWYgKHAgPT09IG1ldGhvZCkge1xuXHRcdFx0cmV0dXJuIG1baV1bcF07XG5cdFx0ICAgIH1cblx0XHR9XG5cdCAgICB9XG5cdH07XG5cblx0cmV0dXJuIG07XG4gICAgfTtcblxuICAgIHZhciBtZXRob2RzICAgID0gX21ldGhvZHMoKTtcbiAgICB2YXIgYXBpID0gZnVuY3Rpb24gKCkge307XG5cbiAgICBhcGkuY2hlY2sgPSBmdW5jdGlvbiAobWV0aG9kLCBjaGVjaywgbXNnKSB7XG5cdGlmIChtZXRob2QgaW5zdGFuY2VvZiBBcnJheSkge1xuXHQgICAgZm9yICh2YXIgaT0wOyBpPG1ldGhvZC5sZW5ndGg7IGkrKykge1xuXHRcdGFwaS5jaGVjayhtZXRob2RbaV0sIGNoZWNrLCBtc2cpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuO1xuXHR9XG5cblx0aWYgKHR5cGVvZiAobWV0aG9kKSA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgbWV0aG9kLmNoZWNrKGNoZWNrLCBtc2cpO1xuXHR9IGVsc2Uge1xuXHQgICAgd2hvW21ldGhvZF0uY2hlY2soY2hlY2ssIG1zZyk7XG5cdH1cblx0cmV0dXJuIGFwaTtcbiAgICB9O1xuXG4gICAgYXBpLnRyYW5zZm9ybSA9IGZ1bmN0aW9uIChtZXRob2QsIGNiYWspIHtcblx0aWYgKG1ldGhvZCBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdCAgICBmb3IgKHZhciBpPTA7IGk8bWV0aG9kLmxlbmd0aDsgaSsrKSB7XG5cdFx0YXBpLnRyYW5zZm9ybSAobWV0aG9kW2ldLCBjYmFrKTtcblx0ICAgIH1cblx0ICAgIHJldHVybjtcblx0fVxuXG5cdGlmICh0eXBlb2YgKG1ldGhvZCkgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgIG1ldGhvZC50cmFuc2Zvcm0gKGNiYWspO1xuXHR9IGVsc2Uge1xuXHQgICAgd2hvW21ldGhvZF0udHJhbnNmb3JtKGNiYWspO1xuXHR9XG5cdHJldHVybiBhcGk7XG4gICAgfTtcblxuICAgIHZhciBhdHRhY2hfbWV0aG9kID0gZnVuY3Rpb24gKG1ldGhvZCwgb3B0cykge1xuXHR2YXIgY2hlY2tzID0gW107XG5cdHZhciB0cmFuc2Zvcm1zID0gW107XG5cblx0dmFyIGdldHRlciA9IG9wdHMub25fZ2V0dGVyIHx8IGZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiBtZXRob2RzLmdldChtZXRob2QpO1xuXHR9O1xuXG5cdHZhciBzZXR0ZXIgPSBvcHRzLm9uX3NldHRlciB8fCBmdW5jdGlvbiAoeCkge1xuXHQgICAgZm9yICh2YXIgaT0wOyBpPHRyYW5zZm9ybXMubGVuZ3RoOyBpKyspIHtcblx0XHR4ID0gdHJhbnNmb3Jtc1tpXSh4KTtcblx0ICAgIH1cblxuXHQgICAgZm9yICh2YXIgaj0wOyBqPGNoZWNrcy5sZW5ndGg7IGorKykge1xuXHRcdGlmICghY2hlY2tzW2pdLmNoZWNrKHgpKSB7XG5cdFx0ICAgIHZhciBtc2cgPSBjaGVja3Nbal0ubXNnIHx8IFxuXHRcdFx0KFwiVmFsdWUgXCIgKyB4ICsgXCIgZG9lc24ndCBzZWVtIHRvIGJlIHZhbGlkIGZvciB0aGlzIG1ldGhvZFwiKTtcblx0XHQgICAgdGhyb3cgKG1zZyk7XG5cdFx0fVxuXHQgICAgfVxuXHQgICAgbWV0aG9kcy5hZGQobWV0aG9kLCB4KTtcblx0fTtcblxuXHR2YXIgbmV3X21ldGhvZCA9IGZ1bmN0aW9uIChuZXdfdmFsKSB7XG5cdCAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRyZXR1cm4gZ2V0dGVyKCk7XG5cdCAgICB9XG5cdCAgICBzZXR0ZXIobmV3X3ZhbCk7XG5cdCAgICByZXR1cm4gd2hvOyAvLyBSZXR1cm4gdGhpcz9cblx0fTtcblx0bmV3X21ldGhvZC5jaGVjayA9IGZ1bmN0aW9uIChjYmFrLCBtc2cpIHtcblx0ICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdHJldHVybiBjaGVja3M7XG5cdCAgICB9XG5cdCAgICBjaGVja3MucHVzaCAoe2NoZWNrIDogY2Jhayxcblx0XHRcdCAgbXNnICAgOiBtc2d9KTtcblx0ICAgIHJldHVybiB0aGlzO1xuXHR9O1xuXHRuZXdfbWV0aG9kLnRyYW5zZm9ybSA9IGZ1bmN0aW9uIChjYmFrKSB7XG5cdCAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRyZXR1cm4gdHJhbnNmb3Jtcztcblx0ICAgIH1cblx0ICAgIHRyYW5zZm9ybXMucHVzaChjYmFrKTtcblx0ICAgIHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdHdob1ttZXRob2RdID0gbmV3X21ldGhvZDtcbiAgICB9O1xuXG4gICAgdmFyIGdldHNldCA9IGZ1bmN0aW9uIChwYXJhbSwgb3B0cykge1xuXHRpZiAodHlwZW9mIChwYXJhbSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICBtZXRob2RzLmFkZF9iYXRjaCAocGFyYW0pO1xuXHQgICAgZm9yICh2YXIgcCBpbiBwYXJhbSkge1xuXHRcdGF0dGFjaF9tZXRob2QgKHAsIG9wdHMpO1xuXHQgICAgfVxuXHR9IGVsc2Uge1xuXHQgICAgbWV0aG9kcy5hZGQgKHBhcmFtLCBvcHRzLmRlZmF1bHRfdmFsdWUpO1xuXHQgICAgYXR0YWNoX21ldGhvZCAocGFyYW0sIG9wdHMpO1xuXHR9XG4gICAgfTtcblxuICAgIGFwaS5nZXRzZXQgPSBmdW5jdGlvbiAocGFyYW0sIGRlZikge1xuXHRnZXRzZXQocGFyYW0sIHtkZWZhdWx0X3ZhbHVlIDogZGVmfSk7XG5cblx0cmV0dXJuIGFwaTtcbiAgICB9O1xuXG4gICAgYXBpLmdldCA9IGZ1bmN0aW9uIChwYXJhbSwgZGVmKSB7XG5cdHZhciBvbl9zZXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICB0aHJvdyAoXCJNZXRob2QgZGVmaW5lZCBvbmx5IGFzIGEgZ2V0dGVyICh5b3UgYXJlIHRyeWluZyB0byB1c2UgaXQgYXMgYSBzZXR0ZXJcIik7XG5cdH07XG5cblx0Z2V0c2V0KHBhcmFtLCB7ZGVmYXVsdF92YWx1ZSA6IGRlZixcblx0XHQgICAgICAgb25fc2V0dGVyIDogb25fc2V0dGVyfVxuXHQgICAgICApO1xuXG5cdHJldHVybiBhcGk7XG4gICAgfTtcblxuICAgIGFwaS5zZXQgPSBmdW5jdGlvbiAocGFyYW0sIGRlZikge1xuXHR2YXIgb25fZ2V0dGVyID0gZnVuY3Rpb24gKCkge1xuXHQgICAgdGhyb3cgKFwiTWV0aG9kIGRlZmluZWQgb25seSBhcyBhIHNldHRlciAoeW91IGFyZSB0cnlpbmcgdG8gdXNlIGl0IGFzIGEgZ2V0dGVyXCIpO1xuXHR9O1xuXG5cdGdldHNldChwYXJhbSwge2RlZmF1bHRfdmFsdWUgOiBkZWYsXG5cdFx0ICAgICAgIG9uX2dldHRlciA6IG9uX2dldHRlcn1cblx0ICAgICAgKTtcblxuXHRyZXR1cm4gYXBpO1xuICAgIH07XG5cbiAgICBhcGkubWV0aG9kID0gZnVuY3Rpb24gKG5hbWUsIGNiYWspIHtcblx0aWYgKHR5cGVvZiAobmFtZSkgPT09ICdvYmplY3QnKSB7XG5cdCAgICBmb3IgKHZhciBwIGluIG5hbWUpIHtcblx0XHR3aG9bcF0gPSBuYW1lW3BdO1xuXHQgICAgfVxuXHR9IGVsc2Uge1xuXHQgICAgd2hvW25hbWVdID0gY2Jhaztcblx0fVxuXHRyZXR1cm4gYXBpO1xuICAgIH07XG5cbiAgICByZXR1cm4gYXBpO1xuICAgIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gYXBpOyIsIi8vIGlmICh0eXBlb2YgdG50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4vLyAgICAgbW9kdWxlLmV4cG9ydHMgPSB0bnQgPSB7fVxuLy8gfVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9zcmMvaW5kZXguanNcIik7XG5cbiIsIi8vIGlmICh0eXBlb2YgdG50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4vLyAgICAgbW9kdWxlLmV4cG9ydHMgPSB0bnQgPSB7fVxuLy8gfVxuLy8gdG50LnV0aWxzID0gcmVxdWlyZShcInRudC51dGlsc1wiKTtcbi8vIHRudC50b29sdGlwID0gcmVxdWlyZShcInRudC50b29sdGlwXCIpO1xuLy8gdG50LmJvYXJkID0gcmVxdWlyZShcIi4vc3JjL2luZGV4LmpzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3NyYy9pbmRleFwiKTtcbiIsInZhciBhcGlqcyA9IHJlcXVpcmUgKFwidG50LmFwaVwiKTtcbnZhciBkZWZlckNhbmNlbCA9IHJlcXVpcmUgKFwidG50LnV0aWxzXCIpLmRlZmVyX2NhbmNlbDtcblxudmFyIGJvYXJkID0gZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvLy8vIFByaXZhdGUgdmFyc1xuICAgIHZhciBzdmc7XG4gICAgdmFyIGRpdl9pZDtcbiAgICB2YXIgdHJhY2tzID0gW107XG4gICAgdmFyIG1pbl93aWR0aCA9IDUwO1xuICAgIHZhciBoZWlnaHQgICAgPSAwOyAgICAvLyBUaGlzIGlzIHRoZSBnbG9iYWwgaGVpZ2h0IGluY2x1ZGluZyBhbGwgdGhlIHRyYWNrc1xuICAgIHZhciB3aWR0aCAgICAgPSA5MjA7XG4gICAgdmFyIGhlaWdodF9vZmZzZXQgPSAyMDtcbiAgICB2YXIgbG9jID0ge1xuXHRzcGVjaWVzICA6IHVuZGVmaW5lZCxcblx0Y2hyICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIGZyb20gICAgIDogMCxcbiAgICAgICAgdG8gICAgICAgOiA1MDBcbiAgICB9O1xuXG4gICAgLy8gTGltaXQgY2Fwc1xuICAgIHZhciBjYXBzID0ge1xuICAgICAgICBsZWZ0IDogdW5kZWZpbmVkLFxuICAgICAgICByaWdodCA6IHVuZGVmaW5lZFxuICAgIH07XG4gICAgdmFyIGNhcF93aWR0aCA9IDM7XG5cblxuICAgIC8vIFRPRE86IFdlIGhhdmUgbm93IGJhY2tncm91bmQgY29sb3IgaW4gdGhlIHRyYWNrcy4gQ2FuIHRoaXMgYmUgcmVtb3ZlZD9cbiAgICAvLyBJdCBsb29rcyBsaWtlIGl0IGlzIHVzZWQgaW4gdGhlIHRvby13aWRlIHBhbmUgZXRjLCBidXQgaXQgbWF5IG5vdCBiZSBuZWVkZWQgYW55bW9yZVxuICAgIHZhciBiZ0NvbG9yICAgPSBkMy5yZ2IoJyNGOEZCRUYnKTsgLy8jRjhGQkVGXG4gICAgdmFyIHBhbmU7IC8vIERyYWdnYWJsZSBwYW5lXG4gICAgdmFyIHN2Z19nO1xuICAgIHZhciB4U2NhbGU7XG4gICAgdmFyIHpvb21FdmVudEhhbmRsZXIgPSBkMy5iZWhhdmlvci56b29tKCk7XG4gICAgdmFyIGxpbWl0cyA9IHtcbiAgICAgICAgbWluIDogMCxcbiAgICAgICAgbWF4IDogMTAwMCxcbiAgICAgICAgem9vbV9vdXQgOiAxMDAwLFxuICAgICAgICB6b29tX2luICA6IDEwMFxuICAgIH07XG4gICAgdmFyIGR1ciA9IDUwMDtcbiAgICB2YXIgZHJhZ19hbGxvd2VkID0gdHJ1ZTtcblxuICAgIHZhciBleHBvcnRzID0ge1xuICAgICAgICBlYXNlICAgICAgICAgIDogZDMuZWFzZShcImN1YmljLWluLW91dFwiKSxcbiAgICAgICAgZXh0ZW5kX2NhbnZhcyA6IHtcbiAgICAgICAgICAgIGxlZnQgOiAwLFxuICAgICAgICAgICAgcmlnaHQgOiAwXG4gICAgICAgIH0sXG4gICAgICAgIHNob3dfZnJhbWUgOiB0cnVlXG4gICAgICAgIC8vIGxpbWl0cyAgICAgICAgOiBmdW5jdGlvbiAoKSB7dGhyb3cgXCJUaGUgbGltaXRzIG1ldGhvZCBzaG91bGQgYmUgZGVmaW5lZFwifVxuICAgIH07XG5cbiAgICAvLyBUaGUgcmV0dXJuZWQgY2xvc3VyZSAvIG9iamVjdFxuICAgIHZhciB0cmFja192aXMgPSBmdW5jdGlvbihkaXYpIHtcbiAgICBcdGRpdl9pZCA9IGQzLnNlbGVjdChkaXYpLmF0dHIoXCJpZFwiKTtcblxuICAgIFx0Ly8gVGhlIG9yaWdpbmFsIGRpdiBpcyBjbGFzc2VkIHdpdGggdGhlIHRudCBjbGFzc1xuICAgIFx0ZDMuc2VsZWN0KGRpdilcbiAgICBcdCAgICAuY2xhc3NlZChcInRudFwiLCB0cnVlKTtcblxuICAgIFx0Ly8gVE9ETzogTW92ZSB0aGUgc3R5bGluZyB0byB0aGUgc2Nzcz9cbiAgICBcdHZhciBicm93c2VyRGl2ID0gZDMuc2VsZWN0KGRpdilcbiAgICBcdCAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgXHQgICAgLmF0dHIoXCJpZFwiLCBcInRudF9cIiArIGRpdl9pZClcbiAgICBcdCAgICAuc3R5bGUoXCJwb3NpdGlvblwiLCBcInJlbGF0aXZlXCIpXG4gICAgXHQgICAgLmNsYXNzZWQoXCJ0bnRfZnJhbWVkXCIsIGV4cG9ydHMuc2hvd19mcmFtZSA/IHRydWUgOiBmYWxzZSlcbiAgICBcdCAgICAuc3R5bGUoXCJ3aWR0aFwiLCAod2lkdGggKyBjYXBfd2lkdGgqMiArIGV4cG9ydHMuZXh0ZW5kX2NhbnZhcy5yaWdodCArIGV4cG9ydHMuZXh0ZW5kX2NhbnZhcy5sZWZ0KSArIFwicHhcIik7XG5cbiAgICBcdHZhciBncm91cERpdiA9IGJyb3dzZXJEaXZcbiAgICBcdCAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRudF9ncm91cERpdlwiKTtcblxuICAgIFx0Ly8gVGhlIFNWR1xuICAgIFx0c3ZnID0gZ3JvdXBEaXZcbiAgICBcdCAgICAuYXBwZW5kKFwic3ZnXCIpXG4gICAgXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRudF9zdmdcIilcbiAgICBcdCAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxuICAgIFx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcbiAgICBcdCAgICAuYXR0cihcInBvaW50ZXItZXZlbnRzXCIsIFwiYWxsXCIpO1xuXG4gICAgXHRzdmdfZyA9IHN2Z1xuICAgIFx0ICAgIC5hcHBlbmQoXCJnXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoMCwyMClcIilcbiAgICAgICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVxuICAgIFx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0bnRfZ1wiKTtcblxuICAgIFx0Ly8gY2Fwc1xuICAgIFx0Y2Fwcy5sZWZ0ID0gc3ZnX2dcbiAgICBcdCAgICAuYXBwZW5kKFwicmVjdFwiKVxuICAgIFx0ICAgIC5hdHRyKFwiaWRcIiwgXCJ0bnRfXCIgKyBkaXZfaWQgKyBcIl81cGNhcFwiKVxuICAgIFx0ICAgIC5hdHRyKFwieFwiLCAwKVxuICAgIFx0ICAgIC5hdHRyKFwieVwiLCAwKVxuICAgIFx0ICAgIC5hdHRyKFwid2lkdGhcIiwgMClcbiAgICBcdCAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpXG4gICAgXHQgICAgLmF0dHIoXCJmaWxsXCIsIFwicmVkXCIpO1xuICAgIFx0Y2Fwcy5yaWdodCA9IHN2Z19nXG4gICAgXHQgICAgLmFwcGVuZChcInJlY3RcIilcbiAgICBcdCAgICAuYXR0cihcImlkXCIsIFwidG50X1wiICsgZGl2X2lkICsgXCJfM3BjYXBcIilcbiAgICBcdCAgICAuYXR0cihcInhcIiwgd2lkdGgtY2FwX3dpZHRoKVxuICAgIFx0ICAgIC5hdHRyKFwieVwiLCAwKVxuICAgIFx0ICAgIC5hdHRyKFwid2lkdGhcIiwgMClcbiAgICBcdCAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpXG4gICAgXHQgICAgLmF0dHIoXCJmaWxsXCIsIFwicmVkXCIpO1xuXG4gICAgXHQvLyBUaGUgWm9vbWluZy9QYW5uaW5nIFBhbmVcbiAgICBcdHBhbmUgPSBzdmdfZ1xuICAgIFx0ICAgIC5hcHBlbmQoXCJyZWN0XCIpXG4gICAgXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRudF9wYW5lXCIpXG4gICAgXHQgICAgLmF0dHIoXCJpZFwiLCBcInRudF9cIiArIGRpdl9pZCArIFwiX3BhbmVcIilcbiAgICBcdCAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxuICAgIFx0ICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcbiAgICBcdCAgICAuc3R5bGUoXCJmaWxsXCIsIGJnQ29sb3IpO1xuXG4gICAgXHQvLyAqKiBUT0RPOiBXb3VsZG4ndCBiZSBiZXR0ZXIgdG8gaGF2ZSB0aGVzZSBtZXNzYWdlcyBieSB0cmFjaz9cbiAgICBcdC8vIHZhciB0b29XaWRlX3RleHQgPSBzdmdfZ1xuICAgIFx0Ly8gICAgIC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgXHQvLyAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRudF93aWRlT0tfdGV4dFwiKVxuICAgIFx0Ly8gICAgIC5hdHRyKFwiaWRcIiwgXCJ0bnRfXCIgKyBkaXZfaWQgKyBcIl90b29XaWRlXCIpXG4gICAgXHQvLyAgICAgLmF0dHIoXCJmaWxsXCIsIGJnQ29sb3IpXG4gICAgXHQvLyAgICAgLnRleHQoXCJSZWdpb24gdG9vIHdpZGVcIik7XG5cbiAgICBcdC8vIFRPRE86IEkgZG9uJ3Qga25vdyBpZiB0aGlzIGlzIHRoZSBiZXN0IHdheSAoYW5kIHBvcnRhYmxlKSB3YXlcbiAgICBcdC8vIG9mIGNlbnRlcmluZyB0aGUgdGV4dCBpbiB0aGUgdGV4dCBhcmVhXG4gICAgXHQvLyB2YXIgYmIgPSB0b29XaWRlX3RleHRbMF1bMF0uZ2V0QkJveCgpO1xuICAgIFx0Ly8gdG9vV2lkZV90ZXh0XG4gICAgXHQvLyAgICAgLmF0dHIoXCJ4XCIsIH5+KHdpZHRoLzIgLSBiYi53aWR0aC8yKSlcbiAgICBcdC8vICAgICAuYXR0cihcInlcIiwgfn4oaGVpZ2h0LzIgLSBiYi5oZWlnaHQvMikpO1xuICAgIH07XG5cbiAgICAvLyBBUElcbiAgICB2YXIgYXBpID0gYXBpanMgKHRyYWNrX3ZpcylcbiAgICBcdC5nZXRzZXQgKGV4cG9ydHMpXG4gICAgXHQuZ2V0c2V0IChsaW1pdHMpXG4gICAgXHQuZ2V0c2V0IChsb2MpO1xuXG4gICAgYXBpLnRyYW5zZm9ybSAodHJhY2tfdmlzLmV4dGVuZF9jYW52YXMsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICBcdHZhciBwcmV2X3ZhbCA9IHRyYWNrX3Zpcy5leHRlbmRfY2FudmFzKCk7XG4gICAgXHR2YWwubGVmdCA9IHZhbC5sZWZ0IHx8IHByZXZfdmFsLmxlZnQ7XG4gICAgXHR2YWwucmlnaHQgPSB2YWwucmlnaHQgfHwgcHJldl92YWwucmlnaHQ7XG4gICAgXHRyZXR1cm4gdmFsO1xuICAgIH0pO1xuXG4gICAgLy8gdHJhY2tfdmlzIGFsd2F5cyBzdGFydHMgb24gbG9jLmZyb20gJiBsb2MudG9cbiAgICBhcGkubWV0aG9kICgnc3RhcnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0aGF0IHpvb21fb3V0IGlzIHdpdGhpbiB0aGUgbWluLW1heCByYW5nZVxuICAgICAgICBpZiAoKGxpbWl0cy5tYXggLSBsaW1pdHMubWluKSA8IGxpbWl0cy56b29tX291dCkge1xuICAgICAgICAgICAgbGltaXRzLnpvb21fb3V0ID0gbGltaXRzLm1heCAtIGxpbWl0cy5taW47XG4gICAgICAgIH1cblxuICAgICAgICBwbG90KCk7XG5cbiAgICAgICAgLy8gUmVzZXQgdGhlIHRyYWNrc1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dHJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodHJhY2tzW2ldLmcpIHtcbiAgICAgICAgICAgICAgICAvLyAgICB0cmFja3NbaV0uZGlzcGxheSgpLnJlc2V0LmNhbGwodHJhY2tzW2ldKTtcbiAgICAgICAgICAgICAgICB0cmFja3NbaV0uZy5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9pbml0X3RyYWNrKHRyYWNrc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgX3BsYWNlX3RyYWNrcygpO1xuXG4gICAgICAgIC8vIFRoZSBjb250aW51YXRpb24gY2FsbGJhY2tcbiAgICAgICAgdmFyIGNvbnQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIGlmICgobG9jLnRvIC0gbG9jLmZyb20pIDwgbGltaXRzLnpvb21faW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoKGxvYy5mcm9tICsgbGltaXRzLnpvb21faW4pID4gbGltaXRzLm1heCkge1xuICAgICAgICAgICAgICAgICAgICBsb2MudG8gPSBsaW1pdHMubWF4O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvYy50byA9IGxvYy5mcm9tICsgbGltaXRzLnpvb21faW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8dHJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgX3VwZGF0ZV90cmFjayh0cmFja3NbaV0sIGxvYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29udCgpO1xuICAgIH0pO1xuXG4gICAgYXBpLm1ldGhvZCAoJ3VwZGF0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICBcdGZvciAodmFyIGk9MDsgaTx0cmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBcdCAgICBfdXBkYXRlX3RyYWNrICh0cmFja3NbaV0pO1xuICAgIFx0fVxuICAgIH0pO1xuXG4gICAgdmFyIF91cGRhdGVfdHJhY2sgPSBmdW5jdGlvbiAodHJhY2ssIHdoZXJlKSB7XG4gICAgXHRpZiAodHJhY2suZGF0YSgpKSB7XG4gICAgXHQgICAgdmFyIHRyYWNrX2RhdGEgPSB0cmFjay5kYXRhKCk7XG4gICAgICAgICAgICB2YXIgZGF0YV91cGRhdGVyID0gdHJhY2tfZGF0YTtcblxuICAgIFx0ICAgIGRhdGFfdXBkYXRlci5jYWxsKHRyYWNrLCB7XG4gICAgICAgICAgICAgICAgJ2xvYycgOiB3aGVyZSxcbiAgICAgICAgICAgICAgICAnb25fc3VjY2VzcycgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYWNrLmRpc3BsYXkoKS51cGRhdGUuY2FsbCh0cmFjaywgd2hlcmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcdCAgICB9KTtcbiAgICBcdH1cbiAgICB9O1xuXG4gICAgdmFyIHBsb3QgPSBmdW5jdGlvbigpIHtcbiAgICBcdHhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgXHQgICAgLmRvbWFpbihbbG9jLmZyb20sIGxvYy50b10pXG4gICAgXHQgICAgLnJhbmdlKFswLCB3aWR0aF0pO1xuXG4gICAgXHRpZiAoZHJhZ19hbGxvd2VkKSB7XG4gICAgXHQgICAgc3ZnX2cuY2FsbCggem9vbUV2ZW50SGFuZGxlclxuICAgIFx0XHQgICAgICAgLngoeFNjYWxlKVxuICAgIFx0XHQgICAgICAgLnNjYWxlRXh0ZW50KFsobG9jLnRvLWxvYy5mcm9tKS8obGltaXRzLnpvb21fb3V0LTEpLCAobG9jLnRvLWxvYy5mcm9tKS9saW1pdHMuem9vbV9pbl0pXG4gICAgXHRcdCAgICAgICAub24oXCJ6b29tXCIsIF9tb3ZlKVxuICAgIFx0XHQgICAgICk7XG4gICAgXHR9XG4gICAgfTtcblxuICAgIHZhciBfcmVvcmRlciA9IGZ1bmN0aW9uIChuZXdfdHJhY2tzKSB7XG4gICAgICAgIC8vIFRPRE86IFRoaXMgaXMgZGVmaW5pbmcgYSBuZXcgaGVpZ2h0LCBidXQgdGhlIGdsb2JhbCBoZWlnaHQgaXMgdXNlZCB0byBkZWZpbmUgdGhlIHNpemUgb2Ygc2V2ZXJhbFxuICAgICAgICAvLyBwYXJ0cy4gV2Ugc2hvdWxkIGRvIHRoaXMgZHluYW1pY2FsbHlcblxuICAgICAgICB2YXIgZm91bmRfaW5kZXhlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBqPTA7IGo8bmV3X3RyYWNrcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8dHJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRyYWNrc1tpXS5pZCgpID09PSBuZXdfdHJhY2tzW2pdLmlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBmb3VuZF9pbmRleGVzW2ldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHJhY2tzLnNwbGljZShpLDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgX2luaXRfdHJhY2sobmV3X3RyYWNrc1tqXSk7XG4gICAgICAgICAgICAgICAgX3VwZGF0ZV90cmFjayhuZXdfdHJhY2tzW2pdLCB7ZnJvbSA6IGxvYy5mcm9tLCB0byA6IGxvYy50b30pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgeD0wOyB4PHRyYWNrcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgaWYgKCFmb3VuZF9pbmRleGVzW3hdKSB7XG4gICAgICAgICAgICAgICAgdHJhY2tzW3hdLmcucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0cmFja3MgPSBuZXdfdHJhY2tzO1xuICAgICAgICBfcGxhY2VfdHJhY2tzKCk7XG4gICAgfTtcblxuICAgIC8vIHJpZ2h0L2xlZnQvem9vbSBwYW5zIG9yIHpvb21zIHRoZSB0cmFjay4gVGhlc2UgbWV0aG9kcyBhcmUgZXhwb3NlZCB0byBhbGxvdyBleHRlcm5hbCBidXR0b25zLCBldGMgdG8gaW50ZXJhY3Qgd2l0aCB0aGUgdHJhY2tzLiBUaGUgYXJndW1lbnQgaXMgdGhlIGFtb3VudCBvZiBwYW5uaW5nL3pvb21pbmcgKGllLiAxLjIgbWVhbnMgMjAlIHBhbm5pbmcpIFdpdGggbGVmdC9yaWdodCBvbmx5IHBvc2l0aXZlIG51bWJlcnMgYXJlIGFsbG93ZWQuXG4gICAgYXBpLm1ldGhvZCAoJ3Njcm9sbCcsIGZ1bmN0aW9uIChmYWN0b3IpIHtcbiAgICAgICAgdmFyIGFtb3VudCA9IE1hdGguYWJzKGZhY3Rvcik7XG4gICAgXHRpZiAoZmFjdG9yID4gMCkge1xuICAgIFx0ICAgIF9tYW51YWxfbW92ZShhbW91bnQsIDEpO1xuICAgIFx0fSBlbHNlIGlmIChmYWN0b3IgPCAwKXtcbiAgICAgICAgICAgIF9tYW51YWxfbW92ZShhbW91bnQsIC0xKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXBpLm1ldGhvZCAoJ3pvb20nLCBmdW5jdGlvbiAoZmFjdG9yKSB7XG4gICAgICAgIF9tYW51YWxfbW92ZSgxL2ZhY3RvciwgMCk7XG4gICAgfSk7XG5cbiAgICBhcGkubWV0aG9kICgnZmluZF90cmFjaycsIGZ1bmN0aW9uIChpZCkge1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8dHJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodHJhY2tzW2ldLmlkKCkgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNrc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXBpLm1ldGhvZCAoJ3JlbW92ZV90cmFjaycsIGZ1bmN0aW9uICh0cmFjaykge1xuICAgICAgICB0cmFjay5nLnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgYXBpLm1ldGhvZCAoJ2FkZF90cmFjaycsIGZ1bmN0aW9uICh0cmFjaykge1xuICAgICAgICBpZiAodHJhY2sgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRyYWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdHJhY2tfdmlzLmFkZF90cmFjayAodHJhY2tbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRyYWNrX3ZpcztcbiAgICAgICAgfVxuICAgICAgICB0cmFja3MucHVzaCh0cmFjayk7XG4gICAgICAgIHJldHVybiB0cmFja192aXM7XG4gICAgfSk7XG5cbiAgICBhcGkubWV0aG9kKCd0cmFja3MnLCBmdW5jdGlvbiAodHMpIHtcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhY2tzO1xuICAgICAgICB9XG4gICAgICAgIF9yZW9yZGVyKHRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSk7XG5cbiAgICAvL1xuICAgIGFwaS5tZXRob2QgKCd3aWR0aCcsIGZ1bmN0aW9uICh3KSB7XG4gICAgXHQvLyBUT0RPOiBBbGxvdyBzdWZmaXhlcyBsaWtlIFwiMTAwMHB4XCI/XG4gICAgXHQvLyBUT0RPOiBUZXN0IHdyb25nIGZvcm1hdHNcbiAgICBcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIFx0ICAgIHJldHVybiB3aWR0aDtcbiAgICBcdH1cbiAgICBcdC8vIEF0IGxlYXN0IG1pbi13aWR0aFxuICAgIFx0aWYgKHcgPCBtaW5fd2lkdGgpIHtcbiAgICBcdCAgICB3ID0gbWluX3dpZHRoO1xuICAgIFx0fVxuXG4gICAgXHQvLyBXZSBhcmUgcmVzaXppbmdcbiAgICBcdGlmIChkaXZfaWQgIT09IHVuZGVmaW5lZCkge1xuICAgIFx0ICAgIGQzLnNlbGVjdChcIiN0bnRfXCIgKyBkaXZfaWQpLnNlbGVjdChcInN2Z1wiKS5hdHRyKFwid2lkdGhcIiwgdyk7XG4gICAgXHQgICAgLy8gUmVzaXplIHRoZSB6b29taW5nL3Bhbm5pbmcgcGFuZVxuICAgIFx0ICAgIGQzLnNlbGVjdChcIiN0bnRfXCIgKyBkaXZfaWQpLnN0eWxlKFwid2lkdGhcIiwgKHBhcnNlSW50KHcpICsgY2FwX3dpZHRoKjIpICsgXCJweFwiKTtcbiAgICBcdCAgICBkMy5zZWxlY3QoXCIjdG50X1wiICsgZGl2X2lkICsgXCJfcGFuZVwiKS5hdHRyKFwid2lkdGhcIiwgdyk7XG4gICAgICAgICAgICBjYXBzLnJpZ2h0XG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIHctY2FwX3dpZHRoKTtcblxuICAgIFx0ICAgIC8vIFJlcGxvdFxuICAgIFx0ICAgIHdpZHRoID0gdztcbiAgICAgICAgICAgIHhTY2FsZS5yYW5nZShbMCwgd2lkdGhdKTtcblxuICAgIFx0ICAgIHBsb3QoKTtcbiAgICBcdCAgICBmb3IgKHZhciBpPTA7IGk8dHJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIFx0XHR0cmFja3NbaV0uZy5zZWxlY3QoXCJyZWN0XCIpLmF0dHIoXCJ3aWR0aFwiLCB3KTtcbiAgICAgICAgICAgICAgICB0cmFja3NbaV0uZGlzcGxheSgpLnNjYWxlKHhTY2FsZSk7XG4gICAgICAgIFx0XHR0cmFja3NbaV0uZGlzcGxheSgpLnJlc2V0LmNhbGwodHJhY2tzW2ldKTtcbiAgICAgICAgICAgICAgICB0cmFja3NbaV0uZGlzcGxheSgpLmluaXQuY2FsbCh0cmFja3NbaV0sIHcpO1xuICAgICAgICBcdFx0dHJhY2tzW2ldLmRpc3BsYXkoKS51cGRhdGUuY2FsbCh0cmFja3NbaV0sIGxvYyk7XG4gICAgXHQgICAgfVxuICAgIFx0fSBlbHNlIHtcbiAgICBcdCAgICB3aWR0aCA9IHc7XG4gICAgXHR9XG4gICAgICAgIHJldHVybiB0cmFja192aXM7XG4gICAgfSk7XG5cbiAgICBhcGkubWV0aG9kKCdhbGxvd19kcmFnJywgZnVuY3Rpb24oYikge1xuICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBkcmFnX2FsbG93ZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZHJhZ19hbGxvd2VkID0gYjtcbiAgICAgICAgaWYgKGRyYWdfYWxsb3dlZCkge1xuICAgICAgICAgICAgLy8gV2hlbiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgb24gdGhlIG9iamVjdCBiZWZvcmUgc3RhcnRpbmcgdGhlIHNpbXVsYXRpb24sIHdlIGRvbid0IGhhdmUgZGVmaW5lZCB4U2NhbGVcbiAgICAgICAgICAgIGlmICh4U2NhbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHN2Z19nLmNhbGwoIHpvb21FdmVudEhhbmRsZXIueCh4U2NhbGUpXG4gICAgICAgICAgICAgICAgICAgIC8vIC54RXh0ZW50KFswLCBsaW1pdHMucmlnaHRdKVxuICAgICAgICAgICAgICAgICAgICAuc2NhbGVFeHRlbnQoWyhsb2MudG8tbG9jLmZyb20pLyhsaW1pdHMuem9vbV9vdXQtMSksIChsb2MudG8tbG9jLmZyb20pL2xpbWl0cy56b29tX2luXSlcbiAgICAgICAgICAgICAgICAgICAgLm9uKFwiem9vbVwiLCBfbW92ZSkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFdlIGNyZWF0ZSBhIG5ldyBkdW1teSBzY2FsZSBpbiB4IHRvIGF2b2lkIGRyYWdnaW5nIHRoZSBwcmV2aW91cyBvbmVcbiAgICAgICAgICAgIC8vIFRPRE86IFRoZXJlIG1heSBiZSBhIGNoZWFwZXIgd2F5IG9mIGRvaW5nIHRoaXM/XG4gICAgICAgICAgICB6b29tRXZlbnRIYW5kbGVyLngoZDMuc2NhbGUubGluZWFyKCkpLm9uKFwiem9vbVwiLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJhY2tfdmlzO1xuICAgIH0pO1xuXG4gICAgdmFyIF9wbGFjZV90cmFja3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBoID0gMDtcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRyYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHRyYWNrID0gdHJhY2tzW2ldO1xuICAgICAgICAgICAgaWYgKHRyYWNrLmcuYXR0cihcInRyYW5zZm9ybVwiKSkge1xuICAgICAgICAgICAgICAgIHRyYWNrLmdcbiAgICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oZHVyKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIGV4cG9ydHMuZXh0ZW5kX2NhbnZhcy5sZWZ0ICsgXCIsXCIgKyBoICsgXCIpXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cmFjay5nXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgZXhwb3J0cy5leHRlbmRfY2FudmFzLmxlZnQgKyBcIixcIiArIGggKyBcIilcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGggKz0gdHJhY2suaGVpZ2h0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdmdcbiAgICAgICAgc3ZnLmF0dHIoXCJoZWlnaHRcIiwgaCArIGhlaWdodF9vZmZzZXQpO1xuXG4gICAgICAgIC8vIGRpdlxuICAgICAgICBkMy5zZWxlY3QoXCIjdG50X1wiICsgZGl2X2lkKVxuICAgICAgICAgICAgLnN0eWxlKFwiaGVpZ2h0XCIsIChoICsgMTAgKyBoZWlnaHRfb2Zmc2V0KSArIFwicHhcIik7XG5cbiAgICAgICAgLy8gY2Fwc1xuICAgICAgICBkMy5zZWxlY3QoXCIjdG50X1wiICsgZGl2X2lkICsgXCJfNXBjYXBcIilcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGgpXG4gICAgICAgICAgICAuZWFjaChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIG1vdmVfdG9fZnJvbnQodGhpcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBkMy5zZWxlY3QoXCIjdG50X1wiICsgZGl2X2lkICsgXCJfM3BjYXBcIilcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGgpXG4gICAgICAgICAgICAuZWFjaCAoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICBtb3ZlX3RvX2Zyb250KHRoaXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcGFuZVxuICAgICAgICBwYW5lXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoICsgaGVpZ2h0X29mZnNldCk7XG5cbiAgICAgICAgcmV0dXJuIHRyYWNrX3ZpcztcbiAgICB9O1xuXG4gICAgdmFyIF9pbml0X3RyYWNrID0gZnVuY3Rpb24gKHRyYWNrKSB7XG4gICAgICAgIHRyYWNrLmcgPSBzdmcuc2VsZWN0KFwiZ1wiKS5zZWxlY3QoXCJnXCIpXG4gICAgXHQgICAgLmFwcGVuZChcImdcIilcbiAgICBcdCAgICAuYXR0cihcImNsYXNzXCIsIFwidG50X3RyYWNrXCIpXG4gICAgXHQgICAgLmF0dHIoXCJoZWlnaHRcIiwgdHJhY2suaGVpZ2h0KCkpO1xuXG4gICAgXHQvLyBSZWN0IGZvciB0aGUgYmFja2dyb3VuZCBjb2xvclxuICAgIFx0dHJhY2suZ1xuICAgIFx0ICAgIC5hcHBlbmQoXCJyZWN0XCIpXG4gICAgXHQgICAgLmF0dHIoXCJ4XCIsIDApXG4gICAgXHQgICAgLmF0dHIoXCJ5XCIsIDApXG4gICAgXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCB0cmFja192aXMud2lkdGgoKSlcbiAgICBcdCAgICAuYXR0cihcImhlaWdodFwiLCB0cmFjay5oZWlnaHQoKSlcbiAgICBcdCAgICAuc3R5bGUoXCJmaWxsXCIsIHRyYWNrLmNvbG9yKCkpXG4gICAgXHQgICAgLnN0eWxlKFwicG9pbnRlci1ldmVudHNcIiwgXCJub25lXCIpO1xuXG4gICAgXHRpZiAodHJhY2suZGlzcGxheSgpKSB7XG4gICAgXHQgICAgdHJhY2suZGlzcGxheSgpXG4gICAgICAgICAgICAgICAgLnNjYWxlKHhTY2FsZSlcbiAgICAgICAgICAgICAgICAuaW5pdC5jYWxsKHRyYWNrLCB3aWR0aCk7XG4gICAgXHR9XG5cbiAgICBcdHJldHVybiB0cmFja192aXM7XG4gICAgfTtcblxuICAgIHZhciBfbWFudWFsX21vdmUgPSBmdW5jdGlvbiAoZmFjdG9yLCBkaXJlY3Rpb24pIHtcbiAgICAgICAgdmFyIG9sZERvbWFpbiA9IHhTY2FsZS5kb21haW4oKTtcblxuICAgIFx0dmFyIHNwYW4gPSBvbGREb21haW5bMV0gLSBvbGREb21haW5bMF07XG4gICAgXHR2YXIgb2Zmc2V0ID0gKHNwYW4gKiBmYWN0b3IpIC0gc3BhbjtcblxuICAgIFx0dmFyIG5ld0RvbWFpbjtcbiAgICBcdHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIDEgOlxuICAgICAgICAgICAgbmV3RG9tYWluID0gWyh+fm9sZERvbWFpblswXSAtIG9mZnNldCksIH5+KG9sZERvbWFpblsxXSAtIG9mZnNldCldO1xuICAgIFx0ICAgIGJyZWFrO1xuICAgICAgICBcdGNhc2UgLTEgOlxuICAgICAgICBcdCAgICBuZXdEb21haW4gPSBbKH5+b2xkRG9tYWluWzBdICsgb2Zmc2V0KSwgfn4ob2xkRG9tYWluWzFdIC0gb2Zmc2V0KV07XG4gICAgICAgIFx0ICAgIGJyZWFrO1xuICAgICAgICBcdGNhc2UgMCA6XG4gICAgICAgIFx0ICAgIG5ld0RvbWFpbiA9IFtvbGREb21haW5bMF0gLSB+fihvZmZzZXQvMiksIG9sZERvbWFpblsxXSArICh+fm9mZnNldC8yKV07XG4gICAgXHR9XG5cbiAgICBcdHZhciBpbnRlcnBvbGF0b3IgPSBkMy5pbnRlcnBvbGF0ZU51bWJlcihvbGREb21haW5bMF0sIG5ld0RvbWFpblswXSk7XG4gICAgXHR2YXIgZWFzZSA9IGV4cG9ydHMuZWFzZTtcblxuICAgIFx0dmFyIHggPSAwO1xuICAgIFx0ZDMudGltZXIoZnVuY3Rpb24oKSB7XG4gICAgXHQgICAgdmFyIGN1cnJfc3RhcnQgPSBpbnRlcnBvbGF0b3IoZWFzZSh4KSk7XG4gICAgXHQgICAgdmFyIGN1cnJfZW5kO1xuICAgIFx0ICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICAgIFx0ICAgIGNhc2UgLTEgOlxuICAgICAgICBcdFx0Y3Vycl9lbmQgPSBjdXJyX3N0YXJ0ICsgc3BhbjtcbiAgICAgICAgXHRcdGJyZWFrO1xuICAgICAgICBcdCAgICBjYXNlIDEgOlxuICAgICAgICBcdFx0Y3Vycl9lbmQgPSBjdXJyX3N0YXJ0ICsgc3BhbjtcbiAgICAgICAgXHRcdGJyZWFrO1xuICAgICAgICBcdCAgICBjYXNlIDAgOlxuICAgICAgICBcdFx0Y3Vycl9lbmQgPSBvbGREb21haW5bMV0gKyBvbGREb21haW5bMF0gLSBjdXJyX3N0YXJ0O1xuICAgICAgICBcdFx0YnJlYWs7XG4gICAgXHQgICAgfVxuXG4gICAgXHQgICAgdmFyIGN1cnJEb21haW4gPSBbY3Vycl9zdGFydCwgY3Vycl9lbmRdO1xuICAgIFx0ICAgIHhTY2FsZS5kb21haW4oY3VyckRvbWFpbik7XG4gICAgXHQgICAgX21vdmUoeFNjYWxlKTtcbiAgICBcdCAgICB4Kz0wLjAyO1xuICAgIFx0ICAgIHJldHVybiB4PjE7XG4gICAgXHR9KTtcbiAgICB9O1xuXG5cbiAgICB2YXIgX21vdmVfY2JhayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGN1cnJEb21haW4gPSB4U2NhbGUuZG9tYWluKCk7XG4gICAgXHR0cmFja192aXMuZnJvbSh+fmN1cnJEb21haW5bMF0pO1xuICAgIFx0dHJhY2tfdmlzLnRvKH5+Y3VyckRvbWFpblsxXSk7XG5cbiAgICBcdGZvciAodmFyIGkgPSAwOyBpIDwgdHJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgXHQgICAgdmFyIHRyYWNrID0gdHJhY2tzW2ldO1xuICAgIFx0ICAgIF91cGRhdGVfdHJhY2sodHJhY2ssIGxvYyk7XG4gICAgXHR9XG4gICAgfTtcbiAgICAvLyBUaGUgZGVmZXJyZWRfY2JhayBpcyBkZWZlcnJlZCBhdCBsZWFzdCB0aGlzIGFtb3VudCBvZiB0aW1lIG9yIHJlLXNjaGVkdWxlZCBpZiBkZWZlcnJlZCBpcyBjYWxsZWQgYmVmb3JlXG4gICAgdmFyIF9kZWZlcnJlZCA9IGRlZmVyQ2FuY2VsKF9tb3ZlX2NiYWssIDMwMCk7XG5cbiAgICAvLyBhcGkubWV0aG9kKCd1cGRhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gXHRfbW92ZSgpO1xuICAgIC8vIH0pO1xuXG4gICAgdmFyIF9tb3ZlID0gZnVuY3Rpb24gKG5ld194U2NhbGUpIHtcbiAgICBcdGlmIChuZXdfeFNjYWxlICE9PSB1bmRlZmluZWQgJiYgZHJhZ19hbGxvd2VkKSB7XG4gICAgXHQgICAgem9vbUV2ZW50SGFuZGxlci54KG5ld194U2NhbGUpO1xuICAgIFx0fVxuXG4gICAgXHQvLyBTaG93IHRoZSByZWQgYmFycyBhdCB0aGUgbGltaXRzXG4gICAgXHR2YXIgZG9tYWluID0geFNjYWxlLmRvbWFpbigpO1xuICAgIFx0aWYgKGRvbWFpblswXSA8PSAobGltaXRzLm1pbiArIDUpKSB7XG4gICAgXHQgICAgZDMuc2VsZWN0KFwiI3RudF9cIiArIGRpdl9pZCArIFwiXzVwY2FwXCIpXG4gICAgXHRcdC5hdHRyKFwid2lkdGhcIiwgY2FwX3dpZHRoKVxuICAgIFx0XHQudHJhbnNpdGlvbigpXG4gICAgXHRcdC5kdXJhdGlvbigyMDApXG4gICAgXHRcdC5hdHRyKFwid2lkdGhcIiwgMCk7XG4gICAgXHR9XG5cbiAgICBcdGlmIChkb21haW5bMV0gPj0gKGxpbWl0cy5tYXgpLTUpIHtcbiAgICBcdCAgICBkMy5zZWxlY3QoXCIjdG50X1wiICsgZGl2X2lkICsgXCJfM3BjYXBcIilcbiAgICBcdFx0LmF0dHIoXCJ3aWR0aFwiLCBjYXBfd2lkdGgpXG4gICAgXHRcdC50cmFuc2l0aW9uKClcbiAgICBcdFx0LmR1cmF0aW9uKDIwMClcbiAgICBcdFx0LmF0dHIoXCJ3aWR0aFwiLCAwKTtcbiAgICBcdH1cblxuXG4gICAgXHQvLyBBdm9pZCBtb3ZpbmcgcGFzdCB0aGUgbGltaXRzXG4gICAgXHRpZiAoZG9tYWluWzBdIDwgbGltaXRzLm1pbikge1xuICAgIFx0ICAgIHpvb21FdmVudEhhbmRsZXIudHJhbnNsYXRlKFt6b29tRXZlbnRIYW5kbGVyLnRyYW5zbGF0ZSgpWzBdIC0geFNjYWxlKGxpbWl0cy5taW4pICsgeFNjYWxlLnJhbmdlKClbMF0sIHpvb21FdmVudEhhbmRsZXIudHJhbnNsYXRlKClbMV1dKTtcbiAgICBcdH0gZWxzZSBpZiAoZG9tYWluWzFdID4gbGltaXRzLm1heCkge1xuICAgIFx0ICAgIHpvb21FdmVudEhhbmRsZXIudHJhbnNsYXRlKFt6b29tRXZlbnRIYW5kbGVyLnRyYW5zbGF0ZSgpWzBdIC0geFNjYWxlKGxpbWl0cy5tYXgpICsgeFNjYWxlLnJhbmdlKClbMV0sIHpvb21FdmVudEhhbmRsZXIudHJhbnNsYXRlKClbMV1dKTtcbiAgICBcdH1cblxuICAgIFx0X2RlZmVycmVkKCk7XG5cbiAgICBcdGZvciAodmFyIGkgPSAwOyBpIDwgdHJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgXHQgICAgdmFyIHRyYWNrID0gdHJhY2tzW2ldO1xuICAgIFx0ICAgIHRyYWNrLmRpc3BsYXkoKS5tb3Zlci5jYWxsKHRyYWNrKTtcbiAgICBcdH1cbiAgICB9O1xuXG4gICAgLy8gYXBpLm1ldGhvZCh7XG4gICAgLy8gXHRhbGxvd19kcmFnIDogYXBpX2FsbG93X2RyYWcsXG4gICAgLy8gXHR3aWR0aCAgICAgIDogYXBpX3dpZHRoLFxuICAgIC8vIFx0YWRkX3RyYWNrICA6IGFwaV9hZGRfdHJhY2ssXG4gICAgLy8gXHRyZW9yZGVyICAgIDogYXBpX3Jlb3JkZXIsXG4gICAgLy8gXHR6b29tICAgICAgIDogYXBpX3pvb20sXG4gICAgLy8gXHRsZWZ0ICAgICAgIDogYXBpX2xlZnQsXG4gICAgLy8gXHRyaWdodCAgICAgIDogYXBpX3JpZ2h0LFxuICAgIC8vIFx0c3RhcnQgICAgICA6IGFwaV9zdGFydFxuICAgIC8vIH0pO1xuXG4gICAgLy8gQXV4aWxpYXIgZnVuY3Rpb25zXG4gICAgZnVuY3Rpb24gbW92ZV90b19mcm9udCAoZWxlbSkge1xuICAgICAgICBlbGVtLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZWxlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRyYWNrX3Zpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGJvYXJkO1xuIiwidmFyIGFwaWpzID0gcmVxdWlyZSAoXCJ0bnQuYXBpXCIpO1xudmFyIHNwaW5uZXIgPSByZXF1aXJlIChcIi4vc3Bpbm5lci5qc1wiKSgpO1xuXG50bnRfZGF0YSA9IHt9O1xuXG50bnRfZGF0YS5zeW5jID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVwZGF0ZV90cmFjayA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICB2YXIgdHJhY2sgPSB0aGlzO1xuICAgICAgICB0cmFjay5kYXRhKCkuZWxlbWVudHModXBkYXRlX3RyYWNrLnJldHJpZXZlcigpLmNhbGwodHJhY2ssIG9iai5sb2MpKTtcbiAgICAgICAgb2JqLm9uX3N1Y2Nlc3MoKTtcbiAgICB9O1xuXG4gICAgYXBpanMgKHVwZGF0ZV90cmFjaylcbiAgICAgICAgLmdldHNldCAoJ2VsZW1lbnRzJywgW10pXG4gICAgICAgIC5nZXRzZXQgKCdyZXRyaWV2ZXInLCBmdW5jdGlvbiAoKSB7fSk7XG5cbiAgICByZXR1cm4gdXBkYXRlX3RyYWNrO1xufTtcblxudG50X2RhdGEuYXN5bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHVwZGF0ZV90cmFjayA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgdmFyIHRyYWNrID0gdGhpcztcbiAgICAgICAgc3Bpbm5lci5vbi5jYWxsKHRyYWNrKTtcbiAgICAgICAgdXBkYXRlX3RyYWNrLnJldHJpZXZlcigpLmNhbGwodHJhY2ssIG9iai5sb2MpXG4gICAgICAgICAgICAudGhlbiAoZnVuY3Rpb24gKHJlc3ApIHtcbiAgICAgICAgICAgICAgICB0cmFjay5kYXRhKCkuZWxlbWVudHMocmVzcCk7XG4gICAgICAgICAgICAgICAgb2JqLm9uX3N1Y2Nlc3MoKTtcbiAgICAgICAgICAgICAgICBzcGlubmVyLm9mZi5jYWxsKHRyYWNrKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgYXBpID0gYXBpanMgKHVwZGF0ZV90cmFjaylcbiAgICAgICAgLmdldHNldCAoJ2VsZW1lbnRzJywgW10pXG4gICAgICAgIC5nZXRzZXQgKCdyZXRyaWV2ZXInKTtcblxuICAgIHJldHVybiB1cGRhdGVfdHJhY2s7XG59O1xuXG5cbi8vIEEgcHJlZGVmaW5lZCB0cmFjayBkaXNwbGF5aW5nIG5vIGV4dGVybmFsIGRhdGFcbi8vIGl0IGlzIHVzZWQgZm9yIGxvY2F0aW9uIGFuZCBheGlzIHRyYWNrcyBmb3IgZXhhbXBsZVxudG50X2RhdGEuZW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHVwZGF0ZXIgPSB0bnRfZGF0YS5zeW5jKCk7XG5cbiAgICByZXR1cm4gdXBkYXRlcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IHRudF9kYXRhO1xuIiwidmFyIGFwaWpzID0gcmVxdWlyZSAoXCJ0bnQuYXBpXCIpO1xudmFyIGxheW91dCA9IHJlcXVpcmUoXCIuL2xheW91dC5qc1wiKTtcblxuLy8gRkVBVFVSRSBWSVNcbi8vIHZhciBib2FyZCA9IHt9O1xuLy8gYm9hcmQudHJhY2sgPSB7fTtcbnZhciB0bnRfZmVhdHVyZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGlzcGF0Y2ggPSBkMy5kaXNwYXRjaCAoXCJjbGlja1wiLCBcImRibGNsaWNrXCIsIFwibW91c2VvdmVyXCIsIFwibW91c2VvdXRcIik7XG5cbiAgICAvLy8vLy8gVmFycyBleHBvc2VkIGluIHRoZSBBUElcbiAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICBjcmVhdGUgICA6IGZ1bmN0aW9uICgpIHt0aHJvdyBcImNyZWF0ZV9lbGVtIGlzIG5vdCBkZWZpbmVkIGluIHRoZSBiYXNlIGZlYXR1cmUgb2JqZWN0XCI7fSxcbiAgICAgICAgbW92ZSAgICA6IGZ1bmN0aW9uICgpIHt0aHJvdyBcIm1vdmVfZWxlbSBpcyBub3QgZGVmaW5lZCBpbiB0aGUgYmFzZSBmZWF0dXJlIG9iamVjdFwiO30sXG4gICAgICAgIGRpc3RyaWJ1dGUgIDogZnVuY3Rpb24gKCkge30sXG4gICAgICAgIGZpeGVkICAgOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgLy9sYXlvdXQgICA6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgICBpbmRleCAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgbGF5b3V0ICAgOiBsYXlvdXQuaWRlbnRpdHkoKSxcbiAgICAgICAgY29sb3IgOiAnIzAwMCcsXG4gICAgICAgIHNjYWxlIDogdW5kZWZpbmVkXG4gICAgfTtcblxuXG4gICAgLy8gVGhlIHJldHVybmVkIG9iamVjdFxuICAgIHZhciBmZWF0dXJlID0ge307XG5cbiAgICB2YXIgcmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgXHR2YXIgdHJhY2sgPSB0aGlzO1xuICAgIFx0dHJhY2suZy5zZWxlY3RBbGwoXCIudG50X2VsZW1cIikucmVtb3ZlKCk7XG4gICAgICAgIHRyYWNrLmcuc2VsZWN0QWxsKFwiLnRudF9ndWlkZXJcIikucmVtb3ZlKCk7XG4gICAgfTtcblxuICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKHdpZHRoKSB7XG4gICAgICAgIHZhciB0cmFjayA9IHRoaXM7XG5cbiAgICAgICAgdHJhY2suZ1xuICAgICAgICAgICAgLmFwcGVuZCAoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAuYXR0ciAoXCJ4XCIsIDUpXG4gICAgICAgICAgICAuYXR0ciAoXCJ5XCIsIDEyKVxuICAgICAgICAgICAgLmF0dHIgKFwiZm9udC1zaXplXCIsIDExKVxuICAgICAgICAgICAgLmF0dHIgKFwiZmlsbFwiLCBcImdyZXlcIilcbiAgICAgICAgICAgIC50ZXh0ICh0cmFjay5sYWJlbCgpKTtcblxuICAgICAgICBjb25maWcuZml4ZWQuY2FsbCh0cmFjaywgd2lkdGgpO1xuICAgIH07XG5cbiAgICB2YXIgcGxvdCA9IGZ1bmN0aW9uIChuZXdfZWxlbXMsIHRyYWNrLCB4U2NhbGUpIHtcbiAgICAgICAgbmV3X2VsZW1zLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICAgIGlmIChkMy5ldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGlzcGF0Y2guY2xpY2suY2FsbCh0aGlzLCBkLCBpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG5ld19lbGVtcy5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICAgICAgaWYgKGQzLmV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXNwYXRjaC5tb3VzZW92ZXIuY2FsbCh0aGlzLCBkLCBpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG5ld19lbGVtcy5vbihcImRibGNsaWNrXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICBpZiAoZDMuZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpc3BhdGNoLmRibGNsaWNrLmNhbGwodGhpcywgZCwgaSk7XG4gICAgICAgIH0pO1xuICAgICAgICBuZXdfZWxlbXMub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICAgICAgaWYgKGQzLmV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXNwYXRjaC5tb3VzZW91dC5jYWxsKHRoaXMsIGQsIGkpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gbmV3X2VsZW0gaXMgYSBnIGVsZW1lbnQgdGhlIGZlYXR1cmUgaXMgaW5zZXJ0ZWRcbiAgICAgICAgY29uZmlnLmNyZWF0ZS5jYWxsKHRyYWNrLCBuZXdfZWxlbXMsIHhTY2FsZSk7XG4gICAgfTtcblxuICAgIHZhciB1cGRhdGUgPSBmdW5jdGlvbiAobG9jLCBmaWVsZCkge1xuICAgICAgICB2YXIgdHJhY2sgPSB0aGlzO1xuICAgICAgICB2YXIgc3ZnX2cgPSB0cmFjay5nO1xuXG4gICAgICAgIHZhciBlbGVtZW50cyA9IHRyYWNrLmRhdGEoKS5lbGVtZW50cygpO1xuXG4gICAgICAgIGlmIChmaWVsZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBlbGVtZW50cyA9IGVsZW1lbnRzW2ZpZWxkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkYXRhX2VsZW1zID0gY29uZmlnLmxheW91dC5jYWxsKHRyYWNrLCBlbGVtZW50cyk7XG5cblxuICAgICAgICBpZiAoZGF0YV9lbGVtcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdmlzX3NlbDtcbiAgICAgICAgdmFyIHZpc19lbGVtcztcbiAgICAgICAgaWYgKGZpZWxkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZpc19zZWwgPSBzdmdfZy5zZWxlY3RBbGwoXCIudG50X2VsZW1fXCIgKyBmaWVsZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2aXNfc2VsID0gc3ZnX2cuc2VsZWN0QWxsKFwiLnRudF9lbGVtXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5pbmRleCkgeyAvLyBJbmRleGluZyBieSBmaWVsZFxuICAgICAgICAgICAgdmlzX2VsZW1zID0gdmlzX3NlbFxuICAgICAgICAgICAgICAgIC5kYXRhKGRhdGFfZWxlbXMsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWcuaW5kZXgoZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHsgLy8gSW5kZXhpbmcgYnkgcG9zaXRpb24gaW4gYXJyYXlcbiAgICAgICAgICAgIHZpc19lbGVtcyA9IHZpc19zZWxcbiAgICAgICAgICAgICAgICAuZGF0YShkYXRhX2VsZW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZy5kaXN0cmlidXRlLmNhbGwodHJhY2ssIHZpc19lbGVtcywgY29uZmlnLnNjYWxlKTtcblxuICAgIFx0dmFyIG5ld19lbGVtID0gdmlzX2VsZW1zXG4gICAgXHQgICAgLmVudGVyKCk7XG5cbiAgICBcdG5ld19lbGVtXG4gICAgXHQgICAgLmFwcGVuZChcImdcIilcbiAgICBcdCAgICAuYXR0cihcImNsYXNzXCIsIFwidG50X2VsZW1cIilcbiAgICBcdCAgICAuY2xhc3NlZChcInRudF9lbGVtX1wiICsgZmllbGQsIGZpZWxkKVxuICAgIFx0ICAgIC5jYWxsKGZlYXR1cmUucGxvdCwgdHJhY2ssIGNvbmZpZy5zY2FsZSk7XG5cbiAgICBcdHZpc19lbGVtc1xuICAgIFx0ICAgIC5leGl0KClcbiAgICBcdCAgICAucmVtb3ZlKCk7XG4gICAgfTtcblxuICAgIHZhciBtb3ZlciA9IGZ1bmN0aW9uIChmaWVsZCkge1xuICAgIFx0dmFyIHRyYWNrID0gdGhpcztcbiAgICBcdHZhciBzdmdfZyA9IHRyYWNrLmc7XG4gICAgXHR2YXIgZWxlbXM7XG4gICAgXHQvLyBUT0RPOiBJcyBzZWxlY3RpbmcgdGhlIGVsZW1lbnRzIHRvIG1vdmUgdG9vIHNsb3c/XG4gICAgXHQvLyBJdCB3b3VsZCBiZSBuaWNlIHRvIHByb2ZpbGVcbiAgICBcdGlmIChmaWVsZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgXHQgICAgZWxlbXMgPSBzdmdfZy5zZWxlY3RBbGwoXCIudG50X2VsZW1fXCIgKyBmaWVsZCk7XG4gICAgXHR9IGVsc2Uge1xuICAgIFx0ICAgIGVsZW1zID0gc3ZnX2cuc2VsZWN0QWxsKFwiLnRudF9lbGVtXCIpO1xuICAgIFx0fVxuXG4gICAgXHRjb25maWcubW92ZS5jYWxsKHRoaXMsIGVsZW1zKTtcbiAgICB9O1xuXG4gICAgdmFyIG10ZiA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIGVsZW0ucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChlbGVtKTtcbiAgICB9O1xuXG4gICAgdmFyIG1vdmVfdG9fZnJvbnQgPSBmdW5jdGlvbiAoZmllbGQpIHtcbiAgICAgICAgaWYgKGZpZWxkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciB0cmFjayA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgc3ZnX2cgPSB0cmFjay5nO1xuICAgICAgICAgICAgc3ZnX2cuc2VsZWN0QWxsKFwiLnRudF9lbGVtX1wiICsgZmllbGQpXG4gICAgICAgICAgICAgICAgLmVhY2goIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbXRmKHRoaXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEFQSVxuICAgIGFwaWpzIChmZWF0dXJlKVxuICAgIFx0LmdldHNldCAoY29uZmlnKVxuICAgIFx0Lm1ldGhvZCAoe1xuICAgIFx0ICAgIHJlc2V0ICA6IHJlc2V0LFxuICAgIFx0ICAgIHBsb3QgICA6IHBsb3QsXG4gICAgXHQgICAgdXBkYXRlIDogdXBkYXRlLFxuICAgIFx0ICAgIG1vdmVyICAgOiBtb3ZlcixcbiAgICBcdCAgICBpbml0ICAgOiBpbml0LFxuICAgIFx0ICAgIG1vdmVfdG9fZnJvbnQgOiBtb3ZlX3RvX2Zyb250XG4gICAgXHR9KTtcblxuICAgIHJldHVybiBkMy5yZWJpbmQoZmVhdHVyZSwgZGlzcGF0Y2gsIFwib25cIik7XG59O1xuXG50bnRfZmVhdHVyZS5jb21wb3NpdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRpc3BsYXlzID0ge307XG4gICAgdmFyIGRpc3BsYXlfb3JkZXIgPSBbXTtcblxuICAgIHZhciBmZWF0dXJlcyA9IHt9O1xuXG4gICAgdmFyIHJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIFx0dmFyIHRyYWNrID0gdGhpcztcbiAgICBcdGZvciAodmFyIGk9MDsgaTxkaXNwbGF5cy5sZW5ndGg7IGkrKykge1xuICAgIFx0ICAgIGRpc3BsYXlzW2ldLnJlc2V0LmNhbGwodHJhY2spO1xuICAgIFx0fVxuICAgIH07XG5cbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICh3aWR0aCkge1xuICAgICAgICB2YXIgdHJhY2sgPSB0aGlzO1xuICAgICAgICBmb3IgKHZhciBkaXNwbGF5IGluIGRpc3BsYXlzKSB7XG4gICAgICAgICAgICBpZiAoZGlzcGxheXMuaGFzT3duUHJvcGVydHkoZGlzcGxheSkpIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5c1tkaXNwbGF5XS5zY2FsZShmZWF0dXJlcy5zY2FsZSgpKTtcbiAgICAgICAgICAgICAgICBkaXNwbGF5c1tkaXNwbGF5XS5pbml0LmNhbGwodHJhY2ssIHdpZHRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgdXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIFx0dmFyIHRyYWNrID0gdGhpcztcbiAgICBcdGZvciAodmFyIGk9MDsgaTxkaXNwbGF5X29yZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgXHQgICAgZGlzcGxheXNbZGlzcGxheV9vcmRlcltpXV0udXBkYXRlLmNhbGwodHJhY2ssIHVuZGVmaW5lZCwgZGlzcGxheV9vcmRlcltpXSk7XG4gICAgXHQgICAgZGlzcGxheXNbZGlzcGxheV9vcmRlcltpXV0ubW92ZV90b19mcm9udC5jYWxsKHRyYWNrLCBkaXNwbGF5X29yZGVyW2ldKTtcbiAgICBcdH1cbiAgICAgICAgLy8gZm9yICh2YXIgZGlzcGxheSBpbiBkaXNwbGF5cykge1xuICAgICAgICAvLyAgICAgaWYgKGRpc3BsYXlzLmhhc093blByb3BlcnR5KGRpc3BsYXkpKSB7XG4gICAgICAgIC8vICAgICAgICAgZGlzcGxheXNbZGlzcGxheV0udXBkYXRlLmNhbGwodHJhY2ssIHhTY2FsZSwgZGlzcGxheSk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cbiAgICB9O1xuXG4gICAgdmFyIG1vdmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdHJhY2sgPSB0aGlzO1xuICAgICAgICBmb3IgKHZhciBkaXNwbGF5IGluIGRpc3BsYXlzKSB7XG4gICAgICAgICAgICBpZiAoZGlzcGxheXMuaGFzT3duUHJvcGVydHkoZGlzcGxheSkpIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5c1tkaXNwbGF5XS5tb3Zlci5jYWxsKHRyYWNrLCBkaXNwbGF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgYWRkID0gZnVuY3Rpb24gKGtleSwgZGlzcGxheSkge1xuICAgIFx0ZGlzcGxheXNba2V5XSA9IGRpc3BsYXk7XG4gICAgXHRkaXNwbGF5X29yZGVyLnB1c2goa2V5KTtcbiAgICBcdHJldHVybiBmZWF0dXJlcztcbiAgICB9O1xuXG4gICAgdmFyIGdldF9kaXNwbGF5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBcdHZhciBkcyA9IFtdO1xuICAgIFx0Zm9yICh2YXIgaT0wOyBpPGRpc3BsYXlfb3JkZXIubGVuZ3RoOyBpKyspIHtcbiAgICBcdCAgICBkcy5wdXNoKGRpc3BsYXlzW2Rpc3BsYXlfb3JkZXJbaV1dKTtcbiAgICBcdH1cbiAgICBcdHJldHVybiBkcztcbiAgICB9O1xuXG4gICAgLy8gQVBJXG4gICAgYXBpanMgKGZlYXR1cmVzKVxuICAgICAgICAuZ2V0c2V0KFwic2NhbGVcIilcbiAgICBcdC5tZXRob2QgKHtcbiAgICBcdCAgICByZXNldCAgOiByZXNldCxcbiAgICBcdCAgICB1cGRhdGUgOiB1cGRhdGUsXG4gICAgXHQgICAgbW92ZXIgICA6IG1vdmVyLFxuICAgIFx0ICAgIGluaXQgICA6IGluaXQsXG4gICAgXHQgICAgYWRkICAgIDogYWRkLFxuICAgIFx0ICAgIGRpc3BsYXlzIDogZ2V0X2Rpc3BsYXlzXG4gICAgXHR9KTtcblxuICAgIHJldHVybiBmZWF0dXJlcztcbn07XG5cbnRudF9mZWF0dXJlLmFyZWEgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZlYXR1cmUgPSB0bnRfZmVhdHVyZS5saW5lKCk7XG4gICAgdmFyIGxpbmUgPSBmZWF0dXJlLmxpbmUoKTtcblxuICAgIHZhciBhcmVhID0gZDMuc3ZnLmFyZWEoKVxuICAgIFx0LmludGVycG9sYXRlKGxpbmUuaW50ZXJwb2xhdGUoKSlcbiAgICBcdC50ZW5zaW9uKGZlYXR1cmUudGVuc2lvbigpKTtcblxuICAgIHZhciBkYXRhX3BvaW50cztcblxuICAgIHZhciBsaW5lX2NyZWF0ZSA9IGZlYXR1cmUuY3JlYXRlKCk7IC8vIFdlICdzYXZlJyBsaW5lIGNyZWF0aW9uXG5cbiAgICBmZWF0dXJlLmNyZWF0ZSAoZnVuY3Rpb24gKHBvaW50cykge1xuICAgIFx0dmFyIHRyYWNrID0gdGhpcztcbiAgICAgICAgdmFyIHhTY2FsZSA9IGZlYXR1cmUuc2NhbGUoKTtcblxuICAgIFx0aWYgKGRhdGFfcG9pbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICBcdCAgICB0cmFjay5nLnNlbGVjdChcInBhdGhcIikucmVtb3ZlKCk7XG4gICAgXHR9XG5cbiAgICBcdGxpbmVfY3JlYXRlLmNhbGwodHJhY2ssIHBvaW50cywgeFNjYWxlKTtcblxuICAgIFx0YXJlYVxuICAgIFx0ICAgIC54KGxpbmUueCgpKVxuICAgIFx0ICAgIC55MShsaW5lLnkoKSlcbiAgICBcdCAgICAueTAodHJhY2suaGVpZ2h0KCkpO1xuXG4gICAgXHRkYXRhX3BvaW50cyA9IHBvaW50cy5kYXRhKCk7XG4gICAgXHRwb2ludHMucmVtb3ZlKCk7XG5cbiAgICBcdHRyYWNrLmdcbiAgICBcdCAgICAuYXBwZW5kKFwicGF0aFwiKVxuICAgIFx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0bnRfYXJlYVwiKVxuICAgIFx0ICAgIC5jbGFzc2VkKFwidG50X2VsZW1cIiwgdHJ1ZSlcbiAgICBcdCAgICAuZGF0dW0oZGF0YV9wb2ludHMpXG4gICAgXHQgICAgLmF0dHIoXCJkXCIsIGFyZWEpXG4gICAgXHQgICAgLmF0dHIoXCJmaWxsXCIsIGQzLnJnYihmZWF0dXJlLmNvbG9yKCkpLmJyaWdodGVyKCkpO1xuICAgIH0pO1xuXG4gICAgdmFyIGxpbmVfbW92ZSA9IGZlYXR1cmUubW92ZSgpO1xuICAgIGZlYXR1cmUubW92ZSAoZnVuY3Rpb24gKHBhdGgpIHtcbiAgICBcdHZhciB0cmFjayA9IHRoaXM7XG4gICAgICAgIHZhciB4U2NhbGUgPSBmZWF0dXJlLnNjYWxlKCk7XG4gICAgXHRsaW5lX21vdmUuY2FsbCh0cmFjaywgcGF0aCwgeFNjYWxlKTtcblxuICAgIFx0YXJlYS54KGxpbmUueCgpKTtcbiAgICBcdHRyYWNrLmdcbiAgICBcdCAgICAuc2VsZWN0KFwiLnRudF9hcmVhXCIpXG4gICAgXHQgICAgLmRhdHVtKGRhdGFfcG9pbnRzKVxuICAgIFx0ICAgIC5hdHRyKFwiZFwiLCBhcmVhKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBmZWF0dXJlO1xuXG59O1xuXG50bnRfZmVhdHVyZS5saW5lID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBmZWF0dXJlID0gdG50X2ZlYXR1cmUoKTtcblxuICAgIHZhciB4ID0gZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgcmV0dXJuIGQucG9zO1xuICAgIH07XG4gICAgdmFyIHkgPSBmdW5jdGlvbiAoZCkge1xuICAgICAgICByZXR1cm4gZC52YWw7XG4gICAgfTtcbiAgICB2YXIgdGVuc2lvbiA9IDAuNztcbiAgICB2YXIgeVNjYWxlID0gZDMuc2NhbGUubGluZWFyKCk7XG4gICAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpXG4gICAgICAgIC5pbnRlcnBvbGF0ZShcImJhc2lzXCIpO1xuXG4gICAgLy8gbGluZSBnZXR0ZXIuIFRPRE86IFNldHRlcj9cbiAgICBmZWF0dXJlLmxpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBsaW5lO1xuICAgIH07XG5cbiAgICBmZWF0dXJlLnggPSBmdW5jdGlvbiAoY2Jhaykge1xuICAgIFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgXHQgICAgcmV0dXJuIHg7XG4gICAgXHR9XG4gICAgXHR4ID0gY2JhaztcbiAgICBcdHJldHVybiBmZWF0dXJlO1xuICAgIH07XG5cbiAgICBmZWF0dXJlLnkgPSBmdW5jdGlvbiAoY2Jhaykge1xuICAgIFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgXHQgICAgcmV0dXJuIHk7XG4gICAgXHR9XG4gICAgXHR5ID0gY2JhaztcbiAgICBcdHJldHVybiBmZWF0dXJlO1xuICAgIH07XG5cbiAgICBmZWF0dXJlLnRlbnNpb24gPSBmdW5jdGlvbiAodCkge1xuICAgIFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgXHQgICAgcmV0dXJuIHRlbnNpb247XG4gICAgXHR9XG4gICAgXHR0ZW5zaW9uID0gdDtcbiAgICBcdHJldHVybiBmZWF0dXJlO1xuICAgIH07XG5cbiAgICB2YXIgZGF0YV9wb2ludHM7XG5cbiAgICAvLyBGb3Igbm93LCBjcmVhdGUgaXMgYSBvbmUtb2ZmIGV2ZW50XG4gICAgLy8gVE9ETzogTWFrZSBpdCB3b3JrIHdpdGggcGFydGlhbCBwYXRocywgaWUuIGNyZWF0aW5nIGFuZCBkaXNwbGF5aW5nIG9ubHkgdGhlIHBhdGggdGhhdCBpcyBiZWluZyBkaXNwbGF5ZWRcbiAgICBmZWF0dXJlLmNyZWF0ZSAoZnVuY3Rpb24gKHBvaW50cykge1xuICAgIFx0dmFyIHRyYWNrID0gdGhpcztcbiAgICAgICAgdmFyIHhTY2FsZSA9IGZlYXR1cmUuc2NhbGUoKTtcblxuICAgIFx0aWYgKGRhdGFfcG9pbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICBcdCAgICAvLyByZXR1cm47XG4gICAgXHQgICAgdHJhY2suZy5zZWxlY3QoXCJwYXRoXCIpLnJlbW92ZSgpO1xuICAgIFx0fVxuXG4gICAgXHRsaW5lXG4gICAgXHQgICAgLnRlbnNpb24odGVuc2lvbilcbiAgICBcdCAgICAueChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4U2NhbGUoeChkKSk7XG4gICAgXHQgICAgfSlcbiAgICBcdCAgICAueShmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmFjay5oZWlnaHQoKSAtIHlTY2FsZSh5KGQpKTtcbiAgICBcdCAgICB9KTtcblxuICAgIFx0ZGF0YV9wb2ludHMgPSBwb2ludHMuZGF0YSgpO1xuICAgIFx0cG9pbnRzLnJlbW92ZSgpO1xuXG4gICAgXHR5U2NhbGVcbiAgICBcdCAgICAuZG9tYWluKFswLCAxXSlcbiAgICBcdCAgICAvLyAuZG9tYWluKFswLCBkMy5tYXgoZGF0YV9wb2ludHMsIGZ1bmN0aW9uIChkKSB7XG4gICAgXHQgICAgLy8gXHRyZXR1cm4geShkKTtcbiAgICBcdCAgICAvLyB9KV0pXG4gICAgXHQgICAgLnJhbmdlKFswLCB0cmFjay5oZWlnaHQoKSAtIDJdKTtcblxuICAgIFx0dHJhY2suZ1xuICAgIFx0ICAgIC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRudF9lbGVtXCIpXG4gICAgXHQgICAgLmF0dHIoXCJkXCIsIGxpbmUoZGF0YV9wb2ludHMpKVxuICAgIFx0ICAgIC5zdHlsZShcInN0cm9rZVwiLCBmZWF0dXJlLmNvbG9yKCkpXG4gICAgXHQgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIDQpXG4gICAgXHQgICAgLnN0eWxlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgfSk7XG5cbiAgICBmZWF0dXJlLm1vdmUgKGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgXHR2YXIgdHJhY2sgPSB0aGlzO1xuICAgICAgICB2YXIgeFNjYWxlID0gZmVhdHVyZS5zY2FsZSgpO1xuXG4gICAgXHRsaW5lLngoZnVuY3Rpb24gKGQpIHtcbiAgICBcdCAgICByZXR1cm4geFNjYWxlKHgoZCkpO1xuICAgIFx0fSk7XG4gICAgXHR0cmFjay5nLnNlbGVjdChcInBhdGhcIilcbiAgICBcdCAgICAuYXR0cihcImRcIiwgbGluZShkYXRhX3BvaW50cykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZlYXR1cmU7XG59O1xuXG50bnRfZmVhdHVyZS5jb25zZXJ2YXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vICdJbmhlcml0JyBmcm9tIGZlYXR1cmUuYXJlYVxuICAgICAgICB2YXIgZmVhdHVyZSA9IHRudF9mZWF0dXJlLmFyZWEoKTtcblxuICAgICAgICB2YXIgYXJlYV9jcmVhdGUgPSBmZWF0dXJlLmNyZWF0ZSgpOyAvLyBXZSAnc2F2ZScgYXJlYSBjcmVhdGlvblxuICAgICAgICBmZWF0dXJlLmNyZWF0ZSAgKGZ1bmN0aW9uIChwb2ludHMpIHtcbiAgICAgICAgXHR2YXIgdHJhY2sgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHhTY2FsZSA9IGZlYXR1cmUuc2NhbGUoKTtcbiAgICAgICAgXHRhcmVhX2NyZWF0ZS5jYWxsKHRyYWNrLCBkMy5zZWxlY3QocG9pbnRzWzBdWzBdKSwgeFNjYWxlKTtcbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gZmVhdHVyZTtcbn07XG5cbnRudF9mZWF0dXJlLmVuc2VtYmwgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gJ0luaGVyaXQnIGZyb20gYm9hcmQudHJhY2suZmVhdHVyZVxuICAgIHZhciBmZWF0dXJlID0gdG50X2ZlYXR1cmUoKTtcblxuICAgIHZhciBjb2xvcjIgPSBcIiM3RkZGMDBcIjtcbiAgICB2YXIgY29sb3IzID0gXCIjMDBCQjAwXCI7XG5cbiAgICBmZWF0dXJlLmZpeGVkIChmdW5jdGlvbiAod2lkdGgpIHtcbiAgICBcdHZhciB0cmFjayA9IHRoaXM7XG4gICAgXHR2YXIgaGVpZ2h0X29mZnNldCA9IH5+KHRyYWNrLmhlaWdodCgpIC0gKHRyYWNrLmhlaWdodCgpICAqIDAuOCkpIC8gMjtcblxuICAgIFx0dHJhY2suZ1xuICAgIFx0ICAgIC5hcHBlbmQoXCJsaW5lXCIpXG4gICAgXHQgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRudF9ndWlkZXJcIilcbiAgICBcdCAgICAuYXR0cihcIngxXCIsIDApXG4gICAgXHQgICAgLmF0dHIoXCJ4MlwiLCB3aWR0aClcbiAgICBcdCAgICAuYXR0cihcInkxXCIsIGhlaWdodF9vZmZzZXQpXG4gICAgXHQgICAgLmF0dHIoXCJ5MlwiLCBoZWlnaHRfb2Zmc2V0KVxuICAgIFx0ICAgIC5zdHlsZShcInN0cm9rZVwiLCBmZWF0dXJlLmNvbG9yKCkpXG4gICAgXHQgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIDEpO1xuXG4gICAgXHR0cmFjay5nXG4gICAgXHQgICAgLmFwcGVuZChcImxpbmVcIilcbiAgICBcdCAgICAuYXR0cihcImNsYXNzXCIsIFwidG50X2d1aWRlclwiKVxuICAgIFx0ICAgIC5hdHRyKFwieDFcIiwgMClcbiAgICBcdCAgICAuYXR0cihcIngyXCIsIHdpZHRoKVxuICAgIFx0ICAgIC5hdHRyKFwieTFcIiwgdHJhY2suaGVpZ2h0KCkgLSBoZWlnaHRfb2Zmc2V0KVxuICAgIFx0ICAgIC5hdHRyKFwieTJcIiwgdHJhY2suaGVpZ2h0KCkgLSBoZWlnaHRfb2Zmc2V0KVxuICAgIFx0ICAgIC5zdHlsZShcInN0cm9rZVwiLCBmZWF0dXJlLmNvbG9yKCkpXG4gICAgXHQgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIDEpO1xuXG4gICAgfSk7XG5cbiAgICBmZWF0dXJlLmNyZWF0ZSAoZnVuY3Rpb24gKG5ld19lbGVtcykge1xuICAgIFx0dmFyIHRyYWNrID0gdGhpcztcbiAgICAgICAgdmFyIHhTY2FsZSA9IGZlYXR1cmUuc2NhbGUoKTtcblxuICAgIFx0dmFyIGhlaWdodF9vZmZzZXQgPSB+fih0cmFjay5oZWlnaHQoKSAtICh0cmFjay5oZWlnaHQoKSAgKiAwLjgpKSAvIDI7XG5cbiAgICBcdG5ld19lbGVtc1xuICAgIFx0ICAgIC5hcHBlbmQoXCJyZWN0XCIpXG4gICAgXHQgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhTY2FsZSAoZC5zdGFydCk7XG4gICAgXHQgICAgfSlcbiAgICBcdCAgICAuYXR0cihcInlcIiwgaGVpZ2h0X29mZnNldClcbiAgICAvLyBcdCAgICAuYXR0cihcInJ4XCIsIDMpXG4gICAgLy8gXHQgICAgLmF0dHIoXCJyeVwiLCAzKVxuICAgIFx0ICAgIC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHhTY2FsZShkLmVuZCkgLSB4U2NhbGUoZC5zdGFydCkpO1xuICAgIFx0ICAgIH0pXG4gICAgXHQgICAgLmF0dHIoXCJoZWlnaHRcIiwgdHJhY2suaGVpZ2h0KCkgLSB+fihoZWlnaHRfb2Zmc2V0ICogMikpXG4gICAgXHQgICAgLmF0dHIoXCJmaWxsXCIsIHRyYWNrLmNvbG9yKCkpXG4gICAgXHQgICAgLnRyYW5zaXRpb24oKVxuICAgIFx0ICAgIC5kdXJhdGlvbig1MDApXG4gICAgXHQgICAgLmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIFx0XHRpZiAoZC50eXBlID09PSAnaGlnaCcpIHtcbiAgICAgICAgXHRcdCAgICByZXR1cm4gZDMucmdiKGZlYXR1cmUuY29sb3IoKSk7XG4gICAgICAgIFx0XHR9XG4gICAgICAgIFx0XHRpZiAoZC50eXBlID09PSAnbG93Jykge1xuICAgICAgICBcdFx0ICAgIHJldHVybiBkMy5yZ2IoZmVhdHVyZS5jb2xvcjIoKSk7XG4gICAgICAgIFx0XHR9XG4gICAgICAgIFx0XHRyZXR1cm4gZDMucmdiKGZlYXR1cmUuY29sb3IzKCkpO1xuICAgIFx0ICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZmVhdHVyZS5kaXN0cmlidXRlIChmdW5jdGlvbiAoYmxvY2tzKSB7XG4gICAgICAgIHZhciB4U2NhbGUgPSBmZWF0dXJlLnNjYWxlKCk7XG4gICAgXHRibG9ja3NcbiAgICBcdCAgICAuc2VsZWN0KFwicmVjdFwiKVxuICAgIFx0ICAgIC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHhTY2FsZShkLmVuZCkgLSB4U2NhbGUoZC5zdGFydCkpO1xuICAgIFx0ICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZmVhdHVyZS5tb3ZlIChmdW5jdGlvbiAoYmxvY2tzKSB7XG4gICAgICAgIHZhciB4U2NhbGUgPSBmZWF0dXJlLnNjYWxlKCk7XG4gICAgXHRibG9ja3NcbiAgICBcdCAgICAuc2VsZWN0KFwicmVjdFwiKVxuICAgIFx0ICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4U2NhbGUoZC5zdGFydCk7XG4gICAgXHQgICAgfSlcbiAgICBcdCAgICAuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh4U2NhbGUoZC5lbmQpIC0geFNjYWxlKGQuc3RhcnQpKTtcbiAgICBcdCAgICB9KTtcbiAgICB9KTtcblxuICAgIGZlYXR1cmUuY29sb3IyID0gZnVuY3Rpb24gKGNvbCkge1xuICAgIFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgXHQgICAgcmV0dXJuIGNvbG9yMjtcbiAgICBcdH1cbiAgICBcdGNvbG9yMiA9IGNvbDtcbiAgICBcdHJldHVybiBmZWF0dXJlO1xuICAgIH07XG5cbiAgICBmZWF0dXJlLmNvbG9yMyA9IGZ1bmN0aW9uIChjb2wpIHtcbiAgICBcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIFx0ICAgIHJldHVybiBjb2xvcjM7XG4gICAgXHR9XG4gICAgXHRjb2xvcjMgPSBjb2w7XG4gICAgXHRyZXR1cm4gZmVhdHVyZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGZlYXR1cmU7XG59O1xuXG50bnRfZmVhdHVyZS52bGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyAnSW5oZXJpdCcgZnJvbSBmZWF0dXJlXG4gICAgdmFyIGZlYXR1cmUgPSB0bnRfZmVhdHVyZSgpO1xuXG4gICAgZmVhdHVyZS5jcmVhdGUgKGZ1bmN0aW9uIChuZXdfZWxlbXMpIHtcbiAgICAgICAgdmFyIHhTY2FsZSA9IGZlYXR1cmUuc2NhbGUoKTtcbiAgICBcdHZhciB0cmFjayA9IHRoaXM7XG4gICAgXHRuZXdfZWxlbXNcbiAgICBcdCAgICAuYXBwZW5kIChcImxpbmVcIilcbiAgICBcdCAgICAuYXR0cihcIngxXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhTY2FsZShmZWF0dXJlLmluZGV4KCkoZCkpO1xuICAgIFx0ICAgIH0pXG4gICAgXHQgICAgLmF0dHIoXCJ4MlwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4U2NhbGUoZmVhdHVyZS5pbmRleCgpKGQpKTtcbiAgICBcdCAgICB9KVxuICAgIFx0ICAgIC5hdHRyKFwieTFcIiwgMClcbiAgICBcdCAgICAuYXR0cihcInkyXCIsIHRyYWNrLmhlaWdodCgpKVxuICAgIFx0ICAgIC5hdHRyKFwic3Ryb2tlXCIsIGZlYXR1cmUuY29sb3IoKSlcbiAgICBcdCAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAxKTtcbiAgICB9KTtcblxuICAgIGZlYXR1cmUubW92ZSAoZnVuY3Rpb24gKHZsaW5lcykge1xuICAgICAgICB2YXIgeFNjYWxlID0gZmVhdHVyZS5zY2FsZSgpO1xuICAgIFx0dmxpbmVzXG4gICAgXHQgICAgLnNlbGVjdChcImxpbmVcIilcbiAgICBcdCAgICAuYXR0cihcIngxXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhTY2FsZShmZWF0dXJlLmluZGV4KCkoZCkpO1xuICAgIFx0ICAgIH0pXG4gICAgXHQgICAgLmF0dHIoXCJ4MlwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4U2NhbGUoZmVhdHVyZS5pbmRleCgpKGQpKTtcbiAgICBcdCAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBmZWF0dXJlO1xuXG59O1xuXG50bnRfZmVhdHVyZS5waW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gJ0luaGVyaXQnIGZyb20gYm9hcmQudHJhY2suZmVhdHVyZVxuICAgIHZhciBmZWF0dXJlID0gdG50X2ZlYXR1cmUoKTtcblxuICAgIHZhciB5U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgIFx0LmRvbWFpbihbMCwwXSlcbiAgICBcdC5yYW5nZShbMCwwXSk7XG5cbiAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgcG9zIDogZDMuZnVuY3RvcihcInBvc1wiKSxcbiAgICAgICAgdmFsIDogZDMuZnVuY3RvcihcInZhbFwiKSxcbiAgICAgICAgZG9tYWluIDogWzAsMF1cbiAgICB9O1xuXG4gICAgdmFyIHBpbl9iYWxsX3IgPSA1OyAvLyB0aGUgcmFkaXVzIG9mIHRoZSBjaXJjbGUgaW4gdGhlIHBpblxuXG4gICAgYXBpanMoZmVhdHVyZSlcbiAgICAgICAgLmdldHNldChvcHRzKTtcblxuXG4gICAgZmVhdHVyZS5jcmVhdGUgKGZ1bmN0aW9uIChuZXdfcGlucykge1xuICAgIFx0dmFyIHRyYWNrID0gdGhpcztcbiAgICAgICAgdmFyIHhTY2FsZSA9IGZlYXR1cmUuc2NhbGUoKTtcbiAgICBcdHlTY2FsZVxuICAgIFx0ICAgIC5kb21haW4oZmVhdHVyZS5kb21haW4oKSlcbiAgICBcdCAgICAucmFuZ2UoW3Bpbl9iYWxsX3IsIHRyYWNrLmhlaWdodCgpLXBpbl9iYWxsX3ItMTBdKTsgLy8gMTAgZm9yIGxhYmVsbGluZ1xuXG4gICAgXHQvLyBwaW5zIGFyZSBjb21wb3NlZCBvZiBsaW5lcywgY2lyY2xlcyBhbmQgbGFiZWxzXG4gICAgXHRuZXdfcGluc1xuICAgIFx0ICAgIC5hcHBlbmQoXCJsaW5lXCIpXG4gICAgXHQgICAgLmF0dHIoXCJ4MVwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgIFx0ICAgIFx0cmV0dXJuIHhTY2FsZShkW29wdHMucG9zKGQsIGkpXSk7XG4gICAgXHQgICAgfSlcbiAgICBcdCAgICAuYXR0cihcInkxXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNrLmhlaWdodCgpO1xuICAgIFx0ICAgIH0pXG4gICAgXHQgICAgLmF0dHIoXCJ4MlwiLCBmdW5jdGlvbiAoZCxpKSB7XG4gICAgXHQgICAgXHRyZXR1cm4geFNjYWxlKGRbb3B0cy5wb3MoZCwgaSldKTtcbiAgICBcdCAgICB9KVxuICAgIFx0ICAgIC5hdHRyKFwieTJcIiwgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICBcdCAgICBcdHJldHVybiB0cmFjay5oZWlnaHQoKSAtIHlTY2FsZShkW29wdHMudmFsKGQsIGkpXSk7XG4gICAgXHQgICAgfSlcbiAgICBcdCAgICAuYXR0cihcInN0cm9rZVwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkMy5mdW5jdG9yKGZlYXR1cmUuY29sb3IoKSkoZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgIFx0bmV3X3BpbnNcbiAgICBcdCAgICAuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgXHQgICAgLmF0dHIoXCJjeFwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4U2NhbGUoZFtvcHRzLnBvcyhkLCBpKV0pO1xuICAgIFx0ICAgIH0pXG4gICAgXHQgICAgLmF0dHIoXCJjeVwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmFjay5oZWlnaHQoKSAtIHlTY2FsZShkW29wdHMudmFsKGQsIGkpXSk7XG4gICAgXHQgICAgfSlcbiAgICBcdCAgICAuYXR0cihcInJcIiwgcGluX2JhbGxfcilcbiAgICBcdCAgICAuYXR0cihcImZpbGxcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZDMuZnVuY3RvcihmZWF0dXJlLmNvbG9yKCkpKGQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3X3BpbnNcbiAgICAgICAgICAgIC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAuYXR0cihcImZvbnQtc2l6ZVwiLCBcIjEzXCIpXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geFNjYWxlKGRbb3B0cy5wb3MoZCwgaSldKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTA7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGQubGFiZWwgfHwgXCJcIjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBmZWF0dXJlLmRpc3RyaWJ1dGUgKGZ1bmN0aW9uIChwaW5zKSB7XG4gICAgICAgIHBpbnNcbiAgICAgICAgICAgIC5zZWxlY3QoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkLmxhYmVsIHx8IFwiXCI7XG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGZlYXR1cmUubW92ZShmdW5jdGlvbiAocGlucykge1xuICAgIFx0dmFyIHRyYWNrID0gdGhpcztcbiAgICAgICAgdmFyIHhTY2FsZSA9IGZlYXR1cmUuc2NhbGUoKTtcblxuICAgIFx0cGluc1xuICAgIFx0ICAgIC8vLmVhY2gocG9zaXRpb25fcGluX2xpbmUpXG4gICAgXHQgICAgLnNlbGVjdChcImxpbmVcIilcbiAgICBcdCAgICAuYXR0cihcIngxXCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhTY2FsZShkW29wdHMucG9zKGQsIGkpXSk7XG4gICAgXHQgICAgfSlcbiAgICBcdCAgICAuYXR0cihcInkxXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIFx0XHRyZXR1cm4gdHJhY2suaGVpZ2h0KCk7XG4gICAgXHQgICAgfSlcbiAgICBcdCAgICAuYXR0cihcIngyXCIsIGZ1bmN0aW9uIChkLGkpIHtcbiAgICAgICAgXHRcdHJldHVybiB4U2NhbGUoZFtvcHRzLnBvcyhkLCBpKV0pO1xuICAgIFx0ICAgIH0pXG4gICAgXHQgICAgLmF0dHIoXCJ5MlwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICBcdFx0cmV0dXJuIHRyYWNrLmhlaWdodCgpIC0geVNjYWxlKGRbb3B0cy52YWwoZCwgaSldKTtcbiAgICBcdCAgICB9KTtcblxuICAgIFx0cGluc1xuICAgIFx0ICAgIC5zZWxlY3QoXCJjaXJjbGVcIilcbiAgICBcdCAgICAuYXR0cihcImN4XCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhTY2FsZShkW29wdHMucG9zKGQsIGkpXSk7XG4gICAgXHQgICAgfSlcbiAgICBcdCAgICAuYXR0cihcImN5XCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYWNrLmhlaWdodCgpIC0geVNjYWxlKGRbb3B0cy52YWwoZCwgaSldKTtcbiAgICBcdCAgICB9KTtcblxuICAgICAgICBwaW5zXG4gICAgICAgICAgICAuc2VsZWN0KFwidGV4dFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhTY2FsZShkW29wdHMucG9zKGQsIGkpXSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZC5sYWJlbCB8fCBcIlwiO1xuICAgICAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGZlYXR1cmUuZml4ZWQgKGZ1bmN0aW9uICh3aWR0aCkge1xuICAgICAgICB2YXIgdHJhY2sgPSB0aGlzO1xuICAgICAgICB0cmFjay5nXG4gICAgICAgICAgICAuYXBwZW5kKFwibGluZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4MVwiLCAwKVxuICAgICAgICAgICAgLmF0dHIoXCJ4MlwiLCB3aWR0aClcbiAgICAgICAgICAgIC5hdHRyKFwieTFcIiwgdHJhY2suaGVpZ2h0KCkpXG4gICAgICAgICAgICAuYXR0cihcInkyXCIsIHRyYWNrLmhlaWdodCgpKVxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsIFwiYmxhY2tcIilcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZS13aXRoXCIsIFwiMXB4XCIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZlYXR1cmU7XG59O1xuXG50bnRfZmVhdHVyZS5ibG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyAnSW5oZXJpdCcgZnJvbSBib2FyZC50cmFjay5mZWF0dXJlXG4gICAgdmFyIGZlYXR1cmUgPSB0bnRfZmVhdHVyZSgpO1xuXG4gICAgYXBpanMoZmVhdHVyZSlcbiAgICBcdC5nZXRzZXQoJ2Zyb20nLCBmdW5jdGlvbiAoZCkge1xuICAgIFx0ICAgIHJldHVybiBkLnN0YXJ0O1xuICAgIFx0fSlcbiAgICBcdC5nZXRzZXQoJ3RvJywgZnVuY3Rpb24gKGQpIHtcbiAgICBcdCAgICByZXR1cm4gZC5lbmQ7XG4gICAgXHR9KTtcblxuICAgIGZlYXR1cmUuY3JlYXRlKGZ1bmN0aW9uIChuZXdfZWxlbXMpIHtcbiAgICBcdHZhciB0cmFjayA9IHRoaXM7XG4gICAgICAgIHZhciB4U2NhbGUgPSBmZWF0dXJlLnNjYWxlKCk7XG4gICAgXHRuZXdfZWxlbXNcbiAgICBcdCAgICAuYXBwZW5kKFwicmVjdFwiKVxuICAgIFx0ICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICBcdFx0Ly8gVE9ETzogc3RhcnQsIGVuZCBzaG91bGQgYmUgYWRqdXN0YWJsZSB2aWEgdGhlIHRyYWNrcyBBUElcbiAgICAgICAgXHRcdHJldHVybiB4U2NhbGUoZmVhdHVyZS5mcm9tKCkoZCwgaSkpO1xuICAgIFx0ICAgIH0pXG4gICAgXHQgICAgLmF0dHIoXCJ5XCIsIDApXG4gICAgXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICBcdFx0cmV0dXJuICh4U2NhbGUoZmVhdHVyZS50bygpKGQsIGkpKSAtIHhTY2FsZShmZWF0dXJlLmZyb20oKShkLCBpKSkpO1xuICAgIFx0ICAgIH0pXG4gICAgXHQgICAgLmF0dHIoXCJoZWlnaHRcIiwgdHJhY2suaGVpZ2h0KCkpXG4gICAgXHQgICAgLmF0dHIoXCJmaWxsXCIsIHRyYWNrLmNvbG9yKCkpXG4gICAgXHQgICAgLnRyYW5zaXRpb24oKVxuICAgIFx0ICAgIC5kdXJhdGlvbig1MDApXG4gICAgXHQgICAgLmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIFx0XHRpZiAoZC5jb2xvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIFx0XHQgICAgcmV0dXJuIGZlYXR1cmUuY29sb3IoKTtcbiAgICAgICAgXHRcdH0gZWxzZSB7XG4gICAgICAgIFx0XHQgICAgcmV0dXJuIGQuY29sb3I7XG4gICAgICAgIFx0XHR9XG4gICAgXHQgICAgfSk7XG4gICAgfSk7XG5cbiAgICBmZWF0dXJlLmRpc3RyaWJ1dGUoZnVuY3Rpb24gKGVsZW1zKSB7XG4gICAgICAgIHZhciB4U2NhbGUgPSBmZWF0dXJlLnNjYWxlKCk7XG4gICAgXHRlbGVtc1xuICAgIFx0ICAgIC5zZWxlY3QoXCJyZWN0XCIpXG4gICAgXHQgICAgLmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICBcdFx0cmV0dXJuICh4U2NhbGUoZC5lbmQpIC0geFNjYWxlKGQuc3RhcnQpKTtcbiAgICBcdCAgICB9KTtcbiAgICB9KTtcblxuICAgIGZlYXR1cmUubW92ZShmdW5jdGlvbiAoYmxvY2tzKSB7XG4gICAgICAgIHZhciB4U2NhbGUgPSBmZWF0dXJlLnNjYWxlKCk7XG4gICAgXHRibG9ja3NcbiAgICBcdCAgICAuc2VsZWN0KFwicmVjdFwiKVxuICAgIFx0ICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICBcdFx0cmV0dXJuIHhTY2FsZShkLnN0YXJ0KTtcbiAgICBcdCAgICB9KVxuICAgIFx0ICAgIC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgXHRcdHJldHVybiAoeFNjYWxlKGQuZW5kKSAtIHhTY2FsZShkLnN0YXJ0KSk7XG4gICAgXHQgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmVhdHVyZTtcblxufTtcblxudG50X2ZlYXR1cmUuYXhpcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgeEF4aXM7XG4gICAgdmFyIG9yaWVudGF0aW9uID0gXCJ0b3BcIjtcbiAgICB2YXIgeFNjYWxlO1xuXG4gICAgLy8gQXhpcyBkb2Vzbid0IGluaGVyaXQgZnJvbSBmZWF0dXJlXG4gICAgdmFyIGZlYXR1cmUgPSB7fTtcbiAgICBmZWF0dXJlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIFx0eEF4aXMgPSB1bmRlZmluZWQ7XG4gICAgXHR2YXIgdHJhY2sgPSB0aGlzO1xuICAgIFx0dHJhY2suZy5zZWxlY3RBbGwoXCJyZWN0XCIpLnJlbW92ZSgpO1xuICAgIFx0dHJhY2suZy5zZWxlY3RBbGwoXCIudGlja1wiKS5yZW1vdmUoKTtcbiAgICB9O1xuICAgIGZlYXR1cmUucGxvdCA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIGZlYXR1cmUubW92ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgXHR2YXIgdHJhY2sgPSB0aGlzO1xuICAgIFx0dmFyIHN2Z19nID0gdHJhY2suZztcbiAgICBcdHN2Z19nLmNhbGwoeEF4aXMpO1xuICAgIH07XG5cbiAgICBmZWF0dXJlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHhBeGlzID0gdW5kZWZpbmVkO1xuICAgIH07XG5cbiAgICBmZWF0dXJlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBcdC8vIENyZWF0ZSBBeGlzIGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICAgICAgaWYgKHhBeGlzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHhBeGlzID0gZDMuc3ZnLmF4aXMoKVxuICAgICAgICAgICAgICAgIC5zY2FsZSh4U2NhbGUpXG4gICAgICAgICAgICAgICAgLm9yaWVudChvcmllbnRhdGlvbik7XG4gICAgICAgIH1cblxuICAgIFx0dmFyIHRyYWNrID0gdGhpcztcbiAgICBcdHZhciBzdmdfZyA9IHRyYWNrLmc7XG4gICAgXHRzdmdfZy5jYWxsKHhBeGlzKTtcbiAgICB9O1xuXG4gICAgZmVhdHVyZS5vcmllbnRhdGlvbiA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgICBcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIFx0ICAgIHJldHVybiBvcmllbnRhdGlvbjtcbiAgICBcdH1cbiAgICBcdG9yaWVudGF0aW9uID0gcG9zO1xuICAgIFx0cmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIGZlYXR1cmUuc2NhbGUgPSBmdW5jdGlvbiAocykge1xuICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB4U2NhbGU7XG4gICAgICAgIH1cbiAgICAgICAgeFNjYWxlID0gcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIHJldHVybiBmZWF0dXJlO1xufTtcblxudG50X2ZlYXR1cmUubG9jYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJvdztcbiAgICB2YXIgeFNjYWxlO1xuXG4gICAgdmFyIGZlYXR1cmUgPSB7fTtcbiAgICBmZWF0dXJlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByb3cgPSB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICBmZWF0dXJlLnBsb3QgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICBmZWF0dXJlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJvdyA9IHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIGZlYXR1cmUubW92ZXIgPSBmdW5jdGlvbigpIHtcbiAgICBcdHZhciBkb21haW4gPSB4U2NhbGUuZG9tYWluKCk7XG4gICAgXHRyb3cuc2VsZWN0KFwidGV4dFwiKVxuICAgIFx0ICAgIC50ZXh0KFwiTG9jYXRpb246IFwiICsgfn5kb21haW5bMF0gKyBcIi1cIiArIH5+ZG9tYWluWzFdKTtcbiAgICB9O1xuXG4gICAgZmVhdHVyZS5zY2FsZSA9IGZ1bmN0aW9uIChzYykge1xuICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB4U2NhbGU7XG4gICAgICAgIH1cbiAgICAgICAgeFNjYWxlID0gc2M7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBmZWF0dXJlLnVwZGF0ZSA9IGZ1bmN0aW9uIChsb2MpIHtcbiAgICBcdHZhciB0cmFjayA9IHRoaXM7XG4gICAgXHR2YXIgc3ZnX2cgPSB0cmFjay5nO1xuICAgIFx0dmFyIGRvbWFpbiA9IHhTY2FsZS5kb21haW4oKTtcbiAgICBcdGlmIChyb3cgPT09IHVuZGVmaW5lZCkge1xuICAgIFx0ICAgIHJvdyA9IHN2Z19nO1xuICAgIFx0ICAgIHJvd1xuICAgICAgICBcdFx0LmFwcGVuZChcInRleHRcIilcbiAgICAgICAgXHRcdC50ZXh0KFwiTG9jYXRpb246IFwiICsgTWF0aC5yb3VuZChkb21haW5bMF0pICsgXCItXCIgKyBNYXRoLnJvdW5kKGRvbWFpblsxXSkpO1xuICAgIFx0fVxuICAgIH07XG5cbiAgICByZXR1cm4gZmVhdHVyZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IHRudF9mZWF0dXJlO1xuIiwidmFyIGJvYXJkID0gcmVxdWlyZSAoXCIuL2JvYXJkLmpzXCIpO1xuYm9hcmQudHJhY2sgPSByZXF1aXJlIChcIi4vdHJhY2tcIik7XG5ib2FyZC50cmFjay5kYXRhID0gcmVxdWlyZSAoXCIuL2RhdGEuanNcIik7XG5ib2FyZC50cmFjay5sYXlvdXQgPSByZXF1aXJlIChcIi4vbGF5b3V0LmpzXCIpO1xuYm9hcmQudHJhY2suZmVhdHVyZSA9IHJlcXVpcmUgKFwiLi9mZWF0dXJlLmpzXCIpO1xuYm9hcmQudHJhY2subGF5b3V0ID0gcmVxdWlyZSAoXCIuL2xheW91dC5qc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gYm9hcmQ7XG4iLCJ2YXIgYXBpanMgPSByZXF1aXJlIChcInRudC5hcGlcIik7XG5cbi8vIHZhciBib2FyZCA9IHt9O1xuLy8gYm9hcmQudHJhY2sgPSB7fTtcbnZhciBsYXlvdXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAvLyBUaGUgcmV0dXJuZWQgY2xvc3VyZSAvIG9iamVjdFxuICAgIHZhciBsID0gZnVuY3Rpb24gKG5ld19lbGVtcykgIHtcbiAgICAgICAgdmFyIHRyYWNrID0gdGhpcztcbiAgICAgICAgbC5lbGVtZW50cygpLmNhbGwodHJhY2ssIG5ld19lbGVtcyk7XG4gICAgICAgIHJldHVybiBuZXdfZWxlbXM7XG4gICAgfTtcblxuICAgIHZhciBhcGkgPSBhcGlqcyhsKVxuICAgICAgICAuZ2V0c2V0ICgnZWxlbWVudHMnLCBmdW5jdGlvbiAoKSB7fSk7XG5cbiAgICByZXR1cm4gbDtcbn07XG5cbmxheW91dC5pZGVudGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbGF5b3V0KClcbiAgICAgICAgLmVsZW1lbnRzIChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gbGF5b3V0O1xuIiwidmFyIHNwaW5uZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gdmFyIG4gPSAwO1xuICAgIHZhciBzcF9lbGVtO1xuICAgIHZhciBzcCA9IHt9O1xuXG4gICAgc3Aub24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0cmFjayA9IHRoaXM7XG4gICAgICAgIGlmICghdHJhY2suc3Bpbm5lcikge1xuICAgICAgICAgICAgdHJhY2suc3Bpbm5lciA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmFjay5zcGlubmVyKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRyYWNrLnNwaW5uZXI9PTEpIHtcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSB0cmFjay5nO1xuICAgICAgICAgICAgdmFyIGJnQ29sb3IgPSB0cmFjay5jb2xvcigpO1xuICAgICAgICAgICAgc3BfZWxlbSA9IGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidG50X3NwaW5uZXJcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIFwiMzBweFwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIFwiMzBweFwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieG1sc1wiLCBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ2aWV3Qm94XCIsIFwiMCAwIDEwMCAxMDBcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInByZXNlcnZlQXNwZWN0UmF0aW9cIiwgXCJ4TWlkWU1pZFwiKTtcblxuXG4gICAgICAgICAgICBzcF9lbGVtXG4gICAgICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInhcIiwgJzAnKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCAnMCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBcIjEwMFwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIFwiMTAwXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJyeFwiLCAnNTAnKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwicnlcIiwgJzUwJylcbiAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgYmdDb2xvcik7XG4gICAgICAgICAgICAgICAgLy8uYXR0cihcIm9wYWNpdHlcIiwgMC42KTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPDEyOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aWNrKHNwX2VsZW0sIGksIGJnQ29sb3IpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAodHJhY2suc3Bpbm5lcj4wKXtcbiAgICAgICAgICAgIC8vIE1vdmUgdGhlIHNwaW5uZXIgdG8gZnJvbnRcbiAgICAgICAgICAgIHZhciBub2RlID0gc3BfZWxlbS5ub2RlKCk7XG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnROb2RlLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHNwLm9mZiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRyYWNrID0gdGhpcztcbiAgICAgICAgdHJhY2suc3Bpbm5lci0tO1xuICAgICAgICBpZiAoIXRyYWNrLnNwaW5uZXIpIHtcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSB0cmFjay5nO1xuICAgICAgICAgICAgY29udGFpbmVyLnNlbGVjdEFsbChcIi50bnRfc3Bpbm5lclwiKVxuICAgICAgICAgICAgICAgIC5yZW1vdmUoKTtcblxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHRpY2sgKGVsZW0sIGksIGJnQ29sb3IpIHtcbiAgICAgICAgZWxlbVxuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCBcIjQ2LjVcIilcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCAnNDAnKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBcIjdcIilcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIFwiMjBcIilcbiAgICAgICAgICAgIC5hdHRyKFwicnhcIiwgXCI1XCIpXG4gICAgICAgICAgICAuYXR0cihcInJ5XCIsIFwiNVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIGQzLnJnYihiZ0NvbG9yKS5kYXJrZXIoMikpXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInJvdGF0ZShcIiArICgzNjAvMTIpKmkgKyBcIiA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKVwiKVxuICAgICAgICAgICAgLmFwcGVuZChcImFuaW1hdGVcIilcbiAgICAgICAgICAgIC5hdHRyKFwiYXR0cmlidXRlTmFtZVwiLCBcIm9wYWNpdHlcIilcbiAgICAgICAgICAgIC5hdHRyKFwiZnJvbVwiLCBcIjFcIilcbiAgICAgICAgICAgIC5hdHRyKFwidG9cIiwgXCIwXCIpXG4gICAgICAgICAgICAuYXR0cihcImR1clwiLCBcIjFzXCIpXG4gICAgICAgICAgICAuYXR0cihcImJlZ2luXCIsICgxLzEyKSppICsgXCJzXCIpXG4gICAgICAgICAgICAuYXR0cihcInJlcGVhdENvdW50XCIsIFwiaW5kZWZpbml0ZVwiKTtcblxuICAgIH1cblxuICAgIHJldHVybiBzcDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBzcGlubmVyO1xuIiwidmFyIGFwaWpzID0gcmVxdWlyZSAoXCJ0bnQuYXBpXCIpO1xudmFyIGl0ZXJhdG9yID0gcmVxdWlyZShcInRudC51dGlsc1wiKS5pdGVyYXRvcjtcblxuXG52YXIgdHJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgZGlzcGxheTtcblxuICAgIHZhciBjb25mID0ge1xuICAgIFx0Y29sb3IgOiBkMy5yZ2IoJyNDQ0NDQ0MnKSxcbiAgICBcdGhlaWdodCAgICAgICAgICAgOiAyNTAsXG4gICAgXHQvLyBkYXRhIGlzIHRoZSBvYmplY3QgKG5vcm1hbGx5IGEgdG50LnRyYWNrLmRhdGEgb2JqZWN0KSB1c2VkIHRvIHJldHJpZXZlIGFuZCB1cGRhdGUgZGF0YSBmb3IgdGhlIHRyYWNrXG4gICAgXHRkYXRhICAgICAgICAgICAgIDogdHJhY2suZGF0YS5lbXB0eSgpLFxuICAgICAgICAvLyBkaXNwbGF5ICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICBsYWJlbCAgICAgICAgICAgIDogXCJcIixcbiAgICAgICAgaWQgICAgICAgICAgICAgICA6IHRyYWNrLmlkKClcbiAgICB9O1xuXG4gICAgLy8gVGhlIHJldHVybmVkIG9iamVjdCAvIGNsb3N1cmVcbiAgICB2YXIgdCA9IHt9O1xuXG4gICAgLy8gQVBJXG4gICAgdmFyIGFwaSA9IGFwaWpzICh0KVxuICAgIFx0LmdldHNldCAoY29uZik7XG5cbiAgICAvLyBUT0RPOiBUaGlzIG1lYW5zIHRoYXQgaGVpZ2h0IHNob3VsZCBiZSBkZWZpbmVkIGJlZm9yZSBkaXNwbGF5XG4gICAgLy8gd2Ugc2hvdWxkbid0IHJlbHkgb24gdGhpc1xuICAgIHQuZGlzcGxheSA9IGZ1bmN0aW9uIChuZXdfcGxvdHRlcikge1xuICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBkaXNwbGF5O1xuICAgICAgICB9XG5cbiAgICAgICAgZGlzcGxheSA9IG5ld19wbG90dGVyO1xuICAgICAgICBpZiAodHlwZW9mIChkaXNwbGF5KSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgZGlzcGxheS5sYXlvdXQgJiYgZGlzcGxheS5sYXlvdXQoKS5oZWlnaHQoY29uZi5oZWlnaHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGRpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGlzcGxheS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlba2V5XS5sYXlvdXQgJiYgZGlzcGxheVtrZXldLmxheW91dCgpLmhlaWdodChjb25mLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIHJldHVybiB0O1xufTtcblxudHJhY2suaWQgPSBpdGVyYXRvcigxKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gdHJhY2s7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHRudF9yZXN0ID0gcmVxdWlyZShcIi4vc3JjL3Jlc3QuanNcIik7XG4iLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsKXtcbi8qIVxuICogQG92ZXJ2aWV3IGVzNi1wcm9taXNlIC0gYSB0aW55IGltcGxlbWVudGF0aW9uIG9mIFByb21pc2VzL0ErLlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTQgWWVodWRhIEthdHosIFRvbSBEYWxlLCBTdGVmYW4gUGVubmVyIGFuZCBjb250cmlidXRvcnMgKENvbnZlcnNpb24gdG8gRVM2IEFQSSBieSBKYWtlIEFyY2hpYmFsZClcbiAqIEBsaWNlbnNlICAgTGljZW5zZWQgdW5kZXIgTUlUIGxpY2Vuc2VcbiAqICAgICAgICAgICAgU2VlIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9qYWtlYXJjaGliYWxkL2VzNi1wcm9taXNlL21hc3Rlci9MSUNFTlNFXG4gKiBAdmVyc2lvbiAgIDMuMC4yXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkb2JqZWN0T3JGdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbicgfHwgKHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzRnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNNYXliZVRoZW5hYmxlKHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHV0aWxzJCRfaXNBcnJheTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkpIHtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkX2lzQXJyYXkgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGliJGVzNiRwcm9taXNlJHV0aWxzJCRfaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNBcnJheSA9IGxpYiRlczYkcHJvbWlzZSR1dGlscyQkX2lzQXJyYXk7XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRsZW4gPSAwO1xuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkdG9TdHJpbmcgPSB7fS50b1N0cmluZztcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJHZlcnR4TmV4dDtcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGN1c3RvbVNjaGVkdWxlckZuO1xuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwID0gZnVuY3Rpb24gYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWVbbGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbl0gPSBjYWxsYmFjaztcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuICsgMV0gPSBhcmc7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuICs9IDI7XG4gICAgICBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbiA9PT0gMikge1xuICAgICAgICAvLyBJZiBsZW4gaXMgMiwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXG4gICAgICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgICAgIC8vIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoaXMgZmx1c2ggdGhhdCB3ZSBhcmUgc2NoZWR1bGluZy5cbiAgICAgICAgaWYgKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRjdXN0b21TY2hlZHVsZXJGbikge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRjdXN0b21TY2hlZHVsZXJGbihsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzY2hlZHVsZUZsdXNoKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2V0U2NoZWR1bGVyKHNjaGVkdWxlRm4pIHtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRjdXN0b21TY2hlZHVsZXJGbiA9IHNjaGVkdWxlRm47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHNldEFzYXAoYXNhcEZuKSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcCA9IGFzYXBGbjtcbiAgICB9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGJyb3dzZXJXaW5kb3cgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpID8gd2luZG93IDogdW5kZWZpbmVkO1xuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3Nlckdsb2JhbCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRicm93c2VyV2luZG93IHx8IHt9O1xuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRpc05vZGUgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nO1xuXG4gICAgLy8gdGVzdCBmb3Igd2ViIHdvcmtlciBidXQgbm90IGluIElFMTBcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGlzV29ya2VyID0gdHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICd1bmRlZmluZWQnO1xuXG4gICAgLy8gbm9kZVxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VOZXh0VGljaygpIHtcbiAgICAgIC8vIG5vZGUgdmVyc2lvbiAwLjEwLnggZGlzcGxheXMgYSBkZXByZWNhdGlvbiB3YXJuaW5nIHdoZW4gbmV4dFRpY2sgaXMgdXNlZCByZWN1cnNpdmVseVxuICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jdWpvanMvd2hlbi9pc3N1ZXMvNDEwIGZvciBkZXRhaWxzXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2sobGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gdmVydHhcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlVmVydHhUaW1lcigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHZlcnR4TmV4dChsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2gpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBsaWIkZXM2JHByb21pc2UkYXNhcCQkQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIobGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoKTtcbiAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgbm9kZS5kYXRhID0gKGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gd2ViIHdvcmtlclxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VNZXNzYWdlQ2hhbm5lbCgpIHtcbiAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaDtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VTZXRUaW1lb3V0KCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaCwgMSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWUgPSBuZXcgQXJyYXkoMTAwMCk7XG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoKCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuOyBpKz0yKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtpXTtcbiAgICAgICAgdmFyIGFyZyA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtpKzFdO1xuXG4gICAgICAgIGNhbGxiYWNrKGFyZyk7XG5cbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHF1ZXVlW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWVbaSsxXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbiA9IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJGF0dGVtcHRWZXJ0eCgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciByID0gcmVxdWlyZTtcbiAgICAgICAgdmFyIHZlcnR4ID0gcigndmVydHgnKTtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHZlcnR4TmV4dCA9IHZlcnR4LnJ1bk9uTG9vcCB8fCB2ZXJ0eC5ydW5PbkNvbnRleHQ7XG4gICAgICAgIHJldHVybiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlVmVydHhUaW1lcigpO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlU2V0VGltZW91dCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaDtcbiAgICAvLyBEZWNpZGUgd2hhdCBhc3luYyBtZXRob2QgdG8gdXNlIHRvIHRyaWdnZXJpbmcgcHJvY2Vzc2luZyBvZiBxdWV1ZWQgY2FsbGJhY2tzOlxuICAgIGlmIChsaWIkZXM2JHByb21pc2UkYXNhcCQkaXNOb2RlKSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VOZXh0VGljaygpO1xuICAgIH0gZWxzZSBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG4gICAgfSBlbHNlIGlmIChsaWIkZXM2JHByb21pc2UkYXNhcCQkaXNXb3JrZXIpIHtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZU1lc3NhZ2VDaGFubmVsKCk7XG4gICAgfSBlbHNlIGlmIChsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3NlcldpbmRvdyA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhdHRlbXB0VmVydHgoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlU2V0VGltZW91dCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3AoKSB7fVxuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcgICA9IHZvaWQgMDtcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEID0gMTtcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQgID0gMjtcblxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUiA9IG5ldyBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRFcnJvck9iamVjdCgpO1xuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkc2VsZkZ1bGZpbGxtZW50KCkge1xuICAgICAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXCJZb3UgY2Fubm90IHJlc29sdmUgYSBwcm9taXNlIHdpdGggaXRzZWxmXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGNhbm5vdFJldHVybk93bigpIHtcbiAgICAgIHJldHVybiBuZXcgVHlwZUVycm9yKCdBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZ2V0VGhlbihwcm9taXNlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUi5lcnJvciA9IGVycm9yO1xuICAgICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkdHJ5VGhlbih0aGVuLCB2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcik7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlLCB0aGVuKSB7XG4gICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXAoZnVuY3Rpb24ocHJvbWlzZSkge1xuICAgICAgICB2YXIgc2VhbGVkID0gZmFsc2U7XG4gICAgICAgIHZhciBlcnJvciA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHRyeVRoZW4odGhlbiwgdGhlbmFibGUsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHNlYWxlZCkgeyByZXR1cm47IH1cbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgIGlmIChzZWFsZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9LCAnU2V0dGxlOiAnICsgKHByb21pc2UuX2xhYmVsIHx8ICcgdW5rbm93biBwcm9taXNlJykpO1xuXG4gICAgICAgIGlmICghc2VhbGVkICYmIGVycm9yKSB7XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9LCBwcm9taXNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSkge1xuICAgICAgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gICAgICB9IGVsc2UgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHRoZW5hYmxlLCB1bmRlZmluZWQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpIHtcbiAgICAgIGlmIChtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yID09PSBwcm9taXNlLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHRoZW4gPSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRnZXRUaGVuKG1heWJlVGhlbmFibGUpO1xuXG4gICAgICAgIGlmICh0aGVuID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUikge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUi5lcnJvcik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhlbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICAgICAgfSBlbHNlIGlmIChsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzRnVuY3Rpb24odGhlbikpIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpIHtcbiAgICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkc2VsZkZ1bGZpbGxtZW50KCkpO1xuICAgICAgfSBlbHNlIGlmIChsaWIkZXM2JHByb21pc2UkdXRpbHMkJG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gICAgICBpZiAocHJvbWlzZS5fb25lcnJvcikge1xuICAgICAgICBwcm9taXNlLl9vbmVycm9yKHByb21pc2UuX3Jlc3VsdCk7XG4gICAgICB9XG5cbiAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2gocHJvbWlzZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSkge1xuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7IHJldHVybjsgfVxuXG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3N0YXRlID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEO1xuXG4gICAgICBpZiAocHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2gsIHByb21pc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pIHtcbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORykgeyByZXR1cm47IH1cbiAgICAgIHByb21pc2UuX3N0YXRlID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQ7XG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSByZWFzb247XG5cbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2hSZWplY3Rpb24sIHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICAgICAgdmFyIHN1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcbiAgICAgIHZhciBsZW5ndGggPSBzdWJzY3JpYmVycy5sZW5ndGg7XG5cbiAgICAgIHBhcmVudC5fb25lcnJvciA9IG51bGw7XG5cbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aF0gPSBjaGlsZDtcbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aCArIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xuICAgICAgc3Vic2NyaWJlcnNbbGVuZ3RoICsgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURURdICA9IG9uUmVqZWN0aW9uO1xuXG4gICAgICBpZiAobGVuZ3RoID09PSAwICYmIHBhcmVudC5fc3RhdGUpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXAobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcHVibGlzaCwgcGFyZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRwdWJsaXNoKHByb21pc2UpIHtcbiAgICAgIHZhciBzdWJzY3JpYmVycyA9IHByb21pc2UuX3N1YnNjcmliZXJzO1xuICAgICAgdmFyIHNldHRsZWQgPSBwcm9taXNlLl9zdGF0ZTtcblxuICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cblxuICAgICAgdmFyIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHNldHRsZWQsIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhkZXRhaWwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKSB7XG4gICAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SID0gbmV3IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCk7XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCR0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZGV0YWlsKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IuZXJyb3IgPSBlO1xuICAgICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgICAgIHZhciBoYXNDYWxsYmFjayA9IGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICAgICAgdmFsdWUsIGVycm9yLCBzdWNjZWVkZWQsIGZhaWxlZDtcblxuICAgICAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgICAgIHZhbHVlID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCk7XG5cbiAgICAgICAgaWYgKHZhbHVlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IpIHtcbiAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgICAgIGVycm9yID0gdmFsdWUuZXJyb3I7XG4gICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkY2Fubm90UmV0dXJuT3duKCkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGRldGFpbDtcbiAgICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgIC8vIG5vb3BcbiAgICAgIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChmYWlsZWQpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRSRUpFQ1RFRCkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGluaXRpYWxpemVQcm9taXNlKHByb21pc2UsIHJlc29sdmVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlcihmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSl7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIHJlamVjdFByb21pc2UocmVhc29uKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvcihDb25zdHJ1Y3RvciwgaW5wdXQpIHtcbiAgICAgIHZhciBlbnVtZXJhdG9yID0gdGhpcztcblxuICAgICAgZW51bWVyYXRvci5faW5zdGFuY2VDb25zdHJ1Y3RvciA9IENvbnN0cnVjdG9yO1xuICAgICAgZW51bWVyYXRvci5wcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3ApO1xuXG4gICAgICBpZiAoZW51bWVyYXRvci5fdmFsaWRhdGVJbnB1dChpbnB1dCkpIHtcbiAgICAgICAgZW51bWVyYXRvci5faW5wdXQgICAgID0gaW5wdXQ7XG4gICAgICAgIGVudW1lcmF0b3IubGVuZ3RoICAgICA9IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgZW51bWVyYXRvci5fcmVtYWluaW5nID0gaW5wdXQubGVuZ3RoO1xuXG4gICAgICAgIGVudW1lcmF0b3IuX2luaXQoKTtcblxuICAgICAgICBpZiAoZW51bWVyYXRvci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKGVudW1lcmF0b3IucHJvbWlzZSwgZW51bWVyYXRvci5fcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbnVtZXJhdG9yLmxlbmd0aCA9IGVudW1lcmF0b3IubGVuZ3RoIHx8IDA7XG4gICAgICAgICAgZW51bWVyYXRvci5fZW51bWVyYXRlKCk7XG4gICAgICAgICAgaWYgKGVudW1lcmF0b3IuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChlbnVtZXJhdG9yLnByb21pc2UsIGVudW1lcmF0b3IuX3Jlc3VsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QoZW51bWVyYXRvci5wcm9taXNlLCBlbnVtZXJhdG9yLl92YWxpZGF0aW9uRXJyb3IoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl92YWxpZGF0ZUlucHV0ID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgIHJldHVybiBsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzQXJyYXkoaW5wdXQpO1xuICAgIH07XG5cbiAgICBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3ZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignQXJyYXkgTWV0aG9kcyBtdXN0IGJlIHByb3ZpZGVkIGFuIEFycmF5Jyk7XG4gICAgfTtcblxuICAgIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fcmVzdWx0ID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKTtcbiAgICB9O1xuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3I7XG5cbiAgICBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2VudW1lcmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuXG4gICAgICB2YXIgbGVuZ3RoICA9IGVudW1lcmF0b3IubGVuZ3RoO1xuICAgICAgdmFyIHByb21pc2UgPSBlbnVtZXJhdG9yLnByb21pc2U7XG4gICAgICB2YXIgaW5wdXQgICA9IGVudW1lcmF0b3IuX2lucHV0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgcHJvbWlzZS5fc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVudW1lcmF0b3IuX2VhY2hFbnRyeShpbnB1dFtpXSwgaSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fZWFjaEVudHJ5ID0gZnVuY3Rpb24oZW50cnksIGkpIHtcbiAgICAgIHZhciBlbnVtZXJhdG9yID0gdGhpcztcbiAgICAgIHZhciBjID0gZW51bWVyYXRvci5faW5zdGFuY2VDb25zdHJ1Y3RvcjtcblxuICAgICAgaWYgKGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNNYXliZVRoZW5hYmxlKGVudHJ5KSkge1xuICAgICAgICBpZiAoZW50cnkuY29uc3RydWN0b3IgPT09IGMgJiYgZW50cnkuX3N0YXRlICE9PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgICAgZW50cnkuX29uZXJyb3IgPSBudWxsO1xuICAgICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdChlbnRyeS5fc3RhdGUsIGksIGVudHJ5Ll9yZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVudW1lcmF0b3IuX3dpbGxTZXR0bGVBdChjLnJlc29sdmUoZW50cnkpLCBpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW51bWVyYXRvci5fcmVtYWluaW5nLS07XG4gICAgICAgIGVudW1lcmF0b3IuX3Jlc3VsdFtpXSA9IGVudHJ5O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3NldHRsZWRBdCA9IGZ1bmN0aW9uKHN0YXRlLCBpLCB2YWx1ZSkge1xuICAgICAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuICAgICAgdmFyIHByb21pc2UgPSBlbnVtZXJhdG9yLnByb21pc2U7XG5cbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORykge1xuICAgICAgICBlbnVtZXJhdG9yLl9yZW1haW5pbmctLTtcblxuICAgICAgICBpZiAoc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFJFSkVDVEVEKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbnVtZXJhdG9yLl9yZXN1bHRbaV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZW51bWVyYXRvci5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgZW51bWVyYXRvci5fcmVzdWx0KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl93aWxsU2V0dGxlQXQgPSBmdW5jdGlvbihwcm9taXNlLCBpKSB7XG4gICAgICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG5cbiAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHN1YnNjcmliZShwcm9taXNlLCB1bmRlZmluZWQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdChsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRGVUxGSUxMRUQsIGksIHZhbHVlKTtcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICBlbnVtZXJhdG9yLl9zZXR0bGVkQXQobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQsIGksIHJlYXNvbik7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkYWxsKGVudHJpZXMpIHtcbiAgICAgIHJldHVybiBuZXcgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJGRlZmF1bHQodGhpcywgZW50cmllcykucHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkYWxsO1xuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJhY2UkJHJhY2UoZW50cmllcykge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICAgIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3ApO1xuXG4gICAgICBpZiAoIWxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNBcnJheShlbnRyaWVzKSkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhbiBhcnJheSB0byByYWNlLicpKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBsZW5ndGggPSBlbnRyaWVzLmxlbmd0aDtcblxuICAgICAgZnVuY3Rpb24gb25GdWxmaWxsbWVudCh2YWx1ZSkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gb25SZWplY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgcHJvbWlzZS5fc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHN1YnNjcmliZShDb25zdHJ1Y3Rvci5yZXNvbHZlKGVudHJpZXNbaV0pLCB1bmRlZmluZWQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyYWNlJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmFjZSQkcmFjZTtcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZXNvbHZlJCRyZXNvbHZlKG9iamVjdCkge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICAgIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSBDb25zdHJ1Y3Rvcikge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgb2JqZWN0KTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlc29sdmUkJHJlc29sdmU7XG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVqZWN0JCRyZWplY3QocmVhc29uKSB7XG4gICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3ApO1xuICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlamVjdCQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlamVjdCQkcmVqZWN0O1xuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRjb3VudGVyID0gMDtcblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRuZWVkc1Jlc29sdmVyKCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRuZWVkc05ldygpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdQcm9taXNlJzogUGxlYXNlIHVzZSB0aGUgJ25ldycgb3BlcmF0b3IsIHRoaXMgb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi5cIik7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2U7XG4gICAgLyoqXG4gICAgICBQcm9taXNlIG9iamVjdHMgcmVwcmVzZW50IHRoZSBldmVudHVhbCByZXN1bHQgb2YgYW4gYXN5bmNocm9ub3VzIG9wZXJhdGlvbi4gVGhlXG4gICAgICBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLCB3aGljaFxuICAgICAgcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGUgcmVhc29uXG4gICAgICB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cblxuICAgICAgVGVybWlub2xvZ3lcbiAgICAgIC0tLS0tLS0tLS0tXG5cbiAgICAgIC0gYHByb21pc2VgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB3aXRoIGEgYHRoZW5gIG1ldGhvZCB3aG9zZSBiZWhhdmlvciBjb25mb3JtcyB0byB0aGlzIHNwZWNpZmljYXRpb24uXG4gICAgICAtIGB0aGVuYWJsZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHRoYXQgZGVmaW5lcyBhIGB0aGVuYCBtZXRob2QuXG4gICAgICAtIGB2YWx1ZWAgaXMgYW55IGxlZ2FsIEphdmFTY3JpcHQgdmFsdWUgKGluY2x1ZGluZyB1bmRlZmluZWQsIGEgdGhlbmFibGUsIG9yIGEgcHJvbWlzZSkuXG4gICAgICAtIGBleGNlcHRpb25gIGlzIGEgdmFsdWUgdGhhdCBpcyB0aHJvd24gdXNpbmcgdGhlIHRocm93IHN0YXRlbWVudC5cbiAgICAgIC0gYHJlYXNvbmAgaXMgYSB2YWx1ZSB0aGF0IGluZGljYXRlcyB3aHkgYSBwcm9taXNlIHdhcyByZWplY3RlZC5cbiAgICAgIC0gYHNldHRsZWRgIHRoZSBmaW5hbCByZXN0aW5nIHN0YXRlIG9mIGEgcHJvbWlzZSwgZnVsZmlsbGVkIG9yIHJlamVjdGVkLlxuXG4gICAgICBBIHByb21pc2UgY2FuIGJlIGluIG9uZSBvZiB0aHJlZSBzdGF0ZXM6IHBlbmRpbmcsIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQuXG5cbiAgICAgIFByb21pc2VzIHRoYXQgYXJlIGZ1bGZpbGxlZCBoYXZlIGEgZnVsZmlsbG1lbnQgdmFsdWUgYW5kIGFyZSBpbiB0aGUgZnVsZmlsbGVkXG4gICAgICBzdGF0ZS4gIFByb21pc2VzIHRoYXQgYXJlIHJlamVjdGVkIGhhdmUgYSByZWplY3Rpb24gcmVhc29uIGFuZCBhcmUgaW4gdGhlXG4gICAgICByZWplY3RlZCBzdGF0ZS4gIEEgZnVsZmlsbG1lbnQgdmFsdWUgaXMgbmV2ZXIgYSB0aGVuYWJsZS5cblxuICAgICAgUHJvbWlzZXMgY2FuIGFsc28gYmUgc2FpZCB0byAqcmVzb2x2ZSogYSB2YWx1ZS4gIElmIHRoaXMgdmFsdWUgaXMgYWxzbyBhXG4gICAgICBwcm9taXNlLCB0aGVuIHRoZSBvcmlnaW5hbCBwcm9taXNlJ3Mgc2V0dGxlZCBzdGF0ZSB3aWxsIG1hdGNoIHRoZSB2YWx1ZSdzXG4gICAgICBzZXR0bGVkIHN0YXRlLiAgU28gYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCByZWplY3RzIHdpbGxcbiAgICAgIGl0c2VsZiByZWplY3QsIGFuZCBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IGZ1bGZpbGxzIHdpbGxcbiAgICAgIGl0c2VsZiBmdWxmaWxsLlxuXG5cbiAgICAgIEJhc2ljIFVzYWdlOlxuICAgICAgLS0tLS0tLS0tLS0tXG5cbiAgICAgIGBgYGpzXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAvLyBvbiBzdWNjZXNzXG4gICAgICAgIHJlc29sdmUodmFsdWUpO1xuXG4gICAgICAgIC8vIG9uIGZhaWx1cmVcbiAgICAgICAgcmVqZWN0KHJlYXNvbik7XG4gICAgICB9KTtcblxuICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgLy8gb24gcmVqZWN0aW9uXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBBZHZhbmNlZCBVc2FnZTpcbiAgICAgIC0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBQcm9taXNlcyBzaGluZSB3aGVuIGFic3RyYWN0aW5nIGF3YXkgYXN5bmNocm9ub3VzIGludGVyYWN0aW9ucyBzdWNoIGFzXG4gICAgICBgWE1MSHR0cFJlcXVlc3Rgcy5cblxuICAgICAgYGBganNcbiAgICAgIGZ1bmN0aW9uIGdldEpTT04odXJsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVyO1xuICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnanNvbic7XG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgeGhyLnNlbmQoKTtcblxuICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSB0aGlzLkRPTkUpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2dldEpTT046IGAnICsgdXJsICsgJ2AgZmFpbGVkIHdpdGggc3RhdHVzOiBbJyArIHRoaXMuc3RhdHVzICsgJ10nKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZ2V0SlNPTignL3Bvc3RzLmpzb24nKS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAvLyBvbiByZWplY3Rpb25cbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFVubGlrZSBjYWxsYmFja3MsIHByb21pc2VzIGFyZSBncmVhdCBjb21wb3NhYmxlIHByaW1pdGl2ZXMuXG5cbiAgICAgIGBgYGpzXG4gICAgICBQcm9taXNlLmFsbChbXG4gICAgICAgIGdldEpTT04oJy9wb3N0cycpLFxuICAgICAgICBnZXRKU09OKCcvY29tbWVudHMnKVxuICAgICAgXSkudGhlbihmdW5jdGlvbih2YWx1ZXMpe1xuICAgICAgICB2YWx1ZXNbMF0gLy8gPT4gcG9zdHNKU09OXG4gICAgICAgIHZhbHVlc1sxXSAvLyA9PiBjb21tZW50c0pTT05cblxuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQGNsYXNzIFByb21pc2VcbiAgICAgIEBwYXJhbSB7ZnVuY3Rpb259IHJlc29sdmVyXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgICBAY29uc3RydWN0b3JcbiAgICAqL1xuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlKHJlc29sdmVyKSB7XG4gICAgICB0aGlzLl9pZCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRjb3VudGVyKys7XG4gICAgICB0aGlzLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX3Jlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX3N1YnNjcmliZXJzID0gW107XG5cbiAgICAgIGlmIChsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wICE9PSByZXNvbHZlcikge1xuICAgICAgICBpZiAoIWxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNGdW5jdGlvbihyZXNvbHZlcikpIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkbmVlZHNSZXNvbHZlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlKSkge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRuZWVkc05ldygpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaW5pdGlhbGl6ZVByb21pc2UodGhpcywgcmVzb2x2ZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLmFsbCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkZGVmYXVsdDtcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5yYWNlID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmFjZSQkZGVmYXVsdDtcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5yZXNvbHZlID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdDtcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5yZWplY3QgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZWplY3QkJGRlZmF1bHQ7XG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UuX3NldFNjaGVkdWxlciA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzZXRTY2hlZHVsZXI7XG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UuX3NldEFzYXAgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2V0QXNhcDtcbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5fYXNhcCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwO1xuXG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UucHJvdG90eXBlID0ge1xuICAgICAgY29uc3RydWN0b3I6IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLFxuXG4gICAgLyoqXG4gICAgICBUaGUgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCxcbiAgICAgIHdoaWNoIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlXG4gICAgICByZWFzb24gd2h5IHRoZSBwcm9taXNlIGNhbm5vdCBiZSBmdWxmaWxsZWQuXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAgIC8vIHVzZXIgaXMgYXZhaWxhYmxlXG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyB1c2VyIGlzIHVuYXZhaWxhYmxlLCBhbmQgeW91IGFyZSBnaXZlbiB0aGUgcmVhc29uIHdoeVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQ2hhaW5pbmdcbiAgICAgIC0tLS0tLS0tXG5cbiAgICAgIFRoZSByZXR1cm4gdmFsdWUgb2YgYHRoZW5gIGlzIGl0c2VsZiBhIHByb21pc2UuICBUaGlzIHNlY29uZCwgJ2Rvd25zdHJlYW0nXG4gICAgICBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZmlyc3QgcHJvbWlzZSdzIGZ1bGZpbGxtZW50XG4gICAgICBvciByZWplY3Rpb24gaGFuZGxlciwgb3IgcmVqZWN0ZWQgaWYgdGhlIGhhbmRsZXIgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICByZXR1cm4gdXNlci5uYW1lO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICByZXR1cm4gJ2RlZmF1bHQgbmFtZSc7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh1c2VyTmFtZSkge1xuICAgICAgICAvLyBJZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHVzZXJOYW1lYCB3aWxsIGJlIHRoZSB1c2VyJ3MgbmFtZSwgb3RoZXJ3aXNlIGl0XG4gICAgICAgIC8vIHdpbGwgYmUgYCdkZWZhdWx0IG5hbWUnYFxuICAgICAgfSk7XG5cbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jyk7XG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAvLyBpZiBgZmluZFVzZXJgIGZ1bGZpbGxlZCwgYHJlYXNvbmAgd2lsbCBiZSAnRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknLlxuICAgICAgICAvLyBJZiBgZmluZFVzZXJgIHJlamVjdGVkLCBgcmVhc29uYCB3aWxsIGJlICdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jy5cbiAgICAgIH0pO1xuICAgICAgYGBgXG4gICAgICBJZiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIGRvZXMgbm90IHNwZWNpZnkgYSByZWplY3Rpb24gaGFuZGxlciwgcmVqZWN0aW9uIHJlYXNvbnMgd2lsbCBiZSBwcm9wYWdhdGVkIGZ1cnRoZXIgZG93bnN0cmVhbS5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICB0aHJvdyBuZXcgUGVkYWdvZ2ljYWxFeGNlcHRpb24oJ1Vwc3RyZWFtIGVycm9yJyk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIC8vIFRoZSBgUGVkZ2Fnb2NpYWxFeGNlcHRpb25gIGlzIHByb3BhZ2F0ZWQgYWxsIHRoZSB3YXkgZG93biB0byBoZXJlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBBc3NpbWlsYXRpb25cbiAgICAgIC0tLS0tLS0tLS0tLVxuXG4gICAgICBTb21ldGltZXMgdGhlIHZhbHVlIHlvdSB3YW50IHRvIHByb3BhZ2F0ZSB0byBhIGRvd25zdHJlYW0gcHJvbWlzZSBjYW4gb25seSBiZVxuICAgICAgcmV0cmlldmVkIGFzeW5jaHJvbm91c2x5LiBUaGlzIGNhbiBiZSBhY2hpZXZlZCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIHRoZVxuICAgICAgZnVsZmlsbG1lbnQgb3IgcmVqZWN0aW9uIGhhbmRsZXIuIFRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCB0aGVuIGJlIHBlbmRpbmdcbiAgICAgIHVudGlsIHRoZSByZXR1cm5lZCBwcm9taXNlIGlzIHNldHRsZWQuIFRoaXMgaXMgY2FsbGVkICphc3NpbWlsYXRpb24qLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAgIC8vIFRoZSB1c2VyJ3MgY29tbWVudHMgYXJlIG5vdyBhdmFpbGFibGVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIElmIHRoZSBhc3NpbWxpYXRlZCBwcm9taXNlIHJlamVjdHMsIHRoZW4gdGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIGFsc28gcmVqZWN0LlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGNvbW1lbnRzKSB7XG4gICAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgZnVsZmlsbHMsIHdlJ2xsIGhhdmUgdGhlIHZhbHVlIGhlcmVcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCByZWplY3RzLCB3ZSdsbCBoYXZlIHRoZSByZWFzb24gaGVyZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgU2ltcGxlIEV4YW1wbGVcbiAgICAgIC0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgdmFyIHJlc3VsdDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gZmluZFJlc3VsdCgpO1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9XG4gICAgICBgYGBcblxuICAgICAgRXJyYmFjayBFeGFtcGxlXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kUmVzdWx0KGZ1bmN0aW9uKHJlc3VsdCwgZXJyKXtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBzdWNjZXNzXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFByb21pc2UgRXhhbXBsZTtcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgZmluZFJlc3VsdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQWR2YW5jZWQgRXhhbXBsZVxuICAgICAgLS0tLS0tLS0tLS0tLS1cblxuICAgICAgU3luY2hyb25vdXMgRXhhbXBsZVxuXG4gICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICB2YXIgYXV0aG9yLCBib29rcztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgYXV0aG9yID0gZmluZEF1dGhvcigpO1xuICAgICAgICBib29rcyAgPSBmaW5kQm9va3NCeUF1dGhvcihhdXRob3IpO1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9XG4gICAgICBgYGBcblxuICAgICAgRXJyYmFjayBFeGFtcGxlXG5cbiAgICAgIGBgYGpzXG5cbiAgICAgIGZ1bmN0aW9uIGZvdW5kQm9va3MoYm9va3MpIHtcblxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBmYWlsdXJlKHJlYXNvbikge1xuXG4gICAgICB9XG5cbiAgICAgIGZpbmRBdXRob3IoZnVuY3Rpb24oYXV0aG9yLCBlcnIpe1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgIC8vIGZhaWx1cmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmluZEJvb29rc0J5QXV0aG9yKGF1dGhvciwgZnVuY3Rpb24oYm9va3MsIGVycikge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBmb3VuZEJvb2tzKGJvb2tzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgICAgICAgICAgICAgZmFpbHVyZShyZWFzb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBzdWNjZXNzXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFByb21pc2UgRXhhbXBsZTtcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgZmluZEF1dGhvcigpLlxuICAgICAgICB0aGVuKGZpbmRCb29rc0J5QXV0aG9yKS5cbiAgICAgICAgdGhlbihmdW5jdGlvbihib29rcyl7XG4gICAgICAgICAgLy8gZm91bmQgYm9va3NcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBAbWV0aG9kIHRoZW5cbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsZmlsbGVkXG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGVkXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAgICovXG4gICAgICB0aGVuOiBmdW5jdGlvbihvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcztcbiAgICAgICAgdmFyIHN0YXRlID0gcGFyZW50Ll9zdGF0ZTtcblxuICAgICAgICBpZiAoc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRCAmJiAhb25GdWxmaWxsbWVudCB8fCBzdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQgJiYgIW9uUmVqZWN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGQgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHBhcmVudC5fcmVzdWx0O1xuXG4gICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50c1tzdGF0ZSAtIDFdO1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzdGF0ZSwgY2hpbGQsIGNhbGxiYWNrLCByZXN1bHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICB9LFxuXG4gICAgLyoqXG4gICAgICBgY2F0Y2hgIGlzIHNpbXBseSBzdWdhciBmb3IgYHRoZW4odW5kZWZpbmVkLCBvblJlamVjdGlvbilgIHdoaWNoIG1ha2VzIGl0IHRoZSBzYW1lXG4gICAgICBhcyB0aGUgY2F0Y2ggYmxvY2sgb2YgYSB0cnkvY2F0Y2ggc3RhdGVtZW50LlxuXG4gICAgICBgYGBqc1xuICAgICAgZnVuY3Rpb24gZmluZEF1dGhvcigpe1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkbid0IGZpbmQgdGhhdCBhdXRob3InKTtcbiAgICAgIH1cblxuICAgICAgLy8gc3luY2hyb25vdXNcbiAgICAgIHRyeSB7XG4gICAgICAgIGZpbmRBdXRob3IoKTtcbiAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICB9XG5cbiAgICAgIC8vIGFzeW5jIHdpdGggcHJvbWlzZXNcbiAgICAgIGZpbmRBdXRob3IoKS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQG1ldGhvZCBjYXRjaFxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3Rpb25cbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICAgKi9cbiAgICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3Rpb24pO1xuICAgICAgfVxuICAgIH07XG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRwb2x5ZmlsbCgpIHtcbiAgICAgIHZhciBsb2NhbDtcblxuICAgICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgbG9jYWwgPSBnbG9iYWw7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGxvY2FsID0gc2VsZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgbG9jYWwgPSBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwb2x5ZmlsbCBmYWlsZWQgYmVjYXVzZSBnbG9iYWwgb2JqZWN0IGlzIHVuYXZhaWxhYmxlIGluIHRoaXMgZW52aXJvbm1lbnQnKTtcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBQID0gbG9jYWwuUHJvbWlzZTtcblxuICAgICAgaWYgKFAgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFAucmVzb2x2ZSgpKSA9PT0gJ1tvYmplY3QgUHJvbWlzZV0nICYmICFQLmNhc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsb2NhbC5Qcm9taXNlID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJGRlZmF1bHQ7XG4gICAgfVxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcG9seWZpbGwkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcG9seWZpbGwkJHBvbHlmaWxsO1xuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSR1bWQkJEVTNlByb21pc2UgPSB7XG4gICAgICAnUHJvbWlzZSc6IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0LFxuICAgICAgJ3BvbHlmaWxsJzogbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRkZWZhdWx0XG4gICAgfTtcblxuICAgIC8qIGdsb2JhbCBkZWZpbmU6dHJ1ZSBtb2R1bGU6dHJ1ZSB3aW5kb3c6IHRydWUgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmVbJ2FtZCddKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBsaWIkZXM2JHByb21pc2UkdW1kJCRFUzZQcm9taXNlOyB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZVsnZXhwb3J0cyddKSB7XG4gICAgICBtb2R1bGVbJ2V4cG9ydHMnXSA9IGxpYiRlczYkcHJvbWlzZSR1bWQkJEVTNlByb21pc2U7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXNbJ0VTNlByb21pc2UnXSA9IGxpYiRlczYkcHJvbWlzZSR1bWQkJEVTNlByb21pc2U7XG4gICAgfVxuXG4gICAgbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRkZWZhdWx0KCk7XG59KS5jYWxsKHRoaXMpO1xuXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiSXJYVXN1XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJ2YXIgaHR0cCA9IHJlcXVpcmUoXCJodHRwcGxlYXNlXCIpO1xudmFyIGFwaWpzID0gcmVxdWlyZShcInRudC5hcGlcIik7XG52YXIgcHJvbWlzZXMgPSByZXF1aXJlKCdodHRwcGxlYXNlLXByb21pc2VzJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJ2VzNi1wcm9taXNlJykuUHJvbWlzZTtcbnZhciBqc29uID0gcmVxdWlyZShcImh0dHBwbGVhc2UvcGx1Z2lucy9qc29uXCIpO1xuaHR0cCA9IGh0dHAudXNlKGpzb24pLnVzZShwcm9taXNlcyhQcm9taXNlKSk7XG5cbi8vdmFyIHVybCA9IHJlcXVpcmUoXCIuL3VybC5qc1wiKTtcblxudG50X3Jlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgICAgcHJlZml4OiBcIlwiLFxuICAgICAgICBwcm90b2NvbDogXCJodHRwXCIsXG4gICAgICAgIGRvbWFpbjogXCJcIixcbiAgICAgICAgcG9ydDogXCJcIlxuICAgIH07XG4gICAgdmFyIHJlc3QgPSB7fTtcbiAgICByZXN0LnVybCA9IHJlcXVpcmUoXCIuL3VybC5qc1wiKTtcblxuICAgIHZhciBhcGkgPSBhcGlqcyAocmVzdClcbiAgICAgICAgLmdldHNldChjb25maWcpO1xuXG4gICAgYXBpLm1ldGhvZCAoJ2NhbGwnLCBmdW5jdGlvbiAodXJsLCBkYXRhKSB7XG4gICAgICAgIHZhciBteXVybDtcbiAgICAgICAgaWYgKHR5cGVvZih1cmwpID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBteXVybCA9IHVybDtcbiAgICAgICAgfSBlbHNlIHsgLy8gSXQgaXMgYSB0bnQucmVzdC51cmxcbiAgICAgICAgICAgIHVybFxuICAgICAgICAgICAgICAgIC5fcHJlZml4KGNvbmZpZy5wcmVmaXgpXG4gICAgICAgICAgICAgICAgLl9wcm90b2NvbChjb25maWcucHJvdG9jb2wpXG4gICAgICAgICAgICAgICAgLl9kb21haW4oY29uZmlnLmRvbWFpbilcbiAgICAgICAgICAgICAgICAuX3BvcnQoY29uZmlnLnBvcnQpO1xuXG4gICAgICAgICAgICBteXVybCA9IHVybCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhKSB7IC8vIFBPU1RcbiAgICAgICAgICAgIHJldHVybiBodHRwLnBvc3QgKHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiBteXVybCxcbiAgICAgICAgICAgICAgICBcImJvZHlcIjogZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGh0dHAuZ2V0ICh7XG4gICAgICAgICAgICBcInVybFwiOiBteXVybFxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gdG50X3Jlc3Q7XG4iLCJ2YXIgYXBpanMgPSByZXF1aXJlKFwidG50LmFwaVwiKTtcblxudmFyIHVybE1vZHVsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGFyYW1QYXR0ZXJuID0gLzpcXHcrL2c7XG5cbiAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICBfcHJlZml4OiBcIlwiLFxuICAgICAgICBfcHJvdG9jb2w6IFwiaHR0cFwiLFxuICAgICAgICBfZG9tYWluOiBcIlwiLFxuICAgICAgICBfcG9ydDogXCJcIixcbiAgICAgICAgZW5kcG9pbnQ6IFwiXCIsXG4gICAgICAgIHBhcmFtZXRlcnM6IHt9LFxuICAgICAgICBmcmFnbWVudDogXCJcIixcbiAgICAgICAgcmVzdDogdW5kZWZpbmVkXG4gICAgfTtcblxuICAgIC8vIFVSTCBNZXRob2RcbiAgICB2YXIgdXJsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZ2V0VXJsKCk7XG4gICAgfTtcblxuICAgIHZhciBhcGkgPSBhcGlqcyAodXJsKVxuICAgICAgICAuZ2V0c2V0KGNvbmZpZyk7XG5cbiAgICAvLyBDaGVja3MgaWYgdGhlIHZhbHVlIGlzIGEgc3RyaW5nIG9yIGFuIGFycmF5XG4gICAgLy8gSWYgYXJyYXksIHJlY3Vyc2Ugb3ZlciBhbGwgdGhlIGF2YWlsYWJsZSB2YWx1ZXNcbiAgICBmdW5jdGlvbiBxdWVyeTEgKGtleSkge1xuICAgICAgICB2YXIgdmFsID0gY29uZmlnLnBhcmFtZXRlcnNba2V5XTtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSXQgaXMgYW4gYXJyYXlcbiAgICAgICAgdmFyIHZhbDEgPSB2YWwuc2hpZnQoKTtcbiAgICAgICAgIGlmICh2YWwubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsMSArIFwiJlwiICsga2V5ICsgXCI9XCIgKyBxdWVyeTEoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBxdWVyeVN0cmluZygpIHtcbiAgICAgICAgLy8gV2UgYWRkICdjb250ZW50LXR5cGU9YXBwbGljYXRpb24vanNvbidcbiAgICAgICAgaWYgKGNvbmZpZy5wYXJhbWV0ZXJzW1wiY29udGVudC10eXBlXCJdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbmZpZy5wYXJhbWV0ZXJzW1wiY29udGVudC10eXBlXCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHFzID0gT2JqZWN0LmtleXMoY29uZmlnLnBhcmFtZXRlcnMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4ga2V5ICsgXCI9XCIgKyBxdWVyeTEoa2V5KTtcbiAgICAgICAgfSkuam9pbihcIiZcIik7XG4gICAgICAgIHJldHVybiBxcyA/IChcIj9cIiArIHFzKSA6IHFzO1xuICAgIH1cblxuICAgIC8vXG4gICAgZnVuY3Rpb24gZ2V0VXJsKCkge1xuICAgICAgICB2YXIgZW5kcG9pbnQgPSBjb25maWcuZW5kcG9pbnQ7XG5cbiAgICAgICAgdmFyIHN1YnN0RW5kcG9pbnQgPSBlbmRwb2ludC5yZXBsYWNlKHBhcmFtUGF0dGVybiwgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgICAgICBtYXRjaCA9IG1hdGNoLnN1YnN0cmluZygxLCBtYXRjaC5sZW5ndGgpO1xuICAgICAgICAgICAgdmFyIHBhcmFtID0gY29uZmlnLnBhcmFtZXRlcnNbbWF0Y2hdIHx8IFwiXCI7XG4gICAgICAgICAgICBkZWxldGUgY29uZmlnLnBhcmFtZXRlcnNbbWF0Y2hdO1xuICAgICAgICAgICAgcmV0dXJuIHBhcmFtO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdXJsID0gY29uZmlnLl9wcmVmaXggKyBjb25maWcuX3Byb3RvY29sICsgXCI6Ly9cIiArIGNvbmZpZy5fZG9tYWluICsgKGNvbmZpZy5fcG9ydCA/IFwiOlwiICsgcG9ydCA6IFwiXCIpICsgXCIvXCIgKyBzdWJzdEVuZHBvaW50ICsgcXVlcnlTdHJpbmcoKSArIChjb25maWcuZnJhZ21lbnQgPyBcIiNcIiArIGNvbmZpZy5mcmFnbWVudCA6IFwiXCIpO1xuICAgICAgICByZXR1cm4gdXJsO1xuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSB1cmxNb2R1bGU7XG4iLCJ2YXIgYm9hcmQgPSByZXF1aXJlKFwidG50LmJvYXJkXCIpO1xudmFyIGFwaWpzID0gcmVxdWlyZShcInRudC5hcGlcIik7XG5cbnZhciBkYXRhX2dlbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVSZXN0ID0gYm9hcmQudHJhY2suZGF0YS5nZW5vbWUuZW5zZW1ibDtcblxuICAgIHZhciBkYXRhID0gYm9hcmQudHJhY2suZGF0YS5hc3luYygpXG4gICAgICAgIC5yZXRyaWV2ZXIgKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHZhciB0cmFjayA9IHRoaXM7XG4gICAgICAgICAgICAvLyB2YXIgZVJlc3QgPSBkYXRhLmVuc2VtYmwoKTtcbiAgICAgICAgICAgIC8vIHZhciBzY2FsZSA9IHRyYWNrLmRpc3BsYXkoKS5zY2FsZSgpO1xuICAgICAgICAgICAgdmFyIHVybCA9IGVSZXN0LnVybCgpXG4gICAgICAgICAgICAgICAgLmVuZHBvaW50KFwib3ZlcmxhcC9yZWdpb24vOnNwZWNpZXMvOnJlZ2lvblwiKVxuICAgICAgICAgICAgICAgIC5wYXJhbWV0ZXJzKHtcbiAgICAgICAgICAgICAgICAgICAgc3BlY2llcyA6IG9iai5zcGVjaWVzLFxuICAgICAgICAgICAgICAgICAgICByZWdpb24gIDogKG9iai5jaHIgKyBcIjpcIiArIG9iai5mcm9tICsgXCItXCIgKyBvYmoudG8pLFxuICAgICAgICAgICAgICAgICAgICBmZWF0dXJlOiBvYmouZmVhdHVyZXMgfHwgW1wiZ2VuZVwiXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gdmFyIHVybCA9IGVSZXN0LnVybC5yZWdpb24ob2JqKTtcbiAgICAgICAgICAgIHJldHVybiBlUmVzdC5jYWxsKHVybClcbiAgICAgICAgICAgICAgLnRoZW4gKGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGdlbmVzID0gcmVzcC5ib2R5O1xuICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgZGlzcGxheV9sYWJlbCBmaWVsZFxuICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxnZW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ2VuZSA9IGdlbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2VuZS5zdHJhbmQgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lLmRpc3BsYXlfbGFiZWwgPSBcIjxcIiArIGdlbmUuZXh0ZXJuYWxfbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmUuZGlzcGxheV9sYWJlbCA9IGdlbmUuZXh0ZXJuYWxfbmFtZSArIFwiPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZW5lcztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICBhcGlqcyhkYXRhKVxuICAgICAgICAuZ2V0c2V0KCdlbnNlbWJsJyk7XG5cbiAgICByZXR1cm4gZGF0YTtcbn07XG5cbnZhciBkYXRhX3RyYW5zY3JpcHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVSZXN0ID0gYm9hcmQudHJhY2suZGF0YS5nZW5vbWUuZW5zZW1ibDtcblxuICAgIHZhciBkYXRhID0gYm9hcmQudHJhY2suZGF0YS5hc3luYygpXG4gICAgICAgIC5yZXRyaWV2ZXIgKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBlUmVzdC51cmwoKVxuICAgICAgICAgICAgICAgIC5lbmRwb2ludChcIm92ZXJsYXAvcmVnaW9uLzpzcGVjaWVzLzpyZWdpb25cIilcbiAgICAgICAgICAgICAgICAucGFyYW1ldGVycyh7XG4gICAgICAgICAgICAgICAgICAgIHNwZWNpZXMgOiBvYmouc3BlY2llcyxcbiAgICAgICAgICAgICAgICAgICAgcmVnaW9uIDogKG9iai5jaHIgKyBcIjpcIiArIG9iai5mcm9tICsgXCItXCIgKyBvYmoudG8pLFxuICAgICAgICAgICAgICAgICAgICBmZWF0dXJlIDogW1wiZ2VuZVwiLCBcInRyYW5zY3JpcHRcIiwgXCJleG9uXCIsIFwiY2RzXCJdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZVJlc3QuY2FsbCh1cmwpXG4gICAgICAgICAgICAgIC50aGVuIChmdW5jdGlvbiAocmVzcCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGVsZW1zID0gcmVzcC5ib2R5O1xuICAgICAgICAgICAgICAgICAgdmFyIGdlbmVzID0gZGF0YS5yZWdpb24yZ2VuZXMoZWxlbXMpO1xuICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zY3JpcHRzID0gW107XG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8Z2VuZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgZyA9IGdlbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgIHZhciB0cyA9IGRhdGEuZ2VuZTJUcmFuc2NyaXB0cyhnKTtcbiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2NyaXB0cyA9IHRyYW5zY3JpcHRzLmNvbmNhdCh0cyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNjcmlwdHM7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIGFwaWpzKGRhdGEpXG4gICAgICAgIC5tZXRob2QoXCJnZW5lMlRyYW5zY3JpcHRzXCIsIGZ1bmN0aW9uIChnKSB7XG4gICAgICAgICAgICB2YXIgdHMgPSBnLlRyYW5zY3JpcHQ7XG4gICAgICAgICAgICB2YXIgdHJhbnNjcmlwdHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajx0cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciB0ID0gdHNbal07XG4gICAgICAgICAgICAgICAgdC5leG9ucyA9IHRyYW5zZm9ybUV4b25zKHQpO1xuICAgICAgICAgICAgICAgIHQuaW50cm9ucyA9IGV4b25zVG9FeG9uc0FuZEludHJvbnModCk7XG4gICAgICAgICAgICAgICAgLy92YXIgb2JqID0gZXhvbnNUb0V4b25zQW5kSW50cm9ucyAodHJhbnNmb3JtRXhvbnModCksIHQpO1xuICAgICAgICAgICAgICAgIC8vIHQubmFtZSA9IFt7XG4gICAgICAgICAgICAgICAgLy8gICAgIHBvczogdC5zdGFydCxcbiAgICAgICAgICAgICAgICAvLyAgICAgbmFtZSA6IHQuZGlzcGxheV9uYW1lLFxuICAgICAgICAgICAgICAgIC8vICAgICBzdHJhbmQgOiB0LnN0cmFuZCxcbiAgICAgICAgICAgICAgICAvLyAgICAgdHJhbnNjcmlwdCA6IHRcbiAgICAgICAgICAgICAgICAvLyB9XTtcbiAgICAgICAgICAgICAgICB0LmRpc3BsYXlfbGFiZWwgPSB0LnN0cmFuZCA9PT0gMSA/ICh0LmRpc3BsYXlfbmFtZSArIFwiPlwiKSA6IChcIjxcIiArIHQuZGlzcGxheV9uYW1lKTtcbiAgICAgICAgICAgICAgICB0LmtleSA9ICh0LmlkICsgXCJfXCIgKyB0LmV4b25zLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgLy9vYmouaWQgPSB0LmlkO1xuICAgICAgICAgICAgICAgIHQuZ2VuZSA9IGc7XG4gICAgICAgICAgICAgICAgLy8gb2JqLnRyYW5zY3JpcHQgPSB0O1xuICAgICAgICAgICAgICAgIC8vIG9iai5leHRlcm5hbF9uYW1lID0gdC5kaXNwbGF5X25hbWU7XG4gICAgICAgICAgICAgICAgLy9vYmouZGlzcGxheV9sYWJlbCA9IHQuZGlzcGxheV9sYWJlbDtcbiAgICAgICAgICAgICAgICAvL29iai5zdGFydCA9IHQuc3RhcnQ7XG4gICAgICAgICAgICAgICAgLy9vYmouZW5kID0gdC5lbmQ7XG4gICAgICAgICAgICAgICAgdHJhbnNjcmlwdHMucHVzaCh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cmFuc2NyaXB0cztcbiAgICAgICAgfSlcbiAgICAgICAgLm1ldGhvZChcInJlZ2lvbjJnZW5lc1wiLCBmdW5jdGlvbiAoZWxlbXMpIHtcbiAgICAgICAgICAgIHZhciBnZW5lVHJhbnNjcmlwdHMgPSB7fTtcbiAgICAgICAgICAgIHZhciBnZW5lcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHRyYW5zY3JpcHRzID0ge307XG5cbiAgICAgICAgICAgIC8vIHRyYW5zY3JpcHRzXG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8ZWxlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGVsZW1zW2ldO1xuICAgICAgICAgICAgICAgIGlmIChlLmZlYXR1cmVfdHlwZSA9PSBcInRyYW5zY3JpcHRcIikge1xuICAgICAgICAgICAgICAgICAgICBlLmRpc3BsYXlfbmFtZSA9IGUuZXh0ZXJuYWxfbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNjcmlwdHNbZS5pZF0gPSBlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ2VuZVRyYW5zY3JpcHRzW2UuUGFyZW50XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZW5lVHJhbnNjcmlwdHNbZS5QYXJlbnRdID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZ2VuZVRyYW5zY3JpcHRzW2UuUGFyZW50XS5wdXNoKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZXhvbnNcbiAgICAgICAgICAgIGZvciAodmFyIGo9MDsgajxlbGVtcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBlID0gZWxlbXNbal07XG4gICAgICAgICAgICAgICAgaWYgKGUuZmVhdHVyZV90eXBlID09PSBcImV4b25cIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdCA9IHRyYW5zY3JpcHRzW2UuUGFyZW50XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQuRXhvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LkV4b24gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0LkV4b24ucHVzaChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNkc1xuICAgICAgICAgICAgZm9yICh2YXIgaz0wOyBrPGVsZW1zLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGUgPSBlbGVtc1trXTtcbiAgICAgICAgICAgICAgICBpZiAoZS5mZWF0dXJlX3R5cGUgPT09IFwiY2RzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSB0cmFuc2NyaXB0c1tlLlBhcmVudF07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0LlRyYW5zbGF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQuVHJhbnNsYXRpb24gPSBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnN0YXJ0IDwgdC5UcmFuc2xhdGlvbi5zdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdC5UcmFuc2xhdGlvbi5zdGFydCA9IGUuc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuZW5kID4gdC5UcmFuc2xhdGlvbi5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQuVHJhbnNsYXRpb24uZW5kID0gZS5lbmQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGdlbmVzXG4gICAgICAgICAgICBmb3IgKHZhciBoPTA7IGg8ZWxlbXMubGVuZ3RoOyBoKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGVsZW1zW2hdO1xuICAgICAgICAgICAgICAgIGlmIChlLmZlYXR1cmVfdHlwZSA9PT0gXCJnZW5lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5kaXNwbGF5X25hbWUgPSBlLmV4dGVybmFsX25hbWU7XG4gICAgICAgICAgICAgICAgICAgIGUuVHJhbnNjcmlwdCA9IGdlbmVUcmFuc2NyaXB0c1tlLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXMucHVzaChlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBnZW5lcztcbiAgICAgICAgfSk7XG5cblxuICAgIGZ1bmN0aW9uIGV4b25zVG9FeG9uc0FuZEludHJvbnMgKHQpIHtcbiAgICAgICAgdmFyIGV4b25zID0gdC5leG9ucztcbiAgICAgICAgLy92YXIgb2JqID0ge307XG4gICAgICAgIC8vb2JqLmV4b25zID0gZXhvbnM7XG4gICAgICAgIHZhciBpbnRyb25zID0gW107XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxleG9ucy5sZW5ndGgtMTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaW50cm9uID0ge1xuICAgICAgICAgICAgICAgIHN0YXJ0IDogZXhvbnNbaV0udHJhbnNjcmlwdC5zdHJhbmQgPT09IDEgPyBleG9uc1tpXS5lbmQgOiBleG9uc1tpXS5zdGFydCxcbiAgICAgICAgICAgICAgICBlbmQgICA6IGV4b25zW2ldLnRyYW5zY3JpcHQuc3RyYW5kID09PSAxID8gZXhvbnNbaSsxXS5zdGFydCA6IGV4b25zW2krMV0uZW5kLFxuICAgICAgICAgICAgICAgIHRyYW5zY3JpcHQgOiB0XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaW50cm9ucy5wdXNoKGludHJvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGludHJvbnM7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1FeG9ucyAodHJhbnNjcmlwdCkge1xuICAgICAgICB2YXIgdHJhbnNsYXRpb25TdGFydDtcbiAgICAgICAgdmFyIHRyYW5zbGF0aW9uRW5kO1xuICAgICAgICBpZiAodHJhbnNjcmlwdC5UcmFuc2xhdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0cmFuc2xhdGlvblN0YXJ0ID0gdHJhbnNjcmlwdC5UcmFuc2xhdGlvbi5zdGFydDtcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uRW5kID0gdHJhbnNjcmlwdC5UcmFuc2xhdGlvbi5lbmQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGV4b25zID0gdHJhbnNjcmlwdC5FeG9uO1xuXG4gICAgICAgIHZhciBuZXdFeG9ucyA9IFtdO1xuICAgICAgICBpZiAoZXhvbnMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxleG9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0cmFuc2NyaXB0LlRyYW5zbGF0aW9uID09PSB1bmRlZmluZWQpIHsgLy8gTk8gY29kaW5nIHRyYW5zY3JpcHRcbiAgICAgICAgICAgICAgICAgICAgbmV3RXhvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCAgIDogZXhvbnNbaV0uc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQgICAgIDogZXhvbnNbaV0uZW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNjcmlwdCA6IHRyYW5zY3JpcHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RpbmcgIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQgIDogZXhvbnNbaV0uc3RhcnQgLSB0cmFuc2NyaXB0LnN0YXJ0XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleG9uc1tpXS5zdGFydCA8IHRyYW5zbGF0aW9uU3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIDUnXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhvbnNbaV0uZW5kIDwgdHJhbnNsYXRpb25TdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbXBsZXRlbHkgbm9uIGNvZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0V4b25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCAgOiBleG9uc1tpXS5zdGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kICAgIDogZXhvbnNbaV0uZW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2NyaXB0IDogdHJhbnNjcmlwdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kaW5nIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldCAgOiBleG9uc1tpXS5zdGFydCAtIHRyYW5zY3JpcHQuc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGFzIDUnVVRSXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5jRXhvbjUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ICA6IGV4b25zW2ldLnN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQgICAgOiB0cmFuc2xhdGlvblN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2NyaXB0IDogdHJhbnNjcmlwdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kaW5nIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldCAgOiBleG9uc1tpXS5zdGFydCAtIHRyYW5zY3JpcHQuc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2RpbmdFeG9uNSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgIDogdHJhbnNsYXRpb25TdGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kICAgIDogZXhvbnNbaV0uZW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2NyaXB0IDogdHJhbnNjcmlwdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kaW5nIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vZmZzZXQgIDogZXhvbnNbaV0uc3RhcnQgLSB0cmFuc2NyaXB0LnN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogdHJhbnNsYXRpb25TdGFydCAtIHRyYW5zY3JpcHQuc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleG9uc1tpXS5zdHJhbmQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXhvbnMucHVzaChuY0V4b241KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXhvbnMucHVzaChjb2RpbmdFeG9uNSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXhvbnMucHVzaChjb2RpbmdFeG9uNSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0V4b25zLnB1c2gobmNFeG9uNSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV4b25zW2ldLmVuZCA+IHRyYW5zbGF0aW9uRW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4b25zW2ldLnN0YXJ0ID4gdHJhbnNsYXRpb25FbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDb21wbGV0ZWx5IG5vbiBjb2RpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdFeG9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgICA6IGV4b25zW2ldLnN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQgICAgIDogZXhvbnNbaV0uZW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2NyaXB0IDogdHJhbnNjcmlwdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kaW5nICA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQgIDogZXhvbnNbaV0uc3RhcnQgLSB0cmFuc2NyaXB0LnN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhhcyAzJ1VUUlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2RpbmdFeG9uMyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgIDogZXhvbnNbaV0uc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZCAgICA6IHRyYW5zbGF0aW9uRW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2NyaXB0IDogdHJhbnNjcmlwdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kaW5nIDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ICA6IGV4b25zW2ldLnN0YXJ0IC0gdHJhbnNjcmlwdC5zdGFydFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5jRXhvbjMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ICA6IHRyYW5zbGF0aW9uRW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQgICAgOiBleG9uc1tpXS5lbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zY3JpcHQgOiB0cmFuc2NyaXB0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RpbmcgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vZmZzZXQgIDogZXhvbnNbaV0uc3RhcnQgLSB0cmFuc2NyaXB0LnN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldCA6IHRyYW5zbGF0aW9uRW5kIC0gdHJhbnNjcmlwdC5zdGFydFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4b25zW2ldLnN0cmFuZCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdFeG9ucy5wdXNoKGNvZGluZ0V4b24zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXhvbnMucHVzaChuY0V4b24zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdFeG9ucy5wdXNoKG5jRXhvbjMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdFeG9ucy5wdXNoKGNvZGluZ0V4b24zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb2RpbmcgZXhvblxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXhvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgIDogZXhvbnNbaV0uc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kICAgIDogZXhvbnNbaV0uZW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zY3JpcHQgOiB0cmFuc2NyaXB0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGluZyA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ICA6IGV4b25zW2ldLnN0YXJ0IC0gdHJhbnNjcmlwdC5zdGFydFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0V4b25zO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufTtcblxudmFyIGRhdGFfc2VxdWVuY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVSZXN0ID0gYm9hcmQudHJhY2suZGF0YS5nZW5vbWUuZW5zZW1ibDtcblxuICAgIHZhciBkYXRhID0gYm9hcmQudHJhY2suZGF0YS5hc3luYygpXG4gICAgICAgIC5yZXRyaWV2ZXIgKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIGlmICgob2JqLnRvIC0gb2JqLmZyb20pIDwgZGF0YS5saW1pdCgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHVybCA9IGVSZXN0LnVybCgpXG4gICAgICAgICAgICAgICAgICAgIC5lbmRwb2ludChcIi9zZXF1ZW5jZS9yZWdpb24vOnNwZWNpZXMvOnJlZ2lvblwiKVxuICAgICAgICAgICAgICAgICAgICAucGFyYW1ldGVycyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInNwZWNpZXNcIjogb2JqLnNwZWNpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlZ2lvblwiOiAob2JqLmNociArIFwiOlwiICsgb2JqLmZyb20gKyBcIi4uXCIgKyBvYmoudG8pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIHZhciB1cmwgPSBlUmVzdC51cmwuc2VxdWVuY2Uob2JqKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZVJlc3QuY2FsbCh1cmwpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuIChmdW5jdGlvbiAocmVzcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlcSA9IHJlc3AuYm9keTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZHMgPSBzZXEuaWQuc3BsaXQoXCI6XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZyb20gPSBmaWVsZHNbM107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnRzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8c2VxLnNlcS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG50cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zOiArZnJvbSArIGksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcXVlbmNlOiBzZXEuc2VxW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnRzO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIFJlZ2lvbiB0b28gd2lkZSBmb3Igc2VxdWVuY2VcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UgKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShbXSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgYXBpanMoZGF0YSlcbiAgICAgICAgLmdldHNldChcImxpbWl0XCIsIDE1MCk7XG5cbiAgICByZXR1cm4gZGF0YTtcbn07XG5cbi8vIGV4cG9ydFxudmFyIGdlbm9tZV9kYXRhID0ge1xuICAgIGdlbmUgOiBkYXRhX2dlbmUsXG4gICAgc2VxdWVuY2UgOiBkYXRhX3NlcXVlbmNlLFxuICAgIHRyYW5zY3JpcHQgOiBkYXRhX3RyYW5zY3JpcHRcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGdlbm9tZV9kYXRhO1xuIiwidmFyIGFwaWpzID0gcmVxdWlyZSAoXCJ0bnQuYXBpXCIpO1xudmFyIGxheW91dCA9IHJlcXVpcmUoXCIuL2xheW91dC5qc1wiKTtcbnZhciBib2FyZCA9IHJlcXVpcmUoXCJ0bnQuYm9hcmRcIik7XG5cbnZhciB0bnRfZmVhdHVyZV90cmFuc2NyaXB0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBmZWF0dXJlID0gYm9hcmQudHJhY2suZmVhdHVyZSgpXG4gICAgICAgIC5sYXlvdXQgKGJvYXJkLnRyYWNrLmxheW91dC5nZW5vbWUoKSlcbiAgICAgICAgLmluZGV4IChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgcmV0dXJuIGQua2V5O1xuICAgICAgICB9KTtcblxuICAgIGZlYXR1cmUuY3JlYXRlIChmdW5jdGlvbiAobmV3X2VsZW1zKSB7XG4gICAgICAgIHZhciB0cmFjayA9IHRoaXM7XG4gICAgICAgIHZhciB4U2NhbGUgPSBmZWF0dXJlLnNjYWxlKCk7XG4gICAgICAgIHZhciBncyA9IG5ld19lbGVtc1xuICAgICAgICAgICAgLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeFNjYWxlKGQuc3RhcnQpICsgXCIsXCIgKyAoZmVhdHVyZS5sYXlvdXQoKS5nZW5lX3Nsb3QoKS5zbG90X2hlaWdodCAqIGQuc2xvdCkgKyBcIilcIjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGdzXG4gICAgICAgICAgICAuYXBwZW5kKFwibGluZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4MVwiLCAwKVxuICAgICAgICAgICAgLmF0dHIoXCJ5MVwiLCB+fihmZWF0dXJlLmxheW91dCgpLmdlbmVfc2xvdCgpLmdlbmVfaGVpZ2h0LzIpKVxuICAgICAgICAgICAgLmF0dHIoXCJ4MlwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoeFNjYWxlKGQuZW5kKSAtIHhTY2FsZShkLnN0YXJ0KSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoXCJ5MlwiLCB+fihmZWF0dXJlLmxheW91dCgpLmdlbmVfc2xvdCgpLmdlbmVfaGVpZ2h0LzIpKVxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwibm9uZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgdHJhY2suY29sb3IoKSlcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDIpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmVhdHVyZS5jb2xvcigpKGQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLy5hdHRyKFwic3Ryb2tlXCIsIGZlYXR1cmUuY29sb3IoKSk7XG5cbiAgICAgICAgLy8gZXhvbnNcbiAgICAgICAgLy8gcGFzcyB0aGUgXCJzbG90XCIgdG8gdGhlIGV4b25zIGFuZCBpbnRyb25zXG4gICAgICAgIG5ld19lbGVtcy5lYWNoIChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgaWYgKGQuZXhvbnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8ZC5leG9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBkLmV4b25zW2ldLnNsb3QgPSBkLnNsb3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgZXhvbnMgPSBncy5zZWxlY3RBbGwoXCIuZXhvbnNcIilcbiAgICAgICAgICAgIC5kYXRhKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGQuZXhvbnMgfHwgW107XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkLnN0YXJ0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgZXhvbnNcbiAgICAgICAgICAgIC5lbnRlcigpXG4gICAgICAgICAgICAuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRudF9leG9uc1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh4U2NhbGUoZC5zdGFydCArIGQub2Zmc2V0KSAtIHhTY2FsZShkLnN0YXJ0KSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh4U2NhbGUoZC5lbmQpIC0geFNjYWxlKGQuc3RhcnQpKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBmZWF0dXJlLmxheW91dCgpLmdlbmVfc2xvdCgpLmdlbmVfaGVpZ2h0KVxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIHRyYWNrLmNvbG9yKCkpXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCB0cmFjay5jb2xvcigpKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcbiAgICAgICAgICAgIC8vLmF0dHIoXCJzdHJva2VcIiwgZmVhdHVyZS5jb2xvcigpKVxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmVhdHVyZS5jb2xvcigpKGQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIGlmIChkLmNvZGluZykge1xuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZlYXR1cmUuY29sb3IoKShkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGQuY29kaW5nID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJhY2suY29sb3IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZlYXR1cmUuY29sb3IoKShkKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGxhYmVsc1xuICAgICAgICBnc1xuICAgICAgICAgICAgLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0bnRfbmFtZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgMjUpXG4gICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgdHJhY2suY29sb3IoKSlcbiAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZlYXR1cmUubGF5b3V0KCkuZ2VuZV9zbG90KCkuc2hvd19sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5kaXNwbGF5X2xhYmVsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3R5bGUoXCJmb250LXdlaWdodFwiLCBcIm5vcm1hbFwiKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmZWF0dXJlLmNvbG9yKCkoZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZmVhdHVyZS5kaXN0cmlidXRlIChmdW5jdGlvbiAodHJhbnNjcmlwdHMpIHtcbiAgICAgICAgdmFyIHRyYWNrID0gdGhpcztcbiAgICAgICAgdmFyIHhTY2FsZSA9IGZlYXR1cmUuc2NhbGUoKTtcbiAgICAgICAgdmFyIGdzID0gdHJhbnNjcmlwdHMuc2VsZWN0KFwiZ1wiKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDIwMClcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeFNjYWxlKGQuc3RhcnQpICsgXCIsXCIgKyAoZmVhdHVyZS5sYXlvdXQoKS5nZW5lX3Nsb3QoKS5zbG90X2hlaWdodCAqIGQuc2xvdCkgKyBcIilcIjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBnc1xuICAgICAgICAgICAgLnNlbGVjdEFsbCAoXCJyZWN0XCIpXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBmZWF0dXJlLmxheW91dCgpLmdlbmVfc2xvdCgpLmdlbmVfaGVpZ2h0KTtcbiAgICAgICAgZ3NcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoXCJsaW5lXCIpXG4gICAgICAgICAgICAuYXR0cihcIngyXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh4U2NhbGUoZC5lbmQpIC0geFNjYWxlKGQuc3RhcnQpKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cihcInkxXCIsIH5+KGZlYXR1cmUubGF5b3V0KCkuZ2VuZV9zbG90KCkuZ2VuZV9oZWlnaHQvMikpXG4gICAgICAgICAgICAuYXR0cihcInkyXCIsIH5+KGZlYXR1cmUubGF5b3V0KCkuZ2VuZV9zbG90KCkuZ2VuZV9oZWlnaHQvMikpO1xuICAgICAgICBnc1xuICAgICAgICAgICAgLnNlbGVjdCAoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAudGV4dCAoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmVhdHVyZS5sYXlvdXQoKS5nZW5lX3Nsb3QoKS5zaG93X2xhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmRpc3BsYXlfbGFiZWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBmZWF0dXJlLm1vdmUgKGZ1bmN0aW9uICh0cmFuc2NyaXB0cykge1xuICAgICAgICB2YXIgeFNjYWxlID0gZmVhdHVyZS5zY2FsZSgpO1xuICAgICAgICB2YXIgZ3MgPSB0cmFuc2NyaXB0cy5zZWxlY3QoXCJnXCIpXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHhTY2FsZShkLnN0YXJ0KSArIFwiLFwiICsgKGZlYXR1cmUubGF5b3V0KCkuZ2VuZV9zbG90KCkuc2xvdF9oZWlnaHQgKiBkLnNsb3QpICsgXCIpXCI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgZ3Muc2VsZWN0QWxsKFwibGluZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4MlwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoeFNjYWxlKGQuZW5kKSAtIHhTY2FsZShkLnN0YXJ0KSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoXCJ5MVwiLCB+fihmZWF0dXJlLmxheW91dCgpLmdlbmVfc2xvdCgpLmdlbmVfaGVpZ2h0LzIpKVxuICAgICAgICAgICAgLmF0dHIoXCJ5MlwiLCB+fihmZWF0dXJlLmxheW91dCgpLmdlbmVfc2xvdCgpLmdlbmVfaGVpZ2h0LzIpKTtcbiAgICAgICAgICAgIC8vIC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gKHhTY2FsZShkLmVuZCkgLSB4U2NhbGUoZC5zdGFydCkpO1xuICAgICAgICAgICAgLy8gfSlcbiAgICAgICAgZ3Muc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoeFNjYWxlKGQuZW5kKSAtIHhTY2FsZShkLnN0YXJ0KSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgZ3Muc2VsZWN0QWxsKFwiLnRudF9leG9uc1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICh4U2NhbGUoZC5zdGFydCArIGQub2Zmc2V0KSAtIHhTY2FsZShkLnN0YXJ0KSk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZlYXR1cmU7XG59O1xuXG5cbnZhciB0bnRfZmVhdHVyZV9zZXF1ZW5jZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBjb25maWcgPSB7XG4gICAgICAgIGZvbnRzaXplIDogMTAsXG4gICAgICAgIHNlcXVlbmNlIDogZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBkLnNlcXVlbmNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vICdJbmhlcml0JyBmcm9tIHRudC50cmFjay5mZWF0dXJlXG4gICAgdmFyIGZlYXR1cmUgPSBib2FyZC50cmFjay5mZWF0dXJlKClcbiAgICAuaW5kZXggKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHJldHVybiBkLnBvcztcbiAgICB9KTtcblxuICAgIHZhciBhcGkgPSBhcGlqcyAoZmVhdHVyZSlcbiAgICAuZ2V0c2V0IChjb25maWcpO1xuXG5cbiAgICBmZWF0dXJlLmNyZWF0ZSAoZnVuY3Rpb24gKG5ld19udHMpIHtcbiAgICAgICAgdmFyIHRyYWNrID0gdGhpcztcbiAgICAgICAgdmFyIHhTY2FsZSA9IGZlYXR1cmUuc2NhbGUoKTtcblxuICAgICAgICBuZXdfbnRzXG4gICAgICAgICAgICAuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIHRyYWNrLmNvbG9yKCkpXG4gICAgICAgICAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsIGNvbmZpZy5mb250c2l6ZSArIFwicHhcIilcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4U2NhbGUgKGQucG9zKSAtIChjb25maWcuZm9udHNpemUvMikgKyAxO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKFwieVwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB+fih0cmFjay5oZWlnaHQoKSAvIDIpICsgNTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3R5bGUoXCJmb250LWZhbWlseVwiLCAnXCJMdWNpZGEgQ29uc29sZVwiLCBNb25hY28sIG1vbm9zcGFjZScpXG4gICAgICAgICAgICAudGV4dChjb25maWcuc2VxdWVuY2UpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxuICAgICAgICAgICAgLmF0dHIoJ2ZpbGwnLCBmZWF0dXJlLmNvbG9yKCkpO1xuICAgIH0pO1xuXG4gICAgZmVhdHVyZS5tb3ZlIChmdW5jdGlvbiAobnRzKSB7XG4gICAgICAgIHZhciB4U2NhbGUgPSBmZWF0dXJlLnNjYWxlKCk7XG4gICAgICAgIG50cy5zZWxlY3QgKFwidGV4dFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhTY2FsZShkLnBvcykgLSAoY29uZmlnLmZvbnRzaXplLzIpICsgMTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIHJldHVybiBmZWF0dXJlO1xufTtcblxudmFyIHRudF9mZWF0dXJlX2dlbmUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAvLyAnSW5oZXJpdCcgZnJvbSB0bnQudHJhY2suZmVhdHVyZVxuICAgIHZhciBmZWF0dXJlID0gYm9hcmQudHJhY2suZmVhdHVyZSgpXG4gICAgXHQubGF5b3V0KGJvYXJkLnRyYWNrLmxheW91dC5nZW5vbWUoKSlcbiAgICBcdC5pbmRleChmdW5jdGlvbiAoZCkge1xuICAgIFx0ICAgIHJldHVybiBkLmlkO1xuICAgIFx0fSk7XG5cbiAgICBmZWF0dXJlLmNyZWF0ZShmdW5jdGlvbiAobmV3X2VsZW1zKSB7XG4gICAgICAgIHZhciB0cmFjayA9IHRoaXM7XG4gICAgICAgIHZhciB4U2NhbGUgPSBmZWF0dXJlLnNjYWxlKCk7XG4gICAgICAgIG5ld19lbGVtc1xuICAgICAgICAgICAgLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4U2NhbGUoZC5zdGFydCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZlYXR1cmUubGF5b3V0KCkuZ2VuZV9zbG90KCkuc2xvdF9oZWlnaHQgKiBkLnNsb3Q7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoeFNjYWxlKGQuZW5kKSAtIHhTY2FsZShkLnN0YXJ0KSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZmVhdHVyZS5sYXlvdXQoKS5nZW5lX3Nsb3QoKS5nZW5lX2hlaWdodClcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCB0cmFjay5jb2xvcigpKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDUwMClcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIGlmIChkLmNvbG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZlYXR1cmUuY29sb3IoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5jb2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBuZXdfZWxlbXNcbiAgICAgICAgICAgIC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidG50X25hbWVcIilcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4U2NhbGUoZC5zdGFydCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChmZWF0dXJlLmxheW91dCgpLmdlbmVfc2xvdCgpLnNsb3RfaGVpZ2h0ICogZC5zbG90KSArIDI1O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCB0cmFjay5jb2xvcigpKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmVhdHVyZS5sYXlvdXQoKS5nZW5lX3Nsb3QoKS5zaG93X2xhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmRpc3BsYXlfbGFiZWw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdHlsZShcImZvbnQtd2VpZ2h0XCIsIFwibm9ybWFsXCIpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmZWF0dXJlLmNvbG9yKCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGZlYXR1cmUuZGlzdHJpYnV0ZShmdW5jdGlvbiAoZ2VuZXMpIHtcbiAgICAgICAgdmFyIHRyYWNrID0gdGhpcztcbiAgICAgICAgZ2VuZXNcbiAgICAgICAgICAgIC5zZWxlY3QoXCJyZWN0XCIpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oNTAwKVxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChmZWF0dXJlLmxheW91dCgpLmdlbmVfc2xvdCgpLnNsb3RfaGVpZ2h0ICogZC5zbG90KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBmZWF0dXJlLmxheW91dCgpLmdlbmVfc2xvdCgpLmdlbmVfaGVpZ2h0KTtcblxuICAgICAgICBnZW5lc1xuICAgICAgICAgICAgLnNlbGVjdChcInRleHRcIilcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGZlYXR1cmUubGF5b3V0KCkuZ2VuZV9zbG90KCkuc2xvdF9oZWlnaHQgKiBkLnNsb3QpICsgMjU7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmVhdHVyZS5sYXlvdXQoKS5nZW5lX3Nsb3QoKS5zaG93X2xhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmRpc3BsYXlfbGFiZWw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBmZWF0dXJlLm1vdmUoZnVuY3Rpb24gKGdlbmVzKSB7XG4gICAgICAgIHZhciB4U2NhbGUgPSBmZWF0dXJlLnNjYWxlKCk7XG4gICAgICAgIGdlbmVzLnNlbGVjdChcInJlY3RcIilcbiAgICAgICAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4U2NhbGUoZC5zdGFydCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoeFNjYWxlKGQuZW5kKSAtIHhTY2FsZShkLnN0YXJ0KSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBnZW5lcy5zZWxlY3QoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geFNjYWxlKGQuc3RhcnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmVhdHVyZTtcbn07XG5cbi8vIGdlbm9tZSBsb2NhdGlvblxuIHZhciB0bnRfZmVhdHVyZV9sb2NhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgdmFyIHhTY2FsZTtcbiAgICAgdmFyIHJvdztcbiAgICAgdmFyIGNocjtcbiAgICAgdmFyIHNwZWNpZXM7XG4gICAgIHZhciB0ZXh0X2NiYWsgPSBmdW5jdGlvbiAoc3AsIGNociwgZnJvbSwgdG8pIHtcbiAgICAgICAgIHJldHVybiBzcCArIFwiIFwiICsgY2hyICsgXCI6XCIgKyBmcm9tICsgXCItXCIgKyB0bztcbiAgICAgfTtcblxuICAgICB2YXIgZmVhdHVyZSA9IHt9O1xuICAgICBmZWF0dXJlLnJlc2V0ID0gZnVuY3Rpb24gKCkge307XG4gICAgIGZlYXR1cmUucGxvdCA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICBmZWF0dXJlLmluaXQgPSBmdW5jdGlvbiAoKSB7IHJvdyA9IHVuZGVmaW5lZDsgfTtcbiAgICAgZmVhdHVyZS5tb3ZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgIHZhciB4U2NhbGUgPSBmZWF0dXJlLnNjYWxlKCk7XG4gICAgICAgICB2YXIgZG9tYWluID0geFNjYWxlLmRvbWFpbigpO1xuICAgICAgICAgcm93LnNlbGVjdCAoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAudGV4dCh0ZXh0X2NiYWsoc3BlY2llcywgY2hyLCB+fmRvbWFpblswXSwgfn5kb21haW5bMV0pKTtcbiAgICAgfTtcbiAgICAgZmVhdHVyZS51cGRhdGUgPSBmdW5jdGlvbiAod2hlcmUpIHtcbiAgICAgICAgIGNociA9IHdoZXJlLmNocjtcbiAgICAgICAgIHNwZWNpZXMgPSB3aGVyZS5zcGVjaWVzO1xuICAgICAgICAgdmFyIHRyYWNrID0gdGhpcztcbiAgICAgICAgIHZhciBzdmdfZyA9IHRyYWNrLmc7XG4gICAgICAgICB2YXIgZG9tYWluID0geFNjYWxlLmRvbWFpbigpO1xuICAgICAgICAgaWYgKHJvdyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgcm93ID0gc3ZnX2c7XG4gICAgICAgICAgICAgcm93XG4gICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgICAgICAgICAgIC50ZXh0KHRleHRfY2JhayhzcGVjaWVzLCBjaHIsIH5+ZG9tYWluWzBdLCB+fmRvbWFpblsxXSkpO1xuICAgICAgICAgfVxuICAgICB9O1xuXG4gICAgIGZlYXR1cmUuc2NhbGUgPSBmdW5jdGlvbiAocykge1xuICAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgcmV0dXJuIHhTY2FsZTtcbiAgICAgICAgIH1cbiAgICAgICAgIHhTY2FsZSA9IHM7XG4gICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgfTtcblxuICAgICBmZWF0dXJlLnRleHQgPSBmdW5jdGlvbiAoY2Jhaykge1xuICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0X2NiYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGV4dF9jYmFrID0gY2JhaztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgIH07XG5cbiAgICAgcmV0dXJuIGZlYXR1cmU7XG4gfTtcblxudmFyIGdlbm9tZV9mZWF0dXJlcyA9IHtcbiAgICBnZW5lIDogdG50X2ZlYXR1cmVfZ2VuZSxcbiAgICBzZXF1ZW5jZSA6IHRudF9mZWF0dXJlX3NlcXVlbmNlLFxuICAgIHRyYW5zY3JpcHQgOiB0bnRfZmVhdHVyZV90cmFuc2NyaXB0LFxuICAgIGxvY2F0aW9uIDogdG50X2ZlYXR1cmVfbG9jYXRpb24sXG59O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZ2Vub21lX2ZlYXR1cmVzO1xuIiwiLy8gdmFyIGVuc2VtYmxfcmVzdCA9IHJlcXVpcmUoXCJ0bnQuZW5zZW1ibFwiKSgpO1xudmFyIGFwaWpzID0gcmVxdWlyZShcInRudC5hcGlcIik7XG52YXIgdG50X2JvYXJkID0gcmVxdWlyZShcInRudC5ib2FyZFwiKTtcbnRudF9ib2FyZC50cmFjay5kYXRhLmdlbm9tZSA9IHJlcXVpcmUoXCIuL2RhdGEuanNcIik7XG50bnRfYm9hcmQudHJhY2suZmVhdHVyZS5nZW5vbWUgPSByZXF1aXJlKFwiLi9mZWF0dXJlXCIpO1xudG50X2JvYXJkLnRyYWNrLmxheW91dC5nZW5vbWUgPSByZXF1aXJlKFwiLi9sYXlvdXRcIik7XG50bnRfYm9hcmQudHJhY2suZGF0YS5nZW5vbWUuZW5zZW1ibCA9IHJlcXVpcmUoXCJ0bnQucmVzdFwiKSgpXG4gICAgLmRvbWFpbihcInJlc3QuZW5zZW1ibC5vcmdcIik7XG5cbnRudF9ib2FyZF9nZW5vbWUgPSBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBlbnNlbWJsX3Jlc3QgPSB0bnRfYm9hcmQudHJhY2suZGF0YS5nZW5vbWUuZW5zZW1ibDtcblxuICAgIC8vIFByaXZhdGUgdmFyc1xuICAgIHZhciBlbnNfcmUgPSAvXkVOU1xcdytcXGQrJC87XG4gICAgdmFyIGNocl9sZW5ndGg7XG5cbiAgICAvLyBWYXJzIGV4cG9zZWQgaW4gdGhlIEFQSVxuICAgIHZhciBjb25mID0ge1xuICAgICAgICBnZW5lICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgeHJlZl9zZWFyY2ggICAgOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgZW5zZ2VuZV9zZWFyY2ggOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgY29udGV4dCAgICAgICAgOiAwLFxuICAgICAgICByZXN0ICAgICAgICAgICA6IGVuc2VtYmxfcmVzdFxuICAgIH07XG4gICAgLy8gV2UgXCJpbmhlcml0XCIgZnJvbSBib2FyZFxuICAgIHZhciBnZW5vbWVfYnJvd3NlciA9IHRudF9ib2FyZCgpXG4gICAgICAgIC56b29tX2luKDIwMClcbiAgICAgICAgLnpvb21fb3V0KDUwMDAwMDApIC8vIGVuc2VtYmwgcmVnaW9uIGxpbWl0XG4gICAgICAgIC5taW4oMCk7XG5cbiAgICB2YXIgZ2VuZTtcblxuICAgIC8vIFRoZSBsb2NhdGlvbiBhbmQgYXhpcyB0cmFja1xuICAgIHZhciBsb2NhdGlvbl90cmFjayA9IHRudF9ib2FyZC50cmFjaygpXG4gICAgICAgIC5oZWlnaHQoMjApXG4gICAgICAgIC5jb2xvcihcIndoaXRlXCIpXG4gICAgICAgIC5kYXRhKHRudF9ib2FyZC50cmFjay5kYXRhLmVtcHR5KCkpXG4gICAgICAgIC5kaXNwbGF5KHRudF9ib2FyZC50cmFjay5mZWF0dXJlLmdlbm9tZS5sb2NhdGlvbigpKTtcblxuICAgIHZhciBheGlzX3RyYWNrID0gdG50X2JvYXJkLnRyYWNrKClcbiAgICAgICAgLmhlaWdodCgwKVxuICAgICAgICAuY29sb3IoXCJ3aGl0ZVwiKVxuICAgICAgICAuZGF0YSh0bnRfYm9hcmQudHJhY2suZGF0YS5lbXB0eSgpKVxuICAgICAgICAuZGlzcGxheSh0bnRfYm9hcmQudHJhY2suZmVhdHVyZS5heGlzKCkpO1xuXG4gICAgZ2Vub21lX2Jyb3dzZXJcblx0ICAgLmFkZF90cmFjayhsb2NhdGlvbl90cmFjaylcbiAgICAgICAuYWRkX3RyYWNrKGF4aXNfdHJhY2spO1xuXG4gICAgLy8gRGVmYXVsdCBsb2NhdGlvbjpcbiAgICBnZW5vbWVfYnJvd3NlclxuXHQgICAuc3BlY2llcyhcImh1bWFuXCIpXG4gICAgICAgLmNocig3KVxuICAgICAgIC5mcm9tKDEzOTQyNDk0MClcbiAgICAgICAudG8oMTQxNzg0MTAwKTtcblxuICAgIC8vIFdlIHNhdmUgdGhlIHN0YXJ0IG1ldGhvZCBvZiB0aGUgJ3BhcmVudCcgb2JqZWN0XG4gICAgZ2Vub21lX2Jyb3dzZXIuX3N0YXJ0ID0gZ2Vub21lX2Jyb3dzZXIuc3RhcnQ7XG5cbiAgICAvLyBXZSBoaWphY2sgcGFyZW50J3Mgc3RhcnQgbWV0aG9kXG4gICAgdmFyIHN0YXJ0ID0gZnVuY3Rpb24gKHdoZXJlKSB7XG4gICAgICAgIGlmICh3aGVyZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAod2hlcmUuZ2VuZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZ2V0X2dlbmUod2hlcmUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHdoZXJlLnNwZWNpZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB3aGVyZS5zcGVjaWVzID0gZ2Vub21lX2Jyb3dzZXIuc3BlY2llcygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdlbm9tZV9icm93c2VyLnNwZWNpZXMod2hlcmUuc3BlY2llcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh3aGVyZS5jaHIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB3aGVyZS5jaHIgPSBnZW5vbWVfYnJvd3Nlci5jaHIoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBnZW5vbWVfYnJvd3Nlci5jaHIod2hlcmUuY2hyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHdoZXJlLmZyb20gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB3aGVyZS5mcm9tID0gZ2Vub21lX2Jyb3dzZXIuZnJvbSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdlbm9tZV9icm93c2VyLmZyb20od2hlcmUuZnJvbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh3aGVyZS50byA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoZXJlLnRvID0gZ2Vub21lX2Jyb3dzZXIudG8oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBnZW5vbWVfYnJvd3Nlci50byh3aGVyZS50byk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvLyBcIndoZXJlXCIgaXMgdW5kZWYgc28gbG9vayBmb3IgZ2VuZSBvciBsb2NcbiAgICAgICAgICAgIGlmIChnZW5vbWVfYnJvd3Nlci5nZW5lKCkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGdldF9nZW5lKHsgc3BlY2llcyA6IGdlbm9tZV9icm93c2VyLnNwZWNpZXMoKSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZSAgICA6IGdlbm9tZV9icm93c2VyLmdlbmUoKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd2hlcmUgPSB7fTtcbiAgICAgICAgICAgICAgICB3aGVyZS5zcGVjaWVzID0gZ2Vub21lX2Jyb3dzZXIuc3BlY2llcygpO1xuICAgICAgICAgICAgICAgIHdoZXJlLmNociAgICAgPSBnZW5vbWVfYnJvd3Nlci5jaHIoKTtcbiAgICAgICAgICAgICAgICB3aGVyZS5mcm9tICAgID0gZ2Vub21lX2Jyb3dzZXIuZnJvbSgpO1xuICAgICAgICAgICAgICAgIHdoZXJlLnRvICAgICAgPSBnZW5vbWVfYnJvd3Nlci50bygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHVybCA9IGVuc2VtYmxfcmVzdC51cmwoKVxuICAgICAgICAgICAgLmVuZHBvaW50KFwiaW5mby9hc3NlbWJseS86c3BlY2llcy86cmVnaW9uX25hbWVcIilcbiAgICAgICAgICAgIC5wYXJhbWV0ZXJzKHtcbiAgICAgICAgICAgICAgICBzcGVjaWVzOiB3aGVyZS5zcGVjaWVzLFxuICAgICAgICAgICAgICAgIHJlZ2lvbl9uYW1lOiB3aGVyZS5jaHJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBlbnNlbWJsX3Jlc3QuY2FsbCAodXJsKVxuICAgICAgICAgICAgLnRoZW4gKGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgICAgICAgICAgZ2Vub21lX2Jyb3dzZXIubWF4KHJlc3AuYm9keS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGdlbm9tZV9icm93c2VyLl9zdGFydCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBob21vbG9ndWVzID0gZnVuY3Rpb24gKGVuc0dlbmUsIGNhbGxiYWNrKSAge1xuICAgICAgICB2YXIgdXJsID0gZW5zZW1ibF9yZXN0LnVybC5ob21vbG9ndWVzICh7aWQgOiBlbnNHZW5lfSk7XG4gICAgICAgIGVuc2VtYmxfcmVzdC5jYWxsKHVybClcbiAgICAgICAgICAgIC50aGVuIChmdW5jdGlvbihyZXNwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhvbW9sb2d1ZXMgPSByZXNwLmJvZHkuZGF0YVswXS5ob21vbG9naWVzO1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBob21vbG9ndWVzX29iaiA9IHNwbGl0X2hvbW9sb2d1ZXMoaG9tb2xvZ3Vlcyk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGhvbW9sb2d1ZXNfb2JqKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgaXNFbnNlbWJsR2VuZSA9IGZ1bmN0aW9uKHRlcm0pIHtcbiAgICAgICAgaWYgKHRlcm0ubWF0Y2goZW5zX3JlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGdldF9nZW5lID0gZnVuY3Rpb24gKHdoZXJlKSB7XG4gICAgICAgIGlmIChpc0Vuc2VtYmxHZW5lKHdoZXJlLmdlbmUpKSB7XG4gICAgICAgICAgICBnZXRfZW5zR2VuZSh3aGVyZS5nZW5lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBlbnNlbWJsX3Jlc3QudXJsKClcbiAgICAgICAgICAgICAgICAuZW5kcG9pbnQoXCJ4cmVmcy9zeW1ib2wvOnNwZWNpZXMvOnN5bWJvbFwiKVxuICAgICAgICAgICAgICAgIC5wYXJhbWV0ZXJzKHtcbiAgICAgICAgICAgICAgICAgICAgc3BlY2llczogd2hlcmUuc3BlY2llcyxcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sOiB3aGVyZS5nZW5lXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlbnNlbWJsX3Jlc3QuY2FsbCh1cmwpXG4gICAgICAgICAgICAgICAgLnRoZW4gKGZ1bmN0aW9uKHJlc3ApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSByZXNwLmJvZHk7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcihmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWQuaWQuaW5kZXhPZihcIkVOU1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhWzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldF9lbnNHZW5lKGRhdGFbMF0uaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbmYueHJlZl9zZWFyY2gocmVzcCwgd2hlcmUuZ2VuZSwgd2hlcmUuc3BlY2llcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGdldF9lbnNHZW5lID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHZhciB1cmwgPSBlbnNlbWJsX3Jlc3QudXJsKClcbiAgICAgICAgICAgIC5lbmRwb2ludChcIi9sb29rdXAvaWQvOmlkXCIpXG4gICAgICAgICAgICAucGFyYW1ldGVycyh7XG4gICAgICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBlbnNlbWJsX3Jlc3QuY2FsbCh1cmwpXG4gICAgICAgICAgICAudGhlbiAoZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcmVzcC5ib2R5O1xuICAgICAgICAgICAgICAgIGNvbmYuZW5zZ2VuZV9zZWFyY2goZGF0YSk7XG4gICAgICAgICAgICAgICAgdmFyIGV4dHJhID0gfn4oKGRhdGEuZW5kIC0gZGF0YS5zdGFydCkgKiAoY29uZi5jb250ZXh0LzEwMCkpO1xuICAgICAgICAgICAgICAgIGdlbm9tZV9icm93c2VyXG4gICAgICAgICAgICAgICAgICAgIC5zcGVjaWVzKGRhdGEuc3BlY2llcylcbiAgICAgICAgICAgICAgICAgICAgLmNocihkYXRhLnNlcV9yZWdpb25fbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgLmZyb20oZGF0YS5zdGFydCAtIGV4dHJhKVxuICAgICAgICAgICAgICAgICAgICAudG8oZGF0YS5lbmQgKyBleHRyYSk7XG5cbiAgICAgICAgICAgICAgICBnZW5vbWVfYnJvd3Nlci5zdGFydCggeyBzcGVjaWVzIDogZGF0YS5zcGVjaWVzLFxuICAgICAgICAgICAgICAgICAgICBjaHIgICAgIDogZGF0YS5zZXFfcmVnaW9uX25hbWUsXG4gICAgICAgICAgICAgICAgICAgIGZyb20gICAgOiBkYXRhLnN0YXJ0IC0gZXh0cmEsXG4gICAgICAgICAgICAgICAgICAgIHRvICAgICAgOiBkYXRhLmVuZCArIGV4dHJhXG4gICAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBzcGxpdF9ob21vbG9ndWVzID0gZnVuY3Rpb24gKGhvbW9sb2d1ZXMpIHtcbiAgICAgICAgdmFyIG9ydGhvUGF0dCA9IC9vcnRob2xvZy87XG4gICAgICAgIHZhciBwYXJhUGF0dCA9IC9wYXJhbG9nLztcblxuICAgICAgICB2YXIgb3J0aG9sb2d1ZXMgPSBob21vbG9ndWVzLmZpbHRlcihmdW5jdGlvbihkKXtyZXR1cm4gZC50eXBlLm1hdGNoKG9ydGhvUGF0dCk7fSk7XG4gICAgICAgIHZhciBwYXJhbG9ndWVzICA9IGhvbW9sb2d1ZXMuZmlsdGVyKGZ1bmN0aW9uKGQpe3JldHVybiBkLnR5cGUubWF0Y2gocGFyYVBhdHQpO30pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAnb3J0aG9sb2d1ZXMnIDogb3J0aG9sb2d1ZXMsXG4gICAgICAgICAgICAncGFyYWxvZ3VlcycgIDogcGFyYWxvZ3Vlc1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICB2YXIgYXBpID0gYXBpanMoZ2Vub21lX2Jyb3dzZXIpXG4gICAgICAgIC5nZXRzZXQgKGNvbmYpO1xuXG4gICAgYXBpLm1ldGhvZCAoe1xuICAgICAgICBzdGFydCAgICAgIDogc3RhcnQsXG4gICAgICAgIGhvbW9sb2d1ZXMgOiBob21vbG9ndWVzXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ2Vub21lX2Jyb3dzZXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSB0bnRfYm9hcmRfZ2Vub21lO1xuIiwidmFyIGJvYXJkID0gcmVxdWlyZShcInRudC5ib2FyZFwiKTtcbmJvYXJkLmdlbm9tZSA9IHJlcXVpcmUoXCIuL2dlbm9tZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gYm9hcmQ7XG4iLCJ2YXIgYXBpanMgPSByZXF1aXJlIChcInRudC5hcGlcIik7XG5cbi8vIFRoZSBvdmVybGFwIGRldGVjdG9yIHVzZWQgZm9yIGdlbmVzXG52YXIgZ2VuZV9sYXlvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBQcml2YXRlIHZhcnNcbiAgICB2YXIgbWF4X3Nsb3RzO1xuXG4gICAgLy8gdmFycyBleHBvc2VkIGluIHRoZSBBUEk6XG4gICAgdmFyIGhlaWdodCA9IDE1MDtcblxuICAgIHZhciBvbGRfZWxlbWVudHMgPSBbXTtcblxuICAgIHZhciBzY2FsZTtcblxuICAgIHZhciBzbG90X3R5cGVzID0ge1xuICAgICAgICAnZXhwYW5kZWQnICAgOiB7XG4gICAgICAgICAgICBzbG90X2hlaWdodCA6IDMwLFxuICAgICAgICAgICAgZ2VuZV9oZWlnaHQgOiAxMCxcbiAgICAgICAgICAgIHNob3dfbGFiZWwgIDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAnY29sbGFwc2VkJyA6IHtcbiAgICAgICAgICAgIHNsb3RfaGVpZ2h0IDogMTAsXG4gICAgICAgICAgICBnZW5lX2hlaWdodCA6IDcsXG4gICAgICAgICAgICBzaG93X2xhYmVsICA6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBjdXJyZW50X3Nsb3RfdHlwZSA9ICdleHBhbmRlZCc7XG5cbiAgICAvLyBUaGUgcmV0dXJuZWQgY2xvc3VyZSAvIG9iamVjdFxuICAgIHZhciBnZW5lc19sYXlvdXQgPSBmdW5jdGlvbiAobmV3X2dlbmVzKSB7XG4gICAgICAgIHZhciB0cmFjayA9IHRoaXM7XG4gICAgICAgIHNjYWxlID0gdHJhY2suZGlzcGxheSgpLnNjYWxlKCk7XG5cbiAgICAgICAgLy8gV2UgbWFrZSBzdXJlIHRoYXQgdGhlIGdlbmVzIGhhdmUgbmFtZVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld19nZW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG5ld19nZW5lc1tpXS5leHRlcm5hbF9uYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbmV3X2dlbmVzW2ldLmV4dGVybmFsX25hbWUgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbWF4X3Nsb3RzID0gfn4odHJhY2suaGVpZ2h0KCkgLyBzbG90X3R5cGVzLmV4cGFuZGVkLnNsb3RfaGVpZ2h0KTtcblxuICAgICAgICBpZiAoZ2VuZXNfbGF5b3V0LmtlZXBfc2xvdHMoKSkge1xuICAgICAgICAgICAgc2xvdF9rZWVwZXIobmV3X2dlbmVzLCBvbGRfZWxlbWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuZWVkZWRfc2xvdHMgPSBjb2xsaXRpb25fZGV0ZWN0b3IobmV3X2dlbmVzKTtcbiAgICAgICAgc2xvdF90eXBlcy5jb2xsYXBzZWQubmVlZGVkX3Nsb3RzID0gbmVlZGVkX3Nsb3RzO1xuICAgICAgICBzbG90X3R5cGVzLmV4cGFuZGVkLm5lZWRlZF9zbG90cyA9IG5lZWRlZF9zbG90cztcbiAgICAgICAgaWYgKGdlbmVzX2xheW91dC5maXhlZF9zbG90X3R5cGUoKSkge1xuICAgICAgICAgICAgY3VycmVudF9zbG90X3R5cGUgPSBnZW5lc19sYXlvdXQuZml4ZWRfc2xvdF90eXBlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobmVlZGVkX3Nsb3RzID4gbWF4X3Nsb3RzKSB7XG4gICAgICAgICAgICBjdXJyZW50X3Nsb3RfdHlwZSA9ICdjb2xsYXBzZWQnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudF9zbG90X3R5cGUgPSAnZXhwYW5kZWQnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcnVuIHRoZSB1c2VyLWRlZmluZWQgY2FsbGJhY2tcbiAgICAgICAgZ2VuZXNfbGF5b3V0Lm9uX2xheW91dF9ydW4oKShzbG90X3R5cGVzLCBjdXJyZW50X3Nsb3RfdHlwZSk7XG5cbiAgICAgICAgLy9jb25mX3JvLmVsZW1lbnRzID0gbmV3X2dlbmVzO1xuICAgICAgICBvbGRfZWxlbWVudHMgPSBuZXdfZ2VuZXM7XG4gICAgICAgIHJldHVybiBuZXdfZ2VuZXM7XG4gICAgfTtcblxuICAgIHZhciBnZW5lX3Nsb3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzbG90X3R5cGVzW2N1cnJlbnRfc2xvdF90eXBlXTtcbiAgICB9O1xuXG4gICAgdmFyIGNvbGxpdGlvbl9kZXRlY3RvciA9IGZ1bmN0aW9uIChnZW5lcykge1xuICAgICAgICB2YXIgZ2VuZXNfcGxhY2VkID0gW107XG4gICAgICAgIHZhciBnZW5lc190b19wbGFjZSA9IGdlbmVzO1xuICAgICAgICB2YXIgbmVlZGVkX3Nsb3RzID0gMDtcbiAgICAgICAgZm9yICh2YXIgaj0wOyBqPGdlbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAoZ2VuZXNbal0uc2xvdCA+IG5lZWRlZF9zbG90cyAmJiBnZW5lc1tqXS5zbG90IDwgbWF4X3Nsb3RzKSB7XG4gICAgICAgICAgICAgICAgbmVlZGVkX3Nsb3RzID0gZ2VuZXNbal0uc2xvdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxnZW5lc190b19wbGFjZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGdlbmVzX2J5X3Nsb3QgPSBzb3J0X2dlbmVzX2J5X3Nsb3QoZ2VuZXNfcGxhY2VkKTtcbiAgICAgICAgICAgIHZhciB0aGlzX2dlbmUgPSBnZW5lc190b19wbGFjZVtpXTtcbiAgICAgICAgICAgIGlmICh0aGlzX2dlbmUuc2xvdCAhPT0gdW5kZWZpbmVkICYmIHRoaXNfZ2VuZS5zbG90IDwgbWF4X3Nsb3RzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNsb3RfaGFzX3NwYWNlKHRoaXNfZ2VuZSwgZ2VuZXNfYnlfc2xvdFt0aGlzX2dlbmUuc2xvdF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVzX3BsYWNlZC5wdXNoKHRoaXNfZ2VuZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzbG90ID0gMDtcbiAgICAgICAgICAgIE9VVEVSOiB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChzbG90X2hhc19zcGFjZSh0aGlzX2dlbmUsIGdlbmVzX2J5X3Nsb3Rbc2xvdF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNfZ2VuZS5zbG90ID0gc2xvdDtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXNfcGxhY2VkLnB1c2godGhpc19nZW5lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNsb3QgPiBuZWVkZWRfc2xvdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5lZWRlZF9zbG90cyA9IHNsb3Q7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNsb3QrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmVlZGVkX3Nsb3RzICsgMTtcbiAgICB9O1xuXG4gICAgdmFyIHNsb3RfaGFzX3NwYWNlID0gZnVuY3Rpb24gKHF1ZXJ5X2dlbmUsIGdlbmVzX2luX3RoaXNfc2xvdCkge1xuICAgICAgICBpZiAoZ2VuZXNfaW5fdGhpc19zbG90ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGo9MDsgajxnZW5lc19pbl90aGlzX3Nsb3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHZhciBzdWJqX2dlbmUgPSBnZW5lc19pbl90aGlzX3Nsb3Rbal07XG4gICAgICAgICAgICBpZiAocXVlcnlfZ2VuZS5pZCA9PT0gc3Vial9nZW5lLmlkKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgeV9sYWJlbF9lbmQgPSBzdWJqX2dlbmUuZGlzcGxheV9sYWJlbC5sZW5ndGggKiA4ICsgc2NhbGUoc3Vial9nZW5lLnN0YXJ0KTsgLy8gVE9ETzogSXQgbWF5IGJlIGJldHRlciB0byBoYXZlIGEgZml4ZWQgZm9udCBzaXplIChpbnN0ZWFkIG9mIHRoZSBoYXJkY29kZWQgdmFsdWUpP1xuICAgICAgICAgICAgdmFyIHkxICA9IHNjYWxlKHN1YmpfZ2VuZS5zdGFydCk7XG4gICAgICAgICAgICB2YXIgeTIgID0gc2NhbGUoc3Vial9nZW5lLmVuZCkgPiB5X2xhYmVsX2VuZCA/IHNjYWxlKHN1YmpfZ2VuZS5lbmQpIDogeV9sYWJlbF9lbmQ7XG4gICAgICAgICAgICB2YXIgeF9sYWJlbF9lbmQgPSBxdWVyeV9nZW5lLmRpc3BsYXlfbGFiZWwubGVuZ3RoICogOCArIHNjYWxlKHF1ZXJ5X2dlbmUuc3RhcnQpO1xuICAgICAgICAgICAgdmFyIHgxID0gc2NhbGUocXVlcnlfZ2VuZS5zdGFydCk7XG4gICAgICAgICAgICB2YXIgeDIgPSBzY2FsZShxdWVyeV9nZW5lLmVuZCkgPiB4X2xhYmVsX2VuZCA/IHNjYWxlKHF1ZXJ5X2dlbmUuZW5kKSA6IHhfbGFiZWxfZW5kO1xuICAgICAgICAgICAgaWYgKCAoKHgxIDw9IHkxKSAmJiAoeDIgPj0geTEpKSB8fFxuICAgICAgICAgICAgKCh4MSA+PSB5MSkgJiYgKHgxIDw9IHkyKSkgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICB2YXIgc2xvdF9rZWVwZXIgPSBmdW5jdGlvbiAoZ2VuZXMsIHByZXZfZ2VuZXMpIHtcbiAgICAgICAgdmFyIHByZXZfZ2VuZXNfc2xvdHMgPSBnZW5lczJzbG90cyhwcmV2X2dlbmVzKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdlbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocHJldl9nZW5lc19zbG90c1tnZW5lc1tpXS5pZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGdlbmVzW2ldLnNsb3QgPSBwcmV2X2dlbmVzX3Nsb3RzW2dlbmVzW2ldLmlkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2VuZXMyc2xvdHMgPSBmdW5jdGlvbiAoZ2VuZXNfYXJyYXkpIHtcbiAgICAgICAgdmFyIGhhc2ggPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBnZW5lc19hcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGdlbmUgPSBnZW5lc19hcnJheVtpXTtcbiAgICAgICAgICAgIGhhc2hbZ2VuZS5pZF0gPSBnZW5lLnNsb3Q7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc2g7XG4gICAgfTtcblxuICAgIHZhciBzb3J0X2dlbmVzX2J5X3Nsb3QgPSBmdW5jdGlvbiAoZ2VuZXMpIHtcbiAgICAgICAgdmFyIHNsb3RzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ2VuZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChzbG90c1tnZW5lc1tpXS5zbG90XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc2xvdHNbZ2VuZXNbaV0uc2xvdF0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNsb3RzW2dlbmVzW2ldLnNsb3RdLnB1c2goZ2VuZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzbG90cztcbiAgICB9O1xuXG4gICAgLy8gQVBJXG4gICAgdmFyIGFwaSA9IGFwaWpzIChnZW5lc19sYXlvdXQpXG4gICAgICAgIC5nZXRzZXQgKFwiZWxlbWVudHNcIiwgZnVuY3Rpb24gKCkge30pXG4gICAgICAgIC5nZXRzZXQgKFwib25fbGF5b3V0X3J1blwiLCBmdW5jdGlvbiAoKSB7fSlcbiAgICAgICAgLmdldHNldCAoXCJmaXhlZF9zbG90X3R5cGVcIilcbiAgICAgICAgLmdldHNldCAoXCJrZWVwX3Nsb3RzXCIsIHRydWUpXG4gICAgICAgIC5tZXRob2QgKHtcbiAgICAgICAgICAgIGdlbmVfc2xvdCA6IGdlbmVfc2xvdCxcbiAgICAgICAgICAgIC8vIGhlaWdodCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gc2xvdF90eXBlcy5leHBhbmRlZC5uZWVkZWRfc2xvdHMgKiBzbG90X3R5cGVzLmV4cGFuZGVkLnNsb3RfaGVpZ2h0O1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9KTtcblxuICAgIC8vIENoZWNrIHRoYXQgdGhlIGZpeGVkIHNsb3QgdHlwZSBpcyB2YWxpZFxuICAgIGdlbmVzX2xheW91dC5maXhlZF9zbG90X3R5cGUuY2hlY2soZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuICgodmFsID09PSBcImNvbGxhcHNlZFwiKSB8fCAodmFsID09PSBcImV4cGFuZGVkXCIpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBnZW5lc19sYXlvdXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBnZW5lX2xheW91dDtcbiIsIm1vZHVsZS5leHBvcnRzID0gdG9vbHRpcCA9IHJlcXVpcmUoXCIuL3NyYy90b29sdGlwLmpzXCIpO1xuIiwidmFyIGFwaWpzID0gcmVxdWlyZShcInRudC5hcGlcIik7XG5cbnZhciB0b29sdGlwID0gZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGRyYWcgPSBkMy5iZWhhdmlvci5kcmFnKCk7XG4gICAgdmFyIHRvb2x0aXBfZGl2O1xuXG4gICAgdmFyIGNvbmYgPSB7XG4gICAgICAgIHBvc2l0aW9uIDogXCJyaWdodFwiLFxuICAgICAgICBhbGxvd19kcmFnIDogdHJ1ZSxcbiAgICAgICAgc2hvd19jbG9zZXIgOiB0cnVlLFxuICAgICAgICBmaWxsIDogZnVuY3Rpb24gKCkgeyB0aHJvdyBcImZpbGwgaXMgbm90IGRlZmluZWQgaW4gdGhlIGJhc2Ugb2JqZWN0XCI7IH0sXG4gICAgICAgIHdpZHRoIDogMTgwLFxuICAgICAgICBpZCA6IDFcbiAgICB9O1xuXG4gICAgdmFyIHQgPSBmdW5jdGlvbiAoZGF0YSwgZXZlbnQpIHtcbiAgICAgICAgZHJhZ1xuICAgICAgICAgICAgLm9yaWdpbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHggOiBwYXJzZUludChkMy5zZWxlY3QodGhpcykuc3R5bGUoXCJsZWZ0XCIpKSxcbiAgICAgICAgICAgICAgICAgICAgeSA6IHBhcnNlSW50KGQzLnNlbGVjdCh0aGlzKS5zdHlsZShcInRvcFwiKSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5vbihcImRyYWdcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbmYuYWxsb3dfZHJhZykge1xuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgZDMuZXZlbnQueCArIFwicHhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCBkMy5ldmVudC55ICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvLyBUT0RPOiBXaHkgZG8gd2UgbmVlZCB0aGUgZGl2IGVsZW1lbnQ/XG4gICAgICAgIC8vIEl0IGxvb2tzIGxpa2UgaWYgd2UgYW5jaG9yIHRoZSB0b29sdGlwIGluIHRoZSBcImJvZHlcIlxuICAgICAgICAvLyBUaGUgdG9vbHRpcCBpcyBub3QgbG9jYXRlZCBpbiB0aGUgcmlnaHQgcGxhY2UgKGFwcGVhcnMgYXQgdGhlIGJvdHRvbSlcbiAgICAgICAgLy8gU2VlIGNsaWVudHMvdG9vbHRpcHNfdGVzdC5odG1sIGZvciBhbiBleGFtcGxlXG4gICAgICAgIHZhciBjb250YWluZXJFbGVtID0gc2VsZWN0QW5jZXN0b3IgKHRoaXMsIFwiZGl2XCIpO1xuICAgICAgICBpZiAoY29udGFpbmVyRWxlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBXZSByZXF1aXJlIGEgZGl2IGVsZW1lbnQgYXQgc29tZSBwb2ludCB0byBhbmNob3IgdGhlIHRvb2x0aXBcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvb2x0aXBfZGl2ID0gZDMuc2VsZWN0KGNvbnRhaW5lckVsZW0pXG4gICAgICAgICAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidG50X3Rvb2x0aXBcIilcbiAgICAgICAgICAgIC5jbGFzc2VkKFwidG50X3Rvb2x0aXBfYWN0aXZlXCIsIHRydWUpICAvLyBUT0RPOiBJcyB0aGlzIG5lZWRlZC91c2VkPz8/XG4gICAgICAgICAgICAuY2FsbChkcmFnKTtcblxuICAgICAgICAvLyBwcmV2IHRvb2x0aXBzIHdpdGggdGhlIHNhbWUgaGVhZGVyXG4gICAgICAgIGQzLnNlbGVjdChcIiN0bnRfdG9vbHRpcF9cIiArIGNvbmYuaWQpLnJlbW92ZSgpO1xuXG4gICAgICAgIGlmICgoZDMuZXZlbnQgPT09IG51bGwpICYmIChldmVudCkpIHtcbiAgICAgICAgICAgIGQzLmV2ZW50ID0gZXZlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGQzbW91c2UgPSBkMy5tb3VzZShjb250YWluZXJFbGVtKTtcbiAgICAgICAgZDMuZXZlbnQgPSBudWxsO1xuXG4gICAgICAgIHZhciB4b2Zmc2V0ID0gMDtcbiAgICAgICAgaWYgKGNvbmYucG9zaXRpb24gPT09IFwibGVmdFwiKSB7XG4gICAgICAgICAgICB4b2Zmc2V0ID0gY29uZi53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvb2x0aXBfZGl2LmF0dHIoXCJpZFwiLCBcInRudF90b29sdGlwX1wiICsgY29uZi5pZCk7XG5cbiAgICAgICAgLy8gV2UgcGxhY2UgdGhlIHRvb2x0aXBcbiAgICAgICAgdG9vbHRpcF9kaXZcbiAgICAgICAgICAgIC5zdHlsZShcImxlZnRcIiwgKGQzbW91c2VbMF0gLSB4b2Zmc2V0KSArIFwicHhcIilcbiAgICAgICAgICAgIC5zdHlsZShcInRvcFwiLCAoZDNtb3VzZVsxXSkgKyBcInB4XCIpO1xuXG4gICAgICAgIC8vIENsb3NlXG4gICAgICAgIGlmIChjb25mLnNob3dfY2xvc2VyKSB7XG4gICAgICAgICAgICB0b29sdGlwX2RpdlxuICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidG50X3Rvb2x0aXBfY2xvc2VyXCIpXG4gICAgICAgICAgICAgICAgLm9uIChcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZi5maWxsLmNhbGwodG9vbHRpcF9kaXYubm9kZSgpLCBkYXRhKTtcblxuICAgICAgICAvLyByZXR1cm4gdGhpcyBoZXJlP1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuXG4gICAgLy8gZ2V0cyB0aGUgZmlyc3QgYW5jZXN0b3Igb2YgZWxlbSBoYXZpbmcgdGFnbmFtZSBcInR5cGVcIlxuICAgIC8vIGV4YW1wbGUgOiB2YXIgbXlkaXYgPSBzZWxlY3RBbmNlc3RvcihteWVsZW0sIFwiZGl2XCIpO1xuICAgIGZ1bmN0aW9uIHNlbGVjdEFuY2VzdG9yIChlbGVtLCB0eXBlKSB7XG4gICAgICAgIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChlbGVtLnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gbW9yZSBwYXJlbnRzXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGFnTmFtZSA9IGVsZW0ucGFyZW50Tm9kZS50YWdOYW1lO1xuXG4gICAgICAgIGlmICgodGFnTmFtZSAhPT0gdW5kZWZpbmVkKSAmJiAodGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSB0eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW0ucGFyZW50Tm9kZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3RBbmNlc3RvciAoZWxlbS5wYXJlbnROb2RlLCB0eXBlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBhcGkgPSBhcGlqcyh0KVxuICAgICAgICAuZ2V0c2V0KGNvbmYpO1xuXG4gICAgYXBpLmNoZWNrKCdwb3NpdGlvbicsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgcmV0dXJuICh2YWwgPT09ICdsZWZ0JykgfHwgKHZhbCA9PT0gJ3JpZ2h0Jyk7XG4gICAgfSwgXCJPbmx5ICdsZWZ0JyBvciAncmlnaHQnIHZhbHVlcyBhcmUgYWxsb3dlZCBmb3IgcG9zaXRpb25cIik7XG5cbiAgICBhcGkubWV0aG9kKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRvb2x0aXBfZGl2KSB7XG4gICAgICAgICAgICB0b29sdGlwX2Rpdi5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHQ7XG59O1xuXG50b29sdGlwLmxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gbGlzdCB0b29sdGlwIGlzIGJhc2VkIG9uIGdlbmVyYWwgdG9vbHRpcHNcbiAgICB2YXIgdCA9IHRvb2x0aXAoKTtcbiAgICB2YXIgd2lkdGggPSAxODA7XG5cbiAgICB0LmZpbGwgKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgdmFyIHRvb2x0aXBfZGl2ID0gZDMuc2VsZWN0KHRoaXMpO1xuICAgICAgICB2YXIgb2JqX2luZm9fbGlzdCA9IHRvb2x0aXBfZGl2XG4gICAgICAgICAgICAuYXBwZW5kKFwidGFibGVcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0bnRfem1lbnVcIilcbiAgICAgICAgICAgIC5hdHRyKFwiYm9yZGVyXCIsIFwic29saWRcIilcbiAgICAgICAgICAgIC5zdHlsZShcIndpZHRoXCIsIHQud2lkdGgoKSArIFwicHhcIik7XG5cbiAgICAgICAgLy8gVG9vbHRpcCBoZWFkZXJcbiAgICAgICAgaWYgKG9iai5oZWFkZXIpIHtcbiAgICAgICAgICAgIG9ial9pbmZvX2xpc3RcbiAgICAgICAgICAgICAgICAuYXBwZW5kKFwidHJcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidG50X3ptZW51X2hlYWRlclwiKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJ0aFwiKVxuICAgICAgICAgICAgICAgIC50ZXh0KG9iai5oZWFkZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVG9vbHRpcCByb3dzXG4gICAgICAgIHZhciB0YWJsZV9yb3dzID0gb2JqX2luZm9fbGlzdC5zZWxlY3RBbGwoXCIudG50X3ptZW51X3Jvd1wiKVxuICAgICAgICAgICAgLmRhdGEob2JqLnJvd3MpXG4gICAgICAgICAgICAuZW50ZXIoKVxuICAgICAgICAgICAgLmFwcGVuZChcInRyXCIpXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidG50X3ptZW51X3Jvd1wiKTtcblxuICAgICAgICB0YWJsZV9yb3dzXG4gICAgICAgICAgICAuYXBwZW5kKFwidGRcIilcbiAgICAgICAgICAgIC5zdHlsZShcInRleHQtYWxpZ25cIiwgXCJjZW50ZXJcIilcbiAgICAgICAgICAgIC5odG1sKGZ1bmN0aW9uKGQsaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmoucm93c1tpXS52YWx1ZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZWFjaChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIGlmIChkLmxpbmsgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAuY2xhc3NlZChcImxpbmtcIiwgMSlcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkLmxpbmsoZC5vYmopO1xuICAgICAgICAgICAgICAgICAgICAgICAgdC5jbG9zZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiB0O1xufTtcblxudG9vbHRpcC50YWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyB0YWJsZSB0b29sdGlwcyBhcmUgYmFzZWQgb24gZ2VuZXJhbCB0b29sdGlwc1xuICAgIHZhciB0ID0gdG9vbHRpcCgpO1xuXG4gICAgdmFyIHdpZHRoID0gMTgwO1xuXG4gICAgdC5maWxsIChmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHZhciB0b29sdGlwX2RpdiA9IGQzLnNlbGVjdCh0aGlzKTtcblxuICAgICAgICB2YXIgb2JqX2luZm9fdGFibGUgPSB0b29sdGlwX2RpdlxuICAgICAgICAgICAgLmFwcGVuZChcInRhYmxlXCIpXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidG50X3ptZW51XCIpXG4gICAgICAgICAgICAuYXR0cihcImJvcmRlclwiLCBcInNvbGlkXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJ3aWR0aFwiLCB0LndpZHRoKCkgKyBcInB4XCIpO1xuXG4gICAgICAgIC8vIFRvb2x0aXAgaGVhZGVyXG4gICAgICAgIGlmIChvYmouaGVhZGVyKSB7XG4gICAgICAgICAgICBvYmpfaW5mb190YWJsZVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJ0clwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0bnRfem1lbnVfaGVhZGVyXCIpXG4gICAgICAgICAgICAgICAgLmFwcGVuZChcInRoXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjb2xzcGFuXCIsIDIpXG4gICAgICAgICAgICAgICAgLnRleHQob2JqLmhlYWRlcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUb29sdGlwIHJvd3NcbiAgICAgICAgdmFyIHRhYmxlX3Jvd3MgPSBvYmpfaW5mb190YWJsZS5zZWxlY3RBbGwoXCIudG50X3ptZW51X3Jvd1wiKVxuICAgICAgICAgICAgLmRhdGEob2JqLnJvd3MpXG4gICAgICAgICAgICAuZW50ZXIoKVxuICAgICAgICAgICAgLmFwcGVuZChcInRyXCIpXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidG50X3ptZW51X3Jvd1wiKTtcblxuICAgICAgICB0YWJsZV9yb3dzXG4gICAgICAgICAgICAuYXBwZW5kKFwidGhcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY29sc3BhblwiLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgICAgICAgICAgIGlmIChkLnZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGQudmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidG50X3ptZW51X2lubmVyX2hlYWRlclwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0bnRfem1lbnVfY2VsbFwiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5odG1sKGZ1bmN0aW9uKGQsaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmoucm93c1tpXS5sYWJlbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRhYmxlX3Jvd3NcbiAgICAgICAgICAgIC5hcHBlbmQoXCJ0ZFwiKVxuICAgICAgICAgICAgLmh0bWwoZnVuY3Rpb24oZCxpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmoucm93c1tpXS52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBvYmoucm93c1tpXS52YWx1ZS5jYWxsKHRoaXMsIGQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmoucm93c1tpXS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZC52YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICBkMy5zZWxlY3QodGhpcykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGQubGluayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpXG4gICAgICAgICAgICAgICAgLmNsYXNzZWQoXCJsaW5rXCIsIDEpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgIGQubGluayhkLm9iaik7XG4gICAgICAgICAgICAgICAgICAgIHQuY2xvc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHQ7XG59O1xuXG50b29sdGlwLnBsYWluID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIHBsYWluIHRvb2x0aXBzIGFyZSBiYXNlZCBvbiBnZW5lcmFsIHRvb2x0aXBzXG4gICAgdmFyIHQgPSB0b29sdGlwKCk7XG5cbiAgICB0LmZpbGwgKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgdmFyIHRvb2x0aXBfZGl2ID0gZDMuc2VsZWN0KHRoaXMpO1xuXG4gICAgICAgIHZhciBvYmpfaW5mb190YWJsZSA9IHRvb2x0aXBfZGl2XG4gICAgICAgICAgICAuYXBwZW5kKFwidGFibGVcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0bnRfem1lbnVcIilcbiAgICAgICAgICAgIC5hdHRyKFwiYm9yZGVyXCIsIFwic29saWRcIilcbiAgICAgICAgICAgIC5zdHlsZShcIndpZHRoXCIsIHQud2lkdGgoKSArIFwicHhcIik7XG5cbiAgICAgICAgaWYgKG9iai5oZWFkZXIpIHtcbiAgICAgICAgICAgIG9ial9pbmZvX3RhYmxlXG4gICAgICAgICAgICAgICAgLmFwcGVuZChcInRyXCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRudF96bWVudV9oZWFkZXJcIilcbiAgICAgICAgICAgICAgICAuYXBwZW5kKFwidGhcIilcbiAgICAgICAgICAgICAgICAudGV4dChvYmouaGVhZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvYmouYm9keSkge1xuICAgICAgICAgICAgb2JqX2luZm9fdGFibGVcbiAgICAgICAgICAgICAgICAuYXBwZW5kKFwidHJcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidG50X3ptZW51X3Jvd1wiKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJ0ZFwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcInRleHQtYWxpZ25cIiwgXCJjZW50ZXJcIilcbiAgICAgICAgICAgICAgICAuaHRtbChvYmouYm9keSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gdG9vbHRpcDtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiLy8gcmVxdWlyZSgnZnMnKS5yZWFkZGlyU3luYyhfX2Rpcm5hbWUgKyAnLycpLmZvckVhY2goZnVuY3Rpb24oZmlsZSkge1xuLy8gICAgIGlmIChmaWxlLm1hdGNoKC8uK1xcLmpzL2cpICE9PSBudWxsICYmIGZpbGUgIT09IF9fZmlsZW5hbWUpIHtcbi8vIFx0dmFyIG5hbWUgPSBmaWxlLnJlcGxhY2UoJy5qcycsICcnKTtcbi8vIFx0bW9kdWxlLmV4cG9ydHNbbmFtZV0gPSByZXF1aXJlKCcuLycgKyBmaWxlKTtcbi8vICAgICB9XG4vLyB9KTtcblxuLy8gU2FtZSBhc1xudmFyIHV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMuanNcIik7XG51dGlscy5yZWR1Y2UgPSByZXF1aXJlKFwiLi9yZWR1Y2UuanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSB1dGlscztcbiIsInZhciByZWR1Y2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNtb290aCA9IDU7XG4gICAgdmFyIHZhbHVlID0gJ3ZhbCc7XG4gICAgdmFyIHJlZHVuZGFudCA9IGZ1bmN0aW9uIChhLCBiKSB7XG5cdGlmIChhIDwgYikge1xuXHQgICAgcmV0dXJuICgoYi1hKSA8PSAoYiAqIDAuMikpO1xuXHR9XG5cdHJldHVybiAoKGEtYikgPD0gKGEgKiAwLjIpKTtcbiAgICB9O1xuICAgIHZhciBwZXJmb3JtX3JlZHVjZSA9IGZ1bmN0aW9uIChhcnIpIHtyZXR1cm4gYXJyO307XG5cbiAgICB2YXIgcmVkdWNlID0gZnVuY3Rpb24gKGFycikge1xuXHRpZiAoIWFyci5sZW5ndGgpIHtcblx0ICAgIHJldHVybiBhcnI7XG5cdH1cblx0dmFyIHNtb290aGVkID0gcGVyZm9ybV9zbW9vdGgoYXJyKTtcblx0dmFyIHJlZHVjZWQgID0gcGVyZm9ybV9yZWR1Y2Uoc21vb3RoZWQpO1xuXHRyZXR1cm4gcmVkdWNlZDtcbiAgICB9O1xuXG4gICAgdmFyIG1lZGlhbiA9IGZ1bmN0aW9uICh2LCBhcnIpIHtcblx0YXJyLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblx0ICAgIHJldHVybiBhW3ZhbHVlXSAtIGJbdmFsdWVdO1xuXHR9KTtcblx0aWYgKGFyci5sZW5ndGggJSAyKSB7XG5cdCAgICB2W3ZhbHVlXSA9IGFyclt+fihhcnIubGVuZ3RoIC8gMildW3ZhbHVlXTtcdCAgICBcblx0fSBlbHNlIHtcblx0ICAgIHZhciBuID0gfn4oYXJyLmxlbmd0aCAvIDIpIC0gMTtcblx0ICAgIHZbdmFsdWVdID0gKGFycltuXVt2YWx1ZV0gKyBhcnJbbisxXVt2YWx1ZV0pIC8gMjtcblx0fVxuXG5cdHJldHVybiB2O1xuICAgIH07XG5cbiAgICB2YXIgY2xvbmUgPSBmdW5jdGlvbiAoc291cmNlKSB7XG5cdHZhciB0YXJnZXQgPSB7fTtcblx0Zm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcblx0ICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcblx0XHR0YXJnZXRbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG5cdCAgICB9XG5cdH1cblx0cmV0dXJuIHRhcmdldDtcbiAgICB9O1xuXG4gICAgdmFyIHBlcmZvcm1fc21vb3RoID0gZnVuY3Rpb24gKGFycikge1xuXHRpZiAoc21vb3RoID09PSAwKSB7IC8vIG5vIHNtb290aFxuXHQgICAgcmV0dXJuIGFycjtcblx0fVxuXHR2YXIgc21vb3RoX2FyciA9IFtdO1xuXHRmb3IgKHZhciBpPTA7IGk8YXJyLmxlbmd0aDsgaSsrKSB7XG5cdCAgICB2YXIgbG93ID0gKGkgPCBzbW9vdGgpID8gMCA6IChpIC0gc21vb3RoKTtcblx0ICAgIHZhciBoaWdoID0gKGkgPiAoYXJyLmxlbmd0aCAtIHNtb290aCkpID8gYXJyLmxlbmd0aCA6IChpICsgc21vb3RoKTtcblx0ICAgIHNtb290aF9hcnJbaV0gPSBtZWRpYW4oY2xvbmUoYXJyW2ldKSwgYXJyLnNsaWNlKGxvdyxoaWdoKzEpKTtcblx0fVxuXHRyZXR1cm4gc21vb3RoX2FycjtcbiAgICB9O1xuXG4gICAgcmVkdWNlLnJlZHVjZXIgPSBmdW5jdGlvbiAoY2Jhaykge1xuXHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0ICAgIHJldHVybiBwZXJmb3JtX3JlZHVjZTtcblx0fVxuXHRwZXJmb3JtX3JlZHVjZSA9IGNiYWs7XG5cdHJldHVybiByZWR1Y2U7XG4gICAgfTtcblxuICAgIHJlZHVjZS5yZWR1bmRhbnQgPSBmdW5jdGlvbiAoY2Jhaykge1xuXHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0ICAgIHJldHVybiByZWR1bmRhbnQ7XG5cdH1cblx0cmVkdW5kYW50ID0gY2Jhaztcblx0cmV0dXJuIHJlZHVjZTtcbiAgICB9O1xuXG4gICAgcmVkdWNlLnZhbHVlID0gZnVuY3Rpb24gKHZhbCkge1xuXHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0ICAgIHJldHVybiB2YWx1ZTtcblx0fVxuXHR2YWx1ZSA9IHZhbDtcblx0cmV0dXJuIHJlZHVjZTtcbiAgICB9O1xuXG4gICAgcmVkdWNlLnNtb290aCA9IGZ1bmN0aW9uICh2YWwpIHtcblx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdCAgICByZXR1cm4gc21vb3RoO1xuXHR9XG5cdHNtb290aCA9IHZhbDtcblx0cmV0dXJuIHJlZHVjZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHJlZHVjZTtcbn07XG5cbnZhciBibG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVkID0gcmVkdWNlKClcblx0LnZhbHVlKCdzdGFydCcpO1xuXG4gICAgdmFyIHZhbHVlMiA9ICdlbmQnO1xuXG4gICAgdmFyIGpvaW4gPSBmdW5jdGlvbiAob2JqMSwgb2JqMikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ29iamVjdCcgOiB7XG4gICAgICAgICAgICAgICAgJ3N0YXJ0JyA6IG9iajEub2JqZWN0W3JlZC52YWx1ZSgpXSxcbiAgICAgICAgICAgICAgICAnZW5kJyAgIDogb2JqMlt2YWx1ZTJdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3ZhbHVlJyAgOiBvYmoyW3ZhbHVlMl1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLy8gdmFyIGpvaW4gPSBmdW5jdGlvbiAob2JqMSwgb2JqMikgeyByZXR1cm4gb2JqMSB9O1xuXG4gICAgcmVkLnJlZHVjZXIoIGZ1bmN0aW9uIChhcnIpIHtcblx0dmFyIHZhbHVlID0gcmVkLnZhbHVlKCk7XG5cdHZhciByZWR1bmRhbnQgPSByZWQucmVkdW5kYW50KCk7XG5cdHZhciByZWR1Y2VkX2FyciA9IFtdO1xuXHR2YXIgY3VyciA9IHtcblx0ICAgICdvYmplY3QnIDogYXJyWzBdLFxuXHQgICAgJ3ZhbHVlJyAgOiBhcnJbMF1bdmFsdWUyXVxuXHR9O1xuXHRmb3IgKHZhciBpPTE7IGk8YXJyLmxlbmd0aDsgaSsrKSB7XG5cdCAgICBpZiAocmVkdW5kYW50IChhcnJbaV1bdmFsdWVdLCBjdXJyLnZhbHVlKSkge1xuXHRcdGN1cnIgPSBqb2luKGN1cnIsIGFycltpXSk7XG5cdFx0Y29udGludWU7XG5cdCAgICB9XG5cdCAgICByZWR1Y2VkX2Fyci5wdXNoIChjdXJyLm9iamVjdCk7XG5cdCAgICBjdXJyLm9iamVjdCA9IGFycltpXTtcblx0ICAgIGN1cnIudmFsdWUgPSBhcnJbaV0uZW5kO1xuXHR9XG5cdHJlZHVjZWRfYXJyLnB1c2goY3Vyci5vYmplY3QpO1xuXG5cdC8vIHJlZHVjZWRfYXJyLnB1c2goYXJyW2Fyci5sZW5ndGgtMV0pO1xuXHRyZXR1cm4gcmVkdWNlZF9hcnI7XG4gICAgfSk7XG5cbiAgICByZWR1Y2Uuam9pbiA9IGZ1bmN0aW9uIChjYmFrKSB7XG5cdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHQgICAgcmV0dXJuIGpvaW47XG5cdH1cblx0am9pbiA9IGNiYWs7XG5cdHJldHVybiByZWQ7XG4gICAgfTtcblxuICAgIHJlZHVjZS52YWx1ZTIgPSBmdW5jdGlvbiAoZmllbGQpIHtcblx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdCAgICByZXR1cm4gdmFsdWUyO1xuXHR9XG5cdHZhbHVlMiA9IGZpZWxkO1xuXHRyZXR1cm4gcmVkO1xuICAgIH07XG5cbiAgICByZXR1cm4gcmVkO1xufTtcblxudmFyIGxpbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlZCA9IHJlZHVjZSgpO1xuXG4gICAgcmVkLnJlZHVjZXIgKCBmdW5jdGlvbiAoYXJyKSB7XG5cdHZhciByZWR1bmRhbnQgPSByZWQucmVkdW5kYW50KCk7XG5cdHZhciB2YWx1ZSA9IHJlZC52YWx1ZSgpO1xuXHR2YXIgcmVkdWNlZF9hcnIgPSBbXTtcblx0dmFyIGN1cnIgPSBhcnJbMF07XG5cdGZvciAodmFyIGk9MTsgaTxhcnIubGVuZ3RoLTE7IGkrKykge1xuXHQgICAgaWYgKHJlZHVuZGFudCAoYXJyW2ldW3ZhbHVlXSwgY3Vyclt2YWx1ZV0pKSB7XG5cdFx0Y29udGludWU7XG5cdCAgICB9XG5cdCAgICByZWR1Y2VkX2Fyci5wdXNoIChjdXJyKTtcblx0ICAgIGN1cnIgPSBhcnJbaV07XG5cdH1cblx0cmVkdWNlZF9hcnIucHVzaChjdXJyKTtcblx0cmVkdWNlZF9hcnIucHVzaChhcnJbYXJyLmxlbmd0aC0xXSk7XG5cdHJldHVybiByZWR1Y2VkX2FycjtcbiAgICB9KTtcblxuICAgIHJldHVybiByZWQ7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcmVkdWNlO1xubW9kdWxlLmV4cG9ydHMubGluZSA9IGxpbmU7XG5tb2R1bGUuZXhwb3J0cy5ibG9jayA9IGJsb2NrO1xuXG4iLCJcbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGl0ZXJhdG9yIDogZnVuY3Rpb24oaW5pdF92YWwpIHtcblx0dmFyIGkgPSBpbml0X3ZhbCB8fCAwO1xuXHR2YXIgaXRlciA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIHJldHVybiBpKys7XG5cdH07XG5cdHJldHVybiBpdGVyO1xuICAgIH0sXG5cbiAgICBzY3JpcHRfcGF0aCA6IGZ1bmN0aW9uIChzY3JpcHRfbmFtZSkgeyAvLyBzY3JpcHRfbmFtZSBpcyB0aGUgZmlsZW5hbWVcblx0dmFyIHNjcmlwdF9zY2FwZWQgPSBzY3JpcHRfbmFtZS5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcblx0dmFyIHNjcmlwdF9yZSA9IG5ldyBSZWdFeHAoc2NyaXB0X3NjYXBlZCArICckJyk7XG5cdHZhciBzY3JpcHRfcmVfc3ViID0gbmV3IFJlZ0V4cCgnKC4qKScgKyBzY3JpcHRfc2NhcGVkICsgJyQnKTtcblxuXHQvLyBUT0RPOiBUaGlzIHJlcXVpcmVzIHBoYW50b20uanMgb3IgYSBzaW1pbGFyIGhlYWRsZXNzIHdlYmtpdCB0byB3b3JrIChkb2N1bWVudClcblx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XG5cdHZhciBwYXRoID0gXCJcIjsgIC8vIERlZmF1bHQgdG8gY3VycmVudCBwYXRoXG5cdGlmKHNjcmlwdHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yKHZhciBpIGluIHNjcmlwdHMpIHtcblx0XHRpZihzY3JpcHRzW2ldLnNyYyAmJiBzY3JpcHRzW2ldLnNyYy5tYXRjaChzY3JpcHRfcmUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY3JpcHRzW2ldLnNyYy5yZXBsYWNlKHNjcmlwdF9yZV9zdWIsICckMScpO1xuXHRcdH1cbiAgICAgICAgICAgIH1cblx0fVxuXHRyZXR1cm4gcGF0aDtcbiAgICB9LFxuXG4gICAgZGVmZXJfY2FuY2VsIDogZnVuY3Rpb24gKGNiYWssIHRpbWUpIHtcbiAgICAgICAgdmFyIHRpY2s7XG5cbiAgICAgICAgdmFyIGRlZmVyX2NhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aWNrKTtcbiAgICAgICAgICAgIHRpY2sgPSBzZXRUaW1lb3V0IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2Jhay5hcHBseSAodGhhdCwgYXJncyk7XG4gICAgICAgICAgICB9LCB0aW1lKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZGVmZXJfY2FuY2VsO1xuICAgIH1cbn07XG4iLCJmdW5jdGlvbiBhZ2dyZWdhdGlvbiAoYXJyLCB4U2NhbGUpIHtcbiAgICB2YXIgbGltID0gNTtcbiAgICBhcnIubWFwIChmdW5jdGlvbiAoZCkge1xuICAgICAgICBkLmxhYmVsID0gXCJcIjtcbiAgICAgICAgZC5fcHggPSB4U2NhbGUoZC5wb3MpO1xuICAgIH0pO1xuICAgIGFyci5zb3J0IChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5wb3MgLSBiLnBvcztcbiAgICB9KTtcbiAgICB2YXIgZ3JvdXBzID0gW107XG4gICAgdmFyIGN1cnJHcm91cCA9IFthcnJbMF1dO1xuICAgIHZhciBjdXJyID0gYXJyWzBdO1xuICAgIGZvciAodmFyIGk9MTsgaTxhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKChhcnJbaV0uX3B4IC0gY3Vyci5fcHgpIDwgbGltKSB7XG4gICAgICAgICAgICBjdXJyR3JvdXAucHVzaChhcnJbaV0pO1xuICAgICAgICAgICAgY3VyciA9IGFycltpXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdyb3Vwcy5wdXNoIChjdXJyR3JvdXApO1xuICAgICAgICAgICAgY3Vyckdyb3VwID0gW2FycltpXV07XG4gICAgICAgICAgICBjdXJyID0gYXJyW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdyb3Vwcy5wdXNoIChjdXJyR3JvdXApO1xuICAgIGZvciAodmFyIGc9MDsgZzxncm91cHMubGVuZ3RoOyBnKyspIHtcbiAgICAgICAgaWYgKGdyb3Vwc1tnXS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB2YXIgbWVkID0gZ3JvdXBzW2ddW35+KGdyb3Vwc1tnXS5sZW5ndGggLyAyKV07XG4gICAgICAgICAgICBtZWQubGFiZWwgPSBncm91cHNbZ10ubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBhZ2dyZWdhdGlvbjtcbiIsInZhciBjb2xvcnMgPSB7XG4gICAgLy8gcHJvdGVpbnNcbiAgICBcInByb3RlaW4gY29kaW5nXCIgICAgICAgIDogZDMucmdiKCcjQTAwMDAwJyksXG4gICAgXCJwc2V1ZG9nZW5lXCIgICAgICAgICAgICA6IGQzLnJnYignIzY2NjY2NicpLFxuICAgIFwicHJvY2Vzc2VkIHRyYW5zY3JpcHRcIiAgOiBkMy5yZ2IoJyMwMDMzRkYnKSxcbiAgICBcIm5jUk5BXCIgICAgICAgICAgICAgICAgIDogZDMucmdiKCcjOEI2NjhCJyksXG4gICAgXCJhbnRpc2Vuc2VcIiAgICAgICAgICAgICA6IGQzLnJnYignI0NCREQ4QicpLFxuICAgIFwiVFIgZ2VuZVwiICAgICAgICAgICAgICAgOiBkMy5yZ2IoJyNBQTAwQUEnKSxcblxuICAgIC8vIHRyYW5zY3JpcHRzXG4gICAgXCJub24gY29kaW5nIHRyYW5zY3JpcHRcIiA6IGQzLnJnYignIzhCNjY4QicpLFxufTtcblxudmFyIGxlZ2VuZHMgPSB7XG4gICAgLy8gZ2VuZSBiaW90eXBlc1xuICAgIFwicHJvdGVpbl9jb2RpbmdcIiAgICAgICAgICAgICAgICAgICAgIDogXCJwcm90ZWluIGNvZGluZ1wiLFxuICAgIFwicHNldWRvZ2VuZVwiICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJwc2V1ZG9nZW5lXCIsXG4gICAgXCJwcm9jZXNzZWRfcHNldWRvZ2VuZVwiICAgICAgICAgICAgICAgOiBcInBzZXVkb2dlbmVcIixcbiAgICBcInRyYW5zY3JpYmVkX3Byb2Nlc3NlZF9wc2V1ZG9nZW5lXCIgICA6IFwicHNldWRvZ2VuZVwiLFxuICAgIFwidW5wcm9jZXNzZWRfcHNldWRvZ2VuZVwiICAgICAgICAgICAgIDogXCJwc2V1ZG9nZW5lXCIsXG4gICAgXCJwb2x5bW9ycGhpY19wc2V1ZG9nZW5lXCIgICAgICAgICAgICAgOiBcInBzZXVkb2dlbmVcIixcbiAgICBcInVuaXRhcnlfcHNldWRvZ2VuZVwiICAgICAgICAgICAgICAgICA6IFwicHNldWRvZ2VuZVwiLFxuICAgIFwidHJhbnNjcmliZWRfdW5wcm9jZXNzZWRfcHNldWRvZ2VuZVwiIDogXCJwc2V1ZG9nZW5lXCIsXG4gICAgXCJUUl9WX3BzZXVkb2dlbmVcIiAgICAgICAgICAgICAgICAgICAgOiBcInBzZXVkb2dlbmVcIixcbiAgICBcInByb2Nlc3NlZF90cmFuc2NyaXB0XCIgICAgICAgICAgICAgICA6IFwicHJvY2Vzc2VkIHRyYW5zY3JpcHRcIixcbiAgICBcIlRFQ1wiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwicHJvY2Vzc2VkIHRyYW5zY3JpcHRcIixcbiAgICBcInNlbnNlX292ZXJsYXBwaW5nXCIgICAgICAgICAgICAgICAgICA6IFwicHJvY2Vzc2VkIHRyYW5zY3JpcHRcIixcbiAgICBcIm1pUk5BXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwibmNSTkFcIixcbiAgICBcImxpbmNSTkFcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwibmNSTkFcIixcbiAgICBcIm1pc2NfUk5BXCIgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwibmNSTkFcIixcbiAgICBcInNub1JOQVwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwibmNSTkFcIixcbiAgICBcInNuUk5BXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwibmNSTkFcIixcbiAgICBcInJSTkFcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwibmNSTkFcIixcbiAgICBcImFudGlzZW5zZVwiICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiYW50aXNlbnNlXCIsXG4gICAgXCJzZW5zZV9pbnRyb25pY1wiICAgICAgICAgICAgICAgICAgICAgOiBcImFudGlzZW5zZVwiLFxuICAgIFwiVFJfVl9nZW5lXCIgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJUUiBnZW5lXCIsXG4gICAgXCJUUl9DX2dlbmVcIiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlRSIGdlbmVcIixcbiAgICBcIlRSX0pfZ2VuZVwiICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiVFIgZ2VuZVwiLFxuICAgIFwiVFJfRF9nZW5lXCIgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJUUiBnZW5lXCIsXG5cblxuICAgIC8vIHRyYW5zY3JpcHQgYmlvdHlwZXNcbiAgICBcInJldGFpbmVkX2ludHJvblwiICAgICAgICAgICAgICAgICAgICA6IFwibm9uIGNvZGluZyB0cmFuc2NyaXB0XCIsXG4gICAgXCJub25zZW5zZV9tZWRpYXRlZF9kZWNheVwiICAgICAgICAgICAgOiBcInByb3RlaW4gY29kaW5nXCIsXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSB7XG4gICAgY29sb3IgOiBjb2xvcnMsXG4gICAgbGVnZW5kIDogbGVnZW5kcyxcbn07XG4iLCJ2YXIgZ2Vub21lX2Jyb3dzZXJfbmF2ID0gZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHNob3dfb3B0aW9ucyA9IHRydWU7XG4gICAgdmFyIHNob3dfdGl0bGUgPSB0cnVlO1xuICAgIHZhciB0aXRsZSA9IFwiXCI7XG4gICAgdmFyIG9yaWc7XG4gICAgdmFyIGZnQ29sb3IgPSBcIiM1ODY0NzFcIjtcbiAgICAvLyB2YXIgY2hyID0gMDtcbiAgICB2YXIgZ0Jyb3dzZXI7XG5cbiAgICB2YXIgdGhlbWUgPSBmdW5jdGlvbiAoZ0IsIGNvbnRhaW5lcikge1xuICAgICAgICBnQnJvd3NlciA9IGdCO1xuICAgICAgICB2YXIgZGl2ID0gZDMuc2VsZWN0KGNvbnRhaW5lcilcbiAgICAgICAgICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0bnRfbmF2X3dyYXBwZXJcIik7XG5cbiAgICAgICAgdmFyIG9wdHNfcGFuZSA9IGRpdlxuICAgICAgICAgICAgLmFwcGVuZCAoXCJkaXZcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0bnRfbmF2X3BhbmVcIilcbiAgICAgICAgICAgIC5zdHlsZShcImRpc3BsYXlcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNob3dfb3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJpbmxpbmUtYmxvY2tcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibm9uZVwiO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgb3B0c19wYW5lXG4gICAgICAgICAgICAuYXBwZW5kKFwic3BhblwiKVxuICAgICAgICAgICAgLnRleHQoXCJIdW1hbiBDaHI6IFwiICsgZ0IuY2hyKCkpO1xuXG4gICAgICAgIHZhciBsZWZ0X2J1dHRvbiA9IG9wdHNfcGFuZVxuICAgICAgICAgICAgLmFwcGVuZChcImlcIilcbiAgICAgICAgICAgIC5hdHRyKFwidGl0bGVcIiwgXCJnbyBsZWZ0XCIpXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwiY3R0dkdlbm9tZUJyb3dzZXJJY29uIGZhIGZhLWFycm93LWNpcmNsZS1sZWZ0IGZhLTJ4XCIpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCB0aGVtZS5sZWZ0KTtcblxuICAgICAgICB2YXIgem9vbUluX2J1dHRvbiA9IG9wdHNfcGFuZVxuICAgICAgICAgICAgLmFwcGVuZChcImlcIilcbiAgICAgICAgICAgIC5hdHRyKFwidGl0bGVcIiwgXCJ6b29tIG91dFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImN0dHZHZW5vbWVCcm93c2VySWNvbiBmYSBmYS1zZWFyY2gtcGx1cyBmYS0yeFwiKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgdGhlbWUuem9vbU91dCk7XG5cbiAgICAgICAgdmFyIHpvb21PdXRfYnV0dG9uID0gb3B0c19wYW5lXG4gICAgICAgICAgICAuYXBwZW5kKFwiaVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ0aXRsZVwiLCBcInpvb20gaW5cIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjdHR2R2Vub21lQnJvd3Nlckljb24gZmEgZmEtc2VhcmNoLW1pbnVzIGZhLTJ4XCIpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCB0aGVtZS56b29tSW4pO1xuXG4gICAgICAgIHZhciByaWdodF9idXR0b24gPSBvcHRzX3BhbmVcbiAgICAgICAgICAgIC5hcHBlbmQoXCJpXCIpXG4gICAgICAgICAgICAuYXR0cihcInRpdGxlXCIsIFwiZ28gcmlnaHRcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjdHR2R2Vub21lQnJvd3Nlckljb24gZmEgZmEtYXJyb3ctY2lyY2xlLXJpZ2h0IGZhLTJ4XCIpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCB0aGVtZS5yaWdodCk7XG5cbiAgICAgICAgdmFyIG9yaWdMYWJlbCA9IG9wdHNfcGFuZVxuICAgICAgICAgICAgLmFwcGVuZChcImlcIilcbiAgICAgICAgICAgIC5hdHRyKFwidGl0bGVcIiwgXCJyZWxvYWQgbG9jYXRpb25cIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjdHR2R2Vub21lQnJvd3Nlckljb24gZmEgZmEtcmVmcmVzaCBmYS1sdFwiKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGdCcm93c2VyLnN0YXJ0KG9yaWcpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gV2Ugc2V0IHVwIHRoZSBvcmlnaW46XG4gICAgICAgIGlmICghb3JpZykge1xuICAgICAgICAgICAgaWYgKGdCcm93c2VyLmdlbmUoKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgb3JpZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3BlY2llcyA6IGdCcm93c2VyLnNwZWNpZXMoKSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZSAgICA6IGdCcm93c2VyLmdlbmUoKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9yaWcgPSB7XG4gICAgICAgICAgICAgICAgICAgIHNwZWNpZXMgOiBnQnJvd3Nlci5zcGVjaWVzKCksXG4gICAgICAgICAgICAgICAgICAgIGNociAgICAgOiBnQnJvd3Nlci5jaHIoKSxcbiAgICAgICAgICAgICAgICAgICAgZnJvbSAgICA6IGdCcm93c2VyLmZyb20oKSxcbiAgICAgICAgICAgICAgICAgICAgdG8gICAgICA6IGdCcm93c2VyLnRvKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gb3JpZyA9IHtcbiAgICAgICAgLy8gICAgIHNwZWNpZXMgOiBnQnJvd3Nlci5zcGVjaWVzKCksXG4gICAgICAgIC8vICAgICBjaHIgICAgIDogZ0Jyb3dzZXIuY2hyKCksXG4gICAgICAgIC8vICAgICBmcm9tICAgIDogZ0Jyb3dzZXIuZnJvbSgpLFxuICAgICAgICAvLyAgICAgdG8gICAgICA6IGdCcm93c2VyLnRvKClcbiAgICAgICAgLy8gfTtcbiAgICB9O1xuXG4gICAgLy8vLyBBUElcbiAgICB0aGVtZS5sZWZ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBnQnJvd3Nlci5tb3ZlX2xlZnQoMS41KTtcbiAgICB9O1xuXG4gICAgdGhlbWUucmlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdCcm93c2VyLm1vdmVfcmlnaHQoMS41KTtcbiAgICB9O1xuXG4gICAgdGhlbWUuem9vbUluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBnQnJvd3Nlci56b29tKDAuNSk7XG4gICAgfTtcblxuICAgIHRoZW1lLnpvb21PdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdCcm93c2VyLnpvb20oMS41KTtcbiAgICB9O1xuXG4gICAgdGhlbWUuc2hvd19vcHRpb25zID0gZnVuY3Rpb24oYikge1xuICAgICAgICBzaG93X29wdGlvbnMgPSBiO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIHRoZW1lLnNob3dfdGl0bGUgPSBmdW5jdGlvbihiKSB7XG4gICAgICAgIHNob3dfdGl0bGUgPSBiO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgdGhlbWUudGl0bGUgPSBmdW5jdGlvbiAocykge1xuICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aXRsZTtcbiAgICAgICAgfVxuICAgICAgICB0aXRsZSA9IHM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICB0aGVtZS5mb3JlZ3JvdW5kX2NvbG9yID0gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmdDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICBmZ0NvbG9yID0gYztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIHRoZW1lLm9yaWcgPSBmdW5jdGlvbiAocCkge1xuICAgICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmlnO1xuICAgICAgICB9XG4gICAgICAgIG9yaWcgPSBwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gdGhlbWUuY2hyID0gZnVuY3Rpb24gKGMpIHtcbiAgICAvLyAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgLy8gICAgICAgICByZXR1cm4gY2hyO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGNociA9IGM7XG4gICAgLy8gICAgIHJldHVybiB0aGlzO1xuICAgIC8vIH07XG5cblxuICAgIHJldHVybiB0aGVtZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGdlbm9tZV9icm93c2VyX25hdjtcbiIsInZhciBwaXBlbGluZXMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgcmVzdCA9IHtcbiAgICAgICAgZW5zZW1ibDogdW5kZWZpbmVkLFxuICAgICAgICBjdHR2OiB1bmRlZmluZWQsXG4gICAgfTtcblxuICAgIHZhciBzbnBzID0ge307XG4gICAgdmFyIGRhdGE7XG4gICAgdmFyIGhpZ2hsaWdodCA9IHt9O1xuXG4gICAgdmFyIHAgPSB7fTtcblxuICAgIHAucmFyZSA9IGZ1bmN0aW9uIChnZW5lcywgZWZvKSB7XG4gICAgICAgIHZhciBvcHRzLCB1cmw7XG4gICAgICAgIGlmIChlZm8pIHtcbiAgICAgICAgICAgIG9wdHMgPSBnZXRPcHRzIChnZW5lcywgW1widW5pcHJvdFwiLCBcImV2YVwiXSwgZWZvKTtcbiAgICAgICAgICAgIHVybCA9IHJlc3QuY3R0di51cmwuZmlsdGVyYnkgKCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdC5jdHR2LmNhbGwodXJsLCB1bmRlZmluZWQsIG9wdHMpXG4gICAgICAgICAgICAgICAgLnRoZW4gKGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0dHZfaGlnaGxpZ2h0KHJlc3ApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcC5yYXJlKGdlbmVzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdHMgPSBnZXRPcHRzKGdlbmVzLCBbXCJ1bmlwcm90XCIsIFwiZXZhXCJdKTtcbiAgICAgICAgdXJsID0gcmVzdC5jdHR2LnVybC5maWx0ZXJieSgpO1xuICAgICAgICByZXR1cm4gcmVzdC5jdHR2LmNhbGwodXJsLCB1bmRlZmluZWQsIG9wdHMpXG4gICAgICAgICAgICAudGhlbiAoY3R0dl9jbGludmFyKVxuICAgICAgICAgICAgLnRoZW4gKGVuc2VtYmxfY2FsbF9zbnBzKVxuICAgICAgICAgICAgLnRoZW4gKGVuc2VtYmxfcGFyc2VfY2xpbnZhcl9zbnBzKVxuICAgICAgICAgICAgLnRoZW4gKGV4dGVudCk7XG4gICAgfTtcblxuICAgIHAuY29tbW9uID0gZnVuY3Rpb24gKGdlbmVzLCBlZm8pIHtcbiAgICAgICAgdmFyIG9wdHMsIHVybDtcbiAgICAgICAgaWYgKGVmbykge1xuICAgICAgICAgICAgb3B0cyA9IGdldE9wdHMgKGdlbmVzLCBbXCJnd2FzX2NhdGFsb2dcIl0sIGVmbyk7XG4gICAgICAgICAgICB1cmwgPSByZXN0LmN0dHYudXJsLmZpbHRlcmJ5ICgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3QuY3R0di5jYWxsKHVybCwgdW5kZWZpbmVkLCBvcHRzKVxuICAgICAgICAgICAgICAgIC50aGVuIChmdW5jdGlvbiAocmVzcCkge1xuICAgICAgICAgICAgICAgICAgICBjdHR2X2hpZ2hsaWdodChyZXNwKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAuY29tbW9uIChnZW5lcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0cyA9IGdldE9wdHMoZ2VuZXMsIFtcImd3YXNfY2F0YWxvZ1wiXSk7XG4gICAgICAgIHVybCA9IHJlc3QuY3R0di51cmwuZmlsdGVyYnkgKCk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3QuY3R0di5jYWxsKHVybCwgdW5kZWZpbmVkLCBvcHRzKVxuICAgICAgICAgICAgLnRoZW4gKGN0dHZfZ3dhcylcbiAgICAgICAgICAgIC50aGVuIChlbnNlbWJsX2NhbGxfc25wcylcbiAgICAgICAgICAgIC50aGVuIChlbnNlbWJsX3BhcnNlX2d3YXNfc25wcylcbiAgICAgICAgICAgIC50aGVuIChleHRlbnQpO1xuICAgIH07XG5cbiAgICAvLyBTVEVQU1xuICAgIHZhciBjdHR2X2hpZ2hsaWdodCA9IGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxyZXNwLmJvZHkuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHJlYyA9IHJlc3AuYm9keS5kYXRhW2ldO1xuICAgICAgICAgICAgdmFyIHNucF9uYW1lID0gcmVjLnZhcmlhbnQuaWRbMF0uc3BsaXQoXCIvXCIpLnBvcCgpO1xuICAgICAgICAgICAgaGlnaGxpZ2h0W3NucF9uYW1lXSA9IDE7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGN0dHZfY2xpbnZhciA9IGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxyZXNwLmJvZHkuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHJlYyA9IHJlc3AuYm9keS5kYXRhW2ldO1xuICAgICAgICAgICAgaWYgKHJlYy50eXBlID09PSBcImdlbmV0aWNfYXNzb2NpYXRpb25cIikge1xuICAgICAgICAgICAgICAgIHZhciB0aGlzX3NucCA9IHJlYy52YXJpYW50LmlkWzBdO1xuICAgICAgICAgICAgICAgIHZhciBzbnBfbmFtZSA9IHRoaXNfc25wLnNwbGl0KFwiL1wiKS5wb3AoKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFyaWFudERCID0gcmVjLmV2aWRlbmNlLmdlbmUydmFyaWFudC5wcm92ZW5hbmNlX3R5cGUuZGF0YWJhc2U7XG4gICAgICAgICAgICAgICAgdmFyIGNsaW52YXJJZDtcbiAgICAgICAgICAgICAgICBpZiAodmFyaWFudERCLmRieHJlZikge1xuICAgICAgICAgICAgICAgICAgICBjbGludmFySWQgPSB2YXJpYW50REIuZGJ4cmVmLnVybC5zcGxpdChcIi9cIikucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0aGlzX2Rpc2Vhc2UgPSByZWMuZGlzZWFzZS5lZm9faW5mbztcbiAgICAgICAgICAgICAgICB2YXIgdGhpc190YXJnZXQgPSByZWMudGFyZ2V0LmdlbmVfaW5mbztcblxuICAgICAgICAgICAgICAgIHZhciByZWZzID0gW107XG4gICAgICAgICAgICAgICAgaWYgKHJlYy5ldmlkZW5jZS52YXJpYW50MmRpc2Vhc2UucHJvdmVuYW5jZV90eXBlLmxpdGVyYXR1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZnMgPSByZWMuZXZpZGVuY2UudmFyaWFudDJkaXNlYXNlLnByb3ZlbmFuY2VfdHlwZS5saXRlcmF0dXJlLnJlZmVyZW5jZXMubWFwKGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVmLmxpdF9pZC5zcGxpdChcIi9cIikucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc25wc1tzbnBfbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBzbnBzW3NucF9uYW1lXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBzbnBzW3NucF9uYW1lXS50YXJnZXQgPSB0aGlzX3RhcmdldDtcbiAgICAgICAgICAgICAgICAgICAgc25wc1tzbnBfbmFtZV0ubmFtZSA9IHNucF9uYW1lO1xuICAgICAgICAgICAgICAgICAgICBzbnBzW3NucF9uYW1lXS5lZm8gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgc25wc1tzbnBfbmFtZV0uYXNzb2NpYXRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgIHNucHNbc25wX25hbWVdLmNsaW52YXJJZCA9IGNsaW52YXJJZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGhpZ2hsaWdodFtzbnBfbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc25wc1tzbnBfbmFtZV0uaGlnaGxpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIHZhciBhc3NvY2lhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJlZm9cIjogdGhpc19kaXNlYXNlLmVmb19pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiB0aGlzX2Rpc2Vhc2UubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBzbnBfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0YXJnZXRcIjogdGhpc190YXJnZXQuc3ltYm9sLFxuICAgICAgICAgICAgICAgICAgICBcInBtaWRzXCI6IHJlZnNcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHNucHNbc25wX25hbWVdLmFzc29jaWF0aW9ucy5wdXNoKGFzc29jaWF0aW9uKTtcbiAgICAgICAgICAgICAgICBzbnBzW3NucF9uYW1lXS5lZm8ucHVzaCh0aGlzX2Rpc2Vhc2UuZWZvX2lkKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHJlYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gc25wcyA9IGNsaW52YXJTTlBzO1xuICAgICAgICB2YXIgc25wX25hbWVzID0gT2JqZWN0LmtleXMoc25wcyk7XG4gICAgICAgIHJldHVybiBzbnBfbmFtZXM7XG4gICAgfTtcblxuICAgIHZhciBlbnNlbWJsX3BhcnNlX2NsaW52YXJfc25wcyA9IGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgIC8vIGRhdGEgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgc25wX25hbWUgaW4gcmVzcC5ib2R5KSB7XG4gICAgICAgICAgICB2YXIgc25wID0gcmVzcC5ib2R5W3NucF9uYW1lXTtcbiAgICAgICAgICAgIHZhciBpbmZvID0gc25wc1tzbnBfbmFtZV07XG4gICAgICAgICAgICBpbmZvLnBvcyA9IHNucC5tYXBwaW5nc1swXS5zdGFydDtcbiAgICAgICAgICAgIGluZm8udmFsID0gMTtcbiAgICAgICAgICAgIC8vIGRhdGEucHVzaChpbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzbnBzO1xuICAgIH07XG5cbiAgICB2YXIgZXh0ZW50ID0gZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBzbnAgaW4gZGF0YSkge1xuICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoc25wKSkge1xuICAgICAgICAgICAgICAgIGEucHVzaChkYXRhW3NucF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHh0ID0gZDMuZXh0ZW50KGEsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICByZXR1cm4gZC5wb3M7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZXh0ZW50OiB4dCxcbiAgICAgICAgICAgIHNucHM6IHNucHNcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgdmFyIGVuc2VtYmxfcGFyc2VfZ3dhc19zbnBzID0gZnVuY3Rpb24gKHJlc3ApIHtcbiAgICAgICAgLy8gZGF0YSA9IFtdO1xuICAgICAgICB2YXIgbWluID0gZnVuY3Rpb24gKGFycikge1xuICAgICAgICAgICAgdmFyIG0gPSBJbmZpbml0eTtcbiAgICAgICAgICAgIHZhciBsZW4gPSBhcnIubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKGxlbi0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIHYgPSArYXJyW2xlbl0ucHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh2IDwgbSkge1xuICAgICAgICAgICAgICAgICAgICBtID0gdjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbTtcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKHZhciBzbnBfbmFtZSBpbiByZXNwLmJvZHkpIHtcbiAgICAgICAgICAgIGlmIChyZXNwLmJvZHkuaGFzT3duUHJvcGVydHkoc25wX25hbWUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNucCA9IHJlc3AuYm9keVtzbnBfbmFtZV07XG4gICAgICAgICAgICAgICAgdmFyIGluZm8gPSBzbnBzW3NucF9uYW1lXTtcbiAgICAgICAgICAgICAgICBpbmZvLnBvcyA9IHNucC5tYXBwaW5nc1swXS5zdGFydDtcbiAgICAgICAgICAgICAgICBpbmZvLnZhbCA9IDEgLSBtaW4oaW5mby5zdHVkeSk7XG4gICAgICAgICAgICAgICAgLy8gZGF0YS5wdXNoKGluZm8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzbnBzO1xuICAgIH07XG5cbiAgICB2YXIgZW5zZW1ibF9jYWxsX3NucHMgPSBmdW5jdGlvbiAoc25wX25hbWVzKSB7XG4gICAgICAgIHZhciB2YXJfdXJsID0gcmVzdC5lbnNlbWJsLnVybCgpXG4gICAgICAgICAgICAuZW5kcG9pbnQoXCIvdmFyaWF0aW9uLzpzcGVjaWVzXCIpXG4gICAgICAgICAgICAucGFyYW1ldGVycyh7XG4gICAgICAgICAgICAgICAgc3BlY2llczogXCJodW1hblwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gdmFyIHZhcl91cmwgPSByZXN0LmVuc2VtYmwudXJsLnZhcmlhdGlvbiAoe1xuICAgICAgICAvLyAgICAgc3BlY2llcyA6IFwiaHVtYW5cIlxuICAgICAgICAvLyB9KTtcblxuICAgICAgICBpZiAoc25wX25hbWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3QuZW5zZW1ibFxuICAgICAgICAgICAgICAgIC5jYWxsKHZhcl91cmwsIHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZHNcIiA6IHNucF9uYW1lc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vdCBzbnBzLCBkb24ndCBjYWxsIGVuc2VtYmxcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlIChmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICByZXNvbHZlKHtib2R5Ont9fSk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIHZhciBjdHR2X2d3YXMgPSBmdW5jdGlvbiAocmVzcCkge1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8cmVzcC5ib2R5LmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciByZWMgPSByZXNwLmJvZHkuZGF0YVtpXTtcbiAgICAgICAgICAgIHZhciB0aGlzX3NucCA9IHJlYy52YXJpYW50LmlkWzBdO1xuICAgICAgICAgICAgdmFyIHRoaXNfZGlzZWFzZSA9IHJlYy5kaXNlYXNlLmVmb19pbmZvO1xuICAgICAgICAgICAgdmFyIHNucF9uYW1lID0gdGhpc19zbnAuc3BsaXQoXCIvXCIpLnBvcCgpO1xuICAgICAgICAgICAgdmFyIHRoaXNfdGFyZ2V0ID0gcmVjLnRhcmdldC5nZW5lX2luZm87XG4gICAgICAgICAgICBpZiAoc25wc1tzbnBfbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHNucHNbc25wX25hbWVdID0ge307XG4gICAgICAgICAgICAgICAgc25wc1tzbnBfbmFtZV0udGFyZ2V0ID0gdGhpc190YXJnZXQ7XG4gICAgICAgICAgICAgICAgc25wc1tzbnBfbmFtZV0uc3R1ZHkgPSBbXTtcbiAgICAgICAgICAgICAgICBzbnBzW3NucF9uYW1lXS5uYW1lID0gc25wX25hbWU7XG4gICAgICAgICAgICAgICAgc25wc1tzbnBfbmFtZV0uZWZvID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGlnaGxpZ2h0W3NucF9uYW1lXSkge1xuICAgICAgICAgICAgICAgIHNucHNbc25wX25hbWVdLmhpZ2hsaWdodCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzbnBzW3NucF9uYW1lXS5lZm8ucHVzaCh0aGlzX2Rpc2Vhc2UuZWZvX2lkKTtcbiAgICAgICAgICAgIHNucHNbc25wX25hbWVdLnN0dWR5LnB1c2ggKHtcbiAgICAgICAgICAgICAgICBcInBtaWRcIjogcmVjLmV2aWRlbmNlLnZhcmlhbnQyZGlzZWFzZS5wcm92ZW5hbmNlX3R5cGUubGl0ZXJhdHVyZS5yZWZlcmVuY2VzWzBdLmxpdF9pZCxcbiAgICAgICAgICAgICAgICBcInB2YWx1ZVwiOiByZWMuZXZpZGVuY2UudmFyaWFudDJkaXNlYXNlLnJlc291cmNlX3Njb3JlLnZhbHVlLFxuICAgICAgICAgICAgICAgIFwiZWZvXCI6IHRoaXNfZGlzZWFzZS5lZm9faWQsXG4gICAgICAgICAgICAgICAgXCJlZm9fbGFiZWxcIjogdGhpc19kaXNlYXNlLmxhYmVsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vc25wcyA9IGd3YXNTTlBzO1xuICAgICAgICB2YXIgc25wX25hbWVzID0gT2JqZWN0LmtleXMoc25wcyk7XG4gICAgICAgIHJldHVybiBzbnBfbmFtZXM7XG4gICAgfTtcblxuXG4gICAgLy8gQVBJXG4gICAgcC5lbnNlbWJsUmVzdEFwaSA9IGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3QuZW5zZW1ibDtcbiAgICAgICAgfVxuICAgICAgICByZXN0LmVuc2VtYmwgPSByO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgcC5jdHR2UmVzdEFwaSA9IGZ1bmN0aW9uIChyKSB7XG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3QuY3R0djtcbiAgICAgICAgfVxuICAgICAgICByZXN0LmN0dHYgPSByO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0T3B0cyAoZ2VuZXMsIGRhdGFzb3VyY2VzLCBlZm8pIHtcbiAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICAvL3RhcmdldCA6IGdlbmVzLFxuICAgICAgICAgICAgLy9fcG9zdDogZ2VuZXMsXG4gICAgICAgICAgICB0YXJnZXQ6IFtnZW5lc10sXG4gICAgICAgICAgICBzaXplIDogMTAwMCxcbiAgICAgICAgICAgIGRhdGFzb3VyY2UgOiBkYXRhc291cmNlcyxcbiAgICAgICAgICAgIGZpZWxkcyA6IFtcbiAgICAgICAgICAgICAgICBcInRhcmdldC5nZW5lX2luZm9cIixcbiAgICAgICAgICAgICAgICBcImRpc2Vhc2UuZWZvX2luZm9cIixcbiAgICAgICAgICAgICAgICBcInZhcmlhbnRcIixcbiAgICAgICAgICAgICAgICBcImV2aWRlbmNlXCIsXG4gICAgICAgICAgICAgICAgLy8gXCJ1bmlxdWVfYXNzb2NpYXRpb25fZmllbGRzXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCJcbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGVmbyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvcHRzLmRpc2Vhc2UgPSBbZWZvXTtcbiAgICAgICAgICAgIG9wdHMuZXhwYW5kZWZvID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9wdHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHA7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBwaXBlbGluZXM7XG4iLCIvL3ZhciBlbnNlbWJsX3Jlc3RfYXBpID0gcmVxdWlyZShcInRudC5lbnNlbWJsXCIpO1xudmFyIG5hdiA9IHJlcXVpcmUoXCIuL25hdmlnYXRpb24uanNcIik7XG52YXIgYnJvd3Nlcl90b29sdGlwcyA9IHJlcXVpcmUoXCIuL3Rvb2x0aXBzLmpzXCIpO1xudmFyIGFnZ3JlZ2F0aW9uID0gcmVxdWlyZShcIi4vYWdncmVnYXRpb24uanNcIik7XG52YXIgUlNWUCA9IHJlcXVpcmUoJ3JzdnAnKTtcbnZhciBhcGlqcyA9IHJlcXVpcmUoXCJ0bnQuYXBpXCIpO1xudmFyIGJpb3R5cGVzID0gcmVxdWlyZShcIi4vYmlvdHlwZXMuanNcIik7XG52YXIgY3R0dlJlc3RBcGkgPSByZXF1aXJlKFwiY3R0di5hcGlcIik7XG52YXIgcGlwZWxpbmVzID0gcmVxdWlyZShcIi4vcGlwZWxpbmVzLmpzXCIpO1xuXG52YXIgY3R0dl9nZW5vbWVfYnJvd3NlciA9IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy8gT3B0aW9ucyBmb3IgdGhlIHdpZGdldFxuICAgIHZhciBjb25mID0ge1xuICAgICAgICBsaW5rc19wcmVmaXg6IFwiaHR0cHM6Ly93d3cudGFyZ2V0dmFsaWRhdGlvbi5vcmdcIixcbiAgICAgICAgc2hvd19saW5rczogdHJ1ZSxcbiAgICAgICAgc2hvd19zbnBzOiB0cnVlLFxuICAgICAgICBzaG93X25hdjogdHJ1ZSxcbiAgICAgICAgY3R0dlJlc3RBcGk6IGN0dHZSZXN0QXBpKCkucHJlZml4KFwiaHR0cHM6Ly93d3cudGFyZ2V0dmFsaWRhdGlvbi5vcmcvYXBpL2xhdGVzdC9cIiksXG4gICAgICAgIGVmbzogdW5kZWZpbmVkXG4gICAgfTtcblxuICAgIHZhciB0cmFja3MgPSB7fTtcblxuICAgIHZhciBuYXZUaGVtZSA9IG5hdigpO1xuXG4gICAgLy8gdmFyIHNob3dfbGlua3MgICA9IHRydWU7XG4gICAgLy8gdmFyIGVmbztcblxuICAgIHZhciBzbnBfbmV3X2xlZ2VuZDtcblxuICAgIC8vIERpdnNcbiAgICB2YXIgc25wX2xlZ2VuZF9kaXY7XG4gICAgdmFyIG5hdkRpdjtcblxuICAgIHZhciBzbnBDb2xvcnMgPSB7XG4gICAgICAgIFRhcmdldERpc2Vhc2U6IFwiI0ZGMDAwMFwiLCAvLyByZWRcbiAgICAgICAgVGFyZ2V0OiBcIiMzZTk5OTlcIiwgLy8gYmx1ZVxuICAgICAgICBEaXNlYXNlOiBcIiNGRkQ0MDBcIiwgLy8gb3JhbmdlXG4gICAgICAgIE90aGVyOiBcIiNjY2NjY2NcIiAvLyBncmV5XG4gICAgfTtcblxuICAgIHZhciBlbnNlbWJsUmVzdEFwaTtcblxuICAgIC8vIGRpdl9pZHMgdG8gZGlzcGxheSBkaWZmZXJlbnQgZWxlbWVudHNcbiAgICAvLyBUaGV5IGhhdmUgdG8gYmUgc2V0IGR5bmFtaWNhbGx5IGJlY2F1c2UgdGhlIElEcyBjb250YWluIHRoZSBkaXZfaWQgb2YgdGhlIG1haW4gZWxlbWVudCBjb250YWluaW5nIHRoZSBwbHVnLWluXG4gICAgdmFyIGRpdl9pZDtcblxuICAgIHZhciBnZW5lVHJhY2tIZWlnaHQgPSAwO1xuXG4gICAgdmFyIGdCcm93c2VyO1xuXG4gICAgdmFyIGdCcm93c2VyVGhlbWUgPSBmdW5jdGlvbihnQiwgZGl2KSB7XG5cbiAgICAgICAgLy8gU2V0IHRoZSBkaWZmZXJlbnQgI2lkcyBmb3IgdGhlIGh0bWwgZWxlbWVudHMgKG5lZWRzIHRvIGJlIGxpdmVseSBiZWNhdXNlIHRoZXkgZGVwZW5kIG9uIHRoZSBkaXZfaWQpXG4gICAgICAgIHNldF9kaXZfaWQoZGl2KTtcbiAgICAgICAgZ0Jyb3dzZXIgPSBnQjtcbiAgICAgICAgZ0Iuem9vbV9pbigxNTApO1xuXG4gICAgICAgIGVuc2VtYmxSZXN0QXBpID0gdG50LmJvYXJkLnRyYWNrLmRhdGEuZ2Vub21lLmVuc2VtYmw7XG4gICAgICAgIC8vZW5zZW1ibFJlc3RBcGkgPSBnQi5yZXN0KCk7XG5cbiAgICAgICAgLy8gSWYgdGhlIG5hdiBpcyBzaG93biBvciBub3RcbiAgICAgICAgbmF2VGhlbWVcbiAgICAgICAgICAgIC5zaG93X29wdGlvbnMoY29uZi5zaG93X25hdik7XG5cbiAgICAgICAgLy8gdG9vbHRpcHNcbiAgICAgICAgdmFyIHRvb2x0aXBzID0gYnJvd3Nlcl90b29sdGlwcygpXG4gICAgICAgICAgICAuY3R0dlJlc3RBcGkgKGNvbmYuY3R0dlJlc3RBcGkpXG4gICAgICAgICAgICAuZW5zZW1ibFJlc3RBcGkgKGVuc2VtYmxSZXN0QXBpKVxuICAgICAgICAgICAgLnByZWZpeCAoY29uZi5saW5rc19wcmVmaXgpXG4gICAgICAgICAgICAudmlldyAoZ0IpO1xuXG4gICAgICAgIC8vIFRyYW5zY3JpcHQgZGF0YVxuICAgICAgICB2YXIgbWl4ZWREYXRhID0gdG50LmJvYXJkLnRyYWNrLmRhdGEuZ2Vub21lLmdlbmUoKTtcbiAgICAgICAgdmFyIGdlbmVfdXBkYXRlciA9IG1peGVkRGF0YS5yZXRyaWV2ZXIoKTtcbiAgICAgICAgbWl4ZWREYXRhLnJldHJpZXZlciAoZnVuY3Rpb24gKGxvYykge1xuICAgICAgICAgICAgcmV0dXJuIGdlbmVfdXBkYXRlcihsb2MpXG4gICAgICAgICAgICAgICAgLnRoZW4gKGZ1bmN0aW9uIChmdWxsR2VuZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdlbmVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxmdWxsR2VuZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBnZW5lID0gZnVsbEdlbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdlbmUuaWQgIT09IGdCLmdlbmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmUua2V5ID0gZ2VuZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lLmlzR2VuZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZS5leG9ucyA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBnZW5lLnN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IGdlbmUuZW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2Rpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNHZW5lOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXMucHVzaChnZW5lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSBlbnNlbWJsUmVzdEFwaS51cmwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmVuZHBvaW50KFwiL2xvb2t1cC9pZC86aWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wYXJhbWV0ZXJzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZ0IuZ2VuZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGFuZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHZhciB1cmwgPSBlbnNlbWJsUmVzdEFwaS51cmwuZ2VuZSh7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBpZDogZ0IuZ2VuZSgpLFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgZXhwYW5kOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW5zZW1ibFJlc3RBcGkuY2FsbCh1cmwpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbiAoZnVuY3Rpb24gKHJlc3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZyA9IHJlc3AuYm9keTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHNzID0gdG50LmJvYXJkLnRyYWNrLmRhdGEuZ2Vub21lLnRyYW5zY3JpcHQoKS5nZW5lMlRyYW5zY3JpcHRzKGcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTx0c3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRzID0gdHNzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3ZlcmxhcHMoW2xvYy5mcm9tLCBsb2MudG9dLCBbdHMuc3RhcnQsIHRzLmVuZF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcy5wdXNoKHRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnZW5lcyA9IGdlbmVzLmNvbmNhdCh0c3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVzLm1hcChnZW5lX2NvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR1cExlZ2VuZChnZW5lcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBvdmVybGFwcyA9IGZ1bmN0aW9uIChyZWYsIGZlYXQpIHtcbiAgICAgICAgICAgIGlmIChyZWZbMF0gPCBmZWF0WzBdICYmIHJlZlsxXSA+IGZlYXRbMV0pIHsgLy8gZmVhdCBpbnNpZGVcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZWZbMF0gPiBmZWF0WzBdICYmIHJlZlsxXSA8IGZlYXRbMV0pIHsgLy8gaW5zaWRlIC0tIHJpZ2h0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVmWzBdID4gZmVhdFswXSAmJiByZWZbMV0gPiBmZWF0WzFdKSB7IC8vIGluc2lkZSAtLSBsZWZ0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVmWzFdID4gZmVhdFswXSAmJiByZWZbMV0gPCBmZWF0WzFdKSB7IC8vIGZlYXQgZXhwYW5kcyBib3RoIHNpZGVzXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHNldHVwTGVnZW5kID0gZnVuY3Rpb24gKGdlbmVzKSB7XG4gICAgICAgICAgICAvLyBBbmQgd2Ugc2V0dXAvdXBkYXRlIHRoZSBsZWdlbmRcbiAgICAgICAgICAgIHZhciBiaW90eXBlc19hcnJheSA9IGdlbmVzLm1hcChmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmlvdHlwZXMubGVnZW5kW2UuYmlvdHlwZV07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGFsc28gdGhlIG9uZXMgZm9yIHRoZSB0cmFuc2NyaXB0IG9mIHRoZSBtYXRjaGluZyBnZW5lXG4gICAgICAgICAgICB2YXIgdHJhbnNjcmlwdF9iaW90eXBlcyA9IGdlbmVzLmZpbHRlciAoZnVuY3Rpb24gKGUyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUyLmdlbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUyLmdlbmUuaWQgPT09IGdCLmdlbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUyLmlkID09PSBnQi5nZW5lKCk7XG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gZTIuZ2VuZS5pZCA9PT0gZ0IuZ2VuZSgpO1xuICAgICAgICAgICAgfSkubWFwIChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBiaW90eXBlcy5sZWdlbmRbZS5iaW90eXBlXTtcbiAgICAgICAgICAgICAgICAvL3JldHVybiBiaW90eXBlcy5sZWdlbmRbZS50cmFuc2NyaXB0LmJpb3R5cGVdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJpb3R5cGVzX2FycmF5ID0gYmlvdHlwZXNfYXJyYXkuY29uY2F0KHRyYW5zY3JpcHRfYmlvdHlwZXMpO1xuXG4gICAgICAgICAgICB2YXIgYmlvdHlwZXNfaGFzaCA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGJpb3R5cGVzX2FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYmlvdHlwZXNfaGFzaFtiaW90eXBlc19hcnJheVtpXV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGN1cnJfYmlvdHlwZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gYmlvdHlwZXNfaGFzaCkge1xuICAgICAgICAgICAgICAgIGlmIChiaW90eXBlc19oYXNoLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJfYmlvdHlwZXMucHVzaChwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYmlvdHlwZV9sZWdlbmQgPSBnZW5lX2xlZ2VuZF9kaXYuc2VsZWN0QWxsKFwiLnRudF9iaW90eXBlX2xlZ2VuZFwiKVxuICAgICAgICAgICAgICAgIC5kYXRhKGN1cnJfYmlvdHlwZXMsIGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZDtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIG5ld19sZWdlbmQgPSBiaW90eXBlX2xlZ2VuZFxuICAgICAgICAgICAgICAgIC5lbnRlcigpXG4gICAgICAgICAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0bnRfYmlvdHlwZV9sZWdlbmRcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJkaXNwbGF5XCIsIFwiaW5saW5lXCIpO1xuXG4gICAgICAgICAgICBuZXdfbGVnZW5kXG4gICAgICAgICAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImRpc3BsYXlcIiwgXCJpbmxpbmUtYmxvY2tcIilcbiAgICAgICAgICAgICAgICAuc3R5bGUoXCJtYXJnaW5cIiwgXCIwcHggNXB4IDBweCAxNXB4XCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwid2lkdGhcIiwgXCIxMHB4XCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiaGVpZ2h0XCIsIFwiMTBweFwiKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImJvcmRlclwiLCBcIjFweCBzb2xpZCAjMDAwXCIpXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiYmFja2dyb3VuZFwiLCBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJpb3R5cGVzLmNvbG9yW2RdO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBuZXdfbGVnZW5kXG4gICAgICAgICAgICAgICAgLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgICAgICAgICAudGV4dChmdW5jdGlvbihkKXtyZXR1cm4gZDt9KTtcblxuICAgICAgICAgICAgYmlvdHlwZV9sZWdlbmRcbiAgICAgICAgICAgICAgICAuZXhpdCgpXG4gICAgICAgICAgICAgICAgLnJlbW92ZSgpO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gVFJBQ0tTIVxuICAgICAgICAvLyBDbGluVmFyIHRyYWNrXG4gICAgICAgIHZhciByZWdpb25FbnNlbWJsUHJvbWlzZSA9IGZ1bmN0aW9uIChsb2MpIHtcbiAgICAgICAgICAgIHZhciByZWdpb25VcmwgPSBlbnNlbWJsUmVzdEFwaS51cmwoKVxuICAgICAgICAgICAgICAgIC5lbmRwb2ludChcIm92ZXJsYXAvcmVnaW9uLzpzcGVjaWVzLzpyZWdpb25cIilcbiAgICAgICAgICAgICAgICAucGFyYW1ldGVycyh7XG4gICAgICAgICAgICAgICAgICAgIHNwZWNpZXM6IGxvYy5zcGVjaWVzLFxuICAgICAgICAgICAgICAgICAgICByZWdpb246IChsb2MuY2hyICsgXCI6XCIgKyBsb2MuZnJvbSArIFwiLVwiICsgbG9jLnRvKSxcbiAgICAgICAgICAgICAgICAgICAgZmVhdHVyZTogW1wiZ2VuZVwiXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gdmFyIHJlZ2lvblVybCA9IGVuc2VtYmxSZXN0QXBpLnVybC5yZWdpb24gKHtcbiAgICAgICAgICAgIC8vICAgICBzcGVjaWVzOiBsb2Muc3BlY2llcyxcbiAgICAgICAgICAgIC8vICAgICBjaHI6IGxvYy5jaHIsXG4gICAgICAgICAgICAvLyAgICAgZnJvbTogbG9jLmZyb20sXG4gICAgICAgICAgICAvLyAgICAgdG86IGxvYy50byxcbiAgICAgICAgICAgIC8vICAgICBmZWF0dXJlczogW1wiZ2VuZVwiXVxuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICByZXR1cm4gZW5zZW1ibFJlc3RBcGkuY2FsbChyZWdpb25VcmwpXG4gICAgICAgICAgICAgICAgLnRoZW4gKGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwLmJvZHk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNsaW52YXJfdXBkYXRlciA9IHRudC5ib2FyZC50cmFjay5kYXRhLmFzeW5jKClcbiAgICAgICAgICAgIC5yZXRyaWV2ZXIgKGZ1bmN0aW9uIChsb2MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVnaW9uRW5zZW1ibFByb21pc2UobG9jKVxuICAgICAgICAgICAgICAgICAgICAudGhlbiAoZnVuY3Rpb24gKGdlbmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxsR2VuZXNQcm9taXNlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdlbmVJZHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxnZW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVJZHMucHVzaChnZW5lc1tpXS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcCA9IHBpcGVsaW5lcygpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZW5zZW1ibFJlc3RBcGkgKGVuc2VtYmxSZXN0QXBpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmN0dHZSZXN0QXBpIChjb25mLmN0dHZSZXN0QXBpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJhcmUoZ2VuZUlkcywgY29uZi5lZm8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxsR2VuZXNQcm9taXNlcy5wdXNoKHApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJTVlAuYWxsKGFsbEdlbmVzUHJvbWlzZXMpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbiAoZnVuY3Rpb24gKHJlc3BzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmxhdHRlbmVkU05QcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHJlc3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3AgPSByZXNwc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBzbnAgaW4gcmVzcC5zbnBzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwLnNucHMuaGFzT3duUHJvcGVydHkoc25wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxhdHRlbmVkU05Qcy5wdXNoIChyZXNwLnNucHNbc25wXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmxhdHRlbmVkU05QcztcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB2YXIgZm9yZWdyb3VuZF9jb2xvciA9IGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAvLyBoaWdobGlnaHQgbWVhbnMgc2FtZSBkaXNlYXNlXG4gICAgICAgICAgICBpZiAoZC5oaWdobGlnaHQgJiYgKGdCLmdlbmUoKSA9PT0gZC50YXJnZXQuZ2VuZWlkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzbnBDb2xvcnMuVGFyZ2V0RGlzZWFzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZC5oaWdobGlnaHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc25wQ29sb3JzLkRpc2Vhc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGdCLmdlbmUoKSA9PT0gZC50YXJnZXQuZ2VuZWlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNucENvbG9ycy5UYXJnZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc25wQ29sb3JzLk90aGVyO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjbGludmFyX2Rpc3BsYXkgPSB0bnQuYm9hcmQudHJhY2suZmVhdHVyZS5waW4oKVxuICAgICAgICAgICAgLmRvbWFpbihbMC4zLCAxLjJdKVxuICAgICAgICAgICAgLmNvbG9yIChmb3JlZ3JvdW5kX2NvbG9yKVxuICAgICAgICAgICAgLmluZGV4KGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGQubmFtZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCB0b29sdGlwcy5zbnApXG4gICAgICAgICAgICAubGF5b3V0KHRudC5ib2FyZC50cmFjay5sYXlvdXQoKVxuICAgICAgICAgICAgICAgIC5lbGVtZW50cyhmdW5jdGlvbihlbGVtcykge1xuICAgICAgICAgICAgICAgICAgICBhZ2dyZWdhdGlvbihlbGVtcywgY2xpbnZhcl9kaXNwbGF5LnNjYWxlKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIHZhciBjbGludmFyX3RyYWNrID0gdG50LmJvYXJkLnRyYWNrKClcbiAgICAgICAgICAgIC5sYWJlbChcIlZhcmlhbnRzIGluIHJhcmUgZGlzZWFzZXNcIilcbiAgICAgICAgICAgIC5oZWlnaHQoNjApXG4gICAgICAgICAgICAuY29sb3IoXCJ3aGl0ZVwiKVxuICAgICAgICAgICAgLmRpc3BsYXkoY2xpbnZhcl9kaXNwbGF5KVxuICAgICAgICAgICAgLmRhdGEgKGNsaW52YXJfdXBkYXRlcik7XG5cbiAgICAgICAgLy8gQXN5bmMgR3dhcyB1cGRhdGVyIGZvciBBTEwgZ2VuZXNcbiAgICAgICAgLy8gdmFyIGd3YXNfc3Bpbm5lciA9IHNwaW5uZXIoKTtcbiAgICAgICAgdmFyIGd3YXNfdXBkYXRlciA9IHRudC5ib2FyZC50cmFjay5kYXRhLmFzeW5jKClcbiAgICAgICAgICAgIC5yZXRyaWV2ZXIgKGZ1bmN0aW9uIChsb2MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVnaW9uRW5zZW1ibFByb21pc2UobG9jKVxuICAgICAgICAgICAgICAgICAgICAudGhlbiAoZnVuY3Rpb24gKGdlbmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxsR2VuZXNQcm9taXNlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdlbmVJZHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxnZW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVJZHMucHVzaChnZW5lc1tpXS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ2VuZSA9IGdlbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHAgPSBwaXBlbGluZXMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmVuc2VtYmxSZXN0QXBpIChlbnNlbWJsUmVzdEFwaSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jdHR2UmVzdEFwaSAoY29uZi5jdHR2UmVzdEFwaSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb21tb24oZ2VuZUlkcywgY29uZi5lZm8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxsR2VuZXNQcm9taXNlcy5wdXNoKHApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUlNWUC5hbGwoYWxsR2VuZXNQcm9taXNlcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuIChmdW5jdGlvbiAocmVzcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmbGF0dGVuZWRTTlBzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8cmVzcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcCA9IHJlc3BzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHNucCBpbiByZXNwLnNucHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3Auc25wcy5oYXNPd25Qcm9wZXJ0eShzbnApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGF0dGVuZWRTTlBzLnB1c2gocmVzcC5zbnBzW3NucF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZsYXR0ZW5lZFNOUHM7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gR3dhcyB0cmFja1xuICAgICAgICB2YXIgZ3dhc19kaXNwbGF5ID0gdG50LmJvYXJkLnRyYWNrLmZlYXR1cmUucGluKClcbiAgICAgICAgICAgIC5kb21haW4oWzAuMywxLjJdKVxuICAgICAgICAgICAgLmluZGV4KGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGQubmFtZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY29sb3IgKGZvcmVncm91bmRfY29sb3IpXG4gICAgICAgICAgICAub24oXCJjbGlja1wiLCB0b29sdGlwcy5zbnApXG4gICAgICAgICAgICAubGF5b3V0KHRudC5ib2FyZC50cmFjay5sYXlvdXQoKVxuICAgICAgICAgICAgICAgIC5lbGVtZW50cyhmdW5jdGlvbiAoZWxlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYWdncmVnYXRpb24oZWxlbXMsIGNsaW52YXJfZGlzcGxheS5zY2FsZSgpKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAvL3ZhciBnd2FzX2d1aWRlciA9IGd3YXNfZGlzcGxheS5ndWlkZXIoKTtcbiAgICAgICAgLy8gZ3dhc19kaXNwbGF5Lmd1aWRlciAoZnVuY3Rpb24gKHdpZHRoKSB7XG4gICAgICAgIC8vICAgICB2YXIgdHJhY2sgPSB0aGlzO1xuICAgICAgICAvLyAgICAgdmFyIHAwX29mZnNldCA9IDE2LjExO1xuICAgICAgICAvLyAgICAgdmFyIHAwNV9vZmZzZXQgPSA0My44OFxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgLy8gcHZhbHVlIDBcbiAgICAgICAgLy8gICAgIHRyYWNrLmdcbiAgICAgICAgLy8gICAgIC5hcHBlbmQoXCJsaW5lXCIpXG4gICAgICAgIC8vICAgICAuYXR0cihcIngxXCIsIDApXG4gICAgICAgIC8vICAgICAuYXR0cihcInkxXCIsIHAwX29mZnNldClcbiAgICAgICAgLy8gICAgIC8vLmF0dHIoXCJ5MVwiLCB5X29mZnNldClcbiAgICAgICAgLy8gICAgIC5hdHRyKFwieDJcIiwgd2lkdGgpXG4gICAgICAgIC8vICAgICAgICAgLmF0dHIoXCJ5MlwiLCBwMF9vZmZzZXQpXG4gICAgICAgIC8vICAgICAvLy5hdHRyKFwieTJcIiwgeV9vZmZzZXQpXG4gICAgICAgIC8vICAgICAuYXR0cihcInN0cm9rZVwiLCBcImxpZ2h0Z3JleVwiKTtcbiAgICAgICAgLy8gICAgIHRyYWNrLmdcbiAgICAgICAgLy8gICAgIC5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgIC8vICAgICAuYXR0cihcInhcIiwgd2lkdGggLSA1MClcbiAgICAgICAgLy8gICAgIC5hdHRyKFwieVwiLCBwMF9vZmZzZXQgKyAxMClcbiAgICAgICAgLy8gICAgIC5hdHRyKFwiZm9udC1zaXplXCIsIDEwKVxuICAgICAgICAvLyAgICAgLmF0dHIoXCJmaWxsXCIsIFwibGlnaHRncmV5XCIpXG4gICAgICAgIC8vICAgICAudGV4dChcInB2YWx1ZSAwXCIpO1xuXG4gICAgICAgIC8vIHB2YWx1ZSAwLjVcbiAgICAgICAgLy8gdHJhY2suZ1xuICAgICAgICAvLyBcdC5hcHBlbmQoXCJsaW5lXCIpXG4gICAgICAgIC8vIFx0LmF0dHIoXCJ4MVwiLCAwKVxuICAgICAgICAvLyBcdC5hdHRyKFwieTFcIiwgcDA1X29mZnNldClcbiAgICAgICAgLy8gXHQuYXR0cihcIngyXCIsIHdpZHRoKVxuICAgICAgICAvLyBcdC5hdHRyKFwieTJcIiwgcDA1X29mZnNldClcbiAgICAgICAgLy8gXHQuYXR0cihcInN0cm9rZVwiLCBcImxpZ2h0Z3JleVwiKVxuICAgICAgICAvLyB0cmFjay5nXG4gICAgICAgIC8vIFx0LmFwcGVuZChcInRleHRcIilcbiAgICAgICAgLy8gXHQuYXR0cihcInhcIiwgd2lkdGggLSA1MClcbiAgICAgICAgLy8gXHQuYXR0cihcInlcIiwgcDA1X29mZnNldCArIDEwKVxuICAgICAgICAvLyBcdC5hdHRyKFwiZm9udC1zaXplXCIsIDEwKVxuICAgICAgICAvLyBcdC5hdHRyKFwiZmlsbFwiLCBcImxpZ2h0Z3JleVwiKVxuICAgICAgICAvLyBcdC50ZXh0KFwicHZhbHVlIDAuNVwiKTtcblxuICAgICAgICAvLyBjb250aW51ZSB3aXRoIHJlc3Qgb2YgZ3VpZGVyXG4gICAgICAgIC8vZ3dhc19ndWlkZXIuY2FsbCh0cmFjaywgd2lkdGgpO1xuXG4gICAgICAgIC8vfSk7XG5cbiAgICAgICAgdmFyIGd3YXNfdHJhY2sgPSB0bnQuYm9hcmQudHJhY2soKVxuICAgICAgICAgICAgLmxhYmVsKFwiVmFyaWFudHMgaW4gY29tbW9uIGRpc2Vhc2VzXCIpXG4gICAgICAgICAgICAuaGVpZ2h0KDYwKVxuICAgICAgICAgICAgLmNvbG9yKFwid2hpdGVcIilcbiAgICAgICAgICAgIC5kaXNwbGF5KGd3YXNfZGlzcGxheSlcbiAgICAgICAgICAgIC5kYXRhIChnd2FzX3VwZGF0ZXIpO1xuXG4gICAgICAgIC8vIEF1eCB0cmFjayBmb3IgbGFiZWxcbiAgICAgICAgdmFyIHRyYW5zY3JpcHRfbGFiZWxfdHJhY2sgPSB0bnQuYm9hcmQudHJhY2soKVxuICAgICAgICAgICAgLmxhYmVsIChcIkdlbmVzIC8gVHJhbnNjcmlwdHNcIilcbiAgICAgICAgICAgIC5oZWlnaHQoMjApXG4gICAgICAgICAgICAuY29sb3IgKFwiI0ZGRkZGRlwiKVxuICAgICAgICAgICAgLmRpc3BsYXkodG50LmJvYXJkLnRyYWNrLmZlYXR1cmUuYmxvY2soKSlcbiAgICAgICAgICAgIC5kYXRhKHRudC5ib2FyZC50cmFjay5kYXRhLnN5bmMoKVxuICAgICAgICAgICAgICAgICAgICAucmV0cmlldmVyIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIC8vIFRyYW5zY3JpcHQgLyBHZW5lIHRyYWNrXG4gICAgICAgIHZhciB0cmFuc2NyaXB0X3RyYWNrID0gdG50LmJvYXJkLnRyYWNrKClcbiAgICAgICAgICAgIC5oZWlnaHQoZ2VuZVRyYWNrSGVpZ2h0KVxuICAgICAgICAgICAgLmNvbG9yKFwiI0ZGRkZGRlwiKVxuICAgICAgICAgICAgLmRpc3BsYXkodG50LmJvYXJkLnRyYWNrLmZlYXR1cmUuZ2Vub21lLnRyYW5zY3JpcHQoKVxuICAgICAgICAgICAgICAgIC5jb2xvciAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQuZmVhdHVyZUNvbG9yO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgdG9vbHRpcHMuZ2VuZSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC8vIC5kYXRhKHRyYW5zY3JpcHRfZGF0YSk7XG4gICAgICAgICAgICAuZGF0YShtaXhlZERhdGEpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgdHJhY2sgYmFzZWQgb24gdGhlIG51bWJlciBvZiBuZWVkZWQgc2xvdHMgZm9yIHRoZSBnZW5lc1xuICAgICAgICB0cmFuc2NyaXB0X3RyYWNrLmRpc3BsYXkoKS5sYXlvdXQoKVxuICAgICAgICAgICAgLmtlZXBfc2xvdHMoZmFsc2UpXG4gICAgICAgICAgICAuZml4ZWRfc2xvdF90eXBlKFwiZXhwYW5kZWRcIilcbiAgICAgICAgICAgIC5vbl9sYXlvdXRfcnVuIChmdW5jdGlvbiAodHlwZXMsIGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmVlZGVkX2hlaWdodCA9IHR5cGVzLmV4cGFuZGVkLm5lZWRlZF9zbG90cyAqIHR5cGVzLmV4cGFuZGVkLnNsb3RfaGVpZ2h0O1xuICAgICAgICAgICAgICAgIGlmIChuZWVkZWRfaGVpZ2h0ICE9PSBnZW5lVHJhY2tIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5lZWRlZF9oZWlnaHQgPCAyMDApIHsgLy8gTWluaW11bSBvZiAyMDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVUcmFja0hlaWdodCA9IDIwMDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVUcmFja0hlaWdodCA9IG5lZWRlZF9oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZ2VuZVRyYWNrSGVpZ2h0ID0gbmVlZGVkX2hlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNjcmlwdF90cmFjay5oZWlnaHQobmVlZGVkX2hlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGdCLnRyYWNrcyhnQi50cmFja3MoKSk7IC8vIHJlb3JkZXIgcmUtY29tcHV0ZXMgdHJhY2sgaGVpZ2h0c1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvLyBTZXF1ZW5jZSB0cmFja1xuICAgICAgICB2YXIgc2VxdWVuY2VfdHJhY2sgPSB0bnQuYm9hcmQudHJhY2soKVxuICAgICAgICAgICAgLmxhYmVsIChcInNlcXVlbmNlXCIpXG4gICAgICAgICAgICAuaGVpZ2h0KDMwKVxuICAgICAgICAgICAgLmNvbG9yKFwid2hpdGVcIilcbiAgICAgICAgICAgIC5kaXNwbGF5KHRudC5ib2FyZC50cmFjay5mZWF0dXJlLmdlbm9tZS5zZXF1ZW5jZSgpKVxuICAgICAgICAgICAgLmRhdGEodG50LmJvYXJkLnRyYWNrLmRhdGEuZ2Vub21lLnNlcXVlbmNlKClcbiAgICAgICAgICAgICAgICAubGltaXQoMjAwKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBnQnJvd3NlclRoZW1lLnN0YXJ0KCk7XG5cbiAgICAgICAgLy8gVGhlIG9yZGVyIG9mIHRoZSBlbGVtZW50cyBhcmU6IE5hdiBkaXYgLy8gZ2Vub21lIGJyb3dzZXIgZGl2IC8vIGxlZ2VuZCBkaXZcbiAgICAgICAgLy8gbmF2IGRpdlxuICAgICAgICBuYXZEaXYgPSBkMy5zZWxlY3QoZGl2KVxuICAgICAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwid2lkdGhcIiwgXCI5NTBweFwiKTtcbiAgICAgICAgLy8gTmF2aWdhdGlvblxuICAgICAgICBuYXZUaGVtZSAoZ0Jyb3dzZXIsIG5hdkRpdi5ub2RlKCkpO1xuXG4gICAgICAgIGdCcm93c2VyKGRpdik7XG5cbiAgICAgICAgLy8gVGhlIGxlZ2VuZCBmb3IgdGhlIGdlbmUgY29sb3JzXG4gICAgICAgIHZhciBnZW5lX2xlZ2VuZF9kaXYgPSBkMy5zZWxlY3QoZGl2KVxuICAgICAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRudF9sZWdlbmRfZGl2XCIpO1xuXG4gICAgICAgIGdlbmVfbGVnZW5kX2RpdlxuICAgICAgICAgICAgLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0bnRfbGVnZW5kX2hlYWRlclwiKVxuICAgICAgICAgICAgLnRleHQoXCJHZW5lIGxlZ2VuZDpcIik7XG5cbiAgICAgICAgIGQzLnNlbGVjdEFsbChcInRudF9iaW90eXBlXCIpXG4gICAgICAgICAgICAuZGF0YSh0cmFuc2NyaXB0X3RyYWNrLmRhdGEoKS5lbGVtZW50cygpKTtcblxuICAgICAgICAvLyBUaGUgbGVnZW4gZm9yIHRoZSBzbnBzIGNvbG9yc1xuICAgICAgICBzbnBfbGVnZW5kX2RpdiA9IGQzLnNlbGVjdChkaXYpXG4gICAgICAgICAgICAuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwidG50X2xlZ2VuZF9kaXZcIik7XG4gICAgICAgIHNucF9sZWdlbmRfZGl2XG4gICAgICAgICAgICAuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRudF9sZWdlbmRfaGVhZGVyXCIpXG4gICAgICAgICAgICAudGV4dChcIlNOUHMgbGVnZW5kOlwiKTtcblxuICAgICAgICBpZiAoY29uZi5zaG93X3NucHMpIHtcbiAgICAgICAgICAgIHRyYWNrcy5jb21tb25fc25wcyA9IGd3YXNfdHJhY2s7XG4gICAgICAgICAgICBnQnJvd3Nlci5hZGRfdHJhY2soZ3dhc190cmFjayk7XG5cbiAgICAgICAgICAgIHRyYWNrcy5yYXJlX3NucHMgPSBjbGludmFyX3RyYWNrO1xuICAgICAgICAgICAgZ0Jyb3dzZXIuYWRkX3RyYWNrKGNsaW52YXJfdHJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJhY2tzLmdlbmUgPSB0cmFuc2NyaXB0X3RyYWNrO1xuICAgICAgICBnQnJvd3NlclxuICAgICAgICAgICAgLmFkZF90cmFjayhzZXF1ZW5jZV90cmFjaylcbiAgICAgICAgICAgIC5hZGRfdHJhY2sodHJhbnNjcmlwdF9sYWJlbF90cmFjaylcbiAgICAgICAgICAgIC5hZGRfdHJhY2sodHJhbnNjcmlwdF90cmFjayk7XG5cblxuICAgICAgICAvLyBMaW5rcyBkaXZcbiAgICAgICAgdmFyIGxpbmtzX3BhbmUgPSBkMy5zZWxlY3QoZGl2KVxuICAgICAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRudF9saW5rc19wYW5lXCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJkaXNwbGF5XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChjb25mLnNob3dfbGlua3MpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiYmxvY2tcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZW5zZW1ibFxuICAgICAgICBsaW5rc19wYW5lXG4gICAgICAgICAgICAuYXBwZW5kKFwic3BhblwiKVxuICAgICAgICAgICAgLnRleHQoXCJPcGVuIGluIEVuc2VtYmxcIik7XG5cbiAgICAgICAgdmFyIGVuc2VtYmxMb2MgPSBsaW5rc19wYW5lXG4gICAgICAgICAgICAuYXBwZW5kKFwiaVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ0aXRsZVwiLCBcIm9wZW4gcmVnaW9uIGluIGVuc2VtYmxcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjdHR2R2Vub21lQnJvd3Nlckljb24gZmEgZmEtZXh0ZXJuYWwtbGluayBmYS0yeFwiKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7dmFyIGxpbmsgPSBidWlsZEVuc2VtYmxMaW5rKCk7IHdpbmRvdy5vcGVuKGxpbmssIFwiX2JsYW5rXCIpO30pO1xuXG4gICAgfTtcblxuICAgIC8vLyoqKioqKioqKioqKioqKioqKioqKi8vLy9cbiAgICAvLy8gUkVOREVSSU5HIEZVTkNUSU9OUyAvLy8vXG4gICAgLy8vKioqKioqKioqKioqKioqKioqKioqLy8vL1xuICAgIC8vIEFQSVxuICAgIC8vIERBVEFcbiAgICB2YXIgc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBnZW5lVXJsID0gZW5zZW1ibFJlc3RBcGkudXJsKClcbiAgICAgICAgICAgIC5lbmRwb2ludChcImxvb2t1cC9pZC86aWRcIilcbiAgICAgICAgICAgIC5wYXJhbWV0ZXJzKHtcbiAgICAgICAgICAgICAgICBpZDogZ0Jyb3dzZXIuZ2VuZSgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gdmFyIGdlbmVVcmwgPSBlbnNlbWJsUmVzdEFwaS51cmwuZ2VuZSAoe1xuICAgICAgICAvLyAgICAgaWQ6IGdCLmdlbmUoKVxuICAgICAgICAvLyB9KTtcbiAgICAgICAgdmFyIGdlbmVQcm9taXNlID0gZW5zZW1ibFJlc3RBcGkuY2FsbChnZW5lVXJsKVxuICAgICAgICAgICAgLnRoZW4gKGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3AuYm9keTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBkaXNlYXNlUHJvbWlzZTtcbiAgICAgICAgaWYgKGNvbmYuZWZvKSB7XG4gICAgICAgICAgICB2YXIgZWZvVXJsID0gY29uZi5jdHR2UmVzdEFwaS51cmwuZGlzZWFzZSh7XG4gICAgICAgICAgICAgICAgY29kZTogY29uZi5lZm9cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkaXNlYXNlUHJvbWlzZSA9IGNvbmYuY3R0dlJlc3RBcGkuY2FsbChlZm9VcmwpXG4gICAgICAgICAgICAgICAgLnRoZW4gKGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwLmJvZHk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAvLyBTTlBzIENsaW5WYXJcbiAgICAgICAgdmFyIHNucHNDbGludmFyUHJvbWlzZTtcbiAgICAgICAgaWYgKGNvbmYuc2hvd19zbnBzKSB7XG4gICAgICAgICAgICBzbnBzQ2xpbnZhclByb21pc2UgPSBwaXBlbGluZXMoKVxuICAgICAgICAgICAgICAgIC5lbnNlbWJsUmVzdEFwaSAoZW5zZW1ibFJlc3RBcGkpXG4gICAgICAgICAgICAgICAgLmN0dHZSZXN0QXBpIChjb25mLmN0dHZSZXN0QXBpKVxuICAgICAgICAgICAgICAgIC5yYXJlIChnQnJvd3Nlci5nZW5lKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc25wc0NsaW52YXJQcm9taXNlID0gbmV3IFByb21pc2UgKGZ1bmN0aW9uIChyZXMsIHJlaikge1xuICAgICAgICAgICAgICAgIHJlcyh7fSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC8vIFNOUCBHV0FTc1xuICAgICAgICB2YXIgc25wc0d3YXNQcm9taXNlO1xuICAgICAgICBpZiAoY29uZi5zaG93X3NucHMpIHtcbiAgICAgICAgICAgIHNucHNHd2FzUHJvbWlzZSA9IHBpcGVsaW5lcygpXG4gICAgICAgICAgICAgICAgLmVuc2VtYmxSZXN0QXBpIChlbnNlbWJsUmVzdEFwaSlcbiAgICAgICAgICAgICAgICAuY3R0dlJlc3RBcGkgKGNvbmYuY3R0dlJlc3RBcGkpXG4gICAgICAgICAgICAgICAgLmNvbW1vbiAoZ0Jyb3dzZXIuZ2VuZSgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNucHNHd2FzUHJvbWlzZSA9IG5ldyBQcm9taXNlIChmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7fSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIFJTVlAuYWxsIChbZ2VuZVByb21pc2UsIHNucHNHd2FzUHJvbWlzZSwgc25wc0NsaW52YXJQcm9taXNlLCBkaXNlYXNlUHJvbWlzZV0pXG4gICAgICAgICAgICAudGhlbiAoZnVuY3Rpb24gKHJlc3BzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpc2Vhc2UgPSByZXNwc1szXTtcbiAgICAgICAgICAgICAgICB2YXIgZ2VuZSA9IHJlc3BzWzBdO1xuICAgICAgICAgICAgICAgIGZpbGxTTlBMZWdlbmQgKGdlbmUsIGRpc2Vhc2UpO1xuICAgICAgICAgICAgICAgIHZhciBnZW5lX2V4dGVudCA9IFtnZW5lLnN0YXJ0LCBnZW5lLmVuZF07XG4gICAgICAgICAgICAgICAgdmFyIGd3YXNfZXh0ZW50ID0gcmVzcHNbMV0uZXh0ZW50O1xuICAgICAgICAgICAgICAgIHZhciBjbGludmFyX2V4dGVudCA9IHJlc3BzWzJdLmV4dGVudDtcblxuICAgICAgICAgICAgICAgIHZhciBnd2FzTGVuZ3RoID0gZ3dhc19leHRlbnQgPyAoZ3dhc19leHRlbnRbMV0gLSBnd2FzX2V4dGVudFswXSkgOiAwO1xuICAgICAgICAgICAgICAgIHZhciBjbGludmFyTGVuZ3RoID0gY2xpbnZhcl9leHRlbnQgPyAoY2xpbnZhcl9leHRlbnRbMV0gLSBjbGludmFyX2V4dGVudFswXSkgOiAwO1xuICAgICAgICAgICAgICAgIHZhciBnZW5lTGVuZ3RoID0gZ2VuZV9leHRlbnRbMV0gLSBnZW5lX2V4dGVudFswXTtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIHZhciBnd2FzU3RhcnQgPSBnd2FzX2V4dGVudCA/ICh+fihnd2FzX2V4dGVudFswXSAtIChnd2FzTGVuZ3RoLzUpKSkgOiBJbmZpbml0eTtcbiAgICAgICAgICAgICAgICB2YXIgZ3dhc0VuZCAgID0gZ3dhc19leHRlbnQgPyAofn4oZ3dhc19leHRlbnRbMV0gKyAoZ3dhc0xlbmd0aC81KSkpIDogLUluZmluaXR5O1xuICAgICAgICAgICAgICAgIHZhciBjbGludmFyU3RhcnQgPSBjbGludmFyX2V4dGVudCA/ICh+fihjbGludmFyX2V4dGVudFswXSAtIChjbGludmFyTGVuZ3RoLzUpKSkgOiBJbmZpbml0eTtcbiAgICAgICAgICAgICAgICB2YXIgY2xpbnZhckVuZCA9IGNsaW52YXJfZXh0ZW50ID8gKH5+KGNsaW52YXJfZXh0ZW50WzFdICsgKGNsaW52YXJMZW5ndGgvNSkpKSA6IC1JbmZpbml0eTtcbiAgICAgICAgICAgICAgICB2YXIgZ2VuZVN0YXJ0ID0gfn4oZ2VuZV9leHRlbnRbMF0gLSAoZ2VuZUxlbmd0aC81KSk7XG4gICAgICAgICAgICAgICAgdmFyIGdlbmVFbmQgICA9IH5+KGdlbmVfZXh0ZW50WzFdICsgKGdlbmVMZW5ndGgvNSkpO1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgdmFyIHN0YXJ0ID0gZDMubWluKFtnd2FzU3RhcnR8fEluZmluaXR5LCBnZW5lU3RhcnQsIGNsaW52YXJTdGFydHx8SW5maW5pdHldKTtcbiAgICAgICAgICAgICAgICB2YXIgZW5kICAgPSBkMy5tYXgoW2d3YXNFbmR8fDAsIGdlbmVFbmQsIGNsaW52YXJFbmR8fDBdKTtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIHZhciB6b29tT3V0ID0gKGdlbmUuZW5kIC0gZ2VuZS5zdGFydCkgKyAxMDA7XG4gICAgICAgICAgICAgICAgLy8gZ0Iuem9vbV9vdXQoem9vbU91dCk7XG4gICAgICAgICAgICAgICAgLy8gV2UgY2FuIGZpbmFsbHkgc3RhcnQhXG4gICAgICAgICAgICAgICAgZ0Jyb3dzZXIuY2hyKGdlbmUuc2VxX3JlZ2lvbl9uYW1lKTtcbiAgICAgICAgICAgICAgICBuYXZUaGVtZS5vcmlnICh7XG4gICAgICAgICAgICAgICAgICAgIGZyb20gOiBzdGFydCxcbiAgICAgICAgICAgICAgICAgICAgdG8gOiBlbmRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBnQnJvd3Nlci5zdGFydCh7ZnJvbTogc3RhcnQsIHRvOiBlbmR9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBmaWxsU05QTGVnZW5kID0gZnVuY3Rpb24gKGdlbmUsIGRpc2Vhc2UpIHtcbiAgICAgICAgdmFyIHNucF9sZWdlbmRfZGF0YSA9IFtdO1xuICAgICAgICBpZiAoZGlzZWFzZSkge1xuICAgICAgICAgICAgc25wX2xlZ2VuZF9kYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlNOUCBpbiBcIiArIGdlbmUuZGlzcGxheV9uYW1lICsgXCIgYXNzb2NpYXRlZCB3aXRoIFwiICsgZGlzZWFzZS5sYWJlbCxcbiAgICAgICAgICAgICAgICBjb2xvcjogc25wQ29sb3JzLlRhcmdldERpc2Vhc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc25wX2xlZ2VuZF9kYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgIGxhYmVsOiBcIlNOUCBhc3NvY2lhdGVkIHdpdGggXCIgKyBkaXNlYXNlLmxhYmVsICsgXCIgaW4gb3RoZXIgZ2VuZXNcIixcbiAgICAgICAgICAgICAgICBjb2xvcjogc25wQ29sb3JzLkRpc2Vhc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHNucF9sZWdlbmRfZGF0YS5wdXNoKHtcbiAgICAgICAgICAgIGxhYmVsOiBcIlNOUCBpbiBcIiArIGdlbmUuZGlzcGxheV9uYW1lLFxuICAgICAgICAgICAgY29sb3I6IHNucENvbG9ycy5UYXJnZXRcbiAgICAgICAgfSk7XG4gICAgICAgIHNucF9sZWdlbmRfZGF0YS5wdXNoKHtcbiAgICAgICAgICAgIGxhYmVsOiBcIk90aGVyIFNOUFwiLFxuICAgICAgICAgICAgY29sb3I6IHNucENvbG9ycy5PdGhlclxuICAgICAgICB9KTtcblxuICAgICAgICBzbnBfbmV3X2xlZ2VuZCA9IHNucF9sZWdlbmRfZGl2LnNlbGVjdEFsbChcIi50bnRfc25wX2xlZ2VuZFwiKVxuICAgICAgICAgICAgLmRhdGEoc25wX2xlZ2VuZF9kYXRhKVxuICAgICAgICAgICAgLmVudGVyKClcbiAgICAgICAgICAgIC5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJ0bnRfc25wX2xlZ2VuZFwiKTtcblxuICAgICAgICBzbnBfbmV3X2xlZ2VuZFxuICAgICAgICAgICAgLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInRudF9sZWdlbmRfaXRlbVwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiZGlzcGxheVwiLCBcImlubGluZS1ibG9ja1wiKVxuICAgICAgICAgICAgLnN0eWxlKFwibWFyZ2luXCIsIFwiMHB4IDVweCAwcHggMTVweFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwid2lkdGhcIiwgXCIxMHB4XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJoZWlnaHRcIiwgXCIxMHB4XCIpXG4gICAgICAgICAgICAuc3R5bGUoXCJib3JkZXJcIiwgXCIxcHggc29saWQgIzAwMFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiYm9yZGVyLXJhZGl1c1wiLCBcIjVweFwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiYmFja2dyb3VuZFwiLCBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZC5jb2xvcjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHNucF9uZXdfbGVnZW5kXG4gICAgICAgICAgICAuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkLmxhYmVsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgYXBpanMoZ0Jyb3dzZXJUaGVtZSlcbiAgICAgICAgLmdldHNldChjb25mKVxuICAgICAgICAubWV0aG9kKCdzdGFydCcsIHN0YXJ0KVxuICAgICAgICAubWV0aG9kIChcInRyYWNrXCIsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiZ2VuZVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFja3MuZ2VuZTtcbiAgICAgICAgICAgICAgICBjYXNlIFwiY29tbW9uX3NucHNcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhY2tzLmNvbW1vbl9zbnBzO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJyYXJlX3NucHNcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhY2tzLnJhcmVfc25wc2Y7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47IC8vIE5vIHRyYWNrIHJldHVybmVkXG4gICAgICAgIH0pO1xuXG4gICAgdmFyIHNldF9kaXZfaWQgPSBmdW5jdGlvbihkaXYpIHtcbiAgICAgICAgZGl2X2lkID0gZDMuc2VsZWN0KGRpdikuYXR0cihcImlkXCIpO1xuICAgIH07XG5cblxuICAgIC8vLyoqKioqKioqKioqKioqKioqKioqKi8vLy9cbiAgICAvLy8gVVRJTElUWSBNRVRIT0RTICAgICAvLy8vXG4gICAgLy8vKioqKioqKioqKioqKioqKioqKioqLy8vL1xuICAgIC8vIFByaXZhdGUgbWV0aG9kc1xuXG4gICAgdmFyIGJ1aWxkRW5zZW1ibExpbmsgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHVybCA9IFwiaHR0cDovL3d3dy5lbnNlbWJsLm9yZy9cIiArIGdCcm93c2VyLnNwZWNpZXMoKSArIFwiL0xvY2F0aW9uL1ZpZXc/cj1cIiArIGdCcm93c2VyLmNocigpICsgXCIlM0FcIiArIGdCcm93c2VyLmZyb20oKSArIFwiLVwiICsgZ0Jyb3dzZXIudG8oKTtcbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9O1xuXG5cbiAgICBmdW5jdGlvbiBnZW5lX2NvbG9yICh0cmFuc2NyaXB0KSB7XG4gICAgICAgIHZhciBiaW90eXBlID0gdHJhbnNjcmlwdC5iaW90eXBlO1xuXG4gICAgICAgIHZhciBjb2xvciA9IGJpb3R5cGVzLmNvbG9yW2Jpb3R5cGVzLmxlZ2VuZFtiaW90eXBlXV07XG4gICAgICAgIHRyYW5zY3JpcHQuZmVhdHVyZUNvbG9yID0gY29sb3I7XG5cbiAgICAgICAgLy8gY29sb3JzIG11c3QgYmUgc2V0IGluIHRoZSBleG9ucyB0b29cbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHRyYW5zY3JpcHQuZXhvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRyYW5zY3JpcHQuZXhvbnNbaV0uZmVhdHVyZUNvbG9yID0gY29sb3I7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIFB1YmxpYyBtZXRob2RzXG5cblxuICAgIC8qKiA8c3Ryb25nPmJ1aWxkRW5zZW1ibEdlbmVMaW5rPC9zdHJvbmc+IHJldHVybnMgdGhlIEVuc2VtYmwgdXJsIHBvaW50aW5nIHRvIHRoZSBnZW5lIHN1bW1hcnkgb2YgdGhlIGdpdmVuIGdlbmVcbiAgICBAcGFyYW0ge1N0cmluZ30gZ2VuZSBUaGUgRW5zZW1ibCBnZW5lIGlkLiBTaG91bGQgYmUgYSB2YWxpZCBJRCBvZiB0aGUgZm9ybSBFTlNHWFhYWFhYWFhYXCJcbiAgICBAcmV0dXJucyB7U3RyaW5nfSBUaGUgRW5zZW1ibCBVUkwgZm9yIHRoZSBnaXZlbiBnZW5lXG4gICAgKi9cbiAgICB2YXIgYnVpbGRFbnNlbWJsR2VuZUxpbmsgPSBmdW5jdGlvbihlbnNJRCkge1xuICAgICAgICAvL1wiaHR0cDovL3d3dy5lbnNlbWJsLm9yZy9Ib21vX3NhcGllbnMvR2VuZS9TdW1tYXJ5P2c9RU5TRzAwMDAwMTM5NjE4XCJcbiAgICAgICAgdmFyIHVybCA9IFwiaHR0cDovL3d3dy5lbnNlbWJsLm9yZy9cIiArIGdCcm93c2VyLnNwZWNpZXMoKSArIFwiL0dlbmUvU3VtbWFyeT9nPVwiICsgZW5zSUQ7XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfTtcblxuICAgIHJldHVybiBnQnJvd3NlclRoZW1lO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gY3R0dl9nZW5vbWVfYnJvd3NlcjtcbiIsIlxudmFyIHRudF90b29sdGlwID0gcmVxdWlyZShcInRudC50b29sdGlwXCIpO1xudmFyIGFwaWpzID0gcmVxdWlyZShcInRudC5hcGlcIik7XG5cbnZhciB0b29sdGlwcyA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBjb25mID0ge1xuICAgICAgICBjdHR2UmVzdEFwaSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZW5zZW1ibFJlc3RBcGkgOiB1bmRlZmluZWQsXG4gICAgICAgIHByZWZpeCA6IHVuZGVmaW5lZCxcbiAgICAgICAgdmlldyA6IHVuZGVmaW5lZFxuICAgIH07XG5cbiAgICB2YXIgaWQgPSAxO1xuICAgIHZhciB0YXJnZXQ7XG5cbiAgICB2YXIgbSA9IHt9O1xuXG4gICAgdmFyIGFwaSA9IGFwaWpzKG0pXG4gICAgICAgIC5nZXRzZXQoY29uZik7XG5cbiAgICB2YXIgc25wX2RhdGEgPSBmdW5jdGlvbiAoZGF0YSwgZW5zZW1ibF9kYXRhKSB7XG4gICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgb2JqLmhlYWRlciA9IGRhdGEubmFtZTtcbiAgICAgICAgb2JqLnJvd3MgPSBbXTtcbiAgICAgICAgaWYgKGVuc2VtYmxfZGF0YSkge1xuICAgICAgICAgICAgb2JqLnJvd3MucHVzaCh7XG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJBbmNlc3RyYWwgYWxsZWxlXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiIDogZW5zZW1ibF9kYXRhLmFuY2VzdHJhbF9hbGxlbGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgb2JqLnJvd3MucHVzaCh7XG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJBbGxlbGUgc3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiIDogZW5zZW1ibF9kYXRhLm1hcHBpbmdzWzBdLmFsbGVsZV9zdHJpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgb2JqLnJvd3MucHVzaCh7XG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJNb3N0IHNldmVyZSBjb25zZXF1ZW5jZVwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIiA6IGVuc2VtYmxfZGF0YS5tb3N0X3NldmVyZV9jb25zZXF1ZW5jZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZW5zZW1ibF9kYXRhLk1BRikge1xuICAgICAgICAgICAgICAgIG9iai5yb3dzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIk1BRlwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCIgOiBlbnNlbWJsX2RhdGEuTUFGXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvYmoucm93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIkxvY2F0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJsaW5rXCIgOiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgIGNvbmYudmlldy5zdGFydCh7XG4gICAgICAgICAgICAgICAgICAgIGZyb20gOiBkLnBvcyAtIDUwLFxuICAgICAgICAgICAgICAgICAgICB0byAgIDogZC5wb3MgKyA1MFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb2JqIDogZGF0YSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA6IFwiSnVtcCB0byBzZXF1ZW5jZVwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG9iai5yb3dzLnB1c2goe1xuICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJ0YXJnZXRcIixcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IGRhdGEudGFyZ2V0LnN5bWJvbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuYXNzb2NpYXRpb25zICYmIGRhdGEuYXNzb2NpYXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgb2JqLnJvd3MucHVzaCh7XG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJBc3NvY2lhdGlvbnNcIixcbiAgICAgICAgICAgICAgICBcInZhbHVlXCIgOiBcIlwiXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGRhdGEuYXNzb2NpYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFzc29jaWF0aW9uID0gZGF0YS5hc3NvY2lhdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgb2JqLnJvd3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiPGEgaHJlZj1cIiArIGNvbmYucHJlZml4ICsgXCIvZXZpZGVuY2UvXCIgKyBkYXRhLnRhcmdldC5nZW5laWQgKyBcIi9cIiArIChhc3NvY2lhdGlvbi5lZm8uc3BsaXQoXCIvXCIpLnBvcCgpKSArIFwiPlwiICsgYXNzb2NpYXRpb24ubGFiZWwgKyBcIjwvYT5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiIDogYXNzb2NpYXRpb24ucG1pZHMubGVuZ3RoICsgKGFzc29jaWF0aW9uLnBtaWRzLmxlbmd0aCA9PT0gMSA/IFwiIGFydGljbGVcIiA6IFwiIGFydGljbGVzXCIpICsgXCIgIDxhIGhyZWY9J2h0dHA6Ly9ldXJvcGVwbWMub3JnL3NlYXJjaD9xdWVyeT1cIiArIGFzc29jaWF0aW9uLnBtaWRzLm1hcChmdW5jdGlvbiAoZCkge3JldHVybiBcIkVYVF9JRDpcIitkO30pLmpvaW4oXCIlMjBPUiUyMFwiKSArIFwiJyB0YXJnZXQ9X2JsYW5rIDxpIGNsYXNzPSdmYSBmYS1uZXdzcGFwZXItbyBmYS1sZyc+PC9pPjwvYT5cIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLnN0dWR5ICYmIGRhdGEuc3R1ZHkubGVuZ3RoKSB7XG4gICAgICAgICAgICBvYmoucm93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIkFzc29jaWF0aW9uc1wiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIiA6IFwiXCJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8ZGF0YS5zdHVkeS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG9iai5yb3dzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIjxhIGhyZWY9J1wiICsgY29uZi5wcmVmaXggKyBcIi9ldmlkZW5jZS9cIiArIGRhdGEudGFyZ2V0LmdlbmVpZCArIFwiL1wiKyAoZGF0YS5zdHVkeVtpXS5lZm8uc3BsaXQoXCIvXCIpLnBvcCgpKSArIFwiJz5cIiArIGRhdGEuc3R1ZHlbaV0uZWZvX2xhYmVsICsgJzwvYT4nLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCIgOiBwYXJzZUZsb2F0KGRhdGEuc3R1ZHlbaV0ucHZhbHVlKS50b1ByZWNpc2lvbigxKSArIFwiIDxhIHRhcmdldD1fYmxhbmsgaHJlZj0naHR0cDovL2V1cm9wZXBtYy5vcmcvYWJzdHJhY3QvbWVkL1wiICsgKGRhdGEuc3R1ZHlbaV0ucG1pZC5zcGxpdChcIi9cIikucG9wKCkpICsgXCInPjxpIGNsYXNzPSdmYSBmYS1uZXdzcGFwZXItbyBmYS1sZyc+PC9pPjwvYT5cIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iajtcblxuICAgIH07XG5cbiAgICAvLyBUb29sdGlwIG9uIEdXQVNcbiAgICBhcGkubWV0aG9kKCdzbnAnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB2YXIgdCA9IHRudC50b29sdGlwLnRhYmxlKClcbiAgICAgICAgICAgIC53aWR0aCgyNTApXG4gICAgICAgICAgICAuaWQoaWQpO1xuICAgICAgICB2YXIgZXZlbnQgPSBkMy5ldmVudDtcbiAgICAgICAgdmFyIGVsZW0gPSB0aGlzO1xuICAgICAgICB2YXIgc3Bpbm5lciA9IHRudC50b29sdGlwLnBsYWluKClcbiAgICAgICAgICAgIC5pZChpZCk7XG4gICAgICAgIHZhciB1cmwgPSBjb25mLmVuc2VtYmxSZXN0QXBpLnVybCgpXG4gICAgICAgICAgICAuZW5kcG9pbnQoXCIvdmFyaWF0aW9uLzpzcGVjaWVzXCIpXG4gICAgICAgICAgICAucGFyYW1ldGVycyh7XG4gICAgICAgICAgICAgICAgc3BlY2llczogXCJodW1hblwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gdmFyIHVybCA9IGNvbmYuZW5zZW1ibFJlc3RBcGkudXJsLnZhcmlhdGlvbih7XG4gICAgICAgIC8vICAgICBzcGVjaWVzIDogXCJodW1hblwiXG4gICAgICAgIC8vIH0pO1xuICAgICAgICBjb25mLmVuc2VtYmxSZXN0QXBpLmNhbGwgKHVybCwge1xuICAgICAgICAgICAgXCJpZHNcIiA6IFtkYXRhLm5hbWVdXG4gICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2ggKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5PIFZBUklBTlQgSU5GT1JNQVRJT04gRk9SIFRISVMgU05QXCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuIChmdW5jdGlvbiAocmVzcCkge1xuICAgICAgICAgICAgICAgIHZhciBvYmogPSBzbnBfZGF0YSAoZGF0YSwgcmVzcC5ib2R5W2RhdGEubmFtZV0pO1xuICAgICAgICAgICAgICAgIHQuY2FsbCAoZWxlbSwgb2JqLCBldmVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNwaW5uZXIuY2FsbCAoZWxlbSwge1xuICAgICAgICAgICAgICAgIGhlYWRlciA6IGRhdGEubmFtZSxcbiAgICAgICAgICAgICAgICBib2R5IDogXCI8aSBjbGFzcz0nZmEgZmEtc3Bpbm5lciBmYS0yeCBmYS1zcGluJz48L2k+XCJcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVG9vbHRpcCBvbiBnZW5lc1xuICAgIGFwaS5tZXRob2QoJ2dlbmUnLCBmdW5jdGlvbiAoZ2VuZSkge1xuXG4gICAgICAgIC8vIEdlbmUgdG9vbHRpcCBkYXRhXG4gICAgICAgIHZhciB0b29sdGlwX29iaiA9IGZ1bmN0aW9uIChlbnNlbWJsRGF0YSwgY3R0dkRhdGEsIHRyYW5zY3JpcHREYXRhKSB7XG5cbiAgICAgICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgICAgIG9iai5oZWFkZXIgPSAoZW5zZW1ibERhdGEuZGlzcGxheV9uYW1lIHx8IGVuc2VtYmxEYXRhLmV4dGVybmFsX25hbWUpICsgXCIgKFwiICsgZW5zZW1ibERhdGEuaWQgKyBcIilcIjtcbiAgICAgICAgICAgIG9iai5yb3dzID0gW107XG5cbiAgICAgICAgICAgIC8vIEFzc29jaWF0aW9ucyBhbmQgdGFyZ2V0IGxpbmtzIG1heWJlXG4gICAgICAgICAgICB2YXIgYXNzb2NpYXRpb25zVmFsdWU7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0VmFsdWU7XG4gICAgICAgICAgICBpZiAoY3R0dkRhdGEgJiYgY3R0dkRhdGEuZGF0YSAmJiBjdHR2RGF0YS5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBhc3NvY2lhdGlvbnNWYWx1ZSA9IFwiPGEgaHJlZj0nXCIgKyBjb25mLnByZWZpeCArIFwiL3RhcmdldC9cIiArIGVuc2VtYmxEYXRhLmlkICsgXCIvYXNzb2NpYXRpb25zJz5cIiArIChjdHR2RGF0YS5kYXRhLmxlbmd0aCkgKyBcIiBkaXNlYXNlIGFzc29jaWF0aW9uczwvYT4gXCI7XG4gICAgICAgICAgICAgICAgdGFyZ2V0VmFsdWUgPSBcIjxhIGhyZWY9J1wiICsgY29uZi5wcmVmaXggKyBcIi90YXJnZXQvXCIgKyBlbnNlbWJsRGF0YS5pZCArIFwiJz5WaWV3IENUVFYgcHJvZmlsZTwvYT5cIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb2JqLnJvd3MucHVzaCAoe1xuICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiR2VuZVwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIiA6IFwiXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgb2JqLnJvd3MucHVzaCgge1xuICAgICAgICAgICAgICAgIFwibGFiZWxcIiA6IFwiQmlvdHlwZVwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIiA6IGVuc2VtYmxEYXRhLmJpb3R5cGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgb2JqLnJvd3MucHVzaCh7XG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJMb2NhdGlvblwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIiA6IFwiPGEgdGFyZ2V0PSdfYmxhbmsnIGhyZWY9J2h0dHA6Ly93d3cuZW5zZW1ibC5vcmcvSG9tb19zYXBpZW5zL0xvY2F0aW9uL1ZpZXc/ZGI9Y29yZTtnPVwiICsgZW5zZW1ibERhdGEuaWQgKyBcIic+XCIgKyBlbnNlbWJsRGF0YS5zZXFfcmVnaW9uX25hbWUgKyBcIjpcIiArIGVuc2VtYmxEYXRhLnN0YXJ0ICsgXCItXCIgKyBlbnNlbWJsRGF0YS5lbmQgKyBcIjwvYT5cIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoYXNzb2NpYXRpb25zVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG9iai5yb3dzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIkFzc29jaWF0aW9uc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCIgOiBhc3NvY2lhdGlvbnNWYWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRhcmdldFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvYmoucm93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJDVFRWIFByb2ZpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiIDogdGFyZ2V0VmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9iai5yb3dzLnB1c2goIHtcbiAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIkRlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiIDogZW5zZW1ibERhdGEuZGVzY3JpcHRpb25cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodHJhbnNjcmlwdERhdGEpIHtcbiAgICAgICAgICAgICAgICBvYmoucm93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJUcmFuc2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIiA6IFwiXCJcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIG9iai5yb3dzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBcImxhYmVsXCIgOiBcIk5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiIDogdHJhbnNjcmlwdERhdGEuZGlzcGxheV9uYW1lXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBvYmoucm93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJJRFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCIgOiBcIjxhIHRhcmdldD0nX2JsYW5rJyBocmVmPSdodHRwOi8vd3d3LmVuc2VtYmwub3JnL0hvbW9fc2FwaWVucy9UcmFuc2NyaXB0L1N1bW1hcnk/ZGI9Y29yZTt0PVwiICsgdHJhbnNjcmlwdERhdGEuaWQgKyBcIic+XCIgKyB0cmFuc2NyaXB0RGF0YS5pZCArIFwiPC9hPlwiXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBvYmoucm93cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiIDogXCJiaW90eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIiA6IHRyYW5zY3JpcHREYXRhLmJpb3R5cGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIHZhciB0ID0gdG50X3Rvb2x0aXAudGFibGUoKVxuICAgICAgICAgICAgLmlkKGlkKTtcbiAgICAgICAgdmFyIGV2ZW50ID0gZDMuZXZlbnQ7XG4gICAgICAgIHZhciBlbGVtID0gdGhpcztcblxuICAgICAgICB2YXIgcyA9IHRudF90b29sdGlwLnBsYWluKClcbiAgICAgICAgICAgIC5pZChpZCk7XG5cbiAgICAgICAgdmFyIHVybCA9IGNvbmYuY3R0dlJlc3RBcGkudXJsLmFzc29jaWF0aW9ucyAoe1xuICAgICAgICAgICAgXCJ0YXJnZXRcIiA6IChnZW5lLmlzR2VuZSA/IGdlbmUuaWQgOiBnZW5lLmdlbmUuaWQpLFxuICAgICAgICAgICAgXCJkYXRhc3RydWN0dXJlXCIgOiBcImZsYXRcIixcbiAgICAgICAgICAgIFwiZmlsdGVyYnlzY29yZXZhbHVlX21pblwiOiAwLFxuICAgICAgICAgICAgXCJzdHJpbmdlbmN5XCI6IDFcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbmYuY3R0dlJlc3RBcGkuY2FsbCh1cmwpXG4gICAgICAgICAgICAuY2F0Y2ggKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IHRvb2x0aXBfb2JqKGdlbmUpO1xuICAgICAgICAgICAgICAgIHQuY2FsbChlbGVtLCBvYmosIGV2ZW50KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xuICAgICAgICAgICAgICAgIHZhciBvYmo7XG4gICAgICAgICAgICAgICAgaWYgKGdlbmUuaXNHZW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IHRvb2x0aXBfb2JqIChnZW5lLCByZXNwLmJvZHkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IHRvb2x0aXBfb2JqIChnZW5lLmdlbmUsIHJlc3AuYm9keSwgZ2VuZSk7IC8vIGdlbmUgaXMgYSB0cmFuc2NyaXB0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHZhciBvYmogPSB0b29sdGlwX29iaiAoZ2VuZSwgcmVzcC5ib2R5KTtcbiAgICAgICAgICAgICAgICB0LmNhbGwoZWxlbSwgb2JqLCBldmVudCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBzLmNhbGwoZWxlbSwge1xuICAgICAgICAgICAgaGVhZGVyIDogKGdlbmUuaXNHZW5lPyBnZW5lLmV4dGVybmFsX25hbWUgKyBcIiAoXCIgKyBnZW5lLmdlbmVfaWQgKyBcIilcIiA6IGdlbmUuZ2VuZS5kaXNwbGF5X25hbWUgKyBcIihcIiArIGdlbmUuZ2VuZS5pZCArIFwiKVwiKSxcbiAgICAgICAgICAgIGJvZHkgOiBcIjxpIGNsYXNzPSdmYSBmYS1zcGlubmVyIGZhLTJ4IGZhLXNwaW4nPjwvaT5cIlxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG5cbiAgICAvLyBtLmVuc2VtYmxSZXN0QXBpID0gZnVuY3Rpb24gKGFwaSkge1xuICAgIC8vICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAvLyAgICAgICAgIHJldHVybiBlbnNlbWJsUmVzdEFwaTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBlbnNlbWJsUmVzdEFwaSA9IGFwaTtcbiAgICAvLyAgICAgcmV0dXJuIHRoaXM7XG4gICAgLy8gfTtcbiAgICAvL1xuICAgIC8vIG0uY3R0dlJlc3RBcGkgPSBmdW5jdGlvbiAoYXBpKSB7XG4gICAgLy8gICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIC8vICAgICAgICAgcmV0dXJuIGN0dHZSZXN0QXBpO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGN0dHZSZXN0QXBpID0gYXBpO1xuICAgIC8vICAgICByZXR1cm4gdGhpcztcbiAgICAvLyB9O1xuICAgIC8vXG4gICAgLy8gbS52aWV3ID0gZnVuY3Rpb24gKHYpIHtcbiAgICAvLyAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgLy8gICAgICAgICByZXR1cm4gdmlldztcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICB2aWV3ID0gdjtcbiAgICAvLyAgICAgcmV0dXJuIHRoaXM7XG4gICAgLy8gfTtcblxuICAgIHJldHVybiBtO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gdG9vbHRpcHM7XG4iXX0=
