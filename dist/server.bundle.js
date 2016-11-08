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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var GB = __webpack_require__(1);
	var hrstart = process.hrtime();
	var hrend = process.hrtime(hrstart);
	function CompareSplice(g, a) {
	    var len = a.length;
	    var i;
	    var o = {};
	    var hrstart = process.hrtime();
	    for (i = 0; i < len; i++) {
	        a.splice(i, 1);
	        a.splice(i, 0, o);
	    }
	    var hrend = process.hrtime(hrstart);
	    console.info("Length: %d Array execution time (hr): %ds %dms", len, hrend[0], hrend[1] / 1000000);
	    hrstart = process.hrtime();
	    for (i = 0; i < len; i++) {
	        g.deleteAt(i);
	        g.insertAt(i, o);
	    }
	    hrend = process.hrtime(hrstart);
	    console.info("Length: %d Gap execution time (hr): %ds %dms", len, hrend[0], hrend[1] / 1000000);
	}
	function FillForCompare(len, g, a) {
	    g.empty();
	    a.splice(0, a.length);
	    var o = {};
	    for (var i = 0; i < len; i++) {
	        g.insertAt(i, o);
	        a[i] = o;
	    }
	}
	var g = new GB.GapBuffer();
	var a = [];
	var tests = [100, 1000, 10000, 100000];
	for (var j = 0; j < tests.length; j++) {
	    FillForCompare(tests[j], g, a);
	    CompareSplice(g, a);
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var GapBuffer = (function () {
	    // constructor
	    function GapBuffer(mx) {
	        if (mx === void 0) { mx = 10; }
	        this._a = new Array(mx);
	        this._len = 0;
	        this._max = mx;
	        this._gap = 0;
	    }
	    Object.defineProperty(GapBuffer.prototype, "length", {
	        get: function () {
	            return this._len;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(GapBuffer.prototype, "max", {
	        get: function () {
	            return this._max;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    GapBuffer.prototype.getAt = function (i) {
	        if (i < 0 || i >= this._len)
	            throw "GapBuffer.getAt: illegal index: " + i;
	        return (i < this._gap) ? this._a[i] : this._a[this._max - (this._len - i)];
	    };
	    GapBuffer.prototype.setAt = function (i, o) {
	        if (i < 0 || i >= this._len)
	            throw "GapBuffer.setAt: illegal index: " + i;
	        if (i < this._gap)
	            this._a[i] = o;
	        else
	            this._a[this._max - (this._len - i)] = 0;
	    };
	    GapBuffer.prototype.setArrayAt = function (i, a) {
	        if (a === undefined || a.length == 0)
	            return;
	        if (i < 0 || i + a.length >= this._len)
	            throw "GapBuffer.setArrayAt: illegal operation: " + i + ", " + a.length;
	        var j = 0;
	        for (; i < this._gap && j < a.length; i++, j++)
	            this._a[i] = a[j];
	        for (i = this.gapEnd(); j < a.length; i++, j++)
	            this._a[i] = a[j];
	    };
	    GapBuffer.prototype.insertAt = function (i, o) {
	        this.makeMoreRoom(1);
	        this.setGap(i);
	        this._a[this._gap++] = o;
	        this._len++;
	    };
	    GapBuffer.prototype.insertArrayAt = function (i, a) {
	        if (a === undefined || a.length == 0)
	            return;
	        this.makeMoreRoom(a.length);
	        this.setGap(i);
	        for (var j = 0; j < a.length; j++)
	            this._a[i + j] = a[j];
	        this._gap += a.length;
	        this._len += a.length;
	    };
	    GapBuffer.prototype.push = function (o) {
	        this.insertAt(this._len, o);
	    };
	    GapBuffer.prototype.deleteAt = function (i, n) {
	        if (n === void 0) { n = 1; }
	        if (i < 0 || i + n > this._len)
	            throw "GapBuffer.deleteAt: illegal operation: " + i + ", " + n;
	        this.setGap(i);
	        this._len -= n;
	    };
	    GapBuffer.prototype.empty = function () {
	        this._gap = 0;
	        this._len = 0;
	    };
	    GapBuffer.prototype.splice = function (i, nDel) {
	        var rest = [];
	        for (var _i = 2; _i < arguments.length; _i++) {
	            rest[_i - 2] = arguments[_i];
	        }
	        var aRet = [];
	        if (i > this._len)
	            i = this._len;
	        else if (i < 0)
	            i = this._len + i;
	        if (nDel === undefined && rest.length == 0)
	            nDel = this._len - i;
	        for (var j = 0; j < nDel; j++)
	            aRet.push(this.getAt(i + j));
	        this.deleteAt(i, nDel);
	        for (var j = 0; j < rest.length; j++)
	            this.insertAt(i + j, rest[j]);
	        return aRet;
	    };
	    GapBuffer.prototype.slice = function (b, e) {
	        if (b === undefined)
	            b = 0;
	        else if (b < 0)
	            b = this._len + b;
	        if (e === undefined)
	            e = this._len;
	        else if (e < 0)
	            e = this._len + e;
	        var g = new GapBuffer(e - b);
	        for (; b < e; b++)
	            g.push(this.getAt(b));
	        return g;
	    };
	    GapBuffer.prototype.shrink = function () {
	        this.setGap(this._len);
	        this._a = this._a.slice(0, this._len);
	        this._max = this._len;
	    };
	    GapBuffer.prototype.forEach = function (f, thisArg) {
	        // f(thisArg, getAt(i), i, this);
	    };
	    // helpers
	    GapBuffer.prototype.makeMoreRoom = function (incr) {
	        this.makeTotalRoom(this._len + incr);
	    };
	    GapBuffer.prototype.makeTotalRoom = function (total) {
	        if (total < 0)
	            throw "GapBuffer.makeTotalRoom: illegal size request: " + total;
	        if (total <= this._max)
	            return;
	        if (total < this._max * 2 && (total - this._max) < 64000)
	            total = this._max * 2;
	        var newA = new Array(total);
	        for (var i = 0; i < this._gap; i++)
	            newA[i] = this._a[i];
	        var k = this._gap;
	        for (var j = this.gapEnd(); j < this._max; j++)
	            newA[k++] = this._a[j++];
	        this._a = newA;
	        this._max = total;
	        this._gap = this._len;
	    };
	    GapBuffer.prototype.setGap = function (i) {
	        if (i > this._gap) {
	            var b = this._gap;
	            var e = this.gapEnd();
	            for (; b < i; b++, e++)
	                this._a[b] = this._a[e];
	        }
	        else {
	            var b = this._gap - 1;
	            var e = this.gapEnd() - 1;
	            for (; b >= i; b--, e--)
	                this._a[e] = this._a[b];
	        }
	        this._gap = i;
	    };
	    GapBuffer.prototype.gapEnd = function () {
	        return this._max - (this._len - this._gap);
	    };
	    return GapBuffer;
	}());
	exports.GapBuffer = GapBuffer;
	;


/***/ }
/******/ ]);
//# sourceMappingURL=server.bundle.js.map