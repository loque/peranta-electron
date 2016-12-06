(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("peranta/server"), require("peranta/router"));
	else if(typeof define === 'function' && define.amd)
		define(["peranta/server", "peranta/router"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("peranta/server"), require("peranta/router")) : factory(root["peranta/server"], root["peranta/router"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Server = __webpack_require__(2);
	var Router = __webpack_require__(3);
	var Scheduler = __webpack_require__(4);

	function Transport(app, ipcMain) {
	    var _this = this;

	    if (app === undefined) throw new TypeError('Transport.constructor() expects to receive Electron\'s app as the first argument');
	    if (typeof app.on !== 'function') throw new TypeError('Transport.constructor() expects Electron\'s app to implement .on()');

	    if (ipcMain === undefined) throw new TypeError('Transport.constructor() expects to receive Electron\'s ipcMain as the second argument');
	    if (typeof ipcMain.on !== 'function') throw new TypeError('Transport.constructor() expects Electron\'s ipcMain to implement .on()');

	    this.app = app;
	    this.ipcMain = ipcMain;

	    this.broadcastScheduler = new Scheduler();
	    this.webContents = [];

	    this.app.on('web-contents-created', function (event, webContents) {
	        webContents.on('did-finish-load', function () {
	            _this.webContents.push(webContents);
	            _this.broadcastScheduler.start();
	        });
	    });
	}

	Transport.prototype.on = function on(channel, callback) {
	    this.ipcMain.on(channel, function (event, req) {
	        return callback(event, req);
	    });
	};

	Transport.prototype.broadcast = function broadcast(channel, res) {
	    var _this2 = this;

	    this.broadcastScheduler.push(function () {
	        _this2.webContents.forEach(function (webcontent) {
	            webcontent.send(channel, res);
	        });

	        return Promise.resolve();
	    });
	};

	function create(app, ipcMain) {
	    return new Server(new Transport(app, ipcMain), new Router());
	}

	module.exports = { create: create };

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var PUSH = 'push';
	var UNSHIFT = 'unshift';

	var defaultRetryConfig = {
	    limit: 0,
	    attempts: 0
	};

	/*

	    config = {
	        autostart: undefined,
	        sync: undefined,
	    }

	*/
	function Scheduler() {
	    var _this = this;

	    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    var stack = [];

	    var shouldRun = false;
	    var isRunning = false;

	    this.addRetryAction = function (method, action, config) {
	        action.__method = method;

	        action.__retry = Object.assign({
	            method: method
	        }, defaultRetryConfig, config);

	        return _this.addAction(action);
	    };

	    this.addAction = function (action) {
	        var job = { action: action };

	        var jobPromise = new Promise(function (resolve, reject) {
	            job.__resolve = resolve;
	            job.__reject = reject;
	        });

	        stack[action.__method](job);

	        if (shouldRun && !isRunning) _this.next();

	        return jobPromise;
	    };

	    this.push = function (action) {
	        action.__method = PUSH;

	        return _this.addAction(action);
	    };

	    this.unshift = function (action) {
	        action.__method = UNSHIFT;

	        return _this.addAction(action);
	    };

	    this.pushRetry = function (action, config) {
	        return _this.addRetryAction(PUSH, action, config);
	    };

	    this.unshiftRetry = function (action, config) {
	        return _this.addRetryAction(UNSHIFT, action, config);
	    };

	    this.start = function () {
	        if (shouldRun) return; // avoid running next when already running

	        shouldRun = true;
	        _this.next();
	    };

	    this.pause = function () {
	        shouldRun = false;
	    };

	    this.next = function () {
	        if (!shouldRun) return isRunning = false;

	        var job = stack.shift();

	        if (!job) return isRunning = false;

	        isRunning = true;

	        var executionPromise = _this.execute(job);

	        if (!config.sync) {
	            setTimeout(_this.next.bind(_this), 0);
	        } else {
	            executionPromise.then(function (response) {
	                _this.next();
	                return response;
	            });
	        }
	    };

	    this.execute = function (job) {
	        if (job.action.__retry) {
	            job.action.__retry.attempts++;

	            return job.action().then(job.__resolve).catch(function (error) {
	                if (job.action.__retry.limit > 0 && job.action.__retry.attempts == job.action.__retry.limit) {
	                    job.__reject('retry limit reached: ' + job.action.__retry.limit);
	                    return;
	                }

	                // re-schedule job
	                _this[job.action.__retry.method](job.action).then(job.__resolve).catch(job.__reject);
	            });
	        }

	        return job.action().then(job.__resolve).catch(job.__reject);
	    };

	    if (config.autostart) this.start();

	    return {
	        push: this.push,
	        unshift: this.unshift,
	        pushRetry: this.pushRetry,
	        unshiftRetry: this.unshiftRetry,
	        start: this.start,
	        pause: this.pause
	    };
	}

	module.exports = Scheduler;

/***/ }
/******/ ])
});
;