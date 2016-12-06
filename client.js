(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("peranta/client"));
	else if(typeof define === 'function' && define.amd)
		define(["peranta/client"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("peranta/client")) : factory(root["peranta/client"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
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

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var Client = __webpack_require__(1);

	function Transport(ipcRenderer) {
	    if (ipcRenderer === undefined || (typeof ipcRenderer === 'undefined' ? 'undefined' : _typeof(ipcRenderer)) !== 'object') throw new TypeError('Transport.constructor() expects to receive ipcRenderer');

	    if (typeof ipcRenderer.on !== 'function') throw new TypeError('Transport.constructor() expects ipcRenderer.on() to be a function');

	    if (typeof ipcRenderer.send !== 'function') throw new TypeError('Transport.constructor() expects ipcRenderer.send() to be a function');

	    this.ipcRenderer = ipcRenderer;
	}

	Transport.prototype.on = function on(channel, callback) {
	    this.ipcRenderer.on(channel, callback);
	};

	Transport.prototype.emit = function emit(channel, req) {
	    this.ipcRenderer.send(channel, req);
	};

	function create(ipcRenderer) {
	    return new Client(new Transport(ipcRenderer));
	}

	module.exports = { create: create };

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }
/******/ ])
});
;